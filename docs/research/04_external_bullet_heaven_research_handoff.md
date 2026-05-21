# External Research Handoff: Bullet Heaven Genre Ideas

Date: 2026-05-21

Use this as a copy-ready prompt for Gemini, Claude, or another research model. The goal is to get broader genre research and improvement ideas for Unearned Bounty without asking for a clone of Vampire Survivors or any other game.

## Copy-Ready Prompt

I am designing a pirate-themed unfolding idle game called Unearned Bounty. The current web prototype is an HTML5/TypeScript idle combat slice inspired structurally by Unnamed Space Idle, but the fantasy is age-of-exploration pirate ships, open-sea combat, upgradeable weapons, ship design, bosses, and long-term unfolding mechanics.

I want you to do broad research into Vampire Survivors and other Bullet Heaven / survivor-like games on Steam, then translate the best genre lessons into improvement ideas for this pirate idle game.

Important framing:

- Do not propose cloning Vampire Survivors, Brotato, Deep Rock Galactic: Survivor, Halls of Torment, or any other game.
- Extract reusable design principles: pacing, upgrade cadence, combat readability, reward feel, build identity, boss structure, meta progression, UI clarity, and risk/reward loops.
- The current combat should not be described as a literal "lane." We are moving away from that. The desired visual metaphor is an open-sea encounter window: ships in waterspace, horizon threats, wakes, fleet pressure, broadsides, projectiles, and boss arrivals.
- The player should be able to watch their ship fighting while making upgrade and build decisions on the right side of the screen.
- The game is idle-adjacent: automatic combat is good, but the player should still feel like a captain making strategic choices.

Current prototype context:

- Desktop layout: left third is combat, right two-thirds are upgrades and ship mechanics.
- Combat: player ship, enemy ship, waves, boss, projectiles, damage numbers, hull bars, combat log.
- Current weapon: Long Nine Cannons.
- Existing future weapon: Harpoon Battery, intended to counter armored Ironclads.
- Resources: Salvage and Doubloons.
- Current first upgrade: Long Nine: Powder Charge, a damage upgrade with doubling salvage cost.
- Known issue: Doubloons currently have no sink.
- Known issue: Harpoon Battery exists in data but does not yet have a purchase/unlock flow.
- Known issue: the combat view needs to feel more like ships fighting in open water and less like UI tokens on a track.

Please research and compare at least 8-12 relevant games, including but not limited to:

- Vampire Survivors
- Brotato
- Halls of Torment
- Deep Rock Galactic: Survivor
- 20 Minutes Till Dawn
- Soulstone Survivors
- Death Must Die
- Nordic Ashes: Survivors of Ragnarok
- Army of Ruin
- Rogue: Genesia
- Boneraiser Minions
- Time Wasters
- Yet Another Zombie Survivors
- Spellbook Demonslayers

For each game, summarize:

- Core loop and session structure.
- Upgrade cadence and how often the player makes choices.
- How combat readability is preserved during chaos.
- How weapons/builds become visually distinct.
- How bosses or elites change pacing.
- How meta progression works between runs.
- Any UI patterns worth borrowing or avoiding.
- Any lessons that translate well to an idle pirate ship game.

Then synthesize across the genre:

1. What makes automatic combat feel active and satisfying?
2. What makes upgrades feel immediately visible?
3. What are the best ways to structure waves, bosses, and reward bursts?
4. How should build identity be communicated visually?
5. What are common genre mistakes?
6. What systems would work especially well for a pirate ship fantasy?
7. What systems would be a poor fit and should be avoided?
8. How can this genre inform an idle/unfolding game rather than a run-based roguelite?

Finally, produce actionable recommendations for Unearned Bounty:

- 10 quick wins for the current web prototype.
- 10 medium-scope improvements for combat, upgrades, and UI.
- 10 larger system ideas for future unfolding mechanics.
- A suggested first-hour progression flow.
- A suggested boss/reward structure for the first two sea regions.
- A suggested upgrade taxonomy for weapons, hull, sails, wards, fittings, relics, and captain orders.
- Ideas for making Doubloons useful.
- Ideas for revealing and unlocking Harpoon Battery before armored enemies become frustrating.
- Ideas for making the open-sea combat window feel alive without overwhelming the player.

Please cite sources and prefer official Steam pages, official websites, developer posts, patch notes, wikis, or reputable articles. Make clear when you are inferring design lessons from screenshots, videos, or store descriptions.

## Current Local Research Already Done

These local docs exist in the project and can be used as background if available:

- `docs/research/01_unnamed_space_idle_breakdown.md`
- `docs/research/02_unnamed_space_idle_ui_layout_teardown.md`
- `docs/research/03_bullet_heaven_steam_genre_research.md`
- `docs/design/07_web_combat_upgrade_layout_notes.md`

The most important local conclusion so far:

> When the player buys an upgrade, the ocean should show it.

That means upgrades should produce visible combat changes: more shots, faster reload, wider arcs, piercing harpoons, burning water, ward pulses, enemy armor breaks, better pickup bursts, bigger boss damage, or safer hull recovery.

## Desired Output Format

Use this structure:

1. Executive Summary
2. Surveyed Games Table
3. Per-Game Notes
4. Cross-Genre Patterns
5. Lessons For Pirate Idle Combat
6. Upgrade And Buildcraft Recommendations
7. UI / Layout Recommendations
8. First-Hour Progression Proposal
9. Boss And Region Proposal
10. Risks And Anti-Patterns
11. Prioritized Backlog
12. Sources

Keep the recommendations practical. The best answers should help a developer decide what to implement next in the prototype.

## Specific Questions To Answer

- Should the first combat view emphasize broadside, pursuit, fleet horizon, or a hybrid open-sea encounter?
- How can we make pirate ship weapons as visually legible as Bullet Heaven weapon builds?
- How often should an idle version offer upgrade choices compared to a run-based survivor-like?
- Should upgrades be bought continuously with resources, offered as wave rewards, or both?
- How can boss rewards create "build came online" moments?
- What should Doubloons buy in the first hour?
- How should the Harpoon Battery be introduced before Ironclads?
- How can the UI preview future weapons and counters without overwhelming the first screen?
- What is the right amount of projectile chaos for an idle game where the player is also reading upgrade panels?
- How can meta progression feel pirate-specific instead of generic stat upgrades?

## Current Design Bias To Challenge

Please challenge these assumptions:

- That the combat needs to mimic Unnamed Space Idle's vertical battlefield exactly.
- That all upgrades should be permanent resource purchases.
- That waves need to be shown as a checklist.
- That the first weapon should only have one upgrade.
- That Doubloons should be saved only for lane/region unlocks.
- That idle combat must avoid active decisions entirely.

Good research should include alternative layouts and progression models, then explain which are best for this project and why.
