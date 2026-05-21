# Bullet Heaven Steam Genre Research

Research date: 2026-05-21

This note captures learnings from Vampire Survivors and adjacent Bullet Heaven / survivor-like games on Steam. The goal is not to turn Unearned Bounty into a free-roaming arena game. The goal is to understand why these games make automatic combat feel active, expressive, and upgrade-driven, then translate those lessons into the pirate idle combat window.

## Genre Definition

Steam added `Bullet Heaven` as an official store tag in May 2026. PC Gamer reported Valve's description as the inverse of bullet hell: games focused on upgrades while the player automatically attacks hordes of enemies. SteamDB's Bullet Heaven tag page similarly describes the genre around overwhelming player projectile streams, massive enemy hordes, stacked weapon patterns, passive effects, exponential power growth, and survival against escalating waves.

Sources:

- PC Gamer on Steam's new Bullet Heaven tag: https://www.pcgamer.com/gaming-industry/its-official-steam-decrees-bullet-heaven-the-name-of-the-vampire-survivors-genre/
- SteamDB Bullet Heaven tag page: https://steamdb.info/tag/723991/

## Surveyed Games

| Game | Steam positioning | Key lesson |
| --- | --- | --- |
| Vampire Survivors | Minimalist time-survival roguelite where choices let the player snowball against hundreds of monsters | Minimal input can still feel rich if upgrade choices are frequent, visible, and explosive |
| Brotato | Top-down arena shooter roguelite with up to 6 weapons, short waves, materials, XP, and between-wave shop | Short wave loops plus shop/build decisions create a strong "one more wave" cadence |
| Halls of Torment | Horde survival with retro Diablo-like look, class traits, items, quests, bosses, and long meta progression | Strong theme plus quest-based progression can make a simple horde loop feel like an RPG campaign |
| Deep Rock Galactic: Survivor | Single-player survivor-like auto-shooter with mining, objectives, gear upgrades, and extraction | Add a non-combat resource objective inside the combat space to create risk/reward movement |
| 20 Minutes Till Dawn | Survival roguelite with active firing/aiming, weapons, runes, bosses, tomes, and 10-20 minute runs | Even one layer of active agency can make builds feel more intentional |
| Soulstone Survivors | Fast action roguelite with many skills, crafted weapons, large bosses, characters, curses, and skill trees | Big content breadth needs filters, tags, and strong readability or the build space becomes sludge |
| Death Must Die | Roguelite RPG bullet heaven with god blessings, hero traits, randomized gear, relic odds, and empowered enemies | Theme-rich blessing choices and loot can create memorable build identity between runs |
| Nordic Ashes | Norse survivor roguelite with constellation ability trees, Yggdrasil meta progression, relics, shrines, modes, elites, and bosses | Progression trees are stronger when their shape supports the fantasy, not just the math |

Primary Steam sources:

- Vampire Survivors: https://store.steampowered.com/app/1794680/Vampire_Survivors/
- Brotato: https://store.steampowered.com/app/1942280/Brotato/
- Halls of Torment: https://store.steampowered.com/app/2218750/Halls_of_Torment/
- Deep Rock Galactic: Survivor: https://store.steampowered.com/app/2321470/Deep_Rock_Galactic_Survivor/
- 20 Minutes Till Dawn: https://store.steampowered.com/app/1966900/20_Minutes_Till_Dawn/
- Soulstone Survivors: https://store.steampowered.com/app/2066020/Soulstone_Survivors/
- Death Must Die: https://store.steampowered.com/app/2334730/Death_Must_Die/
- Nordic Ashes: Survivors of Ragnarok: https://store.steampowered.com/app/2068280/Nordic_Ashes_Survivors_of_Ragnarok/

## Core Loop Pattern

Most Bullet Heaven games are built around this loop:

1. The player enters a compact survival run.
2. Enemies arrive constantly from multiple directions.
3. The player attacks automatically or semi-automatically.
4. Kills drop XP/resources.
5. Level-ups offer a small choice set.
6. Choices visibly alter combat patterns.
7. Bosses or elites punctuate the run with chests, tomes, gear, or major upgrades.
8. Death or completion converts some progress into permanent unlocks.
9. The next run starts with new characters, weapons, passives, maps, curses, or difficulty options.

