/* ═══════════════════════════════════════════════
   PANDÍN — chat.js
   Asistente Virtual con Claude API
   ═══════════════════════════════════════════════ */
(function() {
  const CM   = document.getElementById('chatMsgs');
  const CO   = document.getElementById('chatOpts');
  const CF   = document.getElementById('chatForms');
  const CIN  = document.getElementById('chatIn');
  const LDR  = document.getElementById('chatLoader');
  if (!CM) return;

  let cap = {}, selDay = '';

  function scrl() { setTimeout(() => CM.scrollTop = CM.scrollHeight, 80); }

  function addMsg(txt, who='bot', html=false) {
    const wrap = document.createElement('div');
    wrap.className = 'bwrap' + (who==='user'?' user':'');
    const av = document.createElement('div');
    av.className = 'bav2 ' + (who==='user'?'usr':'bot');
    av.textContent = who==='user' ? '😊' : '🐼';
    const bbl = document.createElement('div');
    bbl.className = 'bmsg ' + (who==='user'?'usr':'bot');
    html ? bbl.innerHTML = txt : bbl.textContent = txt;
    wrap.appendChild(av); wrap.appendChild(bbl);
    CM.appendChild(wrap); scrl();
  }

  function showTyping() {
    const wrap = document.createElement('div'); wrap.className='bwrap'; wrap.id='typing';
    const av = document.createElement('div'); av.className='bav2 bot'; av.textContent='🐼';
    const t = document.createElement('div'); t.className='typing-wrap';
    t.innerHTML='<span></span><span></span><span></span>';
    wrap.appendChild(av); wrap.appendChild(t); CM.appendChild(wrap); scrl();
  }
  function rmTyping() { const t=document.getElementById('typing'); if(t)t.remove(); }

  function setOpts(arr) {
    CO.innerHTML = '';
    arr.forEach(o => {
      const b = document.createElement('button');
      b.className = 'copt ' + o.c; b.textContent = o.l;
      b.onclick = o.f; CO.appendChild(b);
    });
  }

  function botReply(txt, delay=620, html=true) {
    showTyping();
    return new Promise(r => setTimeout(() => { rmTyping(); addMsg(txt,'bot',html); r(); }, delay));
  }

  function showMenu() {
    setOpts([
      {l:'📋 Información general', c:'co-m', f:()=>opt('info')},
      {l:'📚 Modelo pedagógico',    c:'co-b', f:()=>opt('ped')},
      {l:'✨ Servicios',             c:'co-c', f:()=>opt('srv')},
      {l:'💰 Costos',               c:'co-l', f:()=>opt('cos')},
      {l:'📅 Agendar visita',       c:'co-s', f:()=>opt('cit')},
      {l:'📍 Ubicación',            c:'co-m', f:()=>opt('ubi')},
    ]);
  }

  function opt(o) {
    CO.innerHTML=''; CF.innerHTML='';
    const back = [{l:'🏠 Menú principal', c:'co-c', f:()=>{CF.innerHTML='';showMenu();}}];
    if (o==='info') {
      addMsg('📋 Información general','user');
      botReply('¡Con gusto! Datos de <strong>Pandín</strong> 🐼:<br><br>🕖 <b>Horario:</b> Lun–Vie 7am–7pm<br>👶 <b>Estancia:</b> 3 meses – 4 años<br>🎒 <b>Afterschool:</b> 4–6 años<br>📅 <b>Visitas gratis:</b> 10:30–11:30am<br>🏅 <b>SEP</b> Certificada<br>📍 Uxmal 750, Letrán Valle, BJ, CDMX').then(()=>setOpts([
        {l:'📚 Pedagogía',c:'co-b',f:()=>opt('ped')},{l:'💰 Costos',c:'co-l',f:()=>opt('cos')},{l:'📅 Agendar cita',c:'co-s',f:()=>opt('cit')},...back
      ]));
    } else if (o==='ped') {
      addMsg('📚 Modelo pedagógico','user');
      botReply('En Pandín tenemos dos pilares 🌈:<br><br>📋 <b>Educación Inicial SEP</b> — currículo oficial para niños de 0–6 años, reconocido en todo México.<br><br>🧠 <b>Inteligencias Múltiples (Gardner)</b> — potenciamos las 8 inteligencias: musical, lógico-matemática, lingüística, espacial, corporal, interpersonal, intrapersonal y naturalista.<br><br>¡Cada niño aprende a su ritmo y a su manera! 💛').then(()=>setOpts([
        {l:'✨ Servicios',c:'co-c',f:()=>opt('srv')},{l:'📅 Agendar visita',c:'co-s',f:()=>opt('cit')},...back
      ]));
    } else if (o==='srv') {
      addMsg('✨ Servicios','user');
      botReply('Ofrecemos:<br><br>👶 <b>Estancia (3m–4 años)</b><br>✅ Estimulación temprana incluida<br>✅ Desayuno y comida incluidos<br>⚠️ Colaciones vespertinas = costo extra<br><br>🎒 <b>Afterschool (4–6 años)</b><br>✅ Actividades y cuidado vespertino').then(()=>setOpts([
        {l:'💰 Costos',c:'co-l',f:()=>opt('cos')},{l:'📅 Agendar cita',c:'co-s',f:()=>opt('cit')},...back
      ]));
    } else if (o==='cos') {
      addMsg('💰 Costos','user');
      botReply('Manejamos <b>costos personalizados</b> 💛<br><br>La tarifa se define según los días y el horario que necesites. En la visita gratuita te preparamos un presupuesto a tu medida, ¡sin compromiso ni presión!').then(()=>setOpts([
        {l:'📅 Visita gratuita',c:'co-s',f:()=>opt('cit')},...back
      ]));
    } else if (o==='ubi') {
      addMsg('📍 Ubicación','user');
      botReply('📍 <b>Uxmal 750</b>, Col. Letrán Valle<br>Alc. Benito Juárez, CP 03650, CDMX<br><br>🚇 Metro <b>Eugenia</b> o <b>Etiopía</b> (Línea 3)<br>🚌 Metrobús <b>Eje 1 Sur</b><br>📱 +52 (1) 55 6479 3805<br>✉️ info@pandin.com.mx').then(()=>setOpts([
        {l:'📅 Agendar visita',c:'co-s',f:()=>opt('cit')},...back
      ]));
    } else if (o==='cit') {
      addMsg('📅 Agendar visita','user');
      botReply('¡Perfecto! 🎉 Las visitas son <b>gratuitas</b>, Lun–Vie de <b>10:30 a 11:30am</b>.<br><br>Te mostraré todo, resolveré tus dudas y te daré una cotización personalizada. ¿Continuamos?').then(()=>setOpts([
        {l:'✅ Sí, continuar',c:'co-s',f:showDataForm},{l:'🏠 Regresar',c:'co-c',f:()=>{CF.innerHTML='';showMenu();}}
      ]));
    }
  }

  function showDataForm() {
    CO.innerHTML='';
    botReply('Perfecto, necesito algunos datos 📝',400).then(()=>{
      const c=document.createElement('div'); c.className='cf-wrap frm';
      c.innerHTML=`<div class="cf-title">📝 Datos de contacto</div>
      <div class="cf-grid"><div class="cf-field"><label>Nombre completo *</label><input id="fn" placeholder="María López García"></div><div class="cf-field"><label>WhatsApp *</label><input id="ft" placeholder="55 1234 5678" type="tel"></div></div>
      <div class="cf-grid cf-full"><div class="cf-field"><label>Correo electrónico</label><input id="fe" placeholder="tu@correo.com" type="email"></div></div>
      <div class="cf-grid"><div class="cf-field"><label>Nombre del niño/a *</label><input id="fni" placeholder="Sofía"></div><div class="cf-field"><label>Edad *</label><input id="fed" placeholder="2 años / 8 meses"></div></div>
      <div class="cf-grid"><div class="cf-field"><label>Horario requerido</label><select id="fh"><option value="">Selecciona...</option><option>Tiempo completo (7am–7pm)</option><option>Matutino (7am–1pm)</option><option>Vespertino (1pm–7pm)</option><option>Algunos días</option><option>A discutir</option></select></div><div class="cf-field"><label>Servicio</label><select id="fs"><option value="">Selecciona...</option><option>Estancia (3m–4 años)</option><option>Afterschool (4–6 años)</option><option>No estoy seguro/a</option></select></div></div>
      <div class="cf-grid cf-full"><div class="cf-field"><label>¿Cuidado especial?</label><textarea id="fes" placeholder="Alergias, medicamentos, necesidades especiales (opcional)"></textarea></div></div>
      <button class="cf-btn cf-btn-g" onclick="window.chatSubmitData()">Continuar → elegir fecha</button>`;
      CF.appendChild(c); scrl();
    });
  }

  window.chatSubmitData = function() {
    const n  = document.getElementById('fn').value.trim();
    const t  = document.getElementById('ft').value.trim();
    const ni = document.getElementById('fni').value.trim();
    const e  = document.getElementById('fed').value.trim();
    if (!n||!t||!ni||!e) { alert('Por favor completa los campos obligatorios (*)'); return; }
    cap = {n, t, email:document.getElementById('fe').value.trim(), ni, e,
      h:document.getElementById('fh').value, s:document.getElementById('fs').value,
      es:document.getElementById('fes').value.trim()};
    document.querySelector('.cf-wrap.frm').remove();
    addMsg('✅ Datos enviados','user');
    botReply(`¡Gracias, <b>${n.split(' ')[0]}</b>! 🌸 Ahora elige tu fecha de visita.`, 600).then(showCitaForm);
  };

  function showCitaForm() {
    const avail=[]; let d=new Date(); d.setDate(d.getDate()+1);
    while(avail.length<12){ if(d.getDay()>=1&&d.getDay()<=5) avail.push(new Date(d)); d.setDate(d.getDate()+1); }
    const dn=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
    const mn=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const c=document.createElement('div'); c.className='cf-wrap cit';
    c.innerHTML=`<div class="cf-title">📅 Elige tu fecha de visita</div>
    <div style="font-size:11px;color:#6A40A8;font-weight:700;margin-bottom:10px">Lun–Vie · 10:30am – 11:30am · Gratis</div>
    <div class="days-grid">${avail.map(dd=>`<button class="day-btn" onclick="window.chatSelDay(this,'${dd.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'})}')"><div style="font-weight:800;font-size:11px">${dn[dd.getDay()]}</div><div style="font-size:10px;opacity:.7">${dd.getDate()} ${mn[dd.getMonth()]}</div></button>`).join('')}</div>
    <div class="cf-grid"><div class="cf-field"><label>Hora preferida</label><select id="cH"><option>10:30 am</option><option>11:00 am</option><option>11:30 am</option></select></div></div>
    <div class="cf-grid cf-full"><div class="cf-field"><label>Comentario (opcional)</label><textarea id="cC" style="height:48px" placeholder="Algo que quieras comentar..."></textarea></div></div>
    <button class="cf-btn cf-btn-l" onclick="window.chatSubmitCita()">📅 Confirmar mi visita 🐼</button>`;
    CF.appendChild(c); scrl();
  }

  window.chatSelDay = function(btn, txt) {
    document.querySelectorAll('.day-btn').forEach(b=>b.classList.remove('sel'));
    btn.classList.add('sel'); selDay=txt;
  };

  window.chatSubmitCita = function() {
    if (!selDay) { alert('Por favor selecciona un día'); return; }
    const h=document.getElementById('cH').value, com=document.getElementById('cC').value.trim();
    cap.dia=selDay; cap.hora=h; cap.com=com;
    document.querySelector('.cf-wrap.cit').remove();
    addMsg(`📅 Visita: ${selDay} a las ${h}`,'user');

    const rm=document.createElement('div'); rm.className='resumen-mini';
    rm.innerHTML=`<h4>📋 Resumen de tu solicitud</h4>
    <div class="rr"><span class="rr-l">Nombre</span><span class="rr-v">${cap.n}</span></div>
    <div class="rr"><span class="rr-l">WhatsApp</span><span class="rr-v">${cap.t}</span></div>
    ${cap.email?`<div class="rr"><span class="rr-l">Email</span><span class="rr-v">${cap.email}</span></div>`:''}
    <div class="rr"><span class="rr-l">Niño/a</span><span class="rr-v">${cap.ni}, ${cap.e}</span></div>
    ${cap.h?`<div class="rr"><span class="rr-l">Horario</span><span class="rr-v">${cap.h}</span></div>`:''}
    <div class="rr" style="background:rgba(169,139,212,.08);padding:5px 4px;border-radius:6px;margin-top:4px">
      <span class="rr-l" style="color:#6A40A8;font-weight:800">📅 Visita</span>
      <span class="rr-v" style="color:#6A40A8;font-weight:800">${cap.dia} · ${cap.hora}</span>
    </div>`;
    CF.appendChild(rm);

    const msg=encodeURIComponent(`¡Hola Pandín! 🐼 Me registré con el asistente virtual.\n\n👤 ${cap.n}\n📞 ${cap.t}\n👶 ${cap.ni}, ${cap.e}\n📅 Visita: ${cap.dia} a las ${cap.hora}\n${cap.h?`🕖 Horario: ${cap.h}\n`:''}${cap.s?`🎨 Servicio: ${cap.s}\n`:''}${cap.es?`⚠️ ${cap.es}\n`:''}${com?`💬 ${com}\n`:''}\n¡Gracias!`);

    setTimeout(()=>{
      const conf=document.createElement('div'); conf.className='confirm-card';
      conf.innerHTML=`<div class="cc-i">🎉</div><h3>¡Tu visita está casi lista!</h3><p>Confírmanos por WhatsApp y te esperaremos el <strong>${cap.dia} a las ${cap.hora}</strong> en Uxmal 750 💛</p><a class="wa-btn" href="https://wa.me/525164793805?text=${msg}" target="_blank">💬 Confirmar por WhatsApp</a>`;
      CF.appendChild(conf); scrl();
      setTimeout(()=>botReply(`¡Listo, ${cap.n.split(' ')[0]}! 🌸 Te esperamos con los brazos abiertos. ¿Algo más?`,800).then(()=>setOpts([
        {l:'📋 Más info',c:'co-m',f:()=>opt('info')},
        {l:'📍 Cómo llegar',c:'co-b',f:()=>opt('ubi')},
        {l:'🏠 Menú',c:'co-c',f:()=>{CF.innerHTML='';showMenu();}}
      ])),800);
    }, 600);
  };

  // ── Free text with Claude API ──────────────────
  window.sendChat = async function() {
    const txt = CIN.value.trim(); if (!txt) return; CIN.value='';
    addMsg(txt,'user'); CO.innerHTML='';
    LDR.classList.add('on'); showTyping();
    const sys=`Eres el asistente de Estancia Infantil Pandín en CDMX.
Datos: Uxmal 750, Col. Letrán Valle, Alc. Benito Juárez, CP 03650, CDMX.
Horario: Lun-Vie 7am-7pm. Estancia 3m-4a, Afterschool 4-6a.
Visitas gratis Lun-Vie 10:30-11:30am. WA: +52 (1) 55 6479 3805. email: info@pandin.com.mx.
Incluido menores 4a: estimulación temprana, desayuno y comida.
Colaciones vespertinas costo extra. Costos personalizados.
Certificación SEP Educación Inicial. Modelo: Inteligencias Múltiples Gardner 8 tipos.
Redes: facebook.com/estancia.pandin | instagram.com/estancia.pandin.
Responde cálidamente, máximo 4 líneas. Solo temas de Pandín.`;
    try {
      const r=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:350,system:sys,
          messages:[{role:'user',content:txt}]})});
      const d=await r.json(); rmTyping();
      addMsg(d.content?.[0]?.text||'Lo siento, intenta de nuevo.','bot');
    } catch { rmTyping(); addMsg('Disculpa, hubo un problema. Escríbenos al +52 (1) 55 6479 3805 😊','bot'); }
    LDR.classList.remove('on');
    setOpts([{l:'📅 Agendar visita',c:'co-s',f:()=>opt('cit')},{l:'🏠 Menú principal',c:'co-c',f:()=>{CF.innerHTML='';showMenu();}}]);
  };

  CIN.addEventListener('keydown', e=>{ if(e.key==='Enter') window.sendChat(); });

  // ── Init ──────────────────────────────────────
  addMsg('¡Hola! 👋 Bienvenida/o a <b>Estancia Infantil Pandín</b> 🐼<br><br>Soy tu asistente virtual con IA. Puedo informarte sobre nuestros servicios, el modelo pedagógico SEP e Inteligencias Múltiples, y ayudarte a agendar tu visita gratuita. ¿En qué te ayudo?','bot',true);
  showMenu();
})();
