# MVP Execution Board

Board date: 2026-05-21

This board turns the MVP handoff into executable work. Task IDs are local planning IDs until they are mirrored into GitHub Issues or another tracker.

## Source Of Truth

Use these documents as the current design baseline:

- `docs/project_management/07_mvp_pm_handoff.md`
- `docs/design/03_mvp_and_technical_plan.md`
- `docs/design/04_progression_content_taxonomy.md`
- `docs/design/05_senior_design_review.md`
- `docs/design/06_visual_design_bible.md`

Latest-direction rules:

- Ship's Bearing replaces Chartwork.
- Lore is merged into Charts.
- Stormheart, Haven, Trials, Maelstrom, full Crew, and Grand Expedition are post-MVP.
- Bounty, Infamy, Relic Compass, save/load, and first prestige remain identity-critical.

## Status Legend

| Status | Meaning |
| --- | --- |
| Ready | Clear enough for an owner to start. |
| Blocked | Needs a decision, dependency, or tool before work starts. |
| In progress | Currently being worked. |
| Review | Ready for PM/design/QA review. |
| Done | Accepted against the ticket's exit criteria. |
| Parked | Explicitly out of active scope. |

## Scope Guardrails

Active MVP order:

1. Combat-only vertical slice.
2. Arsenal counters and lane map.
3. Relic Compass.
4. Artificing.
5. Bounty/Infamy.
6. Ship's Bearing.
7. Cartography.
8. Return to Port.
9. Offline polish and automation.

Non-negotiable MVP proof points:

- Sea Lane combat is readable and satisfying.
- Weapon and defense counters matter.
- Relic Compass changes builds visibly.
- Save/load and offline gains are trustworthy.
- First Return to Port makes the next run visibly faster.
- At least one Bounty Contract gives a named goal.

Cut-depth policy if velocity is poor:

- Cut depth from Artificing, Bearing, or Bounty first.
- Do not cut the combat loop, counter readability, Relic Compass, save/load, or prestige preview.

## Post-MVP Parking Lot

These systems are parked until the first prestige loop is playable and reviewed:

| System | Status | Release note |
| --- | --- | --- |
| Stormheart Furnace | Parked | Defer full ether-brine boost economy. |
| Hidden Haven | Parked | Design may continue, implementation waits. |
| Trials | Parked | Requires stable core systems first. |
| Maelstrom Voyages | Parked | Midgame side content, not MVP. |
| Full Crew system | Parked | Keep references cosmetic only. |
| Grand Expedition | Parked | Second prestige layer. |
| Armada Campaigns | Parked | Late expansion. |
| Full faction standing UI | Parked | Track minimal contract faction data only if needed. |
| Large automation tree | Parked | MVP allows Auto-Advance and one Loadout Slot only. |
| Monetization | Parked | No MVP work. |

## Milestone 0: Pre-Production Lock

Goal: remove design ambiguity before coding beyond foundation.

| ID | Ticket | Owner | Status | Blocks | Acceptance |
| --- | --- | --- | --- | --- | --- |
| M0-001 | Lock Godot version and project conventions | PM/Foundation | Done | SETUP-001 | Version and folder conventions documented in `09_sprint_01_lane_1_playable.md`. |
| M0-002 | Lane Content Map for lanes 1-20 | Systems Designer | Ready | DATA-006, M2 | Every lane has enemy families, boss, drops, unlocks, and tuning target. |
| M0-003 | Combat Formula Spec | Systems Designer | Ready | COMBAT-001 | Damage, mitigation, speed, rewards, and diagnostics are formula-defined. |
| M0-004 | Prestige Reward Table for first 3 Returns | Systems Designer | Ready | PRESTIGE-001 | Marks gained, reset/persist rules, and first tree choices are specified. |
| M0-005 | Bounty Contract System Spec for lanes 1-20 | Systems Designer | Ready | CONTRACT-001 | 10 contracts, 4 hunters, rewards, Infamy rules, expiry rules. |
| M0-006 | UI Layout Wireframe validation | UI/Visual | Ready | UI-001 | Main mobile layout matches visual bible and 360x800 target. |
| M0-007 | MVP asset placeholder list | Visual/UI | Ready | UI-001 | Every MVP resource, enemy family, weapon, and tab has placeholder icon direction. |
| M0-008 | Project creation readiness check | Foundation | Blocked | SETUP-001 | Local Godot binary not found; install or provide path before editor validation. |
| M0-009 | Combat readability playtest checklist | PM/QA | Done | QA-001 | Checklist drafted in `09_sprint_01_lane_1_playable.md`. |

## Milestone 1: Combat-Only Playable

Goal: prove the combat heartbeat with lanes 1-5 before adding secondary systems.

