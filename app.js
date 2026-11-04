(function () {
'use strict';

/* ================= CATÁLOGO ================= */
function P(id, nombre, dias, precio, renov) { return { id: id, nombre: nombre, dias: dias, precio: precio, renov: renov || null }; }
function U(id, nombre, grupo, precio) { return { id: id, nombre: nombre, grupo: grupo, planes: [P('m30', '30 días', 30, precio)] }; }
function SP(id, nombre, perfil, completa) {
  return { id: id, nombre: nombre, grupo: 'Streaming', planes: [P('p30', 'Perfil 30 días', 30, perfil), P('c30', 'Completa 30 días', 30, completa)] };
}
var CATALOGO = [], TRAMITES = [];
var BASE_CAT = [
  { id: 'netflix', nombre: 'Netflix', grupo: 'Streaming', planes: [P('p30', 'Perfil 30 días', 30, 80)] },
  { id: 'disney', nombre: 'Disney+ ESPN', grupo: 'Streaming', planes: [P('p15', 'Perfil 15 días', 15, 40), P('p30', 'Perfil 30 días', 30, 70), P('c30', 'Completa 30 días', 30, 200)] },
  { id: 'hbo', nombre: 'HBO Platino', grupo: 'Streaming', planes: [P('p15', 'Perfil 15 días', 15, 30), P('p30', 'Perfil 30 días', 30, 50), P('c30', 'Completa 30 días', 30, 150)] },
  SP('prime', 'Amazon Prime Video', 45, 90),
  SP('crunchy', 'Crunchyroll', 45, 90),
  SP('vix', 'ViX+', 40, 100),
  SP('paramount', 'Paramount+', 50, 100),
  SP('appletv', 'Apple TV', 50, 100),
  SP('viki', 'Viki Rakuten', 50, 90),
  { id: 'avo', nombre: 'AVO TV', grupo: 'Streaming', planes: [
    P('d1', '1 dispositivo', 30, 120, 150), P('d2', '2 dispositivos', 30, 170, 200), P('d3', '3 dispositivos', 30, 220, 250),
    P('d4', '4 dispositivos', 30, 270, 300), P('d5', '5 dispositivos', 30, 320, 350), P('d6', '6 dispositivos', 30, 370, 400)] },
  U('spotify', 'Spotify Premium', 'Música', 80),
  U('youtube', 'YouTube Premium (invitación)', 'Música', 80),
  U('deezer', 'Deezer Premium', 'Música', 60),
  U('canva', 'Canva Pro', 'Educación y trabajo', 60),
  U('duolingo', 'Duolingo', 'Educación y trabajo', 40),
  { id: 'office', nombre: 'Office 365', grupo: 'Educación y trabajo', planes: [P('m30', '30 días', 30, 70), P('a1', '1 año', 365, 320)] },
  U('chatgpt', 'ChatGPT', 'Educación y trabajo', 95),
  U('capcut', 'CapCut', 'Educación y trabajo', 75)
];
var BASE_TRAM = [
  ['Actas y CURP', [['Acta de Nacimiento', 75], ['Acta de Matrimonio', 75], ['Acta de Defunción', 75], ['Acta de Divorcio', 75], ['Acta Foliada', 90], ['CURP Actualizada', 60]]],
  ['SAT y RFC', [['Constancia RFC Premium Original', 180], ['Constancia Fiscal (RFC + IDECF)', 100], ['Constancia Fiscal Clon (Solo CURP)', 80], ['Opinión de Cumplimiento SAT', 90]]],
  ['IMSS y salud', [['Semanas Cotizadas IMSS', 100], ['Número de Seguro Social (NSS)', 80], ['Vigencia de Derechos IMSS', 90], ['Talón de Pago IMSS (Act/Jub)', 100], ['Recetas Médicas', 100], ['Justificante Médico IMSS', 200]]],
  ['Infonavit', [['Desbloqueo de Cuenta Infonavit', 200]]]
];
var PAGO = '💰*`FORMAS DE PAGO`*🇲🇽\n━━━━━━━━━━━━━━━━\n🌿*`TRANSFERENCIA NU`*\n*CLABE:* [ 638180000125995803 ]\n*NOMBRE:* SAMUEL\n*CONCEPTO:* _Tu nombre (No nombres de plataformas)_\n━━━━━━━━━━━━━━━━\n🍃*`DEPÓSITOS EFECTIVO OXXO`*\n*TARJETA:* [ 2242 1701 8222 7318 ]\n━━━━━━━━━━━━━━━━\n> *No manejamos reembolsos, solo saldo a favor.*';
var TIPOS = ['recordatorio', 'vencido', 'promo', 'caida'];
var PLANTILLAS = {
  recordatorio: { nombre: 'Recordatorio', texto: 'Hola {nombre}, te recordamos que tu {servicio} {cuando} ({vence}). Lo contrataste el {inicio}. ¿Te lo renuevo? El costo es de {precio}.\n\n{pago}' },
  vencido: { nombre: 'Ya venció', texto: 'Hola {nombre}, tu {servicio} {cuando}. Si quieres seguir con el servicio, renuévalo por {precio} para conservar tu perfil.\n\n{pago}' },
  promo: { nombre: 'Promoción', texto: 'Hola {nombre}, esta semana tenemos promoción en streaming. Escríbeme y te paso los precios. ¿Te interesa renovar o agregar otra plataforma?' },
  caida: { nombre: 'Falla en la cuenta', texto: 'Hola {nombre}, tu {servicio} presentó una falla. Ya la estamos revisando y te aviso en cuanto quede listo. Gracias por tu paciencia.' }
};
function plantillasBase() { var o = {}; TIPOS.forEach(function (t) { o[t] = PLANTILLAS[t].texto; }); return o; }
var ETIQUETAS = ['Cliente leal', 'Compra rápido', 'Excelente cliente', 'Paga tarde'];
var AVISOS = [10, 7, 5, 4, 3, 2, 1, 0];
var PLANTILLA = 'Hola {nombre}, te recordamos que tu {servicio} {cuando} ({vence}). Lo contrataste el {inicio}. ¿Te lo renuevo? El costo es de {precio}.';
var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
var DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

/* ================= UTILIDADES ================= */
function $(s, r) { return (r || document).querySelector(s); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function pad(n) { return (n < 10 ? '0' : '') + n; }
function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
function addDays(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return iso(d); }
function diffDays(a, b) { return Math.round((parse(a) - parse(b)) / 864e5); }
function hoy() { return iso(new Date()); }
function fmtCorta(s) { var d = parse(s); return d.getDate() + ' de ' + MESES[d.getMonth()]; }
function fmtLarga(s) { var d = parse(s); return DIAS[d.getDay()] + ' ' + d.getDate() + ' ' + MESES[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear(); }
function num(v) { var n = parseFloat(String(v == null ? '' : v).replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n; }
function money(n) { return '$' + (Math.round(n * 100) / 100).toLocaleString('es-MX'); }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function waNum(t) { var d = String(t || '').replace(/\D/g, ''); if (d.length === 10) return '52' + d; if (d.length >= 11) return d; return ''; }
function toast(msg) { var t = $('#toast'); t.textContent = msg; t.style.display = 'block'; clearTimeout(toast.t); toast.t = setTimeout(function () { t.style.display = 'none'; }, 2600); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }

/* ================= ESTADO ================= */
var LS = 'misclientes.v1';
function defaults() { return { v: 2, nextN: 1, clientes: [], ajustes: { hora: 9, avisos: [7, 0], plantillas: plantillasBase(), pago: PAGO, negocio: 'Mis Clientes' }, cuentas: {}, custom: { precios: {}, plataformas: [], tramites: [] } }; }
function normalizar(o) {
  var d = defaults(), a = o.ajustes || {}, pl = Object.assign({}, a.plantillas || {});
  if (a.plantilla && !pl.recordatorio) pl.recordatorio = (a.plantilla === PLANTILLA ? PLANTILLAS.recordatorio.texto : a.plantilla);
  delete a.plantilla;
  TIPOS.forEach(function (t) { if (!pl[t]) pl[t] = PLANTILLAS[t].texto; });
  a.plantillas = pl; if (a.pago == null) a.pago = PAGO;
  o.ajustes = Object.assign(d.ajustes, a);
  o.cuentas = o.cuentas || {};
  o.custom = Object.assign(d.custom, o.custom || {});
  o.clientes = o.clientes || []; o.nextN = o.nextN || 1; o.v = 2;
  return o;
}
function load() {
  try {
    var r = localStorage.getItem(LS);
    if (r) return normalizar(JSON.parse(r));
  } catch (e) {}
  return defaults();
}
var S = load();
function aplicarCatalogo() {
  var cu = S.custom;
  function precios(c) {
    c.planes.forEach(function (p) {
      var o = cu.precios[c.id + '.' + p.id];
      if (o) { if (o.precio != null) p.precio = o.precio; if (p.renov && o.renov != null) p.renov = o.renov; }
    });
    return c;
  }
  CATALOGO = clone(BASE_CAT).map(precios);
  cu.plataformas.forEach(function (c) { CATALOGO.push(clone(c)); });
  TRAMITES = clone(BASE_TRAM).map(function (g) {
    g[1].forEach(function (t) { var o = cu.precios['t.' + t[0]]; if (o && o.precio != null) t[1] = o.precio; });
    return g;
  });
  if (cu.tramites.length) TRAMITES.push(['Mis trámites', cu.tramites.map(function (t) { return [t.nombre, t.precio]; })]);
}
aplicarCatalogo();
function save() {
  try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { toast('No se pudo guardar'); }
  reprogramar();
}
var ui = { tab: 'agenda', fper: 'mes', fref: hoy(), y: new Date().getFullYear(), m: new Date().getMonth(), dia: hoy(), filtro: 'todos', q: '', sheet: null, draft: null, detalle: null, showPass: {} };

/* ================= MODELO ================= */
function catDe(id) { for (var i = 0; i < CATALOGO.length; i++) if (CATALOGO[i].id === id) return CATALOGO[i]; return null; }
function planDe(s) { var c = catDe(s.cat); if (!c) return null; for (var i = 0; i < c.planes.length; i++) if (c.planes[i].id === s.plan) return c.planes[i]; return c.planes[0]; }
function vence(c) { return addDays(c.inicio, c.dias || 0); }
function autoPrecio(d, renovado) {
  var t = 0;
  (d.servicios || []).forEach(function (s) { var p = planDe(s); if (p) t += (renovado && p.renov) ? p.renov : p.precio; });
  return t;
}
function precioCalc(d, renovado) { return Math.max(0, autoPrecio(d, renovado) - num(d.descuento)); }
function pendiente(c) { return Math.max(0, num(c.precio) - num(c.abono)); }
function precioSiguiente(c) { return (c.combo || c.precioEditado) ? c.precio : precioCalc(c, true); }
function costoDe(c) {
  if (c.tipo === 'tramite' || c.combo) return num(c.costoManual);
  var t = 0; (c.servicios || []).forEach(function (s) { t += num(s.costo); }); return t;
}
function resumenServ(c) {
  if (c.tipo === 'tramite') return 'Trámite · ' + (c.tramiteNombre || '');
  var n = (c.servicios || []).map(function (s) { var k = catDe(s.cat), p = planDe(s); return k ? k.nombre + (p && !c.combo ? ' (' + p.nombre + ')' : '') : ''; }).filter(Boolean);
  return (c.combo ? 'Combo: ' : '') + n.join(' + ');
}
function nombreServ(c) {
  var n = (c.servicios || []).map(function (s) { var k = catDe(s.cat), p = planDe(s); return k ? k.nombre + (p ? ' (' + p.nombre + ')' : '') : ''; }).filter(Boolean);
  return (c.combo ? 'combo de ' : 'cuenta de ') + n.join(' + ');
}
function estado(c) {
  var d = diffDays(vence(c), hoy());
  if (d < 0) return { txt: 'Venció hace ' + (-d) + (d === -1 ? ' día' : ' días'), cls: 'red', frase: 'venció hace ' + (-d) + (d === -1 ? ' día' : ' días') };
  if (d === 0) return { txt: 'Hoy', cls: 'red', frase: 'vence hoy' };
  if (d === 1) return { txt: 'Mañana', cls: 'amb', frase: 'vence mañana' };
  return { txt: 'En ' + d + ' días', cls: d <= 7 ? 'blue' : 'gray', frase: 'vence en ' + d + ' días' };
}
function mensaje(c, tipo) {
  tipo = tipo || (diffDays(vence(c), hoy()) < 0 ? 'vencido' : 'recordatorio');
  var v = vence(c), nombre = String(c.nombre || '').trim().split(/\s+/)[0] || '';
  var m = (S.ajustes.plantillas && S.ajustes.plantillas[tipo]) || PLANTILLAS[tipo].texto;
  var map = { nombre: nombre, servicio: nombreServ(c), cuando: estado(c).frase, vence: fmtCorta(v), inicio: fmtCorta(c.inicio), precio: money(precioSiguiente(c)), dias: c.dias, pago: S.ajustes.pago || '', debe: money(pendiente(c)), saldo: money(c.saldo || 0), negocio: S.ajustes.negocio || '' };
  return m.replace(/\{(\w+)\}/g, function (x, k) { return map.hasOwnProperty(k) ? map[k] : x; }).replace(/\n{3,}/g, '\n\n').trim();
}
function abrir(url) { window.location.href = url; }
function waCliente(c, tipo) {
  if (!waNum(c.tel)) { toast('Este cliente no tiene teléfono válido'); return; }
  ui.back = ui.sheet; ui.wa = { id: c.id, tipo: tipo || (diffDays(vence(c), hoy()) < 0 ? 'vencido' : 'recordatorio'), texto: null };
  abrirSheet('wa');
}
function waProveedor(c) {
  var n = waNum(c.provTel); if (!n) { toast('Falta el teléfono del proveedor'); return; }
  var s = (c.servicios || [])[0] || {}, k = catDe(s.cat);
  var t = 'Hola, tengo un problema con la cuenta de ' + (k ? k.nombre : 'un servicio') + (s.correo ? ' (' + s.correo + ')' : '') + '. ¿Me ayudas, por favor?';
  abrir('https://wa.me/' + n + '?text=' + encodeURIComponent(t));
}
function nuevoDraft(tipo) {
  var d = {
    id: '', n: 0, tipo: tipo || 'sub', nombre: '', tel: '', etiquetas: [], notas: '',
    servicios: [{ cat: 'netflix', plan: 'p30', correo: '', pass: '', perfil: '', pin: '', costo: 0 }],
    combo: false, costoManual: 0, tramiteSel: '', tramiteNombre: '',
    inicio: hoy(), dias: 30, diasEditado: false, renov: 0, avisos: S.ajustes.avisos.slice(),
    provNombre: '', provTel: '', precio: 0, precioEditado: false, debe: false, descuento: 0, cortesia: false, abono: 0, saldo: 0, historial: []
  };
  recalc(d);
  return d;
}
function recalc(d) {
  if (d.tipo !== 'sub') return;
  if (!d.diasEditado) { var p = planDe(d.servicios[0] || {}); if (p) d.dias = p.dias; }
  if (!d.combo && !d.precioEditado) d.precio = precioCalc(d, d.renov > 0);
}

/* ================= NOTIFICACIONES ================= */
function LN() { return (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.LocalNotifications) || null; }
var rt;
function reprogramar() { clearTimeout(rt); rt = setTimeout(doReprogramar, 500); }
async function doReprogramar() {
  var ln = LN(); if (!ln) return;
  try {
    var p = await ln.checkPermissions(); if (p.display !== 'granted') return;
    var pend = await ln.getPending();
    var ids = pend.notifications.filter(function (n) { return n.id < 900000; }).map(function (n) { return { id: n.id }; });
    if (ids.length) await ln.cancel({ notifications: ids });
    var list = [], now = Date.now();
    S.clientes.filter(function (c) { return c.tipo === 'sub'; }).forEach(function (c) {
      var v = vence(c);
      (c.avisos || []).forEach(function (d) {
        var idx = AVISOS.indexOf(d); if (idx < 0) return;
        var at = parse(addDays(v, -d)); at.setHours(S.ajustes.hora, 0, 0, 0);
        if (at.getTime() <= now) return;
        list.push({
          id: c.n * 10 + idx,
          title: d === 0 ? 'Vence hoy: ' + c.nombre : 'Vence en ' + d + (d === 1 ? ' día' : ' días') + ': ' + c.nombre,
          body: resumenServ(c) + ' · ' + fmtCorta(v),
          schedule: { at: at, allowWhileIdle: true },
          channelId: 'vencimientos',
          actionTypeId: 'vencimiento',
          extra: { id: c.id }
        });
      });
    });
    if (list.length) await ln.schedule({ notifications: list });
  } catch (e) { console.log('reprogramar', e); }
}
async function initNative() {
  var ln = LN(); if (!ln) return;
  try {
    await ln.createChannel({ id: 'vencimientos', name: 'Vencimientos', description: 'Avisos de clientes por vencer', importance: 5, visibility: 1, vibration: true });
    var p = await ln.checkPermissions();
    if (p.display !== 'granted') await ln.requestPermissions();
    try {
      await ln.registerActionTypes({ types: [{ id: 'vencimiento', actions: [{ id: 'avisar', title: 'Avisar' }, { id: 'pago', title: 'Ya pagó' }] }] });
    } catch (e) { console.log('registerActionTypes', e); }
    ln.addListener('localNotificationActionPerformed', function (e) {
      var id = e && e.notification && e.notification.extra && e.notification.extra.id, a = e && e.actionId;
      if (!id || !byId(id)) return;
      if (ui.sheet) cerrarSheet();
      ui.back = null;
      if (a === 'avisar') { waCliente(byId(id)); }
      else if (a === 'pago') { ui.renconf = id; abrirSheet('renconf'); }
      else abrirDetalle(id);
    });
    reprogramar();
  } catch (e) { console.log('initNative', e); }
  try {
    var App = Capacitor.Plugins.App;
    if (App) App.addListener('appStateChange', function (st) {
      if (!st.isActive) { bgAt = Date.now(); } else if (bgAt && Date.now() - bgAt > 30000) { mostrarLock(); }
    });
    if (App) App.addListener('backButton', function () {
      if (!$('#lock').hidden) { App.minimizeApp(); } else if (ui.sheet) { volver(); } else if (ui.tab !== 'agenda') { setTab('agenda'); } else { App.minimizeApp(); }
    });
  } catch (e) {}
}

/* ================= VISTAS ================= */
function setTab(t) { ui.tab = t; render(); window.scrollTo(0, 0); }
function render() {
  var titles = { agenda: 'Agenda', mes: cap(MESES[ui.m]) + ' ' + ui.y, clientes: 'Clientes', stats: 'Finanzas', ajustes: 'Ajustes' };
  $('#title').textContent = titles[ui.tab];
  var pre = ui.tab === 'stats' ? 'stat' : 'mes';
  $('#topActions').innerHTML = (ui.tab === 'mes' || (ui.tab === 'stats' && ui.fper !== 'siempre'))
    ? '<div class="mnav"><button class="ib" data-act="' + pre + 'Prev" aria-label="Mes anterior"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><button class="ib" data-act="' + pre + 'Hoy" aria-label="Ir a hoy"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M12 13v4"/></svg></button><button class="ib" data-act="' + pre + 'Next" aria-label="Mes siguiente"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button></div>'
    : '';
  var btns = document.querySelectorAll('#nav button');
  for (var i = 0; i < btns.length; i++) btns[i].classList.toggle('on', btns[i].dataset.id === ui.tab);
  $('#fab').style.display = (ui.tab === 'ajustes' || ui.tab === 'stats') ? 'none' : 'block';
  var v = $('#view');
  if (ui.tab === 'agenda') v.innerHTML = viewAgenda();
  else if (ui.tab === 'mes') v.innerHTML = viewMes();
  else if (ui.tab === 'stats') v.innerHTML = viewStats();
  else if (ui.tab === 'clientes') { v.innerHTML = viewClientes(); }
  else v.innerHTML = viewAjustes();
}

function card(c) {
  var st = c.tipo === 'sub' ? estado(c) : null, tel = waNum(c.tel);
  var cuerpo = '<div class="card" data-act="open" data-id="' + c.id + '"><div class="cm"><div class="cn">' + esc(c.nombre) + '</div><div class="cs">' + esc(resumenServ(c)) + '</div></div>' +
    (c.debe ? '<span class="pill red">Debe ' + money(pendiente(c)) + '</span>' : '') +
    (st ? '<span class="pill ' + st.cls + '">' + st.txt + '</span>' : '<span class="pill grn">Venta única</span>') +
    (c.ultAviso === hoy() && st ? '<span class="pill grn">Avisado hoy</span>' : '') +
    (tel && st ? '<button class="wa" data-act="wa" data-id="' + c.id + '">Avisar por WhatsApp</button>' : '') + '</div>';
  if (!st) return cuerpo;
  return '<div class="sw" data-id="' + c.id + '"><div class="swa swl">WhatsApp</div><div class="swa swr"><button class="btn pri sm" data-act="renew" data-id="' + c.id + '">Renovar</button></div>' + cuerpo + '</div>';
}
function subsOrdenados() {
  return S.clientes.filter(function (c) { return c.tipo === 'sub'; }).map(function (c) { return { c: c, v: vence(c) }; })
    .sort(function (a, b) { return a.v < b.v ? -1 : a.v > b.v ? 1 : 0; });
}
function diaCol(s, today) {
  var d = parse(s);
  return '<div class="dd' + (today ? ' today' : '') + '"><small>' + DIAS[d.getDay()] + '</small><b>' + d.getDate() + '</b></div>';
}
function viewAgenda() {
  var h0 = hoy(), subs = subsOrdenados();
  var venc = subs.filter(function (x) { return x.v < h0; }), prox = subs.filter(function (x) { return x.v >= h0; });
  var nHoy = prox.filter(function (x) { return x.v === h0; }).length;
  var n7 = prox.filter(function (x) { return diffDays(x.v, h0) <= 7; }).length;
  var h = '<div class="sum"><span>Hoy <b>' + nHoy + '</b></span><span>Próx. 7 días <b>' + n7 + '</b></span><span>Vencidos <b>' + venc.length + '</b></span><button class="chip" data-act="lote" style="border-color:var(--ac);color:var(--ac)">Avisar clientes</button></div>';
  if (!subs.length) {
    return h + '<div class="dg">' + diaCol(h0, true) + '<div class="dc"><div class="empty">No tienes clientes todavía. Presiona + para agregar uno.</div></div></div>';
  }
  if (venc.length) h += '<div class="sec red">Vencidos</div><div class="pad" style="display:flex;flex-direction:column;gap:8px">' + venc.map(function (x) { return card(x.c); }).join('') + '</div>';
  if (!prox.some(function (x) { return x.v === h0; })) h += '<div class="dg">' + diaCol(h0, true) + '<div class="dc"><div class="empty">No tienes vencimientos hoy.</div></div></div>';
  var mes = '', dia = '';
  prox.forEach(function (x) {
    var ym = x.v.slice(0, 7);
    if (ym !== mes) { if (dia) h += '</div></div>'; dia = ''; mes = ym; var d = parse(x.v); h += '<div class="mh">' + cap(MESES[d.getMonth()]) + ' de ' + d.getFullYear() + '</div>'; }
    if (x.v !== dia) { if (dia) h += '</div></div>'; dia = x.v; h += '<div class="dg">' + diaCol(x.v, x.v === h0) + '<div class="dc">'; }
    h += card(x.c);
  });
  if (dia) h += '</div></div>';
  return h;
}

function viewMes() {
  var y = ui.y, m = ui.m, nd = new Date(y, m + 1, 0).getDate(), off = new Date(y, m, 1, 12).getDay(), h0 = hoy();
  var ven = {}, alt = {};
  S.clientes.forEach(function (c) {
    if (c.tipo === 'sub') { var v = vence(c); (ven[v] = ven[v] || []).push(c); }
    (c.historial || []).forEach(function (x) { (alt[x.fecha] = alt[x.fecha] || []).push({ c: c, h: x }); });
  });
  var h = '<div class="grid7">' + ['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(function (x) { return '<div class="wk">' + x + '</div>'; }).join('') + '</div><div class="grid7">';
  for (var i = 0; i < off; i++) h += '<div></div>';
  for (var d = 1; d <= nd; d++) {
    var s = y + '-' + pad(m + 1) + '-' + pad(d);
    h += '<button class="cell' + (s === h0 ? ' td' : '') + (s === ui.dia ? ' sel' : '') + '" data-act="pickDia" data-id="' + s + '"><b>' + d + '</b><span class="dots">' + (ven[s] ? '<s class="r"></s>' : '') + (alt[s] ? '<s class="g"></s>' : '') + '</span></button>';
  }
  h += '</div><div class="leg"><span><i style="background:var(--red)"></i>Vence</span><span><i style="background:var(--grn)"></i>Contratado o renovado</span></div>';
  h += '<div class="sec">' + cap(fmtLarga(ui.dia)) + '</div><div class="pad" style="display:flex;flex-direction:column;gap:8px">';
  var a = ven[ui.dia] || [], b = alt[ui.dia] || [];
  if (!a.length && !b.length) h += '<div class="empty">No tienes planes este día.</div>';
  if (a.length) h += '<div class="hint">Vencen</div>' + a.map(card).join('');
  if (b.length) h += '<div class="hint">Contratados o renovados</div>' + b.map(function (x) {
    return '<div class="card" data-act="open" data-id="' + x.c.id + '"><div class="cm"><div class="cn">' + esc(x.c.nombre) + '</div><div class="cs">' + esc(resumenServ(x.c)) + '</div></div><span class="pill grn">' + (x.h.tipo === 'renovacion' ? 'Renovó' : 'Contrató') + ' · ' + money(x.h.monto) + '</span></div>';
  }).join('');
  return h + '</div>';
}

function sumar(l, k) { var t = 0; l.forEach(function (x) { t += x[k]; }); return t; }
function entradas() {
  var out = [];
  S.clientes.forEach(function (c) {
    var s0 = (c.servicios || [])[0] || {}, k0 = catDe(s0.cat);
    var plat = c.tipo === 'tramite' ? 'Trámites' : ((c.combo || (c.servicios || []).length > 1) ? 'Combos' : (k0 ? k0.nombre : 'Otros'));
    (c.historial || []).forEach(function (e) {
      var costo = e.costo != null ? e.costo : costoDe(c);
      out.push({ c: c, fecha: e.fecha, mes: e.fecha.slice(0, 7), monto: e.monto, costo: costo, gan: e.monto - costo, plat: plat, tipo: e.tipo });
    });
  });
  return out;
}
function barra(pct, neg) { return '<div style="flex:1;height:8px;border-radius:4px;background:var(--s2);overflow:hidden"><div style="height:100%;width:' + Math.max(2, Math.round(pct)) + '%;background:' + (neg ? 'var(--red)' : 'var(--ac)') + '"></div></div>'; }
var PERS = [['dia', 'Hoy'], ['semana', 'Semana'], ['mes', 'Mes'], ['anio', 'Año'], ['siempre', 'Siempre']];
function fdma(s) { var p = s.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
function rango(per, ref, todas) {
  var h0 = hoy(), d = parse(ref), a, b;
  if (per === 'dia') { a = b = ref; }
  else if (per === 'semana') { a = addDays(ref, -((d.getDay() + 6) % 7)); b = addDays(a, 6); }
  else if (per === 'mes') { a = iso(new Date(d.getFullYear(), d.getMonth(), 1, 12)); b = iso(new Date(d.getFullYear(), d.getMonth() + 1, 0, 12)); }
  else if (per === 'anio') { a = d.getFullYear() + '-01-01'; b = d.getFullYear() + '-12-31'; }
  else {
    a = h0; todas.forEach(function (e) { if (e.fecha < a) a = e.fecha; }); b = h0;
  }
  return [a, b];
}
function movTxt(n) { return n + (n === 1 ? ' movimiento' : ' movimientos'); }
function margenTxt(gan, monto) { return monto > 0 ? (Math.round(gan / monto * 1000) / 10) + '% margen' : 'Sin margen'; }
function viewStats() {
  var h0 = hoy(), all = entradas(), per = ui.fper, ref = ui.fref;
  var r = rango(per, ref, all), a = r[0], b = r[1];
  var sel = all.filter(function (e) { return e.fecha >= a && e.fecha <= b; });
  var ing = sumar(sel, 'monto'), cos = sumar(sel, 'costo'), gan = ing - cos;
  var esHoy = ref === h0, d = parse(ref);
  var titulo = { dia: esHoy ? 'Hoy' : cap(fmtLarga(ref)), semana: 'Semana', mes: cap(MESES[d.getMonth()]) + ' ' + d.getFullYear(), anio: 'Año ' + d.getFullYear(), siempre: 'Siempre' }[per];
  var sub = { dia: 'Corte del día', semana: 'Lunes a domingo', mes: 'Mes de ' + MESES[d.getMonth()], anio: 'Año ' + d.getFullYear(), siempre: 'Todo el historial' }[per];
  var fin = b > h0 && a <= h0 ? h0 : b;
  var h = '<div class="chips pad mb" style="flex-wrap:nowrap;overflow-x:auto">' + PERS.map(function (x) {
    return '<button class="chip' + (per === x[0] ? ' on' : '') + '" data-act="finPer" data-id="' + x[0] + '">' + x[1] + '</button>';
  }).join('') + '</div>';
  h += '<div class="pad"><div class="fcard"><div class="fl">' + esc(titulo) + '</div><div class="fb" style="color:' + (gan < 0 ? 'var(--red)' : 'var(--grn)') + '">' + money(gan) + '</div>' +
    '<div class="hint">' + esc(sub) + ' · ' + movTxt(sel.length) + '</div><div class="fsep"></div>' +
    kv('Ventas', money(ing)) + kv('Costos', money(cos)) + kv(margenTxt(gan, ing), fdma(a) + ' al ' + fdma(fin)) + '</div></div>';

  var meses = [], mx = 1, i, mk = ref.slice(0, 7);
  for (i = 5; i >= 0; i--) {
    var dm = new Date(d.getFullYear(), d.getMonth() - i, 1, 12), k = iso(dm).slice(0, 7);
    var em = all.filter(function (e) { return e.mes === k; }), mi = sumar(em, 'monto'), mc = sumar(em, 'costo');
    meses.push({ k: k, f: iso(dm), n: cap(MESES[dm.getMonth()]) + ' ' + dm.getFullYear(), i: mi, c: mc, g: mi - mc, nm: em.length });
    mx = Math.max(mx, Math.abs(mi - mc));
  }
  h += '<div class="sec">Ganancia de los últimos 6 meses</div><div class="pad" style="display:flex;flex-direction:column;gap:8px">' + meses.slice().reverse().map(function (m) {
    var on = per === 'mes' && m.k === mk;
    return '<button class="mrow' + (on ? ' on' : '') + '" data-act="finMes" data-id="' + m.f + '"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><span style="font-weight:500">' + m.n + '</span><span style="font-size:18px;font-weight:500;color:' + (m.g < 0 ? 'var(--red)' : 'var(--grn)') + '">' + money(m.g) + '</span></div>' +
      '<div style="margin:6px 0">' + barra(Math.abs(m.g) / mx * 100, m.g < 0) + '</div>' +
      '<div class="hint" style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><span>Ventas ' + money(m.i) + ' · Costos ' + money(m.c) + '</span><span>' + margenTxt(m.g, m.i) + ' · ' + movTxt(m.nm) + '</span></div></button>';
  }).join('') + '</div>';

  var pl = {}; sel.forEach(function (e) { var o = pl[e.plat] = pl[e.plat] || { g: 0, n: 0 }; o.g += e.gan; o.n++; });
  var lista = Object.keys(pl).map(function (n) { return { n: n, g: pl[n].g, c: pl[n].n }; }).sort(function (x, y) { return y.g - x.g; });
  h += '<div class="sec">Ganancia por plataforma · ' + esc(titulo) + '</div><div class="pad">';
  if (!lista.length) h += '<div class="empty">Sin ventas en este periodo.</div>';
  else { var m2 = Math.max(1, Math.abs(lista[0].g)); h += lista.map(function (x) { return '<div style="padding:6px 0"><div style="display:flex;justify-content:space-between;font-size:14px"><span>' + esc(x.n) + ' <span class="hint">· ' + x.c + (x.c === 1 ? ' venta' : ' ventas') + '</span></span><span>' + money(x.g) + '</span></div>' + barra(Math.abs(x.g) / m2 * 100, x.g < 0) + '</div>'; }).join(''); }
  h += '</div>';

  var mov = sel.slice().sort(function (x, y) { return x.fecha < y.fecha ? 1 : x.fecha > y.fecha ? -1 : 0; });
  h += '<div class="sec">Movimientos · ' + esc(titulo) + '</div><div class="pad" style="display:flex;flex-direction:column;gap:8px">';
  if (!mov.length) h += '<div class="empty">No hay movimientos en este periodo.</div>';
  else h += mov.slice(0, 40).map(function (e) {
    var t = e.tipo === 'renovacion' ? 'Renovación' : e.tipo === 'venta' ? 'Venta' : 'Alta';
    return '<div class="card" data-act="open" data-id="' + e.c.id + '"><div class="cm"><div class="cn">' + esc(e.c.nombre) + '</div><div class="cs">' + esc(e.plat) + ' · ' + t + ' · ' + fmtCorta(e.fecha) + '</div></div><div style="text-align:right"><div style="font-weight:500">' + money(e.monto) + '</div><div class="hint" style="color:' + (e.gan < 0 ? 'var(--red)' : 'var(--grn)') + '">Ganancia ' + money(e.gan) + '</div></div></div>';
  }).join('') + (mov.length > 40 ? '<div class="hint" style="text-align:center">Se muestran los 40 más recientes de ' + mov.length + '.</div>' : '');
  h += '</div>';

  var deben = S.clientes.filter(function (c) { return c.debe; });
  h += '<div class="sec">Por cobrar · ' + money(sumar(deben.map(function (c) { return { p: pendiente(c) }; }), 'p')) + '</div><div class="pad" style="display:flex;flex-direction:column;gap:8px">' + (deben.length ? deben.map(card).join('') : '<div class="empty">Nadie te debe.</div>') + '</div>';
  var ren = S.clientes.filter(function (c) { return c.tipo === 'sub' && (c.renov || 0) > 0; }).sort(function (x, y) { return y.renov - x.renov; }).slice(0, 5);
  h += '<div class="sec">Clientes que más renuevan</div><div class="pad" style="display:flex;flex-direction:column;gap:8px">' + (ren.length ? ren.map(function (c) {
    return '<div class="card" data-act="open" data-id="' + c.id + '"><div class="cm"><div class="cn">' + esc(c.nombre) + '</div><div class="cs">' + esc(resumenServ(c)) + '</div></div><span class="pill grn">' + c.renov + (c.renov === 1 ? ' renovación' : ' renovaciones') + '</span></div>';
  }).join('') : '<div class="empty">Aún no hay renovaciones. Se llenará cuando toques Renovar.</div>') + '</div>';
  var idos = S.clientes.filter(function (c) { return c.tipo === 'sub' && diffDays(vence(c), h0) < -7; }).sort(function (x, y) { return vence(x) < vence(y) ? 1 : -1; }).slice(0, 8);
  h += '<div class="sec red">Se te fueron · vencidos hace más de 7 días</div><div class="pad" style="display:flex;flex-direction:column;gap:8px">' + (idos.length ? idos.map(card).join('') : '<div class="empty">Ninguno por ahora.</div>') + '</div>';
  return h;
}
function moverFin(dir) {
  var per = ui.fper, d = parse(ui.fref);
  if (per === 'dia') ui.fref = addDays(ui.fref, dir);
  else if (per === 'semana') ui.fref = addDays(ui.fref, 7 * dir);
  else if (per === 'mes') ui.fref = iso(new Date(d.getFullYear(), d.getMonth() + dir, 1, 12));
  else if (per === 'anio') ui.fref = iso(new Date(d.getFullYear() + dir, d.getMonth(), 1, 12));
  render();
}

function viewClientes() {
  var f = ui.filtro, q = ui.q.trim().toLowerCase(), h0 = hoy();
  var list = S.clientes.filter(function (c) {
    if (q && (c.nombre + ' ' + c.tel + ' ' + resumenServ(c)).toLowerCase().indexOf(q) < 0) return false;
    if (f === 'tramites') return c.tipo === 'tramite';
    if (f === 'deben') return !!c.debe;
    if (f === 'porvencer') return c.tipo === 'sub' && diffDays(vence(c), h0) >= 0 && diffDays(vence(c), h0) <= 7;
    if (f === 'vencidos') return c.tipo === 'sub' && diffDays(vence(c), h0) < 0;
    return true;
  }).sort(function (a, b) { return String(a.nombre).localeCompare(String(b.nombre), 'es'); });
  var fl = [['todos', 'Todos'], ['porvencer', 'Por vencer'], ['vencidos', 'Vencidos'], ['deben', 'Deben'], ['tramites', 'Trámites']];
  var h = '<input id="q" class="search" type="text" placeholder="Buscar cliente" value="' + esc(ui.q) + '">';
  h += '<div class="chips pad mb"><button class="chip" data-act="cuentas" style="border-color:var(--ac);color:var(--ac)">Cuentas y perfiles</button></div>';
  h += '<div class="chips pad mb">' + fl.map(function (x) { return '<button class="chip' + (f === x[0] ? ' on' : '') + '" data-act="filtro" data-id="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div>';
  h += '<div id="lista" class="pad" style="display:flex;flex-direction:column;gap:8px">' + (list.length ? list.map(card).join('') : '<div class="empty">No hay clientes aquí.</div>') + '</div>';
  return h;
}

function viewAjustes() {
  var a = S.ajustes, h = '<div class="sb">';
  h += '<p class="fs">Notificaciones</p><div class="blk"><div class="l">Hora del aviso</div><select data-set="hora">';
  for (var i = 6; i <= 21; i++) h += '<option value="' + i + '"' + (a.hora === i ? ' selected' : '') + '>' + (i % 12 || 12) + ':00 ' + (i < 12 ? 'a.m.' : 'p.m.') + '</option>';
  h += '</select><p class="note">Los avisos suenan a esta hora, el día que elijas en cada cliente.</p></div>';
  h += '<div class="blk"><div class="l">Avisos por defecto en clientes nuevos</div><div class="chips">' + AVISOS.map(function (d) {
    return '<button class="chip' + (a.avisos.indexOf(d) >= 0 ? ' on' : '') + '" data-act="avisoDef" data-id="' + d + '">' + avisoTxt(d) + '</button>';
  }).join('') + '</div></div>';
  h += '<div class="blk"><div id="permEstado" class="note" style="margin:0 0 10px">Revisando permisos…</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="permisos">Dar permisos</button><button class="btn sm" data-act="probar">Probar aviso</button></div></div>';
  h += '<p class="fs">Tu negocio</p><div class="blk"><input type="text" data-set="negocio" value="' + esc(a.negocio || '') + '"><p class="note">Sale en el encabezado de los comprobantes.</p></div>';
  h += '<p class="fs">Formas de pago</p><div class="blk"><textarea id="pago" data-set="pago" style="min-height:200px">' + esc(a.pago || '') + '</textarea><p class="note">Se agrega al final de los mensajes de recordatorio y de vencido con {pago}.</p></div>';
  h += '<p class="fs">Mensajes de WhatsApp</p>' + TIPOS.map(function (t) { return '<div class="blk"><div class="l">' + PLANTILLAS[t].nombre + '</div><textarea data-set="pl-' + t + '" style="min-height:130px">' + esc(a.plantillas[t]) + '</textarea></div>'; }).join('') +
    '<p class="note">Se llenan solos con: {nombre} {servicio} {cuando} {vence} {inicio} {precio} {dias} {pago} {debe} {saldo} {negocio}</p><div style="margin:8px 0"><button class="btn sm" data-act="resetPlantilla">Restaurar mensajes</button></div>';
  h += '<p class="fs">Seguridad</p><div class="blk"><button class="btn sm" data-act="pinConfig">' + (pinGet() ? 'Cambiar o quitar el PIN' : 'Activar candado con PIN') + '</button><p class="note">' + (pinGet() ? 'El candado está activo.' : 'Protege las contraseñas de tus clientes.') + '</p></div>';
  h += '<p class="fs">Precios y catálogo</p><div class="blk"><button class="btn sm" data-act="catalogo">Editar precios y plataformas</button><p class="note">Cambia tus precios, agrega plataformas nuevas o trámites nuevos.</p></div>';
  h += '<p class="fs">Respaldo de tus datos</p><div class="blk"><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="exportar">Guardar respaldo</button><button class="btn sm" data-act="importar">Importar archivo</button></div><p class="note">' + (a.ultimoRespaldo ? 'Último respaldo: ' + fmtCorta(a.ultimoRespaldo) + '. ' : 'Aún no has hecho un respaldo. ') + 'Guardar respaldo crea un archivo que puedes mandarte por WhatsApp o guardar en Drive. En otro teléfono, instala la app y toca Importar archivo.</p></div>';
  h += '<p class="note" style="margin:20px 0">Mis Clientes · beta 2 · ' + S.clientes.length + ' registros</p></div>';
  setTimeout(estadoPermisos, 0);
  return h;
}
function avisoTxt(d) { return d === 0 ? 'El mismo día' : d === 1 ? '1 día antes' : d + ' días antes'; }
async function estadoPermisos() {
  var el = $('#permEstado'); if (!el) return;
  var ln = LN();
  if (!ln) { el.textContent = 'Los avisos solo funcionan dentro de la app instalada en el teléfono.'; return; }
  try {
    var p = await ln.checkPermissions(); var t = p.display === 'granted' ? 'Notificaciones permitidas.' : 'Notificaciones sin permiso. Toca "Dar permisos".';
    if (ln.checkExactNotificationSetting) { try { var e = await ln.checkExactNotificationSetting(); if (e.exact_alarm !== 'granted') t += ' Alarmas exactas desactivadas.'; } catch (x) {} }
    el.textContent = t;
  } catch (e) { el.textContent = 'No se pudo revisar los permisos.'; }
}

/* ================= HOJAS: DETALLE ================= */
function kv(a, b) { return '<div class="kv"><span>' + a + '</span><span>' + b + '</span></div>'; }
function copyBtn(t) { return t ? ' <button class="mini" data-act="copy" data-id="' + esc(t) + '">Copiar</button>' : ''; }
function sheetDetalle(c) {
  var st = c.tipo === 'sub' ? estado(c) : null, h = '';
  h += '<div class="sh"><button class="ib" data-act="closeSheet" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button><span class="sp"></span><button class="btn sm" data-act="editc" data-id="' + c.id + '">Editar</button></div><div class="sb">';
  h += '<div class="big">' + esc(c.nombre) + '</div>';
  if (c.etiquetas && c.etiquetas.length) h += '<div class="chips mb">' + c.etiquetas.map(function (e) { return '<span class="chip on">' + esc(e) + '</span>'; }).join('') + '</div>';
  if (c.tel) h += '<div class="hint mb">' + esc(c.tel) + '</div>';
  if (st) {
    h += '<div class="mb"><span class="pill ' + st.cls + '">' + st.txt + '</span> <span class="hint">Vence ' + fmtLarga(vence(c)) + '</span></div>';
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0"><button class="btn wag" data-act="wa" data-id="' + c.id + '">Avisar por WhatsApp</button><button class="btn pri" data-act="renew" data-id="' + c.id + '">Renovar</button></div>';
  }
  if (c.tipo === 'sub') {
    h += '<p class="fs">Servicios</p>';
    (c.servicios || []).forEach(function (s, i) {
      var k = catDe(s.cat), p = planDe(s), key = c.id + i, shown = ui.showPass[key];
      h += '<div class="blk"><div style="font-weight:500">' + esc(k ? k.nombre : '') + '</div><div class="hint">' + esc(p ? p.nombre : '') + '</div>';
      if (s.correo) h += kv('Correo', esc(s.correo) + copyBtn(s.correo));
      if (s.pass) h += kv('Contraseña', (shown ? esc(s.pass) : '••••••••') + ' <button class="mini" data-act="showpass" data-id="' + key + '">' + (shown ? 'Ocultar' : 'Ver') + '</button>' + copyBtn(s.pass));
      if (s.perfil) h += kv('Perfil', esc(s.perfil));
      if (s.pin) h += kv('PIN', esc(s.pin) + copyBtn(s.pin));
      h += '</div>';
    });
    h += '<p class="fs">Fechas</p><div class="blk">' + kv('Contratado', fmtLarga(c.inicio)) + kv('Se repite cada', c.dias + ' días') + kv('Vence', fmtLarga(vence(c))) + kv('Renovaciones', c.renov || 0) + '</div>';
  } else {
    h += '<p class="fs">Trámite</p><div class="blk">' + kv('Trámite', esc(c.tramiteNombre)) + kv('Fecha', fmtLarga(c.inicio)) + '</div>';
  }
  h += '<p class="fs">Dinero</p><div class="blk">' + kv('Precio de venta', money(c.precio)) + kv('Costo', money(costoDe(c))) + '<div class="gan"><span>Ganancia</span><span>' + money(c.precio - costoDe(c)) + '</span></div>' +
    '<div style="margin-top:12px">' + (c.cortesia ? kv('Cortesía', 'Precio $0') : '') + (num(c.descuento) > 0 && !c.combo ? kv('Descuento', '-' + money(c.descuento) + ' en cada cobro') : '') + kv('Saldo a favor', money(c.saldo || 0)) + '</div>' +
    '<div style="margin-top:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap">' + (c.debe ? '<span class="pill red">Debe ' + money(pendiente(c)) + (c.abono ? ' · abonó ' + money(c.abono) : '') + '</span>' : '<span class="pill grn">Pagado</span>') +
    '<button class="btn sm" data-act="pagoTog" data-id="' + c.id + '">' + (c.debe ? 'Marcar como pagado' : 'Marcar como debe') + '</button></div>' +
    '<div style="display:flex;gap:8px;margin-top:12px"><input type="number" inputmode="decimal" id="movIn" placeholder="Monto" style="flex:1;min-width:0"><button class="btn sm" data-act="abono" data-id="' + c.id + '">Abono</button><button class="btn sm" data-act="saldoAdd" data-id="' + c.id + '">+ Saldo</button><button class="btn sm" data-act="saldoQuit" data-id="' + c.id + '">- Saldo</button></div>' +
    '<div style="margin-top:12px"><button class="btn sm" data-act="comp" data-id="' + c.id + '">Enviar comprobante</button></div></div>';
  if (c.provNombre || c.provTel) {
    h += '<p class="fs">Proveedor</p><div class="blk">' + kv('Nombre', esc(c.provNombre)) + kv('Teléfono', esc(c.provTel)) + (waNum(c.provTel) ? '<div style="margin-top:8px"><button class="btn sm" data-act="waProv" data-id="' + c.id + '">Reportar falla por WhatsApp</button></div>' : '') + '</div>';
  }
  if (c.notas) h += '<p class="fs">Notas</p><div class="blk" style="white-space:pre-wrap">' + esc(c.notas) + '</div>';
  if (c.historial && c.historial.length) {
    h += '<p class="fs">Historial</p><div class="blk">' + c.historial.slice().reverse().map(function (x) { return kv(fmtCorta(x.fecha) + ' ' + parse(x.fecha).getFullYear(), (x.tipo === 'renovacion' ? 'Renovación' : x.tipo === 'venta' ? 'Venta' : 'Alta') + ' · ' + money(x.monto)); }).join('') + '</div>';
  }
  h += '<div style="margin-top:24px"><button class="btn dng full" data-act="delc" data-id="' + c.id + '">Eliminar</button></div></div>';
  return h;
}

/* ================= HOJAS: FORMULARIO ================= */
function optsCat(sel) {
  var grupos = {}, orden = [];
  CATALOGO.forEach(function (c) { if (!grupos[c.grupo]) { grupos[c.grupo] = []; orden.push(c.grupo); } grupos[c.grupo].push(c); });
  return orden.map(function (g) { return '<optgroup label="' + g + '">' + grupos[g].map(function (c) { return '<option value="' + c.id + '"' + (c.id === sel ? ' selected' : '') + '>' + esc(c.nombre) + '</option>'; }).join('') + '</optgroup>'; }).join('');
}
function servHTML(d, i) {
  var s = d.servicios[i], k = catDe(s.cat) || CATALOGO[0], b = 'servicios.' + i + '.';
  var h = '<div class="blk">' + (d.servicios.length > 1 ? '<div style="text-align:right"><button class="mini" data-act="delServ" data-id="' + i + '">Quitar</button></div>' : '');
  h += '<div class="g2 mb"><div><div class="l">Plataforma</div><select data-bind="' + b + 'cat" data-re="1">' + optsCat(s.cat) + '</select></div>';
  h += '<div><div class="l">Plan</div><select data-bind="' + b + 'plan" data-re="1">' + k.planes.map(function (p) { return '<option value="' + p.id + '"' + (p.id === s.plan ? ' selected' : '') + '>' + esc(p.nombre) + '</option>'; }).join('') + '</select></div></div>';
  h += '<div class="g2"><div><div class="l">Correo</div><input type="text" list="dl' + i + '" data-bind="' + b + 'correo" value="' + esc(s.correo) + '" autocapitalize="off"><datalist id="dl' + i + '">' + cuentas().filter(function (a) { return a.cat === s.cat; }).map(function (a) { return '<option value="' + esc(a.correo) + '"></option>'; }).join('') + '</datalist></div>';
  h += '<div><div class="l">Contraseña</div><input type="text" data-bind="' + b + 'pass" value="' + esc(s.pass) + '" autocapitalize="off"></div>';
  h += '<div><div class="l">Perfil</div><input type="text" data-bind="' + b + 'perfil" value="' + esc(s.perfil) + '"></div>';
  h += '<div><div class="l">PIN</div><input type="text" inputmode="numeric" data-bind="' + b + 'pin" value="' + esc(s.pin) + '"></div>';
  if (!d.combo) h += '<div><div class="l">Costo del proveedor</div><input type="number" inputmode="decimal" data-num="1" data-bind="' + b + 'costo" value="' + (s.costo || '') + '" placeholder="0"></div>';
  return h + '</div>' + ctaHint(d, s) + '</div>';
}
function sheetForm(d) {
  var nuevo = !d.id, h = '';
  h += '<div class="sh"><button class="ib" data-act="closeSheet" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button><span class="sp"></span><button class="btn pri" data-act="saveForm">Guardar</button></div><div class="sb">';
  if (nuevo) h += '<div class="chips mb"><button class="chip' + (d.tipo === 'sub' ? ' on' : '') + '" data-act="tipo" data-id="sub">Suscripción</button><button class="chip' + (d.tipo === 'tramite' ? ' on' : '') + '" data-act="tipo" data-id="tramite">Trámite (venta única)</button></div>';
  h += '<div class="mb"><div class="l">Nombre del cliente</div><input type="text" data-bind="nombre" value="' + esc(d.nombre) + '" placeholder="Carlos Mendoza"></div>';
  h += '<div class="mb"><div class="l">Teléfono (WhatsApp)</div><input type="tel" data-bind="tel" value="' + esc(d.tel) + '" placeholder="55 1234 5678"></div>';
  var et = ETIQUETAS.concat(d.etiquetas.filter(function (x) { return ETIQUETAS.indexOf(x) < 0; }));
  h += '<div class="chips mb">' + et.map(function (x) { return '<button class="chip' + (d.etiquetas.indexOf(x) >= 0 ? ' on' : '') + '" data-act="etq" data-id="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') + '</div>';
  h += '<div style="display:flex;gap:8px" class="mb"><input type="text" id="etqNueva" placeholder="Otra etiqueta"><button class="btn sm" data-act="etqAdd">Agregar</button></div>';

  if (d.tipo === 'sub') {
    h += '<p class="fs">Servicio</p>';
    for (var i = 0; i < d.servicios.length; i++) h += servHTML(d, i);
    h += '<div class="chips mb"><button class="chip" data-act="addServ">+ Agregar otra plataforma</button><button class="chip' + (d.combo ? ' on' : '') + '" data-act="combo">Es combo</button></div>';
    h += '<p class="fs">Fechas</p><div class="g2"><div><div class="l">Contratado</div><input type="date" data-bind="inicio" data-re="1" value="' + d.inicio + '"></div>';
    var ds = [7, 15, 30, 60, 90, 180, 365]; if (ds.indexOf(d.dias) < 0) ds.push(d.dias); ds.sort(function (a, b) { return a - b; });
    h += '<div><div class="l">Se repite cada</div><select data-bind="dias" data-num="1" data-re="1">' + ds.map(function (x) { return '<option value="' + x + '"' + (x === d.dias ? ' selected' : '') + '>' + x + ' días</option>'; }).join('') + '</select></div>';
    h += '<div style="grid-column:1/-1"><div class="l">Vence (se calcula solo)</div><div class="auto" id="f-vence">' + fmtLarga(vence(d)) + ' · ' + d.dias + ' días</div></div></div>';
    h += '<div class="l" style="margin:14px 0 6px">Avisarme</div><div class="chips">' + AVISOS.map(function (x) { return '<button class="chip' + (d.avisos.indexOf(x) >= 0 ? ' on' : '') + '" data-act="avisoForm" data-id="' + x + '">' + avisoTxt(x) + '</button>'; }).join('') + '</div>';
  } else {
    h += '<p class="fs">Trámite</p><div class="mb"><div class="l">Tipo de trámite</div><select data-bind="tramiteSel" data-re="1"><option value="">Elige uno</option>' +
      TRAMITES.map(function (g) { return '<optgroup label="' + g[0] + '">' + g[1].map(function (t) { return '<option value="' + esc(t[0]) + '"' + (d.tramiteSel === t[0] ? ' selected' : '') + '>' + esc(t[0]) + ' · $' + t[1] + '</option>'; }).join('') + '</optgroup>'; }).join('') +
      '<option value="__otro"' + (d.tramiteSel === '__otro' ? ' selected' : '') + '>Otro trámite</option></select></div>';
    if (d.tramiteSel === '__otro') h += '<div class="mb"><div class="l">Nombre del trámite</div><input type="text" data-bind="tramiteNombre" value="' + esc(d.tramiteNombre) + '"></div>';
    h += '<div class="mb"><div class="l">Fecha de venta</div><input type="date" data-bind="inicio" value="' + d.inicio + '"></div>';
  }

  h += '<p class="fs">Dinero</p><div class="g2"><div><div class="l">' + (d.combo ? 'Precio total del combo' : d.tipo === 'sub' ? 'Precio de venta (de tu lista)' : 'Precio de venta') + '</div><input type="number" inputmode="decimal" data-num="1" data-bind="precio" value="' + (d.precio || '') + '" placeholder="0"></div>';
  if (d.combo || d.tipo === 'tramite') h += '<div><div class="l">Costo total</div><input type="number" inputmode="decimal" data-num="1" data-bind="costoManual" value="' + (d.costoManual || '') + '" placeholder="0"></div>';
  h += '</div><div class="gan"><span>Ganancia</span><span id="f-gan">' + money(d.precio - costoDe(d)) + '</span></div>';
  h += '<div class="g2" style="margin-top:10px">' + (d.tipo === 'sub' && !d.combo ? '<div><div class="l">Descuento por cliente ($)</div><input type="number" inputmode="decimal" data-num="1" data-re="1" data-bind="descuento" value="' + (d.descuento || '') + '" placeholder="0"></div>' : '') +
    '<div><div class="l">Saldo a favor ($)</div><input type="number" inputmode="decimal" data-num="1" data-bind="saldo" value="' + (d.saldo || '') + '" placeholder="0"></div></div>';
  h += '<div class="chips" style="margin-top:10px"><button class="chip' + (d.debe ? ' on' : '') + '" data-act="debeForm">Falta cobrar</button>' + (d.tipo === 'sub' ? '<button class="chip' + (d.cortesia ? ' on' : '') + '" data-act="cortesiaForm">Cortesía (precio $0)</button>' : '') + '</div>';
  if (d.tipo === 'sub' && !d.combo) h += '<p class="note">El descuento se resta del precio de tu lista, también en las renovaciones.</p>';
  if (d.combo) h += '<p class="note">En un combo capturas el total de la venta y el costo tú mismo.</p>';

  h += '<p class="fs">Proveedor</p><div class="g2"><div><div class="l">Nombre</div><input type="text" data-bind="provNombre" value="' + esc(d.provNombre) + '"></div><div><div class="l">Teléfono</div><input type="tel" data-bind="provTel" value="' + esc(d.provTel) + '"></div></div>';
  h += '<p class="fs">Notas</p><textarea data-bind="notas" style="min-height:80px" placeholder="Siempre paga a tiempo">' + esc(d.notas) + '</textarea></div>';
  return h;
}

/* ================= HOJA: MENSAJE ================= */
function sheetWa(c) {
  var w = ui.wa, txt = w.texto != null ? w.texto : mensaje(c, w.tipo);
  var h = '<div class="sh"><button class="ib" data-act="closeSheet" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button><span class="sp"></span></div><div class="sb">';
  h += '<div class="big">' + esc(c.nombre) + '</div><div class="hint mb">' + esc(c.tel || '') + '</div>';
  h += '<div class="l">Tipo de mensaje</div><div class="chips mb">' + TIPOS.map(function (t) { return '<button class="chip' + (w.tipo === t ? ' on' : '') + '" data-act="waTipo" data-id="' + t + '">' + PLANTILLAS[t].nombre + '</button>'; }).join('') + '</div>';
  h += '<div class="l">Mensaje (puedes editarlo antes de enviar)</div><textarea id="waTexto" style="min-height:260px">' + esc(txt) + '</textarea>';
  h += '<div style="margin-top:14px"><button class="btn wag full" data-act="waSend">Enviar por WhatsApp</button></div></div>';
  return h;
}

/* ================= CONFIRMAR RENOVACIÓN ================= */
function sheetRenConf(c) {
  var base = vence(c) > hoy() ? vence(c) : hoy(), nuevo = addDays(base, c.dias || 30), cobra = precioSiguiente(c), sf = num(c.saldo);
  var h = '<div class="sh"><button class="ib" data-act="closeSheet" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button><span class="sp"></span></div><div class="sb">';
  h += '<div class="big">Renovar a ' + esc(c.nombre) + '</div><div class="hint mb">' + esc(resumenServ(c)) + '</div>';
  h += '<div class="blk">' + kv('Vence ahora', fmtLarga(vence(c))) + kv('Nuevo vencimiento', fmtLarga(nuevo)) + kv('Cobras', money(cobra)) + (sf > 0 ? kv('Saldo a favor', money(sf) + ' (se aplica solo)') : '') + '</div>';
  h += '<div style="display:flex;flex-direction:column;gap:10px;margin-top:6px"><button class="btn wag full" data-act="renPago" data-id="' + c.id + '">Sí, ya pagó</button><button class="btn full" data-act="renDebe" data-id="' + c.id + '">Renovar y dejar a deber</button><button class="btn full" data-act="closeSheet">Cancelar</button></div></div>';
  return h;
}

/* ================= AVISAR A VARIOS ================= */
function candidatosLote() {
  var h0 = hoy(), n = ui.lote.dias;
  return S.clientes.filter(function (c) { return c.tipo === 'sub'; }).map(function (c) { return { c: c, d: diffDays(vence(c), h0) }; })
    .filter(function (x) { return x.d <= n && x.d >= -30; })
    .sort(function (a, b) { var ea = a.c.ultAviso === h0 ? 1 : 0, eb = b.c.ultAviso === h0 ? 1 : 0; return (ea - eb) || (a.d - b.d); });
}
function sheetLote() {
  var h0 = hoy(), l = candidatosLote(), con = l.filter(function (x) { return waNum(x.c.tel); }), sin = l.length - con.length;
  var env = con.filter(function (x) { return x.c.ultAviso === h0; }).length;
  var h = '<div class="sh"><button class="ib" data-act="closeSheet" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button><span class="sp"></span></div><div class="sb"><div class="big">Avisar clientes</div>';
  h += '<p class="note" style="margin:0 0 10px">Toca Enviar en cada cliente. WhatsApp se abre con el mensaje listo, y al volver aquí sigues con el siguiente. Incluye vencidos de los últimos 30 días.</p>';
  h += '<div class="chips mb">' + [3, 7, 15, 30].map(function (n) { return '<button class="chip' + (ui.lote.dias === n ? ' on' : '') + '" data-act="loteDias" data-id="' + n + '">Vencen en ' + n + ' días</button>'; }).join('') + '</div>';
  h += '<div class="hint mb">Avisados hoy: ' + env + ' de ' + con.length + (sin ? ' · ' + sin + ' sin teléfono válido' : '') + '</div>';
  if (!con.length) return h + '<div class="empty">No hay clientes por avisar en este periodo.</div></div>';
  con.forEach(function (x) {
    var c = x.c, st = estado(c), hecho = c.ultAviso === h0, tipo = x.d < 0 ? 'Ya venció' : 'Recordatorio';
    h += '<div class="blk" style="' + (hecho ? 'opacity:.6' : '') + '"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><div style="min-width:0"><div class="cn">' + esc(c.nombre) + '</div><div class="cs">' + esc(resumenServ(c)) + '</div></div><span class="pill ' + st.cls + '">' + st.txt + '</span></div>' +
      '<div style="display:flex;gap:8px;align-items:center;margin-top:10px;flex-wrap:wrap"><button class="btn wag sm" data-act="loteSend" data-id="' + c.id + '">' + (hecho ? 'Enviar otra vez' : 'Enviar') + '</button><button class="btn sm" data-act="loteEdit" data-id="' + c.id + '">Editar mensaje</button><span class="hint">' + tipo + '</span>' + (hecho ? '<span class="pill grn">Avisado hoy</span>' : '') + '</div></div>';
  });
  return h + '</div>';
}

/* ================= CUENTAS ================= */
function ctaKey(cat, correo) { return cat + '|' + String(correo || '').trim().toLowerCase(); }
function cuentas() {
  var m = {};
  S.clientes.forEach(function (c) {
    if (c.tipo !== 'sub') return;
    (c.servicios || []).forEach(function (s) {
      var co = String(s.correo || '').trim(); if (!co) return;
      var k = ctaKey(s.cat, co), a = m[k] = m[k] || { key: k, cat: s.cat, correo: co, pass: '', cl: [] };
      if (!a.pass && s.pass) a.pass = s.pass;
      a.cl.push({ c: c, perfil: s.perfil });
    });
  });
  return Object.keys(m).map(function (k) { return m[k]; }).sort(function (x, y) {
    var nx = (catDe(x.cat) || {}).nombre || '', ny = (catDe(y.cat) || {}).nombre || '';
    return nx.localeCompare(ny, 'es') || x.correo.localeCompare(y.correo, 'es');
  });
}
function ctaHint(d, s) {
  var co = String(s.correo || '').trim(); if (!co) return '';
  var k = ctaKey(s.cat, co), meta = S.cuentas[k] || {}, h0 = hoy(), usados = 0, existe = false;
  S.clientes.forEach(function (c) {
    if (c.id === d.id || c.tipo !== 'sub' || diffDays(vence(c), h0) < 0) return;
    (c.servicios || []).forEach(function (x) { if (ctaKey(x.cat, x.correo) === k) { usados++; existe = true; } });
  });
  if (!existe && !meta.cap) return '';
  return '<p class="note">Esta cuenta tiene ' + usados + (usados === 1 ? ' perfil' : ' perfiles') + ' en uso' + (meta.cap ? ' de ' + meta.cap + (usados >= meta.cap ? '. Está llena.' : '. Quedan ' + (meta.cap - usados) + '.') : '.') + '</p>';
}
function sheetCuentas() {
  var h0 = hoy(), lista = cuentas();
  var h = '<div class="sh"><button class="ib" data-act="closeSheet" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button><span class="sp"></span></div><div class="sb"><div class="big">Cuentas y perfiles</div>';
  h += '<p class="note" style="margin:0 0 6px">Se arman solas con el correo de cada cliente. Escribe cuántos perfiles tiene cada cuenta para saber cuáles tienen lugar. Un perfil se libera cuando el cliente vence.</p>';
  if (!lista.length) return h + '<div class="empty">Aún no hay cuentas. Agrega el correo de la cuenta al registrar un cliente.</div></div>';
  lista.forEach(function (a, i) {
    var meta = S.cuentas[a.key] || {}, k = catDe(a.cat), vig = a.cl.filter(function (x) { return diffDays(vence(x.c), h0) >= 0; }), ven = a.cl.length - vig.length;
    var libres = meta.cap ? meta.cap - vig.length : null;
    h += '<div class="blk"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><div style="min-width:0"><div style="font-weight:500">' + esc(k ? k.nombre : '') + '</div><div class="hint" style="word-break:break-all">' + esc(a.correo) + '</div></div>' +
      (meta.caida ? '<span class="pill red">Caída</span>' : (libres == null ? '<span class="pill gray">Sin límite</span>' : libres > 0 ? '<span class="pill grn">Quedan ' + libres + '</span>' : '<span class="pill amb">' + (libres < 0 ? 'Excedida' : 'Llena') + '</span>')) + '</div>';
    h += '<div style="display:flex;align-items:center;gap:8px;margin:10px 0"><span class="hint" style="flex:1">' + vig.length + (vig.length === 1 ? ' perfil en uso' : ' perfiles en uso') + (ven ? ' · ' + ven + ' vencido' + (ven === 1 ? '' : 's') : '') + '</span><span class="hint">Perfiles de la cuenta</span><input type="number" inputmode="numeric" style="width:70px" data-cuenta="' + i + '" value="' + (meta.cap || '') + '" placeholder="0" aria-label="Perfiles de la cuenta"></div>';
    a.cl.forEach(function (x) {
      var st = estado(x.c);
      h += '<div class="row" style="padding:8px 0;gap:8px"><div class="cm"><div class="cn" style="font-size:15px">' + esc(x.c.nombre) + '</div><div class="cs">' + (x.perfil ? 'Perfil ' + esc(x.perfil) + ' · ' : '') + 'vence ' + fmtCorta(vence(x.c)) + '</div></div><span class="pill ' + st.cls + '">' + st.txt + '</span>' +
        (meta.caida && waNum(x.c.tel) ? '<button class="mini" data-act="waCaida" data-id="' + x.c.id + '">Avisar</button>' : '') + '</div>';
    });
    var prov = a.cl.filter(function (x) { return waNum(x.c.provTel); })[0];
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn sm' + (meta.caida ? '' : ' dng') + '" data-act="ctaCaida" data-id="' + i + '">' + (meta.caida ? 'Ya se restableció' : 'Marcar como caída') + '</button>' +
      (prov ? '<button class="btn sm" data-act="waProv" data-id="' + prov.c.id + '">Reportar al proveedor</button>' : '') + '</div></div>';
  });
  return h + '</div>';
}

/* ================= COMPROBANTE ================= */
function folio(c) { return String(c.n || 0).padStart(3, '0') + '-' + String((c.historial || []).length).padStart(2, '0'); }
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function wrapTxt(ctx, txt, x, y, maxW, lh) {
  var words = String(txt).split(' '), line = '', yy = y;
  words.forEach(function (w) { var t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, yy); line = w; yy += lh; } else line = t; });
  ctx.fillText(line, x, yy); return yy;
}
function dibujarComp(cv, c, monto) {
  var W = 900, ctx = cv.getContext('2d'), F = 'Roboto, "Segoe UI", Arial, sans-serif';
  var tram = c.tipo === 'tramite', y = 620, rows = [['Cliente', c.nombre], [tram ? 'Trámite' : 'Servicio', tram ? c.tramiteNombre : resumenServ(c)], ['Fecha de pago', fmtLarga(hoy())]];
  if (!tram) rows.push(['Vigencia', 'Del ' + fmtCorta(c.inicio) + ' al ' + fmtCorta(vence(c))]);
  rows.push(['Folio', folio(c)]);
  if (num(c.saldo) > 0) rows.push(['Saldo a favor', money(c.saldo)]);
  if (c.debe && pendiente(c) > 0) rows.push(['Pendiente por pagar', money(pendiente(c))]);
  var H = 620 + rows.length * 128 + 150;
  cv.width = W; cv.height = H;
  ctx.fillStyle = '#eef1f8'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#3b5ba9'; ctx.fillRect(0, 0, W, 230);
  ctx.textAlign = 'left'; ctx.fillStyle = '#ffffff'; ctx.font = '500 54px ' + F; ctx.fillText(S.ajustes.negocio || 'Mis Clientes', 60, 105);
  ctx.fillStyle = '#d6e0f7'; ctx.font = '34px ' + F; ctx.fillText('Comprobante de pago', 60, 160);
  ctx.fillStyle = '#ffffff'; rr(ctx, 40, 200, 820, H - 240, 30); ctx.fill();
  ctx.fillStyle = '#2e9e5b'; ctx.beginPath(); ctx.arc(450, 290, 58, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(422, 292); ctx.lineTo(442, 315); ctx.lineTo(480, 266); ctx.stroke();
  ctx.textAlign = 'center'; ctx.fillStyle = '#5f6368'; ctx.font = '36px ' + F; ctx.fillText('Pago recibido', 450, 410);
  ctx.fillStyle = '#1f1f1f'; ctx.font = '500 96px ' + F; ctx.fillText(money(monto), 450, 520);
  ctx.textAlign = 'left';
  rows.forEach(function (r) {
    ctx.fillStyle = '#5f6368'; ctx.font = '28px ' + F; ctx.fillText(r[0], 90, y + 20);
    ctx.fillStyle = '#1f1f1f'; ctx.font = '500 34px ' + F; var yy = wrapTxt(ctx, r[1], 90, y + 66, 720, 42);
    ctx.strokeStyle = '#e3e6ee'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(90, yy + 28); ctx.lineTo(810, yy + 28); ctx.stroke();
    y = yy + 62;
  });
  ctx.textAlign = 'center'; ctx.fillStyle = '#5f6368'; ctx.font = '30px ' + F; ctx.fillText('Gracias por tu preferencia', 450, H - 85);
}
function pintarComp() { var cv = $('#cvs'), c = byId(ui.comp && ui.comp.id); if (cv && c) dibujarComp(cv, c, ui.comp.monto); }
function sheetComp(c) {
  var h = '<div class="sh"><button class="ib" data-act="closeSheet" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button><span class="sp"></span></div><div class="sb"><div class="big">Comprobante</div>';
  h += '<div class="mb"><div class="l">Monto pagado</div><input type="number" inputmode="decimal" id="compMonto" value="' + ui.comp.monto + '"></div>';
  h += '<canvas id="cvs" style="width:100%;border-radius:12px;display:block"></canvas>';
  h += '<div style="margin-top:14px"><button class="btn wag full" data-act="compShare">Compartir imagen</button></div><p class="note">Elige WhatsApp en el menú para mandársela al cliente. No incluye correo ni contraseña.</p></div>';
  return h;
}
async function compartirComp() {
  var cv = $('#cvs'), c = byId(ui.comp && ui.comp.id); if (!cv || !c) return;
  var nom = String(c.nombre).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w]+/g, '-'), name = 'Comprobante-' + nom + '-' + hoy() + '.png';
  var url = cv.toDataURL('image/png'), b64 = url.split(',')[1], FS = plug('Filesystem'), SH = plug('Share');
  if (FS && SH) {
    try {
      await FS.writeFile({ path: name, data: b64, directory: 'CACHE' });
      var u = await FS.getUri({ path: name, directory: 'CACHE' });
      await SH.share({ title: 'Comprobante de pago', url: u.uri, dialogTitle: 'Enviar comprobante' });
    } catch (e) { if (!/cancel/i.test(String((e && e.message) || e))) toast('No se pudo compartir la imagen'); }
    return;
  }
  var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); toast('Imagen descargada');
}

/* ================= CANDADO ================= */
var PINK = 'misclientes.pin', lockBuf = '', bgAt = 0;
function pinGet() { try { return localStorage.getItem(PINK) || ''; } catch (e) { return ''; } }
function pinSetStore(v) { try { if (v) localStorage.setItem(PINK, v); else localStorage.removeItem(PINK); } catch (e) {} }
async function pinHash(p) {
  try { var b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('mc:' + p)); return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, '0'); }).join(''); }
  catch (e) { return 'b:' + btoa('mc:' + p); }
}
function drawLock(msg) {
  var l = $('#lock'), d = '';
  for (var i = 0; i < 4; i++) d += '<span style="width:14px;height:14px;border-radius:50%;border:1.5px solid var(--tx2);background:' + (i < lockBuf.length ? 'var(--tx)' : 'transparent') + '"></span>';
  var k = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
  l.innerHTML = '<div style="font-size:22px;font-weight:500;margin-bottom:6px">Mis Clientes</div><div class="hint" style="margin-bottom:22px">' + esc(msg || 'Escribe tu PIN') + '</div><div style="display:flex;gap:16px;margin-bottom:30px">' + d + '</div>' +
    '<div style="display:grid;grid-template-columns:repeat(3,72px);gap:14px">' + k.map(function (x) {
      return x === '' ? '<span></span>' : '<button data-act="lk" data-id="' + x + '" class="lkb" aria-label="' + (x === 'del' ? 'Borrar' : x) + '">' + (x === 'del' ? '⌫' : x) + '</button>';
    }).join('') + '</div><p class="hint" style="margin-top:28px;max-width:280px;text-align:center">¿Olvidaste tu PIN? Borra los datos de la app desde Ajustes de Android y restaura tu respaldo.</p>';
}
function mostrarLock(msg) { if (!pinGet()) return; lockBuf = ''; $('#lock').hidden = false; drawLock(msg); }
async function lockTecla(x) {
  if (x === 'del') lockBuf = lockBuf.slice(0, -1); else if (lockBuf.length < 4) lockBuf += x;
  drawLock();
  if (lockBuf.length === 4) {
    var ok = (await pinHash(lockBuf)) === pinGet();
    if (ok) { $('#lock').hidden = true; lockBuf = ''; } else { lockBuf = ''; drawLock('PIN incorrecto'); }
  }
}
function sheetPin() {
  var tiene = !!pinGet();
  var h = '<div class="sh"><button class="ib" data-act="closeSheet" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button><span class="sp"></span></div><div class="sb"><div class="big">Candado con PIN</div>';
  h += '<p class="note" style="margin:0 0 10px">La app pedirá el PIN al abrirla y al volver después de unos segundos. El PIN no va dentro del respaldo. Si lo olvidas, tendrás que borrar los datos de la app y restaurar tu respaldo, así que guarda uno antes.</p>';
  if (tiene) h += '<div class="mb"><div class="l">PIN actual</div><input type="password" inputmode="numeric" maxlength="4" id="pin0" autocomplete="off"></div>';
  h += '<div class="mb"><div class="l">' + (tiene ? 'PIN nuevo' : 'PIN de 4 números') + '</div><input type="password" inputmode="numeric" maxlength="4" id="pin1" autocomplete="off"></div>' +
    '<div class="mb"><div class="l">Repite el PIN</div><input type="password" inputmode="numeric" maxlength="4" id="pin2" autocomplete="off"></div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" data-act="pinGuardar">' + (tiene ? 'Cambiar PIN' : 'Activar PIN') + '</button>' + (tiene ? '<button class="btn dng" data-act="pinQuitar">Quitar PIN</button>' : '') + '</div></div>';
  return h;
}

/* ================= HOJA: CATÁLOGO ================= */
var GRUPOS = ['Streaming', 'Música', 'Educación y trabajo', 'Otros'];
function esCustom(id) { return S.custom.plataformas.some(function (c) { return c.id === id; }); }
function sheetCatalogo() {
  var h = '<div class="sh"><button class="ib" data-act="closeSheet" aria-label="Cerrar"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button><span class="sp"></span></div><div class="sb">';
  h += '<div class="big">Precios y catálogo</div><p class="note" style="margin:0 0 6px">Los cambios aplican a clientes nuevos y a renovaciones. Lo que ya cobraste no cambia.</p>';
  var orden = [], por = {};
  CATALOGO.forEach(function (c) { if (!por[c.grupo]) { por[c.grupo] = []; orden.push(c.grupo); } por[c.grupo].push(c); });
  orden.forEach(function (g) {
    h += '<p class="fs">' + esc(g) + '</p>';
    por[g].forEach(function (c) {
      var tieneRenov = c.planes.some(function (p) { return p.renov; });
      h += '<div class="blk"><div style="display:flex;justify-content:space-between;align-items:center"><span style="font-weight:500">' + esc(c.nombre) + '</span>' + (esCustom(c.id) ? '<button class="mini" data-act="catDelPlat" data-id="' + c.id + '">Quitar</button>' : '') + '</div>';
      if (tieneRenov) h += '<div class="hint">Primer mes y renovación</div>';
      c.planes.forEach(function (p) {
        h += '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-top:0.5px solid var(--bd);margin-top:6px"><span style="flex:1;min-width:0;font-size:14px">' + esc(p.nombre) + '</span>' +
          '<input type="number" inputmode="decimal" style="width:84px" data-cp="' + c.id + '.' + p.id + '" data-f="precio" value="' + p.precio + '" aria-label="Precio ' + esc(p.nombre) + '">' +
          (p.renov ? '<input type="number" inputmode="decimal" style="width:84px" data-cp="' + c.id + '.' + p.id + '" data-f="renov" value="' + p.renov + '" aria-label="Renovación ' + esc(p.nombre) + '">' : '') + '</div>';
      });
      h += '</div>';
    });
  });
  h += '<p class="fs">Agregar plataforma</p><div class="blk"><div class="mb"><div class="l">Nombre</div><input type="text" id="np-nombre" placeholder="Star+"></div>' +
    '<div class="g2 mb"><div><div class="l">Tipo</div><select id="np-grupo">' + GRUPOS.map(function (g) { return '<option>' + g + '</option>'; }).join('') + '</select></div><div><div class="l">Nombre del plan</div><input type="text" id="np-plan" placeholder="Perfil 30 días"></div>' +
    '<div><div class="l">Duración en días</div><input type="number" inputmode="numeric" id="np-dias" value="30"></div><div><div class="l">Precio de venta</div><input type="number" inputmode="decimal" id="np-precio" placeholder="0"></div></div>' +
    '<button class="btn sm" data-act="catAddPlat">Agregar plataforma</button></div>';
  h += '<p class="fs">Trámites</p>';
  TRAMITES.forEach(function (g) {
    h += '<div class="blk"><div style="font-weight:500;margin-bottom:4px">' + esc(g[0]) + '</div>';
    g[1].forEach(function (t) {
      h += '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-top:0.5px solid var(--bd)"><span style="flex:1;min-width:0;font-size:14px">' + esc(t[0]) + '</span>' +
        '<input type="number" inputmode="decimal" style="width:84px" data-ct="' + esc(t[0]) + '" value="' + t[1] + '" aria-label="Precio ' + esc(t[0]) + '">' +
        (g[0] === 'Mis trámites' ? '<button class="mini" data-act="catDelTram" data-id="' + esc(t[0]) + '">Quitar</button>' : '') + '</div>';
    });
    h += '</div>';
  });
  h += '<div class="blk"><div class="l">Agregar trámite</div><div class="g2 mb"><input type="text" id="nt-nombre" placeholder="Carta de no antecedentes"><input type="number" inputmode="decimal" id="nt-precio" placeholder="Precio"></div><button class="btn sm" data-act="catAddTram">Agregar trámite</button></div></div>';
  return h;
}
function setPrecioCat(key, field, val) {
  var i = key.indexOf('.'), cid = key.slice(0, i), pid = key.slice(i + 1), cu = S.custom, cp = null;
  cu.plataformas.forEach(function (c) { if (c.id === cid) c.planes.forEach(function (p) { if (p.id === pid) cp = p; }); });
  if (cp) cp[field] = val; else { var o = cu.precios[key] = cu.precios[key] || {}; o[field] = val; }
  save(); aplicarCatalogo();
}
function setPrecioTram(nombre, val) {
  var cu = S.custom, t = null;
  cu.tramites.forEach(function (x) { if (x.nombre === nombre) t = x; });
  if (t) t.precio = val; else cu.precios['t.' + nombre] = { precio: val };
  save(); aplicarCatalogo();
}

/* ================= RESPALDO ================= */
function plug(n) { return (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins[n]) || null; }
async function guardarRespaldo() {
  S.ajustes.ultimoRespaldo = hoy(); save();
  var data = JSON.stringify(S, null, 1), name = 'MisClientes-respaldo-' + hoy() + '.json';
  var FS = plug('Filesystem'), SH = plug('Share');
  if (FS && SH) {
    try {
      await FS.writeFile({ path: name, data: data, directory: 'CACHE', encoding: 'utf8' });
      var u = await FS.getUri({ path: name, directory: 'CACHE' });
      await SH.share({ title: 'Respaldo de Mis Clientes', url: u.uri, dialogTitle: 'Guardar respaldo' });
      render(); return;
    } catch (e) {
      if (/cancel/i.test(String((e && e.message) || e))) return;
      toast('No se pudo compartir el archivo'); return;
    }
  }
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' })); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  render(); toast('Respaldo descargado');
}
function importarArchivo(file) {
  if (!file) return;
  var r = new FileReader();
  r.onload = function () {
    var o; try { o = JSON.parse(String(r.result)); } catch (e) { toast('Ese archivo no es un respaldo válido'); return; }
    if (!o || !Array.isArray(o.clientes)) { toast('Ese archivo no es un respaldo válido'); return; }
    if (!window.confirm('Esto reemplaza tus ' + S.clientes.length + ' registros actuales por ' + o.clientes.length + ' del archivo. ¿Continuar?')) return;
    S = normalizar(o); aplicarCatalogo(); save(); render(); toast('Respaldo importado: ' + S.clientes.length + ' registros');
  };
  r.onerror = function () { toast('No se pudo leer el archivo'); };
  r.readAsText(file);
}

/* ================= HOJAS: CONTROL ================= */
function abrirSheet(tipo) { ui.sheet = tipo; var s = $('#sheet'); s.hidden = false; renderSheet(); s.scrollTop = 0; }
function renderSheet() {
  var s = $('#sheet'), top = s.scrollTop;
  if (ui.sheet === 'form') s.innerHTML = sheetForm(ui.draft);
  else if (ui.sheet === 'catalogo') s.innerHTML = sheetCatalogo();
  else if (ui.sheet === 'cuentas') s.innerHTML = sheetCuentas();
  else if (ui.sheet === 'lote') s.innerHTML = sheetLote();
  else if (ui.sheet === 'renconf') { var cr = byId(ui.renconf); if (!cr) { cerrarSheet(); return; } s.innerHTML = sheetRenConf(cr); }
  else if (ui.sheet === 'pin') s.innerHTML = sheetPin();
  else if (ui.sheet === 'comp') { var cc = byId(ui.comp && ui.comp.id); if (!cc) { cerrarSheet(); return; } s.innerHTML = sheetComp(cc); pintarComp(); }
  else if (ui.sheet === 'wa') { var cw = byId(ui.wa && ui.wa.id); if (!cw) { cerrarSheet(); return; } s.innerHTML = sheetWa(cw); }
  else if (ui.sheet === 'detalle') { var c = byId(ui.detalle); if (!c) { cerrarSheet(); return; } s.innerHTML = sheetDetalle(c); }
  s.scrollTop = top;
}
function volver() {
  if ((ui.sheet === 'wa' || ui.sheet === 'comp') && ui.back && ui.back !== ui.sheet) { ui.sheet = ui.back; ui.back = null; renderSheet(); }
  else { ui.back = null; cerrarSheet(); }
}
function cerrarSheet() { ui.sheet = null; ui.draft = null; var s = $('#sheet'); s.hidden = true; s.innerHTML = ''; render(); }
function byId(id) { for (var i = 0; i < S.clientes.length; i++) if (S.clientes[i].id === id) return S.clientes[i]; return null; }
function abrirDetalle(id) { if (!byId(id)) return; ui.detalle = id; abrirSheet('detalle'); }

function setPath(o, path, val) {
  var p = path.split('.');
  for (var i = 0; i < p.length - 1; i++) o = o[p[i]];
  o[p[p.length - 1]] = val;
}
function setBind(t) {
  var d = ui.draft, path = t.dataset.bind, val = t.dataset.num ? num(t.value) : t.value;
  setPath(d, path, val);
  if (path === 'precio') d.precioEditado = true;
  if (path === 'dias') d.diasEditado = true;
}
function updComputed() {
  var d = ui.draft; if (!d) return;
  var v = $('#f-vence'); if (v && d.tipo === 'sub') v.textContent = fmtLarga(vence(d)) + ' · ' + d.dias + ' días';
  var g = $('#f-gan'); if (g) g.textContent = money(d.precio - costoDe(d));
}
function despuesDeCambio(t) {
  var d = ui.draft, p = t.dataset.bind;
  var m = /^servicios\.(\d+)\.cat$/.exec(p);
  if (m) { var s = d.servicios[+m[1]]; s.plan = catDe(s.cat).planes[0].id; if (+m[1] === 0) d.diasEditado = false; }
  if (/^servicios\.0\.plan$/.test(p)) d.diasEditado = false;
  if (p === 'descuento') { d.precioEditado = false; d.cortesia = false; }
  if (p === 'tramiteSel') {
    if (d.tramiteSel === '__otro') { d.tramiteNombre = ''; }
    else if (d.tramiteSel) { TRAMITES.forEach(function (g) { g[1].forEach(function (x) { if (x[0] === d.tramiteSel) { d.tramiteNombre = x[0]; d.precio = x[1]; d.precioEditado = false; } }); }); }
  }
  recalc(d);
}
function guardarForm() {
  var d = ui.draft;
  if (!String(d.nombre).trim()) { toast('Escribe el nombre del cliente'); return; }
  if (d.tipo === 'sub') {
    if (!d.servicios.length || !d.servicios[0].cat) { toast('Elige una plataforma'); return; }
    if (!d.avisos.length) { toast('Elige al menos un aviso'); }
  } else {
    if (!String(d.tramiteNombre).trim()) { toast('Elige o escribe el trámite'); return; }
    d.dias = 0; d.avisos = [];
  }
  d.nombre = d.nombre.trim();
  if (!d.id) {
    d.n = S.nextN++; d.id = 'c' + d.n + Date.now().toString(36);
    d.historial = [{ fecha: d.inicio, monto: d.precio, costo: costoDe(d), tipo: d.tipo === 'sub' ? 'alta' : 'venta' }];
    S.clientes.push(d);
  } else {
    for (var i = 0; i < S.clientes.length; i++) if (S.clientes[i].id === d.id) S.clientes[i] = d;
  }
  save();
  var id = d.id;
  ui.draft = null; ui.sheet = null; $('#sheet').hidden = true; $('#sheet').innerHTML = '';
  render(); toast('Guardado');
  void id;
}
function renovar(c) {
  var v = vence(c), h0 = hoy();
  c.renov = (c.renov || 0) + 1;
  c.inicio = v > h0 ? v : h0;
  if (!c.combo && !c.precioEditado) c.precio = precioCalc(c, true);
  c.historial = c.historial || [];
  c.historial.push({ fecha: h0, monto: c.precio, costo: costoDe(c), tipo: 'renovacion' });
  var extra = '', sf = num(c.saldo);
  if (c.precio > 0 && sf > 0) {
    var ap = Math.min(sf, c.precio); c.saldo = sf - ap;
    if (ap >= c.precio) { c.debe = false; c.abono = 0; extra = ' Se pagó con tu saldo a favor.'; }
    else { c.debe = true; c.abono = ap; extra = ' Se aplicó ' + money(ap) + ' de saldo. Falta ' + money(pendiente(c)) + '.'; }
  }
  save(); renderSheet(); render();
  toast('Renovado. Vence el ' + fmtCorta(vence(c)) + '.' + extra);
}

/* ================= EVENTOS ================= */
var ACTIONS = {
  tab: function (id) { setTab(id); },
  newc: function () { ui.draft = nuevoDraft('sub'); abrirSheet('form'); },
  tipo: function (id) { var d = ui.draft; var n = nuevoDraft(id); n.nombre = d.nombre; n.tel = d.tel; n.etiquetas = d.etiquetas; n.notas = d.notas; ui.draft = n; renderSheet(); },
  open: function (id) { abrirDetalle(id); },
  closeSheet: function () { volver(); },
  editc: function (id) { ui.draft = clone(byId(id)); abrirSheet('form'); },
  wa: function (id) { var c = byId(id); if (c) waCliente(c); },
  waProv: function (id) { var c = byId(id); if (c) waProveedor(c); },
  renew: function (id) { var c = byId(id); if (c) renovar(c); },
  delc: function (id) {
    var c = byId(id); if (!c) return;
    if (!window.confirm('¿Eliminar a ' + c.nombre + '? Esto no se puede deshacer.')) return;
    S.clientes = S.clientes.filter(function (x) { return x.id !== id; });
    save(); cerrarSheet(); toast('Eliminado');
  },
  copy: function (id) { try { navigator.clipboard.writeText(id).then(function () { toast('Copiado'); }, function () { toast('No se pudo copiar'); }); } catch (e) { toast('No se pudo copiar'); } },
  showpass: function (id) { ui.showPass[id] = !ui.showPass[id]; renderSheet(); },
  mesPrev: function () { ui.m--; if (ui.m < 0) { ui.m = 11; ui.y--; } ui.dia = ui.y + '-' + pad(ui.m + 1) + '-01'; render(); },
  mesNext: function () { ui.m++; if (ui.m > 11) { ui.m = 0; ui.y++; } ui.dia = ui.y + '-' + pad(ui.m + 1) + '-01'; render(); },
  mesHoy: function () { var n = new Date(); ui.y = n.getFullYear(); ui.m = n.getMonth(); ui.dia = hoy(); render(); },
  pickDia: function (id) { ui.dia = id; render(); },
  filtro: function (id) { ui.filtro = id; render(); },
  addServ: function () { ui.draft.servicios.push({ cat: 'netflix', plan: 'p30', correo: '', pass: '', perfil: '', pin: '', costo: 0 }); recalc(ui.draft); renderSheet(); },
  delServ: function (id) { ui.draft.servicios.splice(+id, 1); recalc(ui.draft); renderSheet(); },
  combo: function () { var d = ui.draft; d.combo = !d.combo; if (d.combo) { d.precioEditado = true; } else { d.precioEditado = false; recalc(d); } renderSheet(); },
  etq: function (id) { var d = ui.draft, i = d.etiquetas.indexOf(id); if (i >= 0) d.etiquetas.splice(i, 1); else d.etiquetas.push(id); renderSheet(); },
  etqAdd: function () { var i = $('#etqNueva'), v = i && i.value.trim(); if (!v) return; var d = ui.draft; if (d.etiquetas.indexOf(v) < 0) d.etiquetas.push(v); renderSheet(); },
  avisoForm: function (id) { var d = ui.draft, n = +id, i = d.avisos.indexOf(n); if (i >= 0) d.avisos.splice(i, 1); else d.avisos.push(n); renderSheet(); },
  avisoDef: function (id) { var a = S.ajustes.avisos, n = +id, i = a.indexOf(n); if (i >= 0) a.splice(i, 1); else a.push(n); save(); render(); },
  saveForm: function () { guardarForm(); },
  resetPlantilla: function () { S.ajustes.plantillas = plantillasBase(); save(); render(); toast('Mensajes restaurados'); },
  waTipo: function (id) { ui.wa.tipo = id; ui.wa.texto = null; renderSheet(); },
  renPago: function (id) {
    var c = byId(id); if (!c) return;
    renovar(c); c.debe = false; c.abono = 0; save(); cerrarSheet();
  },
  renDebe: function (id) {
    var c = byId(id); if (!c) return;
    renovar(c); if (!c.debe) { c.debe = true; c.abono = 0; } save(); cerrarSheet();
  },
  lote: function () { ui.lote = { dias: 7 }; abrirSheet('lote'); },
  loteDias: function (id) { ui.lote.dias = +id; renderSheet(); },
  loteEdit: function (id) { var c = byId(id); if (c) waCliente(c); },
  loteSend: function (id) {
    var c = byId(id); if (!c) return;
    var n = waNum(c.tel); if (!n) { toast('Este cliente no tiene teléfono válido'); return; }
    var texto = mensaje(c);
    c.ultAviso = hoy(); save(); renderSheet();
    abrir('https://wa.me/' + n + '?text=' + encodeURIComponent(texto));
  },
  waSend: function () {
    var c = byId(ui.wa && ui.wa.id); if (!c) return;
    var n = waNum(c.tel); if (!n) { toast('Este cliente no tiene teléfono válido'); return; }
    var t = ui.wa.texto != null ? ui.wa.texto : mensaje(c, ui.wa.tipo);
    if (ui.wa.tipo === 'recordatorio' || ui.wa.tipo === 'vencido') { c.ultAviso = hoy(); save(); }
    abrir('https://wa.me/' + n + '?text=' + encodeURIComponent(t));
  },
  waCaida: function (id) { var c = byId(id); if (c) waCliente(c, 'caida'); },
  cuentas: function () { abrirSheet('cuentas'); },
  ctaCaida: function (id) { var a = cuentas()[+id]; if (!a) return; var m = S.cuentas[a.key] = S.cuentas[a.key] || {}; m.caida = !m.caida; save(); renderSheet(); toast(m.caida ? 'Cuenta marcada como caída' : 'Cuenta restablecida'); },
  pinConfig: function () { abrirSheet('pin'); },
  pinGuardar: async function () {
    var a = pinGet(), p1 = $('#pin1').value, p2 = $('#pin2').value;
    if (a) { var p0 = $('#pin0').value; if ((await pinHash(p0)) !== a) { toast('El PIN actual no es correcto'); return; } }
    if (!/^\d{4}$/.test(p1)) { toast('El PIN debe tener 4 números'); return; }
    if (p1 !== p2) { toast('Los PIN no coinciden'); return; }
    pinSetStore(await pinHash(p1)); cerrarSheet(); toast('PIN guardado');
  },
  pinQuitar: async function () {
    var a = pinGet(), p0 = $('#pin0').value;
    if ((await pinHash(p0)) !== a) { toast('El PIN actual no es correcto'); return; }
    pinSetStore(''); cerrarSheet(); toast('PIN quitado');
  },
  lk: function (id) { lockTecla(id); },
  exportar: function () { guardarRespaldo(); },
  importar: function () { var f = $('#fileImp'); f.value = ''; f.click(); },
  statPrev: function () { moverFin(-1); },
  statNext: function () { moverFin(1); },
  statHoy: function () { ui.fref = hoy(); render(); },
  finPer: function (id) { ui.fper = id; ui.fref = hoy(); render(); },
  finMes: function (id) { ui.fper = 'mes'; ui.fref = id; render(); window.scrollTo(0, 0); },
  pagoTog: function (id) { var c = byId(id); if (!c) return; c.debe = !c.debe; c.abono = 0; save(); renderSheet(); render(); toast(c.debe ? 'Marcado como debe' : 'Marcado como pagado'); },
  cortesiaForm: function () {
    var d = ui.draft; d.cortesia = !d.cortesia;
    if (d.cortesia) { d.precio = 0; d.precioEditado = true; d.descuento = 0; }
    else { d.precioEditado = false; recalc(d); }
    renderSheet();
  },
  abono: function (id) {
    var c = byId(id), x = num($('#movIn').value); if (!c) return;
    if (!c.debe) { toast('No debe nada. Usa + Saldo para dejarle saldo a favor'); return; }
    if (!x) { toast('Escribe el monto'); return; }
    c.abono = num(c.abono) + x;
    if (c.abono >= c.precio) { var ex = c.abono - c.precio; c.saldo = num(c.saldo) + ex; c.debe = false; c.abono = 0; toast(ex > 0 ? 'Pagado. Quedaron ' + money(ex) + ' de saldo a favor' : 'Pagado completo'); }
    else toast('Abono guardado. Faltan ' + money(pendiente(c)));
    save(); renderSheet(); render();
  },
  saldoAdd: function (id) { var c = byId(id), x = num($('#movIn').value); if (!c) return; if (!x) { toast('Escribe el monto'); return; } c.saldo = num(c.saldo) + x; save(); renderSheet(); toast('Saldo a favor: ' + money(c.saldo)); },
  saldoQuit: function (id) { var c = byId(id), x = num($('#movIn').value); if (!c) return; if (!x) { toast('Escribe el monto'); return; } c.saldo = Math.max(0, num(c.saldo) - x); save(); renderSheet(); toast('Saldo a favor: ' + money(c.saldo)); },
  comp: function (id) { var c = byId(id); if (!c) return; ui.back = ui.sheet; ui.comp = { id: id, monto: c.precio }; abrirSheet('comp'); },
  compShare: function () { compartirComp(); },
  debeForm: function () { ui.draft.debe = !ui.draft.debe; renderSheet(); },
  catalogo: function () { abrirSheet('catalogo'); },
  catAddPlat: function () {
    var n = $('#np-nombre').value.trim(), pn = $('#np-plan').value.trim() || 'Perfil 30 días', dias = Math.round(num($('#np-dias').value)) || 30, pr = num($('#np-precio').value), g = $('#np-grupo').value;
    if (!n) { toast('Escribe el nombre de la plataforma'); return; }
    if (!pr) { toast('Escribe el precio de venta'); return; }
    S.custom.plataformas.push({ id: 'x' + Date.now().toString(36), nombre: n, grupo: g, planes: [{ id: 'p1', nombre: pn, dias: dias, precio: pr, renov: null }] });
    save(); aplicarCatalogo(); renderSheet(); toast('Plataforma agregada');
  },
  catDelPlat: function (id) {
    if (S.clientes.some(function (c) { return (c.servicios || []).some(function (s) { return s.cat === id; }); })) { toast('Hay clientes con esta plataforma. No se puede quitar'); return; }
    if (!window.confirm('¿Quitar esta plataforma del catálogo?')) return;
    S.custom.plataformas = S.custom.plataformas.filter(function (c) { return c.id !== id; });
    save(); aplicarCatalogo(); renderSheet();
  },
  catAddTram: function () {
    var n = $('#nt-nombre').value.trim(), pr = num($('#nt-precio').value);
    if (!n) { toast('Escribe el nombre del trámite'); return; }
    if (!pr) { toast('Escribe el precio'); return; }
    S.custom.tramites.push({ nombre: n, precio: pr }); save(); aplicarCatalogo(); renderSheet(); toast('Trámite agregado');
  },
  catDelTram: function (id) {
    S.custom.tramites = S.custom.tramites.filter(function (t) { return t.nombre !== id; });
    save(); aplicarCatalogo(); renderSheet();
  },
  permisos: async function () {
    var ln = LN(); if (!ln) { toast('Solo funciona en la app instalada'); return; }
    try {
      await ln.requestPermissions();
      if (ln.changeExactNotificationSetting && ln.checkExactNotificationSetting) { var e = await ln.checkExactNotificationSetting(); if (e.exact_alarm !== 'granted') await ln.changeExactNotificationSetting(); }
    } catch (x) {}
    estadoPermisos(); reprogramar();
  },
  probar: async function () {
    var ln = LN(); if (!ln) { toast('Solo funciona en la app instalada'); return; }
    try {
      var p = await ln.checkPermissions(); if (p.display !== 'granted') { p = await ln.requestPermissions(); }
      if (p.display !== 'granted') { toast('Falta el permiso de notificaciones'); return; }
      var ej = S.clientes.filter(function (c) { return c.tipo === 'sub'; })[0];
      var nt = { id: 999999, title: ej ? 'Prueba: vence en 7 días: ' + ej.nombre : 'Aviso de prueba', body: ej ? resumenServ(ej) + ' · toca Avisar o Ya pagó' : 'Así te van a llegar los vencimientos.', schedule: { at: new Date(Date.now() + 5000), allowWhileIdle: true }, channelId: 'vencimientos' };
      if (ej) { nt.actionTypeId = 'vencimiento'; nt.extra = { id: ej.id }; }
      await ln.schedule({ notifications: [nt] });
      toast('Llega en 5 segundos. Puedes cerrar la app.');
    } catch (e) { toast('No se pudo programar la prueba'); }
  }
};
document.addEventListener('click', function (e) {
  if (Date.now() < (ui.swUntil || 0)) { e.preventDefault(); return; }
  var t = e.target.closest('[data-act]'); if (!t) return;
  var f = ACTIONS[t.dataset.act]; if (f) f(t.dataset.id, t, e);
});
var sheetEl = $('#sheet');
sheetEl.addEventListener('input', function (e) {
  var t = e.target; if (!t.dataset || !t.dataset.bind || t.dataset.re || !ui.draft) return;
  setBind(t); updComputed();
});
sheetEl.addEventListener('change', function (e) {
  var t = e.target;
  if (t.dataset && t.dataset.cuenta != null && t.dataset.cuenta !== '') { var ac2 = cuentas()[+t.dataset.cuenta]; if (ac2) { var mm = S.cuentas[ac2.key] = S.cuentas[ac2.key] || {}; mm.cap = Math.max(0, Math.round(num(t.value))); save(); renderSheet(); } return; }
  if (t.dataset && t.dataset.cp) { setPrecioCat(t.dataset.cp, t.dataset.f, num(t.value)); toast('Precio guardado'); return; }
  if (t.dataset && t.dataset.ct) { setPrecioTram(t.dataset.ct, num(t.value)); toast('Precio guardado'); return; }
  if (!t.dataset || !t.dataset.bind || !ui.draft) return;
  setBind(t);
  var mc = /^servicios\.(\d+)\.correo$/.exec(t.dataset.bind || '');
  if (mc) {
    var sv = ui.draft.servicios[+mc[1]], k0 = ctaKey(sv.cat, sv.correo);
    var ac = cuentas().filter(function (x) { return x.key === k0; })[0];
    if (ac && !sv.pass) sv.pass = ac.pass || '';
    renderSheet(); return;
  }
  if (t.dataset.re) { despuesDeCambio(t); renderSheet(); } else updComputed();
});
document.addEventListener('input', function (e) {
  var t = e.target;
  if (t.id === 'q') { ui.q = t.value; var l = $('#lista'); var keep = t.selectionStart; var tmp = document.createElement('div'); tmp.innerHTML = viewClientes(); l.innerHTML = tmp.querySelector('#lista').innerHTML; void keep; }
  if (t.id === 'waTexto' && ui.wa) ui.wa.texto = t.value;
  if (t.id === 'compMonto' && ui.comp) { ui.comp.monto = num(t.value); pintarComp(); }
  if (t.dataset && t.dataset.set) {
    var sk = t.dataset.set;
    if (sk.indexOf('pl-') === 0) S.ajustes.plantillas[sk.slice(3)] = t.value; else if (sk === 'pago') S.ajustes.pago = t.value; else if (sk === 'negocio') S.ajustes.negocio = t.value; else return;
    try { localStorage.setItem(LS, JSON.stringify(S)); } catch (x) {}
  }
});
document.addEventListener('change', function (e) {
  var t = e.target;
  if (t.dataset && t.dataset.set === 'hora') { S.ajustes.hora = +t.value; save(); toast('Hora guardada'); }
});

var sw = null;
function swCerrar(salvo) {
  var abiertas = document.querySelectorAll('.sw.open');
  for (var i = 0; i < abiertas.length; i++) if (abiertas[i] !== salvo) { abiertas[i].classList.remove('open'); abiertas[i].querySelector('.card').style.transform = ''; }
}
document.addEventListener('pointerdown', function (e) {
  var w = e.target.closest('.sw');
  if (!w) { swCerrar(null); return; }
  if (e.target.closest('.swa')) return;
  if (w.classList.contains('open')) { swCerrar(null); ui.swUntil = Date.now() + 350; sw = null; return; }
  swCerrar(w);
  if (e.target.closest('button,input,select,textarea')) { sw = null; return; }
  sw = { w: w, x: e.clientX, y: e.clientY, t: 0, drag: false, id: e.pointerId };
});
document.addEventListener('pointermove', function (e) {
  if (!sw || e.pointerId !== sw.id) return;
  var dx = e.clientX - sw.x, dy = e.clientY - sw.y;
  if (!sw.drag) {
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.5) { sw.drag = true; sw.w.classList.add('drag'); try { sw.w.setPointerCapture(e.pointerId); } catch (x) {} }
    else if (Math.abs(dy) > 10) { sw = null; return; }
  }
  if (sw.drag) { sw.t = Math.max(-130, Math.min(130, dx)); sw.w.querySelector('.card').style.transform = 'translateX(' + sw.t + 'px)'; }
});
function swFin(e) {
  if (!sw || e.pointerId !== sw.id) return;
  var w = sw.w, t = sw.t, drag = sw.drag, card = w.querySelector('.card'); sw = null;
  if (!drag) return;
  ui.swUntil = Date.now() + 350; w.classList.remove('drag');
  if (t > 90) { card.style.transform = ''; var c = byId(w.dataset.id); if (c) waCliente(c); }
  else if (t < -55) { w.classList.add('open'); card.style.transform = 'translateX(-110px)'; }
  else { card.style.transform = ''; }
}
document.addEventListener('pointerup', swFin);
document.addEventListener('pointercancel', swFin);
document.addEventListener('visibilitychange', function () { if (document.hidden) bgAt = Date.now(); else if (bgAt && Date.now() - bgAt > 30000) mostrarLock(); });
$('#fileImp').addEventListener('change', function (e) { importarArchivo(e.target.files && e.target.files[0]); });
render();
mostrarLock();
initNative();
})();
