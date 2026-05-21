# MVP and Technical Plan

This plan assumes a Godot project, but the repository did not contain Godot files at research time. It is written for the next agent who starts implementation.

## Prototype Goal

Build a playable vertical slice of a mystical pirate unfolding idle game with enough systems to test whether the USI-like structure works in the Unearned Bounty theme.

The prototype should prove:

- Auto-combat through Sea Lanes is satisfying to watch and inspect.
- Ship build choices matter against enemy defenses.
- At least three long-term systems feed combat from different angles.
- Return to Port prestige feels beneficial, not punitive.
- Offline progress and automation can be trusted.

## Recommended MVP Scope

MVP lane range: 1-30.

MVP systems:

- Sea Lane combat.
- Ship Arsenal upgrades.
- Chartwork allocation.
- Artificing recipes and modules.
- Relic Compass shards and resonance.
- Stormheart Furnace boosts.
- Cartography and Lore research.
- First Hidden Haven grid.
- First Return to Port prestige.
- Basic Quartermaster automation.
- Save/load and offline gains.

Out of MVP:

- Full crew system.
- Grand Expedition second prestige.
- Armada Campaigns.
- Large maelstrom trees.
- Monetization.
- Mobile-specific layout, unless mobile is the main launch target.

## Development Phases

### Phase 0: Project Foundation

Create the Godot project and data model before UI polish.

Core tasks:

- Create deterministic simulation loop independent of frame rate.
- Create save/load format with versioning.
- Add offline progress calculation.
- Add large-number formatting.
- Add data-driven definitions for resources, lanes, enemies, upgrades, recipes, relics, and research.
- Build a simple debug panel for changing lane, adding resources, and simulating offline time.

Suggested Godot shape:

- `autoload/GameState.gd`: current mutable state and save data.
- `autoload/Sim.gd`: fixed-step simulation and offline catch-up.
- `autoload/Balance.gd`: formulas and helper math.
- `resources/definitions/*.tres` or JSON: static definitions.
- `scenes/ui/Main.tscn`: main dashboard shell.
- `scenes/combat/SeaLaneView.tscn`: ship, enemies, wave, and boss display.

### Phase 1: Combat Heartbeat

Build the visible loop first.

Features:

- Player ship with current hull, ward, speed, and weapons.
- Enemy waves with hull, armor, ward, and sail/evasion values.
- Boss at end of lane.
- Lane distance/progress and auto-advance toggle.
- Salvage and doubloon drops.
- Basic Arsenal upgrades using salvage.
- Enemy counter display: "Armor high, use Harpoons" style diagnostics.

Success criteria:

- The player can idle in Lane 1, buy upgrades, clear Lane 1, and push several lanes.
- Combat state can be saved and restored.
- The next useful upgrade is obvious.

### Phase 2: First Unfolding Systems

Add the layers that make it more than an upgrade clicker.

Features:

- Chartwork bars: Gunnery, Hull Discipline, Sail Trim, Boarding Drills.
- Artificing with 4-6 starter recipes and 3-4 active modules.
- Relic Compass with 2 slot colors and 4 starter relics.
- Stormheart Furnace with ether brine generation and 2-3 boosts.
- Cartography and Lore with 3 branches and lane density values.

Success criteria:

- Players can choose different focus strategies.
- Drops have multiple uses.
- Tooltips show how each system contributes to damage, defense, and income.

### Phase 3: Prestige and Haven

Add the first reset loop.

Features:

- Hidden Haven grid with a few building types.
- Return to Port prestige.
- Preserve recipe levels, research, relic library/resonance, haven progress, and captain reputation.
- Reset salvage, current lane, ship core levels, active modules, and storm power.
- Unlock new ship loadout options or permanent multipliers after return.
- Add a prestige preview before confirming.

Success criteria:

- Return to Port makes the next run clearly faster.
- The player can inspect what resets and what persists.
- Prestige unlocks at least one new choice, not only a bigger multiplier.

### Phase 4: Automation and Usability

Features:

- Quartermaster upgrades: auto-advance, auto-upgrade cheapest Arsenal, auto-collect salvage, auto-select research, auto-optimize Chartwork.
- Loadout slots for Arsenal and Relic Compass.
- Offline summary window.
- "Missing multipliers" diagnostic panel.
- Next unlock tracker.

Success criteria:

- Repeating early lanes after Return to Port takes much less babysitting.
- The player can understand why progress slowed.

## Data-Driven Content

Do not hard-code individual upgrades into UI scripts. Use definitions.

Suggested definition tables:

- `resources`: id, display name, icon, color, persistence tier.
- `lanes`: id, name, distance, enemy table, boss id, research density, unlocks.
- `enemies`: id, family, hull, armor, ward, evasion, reward multipliers, tags.
- `weapons`: id, damage type, fire rate, target priority, milestone list.
- `arsenal_upgrades`: id, target, cost resource, base cost, cost scale, effect id.
- `chart_bars`: id, effect, exponent, cap, unlock lane.
- `recipes`: id, input resources, time, xp curve, unlocks, infinite level.
- `modules`: id, required recipe, slot cost, effect, tier rules.
- `relics`: id, slot affinities, resonance max, effects, drop lanes.
- `research`: branch, node, cost, effect, prerequisites.
- `haven_buildings`: id, footprint, production, adjacency effects, component output.
- `automation`: id, cost, effect, prerequisites.

## Simulation Guidance

Use a fixed simulation tick such as 5 or 10 ticks per second for online play. For offline gains, use aggregate formulas instead of replaying every frame. USI exposes some differences between active and offline systems; this game should explicitly label any active-only effects.

Recommended state split:

- Static definitions: content data.
- Persistent state: unlocks, best lanes, research, recipe levels, relic resonance, prestige stats.
- Run state: current lane, current resources, current ship upgrade levels, active boosts.
- Settings/QoL: loadouts, automation toggles, tab order.

## Big Number Plan

Idle games need large numbers early. Decide before implementation whether to use:

- Native `float`/`double` for MVP only.
- A custom scientific-number class with mantissa and exponent.
- A GDScript addon/library for big numbers if acceptable.

For MVP, a mantissa/exponent pair is likely enough:

- Store sign, mantissa, exponent.
- Normalize mantissa to `[1, 10)`.
- Implement add, subtract, multiply, divide, pow by scalar, compare, format.
- Keep formulas data-driven and testable.

## Formula Starting Points

Combat:

```text
effective_damage = weapon_base_damage
  * arsenal_multiplier
  * chartwork_damage
  * module_damage
  * relic_damage
  * research_damage
  * stormheart_damage
  * enemy_type_modifier
```

Upgrade cost:

```text
cost(level) = base_cost * cost_scale ^ level
```

Soft-cap pattern:

```text
value = base * (1 + log10(resource + 1) * factor) ^ exponent
```

Offline gains:

```text
offline_seconds = min(now - last_save_time, offline_cap)
aggregate_income = income_per_second_snapshot * offline_seconds * offline_efficiency
```

These are seed formulas only. Balance should be tuned by simulation, not by intuition alone.

## UI Requirements

This game will likely become dense. Build UI with that future in mind.

Required panels for MVP:

- Sea Lane panel: lane name, distance, wave, boss, enemy type, combat log micro-feed.
- Ship status: hull, ward, speed, damage summary.
- Resource strip: resources and rates.
- Main tabs: Arsenal, Chartwork, Artificing, Relics, Stormheart, Lore, Haven, Logbook.
- Tooltip system with source breakdowns.
- Next unlock tracker.

Important rules:

- No tiny mystery icons without tooltips.
- No essential information hidden only in hover if mobile is planned.
- Every automation toggle needs visible state and scope.
- Every prestige needs preview and confirmation.

## Balance Workflow

Create a balance sandbox as soon as formulas exist.

Useful debug outputs:

- Time to clear each lane with baseline play.
- Time to first unlock of each system.
- Time to first Return to Port.
- Upgrade affordability timeline.
- Resource bottleneck per lane.
- Multipliers by source for damage, defense, speed, and income.
- Offline vs active gain ratio.

Preferred playtest targets for first MVP:

- Lane 1 clear: under 2 minutes.
- Artificing unlock: 5-10 minutes.
- Relic Compass unlock: 10-15 minutes.
- Stormheart unlock: 20-30 minutes.
- First Haven unlock: 60-120 minutes.
- First Return to Port: 2-4 hours for an idle player, faster for active optimization.

## Risks

- Too much theme text can slow comprehension. Keep flavor in names, tooltips, and events, but make button labels operational.
- Too many resources early can overwhelm. Start with salvage, doubloons, ether brine, charts, and relic fragments.
- Prestige can feel bad if it resets solved setup. Add loadouts and automation early.
- The pirate skin can drift generic. Every system should answer a specific captain fantasy.
- Data-driven systems can become over-abstracted. Keep definitions simple until patterns prove themselves.

## Next Agent Checklist

1. Create a minimal Godot project if none exists.
2. Implement saveable `GameState` and fixed-step `Sim`.
3. Add Sea Lane combat with one lane, one enemy, one boss, and one upgrade.
4. Add resource formatting and offline snapshot.
5. Add data definitions for 10 lanes, 4 enemy families, and 4 weapon types.
6. Add UI shell with tabs even if most tabs are locked.
7. Add unlock notifications and source-breakdown tooltips.
8. Only then add Artificing, Relics, and Chartwork.

