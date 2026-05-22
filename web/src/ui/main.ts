import './styles.css'
import { GameState } from '../core/game-state'
import { sim } from '../core/sim'
import { Definitions } from '../core/definitions'
import { Balance } from '../core/balance'
import { SaveSystem } from '../core/save-system'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDef = Record<string, any>
type ArsenalCardRefs = {
  upgrade: AnyDef
  level: HTMLElement
  desc: HTMLElement
  cost: HTMLElement
  progress: HTMLElement
  button: HTMLButtonElement
}

// ── DOM refs ──────────────────────────────────────────────────────────────────
let shellRoot:       HTMLElement
let laneLabel:       HTMLElement
let waveLabel:       HTMLElement
let bossBanner:      HTMLElement
let titleFocusBtn:   HTMLButtonElement
let routeDistanceLabel: HTMLElement
let routeMeterFill: HTMLElement
let autoProgressBtn: HTMLButtonElement
let courseForwardBtn: HTMLButtonElement
let courseHoldBtn: HTMLButtonElement
let courseRetreatBtn: HTMLButtonElement
let fleetTrack:      HTMLElement
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
let arsenalSummary:  HTMLElement
let arsenalList:     HTMLElement
let arsenalCards:    ArsenalCardRefs[] = []
let arsenalWeaponId = ''
let advanceBtn:      HTMLButtonElement
let statusRailBtn:   HTMLButtonElement
let deskRailBtn:     HTMLButtonElement
let debugOverlay:    HTMLElement
let currentEnemyDef: AnyDef | undefined
let currentEnemyHull = 0
let currentEnemyMaxHull = 0
let currentContactHpFill: HTMLElement | null = null
let playerShotCursor = 0
let enemyShotCursor = 0
let fleetContactTimer = 0
let visualWaveStartedAt = 0
let visualWaveSerial = 0
let playerFleeing = false

let currentLaneId = 'lane_01'
let nextLaneId    = ''
let laneCleared   = false
const LOG_MAX     = 8
const logLines: string[] = []
const VISUAL_WAVE_INTERVAL_MS = 30_000
const VISUAL_WAVE_SPAWN_WINDOW_MS = 10_000
const FLEET_CONTACT_DAMAGE = 1
const CONTACT_DISTANCE_STEP = 30

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

// Primary target (settled in front of player, upper-center)
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

// Horizon fleet — settled in upper zone, animation enters from above
const HORIZON_WAVE_SLOTS: SeaContactSlot[] = [
  { x: 34, y: 14, rot: 10,  scale: 0.66, delay: 0 },
  { x: 51, y: 11, rot: -2,  scale: 0.76, delay: 3 },
  { x: 68, y: 15, rot: -14, scale: 0.64, delay: 6 },
  { x: 58, y: 22, rot: -8,  scale: 0.58, delay: 9 },
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
  refreshFleetTrack()
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
  waveLabel  = el('span', 'wave-label')
  bossBanner = el('span', 'boss-banner hidden', 'BOSS')
  titleFocusBtn = btn('SEA FOCUS', 'title-focus-btn sz-12 c-gold') as HTMLButtonElement
  titleFocusBtn.title = "Collapse the Captain's Desk"
  titleFocusBtn.addEventListener('click', toggleMechanicsFocus)
  titleRow.append(laneLabel, waveLabel, bossBanner, titleFocusBtn)
  panel.appendChild(titleRow)

  buildCourseControls(panel)

  // Combat row (positioned container for VFX projectiles)
  combatRow = el('div', 'combat-row')
  panel.appendChild(combatRow)

  combatRow.appendChild(el('div', 'sea-grid'))
  const horizon = el('div', 'sea-horizon')
  horizon.appendChild(el('span', 'sea-horizon-kicker', 'AT THE HORIZON'))
  horizon.appendChild(el('span', 'sea-horizon-line'))
  combatRow.appendChild(horizon)

  seaContactLayer = el('div', 'sea-contact-layer')
  combatRow.appendChild(seaContactLayer)

  fleetTrack = el('div', 'fleet-track')
  combatRow.appendChild(fleetTrack)
  buildEnemyBlock(combatRow)
  buildPlayerBlock(combatRow)

  // Counter hint
  counterHint = el('span', 'counter-hint hidden')
  panel.appendChild(counterHint)

  // Combat log
  const logWrap = el('div', 'combat-log-wrap')
  logWrap.style.flex = '1'
  combatLog = el('div', 'combat-log')
  logWrap.appendChild(combatLog)
  panel.appendChild(logWrap)
}

