# Web Combat And Upgrade Layout Notes

Date: 2026-05-21

This is the project-facing version of the Unnamed Space Idle layout teardown. It records what the current web build should be trying to become, with extra notes for combat and upgrades.

## Current Direction

The web build should use a USI-style desktop contract:

- Left third: live open-sea combat window.
- Right two-thirds: ship design, upgrades, counters, and unfolding mechanics.
- Top-right strip: persistent resources and save/debug controls.
- Mobile: combat first, then status, then the active mechanics workspace.

The important change is philosophical: combat is not a "versus card." It is the heartbeat of the screen. The mechanics panel is not a bottom drawer. It is the ship workbench.

## Open-Sea Encounter Target

Follow-up correction: `lane` is the wrong visual metaphor for the pirate game. It makes the scene feel like a road, rail, or checklist. The combat view should read as an open-sea encounter window: horizon, wakes, pursuit angles, enemy fleet pressure, and broad waterspace.

Near-term visual target:

- Player ship anchored low-left or lower-center.
- Current enemy ship appears high-right or forward on the horizon.
- Projectiles travel across open water to the target.
- Wave markers and boss marker read like distant fleet silhouettes or horizon threats, not a vertical checklist.
- Player hull sits near the player ship.
- Enemy hull sits near the enemy ship.
- Combat log remains small and local to the combat window.

Recommended next combat additions:

- Show incoming enemy silhouettes above the current target.
- Add a boss approach state before boss spawn.
- Add lane slots for multiple visible ships, even if the sim only damages one active target.
- Add projectile variants by weapon type:
  - cannon: short gold shot bursts
  - harpoon: longer copper bolt or cable line
  - firepot: slow red/orange arc
  - shrine lantern: violet/teal ward beam
- Add damage response variants:
  - armor ricochet
  - evade label
  - ward block pulse
  - hull break flash
- Add target diagnostics near the enemy:
  - family
  - armor
  - evasion
  - weak/strong counter tag

The first implementation can keep one mechanical enemy active. The visual scene should still hint at waves and incoming pressure so the game feels closer to an idle shoot 'em up.

## Combat Data Needs

Existing data already supports a good first pass:

- `lanes.json`
  - `wave_count`
  - `wave_enemies`
  - `boss`
  - `unlocks_lane`
- `enemies.json`
  - `family`
  - `hull`
  - `armor_reduction`
  - `ward_reduction`
  - `evasion`
  - `damage`
  - `fire_rate_ticks`
  - `rewards`
  - `description`
- `weapons.json`
  - `damage_type`
  - `base_damage`
  - `damage_scale_per_level`
  - `fire_rate_ticks`
  - `strong_vs`
  - `weak_vs`

Useful additions later:

- `enemy_role`: swarm, duelist, armored, warded, boss, support
- `visual_scale`: small, medium, large, boss
- `formation_slot`: center, port, starboard, rear, boss
- `counter_hint`: short UI copy for why a weapon works or fails
- `arrival_style`: descend, surface, broadside, ambush
- `death_style`: sink, explode, burn, banish, flee

## Upgrade Workspace Target

The upgrade workspace should feel like a compact ship console.

Near-term layout:

- Header: active system, e.g. Arsenal.
- Loadout summary:
  - ship
  - active weapon core
  - counters / weaknesses
- Upgrade rows:
  - name
  - level / max
  - current stat
  - next stat
  - cost
  - progress or milestone meter
  - buy button
- Locked previews:
  - next weapon
  - next counter mechanic
  - next lane pressure

This should become more grid-like as content grows. A single large card is only acceptable before the second upgrade exists.

## Upgrade Content Guidance

Existing upgrade data:

- `long_nine_upgrade`
  - Long Nine: Powder Charge
  - target: `long_nine_cannons`
  - cost: salvage
  - base cost: 50
  - scale: 2.0
  - max level: 10
  - effect: weapon damage
- `harpoon_upgrade`
  - Harpoon: Barbed Tips
  - target: `harpoon_battery`
  - cost: salvage
  - base cost: 75
  - scale: 2.0
  - max level: 10
  - effect: weapon damage

Recommended next arsenal upgrades:

| ID | Name | Target | Effect | Why |
| --- | --- | --- | --- | --- |
| `long_nine_trunnions` | Long Nine: Trunnion Tuning | Long Nine Cannons | lower fire-rate ticks or reduce enemy evasion | Gives cannons a feel upgrade beyond raw damage |
| `long_nine_chainshot` | Long Nine: Chainshot Drill | Long Nine Cannons | bonus vs sails / fast enemies | Lets cannons counter evasive privateers |
| `harpoon_chain_winch` | Harpoon: Chain Winch | Harpoon Battery | partial armor ignore or armor shred | Makes Harpoon the clear Ironclad answer |
| `harpoon_breach_hooks` | Harpoon: Breach Hooks | Harpoon Battery | extra damage after armor reduction | Adds anti-armor identity |
| `hull_reinforced_ribs` | Hull: Reinforced Ribs | Starter Ship | max hull | Gives Doubloons/Salvage a defensive sink |
| `sails_saltglass_rigging` | Sails: Saltglass Rigging | Starter Ship | speed or initiative | Connects age-of-exploration movement to idle pacing |
| `ward_lantern_circle` | Ward: Lantern Circle | Starter Ship | ward reduction or boss damage reduction | Prepares occult enemy families |

