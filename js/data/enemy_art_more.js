// ===== Portraits for the extra enemies (enemies_more.js) =====
// Each returns an SVG (160x160). Enemies face left, toward the hero.
'use strict';

(function () {
  const L = 'stroke="#1c1220" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
  const eye = (x, y, r, c = '#ffe680') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.35}" fill="#fff"/>`;
  const glow = (id, c, op = 0.45) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${op}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  const lin = (id, a, b, vertical = true) => `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const svg = (inner) => `<svg class="portrait-svg" viewBox="0 0 160 160">${inner}</svg>`;

  Object.assign(ENEMY_ART, {
    // =================== ACT I ===================
    drownedSailor: () => svg(`<defs>${lin('dsSkin', '#9cc4b0', '#4a7a6a')}${lin('dsCoat', '#3a5a72', '#18283a')}</defs>
      <path d="M52 154 L58 112 L72 112 L70 154 Z M84 154 L86 112 L100 112 L104 154 Z" fill="#22303e" ${L}/>
      <path d="M46 66 Q42 104 54 118 L100 118 Q112 104 106 66 Q76 54 46 66 Z" fill="url(#dsCoat)" ${L}/>
      <path d="M58 70 L76 86 L94 70" stroke="#e8e0c8" stroke-width="3" fill="none"/>
      <path d="M50 82 Q76 90 102 82 M52 98 Q76 106 100 98" stroke="#5a7a8a" stroke-width="2" fill="none" opacity=".6"/>
      <circle cx="76" cy="44" r="20" fill="url(#dsSkin)" ${L}/>
      <path d="M54 38 Q76 16 98 38 L98 30 Q76 10 54 30 Z" fill="#2a2018" ${L}/>
      ${eye(66, 44, 3.5, '#d8ffe8')}${eye(84, 44, 3, '#d8ffe8')}
      <path d="M68 56 Q76 52 84 56" stroke="#1c1220" stroke-width="2" fill="none"/>
      <path d="M62 60 L60 68 M88 60 L92 66" stroke="#4a7a6a" stroke-width="2"/>
      <path d="M40 72 Q28 90 30 104" stroke="url(#dsSkin)" stroke-width="9" stroke-linecap="round" fill="none"/>
      <path d="M30 104 L30 140 M18 132 Q30 150 42 132 M22 112 L38 112" stroke="#6a7480" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M120 120 Q126 128 120 136 M128 100 Q134 108 128 116" stroke="#7fd0ff" stroke-width="2" fill="none" opacity=".6"/>`),

    cryptRat: () => svg(`<defs>${lin('crFur', '#8a7a6a', '#3a3028')}</defs>
      <path d="M118 112 Q148 106 150 80 Q154 104 128 122" stroke="#c8a8a0" stroke-width="5" fill="none" stroke-linecap="round"/>
      <ellipse cx="92" cy="104" rx="38" ry="28" fill="url(#crFur)" ${L}/>
      <path d="M58 98 Q40 92 26 104 Q40 118 62 114 Z" fill="url(#crFur)" ${L}/>
      <circle cx="26" cy="104" r="4" fill="#d88a9a"/>
      <ellipse cx="58" cy="82" rx="10" ry="12" fill="#a8908a" ${L}/><ellipse cx="58" cy="82" rx="5" ry="7" fill="#d8a0a8"/>
      ${eye(46, 98, 4, '#ff4a4a')}
      <path d="M34 112 L36 118 M40 113 L41 119" stroke="#fff" stroke-width="2.2"/>
      <path d="M70 128 L66 140 M90 132 L88 144 M110 128 L114 140" stroke="#1c1220" stroke-width="4" stroke-linecap="round"/>
      <path d="M80 90 L84 82 M94 88 L98 80 M106 92 L112 86" stroke="#2a2018" stroke-width="2"/>`),

    gloomfin: () => svg(`<defs>${lin('gfBody', '#3a5a7a', '#0e1a2a')}${glow('gfLure', '#c8ffb0', 0.9)}</defs>
      <path d="M118 84 L152 58 L146 88 L154 116 L118 98 Z" fill="#24405a" ${L}/>
      <path d="M20 92 Q30 48 82 46 Q124 48 126 90 Q122 124 80 128 Q34 128 20 92 Z" fill="url(#gfBody)" ${L}/>
      <path d="M22 96 Q50 108 74 98 L70 112 Q44 120 24 104 Z" fill="#0a0f1a" ${L}/>
      <path d="M28 98 L32 106 M38 100 L41 110 M48 101 L50 112 M58 100 L60 110" stroke="#f4f0e0" stroke-width="2.4"/>
      ${eye(58, 74, 7, '#ffe680')}
      <path d="M60 48 Q52 20 32 22" stroke="#24405a" stroke-width="3" fill="none"/>
      <circle cx="32" cy="22" r="14" fill="url(#gfLure)"/><circle cx="32" cy="22" r="5" fill="#eaffd8" ${L}/>
      <path d="M86 60 Q98 70 96 86 M100 60 Q110 72 108 90" stroke="#5a8aaa" stroke-width="2" fill="none" opacity=".7"/>
      <path d="M78 126 L72 146 L92 128" fill="#24405a" ${L}/>`),

    boneArcher: () => svg(`<defs>${lin('baBone', '#f6f0e0', '#bdb29a')}</defs>
      <path d="M68 154 L72 112 M88 154 L86 112" stroke="url(#baBone)" stroke-width="6" stroke-linecap="round"/>
      <path d="M78 64 L78 112" stroke="url(#baBone)" stroke-width="6"/>
      <path d="M64 74 Q78 70 92 74 M64 86 Q78 82 92 86 M66 98 Q78 94 90 98" stroke="url(#baBone)" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M64 70 L42 82 L30 74" stroke="url(#baBone)" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M92 70 L108 88" stroke="url(#baBone)" stroke-width="5" stroke-linecap="round"/>
      <path d="M28 36 Q8 78 28 120" stroke="#6a4a2a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M28 36 L28 120" stroke="#e8e0c8" stroke-width="1.2"/>
      <path d="M30 78 L100 78" stroke="#8a6a3a" stroke-width="2.4"/><path d="M24 78 L34 73 L34 83 Z" fill="#c8ccd8" ${L}/>
      <path d="M58 46 C58 30 98 30 98 46 C98 56 92 60 88 62 L88 68 L68 68 L68 62 C64 60 58 56 58 46 Z" fill="url(#baBone)" ${L}/>
      <ellipse cx="70" cy="48" rx="5" ry="6" fill="#1c1220"/><ellipse cx="86" cy="48" rx="5" ry="6" fill="#1c1220"/>
      <circle cx="70" cy="48" r="2" fill="#7fe0ff"/><circle cx="86" cy="48" r="2" fill="#7fe0ff"/>
      <path d="M100 60 L118 40 M106 64 L122 48 M112 68 L126 56" stroke="#8a6a3a" stroke-width="2.5"/>`),

    tideCrab: () => svg(`<defs>${lin('tcShell', '#7ad0d0', '#1e6a7a')}</defs>
      <path d="M50 118 L32 136 M62 124 L50 146 M100 124 L112 146 M112 118 L130 136" stroke="#1c1220" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="82" cy="104" rx="44" ry="28" fill="url(#tcShell)" ${L}/>
      <path d="M44 100 Q82 76 120 100" stroke="#bff4f0" stroke-width="2.4" fill="none" opacity=".7"/>
      <circle cx="68" cy="92" r="4" fill="#fff4d8"/><circle cx="96" cy="88" r="5" fill="#fff4d8"/><circle cx="108" cy="102" r="3" fill="#fff4d8"/>
      <path d="M64 82 L60 62 M80 80 L80 58" stroke="#1e6a7a" stroke-width="4"/>
      ${eye(60, 60, 6, '#1c1220')}${eye(80, 56, 6, '#1c1220')}
      <path d="M42 102 Q22 98 16 78" stroke="#2a8a9a" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M6 58 Q2 80 18 84 Q26 70 20 58 Z" fill="url(#tcShell)" ${L}/>
      <path d="M20 58 Q30 48 38 58 Q28 64 24 72 Z" fill="#2a8a9a" ${L}/>`),

    tollingBell: () => svg(`<defs>${lin('tbBell', '#d8b46a', '#6a4a1a')}${glow('tbGlow', '#7fe0ff', 0.4)}</defs>
      <circle cx="80" cy="84" r="66" fill="url(#tbGlow)"/>
      <path d="M80 14 L80 26" stroke="#1c1220" stroke-width="5"/><circle cx="80" cy="12" r="6" fill="none" stroke="#3a2a1a" stroke-width="4"/>
      <path d="M80 26 C52 26 42 50 42 76 L42 104 L28 122 L132 122 L118 104 L118 76 C118 50 108 26 80 26 Z" fill="url(#tbBell)" ${L}/>
      <path d="M46 96 L114 96" stroke="#4a3010" stroke-width="2.4"/>
      <ellipse cx="62" cy="70" rx="8" ry="10" fill="#0a1a20"/><ellipse cx="96" cy="70" rx="8" ry="10" fill="#0a1a20"/>
      <circle cx="62" cy="72" r="3.5" fill="#7fe0ff"/><circle cx="96" cy="72" r="3.5" fill="#7fe0ff"/>
      <path d="M66 104 Q80 96 94 104 Q80 112 66 104 Z" fill="#0a1a20"/>
      <circle cx="80" cy="130" r="9" fill="url(#tbBell)" ${L}/>
      <path d="M22 70 Q14 84 22 98 M138 70 Q146 84 138 98 M12 64 Q0 84 12 104 M148 64 Q160 84 148 104" stroke="#7fe0ff" stroke-width="2.4" fill="none" opacity=".7"/>`),

    drownedCaptain: () => svg(`<defs>${lin('dcCoat', '#2a3a6a', '#0e1428')}${lin('dcSkin', '#a8d0bc', '#4a7a6a')}${lin('dcGold', '#fff0a8', '#b07a1a')}</defs>
      <path d="M52 156 L58 116 L74 116 L72 156 Z M86 156 L88 116 L102 116 L108 156 Z" fill="#14182a" ${L}/>
      <path d="M40 64 Q34 112 48 122 L108 122 Q124 112 116 64 Q78 50 40 64 Z" fill="url(#dcCoat)" ${L}/>
      <path d="M78 62 L78 122" stroke="url(#dcGold)" stroke-width="3"/>
      <circle cx="70" cy="80" r="2.5" fill="url(#dcGold)"/><circle cx="70" cy="94" r="2.5" fill="url(#dcGold)"/><circle cx="86" cy="80" r="2.5" fill="url(#dcGold)"/><circle cx="86" cy="94" r="2.5" fill="url(#dcGold)"/>
      <path d="M38 64 L50 58 L52 68 Z M118 64 L106 58 L104 68 Z" fill="url(#dcGold)" ${L}/>
      <circle cx="78" cy="42" r="19" fill="url(#dcSkin)" ${L}/>
      <path d="M48 34 Q78 4 108 34 L112 26 Q78 -6 44 26 Z" fill="#1a1a2a" ${L}/>
      <path d="M60 26 L96 26" stroke="url(#dcGold)" stroke-width="2.4"/><path d="M78 14 L74 22 L82 22 Z" fill="#f4f0e0"/>
      ${eye(70, 42, 3.6, '#c8fff0')}
      <path d="M82 36 L94 46 M94 36 L82 46" stroke="#1c1220" stroke-width="3"/>
      <path d="M64 56 Q78 52 92 56 L90 62 Q78 58 66 62 Z" fill="#3a5a4a"/>
      <path d="M40 70 Q24 76 20 92" stroke="url(#dcCoat)" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M22 96 Q8 70 14 44" stroke="#dce4ec" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M16 96 L30 92" stroke="url(#dcGold)" stroke-width="4"/>`),

    bogHag: () => svg(`<defs>${lin('bhSkin', '#9ab86a', '#4a6a2a')}${lin('bhRobe', '#4a3a2a', '#1a140c')}${lin('bhBrew', '#b6ff5a', '#3a8a1a')}</defs>
      <path d="M44 64 Q30 110 26 156 L118 156 Q110 110 100 64 Z" fill="url(#bhRobe)" ${L}/>
      <path d="M48 64 L72 4 L104 62 Q76 70 48 64 Z" fill="#2a2018" ${L}/>
      <path d="M40 62 Q74 74 112 62" stroke="#1c1220" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M58 64 Q56 92 72 96 Q90 92 90 64 Z" fill="url(#bhSkin)" ${L}/>
      ${eye(64, 76, 3, '#ffe680')}${eye(80, 76, 3, '#ffe680')}
      <path d="M56 82 Q48 92 54 98 Q60 92 62 86 Z" fill="url(#bhSkin)" ${L}/>
      <path d="M66 88 Q72 92 80 88" stroke="#1c1220" stroke-width="1.6" fill="none"/>
      <path d="M50 66 Q38 80 34 100 M98 66 Q110 80 106 104" stroke="#8a8a7a" stroke-width="3" fill="none" opacity=".7"/>
      <path d="M8 120 Q8 104 26 104 L58 104 Q74 104 74 120 Q74 146 42 146 Q8 146 8 120 Z" fill="#1c1a20" ${L}/>
      <ellipse cx="41" cy="106" rx="30" ry="6" fill="url(#bhBrew)" ${L}/>
      <circle cx="30" cy="96" r="4" fill="none" stroke="#b6ff5a" stroke-width="2"/><circle cx="46" cy="88" r="3" fill="none" stroke="#b6ff5a" stroke-width="2"/>
      <path d="M98 80 L118 120" stroke="#5a3a1a" stroke-width="5" stroke-linecap="round"/><ellipse cx="120" cy="124" rx="8" ry="5" fill="#8a6a3a" ${L}/>`),

    boneColossus: () => svg(`<defs>${lin('bcBone', '#fbf6e8', '#b8ac92')}${glow('bcGlow', '#7fe0ff', 0.35)}</defs>
      <circle cx="80" cy="70" r="70" fill="url(#bcGlow)"/>
      <path d="M50 156 L58 112 M110 156 L102 112" stroke="url(#bcBone)" stroke-width="14" stroke-linecap="round"/>
      <path d="M44 66 Q40 100 56 116 L104 116 Q120 100 116 66 Z" fill="#2a2430" ${L}/>
      ${[0, 1, 2, 3].map((i) => `<path d="M50 ${74 + i * 10} Q80 ${66 + i * 10} 110 ${74 + i * 10}" stroke="url(#bcBone)" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M80 62 L80 116" stroke="url(#bcBone)" stroke-width="7"/>
      <path d="M44 70 Q20 76 12 104 M116 70 Q140 76 148 104" stroke="url(#bcBone)" stroke-width="11" fill="none" stroke-linecap="round"/>
      <path d="M2 104 L22 104 L20 124 L4 124 Z M138 104 L158 104 L156 124 L140 124 Z" fill="url(#bcBone)" ${L}/>
      <path d="M50 30 C50 6 110 6 110 30 C110 44 102 52 96 56 L96 64 L64 64 L64 56 C58 52 50 44 50 30 Z" fill="url(#bcBone)" ${L}/>
      <ellipse cx="68" cy="34" rx="8" ry="10" fill="#1c1220"/><ellipse cx="92" cy="34" rx="8" ry="10" fill="#1c1220"/>
      <circle cx="68" cy="35" r="3.5" fill="#7fe0ff"/><circle cx="92" cy="35" r="3.5" fill="#7fe0ff"/>
      <path d="M80 42 L76 50 L84 50 Z" fill="#1c1220"/>
      <path d="M68 56 L68 64 M76 56 L76 64 M84 56 L84 64 M92 56 L92 64" stroke="#1c1220" stroke-width="2"/>
      <path d="M58 10 L64 0 L70 8 M90 8 L96 0 L102 10" stroke="url(#bcBone)" stroke-width="4" fill="none"/>`),

    graveRobber: () => svg(`<defs>${lin('grCloak', '#4a4038', '#16120e')}</defs>
      <path d="M54 154 L60 114 L72 114 L70 154 Z M86 154 L86 114 L98 114 L102 154 Z" fill="#1e1a16" ${L}/>
      <path d="M44 62 Q38 108 50 120 L104 120 Q116 108 110 62 Q78 50 44 62 Z" fill="url(#grCloak)" ${L}/>
      <path d="M50 58 Q50 22 78 20 Q106 22 106 58 Q92 66 78 66 Q62 66 50 58 Z" fill="url(#grCloak)" ${L}/>
      <path d="M60 50 Q78 60 96 50 L96 58 Q78 66 60 58 Z" fill="#2a2420" ${L}/>
      <path d="M58 40 Q78 34 98 40 Q96 50 78 50 Q60 50 58 40 Z" fill="#0c0a08"/>
      ${eye(68, 43, 2.6, '#ffd060')}${eye(88, 43, 2.6, '#ffd060')}
      <path d="M44 72 Q28 86 26 104" stroke="url(#grCloak)" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M26 104 L10 70" stroke="#d8dee8" stroke-width="4" stroke-linecap="round"/>
      <path d="M108 72 Q124 84 128 98" stroke="url(#grCloak)" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M118 96 Q136 92 140 108 Q138 124 120 122 Q108 116 118 96 Z" fill="#8a6a3a" ${L}/>
      <circle cx="128" cy="110" r="4" fill="#ffd060"/>`),

    // =================== ACT II ===================
    mossGolem: () => svg(`<defs>${lin('mgStone', '#8a9a7a', '#3a4a32')}${lin('mgMoss', '#8ad05a', '#3a7a22')}</defs>
      <path d="M44 156 L48 118 L74 118 L70 156 Z M90 156 L92 118 L116 118 L120 156 Z" fill="url(#mgStone)" ${L}/>
      <path d="M34 60 Q24 100 40 122 L122 122 Q138 100 128 60 Q82 40 34 60 Z" fill="url(#mgStone)" ${L}/>
      <path d="M34 62 Q60 74 82 62 Q104 74 128 62 L126 76 Q104 84 82 76 Q60 86 36 76 Z" fill="url(#mgMoss)" ${L}/>
      <path d="M52 92 L60 104 M98 90 L108 102 M74 100 L76 112" stroke="#2a3422" stroke-width="2"/>
      <path d="M58 30 Q60 14 82 14 Q104 14 104 32 L102 54 L60 54 Z" fill="url(#mgStone)" ${L}/>
      <path d="M58 30 Q82 20 104 30 L104 22 Q82 8 58 22 Z" fill="url(#mgMoss)"/>
      <rect x="66" y="34" width="10" height="6" rx="2" fill="#c8ff7a"/><rect x="86" y="34" width="10" height="6" rx="2" fill="#c8ff7a"/>
      <path d="M34 70 Q14 84 14 112" stroke="url(#mgStone)" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M128 70 Q148 84 148 112" stroke="url(#mgStone)" stroke-width="16" fill="none" stroke-linecap="round"/>
      <circle cx="44" cy="130" r="3" fill="#ff9ad8"/><circle cx="116" cy="70" r="3" fill="#ff9ad8"/>`),

    sporeBat: () => svg(`<defs>${lin('sbWing', '#8a5aa8', '#2a1a3a')}${glow('sbSpore', '#d8ff8a', 0.6)}</defs>
      <path d="M80 82 Q50 40 10 52 Q24 66 22 84 Q36 80 46 92 Q56 82 80 92 Z" fill="url(#sbWing)" ${L}/>
      <path d="M80 82 Q110 40 150 52 Q136 66 138 84 Q124 80 114 92 Q104 82 80 92 Z" fill="url(#sbWing)" ${L}/>
      <ellipse cx="80" cy="92" rx="20" ry="22" fill="#4a2a5a" ${L}/>
      <path d="M66 74 L60 56 L72 70 Z M94 74 L100 56 L88 70 Z" fill="#4a2a5a" ${L}/>
      ${eye(72, 86, 4, '#ff6a4a')}${eye(88, 86, 4, '#ff6a4a')}
      <path d="M74 100 L76 106 L78 100 M82 100 L84 106 L86 100" stroke="#fff" stroke-width="1.6" fill="none"/>
      <circle cx="80" cy="128" r="18" fill="url(#sbSpore)"/>
      <circle cx="70" cy="124" r="2.5" fill="#d8ff8a"/><circle cx="88" cy="130" r="2" fill="#d8ff8a"/><circle cx="80" cy="138" r="2.2" fill="#d8ff8a"/>`),

    hyphaeWeaver: () => svg(`<defs>${lin('hwBody', '#d8c8a8', '#6a5a3a')}</defs>
      <path d="M10 10 L150 150 M150 10 L10 150 M80 0 L80 160 M0 80 L160 80" stroke="#e8e0d0" stroke-width="1" opacity=".35"/>
      <circle cx="80" cy="80" r="40" fill="none" stroke="#e8e0d0" stroke-width="1" opacity=".3"/><circle cx="80" cy="80" r="62" fill="none" stroke="#e8e0d0" stroke-width="1" opacity=".2"/>
      ${[[-1, 0], [-1, 1], [1, 0], [1, 1]].map(([s, k]) => `<path d="M80 ${88 + k * 8} Q${80 + s * 40} ${60 + k * 20} ${80 + s * 64} ${100 + k * 26}" stroke="#2a2018" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}
      <ellipse cx="96" cy="100" rx="26" ry="22" fill="url(#hwBody)" ${L}/>
      <path d="M86 90 Q96 84 106 92 M84 104 Q96 98 108 106" stroke="#8a7a5a" stroke-width="2" fill="none"/>
      <circle cx="66" cy="88" r="16" fill="url(#hwBody)" ${L}/>
      ${eye(58, 84, 3, '#ff4a6a')}${eye(66, 80, 2.4, '#ff4a6a')}${eye(72, 86, 2.4, '#ff4a6a')}${eye(60, 92, 2, '#ff4a6a')}
      <path d="M52 98 L48 108 M58 100 L56 110" stroke="#1c1220" stroke-width="3" stroke-linecap="round"/>
      <circle cx="114" cy="84" r="3" fill="#ff9ad8"/><circle cx="104" cy="118" r="2.5" fill="#ff9ad8"/>`),

    rotHound: () => svg(`<defs>${lin('rhFur', '#7a8a5a', '#2a3a1a')}</defs>
      <path d="M118 96 Q148 84 152 60" stroke="url(#rhFur)" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M46 92 Q48 70 80 70 L120 72 Q136 76 132 104 L126 122 L48 122 Z" fill="url(#rhFur)" ${L}/>
      <path d="M58 122 L56 150 M74 122 L74 150 M108 122 L110 150 M122 120 L126 150" stroke="#1c1220" stroke-width="7" stroke-linecap="round"/>
      <path d="M58 122 L56 150 M74 122 L74 150 M108 122 L110 150 M122 120 L126 150" stroke="#5a6a3a" stroke-width="4" stroke-linecap="round"/>
      <path d="M50 74 Q30 60 14 70 Q8 84 18 92 L46 96 Z" fill="url(#rhFur)" ${L}/>
      <path d="M38 64 L42 46 L52 66 Z" fill="url(#rhFur)" ${L}/>
      <path d="M14 82 L44 90" stroke="#1c1220" stroke-width="2"/>
      <path d="M18 84 L22 90 M26 85 L29 92 M34 86 L36 93" stroke="#fff" stroke-width="2"/>
      ${eye(34, 74, 3.6, '#ffd23a')}
      <circle cx="90" cy="86" r="6" fill="#b4e05a"/><circle cx="108" cy="96" r="4" fill="#b4e05a"/><circle cx="76" cy="100" r="3" fill="#b4e05a"/>`),

    lichenKnight: () => svg(`<defs>${lin('lkArmor', '#8aa08a', '#2a3a2a')}${lin('lkLichen', '#d8f07a', '#6a9a2a')}</defs>
      <path d="M56 154 L60 114 L74 114 L72 154 Z M88 154 L88 114 L102 114 L106 154 Z" fill="#22301e" ${L}/>
      <path d="M50 62 Q46 104 56 118 L104 118 Q114 104 110 62 Q80 52 50 62 Z" fill="url(#lkArmor)" ${L}/>
      <circle cx="66" cy="80" r="6" fill="url(#lkLichen)"/><circle cx="92" cy="96" r="7" fill="url(#lkLichen)"/><circle cx="76" cy="106" r="4" fill="url(#lkLichen)"/>
      <path d="M60 22 Q80 10 100 22 L102 56 Q80 64 58 56 Z" fill="url(#lkArmor)" ${L}/>
      <rect x="64" y="34" width="32" height="6" rx="2" fill="#c8ff7a"/>
      <path d="M72 14 Q80 4 92 12" stroke="url(#lkLichen)" stroke-width="4" fill="none"/>
      <path d="M16 64 L52 64 L52 110 Q34 128 16 110 Z" fill="#3a4a32" ${L}/>
      <circle cx="34" cy="84" r="9" fill="url(#lkLichen)"/>
      <path d="M110 76 L132 86" stroke="#2a2018" stroke-width="6" stroke-linecap="round"/>
      <path d="M128 84 L156 30 L159 33 L134 88 Z" fill="#c4d4c4" ${L}/>`),

    bloomCaller: () => svg(`<defs>${lin('bcRobe', '#4a8a4a', '#1a3a1a')}${lin('bcPetal', '#ff9ad0', '#c8307a')}</defs>
      <path d="M48 64 Q36 110 30 154 L118 154 Q112 110 104 64 Z" fill="url(#bcRobe)" ${L}/>
      <path d="M48 92 Q76 100 104 92" stroke="#2a5a2a" stroke-width="3" fill="none"/>
      <path d="M58 64 Q56 38 76 36 Q96 38 94 64 Z" fill="#c8a07a" ${L}/>
      ${eye(68, 52, 3, '#ff4a9a')}${eye(84, 52, 3, '#ff4a9a')}
      ${[0, 1, 2, 3, 4, 5, 6].map((i) => { const a = (i / 7) * Math.PI * 2; return `<ellipse cx="${(76 + Math.cos(a) * 24).toFixed(1)}" cy="${(36 + Math.sin(a) * 24).toFixed(1)}" rx="11" ry="7" transform="rotate(${(a * 180 / Math.PI).toFixed(0)} ${(76 + Math.cos(a) * 24).toFixed(1)} ${(36 + Math.sin(a) * 24).toFixed(1)})" fill="url(#bcPetal)" ${L}/>`; }).join('')}
      <path d="M58 64 Q56 38 76 36 Q96 38 94 64 Z" fill="#c8a07a" ${L}/>
      ${eye(68, 52, 3, '#ff4a9a')}${eye(84, 52, 3, '#ff4a9a')}
      <path d="M48 76 Q26 80 16 102" stroke="url(#bcRobe)" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M16 102 C6 90 2 70 10 56 M16 102 C24 120 14 134 4 140" stroke="#3a7a2a" stroke-width="4" fill="none"/>
      <path d="M8 76 L2 72 M12 92 L4 92 M14 120 L6 124" stroke="#2a5a2a" stroke-width="3"/>
      <circle cx="10" cy="56" r="6" fill="url(#bcPetal)" ${L}/>`),

    sporeQueen: () => svg(`<defs>${lin('sqWing', '#c88aff', '#4a1a7a')}${lin('sqBody', '#5a2a6a', '#1a0a24')}${glow('sqDust', '#e8ff9a', 0.4)}</defs>
      <circle cx="80" cy="80" r="74" fill="url(#sqDust)"/>
      <path d="M80 70 Q40 10 4 30 Q16 56 10 82 Q34 74 54 96 Z" fill="url(#sqWing)" ${L}/>
      <path d="M80 70 Q120 10 156 30 Q144 56 150 82 Q126 74 106 96 Z" fill="url(#sqWing)" ${L}/>
      <path d="M70 96 Q36 110 22 146 Q46 140 66 120 Z M90 96 Q124 110 138 146 Q114 140 94 120 Z" fill="url(#sqWing)" opacity=".85" ${L}/>
      <circle cx="40" cy="44" r="8" fill="#ffe680" opacity=".7"/><circle cx="120" cy="44" r="8" fill="#ffe680" opacity=".7"/>
      <ellipse cx="80" cy="96" rx="15" ry="38" fill="url(#sqBody)" ${L}/>
      <path d="M68 90 L92 90 M67 102 L93 102 M69 114 L91 114" stroke="#8a5aa8" stroke-width="2"/>
      <circle cx="80" cy="56" r="13" fill="url(#sqBody)" ${L}/>
      ${eye(74, 54, 3.5, '#d8ff6a')}${eye(86, 54, 3.5, '#d8ff6a')}
      <path d="M74 44 Q66 26 56 24 M86 44 Q94 26 104 24" stroke="#1c1220" stroke-width="2.4" fill="none"/>
      <path d="M68 40 L72 32 L76 38 L80 30 L84 38 L88 32 L92 40 Z" fill="#ffd76a" ${L}/>`),

    hydra: () => svg(`<defs>${lin('hyScale', '#6aa86a', '#1a4a2a')}${lin('hyCap', '#e85a5a', '#8a1a2a')}</defs>
      <path d="M40 156 Q30 120 60 104 L110 104 Q140 120 128 156 Z" fill="url(#hyScale)" ${L}/>
      ${[[52, 60, -18], [84, 38, 0], [116, 62, 18]].map(([x, y, r]) => `
        <path d="M84 110 Q${x} ${y + 40} ${x} ${y + 10}" stroke="#1c1220" stroke-width="18" fill="none" stroke-linecap="round"/>
        <path d="M84 110 Q${x} ${y + 40} ${x} ${y + 10}" stroke="url(#hyScale)" stroke-width="13" fill="none" stroke-linecap="round"/>
        <g transform="rotate(${r} ${x} ${y})">
          <ellipse cx="${x}" cy="${y}" rx="14" ry="11" fill="url(#hyScale)" ${L}/>
          <path d="M${x - 16} ${y - 4} Q${x} ${y - 26} ${x + 16} ${y - 4} Z" fill="url(#hyCap)" ${L}/>
          <circle cx="${x - 6}" cy="${y - 12}" r="2.4" fill="#fff"/><circle cx="${x + 6}" cy="${y - 10}" r="2" fill="#fff"/>
          ${eye(x - 5, y + 1, 2.4, '#ffd23a')}
          <path d="M${x - 14} ${y + 6} L${x - 4} ${y + 8}" stroke="#1c1220" stroke-width="2"/>
        </g>`).join('')}`),

    elderOak: () => svg(`<defs>${lin('eoBark', '#7a5a3a', '#2a1a0e')}${lin('eoCap', '#c8a0e8', '#5a2a8a')}${glow('eoGlow', '#d8ff8a', 0.35)}</defs>
      <circle cx="80" cy="70" r="74" fill="url(#eoGlow)"/>
      <path d="M40 158 Q50 128 52 100 L108 100 Q110 128 122 158 Z" fill="url(#eoBark)" ${L}/>
      <path d="M40 158 Q30 150 18 156 M122 158 Q134 150 146 156 M60 158 Q56 146 48 146" stroke="#2a1a0e" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M52 100 Q30 80 10 84 M108 100 Q130 78 150 86 M70 70 Q60 40 40 30 M96 70 Q104 40 124 28" stroke="#1c1220" stroke-width="11" fill="none" stroke-linecap="round"/>
      <path d="M52 100 Q30 80 10 84 M108 100 Q130 78 150 86 M70 70 Q60 40 40 30 M96 70 Q104 40 124 28" stroke="url(#eoBark)" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M50 108 L52 64 Q80 50 108 64 L110 108 Z" fill="url(#eoBark)" ${L}/>
      <path d="M62 80 Q68 76 74 80 M86 80 Q92 76 98 80" stroke="#1c1220" stroke-width="3" fill="none"/>
      <ellipse cx="68" cy="84" rx="4" ry="3" fill="#d8ff6a"/><ellipse cx="92" cy="84" rx="4" ry="3" fill="#d8ff6a"/>
      <path d="M66 98 Q80 90 94 98 Q80 104 66 98 Z" fill="#1a0e06"/>
      ${[[34, 28, 12], [124, 26, 12], [10, 82, 9], [150, 84, 9], [80, 46, 14]].map(([x, y, r]) => `<path d="M${x - r} ${y} Q${x} ${y - r * 1.4} ${x + r} ${y} Z" fill="url(#eoCap)" ${L}/><circle cx="${x - r / 3}" cy="${y - r / 2}" r="${r / 6}" fill="#fff"/>`).join('')}
      <circle cx="30" cy="120" r="2.5" fill="#d8ff8a"/><circle cx="132" cy="118" r="2" fill="#d8ff8a"/><circle cx="20" cy="54" r="2" fill="#d8ff8a"/>`),

    infectedExplorer: () => svg(`<defs>${lin('ieCoat', '#8a7a4a', '#3a301a')}${lin('ieShroom', '#ff8a5a', '#a83a1a')}</defs>
      <path d="M54 154 L60 114 L72 114 L70 154 Z M86 154 L86 114 L98 114 L102 154 Z" fill="#2a2418" ${L}/>
      <path d="M46 64 Q40 106 52 120 L104 120 Q116 106 110 64 Q78 52 46 64 Z" fill="url(#ieCoat)" ${L}/>
      <path d="M58 64 L64 120 M98 64 L92 120" stroke="#4a3a1a" stroke-width="2"/>
      <circle cx="78" cy="44" r="18" fill="#c8b48a" ${L}/>
      <path d="M56 36 Q78 18 100 36 L104 30 Q78 8 52 30 Z" fill="#6a5a2a" ${L}/>
      ${eye(70, 46, 3, '#d8ff6a')}<circle cx="86" cy="46" r="3" fill="#1c1220"/>
      <path d="M70 54 Q78 58 86 54" stroke="#1c1220" stroke-width="1.8" fill="none"/>
      <path d="M90 34 Q96 22 106 26 Q104 36 92 38 Z M60 58 Q50 54 50 64 Q58 66 62 62 Z" fill="url(#ieShroom)" ${L}/>
      <path d="M100 76 Q112 70 116 84 Q106 90 100 84 Z" fill="url(#ieShroom)" ${L}/>
      <path d="M46 74 Q30 86 26 102" stroke="url(#ieCoat)" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M28 104 L14 64" stroke="#5a3a1a" stroke-width="4" stroke-linecap="round"/>
      <path d="M2 66 Q14 56 26 66 L14 70 Z" fill="#a4b0bc" ${L}/>`),

    // =================== ACT III ===================
    abyssalMaw: () => svg(`<defs>${lin('amFlesh', '#4a1a3a', '#12060e')}${glow('amGlow', '#ff3a6a', 0.35)}</defs>
      <circle cx="80" cy="80" r="70" fill="url(#amGlow)"/>
      <path d="M14 80 Q20 26 80 22 Q140 26 146 80 Q140 134 80 138 Q20 134 14 80 Z" fill="url(#amFlesh)" ${L}/>
      <path d="M30 80 Q80 40 130 80 Q80 120 30 80 Z" fill="#06020a" ${L}/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${38 + i * 12} ${76 - Math.sin((i / 7) * Math.PI) * 18} l5 12 l5 -12 Z" fill="#f4ece0" stroke="#1c1220" stroke-width="1"/><path d="M${38 + i * 12} ${84 + Math.sin((i / 7) * Math.PI) * 18} l5 -12 l5 12 Z" fill="#f4ece0" stroke="#1c1220" stroke-width="1"/>`).join('')}
      <path d="M70 84 Q80 96 92 86" stroke="#c83a6a" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${eye(40, 40, 5, '#ff6a8a')}${eye(120, 42, 4, '#ff6a8a')}${eye(80, 30, 3.5, '#ff6a8a')}
      <path d="M30 128 Q20 146 26 156 M130 128 Q144 144 136 156 M80 138 L80 156" stroke="url(#amFlesh)" stroke-width="7" fill="none" stroke-linecap="round"/>`),

    nightWeaver: () => svg(`<defs>${lin('nwBody', '#6a52a8', '#24183e')}</defs>
      <path d="M80 0 L80 60" stroke="#c8b8ff" stroke-width="1.4" opacity=".6"/>
      ${[[-1, 0], [-1, 1], [-1, 2], [1, 0], [1, 1], [1, 2]].map(([s, k]) => `<path d="M80 ${92 + k * 6} Q${80 + s * (36 + k * 6)} ${54 + k * 18} ${80 + s * (66 - k * 4)} ${104 + k * 22}" stroke="#0a0614" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}
      <ellipse cx="80" cy="108" rx="26" ry="28" fill="url(#nwBody)" ${L}/>
      <path d="M70 100 L80 92 L90 100 L80 120 Z" fill="#a34cff" opacity=".7"/>
      <circle cx="80" cy="72" r="18" fill="url(#nwBody)" ${L}/>
      ${eye(70, 68, 3.4, '#b78aff')}${eye(90, 68, 3.4, '#b78aff')}${eye(76, 60, 2.4, '#b78aff')}${eye(84, 60, 2.4, '#b78aff')}
      <path d="M72 84 L70 94 M88 84 L90 94" stroke="#e8e0ff" stroke-width="3" stroke-linecap="round"/>`),

    hollowPilgrim: () => svg(`<defs>${lin('hpRobe', '#4a4a5a', '#121218')}</defs>
      <path d="M48 52 Q34 110 30 156 L120 156 Q114 110 104 52 Q76 40 48 52 Z" fill="url(#hpRobe)" ${L}/>
      <path d="M50 54 Q50 22 76 20 Q102 22 102 54 Q90 62 76 62 Q62 62 50 54 Z" fill="url(#hpRobe)" ${L}/>
      <path d="M58 50 Q58 30 76 28 Q94 30 94 50 Q86 56 76 56 Q66 56 58 50 Z" fill="#e8e4ec"/>
      <path d="M58 50 Q58 30 76 28 Q94 30 94 50" stroke="#1c1220" stroke-width="1.6" fill="none"/>
      <path d="M66 40 Q70 44 74 40 M80 40 Q84 44 88 40" stroke="#1c1220" stroke-width="1.6" fill="none"/>
      <path d="M76 60 L76 156" stroke="#1c1220" stroke-width="1.4" opacity=".5"/>
      <path d="M50 70 Q34 84 30 100" stroke="url(#hpRobe)" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M26 30 L32 156" stroke="#6a5a4a" stroke-width="5" stroke-linecap="round"/>
      <circle cx="26" cy="26" r="8" fill="none" stroke="#c8b8ff" stroke-width="3"/><circle cx="26" cy="26" r="3" fill="#c8b8ff"/>`),

    starEater: () => svg(`<defs>${glow('seBody', '#6a4aff', 0.7)}${glow('seCore', '#ffe6a0', 0.9)}</defs>
      <path d="M40 80 Q40 24 80 22 Q120 24 120 80 Q100 92 80 86 Q60 92 40 80 Z" fill="url(#seBody)" stroke="#a89aff" stroke-width="2"/>
      <circle cx="80" cy="56" r="14" fill="url(#seCore)"/>
      <circle cx="58" cy="50" r="1.6" fill="#fff"/><circle cx="98" cy="44" r="1.8" fill="#fff"/><circle cx="70" cy="34" r="1.2" fill="#fff"/><circle cx="92" cy="66" r="1.4" fill="#fff"/>
      ${eye(68, 64, 3, '#fff6c8')}${eye(92, 64, 3, '#fff6c8')}
      ${[0, 1, 2, 3, 4, 5].map((i) => { const x = 46 + i * 13.6; return `<path d="M${x} 84 Q${x + (i % 2 ? 8 : -8)} 112 ${x} 140 Q${x + (i % 2 ? -6 : 6)} 150 ${x} 158" stroke="#8a7aff" stroke-width="3" fill="none" opacity=".8"/>`; }).join('')}`),

    umbralImp: () => svg(`<defs>${lin('uiSkin', '#5a2a6a', '#1a0a24')}</defs>
      <path d="M104 98 Q132 110 140 92 Q132 116 108 112" stroke="#1a0a24" stroke-width="4" fill="none"/><path d="M138 92 L146 86 L144 98 Z" fill="#1a0a24"/>
      <path d="M58 90 Q54 74 80 70 Q106 74 104 92 Q104 120 80 124 Q58 120 58 90 Z" fill="url(#uiSkin)" ${L}/>
      <path d="M66 126 L60 146 M94 126 L100 146" stroke="#1a0a24" stroke-width="6" stroke-linecap="round"/>
      <path d="M58 92 Q40 96 30 82 M104 92 Q120 98 128 86" stroke="url(#uiSkin)" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M24 74 L32 82 M28 70 L34 80 M34 70 L36 80" stroke="#1c1220" stroke-width="2.4"/>
      <circle cx="80" cy="58" r="20" fill="url(#uiSkin)" ${L}/>
      <path d="M64 46 L54 20 L72 42 Z M96 46 L106 20 L88 42 Z" fill="#2a0a34" ${L}/>
      ${eye(72, 56, 4, '#ffd23a')}${eye(88, 56, 4, '#ffd23a')}
      <path d="M68 68 Q80 76 92 68" stroke="#1c1220" stroke-width="2.4" fill="none"/><path d="M72 70 L74 74 L76 70 M84 70 L86 74 L88 70" fill="#fff"/>
      <path d="M58 100 Q34 90 26 108 Q44 112 58 104 Z M104 100 Q128 90 136 108 Q118 112 104 104 Z" fill="#3a1a4a" opacity=".85" ${L}/>`),

    lanternThief: () => svg(`<defs>${glow('ltGlow', '#ffb347', 0.8)}${lin('ltBody', '#2a2a4a', '#08080e')}</defs>
      <path d="M50 40 Q50 14 80 12 Q110 14 110 40 L112 120 L102 112 L94 124 L86 112 L78 124 L70 112 L60 124 L50 112 Z" fill="url(#ltBody)" stroke="#6a6aaa" stroke-width="1.6"/>
      ${eye(68, 42, 4, '#9fe8ff')}${eye(90, 42, 4, '#9fe8ff')}
      <path d="M70 58 Q80 64 90 58" stroke="#9fe8ff" stroke-width="2" fill="none"/>
      <path d="M50 70 Q30 76 22 92" stroke="url(#ltBody)" stroke-width="8" fill="none" stroke-linecap="round"/>
      <circle cx="20" cy="112" r="26" fill="url(#ltGlow)"/>
      <path d="M20 90 L20 96" stroke="#1c1220" stroke-width="2"/>
      <rect x="12" y="96" width="16" height="22" rx="3" fill="#ffe08a" stroke="#4a3010" stroke-width="2"/>
      <path d="M20 100 Q24 106 20 113 Q16 106 20 100 Z" fill="#ff7a1a"/>
      <path d="M118 60 Q130 70 124 84 M126 40 Q140 56 134 76" stroke="#6a6aaa" stroke-width="1.6" fill="none" opacity=".6"/>`),

    voidBehemoth: () => svg(`<defs>${lin('vbHide', '#3a3a5a', '#0a0a18')}${glow('vbGlow', '#7a4aff', 0.4)}</defs>
      <circle cx="80" cy="84" r="74" fill="url(#vbGlow)"/>
      <path d="M30 156 L34 122 L56 122 L54 156 Z M104 156 L104 122 L126 122 L130 156 Z" fill="url(#vbHide)" ${L}/>
      <path d="M24 100 Q18 52 72 44 Q132 40 142 92 Q142 128 112 128 L46 128 Q24 126 24 100 Z" fill="url(#vbHide)" ${L}/>
      <path d="M60 50 L66 30 L74 48 M92 46 L100 26 L106 48 M120 58 L134 42 L132 64" fill="#4a3a6a" ${L}/>
      <path d="M48 70 Q70 60 92 70 M44 92 Q72 84 100 94" stroke="#7a4aff" stroke-width="2.4" fill="none" opacity=".7"/>
      <path d="M30 76 Q8 74 4 98 Q10 116 30 110 Z" fill="url(#vbHide)" ${L}/>
      <path d="M14 80 Q0 64 6 52 M22 78 Q16 60 24 50" stroke="#e8e0ff" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${eye(20, 92, 4, '#c89aff')}
      <path d="M8 104 L26 106" stroke="#1c1220" stroke-width="2"/>`),

    twinWraith: () => svg(`<defs>${lin('twBody', '#c8d8ff', '#3a4a8a')}${glow('twGlow', '#9fc3ff', 0.4)}</defs>
      <circle cx="80" cy="70" r="66" fill="url(#twGlow)"/>
      <path d="M44 40 Q44 12 80 10 Q116 12 116 40 L120 120 Q108 108 100 130 Q92 112 80 136 Q68 112 60 130 Q52 108 40 120 Z" fill="url(#twBody)" opacity=".85" stroke="#e8f0ff" stroke-width="1.6"/>
      <path d="M58 44 Q80 52 102 44 Q100 58 80 60 Q60 58 58 44 Z" fill="#0a0a1a"/>
      ${eye(68, 50, 3.4, '#ff6a9a')}${eye(92, 50, 3.4, '#ff6a9a')}
      <path d="M44 70 Q22 70 12 90 M116 70 Q138 72 148 92" stroke="url(#twBody)" stroke-width="7" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M6 88 L14 96 M10 84 L18 92 M146 90 L152 98 M150 86 L156 94" stroke="#e8f0ff" stroke-width="2.4"/>
      <path d="M68 74 L92 74 M70 84 L90 84" stroke="#e8f0ff" stroke-width="1.4" opacity=".6"/>`),

    namelessKing: () => svg(`<defs>${lin('nkRobe', '#2a1a3a', '#05030a')}${lin('nkGold', '#fff0a8', '#a8701a')}${glow('nkGlow', '#9a4aff', 0.45)}</defs>
      <circle cx="80" cy="70" r="76" fill="url(#nkGlow)"/>
      <path d="M38 64 Q20 116 14 158 L146 158 Q140 116 122 64 Q80 46 38 64 Z" fill="url(#nkRobe)" ${L}/>
      <path d="M66 64 L60 158 M94 64 L100 158" stroke="url(#nkGold)" stroke-width="3"/>
      <path d="M40 66 Q80 84 120 66 L118 78 Q80 96 42 78 Z" fill="#e8e0f0" ${L}/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${48 + i * 12.8}" cy="${76 + Math.sin((i / 5) * Math.PI) * 8}" r="2" fill="#1c1220"/>`).join('')}
      <path d="M56 58 Q56 26 80 24 Q104 26 104 58 Q92 66 80 66 Q68 66 56 58 Z" fill="#0a0612" ${L}/>
      ${eye(70, 46, 3.6, '#c89aff')}${eye(90, 46, 3.6, '#c89aff')}
      <path d="M52 30 L56 6 L66 20 L74 0 L80 16 L86 0 L94 20 L104 6 L108 30 Z" fill="url(#nkGold)" ${L}/>
      <circle cx="80" cy="22" r="4" fill="#9a2aff"/><circle cx="64" cy="26" r="2.5" fill="#ff3a6a"/><circle cx="96" cy="26" r="2.5" fill="#ff3a6a"/>
      <path d="M38 82 Q22 92 20 110" stroke="url(#nkRobe)" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M22 156 L18 40" stroke="url(#nkGold)" stroke-width="5" stroke-linecap="round"/>
      <circle cx="18" cy="34" r="10" fill="#1a0a2a" stroke="url(#nkGold)" stroke-width="3"/><circle cx="18" cy="34" r="4" fill="#c89aff"/>`),

    mirrorWraith: () => svg(`<defs>${lin('mwGlass', '#e8f4ff', '#7a9ac8')}${lin('mwFrame', '#d8c8ff', '#4a3a8a')}</defs>
      <path d="M80 6 Q122 8 122 60 L122 126 Q122 150 80 152 Q38 150 38 126 L38 60 Q38 8 80 6 Z" fill="url(#mwFrame)" ${L}/>
      <path d="M80 16 Q112 18 112 62 L112 124 Q112 142 80 144 Q48 142 48 124 L48 62 Q48 18 80 16 Z" fill="url(#mwGlass)" ${L}/>
      <path d="M58 40 L74 70 L62 92 M98 34 L86 64 L104 98 L90 128 M70 112 L80 140" stroke="#ffffff" stroke-width="1.8" fill="none" opacity=".9"/>
      <path d="M62 82 Q62 56 80 54 Q98 56 98 82 L100 120 Q80 112 60 120 Z" fill="#3a3a6a" opacity=".55"/>
      ${eye(72, 72, 3.4, '#ff4a7a')}${eye(88, 72, 3.4, '#ff4a7a')}
      <path d="M72 84 Q80 90 88 84" stroke="#ff4a7a" stroke-width="2" fill="none"/>
      <path d="M38 80 L22 70 L26 84 L14 88 L36 96 M122 80 L138 70 L134 84 L146 88 L124 96" fill="url(#mwGlass)" ${L}/>`),
  });
})();