function buildCourseControls(parent: HTMLElement): void {
  const nav = el('div', 'route-nav')
  const meter = el('div', 'route-meter')
  routeMeterFill = el('span', 'route-meter-fill')
  meter.appendChild(routeMeterFill)
  routeDistanceLabel = el('span', 'route-distance-label')
  nav.append(meter, routeDistanceLabel)

  const controls = el('div', 'course-controls')
  autoProgressBtn = btn('AUTO ON', 'course-btn') as HTMLButtonElement
  autoProgressBtn.title = 'Automatically sail after each victory'
  autoProgressBtn.addEventListener('click', () => GameState.setAutoProgress(!GameState.isAutoProgress()))

  courseForwardBtn = btn('FORWARD', 'course-btn') as HTMLButtonElement
  courseForwardBtn.title = 'Push into deeper water after victories'
  courseForwardBtn.addEventListener('click', () => GameState.setCourseMode('forward'))

  courseHoldBtn = btn('HOLD', 'course-btn') as HTMLButtonElement
  courseHoldBtn.title = 'Keep fighting at this distance'
  courseHoldBtn.addEventListener('click', () => GameState.setCourseMode('hold'))

  courseRetreatBtn = btn('BACK', 'course-btn') as HTMLButtonElement
  courseRetreatBtn.title = 'Win fights while sailing back toward safer water'
  courseRetreatBtn.addEventListener('click', () => GameState.setCourseMode('retreat'))

  controls.append(autoProgressBtn, courseForwardBtn, courseHoldBtn, courseRetreatBtn)
  nav.appendChild(controls)
  parent.appendChild(nav)
}

function buildPlayerBlock(parent: HTMLElement): void {
  const ship = Definitions.getShip('starter_ship')
  const block = el('div', 'ship-block ship-block-player')
  block.appendChild(el('span', 'target-kicker c-teal', 'FLAGSHIP'))
  playerRect = el('div', 'ship-rect ship-rect-player')
  block.appendChild(playerRect)
  block.appendChild(el('span', 'sz-10 c-silver ship-name', ship?.['display_name'] ?? 'Starter Ship'))
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
  block.appendChild(el('span', 'target-kicker c-copper', 'PRIMARY TARGET'))
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
  const arsenalTab = btn('ARSENAL', 'tab-btn sz-14 c-gold') as HTMLButtonElement
  arsenalTab.style.minWidth = '100px'
  arsenalTab.style.height = '44px'
  arsenalTab.classList.add('is-active')
  arsenalTab.addEventListener('click', () => arsenalTab.classList.add('is-active'))
  tabRow.appendChild(arsenalTab)

  const debugTab = btn('DEBUG', 'sz-14')
  debugTab.style.minWidth = '80px'
  debugTab.style.height = '44px'
  debugTab.addEventListener('click', () => debugOverlay.classList.toggle('hidden'))
  tabRow.appendChild(debugTab)
  panel.appendChild(tabRow)

  panel.appendChild(el('hr'))

  buildArsenalPanel(panel)

  advanceBtn = btn('▶  CHART NEXT WATERS', 'btn-advance sz-16 c-gold') as HTMLButtonElement
  advanceBtn.classList.add('hidden')
  advanceBtn.addEventListener('click', onAdvanceLane)
  panel.appendChild(advanceBtn)
}

