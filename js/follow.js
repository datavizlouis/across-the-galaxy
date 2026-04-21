// ── Section 1: Follow a Character ────────────────────────────────────────────

// Canonical navigation order — matches the visual char-selector grid row-by-row
const CHAR_LIST = [
  'Anakin',    'Luke',      'Leia',
  'Palpatine', 'Rey',       'Kylo Ren',
  'Obi-Wan',   'Yoda',      'Qui-Gon',   'Mace',
  'Han',       'Chewbacca', 'R2-D2',     'C-3PO',
];

let activeChar     = CHAR_LIST[0];       // start with first character
let activeBeat     = 0;
let scrollCooldown = false;

// ── Official-inspired planet colours ─────────────────────────────────────────
const PLANET_COLORS = {
  'Tatooine':        { core:'#c4822a', glow:'#e8a040' },
  'Coruscant':       { core:'#1a3870', glow:'#4a8eff' },
  'Naboo':           { core:'#2a6040', glow:'#5ab880' },
  'Mustafar':        { core:'#cc3300', glow:'#ff6020' },
  'Hoth':            { core:'#6090b8', glow:'#b0d8f8' },
  'Dagobah':         { core:'#1a3a1a', glow:'#3a8040' },
  'Bespin':          { core:'#d06030', glow:'#ff9060' },
  'Yavin 4':         { core:'#2a6030', glow:'#50a050' },
  'Endor':           { core:'#2a5020', glow:'#4a8040' },
  'Geonosis':        { core:'#9a4820', glow:'#d07040' },
  'Kamino':          { core:'#1a3860', glow:'#4080c0' },
  'Alderaan':        { core:'#2a5080', glow:'#5090d0' },
  'Kashyyyk':        { core:'#1a4010', glow:'#306820' },
  'Jakku':           { core:'#b08838', glow:'#d4aa60' },
  'Ahch-To':         { core:'#1a4060', glow:'#3a7090' },
  'Exegol':          { core:'#1a0828', glow:'#6020a0' },
  'Polis Massa':     { core:'#202030', glow:'#404060' },
  'Starkiller Base': { core:'#0a1830', glow:'#2050a0' },
  'Crait':           { core:'#c0b8a8', glow:'#e0d8c8' },
  'Pasaana':         { core:'#b05828', glow:'#d88050' },
  'Kef Bir':         { core:'#1a3040', glow:'#305870' },
  'Kijimi':          { core:'#506080', glow:'#8090a8' },
  'Cantonica':       { core:'#9a8020', glow:'#c0a840' },
  "D'Qar":           { core:'#2a6020', glow:'#50a040' },
  'Ajan Kloss':      { core:'#1a5020', glow:'#30802a' },
  'Utapau':          { core:'#607050', glow:'#90a870' },
  'Takodana':        { core:'#2a5030', glow:'#408050' },
};

// ── SVG + galaxy base ─────────────────────────────────────────────────────────
const followSvg = d3.select('#follow-svg');
followSvg.attr('viewBox', `0 0 ${W} ${H}`);
drawGalaxyBase(followSvg);                     // also creates <defs>
const followDefs = followSvg.select('defs');

// Fog gradients
['fog-a','fog-b','fog-c'].forEach((id, i) => {
  const rg = followDefs.append('radialGradient').attr('id', id)
    .attr('cx','50%').attr('cy','50%').attr('r','50%');
  const stops = [
    ['rgba(0,80,180,0.07)','rgba(0,80,180,0)'],
    ['rgba(80,0,160,0.06)','rgba(80,0,160,0)'],
    ['rgba(0,160,200,0.05)','rgba(0,160,200,0)'],
  ][i];
  rg.append('stop').attr('offset','0%').attr('stop-color', stops[0]);
  rg.append('stop').attr('offset','100%').attr('stop-color', stops[1]);
});

// Glow filter
const gf = followDefs.append('filter').attr('id','glow')
  .attr('x','-60%').attr('y','-60%').attr('width','220%').attr('height','220%');
gf.append('feGaussianBlur').attr('in','SourceGraphic').attr('stdDeviation','4').attr('result','blur');
const fm = gf.append('feMerge');
fm.append('feMergeNode').attr('in','blur');
fm.append('feMergeNode').attr('in','SourceGraphic');

// Planet glow filter
const pgf = followDefs.append('filter').attr('id','planet-glow')
  .attr('x','-100%').attr('y','-100%').attr('width','300%').attr('height','300%');
pgf.append('feGaussianBlur').attr('in','SourceGraphic').attr('stdDeviation','3');

// Fog ellipses (static SVG layer)
const fogG = followSvg.append('g').attr('class','fog-g').attr('pointer-events','none');
[{x:.35,y:.55,rx:.28,ry:.20,fill:'url(#fog-a)'},
 {x:.65,y:.30,rx:.22,ry:.16,fill:'url(#fog-b)'},
 {x:.50,y:.70,rx:.30,ry:.18,fill:'url(#fog-c)'}].forEach(f => {
  fogG.append('ellipse')
    .attr('cx',f.x*W).attr('cy',f.y*H).attr('rx',f.rx*W).attr('ry',f.ry*H)
    .attr('fill',f.fill);
});

// Dynamic SVG layers
const pathG      = followSvg.append('g').attr('class','path-g');
const dotsG      = followSvg.append('g').attr('class','dots-g');
const labelsG    = followSvg.append('g').attr('class','labels-g');
const activeDotG = followSvg.append('g').attr('class','active-dot-g');

