// ── Section 3: Dashboard ─────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════
//  DATA AGGREGATION
// ═══════════════════════════════════════════════════════════════════════════

const visitCounts  = {};   // planet  → total visit count (all chars)
const charCounts   = {};   // planet  → Set of character names
const regionCounts = {};   // region  → total visit count
let   totalVisits  = 0;

Object.entries(JOURNEYS).forEach(([name, journey]) => {
  journey.forEach(b => {
    visitCounts[b.planet] = (visitCounts[b.planet] || 0) + 1;
    if (!charCounts[b.planet]) charCounts[b.planet] = new Set();
    charCounts[b.planet].add(name);
    totalVisits++;
    const pl = planetIndex[b.planet];
    if (pl) regionCounts[pl.region] = (regionCounts[pl.region] || 0) + 1;
  });
});

const sorted = Object.entries(visitCounts).sort((a, b) => b[1] - a[1]);

// Per-character aggregates
const charTravelData = Object.entries(JOURNEYS).map(([char, beats]) => ({
  char,
  total:  beats.length,
  unique: [...new Set(beats.map(b => b.planet))],     // ordered by first visit
})).sort((a, b) => b.total - a.total);

// ═══════════════════════════════════════════════════════════════════════════
//  PLANET COLOR PALETTE  (golden-angle hue for max perceptual distance)
// ═══════════════════════════════════════════════════════════════════════════

const DASH_PLANET_COLORS = {};
PLANETS.forEach((p, i) => {
  const hue = (i * 137.508) % 360;
  DASH_PLANET_COLORS[p.name] = d3.hsl(hue, 0.68, 0.60).formatHex();
});

// ═══════════════════════════════════════════════════════════════════════════
//  ROW 1 — KPI HEADERS
// ═══════════════════════════════════════════════════════════════════════════

// Most Visited World
const [mvpPlanet, mvpCount] = sorted[0];
const mvpChars = charCounts[mvpPlanet]?.size || 0;
document.getElementById('kpi-mvw-name').textContent = mvpPlanet.toUpperCase();
document.getElementById('kpi-mvw-sub').textContent  =
  `${mvpCount} VISITS  ·  ${mvpChars} CHARACTERS`;

// Most Travelled Character
const topChar = charTravelData[0];
document.getElementById('kpi-mtc-name').textContent = topChar.char.toUpperCase();
document.getElementById('kpi-mtc-sub').textContent  =
  `${topChar.total} JOURNEYS  ·  ${topChar.unique.length} WORLDS`;

// ═══════════════════════════════════════════════════════════════════════════
//  CHART 1 — BUBBLE MAP (Most Visited World)
// ═══════════════════════════════════════════════════════════════════════════

