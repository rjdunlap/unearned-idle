# Senior Design Review: Unearned Bounty Idle

Review date: 2026-05-21
Reviewer context: treating the four prior handoff docs as a pre-production design package.

---

## Executive Summary

The existing package is genuinely good foundational work. The USI-to-pirate mapping is thoughtful, the naming tone is strong and original, and the structural instincts — heartbeat combat, frequent unlocks, earned automation, non-punitive prestige — are exactly right for this genre. This is not a ground-up rethink.

The three problems that need immediate correction before any coding starts:

**1. The MVP scope is approximately two to three times too large.** Eleven systems in a prototype is not an MVP — it is a compressed full game. A solo or small team following this plan will spend 6-12 months building systems and never test whether any one of them is fun. Cut to five or fewer systems for the first playable build.

**2. Too many resources arrive before first prestige.** By lane 7, the player manages salvage, doubloons, ether brine, charts, lore, relic fragments, craft materials, and haven materials. That is eight distinct currencies before the game has earned the player's patience. USI introduces resources gradually over dozens of hours. Compress the early economy.

**3. Chartwork is the weakest system and should be redesigned.** "Allocate percentage of focus to a bar" is Compute with pirate names. It does not feel like captaincy. The verb is wrong. Every other system has a pirate-native action: slot a relic, craft a charm, burn ether, build an outpost. Chartwork needs a matching redesign that answers the question "what does a captain or navigator actually do here?"

Everything else ranges from solid to excellent. The relic constellation system, enemy-defense-vs-weapon counters, haven adjacency puzzles, and lane research density differentials are all worth building. The name bank is the strongest part of the whole package and should be trusted more.

---

## Major Findings

### Strongest Ideas to Preserve

**Enemy defense profiles with weapon counters.** Armor/hull/ward/sail as defense layers matched to harpoon/cannon/occult/chainshot is clear, pirate-native, and creates real loadout decisions. Build this first and let everything else justify itself by feeding into it.

**Relic Compass constellation linking.** The idea that slotting relics in adjacent slots creates compound bonuses is the most original system in the package. This goes beyond USI's V-Device because the spatial arrangement of relics has meaning. Do not simplify this away — it is the game's best differentiator.

**Lane research density differentials.** Trade routes yield Reputation, ruins yield Occult Lore, storm belts yield Cartography. This makes lane selection a meaningful ongoing decision, not just "push forward." It also gives purpose to the otherwise optional question "should I farm here?" Good.

**Hidden Haven adjacency bonuses.** A Shrine next to a Lighthouse boosting both is a small spatial puzzle that breaks up tabular upgrade play. Better than USI's bases and more pirate-flavored.

**Persistence tier structure.** Run / Voyage Permanent / Charter Permanent / Account is clean. This should be documented on the prestige screen itself, not just in design docs.

**Enemy families with reward profiles.** Hexed Corsairs dropping ether brine, Reef Beasts dropping relic fragments, Smugglers dropping rare materials — reward diversity from enemy type encourages the player to stay in specific lanes for specific goals. This is elegant.

**The "captain's desk" UI concept.** Functional-first but with a naval skin. Resist the temptation to make it look like a mobile free-to-play game. The tone is a working chart room.

### Weak Spots and Problems

**Chartwork is a productivity task, not a captain fantasy.** "Allocate percent of navigator focus to bars" describes a spreadsheet, not a command. Compare to every other verb: burn ether, slot a relic, commission a charm, build a shrine. Chartwork needs a redesign. See system notes below for a proposed replacement.

**The Stormheart chain is triple-layered too early.** Ether brine → storm power → boosts is three levels of indirection. A new player will not understand what they are managing. Simplify: ether brine loads into the furnace, the furnace runs patterns directly. Storm power as a second intermediate currency should be removed or merged.

**Resource explosion at lane 7.** Specifically, lore and charts arrive within two lanes of each other and feel nearly identical in role (both feed research). They should be merged into one resource — call it Charts — with lore arriving as a special drop from boss/event encounters rather than a base lane drop. This removes one currency from the early economy and makes lore feel meaningful when it appears.

**Artificing is the most derivative system.** The recipe table and module list read as a direct reskin of USI's Synth. This is not a fatal problem — Synth is a well-designed system — but an opportunity to make it more pirate-native. See system notes.

**Trials and Maelstrom Voyages are both in MVP scope.** These are deep, complex systems each requiring their own content table, reward logic, and flow. Including both in an MVP that also contains combat, five ship systems, prestige, and automation is not realistic. Pick one for MVP and defer the other.

