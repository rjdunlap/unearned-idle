# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Two parallel builds

This repo contains two independent implementations of the same game that share the `data/definitions/` JSON files:

1. **Godot 4.6** — mobile-first (360×800, portrait). Open `project.godot` in Godot 4.6.2-stable and press F5 to run.
2. **TypeScript/Vite web** — live at <https://rjdunlap.github.io/unearned-idle/>. Source in `web/`. Deployed automatically by GitHub Actions on every push to `main` that touches `web/**` or `data/definitions/**`.

There are no automated tests in either build yet.

## Web build commands

All commands run from the `web/` directory:

```bash
npm run dev      # Vite dev server with HMR
npm run build    # tsc --noEmit then Vite production build → web/dist/
npm run preview  # Serve web/dist/ locally
```

`tsc --noEmit` is part of `build`; run it directly to type-check without building.

## Architecture

### Shared data layer

`data/definitions/` holds all static game content as JSON. Every file wraps its content in `{ "items": [...] }` and every item has an `"id"` string. Both builds load these files at startup (Godot via `FileAccess`, TypeScript via Vite static imports aliased as `@data/`).

**Adding a new entity**: add an item to the relevant JSON file. Both builds will pick it up with no code changes.

### Dependency order (both builds)

```
Definitions  →  Balance  →  GameState  →  Sim  →  UI
(static JSON)   (formulas)  (mutable)    (loop)   (display)
```

- **Definitions** — read-only after load; lookup by `id`.
- **Balance** — stateless pure functions: damage formulas, upgrade cost curve, number formatting.
- **GameState** — single source of truth. State is split three ways: `run` (resets on Return to Port), `persistent` (survives reset), `settings` (never resets). Emits events/signals whenever state changes so UI doesn't poll.
- **Sim** — 10 tick/sec fixed-step combat loop (frame-rate independent). Reads from Definitions and Balance, writes to GameState, notifies UI via signals (Godot) or optional callbacks (TypeScript). Never reads from the UI.
- **UI** — reacts to Sim callbacks and GameState events. In the web build, all UI is built imperatively in `web/src/ui/main.ts`; there is no framework. Styles live in `web/src/ui/styles.css`.

### Godot autoloads

Registered in `project.godot` in dependency order: `Definitions`, `Balance`, `GameState`, `Sim`, `SaveSystem`. All are global singletons.

### Web core modules

`web/src/core/` mirrors the Godot autoloads 1:1:
- `definitions.ts` — typed wrappers around the JSON imports
- `balance.ts` — same formulas as `Balance.gd`
- `types.ts` — TypeScript interfaces (`RunState`, `PersistentState`, `RouteState`, `CourseMode`)
- `game-state.ts` — `GameState` singleton with typed getters/setters and an `Emitter`
- `sim.ts` — `Sim` class; `sim` singleton exported
- `save-system.ts` — `localStorage` persistence (`ub_run_state`, `ub_persistent_state`)

### Distance-based routing (web build, Sprint 02+)

Encounters advance the ship along a route. Key constants in `sim.ts`:
- `ENCOUNTER_DISTANCE = 30` nmi per encounter cleared
- `RETREAT_DISTANCE = 45` nmi lost on player defeat, plus a 2.4 s recovery pause
- Boss spawns when `route.distance >= lane.distance` (set in `lanes.json`)
- Enemy selection uses `distanceBand = floor(distance / 30)` to vary enemies across a lane
- `CourseMode`: `'forward'` (advance), `'hold'` (stay), `'retreat'` (pull back)

Lane IDs are lexicographically ordered (`lane_01 < lane_02 …`) — used directly for best-lane tracking.

### Save format

Both builds version-tag saves (`save_version: 1`) and run a `_migrate` pass on load. The Godot build writes to `user://saves/{run,persistent}_state.json`; the web build uses `localStorage`. When changing persisted fields, bump `SAVE_VERSION` and add a migration branch in both `SaveSystem.gd` and `save-system.ts`.
