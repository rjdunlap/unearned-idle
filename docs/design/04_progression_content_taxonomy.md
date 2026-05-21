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

| Resource | Source | Primary use |
| --- | --- | --- |
| Salvage | Defeated ships, wreckage clicks, salvage nets | Arsenal upgrades |
| Doubloons | Prizes, trade lanes, bounties | Harbor services, crew, market upgrades |
| Ether Brine | Cursed enemies, storm lanes | Stormheart fuel |
| Charts | Lane progress, scouts, cartography | Chartwork power and route unlocks |
| Lore | ruins, spirits, bosses | Research branches |
| Relic Fragments | enemy drops by lane | Relic Compass resonance |
| Craft Materials | Artificing recipes | Modules and recipe mastery |
| Haven Materials | Hidden Haven production | Grid slots, buildings, prestige bonuses |

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

| Lane / milestone | Unlock | What changes |
| --- | --- | --- |
| 1 | Sea Lane, Salvage, Arsenal | Core auto-combat and upgrades |
| 2 | Artificing | Crafting starts, first module |
| 3 | Relic Compass | Relic drops and resonance |
| 5 | Stormheart Furnace | Ether brine becomes boost fuel |
| 7 | Cartography and Lore | Permanent research branches |
| 10 | Arsenal Milestones | Upgrade choices on weapons/hull |
| 13 | Hidden Haven 1 | Grid building and prestige bonus |
| 18 | Trials | System-focused challenge runs |
| 22 | Maelstrom Voyages | Charged side gauntlets |
| 30 | First Return to Port target | Prestige with preserved discoveries |
| 35 | Second ship hull | New loadout identity |
| 45 | Crew teaser | First recruitable officer |
| 50 | Legendary Crew | Crew XP/rank layer fully opens |
| 60+ | Second Haven, deeper trials | Midgame expansion |
| 75+ | Grand Expedition prep | Second reset layer setup |

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

## Chartwork Bars

| Bar | Effect | Notes |
| --- | --- | --- |
| Gunnery Solution | damage multiplier | first damage focus |
| Hull Discipline | hull and ward multiplier | defense focus |
| Sail Trim | lane traversal speed | improves sector-like speed |
| Boarding Drills | crew XP and prize loot | better after crew unlock |
| Powder Economy | salvage efficiency and fire rate | midgame efficiency |
| Signal Flags | fleet support and automation | late unlock |

Possible compute-like formula:

```text
bar_progress_per_second = chart_power * chart_speed * allocation_percent
levels_gained = floor(progress / threshold)
effect = 1 + (levels ^ exponent) * coefficient
```

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
| Cartographer's Bone | chart speed and lane data | blue: chartwork, gold: rare drops |

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

Resets:

- Current lane progress.
- Run resources.
- Arsenal upgrade levels.
- Active modules.
- Stormheart loaded fuel and power.
- Some crew assignment state, later.

Persists:

- Best lane.
- Research nodes/progress.
- Recipe levels and infinite recipes.
- Relic library and resonance.
- Haven buildings, slots, and one-time upgrades.
- Quartermaster automation.
- Captain reputation or bounty tier.

Rewards:

- Infamy Marks based on best lane, bosses beaten, trials, and bounty value.
- New ship hull options.
- Permanent global multipliers.
- More automation and loadouts.
- Access to deeper lanes.

Preview must show:

- What will reset.
- What will be gained.
- What will unlock.
- Estimated time to recover previous best lane.

## Automation: Quartermaster Logbook

| Upgrade | Effect | Suggested unlock |
| --- | --- | --- |
| Auto Advance | automatically sails to next lane | very early |
| Arsenal Auto Buy | buys selected upgrades | after first Return |
| Chartwork Optimize | distributes chart focus | after Chartwork |
| Research Auto Select | starts next selected research | after research |
| Smart Craft | auto-crafts recipe dependencies | after Artificing |
| Relic Auto Merge | merges relic fragments | after Relic Compass |
| Stormheart Manager | sets boosts based on positive power | after Furnace |
| Haven Auto Build | buys selected building upgrades | after Haven |
| Loadout Slot | saves Arsenal/Relic/Boost setups | early prestige reward |
| Offline Cap Increase | increases maximum offline time | achievement/QoL |

## Early MVP Content Set

Minimum viable content for lanes 1-30:

- 30 Sea Lanes.
- 6 enemy families.
- 10 enemy variants.
- 6 weapons.
- 4 defenses.
- 6 fittings.
- 12 Artificing recipes.
- 10 modules.
- 10 relics.
- 24 research nodes across 4 branches.
- 1 Haven grid with 8 building types.
- 3 Trials.
- 3 Maelstrom Voyages.
- 12 automation upgrades.

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