**"Return to Port" timing is underspecified.** The doc says "lane 30 first prestige target" but the balance table puts first prestige at 2-4 hours. With 30 lanes that is 4-8 minutes per lane on average, which will not feel right — early lanes should clear in under 2 minutes, later lanes in 10+, and the wall should happen naturally around lane 18-22 for many players on a first run. The prestige trigger should be mechanical (hitting a wall) not geographic (reaching lane 30).

**"Bounty" is underdefined.** The game is called Unearned Bounty but bounties are nearly absent from the mechanical design. Who posts bounties? Against whom? For what? The word "bounty" appears in the naming bank and the Reputation research branch but has no mechanical core. This is the highest-priority missing mechanic for thematic coherence. See system notes.

**Boarding Actions are flavor, not mechanics.** The Boarding Drills Chartwork bar, the Boarding Hooks fitting, and several combat references invoke boarding combat, but no boarding mechanic is defined. Either commit to a boarding mini-system or remove the references so they do not create false promises.

**IP proximity check.** The design is not copying One Piece, but "Master Gunner," "Navigator," "Boatswain," "Quartermaster," "Cook-Surgeon" crew roles are too generic — these are simply real nautical titles, not evocative names. Rename them to something more specific to the world. "The Shot-Witch" instead of Master Gunner. "The Blind Chart" instead of Navigator. See naming section.

---

## Recommended Revised MVP

The original MVP has 11 systems across 30 lanes. The revised MVP has 5 systems plus combat across 20 lanes. The goal is a playable build that tests core feel in 8-16 weeks of solo dev work.

### Revised MVP Systems

| System | Status | Rationale |
| --- | --- | --- |
| Sea Lane combat (lanes 1-20) | **Keep, reduce to 20** | The heartbeat. Non-negotiable. |
| Ship Arsenal (4 weapons, 3 defenses, 3 fittings) | **Keep, smaller scope** | First upgrade loop. Non-negotiable. |
| Relic Compass (2 slot colors, 6 starter relics) | **Keep** | Most distinctive system; tests the genre-differentiating mechanic early. |
| Artificing (5 recipes, 4 modules only) | **Keep, trim** | Crafting adds a second resource sink and permanent progression. |
| Cartography branch only, no Lore tab | **Simplify** | Research but one branch, passive and simple. Full 4-branch system is post-MVP. |
| Return to Port prestige (first only) | **Keep** | Tests the reset loop. One prestige cycle is sufficient for MVP. |
| Save/load and offline gains | **Keep** | Non-negotiable for idle games. |

### Cut from MVP

| System | Reason |
| --- | --- |
| Chartwork (as designed) | Needs redesign before implementation. See system notes. |
| Stormheart Furnace | Complex 3-layer resource chain. Simplify to a passive ether boost and defer full system. |
| Hidden Haven | Third major system layered on top of Artificing and Relics is too much in MVP. Defer. |
| Full 4-branch Cartography and Lore | Single branch (Cartography only) is enough to test research mechanics. |
| Trials | Post-MVP. Teach via play, not forced challenge modes. |
| Maelstrom Voyages | Post-MVP. Charged side content is a midgame feature. |
| Crew | Correctly deferred in existing docs. Confirm post-MVP. |
| Automation beyond auto-advance | Most automation is post-first-prestige. Build the manual version first. |

### What the Revised MVP Proves

- Auto-combat through sea lanes is satisfying to watch and adjust.
- Weapon/defense choices matter because enemies have different profiles.
- Relics turn drops into buildcraft decisions.
- Crafting adds a second upgrade layer with permanent mastery.
- Prestige feels good: the next run is faster and opens new options.
- Offline time produces meaningful gains.

That is enough for playtesting. Add Stormheart, Haven, and full Chartwork in post-MVP once those five things work.

---

## First-Hour Progression Sketch

This is a target rhythm, not a lock. All timings assume an attentive active player; idle players will be slower.

### 0:00 – 2:00 — The Ship Fights

Player opens to a sea lane. Their ship fights automatically against a Privateer patrol. Salvage drops from each enemy. The UI shows hull, damage, and enemy HP bars. One button: Arsenal. Player buys a cannon upgrade. Enemy dies faster.

Emotional beat: "Oh, it's already going. Good."

Resources introduced: Salvage only.

Design note: No tutorial text. Just numbers moving and a clear upgrade button. Trust the player.

### 2:00 – 6:00 — The First Wall Appears

Lane 1 boss defeated. Lane 2 opens. Lane 2 enemies are Ironclad Cutters with high armor. Player's broadsides feel slow. Arsenal tab now shows Harpoon Battery as purchasable. Tooltip says: "Strong against armor. These enemies are armored." Player buys it. Damage improves noticeably.

