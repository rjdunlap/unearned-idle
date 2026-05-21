# Pirate Unfolding Idle Concept

Working framing: a mystical age-of-exploration pirate idler inspired structurally by Unnamed Space Idle and thematically by Unearned Bounty's described tone.

Avoid direct One Piece references. The target feeling is not "copy a pirate anime"; it is a vast magical sea where crews, relics, bounties, cursed powers, and impossible islands make exploration feel mythic.

## Core Fantasy

You command a notorious exploration vessel pushing beyond the Crowned Map into seas ruled by privateers, sea spirits, cursed navies, living storms, and island-gods. Your ship fights automatically through sea lanes, collects salvage and strange resources, and returns to port to refit, recruit, preserve discoveries, and sail farther.

The player fantasy is captaincy:

- Choose the ship's weapons, hull, sails, wards, and fittings.
- Decide which waters to farm for relic fragments, charts, lore, or bounty.
- Build hidden island havens that make future voyages stronger.
- Recruit crew who grow into legends, then send them ashore and rehire their myth.
- Burn mystical fuel to power impossible maneuvers.
- Prestige by returning to port, raising new colors, or launching a grand expedition.

## Design Pillars

- The horizon keeps opening: every major wall should hint at the next tab, island, enemy class, or ship class.
- Sea combat is readable: the player can see what their ship is attacking, what damage type matters, and why they are stuck.
- Buildcraft beats clicking: active play is loadout, route, focus, and timing.
- The mystical layer is systemic: curses, relics, spirits, and stormglass all have mechanical jobs.
- The old voyage becomes easy: solved friction should be automated, capped, or transformed.

## Direct System Translation

| USI system | Pirate version | Core player decision |
| --- | --- | --- |
| Battlefield sectors | Sea Lanes | Which lane to push or farm, which enemy defenses to counter |
| Core equipment | Ship Arsenal | Which cannons, hull, sails, and fittings to invest salvage into |
| Compute | Ship's Bearing | Set operational stance (Hunter/Iron/Scout/Salvage) to direct officers over time |
| Synth | Artificing | Commission materials, level recipes, unlock ship charms and automation devices |
| V-Device | Relic Compass | Slot tide relics by color and resonance; link adjacent relics into constellations |
| Reactor | Stormheart Furnace | Load ether brine and run storm patterns for active ship-wide boosts |
| Research | Cartography | Focus chart branches based on the waters being explored |
| — (new) | Bounty and Infamy | Accept named contracts, build infamy, use Infamy Marks as prestige currency |
| Bases | Hidden Havens | Build island outposts on small grids for prestige bonuses and one-time unlocks |
| Challenges | Trials | Run special voyages that force mastery of one system |
| Warp Drive | Maelstrom Voyages | Spend charged compass needles to enter short mythic gauntlets |
| Crew | Legendary Crew | Level crew roles, ranks, and skills with catch-up after rehire |
| AI upgrades | Quartermaster Logbook | Earn automation, loadouts, tab order, offline improvements, and diagnostics |
| Prestige | Return to Port | Reset voyage-state upgrades, keep permanent discoveries, unlock new ship options |
| Reinforce | Grand Expedition | Bigger reset for expedition charters and permanent era-wide bonuses |
| Fleet | Armada Campaigns | Separate late-game archipelago map with persistent fleet progress |

## Core Loop

1. The ship sails a Sea Lane and auto-fights waves.
2. Defeated enemies drop salvage, doubloons, ether brine, relic shards, charts, lore, crew XP, and materials depending on lane and enemy.
3. The player upgrades the ship, crafts modules, slots relics, researches charts, and builds outposts.
4. Progress slows at a stormwall, fortress, leviathan, or cursed fleet.
5. The player changes loadout, focuses a system, runs a Trial, enters a Maelstrom Voyage, or Returns to Port.
6. Permanent progress makes the next voyage faster and reveals more systems.

## First-Hour Unlock Rhythm

This is a starting pacing target, not a hard spec.

