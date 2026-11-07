// ===== Combat visual effects =====
//   Fx.at(entity, 'slash')   plays an effect on top of a fighter
// Effects: slash, moonSlash, claw, impact, fire, bleed, shield, shieldHit, buff, debuff,
//          heal, power, cast, death, energy
'use strict';

const Fx = (() => {
  const DUR = { slash: 420, moonSlash: 460, claw: 420, impact: 380, fire: 700, bleed: 600, shield: 560, shieldHit: 380,
    buff: 800, debuff: 800, heal: 900, power: 900, cast: 520, death: 800, energy: 600 };

  function center(ent) {
    const w = ent && ent.el && ent.el.querySelector('.sprite-wrap');
    if (!w) return null;
    const r = w.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
  }

  const particles = (n, make) => Array.from({ length: n }, (_, i) => make(i)).join('');

  const BUILD = {
    slash: (c) => `<svg viewBox="-100 -100 200 200"><path class="sl-glow" d="M-80,50 Q-10,-70 85,-45" stroke="${c.col || '#ffb347'}"/><path class="sl-core" d="M-80,50 Q-10,-70 85,-45"/></svg>`,
    moonSlash: () => `<svg viewBox="-100 -100 200 200"><path class="sl-glow" d="M-70,60 Q0,-80 75,-55" stroke="#9fc3ff"/><path class="sl-core" d="M-70,60 Q0,-80 75,-55"/><path class="sl-glow sl2" d="M-75,35 Q5,-60 80,-70" stroke="#cfe0ff"/><path class="sl-core sl2" d="M-75,35 Q5,-60 80,-70"/></svg>`,
    claw: () => `<svg viewBox="-100 -100 200 200">${[-26, 0, 26].map((o, i) => `<path class="cl" style="animation-delay:${i * 35}ms" d="M${-50 + o},-60 Q${-10 + o},0 ${30 + o},65"/>`).join('')}</svg>`,
    impact: () => `<div class="im-flash"></div>${particles(10, (i) => `<i style="--a:${i * 36 + Math.random() * 20}deg;--d:${40 + Math.random() * 40}px"></i>`)}`,
    fire: () => `<div class="fi-glow"></div>${particles(7, () => `<span style="--x:${Math.round(Math.random() * 90 - 45)}px;--d:${Math.round(Math.random() * 200)}ms;--s:${(0.7 + Math.random() * 0.8).toFixed(2)}">:flame:</span>`)}`,
    bleed: () => particles(12, () => { const a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 50; return `<i style="--dx:${Math.round(Math.cos(a) * d)}px;--dy:${Math.round(Math.sin(a) * d - 20)}px;--s:${(0.5 + Math.random()).toFixed(2)}"></i>`; }),
    shield: () => '<div class="sh-bubble"></div><div class="sh-ring"></div>',
    shieldHit: () => '<div class="sh-ring hit"></div>',
    buff: (c) => `<div class="up-glow" style="--col:${c.col || '#ffd76a'}"></div>${particles(8, () => `<span style="--x:${Math.round(Math.random() * 100 - 50)}px;--d:${Math.round(Math.random() * 260)}ms;color:${c.col || '#ffd76a'}">${c.glyph || '▲'}</span>`)}`,
    debuff: () => `<div class="db-swirl"></div>${particles(8, () => `<span style="--x:${Math.round(Math.random() * 100 - 50)}px;--d:${Math.round(Math.random() * 260)}ms">▼</span>`)}`,
    heal: () => `<div class="up-glow" style="--col:#6dff9a"></div>${particles(9, () => `<span style="--x:${Math.round(Math.random() * 100 - 50)}px;--d:${Math.round(Math.random() * 300)}ms;color:#6dff9a">:plus:</span>`)}`,
    power: (c) => `<div class="pw-ring" style="--col:${c.col || '#c690ff'}"></div><div class="pw-ring r2" style="--col:${c.col || '#c690ff'}"></div><div class="pw-runes" style="color:${c.col || '#c690ff'}">ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ</div>`,
    cast: (c) => `<div class="pw-ring small" style="--col:${c.col || '#8fd3ff'}"></div>`,
    death: () => particles(9, () => `<b style="--dx:${Math.round(Math.random() * 120 - 60)}px;--dy:${Math.round(-20 - Math.random() * 60)}px;--s:${(0.8 + Math.random() * 0.9).toFixed(2)}"></b>`),
    energy: () => `<div class="up-glow" style="--col:#ffb347"></div>${particles(6, () => `<span style="--x:${Math.round(Math.random() * 80 - 40)}px;--d:${Math.round(Math.random() * 200)}ms;color:#ffcf5a">:bolt:</span>`)}`,
  };

  function at(ent, kind, opts = {}) {
    if (!BUILD[kind]) return;
    const c = center(ent);
    if (!c) return;
    const layer = document.getElementById('fx');
    if (!layer) return;
    const size = Math.max(140, Math.min(320, c.h * 1.1)) * (opts.scale || 1);
    const node = document.createElement('div');
    node.className = 'cfx cfx-' + kind;
    const speed = Math.max(0.35, Game.speed);
    node.style.cssText = `left:${c.x}px;top:${c.y}px;width:${size}px;height:${size}px;--rot:${opts.rot != null ? opts.rot : Math.round(Math.random() * 50 - 25)}deg;--t:${DUR[kind] * speed}ms`;
    node.innerHTML = BUILD[kind](opts);
    layer.appendChild(node);
    setTimeout(() => node.remove(), DUR[kind] * speed + 400);
  }

  // A red flash around the edge of the screen when the hero is hurt.
  function hurtFlash(heavy) {
    const v = document.createElement('div');
    v.className = 'hurt-vignette' + (heavy ? ' heavy' : '');
    document.body.appendChild(v);
    setTimeout(() => v.remove(), 700);
  }

  function shake(root, strength = 6) {
    if (!root) return;
    const s = strength;
    root.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${-s}px,${s * 0.6}px)` }, { transform: `translate(${s}px,${-s * 0.5}px)` },
      { transform: `translate(${-s * 0.5}px,${s * 0.3}px)` }, { transform: 'translate(0,0)' }], { duration: 260 });
  }

  // Something flying from one fighter to another (the Moonblade throws crescents).
  function projectile(fromEnt, toEnt, kind) {
    const a = center(fromEnt), b = center(toEnt), layer = document.getElementById('fx');
    if (!a || !b || !layer) return Promise.resolve();
    const p = document.createElement('div');
    p.className = 'projectile ' + kind;
    layer.appendChild(p);
    const dur = 210 * Math.max(0.35, Game.speed);
    const anim = p.animate([
      { transform: `translate(${a.x}px, ${a.y - 10}px) translate(-50%, -50%) rotate(0deg) scale(.6)` },
      { transform: `translate(${(a.x + b.x) / 2}px, ${Math.min(a.y, b.y) - 50}px) translate(-50%, -50%) rotate(360deg) scale(1)`, offset: 0.5 },
      { transform: `translate(${b.x}px, ${b.y}px) translate(-50%, -50%) rotate(720deg) scale(1.1)` }], { duration: dur, easing: 'ease-in' });
    return new Promise((r) => { anim.onfinish = () => { p.remove(); r(); }; setTimeout(() => { p.remove(); r(); }, dur + 300); });
  }

  return { at, hurtFlash, shake, projectile };
})();
