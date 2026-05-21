# Worldbuilding Mechanics Synthesis

Date: 2026-05-21

This doc translates the user-provided faction, region, relic, boss, and exploration brainstorm into implementation-friendly design guidance for Unearned Bounty.

## North Star

Unearned Bounty should feel like a bizarre mystical Age of Exploration where every new sea changes:

- what enemies look like
- how enemy projectiles behave
- what hazards shape the combat space
- what upgrades matter
- what the Captain's Desk can decode, unlock, or manipulate

The genre blend is:

- Bullet Heaven readability and build expression.
- Unfolding idle pacing and persistent progression.
- Pirate broadside fantasy.
- Mystical charting/exploration instead of generic skill trees.

## Faction Roles

Each faction should own a clear combat verb.

| Faction | Combat Verb | Player Lesson | Counter Direction |
| --- | --- | --- | --- |
| Alabaster Armada | formations and synchronized volleys | armor and formation pressure require focused damage and shield breaking | piercing, armor break, formation disruption |
| Sun-Scale Ascendant | beast charges and solar beams | swarms and rams pressure positioning/defense | crowd control, wake disruption, wards |
| Rust-Lung Revellers | toxic area denial | staying still becomes dangerous | cleansing, wind/sail mobility, fire/explosion |
| Midas Mutineers | cursed gold and bullet-sponges | greed creates danger and resource temptation | ricochet control, coin magnet upgrades, anti-summon |

Implementation rule:

Do not introduce a faction unless it changes projectile pattern, movement, and reward behavior. Palette swaps are not enough.

## Region Roles

Each region should own a battlefield distortion.

| Region | Hazard Verb | Prototype Translation |
| --- | --- | --- |
| Boiling Canopy | erupt | warning circles, delayed geysers, damage both sides |
| Glass Wastes | refract | wind lanes, projectile reflection, chip damage unless oriented |
| Drowned Ziggurats | constrain | totem walls/laser grids that temporarily divide sea space |
| Maelstrom Of Skulls | pull | vortexes bend ships and projectiles |
| Sky-Tethered Shallows | suspend | anti-gravity bubbles slow and redirect projectiles |

Implementation rule:

Region hazards should affect enemies too. That creates tactical interest and lets the player feel clever rather than only punished.

## Relic Design Rules

Relics should transform the combat loop.

Good relic behavior:

- Replaces or reshapes a weapon pattern.
- Adds a new risk.
- Creates a build identity.
- Has a visible screen effect.
- Changes what the player wants from future upgrades.

Bad relic behavior:

- Flat +5% damage.
- Hidden passive with no combat tell.
- Stat bonus that could have been a normal upgrade.

The provided relics are strong because each has a tradeoff:

| Relic | Power | Tradeoff |
| --- | --- | --- |
| Eye Of The Sun-God | solar lasers and burning water | loses knockback |
| Gorgon's Anchor | petrifying aura | major speed loss |
| Bramble-Heart Wood | repair and vines | lower max hull |
| Phantom Wheel | phase dodge and nova | probabilistic defense |
| Leviathan's Pearl | tidal wave sweeps | replaces frontal cannons |
| Weeping Doubloon | double gold and magnet | chaotic ricochet bullets |

## Boss Design Rules

Mega-fauna bosses should be spectacle checks and build checks.

Bosses need:

- A memorable entrance.
- One clear vulnerability rule.
- One spatial attack that changes the battlefield.
- One reward that unlocks or transforms a system.

Examples:

| Boss | Build Check | Reward Direction |
| --- | --- | --- |
| Trench-Maw | flank damage / avoid frontal armor | armor-pierce relic or harpoon milestone |
| Storm-Bird Of The Deep | mobility and timing around lightning/waterspouts | storm ward, sail upgrade, lightning weapon |
| Abyssal Bloom | maze navigation and AoE control | vine relic, spore weapon, ward pulse |

Implementation rule:

The first boss in the prototype should not only be a large HP pool. It should teach one rule: armor needs harpoons, swarms need AoE, wards need occult damage, etc.

## Captain's Desk Systems

The strongest exploration mechanics are those that make meta progression feel like physical navigation tools.

### Astrolabe Array

Use for:

- Synergy discovery.
- Temporary expedition modifiers.
- Build planning.
- Late first-hour or early second-hour unlock.

UI feel:

- Concentric rings.
- Drag/rotate to align symbols.
- Shows discovered and undiscovered alignments.

### Fragmented Cartography

Use for:

- Region unlocks.
- Biome modifiers.
- Boss route discovery.
- Long-term collection.

UI feel:

- Map pieces on Captain's Desk.
- Completed coastline reveals new route.
- Optional hidden region fragments.

### Magnetic Currents

Use for:

- Route modifiers.
- Enemy faction manipulation.
- Passive idle resource routing.
- Hidden boss access.

UI feel:

- Lodestones placed into map nodes.
- Currents glow and reroute.
- Tooltip shows changed spawn/reward behavior.

## Prototype-Safe Order

Do not implement all of this at once. The right order is:

1. Establish open-sea combat readability.
2. Add faction tags and enemy counter tags.
3. Add Harpoon/armor interaction.
4. Add one region hazard.
5. Add one transformative relic.
6. Add one Captain's Desk exploration system.

Recommended first slice:

- Faction: Rust-Lung Revellers or Alabaster Armada.
- Region hazard: Boiling Canopy geysers, because warning circle -> eruption is simple and readable.
- Boss: Trench-Maw, because armor/flank rules connect naturally to Harpoon.
- Relic: Bramble-Heart Wood or Phantom Wheel, because both are visually expressive but not too UI-heavy.
- Desk system: Fragmented Cartography, because map pieces are intuitive and pirate-native.

## Naming And Sensitivity Notes

The `Sun-Scale Ascendant` should be treated as a fictional solar-maritime civilization, not a direct analogue for any real-world Indigenous group. Use invented language, invented material culture, and internally consistent symbols. Avoid using real sacred imagery, real ethnic identifiers, or a generic "ancient native" framing.

Safer direction:

- Solar reef empire.
- Beast-bonded mariners.
- Obsidian, jade-like fictional stone, sun-crystal technology.
- Feathered silhouettes can be abstracted into sails, crests, fins, or flags rather than copied ceremonial dress.

## Immediate Backlog Additions

Add to future implementation candidates:

1. Replace wave strip with `At the Horizon` threat preview.
2. Add faction identity field to enemy definitions.
3. Add combat tags: armor, swarm, toxic, formation, cursed, beast, warded.
4. Add one enemy behavior per tag before adding more factions.
5. Add visual reward drops for Salvage and Doubloons.
6. Add first Doubloon sink.
7. Add Harpoon unlock before armor-heavy encounters.
8. Add environmental hazard framework.
9. Add first relic slot and one transformative relic.
10. Add map-piece drop as a boss reward.

## Useful Questions For Next Design Pass

- Which faction should appear first after Privateers?
- Should Alabaster Armada or Rust-Lung Revellers be the first strong contrast faction?
- Is Harpoon a weapon swap, a second weapon, or a weapon slot unlock?
- Are relics run-limited expedition rewards or permanent equipped artifacts?
- Should region hazards begin as purely visual warnings before they become mechanical?
- How much active control should Captain Orders add before the game stops feeling idle?