The magic is immediacy. A build choice is not abstract for long. The screen changes: more projectiles, bigger zones, faster clears, better pickup radius, stronger knockback, safer movement, or boss damage.

## What Vampire Survivors Teaches

Vampire Survivors is the cleanest genre north star:

- Low-input combat lets the player focus on positioning and upgrade choices.
- XP gems and items can stay on the ground, which turns collection into a movement objective rather than a panic timer.
- Players are encouraged to choose a few offensive tools early and focus their levels.
- Free power-up refunds lower experimentation anxiety.
- Gold from runs improves future attempts, so failure still feeds the long game.
- Weapon evolutions create memorable "build came online" moments.

Translation for Unearned Bounty:

- The ship should attack automatically; player agency should live in route, loadout, upgrade priority, and risk choices.
- Salvage and Doubloons should visually drop from the battle scene even if collected automatically.
- Upgrades need immediate visible expression: more shots, faster reload, wider arcs, piercing harpoons, burning pools, ward beams.
- Respec or low-cost refit should arrive early enough that trying Harpoons, Firepots, and Shrine Lanterns feels safe.
- Boss rewards should be more than currency; they should unlock a blueprint, weapon evolution, relic, or permanent fitting.

## What Brotato Teaches

Brotato sharpens the wave/shop structure:

- Runs are fast and wave-based.
- Each wave has a clear time box.
- The player can carry multiple weapons at once.
- Materials become XP and shop spending.
- A between-wave shop gives breathing room and makes each wave feel like a tactical budget puzzle.
- Accessibility options adjust enemy health, damage, and speed.

Translation for Unearned Bounty:

- Lanes can use short wave beats even inside an idle loop.
- After a wave or boss, briefly surface the best next purchase instead of making the player hunt.
- Multi-weapon identity should be visible: cannons plus harpoons plus firepots should feel like a broadside build, not a hidden stat pile.
- Debug/tuning sliders could graduate into accessibility options later: enemy speed, combat text density, reduced flashes, low-motion mode.
- A future "Buy Amount" row should matter once upgrade costs get repetitive.

## What Halls Of Torment Teaches

Halls of Torment shows how to make the genre feel like an RPG:

- Strong visual identity can carry a familiar loop.
- Character traits, abilities, items, blessings, quests, and bosses create many overlapping goals.
- Quest-based meta progression gives players objectives beyond surviving longer.
- Items retrieved from a run can customize future runs.
- Bosses with unique mechanics make the run feel authored.

Translation for Unearned Bounty:

- Pirate identity should do real work: bounty notices, cursed waters, named bosses, and relics should make the lane feel authored.
- Add quest-like objectives: "Defeat 20 Privateers with cannons", "Break Ironclad armor with Harpoons", "Clear Lane 2 without sinking."
- Bosses should have named behaviors, not just more hull: armor phase, boarding threat, cursed broadside, summon escorts.
- Retrieved items can become ship fittings, relic compass pieces, or port upgrades.

## What Deep Rock Galactic: Survivor Teaches

Deep Rock Galactic: Survivor's key move is adding mining and objectives to the auto-shooter formula:

- The player is not only killing enemies; they mine walls and collect resources.
- Procedural caves and mission objectives create situational navigation.
- Extraction gives each stage an end-state beyond "survive until timer."
- Auto-shooting is preserved, but movement becomes more strategic because resources and exit timing matter.

Translation for Unearned Bounty:

- Add non-combat objectives inside the sea encounter: salvage reefs, floating wreckage, stormglass deposits, merchant crates, cursed buoys.
- The ship can choose between pushing the main threat and drifting toward valuable pickups.
- Lane completion can end in an extraction/port moment: "return to port", "break through the stormwall", "claim the wreck."
- Resource nodes give the player something to care about even when the enemy math is stable.

## What 20 Minutes Till Dawn Teaches

20 Minutes Till Dawn is closer to a twin-stick horde shooter, but its lessons still matter:

- Active firing/aiming makes each build feel more deliberate.
- Boss Tomes provide significant upgrade choices.
- Runes carry progression across runs.
- Short session lengths make the game easy to re-enter.
- Darkness/difficulty levels turn mastery into a ladder.

Translation for Unearned Bounty:

- Even if the web build stays idle, small active choices can help: target priority, focus fire, temporary broadside order, or route drift.
- Bosses should drop high-impact choices, not only bigger currency piles.
- A rune-like layer maps well to charts, captain orders, or permanent sea marks.
- Difficulty ladders can become storm tiers, Infamy tiers, or cursed-route modifiers.

## What Soulstone Survivors Teaches

Soulstone Survivors leans into scale:

- Hundreds of skills and many passive/active combinations.
- Colossal bosses.
- Weapon crafting.
- Character unlocks.
- Skill tree progression.
- Curses, maps, and modes.

Translation for Unearned Bounty:

- Content breadth is compelling, but only if the UI tags and filters it cleanly.
- Every weapon and upgrade needs mechanical tags: cannon, armor-pierce, burn, ward, speed, salvage, hull, boss, swarm.
- Large bosses need screen-space authority and clear telegraphs.
- Crafting weapons should feed the same combat identity: a crafted Harpoon should look and behave differently, not just add 12% damage.

## What Death Must Die Teaches

Death Must Die combines survivor combat with Hades-like god blessings and Diablo-like loot.

- Blessing sources have identities.
- Heroes have game-altering traits.
- Gear changes future runs.
- Relic odds can be increased at the cost of empowering enemies.

Translation for Unearned Bounty:

- Sea god, faction, or curse blessings are a natural fit: "Tide Mother's Wake", "Crown Bounty", "Lantern Saint's Ward."
- Hero traits can become captain traits or ship lineage traits.
- Gear loot can become persistent fittings or relics.
- Risk/reward knobs are perfect for the pirate fantasy: raise the bounty, sail cursed waters, or carry contraband for better rewards and stronger enemies.

## What Nordic Ashes Teaches

Nordic Ashes is useful because its progression shape supports its theme:

- Character constellations serve as ability trees.
- Yggdrasil is a meta-progression tree.
- Relics can ascend.
- Shrines create in-run challenges.
- Elites and bosses have distinct behaviors.

Translation for Unearned Bounty:

- Progression maps should be nautical and mystical: constellations, chart routes, compass rings, tide tables, port ledgers.
- Relic ascension can map to restoring, polishing, or binding a relic.
- Reward shrines can become sea events: wrecks, ghost lights, smuggler caches, storm altars.
- Boss/elite behavior should be part of enemy family identity.

## Genre Risks

- Too many visual effects can hide important combat state.
- Too many upgrades can make choices feel random rather than strategic.
- If early choices are weak, the genre's "I am becoming a disaster machine" promise fails.
- If meta progression is too slow, death feels like wasted time.
- If upgrade language is inconsistent, players cannot build intentionally.
- If the game is too passive, it becomes a screensaver instead of a command fantasy.

## Most Transferable Lessons

For Unearned Bounty, the strongest lessons are:

- Make every upgrade visible in the combat window.
- Use bosses as build milestones.
- Give the player frequent small choices and occasional major choices.
- Show future build paths before they are affordable.
- Use enemy families to teach counters.
- Let failure generate permanent progress.
- Add risk/reward modifiers once the basic lane works.
- Make progression trees look like part of the world.
- Keep combat readable even when the player becomes absurdly powerful.

## Immediate Design Translation

The web build should evolve toward:

- A visible projectile pattern per weapon.
- A reward burst when enemies die.
- A small level-up or captain-order offer after enough kills or at wave completion.
- Boss chests/blueprints that unlock weapons and fittings.
- A Harpoon Battery reveal before Ironclads punish cannon builds.
- A Doubloon sink tied to weapon unlocks, fitting slots, or risk modifiers.
- A meta tree shaped like a chart, compass, or constellation instead of a generic upgrade grid.

The important promise: when the player buys an upgrade, the ocean should show it.