Emotional beat: "My weapons matter. Different things work differently."

Resources introduced: Doubloons (dropped by the lane 1 boss as a prize).

### 6:00 – 12:00 — The First New Tab

Midway through Lane 3, a crafting event fires: the crew finds useful wreckage. Artificing tab unlocks. Tutorial recipe: Refined Timber, costs 20 salvage. Completing it levels the recipe and produces a Hull Warding module. Player slots the module. Hull stat visibly increases.

Emotional beat: "I can make things. The ship is becoming mine."

Resources introduced: Craft Materials (gathered during lane 3 fighting).

Design note: Artificing should feel like commissioning work from the ship's artisan, not clicking a crafting grid. The flavor text matters here.

### 12:00 – 20:00 — The First Drop That Means Something

Lane 4. Relic fragments start dropping from a Reef Beast encounter. Relic Compass tab unlocks. The compass shows two empty slots: one red, one gold. Player has collected 3 fragments from a Kraken Tooth relic. The resonance bar is 60% filled. Player slots it. Damage goes up noticeably.

Emotional beat: "That weird drop actually did something. I want more of them."

Resources introduced: Relic Fragments (from specific enemies — only from Reef Beasts and Hexed Corsairs in lanes 4-6).

Design note: The relic slot should feel physical — an icon drops into a socket. Sound and visual feedback matter more here than anywhere else in the UI.

### 20:00 – 35:00 — The Build Starts to Have an Identity

Lanes 5-8. The player now has: weapon choices, one module, one relic, some salvage to spend. The interesting question becomes what to upgrade next. A Crown Navy patrol appears in lane 6 with mixed defenses — the player has to think about whether to swap weapons or use the harpoon's armor pierce.

Cartography research starts passively accumulating in the background (no separate tab yet — just a subtle "charts gained" note in the resource strip). The player will find the research tab unlocked at lane 7.

Emotional beat: "I have to make actual choices now. Some of them feel wrong and I can't tell why."

### 35:00 – 55:00 — The Wall and the Research Revelation

Lane 9-12 is the first real wall. The boss at lane 10 (The Iron Tithe, an Ironclad commander) has armor and regenerating ward. The player needs to understand the damage type system to get through.

At lane 7, the Cartography tab has opened. The player can see that they have been slowly accumulating chart nodes. They spend a few to unlock "Precise Navigation" — a permanent lane speed bonus. The word "permanent" matters. They realize this does not reset on prestige.

Emotional beat: "There are things I'm building that survive. What exactly survives?"

Resources introduced: Charts (passive from lane progress, accelerated in storm lanes).

### 55:00 – 80:00 — The Prestige Comes Into View

Lanes 13-18. The player is pushing. They have built up relic resonance, leveled some recipes, researched a few nodes. The Return to Port button has been glowing gently. The prestige preview shows: reset list, persist list, and two things that will unlock for the first time — a second relic slot and a permanent hull multiplier from current recipe mastery.

The player decides whether to push to lane 20 before returning, or go now. Both are valid. The game supports either.

Emotional beat: "If I go back now I'll get so much stronger. But I want to beat that boss first."

### 80:00+ — The Second Run Is Visibly Better

After Return to Port, the player starts lane 1 again. With auto-advance on (just unlocked as a prestige reward), research preserved, and one relic already slotted, lane 1 clears in under 30 seconds. The speed increase is visceral. They are at lane 8 in 15 minutes. The horizon opens.

Emotional beat: "Oh. That's why you prestige."

---

## System-by-System Notes

### Sea Lanes

**Keep as designed.** The heartbeat system is correct. Wave → boss → new lane is the right rhythm.

Additions:
- Add a "Lane Intel" display that shows the dominant enemy family before the player enters a new lane. Format: icon + defense profile + reward type. This makes routing decisions visible.
- Add a Stormwall visual marker on the lane progress track at the point where the player is likely to stall. Label it "Stormwall ahead." This normalizes hitting a wall and frames it as a game feature, not failure.
- Do not use the word "sector" anywhere. USI owns that. Use "lanes," "straits," "passages," or "waters."

MVP lane count: 20 lanes, not 30. You can always add more. 30 lanes of distinct content is a significant content production task.

### Ship Arsenal

**Keep as designed, but milestone choices need concrete examples.**

The damage type / defense type matrix (Cannon vs hull, Harpoon vs armor, Occult vs ward, Chain vs evasion) is the single best design decision in the whole package. Protect it. Every content addition should reinforce it.

