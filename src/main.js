import './styles.css';

const path = window.location.pathname.replace(/\/$/, '/index.html');

document.querySelectorAll('[data-nav]').forEach((link) => {
  const target = new URL(link.getAttribute('href'), window.location.origin).pathname.replace(/\/$/, '/index.html');
  if (target !== path) return;
  link.setAttribute('aria-current', 'page');
  link.classList.add(...(link.dataset.activeClass || 'text-primary font-bold').split(' '));
  link.classList.remove('text-on-surface-variant');
});

document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const hero = document.getElementById('hero-3d');
if (hero) {
  import('./hero3d.js').then(({ mountHero3d }) => mountHero3d(hero));
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const blocks = document.querySelectorAll('main section, main article, .showcase-card');
  const seen = new Set();
  blocks.forEach((el) => {
    if (seen.has(el) || el.closest('.demo-modal') || el.classList.contains('hidden')) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) return;
    seen.add(el);
    el.classList.add('reveal');
  });
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  document.querySelectorAll('.reveal').forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(el);
  });
  window.setTimeout(() => {
    document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('is-in');
    });
  }, 700);
}
