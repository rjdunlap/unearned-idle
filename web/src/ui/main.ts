import './styles.css'
import { ABILITY_ACTIVE_TICKS, ABILITY_COOLDOWN_TICKS, CONTRACTS, GameState, OFFICERS, PORT_FACILITIES, RELICS, RESEARCH_BRANCHES, SHIPWRIGHT_RECIPES } from '../core/game-state'
import { sim } from '../core/sim'
import { Definitions } from '../core/definitions'
import { Balance } from '../core/balance'
import { SaveSystem } from '../core/save-system'
import { SectorPlan } from '../core/sector-plan'
import type { AbilityId, OfficerId, PortFacilityId, RelicId, ResearchBranchId, StormBoostId } from '../core/types'
import type { SystemUnlock } from '../core/game-state'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDef = Record<string, any>
type ArsenalCardRefs = {
  upgrade: AnyDef
  level: HTMLElement
  desc: HTMLElement
  cost: HTMLElement
  progress: HTMLElement
  button: HTMLButtonElement
  milestoneContainer: HTMLElement
}
type DeskTab = 'arsenal' | 'prestige' | 'muster' | 'stormheart' | 'shipwright' | 'research' | 'relics' | 'contracts' | 'port' | 'trials' | 'officers' | 'orders' | 'ledger' | 'log'

// ── DOM refs ──────────────────────────────────────────────────────────────────
let shellRoot:       HTMLElement
let laneLabel:       HTMLElement
let bossBanner:      HTMLElement
let titleFocusBtn:   HTMLButtonElement
let routeDistanceLabel: HTMLElement
let routeMeterFill: HTMLElement
let sectorDiagnostic: HTMLElement
let autoProgressBtn: HTMLButtonElement
let courseForwardBtn: HTMLButtonElement
let courseHoldBtn: HTMLButtonElement
let courseRetreatBtn: HTMLButtonElement
let seaAbilityDock: HTMLElement
let seaContactLayer: HTMLElement
let playerRect:      HTMLElement
let playerHpFill:    HTMLElement
let playerHpLabel:   HTMLElement
let enemyFamily:     HTMLElement
let enemyRect:       HTMLElement
let enemyName:       HTMLElement
let enemyHpFill:     HTMLElement
let enemyHpLabel:    HTMLElement
let counterHint:     HTMLElement
let combatLog:       HTMLElement
let combatRow:       HTMLElement   // positioned container for VFX
let salvageLabel:    HTMLElement
let doubloonsLabel:  HTMLElement
let arsenalHeader:   HTMLElement
let arsenalTargetingPanel: HTMLElement
let arsenalList:     HTMLElement
let arsenalSection:  HTMLElement
let arsenalCards:    ArsenalCardRefs[] = []
const abilityButtons = new Map<AbilityId, HTMLButtonElement>()
let arsenalWeaponId = ''
let arsenalTabBtn: HTMLButtonElement
let prestigeTabBtn: HTMLButtonElement
let musterTabBtn: HTMLButtonElement
let stormheartTabBtn: HTMLButtonElement
let shipwrightTabBtn: HTMLButtonElement
let researchTabBtn: HTMLButtonElement
let relicsTabBtn: HTMLButtonElement
let contractsTabBtn: HTMLButtonElement
let portTabBtn: HTMLButtonElement
let trialsTabBtn: HTMLButtonElement
let officersTabBtn: HTMLButtonElement
let ordersTabBtn: HTMLButtonElement
let ledgerTabBtn: HTMLButtonElement
let logTabBtn: HTMLButtonElement
let prestigeSection: HTMLElement
let stormheartSection: HTMLElement
let shipwrightSection: HTMLElement
let researchSection: HTMLElement
let relicsSection: HTMLElement
let contractsSection: HTMLElement
let portSection: HTMLElement
let trialsSection: HTMLElement
let officersSection: HTMLElement
let ordersSection: HTMLElement
let ledgerSection: HTMLElement
let logSection: HTMLElement
let prestigeMilestoneList: HTMLElement
let prestigeLoadoutList: HTMLElement
let returnPortBtn: HTMLButtonElement
let returnPortNote: HTMLElement
let musterSection:   HTMLElement
let musterGunneryBar:  HTMLElement
let musterGunneryLabel: HTMLElement
let musterGunneryBonus: HTMLElement
let musterGunneryProgress: HTMLElement
let musterSeamanshipBar: HTMLElement
let musterSeamanshipLabel: HTMLElement
let musterSeamanshipBonus: HTMLElement
let musterSeamanshipProgress: HTMLElement
let musterAllocationSlider: HTMLInputElement
let musterGunneryPowerLabel: HTMLElement
let musterSeamanshipPowerLabel: HTMLElement
let musterGunneryRate: HTMLElement
let musterSeamanshipRate: HTMLElement
let advanceBtn:      HTMLButtonElement
let statusRailBtn:   HTMLButtonElement
let deskRailBtn:     HTMLButtonElement
let debugOverlay:    HTMLElement
let doctrineFocusBtn:       HTMLButtonElement
let doctrineSuppressionBtn: HTMLButtonElement
let doctrineScatterBtn:     HTMLButtonElement
const simEscorts: (HTMLElement | null)[] = []
let currentEnemyDef: AnyDef | undefined
let currentEnemyHull = 0
let currentEnemyMaxHull = 0
let currentContactHpFill: HTMLElement | null = null
let playerShotCursor = 0
let enemyShotCursor = 0
let fleetContactTimer = 0
let nextLootDropAt = 0
let lootDropSerial = 0
let visualWaveStartedAt = 0
let visualWaveSerial = 0
let playerFleeing = false

let currentLaneId  = 'lane_01'
let nextLaneId     = ''
let laneCleared    = false
const LOG_MAX     = 40
const logLines: string[] = []
const VISUAL_WAVE_INTERVAL_MS = 30_000
const VISUAL_WAVE_SPAWN_WINDOW_MS = 10_000
const FLEET_CONTACT_DAMAGE = 1
const CONTACT_DISTANCE_STEP = SectorPlan.encounterDistance
const MAX_LOOT_DROPS = 5
const LOOT_DROP_LIFETIME_MS = 24_000

type SeaContactStatus = 'current' | 'escort' | 'incoming' | 'looming' | 'boss'
type SeaContactSlot = {
  x: number
  y: number
  rot: number
  scale: number
  delay?: number
}
type SeaWaveContact = { slot: SeaContactSlot; def: AnyDef | undefined; status: SeaContactStatus; caption: string; hull?: number; maxHull?: number }
type SeaContactRuntime = {
  key: string
  hull: number
  maxHull: number
  damage: number
  nextFireAt: number
}
const seaContactStates = new Map<string, SeaContactRuntime>()

// Wreckage positions (lane cleared)
const CONTACT_SLOTS: SeaContactSlot[] = [
  { x: 36, y: 44, rot: 18,  scale: 0.92, delay: 0 },
  { x: 58, y: 36, rot: -8,  scale: 1.0,  delay: 2 },
  { x: 72, y: 58, rot: 28,  scale: 0.84, delay: 4 },
]

// Selected target (settled in front of player, upper-center)
const VANGUARD_CONTACT_SLOT: SeaContactSlot = { x: 58, y: 29, rot: -10, scale: 1.08, delay: 0 }

// Port raiders — settled in left zone, animation enters from the left edge
const PORT_WAVE_SLOTS: SeaContactSlot[] = [
  { x: 9,  y: 32, rot: 32, scale: 0.82, delay: 0 },
  { x: 17, y: 49, rot: 26, scale: 0.96, delay: 2 },
  { x: 7,  y: 66, rot: 20, scale: 0.74, delay: 5 },
  { x: 25, y: 59, rot: 18, scale: 0.68, delay: 7 },
]

// Starboard cutters — settled in right zone, animation enters from the right edge
const STARBOARD_WAVE_SLOTS: SeaContactSlot[] = [
  { x: 91, y: 32, rot: -34, scale: 0.82, delay: 1 },
  { x: 83, y: 49, rot: -28, scale: 0.96, delay: 3 },
  { x: 93, y: 66, rot: -22, scale: 0.74, delay: 6 },
  { x: 75, y: 59, rot: -18, scale: 0.68, delay: 8 },
]

const BOSS_CONTACT_SLOT: SeaContactSlot = { x: 56, y: 25, rot: -10, scale: 1.18, delay: 0 }
const BOSS_ESCORT_SLOTS: SeaContactSlot[] = [
  { x: 10, y: 40, rot: 32,  scale: 0.88, delay: 0 },
  { x: 90, y: 40, rot: -34, scale: 0.88, delay: 1 },
  { x: 32, y: 16, rot: 10,  scale: 0.72, delay: 2 },
  { x: 68, y: 16, rot: -18, scale: 0.72, delay: 3 },
]

// ── Entry point ───────────────────────────────────────────────────────────────
export function init(container: HTMLElement): void {
  buildUI(container)
  connectSignals()
}

// ── UI construction (mirrors Main.gd _build_ui) ───────────────────────────────
function buildUI(root: HTMLElement): void {
  shellRoot = root
  root.classList.add('ub-shell')
  buildSeaLanePanel(root)
  buildStatusStrip(root)
  buildBottomPanel(root)
  buildDebugOverlay(root)
  startVisualWave(true)
  refreshLaneLabel()
  refreshRouteUI()
  refreshSeaContacts()
  refreshMechanicsToggle()
  startFleetContactSim()
  window.addEventListener('resize', () => {
    if (shellRoot.classList.contains('mechanics-collapsed')) setMechanicsFocus(true)
  })
}

function buildSeaLanePanel(root: HTMLElement): void {
  const panel = el('div', 'panel-ocean')
  root.appendChild(panel)

  // Title row
  const titleRow = el('div', 'lane-title-row')
  laneLabel  = el('span', 'lane-label')
  bossBanner = el('span', 'boss-banner hidden', 'BOSS')
  titleRow.append(laneLabel, bossBanner)
  panel.appendChild(titleRow)

  buildCourseControls(panel)

  // Combat row (positioned container for VFX projectiles)
  combatRow = el('div', 'combat-row')
  panel.appendChild(combatRow)

  combatRow.appendChild(el('div', 'sea-grid'))
  buildSeaCourseControls(combatRow)
  seaAbilityDock = el('div', 'sea-ability-dock')
  buildArsenalAbilityButtons(seaAbilityDock)
  combatRow.appendChild(seaAbilityDock)

  seaContactLayer = el('div', 'sea-contact-layer')
  combatRow.appendChild(seaContactLayer)

  buildEnemyBlock(combatRow)
  buildPlayerBlock(combatRow)

  titleFocusBtn = btn('⋮', 'title-focus-btn sz-12 c-gold') as HTMLButtonElement
  titleFocusBtn.title = "Collapse the Captain's Desk"
  titleFocusBtn.setAttribute('aria-label', "Toggle Captain's Desk")
  titleFocusBtn.addEventListener('click', toggleMechanicsFocus)
  panel.appendChild(titleFocusBtn)

  // Counter hint
  counterHint = el('span', 'counter-hint hidden')
  panel.appendChild(counterHint)

}

function buildCourseControls(parent: HTMLElement): void {
  const nav = el('div', 'route-nav')
  const meter = el('div', 'route-meter')
  routeMeterFill = el('span', 'route-meter-fill')
  meter.appendChild(routeMeterFill)
  routeDistanceLabel = el('span', 'route-distance-label')
  nav.append(meter, routeDistanceLabel)
  parent.appendChild(nav)
  sectorDiagnostic = el('div', 'sector-diagnostic')
  parent.appendChild(sectorDiagnostic)
}

function buildSeaCourseControls(parent: HTMLElement): void {
  const controls = el('div', 'course-controls')
  autoProgressBtn = btn('A', 'course-btn') as HTMLButtonElement
  autoProgressBtn.title = 'Automatically sail after each victory'
  autoProgressBtn.setAttribute('aria-label', 'Toggle auto progress')
  autoProgressBtn.addEventListener('click', () => GameState.setAutoProgress(!GameState.isAutoProgress()))

  courseForwardBtn = btn('>', 'course-btn') as HTMLButtonElement
  courseForwardBtn.title = 'Push into deeper water after victories'
  courseForwardBtn.setAttribute('aria-label', 'Forward')
  courseForwardBtn.addEventListener('click', () => GameState.setCourseMode('forward'))

  courseHoldBtn = btn('||', 'course-btn') as HTMLButtonElement
  courseHoldBtn.title = 'Keep fighting at this distance'
  courseHoldBtn.setAttribute('aria-label', 'Hold')
  courseHoldBtn.addEventListener('click', () => GameState.setCourseMode('hold'))

  courseRetreatBtn = btn('<', 'course-btn') as HTMLButtonElement
  courseRetreatBtn.title = 'Win fights while sailing back toward safer water'
  courseRetreatBtn.setAttribute('aria-label', 'Back')
  courseRetreatBtn.addEventListener('click', () => GameState.setCourseMode('retreat'))

  controls.append(autoProgressBtn, courseForwardBtn, courseHoldBtn, courseRetreatBtn)
  parent.appendChild(controls)
}

function buildDoctrineControls(parent: HTMLElement): void {
  const row = el('div', 'doctrine-controls')
  const header = el('div', 'targeting-header')
  header.appendChild(el('span', 'loadout-kicker', 'TARGETING'))
  header.appendChild(el('span', 'targeting-mode-label', 'Weapon order'))
  row.appendChild(header)

  doctrineFocusBtn = btn('Keep Target', 'doctrine-btn sz-12') as HTMLButtonElement
  doctrineFocusBtn.title = 'USI-like target swapping: stay on the selected or boss target.'
  doctrineFocusBtn.addEventListener('click', () => GameState.setDoctrine('focus'))

  doctrineSuppressionBtn = btn('Change Target', 'doctrine-btn sz-12') as HTMLButtonElement
  doctrineSuppressionBtn.title = 'USI-like target swapping: cycle selected and escort targets.'
  doctrineSuppressionBtn.addEventListener('click', () => GameState.setDoctrine('suppression'))

  doctrineScatterBtn = btn('Avoid Overlap', 'doctrine-btn sz-12') as HTMLButtonElement
  doctrineScatterBtn.title = 'USI-like overlap rule: spread shots across visible threats.'
  doctrineScatterBtn.addEventListener('click', () => GameState.setDoctrine('scatter'))

  row.append(doctrineFocusBtn, doctrineSuppressionBtn, doctrineScatterBtn)
  parent.appendChild(row)
  refreshDoctrineUI()
}

function buildPlayerBlock(parent: HTMLElement): void {
  const block = el('div', 'ship-block ship-block-player')
  playerRect = el('div', 'ship-rect ship-rect-player')
  block.appendChild(playerRect)
  const bar = el('div', 'hp-bar')
  playerHpFill = el('div', 'hp-fill hp-fill-green')
  playerHpFill.style.width = '100%'
  bar.appendChild(playerHpFill)
  block.appendChild(bar)
  playerHpLabel = el('span', 'sz-11 c-text', '120 / 120')
  block.appendChild(playerHpLabel)
  parent.appendChild(block)
}

function buildEnemyBlock(parent: HTMLElement): void {
  const block = el('div', 'ship-block ship-block-enemy')
  block.appendChild(el('span', 'target-kicker c-copper', 'SELECTED TARGET'))
  enemyFamily = el('span', 'sz-11 c-copper', 'Privateers')
  block.appendChild(enemyFamily)
  enemyRect = el('div', 'ship-rect ship-rect-enemy')
  block.appendChild(enemyRect)
  enemyName = el('span', 'sz-11 bold c-text', 'Privateer Cutter')
  block.appendChild(enemyName)
  const bar = el('div', 'hp-bar')
  enemyHpFill = el('div', 'hp-fill hp-fill-red')
  enemyHpFill.style.width = '100%'
  bar.appendChild(enemyHpFill)
  block.appendChild(bar)
  enemyHpLabel = el('span', 'sz-11 c-text', '40 / 40')
  block.appendChild(enemyHpLabel)
  parent.appendChild(block)
}

function buildStatusStrip(root: HTMLElement): void {
  const strip = el('div', 'status-strip')

  statusRailBtn = btn('DESK', 'status-rail-toggle sz-12 c-gold') as HTMLButtonElement
  statusRailBtn.title = "Open the Captain's Desk"
  statusRailBtn.addEventListener('click', toggleMechanicsFocus)
  strip.appendChild(statusRailBtn)

  strip.appendChild(el('span', 'sz-14 c-copper', '⚙'))
  salvageLabel = el('span', 'sz-14 bold c-copper', '0')
  strip.appendChild(salvageLabel)

  strip.appendChild(el('div', 'vsep'))

  strip.appendChild(el('span', 'sz-14 c-gold', '◈'))
  doubloonsLabel = el('span', 'sz-14 bold c-gold', '0')
  strip.appendChild(doubloonsLabel)

  strip.appendChild(el('div', 'flex-grow'))

  const saveBtn = btn('SAVE', 'sz-13')
  saveBtn.style.height = '40px'
  saveBtn.addEventListener('click', () => {
    SaveSystem.saveGame()
    appendLog('<span class="log-green">Game saved.</span>')
  })
  strip.appendChild(saveBtn)

  const debugToggleBtn = btn('DBG', 'sz-11 debug-toggle-btn')
  debugToggleBtn.title = 'Toggle debug overlay'
  debugToggleBtn.addEventListener('click', () => debugOverlay.classList.toggle('hidden'))
  strip.appendChild(debugToggleBtn)

  root.appendChild(strip)
}

