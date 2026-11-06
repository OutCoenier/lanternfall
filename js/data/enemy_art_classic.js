// ===== Portraits for the original normal enemies =====
// Each returns an SVG (160x160). Enemies face left, toward the hero.
'use strict';

(function () {
  const L = 'stroke="#1c1220" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
  const eye = (x, y, r, c = '#ffe680') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.35}" fill="#fff"/>`;
  const glow = (id, c, op = 0.45) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${op}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
  const lin = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const svg = (inner) => `<svg class="portrait-svg" viewBox="0 0 160 160">${inner}</svg>`;
  const slime = () => svg(`<defs>${lin('slBody', '#7ae8c8', '#1a7a6a')}</defs>
    <path d="M14 134 Q10 84 44 62 Q66 40 92 52 Q138 66 146 134 Z" fill="url(#slBody)" opacity=".92" ${L}/>
    <ellipse cx="62" cy="74" rx="14" ry="8" fill="#fff" opacity=".35" transform="rotate(-25 62 74)"/>
    ${eye(62, 98, 7, '#0e2a24')}${eye(92, 96, 6, '#0e2a24')}
    <path d="M62 116 Q78 124 94 116" stroke="#0e2a24" stroke-width="3" fill="none"/>
    <circle cx="112" cy="112" r="6" fill="none" stroke="#c8fff0" stroke-width="2"/><circle cx="38" cy="120" r="4" fill="none" stroke="#c8fff0" stroke-width="2"/>
    <path d="M20 134 Q22 146 14 152 M140 134 Q138 146 148 150" stroke="url(#slBody)" stroke-width="5" fill="none" stroke-linecap="round"/>`);

  Object.assign(ENEMY_ART, {
    // ---------------- Act I ----------------
    leech: () => svg(`<defs>${lin('lcBody', '#c87a7a', '#5a2a2a')}</defs>
      <path d="M30 96 Q40 60 80 70 Q120 80 132 112 Q138 132 116 136 Q90 140 70 124 Q44 112 30 96 Z" fill="url(#lcBody)" ${L}/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${52 + i * 16} ${76 + i * 4} Q${48 + i * 16} ${100 + i * 4} ${58 + i * 16} ${118 + i * 3}" stroke="#4a1a1a" stroke-width="2" fill="none" opacity=".6"/>`).join('')}
      <ellipse cx="32" cy="94" rx="14" ry="16" fill="#8a3a3a" ${L}/>
      <circle cx="30" cy="94" r="9" fill="#2a0a0a"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i / 8) * Math.PI * 2; return `<path d="M${(30 + Math.cos(a) * 9).toFixed(1)} ${(94 + Math.sin(a) * 9).toFixed(1)} L${(30 + Math.cos(a) * 5).toFixed(1)} ${(94 + Math.sin(a) * 5).toFixed(1)}" stroke="#f4e8e0" stroke-width="2"/>`; }).join('')}
      <ellipse cx="78" cy="80" rx="18" ry="5" fill="#fff" opacity=".25" transform="rotate(12 78 80)"/>`),

    moth: () => svg(`<defs>${lin('mtWing', '#c8b8a0', '#5a4a3a')}</defs>
      <path d="M80 80 Q46 30 12 44 Q20 66 18 86 Q44 84 74 92 Z" fill="url(#mtWing)" ${L}/>
      <path d="M80 80 Q114 30 148 44 Q140 66 142 86 Q116 84 86 92 Z" fill="url(#mtWing)" ${L}/>
      <path d="M74 92 Q48 104 40 132 Q60 126 76 106 Z M86 92 Q112 104 120 132 Q100 126 84 106 Z" fill="url(#mtWing)" ${L}/>
      <circle cx="40" cy="62" r="8" fill="#3a2a1a"/><circle cx="40" cy="62" r="3.5" fill="#e8d8b0"/>
      <circle cx="120" cy="62" r="8" fill="#3a2a1a"/><circle cx="120" cy="62" r="3.5" fill="#e8d8b0"/>
      <ellipse cx="80" cy="96" rx="9" ry="26" fill="#4a3a2a" ${L}/>
      <circle cx="80" cy="70" r="9" fill="#5a4a3a" ${L}/>
      ${eye(76, 68, 2.6, '#ff6a4a')}${eye(85, 68, 2.6, '#ff6a4a')}
      <path d="M76 62 Q70 46 58 44 M84 62 Q90 46 102 44" stroke="#1c1220" stroke-width="2" fill="none"/>`),

    crawler: () => svg(`<defs>${lin('cwBody', '#a8a86a', '#4a4a2a')}</defs>
      ${[0, 1, 2, 3, 4].map((i) => `<circle cx="${128 - i * 18}" cy="${110 - Math.sin(i * 0.9) * 10}" r="${18 - i * 0.5}" fill="url(#cwBody)" ${L}/><path d="M${128 - i * 18} ${92 - Math.sin(i * 0.9) * 10} l-3 -10 l7 8" fill="#6a6a3a" ${L}/>`).join('')}
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${124 - i * 18} ${126 - Math.sin(i * 0.9) * 10} l-2 12" stroke="#1c1220" stroke-width="3" stroke-linecap="round"/>`).join('')}
      <circle cx="40" cy="96" r="22" fill="url(#cwBody)" ${L}/>
      ${eye(30, 90, 4, '#1c1220')}${eye(44, 86, 3.5, '#1c1220')}
      <path d="M20 106 Q14 116 22 118 M30 110 Q28 122 36 120" stroke="#3a2a1a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M40 74 Q36 58 28 54 M48 76 Q52 60 60 56" stroke="#1c1220" stroke-width="2" fill="none"/>`),

    rattler: () => svg(`<defs>${lin('rtBone', '#fbf6e8', '#bdb29a')}</defs>
      <path d="M62 150 L70 116 M98 150 L90 116" stroke="url(#rtBone)" stroke-width="6" stroke-linecap="round"/>
      <path d="M80 72 L80 116" stroke="url(#rtBone)" stroke-width="6"/>
      <path d="M64 82 Q80 76 96 82 M64 94 Q80 88 96 94 M66 106 Q80 100 94 106" stroke="url(#rtBone)" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M64 78 L40 96 M96 78 L118 92" stroke="url(#rtBone)" stroke-width="5" stroke-linecap="round"/>
      <circle cx="36" cy="100" r="8" fill="url(#rtBone)" ${L}/><circle cx="122" cy="94" r="8" fill="url(#rtBone)" ${L}/>
      <path d="M58 44 C58 24 102 24 102 44 C102 56 96 60 92 62 L92 72 L68 72 L68 62 C62 60 58 56 58 44 Z" fill="url(#rtBone)" ${L}/>
      <ellipse cx="71" cy="46" rx="6" ry="7" fill="#1c1220"/><ellipse cx="89" cy="46" rx="6" ry="7" fill="#1c1220"/>
      <circle cx="71" cy="47" r="2.4" fill="#ff6a5a"/><circle cx="89" cy="47" r="2.4" fill="#ff6a5a"/>
      <path d="M26 92 L22 86 M30 110 L24 114 M130 86 L136 82 M130 102 L136 106" stroke="#e8e0c8" stroke-width="2"/>`),

    acolyte: () => svg(`<defs>${lin('acRobe', '#2a5a6a', '#0a1a22')}${lin('acSkin', '#8ab8a8', '#3a6a5a')}${glow('acFlame', '#9fe8ff', 0.8)}</defs>
      <path d="M50 56 Q36 108 32 156 L122 156 Q116 108 106 56 Q78 44 50 56 Z" fill="url(#acRobe)" ${L}/>
      <path d="M52 58 Q52 24 78 22 Q104 24 104 58 Q92 66 78 66 Q64 66 52 58 Z" fill="url(#acRobe)" ${L}/>
      <path d="M62 52 Q62 34 78 32 Q94 34 94 52 Q86 58 78 58 Q70 58 62 52 Z" fill="url(#acSkin)"/>
      ${eye(71, 44, 2.6, '#c8fff0')}${eye(86, 44, 2.6, '#c8fff0')}
      <path d="M70 52 Q78 56 86 52" stroke="#1c1220" stroke-width="1.6" fill="none"/>
      <path d="M58 70 Q60 100 52 120 M98 70 Q96 100 104 120" stroke="#4a8a9a" stroke-width="2" fill="none" opacity=".6"/>
      <path d="M50 74 Q34 82 30 98" stroke="url(#acRobe)" stroke-width="10" fill="none" stroke-linecap="round"/>
      <circle cx="28" cy="88" r="16" fill="url(#acFlame)"/>
      <rect x="23" y="94" width="10" height="16" rx="2" fill="#e8e0c8" ${L}/>
      <path d="M28 82 Q33 88 28 94 Q23 88 28 82 Z" fill="#9fe8ff"/>
      <path d="M118 120 Q124 128 118 136 M126 96 Q132 104 126 112" stroke="#7fd0ff" stroke-width="2" fill="none" opacity=".6"/>`),

    slimeL: slime, slimeM: slime, slimeS: slime,

    mimic: () => svg(`<defs>${lin('mmWood', '#a87a4a', '#4a2a10')}${lin('mmGold', '#fff0a8', '#a8701a')}</defs>
      <rect x="22" y="80" width="116" height="64" rx="6" fill="url(#mmWood)" ${L}/>
      <path d="M22 80 L138 80 M48 80 L48 144 M112 80 L112 144" stroke="url(#mmGold)" stroke-width="6"/>
      <path d="M22 80 Q20 40 60 30 Q100 22 138 46 L138 66 Q96 54 60 62 Q36 66 22 80 Z" fill="url(#mmWood)" ${L}/>
      <path d="M22 80 Q60 62 138 66 L138 80 Z" fill="#3a0a14"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${28 + i * 14} ${80 - i * 1.4} l6 -12 l6 12 Z" fill="#f4ece0" ${L}/><path d="M${28 + i * 14} ${80} l6 10 l6 -10 Z" fill="#f4ece0" ${L}/>`).join('')}
      <path d="M40 84 Q30 110 50 120 Q60 112 56 96" fill="#e85a7a" ${L}/>
      ${eye(70, 46, 5, '#ffd23a')}${eye(98, 42, 4.5, '#ffd23a')}
      <rect x="72" y="96" width="16" height="16" rx="3" fill="url(#mmGold)" ${L}/>`),

    // ---------------- Act II ----------------
    puffer: () => svg(`<defs>${lin('pfCap', '#d8a0e8', '#7a3a9a')}${glow('pfSpore', '#e8ff9a', 0.5)}</defs>
      <circle cx="80" cy="84" r="62" fill="url(#pfSpore)"/>
      <path d="M58 116 L60 148 L100 148 L102 116 Z" fill="#f0e6d0" ${L}/>
      <circle cx="80" cy="84" r="40" fill="url(#pfCap)" ${L}/>
      <circle cx="62" cy="70" r="5" fill="#fff" opacity=".8"/><circle cx="98" cy="64" r="4" fill="#fff" opacity=".8"/><circle cx="104" cy="96" r="3.5" fill="#fff" opacity=".7"/>
      ${eye(68, 88, 4, '#1c1220')}${eye(88, 88, 4, '#1c1220')}
      <ellipse cx="60" cy="98" rx="6" ry="3.5" fill="#ff8ad0" opacity=".6"/><ellipse cx="96" cy="98" rx="6" ry="3.5" fill="#ff8ad0" opacity=".6"/>
      <ellipse cx="78" cy="102" rx="5" ry="4" fill="#3a1a4a"/>
      <circle cx="24" cy="50" r="3" fill="#e8ff9a"/><circle cx="136" cy="44" r="2.5" fill="#e8ff9a"/><circle cx="30" cy="120" r="2" fill="#e8ff9a"/>`),

    stalker: () => svg(`<defs>${lin('skBody', '#9a6ad8', '#3a1a6a')}</defs>
      <path d="M86 92 L112 140 M96 92 L130 132 M74 96 L80 146" stroke="#1c1220" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="104" cy="88" rx="34" ry="16" fill="url(#skBody)" ${L} transform="rotate(-20 104 88)"/>
      <path d="M74 84 L62 54" stroke="url(#skBody)" stroke-width="10" stroke-linecap="round"/>
      <path d="M62 54 Q48 66 40 90 L44 92 Q52 72 64 62 Z" fill="#c8b0ff" ${L}/>
      <path d="M70 80 Q56 96 54 120 L58 120 Q62 100 74 90 Z" fill="#c8b0ff" ${L}/>
      <path d="M58 46 Q60 30 76 30 Q84 34 80 50 Q68 56 58 46 Z" fill="url(#skBody)" ${L}/>
      ${eye(64, 40, 4, '#d8ff6a')}
      <path d="M70 32 Q66 16 54 12 M76 32 Q78 16 90 10" stroke="#1c1220" stroke-width="2" fill="none"/>`),

    capBrute: () => svg(`<defs>${lin('cbSkin', '#c87a5a', '#6a3a2a')}${lin('cbCap', '#e85a5a', '#8a1a2a')}</defs>
      <path d="M50 156 L56 118 L74 118 L72 156 Z M90 156 L90 118 L106 118 L112 156 Z" fill="#4a2a1a" ${L}/>
      <path d="M40 72 Q32 110 48 122 L112 122 Q128 110 120 72 Q80 58 40 72 Z" fill="url(#cbSkin)" ${L}/>
      <path d="M56 80 Q80 90 104 80" stroke="#5a2a1a" stroke-width="2" fill="none"/>
      <path d="M58 66 L60 52 L100 52 L102 66 Z" fill="#f0e6d0" ${L}/>
      ${eye(70, 60, 3, '#ffd23a')}${eye(90, 60, 3, '#ffd23a')}
      <path d="M28 54 Q30 16 80 14 Q130 16 132 54 Q80 46 28 54 Z" fill="url(#cbCap)" ${L}/>
      <circle cx="56" cy="32" r="6" fill="#fff"/><circle cx="84" cy="24" r="7" fill="#fff"/><circle cx="110" cy="36" r="5" fill="#fff"/>
      <path d="M40 80 Q20 92 18 112" stroke="url(#cbSkin)" stroke-width="13" fill="none" stroke-linecap="round"/>
      <path d="M18 112 L6 64" stroke="#6a4a2a" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="6" cy="58" rx="10" ry="14" fill="#7a5a3a" ${L}/>`),

    glowworm: () => svg(`<defs>${glow('gwGlow', '#7ff0ff', 0.55)}${lin('gwSeg', '#bff8ff', '#2a8aa8')}</defs>
      <circle cx="80" cy="96" r="70" fill="url(#gwGlow)"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${132 - i * 16}" cy="${116 - Math.sin(i * 0.8) * 16}" r="${14 - i * 0.6}" fill="url(#gwSeg)" ${L}/>`).join('')}
      <circle cx="36" cy="90" r="16" fill="url(#gwSeg)" ${L}/>
      ${eye(30, 86, 3.4, '#0a2a3a')}${eye(42, 84, 3, '#0a2a3a')}
      <path d="M30 76 Q26 64 20 62 M40 74 Q42 62 50 58" stroke="#1c1220" stroke-width="2" fill="none"/>
      <circle cx="20" cy="62" r="3.5" fill="#bff8ff"/><circle cx="50" cy="58" r="3.5" fill="#bff8ff"/>`),

    rotPriest: () => svg(`<defs>${lin('rpRobe', '#4a6a2a', '#14220a')}${glow('rpGlow', '#c8ff5a', 0.7)}</defs>
      <path d="M48 56 Q34 110 30 156 L120 156 Q114 110 104 56 Q76 44 48 56 Z" fill="url(#rpRobe)" ${L}/>
      <path d="M50 58 Q50 24 76 22 Q102 24 102 58 Q90 66 76 66 Q62 66 50 58 Z" fill="url(#rpRobe)" ${L}/>
      <path d="M60 52 Q60 34 76 32 Q92 34 92 52 Q84 58 76 58 Q68 58 60 52 Z" fill="#0a1006"/>
      ${eye(69, 45, 3, '#c8ff5a')}${eye(84, 45, 3, '#c8ff5a')}
      <path d="M76 66 L76 156" stroke="#a8c84a" stroke-width="2" opacity=".6"/>
      <circle cx="60" cy="90" r="5" fill="#d8b0ff"/><circle cx="96" cy="110" r="6" fill="#d8b0ff"/>
      <path d="M50 74 Q34 84 30 100" stroke="url(#rpRobe)" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M26 156 L24 36" stroke="#5a3a1a" stroke-width="5" stroke-linecap="round"/>
      <circle cx="24" cy="30" r="18" fill="url(#rpGlow)"/>
      <path d="M12 34 Q24 14 36 34 Z" fill="#8a3aa8" ${L}/><circle cx="20" cy="28" r="2" fill="#fff"/>`),

    thornCrawler: () => svg(`<defs>${lin('thBody', '#6a9a4a', '#22401a')}</defs>
      <path d="M30 120 Q30 74 80 68 Q132 66 140 116 Q140 130 120 132 L44 132 Q30 132 30 120 Z" fill="url(#thBody)" ${L}/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => { const a = Math.PI + (i / 8) * Math.PI; const x = 86 + Math.cos(a) * 52, y = 118 + Math.sin(a) * 50; return `<path d="M${(86 + Math.cos(a) * 36).toFixed(1)} ${(118 + Math.sin(a) * 36).toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)} L${(86 + Math.cos(a + 0.12) * 38).toFixed(1)} ${(118 + Math.sin(a + 0.12) * 38).toFixed(1)} Z" fill="#c8e88a" ${L}/>`; }).join('')}
      <path d="M44 132 L40 146 M64 132 L62 148 M108 132 L110 148 M126 130 L130 146" stroke="#1c1220" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="34" cy="112" rx="16" ry="12" fill="#8aba6a" ${L}/>
      ${eye(28, 108, 3, '#ff6a4a')}
      <circle cx="20" cy="116" r="3" fill="#1c1220"/>`),

    sporeling: () => svg(`<defs>${lin('spCap', '#8ac8ff', '#2a5aa8')}</defs>
      <path d="M62 112 L56 146 M98 112 L104 146" stroke="#1c1220" stroke-width="6" stroke-linecap="round"/>
      <path d="M60 84 L58 120 L102 120 L100 84 Z" fill="#f0e6d0" ${L}/>
      ${eye(70, 100, 4, '#1c1220')}${eye(90, 100, 4, '#1c1220')}
      <path d="M72 112 Q80 116 88 112" stroke="#1c1220" stroke-width="2" fill="none"/>
      <path d="M26 88 Q28 40 80 38 Q132 40 134 88 Q80 78 26 88 Z" fill="url(#spCap)" ${L}/>
      <circle cx="56" cy="62" r="6" fill="#fff" opacity=".85"/><circle cx="86" cy="52" r="7" fill="#fff" opacity=".85"/><circle cx="110" cy="68" r="5" fill="#fff" opacity=".85"/>`),

    // ---------------- Act III ----------------
    shade: () => svg(`<defs>${glow('shGlow', '#a04aff', 0.5)}${lin('shBody', '#2a1a3a', '#05020a')}</defs>
      <circle cx="80" cy="80" r="70" fill="url(#shGlow)"/>
      <path d="M50 156 Q44 110 52 76 Q60 54 80 54 Q100 54 108 76 Q116 110 110 156 Q96 140 80 156 Q64 140 50 156 Z" fill="url(#shBody)" stroke="#6a3a9a" stroke-width="1.6"/>
      <circle cx="80" cy="40" r="20" fill="url(#shBody)" stroke="#6a3a9a" stroke-width="1.6"/>
      ${eye(72, 40, 3.5, '#d8a0ff')}${eye(88, 40, 3.5, '#d8a0ff')}
      <path d="M52 80 Q30 90 22 110 M108 80 Q130 92 136 112" stroke="url(#shBody)" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M18 108 L24 120 M14 112 L20 124 M136 110 L142 122 M140 106 L148 118" stroke="#6a3a9a" stroke-width="2"/>`),

    wisp: () => svg(`<defs>${glow('wpGlow', '#7fb8ff', 0.6)}${lin('wpBody', '#dff0ff', '#4a7ad8')}</defs>
      <circle cx="80" cy="80" r="66" fill="url(#wpGlow)"/>
      <path d="M80 18 C110 40 116 70 106 98 C98 122 90 132 80 150 C70 132 62 122 54 98 C44 70 50 40 80 18 Z" fill="url(#wpBody)" opacity=".9" stroke="#e8f4ff" stroke-width="1.6"/>
      <path d="M80 50 C92 62 94 80 88 96 C84 106 82 110 80 116 C78 110 76 106 72 96 C66 80 68 62 80 50 Z" fill="#fff" opacity=".6"/>
      ${eye(72, 78, 3.4, '#1a2a6a')}${eye(88, 78, 3.4, '#1a2a6a')}
      <path d="M74 92 Q80 96 86 92" stroke="#1a2a6a" stroke-width="2" fill="none"/>`),

    voidHound: () => svg(`<defs>${lin('vhFur', '#4a3a6a', '#0e0a1a')}${glow('vhGlow', '#9a4aff', 0.4)}</defs>
      <circle cx="80" cy="96" r="66" fill="url(#vhGlow)"/>
      <path d="M118 96 Q148 80 150 56" stroke="url(#vhFur)" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M46 90 Q48 70 82 70 L120 72 Q136 76 132 104 L126 122 L48 122 Z" fill="url(#vhFur)" ${L}/>
      <path d="M58 122 L56 150 M74 122 L74 150 M108 122 L110 150 M122 120 L126 150" stroke="#1c1220" stroke-width="7" stroke-linecap="round"/>
      <path d="M58 122 L56 150 M74 122 L74 150 M108 122 L110 150 M122 120 L126 150" stroke="#3a2a5a" stroke-width="4" stroke-linecap="round"/>
      <path d="M50 72 Q30 58 12 70 Q6 86 18 94 L46 96 Z" fill="url(#vhFur)" ${L}/>
      <path d="M36 62 L38 40 L50 64 Z M46 64 L54 44 L58 68 Z" fill="url(#vhFur)" ${L}/>
      <path d="M14 82 L44 90" stroke="#1c1220" stroke-width="2"/>
      <path d="M18 84 L22 90 M26 85 L29 92 M34 86 L36 93" stroke="#e8e0ff" stroke-width="2"/>
      ${eye(32, 74, 3.8, '#c89aff')}
      <path d="M70 82 Q90 76 110 84 M66 100 Q90 94 118 102" stroke="#9a4aff" stroke-width="1.8" fill="none" opacity=".7"/>`),

    watcher: () => svg(`<defs>${glow('wtGlow', '#ff6a4a', 0.35)}${lin('wtSkin', '#e8d8d0', '#9a8078')}</defs>
      <circle cx="80" cy="72" r="70" fill="url(#wtGlow)"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${54 + i * 13} 100 Q${44 + i * 16} ${128} ${50 + i * 15} 156" stroke="#5a3a4a" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')}
      <circle cx="80" cy="66" r="42" fill="url(#wtSkin)" ${L}/>
      <path d="M50 52 Q60 44 70 50 M92 46 Q104 42 112 50" stroke="#c84a4a" stroke-width="1.6" fill="none" opacity=".6"/>
      <circle cx="74" cy="66" r="24" fill="#f6f1ea" ${L}/>
      <circle cx="70" cy="66" r="14" fill="#c8302a"/><circle cx="70" cy="66" r="7" fill="#1c1220"/><circle cx="66" cy="62" r="3" fill="#fff"/>`),

    inkGolem: () => svg(`<defs>${lin('igInk', '#3a3a52', '#06060c')}</defs>
      <path d="M40 156 L46 118 L70 118 L66 156 Z M94 156 L94 118 L118 118 L122 156 Z" fill="url(#igInk)" ${L}/>
      <path d="M30 66 Q20 108 40 124 L122 124 Q142 108 132 66 Q82 46 30 66 Z" fill="url(#igInk)" ${L}/>
      <path d="M52 124 Q50 136 54 142 M84 124 Q86 140 82 150 M108 124 Q112 134 108 140" stroke="#1a1a2a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M62 30 Q64 16 82 16 Q100 16 100 32 L98 56 L64 56 Z" fill="url(#igInk)" ${L}/>
      <rect x="68" y="34" width="10" height="6" rx="2" fill="#9fe8ff"/><rect x="86" y="34" width="10" height="6" rx="2" fill="#9fe8ff"/>
      <path d="M30 76 Q10 90 12 118" stroke="url(#igInk)" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M132 76 Q152 90 150 118" stroke="url(#igInk)" stroke-width="16" fill="none" stroke-linecap="round"/>
      <ellipse cx="60" cy="80" rx="10" ry="4" fill="#6a6a9a" opacity=".5"/><ellipse cx="104" cy="96" rx="8" ry="3" fill="#6a6a9a" opacity=".4"/>`),
  });
})();
