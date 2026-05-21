# Progression and Content Taxonomy

This document proposes names, resources, unlocks, and early balance structures for a pirate unfolding idle game. It is intended as handoff scaffolding, not final canon.

## Resource Persistence Tiers

| Tier | Meaning | Example resources |
| --- | --- | --- |
| Run | Resets on Return to Port | Salvage, ether brine in tank, current storm power, temporary cargo |
| Voyage permanent | Persists through Return to Port | Recipe levels, research, relic resonance, haven slots, reputation |
| Charter permanent | Persists through Grand Expedition | Captain legacy, grand charts, fleet artifacts |
| Account/QoL | Should almost never reset | achievements, cosmetics, accessibility, automation unlocks |

## Early Resources

Resources are introduced strictly in this order. Do not show a resource to the player before its unlock lane.

| Resource | Introduced | Source | Primary use |
| --- | --- | --- | --- |
| Salvage | Lane 1 | Defeated ships, salvage nets | Arsenal upgrades |
| Doubloons | Lane 1 boss | Boss prizes, trade lanes, contracts | Harbor services, crew, Infamy rewards |
| Craft Materials | Lane 2 (Artificing) | Generic enemy drops | Artificing recipes and modules |
| Relic Fragments | Lane 3 (Relic Compass) | Reef Beasts and Hexed Corsairs only | Relic Compass resonance |
| Charts | Lane 7 (Cartography) | Lane progress, storm lanes, lore events | Cartography research nodes |
| Infamy | Lane 6 (first contract) | Contracts, bosses, bounty hunters | Prestige currency (Infamy Marks) |

Resources deferred to post-MVP:

| Resource | When | Purpose |
| --- | --- | --- |
| Ether Brine | Post-MVP (Stormheart) | Furnace fuel |
| Haven Materials | Post-MVP (Haven) | Haven grid construction |
| Grand Charts | Post-Grand Expedition | Second prestige currency |

Note: Lore is no longer a separate resource. Boss kills and ruin encounters trigger a "Lore event" that grants a large batch of Charts and a flavor text entry, making lore feel like a memorable moment rather than a routine drop.

## Enemy Families

| Family | Defense profile | Counters | Rewards |
| --- | --- | --- | --- |
| Privateers | balanced hull and armor | broadsides, boarding | salvage, doubloons |
| Ironclads | high armor | harpoons, firepots, armor pierce | salvage, haven materials |
| Hexed Corsairs | high ward | relic damage, occult modules | ether brine, lore |
| Reef Beasts | high hull, monster tag | harpoons, crew tactics | ether brine, relic fragments |
| Smugglers | evasive/sail layer | chainshot, speed, targeting | doubloons, rare materials |
| Crown Navy | mixed defenses, bosses | balanced loadouts | bounty, reputation |
| Drowned Fleet | regenerating ward/hull | fire, wards, storm boosts | lore, relics |

## Damage Types

| Damage type | Strong against | Weak against | Flavor |
| --- | --- | --- | --- |
| Cannon | hull, general ships | heavy armor | classic broadside |
| Chain | sails/evasion | warded spirits | control and speed counter |
| Harpoon | armor, monsters | swarms | precision and beast hunting |
| Fire | wood, regeneration | storm enemies | damage over time |
| Occult | wards, spirits | mundane hull early | relic/curse output |
| Boarding | prize value, crew XP | monsters, storms | crew-led close combat |

## System Unlock Table

MVP lanes are marked **[MVP]**. Post-MVP lanes are marked [post].