function buildBottomPanel(root: HTMLElement): void {
  const panel = el('div', 'panel-bg')
  root.appendChild(panel)

  deskRailBtn = btn("CAPTAIN'S DESK", 'desk-rail-toggle sz-12 c-gold') as HTMLButtonElement
  deskRailBtn.title = "Open the Captain's Desk"
  deskRailBtn.addEventListener('click', toggleMechanicsFocus)
  panel.appendChild(deskRailBtn)

  // Tab rows — Row A: core/early (P0–P8), Row B: deep/late (P12+) + utils
  const tabRows = el('div', 'tab-rows')
  const tabRowA = el('div', 'tab-row')
  const tabRowB = el('div', 'tab-row')

  arsenalTabBtn = btn('ARSENAL', 'tab-btn c-gold') as HTMLButtonElement
  labelDeskTab(arsenalTabBtn, 'ARSENAL', 'P0')
  arsenalTabBtn.classList.add('is-active')
  arsenalTabBtn.addEventListener('click', () => setActiveTab('arsenal'))
  tabRowA.appendChild(arsenalTabBtn)

  prestigeTabBtn = btn('PRESTIGE', 'tab-btn') as HTMLButtonElement
  labelDeskTab(prestigeTabBtn, 'PRESTIGE', 'P1')
  prestigeTabBtn.addEventListener('click', () => setActiveTab('prestige'))
  tabRowA.appendChild(prestigeTabBtn)

  musterTabBtn = btn('MUSTER', 'tab-btn') as HTMLButtonElement
  labelDeskTab(musterTabBtn, 'MUSTER', 'P2')
  musterTabBtn.addEventListener('click', () => setActiveTab('muster'))
  tabRowA.appendChild(musterTabBtn)

  stormheartTabBtn = btn('STORMHEART', 'tab-btn') as HTMLButtonElement
  labelDeskTab(stormheartTabBtn, 'STORMHEART', 'P4')
  stormheartTabBtn.addEventListener('click', () => setActiveTab('stormheart'))
  tabRowA.appendChild(stormheartTabBtn)

  shipwrightTabBtn = btn('SHIPWRIGHT', 'tab-btn') as HTMLButtonElement
  labelDeskTab(shipwrightTabBtn, 'SHIPWRIGHT', 'P5')
  shipwrightTabBtn.addEventListener('click', () => setActiveTab('shipwright'))
  tabRowA.appendChild(shipwrightTabBtn)

  researchTabBtn = btn('RESEARCH', 'tab-btn') as HTMLButtonElement
  labelDeskTab(researchTabBtn, 'RESEARCH', 'P6')
  researchTabBtn.addEventListener('click', () => setActiveTab('research'))
  tabRowA.appendChild(researchTabBtn)

  relicsTabBtn = buildDeckTab(tabRowA, 'RELICS', 'P8', 'relics', 'Relic Compass target unlock: Passage 8 clear')

  contractsTabBtn = buildDeckTab(tabRowB, 'CONTRACTS', 'P12', 'contracts', 'Storm Contracts target unlock: Passage 12 or first elite branch clear')
  portTabBtn      = buildDeckTab(tabRowB, 'PORT',      'P15', 'port',      'Port Facilities target unlock: Passage 15 clear')
  trialsTabBtn    = buildDeckTab(tabRowB, 'TRIALS',    'P18', 'trials',    "Captain's Trials target unlock: Passage 18 clear")
  officersTabBtn  = buildDeckTab(tabRowB, 'OFFICERS',  'P20', 'officers',  'Officers target unlock: Passage 20 clear')
  ordersTabBtn    = buildDeckTab(tabRowB, 'ORDERS',    'P25', 'orders',    "Captain's Orders target unlock: Passage 25 clear")
  ledgerTabBtn    = buildDeckTab(tabRowB, 'LEDGER',    'P30', 'ledger',    "Captain's Ledger target unlock: Passage 30 clear")

  logTabBtn = btn('LOG', 'tab-btn') as HTMLButtonElement
  logTabBtn.addEventListener('click', () => setActiveTab('log'))
  tabRowB.appendChild(logTabBtn)

  tabRows.appendChild(tabRowA)
  tabRows.appendChild(tabRowB)
  panel.appendChild(tabRows)

  panel.appendChild(el('hr'))

  buildArsenalPanel(panel)
  buildPrestigePanel(panel)
  buildMusterPanel(panel)
  buildStormheartPanel(panel)
  buildShipwrightPanel(panel)
  buildResearchPanel(panel)
  buildRelicsPanel(panel)
  buildContractsPanel(panel)
  buildPortPanel(panel)
  buildTrialsPanel(panel)
  buildOfficersPanel(panel)
  buildOrdersPanel(panel)
  buildLedgerPanel(panel)
  buildLogPanel(panel)
  refreshSystemLocks()

  advanceBtn = btn('▶  CHART NEXT WATERS', 'btn-advance sz-16 c-gold') as HTMLButtonElement
  advanceBtn.classList.add('hidden')
  advanceBtn.addEventListener('click', onAdvanceLane)
  panel.appendChild(advanceBtn)
}

function buildDeckTab(parent: HTMLElement, label: string, passage: string, tab: DeskTab, title: string): HTMLButtonElement {
  const tabBtn = btn(label, 'tab-btn') as HTMLButtonElement
  labelDeskTab(tabBtn, label, passage)
  tabBtn.title = title
  tabBtn.addEventListener('click', () => setActiveTab(tab))
  parent.appendChild(tabBtn)
  return tabBtn
}

function buildArsenalPanel(parent: HTMLElement): void {
  arsenalSection = el('section', 'arsenal-panel')
  arsenalHeader = el('span', 'arsenal-header')
  arsenalTargetingPanel = el('div', 'arsenal-targeting-panel')
  buildDoctrineControls(arsenalTargetingPanel)
  arsenalList = el('div', 'arsenal-grid')
  arsenalSection.append(arsenalHeader, arsenalTargetingPanel, arsenalList)
  parent.appendChild(arsenalSection)
  refreshArsenalUI()
}

function buildArsenalAbilityButtons(parent: HTMLElement): void {
  const abilities: Array<{ id: AbilityId; label: string; title: string }> = [
    { id: 'overcharge', label: 'BROADSIDES', title: '5s of stronger, faster cannon fire. 40s cooldown.' },
    { id: 'repair', label: 'PATCH CREW', title: '5s of rapid hull repairs. 40s cooldown.' },
  ]
  for (const ability of abilities) {
    const b = btn(ability.label, 'ability-btn') as HTMLButtonElement
    b.title = ability.title
    b.addEventListener('click', () => onActivateAbility(ability.id))
    abilityButtons.set(ability.id, b)
    parent.appendChild(b)
  }
}

function buildPrestigePanel(parent: HTMLElement): void {
  prestigeSection = el('section', 'prestige-panel hidden')

  const header = el('div', 'muster-header-row')
  header.appendChild(el('span', 'arsenal-header', 'PRESTIGE'))
  header.appendChild(el('span', 'sz-11 c-silver', 'Return to port, choose your outfitting, and open new systems'))
  prestigeSection.appendChild(header)

  prestigeMilestoneList = el('div', 'prestige-milestones')
  prestigeSection.appendChild(prestigeMilestoneList)

  prestigeLoadoutList = el('div', 'prestige-loadout-grid')
  prestigeSection.appendChild(prestigeLoadoutList)

  returnPortNote = el('div', 'prestige-note')
  prestigeSection.appendChild(returnPortNote)

  returnPortBtn = btn('RETURN TO PORT', 'btn-lg sz-15 c-gold') as HTMLButtonElement
  returnPortBtn.addEventListener('click', onReturnToPort)
  prestigeSection.appendChild(returnPortBtn)

  parent.appendChild(prestigeSection)
  refreshPrestigeUI()
}

function buildMusterPanel(parent: HTMLElement): void {
  musterSection = el('section', 'muster-panel hidden')

  const header = el('div', 'muster-header-row')
  header.appendChild(el('span', 'arsenal-header', 'MUSTER'))
  header.appendChild(el('span', 'sz-11 c-silver', 'Battle-earned crew power'))
  musterSection.appendChild(header)

  // Tide gauges
  const gauges = el('div', 'muster-gauges')

  function buildGaugeCol(
    kicker: string,
    fillClass: string,
    labelRef: (el: HTMLElement) => void,
    barRef: (el: HTMLElement) => void,
    bonusRef: (el: HTMLElement) => void,
    progressRef: (el: HTMLElement) => void,
    rateRef: (el: HTMLElement) => void,
  ): HTMLElement {
    const col = el('div', 'muster-gauge-col')

    const lvlLabel = el('div', 'muster-gauge-lvl')
    labelRef(lvlLabel)
    col.appendChild(lvlLabel)

    const gauge = el('div', 'muster-gauge')
    // tick marks at 25 / 50 / 75 % from bottom
    for (const pct of [25, 50, 75]) {
      const tick = el('div', 'muster-gauge-tick')
      tick.style.bottom = `${pct}%`
      gauge.appendChild(tick)
    }
    const fill = el('div', `muster-gauge-fill ${fillClass}`)
    barRef(fill)
    gauge.appendChild(fill)
    col.appendChild(gauge)

    col.appendChild(el('div', 'muster-gauge-kicker', kicker))

    const bonus = el('div', 'muster-bonus-label')
    bonusRef(bonus)
    col.appendChild(bonus)

    const progress = el('div', 'muster-progress-label')
    progressRef(progress)
    col.appendChild(progress)

    const rate = el('div', 'muster-rate-label')
    rateRef(rate)
    col.appendChild(rate)

    return col
  }

  gauges.appendChild(buildGaugeCol(
    'GUNNERY', 'muster-gauge-fill--gun',
    e => { musterGunneryLabel = e },
    e => { musterGunneryBar = e },
    e => { musterGunneryBonus = e },
    e => { musterGunneryProgress = e },
    e => { musterGunneryRate = e },
  ))
  gauges.appendChild(buildGaugeCol(
    'SEAMANSHIP', 'muster-gauge-fill--sea',
    e => { musterSeamanshipLabel = e },
    e => { musterSeamanshipBar = e },
    e => { musterSeamanshipBonus = e },
    e => { musterSeamanshipProgress = e },
    e => { musterSeamanshipRate = e },
  ))

  musterSection.appendChild(gauges)

  // Drill allocation — slider only, left = Gunnery focus, right = Seamanship focus
  const drill = el('div', 'muster-drill')

  const drillTop = el('div', 'muster-drill-top')
  musterGunneryPowerLabel = el('span', 'c-gold sz-12')
  drillTop.appendChild(musterGunneryPowerLabel)
  drillTop.appendChild(el('span', 'loadout-kicker', 'DRILL ORDERS'))
  musterSeamanshipPowerLabel = el('span', 'c-teal sz-12')
  drillTop.appendChild(musterSeamanshipPowerLabel)
  drill.appendChild(drillTop)

  musterAllocationSlider = document.createElement('input')
  musterAllocationSlider.type = 'range'
  musterAllocationSlider.min = '0'
  musterAllocationSlider.max = '100'
  musterAllocationSlider.step = '5'
  musterAllocationSlider.className = 'muster-slider'
  musterAllocationSlider.setAttribute('aria-label', 'Crew drill allocation — left: Gunnery focus, right: Seamanship focus')
  musterAllocationSlider.addEventListener('input', () => {
    // Slider left = Gunnery focus, so invert: value 0 → gPower 100
    GameState.setMusterPower(100 - Number(musterAllocationSlider.value))
  })
  drill.appendChild(musterAllocationSlider)

  musterSection.appendChild(drill)
  parent.appendChild(musterSection)
  refreshMusterUI()
}

function buildStormheartPanel(parent: HTMLElement): void {
  stormheartSection = el('section', 'system-panel hidden')
  stormheartSection.appendChild(systemHeader('STORMHEART', 'Burn Ether Brine into temporary voyage pressure'))
  parent.appendChild(stormheartSection)
  refreshStormheartUI()
}

function buildShipwrightPanel(parent: HTMLElement): void {
  shipwrightSection = el('section', 'system-panel hidden')
  shipwrightSection.appendChild(systemHeader("SHIPWRIGHT'S BENCH", 'Craft fittings, build mastery, and awaken modules'))
  parent.appendChild(shipwrightSection)
  refreshShipwrightUI()
}

function buildResearchPanel(parent: HTMLElement): void {
  researchSection = el('section', 'system-panel hidden')
  researchSection.appendChild(systemHeader('ADMIRALTY RESEARCH', 'Kills become chart notes across focused branches'))
  parent.appendChild(researchSection)
  refreshResearchUI()
}

function buildRelicsPanel(parent: HTMLElement): void {
  relicsSection = el('section', 'system-panel hidden')
  relicsSection.appendChild(systemHeader('RELIC COMPASS', 'Socket one found relic and attune shards from wreckage'))
  parent.appendChild(relicsSection)
  refreshRelicsUI()
}

function buildContractsPanel(parent: HTMLElement): void {
  contractsSection = el('section', 'system-panel hidden')
  contractsSection.appendChild(systemHeader('STORM CONTRACTS', 'Turn kill pressure into focused writ rewards'))
  parent.appendChild(contractsSection)
  refreshContractsUI()
}

function buildPortPanel(parent: HTMLElement): void {
  portSection = el('section', 'system-panel hidden')
  portSection.appendChild(systemHeader('PORT FACILITIES', 'Spend persistent Doubloons on durable harbor advantages'))
  parent.appendChild(portSection)
  refreshPortUI()
}

function buildTrialsPanel(parent: HTMLElement): void {
  trialsSection = el('section', 'system-panel hidden')
  trialsSection.appendChild(systemHeader("CAPTAIN'S TRIALS", 'One-time checks that prove a system has started to matter'))
  parent.appendChild(trialsSection)
  refreshTrialsUI()
}

function buildOfficersPanel(parent: HTMLElement): void {
  officersSection = el('section', 'system-panel hidden')
  officersSection.appendChild(systemHeader('OFFICERS', 'Assign one officer to learn from each sunk ship'))
  parent.appendChild(officersSection)
  refreshOfficersUI()
}

function buildOrdersPanel(parent: HTMLElement): void {
  ordersSection = el('section', 'system-panel hidden')
  ordersSection.appendChild(systemHeader("CAPTAIN'S ORDERS", 'Automate solved desk chores once their systems are understood'))
  parent.appendChild(ordersSection)
  refreshOrdersUI()
}

function buildLedgerPanel(parent: HTMLElement): void {
  ledgerSection = el('section', 'system-panel hidden')
  ledgerSection.appendChild(systemHeader("CAPTAIN'S LEDGER", 'Track the phase ladder and the interlocks already proven'))
  parent.appendChild(ledgerSection)
  refreshLedgerUI()
}

function systemHeader(title: string, subtitle: string): HTMLElement {
  const header = el('div', 'muster-header-row')
  header.appendChild(el('span', 'arsenal-header', title))
  header.appendChild(el('span', 'sz-11 c-silver', subtitle))
  return header
}

function buildLogPanel(parent: HTMLElement): void {
  logSection = el('section', 'log-panel hidden')
  const header = el('div', 'muster-header-row')
  header.appendChild(el('span', 'arsenal-header', 'LOG'))
  header.appendChild(el('span', 'sz-11 c-silver', 'Kills, wreckage, drops, and voyage notices'))
  logSection.appendChild(header)

  const logWrap = el('div', 'combat-log-wrap')
  combatLog = el('div', 'combat-log')
  logWrap.appendChild(combatLog)
  logSection.appendChild(logWrap)
  parent.appendChild(logSection)
}