| ID | Ticket | Owner | Status | Depends on | Acceptance |
| --- | --- | --- | --- | --- | --- |
| SETUP-001 | Create Godot project shell | Foundation | Ready | M0-001, M0-008 | Project opens in locked Godot version with mobile portrait settings. |
| SETUP-002 | Add folder structure | Foundation | Ready | SETUP-001 | `autoload/`, `scenes/`, `scripts/`, `data/`, `assets/placeholder/`, `tests/` exist. |
| SETUP-003 | Add autoload stubs | Foundation | Ready | SETUP-001 | `GameState`, `Sim`, `Balance`, and `Definitions` are registered autoloads. |
| DATA-001 | Define MVP resources | Content | Ready | SETUP-002 | Salvage and Doubloons implemented for Sprint 1; full resource list documented. |
| DATA-002 | Author Lane 1 data | Content | Ready | DATA-001 | Privateer patrol, Lane 1 boss, rewards, and unlocks load from data. |
| DATA-003 | Author starter ship data | Content | Ready | DATA-001 | Hull, ward, damage, speed, and starter weapon defined. |
| DATA-004 | Author Long Nine Cannons upgrade | Content | Ready | DATA-001 | Upgrade has cost curve and visible stat effect. |
| DATA-005 | Author lanes 2-5 placeholder data | Content | Ready | M0-003 | Ironclad counter test appears by Lane 2. |
| DATA-006 | Author lanes 1-20 final data | Content | Blocked | M0-002 | Full lane set matches Lane Content Map. |
| COMBAT-001 | Implement fixed-step combat tick | Foundation/Combat | Ready | M0-003, SETUP-003 | Simulation produces deterministic combat at chosen tick rate. |
| COMBAT-002 | Implement lane waves and boss clear | Combat | Ready | COMBAT-001, DATA-002 | Player can beat Lane 1 boss and advance to Lane 2. |
| COMBAT-003 | Implement defense layers | Combat | Ready | M0-003 | Hull, armor, ward, and evasion affect incoming damage. |
| COMBAT-004 | Implement rewards | Combat | Ready | COMBAT-002, DATA-001 | Salvage drops from kills; Doubloons from boss. |
| ARSENAL-001 | Implement Arsenal purchase flow | Combat/UI | Ready | DATA-004, COMBAT-004 | Player can buy Long Nine upgrade and see combat improve. |
| SAVE-001 | Save run and persistent state separately | Foundation | Ready | SETUP-003 | Save file includes version and migration placeholder. |
| SAVE-002 | Load combat state | Foundation | Ready | SAVE-001, COMBAT-002 | Closing and reopening restores lane, resources, upgrades, and enemy state. |
| UI-001 | Build placeholder main UI | UI | Ready | SETUP-001 | Sea lane, resource strip, ship/enemy bars, lane progress, Arsenal button visible. |
| UI-002 | Add debug overlay | Foundation/UI | Ready | SETUP-003 | Lane jump, resource add, speed multiplier, save/load, and reset controls exist. |
| UI-003 | Add basic diagnostics | Combat/UI | Ready | COMBAT-003 | Stuck state can say why, such as high armor or high ward. |
| QA-001 | Run Milestone 1 smoke test | QA | Ready | SAVE-002, UI-003 | Lane 1 loop, upgrade purchase, boss clear, and save/load pass. |

## Milestone 2: MVP Combat Spine

Goal: complete the 20-lane combat path and loadout counter loop.

| ID | Ticket | Owner | Status | Depends on | Acceptance |
| --- | --- | --- | --- | --- | --- |
| DATA-007 | Implement 4 enemy families | Content/Combat | Ready | M0-002, COMBAT-003 | Privateers, Ironclads, Hexed Corsairs, and Reef Beasts have readable profiles. |
| ARSENAL-002 | Implement 4 MVP weapons | Combat/UI | Ready | COMBAT-003 | Long Nine, Harpoon Battery, Firepot Mortar, Shrine Lantern are selectable. |
| ARSENAL-003 | Implement 3 MVP defenses | Combat/UI | Ready | COMBAT-003 | Ironwood Hull, Saltward Plating, Nimble Rigging affect survival/speed. |
| ARSENAL-004 | Implement 2 MVP fittings | Combat/UI | Ready | ARSENAL-001 | Salvage Nets and Crow's Nest Glass provide utility. |
| COMBAT-005 | Implement lanes 1-20 | Combat/Content | Blocked | DATA-006 | Player can progress through all MVP lanes. |
| COMBAT-006 | Add bosses and Stormwall diagnostic | Combat/UI | Ready | COMBAT-005 | First natural wall appears around lanes 10-12 and is inspectable. |
| QA-002 | Combat spine balance pass | QA/Systems | Ready | COMBAT-006 | First prestige temptation appears around lanes 15-20. |

## Milestone 3: First Unfolding Systems

