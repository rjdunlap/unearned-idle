# USI System Visual Grammars and UB Pattern Proposals

Research date: 2026-05-23

This document catalogs how each Unnamed Space Idle system uses a visually distinct structural grammar, then proposes native visual grammars for every Unearned Bounty system. The goal is not cosmetic theming — it is making each UB tab feel like a different kind of tool, the same way USI does.

Sources reviewed: five Steam screenshots, the USI wiki, and the existing UB visual design bible and systems roadmap.

## The Core Principle

USI's visual depth comes partly from the fact that every system is a different type of object. The player does not need to read a tab label to know where they are. Each tab presents information in a structurally different way:

- Core/Arsenal: a **list of named rows** with a **milestone icon grid** on each row
- Compute: **vertical fill gauges** with an **allocation split**
- Synth: **active timer slots** plus a **color-coded recipe grid**
- V-Device: a **socket board** with **slotted items and fill resonance**
- Prestige: a **ship diagram** with **labeled slot positions**
- Bases: a **tile grid puzzle** with **adjacency effects**
- Warp Drive: a **large zoomable node web**
- Route selection: **comparison cards** with stat parity

UB must do the same. If two tabs feel like the same type of object — both just showing a list of upgrades, for instance — one of them will feel redundant and the other will steal its design budget.

## USI System Visual Grammar Analysis

### Core (screenshot 1)

The Core tab has one horizontal band per equipped weapon or defense slot. Each band shows:

- Left: a name header and current stats in small gray text (damage, range, fire rate, DPS)
- Center-left: an upgrade cost button showing current → next value and the cost
- Right: a dense horizontal grid of small square icons showing every milestone upgrade option

The milestone icon grid is the signature. Every potential unlock for this slot is visible at once, even the ones not yet reached. Locked future milestones appear darker. This means the player can see where a weapon's buildcraft goes long before they get there, which creates forward-planning without requiring a guide.

The tab reads as a **manifest or loadout log** — a record of everything the ship is carrying and where each item can go next.

### Compute (not directly shown but documented)

The Compute tab uses vertical fill bars. One bar for damage bonus, one for shields. The bars fill over time based on Compute Power, and the player allocates which bars receive priority. Later, bars can auto-fill via AI.

The tab reads as a **dashboard gauge panel** — the player is watching live meters, not choosing items from a menu.

### Synth (screenshot 2)

The Synth tab has two structural zones. The upper zone has one or two large active crafting slots, each showing: recipe icon, on/off toggle, a red countdown timer (very prominent), XP progress bar, and current item count. The lower zone is a dense scrollable grid of all known recipes, organized by colored background tiles — purple for one material family, teal for another, gold for another, green for another.

A side tooltip panel opens when inspecting a recipe, showing every level milestone (cost reductions, point bonuses, unlock triggers) in a long scrollable list.

The tab reads as a **workshop queue board** — two benches running actively while the rest of the blueprint catalog waits below.

Key visual signals:
- The red countdown timer inside the slot is the most urgent-feeling element in the entire game
- The colored recipe grid creates clear categorical groupings without needing labels
- The milestone tooltip list gives the player a complete roadmap without a separate guide

### V-Device (not shown in these screenshots)

From the wiki: enemies drop Void Shards. Shards slot into colored sockets on the device. Duplicate shards fill Resonance, which scales effect strength. Later, slot linking creates combined effects.

The tab reads as a **physical tray puzzle** — the player is arranging objects in a constrained space, not buying stats.

### Prestige / Ship (screenshot 3)

The Prestige tab uses a central ship diagram as its organizing metaphor. The diagram shows an overhead or semi-isometric view of the player's current ship with every slot labeled and clickable (Turret 1, Turret 2, Turret 3, Defense 1, Defense 2, Utility 1). Ship class selection appears as tab buttons above (Basic / Frigate / Cruiser). A selection list to the right shows weapon options for the active slot, each with a one-line description. A preview strip at the bottom shows stats and milestone icons for the selection.

