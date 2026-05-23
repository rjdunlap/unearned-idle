# USI Mechanics Next Stage Handoff

Date: 2026-05-22

This handoff turns `docs/design/10_ub_systems_roadmap_from_usi.md` into the next practical development stage. Use it with the roadmap open. The roadmap explains the full system arc; this file defines the next slice, verification habits, and implementation guardrails.

## First Rule: Source Before Translation

When a task says "like USI" or names a USI mechanic, do not implement from memory.

Required workflow:

1. Check local research first:
   - `docs/design/10_ub_systems_roadmap_from_usi.md`
   - `docs/research/07_unnamed_space_idle_systems_todo.md`
   - `docs/research/08_unnamed_space_idle_mid_late_mechanics_survey.md`
2. If the mechanic is still ambiguous, inspect the relevant USI wiki/source page listed in `docs/research/07_unnamed_space_idle_systems_todo.md`.
3. Write down the USI behavior in one or two sentences before translating it to UB.
4. Then implement a UB-native version that fits the visual bible and current prototype.

Recent lesson: battlefield salvage/rare drops should be treated as passive visible combat pickups unless a source check proves otherwise. Do not turn a USI passive mechanic into an active timed ability just because it resembles an ability hook in code.

## Current Prototype State

The web prototype is the active development surface for these systems.

Known implemented or started:

- Sea-sector style distance progression exists through `SectorPlan`.
- Arsenal has multiple upgrade cards and milestone choices.
- Return to Port exists and resets run state.
- Muster exists as combat-earned Gunnery / Seamanship allocation.
- Combat has multiple visible ships, escorts, projectiles, and target visuals.
- Passive salvage/doubloon pickups appear over the combat sea and can be clicked.
- Active Arsenal abilities currently include Broadsides and Patch Crew.

Important caveat: the working tree may contain unrelated in-progress changes. Read files before editing and avoid reverting changes you did not make.

## Next Stage Goal

Make the prototype align with the early USI-inspired spine before adding more tabs:

- Sectors are the main progression unit.
- Visible ships are real combat entities, not decorative extras.
- Combat rewards and pickups happen in the sea, not only in the log.
- Arsenal upgrades create visible combat changes.
- First-clear boss milestones unlock systems and explain the next goal.

The target feeling is: "I am pushing through charted sea sectors, farming when stuck, sinking visible fleets, collecting wreckage, and returning to port to reconfigure."

## Priority Slice

### 1. Source-Check Passive Drops

Before more loot work, verify the USI behavior for salvage / void matter / rare battlefield drops.

Deliverable:

- Add or update a short note in the relevant research doc with:
  - what appears passively,
  - whether drops must be clicked or are auto-collected,
  - whether rare drops come from kills, time, distance, or sector rules,
  - how this maps to UB salvage, doubloons, and Ether Brine.

Implementation target after verification:

- Passive pickups should be present during normal combat.
- Salvage is common.
- Doubloons are rare and persistent.
- Ether Brine should become the future run-resetting rare drop for Stormheart Furnace.
- Pickups should remain visible long enough to read as sea objects, not frantic click targets.

### 2. Finish Multi-Ship Targeting

Current visuals already imply fleet combat. The next mechanical step is to make that contract honest.

Deliverables:

- Every visible enemy ship has hull, threat, and reward state.
- The selected target is one of the visible ships.
- Player shots hit the selected or doctrine-selected ship.
- Ignored ships create pressure by firing.
- Sunk ships remain as wreckage briefly.
- Remove remaining "primary target" mental model from UI text and code where possible.

Initial doctrines:

- Focus: keep firing at selected / boss target.
- Suppression: cycle primary and escorts.
- Scatter: randomize across visible threats.

Do not add complex target automation yet. Captain's Orders owns late automation.

### 3. Sector And Route Cleanup

Make player-facing sector language consistent and make route data ready for branches.

Deliverables:

- Continue removing player-facing "lane" text.
- Keep legacy lane ids only where migration requires them.
- Sector UI should clearly show:
  - sector number,
  - route or sea name,
  - distance to boss,
  - boss state,
  - first-clear unlock if known.
- Add route tags to sector data:
  - Trade Wind,
  - Black Reef,
  - Storm Line.

Hold / Forward rules:

- Hold should keep spawning enemies without advancing distance.
- Forward should advance toward the sector boss.
- Boss spawn remains tied to sector distance goal.

### 4. Arsenal Milestone Polish

Arsenal is the first buildcraft system, so breakpoints need to feel intentional.

Deliverables:

- Improve every-5-level milestone presentation.
- Make the current tier choice and next tier easy to read.
- Add at least one behavior-flavored choice, not only multipliers.
- Make upgrades visibly change combat:
  - smoke size,
  - shot weight,
  - impact splash,
  - recoil or timing,
  - reward pickup burst if the upgrade affects salvage.

Do not move equipment selection back into Arsenal. Ship, weapon, defense, and utility selection belongs in Return to Port.

### 5. Return To Port Reset Contract

Doc 10 currently says Muster levels and XP persist by default, but recent prototype discussion asked for Muster reset during Return to Port. Resolve this explicitly before further balancing.

Deliverable:

- Add a short decision note to doc 10 or a follow-up decision log:
  - Does Muster reset each Return to Port?
  - If yes, what persists instead: allocation unlock, best records, officer-like catch-up, or nothing?
  - If no, why should the current prototype reset be reverted?

Until resolved, do not build new systems on assumptions about Muster permanence.

## Not This Stage

Avoid starting these until the early spine is honest:

- Port Facilities / Bases.
- Officers / Crew.
- Relic Compass / V-Device.
- Captain's Ledger phase gate.
- Storm Contracts / Warp gauntlets.
- Flagship Phase.
- Legend Reset.

Exception: add small data hooks if they are needed for near-term UI previews, but do not build full tabs.

## Implementation Guardrails

- Every new system needs a visible sea effect or a physical Captain's Desk metaphor.
- Every new reward should answer "where did this come from?" in the UI.
- Prefer data-driven definitions over hardcoded one-offs.
- Keep the log secondary. The sea and desk should carry the important information.
- Add one diagnostic line per system: current blocker, next gain, or source of progress.
- Keep mobile/desktop layout from overlapping. Check both after visible UI changes.
- Do not add a new resource unless it has a reset rule, source, sink, and first UI location.

## Acceptance Checks

Before calling the next stage complete:

- `npm run build` passes in `web/`.
- Browser smoke test confirms:
  - passive pickups appear without pressing an ability,
  - clicking a pickup awards the displayed resource,
  - Broadsides and Patch Crew still activate and cool down,
  - Hold keeps combat active without distance push,
  - Forward reaches a boss,
  - boss clear preserves first-clear unlocks,
  - Return to Port preview or notes match the actual reset contract.
- If a USI reference drove a mechanic, the final note cites the local doc or wiki/source used.

## Suggested Next Prompt

Use this prompt to continue development:

> Continue the USI mechanics next-stage slice from `docs/project_management/12_usi_mechanics_next_stage_handoff.md`. Start by source-checking the relevant USI mechanic before implementation. Prioritize passive combat pickups, real multi-ship targeting, sector/route cleanup, Arsenal milestone polish, and resolving the Muster Return to Port reset contract. Keep changes scoped, verify with `npm run build`, and browser-smoke-test visible UI behavior.

