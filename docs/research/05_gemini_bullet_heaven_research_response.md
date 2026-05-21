# Gemini Bullet Heaven Research Response

Date received: 2026-05-21

Source: Gemini response pasted by the user into the Codex thread.

Status: external model research/synthesis. Use as design input, not as verified source truth. Where exact facts matter, verify against official Steam pages, developer posts, patch notes, or game wikis.

## Executive Summary

Gemini's core recommendation is to translate Bullet Heaven feedback loops into Unearned Bounty's idle-unfolding structure:

- Shift away from a static lane toward a dynamic open-sea encounter window.
- Make every upgrade produce a visible water/combat effect.
- Use Salvage for continuous scaling.
- Use Doubloons, boss drops, blueprints, crew, and relics for discrete "build came online" moments.
- Let the player feel like a captain making strategic choices, not a spectator watching a spreadsheet.

The strongest quoted conclusion:

> By ensuring every upgrade - whether funded by Salvage or Doubloons - has a distinct visual tell on the water, the idle experience transforms from watching a spreadsheet to commanding a growing, chaotic, and satisfying naval broadside.

## Surveyed Games

| Game | Gemini's core focus | Key transferable lesson |
| --- | --- | --- |
| Vampire Survivors | Pure horde survival | Weapon evolutions create massive power spikes |
| Brotato | Wave/shop arena survival | Short waves plus shop/build decisions create strong cadence |
| Halls of Torment | ARPG-flavored survivor-like | Elite drops and quest goals make runs feel authored |
| Deep Rock Galactic: Survivor | Mining and pathing survivor-like | Non-combat objectives create risk/reward movement |
| 20 Minutes Till Dawn | Active aiming and synergy | Status effects are powerful visual shorthand |
| Soulstone Survivors | High-chaos ARPG survivor-like | Telegraphing is essential when VFX density rises |
| Death Must Die | Blessing/gear-driven survivor RPG | Out-of-combat loot and inventory create pacing breaks |
| Nordic Ashes | Constellation progression | Visible trees help players plan builds |
| Army of Ruin | Auto-shooter purity | Constant micro-unlocks keep players hooked |
| Rogue: Genesia | Survivor plus node-map structure | Encounter choice adds agency to auto-combat |

## Cross-Genre Patterns

Gemini identified these broad patterns:

- Automatic combat feels active when build-routing, cooldown timing, and reward selection remain meaningful.
- Upgrades become satisfying when projectile size, color, quantity, fire rate, area, or behavior changes visibly.
- Waves often follow a trough -> ramp -> elite -> reward structure.
- Build identity is communicated by color palette, projectile shape, firing arc, and screen-space occupancy.
- Common mistakes include visual clutter that hides health and upgrades that remain purely mathematical.
- Pirate-specific strengths include fleet formations, broadsides, boarding actions, elemental weather, and floating salvage.
- Strict collision damage is a poor fit; naval danger should come from cannon fire, boarding, storms, armor, and boss attacks.
- For an idle/unfolding game, runs can become expeditions: push outward, return to port, spend meta resources, push farther.

## Combat View Direction

Gemini recommends a hybrid open-sea encounter:

- Use an isometric or slightly tilted top-down ocean patch.
- Keep the player ship generally centered or anchored.
- Enemies enter from edges or horizon.
- Use wakes, weather, and floating debris to create forward motion without track boundaries.
- Avoid pure late-game white-noise because the player is also reading upgrade panels.
- Use high-contrast projectile colors against dark water.
- Keep projectile lifetimes short enough that combat remains readable.

Weapon visual language:

- Long Nines: fast straight shot lines.
- Chain-shot: bouncing or disabling arcs.
- Mortars: area circles or splashes.
- Harpoons: piercing tethers.
- Grapeshot: short-range cones.
- Wards: pulsing defensive auras.

## Upgrade And Buildcraft Ideas

Gemini suggests splitting upgrades into two tempos:

- Salvage purchases: continuous base scaling.
- Boss/Doubloon/chest choices: discrete survivor-like choices that change behavior.

Suggested boss rewards:

- Blueprints.
- Captain's Relics.
- Weapon behavior changes.
- Examples: Long Nines now ignite targets; Harpoons strip armor; Mortars leave burning water.