The tab reads as a **blueprint or ship schematic** — a diagram that makes the configuration decision feel like a physical layout choice rather than a stat comparison.

### Bases (screenshot 4)

Each base occupies a stacked section of the panel, with its own color-coded tile grid and a "Prestige Bonus" callout above it. Tiles use very saturated, high-contrast colors: bright green for Building Mats generators, cyan for multiplier tiles, gold or red for component/drain tiles. An "Unlock" button appears on gray tiles not yet active. Resource panels on the right show production rates and upgrade costs.

The tab reads as a **city grid or facility map** — a spatial puzzle where tile placement and color grouping matter, completely unlike any other tab.

### Warp Drive / Upgrades (screenshot 5)

The Warp Drive Upgrades sub-tab is a large scrollable and zoomable node web. Hundreds of small icons are connected by lines. Purchased nodes appear slightly different; available nodes have gold borders; recently purchased nodes have green borders. Red connection lines trace upgrade paths. The scale is large enough that zooming out reveals the full shape of the tree as a visual object — dense in some areas, sparse in others.

The same screenshot also shows route selection panels on the left side of the combat area: Route A and Route B as matching card pairs, each listing distance range, enemy traits, and research density stats with a "Select Route" button.

The Warp tab reads as a **star map or ancient chart** — a navigable territory rather than a list. Route selection reads as a **chart comparison** — two almanac entries side by side.

## Cross-System Visual Grammar Principles From USI

From all five screenshots together:

**1. Each tab has exactly one organizing metaphor.** Row-list, gauge panel, queue board, physical tray, blueprint diagram, tile grid, node web, comparison cards. No two share the same metaphor.

**2. The most important active state uses the most prominent element.** The red countdown timer in Synth dominates the upper half because crafting time is the key active decision. The ship diagram dominates Prestige because slot choice is the key prestige decision. The tile grid fills the Bases panel because grid layout is the decision. The structural emphasis tells the player what matters.

**3. Locked and unlocked content coexist.** Milestone grids show future options dimmed. The upgrade node web shows unpurchased nodes ghosted. The tile grid shows locked slots as empty buttons. This creates a visible sense of future without requiring a separate roadmap screen.

**4. The upgrade cost is always visible and always shows current→next.** No tab hides the cost behind a purchase confirmation. This lets the player scan ahead without committing.

**5. Categorical color grouping replaces category labels.** Synth recipes use colored tile backgrounds. Base tiles use strong saturated colors. V-Device uses slot color as a secondary effect modifier. Color is a visual shortcut, not decoration.

## UB System Visual Grammar Proposals

Each UB system should own one structural metaphor. The metaphors below are drawn from the visual design bible's physical captain's desk direction and deliberately avoid repeating each other.

### 1. Arsenal → Refit Ledger Rows + Milestone Pip Line

Metaphor: a **brass-edged ledger entry per weapon/hull slot**

Layout:
- One row per fitted item (current weapon, current hull type)
- Left: item name in display weight, current key stats (damage, rate, armor pierce)
- Center: upgrade cost button showing current → next and Salvage cost
- Right: a horizontal pip line of milestone upgrades, with icons for each milestone type (damage multiplier, behavior unlock, flavor effect). Unlocked milestones are stamped or lit. Future milestones are ghosted but readable.

How this differs from USI Core: the milestone line is a single strip rather than a grid, emphasizing milestone order rather than free choice. The label weight and ledger-line horizontal rule should make each row feel like a ship's manifest entry.

Visual tells that USI doesn't use:
- Each milestone pip has a small icon representing its flavor (a cannon ball for damage, a spiral for range, a flag for order changes)
- The selected row should have a warm copper frame rather than USI's cool cyan

### 2. Muster → Tide-Gauge Allocation

Metaphor: a **tidal chart with allocatable fill**

