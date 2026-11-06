// ===== Playable characters =====
// Each character has: name, starting HP and gold, a starting deck, a starting curio,
// a short story, a list of their mechanics, and a portrait drawn as SVG.
// Cards, curios and tonics with  char: 'id'  only appear for that character.
'use strict';

const CHARACTERS = {
  lampwright: {
    name: 'The Lampwright', short: 'Lampwright', icon: '🏮', color: '#ffb347', hp: 75, gold: 99, relic: 'wick',
    deck: ['strike', 'strike', 'strike', 'strike', 'strike', 'defend', 'defend', 'defend', 'defend', 'flare'],
    tagline: 'The old keeper of the last lighthouse.',
    bio: 'For forty years the Lampwright kept the lighthouse burning. When the sun went out and the sea turned black, they took the great lamp down from the tower and walked into the dark to bring the dawn back themselves.',
    mechanics: [
      ['🔥', 'Burn', 'Sets enemies alight. They lose HP every turn.'],
      ['✨', 'Glow', 'Light that builds in your lantern. Spend it for huge effects.'],
      ['🛡️', 'Ward', 'Steady defence. Outlast anything.'],
    ],
    portrait: lampwrightSVG,
  },
  moonblade: {
    name: 'The Moonblade', short: 'Moonblade', icon: '🌙', color: '#9fc3ff', hp: 70, gold: 99, relic: 'moonCharm',
    deck: ['moonCut', 'moonCut', 'moonCut', 'moonCut', 'moonCut', 'sidestep', 'sidestep', 'sidestep', 'sidestep', 'crescentCut'],
    tagline: 'The last duelist of the Lunar Order.',
    bio: 'The Lunar Order guarded the night when it was still kind. Now only one of them is left, carrying a blade forged from a fallen piece of the moon. Quick, quiet, and very hard to hit.',
    mechanics: [
      ['🌙', 'Moon Shards', 'Free 4-damage blades that pile into your hand.'],
      ['🩸', 'Bleed', 'Bleeding enemies lose extra HP every time they are hit.'],
      ['👤', 'Evade', 'Slip away from an attack completely.'],
    ],
    portrait: moonbladeSVG,
  },
  alchemist: {
    name: 'The Alchemist', short: 'Alchemist', icon: '⚗️', color: '#8fe36a', hp: 72, gold: 99, relic: 'satchel', unlock: 1,
    deck: ['vialToss', 'vialToss', 'vialToss', 'vialToss', 'vialToss', 'glassWall', 'glassWall', 'glassWall', 'glassWall', 'acidSplash'],
    tagline: 'A brilliant and slightly reckless brewer.',
    bio: 'Banished from the Academy for "excessive explosions", the Alchemist believes the darkness is just a chemical problem. Every flask on that belt is an experiment, and most of them are on fire.',
    mechanics: [
      ['🧪', 'Brew', 'Make Tonics in the middle of a fight. Some cards grow stronger with every Tonic you use.'],
      ['💥', 'Unstable', 'Stack it on an enemy. At 10 it explodes for 25 damage.'],
      ['⚗️', 'Reactions', 'Chain explosions, double doses and odd mixtures.'],
    ],
    portrait: alchemistSVG,
  },
  cassandra: {
    name: 'Cassandra', short: 'Cassandra', icon: '🖤', color: '#c99cff', hp: 62, gold: 99, relic: 'locket', duo: true,
    titles: ['The Princess of Darkness', 'Knight in Shining Armor'],
    deck: ['shadowLash', 'shadowLash', 'shadowLash', 'shadowLash', 'veilOfNight', 'veilOfNight', 'veilOfNight', 'rally', 'lanceOfDawn', 'lanceOfDawn'],
    tagline: 'The Princess of Darkness, and her Knight in Shining Armor.',
    bio: 'Heir to a kingdom swallowed by the night, Cassandra learned to love the dark. Her oldest vow summons a knight forged from the last daylight: he guards her with his life, and she is not above spending it.',
    mechanics: [
      ['🛡️', 'Summon', 'Call your Knight, or give him more HP. He takes the damage your Ward does not stop.'],
      ['⚔️', 'Knight', 'Some cards make him strike. Valor makes his hits stronger.'],
      ['🎯', 'Mark', 'Cassandra marks foes. The Knight\'s next hit on a Marked enemy deals extra damage.'],
      ['🩸', 'Sacrifice', 'Her darkest spells spend the Knight\'s HP for great power.'],
    ],
    portrait: princessSVG,
  },
};