Specific additions:
- Give each weapon one active ability at a milestone level (not just passive stat increases). Examples: the Harpoon Battery's "Drag Under" ability reduces one enemy's armor by 30% for 15 seconds. The Shrine Lantern's "Ward Burst" fires an occult salvo that shreds ward on all enemies briefly. These make milestones feel like events, not just number increments.
- Arsenal should have 4 weapons at MVP, not 6. Long Nine Cannons, Harpoon Battery, Firepot Mortar, and Shrine Lantern. The Chainshot Rack and Deck Carronades can arrive at midgame lane 25+.
- The "fitting" category is currently undefined in terms of how fittings slot. Clarify: the ship has 2 fitting slots in MVP. Fittings do not interact with damage types — they are utility/economy. Salvage Nets and Crow's Nest Glass are the only two needed for MVP.

### Chartwork — Redesign Required

**The existing design is functional but wrong for this game's identity.**

The problem: "allocate focus to bars" is a passive optimization exercise. The player's verb is "decide percentages." That is not a captain's action.

**Proposed replacement: Ship's Bearing**

The player sets the ship's operational bearing — a stance that changes how the ship's officers interpret their duties. Instead of sliders, the player picks one of four stances:

- **Hunter Bearing**: Gunnery officers maximize attack speed. Slight lane slowdown (full attention on targets).
- **Iron Bearing**: Boatswain focuses on hull integrity. Damage is reduced but defense is multiplied.
- **Scout Bearing**: Navigator prioritizes chart-reading and lane speed. Less damage, faster traversal.
- **Salvage Bearing**: All hands on recovery. Less combat efficiency, more resource income from each kill.

Each bearing compounds over time: holding a bearing for longer increases its effectiveness, but switching resets the buildup. This creates real strategic timing (push through a tough wave on Iron Bearing, then switch to Hunter after the boss is weakened) and answers the question "what does the captain do?" — the captain sets the ship's purpose.

Later, a second stance slot can be unlocked, allowing hybrid bearings. "Hunter / Salvage" as a midgame unlock feels like a real upgrade.

This is a more original design than allocating percentage sliders. It maps to something a captain actually does. It has a clear verb ("set bearing") and creates timing decisions rather than optimization calculations.

If the bearing redesign is not adopted, the original Chartwork bars are acceptable but should be renamed: not "Gunnery Solution" but "Gunnery Focus" — make the player feel like they are directing people, not filling equations.

### Artificing

**Solid but needs a more original frame.**

The current design is essentially Synth with nautical recipe names. That is acceptable for a structural analog, but an opportunity exists to make it feel more specifically pirate.

Proposed framing: the Artisan's Hold. The ship carries a ship's artisan (a character with a name and voice). Recipes are not crafted by the player — they are commissioned. The player selects what to commission, provides materials, and the artisan works in real time. When a recipe levels up, the artisan comments on having mastered the technique.

This makes the system feel like managing a crew member's expertise rather than clicking a crafting table. The artisan's mastery progression is the same mechanical thing as recipe levels, but the frame is more thematically coherent.

One design change to consider: remove tier-1 recipes that cost only salvage. If a recipe costs only salvage, it is not really a crafting system — it is just another way to spend salvage. All recipes should require at least two resources so they create meaningful routing choices (which enemies to farm for which materials).

### Relic Compass

**The best system in the package. Protect it.**

The constellation linking concept is genuinely original. Prioritize fully implementing this in MVP, not deferring it.

One gap: the design does not explain how the player discovers which constellations exist. In USI, V-Device linking is visible once you have the right shards. For the Relic Compass, the player should see "constellation preview" lines between slots before the relics are present — ghosted connections showing that Kraken Tooth + Stormglass Eye creates a known constellation effect. This makes the system legible ("I know what to aim for") without making it trivial.

Addition: a "Relic Logbook" sidebar that records discovered constellations with their effects. This both serves as a reference and creates a collection goal.

One relic to add: **The Drowned Compass** — a relic that shows the next unrevealed constellation in the compass grid. Its primary effect is modest, but its secondary effect (mapping unknown links) is an exploration tool. This ties relic collection to narrative exploration.

### Stormheart Furnace — Simplify for MVP

**The triple resource chain is too complex to onboard in the first hour.**

Current chain: earn ether brine → load furnace → generate storm power → spend on boosts.

This is four steps from kill to benefit. Players will not understand it quickly enough to feel good about it.

**Revised for MVP:** remove storm power as an intermediate currency. Ether brine loads into the furnace. The furnace runs patterns that drain ether brine directly. The player sets which patterns to run (same as the current boost list). Over-running patterns drains brine faster.