Recommended data fields for future upgrades:

- `id`
- `display_name`
- `description`
- `target_type`: weapon, ship, hull, sails, ward, fitting
- `target_id`
- `cost_resource`
- `base_cost`
- `cost_scale`
- `max_level`
- `effect`
- `effect_value`
- `effect_scale`
- `unlock_lane`
- `unlock_requirement`
- `milestones`
- `counter_tags`

The current code supports `target_weapon` and `weapon_id`; future data should settle on one field shape or introduce `target_type` and `target_id` to avoid weapon-only assumptions.

## Upgrade Math And Feel

Current first upgrade cost curve is:

| Level bought | Cost |
| --- | ---: |
| 1 | 50 salvage |
| 2 | 100 salvage |
| 3 | 200 salvage |
| 4 | 400 salvage |
| 5 | 800 salvage |

This can work for a first slice, but it will feel steep if Lane 1 enemies stay at 8-12 salvage and the boss gives 80 salvage. Consider lowering `cost_scale` to 1.7 if upgrades past level 3 feel too slow.

The UI should show why the player wants the upgrade:

- Current damage -> next damage.
- Shots to kill current enemy before/after, if cheap to calculate.
- Damage lost to armor.
- Whether current enemy is strong or weak against the active weapon.

Example diagnostic copy:

- `Cannons: 19.2 -> 21.6 damage. Privateer armor reduces this by 20%.`
- `Ironclad armor reduces cannon damage heavily. Harpoon Battery recommended.`
- `Need 82 Salvage for next upgrade. Current income: about 12 Salvage per Sloop.`

## Harpoon And Lane 2

Widow's Crossing introduces Ironclads, and the current Long Nine weapon is intentionally weak against armor. The UI needs to prepare the player before this feels like a bug.

Minimum implementation before Lane 2 feels fair:

- Harpoon Battery appears in the Arsenal workspace before or at Lane 2.
- Ironclad enemies show an armor tag in the combat window.
- Cannon weakness is communicated in the weapon summary.
- Harpoon's anti-armor role is visible before purchase.

Possible unlocking routes:

- Defeat Lane 1 boss to reveal Harpoon Battery.
- Spend Doubloons from Lane 1 boss to unlock Harpoon Battery.
- Add an intro prompt: "Ironclad hulls shrug off cannon fire. Fit harpoons."

## Doubloon Sink

Doubloons currently accumulate without a sink. Good first sinks:

- Unlock Harpoon Battery.
- Unlock the next lane.
- Buy a ship hull upgrade.
- Buy a fitting slot.
- Buy a permanent Arsenal automation perk.

Best near-term fit: use Doubloons to unlock Harpoon Battery or a first ship fitting. That makes the Lane 1 boss reward immediately meaningful.

## Desktop Layout Acceptance Checks

Before calling a desktop layout pass done:

- Combat remains visible while buying upgrades.
- The player ship and current enemy are visible at the same time.
- Projectiles visibly travel between them.
- The right panel shows active ship/weapon identity without scrolling.
- At least one upgrade row shows current -> next value.
- Locked or future counter content is hinted somewhere.
- Resource totals and save remain visible.
- The combat log does not dominate the encounter window.

## Mobile Layout Acceptance Checks

Before calling a mobile layout pass done:

- The combat window is the first screen.
- Player and enemy are both visible without horizontal scrolling.
- Status/resources are reachable immediately below combat.
- Upgrade rows stack cleanly.
- Long names truncate or wrap intentionally.
- Buttons remain tappable.
- Combat log does not push the ship out of view.

## Near-Term Implementation Backlog

1. Add locked Harpoon Battery preview to Arsenal.
2. Add enemy counter tags in the combat window.
3. Add current-to-next stat deltas for every upgrade row.
4. Add a second Long Nine upgrade so the workspace stops feeling like a single-card prototype.
5. Add Doubloon unlock for Harpoon Battery or first fitting.
6. Add incoming enemy silhouettes to the horizon / open-sea background.
7. Add boss approach warning before boss spawn.
8. Add armor/evade/ward-specific hit feedback.
9. Add buy amount controls once multiple upgrade rows exist.
10. Add tooltip or detail pane for locked upgrades and enemy counters.