| Lane / milestone | Unlock | What changes |
| --- | --- | --- |
| 1 | Sea Lane, Salvage, Arsenal | Core auto-combat and upgrades **[MVP]** |
| 2 | Artificing | Crafting starts, first module **[MVP]** |
| 3 | Relic Compass | Relic drops, resonance, constellation previews **[MVP]** |
| 5 | Ship's Bearing | Operational stances, momentum buildup **[MVP]** |
| 6 | Bounty Contracts | First contract, Infamy counter, faction tabs **[MVP]** |
| 7 | Cartography | Permanent chart research (1 branch in MVP) **[MVP]** |
| 10 | Arsenal Milestones | Upgrade choices on weapons/hull **[MVP]** |
| ~15-20 | First Return to Port | Prestige with Infamy Marks, new unlocks **[MVP]** |
| Post-first-prestige | 3 new Cartography branches | Research tree expands |
| Post-MVP | Stormheart Furnace | Ether brine becomes boost fuel [post] |
| Post-MVP | Hidden Haven 1 | Grid building and prestige bonus [post] |
| 18 | Trials | System-focused challenge runs [post] |
| 22 | Maelstrom Voyages | Charged side gauntlets [post] |
| 35 | Second ship hull | New loadout identity [post] |
| 45 | Crew teaser | First recruitable officer (The Rope-Father) [post] |
| 50 | Legendary Crew | Full crew XP/rank layer [post] |
| 60+ | Second Haven, deeper trials | Midgame expansion [post] |
| 75+ | Grand Expedition prep | Second reset layer setup [post] |

## Ship Arsenal Content

### Weapons

| Weapon | Role | Milestone ideas |
| --- | --- | --- |
| Long Nine Cannons | steady single-target cannon damage | range, fire rate, hull breach |
| Deck Carronades | short-range burst | close-range bonus, boarding synergy |
| Chainshot Rack | anti-sail and anti-evasion | slow, target priority, speed loot |
| Harpoon Battery | armor and monsters | armor pierce, bleed, beast bounty |
| Firepot Mortar | swarms and regeneration | burn duration, spread, anti-repair |
| Shrine Lantern | occult ward damage | spirit reveal, ward pierce, lore gain |

### Defense

| Defense | Role | Milestone ideas |
| --- | --- | --- |
| Ironwood Hull | physical durability | armor, repair rate, ram resistance |
| Saltward Plating | magical ward | ward max, ward regen, curse reduction |
| Nimble Rigging | evasion and speed | dodge, lane speed, storm control |
| Bulkhead Maze | survival vs bursts | damage smoothing, emergency retreat |

### Utility Fittings

| Fitting | Role |
| --- | --- |
| Salvage Nets | more salvage and wreckage collection |
| Crow's Nest Glass | targeting, enemy data, lane preview |
| Boarding Hooks | crew XP and prize loot |
| Smuggler Hold | doubloon and rare cargo bonuses |
| Shrine Bell | ward, lore, spirit encounter bonuses |
| Cartographer's Table | charts, lane speed, research density |

## Ship's Bearing Stances

| Bearing | Primary effect | Secondary effect | Momentum bonus |
| --- | --- | --- | --- |
| Hunter | +30% damage | -10% lane speed | Each 60s held: +2% more damage, stacking to +60% cap |
| Iron | +25% hull and ward | -20% damage | Each 60s held: +3% more defense, stacking to +75% cap |
| Scout | +30% lane speed, +15% chart gain | -15% damage | Each 60s held: +2% more speed, stacking to +50% cap |
| Salvage | +40% salvage from kills, +20% relic drop chance | -25% damage | Each 60s held: +3% more salvage, stacking to +90% cap |

Momentum formula:

```text
momentum_stacks = floor(time_in_bearing_seconds / 60)
momentum_stacks = clamp(momentum_stacks, 0, momentum_cap)
bearing_bonus = base_effect * (1 + momentum_stacks * stack_rate)
```

Switching bearing resets momentum_stacks to 0.

Mastery levels (purchased from Infamy Tree) raise the momentum cap and the stack rate independently, so players can specialize in a preferred bearing or generalize.

