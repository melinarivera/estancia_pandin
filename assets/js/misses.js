/* ═══════════════════════════════════════════════
   PANDÍN — misses.js
   Portal de Misses — Registro de Asistencia
   ═══════════════════════════════════════════════ */
(function() {
  const MISS_CREDS = {
    'directora': 'pandin2025',
    'miss.sofia': 'sofia123',
    'miss.karen': 'karen123',
    'miss.maria': 'maria123',
    'pandin':     'misses2025'
  };

  let currentUser = '';
  let displayName = '';
  let registros   = [];

  // ── CDMX TIME HELPERS ────────────────────────
  function cdmxNow() {
    // Returns a Date object representing the current CDMX local time
    const str = new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' });
    return new Date(str);
  }
  function cdmxDateISO() {
    const d = cdmxNow();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }
  function cdmxTimeHHMM() {
    const d = cdmxNow();
    return String(d.getHours()).padStart(2, '0') + ':' +
      String(d.getMinutes()).padStart(2, '0');
  }

  // ── CLOCK (CDMX timezone) ────────────────────
  function updateClock() {
    const dateStr = new Date().toLocaleDateString('es-MX', {
      timeZone: 'America/Mexico_City',
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    const timeStr = new Date().toLocaleTimeString('es-MX', {
      timeZone: 'America/Mexico_City',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const d = document.getElementById('clkDate');
    const t = document.getElementById('clkTime');
    if (d) d.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    if (t) t.textContent = timeStr;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── LOGIN ─────────────────────────────────────
  window.missLogin = function() {
    const u = document.getElementById('missUser').value.trim().toLowerCase();
    const p = document.getElementById('missPassInput').value.trim();
    if (MISS_CREDS[u] && MISS_CREDS[u] === p) {
      currentUser = u;
      displayName = u.replace('miss.', 'Miss ').replace(/^\w/, c => c.toUpperCase());

      document.getElementById('missLogin').style.display = 'none';
      document.getElementById('missDash').style.display  = 'block';

      document.getElementById('missWelcome').textContent  = `👋 ¡Bienvenida, ${displayName}!`;
      document.getElementById('missSubtitle').textContent = `Sistema de asistencia · ${new Date().toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City', weekday: 'long', day: 'numeric', month: 'long' })}`;

      // Show logged-in name in identity card
      const nd = document.getElementById('rNombreDisplay');
      if (nd) nd.textContent = displayName;

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
    displayName = '';
  };

  // ── TAB SWITCHING ─────────────────────────────
  window.mTab = function(tab) {
    const tabs = ['registro', 'historial', 'resumen'];
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

  // ── ENTRY / EXIT — timestamp is automatic, not editable ──
  window.quickEntry = function() {
    if (!currentUser) return;
    const obs = (document.getElementById('rObs').value || '').trim();
    saveRecord(displayName, 'entrada', obs);
    document.getElementById('rObs').value = '';
  };

  window.quickExit = function() {
    if (!currentUser) return;
    const obs = (document.getElementById('rObs').value || '').trim();
    saveRecord(displayName, 'salida', obs);
    document.getElementById('rObs').value = '';
  };

  function saveRecord(nombre, tipo, obs) {
    const hora  = cdmxTimeHHMM();
    const fecha = cdmxDateISO();
    const rec = {
      id:     Date.now(),
      nombre: nombre,
      tipo:   tipo,
      hora:   hora,
      fecha:  fecha,
      obs:    obs || '',
      ts:     Date.now()
    };
    registros.push(rec);
    showSuccess('regSuccess',
      `✅ ${tipo === 'entrada' ? '🟢 Entrada' : '🔴 Salida'} registrada — ${hora} hrs (CDMX) · ${nombre}`);
    updateStats();
    renderTable();
  }

  // ── STATS ─────────────────────────────────────
  function updateStats() {
    const today = cdmxDateISO();
    const todays = registros.filter(r => r.fecha === today);
    document.getElementById('stTotal').textContent = todays.length;
    document.getElementById('stIn').textContent    = todays.filter(r => r.tipo === 'entrada').length;
    document.getElementById('stOut').textContent   = todays.filter(r => r.tipo === 'salida').length;
    const tc = document.getElementById('todayCount');
    if (tc) tc.textContent = todays.length + ' registros';
  }

  // ── TABLE ──────────────────────────────────────
  function renderTable() {
    const today = cdmxDateISO();
    const todays = registros.filter(r => r.fecha === today).sort((a, b) => b.ts - a.ts);
    const tbody = document.getElementById('regTableBody');
    if (!tbody) return;
    if (!todays.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:28px;color:var(--text-l);font-weight:600">No hay registros hoy. ¡Sé la primera en registrarte! 🌟</td></tr>';
      return;
    }
    tbody.innerHTML = todays.map(r => `
      <tr>
        <td style="font-weight:800;color:var(--text)">${r.nombre}</td>
        <td><span class="type-badge ${r.tipo === 'entrada' ? 'tb-e' : 'tb-s'}">${r.tipo === 'entrada' ? '🟢 Entrada' : '🔴 Salida'}</span></td>
        <td>${r.hora} <span style="font-size:10px;color:var(--text-l)">CDMX</span></td>
        <td>${r.fecha}</td>
        <td style="color:var(--text-l)">${r.obs || '—'}</td>
      </tr>`).join('');
    updateStats();
  }

  // ── RESUMEN SEMANAL ───────────────────────────
  function renderResumen() {
    const wt   = document.getElementById('weekTotal');
    const wp   = document.getElementById('weekPersonal');
    const wtbl = document.getElementById('weekTable');
    if (!wt) return;

    const now  = cdmxNow();
    const day  = now.getDay() || 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - day + 1);
    monday.setHours(0, 0, 0, 0);

    const weekRecs = registros.filter(r => {
      const d = new Date(r.fecha + 'T12:00:00');
      return d >= monday && d <= now;
    });

    wt.textContent = weekRecs.length;
    wp.textContent = new Set(weekRecs.map(r => r.nombre)).size;

    if (!weekRecs.length) {
      wtbl.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-l);font-weight:600;font-size:13px">Los registros de la semana aparecerán aquí 📋</div>';
      return;
    }

    const byDate = {};
    weekRecs.forEach(r => { if (!byDate[r.fecha]) byDate[r.fecha] = []; byDate[r.fecha].push(r); });
    wtbl.innerHTML = Object.entries(byDate).sort().reverse().map(([date, recs]) => `
      <div style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:800;color:var(--text-m);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;padding:6px 0;border-bottom:1px solid var(--border)">
          📅 ${new Date(date + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          <span style="float:right">${recs.length} registros</span>
        </div>
        ${recs.sort((a, b) => a.hora.localeCompare(b.hora)).map(r => `
          <div style="display:flex;align-items:center;gap:10px;padding:6px 8px;border-radius:7px;margin-bottom:4px;background:${r.tipo === 'entrada' ? 'var(--mint-l)' : 'var(--coral-l)'}">
            <span>${r.tipo === 'entrada' ? '🟢' : '🔴'}</span>
            <span style="font-weight:800;font-size:13px;flex:1">${r.nombre}</span>
            <span style="font-size:12px;color:var(--text-m)">${r.hora} CDMX</span>
            ${r.obs ? `<span style="font-size:11px;color:var(--text-l)">${r.obs}</span>` : ''}
          </div>`).join('')}
      </div>`).join('');
  }

  // ── EXPORT CSV — Agrupado: Nombre | Fecha | Entrada | Salida ──
  window.exportCSV = function() {
    if (!registros.length) { alert('No hay registros para exportar'); return; }

    // Group by nombre + fecha → pair entry/exit
    const pairs = {};
    registros.forEach(r => {
      const key = r.nombre + '||' + r.fecha;
      if (!pairs[key]) pairs[key] = { nombre: r.nombre, fecha: r.fecha, entrada: '', salida: '', obs: [] };
      if (r.tipo === 'entrada' && (!pairs[key].entrada || r.hora < pairs[key].entrada))
        pairs[key].entrada = r.hora;
      if (r.tipo === 'salida' && (!pairs[key].salida || r.hora > pairs[key].salida))
        pairs[key].salida = r.hora;
      if (r.obs) pairs[key].obs.push(r.obs);
    });

    const BOM = '\uFEFF'; // UTF-8 BOM — needed for Excel to read accents correctly
    const headers = 'Nombre,Fecha,Hora Entrada,Hora Salida,Observaciones\n';
    const rows = Object.values(pairs)
      .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.nombre.localeCompare(b.nombre))
      .map(p => `"${p.nombre}","${p.fecha}","${p.entrada || '—'}","${p.salida || '—'}","${p.obs.join(' | ')}"`)
      .join('\n');

    const blob = new Blob([BOM + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `asistencia_pandin_${cdmxDateISO()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
})();