function setActiveTab(tab: DeskTab): void {
  if (shellRoot.classList.contains('mechanics-collapsed')) setMechanicsFocus(false)
  if (tab === 'prestige' && !GameState.isSystemUnlocked('prestige')) tab = 'arsenal'
  if (tab === 'muster' && !GameState.isSystemUnlocked('muster')) tab = 'arsenal'
  if (tab === 'stormheart' && !GameState.isSystemUnlocked('stormheart')) tab = 'arsenal'
  if (tab === 'shipwright' && !GameState.isSystemUnlocked('shipwright')) tab = 'arsenal'
  if (tab === 'research' && !GameState.isSystemUnlocked('research')) tab = 'arsenal'
  if (tab === 'relics' && !GameState.isSystemUnlocked('relics')) tab = 'arsenal'
  if (tab === 'contracts' && !GameState.isSystemUnlocked('contracts')) tab = 'arsenal'
  if (tab === 'port' && !GameState.isSystemUnlocked('port')) tab = 'arsenal'
  if (tab === 'trials' && !GameState.isSystemUnlocked('trials')) tab = 'arsenal'
  if (tab === 'officers' && !GameState.isSystemUnlocked('officers')) tab = 'arsenal'
  if (tab === 'orders' && !GameState.isSystemUnlocked('orders')) tab = 'arsenal'
  if (tab === 'ledger' && !GameState.isSystemUnlocked('ledger')) tab = 'arsenal'
  arsenalSection.classList.toggle('hidden', tab !== 'arsenal')
  prestigeSection.classList.toggle('hidden', tab !== 'prestige')
  musterSection.classList.toggle('hidden', tab !== 'muster')
  stormheartSection.classList.toggle('hidden', tab !== 'stormheart')
  shipwrightSection.classList.toggle('hidden', tab !== 'shipwright')
  researchSection.classList.toggle('hidden', tab !== 'research')
  relicsSection.classList.toggle('hidden', tab !== 'relics')
  contractsSection.classList.toggle('hidden', tab !== 'contracts')
  portSection.classList.toggle('hidden', tab !== 'port')
  trialsSection.classList.toggle('hidden', tab !== 'trials')
  officersSection.classList.toggle('hidden', tab !== 'officers')
  ordersSection.classList.toggle('hidden', tab !== 'orders')
  ledgerSection.classList.toggle('hidden', tab !== 'ledger')
  logSection.classList.toggle('hidden', tab !== 'log')
  arsenalTabBtn.classList.toggle('is-active', tab === 'arsenal')
  prestigeTabBtn.classList.toggle('is-active', tab === 'prestige')
  musterTabBtn.classList.toggle('is-active', tab === 'muster')
  stormheartTabBtn.classList.toggle('is-active', tab === 'stormheart')
  shipwrightTabBtn.classList.toggle('is-active', tab === 'shipwright')
  researchTabBtn.classList.toggle('is-active', tab === 'research')
  relicsTabBtn.classList.toggle('is-active', tab === 'relics')
  contractsTabBtn.classList.toggle('is-active', tab === 'contracts')
  portTabBtn.classList.toggle('is-active', tab === 'port')
  trialsTabBtn.classList.toggle('is-active', tab === 'trials')
  officersTabBtn.classList.toggle('is-active', tab === 'officers')
  ordersTabBtn.classList.toggle('is-active', tab === 'orders')
  ledgerTabBtn.classList.toggle('is-active', tab === 'ledger')
  logTabBtn.classList.toggle('is-active', tab === 'log')
  arsenalTabBtn.classList.toggle('c-gold', tab === 'arsenal')
  prestigeTabBtn.classList.toggle('c-gold', tab === 'prestige')
  musterTabBtn.classList.toggle('c-teal', tab === 'muster')
  stormheartTabBtn.classList.toggle('c-teal', tab === 'stormheart')
  shipwrightTabBtn.classList.toggle('c-gold', tab === 'shipwright')
  researchTabBtn.classList.toggle('c-teal', tab === 'research')
  relicsTabBtn.classList.toggle('c-gold', tab === 'relics')
  contractsTabBtn.classList.toggle('c-teal', tab === 'contracts')
  portTabBtn.classList.toggle('c-gold', tab === 'port')
  trialsTabBtn.classList.toggle('c-teal', tab === 'trials')
  officersTabBtn.classList.toggle('c-gold', tab === 'officers')
  ordersTabBtn.classList.toggle('c-teal', tab === 'orders')
  ledgerTabBtn.classList.toggle('c-gold', tab === 'ledger')
  logTabBtn.classList.toggle('c-gold', tab === 'log')
  if (tab === 'prestige') refreshPrestigeUI()
  if (tab === 'muster') refreshMusterUI()
  if (tab === 'stormheart') refreshStormheartUI()
  if (tab === 'shipwright') refreshShipwrightUI()
  if (tab === 'research') refreshResearchUI()
  if (tab === 'relics') refreshRelicsUI()
  if (tab === 'contracts') refreshContractsUI()
  if (tab === 'port') refreshPortUI()
  if (tab === 'trials') refreshTrialsUI()
  if (tab === 'officers') refreshOfficersUI()
  if (tab === 'orders') refreshOrdersUI()
  if (tab === 'ledger') refreshLedgerUI()
}

function buildDebugOverlay(root: HTMLElement): void {
  debugOverlay = el('div', 'debug-overlay hidden')

  debugOverlay.appendChild(el('span', 'sz-13 bold c-gold', '— DEBUG OVERLAY —'))

  // Speed controls
  const speedRow = el('div', 'debug-row')
  speedRow.appendChild(el('span', '', 'Speed:'))
  for (const mul of [1, 3, 10]) {
    const b = btn(`${mul}x`, 'sz-13')
    b.addEventListener('click', () => {
      GameState.settings.speed_multiplier = mul
      appendLog(`Speed: ${mul}x`)
    })
    speedRow.appendChild(b)
  }
  debugOverlay.appendChild(speedRow)

  // Salvage grants
  const salRow = el('div', 'debug-row')
  salRow.appendChild(el('span', '', 'Salvage:'))
  for (const amt of [50, 500]) {
    const b = btn(`+${amt}`, 'sz-13')
    b.addEventListener('click', () => GameState.addResource('salvage', amt))
    salRow.appendChild(b)
  }
  debugOverlay.appendChild(salRow)

  // Doubloon grants
  const dblRow = el('div', 'debug-row')
  dblRow.appendChild(el('span', '', 'Doubloons:'))
  for (const amt of [10, 100]) {
    const b = btn(`+${amt}`, 'sz-13')
    b.addEventListener('click', () => GameState.addResource('doubloons', amt))
    dblRow.appendChild(b)
  }
  debugOverlay.appendChild(dblRow)

  const brineRow = el('div', 'debug-row')
  brineRow.appendChild(el('span', '', 'Brine:'))
  for (const amt of [5, 25]) {
    const b = btn(`+${amt}`, 'sz-13')
    b.addEventListener('click', () => GameState.addResource('ether_brine', amt))
    brineRow.appendChild(b)
  }
  debugOverlay.appendChild(brineRow)

  // Sector jumps
  const laneRow = el('div', 'debug-row')
  laneRow.appendChild(el('span', '', 'Sectors:'))
  for (const sector of [1, 2, 5, 10]) {
    const label = `S${sector}`
    const b = btn(label, 'sz-13')
    b.addEventListener('click', () => debugJumpSector(sector))
    laneRow.appendChild(b)
  }
  debugOverlay.appendChild(laneRow)

  // Unlock all systems
  const unlockRow = el('div', 'debug-row')
  unlockRow.appendChild(el('span', '', 'Systems:'))
  const unlockAllB = btn('UNLOCK ALL', 'sz-13')
  unlockAllB.addEventListener('click', () => {
    const allSystems: SystemUnlock[] = ['prestige','muster','stormheart','shipwright','research','relics','contracts','port','trials','officers','orders','ledger']
    for (const id of allSystems) GameState.unlockSystem(id)
    refreshSystemLocks()
    appendLog('Debug: all systems unlocked')
  })
  unlockRow.appendChild(unlockAllB)
  debugOverlay.appendChild(unlockRow)

  // Save / Load / Reset
  const ioRow = el('div', 'debug-row')
  const saveB = btn('SAVE',  'sz-13'); saveB.addEventListener('click', () => SaveSystem.saveGame()); ioRow.appendChild(saveB)
  const loadB = btn('LOAD',  'sz-13'); loadB.addEventListener('click', debugLoad); ioRow.appendChild(loadB)
  const resB  = btn('RESET', 'sz-13 btn-reset'); resB.addEventListener('click', () => SaveSystem.resetGame()); ioRow.appendChild(resB)
  debugOverlay.appendChild(ioRow)

  root.appendChild(debugOverlay)
}

// ── Signal wiring (mirrors _connect_signals) ──────────────────────────────────
function connectSignals(): void {
  sim.onEnemySpawned       = (def, maxHull, isSquadMember) => onEnemySpawned(def, maxHull, isSquadMember)
  sim.onEnemyApproaching   = onEnemyApproaching
  sim.onEnemyDamaged       = onEnemyDamaged
  sim.onEnemyDefeated      = (def, rewards, isLastInSquad) => onEnemyDefeated(def, rewards, isLastInSquad)
  sim.onPlayerDamaged      = onPlayerDamaged
  sim.onPlayerHullRestored = onPlayerHullRestored
  sim.onPlayerFled         = onPlayerFled
  sim.onBossSpawned        = onBossSpawned
  sim.onBossDefeated       = onBossDefeated
  sim.onWaveCompleted      = onWaveCompleted
  sim.onSectorCompleted    = onSectorCompleted
  sim.onCombatLog          = (msg) => appendLog(msg)
  sim.onCounterHint        = onCounterHint
  sim.onEscortSpawned      = (index, def, maxHull) => onEscortSpawned(index, def, maxHull)
  sim.onEscortDamaged      = (index, hull, maxHull, dmg, evaded) => onEscortDamaged(index, hull, maxHull, dmg, evaded)
  sim.onEscortDefeated     = (index, def, rewards) => onEscortDefeated(index, def, rewards)

  GameState.on('resource_changed',  (id, amount) => onResourceChanged(id as string, amount as number))
  GameState.on('stormheart_changed', () => refreshStormheartUI())
  GameState.on('shipwright_changed', () => refreshShipwrightUI())
  GameState.on('research_changed', () => refreshResearchUI())
  GameState.on('relics_changed', () => refreshRelicsUI())
  GameState.on('contracts_changed', () => refreshContractsUI())
  GameState.on('port_changed', () => {
    refreshPortUI()
    updatePlayerHullUI(GameState.getPlayerHull(), GameState.getPlayerMaxHull())
  })
  GameState.on('trials_changed', () => refreshTrialsUI())
  GameState.on('officers_changed', () => {
    refreshOfficersUI()
    refreshCombatPowerVisuals()
  })
  GameState.on('orders_changed', () => refreshOrdersUI())
  GameState.on('muster_changed', (...args) => {
    if (!musterSection.classList.contains('hidden')) refreshMusterUI()
    if (args[0] === 'levels') updatePlayerHullUI(GameState.getPlayerHull(), GameState.getPlayerMaxHull())
  })
  GameState.on('player_hull_changed', (hull, maxHull) => updatePlayerHullUI(hull as number, maxHull as number))
  GameState.on('route_changed', () => {
    refreshRouteUI()
  })
  GameState.on('upgrade_purchased', () => {
    refreshArsenalUI()
    refreshCombatPowerVisuals()
  })
  GameState.on('ability_changed', () => {
    refreshAbilityUI()
    refreshCombatPowerVisuals()
  })
  GameState.on('system_unlocked', (id) => {
    refreshSystemLocks()
    refreshPrestigeUI()
    appendLog(`<span class="log-gold">Captain's Desk expanded: ${formatSystemName(id as string)}</span>`)
  })
  GameState.on('boss_defeated_persistent', () => {
    refreshSystemLocks()
    if (!prestigeSection.classList.contains('hidden')) refreshPrestigeUI()
  })
  GameState.on('returned_to_port', () => {
    refreshSystemLocks()
    refreshAllResources()
    refreshArsenalUI()
    refreshStormheartUI()
    refreshShipwrightUI()
    refreshResearchUI()
    refreshRelicsUI()
    refreshContractsUI()
    refreshPortUI()
    refreshTrialsUI()
    refreshOfficersUI()
    refreshOrdersUI()
    refreshLedgerUI()
    setActiveTab(GameState.isSystemUnlocked('muster') ? 'muster' : 'arsenal')
  })
  GameState.on('doctrine_changed', () => refreshDoctrineUI())
  GameState.on('ship_sunk_recorded', () => refreshRouteUI())
}

// ── Sim handlers ──────────────────────────────────────────────────────────────
function onEnemySpawned(def: AnyDef, maxHull: number, isSquadMember: boolean): void {
  currentLaneId = `sector_${GameState.getCurrentSector()}`
  laneCleared = false
  playerFleeing = false
  combatRow.classList.remove('is-fleeing')
  combatRow.classList.remove('is-boss-fight')
  currentEnemyDef = def
  currentEnemyHull = maxHull
  currentEnemyMaxHull = maxHull
  refreshWatersTitle()
  refreshRouteUI()
  enemyName.textContent   = def['display_name'] ?? '?'
  enemyFamily.textContent = def['family']        ?? '?'
  setHpBar(enemyHpFill, enemyHpLabel, maxHull, maxHull, 'red')
  if (!isSquadMember) {
    // Partial refresh: only replace the vanguard group when a normal wave is already
    // painted, so port/starboard ship CSS animations aren't restarted (visible flash).
    const hasVanguard = !!seaContactLayer.querySelector('.fleet-wave.is-vanguard-wave')
    if (hasVanguard) {
      refreshVanguardContact(def, maxHull, maxHull)
    } else {
      startVisualWave(true)
      refreshSeaContacts(def, maxHull, maxHull)
    }
  } else {
    // Restore the contact HP bar for the next squad member without rebuilding contacts
    updateCurrentSeaContactHp(maxHull, maxHull)
  }
  counterHint.classList.add('hidden')
  bossBanner.classList.add('hidden')
  enemyName.style.color = ''
  enemyRect.classList.remove('ship-rect-boss')
  enemyRect.classList.add('ship-rect-enemy')
  flashTarget(getCurrentSeaTarget() ?? enemyRect, '#333', getComputedStyle(document.documentElement).getPropertyValue('--red').trim(), 250)
}

function onEnemyApproaching(rangeNmi: number, maxRange: number): void {
  const pct = maxRange > 0 ? Math.max(0, (rangeNmi / maxRange) * 100) : 0
  // Dim the enemy block while out of range
  enemyRect.style.opacity = `${0.45 + 0.55 * (1 - pct / 100)}`
  void pct
}

function onEnemyDamaged(hull: number, maxHull: number, dmg: number, evaded: boolean): void {
  enemyRect.style.opacity = ''  // restore after approach
  currentEnemyHull = hull
  currentEnemyMaxHull = maxHull
  setHpBar(enemyHpFill, enemyHpLabel, hull, maxHull, 'red')
  updateCurrentSeaContactHp(hull, maxHull)
  vfxShootAndHit(dmg, evaded)
  if (evaded) appendLog('<span class="log-silver">— Evaded!</span>')
}

function onEnemyDefeated(_def: AnyDef, rewards: Record<string, number>, isLastInSquad: boolean): void {
  const anchor = getCurrentSeaTarget() ?? enemyRect
  enemyHpFill.style.width = '0%'
  enemyHpLabel.textContent = '0 / ?'
  if (isLastInSquad) {
    sinkCurrentSeaContact()
  }
  spawnRewardPickups(rewards, anchor)
}

function onPlayerDamaged(hull: number, maxHull: number, _dmg: number): void {
  updatePlayerHullUI(hull, maxHull)
  spawnEnemyProjectile()
  flashRect(playerRect, 'rgba(224,68,62,0.8)', '#22A6A1', 180)
}

function onPlayerHullRestored(hull: number, maxHull: number): void {
  updatePlayerHullUI(hull, maxHull)
}

function onPlayerFled(_distance: number, _goal: number): void {
  playerFleeing = true
  seaContactLayer.innerHTML = ''
  currentContactHpFill = null
  combatRow.classList.add('is-fleeing')
  refreshRouteUI()
}

function onBossSpawned(def: AnyDef, maxHull: number): void {
  onEnemySpawned(def, maxHull, false)
  combatRow.classList.add('is-boss-fight')
  bossBanner.classList.remove('hidden')
  markCurrentSeaTargetAsBoss(def, maxHull)
  enemyName.style.color = '#F2B134'
  enemyRect.classList.remove('ship-rect-enemy')
  enemyRect.classList.add('ship-rect-boss')
  appendLog('<span class="log-gold">⚔ Boss phase!</span>')
}

function onBossDefeated(_def: AnyDef): void {
  combatRow.classList.remove('is-boss-fight')
  bossBanner.classList.add('hidden')
  enemyName.style.color = ''
}

function onWaveCompleted(_waveIndex: number): void {
}

function onSectorCompleted(_sectorId: string, nextId: string): void {
  nextLaneId            = nextId
  laneCleared           = true
  combatRow.classList.remove('is-boss-fight')
  bossBanner.classList.add('hidden')
  if (nextId && !GameState.isAutoProgress()) {
    const nextSector = Number(nextId.replace('sector_', ''))
    const nextName = nextSector > 0 ? SectorPlan.getSector(nextSector).displayName : nextId
    advanceBtn.textContent = `▶  CHART COURSE TO ${nextName.toUpperCase()}`
    advanceBtn.classList.remove('hidden')
    appendLog('<span class="log-green">Sector cleared. New course plotted.</span>')
  } else if (nextId) {
    advanceBtn.classList.add('hidden')
    appendLog('<span class="log-green">Sector cleared. Auto course continuing.</span>')
  } else {
    advanceBtn.classList.add('hidden')
    appendLog('<span class="log-green">Final sector cleared!</span>')
  }
}

function onCounterHint(hint: string): void {
  counterHint.textContent = `⚠ ${hint}`
  counterHint.classList.remove('hidden')
}

function onEscortSpawned(index: number, _def: AnyDef, maxHull: number): void {
  const candidates = Array.from(
    seaContactLayer?.querySelectorAll('.sea-contact.is-escort:not(.is-sinking), .sea-contact.is-incoming:not(.is-sinking)') ?? []
  ).filter((n): n is HTMLElement => n instanceof HTMLElement)
  const contact = candidates[index] ?? null
  simEscorts[index] = contact
  if (contact) {
    const key = contact.dataset.contactKey ?? ''
    const existing = seaContactStates.get(key)
    if (existing) {
      existing.hull = maxHull
      existing.maxHull = maxHull
      existing.nextFireAt = Infinity  // sim handles escort fire
    }
    setContactHp(contact, maxHull, maxHull)
  }
}

function onEscortDamaged(index: number, hull: number, maxHull: number, dmg: number, evaded: boolean): void {
  const contact = simEscorts[index]
  if (contact && !contact.classList.contains('is-sinking')) setContactHp(contact, hull, maxHull)
  vfxShootAndHit(dmg, evaded, contact ?? undefined)
}

function onEscortDefeated(index: number, def: AnyDef, rewards: Record<string, number>): void {
  const contact = simEscorts[index]
  if (contact) markContactSunk(contact)
  simEscorts[index] = null
  spawnRewardPickups(rewards, contact ?? undefined)
  void def
}