(function buildBubbleChart() {
  // Square viewBox — better matches the ~1:1 card aspect ratio when tall
  const BW = 700, BH = 700, BP = 40;
  const svg = d3.select('#bubble-svg');

  const defs = svg.append('defs');

  // ── Galaxy core glow ──────────────────────────────────────────────────────
  const grad = defs.append('radialGradient')
    .attr('id', 'bubble-bg-grad')
    .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
  grad.append('stop').attr('offset', '0%')
    .attr('stop-color', '#1a3060').attr('stop-opacity', '0.40');
  grad.append('stop').attr('offset', '100%')
    .attr('stop-color', 'transparent').attr('stop-opacity', '0');
  svg.append('ellipse')
    .attr('cx', BW * 0.5).attr('cy', BH * 0.5)
    .attr('rx', BW * 0.5).attr('ry', BH * 0.5)
    .attr('fill', 'url(#bubble-bg-grad)');

  // ── Glow filter ───────────────────────────────────────────────────────────
  const glowFilter = defs.append('filter')
    .attr('id', 'bubble-glow')
    .attr('x', '-50%').attr('y', '-50%')
    .attr('width', '200%').attr('height', '200%');
  glowFilter.append('feGaussianBlur')
    .attr('in', 'SourceGraphic').attr('stdDeviation', '3').attr('result', 'blur');
  const feMerge = glowFilter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'blur');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  // ── Compute tight bounding box, scale/centre to fill the square viewBox ───
  const allPts  = PLANETS.map(p => pxPy(p, BW, BH, BP));
  const allXs   = allPts.map(d => d[0]);
  const allYs   = allPts.map(d => d[1]);
  const bMinX   = d3.min(allXs), bMaxX = d3.max(allXs);
  const bMinY   = d3.min(allYs), bMaxY = d3.max(allYs);
  const bCx     = (bMinX + bMaxX) / 2;
  const bCy     = (bMinY + bMaxY) / 2;
  const bW      = bMaxX - bMinX;
  const bH      = bMaxY - bMinY;

  // Tight margin — smaller since the canvas is now square and nearly fills the card
  const margin  = 55;
  const scaleF  = Math.min((BW - margin * 2) / bW, (BH - margin * 2) / bH) * 0.96;
  const tx      = BW / 2 - bCx * scaleF;
  const ty      = BH / 2 - bCy * scaleF;

  // ── All planets drawn into a zoom group ───────────────────────────────────
  const gZoom = svg.append('g')
    .attr('transform', `translate(${tx},${ty}) scale(${scaleF})`);

  // ── Scales ────────────────────────────────────────────────────────────────
  const maxV    = sorted[0][1];
  const rScale  = d3.scaleSqrt().domain([0, maxV]).range([0, 38]);
  const colorScale = d3.scaleSequential()
    .domain([0, maxV])
    .interpolator(d3.interpolateRgbBasis(['#0c1e40', '#1466c4', '#00d4ff', '#f5c842']));

  // On mobile, only draw bubbles for the top-5 visited planets
  const MOBILE = window.innerWidth <= 768;
  const top5NamesVisit = new Set(sorted.slice(0, 10).map(([n]) => n));

  // Draw low-visit planets first so high-visit render on top
  const drawOrder = [...PLANETS].sort((a, b) =>
    (visitCounts[a.name] || 0) - (visitCounts[b.name] || 0)
  );

  drawOrder.forEach(p => {
    const visits = visitCounts[p.name] || 0;
    const [px, py] = pxPy(p, BW, BH, BP);
    const r   = rScale(visits);
    const col = colorScale(visits);

    if (visits === 0 || (MOBILE && !top5NamesVisit.has(p.name))) {
      gZoom.append('circle')
        .attr('cx', px).attr('cy', py).attr('r', 2.5)
        .attr('fill', '#1a2a4a').attr('opacity', 0.4);
      return;
    }

    const g = gZoom.append('g').attr('transform', `translate(${px},${py})`);

    // Outer pulse ring
    g.append('circle').attr('r', r + 9)
      .attr('fill', 'none').attr('stroke', col)
      .attr('stroke-width', 0.8).attr('opacity', 0.18);

    // Mid ring
    g.append('circle').attr('r', r + 4)
      .attr('fill', 'none').attr('stroke', col)
      .attr('stroke-width', 0.5).attr('opacity', 0.10);

    // Main bubble — glow on top 5
    const isTop5 = sorted.slice(0, 5).some(([n]) => n === p.name);
    g.append('circle').attr('r', r)
      .attr('fill', col).attr('fill-opacity', 0.22)
      .attr('stroke', col)
      .attr('stroke-width', visits >= 15 ? 2.5 : 1.8)
      .attr('opacity', 0.9)
      .attr('filter', isTop5 ? 'url(#bubble-glow)' : null);

    // Visit count inside bubble (doubled on mobile to stay readable)
    const fontSize = r >= 18 ? 13 : r >= 12 ? 11 : 9;
    const renderFontSize = MOBILE ? fontSize * 2 : fontSize;
    g.append('text')
      .attr('text-anchor', 'middle').attr('dy', renderFontSize * 0.38)
      .attr('font-family', 'Orbitron, sans-serif')
      .attr('font-size', `${renderFontSize}px`).attr('font-weight', '900')
      .attr('fill', visits >= 10 ? '#f5c842' : '#00d4ff')
      .attr('pointer-events', 'none').text(visits);

    // Planet name above bubble
    const nameFontSize = MOBILE ? 20 : (visits >= 12 ? 10 : 9);
    g.append('text')
      .attr('text-anchor', 'middle').attr('y', -(r + 7))
      .attr('font-family', 'Share Tech Mono, monospace')
      .attr('font-size', `${nameFontSize}px`)
      .attr('fill', visits >= 10 ? '#c8d8f0' : '#7ab8ff')
      .attr('opacity', visits >= 6 ? 0.95 : 0.75)
      .attr('pointer-events', 'none').text(p.name);

    // Transparent hit area — always at least 16 px radius so tiny bubbles are easy to hover
    const hitR = Math.max(r + 12, 16);
    g.append('circle').attr('r', hitR)
      .attr('fill', 'transparent')
      .on('mouseover', function(evt) {
        const charList = [...(charCounts[p.name] || [])].join(', ') || '—';
        const geo      = (p.geography || '').slice(0, 170);
        dashTipShow(evt, `
          <div class="tt-planet">${p.name.toUpperCase()}</div>
          <div class="tt-region">${p.region.toUpperCase()}</div>
          <div class="tt-divider"></div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1.5px;color:#8099b8;margin-bottom:3px">TOTAL VISITS</div>
          <div style="font-family:'Orbitron',sans-serif;font-size:22px;font-weight:900;color:#f5c842;line-height:1;margin-bottom:10px">${visits}</div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1.5px;color:#8099b8;margin-bottom:3px">CHARACTERS</div>
          <div style="font-size:12px;color:#c8d8f0;line-height:1.5;margin-bottom:8px">${charList}</div>
          <div style="font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1.5px;color:#8099b8;margin-bottom:3px">GEOGRAPHY</div>
          <div style="font-size:12px;color:#8099b8;line-height:1.5">${geo}${(p.geography || '').length > 170 ? '…' : ''}</div>`);
      })
      .on('mousemove', dashTipMove)
      .on('mouseout',  dashTipHide);
  });

})();

// ═══════════════════════════════════════════════════════════════════════════
//  CHART 2 — CHARACTER PLANET SQUARES (Most Travelled Character)
// ═══════════════════════════════════════════════════════════════════════════