// The Knight in Shining Armor, Cassandra's summoned protector
const KNIGHT = { name: 'Cedric', title: 'Knight in Shining Armor', portrait: knightSVG };

function currentCharId() { return (Game.run && Game.run.char) || 'lampwright'; }
function currentChar() { return CHARACTERS[currentCharId()]; }
// Is this card / curio / tonic available to the current character?
function forChar(def, charId = currentCharId()) { return !def.char || def.char === charId; }

// ---------- Portraits ----------
function lampwrightSVG() {
  return `<svg class="portrait-svg" viewBox="0 0 140 160" aria-hidden="true">
  <defs>
    <radialGradient id="lwGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".95"/><stop offset=".35" stop-color="#ffb347" stop-opacity=".45"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>
    <linearGradient id="lwCoat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#14263a"/><stop offset=".6" stop-color="#22405e"/><stop offset="1" stop-color="#3c6688"/></linearGradient>
    <linearGradient id="lwCoatDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b3550"/><stop offset="1" stop-color="#0c1724"/></linearGradient>
    <linearGradient id="lwGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8"/><stop offset="1" stop-color="#ffb030"/></linearGradient>
    <linearGradient id="lwSkin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c98d6b"/><stop offset="1" stop-color="#f2c29c"/></linearGradient>
  </defs>
  <circle cx="108" cy="54" r="42" fill="url(#lwGlow)" class="pt-glow"/>
  <!-- staff -->
  <path d="M104 26 L96 156" stroke="#5a3a1e" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M104 26 Q112 24 112 34" stroke="#3a2412" stroke-width="3" fill="none"/>
  <!-- coat back -->
  <path d="M44 66 Q30 110 26 152 L92 152 Q88 110 80 66 Z" fill="url(#lwCoatDark)"/>
  <!-- coat front -->
  <path d="M46 62 Q38 104 34 152 L62 152 L64 78 Z" fill="url(#lwCoat)"/>
  <path d="M78 62 Q84 104 88 152 L62 152 L64 78 Z" fill="#2c5272"/>
  <path d="M62 80 L62 152" stroke="#0c1724" stroke-width="1.5"/>
  <circle cx="66" cy="96" r="1.8" fill="#d9a441"/><circle cx="66" cy="110" r="1.8" fill="#d9a441"/><circle cx="66" cy="124" r="1.8" fill="#d9a441"/>
  <path d="M34 152 L88 152" stroke="#0a131d" stroke-width="3"/>
  <!-- belt -->
  <path d="M41 104 Q62 109 84 104 L84 111 Q62 116 41 111 Z" fill="#3b2614"/>
  <rect x="58" y="104" width="9" height="8" rx="1.5" fill="#d9a441"/>
  <!-- left arm -->
  <path d="M46 64 Q34 86 40 108 L48 106 Q46 88 54 72 Z" fill="#1b3550"/>
  <circle cx="44" cy="108" r="5" fill="url(#lwSkin)"/>
  <!-- scarf -->
  <path d="M48 60 Q64 70 80 60 L80 68 Q64 78 48 68 Z" fill="#c4452c"/>
  <path d="M52 66 Q48 84 42 92 L50 94 Q56 82 58 70 Z" fill="#a83822"/>
  <!-- head -->
  <ellipse cx="64" cy="46" rx="13" ry="14" fill="url(#lwSkin)"/>
  <path d="M51 48 Q52 70 64 74 Q76 70 77 48 Q72 56 64 55 Q56 56 51 48 Z" fill="#e9e4dc"/>
  <path d="M56 55 Q64 51 72 55" stroke="#cfc8bd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <circle cx="60" cy="45" r="1.6" fill="#1a1010"/><circle cx="70" cy="45" r="1.6" fill="#1a1010"/>
  <path d="M57 41 L63 42 M67 42 L73 41" stroke="#e9e4dc" stroke-width="2" stroke-linecap="round"/>
  <path d="M65 46 Q67 50 65 51" stroke="#a8694a" stroke-width="1.3" fill="none"/>
  <!-- hat -->
  <ellipse cx="64" cy="35" rx="24" ry="5.5" fill="#24190f"/>
  <path d="M50 35 Q50 20 64 18 Q78 20 78 35 Z" fill="#33241a"/>
  <path d="M50.5 31 Q64 34 77.5 31 L78 35 Q64 38 50 35 Z" fill="#c4452c"/>
  <!-- right arm holding the staff -->
  <path d="M78 64 Q92 72 98 86 L92 90 Q84 78 74 74 Z" fill="#2c5272"/>
  <circle cx="98" cy="88" r="5" fill="url(#lwSkin)"/>
  <!-- lantern -->
  <g class="pt-lantern">
    <path d="M112 34 L112 40" stroke="#2a1a0c" stroke-width="1.5"/>
    <path d="M104 41 L120 41 L118 45 L106 45 Z" fill="#3a2a18"/>
    <rect x="105" y="45" width="14" height="18" rx="3" fill="url(#lwGlass)" stroke="#3a2a18" stroke-width="1.6"/>
    <path d="M112 47 Q117 53 112 60 Q107 53 112 47 Z" fill="#ff7a1a"/>
    <path d="M112 51 Q114.5 55 112 59 Q109.5 55 112 51 Z" fill="#fff3b0"/>
    <path d="M105 63 L119 63 L116 67 L108 67 Z" fill="#3a2a18"/>
    <path d="M112 45 L112 63" stroke="#3a2a18" stroke-width=".8" opacity=".6"/>
  </g>
</svg>`;
}

