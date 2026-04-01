/* ═══════════════════════════════════════════════
   PANDÍN — padres.js
   Portal de Padres de Familia
   ═══════════════════════════════════════════════ */
(function() {
  // Credentials
  const CREDS = { '2026padres': 'abrilpandin' };

  window.padresLogin = function() {
    const u = document.getElementById('padresUser').value.trim();
    const p = document.getElementById('padresPass').value.trim();
    if (CREDS[u] && CREDS[u] === p) {
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('dashSection').style.display  = 'block';
      document.getElementById('dashSection').classList.add('reveal','visible');
      // Re-run reveal for new elements
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
      }, 50);
    } else {
      showError('loginErr', '❌ Usuario o contraseña incorrectos. Contacta a Pandín si necesitas ayuda.');
      document.getElementById('padresPass').value = '';
    }
  };

  window.padresLogout = function() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('dashSection').style.display  = 'none';
    document.getElementById('padresUser').value = '';
    document.getElementById('padresPass').value = '';
  };

  // Tab switching
  window.pTab = function(tab) {
    const tabs = ['circulares','menu','calendario','galeria'];
    document.querySelectorAll('.ptab').forEach((btn, i) => {
      btn.classList.toggle('active', tabs[i] === tab);
    });
    tabs.forEach(t => {
      const el = document.getElementById('tp-' + t);
      if (el) el.classList.toggle('active', t === tab);
    });
    // Trigger reveal animations for newly visible tab
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
    }, 50);
  };
})();