// Keyframe injections
(function injectCSS() {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes pulse-anim { 0%{opacity:.7} 100%{r:24;opacity:0} }
    .pulse-ring { animation: pulse-anim 1.8s ease-out infinite; }
    @keyframes fog-drift-a{0%,100%{transform:translate(0,0)}50%{transform:translate(12px,-8px)}}
    @keyframes fog-drift-b{0%,100%{transform:translate(0,0)}50%{transform:translate(-10px,6px)}}
    @keyframes fog-drift-c{0%,100%{transform:translate(0,0)}50%{transform:translate(8px,10px)}}
    .fog-g ellipse:nth-child(1){animation:fog-drift-a 18s ease-in-out infinite}
    .fog-g ellipse:nth-child(2){animation:fog-drift-b 22s ease-in-out infinite}
    .fog-g ellipse:nth-child(3){animation:fog-drift-c 26s ease-in-out infinite}
  `;
  document.head.appendChild(s);
})();

// ── Ambient particle canvas ───────────────────────────────────────────────────
// Canvas lives at section level so particles bleed across the full viewport,
// seamlessly merging with the page's fixed starfield.
const followSection = document.getElementById('follow');
const pCanvas       = document.createElement('canvas');
pCanvas.id = 'follow-particles'; // styled via CSS: position:absolute;inset:0;z-index:0
followSection.appendChild(pCanvas);
function resizePCanvas() { pCanvas.width = followSection.clientWidth; pCanvas.height = followSection.clientHeight; }
resizePCanvas();
new ResizeObserver(resizePCanvas).observe(followSection);

const PARTICLES = Array.from({length:80}, (_,i) => ({
  x:Math.random(), y:Math.random(),
  r:i<50 ? Math.random()*1.0+0.2 : Math.random()*0.5+0.15,
  vx:(Math.random()-.5)*(i<50?.00015:.0004),
  vy:(Math.random()-.5)*(i<50?.00015:.0004),
  base:Math.random()*.18+.03,   // dimmer — blends with starfield rather than competing
  tw:Math.random()*Math.PI*2,
  tws:Math.random()*.015+.004,
  hue:i<50?210:Math.random()>.5?180:280,
}));

let pRaf = null;
function animateParticles() {
  const ctx = pCanvas.getContext('2d');
  const cw = pCanvas.width, ch = pCanvas.height;
  ctx.clearRect(0,0,cw,ch);
  PARTICLES.forEach(p => {
    p.x+=p.vx; p.y+=p.vy; p.tw+=p.tws;
    if(p.x<0)p.x=1; if(p.x>1)p.x=0; if(p.y<0)p.y=1; if(p.y>1)p.y=0;
    const op = p.base*(0.5+0.5*Math.sin(p.tw));
    ctx.beginPath(); ctx.arc(p.x*cw,p.y*ch,p.r,0,Math.PI*2);
    ctx.fillStyle = `hsla(${p.hue},80%,75%,${op})`; ctx.fill();
  });
  pRaf = requestAnimationFrame(animateParticles);
}
animateParticles();
document.addEventListener('visibilitychange', () => {
  if(document.hidden){cancelAnimationFrame(pRaf);pRaf=null;}
  else if(!pRaf) animateParticles();
});

// ── Cinematic camera ──────────────────────────────────────────────────────────
const VB_FULL    = `0 0 ${W} ${H}`;
const ZOOM_LEVEL = 2.2;

function cinematicZoom(planet, animate = true) {
  const [px, py] = pxPy(planet, W, H, PAD);
  const vw = W / ZOOM_LEVEL, vh = H / ZOOM_LEVEL;
  const vx = Math.max(0, Math.min(W - vw, px - vw/2));
  const vy = Math.max(0, Math.min(H - vh, py - vh/2));
  const target = `${vx} ${vy} ${vw} ${vh}`;
  if (!animate) { followSvg.attr('viewBox', target); return; }
  const cur = (followSvg.attr('viewBox') || VB_FULL).split(' ').map(Number);
  followSvg.transition('cam').duration(900).ease(d3.easeCubicInOut)
    .attrTween('viewBox', () => t => {
      const [cx,cy,cw,ch] = cur;
      return `${cx+(vx-cx)*t} ${cy+(vy-cy)*t} ${cw+(vw-cw)*t} ${ch+(vh-ch)*t}`;
    });
}

// ── Smart label positioning ───────────────────────────────────────────────────
function getLabelOffset(planet, journey, n) {
  const [px, py] = pxPy(planet, W, H, PAD);
  let sdx = 0, sdy = 0, count = 0;
  for (let i = 0; i <= n; i++) {
    if (journey[i].planet !== planet.name) continue;
    [i > 0 ? planetIndex[journey[i-1].planet] : null,
     i < n ? planetIndex[journey[i+1].planet] : null].forEach(nb => {
      if (!nb || nb.name === planet.name) return;
      const [bx, by] = pxPy(nb, W, H, PAD);
      sdx += bx - px; sdy += by - py; count++;
    });
  }
  if (count === 0) {
    return { dx: planet.x > 70 ? -12 : 12, dy: planet.y < 20 ? 14 : -8,
             anchor: planet.x > 70 ? 'end' : 'start' };
  }
  const len = Math.sqrt(sdx*sdx + sdy*sdy) || 1;
  const ox = -(sdx/len)*18, oy = -(sdy/len)*14;
  return { dx: ox, dy: oy+4, anchor: ox<-4?'end':ox>4?'start':'middle' };
}

// ── Drawing helpers ───────────────────────────────────────────────────────────
function makeArcPath(a, b) {
  const [x1,y1] = pxPy(a,W,H,PAD), [x2,y2] = pxPy(b,W,H,PAD);
  const mx=(x1+x2)/2, my=(y1+y2)/2, dx=x2-x1, dy=y2-y1;
  return `M ${x1},${y1} Q ${mx-dy*.18},${my+dx*.18} ${x2},${y2}`;
}

function drawSegment(a, b, color, solid) {
  if (a.name === b.name) return;
  pathG.append('path').attr('d', makeArcPath(a, b)).attr('fill','none')
    .attr('stroke', color).attr('stroke-width', solid?2:1.5)
    .attr('stroke-dasharray', solid?'none':'4,4')
    .attr('opacity', solid?.8:.35);
}

function drawSegmentAnimated(a, b, color) {
  if (a.name === b.name) return;
  const path = pathG.append('path').attr('d', makeArcPath(a, b))
    .attr('fill','none').attr('stroke',color).attr('stroke-width',2).attr('opacity',.8);
  const len = path.node().getTotalLength();
  path.attr('stroke-dasharray',len).attr('stroke-dashoffset',len)
    .transition().duration(700).ease(d3.easeQuadOut).attr('stroke-dashoffset',0);
}

function drawPlanetDot(g, planet, r, opacity) {
  const pc = PLANET_COLORS[planet.name];
  if (pc) {
    g.append('circle').attr('r',r*2.2).attr('fill',pc.glow)
      .attr('opacity',opacity*.18).attr('filter','url(#planet-glow)');
    g.append('circle').attr('r',r).attr('fill',pc.core)
      .attr('stroke',pc.glow).attr('stroke-width',1).attr('opacity',opacity);
  } else {
    g.append('circle').attr('r',r).attr('fill','#0a1428')
      .attr('stroke','#1a2a4a').attr('stroke-width',.8).attr('opacity',opacity);
  }
}

function drawBeatMarker(beat, idx, isActive, color) {
  const pl = planetIndex[beat.planet]; if (!pl) return;
  const [px, py] = pxPy(pl, W, H, PAD);
  const r = isActive ? 10 : 6;
  dotsG.append('circle').attr('cx',px).attr('cy',py).attr('r',r)
    .attr('fill', isActive?color:'none').attr('opacity', isActive?.95:.55)
    .attr('stroke',color).attr('stroke-width', isActive?2:1.5)
    .attr('filter', isActive?'url(#glow)':null);
  dotsG.append('text').attr('x',px).attr('y',py)
    .attr('text-anchor','middle').attr('dominant-baseline','middle')
    .attr('font-family','Share Tech Mono, monospace').attr('font-size','10px')
    .attr('fill', isActive?'#000':color).attr('opacity', isActive?1:.7)
    .text(idx+1);
  if (isActive) {
    activeDotG.append('circle').attr('class','pulse-ring')
      .attr('cx',px).attr('cy',py).attr('r',r)
      .attr('fill','none').attr('stroke',color).attr('stroke-width',2).attr('opacity',0);
  }
}

function drawPlanetLabel(planet, journey, n, color, isActive) {
  const [px, py] = pxPy(planet, W, H, PAD);
  const off = getLabelOffset(planet, journey, n);
  const lx = px + off.dx, ly = py + off.dy;
  const fs = isActive ? '12px' : '10px';
  const fc = isActive ? color : (PLANET_COLORS[planet.name]?.glow || '#7ab8ff');
  // Shadow stroke for legibility over lines
  labelsG.append('text').attr('x',lx).attr('y',ly)
    .attr('text-anchor',off.anchor)
    .attr('font-family','Share Tech Mono, monospace').attr('font-size',fs)
    .attr('fill','#000').attr('opacity',.8)
    .attr('stroke','#000').attr('stroke-width',3).attr('paint-order','stroke')
    .text(planet.name);
  labelsG.append('text').attr('x',lx).attr('y',ly)
    .attr('text-anchor',off.anchor)
    .attr('font-family','Share Tech Mono, monospace').attr('font-size',fs)
    .attr('fill',fc).attr('opacity', isActive?1:.7)
    .text(planet.name);
}

// ── Map tooltip on active beat ────────────────────────────────────────────────
const tt = document.getElementById('tooltip');

function attachBeatTooltip(beat) {
  const pl = planetIndex[beat.planet];
  if (!pl) return;
  const [px, py] = pxPy(pl, W, H, PAD);

  // Invisible hit-area over the active planet
  const hitR = 20;
  activeDotG.append('circle')
    .attr('cx', px).attr('cy', py).attr('r', hitR)
    .attr('fill', 'transparent').style('cursor', 'crosshair')
    .on('mouseenter', function(event) {
      tt.querySelector('.tt-planet').textContent = pl.name;
      tt.querySelector('.tt-region').textContent = pl.region.toUpperCase();
      tt.innerHTML = `
        <div class="tt-planet">${pl.name}</div>
        <div class="tt-region">${pl.region.toUpperCase()}</div>
        <div class="tt-row">
          <span class="tt-label">Geography</span>
          <span class="tt-value">${pl.geography || '—'}</span>
        </div>
        <div class="tt-row">
          <span class="tt-label">Inhabitants</span>
          <span class="tt-value">${pl.inhabitants || '—'}</span>
        </div>
        ${pl.population ? `<div class="tt-row">
          <span class="tt-label">Population</span>
          <span class="tt-value">${pl.population}</span>
        </div>` : ''}
        <div class="tt-divider"></div>
        <div class="tt-beat-char">${activeChar}</div>
        <div class="tt-beat-desc">${beat.beat}</div>
      `;
      tt.style.opacity = 1;
    })
    .on('mousemove', function(event) {
      const x = event.clientX, y = event.clientY;
      const ww = window.innerWidth, wh = window.innerHeight;
      tt.style.left = (x + 20 + 320 > ww ? x - 336 : x + 20) + 'px';
      tt.style.top  = (y + 10 + tt.offsetHeight > wh ? y - tt.offsetHeight - 10 : y + 10) + 'px';
    })
    .on('mouseleave', function() { tt.style.opacity = 0; });
}

// ── Render map ────────────────────────────────────────────────────────────────
function renderFollowMap(n, animate) {
  if (n === undefined) n = activeBeat;
  const journey    = JOURNEYS[activeChar];
  const color      = CHAR_COLORS[activeChar];
  const visitedSet = new Set(journey.map(b => b.planet));
  const activePl   = planetIndex[journey[n].planet];

  pathG.selectAll('*').remove();
  dotsG.selectAll('*').remove();
  labelsG.selectAll('*').remove();
  activeDotG.selectAll('*').remove();
  tt.style.opacity = 0;

  // Planet base layer
  PLANETS.forEach(p => {
    const [px, py]  = pxPy(p, W, H, PAD);
    const isVisited = visitedSet.has(p.name);
    const isActive  = p.name === journey[n].planet;
    const pg = dotsG.append('g').attr('transform',`translate(${px},${py})`);
    drawPlanetDot(pg, p,
      isVisited ? (isActive ? 6 : 5) : 3,
      isVisited ? (isActive ? 0.6  : 0.25) : 0.15);
  });

  if (n === 0) {
    drawBeatMarker(journey[0], 0, true, color);
    visitedSet.forEach(name => {
      const p = planetIndex[name];
      if (p) drawPlanetLabel(p, journey, 0, color, name === journey[0].planet);
    });
    if (activePl) { attachBeatTooltip(journey[0]); cinematicZoom(activePl, animate); }
    return;
  }

  for (let i = 0; i < n - 1; i++) {
    const a = planetIndex[journey[i].planet], b = planetIndex[journey[i+1].planet];
    if (a && b) drawSegment(a, b, color, false);
  }
  for (let i = 0; i < n; i++) drawBeatMarker(journey[i], i, false, color);

  const fp = planetIndex[journey[n-1].planet], tp = planetIndex[journey[n].planet];
  if (fp && tp) {
    if (animate) drawSegmentAnimated(fp, tp, color);
    else         drawSegment(fp, tp, color, true);
  }

  drawBeatMarker(journey[n], n, true, color);
  visitedSet.forEach(name => {
    const p = planetIndex[name];
    if (p) drawPlanetLabel(p, journey, n, color, name === journey[n].planet);
  });

  if (activePl) { attachBeatTooltip(journey[n]); cinematicZoom(activePl, animate); }
}

// ── CSS landscape art per planet, layered with scene-mood overlay ─────────────
// Each planet has a multi-layer CSS background that composes its recognisable
// skyline / terrain. An additional overlay tint encodes the scene mood.
function getSceneArt(beat) {
  const pc = PLANET_COLORS[beat.planet] || { core:'#0a1428', glow:'#4a9eff' };
  const b  = (beat.beat || '').toLowerCase();

  // Scene mood flags
  const isDark     = /kills?|killed|murder|massacre|burned|order 66|dark side|betrayal/.test(b);
  const isBattle   = /battle|duel|fight|destroy|attack|droid|war/.test(b);
  const isLoss     = /dies|death|sacrifice|frozen|carbonite|loses|impaled/.test(b);
  const isLove     = /love|wedding|married/.test(b);
  const isForce    = /force|train|jedi|sith|lightsaber|ghost|one with/.test(b);
  const isCelebrate= /victory|destroys|medal|celebration|redeemed|free/.test(b);

  // Planet landscape compositions
  const ART = {
    'Tatooine': [
      'radial-gradient(circle 72px at 22% 30%, #ffcc44 0%, #ff9900 55%, transparent 66%)',
      'radial-gradient(circle 50px at 37% 27%, #ff8800 0%, #dd5500 50%, transparent 62%)',
      'linear-gradient(180deg, #7a3010 0%, #c4822a 38%, #d49840 68%, #b07828 100%)',
    ],
    'Coruscant': [
      'radial-gradient(circle 4px at 12% 78%, #4a9eff 0%, transparent 400%)',
      'radial-gradient(circle 3px at 26% 84%, #ff8844 0%, transparent 400%)',
      'radial-gradient(circle 4px at 44% 72%, #44aaff 0%, transparent 400%)',
      'radial-gradient(circle 3px at 58% 80%, #ffcc44 0%, transparent 400%)',
      'radial-gradient(circle 4px at 72% 74%, #4a9eff 0%, transparent 400%)',
      'radial-gradient(circle 3px at 85% 82%, #ff6644 0%, transparent 400%)',
      'radial-gradient(ellipse 100% 35% at 50% 100%, rgba(20,50,120,0.6) 0%, transparent 100%)',
      'linear-gradient(180deg, #000510 0%, #050d28 48%, #1a3060 78%, #0a1840 100%)',
    ],
    'Naboo': [
      'radial-gradient(circle 60px at 78% 22%, #ffee88 0%, #ffaa00 50%, transparent 62%)',
      'radial-gradient(ellipse 90% 45% at 50% 100%, rgba(42,96,64,0.85) 0%, transparent 100%)',
      'radial-gradient(ellipse 60% 30% at 50% 68%, rgba(80,180,120,0.3) 0%, transparent 100%)',
      'linear-gradient(180deg, #1a4a8a 0%, #2a7aba 42%, #2a9060 68%, #2a6040 100%)',
    ],
    'Mustafar': [
      'radial-gradient(ellipse 100% 28% at 50% 100%, #ff7700 0%, #cc3300 45%, transparent 70%)',
      'radial-gradient(ellipse 55% 45% at 18% 65%, rgba(255,80,0,0.55) 0%, transparent 62%)',
      'radial-gradient(ellipse 42% 32% at 78% 72%, rgba(220,60,0,0.5) 0%, transparent 52%)',
      'linear-gradient(180deg, #1a0000 0%, #3a0a00 35%, #6a1600 62%, #cc3300 100%)',
    ],
    'Hoth': [
      'radial-gradient(ellipse 120% 45% at 50% 0%, rgba(180,220,255,0.65) 0%, transparent 62%)',
      'radial-gradient(ellipse 70% 55% at 28% 52%, rgba(160,200,240,0.35) 0%, transparent 72%)',
      'linear-gradient(180deg, #8ab8d8 0%, #aaccee 32%, #c0ddf5 58%, #e8f4ff 100%)',
    ],
    'Dagobah': [
      'radial-gradient(ellipse 130% 55% at 50% 0%, rgba(30,80,20,0.72) 0%, transparent 72%)',
      'radial-gradient(ellipse 55% 75% at 18% 72%, rgba(10,50,10,0.82) 0%, transparent 62%)',
      'radial-gradient(ellipse 48% 62% at 82% 62%, rgba(20,60,15,0.65) 0%, transparent 62%)',
      'linear-gradient(180deg, #050f05 0%, #0d1f0d 42%, #1a3a1a 72%, #1a3010 100%)',
    ],
    'Bespin': [
      'radial-gradient(circle 130px at 14% 38%, rgba(255,153,68,0.55) 0%, transparent 56%)',
      'radial-gradient(ellipse 130% 38% at 50% 88%, rgba(240,120,40,0.42) 0%, transparent 72%)',
      'radial-gradient(ellipse 85% 48% at 72% 42%, rgba(255,160,80,0.32) 0%, transparent 62%)',
      'linear-gradient(180deg, #4a1a0a 0%, #8b4020 32%, #d06030 58%, #e88040 78%, #f0a060 100%)',
    ],
    'Yavin 4': [
      'radial-gradient(circle 85px at 82% 22%, #ff9900 0%, transparent 62%)',
      'radial-gradient(ellipse 110% 48% at 50% 100%, rgba(30,80,20,0.9) 0%, transparent 72%)',
      'linear-gradient(180deg, #0a1505 0%, #1a3010 42%, #2a5020 68%, #3a7030 100%)',
    ],
    'Endor': [
      'radial-gradient(ellipse 55% 100% at 18% 52%, rgba(20,60,10,0.75) 0%, transparent 72%)',
      'radial-gradient(ellipse 55% 100% at 82% 52%, rgba(20,60,10,0.75) 0%, transparent 72%)',
      'radial-gradient(circle 65px at 50% 12%, #88cc44 0%, transparent 52%)',
      'linear-gradient(180deg, #0a1a05 0%, #1a3a10 32%, #2a5a18 62%, #3a7a20 100%)',
    ],
    'Geonosis': [
      'radial-gradient(ellipse 110% 28% at 50% 100%, rgba(120,50,15,0.82) 0%, transparent 72%)',
      'radial-gradient(circle 95px at 78% 28%, #cc6600 0%, transparent 62%)',
      'linear-gradient(180deg, #4a1a05 0%, #7a3010 38%, #9a4820 62%, #c06030 100%)',
    ],
    'Kamino': [
      'radial-gradient(ellipse 130% 42% at 50% 0%, rgba(40,80,160,0.62) 0%, transparent 62%)',
      'radial-gradient(ellipse 85% 62% at 28% 72%, rgba(20,50,120,0.42) 0%, transparent 72%)',
      'radial-gradient(ellipse 60% 40% at 70% 55%, rgba(80,140,200,0.2) 0%, transparent 55%)',
      'linear-gradient(180deg, #050d28 0%, #0a1a50 38%, #1a3870 62%, #0f2a60 100%)',
    ],
    'Alderaan': [
      'radial-gradient(ellipse 110% 48% at 50% 72%, rgba(30,100,60,0.62) 0%, transparent 72%)',
      'radial-gradient(ellipse 130% 42% at 50% 0%, rgba(40,100,160,0.52) 0%, transparent 62%)',
      'linear-gradient(180deg, #0a2040 0%, #1a4a80 42%, #2a7a60 68%, #2a5080 100%)',
    ],
    'Kashyyyk': [
      'radial-gradient(ellipse 58% 100% at 28% 52%, rgba(10,50,5,0.9) 0%, transparent 72%)',
      'radial-gradient(ellipse 58% 100% at 72% 52%, rgba(10,50,5,0.9) 0%, transparent 72%)',
      'radial-gradient(circle 42px at 50% 8%, #66aa22 0%, transparent 52%)',
      'linear-gradient(180deg, #030a02 0%, #0a1f08 38%, #1a4010 62%, #1a3a0a 100%)',
    ],
    'Jakku': [
      'radial-gradient(circle 65px at 68% 24%, #ffbb44 0%, #ff8800 55%, transparent 66%)',
      'radial-gradient(ellipse 110% 28% at 50% 100%, rgba(120,80,20,0.72) 0%, transparent 62%)',
      'linear-gradient(180deg, #5a3005 0%, #9a6018 38%, #b08030 62%, #c49840 100%)',
    ],
    'Ahch-To': [
      'radial-gradient(ellipse 130% 42% at 50% 100%, rgba(20,60,40,0.72) 0%, transparent 72%)',
      'radial-gradient(ellipse 110% 48% at 50% 0%, rgba(30,70,120,0.52) 0%, transparent 72%)',
      'radial-gradient(circle 42px at 22% 38%, rgba(80,140,180,0.28) 0%, transparent 52%)',
      'linear-gradient(180deg, #050d18 0%, #0d1e38 38%, #1a3860 62%, #1a4050 100%)',
    ],
    'Exegol': [
      'radial-gradient(ellipse 82% 58% at 50% 32%, rgba(100,20,180,0.52) 0%, transparent 72%)',
      'radial-gradient(ellipse 62% 42% at 18% 72%, rgba(80,10,140,0.42) 0%, transparent 62%)',
      'radial-gradient(circle 8px at 58% 46%, #dd99ff 0%, transparent 42%)',
      'radial-gradient(circle 5px at 34% 64%, #bb77ff 0%, transparent 42%)',
      'linear-gradient(180deg, #060010 0%, #100520 38%, #1a0828 62%, #200830 100%)',
    ],
    'Polis Massa': [
      'radial-gradient(ellipse 110% 58% at 50% 100%, rgba(20,20,40,0.82) 0%, transparent 72%)',
      'radial-gradient(circle 22px at 72% 26%, #4060a0 0%, transparent 52%)',
      'linear-gradient(180deg, #060608 0%, #101020 42%, #181828 68%, #202030 100%)',
    ],
    'Starkiller Base': [
      'radial-gradient(ellipse 85% 48% at 50% 82%, rgba(0,20,80,0.72) 0%, transparent 72%)',
      'radial-gradient(circle 32px at 28% 32%, #5080c0 0%, transparent 52%)',
      'radial-gradient(ellipse 120% 28% at 50% 0%, rgba(10,30,80,0.42) 0%, transparent 55%)',
      'linear-gradient(180deg, #020508 0%, #060d1e 38%, #0a1830 62%, #0a1828 100%)',
    ],
    'Crait': [
      'radial-gradient(ellipse 85% 38% at 50% 62%, rgba(180,40,20,0.42) 0%, transparent 72%)',
      'radial-gradient(ellipse 120% 22% at 50% 100%, rgba(200,50,30,0.35) 0%, transparent 100%)',
      'linear-gradient(180deg, #202025 0%, #808090 32%, #c0b8a8 58%, #e8e0d0 100%)',
    ],
    'Pasaana': [
      'radial-gradient(circle 82px at 72% 22%, #ffaa44 0%, transparent 62%)',
      'radial-gradient(ellipse 110% 28% at 50% 100%, rgba(100,40,10,0.72) 0%, transparent 72%)',
      'linear-gradient(180deg, #5a2010 0%, #8a3a18 38%, #b05828 62%, #c87038 100%)',
    ],
    'Kef Bir': [
      'radial-gradient(ellipse 130% 48% at 50% 100%, rgba(10,40,60,0.82) 0%, transparent 72%)',
      'radial-gradient(circle 65px at 18% 42%, rgba(40,80,120,0.42) 0%, transparent 56%)',
      'linear-gradient(180deg, #050c14 0%, #0d1e2e 38%, #1a3040 62%, #1a3848 100%)',
    ],
    'Kijimi': [
      'radial-gradient(ellipse 130% 42% at 50% 0%, rgba(120,160,200,0.42) 0%, transparent 62%)',
      'linear-gradient(180deg, #181e28 0%, #303848 38%, #505868 62%, #606878 100%)',
    ],
    'Cantonica': [
      'radial-gradient(circle 105px at 50% 42%, rgba(200,160,20,0.52) 0%, transparent 62%)',
      'radial-gradient(ellipse 85% 38% at 50% 92%, rgba(160,120,10,0.62) 0%, transparent 72%)',
      'linear-gradient(180deg, #1a1200 0%, #4a3800 38%, #7a5800 62%, #9a8020 100%)',
    ],
    "D'Qar": [
      'radial-gradient(ellipse 110% 48% at 50% 100%, rgba(30,100,20,0.82) 0%, transparent 72%)',
      'radial-gradient(circle 52px at 78% 22%, #88cc44 0%, transparent 52%)',
      'linear-gradient(180deg, #050f03 0%, #0f2008 38%, #1a3510 62%, #2a5018 100%)',
    ],
    'Ajan Kloss': [
      'radial-gradient(ellipse 58% 100% at 22% 52%, rgba(10,60,10,0.82) 0%, transparent 72%)',
      'radial-gradient(ellipse 58% 100% at 78% 52%, rgba(10,60,10,0.82) 0%, transparent 72%)',
      'radial-gradient(circle 62px at 50% 5%, #55aa22 0%, transparent 52%)',
      'linear-gradient(180deg, #030a02 0%, #0a1f06 38%, #183012 62%, #223a18 100%)',
    ],
    'Utapau': [
      'radial-gradient(ellipse 85% 58% at 50% 72%, rgba(60,80,40,0.52) 0%, transparent 72%)',
      'linear-gradient(180deg, #1a1e10 0%, #3a4228 38%, #506040 62%, #607050 100%)',
    ],
    'Takodana': [
      'radial-gradient(ellipse 110% 38% at 50% 92%, rgba(30,80,20,0.72) 0%, transparent 72%)',
      'radial-gradient(circle 52px at 28% 32%, rgba(80,160,80,0.32) 0%, transparent 52%)',
      'linear-gradient(180deg, #081208 0%, #142814 38%, #1e3c1e 62%, #2a5030 100%)',
    ],
  };

  const layers = ART[beat.planet]
    ? [...ART[beat.planet]]
    : [`linear-gradient(135deg, ${pc.core} 0%, ${pc.glow} 100%)`];

  // Scene-mood overlay on top
  if (isDark && isBattle)
    layers.unshift('radial-gradient(ellipse at 22% 62%, rgba(200,0,0,0.48) 0%, transparent 62%)');
  else if (isDark)
    layers.unshift('linear-gradient(180deg, rgba(4,0,0,0.72) 0%, rgba(4,0,0,0.32) 100%)');
  else if (isBattle)
    layers.unshift('radial-gradient(ellipse at 72% 28%, rgba(255,100,0,0.38) 0%, transparent 56%)');
  else if (isLoss)
    layers.unshift('linear-gradient(180deg, rgba(5,5,5,0.78) 0%, rgba(5,5,5,0.38) 100%)');
  else if (isLove)
    layers.unshift('radial-gradient(ellipse at 50% 52%, rgba(255,100,80,0.32) 0%, transparent 62%)');
  else if (isForce)
    layers.unshift('radial-gradient(ellipse at 50% 28%, rgba(0,80,200,0.42) 0%, transparent 62%)');
  else if (isCelebrate)
    layers.unshift('radial-gradient(ellipse at 50% 52%, rgba(245,200,66,0.38) 0%, transparent 62%)');

  return layers.join(', ');
}

// ── Beat hint — scroll cue at bottom of panel ────────────────────────────────
function updateBeatHint() {
  const hint = document.getElementById('beat-hint');
  if (!hint) return;
  const journey    = JOURNEYS[activeChar];
  const isLastBeat = activeBeat === journey.length - 1;

  if (activeChar === 'C-3PO' && isLastBeat) {
    hint.textContent = 'Click ↓ to explore the whole galaxy...';
  } else if (isLastBeat) {
    const idx      = CHAR_LIST.indexOf(activeChar);
    const nextName = CHAR_LIST[idx + 1];
    hint.textContent = `Scroll down to view ${nextName}'s story...`;
  } else {
    hint.textContent = 'Scroll up/down to navigate through the story..';
  }
}