function princessSVG() {
  return `<svg class="portrait-svg" viewBox="0 0 140 160" aria-hidden="true">
  <defs>
    <radialGradient id="ccAura" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7a2aa8" stop-opacity=".45"/><stop offset=".6" stop-color="#3a0a5a" stop-opacity=".18"/><stop offset="1" stop-color="#1a0028" stop-opacity="0"/></radialGradient>
    <linearGradient id="ccDress" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#242226"/><stop offset=".55" stop-color="#0e0d10"/><stop offset="1" stop-color="#030303"/></linearGradient>
    <linearGradient id="ccSilk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a090c"/><stop offset="1" stop-color="#1e1c22"/></linearGradient>
    <linearGradient id="ccSkin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ecc8b0"/><stop offset="1" stop-color="#fbe2d2"/></linearGradient>
    <linearGradient id="ccGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b3"/><stop offset=".55" stop-color="#e8b443"/><stop offset="1" stop-color="#a8701c"/></linearGradient>
    <linearGradient id="ccHair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1622"/><stop offset="1" stop-color="#050307"/></linearGradient>
    <linearGradient id="ccSilver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#8a8a9e"/></linearGradient>
  </defs>
  <circle cx="66" cy="70" r="62" fill="url(#ccAura)" class="pt-glow"/>
  <!-- long black hair behind -->
  <path d="M44 34 Q36 70 40 112 Q52 104 56 90 L76 90 Q82 104 94 110 Q98 70 88 34 Z" fill="url(#ccHair)"/>
  <!-- gown -->
  <path d="M50 70 Q40 110 22 154 L112 154 Q94 110 84 70 Z" fill="url(#ccDress)"/>
  <path d="M67 74 L52 154 L82 154 Z" fill="url(#ccSilk)" opacity=".9"/>
  <path d="M22 154 Q40 146 56 154 Q72 146 88 154 Q100 146 112 154" stroke="#3a383e" stroke-width="2" fill="none"/>
  <path d="M30 140 Q67 128 104 140" stroke="#2a282e" stroke-width="1.4" fill="none" opacity=".8"/>
  <!-- corset with lacing -->
  <path d="M54 66 Q67 72 80 66 L78 96 Q67 100 56 96 Z" fill="#0c0b0e" stroke="#2e2c32" stroke-width="1.2"/>
  <path d="M62 72 L72 78 M72 72 L62 78 M62 80 L72 86 M72 80 L62 86 M62 88 L72 94 M72 88 L62 94" stroke="#3a383e" stroke-width="1"/>
  <!-- high gothic collar -->
  <path d="M50 64 L56 50 L67 60 L78 50 L84 64 Q67 70 50 64 Z" fill="#08080a" stroke="#2e2c32" stroke-width="1.2"/>
  <!-- arms -->
  <path d="M52 68 Q40 86 42 104 L48 104 Q48 88 58 74 Z" fill="#0a0a0c"/>
  <path d="M82 68 Q96 78 100 92 L95 96 Q90 84 78 76 Z" fill="#0a0a0c"/>
  <circle cx="45" cy="106" r="3.6" fill="url(#ccSkin)"/>
  <circle cx="98" cy="96" r="3.6" fill="url(#ccSkin)"/>
  <!-- black rose in her hand -->
  <path d="M98 96 L104 70" stroke="#2a3a2a" stroke-width="1.6"/>
  <circle cx="104" cy="66" r="6.5" fill="#14060c"/><path d="M100 64 Q104 60 108 64 Q104 70 100 64 Z" fill="#5a1424"/><path d="M104 66 Q101 63 104 61" stroke="#a0243c" stroke-width="1" fill="none"/>
  <!-- face: pale skin -->
  <ellipse cx="67" cy="40" rx="12.5" ry="14" fill="url(#ccSkin)"/>
  <!-- black eyes with a soft shine, dark lips -->
  <ellipse cx="62" cy="40" rx="2.5" ry="2.2" fill="#050307"/><ellipse cx="72" cy="40" rx="2.5" ry="2.2" fill="#050307"/>
  <circle cx="62.8" cy="39.3" r=".7" fill="#fff"/><circle cx="72.8" cy="39.3" r=".7" fill="#fff"/>
  <path d="M58.5 37 L64 36.3 M70 36.3 L75.5 37" stroke="#14101a" stroke-width="1.2" stroke-linecap="round"/>
  <ellipse cx="59.5" cy="45" rx="2.6" ry="1.4" fill="#f0a8a0" opacity=".45"/><ellipse cx="74.5" cy="45" rx="2.6" ry="1.4" fill="#f0a8a0" opacity=".45"/>
  <path d="M64 48.5 Q67 50 70 48.5 Q67 51.5 64 48.5 Z" fill="#5a1024"/>
  <!-- hair framing the face, with a straight fringe -->
  <path d="M53 44 Q51 22 67 20 Q83 22 81 44 Q79 32 74 30 Q68 34 60 30 Q55 32 53 44 Z" fill="url(#ccHair)"/>
  <path d="M53 40 Q50 56 52 70 L56 66 Q54 54 56 42 Z M81 40 Q84 56 82 70 L78 66 Q80 54 78 42 Z" fill="url(#ccHair)"/>
  <!-- small dark tiara -->
  <path d="M56 27 L56.5 18 L60.5 22 L63 15 L65.5 20.5 L67 12.5 L68.5 20.5 L71 15 L73.5 22 L77.5 18 L78 27 Z" fill="url(#ccGold)" stroke="#6a4410" stroke-width=".9" stroke-linejoin="round"/>
  <rect x="55.5" y="24.5" width="23" height="3.6" rx="1" fill="url(#ccGold)" stroke="#6a4410" stroke-width=".9"/>
  <circle cx="56.5" cy="18" r="1.2" fill="#fff2b3"/><circle cx="63" cy="15" r="1.2" fill="#fff2b3"/><circle cx="67" cy="12.5" r="1.3" fill="#fff2b3"/><circle cx="71" cy="15" r="1.2" fill="#fff2b3"/><circle cx="77.5" cy="18" r="1.2" fill="#fff2b3"/>
  <circle cx="67" cy="26.3" r="1.5" fill="#c0203a"/><circle cx="61.5" cy="26.3" r="1" fill="#6a2aa8"/><circle cx="72.5" cy="26.3" r="1" fill="#6a2aa8"/>
</svg>`;
}

