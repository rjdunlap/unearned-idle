# Open-Sea Combat UI Continuation Prompt

Updated: 2026-05-21

Copy this prompt into another dev agent when you want them to continue the current web UI prototype work.

---

You are continuing work on **Unearned Bounty**, a pirate-themed unfolding idle game with automatic naval combat and a Captain's Desk upgrade UI.

The repo is a Godot + TypeScript web project. Focus on the web prototype:

- Live app: `http://127.0.0.1:5173/unearned-idle/`
- Web entry files:
  - `web/src/ui/main.ts`
  - `web/src/ui/styles.css`
  - `web/src/core/sim.ts`
  - `web/src/core/game-state.ts`
  - `web/src/core/definitions.ts`
- Shared data:
  - `data/definitions/lanes.json`
  - `data/definitions/enemies.json`
  - `data/definitions/weapons.json`
  - `data/definitions/upgrades.json`

Run and verify with:

```bash
cd web
npm run dev
npm run build
```

## Current Design Direction

The user wants the combat visualization to feel more like an open-sea bullet-heaven/idle combat window, inspired partly by Unnamed Space Idle's watchable left-side combat and right-side upgrade depth.

Important direction:

- The player-facing combat should not feel like a lane, road, or checklist.
- Use "lane" only internally if needed.
- The sea should show multiple hostile ships/fleets at the same time.
- Enemies should feel like they are arriving from the sides/front toward the player's ship.
- The right Captain's Desk can collapse into **Sea Focus** mode so the sea gets more width.
- Upgrades should eventually create visible combat changes: more shot trails, thicker smoke, faster volleys, stronger impacts, etc.

## Current Prototype State

Recent work in `web/src/ui/main.ts` and `web/src/ui/styles.css` added:

- **SEA FOCUS** toggle:
  - Normal mode: left combat + right Captain's Desk.
  - Sea Focus mode: right side collapses to a slim rail and combat expands.
- Open-sea combat contact layer:
  - Fleet groups such as `Vanguard`, `Port Raiders`, `Starboard Cutters`, `Horizon Fleet`, `Flagship Line`, and `Escort Screen`.
  - Multiple decorative enemy contacts are rendered around the single simulated target.
  - The sim still resolves one active enemy at a time.
- Directional fleet approach animation:
  - Contacts have per-slot `driftX` / `driftY` values.
  - Contacts animate inward with `fleet-approach`.
- Cleanup pass:
  - Removed noisy guide lines.
  - Removed circular wake arcs that looked like weird circles.
  - Replaced them with short tapered wake streaks.

Build currently passes after this work:

```bash
npm run build
```

## Important User Feedback

The user has been steering by feel. Their latest concerns:

- "I didn't really see the multiple enemies well; visually it still looks like one."
- "Maybe shift the player towards the middle and have bad guys come from the sides and front."
- "Can try the interaction again, have multiple enemy fleets at the same time, make them feel like waves and not just a blob."
- "The ships have weird circles and there are lines on the screen."
- "Still not having enemies come in from the sides towards the player's ship."

Interpretation:

The user is not asking for more docs or research. They want a visual/interaction prototype that makes the sea composition immediately read as:

1. Player ship in the combat space, not tucked into a corner.
2. Multiple enemy fleets, not a single primary target with decoration.
3. Distinct wave fronts from port, starboard, and horizon.
4. Enemies moving/pressing inward toward the player's ship.
5. Less abstract UI annotation and fewer visual artifacts.

## Next Implementation Goal

Make the open-sea combat layer feel like real fleets entering from off-screen and converging on the player.

Recommended next slice:

1. Keep the one-target sim for now.
2. Replace looping in-place drift with clearer enter/settle behavior:
   - Port fleet starts partially off the left edge and moves inward.
   - Starboard fleet starts partially off the right edge and moves inward.
   - Horizon fleet starts above/front and moves downward/inward.
   - Current target/flagship remains readable as the main target.
3. Make enemy fleet contacts more ship-like:
   - Avoid circular wakes.
   - Avoid guide lines.
   - Avoid labels overlapping the ships.
   - Use silhouettes, wakes, muzzle flashes, and movement instead of explanatory text where possible.
4. Consider reducing group labels:
   - Labels helped identify fleets, but they crowd the small combat column.
   - In normal mode, labels may need to be tiny or hidden.
   - In Sea Focus, labels can be more visible.
5. Make side fleets occasionally fire toward the player:
   - This can be CSS-only decorative fire at first.
   - Keep it subtle and directional.
   - Do not make it look like random screen lines.
6. Verify both normal and Sea Focus modes in the browser.

## Constraints

- Do not break the current data-driven Arsenal work.
- Do not rewrite the sim unless absolutely necessary.
- Keep the change focused on combat visualization and layout.
- Run `npm run build`.
- Use the browser to verify the actual read, not just DOM state.
- Be careful with labels and decorative lines. The user is sensitive to visual clutter.
- The left combat panel is narrow in normal mode; anything that only reads in Sea Focus is not enough.

## Helpful Existing Docs

Start with:

- `docs/research/00_handoff_index.md`
- `docs/design/06_web_ui_gameplay_handoff.md`
- `docs/design/07_web_combat_upgrade_layout_notes.md`
- `docs/design/08_bullet_heaven_synthesis_backlog.md`

## Suggested Acceptance Check

After changes, a quick human read of the combat view should answer "yes" to:

- Can I tell there are multiple enemy groups?
- Do at least two groups feel like they are coming from the side?
- Does the player ship feel like it is in the sea rather than in a UI corner?
- Are there no weird circles or long guide lines?
- In Sea Focus, does the open-water combat become more immersive?
- In normal mode, is it still readable without requiring Sea Focus?

If unsure, bias toward simpler visuals with stronger motion rather than adding more labels or decorative overlays.
