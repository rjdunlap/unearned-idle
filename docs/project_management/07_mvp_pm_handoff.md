# MVP Project Management Handoff

Handoff date: 2026-05-21

Audience: project management agent beginning MVP development for the Unearned Bounty idle project.

## Current Repository State

The repository began as an empty git repo. It now contains research, design, visual direction, and MVP planning docs, but no Godot project files yet.

Start with these docs:

- `README.md`: repo entry point.
- `docs/research/00_handoff_index.md`: research package index.
- `docs/design/03_mvp_and_technical_plan.md`: current MVP and technical plan.
- `docs/design/04_progression_content_taxonomy.md`: systems, resources, content taxonomy, Infamy/Bounty tables.
- `docs/design/05_senior_design_review.md`: senior critique, scope warnings, first-hour sketch, missing specs.
- `docs/design/06_visual_design_bible.md`: visual design direction, mobile layout, palette, asset brief.

Important: Claude's review and follow-up edits changed the MVP direction. Treat the later docs as the current direction: Ship's Bearing replaces Chartwork, Lore is merged into Charts, Stormheart/Haven/Trials/Maelstrom/Crew are post-MVP, and Bounty/Infamy is identity-critical.

## Product Goal

Build a playable Godot MVP for a mystical pirate unfolding idle game inspired structurally by Unnamed Space Idle and visually/thematically by Unearned Bounty.

The MVP must prove:

- Auto-combat through Sea Lanes is readable and satisfying.
- Weapon and defense counters create meaningful loadout choices.
- Relic drops become buildcraft through the Relic Compass.
- Artificing adds permanent mastery without overwhelming the player.
- Ship's Bearing creates captain-like stance decisions.
- Bounty Contracts give each run named goals.
- Return to Port prestige feels earned and makes the next run visibly faster.
- Save/load and offline gains are trustworthy.

## MVP Scope Lock

### In MVP

| System | Scope |
| --- | --- |
| Sea Lane combat | 20 lanes, waves, bosses, Stormwall diagnostic |
| Ship Arsenal | 4 weapons, 3 defenses, 2 fittings, milestone examples |
| Ship's Bearing | 4 stances, momentum buildup, simple display |
| Artificing | 5 recipes, 4 modules, permanent recipe mastery |
| Relic Compass | 2 slot colors, 6 relics, resonance, constellation previews |
| Cartography | 1 branch, Charts only, passive chart gain |
| Bounty/Infamy | 10 contracts, 4 bounty hunters, Infamy Marks prestige currency |
| Return to Port | first prestige loop, preview, Infamy Tree MVP nodes |
| Automation | Auto-Advance and one Loadout Slot only |
| Foundation | save/load, offline gains, data-driven content, debug tools |

### Out Of MVP

Do not schedule these until the MVP proves its core loop:

- Stormheart Furnace.
- Hidden Haven.
- Trials.
- Maelstrom Voyages.
- Full crew system.
- Grand Expedition second prestige.
- Armada Campaigns.
- Full faction standing UI.
- Large automation tree.
- Monetization.

## Scope Reconciliation

The senior review warns that the MVP was too large. The latest docs still include Bearing and Bounty because they solve two identity problems:

- Ship's Bearing makes the old Chartwork idea feel like captaincy.
- Bounty/Infamy makes the title and pirate fantasy mechanically central.

PM direction: keep both, but gate them. The first playable milestone should not wait for every MVP system.

Use this order:

1. Combat-only vertical slice.
2. Arsenal counters and lane map.
3. Relic Compass.
4. Artificing.
5. Bounty/Infamy.
6. Ship's Bearing.
7. Cartography.
8. Return to Port.
9. Offline polish and automation.

If velocity is poor, cut depth from Artificing, Bearing, or Bounty, not the combat loop, Relic Compass, save/load, or prestige preview.

## Proposed Milestones

### Milestone 0: Pre-Production Lock

Goal: remove design ambiguity before coding beyond foundation.

Deliverables:

- Lane Content Map for lanes 1-20.
- Combat Formula Spec.
- Prestige Reward Table for first 3 Returns to Port.
- Bounty Contract System Spec for lanes 1-20.
- Rough UI wireframe validated against visual bible.
- Godot project created with target platform and folder conventions.

Exit criteria:

- Every lane has enemy families, boss, drops, unlocks, and tuning targets.
- Every MVP resource has an introduction point and icon placeholder.
- The first 90 minutes of play can be described lane by lane.

### Milestone 1: Combat-Only Playable

Goal: prove the heartbeat before secondary systems.

Deliverables:

