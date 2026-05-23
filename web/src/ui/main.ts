import './styles.css'
import { ABILITY_ACTIVE_TICKS, ABILITY_COOLDOWN_TICKS, GameState, MUSTER_MAX_LEVELS_PER_SECOND } from '../core/game-state'
import { sim } from '../core/sim'
import { Definitions } from '../core/definitions'
import { Balance } from '../core/balance'
import { SaveSystem } from '../core/save-system'
import { SectorPlan } from '../core/sector-plan'
import type { AbilityId } from '../core/types'

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
type DeskTab = 'arsenal' | 'prestige' | 'muster' | 'log'

// ── DOM refs ──────────────────────────────────────────────────────────────────
let shellRoot:       HTMLElement
let laneLabel:       HTMLElement
let bossBanner:      HTMLElement
let titleFocusBtn:   HTMLButtonElement
let routeDistanceLabel: HTMLElement
let routeMeterFill: HTMLElement
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
let logTabBtn: HTMLButtonElement
let prestigeSection: HTMLElement
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
let musterAllocationLabel: HTMLElement
let musterGunneryPowerLabel: HTMLElement
let musterSeamanshipPowerLabel: HTMLElement
let musterPowerFill: HTMLElement
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
const MAX_LOOT_DROPS = 3
const LOOT_DROP_LIFETIME_MS = 18_000

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
  root.appendChild(strip)
}