| Time / lane | Unlock | Purpose |
| --- | --- | --- |
| Start | Sea Lane combat, salvage, basic armaments | Establish auto-combat and ship upgrades |
| Lane 2 | Artificing | Add crafting, recipes, modules, permanent recipe levels |
| Lane 3 | Relic Compass | Add drops-as-buildcraft with resonance and constellations |
| Lane 5 | Ship's Bearing | Add operational stance and officer direction |
| Lane 6 | First Bounty Contract | Name a target; introduce Infamy as a metric |
| Lane 7 | Cartography | Add permanent research branch (Charts, one branch only in MVP) |
| Lane 13 | First Hidden Haven | Add grid/base spatial puzzle and prestige incentive (post-MVP) |
| Lane 18 | Trials | Teach focused-system mastery (post-MVP) |
| Lane 22 | Maelstrom Voyages | Add charged side gauntlets and upgrade tree (post-MVP) |
| Wall around lane 15-20 | Return to Port | First prestige; Infamy Marks pay for permanent unlocks |
| Lane 35-50 | Legendary Crew | Add character progression after economy literacy |
| Post-MVP | Stormheart Furnace | Full ether brine → boost economy |

## Ship Arsenal

Ship Arsenal replaces USI's Core equipment. It should be the first and most visible upgrade system.

Categories:

- Broadsides: steady hull damage, good general use.
- Chainshot: sail and speed control, good against evasive enemies.
- Harpoons: armor/monster counters, high single-target pressure.
- Firepots: damage over time, strong against swarms and wooden ships.
- Warding Hull: defense against curses, spirits, and storm damage.
- Ironwood Hull: defense against cannon and ramming.
- Sails: speed, evasion, lane traversal, and maelstrom charge.
- Fittings: utility cores such as salvage nets, spyglass arrays, boarding hooks, shrine lanterns.

Damage defense model:

- Hull: ordinary health. Cannons and broadsides are reliable.
- Armor: reduced cannon damage. Harpoons and firepots help.
- Ward: magical shield. Shrine lanterns, relics, and cursed ammunition help.
- Sail: movement/evasion layer. Chainshot and crew tactics help.

This creates a pirate-flavored version of USI's enemy-type counters without using spaceships.

## Ship's Bearing

Ship's Bearing replaces the earlier Chartwork concept. Rather than allocating percentage sliders to bars, the captain sets an operational bearing — a stance that directs the officers' priorities for the current leg of the voyage.

The player picks one of four bearings:

- **Hunter Bearing**: Gunnery officers push attack speed and damage. Slight lane slowdown (attention is on the target, not the horizon).
- **Iron Bearing**: The Boatswain focuses on hull integrity and damage smoothing. Damage is reduced; defense multiplied.
- **Scout Bearing**: The Navigator prioritizes chart-reading and lane speed. Less combat weight, faster traversal and chart gain.
- **Salvage Bearing**: All hands shift to recovery. Combat efficiency drops; salvage and resource drops increase from every kill.

Each bearing builds momentum over time: holding a bearing multiplies its benefit by a compound factor (capped). Switching resets the momentum. This creates real timing decisions: switch to Iron Bearing before a boss wave, hold Hunter during easy enemies, then flick to Salvage when farming a known lane.

Later upgrades:
- Bearing Mastery: each bearing has a permanent level that raises its base effectiveness.
- Second Bearing Slot: unlocked post-prestige, allows running two bearings simultaneously at reduced efficiency.
- Bearing Auto-Hold: Quartermaster automation that locks a bearing during specific situations.

The bearing panel should show current momentum as a tide-line fill, not a numeric bar, to reinforce the sea metaphor.

## Artificing

Artificing is the pirate version of Synth. It converts gathered materials into permanent recipe mastery and active ship charms.

Starter recipes:

- Refined Timber.
- Sailcloth Sigil.
- Brass Gear.
- Powder Core.
- Stormglass Lens.
- Moon Coral Inlay.
- Siren Wire.
- Blackwake Alloy.

Starter modules:

- Broadside Efficiency: multiplies damage.
- Hull Warding: multiplies defense.
- Salvage Nets: improves salvage and doubloon recovery.
- Ether Condenser: improves ether brine recovery.
- Auto-Harpoon Rig: triggers harpoon ability.
- Relic Lens: improves relic shard detection.
- Cartographer's Lamp: improves research/lore.
- Outpost Ledger: improves haven production.

Recipe levels should be permanent. Modules can reset on Return to Port but auto-restore to the highest infinite material tier to reduce friction.

## Relic Compass

Relic Compass replaces the V-Device. Enemies and islands drop relic fragments. A relic becomes stronger as resonance fills.

Slot colors can map to playstyles:

- Red: combat.
- Gold: economy/flex.
- Pink: mystical/curse.
- Blue: navigation/research.
- Green: crew/outpost.