function knightSVG() {
  return `<svg class="portrait-svg knight-svg" viewBox="0 0 140 160" aria-hidden="true">
  <defs>
    <radialGradient id="kgGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fffbe0" stop-opacity=".8"/><stop offset=".45" stop-color="#ffd76a" stop-opacity=".3"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
    <linearGradient id="kgPlate" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#fff2c4"/><stop offset="1" stop-color="#d9a640"/></linearGradient>
    <linearGradient id="kgDark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4dc98"/><stop offset="1" stop-color="#b07e2a"/></linearGradient>
    <linearGradient id="kgCape" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".85"/><stop offset="1" stop-color="#ffd76a" stop-opacity=".15"/></linearGradient>
    <linearGradient id="kgBlade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#fff2b0"/></linearGradient>
  </defs>
  <circle cx="70" cy="76" r="66" fill="url(#kgGlow)" class="pt-glow"/>
  <!-- cape of light -->
  <path d="M50 52 Q30 100 26 150 Q48 140 58 150 L66 70 Z" fill="url(#kgCape)"/>
  <!-- legs -->
  <path d="M56 112 L50 152 L62 152 L66 114 Z M74 112 L80 152 L92 152 L84 112 Z" fill="url(#kgDark)" stroke="#8a6a20" stroke-width="1"/>
  <!-- body plate -->
  <path d="M50 56 Q46 88 52 116 L88 116 Q94 88 90 56 Q70 46 50 56 Z" fill="url(#kgPlate)" stroke="#a8862a" stroke-width="1.4"/>
  <path d="M70 52 L70 116" stroke="#c9a040" stroke-width="1.2"/>
  <path d="M54 80 Q70 86 86 80 M54 96 Q70 102 86 96" stroke="#c9a040" stroke-width="1.4" fill="none"/>
  <!-- pauldrons -->
  <ellipse cx="48" cy="60" rx="11" ry="8" fill="url(#kgPlate)" stroke="#a8862a" stroke-width="1.4"/>
  <ellipse cx="92" cy="60" rx="11" ry="8" fill="url(#kgPlate)" stroke="#a8862a" stroke-width="1.4"/>
  <!-- helmet with glowing visor -->
  <path d="M56 46 Q54 18 70 16 Q86 18 84 46 Q70 52 56 46 Z" fill="url(#kgPlate)" stroke="#a8862a" stroke-width="1.4"/>
  <path d="M60 32 L80 32 L78 37 L62 37 Z" fill="#fff9d0"/>
  <path d="M60 32 L80 32 L78 37 L62 37 Z" fill="#ffd76a" opacity=".6" class="pt-eye"/>
  <path d="M70 37 L70 46" stroke="#a8862a" stroke-width="1.2"/>
  <path d="M70 16 L70 31" stroke="#c9a040" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M57 44 Q70 49 83 44" stroke="#c9a040" stroke-width="1.4" fill="none"/>
  <!-- shield with a sun -->
  <path d="M30 70 L50 66 L52 96 Q42 110 32 100 Z" fill="url(#kgDark)" stroke="#8a6a20" stroke-width="1.4"/>
  <circle cx="41" cy="84" r="6" fill="#fffbe0"/>
  <path d="M41 74 L41 94 M31 84 L51 84 M34 77 L48 91 M48 77 L34 91" stroke="#fffbe0" stroke-width="1.4" opacity=".8"/>
  <!-- raised sword of light -->
  <path d="M92 64 Q102 72 104 82" stroke="url(#kgDark)" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M100 78 L112 74" stroke="#8a6a20" stroke-width="3" stroke-linecap="round"/>
  <path d="M106 76 L132 14 L136 16 L110 78 Z" fill="url(#kgBlade)" stroke="#ffe7a0" stroke-width="1" class="pt-blade"/>
  <circle cx="134" cy="14" r="3" fill="#fff"/>
</svg>`;
}

