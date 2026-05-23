# Unnamed Space Idle Systems Carryover Todo

Research date: 2026-05-22

This note turns Unnamed Space Idle (USI) research into an implementation backlog for Unearned Bounty (UB). It is not a clone spec. The goal is to borrow durable idle-game structures: sectors, distance, boss milestones, farming, route choices, equipment identity, and reset-based reconfiguration.

## Source Map

| USI Topic | Useful Source |
| --- | --- |
| Sectors, unlocks, sector boss clears | https://spaceidle.game-vault.net/wiki/Sectors |
| Battlefield loop, distance, waves, engine speed | https://spaceidle.game-vault.net/wiki/Gameplay |
| Enemy waves, sector spawn logic, enemy classes | https://spaceidle.game-vault.net/wiki/Enemies |
| Prestige reset and loadout selection | https://spaceidle.game-vault.net/wiki/Prestige |
| Ship configuration, farming wave clears, milestone value | https://spaceidle.game-vault.net/wiki/Guide:Ship_Configuration |
| Warp gauntlets and elite-route unlocks | https://spaceidle.game-vault.net/wiki/Warp_Drive |
| Synth recipes, Synth points, active modules | https://spaceidle.game-vault.net/wiki/Synth |
| Gem/shard-like slot system | https://spaceidle.game-vault.net/wiki/V-Device |
| Research branches and focused research | https://spaceidle.game-vault.net/wiki/Research |
| Bases, component production, prestige bonuses | https://spaceidle.game-vault.net/wiki/Bases |
| Crew XP, stats, milestones, reprinting | https://spaceidle.game-vault.net/wiki/Crew |

## High-Level Translation

