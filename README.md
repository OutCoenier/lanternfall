# 🏮 Lanternfall

*Carry the last light into the dark.*

A roguelike deck-builder. Pick one of four heroes and descend through three acts to destroy Umbra, the Devouring Night.

## How to play
Open `index.html` in any modern browser (Chrome, Edge or Firefox). There is nothing to install. Your run and your progress are saved automatically.

## Heroes
| Hero | Style |
|---|---|
| 🏮 **The Lampwright** | Burn, Glow and solid defence |
| 🌙 **The Moonblade** | Free Moon Shards, Bleed and Evade |
| ⚗️ **The Alchemist** *(unlocks at Lantern Level 1)* | Brews Tonics mid-fight and makes enemies explode with Unstable |
| 🖤 **Cassandra**, *the Princess of Darkness* | Fights alongside her summoned *Knight in Shining Armor*, who takes the damage her Ward does not block. Marks enemies for the Knight and Sacrifices his HP for dark power |

## Progress between runs
- **Lantern Level:** every run earns experience equal to its score. Levels unlock the Alchemist, new cards and new curios.
- **Depths 1–10:** winning a run unlocks the next Depth (difficulty level) for that hero. Each Depth adds one rule, such as tougher elites, a starting curse or less healing.
- **Daily Descent:** the same hero, map and rewards for everyone each day. Copy your result to share it.
- **Seeds:** type a seed on the hero screen to replay a specific map.
- **Journal:** run history, 21 achievements, unlock list and per-hero stats.

## Where things live
| What | File |
|---|---|
| Heroes and their portraits | `js/data/characters.js` |
| Lampwright cards | `js/data/cards.js` |
| Moonblade cards | `js/data/cards_moonblade.js` |
| Alchemist cards and unlockable cards | `js/data/cards_alchemist.js` |
| Cassandra's cards | `js/data/cards_cassandra.js` |
| Curios / relics | `js/data/relics.js` |
| Tonics / potions | `js/data/potions.js` |
| Enemies, elites, bosses, acts | `js/data/enemies.js` |
| Drawn elites and bosses | `js/data/enemy_art.js` |
| Events ("?" rooms) | `js/data/events.js` |
| Status effects (Burn, Bleed, Unstable...) | `js/data/statuses.js` |
| Levels, Depths, achievements, daily runs | `js/meta.js` |
| First-fight tutorial | `js/tutorial.js` |
| Card pictures | `js/art.js` |
| Icons (every icon in the game, hand-drawn as SVG) | `js/icons.js` |
| Sound effects and music | `js/audio.js` |
| Combat rules and animations | `js/combat.js`, `js/fx.js` |
| Screens (title, shop, rest, journal, library) | `js/screens.js` |

To add a card, copy an existing entry in one of the card files, give it a new id and change its numbers and text. It shows up automatically in rewards, the shop and the Library. Add `unlock: 3` to make it appear only after Lantern Level 3.

## Card pictures
Each card's picture is painted in code (see the `ART` list in `js/art.js`). To use your own image instead, put it in `img/cards/` and add `img: 'img/cards/yourPicture.png'` to the card.

## Sound
All music and sound effects are generated live in the browser, so there are no audio files. Sound starts after your first click. Press **M** to mute, or use the 🔊 button in the top bar.

## Phones
Play with the phone held sideways. Cards can be dragged with your finger.