Relic examples:

- Kraken Tooth: damage, harpoon power, monster damage.
- Saint's Coin: doubloons, salvage, outpost trade.
- Stormglass Eye: ether recovery, storm power, maelstrom charge.
- Wreck-King's Nail: hull, armor piercing, boarding.
- Siren Thread: crew XP, ward damage, lure spawns.
- Cartographer's Bone: chart speed, lore, lane data.

Later slot-linking can create "constellations" on the compass. Example: Kraken Tooth linked to Stormglass Eye grants storm-harpoon scaling.

## Stormheart Furnace

Stormheart replaces Reactor. The ship burns ether brine into storm power, then powers boosts.

Boost examples:

- Thunder Broadside: damage.
- Saltward Bloom: defense and ward regeneration.
- Fair Wind: lane speed.
- Deep Salvage: salvage and rare drop chance.
- Lantern Wake: lore and chart gain.
- Maelstrom Anchor: side-voyage charge speed.

Limit concurrent boosts early. Over-limit boosts drain storm power faster. The power management puzzle should be readable and later automatable.

## Cartography and Lore

Research branches:

- Cartography: lane speed, new lane options, maelstrom routes, map tools.
- Natural Philosophy: ship materials, artificing speed, salvage.
- Occult Lore: wards, relics, curses, storm power.
- Reputation: crew XP, bounties, harbor prices, diplomacy.

Different sea lanes have different research density. Example: ruins give Occult Lore, trade routes give Reputation, reefs give Natural Philosophy, storm lanes give Cartography.

## Hidden Havens

Hidden Havens replace Bases. They are small island grids with adjacency puzzles.

Building types:

- Dock: produces planks and ship components.
- Tavern: crew XP and recruitment.
- Shrine: ward and relic bonuses.
- Market: doubloons and trade conversion.
- Lighthouse: lane speed and maelstrom charge.
- Drydock: prestige ship upgrade unlocks.
- Smuggler Den: rare drops and bounty boosts.
- Watchtower: enemy data and auto-navigation.

Havens apply their main component bonus when the player Returns to Port. Some slots unlock only after the next Return, making prestige feel materially useful.

## Trials

Trials are focused challenge voyages.

- Dead Calm Trial: only Ship's Bearing momentum can provide battle power.
- Empty Hold Trial: Artificing materials become the main stat source, no salvage drops.
- Stormheart Hunger: damage and hull are equal to current storm power.
- Haven Carry: Hidden Haven buildings provide all battle stats.
- No-Flag Trial: crew and bounty systems disabled, pure ship loadout.

Each Trial should reward a permanent improvement to the system it teaches.

## Maelstrom Voyages

Maelstrom Voyages replace Warp Drive. Charged compass needles open short mythic routes for a limited time. The player can attempt repeatedly during the window and earn partial rewards if they fail.

Voyage examples:

- The Glass Current: cartography essence and lane speed.
- The Whale Road: monster rewards, harpoon upgrades.
- The Bell Reef: ward, shrine, and relic upgrades.
- The Midnight Gyre: curse and storm power upgrades.
- The Crownless Channel: reputation, bounty, and fleet unlocks.

## Legendary Crew

Crew should arrive after the player understands ship, craft, relic, and outpost layers.

Roles:

- The Shot-Witch: cannon damage, fire rate, weapon milestones.
- The Blind Chart: bearing momentum, lane speed, maelstrom navigation.
- The Rope-Father: hull, repairs, crew efficiency.
- The Ship's Articles: salvage, automation, loadouts (the Quartermaster role).
- The Drowned Voice: relics, wards, curses, constellation unlocks.
- The Knife and Kettle: crew XP, offline stamina, recovery.
- The Cargo-Ghost: doubloons, rare loot, market conversion.
- The Port Tongue: reputation, bounty contracts, harbor bonuses.

Crew should be rehired or "retold" with a catch-up bonus based on their best prior legend level. This preserves the prestige feel while avoiding punishment.

## Bounty and Infamy

Bounty is the game's core identity mechanic and the missing piece from earlier drafts. It gives the game's title its meaning.

### Infamy

The player ship accumulates Infamy as it pushes into deeper waters. Infamy is a permanent rising number — it does not reset on Return to Port. It represents how notorious the captain has become across the Saltglass Expanse.