| USI System | What It Does | Why It Works | Unearned Bounty Translation | Prototype Priority |
| --- | --- | --- | --- | --- |
| Sectors | Player advances through distance, fights waves, defeats a sector boss, unlocks later content. | Gives the player a clear next goal without ending idle farming. | Sea sectors, each with distance, enemy fleet table, boss, route tag, and first-clear unlocks. | Now |
| Waves inside sectors | Enemies keep spawning while the player is in a sector. Holding position can farm waves without necessarily pushing the boss. | Lets players build power at a wall without hard failure loops. | Enemy ships/fleets spawn on a timer; Auto Progress moves distance; Hold farms at current distance. | Now |
| Sector boss | End-of-sector power check. Clearing the boss unlocks next sector and sometimes systems. | Makes progression legible: "beat this captain to open the next thing." | Named captains at sector end. First clear unlocks Captain's Desk systems, routes, equipment, and prestige options. | Now |
| Route A/B/C | Different sector variants branch for a while, often converging later; harder routes can unlock content. | Adds choice without infinite branching complexity. | Trade Wind, Black Reef, Storm Line. Harder routes contain elite fleets and special unlocks, then reconnect to common sector endpoints. | Soon |
| Core equipment | Weapons, shields, utilities are upgraded and chosen around enemy counters. | Creates build identity and reasons to prestige/reconfigure. | Ship, weapon, hull/defense, utility selected at Return to Port; Arsenal upgrades currently equipped components. | Now/Soon |
| Milestone upgrades | Upgrade nodes periodically give larger or behavior-changing rewards. | Linear stats become buildcraft. Players chase breakpoints. | Every 5 Arsenal levels: direct stat multiplier; bigger milestone nodes add behavior options. | Now |
| Wave-clear scaling | Some upgrades gain bonuses from cleared wave count, making farming useful. | Idle farming becomes intentional preparation, not wasted time. | "Prize Ledger" or Arsenal milestones that grant small bonus per ship sunk/sector wave cleared. | Soon |
| Prestige | Reset most run progress to reselect ship/cores and activate permanent bonuses. | Reset is about new configuration, not only bigger numbers. | Return to Port resets run resources/upgrades, keeps boss milestones, lets player pick ship, weapon, defense, utility. | Now |
| Starting sector unlocks | Later progression can start from further sectors after upgrades. | Reduces repetition after mastery. | Harbor chart upgrades allow starting from cleared sectors or route checkpoints after prestige. | Later |
| Elite sectors | Harder route variants unlock special systems or side content. | Optional challenge gives meaningful unlocks without blocking all players. | Elite route captains unlock components, ship classes, cursed gear, or side voyages. | Soon |
| Warp gauntlets | Charged side activity with predetermined waves and a boss. | Adds focused challenge runs outside main sector pushing. | Storm Contracts / Map Fragments: timed sea gauntlets with fixed fleets and special currency. | Later |
| Automation | Older chores become automated through progression. | Keeps long-term play from becoming repetitive setup. | Auto-targeting, auto-Arsenal purchase rules, auto-route selection, auto-return prompts. | Later |
| Synth | Craft materials, level recipes, earn Synth points, unlock infinite materials and modules. | Turns idle production into permanent progress and a reason to focus a subsystem. | Shipwright's Bench: craft fittings, level blueprints, unlock permanent recipe mastery and active ship modules. | Soon |
| Modules | Toggleable boosts that consume module slots and upgrade through Synth materials. | Gives flexible run-specific loadout without full prestige. | Charms / Rigging Modules: toggle boosts for damage, hull, salvage, repair, route speed, research, contracts. | Soon |
| V-Device shards | Slot shards into colored slots; drops depend on sector; resonance scales effects. | Drop collection becomes buildcraft, not just loot accumulation. | Relic Compass / Treasure Grid: slot gems, relic shards, figurehead idols, or chart fragments with color/slot effects. | Later |
| Research | Multiple branches earn progress from sector/enemy density; one branch can be focused for a bonus. | Location choice matters; focus creates a clear idle decision. | Admiralty Research: Gunnery, Shipwrighting, Navigation, Occult branches; focus one without stopping others. | Soon |
| Bases | Grid buildings produce materials, parts, and components; components become prestige bonuses. | Spatial puzzle plus reset incentive; each base supports a named system. | Port Facilities: Drydock, Foundry, Observatory, Smuggler's Wharf grids that activate bonuses on Return to Port. | Later |
| Crew | Active crew gain XP in stats, rank/milestone, and reprint with catch-up. | Long-term personalization and focused runs after core systems are understood. | Officers: Gunner, Boatswain, Navigator, Surgeon, Quartermaster; active officers gain XP and specializations. | Later |

## Sector Model Todo

### Immediate

- Rename player-facing "lane" language to "sector" everywhere in the web prototype.
- Keep `lane` only if needed as legacy internal data, then plan a cleanup pass to remove it.
- Represent current progression as:
  - `sector`: current sector number.
  - `route`: A/B/C or named pirate route.
  - `distance`: progress inside the sector.
  - `distance_goal`: boss distance for that sector.
  - `waves_cleared`: farming count inside that sector.
  - `boss_cleared`: persistent first-clear milestone.
- Let enemies continue spawning even when Auto Progress is off or course mode is Hold.
- Auto Progress should move the player toward the boss after each normal wave/encounter.
- Reaching `distance_goal` should spawn the sector boss without deleting all other visible ships.

### Soon

- Create data for 100 planned sectors.
- Add route tag per sector: `trade_wind`, `black_reef`, `storm_line`.
- Add route difficulty modifiers:
  - Trade Wind: baseline.
  - Black Reef: tougher hull/armor, better salvage or unlock chances.
  - Storm Line: faster enemies, special defense pressure, unique unlocks.
- Add converging route map:
  - Example: Sector 5 can choose 5A or 5B, both feed into Sector 6.
  - Later: 12A/12B/12C feed into Sector 15.
- Add a sector select / chart screen once routes matter.

### Later

