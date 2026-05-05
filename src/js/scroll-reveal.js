/* ═══════════════════════════════════════════════
   SCROLL-REVEAL.JS — IntersectionObserver Reveals
   ═══════════════════════════════════════════════ */

export function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (elements.length === 0) return;

  // Stagger by section: each section's elements reveal in sequence
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const items = section.querySelectorAll('[data-reveal]');
    items.forEach((el, i) => {
      const delay = i * 120;
      if (delay) {
        el.style.transitionDelay = delay + 'ms';
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
