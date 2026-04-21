// Shared SVG dimensions used by all three sections
const W   = 800;
const H   = 520;
const PAD = 40;

// Map planet (x,y) percentages → SVG pixel coordinates
function pxPy(planet, w, h, pad) {
  const pw = w - pad * 2;
  const ph = h - pad * 2;
  return [pad + (planet.x / 100) * pw, h - pad - (planet.y / 100) * ph];
}

// Append galaxy background (gradient ellipse + subtle grid) to an SVG selection.
// Returns the appended <g class="planets-g"> for callers that want to draw into it.
function drawGalaxyBase(svg) {
  const defs = svg.append('defs');

  const radialCore = defs.append('radialGradient')
    .attr('id', `gcore-${svg.attr('id')}`)
    .attr('cx', '50%').attr('cy', '50%').attr('r', '30%');
  radialCore.append('stop').attr('offset', '0%')
    .attr('stop-color', '#1a3060').attr('stop-opacity', '0.3');
  radialCore.append('stop').attr('offset', '100%')
    .attr('stop-color', 'transparent').attr('stop-opacity', '0');

  svg.append('ellipse')
    .attr('cx', W * 0.5).attr('cy', H * 0.5)
    .attr('rx', W * 0.45).attr('ry', H * 0.38)
    .attr('fill', `url(#gcore-${svg.attr('id')})`)
    .attr('opacity', 0.4);

  const gridG = svg.append('g').attr('class', 'grid').attr('opacity', 0.04);
  for (let gx = 0; gx <= 100; gx += 10) {
    const px = PAD + (gx / 100) * (W - PAD * 2);
    gridG.append('line')
      .attr('x1', px).attr('y1', PAD).attr('x2', px).attr('y2', H - PAD)
      .attr('stroke', '#4a9eff').attr('stroke-width', '0.5');
  }
  for (let gy = 0; gy <= 100; gy += 10) {
    const py = H - PAD - (gy / 100) * (H - PAD * 2);
    gridG.append('line')
      .attr('x1', PAD).attr('y1', py).attr('x2', W - PAD).attr('y2', py)
      .attr('stroke', '#4a9eff').attr('stroke-width', '0.5');
  }

  return svg.append('g').attr('class', 'planets-g');
}

// Draw all planet nodes into a <g>, optionally dimming non-highlighted ones.
function drawPlanets(g, svg, highlightNames) {
  PLANETS.forEach(p => {
    const [px, py] = pxPy(p, W, H, PAD);
    const isHL = !highlightNames || highlightNames.includes(p.name);
    const pg = g.append('g').attr('class', 'planet-node')
      .attr('transform', `translate(${px},${py})`);

    pg.append('circle')
      .attr('r', isHL ? 8 : 5)
      .attr('fill', 'none')
      .attr('stroke', isHL ? '#4a9eff' : '#1a2a4a')
      .attr('stroke-width', 1)
      .attr('opacity', isHL ? 0.3 : 0.1);

    pg.append('circle')
      .attr('r', isHL ? 4 : 2.5)
      .attr('fill', isHL ? '#4a9eff' : '#1a3060')
      .attr('opacity', isHL ? 0.9 : 0.4);

    if (isHL) {
      pg.append('text')
        .attr('x', 7).attr('y', 4)
        .attr('font-family', 'Share Tech Mono, monospace')
        .attr('font-size', '11px')
        .attr('fill', '#7ab8ff')
        .attr('opacity', 0.9)
        .text(p.name);
    }

    pg.append('title').text(`${p.name} · ${p.region}`);
  });
}

// Desktop: wheel-lock all sections (nav buttons only for section changes)
if (window.innerWidth > 768) {
  // Hero: block all wheel scroll
  const heroEl = document.getElementById('hero');
  if (heroEl) heroEl.addEventListener('wheel', e => e.preventDefault(), { passive: false });

  // Dashboard: block outer scroll, allow internal dash-scroll snap with cooldown
  const dashEl = document.getElementById('dashboard');
  if (dashEl) {
    let dashScrolling = false;
    dashEl.addEventListener('wheel', e => {
      e.preventDefault();
      if (dashScrolling) return;
      const ds = e.target.closest('.dash-scroll');
      if (ds) {
        const pageH = ds.clientHeight;
        const cur   = Math.round(ds.scrollTop / pageH);
        const next  = Math.max(0, Math.min(ds.children.length - 1, cur + (e.deltaY > 0 ? 1 : -1)));
        if (next !== cur) {
          dashScrolling = true;
          ds.scrollTo({ top: next * pageH, behavior: 'smooth' });
          setTimeout(() => { dashScrolling = false; }, 650);
        }
      }
    }, { passive: false });
  }

  // Credits: block all wheel scroll
  const creditsEl = document.getElementById('credits');
  if (creditsEl) creditsEl.addEventListener('wheel', e => e.preventDefault(), { passive: false });
}