- Godot project foundation.
- Fixed-step simulation.
- Sea Lane combat for lanes 1-5.
- Player ship stats: hull, ward, damage, speed.
- Enemy stats: hull, armor, ward, evasion.
- Salvage drops and basic Arsenal upgrades.
- Save/load of current run state.
- Debug panel for lane/resource/time simulation.

Exit criteria:

- Player can idle through Lane 1, buy upgrades, beat a boss, and enter Lane 2.
- Wrong weapon vs armor/ward is visibly worse than correct weapon.
- Combat state survives closing and reopening.
- A non-designer can tell what is happening on screen.

### Milestone 2: MVP Combat Spine

Goal: complete the 20-lane combat path and core loadout loop.

Deliverables:

- Lanes 1-20 implemented from Lane Content Map.
- 4 enemy families: Privateers, Ironclads, Hexed Corsairs, Reef Beasts.
- 4 weapons: Long Nine Cannons, Harpoon Battery, Firepot Mortar, Shrine Lantern.
- 3 defenses: Ironwood Hull, Saltward Plating, Nimble Rigging.
- 2 fittings: Salvage Nets, Crow's Nest Glass.
- Bosses at planned lanes.
- Stormwall diagnostic.

Exit criteria:

- First wall appears naturally around lanes 10-12.
- First prestige temptation appears around lanes 15-20.
- Player can inspect why they are stuck.

### Milestone 3: First Unfolding Systems

Goal: test the systems that make this more than a combat upgrade loop.

Deliverables:

- Relic Compass with 2 slot colors, 6 relics, resonance, and ghosted constellation links.
- Artificing with 5 recipes, 4 modules, and recipe mastery persistence.
- Ship's Bearing with 4 stances and momentum.
- Cartography with 1 branch and Charts resource.
- Bounty Contracts with 3 active slots, 10 MVP contracts, and Infamy counter.

Exit criteria:

- Relic slotting causes visible build changes.
- Artificing feels like commissioning improvements, not a duplicate upgrade shop.
- Bearing switching has a clear tradeoff and visual state.
- At least one contract changes the player's current objective.
- Charts do not feel like an extra chore resource.

### Milestone 4: First Prestige Loop

Goal: prove Return to Port.

Deliverables:

- Infamy Marks earned from run performance.
- Prestige preview: resets, persists, unlocks, marks gained.
- Infamy Tree MVP nodes.
- Return to Port reset logic.
- Auto-Advance unlock.
- Loadout Slot unlock.
- Offline summary.

Exit criteria:

- After first Return to Port, player reaches prior best lane in roughly 40-50% of original time.
- Player understands what reset and what persisted.
- Prestige grants at least one meaningful choice, not only a multiplier.

### Milestone 5: MVP Polish and Playtest

Goal: make the MVP playable enough for outside feedback.

Deliverables:

- Mobile-first main UI pass.
- Tooltips and tap-to-pin explanations.
- Resource strip with rates.
- Next unlock tracker.
- Basic audio/VFX placeholders for cannon, relic slotting, contract completion, prestige.
- Balance pass using simulated and real playtime.
- Playtest script and feedback form.

Exit criteria:

- 3 external players complete first Return to Port.
- At least 2 players can explain why a weapon counter matters.
- At least 2 players understand what prestige preserved.
- No critical save/load or offline bugs.

## First Backlog

Use this as the initial task board. Keep each ticket small enough for one agent pass where possible.

### Project Setup

- Create Godot project in repo.
- Add folder structure: `autoload/`, `scenes/`, `scripts/`, `data/`, `assets/placeholder/`, `tests/` if using test tooling.
- Add `GameState`, `Sim`, `Balance`, and `Definitions` autoloads.
- Add save file versioning and migration placeholder.
- Add debug overlay for resources, lane jump, speed multiplier, save/load, reset.

### Data Definitions

- Create JSON schemas or example files for resources, lanes, enemies, weapons, upgrades, bearings, recipes, modules, relics, constellations, research, contracts.
- Author placeholder definitions for lanes 1-5.
- Author full resource list with persistence tiers.
- Author weapon and enemy family definitions for MVP.

### Combat

- Implement fixed-step combat tick.
- Implement lane progression: waves, boss, clear, next lane.
- Implement damage vs hull/armor/ward/evasion.
- Implement reward drops.
- Implement Arsenal upgrade purchase and cost curve.
- Implement combat UI: player ship, enemy, HP/ward bars, lane progress, current drops.
- Implement basic diagnostics: "Armor high, use Harpoons" style.

### Save/Offline