Layout:
- Two or three tall gauges side by side: Gunnery, Seamanship, later others
- Each gauge fills from combat XP
- The split between gauges is controlled by a draggable allocation line, like a tidal chart horizon
- A small "Current crew drill" label above each gauge
- Milestone marks on the gauges (cross the 25, 50, 100 mark for a one-time bonus)

How this differs from USI Compute: USI's bars fill over time and create passive bonuses. UB's gauges should feel like the player is choosing how hard to drill each crew discipline. The allocation line should visually feel like the captain drawing a chalk line on a board, not adjusting a technical slider.

Visual tells:
- Water or ink texture in the gauge fill
- The allocation split shows as a diagonal chalk-mark or divider across both bars
- Offline Muster gain should show as a fill color distinct from active session gain

### 3. Stormheart Furnace → Pressure Vessel + Valve Board

Metaphor: a **copper pressure gauge with toggleable valve slots**

Layout:
- Center: a large copper pressure gauge showing Storm Power level, with a danger line and a refill rate indicator
- Below the gauge: Ether Brine stock count and drain rate
- Below that: a row of valve slots (the boosts), each showing name, effect, and on/off toggle
- Active boosts show a lit indicator; over-limit boosts push the gauge into the red danger zone
- A small drain readout changes when the player enables or disables boosts

How this differs from USI Reactor: USI's Reactor is not shown in the screenshots but is described as a boost-and-drain system. UB's version should feel more physical and legible. The pressure gauge metaphor lets the player see danger before it happens. The valve slots make the over-limit rule intuitive: you can open more valves than the boiler can handle, and the pressure gauge shows the cost.

Visual tells:
- The pressure gauge should use an arc/needle visual, not a vertical bar, to distinguish it from Muster
- Boost toggle buttons should look like physical valve levers, not pill switches
- Storm Power fill inside the gauge should use Storm Cyan fading toward Signal Red as it depletes

### 4. Shipwright's Bench → Commission Board + Blueprint Grid

Metaphor: a **workbench with running commissions and a blueprint catalog below**

Layout:
- Upper zone: 1-2 active commission slots, each showing a blueprint roll icon, recipe name, Salvage cost, a timed progress bar (not a countdown timer — a forward-filling bar to feel different from USI Synth), Blueprint Mastery XP bar, and output count
- Below the commission slots: a "next commission" queue or material stock
- Lower zone: a grid of blueprint icons organized by material family (Timber, Brass, Saltglass, Powder). Each family has a muted background color consistent with the resource color palette.
- Standing Supply materials have a distinct "infinite" or "marked" indicator — like a stamp on the icon

How this differs from USI Synth:
- Progress is a forward fill rather than a red countdown — the tone is patient craft, not urgent production
- Blueprint icons should look more like rolled or folded documents than abstract recipe tiles
- The material grid should use UB's palette (Bone Parchment for timber, Oxidized Copper for brass, Saltglass Teal for lenses, Signal Red/powder for black powder materials)

Visual tells:
- Blueprint Mastery is shown as engraved marks or notches on the blueprint icon itself, not a separate progress bar
- Standing Supply materials show a small artisan's stamp

### 5. Admiralty Research → Branch Scroll + Focus Lantern

Metaphor: a **chart annotated with branch tracks and a focused lantern on one**

Layout:
- Four horizontal branch tracks (Gunnery, Shipwrighting, Navigation, Occult), each a long bar with research progress and milestone markers
- Current progress fills along the track, with labeled milestone nodes — the milestones are icons, not just numbers
- A "focus" lantern or pin can be placed on one branch, adding a visible glow to that track and showing the focus multiplier
- Route weight indicator: a small tag showing the active route's density bonus for each branch

How this differs from USI Research: USI Research is not shown in screenshots but is branch-based. UB's version should make the "focus" decision feel like placing a physical marker, not toggling a checkbox. The branch tracks should look like parallel lines on a chart with pins stuck in them, not horizontal progress bars in a settings menu.