Late unlock — Second Bearing Slot:
- Runs two bearings simultaneously.
- Each bearing builds momentum at 60% of normal rate.
- Combined effect is slightly less than the sum of two full bearings (cap is reduced).
- Makes the system more complex without invalidating single-bearing play.

## Artificing Recipes

| Tier | Recipe | Inputs | Unlocks |
| --- | --- | --- | --- |
| T1 | Refined Timber | salvage | Hull Warding module |
| T1 | Brass Gear | salvage | Broadside Efficiency module |
| T1 | Sailcloth Sigil | salvage + charts | Sail Trim module |
| T2 | Powder Core | Brass Gear | Auto-Harpoon Rig |
| T2 | Stormglass Lens | Ether Brine + Brass Gear | Relic Lens |
| T3 | Moon Coral Inlay | Stormglass + Lore | Cartographer's Lamp |
| T3 | Siren Wire | Moon Coral + Relic Fragments | Crew Tonic |
| T4 | Blackwake Alloy | rare salvage + occult lore | Combat Chant |
| T4 | Saintmetal Rivet | Blackwake + Haven Materials | Haven Ledger |

Recipe level goals:

- Leveling recipes reduces time and input cost.
- Specific levels unlock modules or new recipes.
- Max level converts a recipe into infinite passive production or auto-restored module tiers.

## Module Catalog

| Module | Effect | Works offline? |
| --- | --- | --- |
| Broadside Efficiency | damage multiplier | yes |
| Hull Warding | hull/ward multiplier | yes |
| Salvage Nets | salvage gain | yes |
| Ether Condenser | ether brine gain | yes |
| Auto-Harpoon Rig | automatically fires harpoon ability | maybe no until upgraded |
| Relic Lens | relic drop chance/resonance | yes |
| Cartographer's Lamp | research/lore gain | yes |
| Outpost Ledger | haven production | yes |
| Combat Chant | damage and defense | yes |
| Maelstrom Anchor | maelstrom needle charge | yes |
| Wreck Lure | faster wave spawning | active only at first |
| Prize Clerk | doubloon and bounty bonus | yes |

## Relic Compass Structure

Initial slots:

- Red slot: combat effects.
- Gold slot: flexible economy effects.

Later slots:

- Pink: occult/curse.
- Blue: chart/research.
- Green: crew/haven.

Starter relics:

| Relic | Base effect | Slot effects |
| --- | --- | --- |
| Kraken Tooth | damage and monster damage | red: fire rate, gold: salvage |
| Saint's Coin | doubloons and trade | gold: all income, blue: research |
| Stormglass Eye | ether and storm power | pink: ward damage, blue: maelstrom charge |
| Wreck-King's Nail | hull and armor pierce | red: harpoon, green: boarding |
| Siren Thread | crew XP and lure | green: crew, pink: occult |
| Cartographer's Bone | chart speed and lane data | blue: cartography research, gold: rare drops |

Resonance rule:

```text
relic_effect = tier_floor + (tier_ceiling - tier_floor) * (resonance / resonance_max) ^ 0.65
```

This gives early duplicates visible value and later duplicates slower completion.

## Stormheart Boosts

| Boost | Effect | Use case |
| --- | --- | --- |
| Thunder Broadside | damage | pushing lanes |
| Saltward Bloom | hull/ward | surviving bosses |
| Fair Wind | lane speed | farming and return runs |
| Deep Salvage | salvage and relic drops | farming |
| Lantern Wake | lore and charts | research focus |
| Maelstrom Anchor | needle charge | side-voyage focus |

Generation:

```text
storm_power_per_second = ether_loaded * furnace_efficiency
boost_drain = base_drain * boost_level_scale * over_limit_penalty
```

## Infamy and Bounty Contracts

### Infamy

Infamy is a rising permanent number. It does not fully reset on Return to Port — 20% carries forward. It accumulates from:

| Source | Infamy gained |
| --- | --- |
| Defeating a lane boss for the first time | 30 |
| Each repeat lane boss kill | 5 |
| Completing a Bounty Contract | 20-80 (by tier) |
| Killing a Wanted bounty hunter | 15 |
| Reaching a new best lane | 10 per lane beyond previous best |
| Surviving a Stormwall push | 25 |

Infamy Marks at prestige:

```
infamy_marks_gained = floor(current_run_infamy * 0.4)
```

Marks are permanent and accumulate across all prestiges. They are spent on the Infamy Tree — a permanent upgrade web separate from run upgrades.

### Infamy Tree (MVP nodes)

| Node | Cost (marks) | Effect |
| --- | --- | --- |
| Notorious Captain | 10 | +10% doubloon prizes from all enemies |
| Relic Hunter | 15 | Second relic slot unlocked |
| Three-Branch Chart | 20 | Unlocks Occult Lore and Natural Philosophy research branches |
| The Persistent Contract | 25 | One active contract survives Return to Port |
| Iron Reputation | 30 | +15% hull permanently |
| Bearing Master I | 35 | All bearing momentum builds 20% faster |
| Fearsome Colors | 40 | Bounty hunters appear more often, rewards increased |
| Fourth Contract Slot | 50 | Unlocks a fourth active contract slot |

### Bounty Contract Tiers

Contracts are tiered by difficulty and Infamy requirement to unlock.

| Tier | Infamy required | Reward magnitude | Example |
| --- | --- | --- | --- |
| 1 — Open Waters | 0 | Minor: salvage, doubloons, 20 Infamy | Kill 20 Privateers |
| 2 — Dangerous Crossing | 30 | Moderate: relic fragments, 40 Infamy | Defeat The Iron Tithe |
| 3 — Wanted | 80 | Major: rare materials, 60 Infamy, 1 constellation unlock | Hunt Admiral Vey of the Pale Flag |
| 4 — Cursed Bounty | 200 | Large: permanent node, 80 Infamy, faction standing | The Drowned Courts' Retrieval |

### Contract Catalog (MVP, Lanes 1-20)

| Contract | Tier | Faction | Objective | Primary reward |
| --- | --- | --- | --- | --- |
| Ironclad Clearance | 1 | Freebooters Guild | Kill 30 Ironclad Cutters | 500 salvage, 20 Infamy |
| Prize Day | 1 | Independent Merchants | Collect 200 doubloons in one run | Doubloon rate +5% (run) |
| First Blood | 1 | Freebooters Guild | Defeat any lane boss | Relic fragment ×5, 20 Infamy |
| Hex Hunt | 1 | Shattered Crown | Kill 20 Hexed Corsairs | Ether Brine preview ×10, 25 Infamy |
| The Iron Tithe | 2 | Shattered Crown | Defeat lane 10 boss | Rare craft material, 40 Infamy |
| Reef Beast Trophies | 2 | Drowned Courts | Kill 15 Reef Beasts | Relic fragment ×10, resonance bonus, 35 Infamy |
| Relic Recovery | 2 | Drowned Courts | Fill one relic to 80% resonance | Constellation unlock preview, 40 Infamy |
| Admiral Vey's Colors | 3 | Shattered Crown | Defeat Admiral Vey | Doubloon jackpot, constellation unlock, 60 Infamy |
| The Bell-Reef Saint | 3 | Drowned Courts | Defeat the Bell Reef boss | Permanent ward +10%, 65 Infamy |
| Dead Reckoning | 3 | Freebooters Guild | Reach lane 15 without switching bearing | Bearing Mastery level, 55 Infamy |

### Wanted Bounty Hunters

After the player completes their first contract, bounty hunters begin appearing. A hunter is a special enemy that replaces a random enemy in a wave.