- Add starting-sector unlocks after prestige.
- Add "safe charted start" points every 5 or 10 sectors.
- Add route mastery rewards for clearing all variants of a branch.

## Combat Wave Todo

### Passive Drops Source Check

USI behavior checked against local roadmap notes plus the USI wiki pages for Resources, Gameplay, and V-Device on 2026-05-22:

- Salvage has two related sources: every defeated enemy grants normal Salvage, while larger Scrap chunks are visible battlefield pickups that can be clicked or later auto-collected through a Synth module.
- Void Matter is enemy-kill based, not a manual active ability. It has less than 100% drop chance, with chance and amount affected by sector/enemy data and later systems.
- V-Device shards unlock after early sectors; destroyed enemies drop shards whose type, amount, and chance depend on sector, and duplicates fill Resonance.
- Energy Voids are the separate active/clickable timed battlefield boost. They are not the model for ordinary salvage, Void Matter, or shard drops.

UB translation for the current prototype:

- Salvage should appear as common wreckage pickups spawned by normal combat kills. It can be clicked now; later automation can collect it once the player has solved that chore.
- Doubloons should be rare, persistent sea pickups, weighted toward bosses and prize ships.
- Ether Brine should stay a run-resetting rare combat drop for the future Stormheart Furnace. Do not surface it as a spendable system until Stormheart has a source, sink, reset rule, and UI home.
- Pickups should linger long enough to read as sea objects and rewards from wreckage, not short reaction tests.

### Immediate

- Maintain multiple visible enemy ships with individual health states.
- The selected target should be one of the ships on screen, not a separate "primary target" concept.
- Player shots should hit selected or auto-selected targets.
- Side ships should fire and take damage from player volleys or support effects.
- Sunk ships should remain as wreckage briefly instead of causing the whole wave to disappear.

### Targeting Source Check

USI behavior checked against local notes plus the USI Core wiki page on 2026-05-22:

- Targeting settings live with Core weapons rather than on the battlefield itself, and unlock after early sector progress.
- The menu is weapon-specific and covers type priority, stat priority, target swapping, and target overlap.
- USI targeting is about defining weapon behavior in advance, not constantly clicking enemies during combat.

UB translation for the current prototype:

- Targeting belongs in Arsenal as "Targeting Orders" for the current weapon.
- Keep the sea view focused on readable selected-target reticles and incoming fire.
- Prototype orders map to USI-like ideas: keep/change target and allow/avoid overlap. Later, per-weapon target priority can expand into nearest, lowest hull, highest threat, and boss focus.

### Soon

- Spawn waves gradually:
  - New wave cadence around 30 seconds.
  - Ships enter during a 10 second spawn window.
  - Spawn distance affects arrival time.
  - Bosses have the longest approach time.
- Add target selection rules:
  - Nearest.
  - Lowest hull.
  - Highest threat.
  - Boss focus.
  - Broadside sweep.
- Put target selection on Arsenal or Captain's Desk as a selectable system.

### Later

- Add wave farming counters:
  - Ships sunk this sector.
  - Best waves farmed in sector.
  - Lifetime waves cleared.
- Tie those counters into milestone upgrades.

## Boss And Unlock Todo

### Current Unlock Direction

- Sector 1 boss: unlock Prestige screen / Return to Port planning.
- Sector 2 boss + Return to Port: unlock Muster.
- Arsenal remains the first active spend system.
- Muster is earned progress allocation, not salvage spending.

### Proposed First 20 Sector Unlock Sketch

| Sector Clear | Unlock |
| --- | --- |
| 1 | Prestige planning visible; Return to Port explained but not fully valuable yet. |
| 2 | Return to Port unlocks Muster allocation. |
| 3 | Targeting doctrine selection. |
| 4 | Second weapon family or Harpoon Battery route. |
| 5B elite | Reinforced hull/armor component option. |
| 6 | First utility slot. |
| 8 | Auto Progress rules / basic route automation. |
| 10 | First major captain milestone; starting-sector chart option after prestige. |
| 12B elite | Black Reef component or salvage multiplier fitting. |
| 15C elite | Storm Line defense or evasive seamanship fitting. |
| 18 | Challenge/contract system seed. |
| 20 | Major prestige expansion: new ship hull or multi-slot ship. |

