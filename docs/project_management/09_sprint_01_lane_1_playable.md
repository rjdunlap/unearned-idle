# Sprint 01: Lane 1 Playable

Sprint plan date: 2026-05-21

This sprint is the first execution slice for the MVP. It intentionally proves the smallest visible loop before Relics, Artificing, Bearing, Bounty, Cartography, or prestige are implemented.

## Sprint Goal

Create a Godot foundation where a fresh player can:

1. Start a new run.
2. Watch the ship fight Lane 1 automatically.
3. Earn Salvage.
4. Buy a Long Nine Cannons upgrade.
5. Defeat the Lane 1 boss.
6. Save, close, reload, and continue from the correct state.

Default sprint length:

- Solo implementation: 1 week, 2026-05-21 to 2026-05-28.
- Multi-agent implementation: up to 2 weeks, 2026-05-21 to 2026-06-04.

## Technical Decisions

| Decision | Lock |
| --- | --- |
| Godot version | Godot `4.6.2-stable`, Standard build, GDScript first. |
| Version rationale | Godot's official archive lists `4.6.2-stable` as the current stable patch from 2026-04-01, while `4.7` is still beta as of 2026-05-21. Godot's release policy says the latest patch in a stable minor branch receives active support. |
| Source links | [Godot archive](https://godotengine.org/download/archive/) and [Godot release policy](https://docs.godotengine.org/en/stable/about/release_policy.html). |
| Local tool status | `godot` and `godot4` were not found in PATH, and no Godot app was found under `/Applications` during this pass. Project creation is ready, but editor validation is blocked until Godot is installed or a binary path is provided. |
| Target aspect | Portrait mobile first, validated at `360x800`; desktop/tablet expansion second. |
| Data format | JSON for balance-heavy content. GDScript resources/classes can be added later for logic-heavy relic behavior. |
| Big numbers | Native `float` for MVP. Revisit only if playtest values exceed readable ranges. |
| Visual implementation | 2D placeholder sprites and icon silhouettes for MVP foundation. Stylized 3D ships can be reconsidered after combat readability is proven. |
| Working title | Keep `Unearned Bounty Idle` internally until prototype naming is reviewed. |

## Project Folder Convention

Use this structure when creating the Godot project:

```text
autoload/
  GameState.gd
  Sim.gd
  Balance.gd
  Definitions.gd
scenes/
  main/
  combat/
  ui/
scripts/
  combat/
  ui/
  save/
  data/
data/
  definitions/
  schemas/
assets/
  placeholder/
    icons/
    ships/
    ui/
tests/
```

Autoload ownership:

| Autoload | Responsibility |
| --- | --- |
| `GameState` | Mutable run state, persistent state, settings, save version. |
| `Sim` | Fixed-step online simulation and offline catch-up orchestration. |
| `Balance` | Formula helpers, cost curves, damage math, resource formatting. |
| `Definitions` | Loads and validates static JSON definitions. |

## Sprint Tickets

| ID | Ticket | Owner | Done when |
| --- | --- | --- | --- |
| S1-001 | Create Godot project shell | Foundation | Project opens in Godot `4.6.2-stable` and uses portrait mobile defaults. |
| S1-002 | Add folder structure | Foundation | Required folders exist and are committed with placeholders where needed. |
| S1-003 | Add autoload stubs | Foundation | `GameState`, `Sim`, `Balance`, and `Definitions` are registered and load without errors. |
| S1-004 | Define Salvage and Doubloons | Content | Resource definitions include display name, persistence tier, icon placeholder, and color role. |
| S1-005 | Define starter ship | Content | Player has hull, ward, damage, speed, and starter weapon values. |
| S1-006 | Define Lane 1 content | Content | Privateer patrol enemy, Lane 1 boss, wave count, rewards, and next-lane unlock exist in JSON. |
| S1-007 | Implement fixed-step combat tick | Foundation/Combat | Combat progresses deterministically independent of frame rate. |
| S1-008 | Implement Lane 1 wave and boss flow | Combat | Enemies spawn, die, drop rewards, and boss clear unlocks Lane 2. |
| S1-009 | Implement Long Nine upgrade purchase | Combat/UI | Player can spend Salvage and see damage improve. |
| S1-010 | Build placeholder main UI | UI | Sea lane, player/enemy bars, lane progress, resource strip, and Arsenal button are visible. |
| S1-011 | Implement save/load | Foundation | Lane, resources, upgrades, and combat state survive restart. |
| S1-012 | Add debug overlay | Foundation/UI | Speed multiplier, resource grant, lane jump, save/load, and reset controls exist. |
| S1-013 | Run sprint demo smoke test | QA | Demo script below passes without debug tools except for explicit QA checks. |

## Not In Sprint 01

These are intentionally excluded from Sprint 01:

- Relic Compass.
- Artificing.
- Ship's Bearing.
- Bounty Contracts and Infamy.
- Cartography and Charts.
- Return to Port prestige.
- Offline gains, except save timestamp scaffolding if cheap.
- Any post-MVP parked system.

## Demo Script

Use this script for the sprint review:

1. Delete or reset local save data.
2. Start a new game.
3. Watch Lane 1 Privateer patrol combat for at least 30 seconds.
4. Confirm Salvage increases after kills.
5. Open Arsenal.
6. Buy one Long Nine Cannons upgrade.
7. Confirm enemy time-to-kill improves or damage number increases.
8. Wait for Lane 1 boss.
9. Defeat Lane 1 boss.
10. Confirm Lane 2 unlocks.
11. Save and close the project.
12. Reopen and load.
13. Confirm lane unlock, resources, upgrade level, and combat state are correct.

## Combat Readability Checklist

Run this before adding Relics, Artificing, Bearing, Bounty, or Cartography.

Core readability:

- A new observer can point to the player ship and current enemy within 5 seconds.
- Player hull and enemy hull are visible without opening another panel.
- The player can tell when a wave enemy dies.
- The player can tell when the boss phase begins.
- The player can tell what resource was earned after a kill.
- The next useful upgrade is visible or one tap away.

Counter readability for Milestone 1 completion:

- Lane 2 or another early test enemy visibly punishes the wrong damage type.
- The correct weapon counter improves progress enough to notice.
- Diagnostics explain the wall in operational language, such as "Armor high, use Harpoons."
- Tooltips show defense layers as hull, armor, ward, and evasion, not hidden formula terms.

Save trust:

- Manual save restores the same lane.
- Manual save restores resources.
- Manual save restores upgrade levels.
- Manual save restores enough combat state that the player does not feel progress was lost.
- Reset is available only through debug or a clearly confirmed action.

Mobile layout:

- UI is legible at `360x800`.
- Main actions use at least 44 px touch targets.
- Resource numbers do not overlap labels.
- Combat is not covered by the Arsenal panel.
- No essential explanation depends only on hover.

## Milestone 1 Acceptance Gate

Milestone 1 is accepted only when:

- Player can idle through Lane 1, buy an upgrade, beat a boss, and enter Lane 2.
- Wrong weapon vs armor or ward is visibly worse than the correct counter in an early lane.
- Combat state survives closing and reopening.
- A non-designer can tell what is happening on screen.
- Debug tools exist for lane/resource/time simulation.

## Known Blocker

Godot is not currently available in PATH or `/Applications` on this machine. Install Godot `4.6.2-stable` or provide the engine binary path before asking an engineer to validate the project in the editor.