The full storm power economy can return in post-MVP when the player already understands the furnace's basic function. This also means the furnace is not needed for MVP at all — it can be a lane 12-15 unlock rather than lane 5.

### Cartography and Lore — Merge Resources, Keep Density

**The 4-branch research tree is good. The two-resource (charts + lore) problem is not.**

Charts and lore arrive within a few lanes of each other and both feed research. To a new player they are functionally identical. Merge them into one resource: **Charts**. Lore can exist as a special high-value drop from bosses and ruins that gives a large chunk of Charts plus triggers a flavor event. This removes one currency from the early game and makes lore drops feel meaningful rather than routine.

Lane research density differentials are excellent and should be preserved. Consider making the density tooltip visible when the player first enters a new lane type: "Storm Belt waters: rich in Cartography, poor in Reputation." This teaches the system through observation.

For MVP: one research branch (Cartography) only. It provides lane speed, unlock of the Maelstrom hint, and some salvage efficiency. The other three branches unlock after first Return to Port as one of the prestige rewards. This creates a natural reason to prestige — "I can research Occult Lore after I return."

### Hidden Haven — Defer from MVP, but Design Now

**The system is good. The scope is too large for MVP inclusion.**

The haven grid with adjacency bonuses is more original than USI's base system. However, implementing a spatial puzzle editor plus building production plus prestige bonus calculation on top of combat, crafting, relics, and research is too much for a first prototype.

Defer Haven to post-MVP phase 2. However, design it now so the building list and adjacency table are ready.

One suggestion for when Haven is built: start the player with an already-discovered island rather than having them find or buy one. Discovery feels more exciting, but the setup cost of explaining what a Haven is in the middle of a game is too high. Instead, the Haven should already exist at the start of run 2 (after first prestige) — the character narrative is that returning to port means returning to the captain's home island.

### Trials

**Good concept, post-MVP.**

The trial designs are well-conceived (Dead Calm, Empty Hold, Stormheart Hunger each teach a specific system). Do not cut these from the design — they will be excellent midgame content. But they require finished systems before they can be designed, and finished systems require a working MVP.

When Trials are built, add one thing the existing design omits: a visible "mastery" progress bar per Trial. The player should be able to see how close they are to completing the challenge requirements even when they are not in trial mode. This creates pull even when the player is doing normal lane runs.

### Maelstrom Voyages

**Good concept, post-MVP.**

The voyage name list (Glass Current, Whale Road, Bell Reef, Midnight Gyre, Crownless Channel) is excellent flavor. "Partial completion for partial rewards" is the right design for charged content.

One addition when built: the compass needle charge should have a visible progress animation even when the player is on another tab. The needle ticking toward full charge should be a quiet background anticipation that the player notices and looks forward to. This is a small UI detail with a large psychological payoff.

### Bounty System — Missing and Required

**This is the most important gap in the design for thematic coherence.**

The game is called Unearned Bounty. The word "bounty" appears in research branches and naming but has no mechanical spine. This needs to be defined.

**Proposed design: Infamy and Bounty Contracts**

The player ship has an Infamy rating that grows as they push into deeper waters, defeat notable enemies, and complete Trials. High infamy makes the player a target (Crown Navy enemies appear more frequently, some bosses are bounty hunters) but also makes the player's rewards larger (better drops, higher doubloon prizes, special contracts available at port).

Bounty Contracts are a specific mechanic: the player picks up a contract at port (or finds one in lane drops) that specifies a target — a named enemy, a number of kills of a family, a lane to clear. Completing the contract pays a large one-time reward. Contracts expire if the player returns to port without completing them.

This creates a goal layer: instead of just "push forward," the player has named objectives. "Hunt the Iron Tithe" is a better directive than "clear lane 10." The same mechanical wall becomes a story beat.

Infamy is also the prestige reward currency. It replaces the generic "permanent global multiplier" with a reputation-based economy: more infamy means the world knows who you are, which means better opportunities. This ties prestige directly to the game's identity.

### Quartermaster Logbook

**The automation list is good but the unlock order needs explicit priority.**

Automation should unlock in this order, no exceptions:

1. Auto-Advance (first prestige reward, trivially cheap) — removes the most annoying manual action.
2. Loadout Slot (first or second prestige reward) — saves Arsenal config before and after prestige.
3. Research Auto-Select (second prestige, after player understands research) — removes a repeated micro-decision.
4. Relic Auto-Merge (after relic system is established) — merges fragments without opening the tab.
5. Smart Craft (once crafting is deeply understood) — complex enough that understanding it matters.
6. Chartwork Optimize / Bearing Manager (after Chartwork/Bearing redesign is live).

