# Unnamed Space Idle UI Layout Teardown

Research date: 2026-05-21

This note captures the layout and visual-flow lessons from the current Unnamed Space Idle Steam media pass. It is not a cloning spec. The goal is to extract the screen grammar that makes USI's idle combat and upgrade workbench feel coherent, then translate that into the pirate ship game.

Primary sources reviewed:

- Steam store page: https://store.steampowered.com/app/2471100/Unnamed_Space_Idle/
- Core/combat upgrade screenshot: https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2471100/ss_23f36efd461415614a5b67ad3285dab7d2d704b5.1920x1080.jpg
- Synth/system screenshot: https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2471100/ss_8d61845c0b165702eba7f9cf68191a859d74e6c5.1920x1080.jpg
- Ship/workspace screenshot: https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2471100/ss_c29394afc9a6acbb9dd1cecebe43d55438ca763c.1920x1080.jpg
- Base/system screenshot: https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2471100/ss_5ce9770f5d18e57610d5295a05710c5d3d809c32.1920x1080.jpg
- Warp tree screenshot: https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2471100/ss_db4287b141951e668cbcc2c311141a76ae10c3ac.1920x1080.jpg

## The Core Screen Contract

USI's strongest layout idea is not simply "combat on the left, upgrades on the right." The actual contract is:

- The left column is a persistent live battlefield.
- The right two-thirds are a dense systems workbench.
- A thin global status/control area sits over the workbench.
- Combat continues to prove that right-side choices matter.
- The screen favors operational density over cinematic presentation.

The player does not leave the battle to manage upgrades. The battle remains visible while the player changes weapon cores, allocates systems, reads tooltips, buys upgrades, and watches whether the current wall is moving.

This is the key correction for Unearned Bounty: the combat panel should not feel like a framed duel card. It should feel like the ship is continuously fighting through dangerous waters while the captain works the ship console beside it.

Follow-up correction from UI review: do not interpret USI's left battlefield as a literal road, rail, or lane for the pirate game. "Lane" is useful as a systems shorthand, but it is the wrong visual metaphor. The pirate translation should be an open-sea encounter window with horizon threats, wakes, pursuit angles, and visible fleet pressure.

## Left Battlefield Observations

The USI battlefield is narrow, vertical, and persistent.

- Player ship is anchored near the bottom.
- Enemies enter or sit above the player along the same vertical travel axis.
- Projectiles and beams travel through open space, creating an obvious link between weapon upgrades and battlefield output.
- Sector/distance/wave context sits in or near the combat lane, not only in the upgrade UI.
- The player's hull/shield bars live close to the ship, so danger is readable without leaving the combat pane.
- Bottom-edge icons and meters make the combat pane feel like a compact dashboard, not just a decorative scene.
- The scene accepts high information density. It is not trying to be a clean hero image.

For Unearned Bounty, this argues for a default pursuit-oriented flow, but not a literal lane:

- Player ship anchored low-left, lower-center, or foreground.
- Enemy ships appear ahead, high-right, or on the horizon.
- Cannon fire, harpoons, firepots, and ward effects travel across open water.
- Wave and boss markers read like distant fleet silhouettes, chart marks, or horizon threats.
- Bosses can occupy more vertical space and push the lane into an "event" state.

Horizontal broadside can still exist as a fantasy idea, but the desktop idle layout benefits from a readable narrow combat window. The trick is to stage that window as open sea, not a track.

## Right Workbench Observations

The right side in USI is a workbench, not a content card.

Common patterns across screenshots:

- Top rows contain compact resources, buy amount, save/load/settings, and major system tabs.
- Sub-tabs split a system into specific views without changing the overall screen contract.
- Upgrade rows and grids are dense, with many small icons visible at once.
- The selected item usually has a detail area, tooltip, or preview that explains the next decision.
- Locked, disabled, selected, and available states are visible together, which helps the player form goals.
- The right side often shows a map, grid, recipe matrix, or upgrade tree instead of a stack of independent cards.

The design lesson is that idle buildcraft needs adjacency. The player should see:

- What is currently equipped.
- What can be upgraded now.
- What is locked next.
- What the next purchase changes.
- Which enemy or wall the choice is meant to solve.

For Unearned Bounty, the right side should become a captain's systems console:

