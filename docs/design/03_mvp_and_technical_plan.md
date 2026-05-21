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

MVP lane range: 1-20.

MVP systems:

- Sea Lane combat (4 enemy families, lane boss, stormwall diagnostic).
- Ship Arsenal upgrades (4 weapons, 3 defenses, 2 fittings, weapon milestones).
- Ship's Bearing stance system (4 bearings, momentum buildup).
- Artificing (5 recipes, 4 modules, permanent recipe levels).
- Relic Compass (2 slot colors, 6 relics, resonance, constellation linking).
- Cartography research (1 branch only: Cartography; others unlock after first prestige).
- Bounty Contracts (3 active contracts per run, Infamy accumulation, prestige currency).
- First Return to Port prestige (Infamy Marks, preserved discoveries, 3 new unlocks).
- Auto-Advance and Loadout Slot automation (only these two in MVP).
- Save/load and offline gains.

Out of MVP:

- Stormheart Furnace (full ether brine economy; defer post-MVP).
- Hidden Haven grid.
- Full 4-branch Cartography and Lore research (3 branches unlock post-first-prestige).
- Trials.
- Maelstrom Voyages.
- Full crew system.
- Grand Expedition second prestige.
- Armada Campaigns.
- Faction standing UI (can track numbers invisibly in MVP, surface the tab post-MVP).
- Large automation tree beyond auto-advance and loadouts.
- Monetization.
- Mobile-specific layout, unless mobile is the main launch target.

What the MVP must prove:

- Auto-combat through sea lanes is satisfying and readable.
- Weapon/defense counters make loadout choices feel meaningful.
- Bearing stances create genuine timing decisions, not just stat allocation.
- Relics turn drops into buildcraft with the constellation system.
- Contracts give each run a named goal beyond "push forward."
- Prestige feels earned and speeds the next run visibly.

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

- Ship's Bearing with 4 stances and momentum buildup display.
- Artificing with 5 starter recipes and 4 active modules.
- Relic Compass with 2 slot colors, 6 starter relics, and constellation link previews.
- Bounty Contracts tab with 3 active contract slots, Infamy counter, and Wanted bounty hunter encounters.
- Cartography research (1 branch, passive Charts accumulation, lane density values).

Success criteria:

- Players can set a bearing and understand why they switched.
- Drops have multiple uses (salvage, craft materials, relic fragments).
- A Bounty Contract gives the player a named goal in the current run.
- Tooltips show how each system contributes to damage, defense, and income.

### Phase 3: Prestige and Contracts

Add the first reset loop.

Features:

- Return to Port prestige with Infamy Marks as the currency.
- Prestige reward tree: buy permanent hull multiplier, second relic slot, new Cartography branch, bearing mastery levels, additional contract slots.
- Preserve recipe levels, Cartography research, relic library/resonance, faction standing, and captain Infamy fraction (20% carries over).
- Reset salvage, current lane, Arsenal upgrade levels, active modules, current contracts.
- Prestige preview screen showing what resets, what persists, what unlocks, and Infamy Marks gained.
- Loadout Slot automation as a first-prestige unlock.

Success criteria:

- Return to Port makes the next run clearly faster.
- Infamy Marks are spent on choices, not just a single multiplier.
- The player can see what specifically caused their Infamy to be what it is.

### Phase 4: Automation and Usability

Features:

- Quartermaster upgrades: auto-advance (if not added in phase 1), Arsenal auto-buy, research auto-select, relic auto-merge, bearing auto-hold.
- Loadout slots for Arsenal and Relic Compass (if not added in phase 3).
- Contract auto-refresh option.
- Offline summary window showing resources gained, contracts completed, Infamy earned.
- "Missing multipliers" diagnostic panel.
- Next unlock tracker.

Success criteria:

- Repeating early lanes after Return to Port takes much less babysitting.
- The player can understand why progress slowed.
- Contract status is visible in the summary without opening the tab.

## Data-Driven Content

Do not hard-code individual upgrades into UI scripts. Use definitions.