// ── Doctrine UI ────────────────────────────────────────────────────────────────

function refreshDoctrineUI(): void {
  if (!doctrineFocusBtn) return
  const mode = GameState.getDoctrine()
  doctrineFocusBtn.classList.toggle('is-active', mode === 'focus')
  doctrineSuppressionBtn.classList.toggle('is-active', mode === 'suppression')
  doctrineScatterBtn.classList.toggle('is-active', mode === 'scatter')
}

// ── GameState handlers ────────────────────────────────────────────────────────
function onResourceChanged(id: string, amount: number): void {
  if (id === 'salvage')   { salvageLabel.textContent = Balance.formatNumber(amount); refreshArsenalUI() }
  if (id === 'doubloons') { doubloonsLabel.textContent = Balance.formatNumber(amount) }
  if (id === 'ether_brine' || id === 'storm_power') refreshStormheartUI()
  if (id === 'salvage') refreshShipwrightUI()
  if (id === 'doubloons') refreshPortUI()
  if (id === 'ether_brine') refreshTrialsUI()
}

// ── Prestige / unlocks ───────────────────────────────────────────────────────
function syncTabLock(tabBtn: HTMLButtonElement, systemId: SystemUnlock): void {
  const isUnlocked = GameState.isSystemUnlocked(systemId)
  tabBtn.classList.toggle('is-locked', !isUnlocked)
  const labelSpan = tabBtn.querySelector<HTMLElement>('.tab-label')
  if (labelSpan) labelSpan.textContent = isUnlocked ? (tabBtn.dataset.realLabel ?? '') : '????'
}

function refreshSystemLocks(): void {
  if (!prestigeTabBtn || !musterTabBtn) return
  syncTabLock(prestigeTabBtn, 'prestige')
  syncTabLock(musterTabBtn, 'muster')
  syncTabLock(stormheartTabBtn, 'stormheart')
  syncTabLock(shipwrightTabBtn, 'shipwright')
  syncTabLock(researchTabBtn, 'research')
  syncTabLock(relicsTabBtn, 'relics')
  syncTabLock(contractsTabBtn, 'contracts')
  syncTabLock(portTabBtn, 'port')
  syncTabLock(trialsTabBtn, 'trials')
  syncTabLock(officersTabBtn, 'officers')
  syncTabLock(ordersTabBtn, 'orders')
  syncTabLock(ledgerTabBtn, 'ledger')
  if (!GameState.isSystemUnlocked('muster')) musterSection.classList.add('hidden')
}

function refreshPrestigeUI(): void {
  if (!prestigeMilestoneList) return
  prestigeMilestoneList.innerHTML = ''
  for (const milestone of getPrestigeMilestones()) {
    const done = milestone.done()
    const card = el('div', `prestige-milestone${done ? ' is-done' : ''}`)
    card.appendChild(el('span', 'loadout-kicker', milestone.kicker))
    card.appendChild(el('span', 'upgrade-name', milestone.title))
    card.appendChild(el('span', 'upgrade-desc', milestone.body))
    prestigeMilestoneList.appendChild(card)
  }

  prestigeLoadoutList.innerHTML = ''
  for (const slot of getPrestigeLoadoutSlots()) {
    const card = el('div', 'prestige-loadout-card')
    card.appendChild(el('span', 'loadout-kicker', slot.kicker))
    card.appendChild(el('span', 'upgrade-name', slot.name))
    card.appendChild(el('span', 'upgrade-desc', slot.body))
    card.appendChild(el('span', `prestige-choice-state${slot.locked ? ' is-locked' : ''}`, slot.locked ? 'Locked preview' : 'Selected'))
    prestigeLoadoutList.appendChild(card)
  }

  const canReturn = GameState.hasDefeatedBoss('lane_02_boss') || GameState.hasDefeatedBoss('sector_002_boss')
  returnPortBtn.disabled = !canReturn
  returnPortNote.textContent = canReturn
    ? 'Return resets salvage, route distance, Arsenal upgrades, and Muster drill levels. Boss milestones, unlocked systems, and Doubloons persist.'
    : 'Clear the second boss to make Return to Port available.'
}

function getPrestigeMilestones(): Array<{ kicker: string; title: string; body: string; done: () => boolean }> {
  return [
    {
      kicker: 'BOSS I',
      title: 'Defeat The Salt Widow',
      body: 'Unlocks Prestige planning and shows the next voyage goal.',
      done: () => GameState.hasDefeatedBoss('lane_01_boss') || GameState.hasDefeatedBoss('sector_001_boss'),
    },
    {
      kicker: 'BOSS II',
      title: 'Defeat The Cracked Bell',
      body: 'Makes Return to Port available. Prestige after this clear unlocks Muster.',
      done: () => GameState.hasDefeatedBoss('lane_02_boss') || GameState.hasDefeatedBoss('sector_002_boss'),
    },
    {
      kicker: 'RETURN',
      title: 'Return to Port',
      body: 'Reset the voyage to open crew power allocation for the next push.',
      done: () => GameState.isSystemUnlocked('muster'),
    },
  ]
}

function getPrestigeLoadoutSlots(): Array<{ kicker: string; name: string; body: string; locked?: boolean }> {
  return [
    {
      kicker: 'SHIP',
      name: Definitions.getShip(GameState.getSelectedShip())?.['display_name'] ?? 'The Saltwind Drifter',
      body: `${Balance.formatNumber(GameState.getPlayerMaxHull())} current max hull. Ship selection lives here, not in Arsenal.`,
    },
    {
      kicker: 'WEAPON',
      name: Definitions.getWeapon(GameState.getSelectedWeapon())?.['display_name'] ?? 'Long Nine Cannons',
      body: 'The starting cannon core. Future weapon choices will be compared here before a voyage.',
    },
    {
      kicker: 'DEFENSE',
      name: 'Open Defense Slot',
      body: 'Later: armor plating, warding, deflectors, or shield behavior.',
      locked: true,
    },
    {
      kicker: 'UTILITY',
      name: 'Open Utility Slot',
      body: 'Later: salvage nets, charts, scouting, automation, or cargo tools.',
      locked: true,
    },
  ]
}

function onReturnToPort(): void {
  if (!GameState.hasDefeatedBoss('lane_02_boss') && !GameState.hasDefeatedBoss('sector_002_boss')) {
    appendLog('<span class="log-silver">The harbor will not take you back as legend yet. Clear the second boss first.</span>')
    return
  }
  const musterWasUnlocked = GameState.isSystemUnlocked('muster')
  GameState.returnToPort()
  clearLootDrops()
  SaveSystem.saveGame()
  sim.startCombat()
  appendLog(musterWasUnlocked
    ? '<span class="log-gold">Returned to port. The voyage begins anew.</span>'
    : '<span class="log-gold">Returned to port. Muster unlocked for the next voyage.</span>')
}

const SYSTEM_DISPLAY_NAMES: Record<string, string> = { arsenal: 'Arsenal', prestige: 'Prestige', muster: 'Muster' }
function formatSystemName(id: string): string { return SYSTEM_DISPLAY_NAMES[id] ?? id }

// ── Arsenal ───────────────────────────────────────────────────────────────────
function onActivateAbility(id: AbilityId): void {
  if (!GameState.activateAbility(id)) return
  appendLog(`<span class="log-gold">${formatAbilityName(id)} active.</span>`)
  refreshAbilityUI()
}

function formatAbilityName(id: AbilityId): string {
  if (id === 'overcharge') return 'Broadsides'
  if (id === 'repair') return 'Patch Crew'
  return 'Salvage Run'
}

function onBuyUpgrade(upg: AnyDef): void {
  const upgradeId  = upg['id'] ?? ''
  const level      = GameState.getUpgradeLevel(upgradeId)
  const costMuls   = GameState.getMilestoneCostMuls(upgradeId)
  const cost       = Balance.upgradeCost(upg['base_cost'] ?? 50, upg['cost_scale'] ?? 2, level, costMuls)
  const resourceId = upg['cost_resource'] ?? 'salvage'
  if (!GameState.canAfford(resourceId, cost)) {
    appendLog(`Need ${Balance.formatNumber(cost)} ${formatResourceName(resourceId)}`)
    return
  }

  GameState.spendResource(resourceId, cost)
  const newLevel = level + 1
  GameState.setUpgradeLevel(upgradeId, newLevel)
  if (upg['effect'] === 'ship_hull') {
    GameState.setPlayerHull(GameState.getPlayerHull() + Number(upg['effect_scale'] ?? 14))
  }
  appendLog(`<span class="log-gold">${upg['display_name'] ?? 'Upgrade'} Lv.${newLevel}!</span>`)
  if (newLevel % 5 === 0) {
    const tierIndex  = (newLevel / 5) - 1
    const tierNum    = newLevel / 5
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tiers      = upg['milestone_tiers'] as Array<{ choices: Array<Record<string, any>> }> | undefined
    const tierChoices = tiers?.[tierIndex]?.choices ?? []
    if (tierChoices.length === 1) {
      appendLog(`<span class="log-silver">T${tierNum}: ${tierChoices[0]['display_name'] ?? 'Bonus'} collected.</span>`)
    } else if (tierChoices.length > 1) {
      appendLog(`<span class="log-silver">T${tierNum} Milestone — choose a path in the Arsenal.</span>`)
    } else {
      appendLog(`<span class="log-silver">Milestone Tier ${tierNum} reached.</span>`)
    }
  }
}

// Rolling XP sample buffer for rate estimation (90-second window)
const musterXpSamples: Array<{ t: number; gXp: number; sXp: number }> = []
const MUSTER_RATE_WINDOW_MS = 90_000

function refreshMusterUI(): void {
  if (!musterGunneryBar) return
  const g = GameState.getMusterGunnery()
  const s = GameState.getMusterSeamanship()
  const gXp = GameState.getMusterGunneryProgress()
  const sXp = GameState.getMusterSeamanshipProgress()
  const gNeed = Balance.musterXpForNextLevel(g)
  const sNeed = Balance.musterXpForNextLevel(s)
  const gPower = GameState.getMusterGunneryPower()
  const sPower = GameState.getMusterSeamanshipPower()
  const gPct = Math.min(100, (gXp / gNeed) * 100)
  const sPct = Math.min(100, (sXp / sNeed) * 100)

  // Sample XP for rate estimation
  const now = Date.now()
  musterXpSamples.push({ t: now, gXp, sXp })
  while (musterXpSamples.length > 1 && now - musterXpSamples[0].t > MUSTER_RATE_WINDOW_MS)
    musterXpSamples.shift()

  let gRate = 0, sRate = 0
  if (musterXpSamples.length >= 2) {
    const oldest = musterXpSamples[0]
    const dtMin = (now - oldest.t) / 60_000
    if (dtMin >= 5 / 60) {   // at least 5 seconds of history
      gRate = Math.round((gXp - oldest.gXp) / dtMin)
      sRate = Math.round((sXp - oldest.sXp) / dtMin)
    }
  }

  // Tide gauges fill bottom-to-top via height
  musterGunneryBar.style.height     = `${gPct}%`
  musterGunneryLabel.textContent    = `Lv. ${g}`
  musterGunneryBonus.textContent    = `+${((Balance.gunneryBonus(g) - 1) * 100).toFixed(0)}% weapon damage`
  musterGunneryProgress.textContent = `${Balance.formatNumber(gXp)} / ${Balance.formatNumber(gNeed)}`
  musterGunneryRate.textContent     = gRate > 0 ? `~${Balance.formatNumber(gRate)}/min` : '—'
  musterSeamanshipBar.style.height     = `${sPct}%`
  musterSeamanshipLabel.textContent    = `Lv. ${s}`
  musterSeamanshipBonus.textContent    = `+${((Balance.seamanshipHullBonus(s) - 1) * 100).toFixed(0)}% max hull`
  musterSeamanshipProgress.textContent = `${Balance.formatNumber(sXp)} / ${Balance.formatNumber(sNeed)}`
  musterSeamanshipRate.textContent     = sRate > 0 ? `~${Balance.formatNumber(sRate)}/min` : '—'

  // Drill allocation slider — left = Gunnery focus, right = Seamanship focus
  musterAllocationSlider.value           = `${100 - gPower}`
  musterGunneryPowerLabel.textContent    = `Gunnery ${gPower}%`
  musterSeamanshipPowerLabel.textContent = `Seamanship ${sPower}%`
}

const STORM_BOOSTS: Array<{ id: StormBoostId; name: string; body: string }> = [
  { id: 'thunder_broadside', name: 'Thunder Broadside', body: '+20% weapon damage while Storm Power lasts.' },
  { id: 'fair_wind', name: 'Fair Wind', body: '+35% forward sector distance gain.' },
  { id: 'deep_salvage', name: 'Deep Salvage', body: '+25% salvage pickup value.' },
]

function refreshStormheartUI(): void {
  if (!stormheartSection) return
  stormheartSection.querySelectorAll('.system-grid, .system-diagnostic').forEach(node => node.remove())
  const grid = el('div', 'system-grid')
  const power = GameState.getResource('storm_power')
  const brine = GameState.getResource('ether_brine')
  const active = GameState.getStormBoosts()
  const summary = el('div', 'system-card')
  summary.appendChild(el('span', 'loadout-kicker', 'FURNACE PRESSURE'))
  summary.appendChild(el('span', 'upgrade-name', `${Balance.formatNumber(brine)} Ether Brine · ${Balance.formatNumber(power)} Storm Power`))
  summary.appendChild(el('span', 'upgrade-desc', `${active.length}/${GameState.getStormMaxBoosts()} boosts inside limit. Extra boosts drain faster.`))
  const burn = btn('BURN 5 BRINE', 'btn-lg sz-13') as HTMLButtonElement
  burn.disabled = brine < 5
  burn.addEventListener('click', () => {
    if (GameState.burnEtherBrine()) appendLog('<span class="log-teal">Stormheart pressure rising.</span>')
    refreshStormheartUI()
  })
  summary.appendChild(burn)
  grid.appendChild(summary)
  for (const boost of STORM_BOOSTS) {
    const card = el('div', 'system-card')
    const isActive = GameState.isStormBoostActive(boost.id)
    card.appendChild(el('span', 'loadout-kicker', isActive ? 'ACTIVE BOOST' : 'BOOST'))
    card.appendChild(el('span', 'upgrade-name', boost.name))
    card.appendChild(el('span', 'upgrade-desc', boost.body))
    const toggle = btn(isActive ? 'DAMPEN' : 'IGNITE', 'btn-lg sz-13') as HTMLButtonElement
    toggle.disabled = !isActive && power <= 0
    toggle.addEventListener('click', () => {
      GameState.toggleStormBoost(boost.id)
      refreshStormheartUI()
      refreshCombatPowerVisuals()
    })
    card.appendChild(toggle)
    grid.appendChild(card)
  }
  stormheartSection.appendChild(grid)
  stormheartSection.appendChild(el('div', 'system-diagnostic', 'Source: rare kill pickups. Sink: active boosts. Reset: Ether Brine and Storm Power reset on Return to Port.'))
}

function refreshShipwrightUI(): void {
  if (!shipwrightSection) return
  shipwrightSection.querySelectorAll('.system-grid, .system-diagnostic').forEach(node => node.remove())
  const state = GameState.getShipwrightState()
  const grid = el('div', 'system-grid')
  for (const recipe of SHIPWRIGHT_RECIPES) {
    const mastery = state.mastery[recipe.id] ?? 0
    const active = state.active_recipe === recipe.id
    const progress = active ? Math.min(100, (state.progress / recipe.seconds) * 100) : 0
    const card = el('div', 'system-card')
    card.appendChild(el('span', 'loadout-kicker', active ? 'ON THE BENCH' : 'BLUEPRINT'))
    card.appendChild(el('span', 'upgrade-name', recipe.displayName))
    card.appendChild(el('span', 'upgrade-desc', `Mastery ${mastery}/${recipe.masteryCap}. Cost ${Balance.formatNumber(recipe.salvageCost)} Salvage. ${describeShipwrightEffect(recipe.id, mastery)}`))
    const meter = el('div', 'upgrade-meter')
    const fill = el('div', 'upgrade-meter-fill')
    fill.style.width = `${progress}%`
    meter.appendChild(fill)
    card.appendChild(meter)
    const craft = btn(active ? 'CRAFTING' : 'CRAFT', 'btn-lg sz-13') as HTMLButtonElement
    craft.disabled = Boolean(state.active_recipe) || GameState.getResource('salvage') < recipe.salvageCost
    craft.addEventListener('click', () => {
      if (GameState.startShipwrightRecipe(recipe.id)) appendLog(`<span class="log-gold">${recipe.displayName} laid on the bench.</span>`)
      refreshShipwrightUI()
    })
    card.appendChild(craft)
    grid.appendChild(card)
  }
  shipwrightSection.appendChild(grid)
  shipwrightSection.appendChild(el('div', 'system-diagnostic', 'Source: Salvage crafting. Persistent: Blueprint Mastery. Visible effects: salvage nets and fair wind fittings feed pickups and route speed.'))
}

function describeShipwrightEffect(id: string, mastery: number): string {
  if (id === 'salvage_nets') return `Current: +${mastery * 6}% salvage pickup value.`
  if (id === 'fair_wind_rigging') return `Current: +${mastery * 3}% route rigging preview; Stormheart Fair Wind handles active speed.`
  return mastery >= 5 ? 'Standing Supply established.' : 'Improves future fitting work.'
}

