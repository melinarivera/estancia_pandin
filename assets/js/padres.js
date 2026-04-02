/* ═══════════════════════════════════════════════
   PANDÍN — padres.js
   Portal de Padres de Familia
   ═══════════════════════════════════════════════ */
(function() {
  const CREDS = { '2026padres': 'abrilpandin' };
  const WA_NUMBER = '525564793805';

  // ── LOGIN ──────────────────────────────────────
  window.padresLogin = function() {
    const u = document.getElementById('padresUser').value.trim();
    const p = document.getElementById('padresPass').value.trim();
    if (CREDS[u] && CREDS[u] === p) {
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('dashSection').style.display  = 'block';
      document.getElementById('dashSection').classList.add('reveal', 'visible');
      loadAlumnoFromStorage();
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
        initPersonas();
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

  // ── TAB SWITCHING ──────────────────────────────
  window.pTab = function(tab) {
    const tabs = ['circulares', 'menu', 'calendario', 'galeria', 'pagos', 'alumno'];
    document.querySelectorAll('.ptab').forEach((btn, i) => {
      btn.classList.toggle('active', tabs[i] === tab);
    });
    tabs.forEach(t => {
      const el = document.getElementById('tp-' + t);
      if (el) el.classList.toggle('active', t === tab);
    });
    if (tab === 'alumno') initPersonas();
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
    }, 50);
  };

  // ── PAGOS — FILE UPLOAD ────────────────────────
  let pagoHistorial = [];

  window.handleFileSelect = function(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 5 MB.');
      input.value = '';
      return;
    }
    const preview = document.getElementById('filePreview');
    const area    = document.getElementById('uploadArea');
    if (!preview || !area) return;

    preview.style.display = 'block';
    area.style.display    = 'none';

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        preview.innerHTML = `
          <div class="fp-wrap">
            <img src="${e.target.result}" class="fp-img" alt="Comprobante">
            <div class="fp-info">
              <span class="fp-name">📄 ${file.name}</span>
              <button class="fp-remove" onclick="removeFile()">✕ Cambiar archivo</button>
            </div>
          </div>`;
      };
      reader.readAsDataURL(file);
    } else {
      preview.innerHTML = `
        <div class="fp-wrap">
          <div class="fp-pdf">📋</div>
          <div class="fp-info">
            <span class="fp-name">📄 ${file.name}</span>
            <button class="fp-remove" onclick="removeFile()">✕ Cambiar archivo</button>
          </div>
        </div>`;
    }
  };

  window.removeFile = function() {
    const preview = document.getElementById('filePreview');
    const area    = document.getElementById('uploadArea');
    const input   = document.getElementById('pFile');
    if (preview) { preview.style.display = 'none'; preview.innerHTML = ''; }
    if (area)    area.style.display = 'flex';
    if (input)   input.value = '';
  };

  window.sendPaymentWA = function() {
    const mes   = (document.getElementById('pMes')   || {}).value   || '';
    const monto = (document.getElementById('pMonto') || {}).value   || '';
    const forma = (document.getElementById('pForma') || {}).value   || '';
    if (!mes) { alert('Por favor selecciona el mes que estás pagando'); return; }

    const msg = encodeURIComponent(
      `Hola Pandín 🐼 Comparto mi comprobante de colegiatura:\n` +
      `📅 Mes: ${mes}\n` +
      `💰 Monto: $${monto || '—'} MXN\n` +
      `💳 Forma de pago: ${forma}\n\n` +
      `Adjunto mi comprobante en el siguiente mensaje. ✅`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
    recordPago(mes, monto, forma);
  };

  window.sendPaymentEmail = function() {
    const mes   = (document.getElementById('pMes')   || {}).value || '';
    const monto = (document.getElementById('pMonto') || {}).value || '';
    const forma = (document.getElementById('pForma') || {}).value || '';
    if (!mes) { alert('Por favor selecciona el mes que estás pagando'); return; }

    const subject = encodeURIComponent(`Comprobante de colegiatura — ${mes}`);
    const body    = encodeURIComponent(
      `Hola,\n\nAdjunto mi comprobante de colegiatura:\n` +
      `Mes: ${mes}\nMonto: $${monto || '—'} MXN\nForma de pago: ${forma}\n\n` +
      `Quedo atento/a a la confirmación.\n\nGracias.`
    );
    window.location.href = `mailto:info@pandin.com.mx?subject=${subject}&body=${body}`;
    recordPago(mes, monto, forma);
  };

  function recordPago(mes, monto, forma) {
    pagoHistorial.unshift({ mes, monto, forma, fecha: new Date().toLocaleDateString('es-MX') });
    renderPagoHistorial();
  }

  function renderPagoHistorial() {
    const el = document.getElementById('pagoHistorial');
    if (!el || !pagoHistorial.length) return;
    el.innerHTML = pagoHistorial.map(p => `
      <div class="pago-item">
        <div class="pi-icon">💳</div>
        <div class="pi-data">
          <strong>${p.mes}</strong>
          <span>$${p.monto || '—'} MXN · ${p.forma} · Enviado el ${p.fecha}</span>
        </div>
        <span class="pi-badge">Enviado</span>
      </div>`).join('');
  }

  // ── DATOS DEL ALUMNO ───────────────────────────
  let personas = [];

  function initPersonas() {
    if (personas.length === 0) {
      personas = [{ nombre: '', parentesco: '', telefono: '' }];
    }
    renderPersonas();
  }

  function renderPersonas() {
    const c = document.getElementById('personasContainer');
    if (!c) return;
    c.innerHTML = personas.map((p, i) => `
      <div class="persona-row">
        <div class="row gy-2 align-items-center">
          <div class="col-md-4">
            <div class="pfield" style="margin:0">
              <label>Nombre completo</label>
              <input type="text" value="${p.nombre}" placeholder="Nombre de la persona" oninput="updatePersona(${i},'nombre',this.value)">
            </div>
          </div>
          <div class="col-md-3">
            <div class="pfield" style="margin:0">
              <label>Parentesco</label>
              <select onchange="updatePersona(${i},'parentesco',this.value)">
                <option value="" ${p.parentesco===''?'selected':''}>Selecciona...</option>
                <option value="Madre" ${p.parentesco==='Madre'?'selected':''}>Madre</option>
                <option value="Padre" ${p.parentesco==='Padre'?'selected':''}>Padre</option>
                <option value="Abuelo/a" ${p.parentesco==='Abuelo/a'?'selected':''}>Abuelo/a</option>
                <option value="Tío/a" ${p.parentesco==='Tío/a'?'selected':''}>Tío/a</option>
                <option value="Hermano/a" ${p.parentesco==='Hermano/a'?'selected':''}>Hermano/a</option>
                <option value="Otro familiar" ${p.parentesco==='Otro familiar'?'selected':''}>Otro familiar</option>
                <option value="Cuidador/a" ${p.parentesco==='Cuidador/a'?'selected':''}>Cuidador/a</option>
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <div class="pfield" style="margin:0">
              <label>Teléfono</label>
              <input type="tel" value="${p.telefono}" placeholder="55 xxxx xxxx" oninput="updatePersona(${i},'telefono',this.value)">
            </div>
          </div>
          <div class="col-md-2 d-flex align-items-end pb-1">
            ${personas.length > 1
              ? `<button class="btn btn-sm" style="background:var(--coral-l);color:#B84030;font-size:12px;border:none;border-radius:8px;padding:8px 12px" onclick="removePersona(${i})">✕ Quitar</button>`
              : ''}
          </div>
        </div>
      </div>`).join('');
  }

  window.updatePersona = function(i, field, value) {
    if (personas[i]) personas[i][field] = value;
  };

  window.addPersona = function() {
    personas.push({ nombre: '', parentesco: '', telefono: '' });
    renderPersonas();
  };

  window.removePersona = function(i) {
    personas.splice(i, 1);
    renderPersonas();
  };

  window.saveAlumno = function() {
    const data = {
      nombre:       (document.getElementById('aNombre')      || {}).value || '',
      nacimiento:   (document.getElementById('aNacimiento')  || {}).value || '',
      sangre:       (document.getElementById('aSangre')      || {}).value || '',
      alergias:     (document.getElementById('aAlergias')    || {}).value || '',
      medicamentos: (document.getElementById('aMedicamentos')|| {}).value || '',
      cuidados:     (document.getElementById('aCuidados')    || {}).value || '',
      personas:     personas
    };
    if (!data.nombre) { alert('Por favor ingresa el nombre del menor'); return; }
    localStorage.setItem('pandin_alumno', JSON.stringify(data));
    alert(`✅ Datos de ${data.nombre} guardados correctamente.\n\nRecuerda usar "Enviar a Pandín" para el registro oficial.`);
  };

  window.sendAlumnoWA = function() {
    const nombre       = (document.getElementById('aNombre')       || {}).value || '';
    const nacimiento   = (document.getElementById('aNacimiento')   || {}).value || '';
    const sangre       = (document.getElementById('aSangre')       || {}).value || '';
    const alergias     = (document.getElementById('aAlergias')     || {}).value || '';
    const medicamentos = (document.getElementById('aMedicamentos') || {}).value || '';
    const cuidados     = (document.getElementById('aCuidados')     || {}).value || '';

    if (!nombre) { alert('Por favor ingresa el nombre del menor antes de enviar'); return; }

    const personasText = personas
      .filter(p => p.nombre)
      .map(p => `  • ${p.nombre} (${p.parentesco || 'sin especificar'}) — Tel: ${p.telefono || 'no indicado'}`)
      .join('\n') || '  No se indicaron personas autorizadas';

    const msg = encodeURIComponent(
      `Hola Pandín 🐼 Comparto los datos de mi hijo/a para registro:\n\n` +
      `👶 *Nombre:* ${nombre}\n` +
      `📅 *Fecha de nacimiento:* ${nacimiento || 'No indicado'}\n` +
      `🩸 *Tipo de sangre:* ${sangre || 'No indicado'}\n` +
      `⚠️ *Alergias:* ${alergias || 'Ninguna'}\n` +
      `💊 *Medicamentos/Condiciones:* ${medicamentos || 'Ninguna'}\n` +
      `📋 *Cuidados especiales:* ${cuidados || 'Ninguno'}\n\n` +
      `👤 *Personas autorizadas para recogerlo/a:*\n${personasText}\n\n` +
      `Por favor confirmar recepción. ¡Gracias! 🐼`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  };

  function loadAlumnoFromStorage() {
    const saved = localStorage.getItem('pandin_alumno');
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
      setVal('aNombre',       data.nombre);
      setVal('aNacimiento',   data.nacimiento);
      setVal('aSangre',       data.sangre);
      setVal('aAlergias',     data.alergias);
      setVal('aMedicamentos', data.medicamentos);
      setVal('aCuidados',     data.cuidados);
      if (data.personas && data.personas.length) {
        personas = data.personas;
      }
    } catch(e) { /* ignore corrupted data */ }
  }
})();