function buildArsenalPanel(parent: HTMLElement): void {
  const panel = el('section', 'arsenal-panel')
  arsenalHeader = el('span', 'arsenal-header')
  arsenalSummary = el('div', 'arsenal-summary')
  arsenalList = el('div', 'arsenal-grid')
  panel.append(arsenalHeader, arsenalSummary, arsenalList)
  parent.appendChild(panel)
  refreshArsenalUI()
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

  // Waters jumps
  const laneRow = el('div', 'debug-row')
  laneRow.appendChild(el('span', '', 'Waters:'))
  for (const lid of ['lane_01', 'lane_02']) {
    const label = Definitions.getLane(lid)?.['display_name']?.split(' ')[0] ?? lid.replace('lane_0', 'W')
    const b = btn(label, 'sz-13')
    b.addEventListener('click', () => debugJumpLane(lid))
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
  sim.onEnemyDamaged       = onEnemyDamaged
  sim.onEnemyDefeated      = (def, rewards, isLastInSquad) => onEnemyDefeated(def, rewards, isLastInSquad)
  sim.onPlayerDamaged      = onPlayerDamaged
  sim.onPlayerHullRestored = onPlayerHullRestored
  sim.onPlayerFled         = onPlayerFled
  sim.onBossSpawned        = onBossSpawned
  sim.onBossDefeated       = onBossDefeated
  sim.onWaveCompleted      = onWaveCompleted
  sim.onLaneCompleted      = onLaneCompleted
  sim.onCombatLog          = (msg) => appendLog(msg)
  sim.onCounterHint        = onCounterHint

  GameState.on('resource_changed',  (id, amount) => onResourceChanged(id as string, amount as number))
  GameState.on('player_hull_changed', (hull, maxHull) => updatePlayerHullUI(hull as number, maxHull as number))
  GameState.on('route_changed', () => {
    refreshRouteUI()
    refreshFleetTrack()
  })
  GameState.on('upgrade_purchased', () => {
    refreshArsenalUI()
    refreshCombatPowerVisuals()
  })
  GameState.on('lane_unlocked',     (id) => {
    const name = Definitions.getLane(id as string)?.['display_name'] ?? id
    appendLog(`<span class="log-teal">Waters charted: ${name}</span>`)
  })
}

// ── Sim handlers ──────────────────────────────────────────────────────────────
function onEnemySpawned(def: AnyDef, maxHull: number, isSquadMember: boolean): void {
  currentLaneId = GameState.getCurrentLane()
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
    refreshFleetTrack()
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

function onEnemyDamaged(hull: number, maxHull: number, dmg: number, evaded: boolean): void {
  currentEnemyHull = hull
  currentEnemyMaxHull = maxHull
  setHpBar(enemyHpFill, enemyHpLabel, hull, maxHull, 'red')
  updateCurrentSeaContactHp(hull, maxHull)
  vfxShootAndHit(dmg, evaded)
  if (evaded) appendLog('<span class="log-silver">— Evaded!</span>')
}

function onEnemyDefeated(_def: AnyDef, _rewards: Record<string, number>, isLastInSquad: boolean): void {
  enemyHpFill.style.width = '0%'
  enemyHpLabel.textContent = '0 / ?'
  if (isLastInSquad) {
    sinkCurrentSeaContact()
  }
  sinkNextFleetContact()
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
  refreshFleetTrack()
}

function onBossSpawned(def: AnyDef, maxHull: number): void {
  onEnemySpawned(def, maxHull, false)
  combatRow.classList.add('is-boss-fight')
  bossBanner.classList.remove('hidden')
  waveLabel.textContent = 'Flagship contact'
  refreshFleetTrack()
  refreshSeaContacts(def, maxHull, maxHull)
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

function onWaveCompleted(waveIndex: number): void {
  waveLabel.textContent = `${Math.floor(GameState.getRouteDistance())} nmi`
  refreshFleetTrack()
  refreshSeaContacts()
  void waveIndex
}

function onLaneCompleted(laneId: string, nextId: string): void {
  nextLaneId            = nextId
  laneCleared           = true
  startVisualWave(true)
  combatRow.classList.remove('is-boss-fight')
  waveLabel.textContent = 'Waters Clear'
  bossBanner.classList.add('hidden')
  refreshFleetTrack()
  refreshSeaContacts()
  if (nextId && !GameState.isAutoProgress()) {
    const nextLaneName = Definitions.getLane(nextId)?.['display_name'] ?? nextId
    advanceBtn.textContent = `▶  CHART COURSE TO ${nextLaneName.toUpperCase()}`
    advanceBtn.classList.remove('hidden')
    appendLog('<span class="log-green">Waters cleared. New course plotted.</span>')
  } else if (nextId) {
    advanceBtn.classList.add('hidden')
    appendLog('<span class="log-green">Waters cleared. Auto course continuing.</span>')
  } else {
    advanceBtn.classList.add('hidden')
    appendLog('<span class="log-green">Waters cleared!</span>')
  }
  // suppress unused-param warning — laneId not needed here
  void laneId
}

function onCounterHint(hint: string): void {
  counterHint.textContent = `⚠ ${hint}`
  counterHint.classList.remove('hidden')
}

// ── GameState handlers ────────────────────────────────────────────────────────
function onResourceChanged(id: string, amount: number): void {
  if (id === 'salvage')   { salvageLabel.textContent   = Balance.formatNumber(amount); refreshArsenalUI() }
  if (id === 'doubloons') { doubloonsLabel.textContent = Balance.formatNumber(amount) }
}

// ── Arsenal ───────────────────────────────────────────────────────────────────
function onBuyUpgrade(upg: AnyDef): void {
  const upgradeId = upg['id'] ?? ''
  const level     = GameState.getUpgradeLevel(upgradeId)
  const maxLevel  = upg['max_level'] ?? 10
  if (level >= maxLevel) {
    appendLog(`${upg['display_name'] ?? 'Upgrade'} already at max level.`)
    return
  }

  const cost       = Balance.upgradeCost(upg['base_cost'] ?? 50, upg['cost_scale'] ?? 2, level)
  const resourceId = upg['cost_resource'] ?? 'salvage'
  if (!GameState.canAfford(resourceId, cost)) {
    appendLog(`Need ${Balance.formatNumber(cost)} ${formatResourceName(resourceId)}`)
    return
  }

  GameState.spendResource(resourceId, cost)
  GameState.setUpgradeLevel(upgradeId, level + 1)
  appendLog(`<span class="log-gold">${upg['display_name'] ?? 'Upgrade'} Lv.${level + 1}!</span>`)
}

function refreshArsenalUI(): void {
  const weaponId = getPlayerWeaponId()
  if (weaponId !== arsenalWeaponId) {
    rebuildArsenalCards(weaponId)
  }

  const weapon = Definitions.getWeapon(weaponId)
  for (const refs of arsenalCards) refreshUpgradeCard(refs, weapon)
  refreshCombatPowerVisuals()
}

function rebuildArsenalCards(weaponId: string): void {
  arsenalWeaponId = weaponId
  arsenalCards = []
  arsenalList.innerHTML = ''

  const weapon = Definitions.getWeapon(weaponId)
  const ship = Definitions.getShip('starter_ship')
  arsenalHeader.textContent = 'ARSENAL'
  buildLoadoutSummary(ship, weapon)

  const upgrades = Definitions.getUpgradesForWeapon(weaponId)
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

    const button = btn('BUY UPGRADE', 'btn-lg sz-15') as HTMLButtonElement
    button.addEventListener('click', () => onBuyUpgrade(upgrade))
    card.appendChild(button)

    const refs = { upgrade, level, desc, cost, progress, button }
    arsenalCards.push(refs)
    arsenalList.appendChild(card)
  }
}

function buildLoadoutSummary(ship: AnyDef | undefined, weapon: AnyDef | undefined): void {
  arsenalSummary.innerHTML = ''

  const shipSlot = el('div', 'loadout-slot loadout-ship')
  shipSlot.appendChild(el('span', 'loadout-kicker', 'SHIP'))
  shipSlot.appendChild(el('span', 'loadout-name', ship?.['display_name'] ?? 'Starter Ship'))
  shipSlot.appendChild(el('span', 'loadout-stat', `${Balance.formatNumber(ship?.['hull'] ?? 0)} hull`))

  const weaponSlot = el('div', 'loadout-slot loadout-weapon')
  weaponSlot.appendChild(el('span', 'loadout-kicker', 'WEAPON CORE'))
  weaponSlot.appendChild(el('span', 'loadout-name', weapon?.['display_name'] ?? 'Unfitted'))
  weaponSlot.appendChild(el('span', 'loadout-stat', `${Balance.formatNumber(weapon?.['base_damage'] ?? 0)} base damage`))

  const counterSlot = el('div', 'loadout-slot loadout-counter')
  counterSlot.appendChild(el('span', 'loadout-kicker', 'COUNTERS'))
  const strong = (weapon?.['strong_vs'] as string[] | undefined)?.join(', ') ?? 'general'
  const weak = (weapon?.['weak_vs'] as string[] | undefined)?.join(', ') ?? 'none'
  counterSlot.appendChild(el('span', 'loadout-name', strong))
  counterSlot.appendChild(el('span', 'loadout-stat', `Weak vs ${weak}`))

  arsenalSummary.append(shipSlot, weaponSlot, counterSlot)
}

function refreshUpgradeCard(refs: ArsenalCardRefs, weapon: AnyDef | undefined): void {
  const upg        = refs.upgrade
  const upgradeId  = upg['id'] ?? ''
  const level      = GameState.getUpgradeLevel(upgradeId)
  const maxLevel   = upg['max_level'] ?? 10
  const cost       = Balance.upgradeCost(upg['base_cost'] ?? 50, upg['cost_scale'] ?? 2, level)
  const resourceId = upg['cost_resource'] ?? 'salvage'
  const base       = weapon?.['base_damage'] ?? 10
  const scale      = weapon?.['damage_scale_per_level'] ?? 0.2
  const currentDmg = Balance.weaponDamage(base, scale, level)
  const nextDmg    = Balance.weaponDamage(base, scale, Math.min(level + 1, maxLevel))
  const desc       = upg['description'] ?? upg['effect_note'] ?? ''

  refs.level.textContent = `Lv. ${level}/${maxLevel}`
  refs.progress.style.width = `${Math.min(100, (level / maxLevel) * 100)}%`
  refs.desc.textContent  = level >= maxLevel
    ? `${desc} Current: ${currentDmg.toFixed(1)} dmg/shot.`
    : `${desc} Current: ${currentDmg.toFixed(1)} -> ${nextDmg.toFixed(1)} dmg/shot.`

  if (level >= maxLevel) {
    refs.cost.textContent = 'MAXED'
    refs.button.disabled  = true
    refs.button.textContent = 'MAXED'
  } else {
    refs.cost.textContent = `Cost: ${Balance.formatNumber(cost)} ${formatResourceName(resourceId)}`
    refs.button.disabled  = !GameState.canAfford(resourceId, cost)
    refs.button.textContent = 'BUY UPGRADE'
  }
}

// ── Course / distance progress ────────────────────────────────────────────────
function onAdvanceLane(): void {
  if (!nextLaneId || !GameState.isLaneUnlocked(nextLaneId)) return
  advanceBtn.classList.add('hidden')
  laneCleared = false
  currentLaneId = nextLaneId
  nextLaneId    = ''
  GameState.setCurrentLane(currentLaneId)
  refreshLaneLabel()
  sim.startCombat()
}

function refreshLaneLabel(): void {
  refreshWatersTitle()
  refreshRouteUI()
  refreshFleetTrack()
  refreshSeaContacts()
}

function refreshWatersTitle(): void {
  const laneDef = Definitions.getLane(currentLaneId)
  const region = laneDef?.['region'] as string | undefined
  const name = laneDef?.['display_name'] ?? currentLaneId
  laneLabel.textContent = region ? `${region} / ${name}` : name
}

function refreshRouteUI(): void {
  if (!routeDistanceLabel || !routeMeterFill) return
  const distance = GameState.getRouteDistance()
  const goal = GameState.getRouteDistanceGoal()
  const pct = goal > 0 ? Math.max(0, Math.min(100, (distance / goal) * 100)) : 0
  const mode = GameState.getCourseMode()
  const auto = GameState.isAutoProgress()

  routeMeterFill.style.width = `${pct}%`
  routeDistanceLabel.textContent = `${Math.floor(distance)} / ${Math.floor(goal)} nmi`
  waveLabel.textContent = GameState.isBossPhase()
    ? 'Flagship contact'
    : mode === 'hold'
      ? 'Holding position'
      : mode === 'retreat'
        ? 'Falling back'
        : `${Math.floor(distance)} nmi`

  autoProgressBtn.textContent = auto ? 'AUTO ON' : 'AUTO OFF'
  autoProgressBtn.classList.toggle('is-active', auto)
  courseForwardBtn.classList.toggle('is-active', mode === 'forward')
  courseHoldBtn.classList.toggle('is-active', mode === 'hold')
  courseRetreatBtn.classList.toggle('is-active', mode === 'retreat')
}

function refreshFleetTrack(): void {
  if (!fleetTrack) return

  const laneDef = Definitions.getLane(currentLaneId)
  const distance = GameState.getRouteDistance()
  const goal = GameState.getRouteDistanceGoal()
  const bossActive = GameState.isBossPhase()
  fleetTrack.innerHTML = ''

  for (let index = 1; index <= 4; index++) {
    const previousMilestone = Math.round((goal * (index - 1)) / 5)
    const milestone = Math.round((goal * index) / 5)
    const marker = buildFleetMarker(
      `${milestone}`,
      `${milestone} nmi`,
      laneCleared || distance >= milestone,
      !laneCleared && !bossActive && distance >= previousMilestone && distance < milestone,
      false,
    )
    fleetTrack.appendChild(marker)
  }

  const boss = laneDef?.['boss'] as AnyDef | undefined
  if (boss) {
    const bossMarker = buildFleetMarker(
      'BOSS',
      boss['display_name'] ?? 'Boss',
      laneCleared,
      !laneCleared && bossActive,
      true,
    )
    if (!laneCleared && !bossActive && distance < goal) bossMarker.classList.add('is-locked')
    fleetTrack.appendChild(bossMarker)
  }
}

function buildFleetMarker(label: string, name: string, cleared: boolean, current: boolean, boss: boolean): HTMLElement {
  const marker = el('div', 'fleet-marker')
  if (cleared) marker.classList.add('is-cleared')
  if (current) marker.classList.add('is-current')
  if (boss) marker.classList.add('is-boss')
  marker.title = name

  marker.appendChild(el('span', 'fleet-dot'))
  const textWrap = el('span', 'fleet-text')
  textWrap.appendChild(el('span', 'fleet-label', label))
  textWrap.appendChild(el('span', 'fleet-name', name))
  marker.appendChild(textWrap)
  return marker
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
  titleFocusBtn.textContent = collapsed ? 'OPEN DESK' : 'SEA FOCUS'
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

  const laneDef = Definitions.getLane(currentLaneId)
  const waves = (laneDef?.['wave_enemies'] as string[] | undefined) ?? []
  const distanceBand = Math.floor(GameState.getRouteDistance() / CONTACT_DISTANCE_STEP)
  const bossActive = GameState.isBossPhase()
  const bossDef = laneDef?.['boss'] as AnyDef | undefined
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
      escortContact(PORT_WAVE_SLOTS[1], 1, 'Port escort'),
    ])
    appendSeaWaveGroup('Starboard Escort', 'is-starboard-wave', [
      escortContact(BOSS_ESCORT_SLOTS[1], 1, 'Starboard escort'),
      escortContact(STARBOARD_WAVE_SLOTS[1], 2, 'Starboard escort'),
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
      escortContact(BOSS_ESCORT_SLOTS[2], 2, 'Forward escort'),
      escortContact(BOSS_ESCORT_SLOTS[3], 3, 'Forward escort'),
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
    })))

    appendSeaWaveGroup('Starboard Cutters', 'is-starboard-wave', STARBOARD_WAVE_SLOTS.map((slot, index) => ({
      slot,
      def: waveEnemyDef(index <= 1 ? 1 : 0),
      status: (index <= 1 ? 'escort' : 'incoming') as SeaContactStatus,
      caption: 'Starboard fleet',
    })))
  }

  const incomingIds = waves.length === 0
    ? []
    : [waves[(distanceBand + 1) % waves.length], waves[(distanceBand + 2) % waves.length]]
  const horizonContacts: SeaWaveContact[] = HORIZON_WAVE_SLOTS.map((slot, index) => {
    const id = incomingIds[index % Math.max(1, incomingIds.length)] ?? waves[distanceBand % Math.max(1, waves.length)]
    return {
      slot,
      def: Definitions.getEnemy(id),
      status: 'incoming' as SeaContactStatus,
      caption: 'Closing fleet',
    }
  })

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