function refreshResearchUI(): void {
  if (!researchSection) return
  researchSection.querySelectorAll('.system-grid, .system-diagnostic').forEach(node => node.remove())
  const grid = el('div', 'system-grid')
  const names: Record<ResearchBranchId, string> = {
    gunnery: 'Gunnery',
    shipwrighting: 'Shipwrighting',
    navigation: 'Navigation',
    occult: 'Occult',
  }
  for (const branch of RESEARCH_BRANCHES) {
    const progress = GameState.getResearchProgress(branch)
    const rank = Math.floor(progress / 100)
    const card = el('div', 'system-card')
    const focused = GameState.getResearchFocus() === branch
    card.appendChild(el('span', 'loadout-kicker', focused ? 'FOCUSED' : 'BRANCH'))
    card.appendChild(el('span', 'upgrade-name', names[branch]))
    card.appendChild(el('span', 'upgrade-desc', `Rank ${rank}. ${describeResearchEffect(branch, rank)}`))
    const meter = el('div', 'upgrade-meter')
    const fill = el('div', 'upgrade-meter-fill')
    fill.style.width = `${progress % 100}%`
    meter.appendChild(fill)
    card.appendChild(meter)
    const focus = btn(focused ? 'FOCUSED' : 'FOCUS', 'btn-lg sz-13') as HTMLButtonElement
    focus.disabled = focused
    focus.addEventListener('click', () => {
      GameState.setResearchFocus(branch)
      refreshResearchUI()
    })
    card.appendChild(focus)
    grid.appendChild(card)
  }
  researchSection.appendChild(grid)
  researchSection.appendChild(el('div', 'system-diagnostic', 'Source: every kill. Focus: 2.5x branch gain without stopping other branches. Route density: Black Reef favors Gunnery/Shipwrighting; Storm Line favors Navigation/Occult.'))
}

function describeResearchEffect(branch: ResearchBranchId, rank: number): string {
  if (branch === 'gunnery') return `Current: +${rank}% target reading and impact doctrine diagnostics.`
  if (branch === 'shipwrighting') return `Current: +${rank * 5}% Shipwright craft speed and +${rank * 2}% salvage analysis.`
  if (branch === 'navigation') return `Current: route and starting-sector chart knowledge rank ${rank}.`
  return `Current: improves Ether Brine and relic preview knowledge rank ${rank}.`
}

function refreshRelicsUI(): void {
  if (!relicsSection) return
  relicsSection.querySelectorAll('.system-grid, .system-diagnostic').forEach(node => node.remove())
  const state = GameState.getRelicState()
  const grid = el('div', 'system-grid')
  for (const relic of RELICS) {
    const shards = state.shards[relic.id] ?? 0
    const rank = GameState.getRelicRank(relic.id)
    const active = state.active_relic === relic.id
    const card = el('div', 'system-card')
    card.appendChild(el('span', 'loadout-kicker', active ? 'SOCKETED' : 'RELIC'))
    card.appendChild(el('span', 'upgrade-name', relic.displayName))
    card.appendChild(el('span', 'upgrade-desc', `Rank ${rank}/${relic.maxRank}. ${shards % 10}/10 shards toward next rank. ${describeRelicEffect(relic.id, rank)}`))
    const meter = el('div', 'upgrade-meter')
    const fill = el('div', 'upgrade-meter-fill')
    fill.style.width = `${rank >= relic.maxRank ? 100 : (shards % 10) * 10}%`
    meter.appendChild(fill)
    card.appendChild(meter)
    const socket = btn(active ? 'SOCKETED' : 'SOCKET', 'btn-lg sz-13') as HTMLButtonElement
    socket.disabled = active
    socket.addEventListener('click', () => {
      GameState.setActiveRelic(relic.id)
      refreshRelicsUI()
    })
    card.appendChild(socket)
    grid.appendChild(card)
  }
  relicsSection.appendChild(grid)
  relicsSection.appendChild(el('div', 'system-diagnostic', 'Source: rare wreckage shards from kills and bosses. Persistent: shards and socket choice. Interlock: Research Occult, Officers, and Storm Line routes improve discovery.'))
}

function describeRelicEffect(id: RelicId, rank: number): string {
  if (id === 'cannon_ruby') return `Socket effect: +${rank * 4}% weapon damage.`
  if (id === 'netted_astrolabe') return `Socket effect: +${rank * 5}% salvage pickup value.`
  return `Socket effect: +${(rank * 1.5).toFixed(1)}% Ether Brine drop chance.`
}

function refreshContractsUI(): void {
  if (!contractsSection) return
  contractsSection.querySelectorAll('.system-grid, .system-diagnostic').forEach(node => node.remove())
  const state = GameState.getContractState()
  const grid = el('div', 'system-grid')
  for (const contract of CONTRACTS) {
    const active = state.active_contract === contract.id
    const card = el('div', 'system-card')
    card.appendChild(el('span', 'loadout-kicker', active ? 'CHARTED WRIT' : 'WRIT'))
    card.appendChild(el('span', 'upgrade-name', contract.displayName))
    card.appendChild(el('span', 'upgrade-desc', `Charge ${Math.floor(state.charge)}/${contract.chargeCost}. Completed ${state.completions[contract.id] ?? 0}. Reward: ${formatRewardMap(contract.reward)}.`))
    const meter = el('div', 'upgrade-meter')
    const fill = el('div', 'upgrade-meter-fill')
    fill.style.width = `${Math.min(100, (state.charge / contract.chargeCost) * 100)}%`
    meter.appendChild(fill)
    card.appendChild(meter)
    const pick = btn(active ? 'RUN WRIT' : 'CHART', 'btn-lg sz-13') as HTMLButtonElement
    pick.disabled = active ? state.charge < contract.chargeCost : false
    pick.addEventListener('click', () => {
      if (!active) GameState.setActiveContract(contract.id)
      else if (GameState.completeActiveContract()) appendLog(`<span class="log-gold">${contract.displayName} paid out.</span>`)
      refreshContractsUI()
      refreshAllResources()
    })
    card.appendChild(pick)
    grid.appendChild(card)
  }
  contractsSection.appendChild(grid)
  contractsSection.appendChild(el('div', 'system-diagnostic', `Source: sunk ships fill contract charge; Observatory adds +${Math.round(GameState.portContractBonus() * 100)}% contract handling. Sink: run one chosen writ for targeted rewards.`))
}

function refreshPortUI(): void {
  if (!portSection) return
  portSection.querySelectorAll('.system-grid, .system-diagnostic').forEach(node => node.remove())
  const grid = el('div', 'system-grid')
  for (const facility of PORT_FACILITIES) {
    const rank = GameState.getPortFacilityRank(facility.id)
    const cost = GameState.portUpgradeCost(facility.id)
    const card = el('div', 'system-card')
    card.appendChild(el('span', 'loadout-kicker', 'FACILITY'))
    card.appendChild(el('span', 'upgrade-name', facility.displayName))
    card.appendChild(el('span', 'upgrade-desc', `Rank ${rank}/${facility.maxRank}. ${describePortEffect(facility.id, rank)}`))
    const up = btn(rank >= facility.maxRank ? 'MAXED' : `UPGRADE ${cost} DB`, 'btn-lg sz-13') as HTMLButtonElement
    up.disabled = rank >= facility.maxRank || GameState.getResource('doubloons') < cost
    up.addEventListener('click', () => {
      if (GameState.upgradePortFacility(facility.id)) appendLog(`<span class="log-gold">${facility.displayName} upgraded.</span>`)
      refreshPortUI()
    })
    card.appendChild(up)
    grid.appendChild(card)
  }
  portSection.appendChild(grid)
  portSection.appendChild(el('div', 'system-diagnostic', 'Source: persistent Doubloons from rare drops, contracts, and trials. Sink: durable harbor ranks. Reset: facilities persist across Return to Port.'))
}

function describePortEffect(id: PortFacilityId, rank: number): string {
  if (id === 'drydock') return `Current: +${rank * 5}% max hull.`
  if (id === 'foundry') return `Current: +${rank * 4}% salvage pickup value.`
  if (id === 'observatory') return `Current: +${rank * 6}% contract handling and extra charge from kills.`
  return `Current: +${rank}% rare drop chance.`
}

function refreshTrialsUI(): void {
  if (!trialsSection) return
  trialsSection.querySelectorAll('.system-grid, .system-diagnostic').forEach(node => node.remove())
  const completions = GameState.getTrialCompletions()
  const trials = [
    { id: 'gunnery_trial', name: 'Gunnery Trial', req: 'Long Nine upgrade level 5', ready: GameState.getUpgradeLevel('long_nine_upgrade') >= 5 },
    { id: 'shipwright_trial', name: 'Shipwright Trial', req: 'Any blueprint mastery 1', ready: Object.values(GameState.getShipwrightState().mastery).some(v => v >= 1) },
    { id: 'storm_trial', name: 'Storm Trial', req: 'Hold 5 Ether Brine', ready: GameState.getResource('ether_brine') >= 5 },
    { id: 'research_trial', name: 'Research Trial', req: 'Any Research branch rank 1', ready: RESEARCH_BRANCHES.some(branch => GameState.getResearchProgress(branch) >= 100) },
  ]
  const grid = el('div', 'system-grid')
  for (const trial of trials) {
    const done = Boolean(completions[trial.id])
    const card = el('div', 'system-card')
    card.appendChild(el('span', 'loadout-kicker', done ? 'CLEARED' : trial.ready ? 'READY' : 'TRIAL'))
    card.appendChild(el('span', 'upgrade-name', trial.name))
    card.appendChild(el('span', 'upgrade-desc', `${trial.req}. Reward: Doubloons and ledger proof.`))
    const complete = btn(done ? 'CLEARED' : 'CLAIM', 'btn-lg sz-13') as HTMLButtonElement
    complete.disabled = done || !trial.ready
    complete.addEventListener('click', () => {
      if (GameState.completeTrial(trial.id)) appendLog(`<span class="log-gold">${trial.name} cleared.</span>`)
      refreshTrialsUI()
    })
    card.appendChild(complete)
    grid.appendChild(card)
  }
  trialsSection.appendChild(grid)
  trialsSection.appendChild(el('div', 'system-diagnostic', 'Source: system proficiency checks. Persistent: one-time clears. Interlock: trials validate Arsenal, Shipwright, Stormheart, and Research before later phase gates.'))
}

function refreshOfficersUI(): void {
  if (!officersSection) return
  officersSection.querySelectorAll('.system-grid, .system-diagnostic').forEach(node => node.remove())
  const state = GameState.getOfficerState()
  const grid = el('div', 'system-grid')
  for (const officer of OFFICERS) {
    const active = state.active_officer === officer.id
    const xp = state.xp[officer.id] ?? 0
    const rank = GameState.getOfficerRank(officer.id)
    const card = el('div', 'system-card')
    card.appendChild(el('span', 'loadout-kicker', active ? 'ON WATCH' : 'OFFICER'))
    card.appendChild(el('span', 'upgrade-name', officer.displayName))
    card.appendChild(el('span', 'upgrade-desc', `Rank ${rank}. Learns from kills while assigned. Post: ${officer.post}. ${describeOfficerEffect(officer.id, rank)}`))
    const meter = el('div', 'upgrade-meter')
    const fill = el('div', 'upgrade-meter-fill')
    fill.style.width = `${xp % 100}%`
    meter.appendChild(fill)
    card.appendChild(meter)
    const assign = btn(active ? 'ASSIGNED' : 'ASSIGN', 'btn-lg sz-13') as HTMLButtonElement
    assign.disabled = active
    assign.addEventListener('click', () => {
      GameState.setActiveOfficer(officer.id)
      refreshOfficersUI()
    })
    card.appendChild(assign)
    grid.appendChild(card)
  }
  officersSection.appendChild(grid)
  officersSection.appendChild(el('div', 'system-diagnostic', 'Source: the assigned officer gains XP from kills. Persistent: officer XP and assignment. Interlock: officers push combat, salvage, route speed, or rare drops.'))
}

function describeOfficerEffect(id: OfficerId, rank: number): string {
  if (id === 'gunner') return `Current: +${rank * 3}% weapon damage.`
  if (id === 'boatswain') return `Current: +${rank * 4}% max hull.`
  if (id === 'navigator') return `Current: +${rank * 3}% forward route speed.`
  if (id === 'quartermaster') return `Current: +${rank * 4}% salvage pickup value.`
  return `Current: +${rank}% brine and relic odds.`
}

function refreshOrdersUI(): void {
  if (!ordersSection) return
  ordersSection.querySelectorAll('.system-grid, .system-diagnostic').forEach(node => node.remove())
  const orders = GameState.getOrdersState()
  const grid = el('div', 'system-grid')
  const brine = el('div', 'system-card')
  brine.appendChild(el('span', 'loadout-kicker', 'STORMHEART ORDER'))
  brine.appendChild(el('span', 'upgrade-name', 'Auto Burn Brine'))
  brine.appendChild(el('span', 'upgrade-desc', 'When Storm Power is nearly empty, spend 5 Ether Brine to restore pressure.'))
  const burn = btn(orders.auto_burn_brine ? 'ON' : 'OFF', 'btn-lg sz-13') as HTMLButtonElement
  burn.addEventListener('click', () => GameState.setOrder('auto_burn_brine', !orders.auto_burn_brine))
  brine.appendChild(burn)
  grid.appendChild(brine)

  const research = el('div', 'system-card')
  research.appendChild(el('span', 'loadout-kicker', 'RESEARCH ORDER'))
  research.appendChild(el('span', 'upgrade-name', 'Focus Rule'))
  research.appendChild(el('span', 'upgrade-desc', `Current automatic focus: ${orders.auto_research_focus}.`))
  for (const branch of RESEARCH_BRANCHES) {
    const pick = btn(branch.toUpperCase(), 'btn-lg sz-13') as HTMLButtonElement
    pick.disabled = orders.auto_research_focus === branch
    pick.addEventListener('click', () => GameState.setOrder('auto_research_focus', branch))
    research.appendChild(pick)
  }
  grid.appendChild(research)

  const craft = el('div', 'system-card')
  craft.appendChild(el('span', 'loadout-kicker', 'SHIPWRIGHT ORDER'))
  craft.appendChild(el('span', 'upgrade-name', 'Craft Queue'))
  craft.appendChild(el('span', 'upgrade-desc', orders.auto_shipwright_recipe ? `Auto-starting ${orders.auto_shipwright_recipe}.` : 'No automatic craft selected.'))
  const clear = btn('NONE', 'btn-lg sz-13') as HTMLButtonElement
  clear.disabled = !orders.auto_shipwright_recipe
  clear.addEventListener('click', () => GameState.setOrder('auto_shipwright_recipe', ''))
  craft.appendChild(clear)
  for (const recipe of SHIPWRIGHT_RECIPES) {
    const pick = btn(recipe.displayName.toUpperCase(), 'btn-lg sz-13') as HTMLButtonElement
    pick.disabled = orders.auto_shipwright_recipe === recipe.id
    pick.addEventListener('click', () => GameState.setOrder('auto_shipwright_recipe', recipe.id))
    craft.appendChild(pick)
  }
  grid.appendChild(craft)

  ordersSection.appendChild(grid)
  ordersSection.appendChild(el('div', 'system-diagnostic', 'Source: unlocked solved-system rules. Sink: attention reduction. Orders currently manage Stormheart burn, Research focus, and Shipwright queue starts.'))
}

function refreshLedgerUI(): void {
  if (!ledgerSection) return
  ledgerSection.querySelectorAll('.system-grid, .system-diagnostic').forEach(node => node.remove())
  const proofs = [
    { name: 'Passage Boss Clear', done: GameState.persistent.defeated_bosses.length > 0 },
    { name: 'Return to Port', done: GameState.getReturnCount() > 0 },
    { name: 'Muster Allocated', done: GameState.getMusterGunnery() + GameState.getMusterSeamanship() > 0 },
    { name: 'Stormheart Fed', done: GameState.getResource('storm_power') > 0 || GameState.getResource('ether_brine') > 0 },
    { name: 'Shipwright Mastery', done: Object.values(GameState.getShipwrightState().mastery).some(v => v > 0) },
    { name: 'Research Rank', done: RESEARCH_BRANCHES.some(branch => GameState.getResearchProgress(branch) >= 100) },
    { name: 'Relic Socketed', done: GameState.getRelicRank(GameState.getActiveRelic()) > 0 },
    { name: 'Contract Paid', done: Object.values(GameState.getContractState().completions).some(v => v > 0) },
    { name: 'Port Built', done: PORT_FACILITIES.some(f => GameState.getPortFacilityRank(f.id) > 0) },
    { name: 'Trial Cleared', done: Object.values(GameState.getTrialCompletions()).some(v => v > 0) },
  ]
  const grid = el('div', 'system-grid')
  for (const proof of proofs) {
    const card = el('div', 'system-card')
    card.appendChild(el('span', 'loadout-kicker', proof.done ? 'LOGGED' : 'OPEN'))
    card.appendChild(el('span', 'upgrade-name', proof.name))
    card.appendChild(el('span', 'upgrade-desc', proof.done ? 'Recorded in the Captain\'s Ledger.' : 'Still needs a visible system proof.'))
    grid.appendChild(card)
  }
  const done = proofs.filter(p => p.done).length
  ledgerSection.appendChild(grid)
  ledgerSection.appendChild(el('div', 'system-diagnostic', `Ledger proof ${done}/${proofs.length}. Later this becomes the phase gate for Captain's Ledger, Flagship Phase, and Legend Reset.`))
}

function formatRewardMap(reward: Record<string, number>): string {
  return Object.entries(reward).map(([id, amount]) => `${Balance.formatNumber(amount)} ${id}`).join(', ')
}