- Ship loadout summary: hull, active weapon, support fitting, ward/defense, current counters.
- Armament upgrades: per-weapon upgrades, levels, costs, current-to-next stat deltas.
- Encounter diagnostics: current enemy family, armor/evasion/ward profile, recommended counter.
- Locked future systems: Harpoon Battery, Firepot Mortar, Shrine Lantern, hull upgrades, lane unlocks.
- Tooltips/previews: "Long Nine is weak vs armor", "Harpoon ignores 50% armor", "This lane introduces Ironclads."

## Upgrade UI Lessons

USI makes upgrades feel like parts of a machine. The important signals are:

- Upgrades are grouped under a named system or core.
- Icons and rows show multiple choices at once.
- Current value and next value are both visible.
- Milestone or max-level status is visible before the player reaches it.
- Buy amount controls matter because repeated purchases are expected.
- Disabled purchases still teach the player what resource is missing.

For the current web build, "one upgrade card" is only acceptable for the first minutes of play. The layout should quickly evolve toward rows or grids:

- One row per active upgrade, with level, current effect, next effect, cost, and buy button.
- A small meter for level progress or milestone progress.
- A locked row for the next weapon/core to foreshadow buildcraft.
- A compare strip showing active weapon strengths and weaknesses.

Recommended upgrade fields to expose in UI:

- `display_name`
- target weapon or system
- current level / max level
- cost resource and current cost
- current stat
- next stat
- strong-vs tags
- weak-vs tags
- unlock requirement if locked
- milestone if relevant

Near-term upgrade content additions:

- Long Nine: Powder Charge, current damage scalar.
- Long Nine: Trunnion Tuning, fire-rate or hit-reliability upgrade.
- Harpoon: Barbed Tips, anti-armor damage.
- Harpoon: Chain Winch, armor-pierce or slow effect.
- Hull: Reinforced Ribs, max hull.
- Sails: Saltglass Rigging, travel speed or enemy initiative.
- Ward: Lantern Circle, occult/ward defense.

The first weapon upgrade should remain simple, but the UI should already be built for the second and third rows.

## Combat UI Lessons

The combat view needs to sell three ideas at once:

- The ship is always fighting.
- Multiple threats are approaching over time.
- Upgrade choices visibly change battlefield output.

For Unearned Bounty, combat should show:

- Player ship anchored at the bottom of the lane.
- Current target above the player.
- Future wave markers on the horizon, with boss as a distinct larger marker.
- Projectiles traveling from player to target.
- Hit flashes, damage numbers, evades, ricochets, and ward blocks.
- Enemy family/counter info near the target.
- Player hull near the player, not only in a global status bar.

As the sim matures, the lane should support more than one visible enemy even if only one is mechanically active at first:

- Primary target in the center lane.
- Incoming silhouettes above or behind it.
- Defeated enemies fading or sinking out.
- Boss warning marker descending before spawn.

This would make the game feel more like a shoot 'em up idle sea encounter while preserving the simple data model.

## Desktop Ratios

USI's desktop composition suggests these ratios:

- Left combat lane: about 28-35% of width.
- Right workbench: about 65-72% of width.
- Global status/control strip: shallow row above the workbench.
- Combat log: small and local to combat, not a dominant panel.

The current Unearned Bounty web layout should follow that contract on desktop:

- `ocean` grid area spans the full height on the left.
- `status` grid area sits top-right.
- `mechanics` grid area fills the right side below status.

For mobile, the right workbench must stack under the combat lane. USI itself is dense enough that it highlights a risk: desktop density cannot simply be squeezed into portrait. Mobile should preserve the heartbeat first, then stack the active system below it.

## Anti-Patterns To Avoid

- A centered "VS" duel presentation as the main desktop combat view.
- A literal road/rail/lane spine in the ocean panel.
- Large decorative cards that hide the upgrade decision surface.
- A combat panel that feels separate from upgrade outcomes.
- A right panel with only one large upgrade card and no preview of future systems.
- Hero-style or marketing-style composition.
- Combat log dominating the battlefield.
- Hiding enemy counters in prose only.
- Treating bosses as a label change instead of a lane event.

## Translation Rule

When uncertain, ask this:

Does the current screen let the player watch the ship fight while deciding how to change the ship?

If yes, it is moving toward the USI contract.

If no, it is probably drifting back toward a conventional mobile card UI.