Do not allow the player to purchase automation before they have done the manual version at least once. This is both a design principle (earned QoL) and a mechanical gate (you need to understand what you are automating).

---

## Alternative Naming Directions

The current "Unearned Idle" is weak as a title. "Unearned Bounty Idle" is better but still puts the idle genre label in the name, which is unusual for successful idle games (Cookie Clicker, Antimatter Dimensions, Kittens Game, NGU Idle — only one of those has the genre in the title).

**Option 1: Saltglass Captain**
Evokes the sea region, has a strong noun-noun structure, implies a character fantasy. The "captain" framing is the core promise. Short, memorable, searchable.

**Option 2: By Infamy Earned**
A deliberate inversion of "unearned." Names the prestige currency and captures the tone of building a legend from nothing. Sounds like a sea shanty. Slightly obscure for discoverability.

**Option 3: The Drowned Chart**
Names one of the game's most evocative relics and captures the exploration fantasy. Mysterious and slightly dark, fitting for a cursed sea adventure. Easy to illustrate.

**Option 4: Cursed Waters Idle**
Blunt, legible, searchable. Will appear in searches for "pirate idle game." Not as evocative as the others but maximally practical for Steam discoverability.

**Option 5: Raise New Colors**
Names the prestige action as the title. This is bold — it signals that the game is about becoming something new, about transformation. It also suggests multiple identity shifts (new colors = new allegiance = new chapter). More unusual and harder to explain, but thematically rich.

**Recommendation:** Saltglass Captain or Raise New Colors. Both are original, legible, and evocative. Saltglass Captain is safer for discoverability. Raise New Colors is the more interesting artistic choice.

**For crew role names specifically**, the generic nautical titles should be replaced with world-specific ones:

| Current | Proposed | Rationale |
| --- | --- | --- |
| Master Gunner | The Shot-Witch | Implies a mystical angle on gunnery. Memorable. |
| Navigator | The Blind Chart | A navigator who reads by feel and relic. Intriguing. |
| Boatswain | The Rope-Father | Old nautical slang for bosun. More personal. |
| Quartermaster | The Ship's Articles | Names the crew's contract keeper. |
| Occultist | The Drowned Voice | Someone who communes with what's below. |
| Cook-Surgeon | The Knife and Kettle | Specific and pirate-flavored. |
| Smuggler | The Cargo-Ghost | Implies someone who makes things disappear. |
| Diplomat-Bard | The Port Tongue | The person the captain sends ashore first. |

---

## Balance Guidance

### Early Economy Structure

Resource introduction should follow this strict order. Do not deviate without strong justification.

| Resource | Introduced at | Early income source |
| --- | --- | --- |
| Salvage | Lane 1 start | Every enemy kill |
| Doubloons | Lane 1 boss | Boss prize only until lane 5 |
| Craft Materials | Lane 2 (Artificing unlock) | Generic drop unlocked with Artificing |
| Relic Fragments | Lane 3 (Relic Compass unlock) | Only from Reef Beasts and Hexed Corsairs |
| Charts | Lane 7 (Cartography unlock) | Passive from lane progress, bonus from specific lanes |

Defer ether brine, haven materials, and lore until post-MVP or at minimum past lane 10. Every new resource should feel like a promotion, not an addition to a list.

### Arsenal Upgrade Costs

```
cost(level) = base_cost * 1.18 ^ level
```

For lane 1 enemies with ~10 salvage per kill, 5 kills per wave, 3 waves per boss:
- Lane 1 wave income: ~150 salvage
- First upgrade should cost 20-30 salvage (affordable after one wave)
- Third upgrade should cost approximately 70 salvage (affordable after one wave clear)
- Tenth upgrade should cost approximately 400 salvage (requires 2-3 wave clears)

This creates an initial ramp that feels fast, then slows to a natural progression.

### Enemy Scaling

Enemy HP at lane N, baseline:

```
hp(N) = 50 * 1.35 ^ N
```

Player DPS at full optimal build for lane N should clear the boss in 30-90 seconds. If the player is behind (wrong loadout), 2-5 minutes. If the player is significantly behind, they should see the stormwall diagnostic and know why.

Armor, ward, and evasion values should scale at different rates per enemy family to ensure that the weapon counter system never becomes obsolete. An enemy family should never reach a defense value that makes the counter weapon irrelevant.

```
armor_multiplier(N, family) = base_armor_for_family * (1 + N * 0.04) for Ironclads
                              base_armor_for_family * (1 + N * 0.01) for Privateers
```

### Prestige Timing and Incentives

The first Return to Port should feel optional but tempting. Do not gate content behind prestige. Use incentives instead.

