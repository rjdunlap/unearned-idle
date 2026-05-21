# Project Review: Unearned Bounty

Updated: 2026-05-21
Original review date: 2026-05-21

## Why This Review Was Cleaned Up

The original review was useful, but too long for day-to-day execution and partly stale after the web prototype and Bullet Heaven research. This version keeps the decisions that still matter and removes duplicate commentary.

Important correction: "lane" can remain an internal progression term, but the player-facing combat view should not look like a literal lane. The target is an open-sea encounter window paired with a dense captain's desk.

## Executive Takeaways

1. The strongest product idea is not "pirate Unnamed Space Idle." It is automatic pirate ship combat where every upgrade changes the visible battle at sea.
2. The MVP must stay narrow. Prove combat, counters, upgrades, one meaningful boss reward, and one persistent progression hook before adding more tabs.
3. Early resource count must stay low. Salvage and Doubloons are enough for the current web slice.
4. Doubloons need an early purpose. The best first use is unlocking Harpoon Battery or a Harpoon Blueprint after the first boss.
5. Armor/counter gameplay is the best mechanical spine. Long Nines should feel generalist; Harpoons should visibly answer armor.
6. The game title and fantasy need a bounty/infamy mechanic eventually. Do not let "bounty" remain only flavor.
7. Chartwork as percentage sliders is weak. Prefer captain-native verbs: set bearing, chart routes, align astrolabe rings, assemble map fragments, route magnetic currents.
8. The right-side UI should be a workbench for build decisions, not a passive stats dump.

## Keep / Change / Defer

| Area | Decision | Reason |
| --- | --- | --- |
| Open-sea combat | Keep and prioritize | This is the screen heartbeat. It must be satisfying to watch. |
| Ship Arsenal | Keep and deepen first | Weapon counters create buildcraft immediately. |
| Long Nine + Harpoon relationship | Keep | Clear generalist vs armor-break pairing. |
| Salvage | Keep | Base continuous upgrade currency. |
| Doubloons | Keep, add sink | Boss prize should create an immediate decision. |
| Relics / Mystic artifacts | Keep for next layer | Best long-term build identity system. |
| Bounty / Infamy | Define before broad MVP | The title needs mechanical support. |
| Chartwork sliders | Change | Too spreadsheet-like; not captain fantasy. |
| Hidden Haven, Trials, Maelstrom Voyages | Defer | Strong ideas, too much for first playable proof. |
| Large resource web | Defer | More currencies before first prestige will add noise. |

## Current Prototype MVP

The immediate web prototype should prove:

- The player can watch their ship fight while buying upgrades.
- The combat window reads as open water with incoming threats.
- At least two Long Nine upgrades create different visual changes.
- Harpoon is previewed before armor-heavy enemies arrive.
- Doubloons unlock something the player wants.
- Armor feedback makes wrong-weapon friction understandable.
- Boss defeat feels like a reward event, not just a larger HP bar ending.

This is enough for the next playtest. Do not add broad systems until this is working.

## Broader MVP After The Web Slice

Once the combat/upgrades slice is convincing, the broader MVP can add:

- First Return to Port / prestige preview.
- One persistent reward track.
- One relic or artifact slot with a transformative effect.
- One Captain's Desk exploration system, preferably Fragmented Cartography.
- One additional faction or region hazard.
- Basic offline gains and save/load polish.

Avoid shipping eleven systems at once. The old plan had too many good ideas competing for first implementation.

## First-Hour Target

The first hour should teach through visible cause and effect.

| Beat | Player learns | Required feature |
| --- | --- | --- |
| 0-5 min | Salvage buys immediate firepower | Long Nine upgrade changes projectile/smoke/reload |
| 5-10 min | Enemies are approaching from a horizon, not a checklist | Spyglass / threat preview |
| 10-20 min | Bosses drop special currency | Salt Widow reward burst and Doubloon total |
| 20-30 min | Doubloons unlock new capability | Harpoon Blueprint or first crew/fitting slot |
| 30-45 min | Armor needs a counter | Harpoon vs Ironclad with armor-break feedback |
| 45-60 min | Boss rewards can change the run | first relic, map piece, or permanent preview |

The player should feel "my ship changed" several times before any larger unfolding system appears.

## System Notes

### Combat View

Use an open-sea composition:

- Player ship low-left or lower-center.
- Active enemy forward/high-right.
- Horizon silhouettes for incoming threats.
- Boss approach warning before boss spawn.
- Hull bars near ships.
- Small combat log, subordinate to water VFX.

