(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let rafId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    stars = Array.from({length: 300}, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.2,
      o:     0.2 + Math.random() * 0.6,
      speed: 0.002 + Math.random() * 0.004,
    }));
  }

  function draw() {
    ctx.fillStyle = '#01020a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.o += Math.sin(Date.now() * s.speed) * 0.01;
      s.o  = Math.max(0.1, Math.min(0.9, s.o));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${s.o})`;
      ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', init);

  // Pause when tab is hidden to save CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else draw();
  });
})();
