# Development Start Handoff Prompt

Prompt date: 2026-05-21

Use this prompt to start the first development agent on the Godot MVP. It assumes the agent is working in this repository and should begin with Sprint 01: Lane 1 Playable.

## Copy-Ready Prompt

```text
You are the development agent starting implementation for the Unearned Bounty Godot MVP.

Repository context:
- The repo contains design, research, visual direction, PM board, and sprint docs.
- There are no accepted Godot project files yet unless a prior agent has added them after this prompt was written.
- Current workspace: /Users/robert/Documents/Unearned Bounty Godot

Read these files first, in this order:
1. README.md
2. docs/project_management/08_mvp_execution_board.md
3. docs/project_management/09_sprint_01_lane_1_playable.md
4. docs/project_management/07_mvp_pm_handoff.md
5. docs/design/03_mvp_and_technical_plan.md
6. docs/design/04_progression_content_taxonomy.md
7. docs/design/06_visual_design_bible.md

Current product direction:
- Build a mystical pirate unfolding idle MVP inspired structurally by Unnamed Space Idle and visually by Unearned Bounty.
- The first build target is Sprint 01: Lane 1 Playable.
- Prove the combat heartbeat before adding secondary systems.
- Ship's Bearing replaces Chartwork.
- Lore is merged into Charts.
- Stormheart, Hidden Haven, Trials, Maelstrom, full Crew, Grand Expedition, large automation, and monetization are out of MVP.

Technical locks:
- Godot version: 4.6.2-stable, Standard build, GDScript first.
- Target aspect: portrait mobile first, validate at 360x800.
- Data format: JSON for balance-heavy content.
- Big numbers: native float for MVP.
- Visual implementation: 2D placeholders and readable silhouettes for foundation.

Your mission:
Implement Sprint 01 from docs/project_management/09_sprint_01_lane_1_playable.md.

Sprint 01 player demo must support:
1. Start a new game.
2. Watch the ship fight Lane 1 automatically.
3. Earn Salvage.
4. Buy a Long Nine Cannons upgrade.
5. Defeat the Lane 1 boss.
6. Unlock Lane 2.
7. Save, close, reload, and continue from the correct state.

Start with these tickets:
- S1-001: Create Godot project shell.
- S1-002: Add folder structure.
- S1-003: Add GameState, Sim, Balance, and Definitions autoload stubs.
- S1-004: Define Salvage and Doubloons.
- S1-005: Define starter ship.
- S1-006: Define Lane 1 content.
- S1-007: Implement fixed-step combat tick.
- S1-008: Implement Lane 1 wave and boss flow.
- S1-009: Implement Long Nine upgrade purchase.
- S1-010: Build placeholder main UI.
- S1-011: Implement save/load.
- S1-012: Add debug overlay.
- S1-013: Run sprint demo smoke test.

Use this project structure:
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

Implementation constraints:
- Keep changes scoped to Sprint 01.
- Do not implement Relic Compass, Artificing, Ship's Bearing, Bounty, Cartography, prestige, offline gains, or any post-MVP system yet.
- Do not implement lanes beyond a minimal Lane 2 unlock unless needed to prove Lane 1 completion.
- Keep content data-driven through JSON definitions.
- Save run state and persistent state separately.
- Include save file versioning and a migration placeholder.
- Use a fixed-step simulation independent of frame rate.
- Add debug tools for resource grant, lane jump, speed multiplier, save/load, and reset.
- Keep UI usable at 360x800 portrait, with 44 px minimum touch targets.
- Use the visual bible palette and "captain's desk over living sea lane" direction, but keep assets placeholder-simple.

Acceptance gate:
- Player can idle through Lane 1, buy an upgrade, beat a boss, and enter Lane 2.
- Wrong weapon vs armor or ward is visibly worse than the correct counter in an early test lane or debug scenario.
- Combat state survives closing and reopening.
- A non-designer can tell what is happening on screen.
- Debug tools exist for lane/resource/time simulation.

If Godot is not installed or not in PATH:
- Report the blocker clearly.
- Still create safe repo files that do not require the editor if appropriate, such as folder structure, JSON definitions, and GDScript stubs.
- Do not mark editor validation as complete until the project opens in Godot 4.6.2-stable.

Before finishing:
- Run any available Godot validation or headless import/check command if the binary exists.
- Run a basic file/status inspection.
- Summarize what was implemented, what was verified, and what remains blocked.
```

## Notes For The PM

This prompt starts implementation, not design expansion. If the development agent tries to broaden scope, redirect to `docs/project_management/08_mvp_execution_board.md` and keep Sprint 01 focused on the Lane 1 playable loop.
