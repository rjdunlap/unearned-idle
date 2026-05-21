# Bullet Heaven Synthesis Backlog

Date: 2026-05-21

This doc turns the Bullet Heaven research and Gemini response into a practical direction for Unearned Bounty's web prototype.

## Design Pivot

The combat view should become an open-sea encounter window, not a lane.

The player should see:

- Their ship fighting in waterspace.
- Enemy ships entering from horizon/edges.
- Wakes, smoke, splashes, floating salvage, and weather motion.
- Clear weapon patterns that change as upgrades are purchased.
- Boss and elite arrivals as events, not checklist items.

The right side should remain a dense captain's desk:

- active weapon and upgrades
- crew/fittings/relics/wards
- resource spend decisions
- next threat preview
- meta progression when unlocked

## Implementation Priority

The next few sessions should focus on making combat and upgrades physically legible.

Highest-value prototype changes:

1. Add a spyglass / horizon preview for upcoming threat type.
2. Add Long Nine visual scaling by level: more smoke, brighter shot, larger projectile, or extra pellet at milestone.
3. Add floating Salvage/Doubloon reward burst that travels toward the resource strip.
4. Add a hidden/revealed Harpoon Battery preview before armored enemies.
5. Add a Doubloon sink, preferably Crew slot or Harpoon Blueprint unlock.
6. Add armor feedback: ricochet/tink and "armor reduced cannon damage."
7. Replace wave checklist styling with threat/horizon styling.
8. Add a second Long Nine upgrade, such as reload speed or chainshot.
9. Add a Wrecked Whaler or similar mid-boss encounter to introduce Harpoons.
10. Reduce combat log dominance by surfacing critical events visually.

## Recommended First Prototype Feature: Spyglass

Purpose:

- Make future counters visible before the player is punished.
- Replace checklist thinking with horizon thinking.

Behavior:

- Shows next wave/boss silhouette.
- Shows one short tag, e.g. `Heavy Armor`, `Evasive`, `Boss`, `Swarm`.
- Shows recommended counter when discovered, e.g. `Harpoon recommended`.

Possible UI copy:

- `Spyglass: Privateer Sloop - Evasive`
- `Spyglass: Ironclad Cutter - Heavy Armor`
- `Spyglass: The Cracked Bell - Armor Boss`

Data needed later:

- `counter_hint`
- `threat_tag`
- `recommended_weapon`

## Recommended First Economy Feature: Doubloon Sink

The cleanest first-hour Doubloon sinks:

- Unlock Harpoon Battery blueprint.
- Hire first Crew member.
- Unlock first fitting slot.
- Buy a permanent shipyard improvement.

Recommendation:

Use Doubloons to unlock a Harpoon Blueprint or first Crew slot after the Lane 1 boss. Harpoon is more urgent for gameplay clarity because Lane 2 already has Ironclads.

Possible flow:

1. Defeat Salt Widow.
2. Gain Doubloons.
3. Arsenal reveals `Harpoon Battery Blueprint`.
4. Spend Doubloons to unlock Harpoon Battery.
5. Equip Harpoons before Ironclads appear.

## Recommended First Buildcraft Feature: Multiple Long Nine Upgrades

One upgrade makes the right side feel unfinished. Add at least one more Long Nine row.

Good candidates:

| Upgrade | Effect | Visual tell |
| --- | --- | --- |
| Trunnion Tuning | lower fire-rate ticks | cannon fires more often |
| Chainshot Drill | bonus vs evasive/privateer ships | projectile becomes paired chain shot |
| Powder Charge | current damage scalar | projectile brighter/larger |
| Gun Crew Rotation | small chance for extra shot | occasional double volley |

This establishes that weapons are buildable systems, not single stat sticks.

## Recommended Combat Language

Weapon patterns should be visually distinct:

| Weapon | Pattern | Use |
| --- | --- | --- |
| Long Nine Cannons | fast straight shots / volleys | general hull damage |
| Chainshot | paired/bouncing shot | evasive/privateer control |
| Harpoon Battery | piercing tether | armor break |
| Firepot Mortar | arcing splash / burning water | area and wooden hulls |
| Shrine Lantern | beam/pulse aura | wards and occult enemies |

Enemy response should be distinct:

| Response | Visual |
| --- | --- |
| normal hit | hull flash and damage number |
| armor reduction | spark/ricochet and reduced damage label |
| armor break | plating fragments fall off |
| evade | brief ghost/wake displacement |
| burn | sail flame and ticking damage |
| ward block | violet/teal shield pulse |

## Suggested First-Hour Flow

1. Start with Long Nine Cannons and Salvage.
2. Buy Powder Charge and Trunnion Tuning.
3. First mini-boss drops Doubloons.
4. Spyglass warns that armored ships are appearing soon.
5. Salt Widow boss drops enough Doubloons to unlock Harpoon Blueprint.
6. Player unlocks Harpoon Battery in Arsenal.
7. Widow's Crossing introduces Ironclads.
8. Harpoons visibly strip armor, then Long Nines finish hull.
9. First region boss rewards a relic or permanent shipyard upgrade.
10. Return-to-port/prestige UI appears after the player understands weapon counters.

## What To Avoid

- Do not show waves as a plain checklist if the goal is open-sea fantasy.
- Do not add projectile chaos that hides hull bars.
- Do not make Doubloons only a number with no early sink.
- Do not let Ironclads appear before Harpoon is introduced.
- Do not add active abilities unless their timing is readable.
- Do not make every upgrade a small percentage with no visual change.

## Open Questions

- Should Harpoon be a second active weapon, a swappable weapon, or an upgrade branch?
- Should Crew be introduced before or after Harpoon?
- Should Doubloons buy blueprints, crew, or both?
- Should boss rewards be fixed in the first hour or choice-based?
- Should the wave model remain mechanically discrete while the UI presents it as threat pressure?

## Recommended Next Implementation Slice

Build this small vertical slice:

1. Add `threat_tag` and `recommended_weapon` metadata for enemies or derive it from family/armor.
2. Add Spyglass horizon preview to combat.
3. Add second Long Nine upgrade.
4. Make projectile visuals reflect Long Nine upgrade level.
5. Add Harpoon Blueprint locked preview in Arsenal.
6. Add Doubloon unlock for Harpoon Blueprint after Salt Widow.

This slice directly attacks the current problem: the player needs to see why combat, upgrades, and enemy counters belong together.