// ── Story panel — paged ───────────────────────────────────────────────────────
function renderStoryPanel() {
  const journey  = JOURNEYS[activeChar];
  const color    = CHAR_COLORS[activeChar];
  const beatArea = document.getElementById('story-beat-area');
  // Only remove the old track — leave #beat-hint intact
  const oldTrack = beatArea.querySelector('#story-track');
  if (oldTrack) oldTrack.remove();

  const track = document.createElement('div');
  track.id = 'story-track';
  track.className = 'story-track';

  journey.forEach((b, i) => {
    const pc      = PLANET_COLORS[b.planet] || { core:'#0a1428', glow:'#4a9eff' };
    const isFirst = i === 0;
    const isLast  = i === journey.length - 1;

    const div = document.createElement('div');
    div.className = 'story-beat' + (i === activeBeat ? ' active' : '');
    div.setAttribute('role', 'listitem');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', `Episode ${b.ep}, ${b.planet}: ${b.beat}`);

    const imgUrl = getBeatImage(activeChar, i, b);
    div.innerHTML = `
      <div class="beat-image-bg" style="background:${getSceneArt(b)}">
        ${imgUrl ? `<img class="beat-img" src="${imgUrl}" alt="${b.planet}" loading="lazy" onerror="this.style.opacity=0">` : ''}
        <div class="beat-image-label">${activeChar.toUpperCase()}</div>
      </div>
      <div class="beat-body">
        <div class="beat-header">
          <div class="beat-ep">Episode ${b.ep} · Beat ${i + 1} of ${journey.length}</div>
          ${isFirst ? '<div class="beat-pill beat-pill-start">START</div>' : ''}
          ${isLast  ? '<div class="beat-pill beat-pill-end">END</div>'    : ''}
        </div>
        <div class="beat-planet">${b.planet}</div>
        <div class="beat-desc">${b.desc || b.beat}</div>
      </div>
    `;

    if (i === activeBeat) {
      div.style.borderLeftColor = color;
      div.style.backgroundColor = `${color}08`;
    }

    // Clicking a beat still jumps to it
    div.onclick = () => jumpToBeat(i, true);
    div.onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jumpToBeat(i, true); }
    };
    track.appendChild(div);
  });

  beatArea.appendChild(track);
  updateTrackPosition(false); // instant on first render
  updateBeatHint();
}