Target state at first prestige:
- Player has leveled 3+ Artificing recipes.
- Player has at least 2 relics with partial resonance.
- Player has researched 4-6 Cartography nodes.
- Haven (if in scope) has 3+ buildings.
- Player has hit a genuine wall (boss they cannot kill) in lanes 15-20.

Return to Port reward formula:

```
infamy_marks = floor(best_lane * 0.6) + (bosses_defeated * 2) + (trials_complete * 8)
```

Permanent multiplier from marks:

```
voyage_multiplier = 1 + 0.04 * ln(infamy_marks + 1)
```

Soft-log curve so early marks give large gains and later marks have diminishing returns but never zero value.

After first Return to Port, the player should reach their previous best lane in approximately 40-50% of the original time. If playtesting shows it is faster than this, the prestige rewards are too large. If slower, they are too small.

### Automation Timing

Automation should never arrive so late that it feels like a correction for a problem the game caused. It should arrive as a natural promotion.

Rule of thumb: any action the player performs more than 15 times in a run should have an automation upgrade available by their third run at the latest.

Auto-advance specifically should be available at first prestige or earlier. The manual lane advance is never a meaningful decision — it is always a chore.

### Offline Progress

```
offline_seconds = clamp(now - last_save_time, 0, 14400)  // 4-hour cap in MVP
offline_income = income_per_second_snapshot * offline_seconds * 0.6
```

0.6 efficiency for offline means the player always benefits from being active but is not punished for being away. Cap increases should be an automation upgrade, not a paid feature.

The offline summary should show:
- Time elapsed
- Total salvage, doubloons, and fragments earned
- Any prestige-permanent resources that accumulated
- Whether any system was blocked (e.g., Artificing queue completed)

---

## Godot Implementation Guidance

### Simulation Architecture

One gap in the existing technical plan: the offline aggregate formula approach is correct, but the save snapshot needs to capture income-per-second at save time, not recalculate it on load. If the player changed their loadout just before closing, the snapshot is inaccurate. Solve by snapshotting the computed income rate alongside the timestamp.

```gdscript
# In GameState.gd, on save:
save_data["offline_snapshot"] = {
    "timestamp": Time.get_unix_time_from_system(),
    "salvage_per_second": Sim.get_rate("salvage"),
    "doubloons_per_second": Sim.get_rate("doubloons"),
    # etc.
}
```

### Big Number Choice

For MVP, GDScript's native float (64-bit double) handles up to approximately 1e308 without overflow and is precise to about 1e15. For an MVP with lanes 1-20, native float is sufficient. Plan the switch to a custom BigNumber class at post-MVP when numbers reliably exceed 1e12. Do not add complexity before it is needed.

Formatting function to write on day one:

```gdscript
static func format_number(n: float) -> String:
    if n < 1000: return str(round(n))
    var suffixes = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]
    var tier = floor(log(n) / log(1000))
    tier = clamp(tier - 1, 0, suffixes.size() - 1)
    var value = n / pow(1000, tier + 1)
    return "%.2f%s" % [value, suffixes[tier]]
```

### Data Definitions

The existing `.tres` vs JSON guidance is correct. One addition: for anything that will be edited frequently during balance (enemy stats, upgrade costs, research nodes), use JSON and load it from `res://data/`. This allows balance changes without recompiling in Godot, and files can be edited with any text editor.

For gameplay-logic-heavy definitions (relics with constellation effects, modules with code hooks), use `Resource` subclasses in GDScript. Relics especially should be GDScript Resources because constellation linking will eventually need executable logic.

### UI Scalability

Build the tab system to support up to 12 tabs from the start, even if only 5 are visible in MVP. Every locked tab should show as a locked icon with a tooltip "Unlock by reaching Lane X" or "Discover by defeating Y." This makes the future visible and gives the player goals without overwhelming them.

The resource strip at the bottom should show rate-of-change on hover (or always if the rate is meaningful). "Salvage: 1,250 (+47/s)" is far more useful than "Salvage: 1,250."

---

## Missing Design Specs

The following documents need to be written before coding begins. They are listed in priority order.

### Must Write Before Coding

**1. Lane Content Map (lanes 1-20 minimum)**
List every lane: name, enemy families, boss identity, drop table, research density, and unlock triggered. This is the content spine of the MVP. Without it, Phase 1 implementation will require returning to design for every lane.

**2. Bounty Contract System Spec**
Define how bounties are posted, discovered, accepted, and completed. What targets exist for lanes 1-20? What are the rewards? Does infamy affect what contracts are available? How do contracts interact with prestige? This is a missing system that is central to the game's identity.