This table should be treated as a pacing sketch, not final content.

## Arsenal / Equipment Todo

### Immediate

- Arsenal upgrade cards should only upgrade currently fitted weapon and hull/defense.
- No caps on basic Arsenal levels.
- Scaling should be low enough that repeated purchases feel possible.
- Weapon upgrades should increase impact, not turn a cannon into a machine gun.

### Soon

- Every 5 levels grant a milestone:
  - Weapon: x1.25 base damage.
  - Hull: x1.25 base hull.
  - Alternate: choose between fire rhythm, impact, pierce, splash, or support effect.
- Add UI for upcoming milestone reward.
- Add visible combat changes:
  - Larger muzzle smoke.
  - Stronger impact splash.
  - Longer recoil pause.
  - Different projectile trail.

### Later

- Move equipment selection out of Arsenal and into Prestige / Return to Port.
- Add component info cards for:
  - Ship.
  - Weapon.
  - Defense.
  - Utility.
- Add loadout presets once multiple components exist.

## Defense Todo

USI starts with continuous shields, then later branches into alternatives such as bulk-style recovery delay and deflector-style mitigation. UB should translate this into nautical fiction without losing the readable survival loop.

### Immediate

- Keep slow continuous hull/ward recovery so early idle combat can stabilize.
- Seamanship grants max hull.
- Hull Arsenal upgrades improve base hull.

### Soon

- Add defense families:
  - Reinforced Planking: max hull and armor.
  - Bilge Pumps: stronger regen after damage.
  - Warded Figurehead: damage reduction against cursed enemies.
  - Evasive Rigging: chance to avoid shots, weaker against swarms.

### Later

- Add defense milestone choices that alter playstyle:
  - Steady repair.
  - Delayed burst repair.
  - Deflection charges.
  - Armor against many small hits.

## Synth / Modules Todo

USI's Synth is not just crafting. Recipes level permanently, Synth points buy cross-system upgrades, materials can become infinite, and modules are temporary toggles that consume active module slots. Modules reset through prestige, but if the required material tier has been made infinite, they can automatically recover to that tier after prestige.

UB should use this structure when the Captain's Desk needs a second non-combat system after Arsenal/Muster.

### Pirate Translation

| USI Concept | UB Name | UB Function |
| --- | --- | --- |
| Synth | Shipwright's Bench | Craft fittings/materials over time. |
| Recipe levels | Blueprint Mastery | Permanent mastery for each crafted fitting/material. |
| Synth points | Drafting Marks | Permanent points spent on cross-system upgrades. |
| Infinite materials | Standing Supply | Once a material is mastered, it no longer bottlenecks early recipes. |
| Active module slots | Rigging Slots | Limited slots for active run modifiers. |
| Modules | Charms / Rigging Modules | Toggleable boosts to damage, hull, salvage, route speed, research, repair, or contracts. |

### Immediate Shape

- Unlock Shipwright's Bench after an early boss, probably Sector 3 or 4.
- Start with 1 crafting slot.
- Craft simple materials:
  - Tarred Rope.
  - Brass Fittings.
  - Reinforced Planks.
  - Powder Primer.
- Crafting a recipe grants recipe XP.
- Recipe levels reduce time/cost and unlock the next material or module.
- Maxing an early recipe grants Standing Supply for that material.

### Modules To Prototype