Goal: test the systems that make the game more than a combat upgrade loop.

| ID | Ticket | Owner | Status | Depends on | Acceptance |
| --- | --- | --- | --- | --- | --- |
| RELIC-001 | Implement Relic Compass slots | Combat/UI | Ready | COMBAT-005 | Two slot colors, six relics, resonance, and visible stat changes. |
| RELIC-002 | Add constellation previews and logbook | UI/Content | Ready | RELIC-001 | Ghosted links show what players are aiming for. |
| ART-001 | Implement Artificing recipes | Systems/UI | Ready | DATA-001 | Five recipes and four modules with persistent mastery. |
| CONTRACT-001 | Implement Bounty Contracts | Systems/UI | Blocked | M0-005 | Three active slots, 10 contracts, Infamy counter. |
| BEARING-001 | Implement Ship's Bearing | Systems/UI | Ready | COMBAT-003 | Four stances, momentum buildup, switching tradeoff. |
| CART-001 | Implement Cartography branch | Systems/UI | Ready | COMBAT-005 | Charts gain passively and one branch can be spent. |
| QA-003 | First unfolding systems playtest | QA | Ready | RELIC-002, ART-001, CONTRACT-001, BEARING-001, CART-001 | At least one system changes player objective or build. |

## Milestone 4: First Prestige Loop

Goal: prove Return to Port.

| ID | Ticket | Owner | Status | Depends on | Acceptance |
| --- | --- | --- | --- | --- | --- |
| PRESTIGE-001 | Implement Infamy Marks formula | Systems | Blocked | M0-004, CONTRACT-001 | Marks are earned from run performance and previewed. |
| PRESTIGE-002 | Build prestige preview screen | UI | Ready | PRESTIGE-001 | Reset, persist, unlock, and marks gained are explicit. |
| PRESTIGE-003 | Implement Return to Port reset logic | Foundation | Ready | PRESTIGE-002, SAVE-001 | Run state resets and persistent state survives correctly. |
| PRESTIGE-004 | Implement Infamy Tree MVP nodes | Systems/UI | Blocked | M0-004 | At least one meaningful first prestige choice exists. |
| AUTO-001 | Unlock Auto-Advance | Foundation/UI | Ready | PRESTIGE-003 | Second run advances early lanes without babysitting. |
| AUTO-002 | Unlock one Loadout Slot | UI/Foundation | Ready | PRESTIGE-003 | Player can preserve one loadout setup. |
| OFFLINE-001 | Implement offline summary | Foundation/UI | Ready | SAVE-001 | Offline gains are capped, efficient, and summarized. |
| QA-004 | Prestige loop verification | QA | Ready | OFFLINE-001 | Second run reaches prior best lane in 40-50% of original time target. |

## Milestone 5: MVP Polish And Playtest

Goal: make the MVP readable enough for external feedback.

| ID | Ticket | Owner | Status | Depends on | Acceptance |
| --- | --- | --- | --- | --- | --- |
| UI-004 | Mobile-first UI pass | UI/Visual | Ready | PRESTIGE-003 | Main UI is usable at 360x800 portrait. |
| UI-005 | Tooltips and tap-to-pin | UI | Ready | UI-004 | Core mechanics are explainable without hover. |
| UI-006 | Resource strip with rates | UI | Ready | UI-004 | Current amount and rate display for unlocked resources. |
| UI-007 | Next unlock tracker | UI | Ready | UI-004 | Player always sees one near-term objective. |
| AUDIO-001 | Add placeholder audio/VFX | Audio/UI | Ready | COMBAT-006, RELIC-001, CONTRACT-001, PRESTIGE-003 | Cannon, relic slot, contract, and prestige feedback exist. |
| BAL-001 | Balance simulation and playtime pass | Systems/QA | Ready | QA-004 | First Return to Port target and second-run speed target are measured. |
| QA-005 | External playtest run | QA/PM | Ready | BAL-001, UI-005 | Three external players complete first Return to Port. |

## Current Active Slice

The active build target is Milestone 1, but do not implement lanes beyond Lane 5 until M0-002 is accepted.

Sprint 1 focuses on Lane 1 playable:

- Project shell and folder structure.
- `GameState`, `Sim`, `Balance`, and `Definitions` autoloads.
- Salvage and Doubloons.
- Lane 1 Privateer patrol and boss.
- Long Nine Cannons upgrade.
- Basic combat tick.
- Save/load.
- Debug overlay.
- Placeholder main UI.

## Review Checklist For Every Sprint

- Does the work preserve the MVP scope lock?
- Did any post-MVP system sneak into the active board?
- Is save/load still safe after the change?
- Does the UI remain usable at portrait mobile size?
- Can a non-designer explain what happened on screen?
- Is the next useful player action visible?
- Are acceptance criteria linked to observable behavior, not internal completion?
