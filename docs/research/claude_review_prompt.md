# Prompt for Claude Review

Copy this prompt into Claude when you want a second-pass review and extension of the current research package.

```text
You are helping design an original Godot game tentatively called Unearned Idle / Unearned Bounty Idle.

The goal is to make a long-form unfolding idle game structurally inspired by Unnamed Space Idle, but translated into an original age-of-exploration, mystical pirate fantasy related to my past game Unearned Bounty. The desired tone is adventurous, strange, pirate-themed, and mythic, with some broad "big magical sea adventure" energy, but do not copy One Piece names, lore, powers, factions, character concepts, or visual signatures.

Please review and extend the existing design/research docs in this repository:

- README.md
- docs/research/00_handoff_index.md
- docs/research/01_unnamed_space_idle_breakdown.md
- docs/design/02_pirate_unfolding_idle_concept.md
- docs/design/03_mvp_and_technical_plan.md
- docs/design/04_progression_content_taxonomy.md

Context:

- The current repository started empty except for git metadata, so these files are the first handoff package.
- The research package summarizes Unnamed Space Idle systems such as sector combat, core equipment, compute, synth, V-device, reactor, research, bases, challenges, warp drive, crew, AI automation, reinforce, and fleet.
- The proposed pirate adaptation maps those systems into Sea Lanes, Ship Arsenal, Chartwork, Artificing, Relic Compass, Stormheart Furnace, Cartography and Lore, Hidden Havens, Trials, Maelstrom Voyages, Legendary Crew, Quartermaster automation, Return to Port prestige, Grand Expedition, and Armada Campaigns.
- The MVP plan targets lanes 1-30 with combat, upgrades, Chartwork, Artificing, Relics, Stormheart, research, a first Haven, first prestige, automation, save/load, and offline gains.

Your task:

1. Review the docs like a senior game designer and systems designer.
2. Identify the strongest ideas worth preserving.
3. Identify weak spots, contradictions, missing mechanics, pacing problems, UI risks, theme/IP risks, or implementation risks.
4. Extend the design with concrete additions rather than vague advice.
5. Suggest a tighter MVP if the current one is too broad.
6. Propose a first 30-60 minute player experience, including unlock order, decisions, resources introduced, and expected emotional beats.
7. Propose 3-5 alternative naming/theme directions if "Unearned Idle" or current system names feel weak.
8. Add balance guidance: early formulas, resource economy structure, progression pacing, prestige timing, and automation timing.
9. Add Godot implementation guidance only where it directly affects design feasibility.
10. Create a prioritized list of next docs or specs that should be written before coding.

Please write your response in a handoff-friendly format with headings. Be opinionated. If something is overbuilt, say so and propose a smaller version. If a system is too close to Unnamed Space Idle, suggest a more original pirate-specific replacement. If something should be cut from MVP, mark it clearly.

Important constraints:

- Preserve the fantasy of captaincy, exploration, bounties, cursed seas, relics, impossible islands, and crew legend.
- Avoid direct One Piece IP imitation.
- Avoid cloning Unnamed Space Idle names, exact numbers, or exact progression tables.
- Favor a prototype that can be built in Godot by a small team or solo developer.
- Keep the design playable and legible, not just elaborate.

Preferred output:

- Executive summary.
- Major findings.
- Recommended revised MVP.
- First-hour progression sketch.
- System-by-system notes.
- Missing design specs.
- Concrete next actions.
```

