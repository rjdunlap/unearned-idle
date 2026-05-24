# Document 11 — New Mechanics Pipeline

**Date:** 2026-05-23  
**Status:** Candidates — not yet scheduled into a sprint. Each section states what the mechanic is, why it fits, and the open design questions that must be answered before it enters a sprint.

---

## Background

During a gap-analysis session (vs. pirate and Age of Exploration genre conventions) we identified seven mechanics that are either absent or only partially covered by existing systems. This document captures them for future sprint planning. They are ordered roughly from "closest to existing code" to "most experimental".

---

## 1. Treasure Maps / Stash Routes

**What it is:** Occasional loot drops or boss rewards grant a Treasure Map fragment. When a player holds all three fragments for a map they unlock a secret one-time Stash Route — a short, high-difficulty detour lane that skips normal progression and ends in a guaranteed Relic Shard cache or Doubloon windfall.

**Why it fits:** Creates meaningful lateral progression (not just forward lane push). Gives collectors a tangible secondary goal per run. Ties into existing Relic system — the shard cache reward means players can accelerate relic upgrades by map-hunting. Fits the pirate fantasy of charted secrets.

**Design questions:**
- Map fragments: how many types? All same pool, or lane-specific maps?
- Stash Route difficulty: do enemies scale to current distance, or fixed hard bracket?
- Can maps persist across runs (persistent inventory) or reset (run inventory)?
- Does Relic Hunter infamy node affect fragment drop rate?
- UI: where do fragments show — route sidebar, resource bar, or new Cartography tab?
- Do maps interact with Dead Reckoning (doc §4 below) for navigation risk?

**Earliest sprint:** Sprint 05 (after Infamy and contract expansion are stable).

---

## 2. Jolly Roger — Flag System

**What it is:** The player chooses a flag (Jolly Roger design) before each run. Flags are not cosmetic only — each grants a passive run modifier. Early flags are generic ("faster reload", "+hull"); later flags are faction-specific and interact with contracts or officer bonuses. New flags are earned by completing Trials or boss firsts.

**Why it fits:** Classic pirate identity. Gives players a pre-run planning decision beyond loadout. Creates a natural unlock loop (complete trial → earn new flag → choose new run strategy). Flags are visible in the Sea View as a decorative element that also communicates the active modifier to the player.

**Design questions:**
- How many flags at launch? Suggest 8–12 with 3 starter flags always available.
- Are flags per-run choices or equipped like Relics (persistent slot)?
- Does the flag choice interact with the Infamy system (e.g., certain flags attract more bounty hunters)?
- Faction flags: tie to existing route tags (storm_line, reef_line) or new faction faction system?
- Collision with Officer system — are flag bonuses additive with officer bonuses or multiplicative?

**Earliest sprint:** Sprint 06.

---

## 3. Voyage Omens & Superstitions

**What it is:** At the start of each voyage (run) a random Omen card is drawn and displayed. Omens are double-edged — they buff one dimension and debuff another (e.g., "Red sky at morning: cannon reload +20%, but hull repairs −30%"). Players can spend Doubloons to re-draw once. The active Omen persists until Return to Port.

**Why it fits:** Adds run variance without being a full roguelite modifier system. The Age of Sail was deeply superstitious — bad omens, albatrosses, etc. are tonally on point. Mechanically creates interesting decisions about when to return to port (end a "bad" omen run early).

**Design questions:**
- How many omen cards? Suggest 16–20 for meaningful variety without overload.
- Re-draw cost: flat Doubloon cost, or scales with run depth?
- Can Omens be "broken" mid-run by achieving a specific feat (e.g., sink 10 ships to overcome "cursed waters")?
- Where does the omen display — route sidebar, or a popup on run-start only?
- Officers: should Navigator interact with omens (better re-draw odds, or reveal omen before committing)?
- Stormheart interaction: storm-type omens could boost storm_power gain.

**Earliest sprint:** Sprint 05 alongside or after Treasure Maps.

---

## 4. Dead Reckoning — Navigation Risk

**What it is:** The existing `CourseMode` (forward/hold/retreat) is augmented with an optional "push the chart" mechanic. When the player holds forward past the safe sector distance without clearing a boss, a Dead Reckoning Risk accumulates. At each Reckoning threshold the next encounter is drawn from a harder pool (elite enemies, ambushes, or mini-boss squads). Rewards also scale up proportionally.

**Why it fits:** Addresses the current issue where "hold" mode is a dominant strategy for resource-gathering. Gives aggressive forward progress both a risk (harder enemies) and a reward (better loot rate). Dead Reckoning is historically the art of estimating position without landmarks — perfect metaphor for pushing into uncharted waters.

**Design questions:**
- What is the reckoning accumulation rate? Per tick while in forward mode past threshold? Per wave?
- How many tiers of reckoning? Suggest 3: Cautious, Bold, Reckless — each with distinct enemy pool and reward multiplier.
- Does the Navigator officer reduce reckoning accumulation or allow safe passage through one extra tier?
- Does reckoning interact with `CourseMode` retreat — does retreating reset reckoning?
- UI: reckoning indicator in route meter or separate needle?
- Interaction with Treasure Maps: does higher reckoning increase map fragment drop chance?