Visual tells:
- Branch tracks use the route tag colors as accents (Trade Wind in neutral teal, Black Reef in copper-red, Storm Line in violet-cyan) to reinforce why route choice matters
- Milestone nodes on each track show what they unlock as an icon, not just a percentage number
- Unlocked milestones appear stamped/filled; future ones are ghosted but visible — following USI's principle of showing the full roadmap ahead

### 6. Relic Compass → Physical Socket Board

Metaphor: a **circular compass tray with slotted relics**

Layout:
- A circular or semi-circular compass board with 2-6 visible sockets
- Each socket has a colored rim (the slot color affects secondary effect)
- Relics are chunky icon objects — dragged or tapped into sockets
- Attunement appears as a fill ring around each relic, not a separate bar — as the ring fills, engravings appear on the relic
- Ghosted constellation lines connect linked sockets; they become solid when a link is unlocked

How this is already strong in the design bible: the physical tray metaphor is well established. The key USI lesson to apply here is that slot color should be an immediately readable attribute — USI uses colored slot rims and it reads clearly. UB must avoid making slot color a tiny label or a tooltip-only mechanic.

Visual tells:
- The compass board is the most distinct shape in the entire tab — circular vs every other tab which uses rectangles
- Relics should look like objects from a maritime curiosity cabinet: tooth, coin, eye, nail, thread, bone, compass fragment
- The Attunement fill ring distinguishes Relic Compass from V-Device's flat resonance bar

### 7. Return to Port → Harbor Charter with Ship Diagram

Metaphor: a **harbor booking document with a central ship silhouette**

Layout:
- Background: harbor silhouette at the edges (lighter than combat, dusk or dawn lighting)
- Center: a side-profile ship silhouette with labeled attach points (Bow, Main Deck, Stern, Hull). Clicking a point opens its loadout selection.
- Left panel: what resets (list in Signal Red ink)
- Right panel: what persists (list in Lantern Green)
- Bottom: Infamy Marks earned this voyage, affordable prestige unlocks, "Return to Port" confirmation stamp

How this differs from USI Prestige: USI uses an overhead/isometric diagram. UB should use a side-profile silhouette because that is the combat camera angle — the player already knows the ship from the side. The diagram should feel like a ship's loading manifest rather than a technical blueprint.

Visual tells:
- The ship silhouette should be stylized and pushed, matching the visual bible's toy-theater aesthetic
- The "stamp" confirmation should feel like a wax seal being pressed — a brief animation on confirm
- Infamy marks should appear as red seal stamps on the charter

### 8. Port Facilities → Building Grid with Named Silhouettes

Metaphor: a **port district map with chunky building tiles**

Layout: follows USI Bases structure very closely — a color-coded tile grid. The UB distinction is that each building tile should read as a named structure silhouette (drydock crane, foundry chimney, observatory dome, hidden cove arch) rather than a generic colored square.

Color mapping (following the palette):
- Arsenal/combat buildings: Oxidized Copper tiles
- Shipwright buildings: Bone Parchment/Copper tiles
- Navigation/Research buildings: Saltglass Teal tiles
- Occult/Officer buildings: Ritual Violet tiles

The prestige bonus callout should show a small ship icon indicating which system gets the boost, matching the visual bible's "every tab answers: what does this do for combat?"

Visual tells:
- First grid should be small (3x3) and only use 2 building types so the spatial puzzle is learnable without a guide
- Locked tiles should show the building's silhouette ghosted, making the future layout visible

### 9. Storm Contracts → Sealed Contract Board

Metaphor: a **notice board with pinned sealed contracts**

Layout:
- A dark cork/wood board with 3-5 contract notices pinned to it
- Each contract is a card showing: name, contract type icon, enemy fleet silhouette, objective, reward, and charge state
- Available contracts have their seal intact; charging contracts show a filling charge indicator on the seal
- A selected contract expands into a larger card with full details and "Begin Contract" button

How this differs from USI Warp: USI Warp has a massive upgrade tree. Storm Contracts should feel more like accepting a bounty — discrete contracts, not a sprawling map. If a Storm Contract upgrade tree is needed later, it could live in a separate "Contract Log" sub-tab rather than dominating the primary view.