Suggested first-hour Doubloon sink:

- Crew roster additions.
- Crew members provide passive synergies.
- Example: Master Gunner grants +1 projectile.

Suggested Harpoon introduction:

- Add a Wrecked Whaler encounter before Ironclads.
- Defeating it drops the Harpoon Blueprint.
- The UI then teaches the player to unlock/equip Harpoons before armor becomes frustrating.

Suggested taxonomy:

- Weapons: active damage sources.
- Hull/Sails: defense and mobility.
- Wards: aura defenses and magic mitigation.
- Fittings: weapon and ship augments.
- Relics: boss-drop game changers.
- Captain Orders: active cooldown abilities.

## UI Recommendations

Gemini's recommended desktop structure:

- Left third: open-sea combat window.
- Right two-thirds: upgrade and captain's desk workspace.
- Top right: active run resources and continuous upgrades.
- Middle right: Captain's Desk with Crew, Relics, and Wards.
- Bottom right: meta resources and preview timeline.

Specific UI idea:

- Add an `At the Horizon` / spyglass element that previews the next elite or boss silhouette and its primary strength, such as "Ironclad Approaching - Heavy Armor."

## First-Hour Progression Proposal

Gemini's proposed first-hour structure:

| Time | Beat |
| --- | --- |
| 0-10 min | Long Nines, Salvage gathering, damage/reload upgrades, visible cannon improvement |
| 10-20 min | Mini-boss introduces Doubloons, first Crew slot, spyglass previews armored enemies |
| 20-30 min | Wrecked Whaler encounter unlocks Harpoon Battery |
| 30-45 min | Multi-weapon synergies, Harpoons strip armor, first proper boss |
| 45-60 min | Boss drops Relic, world map/next region opens, return-to-port/prestige begins |

## Boss And Region Proposal

Gemini proposed:

### Region 1: Smuggler's Shallows

- Theme: reefs and light enemy schooners.
- Mid-boss: The Whaler, unlocks Harpoon.
- Region boss: The Iron Duke, heavily armored galleon.
- Required strategy: Harpoons strip armor, Long Nines finish hull.
- Reward: Duke's Hull Plating, a permanent damage-reduction relic.

### Region 2: Sulfur Straits

- Theme: volcanic activity and explosive barrel ships.
- Mid-boss: The Fire-Breather, unlocks fire weapon.
- Region boss: The Brimstone Fleet, several fast encircling ships.
- Required strategy: area damage or mortars.
- Reward: Volcanic Core, attacks can explode on impact.

## Biases Gemini Challenged

- Combat does not need to mimic Unnamed Space Idle's vertical battlefield exactly.
- Upgrades do not all need to be permanent resource purchases.
- Waves do not need to be shown as a checklist.
- The first weapon should not only have one upgrade.
- Doubloons should not only be saved for lane/region unlocks.
- Idle combat can include active decisions through Captain Orders or timed choices.

## Prioritized Ideas From Gemini

Quick wins:

- Add player ship wake.
- Add cannon smoke and screen shake.
- Add basic Doubloon shop.
- Add blueprint drop text when elites die.
- Use scrolling ocean/wake background.
- Consolidate overlapping damage numbers.
- Add spyglass next-enemy preview.
- Scale Long Nine projectile size with upgrade level.
- Add armor-tink feedback for ineffective hits.
- Hide/reveal Harpoon unlock button based on progression.

Medium-scope:

- Move fully from track/lane to open-water 360-degree encounter.
- Implement Harpoon logic: piercing, tethering, armor break.
- Add Crew Desk UI.
- Replace wave checklist with Threat Level.
- Add enemy visual status effects: burning, armor stripped, warded.
- Add intermittent 1-of-3 choice rewards.
- Add Ironclad behavior.
- Add visual Salvage pickup travel to resource bank.
- Add Captain Orders.
- Replace raw combat log text with critical-event highlights.

Larger systems:

- Shipyard prestige: Sloop -> Brig -> Galleon.
- Fleet Command with allied ships.
- Trade Routes for passive/offline rewards.
- Weather system.
- Notoriety/Bounty Board.
- Modular ship building with firing arcs.
- Captain's Quarters trophy/relic display.
- Faction alignment.
- Background expeditions.
- Very long-term raid boss / Leviathan progression.
