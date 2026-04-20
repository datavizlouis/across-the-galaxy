// ── Navigation active state ───────────────────────────────────────────────────

function setActive(el) {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

// Automatically highlight the nav link whose section is on screen
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {threshold: 0.3});

['follow', 'journeys', 'dashboard'].forEach(id => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});