(function buildCharTravelChart() {
  const MOBILE  = window.innerWidth <= 768;
  const CW = 580, CH = 560;
  const CP = { t: 10, r: 10, b: 10, l: MOBILE ? 165 : 104 };
  const innerW  = CW - CP.l - CP.r;          // 405 mobile / 466 desktop
  const innerH  = CH - CP.t - CP.b;          // 540 px

  // Sort by unique count descending; top 5 only on mobile
  const renderData = [...charTravelData]
    .sort((a, b) => b.unique.length - a.unique.length)
    .slice(0, MOBILE ? 10 : Infinity);

  const nChars  = renderData.length;
  const bw      = innerH / nChars;           // ~38.6 desktop / ~108 mobile
  // Size squares to fit the max unique count (16) within innerW
  const maxUniq = renderData[0].unique.length;   // 16
  const sqStep  = Math.floor(innerW / maxUniq);  // 29 px
  const sqSize  = sqStep - 2;                    // 27 px
  const sqVOff  = Math.round((bw - sqSize) / 2); // vertical centering

  // R2-D2 (top by unique) → gold; everyone else → blue
  const TOP_CHAR = renderData[0].char;   // "R2-D2"
  const GOLD     = '#f5c842';
  const BLUE     = '#4a9eff';

  const svg = d3.select('#char-travel-svg');

  if (MOBILE) {
    // ── Mobile: proportional horizontal bar chart ────────────────────────
    renderData.forEach((d, i) => {
      const rowY     = CP.t + i * bw;
      const rowColor = d.char === TOP_CHAR ? GOLD : BLUE;
      const barWidth = Math.round((d.unique.length / maxUniq) * innerW);
      const barH     = Math.round(bw * 0.44);
      const barY     = rowY + Math.round((bw - barH) / 2);

      const rg = svg.append('g').attr('class', 'char-row');

      // Track (full-width background)
      rg.append('rect')
        .attr('x', CP.l).attr('y', barY)
        .attr('width', innerW).attr('height', barH)
        .attr('fill', '#0a1228').attr('rx', 3).attr('opacity', 0.45);

      // Bar fill
      rg.append('rect')
        .attr('x', CP.l).attr('y', barY)
        .attr('width', barWidth).attr('height', barH)
        .attr('fill', rowColor)
        .attr('fill-opacity', d.char === TOP_CHAR ? 0.78 : 0.42)
        .attr('rx', 3);

      // Unique count — inside bar, right-aligned
      rg.append('text')
        .attr('x', CP.l + barWidth - 8)
        .attr('y', barY + barH / 2 + 8)
        .attr('text-anchor', 'end')
        .attr('font-family', 'Share Tech Mono, monospace')
        .attr('font-size', '22px')
        .attr('fill', d.char === TOP_CHAR ? '#1a1200' : '#fff')
        .attr('opacity', 0.9)
        .text(d.unique.length);

      // Character label — left of bar
      rg.append('text')
        .attr('x', CP.l - 8)
        .attr('y', rowY + bw / 2 + 10)
        .attr('text-anchor', 'end')
        .attr('font-family', 'Share Tech Mono, monospace')
        .attr('font-size', '28px')
        .attr('fill', rowColor)
        .text(d.char);
    });

  } else {
    // ── Desktop: planet squares ──────────────────────────────────────────
    renderData.forEach((d, i) => {
      const rowY     = CP.t + i * bw;
      const rowColor = d.char === TOP_CHAR ? GOLD : BLUE;
      const uniqueSorted = [...d.unique].sort();   // A → Z planet order

      const rg = svg.append('g').attr('class', 'char-row');

      // ── Planet squares ────────────────────────────────────────────────
      uniqueSorted.forEach((planet, pi) => {
        const pl = planetIndex[planet];
        rg.append('rect')
          .attr('x', CP.l + pi * sqStep + 1)
          .attr('y', rowY + sqVOff + 1)
          .attr('width',  sqSize - 2)
          .attr('height', sqSize - 2)
          .attr('fill',   rowColor)
          .attr('opacity', d.char === TOP_CHAR ? 0.82 : 0.50)
          .attr('rx', 2)
          .on('mouseover', function(evt) {
            dashTipShow(evt, `
              <div class="tt-planet">${planet.toUpperCase()}</div>
              <div class="tt-region">${(pl?.region || '').toUpperCase()}</div>
              <div class="tt-divider"></div>
              <div style="font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1.5px;color:#8099b8;margin-bottom:3px">CHARACTER</div>
              <div style="font-family:'Orbitron',sans-serif;font-size:20px;font-weight:900;color:${rowColor};line-height:1;margin-bottom:8px">${d.char.toUpperCase()}</div>
              <div style="font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1.5px;color:#8099b8;margin-bottom:3px">GEOGRAPHY</div>
              <div style="font-size:12px;color:#8099b8;line-height:1.5">${(pl?.geography || '').slice(0, 150)}${(pl?.geography || '').length > 150 ? '…' : ''}</div>`);
          })
          .on('mousemove', dashTipMove)
          .on('mouseout',  dashTipHide);
      });

      // ── Unique count right of last square ─────────────────────────────
      rg.append('text')
        .attr('x', CP.l + uniqueSorted.length * sqStep + 6)
        .attr('y', rowY + bw / 2 + 4)
        .attr('font-family', 'Share Tech Mono, monospace')
        .attr('font-size', '11px')
        .attr('fill', rowColor)
        .attr('opacity', 0.65)
        .text(uniqueSorted.length);

      // ── Character label ───────────────────────────────────────────────
      rg.append('text')
        .attr('x', CP.l - 8)
        .attr('y', rowY + bw / 2 + 4)
        .attr('text-anchor', 'end')
        .attr('font-family', 'Share Tech Mono, monospace')
        .attr('font-size', '11px')
        .attr('fill', rowColor)
        .text(d.char);
    });
  }

})();

