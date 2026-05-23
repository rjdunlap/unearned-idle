# Unearned Bounty Research And Handoff Index

Updated: 2026-05-21

This index separates durable direction from raw research. If a future agent only reads one thing, start here, then follow the "Start Here" links.

## Current North Star

Unearned Bounty is a pirate-themed unfolding idle game with automatic ship combat, visible weapon buildcraft, and long-term captain's desk progression.

The current prototype should move toward:

- Left third: live open-sea combat that is worth watching.
- Right two-thirds: upgrades, counters, resources, and unfolding systems.
- Combat presentation: horizon threats, wakes, broadsides, projectiles, reward bursts, and boss arrivals.
- Upgrade rule: when the player buys an upgrade, the ocean should show it.
- Progression rule: keep early resources few, useful, and visibly connected to ship power.

Use "lane" only as an internal progression/data term when helpful. The player-facing combat scene should not feel like a road, rail, checklist, or vertical track.

## Start Here

- [../design/05_senior_design_review.md](../design/05_senior_design_review.md): cleaned project review with current decisions, risks, revised MVP focus, and next implementation priorities.
- [../design/06_web_ui_gameplay_handoff.md](../design/06_web_ui_gameplay_handoff.md): current web prototype handoff, file map, known gaps, and next slice.
- [../design/07_web_combat_upgrade_layout_notes.md](../design/07_web_combat_upgrade_layout_notes.md): implementation notes for the open-sea combat window and upgrade workspace.
- [../design/08_bullet_heaven_synthesis_backlog.md](../design/08_bullet_heaven_synthesis_backlog.md): high-signal backlog from Bullet Heaven research.
- [../design/09_worldbuilding_mechanics_synthesis.md](../design/09_worldbuilding_mechanics_synthesis.md): faction, region, relic, boss, and Captain's Desk synthesis.
- [../design/10_ub_systems_roadmap_from_usi.md](../design/10_ub_systems_roadmap_from_usi.md): UB-native systems roadmap translated from USI research and filtered through the visual design bible.

## Research Archive

These files are useful background, not implementation orders. Prefer the synthesis docs above when they disagree.

- [01_unnamed_space_idle_breakdown.md](01_unnamed_space_idle_breakdown.md): source-based breakdown of Unnamed Space Idle mechanics, pacing, UI, automation, and lessons.
- [02_unnamed_space_idle_ui_layout_teardown.md](02_unnamed_space_idle_ui_layout_teardown.md): source-based teardown of USI's desktop screen contract and translation rules for this prototype.
- [03_bullet_heaven_steam_genre_research.md](03_bullet_heaven_steam_genre_research.md): Steam-focused learnings from Vampire Survivors, Brotato, Halls of Torment, Deep Rock Galactic: Survivor, 20 Minutes Till Dawn, Soulstone Survivors, Death Must Die, and Nordic Ashes.
- [05_gemini_bullet_heaven_research_response.md](05_gemini_bullet_heaven_research_response.md): condensed external-model response pasted by the user. Treat as brainstorm/synthesis, not verified source truth.
- [06_user_worldbuilding_mechanics_brainstorm.md](06_user_worldbuilding_mechanics_brainstorm.md): preserved user brainstorm for factions, regions, relics, bosses, and exploration mechanics.
- [07_unnamed_space_idle_systems_todo.md](07_unnamed_space_idle_systems_todo.md): tactical carryover backlog for USI-inspired sectors, waves, bosses, routes, prestige, Arsenal milestones, and defense systems.
- [08_unnamed_space_idle_mid_late_mechanics_survey.md](08_unnamed_space_idle_mid_late_mechanics_survey.md): source-based survey of USI mid/late systems including Challenges, Task List, Capital Gameplay, Reinforce, Fleet, AI automation, and UB translations.

## External Prompts

- [04_external_bullet_heaven_research_handoff.md](04_external_bullet_heaven_research_handoff.md): copy-ready prompt for asking Gemini, Claude, or another model for broader genre research.
- [claude_review_prompt.md](claude_review_prompt.md): older Claude review prompt. Use only if you need the original review framing.
- [../project_management/10_development_start_prompt.md](../project_management/10_development_start_prompt.md): older implementation-start prompt for a development agent.
- [../project_management/11_open_sea_combat_ui_handoff_prompt.md](../project_management/11_open_sea_combat_ui_handoff_prompt.md): current copy-ready prompt for continuing the open-sea combat UI prototype.

## Broader Design Docs

These remain useful, but some details predate the web prototype and the open-sea pivot.

- [../design/02_pirate_unfolding_idle_concept.md](../design/02_pirate_unfolding_idle_concept.md): original pirate-system translation.
- [../design/03_mvp_and_technical_plan.md](../design/03_mvp_and_technical_plan.md): Godot-first technical plan and MVP scope.
- [../design/04_progression_content_taxonomy.md](../design/04_progression_content_taxonomy.md): resources, unlocks, content categories, formulas, and data tables.
- [../design/06_visual_design_bible.md](../design/06_visual_design_bible.md): visual direction, palette, UI tone, and production guidance.
- [../design/10_ub_systems_roadmap_from_usi.md](../design/10_ub_systems_roadmap_from_usi.md): system-by-system todo list with design fit, mechanical brief, UI language, research prompts, and open questions.
- [../project_management/07_mvp_pm_handoff.md](../project_management/07_mvp_pm_handoff.md): older PM handoff.
- [../project_management/08_mvp_execution_board.md](../project_management/08_mvp_execution_board.md): older milestone task board.
- [../project_management/09_sprint_01_lane_1_playable.md](../project_management/09_sprint_01_lane_1_playable.md): older Sprint 01 plan.

## Current Implementation Priority

1. Make the combat window read as open sea, not UI tokens on a lane.
2. Make the Arsenal data-driven and multi-upgrade.
3. Add a Spyglass / At the Horizon preview so counters are telegraphed.
4. Add a Harpoon unlock before armor-heavy enemies punish cannon builds.
5. Give Doubloons an early sink.
6. Make upgrades visibly change projectiles, reload rhythm, smoke, reward bursts, or enemy reactions.
7. Reduce reliance on the combat log; show important events in the water.

## Source Links

Primary sources and Steam/store links live inside the individual research docs. Keep this index short so it stays useful as a navigation page.
