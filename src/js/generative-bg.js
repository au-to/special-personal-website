/* ═══════════════════════════════════════════════
   GENERATIVE-BG.JS — Atmospheric Ink Wash
   Large, ultra-soft blobs that drift like ink in water
   ═══════════════════════════════════════════════ */

const BLOB_COUNT = 28;
const FADE_ALPHA = 0.008;
const MAX_SPEED = 0.2;
const BREATH_PERIOD = 60;
const TARGET_FPS = 24;

const PALETTE = [
  '196, 148, 110',   // amber
  '175, 165, 150',   // warm gray
  '140, 135, 128',   // muted stone
  '160, 150, 140',   // warm taupe
];

function createBlob(w, h) {
  // Position blobs mostly near edges and corners for a vignette feel
  const edgeBias = Math.random();
  let x, y;
  if (edgeBias < 0.4) {
    // Near corners / edges
    x = (Math.random() < 0.5 ? Math.random() * 0.3 : 0.7 + Math.random() * 0.3) * w;
    y = (Math.random() < 0.5 ? Math.random() * 0.3 : 0.7 + Math.random() * 0.3) * h;
  } else {
    // Anywhere
    x = Math.random() * w;
    y = Math.random() * h;
  }

  return {
    x, y,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    radius: 300 + Math.random() * 400,
    baseOpacity: 0.003 + Math.random() * 0.01,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)]
  };
}

export function initGenerativeBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let blobs = [];
  let animId;
  let lastTime = 0;
  let startTime = performance.now();
  let w, h;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    blobs = [];
    for (let i = 0; i < BLOB_COUNT; i++) {
      blobs.push(createBlob(w, h));
    }
  }

  function draw(timestamp) {
    animId = requestAnimationFrame(draw);

    const elapsed = timestamp - lastTime;
    const frameInterval = 1000 / TARGET_FPS;
    if (elapsed < frameInterval) return;
    lastTime = timestamp - (elapsed % frameInterval);

    const breath = Math.sin(((timestamp - startTime) / 1000) * (2 * Math.PI / BREATH_PERIOD));
    const breathFactor = 0.5 + 0.5 * ((breath + 1) / 2);

    // Very slow fade — creates dreamy trails
    ctx.fillStyle = `rgba(250, 247, 242, ${FADE_ALPHA})`;
    ctx.fillRect(0, 0, w, h);

    for (const b of blobs) {
      // Gentle drift with slight random perturbation
      b.vx += (Math.random() - 0.5) * 0.008;
      b.vy += (Math.random() - 0.5) * 0.008;
      b.vx *= 0.9995;
      b.vy *= 0.9995;

      const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (speed > MAX_SPEED) {
        b.vx = (b.vx / speed) * MAX_SPEED;
        b.vy = (b.vy / speed) * MAX_SPEED;
      }

      b.x += b.vx;
      b.y += b.vy;

      // Wrap with large margin
      const margin = 300;
      if (b.x < -margin) b.x = w + margin;
      if (b.x > w + margin) b.x = -margin;
      if (b.y < -margin) b.y = h + margin;
      if (b.y > h + margin) b.y = -margin;

      const opacity = b.baseOpacity * breathFactor;

      // Ultra-soft gradient: broad flat center, very long fade to transparent
      const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
      gradient.addColorStop(0,    `rgba(${b.color}, ${opacity})`);
      gradient.addColorStop(0.3,  `rgba(${b.color}, ${opacity * 0.85})`);
      gradient.addColorStop(0.6,  `rgba(${b.color}, ${opacity * 0.35})`);
      gradient.addColorStop(1,    `rgba(${b.color}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  resize();
  window.addEventListener('resize', resize);
  animId = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
}