function alchemistSVG() {
  return `<svg class="portrait-svg" viewBox="0 0 140 160" aria-hidden="true">
  <defs>
    <radialGradient id="alGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#d4ff9a" stop-opacity=".9"/><stop offset=".4" stop-color="#7ddc4a" stop-opacity=".35"/><stop offset="1" stop-color="#3a9a2a" stop-opacity="0"/></radialGradient>
    <linearGradient id="alCoat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2c2416"/><stop offset=".6" stop-color="#4a3a22"/><stop offset="1" stop-color="#6a5432"/></linearGradient>
    <linearGradient id="alApron" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6a44"/><stop offset="1" stop-color="#5a432a"/></linearGradient>
    <linearGradient id="alSkin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9845e"/><stop offset="1" stop-color="#e8b88e"/></linearGradient>
    <linearGradient id="alLiquid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4ff7a"/><stop offset="1" stop-color="#3fb52a"/></linearGradient>
  </defs>
  <circle cx="106" cy="66" r="36" fill="url(#alGlow)" class="pt-glow"/>
  <!-- coat -->
  <path d="M44 64 Q30 108 30 152 L94 152 Q92 108 80 64 Z" fill="url(#alCoat)"/>
  <path d="M50 70 Q46 110 46 150 L80 150 Q80 110 74 70 Z" fill="url(#alApron)"/>
  <path d="M52 72 L58 66 M72 72 L66 66" stroke="#3a2a18" stroke-width="2"/>
  <rect x="54" y="96" width="16" height="12" rx="2" fill="#4a3620" stroke="#2a1d10" stroke-width="1"/>
  <!-- belt of vials -->
  <path d="M38 112 Q62 118 88 112 L88 119 Q62 125 38 119 Z" fill="#2a1d10"/>
  <g>
    <rect x="42" y="113" width="5" height="11" rx="2" fill="#ff6a5a" stroke="#1a1208" stroke-width=".8"/>
    <rect x="50" y="115" width="5" height="11" rx="2" fill="#6ac8ff" stroke="#1a1208" stroke-width=".8"/>
    <rect x="74" y="115" width="5" height="11" rx="2" fill="#ffd25a" stroke="#1a1208" stroke-width=".8"/>
    <rect x="82" y="113" width="5" height="11" rx="2" fill="#c28aff" stroke="#1a1208" stroke-width=".8"/>
  </g>
  <!-- back arm on hip -->
  <path d="M46 66 Q32 86 38 104 L46 102 Q42 88 54 74 Z" fill="#3a2e1c"/>
  <circle cx="42" cy="104" r="4.6" fill="url(#alSkin)"/>
  <!-- head -->
  <ellipse cx="63" cy="46" rx="13" ry="14" fill="url(#alSkin)"/>
  <path d="M50 42 Q50 28 64 27 Q78 28 77 42 Q74 34 64 34 Q54 34 50 42 Z" fill="#c9542a"/>
  <circle cx="51" cy="37" r="5.5" fill="#c9542a"/><circle cx="76" cy="37" r="5.5" fill="#c9542a"/><circle cx="56" cy="31" r="5" fill="#d8642f"/><circle cx="71" cy="31" r="5" fill="#d8642f"/><circle cx="63.5" cy="29" r="5" fill="#c9542a"/>
  <path d="M56 55 Q63 59 71 55" stroke="#7a3a2a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <circle cx="58" cy="47" r="1.5" fill="#1a1010"/><circle cx="68" cy="47" r="1.5" fill="#1a1010"/>
  <!-- goggles on forehead -->
  <path d="M49 37 Q63 32 78 37" stroke="#3a2a18" stroke-width="3" fill="none"/>
  <circle cx="57" cy="36" r="5.2" fill="#9be8ff" stroke="#8a6a2a" stroke-width="2"/>
  <circle cx="70" cy="36" r="5.2" fill="#9be8ff" stroke="#8a6a2a" stroke-width="2"/>
  <circle cx="55.5" cy="34.5" r="1.4" fill="#fff"/><circle cx="68.5" cy="34.5" r="1.4" fill="#fff"/>
  <!-- front arm raising the flask -->
  <path d="M78 66 Q94 70 100 82 L94 86 Q88 76 74 74 Z" fill="#4a3a22"/>
  <circle cx="99" cy="84" r="4.8" fill="url(#alSkin)"/>
  <g class="pt-flask">
    <path d="M102 60 L102 70 Q94 76 94 84 Q94 94 106 94 Q118 94 118 84 Q118 76 110 70 L110 60 Z" fill="#e8f6ff" opacity=".35" stroke="#e8f6ff" stroke-width="1.4"/>
    <path d="M95.5 82 Q96 92 106 92 Q116 92 116.5 82 Z" fill="url(#alLiquid)"/>
    <rect x="100.5" y="56" width="11" height="5" rx="1.5" fill="#8a5a2a"/>
    <circle cx="103" cy="86" r="1.6" fill="#f0ffd0" class="pt-bubble"/><circle cx="109" cy="84" r="1.2" fill="#f0ffd0" class="pt-bubble b2"/>
    <circle cx="106" cy="48" r="3" fill="#b6ff8a" opacity=".5" class="pt-bubble b3"/><circle cx="110" cy="40" r="2" fill="#b6ff8a" opacity=".35" class="pt-bubble b2"/>
  </g>
</svg>`;
}

