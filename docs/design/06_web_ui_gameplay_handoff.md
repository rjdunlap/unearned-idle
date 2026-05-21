# Web UI And Gameplay Handoff

Updated: 2026-05-21
Live URL: https://rjdunlap.github.io/unearned-idle/
Local URL: http://127.0.0.1:5173/unearned-idle/
Branch: `main` auto-deploys on push

## Purpose

This is the current web-prototype handoff. It replaces the older task list that focused on hardcoded labels and a portrait-only card layout.

The key design correction: the game should not present combat as a literal lane. Internally the data can still use lane IDs, waves, and bosses, but the player-facing screen should feel like an open-sea encounter: horizon threats, wakes, broadsides, projectile travel, reward bursts, and boss arrivals.

## Current Architecture

The TypeScript/HTML5 build mirrors the Godot autoload shape.

| Web file | Godot equivalent | Use |
| --- | --- | --- |
| `web/src/core/balance.ts` | `autoload/Balance.gd` | stat and formula helpers |
| `web/src/core/definitions.ts` | `autoload/Definitions.gd` | shared JSON definition access |
| `web/src/core/game-state.ts` | `autoload/GameState.gd` | run and persistent state |
| `web/src/core/sim.ts` | `autoload/Sim.gd` | combat simulation |
| `web/src/core/save-system.ts` | `autoload/SaveSystem.gd` | local save/load |
| `web/src/ui/main.ts` | `scenes/main/Main.gd` | DOM UI and VFX glue |

Shared data lives in `data/definitions/*.json`.
Browser save keys are `ub_run_state` and `ub_persistent_state`.

## Current UI Direction

Desktop target:

- Left third: live combat window.
- Right two-thirds: captain's desk with Arsenal, future crew/relic/fitting systems, and progression previews.
- Status/resources remain visible while buying upgrades.

Mobile target:

- Combat first.
- Resources/status immediately below.
- Upgrade workspace stacked below combat.
- No horizontal scrolling.

The right side should feel like a compact workbench, not a bottom drawer. The left side should be alive enough that the player can watch the ship fight while making upgrade decisions.

## Completed From Older Handoff

These old Sprint 02 cleanup tasks are done or represented in current code:

- Arsenal panel reads weapon upgrades from data rather than rendering one hardcoded Long Nine card.
- Arsenal header uses the weapon display name.
- Advance button uses lane display names instead of ID string replacement.
- Startup wave label reads lane wave count from data.
- Player ship name reads from the starter ship definition.
- Arsenal tab has an active visual state.
- Desktop layout now uses the left-combat / right-workspace contract.

## Current Gap

The prototype works, but the feel is still too static. The next pass should make combat, upgrades, and counters visibly connected.

Highest-value symptoms to fix:

- Enemy progression still reads too much like waves/checklist instead of approaching threats.
- Long Nine upgrades mostly change numbers, not the water.
- Doubloons exist but do not yet create a decision.
- Harpoon Battery exists in data but does not yet have a satisfying reveal/unlock flow.
- The combat log carries information that should be shown through projectiles, armor feedback, reward drops, and threat preview.

## Next Implementation Slice

Build a small, testable slice:

1. Add an `At the Horizon` / Spyglass preview for the next enemy or boss.
2. Add a second Long Nine upgrade so Arsenal stops feeling like a single-stat panel.
3. Make Long Nine projectile/smoke/reload visuals respond to upgrade level.
4. Add a locked Harpoon Battery preview before armored enemies.
5. Use Doubloons to unlock Harpoon Battery or its blueprint after the first boss.
6. Add armor feedback so cannon weakness against Ironclads is visible, not mysterious.

This slice directly supports the project rule: when the player upgrades or counters something, the ocean should show it.

## Files To Edit First

- `data/definitions/upgrades.json`: add the second Long Nine upgrade and any blueprint/unlock data.
- `data/definitions/weapons.json`: verify Harpoon counter role and Long Nine visual/counter metadata.
- `data/definitions/enemies.json`: add or derive threat tags such as `Armored`, `Evasive`, `Boss`, or `Swarm`.
- `web/src/core/definitions.ts`: expose any new lookup helpers for threat/upgrades.
- `web/src/core/game-state.ts`: store Harpoon unlock/blueprint state if needed.
- `web/src/core/sim.ts`: add armor feedback and second-upgrade effects if they touch combat formulas.
- `web/src/ui/main.ts`: render Spyglass, locked Harpoon preview, reward/armor VFX, and upgraded projectile classes.
- `web/src/ui/styles.css`: keep the scene open-water, not track-like.

## Tuning Notes

Current first-slice values:

| Stat | Current value |
| --- | ---: |
| Player hull | 120 |
| Long Nine base damage | 12 |
| Long Nine fire rate | 10 ticks, about 1 shot/sec |
| Privateer Cutter | 40 HP, 0.10 armor, 8 Salvage |
| Privateer Sloop | 55 HP, 0.15 armor, 12 Salvage |
| Salt Widow boss | 200 HP, 0.20 armor, 80 Salvage, 30 Doubloons |
| Lane 1 wave count | 3 waves + boss |
| Current upgrade curve | `base_cost * 2^level` |

Feel checks:

- First upgrade should arrive quickly enough that the player sees the loop before boredom.
- The first boss should pay enough Doubloons to unlock one meaningful thing.
- Doubling costs are acceptable for a one-button prototype but will probably feel steep once multiple upgrade rows compete for Salvage.
- Armor-heavy enemies should never appear before the UI has taught Harpoon's role.

## Known Deferred Gaps

- Defeat feedback: player respawn needs a visible defeated/pause state.
- Mid-wave save restore: combat restores the wave but not the current enemy hull.
- Counter-hint repeat suppression: repeated hints should be rate-limited.
- Buy amount controls: needed once multiple upgrades exist.
- True multi-ship combat: the sim still focuses one enemy at a time even if the scene visually hints at a fleet.

## Run And Verify

From `web/`:

```bash
npm run dev
```

Open `http://localhost:5173/unearned-idle/` or the live GitHub Pages URL. After UI changes, verify desktop and mobile proportions, projectile visibility, no console errors, and that resources/save still update.