| Module | Effect | Notes |
| --- | --- | --- |
| Powder Discipline | Weapon damage multiplier. | Direct combat baseline. |
| Braced Bulkheads | Max hull multiplier. | Defense baseline. |
| Prize Hooks | Salvage gain multiplier. | First farming module. |
| Quick Patch Crew | Hull regen multiplier. | Supports idle survivability. |
| Fair Wind Rigging | Sector distance gain multiplier. | UB equivalent of engine speed. |
| Spyglass Table | Research gain multiplier. | Later bridge to Research. |
| Storm Lantern | Contract / warp reward multiplier. | Later bridge to side gauntlets. |

### Design Rules

- Modules should be toggleable, but not so freely swapped that every 10 seconds becomes optimal.
- Early module slots should be scarce: 1 slot at unlock, 2 after a milestone, more later.
- Make the module UI show:
  - Active slots used.
  - Material tier or mastery tier.
  - Current effect.
  - What unlocks the next tier.
- Do not make Synth mandatory before the player understands Arsenal and sector bosses.

## Gems / Shards / Relics Todo

The USI V-Device is the likely "gems" reference. Enemies drop Void Shards based on sector. Shards go into colored slots and grant different effects depending on slot. Resonance fills as duplicates are collected, gradually scaling the shard toward max strength. More slots and colors unlock over time.

### Pirate Translation

Call this the Relic Compass, Treasure Grid, or Captain's Reliquary.

| USI Concept | UB Name | UB Function |
| --- | --- | --- |
| Void Shards | Relic Shards / Gems / Idol Fragments | Enemy drops that scale with duplicates. |
| Resonance | Attunement | Duplicate collection fills an effect bar. |
| Colored slots | Compass Sockets | Slot color changes secondary effect. |
| Slot unlocks | Compass Expansion | New socket colors unlock at boss milestones. |
| Shard linking | Ley Lines / Compass Bearings | Later upgrade that links socket effects. |

### Candidate Early Relics

| Relic | Main Effect | Slot Variant Ideas |
| --- | --- | --- |
| Cannon Ruby | Weapon damage. | Red: damage; blue: reload; green: salvage from kills. |
| Keelstone | Max hull. | Red: armor; blue: regen; green: route speed. |
| Widow's Coin | Salvage gain. | Red: boss salvage; blue: normal salvage; green: offline salvage. |
| Stormglass | Route speed. | Red: forward speed; blue: retreat recovery; green: contract rewards. |
| Black Reef Pearl | Armor pierce. | Red: pierce; blue: cursed resistance; green: elite-route rewards. |

### Unlock Timing

- Do not unlock before the player has at least:
  - Arsenal.
  - Sector bosses.
  - Prestige basics.
  - One secondary system.
- Candidate unlock: Sector 6 or 8 boss.
- First socket should be simple: one slot, one relic family, obvious damage/hull/salvage choice.

## Research Todo

USI Research has three normal branches. Sectors have different branch density values, so where the player fights affects research gain. One branch can be focused for a large bonus, and focusing does not stop the other branches.

### Pirate Translation

Call it Admiralty Research, Chartroom Research, or Scholar's Desk.

| Branch | Theme | Early Rewards |
| --- | --- | --- |
| Gunnery | Weapons, targeting, powder, impact. | Damage, armor pierce, target doctrine unlocks. |
| Shipwrighting | Hull, repair, defenses, modules. | Max hull, regen, Shipwright speed, extra module slot. |
| Navigation | Sector speed, route choices, contracts. | Distance gain, retreat reduction, sector start charts. |
| Occult | Curses, relics, strange seas. | Relic drops, cursed resistance, storm contract rewards. |

### System Rules

- Enemy kills grant research to all unlocked branches.
- Current sector route can weight branch gain:
  - Trade Wind: balanced.
  - Black Reef: Shipwrighting/Gunnery.
  - Storm Line: Navigation/Occult.
- Player can focus one branch for a multiplier.
- Focus should not zero out the others.
- Research should unlock new mechanics, not only percentages.

### Prototype Rewards