// Move the track to show the active beat
function updateTrackPosition(animate = true) {
  const beatArea = document.getElementById('story-beat-area');
  const track    = document.getElementById('story-track');
  if (!beatArea || !track) return;
  const h = beatArea.clientHeight;
  // Each beat fills the beat viewport (below the char grid)
  Array.from(track.children).forEach(el => { el.style.height = h + 'px'; });
  track.style.transition = animate ? 'transform .45s cubic-bezier(.4,0,.2,1)' : 'none';
  track.style.transform  = `translateY(${-activeBeat * h}px)`;
}

// Update active-beat highlight colours without rebuilding DOM
function updatePanelActive() {
  const color = CHAR_COLORS[activeChar];
  const track = document.getElementById('story-track');
  if (!track) return;
  Array.from(track.children).forEach((el, j) => {
    const on = j === activeBeat;
    el.classList.toggle('active', on);
    el.style.borderLeftColor = on ? color : '';
    el.style.backgroundColor = on ? `${color}08` : '';
  });
  updateTrackPosition(true);
  updateBeatHint();
}

// Keep track heights correct on resize
new ResizeObserver(() => updateTrackPosition(false))
  .observe(document.getElementById('story-beat-area'));

// ── Character navigation ──────────────────────────────────────────────────────
function jumpToBeat(beatIdx, animate) {
  const prev = activeBeat;
  activeBeat = beatIdx;
  const shouldAnimate = animate && beatIdx === prev + 1 &&
    JOURNEYS[activeChar][beatIdx].planet !== JOURNEYS[activeChar][prev].planet;
  renderFollowMap(beatIdx, shouldAnimate);
  updatePanelActive();
}