- Save run state and persistent state separately.
- Snapshot income rates at save time.
- Apply offline gains with a 4-hour MVP cap and 0.6 efficiency.
- Show offline summary on load.
- Add manual save/load/reset debug buttons.

### Content Specs To Write Before Full Implementation

These are design tickets, not code tickets:

- Lane Content Map lanes 1-20.
- Bounty Contract Spec lanes 1-20.
- Combat Formula Spec.
- Prestige Reward Table.
- UI Layout Wireframe, based on `docs/design/mobile_ui_wireframe.svg`.
- MVP asset placeholder list.

## Recommended Team/Agent Roles

If multiple agents are available, split by ownership:

- PM/Producer: owns scope lock, milestone tracking, acceptance criteria, playtest checklist.
- Systems Designer: owns lane map, formulas, prestige table, contract definitions.
- Godot Foundation Engineer: owns project setup, save/load, simulation, data loading.
- Combat/UI Engineer: owns combat scene, lane view, Arsenal UI, diagnostics.
- Content Implementer: owns JSON definitions and tuning values.
- Visual/UI Designer: owns mobile layout, placeholder art direction, icon and palette adherence.
- QA/Playtest Agent: owns milestone verification, regression list, playtest observations.

Avoid overlapping write scopes. For example, one agent owns `data/lanes.json`; another owns `scripts/combat/`.

## Acceptance Criteria Summary

MVP is not accepted until:

- A fresh player can reach first Return to Port without debug tools.
- The first Return to Port can be completed and the second run is faster.
- Save/load works before and after prestige.
- Offline gains work and are summarized.
- The player can identify at least one weapon counter.
- The player can slot a relic and see its effect.
- The player can complete at least one Bounty Contract.
- The UI is usable at portrait mobile size.
- The project has no critical data-loss bugs.

## Risks and Controls

| Risk | Control |
| --- | --- |
| MVP scope creeps into full game | Lock post-MVP systems out of sprint board until first prestige loop is playable |
| Combat is boring but secondary systems hide it | Build combat-only milestone first |
| Too many resources too early | Enforce resource unlock order: Salvage, Doubloons, Craft Materials, Relic Fragments, Charts, Infamy |
| Bounty becomes a shallow checklist | Make contracts named and visible; tie Infamy to prestige |
| Relic Compass becomes opaque | Use ghosted constellation previews and a Relic Logbook |
| Mobile UI gets too dense | Use visual bible; test at 360x800 every milestone |
| Save/offline bugs undermine trust | Implement save/load in Milestone 1, not at the end |
| Art direction drifts generic | Use `06_visual_design_bible.md` for silhouettes, palette, and UI rules |

## Open Decisions

Resolve these early:

- Title: keep `Unearned Bounty Idle` internally, or choose a production codename such as `Saltglass Captain` or `Raise New Colors`.
- Godot version: choose and document version before project creation.
- Data format: JSON for balance-heavy content is recommended; Resource classes for logic-heavy relics may be added later.
- Big numbers: use native float for MVP unless playtest numbers exceed comfortable ranges.
- Target aspect: portrait mobile first, desktop/tablet expansion second.
- Visual implementation: 2D sprites vs stylized 3D ships for MVP placeholders. The visual bible supports either, but mobile readability is mandatory.

## PM Agent First Actions

1. Create an issue/task board from the backlog above.
2. Mark all post-MVP systems as explicitly out of scope.
3. Write or assign the Lane Content Map before asking engineers to implement lanes beyond Lane 5.
4. Confirm Godot version and project folder structure.
5. Schedule Milestone 1 as the first build target: combat-only playable with save/load.
6. Define a playtest checklist for combat readability before adding Relics, Artificing, Bearing, or Bounty.
7. Keep the MVP acceptance criteria visible in every sprint review.

## Suggested First Sprint

Sprint length: 1 week if solo, 2 weeks if coordinating multiple agents.

Sprint goal: Godot foundation plus Lane 1 playable.

Sprint tickets:

- Create Godot project and folder structure.
- Implement `GameState`, `Sim`, `Balance`, `Definitions`.
- Add resources: Salvage and Doubloons.
- Add Lane 1 data: Privateer patrol, boss, rewards.
- Add player starter ship data.
- Implement basic combat tick.
- Implement Arsenal upgrade purchase for Long Nine Cannons.
- Implement save/load.
- Implement debug overlay.
- Add placeholder main UI with combat viewport, resource strip, and Arsenal button.

Sprint demo:

- Start new game.
- Watch ship fight Lane 1 enemies automatically.
- Earn Salvage.
- Buy cannon upgrade.
- Defeat Lane 1 boss.
- Save, close/reload, and continue from correct state.

