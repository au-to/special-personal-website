/* ═══════════════════════════════════════════════
   NAVIGATION.JS — Smooth Scroll, Active Tracking,
   Scroll-Direction Header Show/Hide
   ═══════════════════════════════════════════════ */

export function initNavigation() {
  const header = document.getElementById('masthead');
  if (!header) return;

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Active section tracking
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#masthead nav a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active',
            link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(section => sectionObserver.observe(section));

  // Scroll-direction aware header show/hide
  let lastScrollY = window.scrollY;
  const scrollThreshold = 10;
  let accumulatedScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;
        accumulatedScroll += delta;

        if (currentScrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }

        if (accumulatedScroll > scrollThreshold) {
          header.classList.add('hidden');
          accumulatedScroll = 0;
        } else if (accumulatedScroll < -scrollThreshold) {
          header.classList.remove('hidden');
          accumulatedScroll = 0;
        }

        if (currentScrollY < 100) {
          header.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