function jumpToChar(name, beatIdx) {
  activeChar = name;
  activeBeat = beatIdx;
  document.querySelectorAll('.char-btn').forEach(b => {
    const on = b.textContent === name;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  // Keep mobile dropdown in sync
  const mSel = document.getElementById('char-mobile-select');
  if (mSel) mSel.value = name;
  renderFollowMap(beatIdx, false);
  renderStoryPanel();
}

function prevChar() {
  const idx = CHAR_LIST.indexOf(activeChar);
  if (idx > 0) {
    // Go to last beat of previous character
    const name = CHAR_LIST[idx - 1];
    jumpToChar(name, JOURNEYS[name].length - 1);
  } else {
    // First character — exit to hero section
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
  }
}

function nextChar() {
  const idx = CHAR_LIST.indexOf(activeChar);
  if (idx < CHAR_LIST.length - 1) {
    // Go to first beat of next character
    jumpToChar(CHAR_LIST[idx + 1], 0);
  } else {
    // Last character — advance to All Journeys section
    document.getElementById('journeys').scrollIntoView({ behavior: 'smooth' });
  }
}

// ── Character selector ────────────────────────────────────────────────────────
// Explicit 4-row layout inside the story panel
const CHAR_ROWS = [
  ['Anakin',   'Luke',      'Leia'],
  ['Palpatine','Rey',       'Kylo Ren'],
  ['Obi-Wan',  'Yoda',      'Qui-Gon',   'Mace'],
  ['Han',      'Chewbacca', 'R2-D2',     'C-3PO'],
];

function buildCharSelector() {
  const container = document.getElementById('char-selector');
  container.innerHTML = '';

  CHAR_ROWS.forEach(names => {
    const row = document.createElement('div');
    row.className = 'char-row';

    names.forEach(name => {
      const btn = document.createElement('button');
      btn.className   = 'char-btn' + (name === activeChar ? ' active' : '');
      btn.textContent = name;
      btn.setAttribute('aria-pressed', name === activeChar ? 'true' : 'false');
      btn.onclick = () => {
        activeChar = name;
        activeBeat = 0;
        document.querySelectorAll('.char-btn').forEach(b => {
          const on = b.textContent === name;
          b.classList.toggle('active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        renderFollowMap(0, true);
        renderStoryPanel();
      };
      row.appendChild(btn);
    });

    container.appendChild(row);
  });
}

// ── Wheel event — map area + story panel ──────────────────────────────────────
document.getElementById('follow').addEventListener('wheel', function(e) {
  const journey = JOURNEYS[activeChar];

  // ── Story panel: intercept completely, drive beats from here ──
  if (e.target.closest('#story-panel')) {
    e.preventDefault();
    if (scrollCooldown) return;
    if (e.deltaY > 0) {
      if (activeBeat < journey.length - 1) {
        jumpToBeat(activeBeat + 1, true);
      } else {
        const idx = CHAR_LIST.indexOf(activeChar);
        if (idx < CHAR_LIST.length - 1) { nextChar(); return; }
      }
    } else {
      if (activeBeat > 0) {
        jumpToBeat(activeBeat - 1, false);
      } else {
        const idx = CHAR_LIST.indexOf(activeChar);
        if (idx > 0) { prevChar(); return; }
      }
    }
    scrollCooldown = true;
    setTimeout(() => { scrollCooldown = false; }, e.deltaY > 0 ? 650 : 380);
    return;
  }

  // ── Map area: advance/retreat beats; navigate chars at boundaries ──
  e.preventDefault();
  if (scrollCooldown) return;

  if (e.deltaY > 0 && activeBeat < journey.length - 1) {
    const prev = activeBeat;
    activeBeat++;
    const shouldAnimate = journey[activeBeat].planet !== journey[prev].planet;
    renderFollowMap(activeBeat, shouldAnimate);
    updatePanelActive();
    scrollCooldown = true;
    setTimeout(() => { scrollCooldown = false; }, 750);
  } else if (e.deltaY < 0 && activeBeat > 0) {
    activeBeat--;
    renderFollowMap(activeBeat, false);
    updatePanelActive();
    scrollCooldown = true;
    setTimeout(() => { scrollCooldown = false; }, 350);
  } else if (e.deltaY > 0) {
    const idx = CHAR_LIST.indexOf(activeChar);
    if (idx < CHAR_LIST.length - 1) nextChar();
  } else if (e.deltaY < 0) {
    const idx = CHAR_LIST.indexOf(activeChar);
    if (idx > 0) prevChar();
  }
}, { passive: false });

// ── Init ──────────────────────────────────────────────────────────────────────
buildCharSelector();

// Create the scroll hint once — renderStoryPanel preserves it between char switches
const _hint = document.createElement('div');
_hint.id = 'beat-hint';
document.getElementById('story-beat-area').appendChild(_hint);

renderFollowMap(0, false);
renderStoryPanel();

// ── Mobile: dropdown selector + expand/collapse map + touch swipe ─────────────
if (window.innerWidth <= 768) {
  // Character dropdown — injected before the beat area inside the story panel
  const charWrap = document.createElement('div');
  charWrap.className = 'mobile-selector-wrap';
  const charSel = document.createElement('select');
  charSel.id = 'char-mobile-select';
  charSel.className = 'mobile-select';
  charSel.setAttribute('aria-label', 'Select a character');
  CHAR_LIST.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    if (name === activeChar) opt.selected = true;
    charSel.appendChild(opt);
  });
  charSel.addEventListener('change', () => jumpToChar(charSel.value, 0));
  charWrap.appendChild(charSel);
  const beatArea = document.getElementById('story-beat-area');
  beatArea.parentNode.insertBefore(charWrap, beatArea);

  // Expand button
  const followMapWrap = document.getElementById('follow-map-wrap');
  const followExpandBtn = document.createElement('button');
  followExpandBtn.className = 'map-expand-btn';
  followExpandBtn.textContent = 'EXPAND MAP';
  followExpandBtn.addEventListener('click', () => {
    const expanded = followMapWrap.classList.toggle('map-expanded');
    followExpandBtn.textContent = expanded ? '✕ CLOSE' : 'EXPAND MAP';
  });
  followMapWrap.appendChild(followExpandBtn);

  // Touch swipe to navigate beats
  let followTouchY = 0;
  document.getElementById('follow').addEventListener('touchstart',
    e => { followTouchY = e.touches[0].clientY; }, { passive: true });
  document.getElementById('follow').addEventListener('touchend', e => {
    // Don't intercept taps on buttons
    if (e.target.closest('button, .char-btn')) return;
    const dy = followTouchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) < 40) return;
    const journey = JOURNEYS[activeChar];
    const dir = dy > 0 ? 1 : -1;
    const next = activeBeat + dir;
    if (next >= 0 && next < journey.length) {
      const prev = activeBeat;
      activeBeat = next;
      renderFollowMap(activeBeat, journey[activeBeat].planet !== journey[prev].planet);
      updatePanelActive();
    } else {
      // Boundary: navigate to prev/next character, or exit section
      if (dir > 0) nextChar(); else prevChar();
    }
  }, { passive: true });
}
