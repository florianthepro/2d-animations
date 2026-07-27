/* STRICHE — .2dsk-Laufzeit (Editor + Player teilen sie). */
(function (global) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- Easing ---------- */
  function cubicBezier(x1, y1, x2, y2) {
    if (x1 === y1 && x2 === y2) return (t) => t;
    const A = (a, b) => 1 - 3 * b + 3 * a;
    const B = (a, b) => 3 * b - 6 * a;
    const C = (a) => 3 * a;
    const calc = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
    const slope = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
    function tForX(x) {
      let t = x;
      for (let i = 0; i < 8; i++) {
        const xe = calc(t, x1, x2) - x;
        if (Math.abs(xe) < 1e-4) return t;
        const d = slope(t, x1, x2);
        if (Math.abs(d) < 1e-6) break;
        t -= xe / d;
      }
      let lo = 0, hi = 1; t = x;
      for (let i = 0; i < 20; i++) {
        const xe = calc(t, x1, x2);
        if (Math.abs(xe - x) < 1e-4) break;
        if (xe < x) lo = t; else hi = t;
        t = (lo + hi) / 2;
      }
      return t;
    }
    return (x) => calc(tForX(x), y1, y2);
  }
  function bounceOut(t) {
    const n = 7.5625, d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
    if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
    return n * (t -= 2.625 / d) * t + 0.984375;
  }
  function elasticOut(t) {
    if (t === 0 || t === 1) return t;
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  }
  const EASING = {
    linear: (t) => t,
    ease: cubicBezier(0.25, 0.1, 0.25, 1),
    'ease-in': cubicBezier(0.42, 0, 1, 1),
    'ease-out': cubicBezier(0, 0, 0.58, 1),
    'ease-in-out': cubicBezier(0.42, 0, 0.58, 1),
    smooth: cubicBezier(0.16, 1, 0.3, 1),         // kräftiges Abbremsen
    gravity: cubicBezier(0.55, 0, 0.9, 0.2),      // Beschleunigen
    back: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    bounce: bounceOut,
    elastic: elasticOut,
  };
  const EASING_NAMES = Object.keys(EASING);

  /* ---------- Modell ---------- */
  const CHANNELS = ['x', 'y', 'rot', 'sx', 'sy', 'op', 'armL', 'armR', 'legL', 'legR'];
  const STICK_CHANNELS = ['armL', 'armR', 'legL', 'legR'];

  const SM = { headR: 16, headCy: -60, neck: -44, shoulder: -42, armLen: 30, legLen: 42, footY: 39 };

  function baseVal(o, ch) {
    const p = o.props || {};
    switch (ch) {
      case 'x': return p.x || 0;
      case 'y': return p.y || 0;
      case 'rot': return p.rot || 0;
      case 'sx': return p.sx == null ? 1 : p.sx;
      case 'sy': return p.sy == null ? 1 : p.sy;
      case 'op': return p.op == null ? 1 : p.op;
      case 'armL': return p.armL == null ? -30 : p.armL;
      case 'armR': return p.armR == null ? 30 : p.armR;
      case 'legL': return p.legL == null ? -20 : p.legL;
      case 'legR': return p.legR == null ? 20 : p.legR;
    }
    return 0;
  }

  function channelValue(o, ch, t) {
    const keys = o.keys && o.keys[ch];
    if (!keys || keys.length === 0) return baseVal(o, ch);
    if (t <= keys[0].t) return keys[0].v;
    const last = keys[keys.length - 1];
    if (t >= last.t) return last.v;
    for (let i = 0; i < keys.length - 1; i++) {
      const k0 = keys[i], k1 = keys[i + 1];
      if (t >= k0.t && t <= k1.t) {
        const span = (k1.t - k0.t) || 1e-6;
        const u = (t - k0.t) / span;
        const fn = EASING[k0.e] || EASING['ease-in-out'];
        return k0.v + (k1.v - k0.v) * fn(u);
      }
    }
    return baseVal(o, ch);
  }

  function stateAt(o, t) {
    const s = {};
    for (const ch of CHANNELS) s[ch] = channelValue(o, ch, t);
    return s;
  }

  function pivotOf(o) {
    const p = o.props || {};
    if (p.pivotX != null || p.pivotY != null) return [p.pivotX || 0, p.pivotY || 0];
    if (o.type === 'stickman') return [0, SM.footY];   // Füße = Standfläche
    return [0, 0];
  }

  /* ---------- Rendering ---------- */
  function el(name, attrs) {
    const e = document.createElementNS(NS, name);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function limbEnd(jx, jy, len, angDeg) {
    const a = angDeg * Math.PI / 180;
    return [jx + len * Math.sin(a), jy + len * Math.cos(a)];
  }

  function mouthNode(kind) {
    const y = -53;
    if (kind === 'none') return null;
    if (kind === 'o') return el('circle', { cx: 0, cy: y + 1, r: 3, class: 'sk-o' });
    let d;
    if (kind === 'smile') d = `M-6 ${y - 1} Q0 ${y + 5} 6 ${y - 1}`;
    else if (kind === 'frown') d = `M-6 ${y + 3} Q0 ${y - 3} 6 ${y + 3}`;
    else d = `M-5 ${y} L5 ${y}`;                 // line
    return el('path', { d });
  }

  function buildStickman(o) {
    const p = o.props || {};
    const stroke = p.stroke || '#111';
    const g = el('g', { class: 'sk-obj sk-stick' });
    const mk = (a) => { const e = el('line', a); e.setAttribute('stroke', stroke); return e; };
    const body = mk({ x1: 0, y1: SM.neck, x2: 0, y2: 0 });
    const head = el('circle', { cx: 0, cy: SM.headCy, r: p.headR || SM.headR, class: 'sk-head' });
    head.setAttribute('stroke', stroke);
    const armL = mk({ x1: 0, y1: SM.shoulder, x2: 0, y2: 0 });
    const armR = mk({ x1: 0, y1: SM.shoulder, x2: 0, y2: 0 });
    const legL = mk({ x1: 0, y1: 0, x2: 0, y2: 0 });
    const legR = mk({ x1: 0, y1: 0, x2: 0, y2: 0 });
    g.appendChild(body); g.appendChild(armL); g.appendChild(armR);
    g.appendChild(legL); g.appendChild(legR); g.appendChild(head);
    // Gesicht
    const eyes = p.eyes || 'dots';
    if (eyes === 'dots') {
      for (const dx of [-5.5, 5.5]) { const d = el('circle', { cx: dx, cy: SM.headCy - 3, r: 2.2, class: 'sk-dot' }); g.appendChild(d); }
    } else if (eyes === 'x') {
      for (const dx of [-5.5, 5.5]) {
        const e1 = el('path', { d: `M${dx - 3} ${SM.headCy - 6} l6 6 M${dx + 3} ${SM.headCy - 6} l-6 6`, class: 'sk-x' });
        e1.setAttribute('stroke', stroke); g.appendChild(e1);
      }
    }
    const m = mouthNode(p.mouth || 'line');
    if (m) { if (m.tagName === 'path') m.setAttribute('stroke', stroke); g.appendChild(m); }
    return { g, parts: { body, armL, armR, legL, legR, head } };
  }

  function buildSplat(o) {
    const p = o.props || {};
    const color = p.color || '#e0122b';
    const r = p.r || 40, n = p.n || 12;
    const g = el('g', { class: 'sk-obj sk-splat' });
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + (i % 2) * 0.35;
      const len = r * (0.55 + ((i * 37) % 10) / 16);
      const ln = el('line', { x1: 0, y1: 0, x2: (Math.cos(a) * len).toFixed(1), y2: (Math.sin(a) * len).toFixed(1) });
      ln.setAttribute('stroke', color); g.appendChild(ln);
    }
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.6;
      const d = r * (1.05 + (i % 2) * 0.25);
      const c = el('circle', { cx: (Math.cos(a) * d).toFixed(1), cy: (Math.sin(a) * d).toFixed(1), r: 3 + (i % 3) });
      c.setAttribute('fill', color); c.setAttribute('stroke', 'none'); g.appendChild(c);
    }
    return { g, parts: {} };
  }

  function buildPrimitive(type, props) {
    const p = props || {};
    let node;
    if (type === 'line') node = el('line', { x1: p.x1 || 0, y1: p.y1 || 0, x2: p.x2 == null ? 40 : p.x2, y2: p.y2 || 0 });
    else if (type === 'circle') node = el('circle', { cx: p.cx || 0, cy: p.cy || 0, r: p.r == null ? 20 : p.r });
    else if (type === 'rect') node = el('rect', { x: p.x2 || 0, y: p.y2 || 0, width: p.w == null ? 60 : p.w, height: p.h == null ? 40 : p.h, rx: p.rx || 0 });
    else if (type === 'path') node = el('path', { d: p.d || 'M0 0 L40 0' });
    else if (type === 'text') { node = el('text', { x: 0, y: 0, 'text-anchor': p.anchor || 'middle' }); node.textContent = p.text || 'Text'; node.setAttribute('font-size', p.size || 24); }
    else node = el('rect', { x: 0, y: 0, width: 20, height: 20 });
    if (type === 'text') { node.setAttribute('fill', p.fill || '#111'); node.setAttribute('stroke', 'none'); }
    else { node.setAttribute('fill', p.fill || 'none'); node.setAttribute('stroke', p.stroke || '#111'); }
    return node;
  }

  function buildObject(o) {
    if (o.type === 'stickman') return buildStickman(o);
    if (o.type === 'splat') return buildSplat(o);
    if (o.type === 'group') {
      const g = el('g', { class: 'sk-obj sk-group' });
      (o.props.children || []).forEach((ch) => g.appendChild(buildPrimitive(ch.type, ch)));
      return { g, parts: {} };
    }
    const g = el('g', { class: 'sk-obj sk-prim' });
    g.appendChild(buildPrimitive(o.type, o.props || {}));
    return { g, parts: {} };
  }

  function applyTransform(g, s, o) {
    const [px, py] = pivotOf(o);
    g.setAttribute('transform',
      `translate(${s.x} ${s.y}) rotate(${s.rot} ${px} ${py}) translate(${px} ${py}) scale(${s.sx} ${s.sy}) translate(${-px} ${-py})`);
    g.style.opacity = s.op;
  }

  function renderStickLimbs(parts, s) {
    let e;
    e = limbEnd(0, SM.shoulder, SM.armLen, s.armL); parts.armL.setAttribute('x2', e[0].toFixed(1)); parts.armL.setAttribute('y2', e[1].toFixed(1));
    e = limbEnd(0, SM.shoulder, SM.armLen, s.armR); parts.armR.setAttribute('x2', e[0].toFixed(1)); parts.armR.setAttribute('y2', e[1].toFixed(1));
    e = limbEnd(0, 0, SM.legLen, s.legL); parts.legL.setAttribute('x2', e[0].toFixed(1)); parts.legL.setAttribute('y2', e[1].toFixed(1));
    e = limbEnd(0, 0, SM.legLen, s.legR); parts.legR.setAttribute('x2', e[0].toFixed(1)); parts.legR.setAttribute('y2', e[1].toFixed(1));
  }

  class Renderer {
    constructor(svg) { this.svg = svg; this.doc = null; this.handles = []; }
    load(doc) {
      this.doc = doc;
      const vb = doc.viewBox || [0, 0, 800, 450];
      this.svg.setAttribute('viewBox', vb.join(' '));
      while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);
      this.handles = [];
      const bg = el('rect', { x: vb[0], y: vb[1], width: vb[2], height: vb[3], fill: doc.background || '#fff', stroke: 'none' });
      this.svg.appendChild(bg);
      this.build();
    }
    build() {
      for (const o of this.doc.objects) {
        const h = buildObject(o);
        h.g.setAttribute('data-id', o.id);
        this.svg.appendChild(h.g);
        this.handles.push({ o, g: h.g, parts: h.parts });
      }
    }
    handleFor(id) { return this.handles.find((h) => h.o.id === id); }
    render(t) {
      for (const h of this.handles) {
        const s = stateAt(h.o, t);
        applyTransform(h.g, s, h.o);
        if (h.o.type === 'stickman') renderStickLimbs(h.parts, s);
      }
    }
  }

  /* ---------- Fabrik / Presets ---------- */
  let _id = 0;
  function uid(pfx) { _id++; return (pfx || 'o') + '_' + _id + '_' + Math.floor(performance.now() % 100000); }

  function newObject(type, x, y) {
    const base = { id: uid(type), type, props: { x: x || 400, y: y || 225 }, keys: {} };
    if (type === 'stickman') { base.props.y = y || 341; base.props.eyes = 'dots'; base.props.mouth = 'line'; }
    if (type === 'text') base.props.text = 'Text';
    if (type === 'splat') { base.props.r = 40; base.props.color = '#e0122b'; }
    if (type === 'group') base.props.children = [];
    return base;
  }

  function defaultDoc() {
    return {
      format: '2dsk', version: 1, title: 'Neuer Sketch',
      duration: 5, background: '#ffffff', viewBox: [0, 0, 800, 450],
      objects: [
        { id: uid('ground'), type: 'line', props: { x: 0, y: 380, x1: 40, y1: 0, x2: 760, y2: 0, stroke: '#cfcfcf' }, keys: {} }
      ]
    };
  }

  function validate(doc) {
    if (!doc || doc.format !== '2dsk') throw new Error('Keine gültige .2dsk-Datei');
    if (!Array.isArray(doc.objects)) throw new Error('.2dsk ohne objects');
    if (!doc.duration) doc.duration = 5;
    if (!doc.viewBox) doc.viewBox = [0, 0, 800, 450];
    doc.objects.forEach((o) => { if (!o.keys) o.keys = {}; if (!o.props) o.props = {}; });
    return doc;
  }

  /* ---------- Presets (STRICHE-Welt) ---------- */
  function grp(id, x, y, children, pivotX, pivotY) {
    return { id: uid(id), type: 'group', props: { x, y, children, pivotX: pivotX || 0, pivotY: pivotY || 0 }, keys: {} };
  }
  const PRESET_LIST = [
    { key: 'strichmann', label: 'Strichmann' }, { key: 'linie', label: 'Linie' },
    { key: 'kreis', label: 'Kreis' }, { key: 'rechteck', label: 'Rechteck' },
    { key: 'text', label: 'Text' }, { key: 'blut', label: 'Blut' },
    { key: 'klavier', label: 'Klavier' }, { key: 'waage', label: 'Waage' },
    { key: 'schild', label: 'Schild' }, { key: 'knopf', label: 'Knopf' },
    { key: 'muffin', label: 'Muffin' }, { key: 'herz', label: 'Herz' },
  ];
  function makePreset(name, x, y) {
    x = x == null ? 400 : x; y = y == null ? 225 : y;
    switch (name) {
      case 'strichmann': return newObject('stickman', x, 341);
      case 'linie': return newObject('line', x, y);
      case 'kreis': return newObject('circle', x, y);
      case 'rechteck': return { id: uid('rect'), type: 'rect', props: { x, y, w: 90, h: 60, rx: 4 }, keys: {} };
      case 'text': return newObject('text', x, y);
      case 'blut': return newObject('splat', x, y);
      case 'herz': return grp('herz', x, y, [
        { type: 'path', d: 'M0 4 C -16 -22, -48 -14, -40 14 C -34 36, 0 54, 0 54 C 0 54, 34 36, 40 14 C 48 -14, 16 -22, 0 4 Z', fill: '#e0122b', stroke: '#e0122b' }
      ], 0, 40);
      case 'muffin': return grp('muffin', x, y, [
        { type: 'path', d: 'M-62 0 q62 -50 124 0 z', fill: 'none', stroke: '#111' },
        { type: 'path', d: 'M-54 0 l14 74 h80 l14 -74 z', fill: 'none', stroke: '#111' },
        { type: 'line', x1: -44, y1: 22, x2: 54, y2: 22, stroke: '#111' },
        { type: 'path', d: 'M-16 -12 q14 12 28 0', fill: 'none', stroke: '#111' },
        { type: 'circle', cx: -16, cy: -22, r: 2.4, fill: '#111', stroke: '#111' },
        { type: 'circle', cx: 16, cy: -22, r: 2.4, fill: '#111', stroke: '#111' },
      ], 0, 74);
      case 'klavier': return grp('klavier', x, y, [
        { type: 'rect', x2: -64, y2: 0, w: 128, h: 92, rx: 6, fill: 'none', stroke: '#111' },
        { type: 'rect', x2: -64, y2: 0, w: 128, h: 30, rx: 6, fill: '#fff', stroke: '#111' },
        { type: 'rect', x2: -56, y2: 62, w: 112, h: 24, fill: '#fff', stroke: '#111' },
        { type: 'line', x1: -40, y1: 62, x2: -40, y2: 86, stroke: '#111' },
        { type: 'line', x1: -24, y1: 62, x2: -24, y2: 86, stroke: '#111' },
        { type: 'line', x1: -8, y1: 62, x2: -8, y2: 86, stroke: '#111' },
        { type: 'line', x1: 8, y1: 62, x2: 8, y2: 86, stroke: '#111' },
        { type: 'line', x1: 24, y1: 62, x2: 24, y2: 86, stroke: '#111' },
        { type: 'line', x1: 40, y1: 62, x2: 40, y2: 86, stroke: '#111' },
      ], 0, 92);
      case 'waage': return grp('waage', x, y, [
        { type: 'rect', x2: -70, y2: 28, w: 140, h: 30, rx: 6, fill: 'none', stroke: '#111' },
        { type: 'rect', x2: -40, y2: 0, w: 80, h: 26, rx: 4, fill: '#fff', stroke: '#111' },
        { type: 'text', text: 'NEIN', size: 18, anchor: 'middle', fill: '#e0122b' },
      ], 0, 58);
      case 'schild': return grp('schild', x, y, [
        { type: 'line', x1: 0, y1: 70, x2: 0, y2: 230, stroke: '#111' },
        { type: 'rect', x2: -100, y2: 0, w: 200, h: 70, rx: 6, fill: '#fff', stroke: '#111' },
        { type: 'text', text: 'NICHT DEN', size: 17, anchor: 'middle', fill: '#111' },
      ], 0, 0);
      case 'knopf': return grp('knopf', x, y, [
        { type: 'rect', x2: -35, y2: 0, w: 70, h: 80, fill: 'none', stroke: '#111' },
        { type: 'circle', cx: 0, cy: 0, r: 26, fill: '#e0122b', stroke: '#e0122b' },
      ], 0, 80);
    }
    return newObject('circle', x, y);
  }

  global.SketchEngine = {
    NS, EASING, EASING_NAMES, CHANNELS, STICK_CHANNELS, SM,
    baseVal, channelValue, stateAt, pivotOf,
    Renderer, newObject, defaultDoc, validate, uid,
    PRESET_LIST, makePreset,
  };
})(window);