function refreshArsenalUI(): void {
  const weaponId = getPlayerWeaponId()
  const shipId = GameState.getSelectedShip()
  if (weaponId !== arsenalWeaponId) {
    rebuildArsenalCards(weaponId)
  }

  const weapon = Definitions.getWeapon(weaponId)
  const ship = Definitions.getShip(shipId)
  for (const refs of arsenalCards) refreshUpgradeCard(refs, weapon, ship)
  refreshAbilityUI()
  refreshCombatPowerVisuals()
}

function refreshAbilityUI(): void {
  for (const [id, button] of abilityButtons) {
    const state = GameState.getAbilityState(id)
    const activeSeconds = Math.ceil(state.active / 10)
    const cooldownSeconds = Math.ceil(state.cooldown / 10)
    button.classList.toggle('is-active', state.active > 0)
    button.disabled = state.active <= 0 && state.cooldown > 0
    if (state.active > 0) {
      button.textContent = `${formatAbilityName(id)} ${activeSeconds}s`
    } else if (state.cooldown > 0) {
      button.textContent = `${formatAbilityName(id)} ${cooldownSeconds}s`
    } else {
      button.textContent = formatAbilityName(id)
    }
    const activePct = state.active > 0 ? (state.active / ABILITY_ACTIVE_TICKS) * 100 : 0
    const cooldownPct = state.cooldown > 0 ? (state.cooldown / ABILITY_COOLDOWN_TICKS) * 100 : 0
    button.style.setProperty('--ability-fill', `${Math.max(activePct, cooldownPct)}%`)
  }
}

function rebuildArsenalCards(weaponId: string): void {
  arsenalWeaponId = weaponId
  arsenalCards = []
  arsenalList.innerHTML = ''

  const shipId = GameState.getSelectedShip()
  arsenalHeader.textContent = 'ARSENAL'

  const upgrades = [
    ...Definitions.getUpgradesForWeapon(weaponId),
    ...Definitions.getUpgradesForShip(shipId),
  ]
  if (upgrades.length === 0) {
    arsenalList.appendChild(el('div', 'empty-state', 'No upgrades fitted for this weapon yet.'))
    return
  }

  for (const upgrade of upgrades) {
    const card = el('div', 'card')

    const nameRow = el('div', 'card-name-row')
    const name = el('span', 'upgrade-name', upgrade['display_name'] ?? upgrade['id'] ?? 'Upgrade')
    const level = el('span', 'upgrade-level')
    nameRow.append(name, level)
    card.appendChild(nameRow)

    const desc = el('div', 'upgrade-desc')
    card.appendChild(desc)

    const cost = el('div', 'upgrade-cost')
    card.appendChild(cost)

    const meter = el('div', 'upgrade-meter')
    const progress = el('div', 'upgrade-meter-fill')
    meter.appendChild(progress)
    card.appendChild(meter)

    const milestoneContainer = el('div', 'milestone-tiers hidden')
    card.appendChild(milestoneContainer)

    const button = btn('BUY UPGRADE', 'btn-lg sz-15') as HTMLButtonElement
    button.addEventListener('click', () => onBuyUpgrade(upgrade))
    card.appendChild(button)

    const refs = { upgrade, level, desc, cost, progress, button, milestoneContainer }
    arsenalCards.push(refs)
    arsenalList.appendChild(card)
  }
}

function refreshUpgradeCard(refs: ArsenalCardRefs, weapon: AnyDef | undefined, ship: AnyDef | undefined): void {
  const upg        = refs.upgrade
  const upgradeId  = upg['id'] ?? ''
  const level      = GameState.getUpgradeLevel(upgradeId)
  const muls       = GameState.getMilestoneMuls(upgradeId)
  const costMuls   = GameState.getMilestoneCostMuls(upgradeId)
  const cost       = Balance.upgradeCost(upg['base_cost'] ?? 50, upg['cost_scale'] ?? 2, level, costMuls)
  const resourceId = upg['cost_resource'] ?? 'salvage'
  const desc       = upg['description'] ?? upg['effect_note'] ?? ''
  const statLine   = describeUpgradeEffect(upg, level, weapon, ship, muls)

  refs.level.textContent = `Lv. ${level}`
  refs.progress.style.width = `${Math.min(100, ((level % 5) / 5) * 100)}%`
  refs.desc.textContent  = `${desc} ${statLine.next}`
  refs.cost.textContent = `Cost: ${Balance.formatNumber(cost)} ${formatResourceName(resourceId)}`
  refs.button.disabled  = !GameState.canAfford(resourceId, cost)
  refs.button.textContent = 'BUY UPGRADE'

  refreshMilestoneChoicesOnCard(refs)
}

function refreshMilestoneChoicesOnCard(refs: ArsenalCardRefs): void {
  const upg       = refs.upgrade
  const upgradeId = upg['id'] ?? ''
  const level     = GameState.getUpgradeLevel(upgradeId)
  const isHull    = upg['effect'] === 'ship_hull'
  const mulKey    = isHull ? 'hull_mul' : 'dmg_mul'

  // Support new per-tier format; fall back to wrapping old flat choices as a single tier
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type TierDef = { choices: Array<Record<string, any>> }
  const rawTiers   = upg['milestone_tiers']   as TierDef[] | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawChoices = upg['milestone_choices'] as Array<Record<string, any>> | undefined
  const milestoneTiers: TierDef[] = rawTiers
    ? rawTiers
    : rawChoices ? [{ choices: rawChoices }] : []

  if (milestoneTiers.length === 0) {
    refs.milestoneContainer.classList.add('hidden')
    refs.milestoneContainer.innerHTML = ''
    return
  }

  // Show the strip whenever there are defined tiers (locked tiers are visible but greyed)
  refs.milestoneContainer.classList.remove('hidden')
  refs.milestoneContainer.innerHTML = ''

  const tiersReached = Math.floor(level / 5)
  const choiceIds    = GameState.getMilestoneChoiceIds(upgradeId)
  const dmgMuls      = GameState.getMilestoneMuls(upgradeId)

  for (let t = 0; t < milestoneTiers.length; t++) {
    const tierChoices = milestoneTiers[t].choices ?? []
    const reached     = t < tiersReached
    const savedId     = choiceIds[t] ?? ''
    const savedMul    = dmgMuls[t]

    // Resolve active choice: prefer ID match, fall back to value match (handles old saves)
    const matchedChoice = tierChoices.find(c => c['id'] === savedId)
      ?? (savedMul !== undefined
        ? tierChoices.find(c => Math.abs(Number(c[mulKey] ?? 1.25) - savedMul) < 0.001)
        : undefined)

    // Auto-apply single-choice tier when first reached
    if (reached && tierChoices.length === 1 && !matchedChoice) {
      const solo = tierChoices[0]
      GameState.applyMilestoneChoice(upgradeId, t, Number(solo[mulKey] ?? 1.25), 1.0, solo['id'] ?? 'standard')
    }

    const isSingle   = tierChoices.length === 1
    const isChosen   = !!matchedChoice
    const stateClass = !reached    ? 'is-locked'
      : isSingle                   ? 'is-collected'
      : isChosen                   ? 'is-chosen'
      :                              'is-pending'

    const node = el('div', `ms-tier ${stateClass}`)
    node.appendChild(el('span', 'ms-tier-tag', `T${t + 1}`))

    if (isSingle) {
      // Auto-collect node: show name + bonus, no interaction needed
      const solo = tierChoices[0]
      const body = el('div', 'ms-tier-body')
      body.appendChild(el('span', 'ms-tier-name', solo['display_name'] ?? 'Bonus'))
      body.appendChild(el('span', 'ms-tier-bonus', solo['bonus'] ?? ''))
      node.appendChild(body)
    } else {
      // Binary choice: show both options side-by-side
      const choiceRow = el('div', 'ms-tier-choices')
      for (const choice of tierChoices) {
        const choiceMul  = Number(choice[mulKey] ?? 1.25)
        const isActive   = isChosen && choice['id'] === matchedChoice!['id']
        const isInactive = isChosen && !isActive
        const choiceBtn  = document.createElement('button')
        choiceBtn.className = `ms-choice-btn${isActive ? ' is-active' : isInactive ? ' is-inactive' : ''}`
        choiceBtn.appendChild(el('span', 'ms-choice-name', choice['display_name'] ?? 'Choice'))
        choiceBtn.appendChild(el('span', 'ms-choice-bonus', choice['bonus'] ?? ''))
        if (reached && !isInactive) {
          choiceBtn.addEventListener('click', () => {
            GameState.applyMilestoneChoice(upgradeId, t, choiceMul, 1.0, `${choice['id'] ?? ''}`)
            appendLog(`<span class="log-gold">T${t + 1}: ${choice['display_name'] ?? 'applied'}.</span>`)
            refreshArsenalUI()
          })
        }
        choiceRow.appendChild(choiceBtn)
      }
      node.appendChild(choiceRow)
    }

    refs.milestoneContainer.appendChild(node)
  }
}

function describeUpgradeEffect(
  upg: AnyDef,
  level: number,
  weapon: AnyDef | undefined,
  ship: AnyDef | undefined,
  muls?: number[],
): { next: string; milestone: string } {
  const milestone = describeUpgradeMilestone(upg, level, muls)
  if (upg['effect'] === 'ship_hull') {
    const base = Number(ship?.['hull'] ?? 120)
    const increment = Number(upg['effect_scale'] ?? 14)
    const currentHull = Balance.shipHull(base, level, increment, muls)
    const nextHull = Balance.shipHull(base, level + 1, increment, muls)
    return {
      next: `Current: ${Balance.formatNumber(currentHull)} -> ${Balance.formatNumber(nextHull)} base hull.`,
      milestone,
    }
  }

  const base = weapon?.['base_damage'] ?? 10
  const increment = Number(upg['effect_scale'] ?? base * (weapon?.['damage_scale_per_level'] ?? 0.2))
  const currentDmg = Balance.weaponDamage(base, increment, level, muls)
  const nextDmg = Balance.weaponDamage(base, increment, level + 1, muls)
  return {
    next: `Current: ${currentDmg.toFixed(1)} -> ${nextDmg.toFixed(1)} dmg/shot.`,
    milestone,
  }
}

function describeUpgradeMilestone(upg: AnyDef, level: number, muls?: number[]): string {
  // Strip now shows all tier info; only fall back to inline text for upgrades with no tier data
  if (upg['milestone_tiers'] || upg['milestone_choices']) return ''
  const upgradeId    = upg['id'] ?? ''
  const resolvedMuls = muls ?? GameState.getMilestoneMuls(upgradeId)
  const next = Balance.nextUpgradeMilestone(level)
  const kind = upg['effect'] === 'ship_hull' ? 'hull' : 'damage'
  if (level > 0 && level % 5 === 0) {
    return `Milestone: x${Balance.upgradeMilestoneMultiplier(level, resolvedMuls).toFixed(2)} ${kind}.`
  }
  return `Next milestone Lv.${next}.`
}

// ── Course / distance progress ────────────────────────────────────────────────
function onAdvanceLane(): void {
  if (!nextLaneId) return
  advanceBtn.classList.add('hidden')
  laneCleared = false
  const nextSector = Number(nextLaneId.replace('sector_', ''))
  if (nextSector > 0) GameState.setCurrentSector(nextSector)
  currentLaneId = `sector_${GameState.getCurrentSector()}`
  nextLaneId    = ''
  refreshLaneLabel()
  sim.startCombat()
}

function refreshLaneLabel(): void {
  refreshWatersTitle()
  refreshRouteUI()
  refreshSeaContacts()
}

function refreshWatersTitle(): void {
  const sector = SectorPlan.getSector(GameState.getCurrentSector())
  laneLabel.textContent = `Sector ${sector.sector} · ${sector.displayName}`
}

function refreshRouteUI(): void {
  if (!routeDistanceLabel || !routeMeterFill) return
  const distance = GameState.getRouteDistance()
  const goal = GameState.getRouteDistanceGoal()
  const pct = goal > 0 ? Math.max(0, Math.min(100, (distance / goal) * 100)) : 0
  const mode = GameState.getCourseMode()
  const auto = GameState.isAutoProgress()

  routeMeterFill.style.width = `${pct}%`
  const sector = SectorPlan.getSector(GameState.getCurrentSector())
  const bossState = GameState.hasDefeatedCurrentSectorBoss(sector.sector) ? 'boss first-clear logged' : 'boss ahead'
  const unlocks = sector.firstClearUnlocks.length > 0 ? `; first clear: ${sector.firstClearUnlocks.join(', ')}` : ''
  routeDistanceLabel.textContent = `Sector ${sector.sector} · ${sector.routeName} · ${Math.floor(distance)} / ${Math.floor(goal)} nmi · ${bossState}`
  routeDistanceLabel.title = `Sector ${sector.sector}: ${sector.displayName}; route tag ${sector.routeTag}; ${bossState}${unlocks}`
  if (sectorDiagnostic) {
    const sunk = GameState.getShipsSunkThisSector()
    const best = GameState.getBestShipsSunkForCurrentSector()
    const salvageMul = GameState.salvageRewardMultiplier()
    const salvageNote = salvageMul > 1 ? ` · salvage x${salvageMul.toFixed(2)}` : ''
    sectorDiagnostic.textContent = `Sector sunk: ${sunk} · best ${best}${salvageNote}`
  }
  autoProgressBtn.textContent = auto ? 'A' : 'A'
  autoProgressBtn.classList.toggle('is-active', auto)
  autoProgressBtn.classList.toggle('is-muted', !auto)
  autoProgressBtn.title = auto ? 'Auto progress on' : 'Auto progress off'
  courseForwardBtn.classList.toggle('is-active', mode === 'forward')
  courseHoldBtn.classList.toggle('is-active', mode === 'hold')
  courseRetreatBtn.classList.toggle('is-active', mode === 'retreat')
}

function toggleMechanicsFocus(): void {
  setMechanicsFocus(!shellRoot.classList.contains('mechanics-collapsed'))
}

function setMechanicsFocus(collapsed: boolean): void {
  const mobileLayout = window.matchMedia('(max-width: 760px)').matches
  shellRoot.classList.toggle('mechanics-collapsed', collapsed && !mobileLayout)
  refreshMechanicsToggle()
}

function refreshMechanicsToggle(): void {
  if (!titleFocusBtn || !statusRailBtn || !deskRailBtn) return
  const collapsed = shellRoot.classList.contains('mechanics-collapsed')
  titleFocusBtn.textContent = '⋮'
  titleFocusBtn.title = collapsed ? "Open the Captain's Desk" : "Collapse the Captain's Desk"
  titleFocusBtn.setAttribute('aria-pressed', `${collapsed}`)
  statusRailBtn.setAttribute('aria-expanded', `${!collapsed}`)
  deskRailBtn.setAttribute('aria-expanded', `${!collapsed}`)
}


function refreshSeaContacts(
  activeDef: AnyDef | undefined = currentEnemyDef,
  activeHull = currentEnemyHull,
  activeMaxHull = currentEnemyMaxHull,
): void {
  if (!seaContactLayer) return

  const sector = SectorPlan.getSector(GameState.getCurrentSector())
  const waves = sector.enemyIds
  const distanceBand = Math.floor(GameState.getRouteDistance() / CONTACT_DISTANCE_STEP)
  const bossActive = GameState.isBossPhase()
  const bossDef = sector.boss as AnyDef | undefined
  seaContactLayer.innerHTML = ''
  currentContactHpFill = null

  if (playerFleeing) return

  if (laneCleared) {
    appendSeaWaveGroup('Drifting Wreckage', 'is-wreckage-wave', CONTACT_SLOTS.map(slot => ({
      slot,
      def: activeDef ?? bossDef,
      status: 'escort' as SeaContactStatus,
      caption: 'Wreckage',
    })))
    return
  }

  if (bossActive && (activeDef || bossDef)) {
    const escortIds = waves.length > 0 ? waves : ['privateer_cutter']
    const escortContact = (slot: SeaContactSlot, index: number, caption: string): SeaWaveContact => {
      const id = escortIds[index % escortIds.length]
      return {
        slot,
        def: Definitions.getEnemy(id),
        status: 'escort',
        caption,
      }
    }
    appendSeaWaveGroup('Port Escort', 'is-port-wave', [
      escortContact(BOSS_ESCORT_SLOTS[0], 0, 'Port escort'),
    ])
    appendSeaWaveGroup('Starboard Escort', 'is-starboard-wave', [
      escortContact(BOSS_ESCORT_SLOTS[1], 1, 'Starboard escort'),
    ])
    appendSeaWaveGroup('Flagship Line', 'is-horizon-wave', [
      {
        slot: BOSS_CONTACT_SLOT,
        def: activeDef ?? bossDef,
        status: 'boss',
        caption: 'Flagship',
        hull: activeHull,
        maxHull: activeMaxHull,
      },
    ])
    return
  }

  const mainDef = activeDef ?? Definitions.getEnemy(waves[distanceBand % Math.max(1, waves.length)])
  const waveEnemyDef = (offset: number): AnyDef | undefined => {
    if (waves.length === 0) return mainDef
    const index = (distanceBand + offset + waves.length) % waves.length
    return Definitions.getEnemy(waves[index]) ?? mainDef
  }
  if (mainDef) {
    appendSeaWaveGroup('Vanguard Wake', 'is-vanguard-wave', [{
      slot: VANGUARD_CONTACT_SLOT,
      def: mainDef,
      status: 'current',
      caption: 'Under fire',
      hull: activeHull,
      maxHull: activeMaxHull,
    }])

    appendSeaWaveGroup('Port Raiders', 'is-port-wave', PORT_WAVE_SLOTS.map((slot, index) => ({
      slot,
      def: waveEnemyDef(index === 0 ? 0 : -1),
      status: (index <= 1 ? 'escort' : 'incoming') as SeaContactStatus,
      caption: 'Port fleet',
    })).slice(0, 1))

    appendSeaWaveGroup('Starboard Cutters', 'is-starboard-wave', STARBOARD_WAVE_SLOTS.map((slot, index) => ({
      slot,
      def: waveEnemyDef(index <= 1 ? 1 : 0),
      status: (index <= 1 ? 'escort' : 'incoming') as SeaContactStatus,
      caption: 'Starboard fleet',
    })).slice(0, 1))
  }

  const horizonContacts: SeaWaveContact[] = []

  if (bossDef && GameState.getRouteDistance() >= GameState.getRouteDistanceGoal() * 0.72) {
    horizonContacts.push({
      slot: { x: 70, y: 14, rot: -22, scale: 0.76, delay: 9 },
      def: bossDef,
      status: 'looming',
      caption: 'Flagship shadow',
    })
  }
  appendSeaWaveGroup('Horizon Fleet', 'is-horizon-wave', horizonContacts)
}