function buildBottomPanel(root: HTMLElement): void {
  const panel = el('div', 'panel-bg')
  root.appendChild(panel)

  deskRailBtn = btn("CAPTAIN'S DESK", 'desk-rail-toggle sz-12 c-gold') as HTMLButtonElement
  deskRailBtn.title = "Open the Captain's Desk"
  deskRailBtn.addEventListener('click', toggleMechanicsFocus)
  panel.appendChild(deskRailBtn)

  // Tab row
  const tabRow = el('div', 'tab-row')
  arsenalTabBtn = btn('ARSENAL', 'tab-btn sz-14 c-gold') as HTMLButtonElement
  arsenalTabBtn.style.minWidth = '100px'
  arsenalTabBtn.style.height = '44px'
  arsenalTabBtn.classList.add('is-active')
  arsenalTabBtn.addEventListener('click', () => setActiveTab('arsenal'))
  tabRow.appendChild(arsenalTabBtn)

  prestigeTabBtn = btn('PRESTIGE', 'tab-btn sz-14 hidden') as HTMLButtonElement
  prestigeTabBtn.style.minWidth = '100px'
  prestigeTabBtn.style.height = '44px'
  prestigeTabBtn.addEventListener('click', () => setActiveTab('prestige'))
  tabRow.appendChild(prestigeTabBtn)

  musterTabBtn = btn('MUSTER', 'tab-btn sz-14 hidden') as HTMLButtonElement
  musterTabBtn.style.minWidth = '90px'
  musterTabBtn.style.height = '44px'
  musterTabBtn.addEventListener('click', () => setActiveTab('muster'))
  tabRow.appendChild(musterTabBtn)

  logTabBtn = btn('LOG', 'tab-btn sz-14') as HTMLButtonElement
  logTabBtn.style.minWidth = '80px'
  logTabBtn.style.height = '44px'
  logTabBtn.addEventListener('click', () => setActiveTab('log'))
  tabRow.appendChild(logTabBtn)

  const debugTab = btn('DEBUG', 'sz-14')
  debugTab.style.minWidth = '80px'
  debugTab.style.height = '44px'
  debugTab.addEventListener('click', () => debugOverlay.classList.toggle('hidden'))
  tabRow.appendChild(debugTab)
  panel.appendChild(tabRow)

  panel.appendChild(el('hr'))

  buildArsenalPanel(panel)
  buildPrestigePanel(panel)
  buildMusterPanel(panel)
  buildLogPanel(panel)
  refreshSystemLocks()

  advanceBtn = btn('▶  CHART NEXT WATERS', 'btn-advance sz-16 c-gold') as HTMLButtonElement
  advanceBtn.classList.add('hidden')
  advanceBtn.addEventListener('click', onAdvanceLane)
  panel.appendChild(advanceBtn)
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

  // Stat bars
  const stats = el('div', 'muster-stats')

  const gStat = el('div', 'muster-stat')
  const gTop = el('div', 'muster-stat-top')
  gTop.appendChild(el('span', 'loadout-kicker', 'GUNNERY'))
  musterGunneryLabel = el('span', 'muster-level-label')
  gTop.appendChild(musterGunneryLabel)
  gStat.appendChild(gTop)
  const gMeter = el('div', 'upgrade-meter')
  musterGunneryBar = el('div', 'upgrade-meter-fill')
  gMeter.appendChild(musterGunneryBar)
  gStat.appendChild(gMeter)
  musterGunneryBonus = el('span', 'muster-bonus-label')
  gStat.appendChild(musterGunneryBonus)
  musterGunneryProgress = el('span', 'muster-progress-label')
  gStat.appendChild(musterGunneryProgress)
  stats.appendChild(gStat)

  const sStat = el('div', 'muster-stat')
  const sTop = el('div', 'muster-stat-top')
  sTop.appendChild(el('span', 'loadout-kicker', 'SEAMANSHIP'))
  musterSeamanshipLabel = el('span', 'muster-level-label')
  sTop.appendChild(musterSeamanshipLabel)
  sStat.appendChild(sTop)
  const sMeter = el('div', 'upgrade-meter')
  musterSeamanshipBar = el('div', 'upgrade-meter-fill')
  sMeter.appendChild(musterSeamanshipBar)
  sStat.appendChild(sMeter)
  musterSeamanshipBonus = el('span', 'muster-bonus-label')
  sStat.appendChild(musterSeamanshipBonus)
  musterSeamanshipProgress = el('span', 'muster-progress-label')
  sStat.appendChild(musterSeamanshipProgress)
  stats.appendChild(sStat)

  musterSection.appendChild(stats)

  const allocation = el('div', 'muster-allocation')
  const allocationTop = el('div', 'muster-allocation-top')
  allocationTop.appendChild(el('span', 'loadout-kicker', 'POWER ALLOCATION'))
  musterAllocationLabel = el('span', 'muster-level-label')
  allocationTop.appendChild(musterAllocationLabel)
  allocation.appendChild(allocationTop)

  const powerLabels = el('div', 'muster-power-labels')
  musterGunneryPowerLabel = el('span', 'c-gold')
  musterSeamanshipPowerLabel = el('span', 'c-teal')
  powerLabels.append(musterGunneryPowerLabel, musterSeamanshipPowerLabel)
  allocation.appendChild(powerLabels)

  const powerTrack = el('div', 'muster-power-track')
  musterPowerFill = el('div', 'muster-power-fill')
  powerTrack.appendChild(musterPowerFill)
  allocation.appendChild(powerTrack)

  musterAllocationSlider = document.createElement('input')
  musterAllocationSlider.type = 'range'
  musterAllocationSlider.min = '0'
  musterAllocationSlider.max = '100'
  musterAllocationSlider.step = '5'
  musterAllocationSlider.className = 'muster-slider'
  musterAllocationSlider.setAttribute('aria-label', 'Muster power allocation')
  musterAllocationSlider.addEventListener('input', () => {
    GameState.setMusterPower(Number(musterAllocationSlider.value))
  })
  allocation.appendChild(musterAllocationSlider)

  musterSection.appendChild(allocation)
  parent.appendChild(musterSection)
  refreshMusterUI()
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
  arsenalSection.classList.toggle('hidden', tab !== 'arsenal')
  prestigeSection.classList.toggle('hidden', tab !== 'prestige')
  musterSection.classList.toggle('hidden', tab !== 'muster')
  logSection.classList.toggle('hidden', tab !== 'log')
  arsenalTabBtn.classList.toggle('is-active', tab === 'arsenal')
  prestigeTabBtn.classList.toggle('is-active', tab === 'prestige')
  musterTabBtn.classList.toggle('is-active', tab === 'muster')
  logTabBtn.classList.toggle('is-active', tab === 'log')
  arsenalTabBtn.classList.toggle('c-gold', tab === 'arsenal')
  prestigeTabBtn.classList.toggle('c-gold', tab === 'prestige')
  musterTabBtn.classList.toggle('c-teal', tab === 'muster')
  logTabBtn.classList.toggle('c-gold', tab === 'log')
  if (tab === 'prestige') refreshPrestigeUI()
  if (tab === 'muster') refreshMusterUI()
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

  // Sector jumps
  const laneRow = el('div', 'debug-row')
  laneRow.appendChild(el('span', '', 'Passages:'))
  for (const sector of [1, 2, 5, 10]) {
    const label = `S${sector}`
    const b = btn(label, 'sz-13')
    b.addEventListener('click', () => debugJumpSector(sector))
    laneRow.appendChild(b)
  }
  debugOverlay.appendChild(laneRow)

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
    refreshArsenalUI()
    setActiveTab(GameState.isSystemUnlocked('muster') ? 'muster' : 'arsenal')
  })
  GameState.on('doctrine_changed', () => refreshDoctrineUI())
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
    startVisualWave(true)
    refreshSeaContacts(def, maxHull, maxHull)
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
  enemyHpFill.style.width = '0%'
  enemyHpLabel.textContent = '0 / ?'
  if (isLastInSquad) {
    sinkCurrentSeaContact()
  }
  collectRewardsPassively(rewards)
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
    appendLog('<span class="log-green">Passage cleared. New course plotted.</span>')
  } else if (nextId) {
    advanceBtn.classList.add('hidden')
    appendLog('<span class="log-green">Passage cleared. Auto course continuing.</span>')
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
  collectRewardsPassively(rewards)
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
}