// ═══════════════════════════════════════════════════════════════════════════
//  ROW 2 — SHARED TOOLTIP HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function dashTipShow(evt, html) {
  const tip = document.getElementById('tooltip');
  tip.innerHTML = html;
  tip.style.opacity = '1';
  tip.removeAttribute('aria-hidden');
  dashTipMove(evt);
}
function dashTipMove(evt) {
  const tip = document.getElementById('tooltip');
  const tw  = tip.offsetWidth  || 320;
  const th  = tip.offsetHeight || 160;
  const vw  = window.innerWidth;
  const vh  = window.innerHeight;
  let lx    = evt.clientX + 18;
  let ly    = evt.clientY - 44;
  if (lx + tw > vw - 8) lx = evt.clientX - tw - 18;
  if (ly + th > vh - 8) ly = vh - th - 8;
  if (ly < 8) ly = 8;
  tip.style.left = lx + 'px';
  tip.style.top  = ly + 'px';
}
function dashTipHide() {
  const tip = document.getElementById('tooltip');
  tip.style.opacity = '0';
  tip.setAttribute('aria-hidden', 'true');
}

// ═══════════════════════════════════════════════════════════════════════════
//  ROW 2 — DATA
// ═══════════════════════════════════════════════════════════════════════════

// Planet population lookup (canonical sentient pop from Wookieepedia)
const PLANET_POP = {
  "Coruscant":   1e12,
  "Geonosis":    1e11,
  "Naboo":       4.5e9,
  "Alderaan":    2e9,
  "Kamino":      1e9,
  "Utapau":      95e6,
  "Kashyyyk":    45e6,
  "Endor":       3e7,
  "Cantonica":   8e6,
  "Bespin":      5.9e6,
  "Pasaana":     2e6,
  "Polis Massa": 3e5,
  "Tatooine":    2e5,
  "Kijimi":      8e4,
  "Takodana":    5e4,
  "Jakku":       2.5e4,
  "Mustafar":    2e4,
  "Ahch-To":     50,
  "Kef Bir":     40,
};

// ≥1T → 2dp T  |  ≥1B → 2dp B  |  ≥1M → 2dp M  |  ≥100K → 2dp M  |  <100K → full with commas
function fmtPop(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9)  return (n / 1e9).toFixed(2)  + 'B';
  if (n >= 1e6)  return (n / 1e6).toFixed(2)  + 'M';
  if (n >= 1e5)  return (n / 1e6).toFixed(2)  + 'M';   // 100 K–999 K → "0.30M"
  return n >= 1000 ? n.toLocaleString() : String(n);
}
// Integer variant (no decimals) for mobile bubble labels
function fmtPopInt(n) {
  if (n >= 1e12) return Math.round(n / 1e12) + 'T';
  if (n >= 1e9)  return Math.round(n / 1e9)  + 'B';
  if (n >= 1e6)  return Math.round(n / 1e6)  + 'M';
  if (n >= 1e5)  return Math.round(n / 1e6)  + 'M';
  return n >= 1000 ? n.toLocaleString() : String(n);
}

function fmtLY(n) {
  if (n >= 1e6) return parseFloat((n / 1e6).toFixed(1)) + 'M';
  if (n >= 1e3) return parseFloat((n / 1e3).toFixed(1)) + 'K';
  return Math.round(n).toString();
}
// Integer variant (no decimals) for mobile labels
function fmtLYInt(n) {
  if (n >= 1e6) return Math.round(n / 1e6) + 'M';
  if (n >= 1e3) return Math.round(n / 1e3) + 'K';
  return Math.round(n).toString();
}

// Character travel-distance aggregates — stops include planet name for tooltips
const charDistData = Object.entries(JOURNEYS).map(([char, beats]) => {
  const ps = beats
    .map(b => ({ name: b.planet, p: planetIndex[b.planet] }))
    .filter(d => d.p);
  let cum = 0;
  const stops = ps.length ? [{ dist: 0, planet: ps[0].name }] : [];
  for (let i = 1; i < ps.length; i++) {
    const dx = ps[i].p.x - ps[i - 1].p.x;
    const dy = ps[i].p.y - ps[i - 1].p.y;
    cum += Math.sqrt(dx * dx + dy * dy) * 1000;
    stops.push({ dist: Math.round(cum), planet: ps[i].name });
  }
  const nUnique = new Set(beats.map(b => b.planet)).size;
  return { char, total: Math.round(cum), stops, nUnique };
}).sort((a, b) => b.total - a.total);

// ═══════════════════════════════════════════════════════════════════════════
//  ROW 2 — KPI HEADERS
// ═══════════════════════════════════════════════════════════════════════════

