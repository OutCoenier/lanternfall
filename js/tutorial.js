// ===== First-fight tutorial =====
// Shows a few speech bubbles pointing at the important parts of combat.
// Runs once on your first fight. Turn it back on from How to Play.
'use strict';

const Tutorial = (() => {
  let step = 0, combat = null, bubble = null;

  const STEPS = [
    { sel: '.enemy-side .entity', side: 'left', title: 'Your first fight!',
      text: 'Defeat every enemy to win. This is the only time I will interrupt. Click <b>Next</b> to continue, or skip the tutorial.' },
    { sel: '.intent', side: 'left', title: 'Enemy intents',
      text: 'Enemies show what they will do on their turn. <b>:swords: 11</b> means it will attack you for 11 damage. Hover an intent for details.' },
    { sel: '.energy-orb', side: 'right', title: 'Energy',
      text: 'You get <b>3 Energy</b> each turn. Every card costs Energy, shown in its top corner.' },
    { sel: '.hand', side: 'top', title: 'Your hand',
      text: '<b>Drag a card upward</b> to play it, or click it. Attack cards need a target: drag them, then aim the arrow at an enemy.' },
    { sel: '.player-side .entity', side: 'right', title: 'Ward',
      text: 'Defence cards give <b>Ward :shield:</b>. Ward blocks damage, but it disappears at the start of your next turn, so use it when an enemy is about to attack.' },
    { sel: '.end-turn', side: 'left', title: 'End your turn',
      text: 'When you are out of Energy or good moves, press <b>End Turn</b> (or E). Unused cards go to the discard pile. Good luck!' },
  ];

  function place() {
    if (!bubble || !combat || !combat.root) return;
    const s = STEPS[step];
    const target = $(s.sel, combat.root);
    if (!target) { next(); return; }
    $$('.tut-focus').forEach((n) => n.classList.remove('tut-focus'));
    target.classList.add('tut-focus');
    const r = target.getBoundingClientRect();
    const bw = bubble.offsetWidth, bh = bubble.offsetHeight, pad = 18;
    let x, y;
    if (s.side === 'left') { x = r.left - bw - pad; y = r.top + r.height / 2 - bh / 2; }
    else if (s.side === 'right') { x = r.right + pad; y = r.top + r.height / 2 - bh / 2; }
    else { x = r.left + r.width / 2 - bw / 2; y = r.top - bh - pad; }
    x = clamp(x, 10, window.innerWidth - bw - 10);
    y = clamp(y, 60, window.innerHeight - bh - 10);
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
    bubble.dataset.side = s.side;
  }

  function show() {
    const s = STEPS[step];
    bubble.innerHTML = `<div class="tut-step">${step + 1} / ${STEPS.length}</div><h3>${s.title}</h3><p>${s.text}</p>
      <div class="tut-btns"><button class="btn small ghost tut-skip">Skip tutorial</button><button class="btn small primary tut-next">${step === STEPS.length - 1 ? 'Got it!' : 'Next'}</button></div>`;
    $('.tut-next', bubble).onclick = next;
    $('.tut-skip', bubble).onclick = finish;
    bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop');
    requestAnimationFrame(place);
  }

  function next() {
    step++;
    if (step >= STEPS.length) return finish();
    show();
  }

  function finish() {
    $$('.tut-focus').forEach((n) => n.classList.remove('tut-focus'));
    if (bubble) bubble.remove();
    bubble = null; combat = null;
    const p = Profile.get();
    p.tutorialDone = true;
    Profile.save();
  }

  function maybeStart(c) {
    if (Profile.get().tutorialDone || bubble) return;
    combat = c; step = 0;
    bubble = el('div', 'tutorial-bubble');
    document.body.appendChild(bubble);
    show();
  }

  window.addEventListener('resize', place);
  return { maybeStart, finish, reset() { Profile.get().tutorialDone = false; Profile.save(); }, active: () => !!bubble };
})();