// ── Prestige / unlocks ───────────────────────────────────────────────────────
function refreshSystemLocks(): void {
  if (!prestigeTabBtn || !musterTabBtn) return
  prestigeTabBtn.classList.toggle('hidden', !GameState.isSystemUnlocked('prestige'))
  musterTabBtn.classList.toggle('hidden', !GameState.isSystemUnlocked('muster'))
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

  const canReturn = GameState.hasDefeatedBoss('lane_02_boss')
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
      done: () => GameState.hasDefeatedBoss('lane_01_boss'),
    },
    {
      kicker: 'BOSS II',
      title: 'Defeat The Cracked Bell',
      body: 'Makes Return to Port available. Prestige after this clear unlocks Muster.',
      done: () => GameState.hasDefeatedBoss('lane_02_boss'),
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
  if (!GameState.hasDefeatedBoss('lane_02_boss')) {
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
    const tier = newLevel / 5
    appendLog(`<span class="log-silver">Milestone Tier ${tier} reached — choose a path in the Arsenal card.</span>`)
  }
}

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
  musterGunneryBar.style.width    = `${gPct}%`
  musterGunneryLabel.textContent  = `Lv. ${g}`
  musterGunneryBonus.textContent  = `+${((Balance.gunneryBonus(g) - 1) * 100).toFixed(0)}% weapon damage`
  musterGunneryProgress.textContent = `${Balance.formatNumber(gXp)} / ${Balance.formatNumber(gNeed)} muster`
  musterSeamanshipBar.style.width   = `${sPct}%`
  musterSeamanshipLabel.textContent = `Lv. ${s}`
  musterSeamanshipBonus.textContent = `+${((Balance.seamanshipHullBonus(s) - 1) * 100).toFixed(0)}% max hull`
  musterSeamanshipProgress.textContent = `${Balance.formatNumber(sXp)} / ${Balance.formatNumber(sNeed)} muster`

  musterAllocationSlider.value = `${gPower}`
  musterAllocationLabel.textContent = `Gain cap: ${MUSTER_MAX_LEVELS_PER_SECOND}/sec`
  musterGunneryPowerLabel.textContent = `Gunnery ${gPower}%`
  musterSeamanshipPowerLabel.textContent = `Seamanship ${sPower}%`
  musterPowerFill.style.width = `${gPower}%`
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
  refs.desc.textContent  = `${desc} ${statLine.next} ${statLine.milestone}`
  refs.cost.textContent = `Cost: ${Balance.formatNumber(cost)} ${formatResourceName(resourceId)}`
  refs.button.disabled  = !GameState.canAfford(resourceId, cost)
  refs.button.textContent = 'BUY UPGRADE'

  refreshMilestoneChoicesOnCard(refs)
}