// Most Populated Planet
const popData = PLANETS
  .map(p => ({ name: p.name, pop: PLANET_POP[p.name] || 0, region: p.region }))
  .filter(d => d.pop > 0)
  .sort((a, b) => b.pop - a.pop);
const topPop = popData[0];
document.getElementById('kpi-pop-name').textContent = topPop.name.toUpperCase();
document.getElementById('kpi-pop-sub').innerHTML  =
  window.innerWidth <= 768
    ? '<strong>T</strong>rillions &nbsp;&nbsp;|&nbsp;&nbsp; <strong>B</strong>illions &nbsp;&nbsp;|&nbsp;&nbsp; <strong>M</strong>illions'
    : `${fmtPop(topPop.pop)} INHABITANTS  ·  ${topPop.region.toUpperCase()}`;

// Distance Travelled — top character = most unique worlds (matches Most Travelled chart order)
const distRenderData = [...charDistData].sort((a, b) => b.nUnique - a.nUnique);
const topDist = distRenderData[0];
document.getElementById('kpi-dist-name').textContent = topDist.char.toUpperCase();
document.getElementById('kpi-dist-sub').textContent  =
  window.innerWidth <= 768
    ? `Estimated light years in ${topDist.nUnique} planets`
    : `${fmtLY(topDist.total)} LY  ·  ${topDist.nUnique} WORLDS`;

// ═══════════════════════════════════════════════════════════════════════════
//  CHART 3 — POPULATION BUBBLE MAP · Same styling as Most Visited World
// ═══════════════════════════════════════════════════════════════════════════

