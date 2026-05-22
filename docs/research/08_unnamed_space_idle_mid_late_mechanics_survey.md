# Unnamed Space Idle Mid And Late Mechanics Survey

Research date: 2026-05-22

This is a source-based survey of Unnamed Space Idle's mid and late game mechanics, with translation notes for Unearned Bounty. It is intentionally higher level than a build guide. The goal is to understand how USI keeps unfolding without losing the main combat spine.

## Sources Surveyed

| Topic | Source |
| --- | --- |
| Wiki system index | https://spaceidle.game-vault.net/wiki/Main_Page |
| Sectors and unlocks | https://spaceidle.game-vault.net/wiki/Sectors |
| Gameplay phases | https://spaceidle.game-vault.net/wiki/Gameplay |
| Core equipment | https://spaceidle.game-vault.net/wiki/Core |
| Compute | https://spaceidle.game-vault.net/wiki/Compute |
| Synth | https://spaceidle.game-vault.net/wiki/Synth |
| V-Device / shards | https://spaceidle.game-vault.net/wiki/V-Device |
| Prestige | https://spaceidle.game-vault.net/wiki/Prestige |
| Reactor | https://spaceidle.game-vault.net/wiki/Reactor |
| Research | https://spaceidle.game-vault.net/wiki/Research |
| Bases | https://spaceidle.game-vault.net/wiki/Bases |
| Challenges | https://spaceidle.game-vault.net/wiki/Challenges |
| Warp Drive | https://spaceidle.game-vault.net/wiki/Warp_Drive |
| Crew and Splicing | https://spaceidle.game-vault.net/wiki/Crew |
| Task List | https://spaceidle.game-vault.net/wiki/Task_List |
| Capital Gameplay | https://spaceidle.game-vault.net/wiki/Capital_Gameplay |
| Reinforce | https://spaceidle.game-vault.net/wiki/Reinforce |
| Fleet | https://spaceidle.game-vault.net/wiki/Fleet |
| Fleet Gameplay | https://spaceidle.game-vault.net/wiki/Fleet_Gameplay |
| AI automation and quality of life | https://spaceidle.game-vault.net/wiki/AI |
| Offline Progress | https://spaceidle.game-vault.net/wiki/Offline_Progress |

## System Timeline

The exact sector numbers can change as the game evolves, but the important structure is stable:

| Phase | USI Unlock Pattern | Design Purpose |
| --- | --- | --- |
| Standard early | Core, Compute, Synth, V-Device, Reactor, Research. | Establish the main combat loop and the first several upgrade verbs. |
| Standard mid | Bases, Challenges, Warp Drive, Crew. | Add focused runs, side content, persistent buildcraft, and specialization. |
| Standard late wall | Task List after Sector 71, gate beyond Sector 74. | Force mastery of existing systems before opening a new game phase. |
| Capital phase | Capital ship, capital enemies, fixtures, massive warp, capital research, overdrives. | Reshape combat and upgrade priorities rather than only raising numbers. |
| Reinforce layer | Reset nearly everything for major permanent bonuses. | Second prestige layer that compresses old progression and unlocks new preservation rules. |
| Fleet phase | Galaxies, nodes, artifacts, fleet ships, hazards, unstable transit. | A separate persistent mode outside normal reinforce resets. |
| Very late extensions | Splicing, specimen research, compute strata, more galaxies. | Deep specialization and new meta-systems for players who already solved earlier layers. |

## Midgame Mechanics

### Challenges

USI Challenges unlock in standard progression and act like system exams. Starting a challenge performs a prestige-style reset, then restricts or rewrites the rules so one system carries the run.

Challenge types surveyed:

- Core Computing: mainly Core/Compute.
- Synth Purity: Synth materials and modules become the main battle stats.
- Power Hungry: Reactor Void Power becomes damage and shields.
- Base Carry: Bases provide battle stats through grid buildings.

Why it works:

- Each challenge teaches one system by making it the whole solution.
- Completions grant permanent bonuses that make the system stronger everywhere else.
- Multiple completions require higher target sectors, so the same challenge returns later with higher stakes.

UB translation:

- Captain's Trials or Admiralty Trials.
- Trial types:
  - Gunnery Trial: only Arsenal/weapon power counts.
  - Shipwright Trial: crafted modules and hull fittings carry combat.
  - Storm Trial: route speed and navigation systems define success.
  - Port Trial: port facilities provide combat stats.