Infamy increases from:
- Clearing lane bosses (especially named enemies).
- Completing Bounty Contracts.
- Reaching new best lanes.
- Defeating Crown Navy officers and privateers who were hunting the captain.

High Infamy has mechanical effects:
- Bounty Hunters appear as special enemies in lanes — harder than the lane average, but they carry large contract bounties.
- Harbor prices improve (the captain's reputation opens doors).
- Bounty Contract rewards scale with Infamy tier.
- Unlocks deeper contracts from more dangerous factions.

Infamy is also the prestige currency. When the player Returns to Port, their accumulated Infamy converts to Infamy Marks, which buy permanent upgrades, new ship options, and system unlocks. This ties the prestige loop directly to the game's identity: the captain's legend is what makes each new voyage stronger.

```
infamy_marks_gained = floor(current_infamy * 0.4)
infamy_marks are additive per prestige; infamy itself resets to a fraction (20%) after Return to Port
```

### Bounty Contracts

Contracts are named objectives that appear in a dedicated tab. They are not infinite — the player picks from a short list of available contracts, accepts one or two, and pursues them during the current run.

Contract anatomy:
- **Target**: a specific enemy, boss, family, or lane.
- **Objective**: kill X enemies, defeat Y boss, survive Z waves, reach lane N.
- **Reward**: doubloons, relic fragments, Infamy (large bonus), rare materials, or one-time permanent unlocks.
- **Expiry**: some contracts expire on Return to Port if incomplete. High-value contracts may persist one return.

Early contract examples:

| Contract | Target | Objective | Reward |
| --- | --- | --- | --- |
| Wanted: Ironclad Cutter | Ironclad family | Defeat 30 | Salvage boost + Infamy 20 |
| The Iron Tithe's Head | Lane 10 boss | Defeat the boss | Rare material + Infamy 50 |
| Relic Plunder | Any boss | Collect 15 relic fragments | Relic Compass slot unlock |
| Admiral Vey's Colors | Crown Navy boss | Defeat the Admiral | Doubloon jackpot + Infamy 80 |
| Dead Reckoning | Storm belt lane | Reach lane 12 without switching bearings | Bearing Mastery level |

### Wanted Bounties

In addition to player-accepted contracts, the world posts bounties on the player. As Infamy rises, named bounty hunters appear as bonus enemies in lanes. Killing a bounty hunter:
- Grants a large doubloon prize.
- Drops a trophy relic fragment with a unique slot affinity.
- Adds to Infamy.
- Increases the tier of the next bounty hunter sent (escalation loop).

The player is the bounty. The game's name is the answer to "what kind of bounty do you have? An unearned one — because you're just getting started."

### Faction Standing

Different factions post contracts and track the player's relationship separately:

- **The Freebooters Guild**: pays well, asks for enemy kills, no moral complications.
- **The Shattered Crown**: wants privateers and Hexed Corsairs eliminated; rewards legal harbor access.
- **The Drowned Courts**: occult faction; wants relic retrieval and monster hunts; pays in rare relics.
- **Independent Merchants**: wants safe passage contracts; pays in doubloons and rare cargo.

Faction standing persists through Return to Port (Voyage Permanent tier). It affects contract availability and harbor prices. Players who favor one faction may find enemies from other factions more aggressive.

## UI Tone

USI is a dense utility UI. This project should also be functional-first, but the skin should sell captaincy.

Recommended interface frame:

- Left or top: main tabs as ship ledger sections.
- Center: animated sea lane with ship, enemies, wave, and boss progress.
- Right: current lane data, loot rates, enemy counters, and next unlock hint.
- Bottom: resource strip with clear rates and offline summary.
- Tooltips: every multiplier should show source breakdown.

Visual language:

- Naval ink, oxidized copper, storm teal, signal red, moonlit silver, parchment only as an accent.
- Avoid a one-note brown/tan pirate UI.
- Icons should look like map marks, knots, tools, relic silhouettes, flags, and ship fittings.

## Originality Guardrails

Do not use:

- One Piece names, terms, factions, fruit terminology, character archetypes, or bounty poster styling too closely.
- USI system names unless used in research docs.
- One-to-one numeric tables from USI.

Do use:

- Shared genre patterns: prestige, automation, offline gains, crafting, equipment, research, side gauntlets.
- Original nautical language and lore.
- Systems that answer pirate fantasy questions: Where are we sailing? What did we salvage? Who is aboard? Which port remembers us? What cursed thing did we awaken?