function refreshMilestoneChoicesOnCard(refs: ArsenalCardRefs): void {
  const upg = refs.upgrade
  const upgradeId = upg['id'] ?? ''
  const level = GameState.getUpgradeLevel(upgradeId)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const choices = upg['milestone_choices'] as Array<Record<string, any>> | undefined

  const tiersReached = Math.floor(level / 5)
  if (!choices || choices.length === 0 || tiersReached === 0) {
    refs.milestoneContainer.classList.add('hidden')
    refs.milestoneContainer.innerHTML = ''
    return
  }

  refs.milestoneContainer.classList.remove('hidden')
  refs.milestoneContainer.innerHTML = ''

  const muls     = GameState.getMilestoneMuls(upgradeId)
  const costMuls = GameState.getMilestoneCostMuls(upgradeId)

  for (let tier = 0; tier < tiersReached; tier++) {
    const activeDmgMul  = muls[tier]     ?? 1.25
    const activeCostMul = costMuls[tier] ?? 1.0

    const tierRow = el('div', 'milestone-tier-row')
    tierRow.appendChild(el('span', 'milestone-tier-label', `Tier ${tier + 1}`))

    const choiceRow = el('div', 'milestone-tier-choices')
    for (const choice of choices) {
      const dmgMul  = Number(choice['dmg_mul']  ?? choice['hull_mul'] ?? 1.25)
      const costMul = Number(choice['cost_mul'] ?? 1.0)
      const isActive = Math.abs(dmgMul - activeDmgMul) < 0.001 && Math.abs(costMul - activeCostMul) < 0.001

      const choiceBtn = document.createElement('button')
      choiceBtn.className = `btn milestone-choice-inline${isActive ? ' is-active' : ''}`
      choiceBtn.appendChild(el('span', 'choice-name', choice['display_name'] ?? 'Choice'))
      choiceBtn.appendChild(el('span', 'choice-desc', choice['description'] ?? ''))
      choiceBtn.addEventListener('click', () => {
        GameState.applyMilestoneChoice(upgradeId, tier, dmgMul, costMul)
        appendLog(`<span class="log-gold">Tier ${tier + 1}: ${choice['display_name'] ?? 'applied'}.</span>`)
      })
      choiceRow.appendChild(choiceBtn)
    }
    tierRow.appendChild(choiceRow)
    refs.milestoneContainer.appendChild(tierRow)
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
  const upgradeId = upg['id'] ?? ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const choices = upg['milestone_choices'] as Array<Record<string, any>> | undefined
  const tiersReached = Math.floor(level / 5)
  if (choices && choices.length > 0 && tiersReached > 0) return ''
  const resolvedMuls = muls ?? GameState.getMilestoneMuls(upgradeId)
  const next = Balance.nextUpgradeMilestone(level)
  const kind = upg['effect'] === 'ship_hull' ? 'hull' : 'damage'
  if (level > 0 && level % 5 === 0) {
    return `Milestone active: x${Balance.upgradeMilestoneMultiplier(level, resolvedMuls).toFixed(2)} ${kind}.`
  }
  return `Next milestone Lv.${next}: x1.25 ${kind}.`
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
  laneLabel.textContent = `Passage ${sector.sector} · ${sector.displayName}`
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
  const boss = sector.boss as AnyDef | undefined
  const bossState = GameState.hasDefeatedBoss(boss?.['id'] ?? '') ? 'boss first-clear logged' : 'boss ahead'
  routeDistanceLabel.textContent = `${sector.routeName}  ${Math.floor(distance)} / ${Math.floor(goal)} nmi`
  routeDistanceLabel.title = `Passage ${sector.sector}: ${sector.displayName}; ${bossState}`
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
  appendLog(`<span class="log-silver">DEBUG: charted to Passage ${sector}</span>`)
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
  refreshLaneLabel()
  refreshAllResources()
  refreshArsenalUI()
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

function collectRewardsPassively(rewards: Record<string, number>): void {
  const entries = Object.entries(rewards).filter(([, amount]) => Number(amount) > 0)
  for (const [resource, amount] of entries) {
    const n = Math.max(1, Math.round(Number(amount)))
    GameState.addResource(resource, n)
    appendLog(`<span class="log-gold">+${Balance.formatNumber(n)} ${formatResourceName(resource)}</span>`)
  }
  // small bonus doubloon chance on kills
  const bossBonus = GameState.isBossPhase() ? 0.18 : 0.035
  const routeBonus = SectorPlan.getSector(GameState.getCurrentSector()).route === 'B' ? 0.02 : 0
  if (!entries.some(([id]) => id === 'doubloons') && Math.random() < bossBonus + routeBonus) {
    const bonus = GameState.isBossPhase() ? 3 : 1
    GameState.addResource('doubloons', bonus)
    appendLog(`<span class="log-gold">+${bonus} Doubloons (bonus)</span>`)
  }
}


function spawnLootDrop(resourceId?: string, amountOverride?: number, anchor?: HTMLElement): void {
  if (!combatRow) return
  const existing = combatRow.querySelectorAll('.loot-drop')
  if (existing.length >= MAX_LOOT_DROPS) return

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
    ms: 16_000 + Math.random() * 6_000,
  }
}

function collectLootDrop(drop: HTMLElement): void {
  if (!drop.isConnected || drop.classList.contains('is-collected')) return
  const resource = drop.dataset.resource ?? 'salvage'
  const amount = Number(drop.dataset.amount ?? 0)
  if (amount <= 0) return
  GameState.addResource(resource, amount)
  appendLog(`<span class="log-gold">Recovered +${Balance.formatNumber(amount)} ${formatResourceName(resource)}.</span>`)
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
  const isPrimaryHit = !escortTarget && target === getCurrentSeaTarget()
  spawnProjectile(projColor, level, 0, 1, target, () => {
    const targetAlive = target.isConnected && !target.classList.contains('is-sinking')
    if (targetAlive) flashTarget(target, '#ffffff', isBoss ? '#F2B134' : '#E0443E', 150)
    if (targetAlive) spawnImpactSplash(target, projColor, level)
    if (!escortTarget && !isPrimaryHit) applyContactDamage(target, visualFleetDamage)
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