- Use trials as tutorials for systems that would otherwise feel optional or opaque.

### Bases

USI Bases are grid-building systems. Buildings generate materials, parts, and components. Components become prestige bonuses for specific systems, while one-time upgrades unlock major features or conveniences.

Why it works:

- It creates a different kind of puzzle from combat math.
- It gives prestige another reason to happen: pending base bonuses become active.
- Each base tends to support a named system, such as damage/shields, Compute, Synth, Warp, or Crew Mastery.

UB translation:

- Port Facilities.
- Drydock: ship damage/hull after Return to Port.
- Foundry: Arsenal and component production.
- Shipwright Yard: crafting and module recovery.
- Observatory: research, route speed, storm contracts.
- Hidden Cove: officers, contraband, prestige economy.

Implementation caution:

- The first port grid should be tiny and forgiving.
- Show the pending Return to Port bonus clearly.
- Do not require an external guide for the first layout.

### Warp Drive

USI Warp Drive uses charged cores to enter short fixed gauntlets. Locations unlock through progression and elite sectors. Gauntlets pay Warp Essence for a dedicated upgrade tree. Later, Massive Warp Drive extends this into capital-scale progression.

Why it works:

- Charged side content creates anticipation.
- Fixed encounters let the designer create focused tests.
- Partial completion can still pay something, reducing failure pain.
- Elite sectors feed the side system, making route choices matter.

UB translation:

- Storm Contracts / Ghost Charts.
- Sealed Maps recharge over time.
- Contract types can test different loadouts:
  - Salvage convoy.
  - Reef breaker.
  - Storm chase.
  - Cursed fleet.
  - Boss rematch.
- Contract currency can buy upgrades that affect main sectors too.

### Crew

USI Crew unlocks as a later standard-phase specialization layer. Crew members gain XP and stat levels, rank up, receive skills, and can be reprinted. Prior best levels create catch-up, and milestones are based on highest reached values.

Why it works:

- It adds character identity after the player understands the machine.
- Focused crew runs can support specific systems.
- Catch-up prevents resets from feeling like pure loss.

UB translation:

- Officers.
- Officer disciplines:
  - Gunnery.
  - Seamanship.
  - Navigation.
  - Quartermastery.
  - Occult Lore.
- Officer roles:
  - Master Gunner.
  - Boatswain.
  - Navigator.
  - Surgeon-Carpenter.
  - Quartermaster.
  - Occultist.

Implementation caution:

- This should be late enough that "assign an officer to a focus" is meaningful.
- Avoid making officers a daily chore without automation.

### AI Automation

USI's AI upgrades automate solved chores: core auto-buy, compute optimization, smart crafting, module queues, reactor management, research auto-select, base auto-upgrades, auto warp, crew auto reprint, fleet repeat automation, and late splicing automation. It also adds quality of life like loadouts, tab ordering, offline cap, and stat displays.

Why it works:

- The game keeps old systems but reduces their manual burden.
- Automation is itself a reward track.
- Loadouts are essential once buildcraft has many specialized setups.

UB translation:

- Captain's Orders / Quartermaster Automation.
- Early:
  - Auto Progress.
  - Auto target doctrine.
  - Buy cheapest Arsenal upgrade.
- Mid:
  - Shipwright smart crafting.
  - Research auto-next.
  - Port facility auto-upgrade.
  - Contract auto-run.
- Late:
  - Officer reassignment rules.
  - Route planner.
  - Prestige setup templates.

Rule for UB:

- Automation should arrive shortly after a behavior becomes repetitive, not hours after the player is tired of it.

## The Sector 71-74 Task List Wall

USI uses the Task List as a mastery gate. After beating Sector 71, the list appears on the Prestige screen and is required to go beyond Sector 74 into Capital Gameplay.

Task List categories:

- Beat Sector 74.
- Complete all Challenges.
- Max Reactor boost levels for a sustained period.
- Max required V-Device shards.
- Reach infinite production for available Synth materials.
- Permanently cap Compute's damage/shield bonus.
- Finish the Warp upgrade tree.

Why it works:

- It tells players exactly which systems are underdeveloped.
- It turns a potential opaque wall into a checklist of mastery targets.
- It prevents the next phase from opening before the player has engaged with the previous phase.

Why it is risky:

- It can feel like homework if the list is too long or if diagnostics are poor.
- It can force guide usage if players cannot tell what is missing or why.

UB translation:

- Before a major phase change, use a Captain's Ledger.
- Example "Cross the Maelstrom" ledger:
  - Clear Sector 20.
  - Complete each Trial once.
  - Master first Shipwright materials.
  - Finish first Research branch milestone.
  - Clear one Storm Contract.
  - Defeat an elite route captain.
- Keep it shorter than USI's late list for the first major transition.

## Capital Phase Mechanics

USI's Capital Gameplay is the second phase. The player unlocks a new ship class with many standard slots plus capital-specific weapon, defense, utility, and hangar slots. At Sector 75+, enemy capital ships fight separately from the normal swarm layer.

Capital systems surveyed:

- Battle Cruiser ship class with capital slots.
- Separate capital enemy battle layered above normal enemies.
- Fighter / hangar gameplay.
- Fixtures as a Synth extension for when not actively crafting.
- Massive Warp Drive for larger warp progression.
- Capital Research using Data Cores.
- Specimen Research later.
- Massive Reactor and Overdrives.
- Reinforce as the reset that closes this phase.

Why it works:

- It does not merely add a bigger enemy; it adds a second combat layer.
- Existing systems return in transformed forms.
- The player has to re-evaluate old assumptions.

UB translation:

- Armada Phase or Flagship Phase.
- The player's vessel becomes a flagship with:
  - Broadside weapon slots.
  - Deck gun / mortar slot.
  - Hull defense slot.
  - Utility rigging slots.
  - Boat/fleet support slot.
- Enemy fleets add a flagship layer that is separate from normal escort ships.
- Later systems:
  - Flagship Research.
  - Grand Contracts.
  - Overdrive-like temporary command orders.
  - Boat squadrons / allied fleet support.

Implementation caution:

- Do not introduce a flagship phase until the normal multi-ship battlefield is actually solid.

## Reinforce Mechanics

Reinforce is USI's second prestige layer around the late standard/capital boundary. It resets nearly everything for major permanent bonuses, while selectively preserving or compressing old progress.

Important preservation/compression patterns:

- Previous Reinforce bonuses persist.
- Achievements and AI persist.
- Some sector data persists.
- Compute becomes permanently capped after its task.
- Task List does not need to be redone.
- Key shard slots and some late progress persist.
- Galaxy/Fleet progress persists.
- Later Reinforce milestones unlock based on highest reached sector.
- Systems that were once manual become finalized, auto-maxed, or compressed.

Why it works:

- It lets the game replay from the start at high speed.
- It gives old systems a retirement plan.
- It makes a new long-term loop without deleting the player's identity.

UB translation:

- Grand Infamy / Legend Reset / Royal Pardon.
- First layer: Return to Port.
- Second layer: Become a Legend.
- Preserve:
  - Boss first-clears.
  - System unlocks.
  - Officer records.
  - Relic library.
  - Route mastery.
  - Automation.
- Compress:
  - Early sectors.
  - Early Arsenal upgrades.
  - Early Shipwright materials.
  - Earlier Research milestones.

Design rule:

- Every deeper reset should either change the game shape or retire solved friction. Do not add a reset layer that only multiplies numbers.

## Fleet Phase Mechanics

USI Fleet is a separate late-game system unlocked after multiple Reinforces. It is split into galaxies, nodes, battles, artifacts, fleet ships, enemies, hazards/supports, and unstable transit. Fleet progress persists through Reinforce, making Reinforce a true second prestige layer rather than a total wipe.

Important Fleet patterns:

- Galaxies are short battle maps.
- Travel costs passively generated fuel.
- Artifacts buy strong permanent upgrades that activate on the next Reinforce.
- Fleet has its own ships and enemies.
- Hazards/supports change encounter conditions.
- Unstable Transit adds modifiers and ship/weapon/ability/grid-slot mods.
- Repeat automation eventually improves or reruns battles as stats improve.

Why it works:

- It becomes a semi-independent game mode.
- It gives late players a persistent project outside the main reset loop.
- It can use different combat assumptions without breaking the standard battlefield.

UB translation:

- Armada Map / Fleet Expeditions.
- Persistent late-game map beyond Return to Port / Legend reset.
- Pirate equivalents:
  - Galaxies -> Seas / Archipelagos.
  - Nodes -> Islands / naval engagements.
  - Artifacts -> Trophies / relic charts / royal secrets.
  - Astrium Fuel -> Provisions / wind favor / expedition stores.
  - Hazards -> reefs, storms, curses, blockades.
  - Fleet Resources -> Armada Command.

Implementation caution:

- This is a late-game design pillar, not an MVP concern.
- The current open-sea combat should eventually support multiple allied ships before this becomes real.

## Splicing / Very Late Crew

USI's Crew page describes Splicing as a Galaxy 5+ upgrade. Spliced crew gain mastery from enemy capital ship kills, level alien aspects and discipline, manage acclimation, and risk corruption caps. Some splicing upgrades persist through Reinforce.

Why it works:

- It turns crew into a deeper late-game identity system.
- It gives capital kills a non-resource progression meaning.
- It adds a tension mechanic: power versus corruption/control.

UB translation:

- Cursed Officers / Oathbound Crew.
- Late-game officers can bind sea curses, relic spirits, or leviathan aspects.
- Concepts:
  - Humanity -> Loyalty / Sanity.
  - Corruption -> Curse.
  - Aspects -> Tide, Bone, Storm, Flame, Abyss.
  - Discipline -> Captain's command keeping the curse controlled.

Implementation caution:

- This should stay far future. It needs story weight and UI clarity.

## Late Compute, Reactor, Research, Synth Extensions

USI repeatedly transforms earlier systems:

- Compute starts as damage/shield bars, later becomes fighter compute, then has even later strata.
- Reactor starts as Void Power boosts, later gets Massive Reactor and Overdrives.
- Research starts with normal branches and sector density, later adds Capital Research and Specimen Research.
- Synth starts with crafting and modules, later gains Fixtures and alien synth progress.
- Warp starts as charged gauntlets, later gets Massive Warp and deeper upgrade tabs.

Design lesson:

- Good unfolding systems do not just add more tabs. They evolve existing tabs into new roles.

UB translation:

- Muster can later become officer training or command doctrine.
- Arsenal can later become broadside layout and flagship refits.
- Shipwright can later create fixtures/passive installations for the flagship.
- Research can later split into Admiralty and Forbidden Studies.
- Contracts can later become expeditions or fleet operations.
- Port Facilities can eventually be finalized/compressed after they are solved.

## What UB Should Borrow First

High-value, near-term borrowings:

1. Sector clear unlocks and boss-first milestones.
2. Hold-to-farm waves inside a sector.
3. A visible mastery ledger before major unlocks.
4. Targeted trials that teach one system at a time.
5. Module slots as flexible but scarce run modifiers.
6. Research focus where focusing one branch does not stop all others.
7. Automation as explicit progression, not hidden settings.
8. Later reset layers that compress solved early game.

What to defer:

1. Port facility grid puzzles.
2. Relic/shard slot linking.
3. Full officer system.
4. Contract gauntlet upgrade trees.
5. Flagship/capital phase.
6. Armada/fleet map.
7. Cursed officer/splicing equivalents.

## UB Phase Sketch

| UB Phase | Inspired By | Core Experience |
| --- | --- | --- |
| Sectors 1-5 | USI standard early | Arsenal, sector bosses, salvage, hull, first prestige explanation. |
| Sectors 6-15 | USI standard mid | Muster, targeting, route choices, Shipwright modules, research. |
| Sectors 16-25 | USI challenges/warp | Trials, elite routes, Storm Contracts, first relics. |
| First major gate | USI Task List | Captain's Ledger checks that core systems were understood. |
| Flagship phase | USI Capital | Bigger ship, multiple slots, enemy flagships, fleet escorts. |
| Legend reset | USI Reinforce | Reset deeper but preserve mastery and compress old sectors. |
| Armada map | USI Fleet | Persistent fleet expeditions outside normal reset. |
| Cursed officers | USI Splicing | Very late identity/corruption system. |

## Design Warnings

- USI's depth works partly because players accept long-term wiki-like optimization. UB should be more self-explanatory in UI.
- Every new system needs a diagnostic: "what is blocking me, what should I improve, why does this tab matter?"
- Avoid adding several resource tabs before the battlefield feels alive.
- Preserve the watchable sea combat as the emotional anchor. The systems should explain why the battle changes.
- Give old systems automation or compression as soon as they become solved.
