/* ═══════════════════════════════════════════════
   PANDÍN — misses.js
   Portal de Misses — Registro de Asistencia
   ═══════════════════════════════════════════════ */
(function() {
  // Credentials
  const MISS_CREDS = {
    'directora': 'pandin2025',
    'miss.sofia': 'sofia123',
    'miss.karen': 'karen123',
    'miss.maria': 'maria123',
    'pandin':     'misses2025'
  };

  let currentUser = '';
  let registros   = [];

  // ── CLOCK ────────────────────────────────────
  function updateClock() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    const timeStr = now.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
    const d = document.getElementById('clkDate');
    const t = document.getElementById('clkTime');
    if (d) d.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    if (t) t.textContent = timeStr;

    // Auto-fill form fields
    const rF = document.getElementById('rFecha');
    const rH = document.getElementById('rHora');
    if (rF && !rF.value) rF.value = now.toISOString().split('T')[0];
    if (rH) rH.value = now.toTimeString().slice(0, 5);
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── LOGIN ─────────────────────────────────────
  window.missLogin = function() {
    const u = document.getElementById('missUser').value.trim().toLowerCase();
    const p = document.getElementById('missPassInput').value.trim();
    if (MISS_CREDS[u] && MISS_CREDS[u] === p) {
      currentUser = u;
      document.getElementById('missLogin').style.display = 'none';
      document.getElementById('missDash').style.display  = 'block';

      // Nice welcome
      const name = u.replace('miss.', 'Miss ').replace(/^\w/, c => c.toUpperCase());
      document.getElementById('missWelcome').textContent  = `👋 ¡Bienvenida, ${name}!`;
      document.getElementById('missSubtitle').textContent = `Sistema de asistencia · ${new Date().toLocaleDateString('es-MX', {weekday:'long', day:'numeric', month:'long'})}`;

      // Pre-fill name
      const rN = document.getElementById('rNombre');
      if (rN) rN.value = name;

      // Trigger reveals
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
      }, 50);
      updateStats();
    } else {
      showError('missErr', '⚠️ Usuario o contraseña incorrectos. Habla con la directora.');
      document.getElementById('missPassInput').value = '';
    }
  };

  window.missLogout = function() {
    document.getElementById('missLogin').style.display = 'block';
    document.getElementById('missDash').style.display  = 'none';
    document.getElementById('missUser').value      = '';
    document.getElementById('missPassInput').value = '';
    currentUser = '';
  };

  // ── TAB SWITCHING ─────────────────────────────
  window.mTab = function(tab) {
    const tabs = ['registro','historial','resumen'];
    document.querySelectorAll('.ptab').forEach((btn, i) => {
      btn.classList.toggle('active', tabs[i] === tab);
    });
    tabs.forEach(t => {
      const el = document.getElementById('mt-' + t);
      if (el) el.classList.toggle('active', t === tab);
    });
    if (tab === 'historial') renderTable();
    if (tab === 'resumen')   renderResumen();
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
    }, 50);
  };

  // ── QUICK ENTRY / EXIT ───────────────────────
  window.quickEntry = function() {
    const nombre = document.getElementById('rNombre').value.trim();
    if (!nombre) { alert('Por favor ingresa tu nombre primero'); return; }
    saveRecord(nombre, 'entrada', '', 'Registro rápido');
  };
  window.quickExit = function() {
    const nombre = document.getElementById('rNombre').value.trim();
    if (!nombre) { alert('Por favor ingresa tu nombre primero'); return; }
    saveRecord(nombre, 'salida', '', 'Registro rápido');
  };

  // ── MANUAL SAVE ──────────────────────────────
  window.saveReg = function() {
    const nombre = document.getElementById('rNombre').value.trim();
    const tipo   = document.getElementById('rTipo').value;
    const hora   = document.getElementById('rHora').value;
    const fecha  = document.getElementById('rFecha').value;
    const obs    = document.getElementById('rObs').value.trim();
    if (!nombre) { alert('Por favor ingresa el nombre de la miss'); return; }
    saveRecord(nombre, tipo, fecha, obs, hora);
  };

  function saveRecord(nombre, tipo, fecha, obs, hora) {
    const now = new Date();
    const rec = {
      id:     Date.now(),
      nombre: nombre,
      tipo:   tipo,
      hora:   hora || now.toTimeString().slice(0, 5),
      fecha:  fecha || now.toISOString().split('T')[0],
      obs:    obs || '',
      ts:     now.getTime()
    };
    registros.push(rec);
    showSuccess('regSuccess', `✅ ${tipo === 'entrada' ? '🟢 Entrada' : '🔴 Salida'} registrada correctamente para ${nombre}!`);
    document.getElementById('rObs').value = '';
    updateStats();
    renderTable();
  }

  // ── STATS ─────────────────────────────────────
  function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const todays = registros.filter(r => r.fecha === today);
    document.getElementById('stTotal').textContent = todays.length;
    document.getElementById('stIn').textContent    = todays.filter(r => r.tipo === 'entrada').length;
    document.getElementById('stOut').textContent   = todays.filter(r => r.tipo === 'salida').length;
    document.getElementById('todayCount').textContent = todays.length + ' registros';
  }

  // ── TABLE ──────────────────────────────────────
  function renderTable() {
    const today = new Date().toISOString().split('T')[0];
    const todays = registros.filter(r => r.fecha === today).sort((a,b) => b.ts - a.ts);
    const tbody = document.getElementById('regTableBody');
    if (!tbody) return;
    if (!todays.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:28px;color:var(--text-l);font-weight:600">No hay registros hoy. ¡Sé la primera en registrarte! 🌟</td></tr>';
      return;
    }
    tbody.innerHTML = todays.map(r => `
      <tr>
        <td style="font-weight:800;color:var(--text)">${r.nombre}</td>
        <td><span class="type-badge ${r.tipo==='entrada'?'tb-e':'tb-s'}">${r.tipo==='entrada'?'🟢 Entrada':'🔴 Salida'}</span></td>
        <td>${r.hora}</td>
        <td>${r.fecha}</td>
        <td style="color:var(--text-l)">${r.obs||'—'}</td>
      </tr>`).join('');
    updateStats();
  }

  // ── RESUMEN SEMANAL ───────────────────────────
  function renderResumen() {
    const wt = document.getElementById('weekTotal');
    const wp = document.getElementById('weekPersonal');
    const wtbl = document.getElementById('weekTable');
    if (!wt) return;

    // Get this week's Monday
    const now = new Date();
    const day = now.getDay() || 7;
    const monday = new Date(now); monday.setDate(now.getDate() - day + 1);

    const weekRecs = registros.filter(r => {
      const d = new Date(r.fecha + 'T00:00:00');
      return d >= monday && d <= now;
    });

    wt.textContent = weekRecs.length;
    const people = new Set(weekRecs.map(r => r.nombre));
    wp.textContent = people.size;

    if (!weekRecs.length) {
      wtbl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-l);font-weight:600;font-size:13px">Los registros de la semana aparecerán aquí 📋</div>';
      return;
    }
    // Group by date
    const byDate = {};
    weekRecs.forEach(r => { if (!byDate[r.fecha]) byDate[r.fecha] = []; byDate[r.fecha].push(r); });
    wtbl.innerHTML = Object.entries(byDate).sort().reverse().map(([date, recs]) => `
      <div style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:800;color:var(--text-m);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;padding:6px 0;border-bottom:1px solid var(--border)">
          📅 ${new Date(date+'T12:00:00').toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})}
          <span style="float:right">${recs.length} registros</span>
        </div>
        ${recs.sort((a,b)=>a.hora.localeCompare(b.hora)).map(r=>`
          <div style="display:flex;align-items:center;gap:10px;padding:6px 8px;border-radius:7px;margin-bottom:4px;background:${r.tipo==='entrada'?'var(--mint-l)':'var(--coral-l)'}">
            <span>${r.tipo==='entrada'?'🟢':'🔴'}</span>
            <span style="font-weight:800;font-size:13px;flex:1">${r.nombre}</span>
            <span style="font-size:12px;color:var(--text-m)">${r.hora}</span>
            ${r.obs?`<span style="font-size:11px;color:var(--text-l)">${r.obs}</span>`:''}
          </div>`).join('')}
      </div>`).join('');
  }

  // ── EXPORT CSV ────────────────────────────────
  window.exportCSV = function() {
    if (!registros.length) { alert('No hay registros para exportar'); return; }
    const headers = 'Nombre,Tipo,Hora,Fecha,Observaciones\n';
    const rows = registros.map(r =>
      `"${r.nombre}","${r.tipo}","${r.hora}","${r.fecha}","${r.obs}"`
    ).join('\n');
    const csv = headers + rows;
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `asistencia_pandin_${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };
})();