| Hunter name | Appears when | Stats | Trophy relic drop |
| --- | --- | --- | --- |
| Scatterwick | Infamy 20+ | +50% hull vs lane average | Scatterwick's Flintlock (red slot, fire rate) |
| The Pale Creditor | Infamy 50+ | High armor, self-repair | Creditor's Ledger (gold slot, doubloons) |
| Mother Mast | Infamy 100+ | High ward, occult attacks | Mast-Bone (pink slot, ward pierce) |
| The Iron Collector | Infamy 200+ | All defenses elevated | Collector's Spike (red slot, armor pierce) |

Each hunter killed increases the Infamy total and triggers the next-tier hunter eventually. The escalation creates a soft prestige pressure — the player can keep hunting to build Infamy, but hunters get harder over time.

## Research Branches

| Branch | Theme | Example nodes |
| --- | --- | --- |
| Cartography | maps, routes, speed | lane speed, auto-navigate, maelstrom routes |
| Natural Philosophy | materials and craft | artificing speed, salvage, recipe XP |
| Occult Lore | relics and storms | ward power, relic drops, stormheart max |
| Reputation | social/bounty | doubloons, crew XP, harbor discounts |

Lane density examples:

- Trade Route: Reputation 1.4, Cartography 1.0, Natural 0.8, Occult 0.3.
- Ruined Atoll: Occult 1.5, Natural 1.0, Cartography 0.6, Reputation 0.4.
- Storm Belt: Cartography 1.3, Occult 1.2, Natural 0.7, Reputation 0.2.
- Ship Graveyard: Natural 1.4, Occult 0.9, Reputation 0.6, Cartography 0.5.

## Hidden Haven Buildings

| Building | Produces | Adjacency |
| --- | --- | --- |
| Dock | planks/components | boosts Drydock and Market |
| Tavern | crew XP/reputation | boosts Smuggler Den and Quartermaster |
| Shrine | ward/lore | boosts Lighthouse and Relic Vault |
| Market | doubloons | boosts Dock and Smuggler Den |
| Lighthouse | lane speed/charts | boosts Shrine and Watchtower |
| Drydock | ship components | boosts Dock, unlocks ship upgrades |
| Smuggler Den | rare drops | boosts Market, hurts Crown reputation if used |
| Watchtower | enemy data | boosts Lighthouse, unlocks automation |
| Relic Vault | relic resonance | boosts Shrine, stores fragments |

Grid rule seed:

- Start with 3x3 grid, 4 locked slots.
- Slot purchases become available after Return to Port.
- Components convert to a prestige-applied multiplier.
- One-time upgrades unlock systems or automation.

## Prestige: Return to Port

### What Resets

- Current lane progress.
- Run resources (salvage, doubloons, craft materials, relic fragments).
- Arsenal upgrade levels.
- Active Artificing modules (recipe levels persist).
- Active Bounty Contracts (except the "Persistent Contract" Infamy Tree node).
- Current Infamy (80% is consumed; 20% carries forward).

### What Persists

- Best lane reached (displayed on prestige preview).
- Cartography research nodes and progress.
- Recipe mastery levels and infinite recipes.
- Relic library, resonance values, and discovered constellations.
- Faction standing.
- Haven buildings, slots, and one-time unlocks (post-MVP).
- All Infamy Tree node purchases (permanent).
- Quartermaster automation purchases.

### Prestige Currency and Rewards

Infamy Marks are the prestige currency. They are earned on Return to Port:

```
infamy_marks_gained = floor(current_run_infamy * 0.4)
```

Marks accumulate permanently and are spent in the Infamy Tree. The tree contains:
- Permanent combat multipliers.
- New relic slots.
- New research branches.
- Additional contract slots.
- Bearing mastery levels.
- New ship hull options (post-MVP).
- Access to deeper lane tiers.

### Prestige Preview Screen

Must show:
- What will reset (bullet list with icons).
- What will persist (bullet list).
- Infamy Marks to be gained from this return.
- Which Infamy Tree nodes are now affordable.
- Estimated time to recover previous best lane (calculated from current run speed).
- Any new content that unlocks for the first time after this return.