Visual tells:
- The notice-board metaphor is completely different from every other tab — physical pinned objects vs rows, grids, gauges, or diagrams
- Faction seals on each contract reinforce which faction is offering it
- A charged but unused contract should feel like an opportunity cost — a bright seal pulse

### 10. Captain's Ledger → Wax-Stamped Progress Book

Metaphor: an **open ledger book with feat entries and wax stamps**

Layout:
- A two-page spread: left page lists current ledger requirements, right page shows completed feats
- Each requirement is a short entry with the relevant system icon, a description, and a progress fill (not a checkbox — a progress entry that looks like a logbook line)
- Completed entries get a wax stamp crossing them off
- A "remaining until phase transition" indicator at the bottom

Visual tells:
- This is the only tab that uses a book/spread layout — everything else is a panel
- The book metaphor makes the mastery gate feel like a captain's personal record, not homework
- Each requirement should deep-link to its source tab when tapped

### 11. Captain's Trials → Sealed Trial Contracts

Metaphor: **special contract cards with trial rules**

Layout: similar to Storm Contracts (sealed notice), but trial cards use a distinct stamp type (a wax seal with a test/challenge symbol rather than a faction seal). Each trial card shows: trial name, active rule restrictions, which system carries the run, and completion rewards. "Begin Trial" initiates a prestige-like reset into the restricted voyage.

Visual tells:
- Trial cards should look more ceremonial than contract cards — heavier paper, formal seal, formal language
- Active trial rules should be summarized in 2-3 bullet points, not prose

### 12. Officers → Crew Roster with Portrait Pins

Metaphor: a **cork board crew roster with portrait pin entries**

Layout:
- Each active officer is a portrait card pinned to the roster
- Portrait shows: role icon, name, current disciplines (Gunnery, Seamanship, etc.) as small pips or bars
- A "Commission" section below shows inactive officer slots with recruit/reassign options
- Clicking an officer expands to show full discipline progress, rank, current skill choices, and Veteran Record

Visual tells:
- Portrait cards are the only character-centric content in the tab set — they stand out visually because of the illustrated character frames
- Discipline progress uses the same fill gauge metaphor as Muster, creating a visual link between the two systems
- Veteran Record (catch-up progress) should show as a faint ghost-gauge behind the current gauge

### 13. Captain's Orders → Standing Order Book

Metaphor: an **order book with toggle-able standing orders**

Layout:
- A list of order categories (Targeting, Crafting, Navigation, Combat, Prestige)
- Each category expands to show specific automation rules as toggle entries
- Active rules show a wax-checkmark or "stamped and delivered" state
- Locked rules show their unlock requirement
- A "currently automated" summary strip at the top showing what the crew is handling

Visual tells:
- The order book differs from the ledger by being more like an instruction sheet than a record — it looks like captain's orders being read by the crew, not a completed log
- Automation confirmations should feel like sealing an order, not ticking a checkbox

## Original Visual Patterns USI Doesn't Use

These are visual grammar opportunities UB can own that USI does not employ:

### A. Course Control as Helm Flag

USI's Hold/Forward controls are small arrows at the edge of the combat panel. UB's course control should be **large named flag buttons** where each course mode has a physical flag identity:

- Full Sail (Forward): green pennant, upward arrow
- Hold Course: teal signal flag, horizontal
- Beat Retreat: orange or red lantern signal, downward

The selected flag should appear on a mast in the combat view, creating a direct visual link between the control and the sea. This is a UB-native grammar that has no USI equivalent.

### B. The Sea Panel as a Living Chart

USI's combat lane is a narrow dark column — informative but visually sparse. UB's sea panel should function as a **readable navigational chart that also shows combat**. Along the bottom of the sea panel runs a chart strip showing current position, sector distance, boss marker, and upcoming hazards/route branches. The strip uses map iconography (compass marks, depth shading, route lines) rather than a simple progress bar.