function moonbladeSVG() {
  return `<svg class="portrait-svg" viewBox="0 0 140 160" aria-hidden="true">
  <defs>
    <radialGradient id="mbMoon" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#dfe9ff" stop-opacity=".5"/><stop offset=".6" stop-color="#7f9fff" stop-opacity=".15"/><stop offset="1" stop-color="#7f9fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="mbCloak" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2458"/><stop offset=".7" stop-color="#151233"/><stop offset="1" stop-color="#0a0820"/></linearGradient>
    <linearGradient id="mbCloakLight" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a3478"/><stop offset="1" stop-color="#5a54a8"/></linearGradient>
    <linearGradient id="mbBlade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#cfe0ff"/><stop offset="1" stop-color="#7f9fe0"/></linearGradient>
  </defs>
  <circle cx="64" cy="58" r="56" fill="url(#mbMoon)" class="pt-glow"/>
  <!-- cloak tail flowing back -->
  <path d="M50 58 Q18 92 12 150 Q30 140 40 152 Q48 120 58 96 Z" fill="#110e2a"/>
  <!-- legs -->
  <path d="M56 112 L50 152 L58 152 L64 116 Z" fill="#1d1a3a"/>
  <path d="M68 112 L80 150 L88 150 L74 110 Z" fill="#24204a"/>
  <path d="M48 150 L60 150 L60 155 L46 155 Z M78 148 L90 148 L92 153 L78 153 Z" fill="#0b0a18"/>
  <!-- body -->
  <path d="M50 56 Q42 86 48 116 L78 116 Q84 86 76 56 Z" fill="url(#mbCloak)"/>
  <path d="M63 58 L56 116 L70 116 Z" fill="#3a3478" opacity=".8"/>
  <path d="M48 98 Q63 103 78 98 L78 104 Q63 109 48 104 Z" fill="#c9d6ff" opacity=".85"/>
  <!-- moon emblem -->
  <circle cx="63" cy="78" r="6" fill="#dfe9ff"/><circle cx="66" cy="76" r="5.5" fill="#2a2458"/>
  <!-- hood -->
  <path d="M46 52 Q46 22 64 18 Q84 22 82 54 Q74 62 64 62 Q52 62 46 52 Z" fill="url(#mbCloakLight)"/>
  <path d="M52 50 Q52 30 65 28 Q77 30 77 50 Q70 56 64 56 Q56 56 52 50 Z" fill="#07061a"/>
  <path d="M55 46 Q64 50 74 45 Q72 54 64 55 Q57 54 55 46 Z" fill="#c9d6ff" opacity=".9"/>
  <ellipse cx="60" cy="41" rx="2.8" ry="1.5" fill="#8fe8ff" class="pt-eye"/><ellipse cx="70" cy="41" rx="2.8" ry="1.5" fill="#8fe8ff" class="pt-eye"/>
  <path d="M46 52 Q40 56 38 64 Q46 60 52 58 Z" fill="#3a3478"/>
  <!-- back arm with dagger -->
  <path d="M52 60 Q40 76 36 92 L43 94 Q48 80 58 68 Z" fill="#1d1a3a"/>
  <circle cx="39" cy="94" r="4" fill="#d8c3b0"/>
  <path d="M38 96 L30 116 L34 117 Z" fill="url(#mbBlade)"/>
  <!-- front arm extended with crescent blade -->
  <path d="M74 60 Q90 64 100 74 L96 80 Q86 72 72 70 Z" fill="#2a2458"/>
  <circle cx="99" cy="77" r="4.2" fill="#d8c3b0"/>
  <g class="pt-blade">
    <path d="M99 77 L104 72" stroke="#5a4a2a" stroke-width="3" stroke-linecap="round"/>
    <path d="M102 74 Q132 66 128 30 Q124 58 100 70 Z" fill="url(#mbBlade)" stroke="#e8f0ff" stroke-width=".8"/>
    <path d="M104 72 Q126 62 126 38" stroke="#ffffff" stroke-width="1" fill="none" opacity=".8"/>
  </g>
  <circle cx="120" cy="22" r="1.4" fill="#fff" opacity=".9"/><circle cx="20" cy="40" r="1" fill="#fff" opacity=".7"/><circle cx="108" cy="110" r="1.2" fill="#cfe0ff" opacity=".8"/>
</svg>`;
}
