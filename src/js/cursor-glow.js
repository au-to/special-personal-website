/* ═══════════════════════════════════════════════
   CURSOR-GLOW.JS — Mouse-Follow Radial Glow
   ═══════════════════════════════════════════════ */

export function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  let rafId = null;
  let mouseX = -1000;
  let mouseY = -1000;

  function update() {
    glow.style.left = mouseX + 'px';
    glow.style.top = mouseY + 'px';
    rafId = null;
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) {
      rafId = requestAnimationFrame(update);
    }
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  // Hide glow on touch devices
  document.addEventListener('touchstart', () => {
    glow.style.opacity = '0';
  }, { once: true });
}