Mechanically discrete waves are fine. Visually, present them as pressure at the horizon.

### Arsenal

The Arsenal should become the first real buildcraft panel.

Near-term requirements:

- Multiple upgrade rows for Long Nine.
- Current-to-next stat preview.
- Visual tell per upgrade family.
- Locked Harpoon preview with counter explanation.
- Clear indication when an enemy resists the current weapon.

Recommended early upgrades:

| Upgrade | Effect | Visual tell |
| --- | --- | --- |
| Powder Charge | higher cannon damage | brighter/larger shot, thicker smoke |
| Trunnion Tuning | faster reload | shorter firing cadence |
| Chainshot Drill | bonus vs evasive ships | paired shot or chain projectile |
| Harpoon Barbs | more armor damage | cable/bolt and plating break |

### Bounty And Infamy

This is the biggest thematic gap.

Minimum future design:

- Infamy rises from boss kills, deeper waters, faction victories, and contracts.
- Higher Infamy increases danger and reward quality.
- Bounty contracts create named goals: defeat a target, clear a route, hunt a faction, survive a hazard.
- Return to Port should convert progress into persistent reputation or unlocks.

Do not build the full system yet, but design it before the first larger MVP.

### Relics And Artifacts

Relics should transform play, not add small hidden percentages.

Good relics:

- Change weapon pattern.
- Add a tradeoff.
- Create a visible identity.
- Make the player want different future upgrades.

First prototype relic candidates:

- Bramble-Heart Wood: lower max hull, auto-repair, vine patches on impact.
- Phantom Wheel: chance to phase enemy shots and fire a retaliatory nova.

### Captain's Desk

Avoid a generic skill tree if possible. The strongest desk systems feel like navigation tools:

- Fragmented Cartography: arrange map pieces to unlock routes/biomes.
- Astrolabe Array: rotate rings to discover build alignments.
- Magnetic Currents: place lodestones to alter route rewards or faction pressure.
- Ship's Bearing: set stance such as Hunter, Iron, Scout, or Salvage.

Pick one for the first broader MVP. Fragmented Cartography is the clearest pirate-native first choice.

### Economy

For the current web slice:

- Salvage is the frequent spend currency.
- Doubloons are boss-prize currency.
- Doubloons should unlock Harpoon or another capability immediately after first boss.

Do not introduce craft materials, relic fragments, charts, lore, ether brine, and haven materials all before the first prestige. Each new resource should unlock a new verb.

### Automation

Automation should be earned after the player understands the manual action.

Priority order:

1. Auto-advance / route continuation.
2. Loadout slot.
3. Research or desk auto-select.
4. Relic merge.
5. Crafting queue.

Auto-advance should arrive early; manual advancement is mostly chore, not strategy.

## Balance Guidance

Current web data uses a steep `base_cost * 2^level` curve for the first Long Nine upgrade. This is acceptable for proving one upgrade button, but likely too steep once multiple upgrades compete for Salvage.

Useful targets:

- First purchase: after roughly one wave or less.
- Third purchase: still achievable in the first few minutes.
- First boss: threatening enough to show hull pressure but not require perfect buildcraft.
- First boss reward: enough Doubloons to buy exactly one meaningful unlock.
- First armor wall: only after Harpoon is previewed and affordable.

If early upgrades drag, lower cost scale before lowering enemy HP. Watching the ship become stronger is the point.

## UI Principles

- Combat remains visible while buying upgrades.
- Right panel shows the active ship/weapon identity without scrolling on desktop.
- Upgrade rows show current value, next value, cost, and unlock state.
- The ocean communicates damage type, armor resistance, reward pickup, and boss arrival.
- The combat log is for audit/debug flavor, not primary comprehension.
- Mobile stacks combat first and keeps upgrade rows tappable.

## Concrete Next Actions

1. Add Spyglass / At the Horizon preview.
2. Add a second Long Nine upgrade.
3. Make Long Nine visuals scale with upgrade level.
4. Add Harpoon locked preview.
5. Add Doubloon unlock for Harpoon or Harpoon Blueprint.
6. Add armor-hit feedback and counter copy.
7. Add reward burst VFX from kills to resource totals.
8. Reduce combat log prominence.
9. Define the first bounty/infamy spec before adding more progression systems.
10. Decide the first Captain's Desk system after combat feels right.

## Removed From This Review

The original review included long naming sections, detailed Godot implementation notes, large post-MVP system commentary, and extensive balance formulas. Those details are either already represented in the broader design docs or should wait until the combat slice proves itself.
