// ===== Drawn portraits for elites and bosses =====
// Each function returns an SVG. Enemies face left (toward the hero).
// Enemies not listed here use their emoji sprite from enemies.js.
'use strict';

const ENEMY_ART = {
  // ---------------- Act I ----------------
  warden: () => `<svg class="portrait-svg" viewBox="0 0 160 160">
    <defs><linearGradient id="gwCloak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d4a45"/><stop offset="1" stop-color="#151c1a"/></linearGradient>
    <radialGradient id="gwEye"><stop offset="0" stop-color="#fff6a0"/><stop offset="1" stop-color="#ffb000" stop-opacity="0"/></radialGradient></defs>
    <path d="M30 150 Q34 80 60 52 Q80 38 104 52 Q132 78 134 150 Z" fill="url(#gwCloak)"/>
    <path d="M30 150 L40 136 L50 150 L62 134 L74 150 L88 136 L100 150 L114 134 L124 150 L134 140 L134 150 Z" fill="#0d1110"/>
    <path d="M58 58 Q60 24 84 20 Q108 24 108 58 Q96 70 83 70 Q68 70 58 58 Z" fill="#2c3632"/>
    <path d="M64 56 Q66 34 84 32 Q100 34 102 56 Q92 64 83 64 Q72 64 64 56 Z" fill="#070909"/>
    <circle cx="74" cy="48" r="7" fill="url(#gwEye)" class="pt-eye"/><circle cx="92" cy="48" r="7" fill="url(#gwEye)" class="pt-eye"/>
    <circle cx="74" cy="48" r="2.4" fill="#fff8c0"/><circle cx="92" cy="48" r="2.4" fill="#fff8c0"/>
    <path d="M38 76 Q20 96 26 120 L38 118 Q36 100 50 86 Z" fill="#26302c"/>
    <circle cx="31" cy="120" r="7" fill="#6b7a62"/>
    <path d="M18 60 L32 128" stroke="#5a4630" stroke-width="5" stroke-linecap="round"/>
    <path d="M6 40 Q12 34 22 38 L30 66 Q20 72 12 66 Z" fill="#7a8a8a" stroke="#3a4444" stroke-width="2"/>
    <path d="M110 80 Q130 92 128 116" stroke="#8a7a50" stroke-width="3" fill="none" stroke-dasharray="5 3"/>
    <rect x="118" y="112" width="20" height="16" rx="3" fill="#8a6a2a" stroke="#4a3810" stroke-width="2"/>
    <path d="M123 112 Q128 102 133 112" stroke="#8a6a2a" stroke-width="3" fill="none"/>
  </svg>`,

  brute: () => `<svg class="portrait-svg" viewBox="0 0 160 160">
    <defs><radialGradient id="bbShell" cx=".4" cy=".35"><stop offset="0" stop-color="#d0643a"/><stop offset=".7" stop-color="#8a2e1a"/><stop offset="1" stop-color="#4a160c"/></radialGradient></defs>
    <g stroke="#5a1e10" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M58 112 L40 134 L34 150"/><path d="M70 116 L60 140 L58 152"/><path d="M100 116 L112 140 L116 152"/><path d="M112 110 L130 132 L138 148"/>
    </g>
    <ellipse cx="86" cy="96" rx="48" ry="30" fill="url(#bbShell)"/>
    <path d="M44 92 Q86 60 128 92" stroke="#e08a5a" stroke-width="2" fill="none" opacity=".5"/>
    <circle cx="70" cy="84" r="4" fill="#efe6d0"/><circle cx="96" cy="78" r="5" fill="#efe6d0"/><circle cx="110" cy="90" r="3.5" fill="#efe6d0"/><circle cx="84" cy="100" r="3" fill="#efe6d0"/>
    <circle cx="70" cy="84" r="1.5" fill="#6a5a40"/><circle cx="96" cy="78" r="2" fill="#6a5a40"/>
    <path d="M62 72 L58 54" stroke="#8a2e1a" stroke-width="4"/><path d="M76 70 L76 50" stroke="#8a2e1a" stroke-width="4"/>
    <circle cx="58" cy="52" r="6" fill="#111"/><circle cx="76" cy="48" r="6" fill="#111"/><circle cx="56" cy="50" r="2" fill="#fff"/><circle cx="74" cy="46" r="2" fill="#fff"/>
    <path d="M46 92 Q26 84 22 64" stroke="#8a2e1a" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M10 40 Q4 64 22 70 Q30 52 26 40 Z" fill="#b8482a" stroke="#5a1e10" stroke-width="2"/>
    <path d="M26 40 Q34 30 44 40 Q34 46 30 56 Z" fill="#9a3a20" stroke="#5a1e10" stroke-width="2"/>
    <path d="M52 108 Q40 120 30 118" stroke="#8a2e1a" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M18 112 Q22 126 34 122 L30 112 Z" fill="#b8482a"/>
  </svg>`,

  lamprey: () => `<svg class="portrait-svg" viewBox="0 0 160 160">
    <defs><linearGradient id="lpBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fb8c8"/><stop offset="1" stop-color="#2a4a5a"/></linearGradient></defs>
    <path d="M120 152 Q150 120 120 96 Q90 74 100 50 Q108 30 84 22 Q60 18 48 38" stroke="url(#lpBody)" stroke-width="26" fill="none" stroke-linecap="round"/>
    <path d="M120 152 Q150 120 120 96 Q90 74 100 50 Q108 30 84 22" stroke="#c8e8f0" stroke-width="3" fill="none" opacity=".4" stroke-dasharray="2 8"/>
    <path d="M128 118 L148 108 L140 124 Z M108 84 L124 70 L122 90 Z" fill="#4a7a8a"/>
    <circle cx="44" cy="44" r="20" fill="#3a6a7a"/>
    <circle cx="40" cy="46" r="14" fill="#5a1020"/>
    <circle cx="40" cy="46" r="9" fill="#2a0408"/>
    <g fill="#f4e8d8">${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<path d="M${(40 + Math.cos(a) * 14).toFixed(1)},${(46 + Math.sin(a) * 14).toFixed(1)} L${(40 + Math.cos(a + 0.2) * 9).toFixed(1)},${(46 + Math.sin(a + 0.2) * 9).toFixed(1)} L${(40 + Math.cos(a - 0.2) * 9).toFixed(1)},${(46 + Math.sin(a - 0.2) * 9).toFixed(1)} Z"/>`; }).join('')}</g>
    <circle cx="58" cy="30" r="3.2" fill="#ffe680" class="pt-eye"/>
    <path d="M60 52 Q70 60 66 70 M64 34 Q76 34 80 26" stroke="#2a4a5a" stroke-width="2" fill="none"/>
  </svg>`,

  motherBrine: () => `<svg class="portrait-svg" viewBox="0 0 160 160">
    <defs><radialGradient id="mbHead" cx=".45" cy=".35"><stop offset="0" stop-color="#d07aa8"/><stop offset=".6" stop-color="#8a3a6a"/><stop offset="1" stop-color="#40143a"/></radialGradient>
    <radialGradient id="mbEye"><stop offset="0" stop-color="#ffef8a"/><stop offset=".6" stop-color="#ffa020"/><stop offset="1" stop-color="#7a3000"/></radialGradient></defs>
    <g fill="none" stroke-linecap="round" class="pt-tentacles">
      <path d="M50 96 Q20 110 22 138 Q24 152 12 154" stroke="#7a2e5e" stroke-width="12"/>
      <path d="M66 104 Q50 130 62 146 Q70 156 56 158" stroke="#8a3a6a" stroke-width="12"/>
      <path d="M94 104 Q108 132 96 146 Q88 156 104 158" stroke="#8a3a6a" stroke-width="12"/>
      <path d="M110 96 Q140 108 140 134 Q140 150 152 152" stroke="#7a2e5e" stroke-width="12"/>
      <path d="M40 86 Q8 84 6 60 Q4 44 14 38" stroke="#6a2652" stroke-width="10"/>
      <path d="M120 86 Q150 80 152 56" stroke="#6a2652" stroke-width="10"/>
    </g>
    <g fill="#f0b8d4" opacity=".7"><circle cx="24" cy="128" r="2.5"/><circle cx="26" cy="140" r="2.2"/><circle cx="60" cy="134" r="2.5"/><circle cx="100" cy="134" r="2.5"/><circle cx="138" cy="126" r="2.5"/><circle cx="10" cy="56" r="2"/></g>
    <ellipse cx="80" cy="64" rx="46" ry="50" fill="url(#mbHead)"/>
    <ellipse cx="66" cy="40" rx="14" ry="8" fill="#e8a0c8" opacity=".35"/>
    <ellipse cx="60" cy="74" rx="13" ry="11" fill="url(#mbEye)" class="pt-eye"/><ellipse cx="98" cy="74" rx="13" ry="11" fill="url(#mbEye)" class="pt-eye"/>
    <rect x="57" y="66" width="6" height="16" rx="3" fill="#1a0408"/><rect x="95" y="66" width="6" height="16" rx="3" fill="#1a0408"/>
    <path d="M44 22 L50 4 L58 20 L66 0 L74 18 L82 2 L88 18 L98 4 L102 22" fill="#e86a5a" stroke="#8a2a2a" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="66" cy="8" r="2.5" fill="#fff6c8"/><circle cx="82" cy="10" r="2.5" fill="#9ef0ff"/>
  </svg>`,

  // ---------------- Act II ----------------
  matriarch: () => `<svg class="portrait-svg" viewBox="0 0 160 160">
    <defs><radialGradient id="fmCap" cx=".5" cy=".3"><stop offset="0" stop-color="#d79aff"/><stop offset="1" stop-color="#5a2a8a"/></radialGradient>
    <radialGradient id="fmCap2" cx=".5" cy=".3"><stop offset="0" stop-color="#ff9ad0"/><stop offset="1" stop-color="#8a2a6a"/></radialGradient></defs>
    <path d="M40 152 Q46 110 64 96 L100 96 Q118 110 124 152 Z" fill="#e8dcc8"/>
    <path d="M56 152 Q60 120 72 104 M84 104 Q96 124 100 152" stroke="#bfae98" stroke-width="2" fill="none"/>
    <path d="M18 100 Q30 54 82 50 Q136 54 144 100 Q82 90 18 100 Z" fill="url(#fmCap)"/>
    <path d="M24 98 Q82 88 140 98" stroke="#3a1a5a" stroke-width="3" fill="none"/>
    <g fill="#f8e8ff" opacity=".85"><circle cx="50" cy="72" r="5"/><circle cx="82" cy="62" r="7"/><circle cx="114" cy="74" r="5"/><circle cx="66" cy="84" r="3"/><circle cx="100" cy="86" r="3.5"/></g>
    <path d="M100 52 Q110 18 136 22 Q154 30 146 52 Q124 44 100 52 Z" fill="url(#fmCap2)"/>
    <path d="M18 62 Q22 40 40 40 Q54 44 52 60 Q36 56 18 62 Z" fill="url(#fmCap2)"/>
    <circle cx="68" cy="122" r="4.5" fill="#2a0a3a" class="pt-eye"/><circle cx="92" cy="122" r="4.5" fill="#2a0a3a" class="pt-eye"/>
    <circle cx="68" cy="122" r="1.6" fill="#ff9af0"/><circle cx="92" cy="122" r="1.6" fill="#ff9af0"/>
    <path d="M72 138 Q80 132 88 138" stroke="#5a3a4a" stroke-width="2" fill="none"/>
    <g fill="#d0ff9a" class="pt-glow"><circle cx="30" cy="120" r="2"/><circle cx="140" cy="118" r="2.5"/><circle cx="20" cy="30" r="1.5"/><circle cx="120" cy="10" r="2"/></g>
  </svg>`,

  gloomKnight: () => `<svg class="portrait-svg" viewBox="0 0 160 160">
    <defs><linearGradient id="gkArmor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a5a8a"/><stop offset=".5" stop-color="#2a2a4a"/><stop offset="1" stop-color="#12121f"/></linearGradient>
    <linearGradient id="gkBlade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0e8ff"/><stop offset="1" stop-color="#6a7ab0"/></linearGradient></defs>
    <path d="M100 30 Q118 10 126 34 Q114 30 110 46" fill="#4a2a8a"/>
    <path d="M56 152 L62 112 L76 112 L74 152 Z M90 152 L88 112 L102 112 L108 152 Z" fill="#1d1d33"/>
    <path d="M52 64 Q50 110 60 118 L104 118 Q114 110 112 64 Q82 52 52 64 Z" fill="url(#gkArmor)"/>
    <path d="M82 60 L82 118" stroke="#8a8ac0" stroke-width="1.5" opacity=".5"/>
    <path d="M66 26 Q82 16 98 26 L100 58 Q82 66 64 58 Z" fill="url(#gkArmor)" stroke="#7a7ab0" stroke-width="1.5"/>
    <rect x="68" y="40" width="28" height="5" rx="2" fill="#7f9fff" class="pt-eye"/>
    <path d="M44 64 Q36 62 34 72 L36 80 Q46 74 54 72 Z M120 64 Q128 62 130 72 L128 80 Q118 74 110 72 Z" fill="#3a3a5a"/>
    <path d="M14 66 L50 66 L50 110 Q32 128 14 110 Z" fill="#26264a" stroke="#8a8ac0" stroke-width="2.5"/>
    <path d="M32 74 L32 112 M20 88 L44 88" stroke="#7f9fff" stroke-width="3" opacity=".7"/>
    <path d="M122 84 L134 92" stroke="#3a2a1a" stroke-width="6" stroke-linecap="round"/>
    <path d="M126 80 L140 96" stroke="#8a8ac0" stroke-width="3"/>
    <path d="M132 90 L150 6 L154 10 L138 94 Z" fill="url(#gkBlade)"/>
  </svg>`,

  beetle: () => `<svg class="portrait-svg" viewBox="0 0 160 160">
    <defs><radialGradient id="tbShell" cx=".4" cy=".3"><stop offset="0" stop-color="#6ac08a"/><stop offset=".6" stop-color="#1f5a3a"/><stop offset="1" stop-color="#0a2416"/></radialGradient></defs>
    <g stroke="#0e2a1a" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M60 116 L44 138 L40 152"/><path d="M84 120 L80 146"/><path d="M108 116 L122 138 L128 152"/>
    </g>
    <path d="M30 96 Q34 52 86 48 Q142 52 146 100 Q140 120 88 122 Q36 120 30 96 Z" fill="url(#tbShell)"/>
    <path d="M88 50 L88 120" stroke="#0a2416" stroke-width="2.5"/>
    <g fill="#a8e070" stroke="#2a4a1a" stroke-width="1">
      <path d="M60 58 L56 36 L68 54 Z"/><path d="M80 50 L80 24 L90 48 Z"/><path d="M104 52 L110 28 L114 56 Z"/><path d="M124 64 L136 42 L134 70 Z"/><path d="M46 70 L34 52 L52 64 Z"/>
    </g>
    <path d="M60 64 Q88 56 118 66" stroke="#9adab0" stroke-width="3" fill="none" opacity=".45"/>
    <ellipse cx="32" cy="98" rx="18" ry="15" fill="#123a24"/>
    <path d="M20 92 Q2 74 10 54 Q14 74 28 84 Z" fill="#2a6a40" stroke="#0a2416" stroke-width="1.5"/>
    <circle cx="24" cy="98" r="4" fill="#ffda4a" class="pt-eye"/><circle cx="23" cy="97" r="1.4" fill="#fff"/>
    <path d="M18 108 L8 116 M22 110 L16 122" stroke="#0e2a1a" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  paleSovereign: () => `<svg class="portrait-svg" viewBox="0 0 160 160">
    <defs><radialGradient id="psCap" cx=".5" cy=".25"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#ddd6e8"/><stop offset="1" stop-color="#8a80a0"/></radialGradient>
    <linearGradient id="psStem" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfc6b8"/><stop offset=".5" stop-color="#f4eee4"/><stop offset="1" stop-color="#b8ae9e"/></linearGradient>
    <linearGradient id="psGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a0"/><stop offset="1" stop-color="#c9902a"/></linearGradient></defs>
    <path d="M48 156 Q56 104 60 84 L100 84 Q104 104 112 156 Z" fill="url(#psStem)"/>
    <path d="M40 156 Q60 146 80 152 Q100 146 120 156 Z" fill="#a89e8e"/>
    <path d="M52 96 Q80 106 108 96" stroke="#e8e0d4" stroke-width="5" fill="none"/>
    <path d="M56 100 Q50 116 56 124 M104 100 Q110 116 104 124" stroke="#d8cfc0" stroke-width="3" fill="none"/>
    <ellipse cx="68" cy="116" rx="6" ry="8" fill="#1a1020" class="pt-eye"/><ellipse cx="92" cy="116" rx="6" ry="8" fill="#1a1020" class="pt-eye"/>
    <circle cx="68" cy="114" r="2" fill="#d0ff9a"/><circle cx="92" cy="114" r="2" fill="#d0ff9a"/>
    <path d="M70 136 Q80 130 90 136" stroke="#6a5a5a" stroke-width="2.5" fill="none"/>
    <path d="M4 88 Q12 30 80 26 Q148 30 156 88 Q120 78 80 80 Q40 78 4 88 Z" fill="url(#psCap)"/>
    <path d="M10 86 Q80 72 150 86" stroke="#8a80a0" stroke-width="2" fill="none"/>
    <g stroke="#b0a6c0" stroke-width="1" opacity=".7">${Array.from({ length: 13 }, (_, i) => `<line x1="${16 + i * 10}" y1="${85 - Math.abs(6 - i) * 0.6}" x2="${80 + (i - 6) * 4}" y2="80"/>`).join('')}</g>
    <g fill="#c9c0d8" opacity=".6"><circle cx="40" cy="54" r="6"/><circle cx="110" cy="46" r="8"/><circle cx="78" cy="40" r="4"/><circle cx="130" cy="66" r="4"/></g>
    <path d="M56 28 L60 6 L70 20 L80 2 L90 20 L100 6 L104 28 Z" fill="url(#psGold)" stroke="#8a5a10" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="80" cy="18" r="3.5" fill="#c46bff"/><circle cx="65" cy="22" r="2.2" fill="#6adcff"/><circle cx="95" cy="22" r="2.2" fill="#6adcff"/>
    <g fill="#e8ffd0" class="pt-glow"><circle cx="20" cy="110" r="2"/><circle cx="140" cy="120" r="2.5"/><circle cx="130" cy="20" r="1.6"/><circle cx="24" cy="30" r="1.8"/></g>
  </svg>`,

  // ---------------- Act III ----------------
  singer: () => `<svg class="portrait-svg" viewBox="0 0 160 160">
    <defs><radialGradient id="ssAura"><stop offset="0" stop-color="#a04aff" stop-opacity=".55"/><stop offset="1" stop-color="#a04aff" stop-opacity="0"/></radialGradient>
    <linearGradient id="ssRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1a5a"/><stop offset="1" stop-color="#0a0414" stop-opacity="0"/></linearGradient></defs>
    <circle cx="80" cy="70" r="64" fill="url(#ssAura)" class="pt-glow"/>
    <path d="M44 70 Q40 120 30 156 L50 140 L62 156 L76 138 L90 156 L104 140 L118 156 Q116 110 116 70 Q80 54 44 70 Z" fill="url(#ssRobe)"/>
    <path d="M50 62 Q50 28 80 26 Q110 28 110 62 Q96 74 80 74 Q64 74 50 62 Z" fill="#1a0a2a"/>
    <path d="M58 46 Q60 30 80 30 Q100 30 102 46 Q102 66 80 72 Q58 66 58 46 Z" fill="#f4eef8"/>
    <path d="M64 46 Q69 41 74 46 Q69 49 64 46 Z M86 46 Q91 41 96 46 Q91 49 86 46 Z" fill="#1a0a2a"/>
    <path d="M70 60 Q80 54 90 60" stroke="#1a0a2a" stroke-width="2.5" fill="none"/>
    <path d="M66 50 Q66 58 64 62" stroke="#8a6ac0" stroke-width="1.5" fill="none"/>
    <path d="M40 80 Q20 70 16 50 M120 80 Q140 72 146 54" stroke="#2a1040" stroke-width="7" fill="none" stroke-linecap="round"/>
    <g fill="#d0a0ff" font-size="16" class="pt-glow"><text x="12" y="40">♪</text><text x="138" y="40">♫</text><text x="26" y="20">♩</text></g>
  </svg>`,

  ashWarden: () => `<svg class="portrait-svg" viewBox="0 0 160 160">
    <defs><linearGradient id="awArmor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a4a44"/><stop offset=".6" stop-color="#2a201c"/><stop offset="1" stop-color="#120c0a"/></linearGradient>
    <linearGradient id="awFire" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff4a10"/><stop offset=".6" stop-color="#ffb030"/><stop offset="1" stop-color="#fff0a0"/></linearGradient></defs>
    <path d="M56 152 L60 112 L76 112 L72 152 Z M90 152 L90 112 L104 112 L110 152 Z" fill="#1a1412"/>
    <path d="M48 66 Q46 110 58 118 L106 118 Q118 110 116 66 Q82 52 48 66 Z" fill="url(#awArmor)"/>
    <path d="M60 80 L72 92 L66 104 M100 78 L92 94 L102 104 M82 64 L82 82" stroke="#ff7a2a" stroke-width="2" fill="none" class="pt-glow"/>
    <path d="M64 28 Q82 14 100 28 L100 60 Q82 68 64 60 Z" fill="url(#awArmor)" stroke="#8a5a3a" stroke-width="1.5"/>
    <path d="M70 42 L94 42 L90 48 L74 48 Z" fill="#ff8a2a" class="pt-eye"/>
    <path d="M70 22 Q74 4 82 12 Q86 0 94 10 Q100 2 98 24 Z" fill="url(#awFire)" class="pt-glow"/>
    <path d="M40 66 Q34 60 30 70 L34 80 Q42 74 50 72 Z M124 66 Q130 60 134 70 L130 80 Q122 74 114 72 Z" fill="#3a2a24"/>
    <path d="M24 92 L38 84" stroke="#2a1a10" stroke-width="7" stroke-linecap="round"/>
    <path d="M30 90 L4 150 L14 152 L38 94 Z" fill="#3a3030"/>
    <path d="M30 90 Q8 110 4 150 Q20 130 26 108 Q30 120 38 94 Z" fill="url(#awFire)" opacity=".85" class="pt-glow"/>
    <g fill="#ffb347" class="pt-glow"><circle cx="20" cy="70" r="2"/><circle cx="12" cy="110" r="1.6"/><circle cx="130" cy="40" r="1.8"/><circle cx="140" cy="100" r="1.5"/></g>
  </svg>`,

  serpent: () => `<svg class="portrait-svg" viewBox="0 0 160 160">
    <defs><radialGradient id="esSun"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset=".62" stop-color="#ffe08a"/><stop offset=".75" stop-color="#ff9a2a" stop-opacity=".6"/><stop offset="1" stop-color="#ff6a1a" stop-opacity="0"/></radialGradient>
    <linearGradient id="esScale" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a5a7a"/><stop offset="1" stop-color="#0a1424"/></linearGradient></defs>
    <circle cx="96" cy="58" r="52" fill="url(#esSun)" class="pt-glow"/>
    <circle cx="96" cy="58" r="30" fill="#05070c"/>
    <path d="M140 156 Q156 126 124 116 Q84 106 96 84 Q108 62 86 50 Q64 40 50 54" stroke="url(#esScale)" stroke-width="22" fill="none" stroke-linecap="round"/>
    <path d="M140 156 Q156 126 124 116 Q84 106 96 84 Q108 62 86 50" stroke="#ffd25a" stroke-width="2" fill="none" opacity=".35" stroke-dasharray="3 7"/>
    <path d="M18 56 Q30 36 52 42 Q62 52 56 66 Q40 74 22 68 Z" fill="#2a4a6a"/>
    <path d="M18 60 L4 58 L16 66 Z" fill="#c8e0ff"/>
    <path d="M22 66 L30 70 L26 64 M34 70 L40 72 L38 66" fill="#f0f0f0"/>
    <circle cx="40" cy="52" r="4" fill="#ffd25a" class="pt-eye"/><rect x="39" y="49" width="2" height="7" fill="#000"/>
    <path d="M46 42 L58 24 L56 44 Z M54 48 L72 36 L64 52 Z" fill="#1a2a3a"/>
  </svg>`,

  umbra: () => `<svg class="portrait-svg" viewBox="0 0 160 160">
    <defs><radialGradient id="umCore" cx=".45" cy=".4"><stop offset="0" stop-color="#2a1040"/><stop offset=".7" stop-color="#0a0414"/><stop offset="1" stop-color="#000"/></radialGradient>
    <radialGradient id="umHalo"><stop offset=".45" stop-color="#7a2aff" stop-opacity="0"/><stop offset=".6" stop-color="#9a5aff" stop-opacity=".6"/><stop offset="1" stop-color="#3a0a8a" stop-opacity="0"/></radialGradient>
    <radialGradient id="umIris"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="#ff6a3a"/><stop offset=".7" stop-color="#8a0a2a"/><stop offset="1" stop-color="#2a0010"/></radialGradient></defs>
    <circle cx="80" cy="76" r="78" fill="url(#umHalo)" class="pt-glow"/>
    <g fill="none" stroke="#0a0414" stroke-linecap="round" class="pt-tentacles">
      <path d="M44 110 Q20 130 6 156" stroke-width="12"/><path d="M64 122 Q60 144 46 160" stroke-width="10"/>
      <path d="M100 122 Q108 144 124 160" stroke-width="10"/><path d="M118 108 Q140 124 156 150" stroke-width="12"/>
      <path d="M30 70 Q8 60 2 36" stroke-width="9"/><path d="M130 66 Q152 54 156 30" stroke-width="9"/>
    </g>
    <circle cx="80" cy="76" r="52" fill="url(#umCore)"/>
    <path d="M44 76 Q80 44 116 76 Q80 108 44 76 Z" fill="#f4e8f0"/>
    <circle cx="74" cy="76" r="18" fill="url(#umIris)" class="pt-eye"/>
    <ellipse cx="74" cy="76" rx="4" ry="14" fill="#000"/>
    <circle cx="69" cy="70" r="3" fill="#fff" opacity=".8"/>
    <g fill="#c79aff" class="pt-glow"><circle cx="30" cy="30" r="2"/><circle cx="134" cy="28" r="2.5"/><circle cx="140" cy="100" r="1.6"/><circle cx="16" cy="96" r="1.8"/></g>
  </svg>`,
};