/** Replace only the vanguard contact without touching port/starboard ships.
 *  Prevents their CSS spawn animations from restarting on every enemy spawn. */
function refreshVanguardContact(def: AnyDef, hull: number, maxHull: number): void {
  if (!seaContactLayer) return
  // Remove stale vanguard group and clear the HP-fill reference so no
  // stale element gets written to after the old contact is gone.
  seaContactLayer.querySelector('.fleet-wave.is-vanguard-wave')?.remove()
  currentContactHpFill = null
  if (!def || laneCleared || playerFleeing) return
  appendSeaWaveGroup('Vanguard Wake', 'is-vanguard-wave', [{
    slot: VANGUARD_CONTACT_SLOT,
    def,
    status: 'current',
    caption: 'Under fire',
    hull,
    maxHull,
  }])
}

function appendSeaWaveGroup(_label: string, className: string, contacts: SeaWaveContact[]): void {
  const validContacts = contacts.filter(contact => contact.def)
  if (validContacts.length === 0) return

  const group = el('div', `fleet-wave ${className}`)
  for (let index = 0; index < validContacts.length; index++) {
    const contact = validContacts[index]
    const key = getContactKey(className, contact, index)
    const contactEl = buildSeaContact(
      key,
      contact.slot,
      contact.def,
      contact.status,
      contact.caption,
      contact.hull ?? 0,
      contact.maxHull ?? 0,
    )
    if (className === 'is-wreckage-wave') contactEl.classList.add('is-wreck')
    group.appendChild(contactEl)
  }
  seaContactLayer.appendChild(group)
}

function markCurrentSeaTargetAsBoss(def: AnyDef, maxHull: number): void {
  const current = getCurrentSeaTarget()
  if (!current) return
  current.classList.remove('is-current', 'is-target-selected', 'is-promoted-target')
  current.classList.add('is-boss')
  current.dataset.enemyId = def['id'] ?? ''
  current.title = `Flagship: ${def['display_name'] ?? 'Boss'}`
  const caption = current.querySelector('.contact-caption')
  if (caption) caption.textContent = 'Flagship'
  const name = current.querySelector('.contact-name')
  if (name) name.textContent = def['display_name'] ?? 'Boss'
  const key = current.dataset.contactKey ?? ''
  seaContactStates.set(key, {
    key,
    hull: maxHull,
    maxHull,
    damage: FLEET_CONTACT_DAMAGE,
    nextFireAt: performance.now() + contactFireDelayMs(def, 'boss'),
  })
  setContactHp(current, maxHull, maxHull)
}

function markContactSunk(contact: HTMLElement): void {
  contact.classList.remove('is-current', 'is-boss', 'is-target-selected', 'is-promoted-target')
  contact.classList.add('is-sinking')
  contact.title = 'Sinking wreck'
  const caption = contact.querySelector('.contact-caption')
  if (caption) caption.textContent = ''
  const name = contact.querySelector('.contact-name')
  if (name) name.textContent = ''
}

function buildSeaContact(
  key: string,
  slot: SeaContactSlot,
  def: AnyDef | undefined,
  status: SeaContactStatus,
  caption: string,
  hull = 0,
  maxHull = 0,
): HTMLElement {
  const contact = el('div', 'sea-contact')
  contact.classList.add(`is-${status}`)
  contact.dataset.contactKey = key
  contact.dataset.enemyId = def?.['id'] ?? ''
  const family = `${def?.['family'] ?? ''}`.toLowerCase()
  if (family.includes('ironclad')) contact.classList.add('is-ironclad')
  contact.style.setProperty('--x', `${slot.x}%`)
  contact.style.setProperty('--y', `${slot.y}%`)
  contact.style.setProperty('--rot', `${slot.rot}deg`)
  contact.style.setProperty('--scale', `${slot.scale}`)
  contact.style.setProperty('--delay', `${slot.delay ?? 0}`)
  const spawnDelayMs = contactSpawnDelayMs(slot, status)
  const travelMs = contactTravelMs(slot, status)
  contact.style.setProperty('--spawn-delay', `${spawnDelayMs}ms`)
  contact.style.setProperty('--travel-ms', `${travelMs}ms`)
  contact.dataset.spawnedAt = `${visualWaveStartedAt + spawnDelayMs}`
  contact.dataset.arrivesAt = `${visualWaveStartedAt + spawnDelayMs + travelMs}`
  contact.title = `${caption}: ${def?.['display_name'] ?? 'Unknown contact'}`

  contact.appendChild(el('span', 'contact-wake'))
  contact.appendChild(el('span', 'contact-ship'))
  contact.appendChild(el('span', 'contact-sail contact-sail-main'))
  contact.appendChild(el('span', 'contact-sail contact-sail-jib'))
  contact.appendChild(el('span', 'contact-muzzle'))
  contact.appendChild(el('span', 'enemy-fleet-shot'))

  const label = el('span', 'contact-label')
  label.appendChild(el('span', 'contact-caption', caption))
  label.appendChild(el('span', 'contact-name', def?.['display_name'] ?? 'Unknown contact'))
  contact.appendChild(label)

  const state = ensureContactState(key, def, status, hull, maxHull, spawnDelayMs, travelMs)
  contact.dataset.fireDelayMs = `${contactFireDelayMs(def, status)}`
  const hp = el('span', 'contact-hp')
  const hpFill = el('span', 'contact-hp-fill')
  hp.appendChild(hpFill)
  contact.appendChild(hp)
  if (status === 'current' || status === 'boss') {
    currentContactHpFill = hpFill
  }
  setContactHp(contact, state.hull, state.maxHull)

  return contact
}

function updateCurrentSeaContactHp(hull: number, maxHull: number): void {
  const current = getCurrentSeaTarget()
  if (current) {
    setContactHp(current, hull, maxHull)
    return
  }
  if (currentContactHpFill) {
    const pct = maxHull > 0 ? Math.max(0, Math.min(100, (hull / maxHull) * 100)) : 0
    currentContactHpFill.style.width = `${pct}%`
  }
}

function getContactKey(className: string, contact: SeaWaveContact, index: number): string {
  const waveKey = GameState.isBossPhase() ? `boss-${visualWaveSerial}` : `wave-${GameState.getWaveIndex()}-${visualWaveSerial}`
  const id = contact.def?.['id'] ?? contact.def?.['display_name'] ?? 'unknown'
  return [currentLaneId, waveKey, className, contact.status, index, id].join(':')
}

function ensureContactState(
  key: string,
  def: AnyDef | undefined,
  status: SeaContactStatus,
  hull: number,
  maxHull: number,
  spawnDelayMs: number,
  travelMs: number,
): SeaContactRuntime {
  const defHull = Number(def?.['hull'] ?? maxHull ?? 24)
  const targetMax = maxHull > 0 ? maxHull : Math.max(16, Math.round(defHull * (status === 'incoming' ? 0.72 : 0.9)))
  const targetHull = hull > 0 ? hull : targetMax
  const existing = seaContactStates.get(key)
  if (existing && existing.maxHull === targetMax && existing.hull > 0) {
    if (status === 'current' || status === 'boss') existing.hull = targetHull
    return existing
  }

  const damage = FLEET_CONTACT_DAMAGE
  const nextFireAt = visualWaveStartedAt + spawnDelayMs + travelMs + contactFireDelayMs(def, status) * (0.25 + Math.random() * 0.5)
  const state = { key, hull: targetHull, maxHull: targetMax, damage, nextFireAt }
  seaContactStates.set(key, state)
  return state
}

function getContactState(contact: HTMLElement): SeaContactRuntime | undefined {
  const key = contact.dataset.contactKey
  return key ? seaContactStates.get(key) : undefined
}

function setContactHp(contact: HTMLElement, hull: number, maxHull: number): void {
  const state = getContactState(contact)
  const safeMax = Math.max(1, maxHull)
  const safeHull = Math.max(0, Math.min(hull, safeMax))
  if (state) {
    state.hull = safeHull
    state.maxHull = safeMax
  }
  contact.dataset.hull = `${safeHull}`
  contact.dataset.maxHull = `${safeMax}`
  const fill = contact.querySelector('.contact-hp-fill')
  if (fill instanceof HTMLElement) {
    fill.style.width = `${Math.max(0, Math.min(100, (safeHull / safeMax) * 100))}%`
  }
  if (safeHull <= 0) {
    markContactSunk(contact)
  }
}

function contactSpawnDelayMs(slot: SeaContactSlot, status: SeaContactStatus): number {
  const slotDelay = Math.max(0, slot.delay ?? 0)
  const bossBias = status === 'boss' ? 1200 : status === 'looming' ? 1800 : 0
  return Math.min(VISUAL_WAVE_SPAWN_WINDOW_MS, bossBias + slotDelay * 1000)
}

function contactTravelMs(slot: SeaContactSlot, status: SeaContactStatus): number {
  const playerX = 50
  const playerY = 72
  const distance = Math.hypot(slot.x - playerX, slot.y - playerY)
  if (status === 'boss') return Math.min(18_000, 11_000 + distance * 70)
  if (status === 'looming') return Math.min(16_000, 9_000 + distance * 70)
  if (status === 'current') return Math.min(10_000, 4_600 + distance * 52)
  return Math.min(12_000, 3_600 + distance * 70)
}

function isContactSpawned(contact: HTMLElement): boolean {
  return performance.now() >= Number(contact.dataset.spawnedAt ?? 0)
}

function isContactArrived(contact: HTMLElement): boolean {
  return performance.now() >= Number(contact.dataset.arrivesAt ?? 0)
}

function applyContactDamage(contact: HTMLElement, amount: number): boolean {
  const state = getContactState(contact)
  if (!state || state.hull <= 0) return false
  setContactHp(contact, state.hull - amount, state.maxHull)
  if (state.hull <= 0) {
    markContactSunk(contact)
    return true
  }
  return false
}

function getCurrentSeaTarget(): HTMLElement | null {
  return seaContactLayer?.querySelector('.sea-contact.is-current:not(.is-sinking), .sea-contact.is-boss:not(.is-sinking)') ?? null
}

function getVisibleEnemyContacts(selector = '.sea-contact:not(.is-sinking)'): HTMLElement[] {
  if (!seaContactLayer) return []
  return Array.from(seaContactLayer.querySelectorAll(selector)).filter((node): node is HTMLElement => (
    node instanceof HTMLElement && isContactSpawned(node)
  ))
}

function getArrivedEnemyContacts(selector = '.sea-contact:not(.is-sinking)'): HTMLElement[] {
  if (!seaContactLayer) return []
  return Array.from(seaContactLayer.querySelectorAll(selector)).filter((node): node is HTMLElement => (
    node instanceof HTMLElement && isContactArrived(node)
  ))
}

function pickPlayerVolleyTarget(index: number): HTMLElement {
  const current = getCurrentSeaTarget()
  if (index === 0 && current) return current

  const escorts = getVisibleEnemyContacts('.sea-contact:not(.is-current):not(.is-boss):not(.is-sinking)')
  if (escorts.length === 0) return current ?? enemyRect

  const target = escorts[(playerShotCursor + index) % escorts.length]
  return target ?? current ?? enemyRect
}

function pickEnemyShooter(): HTMLElement {
  const shooters = getVisibleEnemyContacts(
    '.fleet-wave.is-port-wave .sea-contact:not(.is-sinking), ' +
    '.fleet-wave.is-starboard-wave .sea-contact:not(.is-sinking), ' +
    '.fleet-wave.is-horizon-wave .sea-contact:not(.is-current):not(.is-boss):not(.is-sinking)',
  )
  const fallback = getCurrentSeaTarget()
  if (shooters.length === 0) return fallback ?? enemyRect

  const shooter = shooters[enemyShotCursor % shooters.length]
  enemyShotCursor++
  return shooter ?? fallback ?? enemyRect
}

function sinkCurrentSeaContact(): void {
  const current = seaContactLayer?.querySelector('.sea-contact.is-current, .sea-contact.is-boss')
  if (current instanceof HTMLElement) {
    const state = getContactState(current)
    setContactHp(current, 0, state?.maxHull ?? 1)
  }
}

function getPlayerWeaponId(): string {
  return GameState.getSelectedWeapon()
}

function getPrimaryWeaponUpgradeLevel(weaponId = getPlayerWeaponId()): number {
  const upgrade = Definitions.getUpgradeForWeapon(weaponId)
  return upgrade ? GameState.getUpgradeLevel(upgrade['id'] ?? '') : 0
}

function refreshCombatPowerVisuals(): void {
  if (!playerRect || !combatRow) return
  const level = getPrimaryWeaponUpgradeLevel()
  playerRect.dataset.powerLevel = `${level}`
  playerRect.style.setProperty('--power-level', `${Math.min(8, level)}`)
}

function formatResourceName(id: string): string {
  return Definitions.getResource(id)?.['display_name'] ?? id
}

// ── Debug helpers ─────────────────────────────────────────────────────────────
function debugJumpSector(sector: number): void {
  advanceBtn.classList.add('hidden')
  laneCleared = false
  playerFleeing = false
  currentLaneId = `sector_${sector}`
  nextLaneId    = ''
  GameState.setCurrentSector(sector)
  refreshLaneLabel()
  sim.startCombat()
  appendLog(`<span class="log-silver">DEBUG: charted to Sector ${sector}</span>`)
}

function debugLoad(): void {
  SaveSystem.loadGame()
  clearLootDrops()
  laneCleared = false
  playerFleeing = false
  currentLaneId = `sector_${GameState.getCurrentSector()}`
  refreshLaneLabel()
  refreshAllResources()
  refreshArsenalUI()
  refreshMusterUI()
  sim.restoreCombatState()
  appendLog('<span class="log-teal">Game loaded.</span>')
}

// ── Full refresh ──────────────────────────────────────────────────────────────
export function refreshAll(): void {
  laneCleared = false
  playerFleeing = false
  clearLootDrops()
  currentLaneId = `sector_${GameState.getCurrentSector()}`
  refreshSystemLocks()
  refreshLaneLabel()
  refreshAllResources()
  refreshArsenalUI()
  refreshStormheartUI()
  refreshShipwrightUI()
  refreshResearchUI()
  refreshRelicsUI()
  refreshContractsUI()
  refreshPortUI()
  refreshTrialsUI()
  refreshOfficersUI()
  refreshOrdersUI()
  refreshLedgerUI()
  refreshPrestigeUI()
  refreshMusterUI()
}

function refreshAllResources(): void {
  salvageLabel.textContent   = Balance.formatNumber(GameState.getResource('salvage'))
  doubloonsLabel.textContent = Balance.formatNumber(GameState.getResource('doubloons'))
  const cur = GameState.getPlayerHull()
  const max = GameState.getPlayerMaxHull()
  updatePlayerHullUI(cur, max)
  refreshRouteUI()
}

function updatePlayerHullUI(hull: number, maxHull: number): void {
  const ratio = maxHull > 0 ? hull / maxHull : 0
  const fillClass = ratio < 0.25 ? 'red' : ratio < 0.5 ? 'orange' : 'green'
  setHpBar(playerHpFill, playerHpLabel, hull, maxHull, fillClass)
}

function startVisualWave(clearStates = false): void {
  visualWaveStartedAt = performance.now()
  visualWaveSerial++
  if (clearStates) seaContactStates.clear()
}

function startFleetContactSim(): void {
  if (fleetContactTimer !== 0) return
  fleetContactTimer = window.setInterval(tickFleetContactSim, 280)
}

function tickFleetContactSim(): void {
  if (!seaContactLayer || laneCleared || playerFleeing) return

  const now = performance.now()
  processLootDrops(now)
  if (now - visualWaveStartedAt >= VISUAL_WAVE_INTERVAL_MS) {
    startVisualWave(true)
    refreshSeaContacts()
    return
  }

  const contacts = getArrivedEnemyContacts('.sea-contact:not(.is-sinking)')
  for (const contact of contacts) {
    const state = getContactState(contact)
    if (!state || state.hull <= 0 || now < state.nextFireAt) continue
    state.nextFireAt = now + contactFireDelayMsFromElement(contact) * (0.85 + Math.random() * 0.45)
    spawnEnemyProjectileFrom(contact, () => applyFleetContactDamageToPlayer(contact))
  }
}

function processLootDrops(now: number): void {
  if (now < nextLootDropAt) return
  spawnLootDrop()
  nextLootDropAt = now + 12_000 + Math.random() * 8_000
}