This turns the combat view into a dual-purpose screen: players watch the fight with the top half and read the route with the bottom strip. USI separates these concerns; UB integrates them.

### C. Encounter Pressure as Visual Fleet Composition

USI shows one or two enemies clearly. UB's enemy groups should telegraph **fleet doctrine** through visual composition — a Privateer escort positions its frigates forward with the flagship behind; an Ironclad escort is tightly packed with overlapping silhouettes; a Hexed Corsair group is scattered and irregular. The arrangement tells the player what targeting doctrine to use before the fight is joined.

This makes the sea panel diagnostic in a way USI's is not: the player reads the incoming fleet formation and decides on a targeting doctrine before the first volley.

### D. Infamy as a Progressing Visual State

USI's prestige is functional. UB's Return to Port screen should show **infamy accumulation as a physical bounty notice change** — the first Return to Port shows a blank notice; each voyage adds to the notice (ship name, recent crimes, sector clears, Infamy Marks). By the fifth or sixth Return, the notice looks like a famous pirate's wanted poster. This is a visual meta-progression layer USI entirely lacks, and it ties the prestige ritual to the game's central fiction.

### E. Relic Attunement as Object Transformation

USI V-Device resonance is a numerical fill. UB Relic Attunement should visually transform the relic object as Attunement fills — cracks seal, engravings deepen, a faint glow appears in the center. The relic should look different at Attunement 1 vs Attunement 10. This makes duplicate drops feel like continued investment in the object rather than a stat number increasing.

## Summary Grid

| UB System | Structural Metaphor | Key Visual Signature | USI Equivalent |
| --- | --- | --- | --- |
| Arsenal | Horizontal row list + milestone pip line | Stamped pip milestones | Core |
| Muster | Tide-gauge allocation | Allocation chalk-line between gauges | Compute |
| Stormheart Furnace | Pressure vessel + valve board | Copper arc gauge with valve slots | Reactor |
| Shipwright's Bench | Commission board + blueprint grid | Forward-fill progress + material grid | Synth |
| Admiralty Research | Branch chart tracks + focus lantern | Physical lantern marker on one track | Research |
| Relic Compass | Physical socket board | Circular compass tray (only circular UI) | V-Device |
| Return to Port | Harbor charter + ship silhouette | Side-profile labeled attach points | Prestige |
| Port Facilities | Building grid with silhouette tiles | Named building silhouettes per tile | Bases |
| Storm Contracts | Sealed contract notice board | Discrete pinned contract cards | Warp Drive |
| Captain's Ledger | Open ledger book spread | Two-page wax-stamped entries | Task List |
| Captain's Trials | Ceremonial trial contracts | Sealed trial cards with rule summary | Challenges |
| Officers | Crew roster with portrait pins | Character portrait cards | Crew |
| Captain's Orders | Standing order book | Toggle-able orders with wax stamps | AI |
| Course Control | Helm flag buttons | Flag changes visible on ship's mast | none in USI |
| Sea Panel | Living navigational chart | Route strip under combat | none in USI |

## Design Rules Derived From This Analysis

1. **Never let two tabs share the same structural metaphor.** If Arsenal and Research both feel like "list of things to buy," one is wrong.

2. **The organizing element of each tab must be visible immediately.** The pressure gauge, the socket board, the grid tiles, and the ship silhouette should not require scrolling to see. They are the first thing the player encounters.

3. **Each tab's key active decision should be the most visually prominent element.** The Stormheart arc gauge shows how close to over-limit. The Muster allocation line shows the split. The Blueprint Mastery notch shows where the recipe stands. The decision visibility replaces manual calculation.

4. **Locked future content should be visible, dimmed, in every tab.** USI does this consistently. It is not a feature — it is a grammar rule. Players form plans when they can see where a tab goes.

5. **The sea panel is not a separate game.** Every tab should answer the question: how does this change what happens in the sea? Visible combat tells — heavier smoke, tighter fleet formation, different boost color — are the evidence that the captain's desk is working.