## Automation: Quartermaster Logbook

Automation unlocks are ordered deliberately. A player should manually perform an action many times before it can be automated. Never automate a system the player has not yet mastered.

| Upgrade | Effect | Suggested unlock | Priority |
| --- | --- | --- | --- |
| Auto Advance | Automatically sails to next lane when clear | First prestige reward (free) | 1 — highest |
| Loadout Slot | Saves Arsenal and Relic Compass configuration | First prestige reward | 2 |
| Research Auto Select | Queues next Cartography node automatically | After Cartography + second prestige | 3 |
| Relic Auto Merge | Merges relic fragments toward selected relic | After Relic Compass is established | 4 |
| Bearing Auto-Hold | Locks bearing during specific situations (boss wave, farming lane) | After Bearing is well understood | 5 |
| Arsenal Auto Buy | Purchases cheapest unlocked Arsenal upgrade | After second or third prestige | 6 |
| Smart Craft | Auto-crafts recipe dependencies when materials allow | After player has crafted 10+ times | 7 |
| Contract Auto-Refresh | Replaces expired contracts without opening the tab | After Contracts tab is familiar | 8 |
| Stormheart Manager | Sets furnace patterns based on positive power | After Stormheart (post-MVP) | 9 |
| Haven Auto Build | Purchases queued Haven building upgrades | After Haven (post-MVP) | 10 |
| Offline Cap Increase | Increases maximum offline calculation window | Achievement / QoL reward | Any |

## Early MVP Content Set

Minimum viable content for lanes 1-20 (revised MVP scope):

- 20 Sea Lanes.
- 4 enemy families (Privateers, Ironclads, Hexed Corsairs, Reef Beasts).
- 8 enemy variants (2 per family).
- 4 weapons (Long Nine Cannons, Harpoon Battery, Firepot Mortar, Shrine Lantern).
- 3 defenses (Ironwood Hull, Saltward Plating, Nimble Rigging).
- 2 fittings (Salvage Nets, Crow's Nest Glass).
- 4 bearing stances (Hunter, Iron, Scout, Salvage).
- 5 Artificing recipes (Refined Timber, Brass Gear, Sailcloth Sigil, Powder Core, Stormglass Lens).
- 4 modules (Hull Warding, Broadside Efficiency, Salvage Nets, Relic Lens).
- 6 relics (Kraken Tooth, Saint's Coin, Stormglass Eye, Wreck-King's Nail, Siren Thread, Cartographer's Bone).
- 6 constellations (one per relic pair with natural affinity).
- 10 Cartography research nodes (1 branch).
- 10 Bounty Contracts (across tiers 1-3, 4 factions).
- 4 Wanted bounty hunters.
- 2 automation upgrades in MVP (auto-advance, loadout slot).
- Infamy Tree: 8 nodes for MVP.

Content deferred to post-MVP:
- Trials (design now, build later).
- Maelstrom Voyages.
- 3 additional Cartography branches.
- Full Haven grid and buildings.
- Stormheart Furnace.
- Remaining 6 automation upgrades.

This is enough to test the structure without attempting USI-scale content.

## Naming Tone Bank

Sea regions:

- The Saltglass Expanse.
- Widow's Meridian.
- The Bell Reef.
- The Crownless Channel.
- Saint Orra's Wake.
- The Blackwake Gyre.
- Lanternfall Atoll.
- The Drowned Trade.

Bosses:

- The Iron Tithe.
- Admiral Vey of the Pale Flag.
- Mother Undertow.
- The Bell-Reef Saint.
- The Crown's Leviathan.
- The Wreck-King.

Currencies and permanent marks:

- Infamy Marks.
- Grand Charts.
- Stormglass.
- Saintmetal.
- Relic Echoes.
- Captain's Writ.

Flavor should be evocative, but mechanic names should remain clear in buttons and tooltips.

