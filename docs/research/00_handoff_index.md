# Pirate Unfolding Idle Research Handoff

Research date: 2026-05-21

This folder captures research and early planning for a game that borrows the structural strengths of Unnamed Space Idle while translating them into the age-of-exploration, mystical pirate identity described for Unearned Bounty.

Important local-context note: at research time the project folder contained only an empty git repository, so there was no Godot source, art, README, or prior Unearned Bounty implementation to inspect. The pirate theme assumptions below come from the user prompt: age of exploration, mystical, One Piece-like energy, and pirate themed. Avoid direct One Piece IP terms, characters, powers, locations, or naming.

## Files

- [01_unnamed_space_idle_breakdown.md](01_unnamed_space_idle_breakdown.md): source-based breakdown of Unnamed Space Idle mechanics, pacing, UI, automation, and lessons.
- [../design/02_pirate_unfolding_idle_concept.md](../design/02_pirate_unfolding_idle_concept.md): translation of USI systems into an original mystical pirate framework, including Ship's Bearing, Bounty/Infamy, and revised crew names.
- [../design/03_mvp_and_technical_plan.md](../design/03_mvp_and_technical_plan.md): practical Godot-first prototype plan scoped to the revised 5-system MVP.
- [../design/04_progression_content_taxonomy.md](../design/04_progression_content_taxonomy.md): proposed resources, unlocks, content categories, formulas, and data tables with Infamy/Bounty economy.
- [../design/05_senior_design_review.md](../design/05_senior_design_review.md): full design critique, system-by-system notes, revised MVP scope, first-hour sketch, balance guidance, and prioritized next specs.
- [../design/06_visual_design_bible.md](../design/06_visual_design_bible.md): visual direction based on Unearned Bounty, Richard Pince's concept work, and the revised idle/mobile design needs.
- [../project_management/07_mvp_pm_handoff.md](../project_management/07_mvp_pm_handoff.md): execution handoff for a project management agent to start MVP development, including milestones, scope lock, backlog, acceptance criteria, and first sprint.
- [../project_management/08_mvp_execution_board.md](../project_management/08_mvp_execution_board.md): task board, scope guardrails, parked post-MVP systems, and milestone-level acceptance checks.
- [../project_management/09_sprint_01_lane_1_playable.md](../project_management/09_sprint_01_lane_1_playable.md): first sprint plan for the Lane 1 playable slice, including Godot version lock, folder conventions, demo script, and combat readability checklist.
- [../project_management/10_development_start_prompt.md](../project_management/10_development_start_prompt.md): copy-ready prompt for handing Sprint 01 implementation to a development agent.

## One-Page Direction

Build a long-form unfolding idle game where the player commands a cursed exploration ship pushing through dangerous sea lanes. Combat is automatic but buildcraft matters: cannons, hull, sails, wards, crew roles, relic slots, island outposts, and special voyages all feed each other.

The spiritual model from Unnamed Space Idle is:

- A visible battle lane creates the heartbeat.
- Every defeated enemy feeds several progression systems.
- New systems unlock often and recontextualize older resources.
- Prestige is not just a reset. It is a way to change equipment, bank permanent gains, and make old chores faster.
- Automation is earned as part of progression.
- Late systems should either automate, cap, or transform early systems so the player is not buried under busywork.

For the pirate game, the first prototype should target:

- Sea Lane combat with lanes, waves, bosses, enemy counters, and build choices.
- Ship systems: Armaments, Hull, Sails, and Fittings.
- Three long-term layers: Chartwork, Artificing, and Relic Compass.
- A first prestige loop named Return to Port or Raise New Colors.
- A readable dense UI that feels like a captain's desk, not a marketing landing page.

## High-Confidence Design Pillars

- Captaincy over clicking: the player should make strategic routing, loadout, and timing decisions more than tap repeatedly.
- Bounty chase: progression should feel like pushing into waters nobody survives, then coming back richer, stranger, and more infamous.
- Mystical but operational: curses, sea gods, relics, and living storms should map cleanly onto resources and systems.
- Frequent new affordances: the first hour should reveal new tabs and mechanics often enough that the player trusts the horizon.
- Legible optimization: choices can matter a lot, but the UI must show why.

## Key Sources

- Unnamed Space Idle Steam page: https://store.steampowered.com/app/2471100/Unnamed_Space_Idle/
- Official Unnamed Space Idle Wiki main page: https://spaceidle.game-vault.net/wiki/Main_Page
- Gameplay overview: https://spaceidle.game-vault.net/wiki/Gameplay
- Core: https://spaceidle.game-vault.net/wiki/Core
- Compute: https://spaceidle.game-vault.net/wiki/Compute
- Synth: https://spaceidle.game-vault.net/wiki/Synth
- V-Device: https://spaceidle.game-vault.net/wiki/V-Device
- Reactor: https://spaceidle.game-vault.net/wiki/Reactor
- Research: https://spaceidle.game-vault.net/wiki/Research
- Bases: https://spaceidle.game-vault.net/wiki/Bases
- Challenges: https://spaceidle.game-vault.net/wiki/Challenges
- Warp Drive: https://spaceidle.game-vault.net/wiki/Warp_Drive
- Crew: https://spaceidle.game-vault.net/wiki/Crew
- AI: https://spaceidle.game-vault.net/wiki/AI
- Reinforce: https://spaceidle.game-vault.net/wiki/Reinforce
- Fleet: https://spaceidle.game-vault.net/wiki/Fleet
- April 28, 2026 content update notes via SteamDB: https://steamdb.info/patchnotes/22996983/
- Unnamed Space Idle V0.80 Reddit announcement: https://www.reddit.com/r/incremental_games/comments/1syedx6/unnamed_space_idle_major_content_update_v080/
- Idle design overview from Machinations: https://machinations.io/articles/idle-games-and-how-to-design-them