**Earliest sprint:** Sprint 06 (depends on `CourseMode` refactor if any).

---

## 5. Prize Ships — Boarding Actions

**What it is:** Some enemy ships (rare, flagged `is_prize`) can be Boarded instead of sunk. Boarding replaces the normal kill action with a short challenge sequence (spend Doubloon cost or meet a skill threshold from Muster). Success captures the ship, yielding a large Doubloon windfall plus one of: a Relic Shard, a Contract charge top-up, or a random upgrade discount token. Failure damages the player and the enemy escapes.

**Why it fits:** Boarding is a defining pirate tactic. It differentiates "fight everything" from "pick your battles" — and creates a resource-vs-reward decision every time a prize ship appears. Synergizes with the Quartermaster officer (economic bonuses) and the Notorious Captain infamy node (already boosts Doubloon prizes).

**Design questions:**
- How often do prize ships appear? Suggested: 5% base chance on any non-boss enemy, higher in merchant lane tags.
- What is the Doubloon cost to board? Flat or scales with ship hull?
- Muster skill threshold path: gunnery or seamanship? Or player's choice?
- Can the Boatswain officer reduce boarding cost?
- What happens if player attempts to board with no Doubloons and below skill threshold? Auto-fail, or blocked?
- Does the prize ship replace the normal wave or appear as an interrupt mid-wave?
- Save the boarding UI: tooltip on enemy card, or modal?

**Earliest sprint:** Sprint 07.

---

## 6. Figureheads

**What it is:** Ships carry Figureheads — permanent cosmetic-plus-mechanical attachments. Each Ship definition gets one Figurehead slot. Figureheads are unlocked through Shipwright mastery milestones and grant passive bonuses (e.g., "Mermaid: +8% seamanship XP gain", "Kraken: +5% damage to elites", "Saint: +10% repair tick rate"). Each ship has 2–3 thematic Figureheads to choose from.

**Why it fits:** Adds meaningful Ship upgrade identity without touching the core Arsenal upgrade tree. Historically figureheads were ships' spiritual guardians — strong thematic hook. Shipwright mastery currently gates blueprints; Figureheads give it a second unlock axis.

**Design questions:**
- Are Figureheads run-persistent (choose per run at prestige screen) or permanently attached?
- Where do Figureheads appear in the Shipwright tab? New sub-section or tab?
- Do Figureheads interact with the Research tree (e.g., Occult figurehead boosts ether_brine gain)?
- How many total Figureheads at launch? Suggest 2 per ship × 4 ships = 8.
- Should Figureheads be visible in the Sea View on the player ship sprite?

**Earliest sprint:** Sprint 05 or 06 (natural extension of existing Shipwright tab).

---

## 7. Sea Shanties — Crew Morale

**What it is:** The crew has a Morale meter that drifts up when the player is winning (kills, boss clears, contract completions) and drifts down when taking hull damage or retreating. Morale affects crew-related stats: high morale boosts Muster XP gain rate; low morale reduces it. Officers have morale-related passives (Quartermaster can stabilize morale during retreats). The Shanty mechanic is the active way to boost morale: spending a Doubloon cost triggers a brief morale surge (like an ability, with cooldown).

**Why it fits:** Sea shanties were the crew's way of maintaining rhythm and morale during hard work — perfect for the idle loop's pacing metaphor. Adds a soft resource the player actively manages, complementing the hard resources (salvage, doubloons, brine). Morale as a Muster-XP modifier ties all three systems together.

**Design questions:**
- Morale range: 0–100? Or three discrete states (Low/Steady/High)?
- Drift rates: how fast does morale drop under damage vs. recover on kills?
- Shanty active: Doubloon cost? Or free with cooldown?
- Should morale interact with the Officers system beyond Quartermaster? (e.g., Boatswain gives passive morale boost)
- Display: morale meter in route sidebar or near player hull bar?
- Does morale persist across waves within a run, or reset per encounter?
- Interaction with Retreat course mode: does retreating drain morale faster to create a meaningful penalty?

**Earliest sprint:** Sprint 07 or 08 (requires Officers system to be solid first).

---

## Prioritization Summary

| # | Mechanic | Complexity | Synergies | Target Sprint |
|---|----------|------------|-----------|---------------|
| 1 | Treasure Maps | Medium | Relics, Infamy | Sprint 05 |
| 2 | Jolly Roger / Flags | Low–Medium | Officers, Trials | Sprint 06 |
| 3 | Voyage Omens | Low | Stormheart, Navigator | Sprint 05 |
| 4 | Dead Reckoning | Medium | CourseMode, Navigator | Sprint 06 |
| 5 | Prize Ships | Medium–High | Boarding, Quartermaster | Sprint 07 |
| 6 | Figureheads | Low–Medium | Shipwright, Research | Sprint 05–06 |
| 7 | Sea Shanties | Medium | Officers, Muster | Sprint 07–08 |

**Recommended Sprint 05 scope:** Treasure Maps (fragment drops + stash route), Voyage Omens (pre-run card), Figureheads (Shipwright extension). These three can be implemented independently and each has clear endpoints.
