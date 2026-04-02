/* ═══════════════════════════════════════════════
   PANDÍN — Global JS
   Cursor + Nav + Scroll Reveal + Shared Utils
   ═══════════════════════════════════════════════ */

// ── CURSOR BAMBÚ CON DESTELLO ──────────────────
(function initCursor() {
  // No mostrar cursor personalizado en dispositivos táctiles/móviles
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const glow  = document.createElement('div'); glow.className  = 'cur-glow';
  const trail = document.createElement('div'); trail.className = 'cur-trail';

  // SVG: Cara de panda tierna con destellos
  trail.innerHTML = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="width:40px;height:40px">
    <!-- Orejas -->
    <circle cx="10" cy="11" r="6.5" fill="#2C1A10"/>
    <circle cx="30" cy="11" r="6.5" fill="#2C1A10"/>
    <circle cx="10" cy="11" r="4"   fill="#5A3A28"/>
    <circle cx="30" cy="11" r="4"   fill="#5A3A28"/>
    <!-- Cabeza -->
    <ellipse cx="20" cy="23" rx="14" ry="13" fill="white"/>
    <ellipse cx="20" cy="23" rx="14" ry="13" fill="none" stroke="#E0D0C0" stroke-width="1"/>
    <!-- Manchas ojos -->
    <ellipse cx="14.5" cy="20" rx="4.5" ry="5" fill="#2C1A10" opacity=".9"/>
    <ellipse cx="25.5" cy="20" rx="4.5" ry="5" fill="#2C1A10" opacity=".9"/>
    <!-- Ojos -->
    <circle cx="14.5" cy="20" r="2.2" fill="white"/>
    <circle cx="25.5" cy="20" r="2.2" fill="white"/>
    <circle cx="15.2" cy="20.3" r="1.3" fill="#2C1A10"/>
    <circle cx="26.2" cy="20.3" r="1.3" fill="#2C1A10"/>
    <!-- Destellos ojos -->
    <circle cx="15.8" cy="19.2" r=".6" fill="white"/>
    <circle cx="26.8" cy="19.2" r=".6" fill="white"/>
    <!-- Nariz -->
    <ellipse cx="20" cy="25" rx="3.5" ry="2.5" fill="#3A9467"/>
    <!-- Boca -->
    <path d="M17.5 27 Q20 29.5 22.5 27" fill="none" stroke="#2C1A10" stroke-width="1.2" stroke-linecap="round"/>
    <!-- Destellos alrededor -->
    <path d="M5 5 L6.5 2 L8 5" fill="#F4C430" opacity=".8"/>
    <path d="M35 5 L36.5 2 L38 5" fill="#F4C430" opacity=".8"/>
    <circle cx="4"  cy="34" r="1.2" fill="#6DBF9E" opacity=".7"/>
    <circle cx="36" cy="34" r="1.2" fill="#F07B5E" opacity=".7"/>
    <circle cx="20" cy="3"  r=".9"  fill="#A98BD4" opacity=".7"/>
  </svg>`;

  document.body.appendChild(glow);
  document.body.appendChild(trail);

  let mx=0, my=0, gx=0, gy=0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animCursor() {
    gx += (mx - gx) * 0.14;
    gy += (my - gy) * 0.14;
    glow.style.left  = gx + 'px'; glow.style.top  = gy + 'px';
    trail.style.left = mx + 'px'; trail.style.top = my + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  const hoverEls = 'a,button,input,select,textarea,.card,.info-row,.intel-chip,.srv-card';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => glow.classList.add('hov'));
    el.addEventListener('mouseleave', () => glow.classList.remove('hov'));
  });

  // hide when leaving window
  document.addEventListener('mouseleave', () => { glow.style.opacity='0'; trail.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity='1'; trail.style.opacity='1'; });
})();

// ── NAVBAR SHRINK ──────────────────────────────
(function initNav() {
  const nav = document.querySelector('.pnav');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('shrunk', window.scrollY > 60));
})();

// ── SCROLL REVEAL ──────────────────────────────
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

// ── ACTIVE NAV LINK ────────────────────────────
(function markActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href')?.split('/').pop();
    if (href === page) a.classList.add('active');
  });
})();

// ── UTILS ──────────────────────────────────────
function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg; el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}
function showSuccess(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg; el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3500);
}

// ── ALERT STYLES helper ────────────────────────
const _style = document.createElement('style');
_style.textContent = `
  .p-alert { display:none; padding:11px 15px; border-radius:10px; font-size:13px; font-weight:700; margin-bottom:14px; }
  .p-alert-err  { background:#FDEEE9; border:1.5px solid rgba(240,123,94,.3); color:#B84030; }
  .p-alert-ok   { background:#E4F5EE; border:1.5px solid rgba(109,191,158,.3); color:#3A9467; }
`;
document.head.appendChild(_style);