function appendSeaWaveGroup(label: string, className: string, contacts: SeaWaveContact[]): void {
  const validContacts = contacts.filter(contact => contact.def)
  if (validContacts.length === 0) return

  const group = el('div', `fleet-wave ${className}`)
  group.appendChild(el('span', 'fleet-wave-label', label))
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
    contact.classList.add('is-sinking')
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

function applyContactDamage(contact: HTMLElement, amount: number): boolean {
  const state = getContactState(contact)
  if (!state || state.hull <= 0) return false
  setContactHp(contact, state.hull - amount, state.maxHull)
  if (state.hull <= 0) {
    contact.classList.add('is-sinking')
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

function sinkNextFleetContact(): void {
  const fleetSelectors = [
    '.fleet-wave.is-port-wave .sea-contact:not(.is-sinking)',
    '.fleet-wave.is-starboard-wave .sea-contact:not(.is-sinking)',
    '.fleet-wave.is-horizon-wave .sea-contact:not(.is-sinking)',
  ]
  const sel = fleetSelectors[GameState.getWaveIndex() % fleetSelectors.length]
  const contact = seaContactLayer?.querySelector(sel)
  if (contact instanceof HTMLElement) {
    const state = getContactState(contact)
    setContactHp(contact, 0, state?.maxHull ?? 1)
  }
}

function getPlayerWeaponId(): string {
  return Definitions.getShip('starter_ship')?.['weapon_id'] ?? 'long_nine_cannons'
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
function debugJumpLane(laneId: string): void {
  advanceBtn.classList.add('hidden')
  laneCleared = false
  playerFleeing = false
  currentLaneId = laneId
  nextLaneId    = ''
  if (!GameState.isLaneUnlocked(laneId)) GameState.persistent.unlocked_lanes.push(laneId)
  GameState.setCurrentLane(laneId)
  refreshLaneLabel()
  sim.startCombat()
  appendLog(`<span class="log-silver">DEBUG: charted to ${laneId}</span>`)
}

function debugLoad(): void {
  SaveSystem.loadGame()
  laneCleared = false
  playerFleeing = false
  currentLaneId = GameState.getCurrentLane()
  refreshLaneLabel()
  refreshAllResources()
  refreshArsenalUI()
  sim.restoreCombatState()
  appendLog('<span class="log-teal">Game loaded.</span>')
}

// ── Full refresh ──────────────────────────────────────────────────────────────
export function refreshAll(): void {
  laneCleared = false
  playerFleeing = false
  currentLaneId = GameState.getCurrentLane()
  refreshLaneLabel()
  refreshAllResources()
  refreshArsenalUI()
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
  if (now - visualWaveStartedAt >= VISUAL_WAVE_INTERVAL_MS) {
    startVisualWave(true)
    refreshSeaContacts()
    return
  }

  const contacts = getVisibleEnemyContacts('.sea-contact:not(.is-sinking)')
  for (const contact of contacts) {
    const state = getContactState(contact)
    if (!state || state.hull <= 0 || now < state.nextFireAt) continue
    state.nextFireAt = now + contactFireDelayMsFromElement(contact) * (0.85 + Math.random() * 0.45)
    spawnEnemyProjectileFrom(contact, () => applyFleetContactDamageToPlayer(contact))
  }
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
function vfxShootAndHit(damage: number, evaded: boolean): void {
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
  const volleyCount = Math.min(5, 1 + Math.floor((level + 1) / 2))
  const visualFleetDamage = Math.max(8, Math.round((damage > 0 ? damage : (weapon?.['base_damage'] ?? 8)) * 0.95))
  let hitTriggered = false

  spawnMuzzleSmoke(volleyCount, level)
  for (let index = 0; index < volleyCount; index++) {
    const target = pickPlayerVolleyTarget(index)
    const isPrimaryHit = target === getCurrentSeaTarget()
    spawnProjectile(projColor, level, index, volleyCount, target, () => {
      flashTarget(target, '#ffffff', isBoss ? '#F2B134' : '#E0443E', 150)
      spawnImpactSplash(target, projColor, level)
      if (!isPrimaryHit) applyContactDamage(target, visualFleetDamage)
      if (!isPrimaryHit || hitTriggered) return
      hitTriggered = true
      spawnDamageNumber(target, damage, evaded, isBoss)
    })
  }
  spawnSuppressionVolley(projColor, level, Math.max(5, Math.round(visualFleetDamage * 0.82)))
  playerShotCursor += volleyCount + 1
}

function spawnSuppressionVolley(color: string, powerLevel: number, visualDamage: number): void {
  const escorts = getVisibleEnemyContacts('.sea-contact:not(.is-current):not(.is-boss):not(.is-sinking)')
  const count = Math.min(2, escorts.length)
  for (let index = 0; index < count; index++) {
    const target = escorts[(playerShotCursor + index) % escorts.length]
    if (!target) continue
    spawnProjectile(color, Math.max(0, powerLevel - 1), index + 1, count + 2, target, () => {
      flashTarget(target, color, color, 120)
      spawnImpactSplash(target, color, Math.max(0, powerLevel - 1), true)
      applyContactDamage(target, visualDamage)
    }, true)
  }
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
  if (logLines.length > LOG_MAX) logLines.shift()
  combatLog.innerHTML = logLines.map(l => `<p>${l}</p>`).join('')
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