(function buildPopBubbleChart() {
  const BW = 700, BH = 700, BP = 40;
  const svg = d3.select('#pop-svg');

  const defs = svg.append('defs');

  // Galaxy core glow
  const grad = defs.append('radialGradient')
    .attr('id', 'pop-bg-grad')
    .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
  grad.append('stop').attr('offset', '0%')
    .attr('stop-color', '#1a3060').attr('stop-opacity', '0.40');
  grad.append('stop').attr('offset', '100%')
    .attr('stop-color', 'transparent').attr('stop-opacity', '0');
  svg.append('ellipse')
    .attr('cx', BW * 0.5).attr('cy', BH * 0.5)
    .attr('rx', BW * 0.5).attr('ry', BH * 0.5)
    .attr('fill', 'url(#pop-bg-grad)');

  // Glow filter
  const glowFilter = defs.append('filter')
    .attr('id', 'pop-bubble-glow')
    .attr('x', '-50%').attr('y', '-50%')
    .attr('width', '200%').attr('height', '200%');
  glowFilter.append('feGaussianBlur')
    .attr('in', 'SourceGraphic').attr('stdDeviation', '3').attr('result', 'blur');
  const pgFeMerge = glowFilter.append('feMerge');
  pgFeMerge.append('feMergeNode').attr('in', 'blur');
  pgFeMerge.append('feMergeNode').attr('in', 'SourceGraphic');

  // Tight bounding box + zoom/centre — same logic as visit bubble
  const allPts = PLANETS.map(p => pxPy(p, BW, BH, BP));
  const allXs  = allPts.map(d => d[0]);
  const allYs  = allPts.map(d => d[1]);
  const bMinX  = d3.min(allXs), bMaxX = d3.max(allXs);
  const bMinY  = d3.min(allYs), bMaxY = d3.max(allYs);
  const bCx    = (bMinX + bMaxX) / 2;
  const bCy    = (bMinY + bMaxY) / 2;
  const margin = 55;
  const scaleF = Math.min(
    (BW - margin * 2) / (bMaxX - bMinX),
    (BH - margin * 2) / (bMaxY - bMinY)
  ) * 0.96;
  const tx = BW / 2 - bCx * scaleF;
  const ty = BH / 2 - bCy * scaleF;

  const gZoom = svg.append('g')
    .attr('transform', `translate(${tx},${ty}) scale(${scaleF})`);

  // Draw order: low pop first → large bubbles render on top
  const drawOrder = [...PLANETS].sort((a, b) =>
    (PLANET_POP[a.name] || 0) - (PLANET_POP[b.name] || 0)
  );

  const MOBILE = window.innerWidth <= 768;

  // ── Inner draw function — called on init and on every toggle ─────────────
  function drawBubbles(hideCoruscant) {
    gZoom.selectAll('.pop-planet-g').remove();   // clear previous render

    // Recalculate scale domain from visible populated planets only
    const OUTLIERS = new Set(['Coruscant', 'Geonosis']);
    const visiblePops = hideCoruscant
      ? popData.filter(d => !OUTLIERS.has(d.name))
      : popData;                                  // already sorted descending
    const maxPop = visiblePops[0].pop;

    const rScale = d3.scaleSqrt().domain([0, maxPop]).range([0, 38]);
    const colorScale = d3.scaleSequential()
      .domain([0, maxPop])
      .interpolator(d3.interpolateRgbBasis(['#0c1e40', '#1466c4', '#00d4ff', '#f5c842']));

    const top5PopNames = new Set(visiblePops.slice(0, 10).map(d => d.name));

    drawOrder.forEach(p => {
      if (hideCoruscant && OUTLIERS.has(p.name)) return;

      const pop      = PLANET_POP[p.name] || 0;
      const [px, py] = pxPy(p, BW, BH, BP);

      if (pop === 0 || (MOBILE && !top5PopNames.has(p.name))) {
        gZoom.append('g').attr('class', 'pop-planet-g')
          .append('circle')
          .attr('cx', px).attr('cy', py).attr('r', 2.5)
          .attr('fill', '#1a2a4a').attr('opacity', 0.4);
        return;
      }

      const r   = rScale(pop);
      const col = colorScale(pop);

      const g = gZoom.append('g')
        .attr('class', 'pop-planet-g')
        .attr('transform', `translate(${px},${py})`);

      // Outer pulse ring
      g.append('circle').attr('r', r + 9)
        .attr('fill', 'none').attr('stroke', col)
        .attr('stroke-width', 0.8).attr('opacity', 0.18);

      // Mid ring
      g.append('circle').attr('r', r + 4)
        .attr('fill', 'none').attr('stroke', col)
        .attr('stroke-width', 0.5).attr('opacity', 0.10);

      // Main bubble
      g.append('circle').attr('r', r)
        .attr('fill', col).attr('fill-opacity', 0.22)
        .attr('stroke', col)
        .attr('stroke-width', pop >= 1e9 ? 2.5 : 1.8)
        .attr('opacity', 0.9)
        .attr('filter', top5PopNames.has(p.name) ? 'url(#pop-bubble-glow)' : null);

      // Population label
      if (MOBILE) {
        // All top-10: pop number just above bubble rim, planet name above that
        g.append('text')
          .attr('text-anchor', 'middle').attr('y', -(r + 4))
          .attr('font-family', 'Share Tech Mono, monospace')
          .attr('font-size', '20px')
          .attr('fill', pop >= 1e9 ? '#f5c842' : '#00d4ff')
          .attr('pointer-events', 'none').text(fmtPopInt(pop));
      } else if (r >= 8) {
        const fontSize = r >= 18 ? 11 : r >= 12 ? 10 : 9;
        g.append('text')
          .attr('text-anchor', 'middle').attr('dy', fontSize * 0.38)
          .attr('font-family', 'Share Tech Mono, monospace')
          .attr('font-size', `${fontSize}px`)
          .attr('fill', pop >= 1e9 ? '#f5c842' : '#00d4ff')
          .attr('pointer-events', 'none').text(fmtPop(pop));
      }

      // Planet name above bubble (shifted higher on mobile to clear the pop label)
      const nameFontSize = MOBILE ? 20 : (pop >= 1e10 ? 10 : 9);
      g.append('text')
        .attr('text-anchor', 'middle').attr('y', MOBILE ? -(r + nameFontSize + 10) : -(r + 7))
        .attr('font-family', 'Share Tech Mono, monospace')
        .attr('font-size', `${nameFontSize}px`)
        .attr('fill', pop >= 1e9 ? '#c8d8f0' : '#7ab8ff')
        .attr('opacity', pop >= 1e6 ? 0.95 : 0.75)
        .attr('pointer-events', 'none').text(p.name);

      // Transparent hit area for tooltip
      g.append('circle').attr('r', Math.max(r + 12, 16))
        .attr('fill', 'transparent')
        .on('mouseover', function(evt) {
          dashTipShow(evt, `
            <div class="tt-planet">${p.name.toUpperCase()}</div>
            <div class="tt-region">${p.region.toUpperCase()}</div>
            <div class="tt-divider"></div>
            <div style="font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1.5px;color:#8099b8;margin-bottom:3px">SENTIENT POPULATION</div>
            <div style="font-family:'Orbitron',sans-serif;font-size:22px;font-weight:900;color:#f5c842;line-height:1;margin-bottom:10px">${pop.toLocaleString()}</div>
            <div style="font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1.5px;color:#8099b8;margin-bottom:3px">INHABITANTS</div>
            <div style="font-size:12px;color:#c8d8f0;line-height:1.5;margin-bottom:8px">${p.inhabitants || '—'}</div>
            <div style="font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1.5px;color:#8099b8;margin-bottom:3px">GEOGRAPHY</div>
            <div style="font-size:12px;color:#8099b8;line-height:1.5">${(p.geography || '').slice(0, 170)}${(p.geography || '').length > 170 ? '…' : ''}</div>`);
        })
        .on('mousemove', dashTipMove)
        .on('mouseout',  dashTipHide);
    });
  }

  // Initial render with Coruscant visible
  drawBubbles(false);

  // ── Toggle button ─────────────────────────────────────────────────────────
  const toggleBtn = document.getElementById('toggle-coruscant');
  if (toggleBtn) {
    let hidden = false;
    toggleBtn.addEventListener('click', function() {
      hidden = !hidden;
      drawBubbles(hidden);
      this.textContent = hidden ? 'Show Outliers' : 'Hide Outliers';
      this.classList.toggle('active', hidden);
      // Update KPI header to reflect visible top planet
      const OUTLIERS_SET = new Set(['Coruscant', 'Geonosis']);
      const visTop = hidden ? popData.find(d => !OUTLIERS_SET.has(d.name)) : popData[0];
      if (visTop) {
        document.getElementById('kpi-pop-name').textContent = visTop.name.toUpperCase();
        document.getElementById('kpi-pop-sub').innerHTML  =
          window.innerWidth <= 768
            ? '<strong>T</strong>rillions &nbsp;&nbsp;|&nbsp;&nbsp; <strong>B</strong>illions &nbsp;&nbsp;|&nbsp;&nbsp; <strong>M</strong>illions'
            : `${fmtPop(visTop.pop)} INHABITANTS  ·  ${visTop.region.toUpperCase()}`;
      }
    });
  }
})();