**3. Combat Formula Document**
Worked examples of the damage calculation for every damage type against every defense type at specific lane numbers. Include the exact modifier values for enemy families. This prevents balance drift during implementation.

**4. Prestige Reward Table**
Exact infamy mark costs for every prestige unlock across the first 3 returns to port. What multipliers? What new systems? What new ship options? Without this, prestige implementation is guesswork.

**5. UI Layout Wireframe**
Even a rough sketch of tab positions, panel proportions, resource strip location, and main sea lane view layout. The "captain's desk" concept needs a spatial plan before implementation. At minimum: which panel is center (combat), which is left (systems tabs), which is right (context info), and where are resources.

### Write Before Post-MVP Systems

**6. Haven Grid Spec**
Building list with exact stat effects, adjacency bonus pairs, grid dimensions and slot unlock rules, and production rates. The current building list in doc 04 is a good start but lacks numbers.

**7. Chartwork / Bearing Redesign Document**
If the bearing system is adopted, it needs a full design before implementation: exact bearing bonuses, buildup formulas, the timing of dual-bearing unlocks, and how automation interacts with stances.

**8. Trial Design Document**
For each of the 3 MVP-adjacent Trials: entry requirements, ruleset changes, completion criteria, and rewards. Include failure states.

**9. Crew Hire/Legend System Spec**
Even if crew is post-MVP, the spec should be written once Haven and Artificing are proven. Crew design affects how all other systems scale in the midgame.

**10. Balance Spreadsheet**
A simulation of the income economy for lanes 1-20, showing time-to-clear per lane at baseline upgrades, bottleneck resources, and unlock timing. This does not require a complete Godot implementation — a Google Sheets simulation with formulas is sufficient and should be built before Phase 2.

---

## Concrete Next Actions

In recommended order:

1. **Write the Lane Content Map for lanes 1-20.** This is a single document with a table per lane. It is the highest-value-per-hour design task available before coding.

2. **Decide whether to adopt the Ship's Bearing redesign or keep Chartwork bars.** This is a binary decision with significant implementation consequences. Make it explicitly rather than deferring.

3. **Define the Bounty Contract system.** Write 2-3 pages specifying contracts, infamy, and their interaction with prestige. Do not let the game ship with "Unearned Bounty" in the title and no bounty mechanics.

4. **Sketch the UI wireframe.** A hand-drawn or Figma rough sketch of the main layout. The captain's desk metaphor needs spatial grounding.

5. **Build the Godot foundation (Phase 0) without any content.** GameState, Sim, Balance, save/load, offline calculation, and the big number formatter. Then add one lane, one enemy, one upgrade, and make sure it saves and restores correctly.

6. **Implement combat before any secondary system.** Not even Artificing until the ship fights satisfyingly and you can watch it idle through 3 lanes without wanting to change something.

7. **Playtest the combat-only build with one other person.** Not for balance — for legibility. Can they read what is happening? Can they see why they are stuck? Everything else depends on this being true.

8. **Add Relic Compass second** (before Artificing). It is the most distinctive system and the one most worth testing early.

9. **Write the prestige reward table before implementing Return to Port.** Implementing prestige without a completed reward table leads to arbitrary numbers that calcify into bad balance.

10. **Resist scope expansion until lane 10 clears satisfyingly.** Every hour spent designing new systems before the combat loop is proven is a potential waste.

---

## Appendix: System Simplification Summary

| System | Doc 02-04 version | Recommended for MVP |
| --- | --- | --- |
| Sea Lanes | 30 lanes, 6 families | 20 lanes, 4 families |
| Ship Arsenal | 6 weapons, 4 defenses, 6 fittings | 4 weapons, 3 defenses, 2 fittings |
| Chartwork | Compute-style allocation bars | Redesign as Ship's Bearing system |
| Artificing | 9 recipes, 12 modules | 5 recipes, 4 modules |
| Relic Compass | 5 slot colors, 6+ relics | 2 slot colors, 6 relics, constellation links visible |
| Stormheart | Ether brine → storm power → boosts | Post-MVP or simplified to direct ether → boosts |
| Cartography/Lore | 4 branches, 2 resources | 1 branch (Cartography), 1 resource (Charts) |
| Hidden Haven | Full grid with 9 building types | Post-MVP entirely |
| Trials | 5 trial types | Post-MVP, design now |
| Maelstrom Voyages | Full charged content | Post-MVP |
| Crew | 8 roles | Post-MVP, design names now |
| Automation | 12 upgrades | 3 in MVP (advance, loadout, research) |
| Prestige | Return to Port | Keep, but formalize reward table first |
