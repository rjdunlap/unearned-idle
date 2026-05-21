# Unearned Bounty Godot

A mystical pirate unfolding idle game inspired structurally by Unnamed Space Idle and visually by Unearned Bounty.

**Current status:** Sprint 01 — Lane 1 Playable (2026-05-21)

The Godot project files are now in the repository. To open the project, install **Godot 4.6.2-stable (Standard build)** and open `project.godot` in the project root. Editor validation is blocked until Godot is installed locally (see known blocker in [Sprint 01 plan](docs/project_management/09_sprint_01_lane_1_playable.md)).

## Sprint 01 Demo

Once in the editor, press **F5** (or Run Project):

1. Watch the ship fight Lane 1 Privateer waves automatically.
2. Earn Salvage from kills.
3. Open the Arsenal panel and buy **Long Nine: Powder Charge** when you have 50 Salvage.
4. Watch TTK improve as cannon damage increases.
5. Defeat **The Salt Widow** (Lane 1 boss).
6. Press **Advance to Lane 2** when it appears.
7. Press **SAVE** in the status strip, close, reopen — confirm state is preserved.

Press **DEBUG** in the bottom tab bar to open the debug overlay: speed multiplier, resource grants, lane jump, save/load, reset.

## Project Layout

```
autoload/          GameState, Sim, Balance, Definitions, SaveSystem
scenes/main/       Main.tscn + Main.gd (all UI built in code)
data/definitions/  JSON: resources, ships, enemies, lanes, weapons, upgrades
data/schemas/      Schema documentation
assets/placeholder/ Icon placeholder directories
tests/             Future test tooling
```

## Known Blocker

Godot 4.6.2-stable is not currently installed. Install from https://godotengine.org/download/archive/ then open `project.godot`. All GDScript files are complete and will be validated on first editor open.

## Design and Planning Docs

Start here:

- [Research handoff index](docs/research/00_handoff_index.md)
- [Unnamed Space Idle breakdown](docs/research/01_unnamed_space_idle_breakdown.md)
- [Pirate unfolding idle concept](docs/design/02_pirate_unfolding_idle_concept.md)
- [MVP and technical plan](docs/design/03_mvp_and_technical_plan.md)
- [Progression and content taxonomy](docs/design/04_progression_content_taxonomy.md)
- [Prompt for Claude review](docs/research/claude_review_prompt.md)
- [Senior design review](docs/design/05_senior_design_review.md)
- [Visual design bible](docs/design/06_visual_design_bible.md)
- [MVP project management handoff](docs/project_management/07_mvp_pm_handoff.md)
- [MVP execution board](docs/project_management/08_mvp_execution_board.md)
- [Sprint 01 plan](docs/project_management/09_sprint_01_lane_1_playable.md)
- [Development start handoff prompt](docs/project_management/10_development_start_prompt.md)

Research date: 2026-05-21.