// ═══════════════════════════════════════════════════════════════════════════
//  CHART 4 — DISTANCE DOT PLOT · Bigger fonts, tooltips
// ═══════════════════════════════════════════════════════════════════════════

(function buildDistChart() {
  const MOBILE  = window.innerWidth <= 768;
  const DW = 580, DH = 560;
  const DP = { t: 8, r: MOBILE ? 100 : 76, b: 8, l: MOBILE ? 165 : 114 };
  const innerW = DW - DP.l - DP.r;    // 315 mobile / 390 desktop
  const innerH = DH - DP.t - DP.b;    // 544

  // Top 5 only on mobile
  const displayDistData = MOBILE ? distRenderData.slice(0, 10) : distRenderData;
  const nChars = displayDistData.length;
  const bw     = innerH / nChars;      // ~38.9 desktop / ~108.8 mobile

  const maxDist = d3.max(displayDistData, d => d.total);
  const xScale  = d3.scaleLinear().domain([0, maxDist]).range([0, innerW]);

  const TOP_CHAR = distRenderData[0].char;
  const GOLD     = '#f5c842';
  const BLUE     = '#4a9eff';

  const svg = d3.select('#dist-svg');

  // ── Filters ───────────────────────────────────────────────────────────────
  const defs = svg.append('defs');

  const dotGlow = defs.append('filter').attr('id', 'dist-dot-glow')
    .attr('x', '-150%').attr('y', '-150%')
    .attr('width', '400%').attr('height', '400%');
  dotGlow.append('feGaussianBlur').attr('in', 'SourceGraphic')
    .attr('stdDeviation', '2.5').attr('result', 'blur');
  const dgM = dotGlow.append('feMerge');
  dgM.append('feMergeNode').attr('in', 'blur');
  dgM.append('feMergeNode').attr('in', 'SourceGraphic');

  const shipGlow = defs.append('filter').attr('id', 'dist-ship-glow')
    .attr('x', '-100%').attr('y', '-100%')
    .attr('width', '300%').attr('height', '300%');
  shipGlow.append('feGaussianBlur').attr('in', 'SourceGraphic')
    .attr('stdDeviation', '4').attr('result', 'blur');
  const sgM = shipGlow.append('feMerge');
  sgM.append('feMergeNode').attr('in', 'blur');
  sgM.append('feMergeNode').attr('in', 'SourceGraphic');

  // ── Rows ──────────────────────────────────────────────────────────────────
  displayDistData.forEach((d, i) => {
    const rowCy    = DP.t + i * bw + bw / 2;
    const rowColor = d.char === TOP_CHAR ? GOLD : BLUE;
    const isTop    = d.char === TOP_CHAR;
    const xEnd     = xScale(d.total);

    const rowG = svg.append('g').attr('class', 'dist-row');

    // Ghost trail line
    rowG.append('line')
      .attr('x1', DP.l).attr('y1', rowCy)
      .attr('x2', DP.l + xEnd).attr('y2', rowCy)
      .attr('stroke', rowColor).attr('stroke-width', 0.8).attr('opacity', 0.12);

    // ── Visible star-dots (pointer-events off — hit areas below handle hovers)
    d.stops.forEach(stop => {
      const cx = DP.l + xScale(stop.dist);
      rowG.append('circle')
        .attr('cx', cx).attr('cy', rowCy)
        .attr('r', isTop ? 3.0 : 2.2)
        .attr('fill', rowColor)
        .attr('opacity', isTop ? 0.76 : 0.34)
        .attr('filter', 'url(#dist-dot-glow)')
        .attr('pointer-events', 'none');
    });

    // ── Invisible hit circles for tooltips ────────────────────────────────
    d.stops.forEach(stop => {
      const cx = DP.l + xScale(stop.dist);
      const pl = planetIndex[stop.planet];
      rowG.append('circle')
        .attr('cx', cx).attr('cy', rowCy)
        .attr('r', 9)
        .attr('fill', 'transparent')
        .on('mouseover', function(evt) {
          dashTipShow(evt, `
            <div class="tt-planet">${stop.planet.toUpperCase()}</div>
            <div class="tt-region">${(pl?.region || '').toUpperCase()}</div>
            <div class="tt-divider"></div>
            <div style="font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1.5px;color:#8099b8;margin-bottom:3px">DISTANCE TRAVELLED SO FAR</div>
            <div style="font-family:'Orbitron',sans-serif;font-size:22px;font-weight:900;color:${rowColor};line-height:1;margin-bottom:10px">${stop.dist.toLocaleString()} LY</div>
            <div style="font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:1.5px;color:#8099b8;margin-bottom:3px">CHARACTER</div>
            <div style="font-family:'Share Tech Mono',monospace;font-size:12px;color:#c8d8f0">${d.char.toUpperCase()}</div>`);
        })
        .on('mousemove', dashTipMove)
        .on('mouseout',  dashTipHide);
    });

    // ── Spaceship icon at journey end ──────────────────────────────────────
    const shipX = DP.l + xEnd;
    const shipG = rowG.append('g').attr('transform', `translate(${shipX},${rowCy})`);

    // Engine exhaust trails
    [0, -2.2, 2.2].forEach((dy, ei) => {
      shipG.append('line')
        .attr('x1', -8).attr('y1', dy).attr('x2', ei === 0 ? -17 : -14).attr('y2', dy)
        .attr('stroke', rowColor).attr('stroke-width', ei === 0 ? 2 : 1)
        .attr('opacity', ei === 0 ? 0.28 : 0.14)
        .attr('stroke-linecap', 'round');
    });

    // Ship silhouette (right-pointing)
    shipG.append('path')
      .attr('d', 'M 8,0 L -4,-5 L -2,-2 L -8,-2 L -8,2 L -2,2 L -4,5 Z')
      .attr('fill', rowColor)
      .attr('opacity', isTop ? 0.95 : 0.70)
      .attr('filter', 'url(#dist-ship-glow)');

    // Distance value
    rowG.append('text')
      .attr('x', shipX + 14)
      .attr('y', rowCy + 5)
      .attr('font-family', 'Share Tech Mono, monospace').attr('font-size', MOBILE ? '22px' : '11px')
      .attr('fill', rowColor).attr('opacity', 0.65)
      .text((MOBILE ? fmtLYInt(d.total) : fmtLY(d.total)) + ' LY');

    // Character name
    rowG.append('text')
      .attr('x', DP.l - 10)
      .attr('y', rowCy + 5)
      .attr('text-anchor', 'end')
      .attr('font-family', 'Share Tech Mono, monospace').attr('font-size', MOBILE ? '28px' : '13px')
      .attr('fill', rowColor)
      .text(d.char);
  });
})();