function spawnRewardPickups(rewards: Record<string, number>, anchor?: HTMLElement): void {
  const entries = Object.entries(rewards).filter(([, amount]) => Number(amount) > 0)
  for (const [resource, amount] of entries) {
    const n = Math.max(1, Math.round(Number(amount)))
    spawnLootDrop(resource, n, anchor, true)
    appendLog(`<span class="log-gold">${formatResourceName(resource)} wreckage surfaced.</span>`)
  }
  // small bonus doubloon chance on kills
  const bossBonus = GameState.isBossPhase() ? 0.18 : 0.035
  const routeBonus = SectorPlan.getSector(GameState.getCurrentSector()).route === 'B' ? 0.02 : 0
  if (!entries.some(([id]) => id === 'doubloons') && Math.random() < bossBonus + routeBonus) {
    const bonus = GameState.isBossPhase() ? 3 : 1
    spawnLootDrop('doubloons', bonus, anchor, true)
    appendLog('<span class="log-gold">Doubloons glint in the wreckage.</span>')
  }
}


function spawnLootDrop(resourceId?: string, amountOverride?: number, anchor?: HTMLElement, force = false): boolean {
  if (!combatRow) return false
  const existing = combatRow.querySelectorAll('.loot-drop')
  if (existing.length >= MAX_LOOT_DROPS) {
    if (!force) return false
    existing[0]?.remove()
  }

  const resource = resourceId ?? (Math.random() < 0.045 ? 'doubloons' : 'salvage')
  const scalar = Balance.rewardScalar(GameState.getRouteDistance())
  const amount = amountOverride ?? (resource === 'doubloons' ? 1 : Math.round((25 + Math.random() * 70) * scalar))
  const drop = document.createElement('button')
  drop.type = 'button'
  drop.className = `loot-drop is-${resource.replace('_', '-')}`
  const origin = lootDropPosition(anchor)
  const travel = lootDropTravel(origin)
  drop.style.left = `${origin.x}%`
  drop.style.top = `${origin.y}%`
  drop.style.setProperty('--drift-x', `${travel.x}px`)
  drop.style.setProperty('--drift-y', `${travel.y}px`)
  drop.style.setProperty('--drift-ms', `${travel.ms}ms`)
  drop.dataset.resource = resource
  drop.dataset.amount = `${amount}`
  drop.dataset.lootId = `${++lootDropSerial}`
  drop.title = `${Balance.formatNumber(amount)} ${formatResourceName(resource)}`
  drop.setAttribute('aria-label', `Collect ${Balance.formatNumber(amount)} ${formatResourceName(resource)}`)
  drop.appendChild(el('span', 'loot-drop-label', `+${Balance.formatNumber(amount)}`))
  drop.addEventListener('click', () => collectLootDrop(drop))
  combatRow.appendChild(drop)
  const lifetime = Number.parseFloat(drop.style.getPropertyValue('--drift-ms')) || LOOT_DROP_LIFETIME_MS
  window.setTimeout(() => {
    if (!drop.isConnected) return
    drop.classList.add('is-fading')
    window.setTimeout(() => drop.remove(), 260)
  }, lifetime)
  return true
}

function lootDropPosition(anchor?: HTMLElement): { x: number; y: number } {
  if (!anchor || !anchor.isConnected || !combatRow) {
    return { x: 12 + Math.random() * 76, y: -4 - Math.random() * 10 }
  }
  const base = combatRow.getBoundingClientRect()
  const rect = anchor.getBoundingClientRect()
  const x = ((rect.left + rect.width * 0.5 - base.left) / Math.max(1, base.width)) * 100
  const y = ((rect.top + rect.height * 0.55 - base.top) / Math.max(1, base.height)) * 100
  return {
    x: Math.max(8, Math.min(92, x + (Math.random() - 0.5) * 9)),
    y: Math.max(12, Math.min(82, y + (Math.random() - 0.5) * 8)),
  }
}

function lootDropTravel(origin: { x: number; y: number }): { x: number; y: number; ms: number } {
  const base = combatRow?.getBoundingClientRect()
  const height = Math.max(1, base?.height ?? 520)
  const fallPx = height * (1.12 - origin.y / 100)
  return {
    x: -28 + Math.random() * 56,
    y: Math.max(120, fallPx),
    ms: 22_000 + Math.random() * 8_000,
  }
}

function collectLootDrop(drop: HTMLElement): void {
  if (!drop.isConnected || drop.classList.contains('is-collected')) return
  const resource = drop.dataset.resource ?? 'salvage'
  const amount = Number(drop.dataset.amount ?? 0)
  if (amount <= 0) return
  GameState.addResource(resource, amount)
  appendLog(`<span class="log-gold">Recovered +${Balance.formatNumber(amount)} ${formatResourceName(resource)}.</span>`)
  // Freeze the element at its current rendered position before switching animations.
  // Without this, loot-collect restarts from the element's original CSS top/left (the
  // spawn point, often above the combat area), causing a visible flash there on click.
  if (combatRow?.isConnected) {
    const base = combatRow.getBoundingClientRect()
    const rect = drop.getBoundingClientRect()
    drop.style.left = `${((rect.left + rect.width  * 0.5 - base.left) / Math.max(1, base.width))  * 100}%`
    drop.style.top  = `${((rect.top  + rect.height * 0.5 - base.top)  / Math.max(1, base.height)) * 100}%`
    drop.style.setProperty('--drift-x', '0px')
    drop.style.setProperty('--drift-y', '0px')
  }
  drop.classList.add('is-collected')
  window.setTimeout(() => drop.remove(), 180)
}

function clearLootDrops(): void {
  nextLootDropAt = 0
  combatRow?.querySelectorAll('.loot-drop').forEach(node => node.remove())
}

function contactFireDelayMs(def: AnyDef | undefined, status: SeaContactStatus): number {
  const fireRateTicks = Number(def?.['fire_rate_ticks'] ?? 15)
  const roleScale = status === 'boss' ? 3.2 : status === 'current' ? 3.8 : 5.0
  return Math.max(2600, fireRateTicks * 100 * roleScale)
}

function contactFireDelayMsFromElement(contact: HTMLElement): number {
  const state = getContactState(contact)
  const base = Number(contact.dataset.fireDelayMs ?? 0)
  if (base > 0) return base
  return state?.maxHull && state.maxHull > 120 ? 3200 : 3800
}

function applyFleetContactDamageToPlayer(contact: HTMLElement): void {
  const state = getContactState(contact)
  if (!state || state.hull <= 0) return

  const cur = GameState.getPlayerHull()
  if (cur <= 1) return
  const visualDamage = Math.max(1, Math.round(state.damage * (contact.classList.contains('is-boss') ? 0.1 : 0.06)))
  GameState.setPlayerHull(Math.max(1, cur - visualDamage))
  flashRect(playerRect, 'rgba(224,68,62,0.72)', '#22A6A1', 140)
}

// ── VFX ───────────────────────────────────────────────────────────────────────
function vfxShootAndHit(damage: number, evaded: boolean, escortTarget?: HTMLElement): void {
  // Muzzle flash on player
  flashRect(playerRect, 'rgba(255,235,128,1)', '#22A6A1', 80)

  const weaponId = getPlayerWeaponId()
  const weapon   = Definitions.getWeapon(weaponId)
  const level    = getPrimaryWeaponUpgradeLevel(weaponId)
  const dtype    = weapon?.['damage_type'] ?? 'cannon'
  const colors: Record<string, string> = {
    cannon: '#F2B134', harpoon: '#B96E35', fire: '#E0443E', occult: '#7B4FA3', chain: '#CDD9D9',
  }
  const projColor = colors[dtype] ?? '#F2B134'
  const isBoss    = !bossBanner.classList.contains('hidden')
  const visualFleetDamage = Math.max(8, Math.round((damage > 0 ? damage : (weapon?.['base_damage'] ?? 8)) * 0.95))

  spawnMuzzleSmoke(1, level)
  const target = escortTarget ?? pickPlayerVolleyTarget(0)
  const isSelectedHit = !escortTarget && target === getCurrentSeaTarget()
  spawnProjectile(projColor, level, 0, 1, target, () => {
    const targetAlive = target.isConnected && !target.classList.contains('is-sinking')
    if (targetAlive) flashTarget(target, '#ffffff', isBoss ? '#F2B134' : '#E0443E', 150)
    if (targetAlive) spawnImpactSplash(target, projColor, level)
    if (!escortTarget && !isSelectedHit) applyContactDamage(target, visualFleetDamage)
    if (targetAlive) spawnDamageNumber(target, damage, evaded, isBoss && !escortTarget)
  })
  if (!escortTarget) playerShotCursor += 1
}

function spawnProjectile(
  color: string,
  powerLevel: number,
  index: number,
  total: number,
  target: HTMLElement,
  onHit: () => void,
  subdued = false,
): void {
  const fromRect = playerRect.getBoundingClientRect()
  const toRect   = target.getBoundingClientRect()
  const base     = combatRow.getBoundingClientRect()

  const startBaseX = fromRect.left + fromRect.width  / 2 - base.left - 6
  const startBaseY = fromRect.top  + fromRect.height / 2 - base.top  - 2
  const endBaseX   = toRect.left   + toRect.width    / 2 - base.left - 6
  const endBaseY   = toRect.top    + toRect.height   / 2 - base.top  - 2
  const dx = endBaseX - startBaseX
  const dy = endBaseY - startBaseY
  const len = Math.max(1, Math.hypot(dx, dy))
  const spread = (index - (total - 1) / 2) * Math.min(16, 7 + powerLevel * 1.35)
  const perpX = (-dy / len) * spread
  const perpY = (dx / len) * spread
  const startX = startBaseX + perpX * 0.7
  const startY = startBaseY + perpY * 0.7
  const endX   = endBaseX + perpX
  const endY   = endBaseY + perpY
  const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90
  const delay = index * 24

  const proj = document.createElement('div')
  proj.className = subdued ? 'projectile is-suppression' : 'projectile'
  proj.style.cssText = [
    `background:${color}`,
    `color:${color}`,
    `left:${startX}px`,
    `top:${startY}px`,
    `height:${18 + Math.min(12, powerLevel * 2)}px`,
    `width:${5 + Math.min(4, powerLevel)}px`,
    `transform:rotate(${angle}deg)`,
    `transition-delay:${delay}ms`,
  ].join(';')
  combatRow.appendChild(proj)

  // Force layout before transitioning
  proj.getBoundingClientRect()
  proj.style.left = `${endX}px`
  proj.style.top  = `${endY}px`

  setTimeout(() => { proj.remove(); onHit() }, (subdued ? 390 : 330) + delay)
}

function spawnEnemyProjectile(): void {
  const shooter = pickEnemyShooter()
  spawnEnemyProjectileFrom(shooter)
}

function spawnEnemyProjectileFrom(shooter: HTMLElement, onHit?: () => void): void {
  const fromRect = shooter.getBoundingClientRect()
  const toRect   = playerRect.getBoundingClientRect()
  const base     = combatRow.getBoundingClientRect()

  const startX = fromRect.left + fromRect.width  * 0.5 - base.left - 4
  const startY = fromRect.top  + fromRect.height * 0.6 - base.top  - 4
  const endX   = toRect.left   + toRect.width    * 0.5 - base.left - 4
  const endY   = toRect.top    + toRect.height   * 0.42 - base.top  - 4
  const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI + 90

  const shot = document.createElement('div')
  shot.className = 'enemy-projectile'
  shot.style.cssText = [
    `left:${startX}px`,
    `top:${startY}px`,
    `transform:rotate(${angle}deg)`,
  ].join(';')
  combatRow.appendChild(shot)
  shot.getBoundingClientRect()
  shot.style.left = `${endX}px`
  shot.style.top  = `${endY}px`
  setTimeout(() => {
    shot.remove()
    onHit?.()
  }, 430)
}

function spawnMuzzleSmoke(count: number, powerLevel: number): void {
  const rect = playerRect.getBoundingClientRect()
  const base = combatRow.getBoundingClientRect()
  const x = rect.left - base.left + rect.width * 0.56
  const y = rect.top - base.top + rect.height * 0.28
  for (let index = 0; index < Math.min(6, count + 1); index++) {
    const puff = document.createElement('div')
    puff.className = 'smoke-puff'
    const size = 14 + Math.min(18, powerLevel * 2) + index * 2
    puff.style.cssText = [
      `left:${x + (Math.random() - 0.5) * 22}px`,
      `top:${y + (Math.random() - 0.5) * 18}px`,
      `width:${size}px`,
      `height:${size}px`,
    ].join(';')
    combatRow.appendChild(puff)
    puff.getBoundingClientRect()
    puff.style.opacity = '0'
    puff.style.transform = `translate(${18 + index * 4}px, ${-14 - index * 2}px) scale(1.8)`
    setTimeout(() => puff.remove(), 720)
  }
}

function spawnImpactSplash(target: HTMLElement, color: string, powerLevel: number, subdued = false): void {
  const rect = target.getBoundingClientRect()
  const base = combatRow.getBoundingClientRect()
  const splash = document.createElement('div')
  splash.className = subdued ? 'impact-splash is-suppression' : 'impact-splash'
  const size = (subdued ? 22 : 38) + Math.min(subdued ? 12 : 28, powerLevel * 3)
  splash.style.cssText = [
    `border-color:${color}`,
    `color:${color}`,
    `left:${rect.left - base.left + rect.width * 0.5 - size / 2}px`,
    `top:${rect.top - base.top + rect.height * 0.48 - size / 2}px`,
    `width:${size}px`,
    `height:${size}px`,
  ].join(';')
  combatRow.appendChild(splash)
  splash.getBoundingClientRect()
  splash.style.opacity = '0'
  splash.style.transform = 'scale(1.65)'
  setTimeout(() => splash.remove(), 520)
}

function spawnDamageNumber(target: HTMLElement, damage: number, evaded: boolean, isBoss: boolean): void {
  if (!evaded && damage <= 0) return
  const rect = target.getBoundingClientRect()
  const base = combatRow.getBoundingClientRect()

  const lbl = document.createElement('div')
  lbl.className = 'dmg-number'
  lbl.textContent = evaded ? 'EVADE' : `-${Balance.formatNumber(damage)}`
  lbl.style.color = evaded ? '#CDD9D9' : isBoss ? '#F2B134' : '#E0443E'

  const x = rect.left - base.left + Math.random() * rect.width  * 0.6
  const y = rect.top  - base.top  + rect.height * 0.15
  lbl.style.cssText += `left:${x}px;top:${y}px;opacity:1;font-size:${evaded ? 13 : 15}px;`
  combatRow.appendChild(lbl)

  lbl.getBoundingClientRect()
  lbl.style.top     = `${y - 38}px`
  lbl.style.opacity = '0'

  setTimeout(() => lbl.remove(), 800)
}

function flashTarget(target: HTMLElement, flashColor: string, restoreColor: string, durationMs: number): void {
  if (target === enemyRect || target === playerRect) {
    flashRect(target, flashColor, restoreColor, durationMs)
    return
  }
  target.classList.add('is-hit-flash')
  target.style.setProperty('--hit-color', flashColor)
  setTimeout(() => target.classList.remove('is-hit-flash'), durationMs + 80)
  void restoreColor
}

function flashRect(rect: HTMLElement, flashColor: string, restoreColor: string, durationMs: number): void {
  const prevFilter = rect.style.filter
  rect.style.transition       = 'none'
  rect.style.backgroundColor  = ''
  rect.style.filter           = `${prevFilter} brightness(1.55) drop-shadow(0 0 14px ${flashColor})`.trim()
  rect.getBoundingClientRect()
  rect.style.transition       = `filter ${durationMs}ms`
  rect.style.filter           = prevFilter
  // suppress unused-param warning — restoreColor remains for call-site readability
  void restoreColor
}

// ── HP bar helpers ────────────────────────────────────────────────────────────
type FillColor = 'green' | 'red' | 'orange'
function setHpBar(fill: HTMLElement, label: HTMLElement, cur: number, max: number, color: FillColor): void {
  const pct = max > 0 ? (cur / max) * 100 : 0
  fill.style.width = `${pct}%`
  fill.className   = `hp-fill hp-fill-${color}`
  label.textContent = `${Balance.formatNumber(cur)} / ${Balance.formatNumber(max)}`
}

// ── Log helpers ───────────────────────────────────────────────────────────────
function appendLog(htmlMsg: string): void {
  logLines.push(htmlMsg)
  if (logLines.length > LOG_MAX) {
    logLines.shift()
    combatLog.firstChild?.remove()
  }
  const p = document.createElement('p')
  p.innerHTML = htmlMsg
  combatLog.appendChild(p)
  combatLog.scrollTop = combatLog.scrollHeight
}

// ── DOM helpers ───────────────────────────────────────────────────────────────
function el(tag: string, classes = '', text = ''): HTMLElement {
  const e = document.createElement(tag)
  if (classes) e.className = classes
  if (text)    e.textContent = text
  return e
}

function btn(text: string, extraClasses = ''): HTMLElement {
  const b = document.createElement('button')
  b.textContent = text
  b.className   = ['btn', extraClasses].filter(Boolean).join(' ')
  return b
}

function labelDeskTab(button: HTMLButtonElement, label: string, passage: string): void {
  button.textContent = ''
  button.dataset.realLabel = label
  button.appendChild(el('span', 'tab-label', label))
  button.appendChild(el('span', 'tab-passage', passage))
  button.title ||= `${label} target unlock: ${passage}`
}