- Gunnery 1: Targeting doctrine unlock.
- Gunnery 2: Weapon milestone options.
- Shipwrighting 1: Shipwright's Bench speed.
- Shipwrighting 2: Extra rigging/module slot.
- Navigation 1: Auto Progress settings.
- Navigation 2: Start at Sector 5 after Return to Port.
- Occult 1: Relic Compass unlock.
- Occult 2: Relic drop preview in sector chart.

## Bases / Port Facilities Todo

USI Bases are grid systems. Buildings produce materials, parts, and components. Components often become prestige bonuses for a specific system. Some one-time upgrades unlock major features or starting points.

UB should delay this until the core loop is stable. It is a good midgame "port management" layer because the pirate fiction naturally supports shipyards, foundries, observatories, warehouses, and smuggler networks.

### Pirate Translation

| USI Base | UB Facility | Prestige Bonus Theme |
| --- | --- | --- |
| Base 1 | Drydock | Damage and hull after Return to Port. |
| Base 2 | Foundry | Arsenal cost efficiency / crafting speed. |
| Base 3 | Shipwright Yard | Shipwright's Bench speed and module recovery. |
| Base 4 | Observatory | Contract rewards, route speed, research. |
| Base 5 | Hidden Cove | Officer mastery / special crew bonuses. |

### Building Types

- Materials: generate facility building material.
- Parts: generated from materials; used for upgrades.
- Components: drain materials/parts into a prestige bonus.
- Boosters: multiply adjacent production/drain.
- Drain reducers: reduce adjacent component drain.
- Warehouses: raise storage or offline cap.

### Design Rules

- Keep the first facility tiny: 3x3 or 4x4.
- The first layout puzzle should be understandable without a guide.
- Make the prestige bonus preview obvious before Return to Port.
- Facility slots can unlock now but become active after the next Return to Port.
- Avoid introducing this until the user already wants a "port" tab.

## Warp / Contracts Todo

USI Warp Drive uses charged cores to enter short fixed gauntlets. Warp locations unlock through elite sectors. Gauntlets spawn predetermined waves and a boss, then pay a special currency for a tree of upgrades.

### Pirate Translation

Call these Storm Contracts, Map Fragments, or Ghost Charts.

| USI Concept | UB Name | UB Function |
| --- | --- | --- |
| Warp Core | Sealed Map / Storm Compass Charge | Slowly recharging entry token. |
| Warp Location | Contract | Fixed enemy gauntlet and boss. |
| Warp Essence | Stormglass / Contract Scrip | Currency for contract upgrade tree. |
| Elite sector unlock | Elite route chart | Hard route unlocks new contracts. |

### Contract Types

- Salvage Run: many weak ships, salvage reward.
- Reef Breaker: armored enemies, hull/armor reward.
- Storm Chase: fast arrivals, navigation reward.
- Cursed Convoy: occult enemies, relic reward.
- Boss Rematch: named captain variant, prestige currency reward.

### Design Rules

- Contracts should be short and watchable.
- Partial completion should pay partial rewards.
- Contract charges should recover while the main sector loop runs.
- Contract upgrades should improve several systems, not only contracts.

## Crew / Officers Todo

USI Crew members are active units created from biosleeves. They gain XP in stats, earn ranks and skill points, and their previous highest levels create catch-up on future prints. Milestones are based on highest-reached values, not only currently active values.

UB should translate this into officers after the player has enough systems for officers to specialize in.

### Pirate Translation

| USI Concept | UB Name | UB Function |
| --- | --- | --- |
| Crew member | Officer | Active character assigned to a role. |
| Biosleeve | Commission / Letter of Marque | Limited resource to recruit or reassign officer. |
| Printing | Commissioning | Activate a new officer build. |
| Highest-level catch-up | Veteran Record | Recommissioned officers regain early levels faster. |
| Crew stats | Officer Disciplines | Stat lines tied to systems. |

### Officer Disciplines