// ═══════════════════════════════════════════════════════════════════════════
//  SCROLL PROXY — Forward wheel events from #dashboard background to .dash-scroll
// ═══════════════════════════════════════════════════════════════════════════

(function initDashScrollProxy() {
  const dashSection = document.getElementById('dashboard');
  const dashScroll  = document.querySelector('.dash-scroll');
  if (!dashSection || !dashScroll) return;

  let locked = false;  // throttle: one snap step at a time

  dashSection.addEventListener('wheel', function(evt) {
    // Events from inside .dash-scroll handle themselves — don't intercept
    if (dashScroll.contains(evt.target)) return;

    const atTop    = dashScroll.scrollTop < 1;
    const atBottom = dashScroll.scrollTop + dashScroll.clientHeight >= dashScroll.scrollHeight - 1;

    // At a boundary scrolling in that direction → let the outer html snap take over
    if ((evt.deltaY < 0 && atTop) || (evt.deltaY > 0 && atBottom)) return;

    // Otherwise consume the event and page .dash-scroll by one snap unit
    evt.preventDefault();
    if (locked) return;
    locked = true;
    setTimeout(() => locked = false, 750);   // matches snap animation duration

    dashScroll.scrollBy({
      top:      evt.deltaY > 0 ? dashScroll.clientHeight : -dashScroll.clientHeight,
      behavior: 'smooth',
    });
  }, { passive: false });
})();

// ═══════════════════════════════════════════════════════════════════════════
//  RESET TO PAGE 1 — Whenever section 3 snaps into view, reset inner scroll
// ═══════════════════════════════════════════════════════════════════════════

(function initDashReset() {
  const dashSection = document.getElementById('dashboard');
  const dashScroll  = document.querySelector('.dash-scroll');
  if (!dashSection || !dashScroll) return;

  let wasVisible = false;
  function tick() {
    const rect = dashSection.getBoundingClientRect();
    const isVisible = rect.top > -10 && rect.top < 10;
    if (isVisible && !wasVisible) {
      dashScroll.scrollTo({ top: 0, behavior: 'instant' });
    }
    wasVisible = isVisible;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ═══════════════════════════════════════════════════════════════════════════
//  LAYOUT — Dynamic KPI card height (fills viewport for Row 1 snap anchor)
// ═══════════════════════════════════════════════════════════════════════════

(function initDashboardLayout() {
  function sizeKpiCards() {
    // On mobile, CSS height:auto governs — clear any previously set inline height
    if (window.innerWidth <= 768) {
      document.querySelectorAll('.dash-kpi-card').forEach(c => c.style.height = '');
      return;
    }
    const scrollEl = document.querySelector('.dash-scroll');
    if (!scrollEl) return;
    const pageH  = scrollEl.clientHeight;
    const hdr    = document.querySelector('.dash-page-header');
    const hdrH   = hdr ? hdr.offsetHeight : 0;
    const cardH  = Math.max(pageH - 14 - hdrH, 400);
    document.querySelectorAll('.dash-kpi-card').forEach(c => {
      c.style.height = cardH + 'px';
    });
  }

  sizeKpiCards();
  window.addEventListener('resize', sizeKpiCards);
})();