Suggested definition tables:

- `resources`: id, display name, icon, color, persistence tier.
- `lanes`: id, name, distance, enemy table, boss id, research density, chart density, unlocks.
- `enemies`: id, family, hull, armor, ward, evasion, reward multipliers, tags, infamy_value.
- `weapons`: id, damage type, fire rate, target priority, milestone list.
- `arsenal_upgrades`: id, target, cost resource, base cost, cost scale, effect id.
- `bearings`: id, name, stat effects, momentum curve, unlock lane.
- `recipes`: id, input resources, time, xp curve, unlocks, infinite level.
- `modules`: id, required recipe, slot cost, effect, tier rules.
- `relics`: id, slot affinities, resonance max, effects, drop lanes, constellation_links.
- `constellations`: id, relic_a, relic_b, required_slots, combined_effect.
- `research`: branch, node, cost, effect, prerequisites.
- `bounty_contracts`: id, faction, target_type, target_id, objective_count, rewards, expiry.
- `bounty_hunters`: id, name, lane_range, hull, armor, ward, reward_multiplier, trophy_relic.
- `factions`: id, name, contract_pool, standing_effects.
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
  * bearing_damage_multiplier
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

- Sea Lane panel: lane name, distance, wave, boss, enemy type, combat log micro-feed, stormwall indicator.
- Ship status: hull, ward, speed, damage summary, current bearing and momentum.
- Resource strip: salvage, doubloons, craft materials, charts, relic fragments — with per-second rates.
- Main tabs: Arsenal, Bearing, Artificing, Relics, Cartography, Contracts, Logbook. Locked tabs for Haven, Stormheart, Crew visible but greyed.
- Infamy counter always visible (header or resource strip).
- Tooltip system with source breakdowns.
- Next unlock tracker.
- Bounty Contract panel: active contracts with progress bars, faction icons, reward previews.

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
- First Bounty Contract available: 15-20 minutes (lane 6).
- Ship's Bearing unlock: 20-30 minutes (lane 5).
- Cartography tab unlock: 30-40 minutes (lane 7).
- First Wanted bounty hunter encounter: after first contract completes.
- Stormwall hit: 60-90 minutes.
- First Return to Port: 2-4 hours for an idle player, faster for active optimization.
- Second run reaches previous best lane: in 50% of original time.

## Risks

- Too much theme text can slow comprehension. Keep flavor in names, tooltips, and events, but make button labels operational.
- Too many resources early can overwhelm. Start with only salvage and doubloons; add craft materials at lane 2, relic fragments at lane 3, charts at lane 7. Ether brine is post-MVP.
- Prestige can feel bad if it resets solved setup. Add loadouts and auto-advance as first-prestige unlocks.
- Bounty Contracts must have clearly readable objectives. Ambiguous contract text is a legibility failure.
- Infamy escalation (bounty hunters) must be paced so it feels exciting, not punishing. Bounty hunters should arrive after the player is stable in a lane, not during a wall.
- The pirate skin can drift generic. Every system should answer a specific captain fantasy.
- Data-driven systems can become over-abstracted. Keep definitions simple until patterns prove themselves.

## Next Agent Checklist

1. Write the Lane Content Map for lanes 1-20 before any implementation (see missing specs in doc 05).
2. Write the Bounty Contract table for lanes 1-20 (contract targets, objectives, rewards).
3. Create a minimal Godot project if none exists.
4. Implement saveable `GameState` and fixed-step `Sim`.
5. Add Sea Lane combat with one lane, one enemy, one boss, and one Arsenal upgrade.
6. Add resource formatting and offline snapshot.
7. Add data definitions for 20 lanes, 4 enemy families, 4 weapon types, and the bearing stances.
8. Add UI shell with tabs; locked tabs visible but greyed out.
9. Add unlock notifications and source-breakdown tooltips.
10. Only then add Relic Compass, then Artificing, then Bearing, then Contracts.
11. Do not implement Stormheart, Haven, Trials, or Maelstrom until all MVP systems above are playtested.