| Discipline | Supports |
| --- | --- |
| Gunnery | Damage, targeting, broadside effects. |
| Seamanship | Hull, repair, evasion, retreat recovery. |
| Navigation | Distance gain, route selection, contract charges. |
| Quartermastery | Salvage, crafting, module slots, offline gains. |
| Occult Lore | Relics, cursed defense, storm contracts. |

### Officer Types

- Master Gunner: Gunnery / Quartermastery.
- Boatswain: Seamanship / Gunnery.
- Navigator: Navigation / Occult Lore.
- Surgeon-Carpenter: Seamanship / Quartermastery.
- Occultist: Occult Lore / Navigation.

### Design Rules

- Crew should not unlock too early.
- Each officer should have one obvious use case.
- Officer XP should come from combat, not clicking.
- Reassignment should have a cost, but catch-up should prevent regret.
- Milestones should be permanent based on best historical values.

## Route And Elite Todo

### Route Shape

Avoid infinitely branching content. Use temporary branches that reconverge.

Example:

```text
Sector 1 -> 2 -> 3 -> 4
                    |
                    +-> 5A Trade Wind -> 6
                    +-> 5B Black Reef -> 6

Sector 10 -> 11 -> 12A -> 15
                  12B -> 15
                  12C -> 15
```

### Pirate Route Translation

| Route | Feel | Mechanical Hook |
| --- | --- | --- |
| Trade Wind | Mainline sea road | Balanced enemies, normal rewards. |
| Black Reef | Dangerous, armored, rocky | Elite hulls, armor pressure, salvage/component rewards. |
| Storm Line | Fast, chaotic weather | Faster arrivals, ranged pressure, evasive/defense unlocks. |

## Design Questions To Resolve

- Should sectors be one continuous chart or grouped into seas/regions of 10?
- Should route choice be automatic based on selected course, or a map decision after clearing specific bosses?
- Should holding position farm infinite waves at exactly the current distance, or slowly drift within a small distance band?
- Should waves cleared be per-sector, lifetime, or both for milestone scaling?
- How much of USI's "enemy counter" depth belongs in the first hour versus after Prestige?
- What is the pirate equivalent of USI engine speed: sail handling, seamanship, wind gauge, or navigation?

## Implementation Backlog

1. Finish replacing player-facing lane language with sector language.
2. Add `data/definitions/sectors.json` with 100 planned sector shells.
3. Add sector route tags and first-clear unlock metadata.
4. Change sim to spawn normal waves indefinitely while Hold is active.
5. Keep boss spawn tied to sector distance goal.
6. Track waves cleared per sector.
7. Track boss clears by sector id.
8. Add sector chart UI in Captain's Desk.
9. Add elite route variant data for sectors 5, 12, and 15.
10. Add first route-choice screen after the relevant boss clear.
11. Add target selection doctrines.
12. Add milestone upgrade UI for every 5 Arsenal levels.
13. Add wave-clear scaling milestone option.
14. Add starting-sector prestige unlock after Sector 10.
15. Add Storm Contract / Warp-like side gauntlet prototype later.
16. Add Shipwright's Bench as the first crafting/module system.
17. Add Rigging Modules with limited active slots.
18. Add Admiralty Research with branch focus and sector route density.
19. Add Relic Compass after Research or elite routes need more loot buildcraft.
20. Add Port Facilities after prestige needs a stronger port-management layer.
21. Add Officers after there are enough systems for crew specializations to matter.

## Near-Term Prototype Slice

The next useful implementation slice is small:

1. Create real sector data.
2. Make the UI say Sector, Route, Distance, Boss.
3. Let Hold keep spawning waves without advancing.
4. Let Forward advance distance toward the boss.
5. Let boss defeat advance to the next sector but keep the game running.
6. Preserve first-clear unlocks for Prestige and Muster.

That will align the prototype with the USI-inspired structure while keeping Unearned Bounty's pirate identity intact.
