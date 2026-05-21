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
let laneLabel:       HTMLElement
let waveLabel:       HTMLElement
let bossBanner:      HTMLElement
let fleetTrack:      HTMLElement
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
let debugOverlay:    HTMLElement

let currentLaneId = 'lane_01'
let nextLaneId    = ''
let laneCleared   = false
const LOG_MAX     = 8
const logLines: string[] = []

// ── Entry point ───────────────────────────────────────────────────────────────
export function init(container: HTMLElement): void {
  buildUI(container)
  connectSignals()
}

// ── UI construction (mirrors Main.gd _build_ui) ───────────────────────────────
function buildUI(root: HTMLElement): void {
  root.classList.add('ub-shell')
  buildSeaLanePanel(root)
  buildStatusStrip(root)
  buildBottomPanel(root)
  buildDebugOverlay(root)
  refreshLaneLabel()
  refreshFleetTrack()
}

function buildSeaLanePanel(root: HTMLElement): void {
  const panel = el('div', 'panel-ocean')
  root.appendChild(panel)

  // Title row
  const titleRow = el('div', 'lane-title-row')
  laneLabel  = el('span', 'lane-label')
  waveLabel  = el('span', 'wave-label')
  bossBanner = el('span', 'boss-banner hidden', 'BOSS')
  titleRow.append(laneLabel, waveLabel, bossBanner)
  panel.appendChild(titleRow)

  // Combat row (positioned container for VFX projectiles)
  combatRow = el('div', 'combat-row')
  panel.appendChild(combatRow)

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

function buildPlayerBlock(parent: HTMLElement): void {
  const ship = Definitions.getShip('starter_ship')
  const block = el('div', 'ship-block ship-block-player')
  block.appendChild(el('span', 'sz-11 bold c-teal', 'PLAYER'))
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

  advanceBtn = btn('▶  ADVANCE TO NEXT LANE', 'btn-advance sz-16 c-gold') as HTMLButtonElement
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

  // Lane jumps
  const laneRow = el('div', 'debug-row')
  laneRow.appendChild(el('span', '', 'Lane:'))
  for (const lid of ['lane_01', 'lane_02']) {
    const label = lid.replace('lane_0', 'L')
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
  sim.onEnemySpawned       = onEnemySpawned
  sim.onEnemyDamaged       = onEnemyDamaged
  sim.onEnemyDefeated      = onEnemyDefeated
  sim.onPlayerDamaged      = onPlayerDamaged
  sim.onPlayerHullRestored = onPlayerHullRestored
  sim.onBossSpawned        = onBossSpawned
  sim.onBossDefeated       = onBossDefeated
  sim.onWaveCompleted      = onWaveCompleted
  sim.onLaneCompleted      = onLaneCompleted
  sim.onCombatLog          = (msg) => appendLog(msg)
  sim.onCounterHint        = onCounterHint

  GameState.on('resource_changed',  (id, amount) => onResourceChanged(id as string, amount as number))
  GameState.on('upgrade_purchased', () => refreshArsenalUI())
  GameState.on('lane_unlocked',     (id) => appendLog(`<span class="log-teal">Unlocked: ${id}</span>`))
}

// ── Sim handlers ──────────────────────────────────────────────────────────────
function onEnemySpawned(def: AnyDef, maxHull: number): void {
  laneCleared = false
  enemyName.textContent   = def['display_name'] ?? '?'
  enemyFamily.textContent = def['family']        ?? '?'
  setHpBar(enemyHpFill, enemyHpLabel, maxHull, maxHull, 'red')
  refreshFleetTrack()
  counterHint.classList.add('hidden')
  bossBanner.classList.add('hidden')
  enemyName.style.color = ''
  enemyRect.classList.remove('ship-rect-boss')
  enemyRect.classList.add('ship-rect-enemy')
  flashRect(enemyRect, '#333', getComputedStyle(document.documentElement).getPropertyValue('--red').trim(), 250)
}

function onEnemyDamaged(hull: number, maxHull: number, dmg: number, evaded: boolean): void {
  setHpBar(enemyHpFill, enemyHpLabel, hull, maxHull, 'red')
  vfxShootAndHit(dmg, evaded)
  if (evaded) appendLog('<span class="log-silver">— Evaded!</span>')
}

function onEnemyDefeated(_def: AnyDef, _rewards: Record<string, number>): void {
  enemyHpFill.style.width = '0%'
  enemyHpLabel.textContent = '0 / ?'
}

function onPlayerDamaged(hull: number, maxHull: number, _dmg: number): void {
  const ratio = hull / maxHull
  const fillClass = ratio < 0.25 ? 'red' : ratio < 0.5 ? 'orange' : 'green'
  setHpBar(playerHpFill, playerHpLabel, hull, maxHull, fillClass)
  flashRect(playerRect, 'rgba(224,68,62,0.8)', '#22A6A1', 180)
}

function onPlayerHullRestored(hull: number, maxHull: number): void {
  setHpBar(playerHpFill, playerHpLabel, hull, maxHull, 'green')
}

function onBossSpawned(def: AnyDef, maxHull: number): void {
  onEnemySpawned(def, maxHull)
  bossBanner.classList.remove('hidden')
  waveLabel.textContent = 'Final'
  refreshFleetTrack()
  enemyName.style.color = '#F2B134'
  enemyRect.classList.remove('ship-rect-enemy')
  enemyRect.classList.add('ship-rect-boss')
  appendLog('<span class="log-gold">⚔ Boss phase!</span>')
}

function onBossDefeated(_def: AnyDef): void {
  bossBanner.classList.add('hidden')
  enemyName.style.color = ''
}

function onWaveCompleted(waveIndex: number): void {
  const laneDef = Definitions.getLane(currentLaneId)
  const total   = laneDef?.['wave_count'] ?? 3
  waveLabel.textContent = `Wave ${waveIndex + 1}/${total}`
  refreshFleetTrack()
}

function onLaneCompleted(laneId: string, nextId: string): void {
  nextLaneId            = nextId
  laneCleared           = true
  waveLabel.textContent = 'CLEAR!'
  bossBanner.classList.add('hidden')
  refreshFleetTrack()
  if (nextId) {
    const nextLaneName = Definitions.getLane(nextId)?.['display_name'] ?? nextId
    advanceBtn.textContent = `▶  ADVANCE TO ${nextLaneName.toUpperCase()}`
    advanceBtn.classList.remove('hidden')
    appendLog('<span class="log-green">Lane cleared! Advance when ready.</span>')
  } else {
    appendLog('<span class="log-green">Lane cleared!</span>')
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

// ── Lane advance ──────────────────────────────────────────────────────────────
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
  const laneDef = Definitions.getLane(currentLaneId)
  laneLabel.textContent = laneDef?.['display_name'] ?? currentLaneId
  const total           = laneDef?.['wave_count'] ?? 3
  const waveIndex       = Math.min(GameState.getWaveIndex() + 1, total)
  waveLabel.textContent = GameState.isBossPhase() ? 'Final' : `Wave ${waveIndex}/${total}`
  refreshFleetTrack()
}

function refreshFleetTrack(): void {
  if (!fleetTrack) return

  const laneDef = Definitions.getLane(currentLaneId)
  const waves = laneDef?.['wave_enemies'] as string[] | undefined
  const waveEnemies = waves ?? []
  const currentWave = GameState.getWaveIndex()
  const bossActive = GameState.isBossPhase()
  fleetTrack.innerHTML = ''

  for (let index = 0; index < waveEnemies.length; index++) {
    const enemy = Definitions.getEnemy(waveEnemies[index])
    const marker = buildFleetMarker(
      `W${index + 1}`,
      enemy?.['display_name'] ?? waveEnemies[index],
      laneCleared || index < currentWave,
      !laneCleared && index === currentWave && !bossActive,
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
    if (!laneCleared && !bossActive && currentWave < waveEnemies.length) bossMarker.classList.add('is-locked')
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

function getPlayerWeaponId(): string {
  return Definitions.getShip('starter_ship')?.['weapon_id'] ?? 'long_nine_cannons'
}

function formatResourceName(id: string): string {
  return Definitions.getResource(id)?.['display_name'] ?? id
}

// ── Debug helpers ─────────────────────────────────────────────────────────────
function debugJumpLane(laneId: string): void {
  advanceBtn.classList.add('hidden')
  laneCleared = false
  currentLaneId = laneId
  nextLaneId    = ''
  if (!GameState.isLaneUnlocked(laneId)) GameState.persistent.unlocked_lanes.push(laneId)
  GameState.setCurrentLane(laneId)
  refreshLaneLabel()
  sim.startCombat()
  appendLog(`<span class="log-silver">DEBUG: jumped to ${laneId}</span>`)
}

function debugLoad(): void {
  SaveSystem.loadGame()
  laneCleared = false
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
  setHpBar(playerHpFill, playerHpLabel, cur, max, 'green')
}

// ── VFX ───────────────────────────────────────────────────────────────────────
function vfxShootAndHit(damage: number, evaded: boolean): void {
  // Muzzle flash on player
  flashRect(playerRect, 'rgba(255,235,128,1)', '#22A6A1', 80)

  const weapon   = Definitions.getWeapon(
    (Definitions.getShip('starter_ship') as AnyDef)?.['weapon_id'] ?? 'long_nine_cannons'
  )
  const dtype    = weapon?.['damage_type'] ?? 'cannon'
  const colors: Record<string, string> = {
    cannon: '#F2B134', harpoon: '#B96E35', fire: '#E0443E', occult: '#7B4FA3', chain: '#CDD9D9',
  }
  const projColor = colors[dtype] ?? '#F2B134'
  const isBoss    = !bossBanner.classList.contains('hidden')

  spawnProjectile(projColor, () => {
    flashRect(enemyRect, '#ffffff', isBoss ? '#F2B134' : '#E0443E', 150)
    spawnDamageNumber(damage, evaded, isBoss)
  })
}

function spawnProjectile(color: string, onHit: () => void): void {
  const fromRect = playerRect.getBoundingClientRect()
  const toRect   = enemyRect.getBoundingClientRect()
  const base     = combatRow.getBoundingClientRect()

  const startX = fromRect.left + fromRect.width  / 2 - base.left - 6
  const startY = fromRect.top  + fromRect.height / 2 - base.top  - 2
  const endX   = toRect.left   + toRect.width    / 2 - base.left - 6
  const endY   = toRect.top    + toRect.height   / 2 - base.top  - 2

  const proj = document.createElement('div')
  proj.className = 'projectile'
  proj.style.cssText = `background:${color};left:${startX}px;top:${startY}px;`
  combatRow.appendChild(proj)

  // Force layout before transitioning
  proj.getBoundingClientRect()
  proj.style.left = `${endX}px`
  proj.style.top  = `${endY}px`

  setTimeout(() => { proj.remove(); onHit() }, 160)
}

function spawnDamageNumber(damage: number, evaded: boolean, isBoss: boolean): void {
  if (!evaded && damage <= 0) return
  const rect = enemyRect.getBoundingClientRect()
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

function flashRect(rect: HTMLElement, flashColor: string, restoreColor: string, durationMs: number): void {
  const prevFilter = rect.style.filter
  const prevShadow = rect.style.boxShadow
  rect.style.transition       = 'none'
  rect.style.backgroundColor  = ''
  rect.style.filter           = `${prevFilter} brightness(1.55) drop-shadow(0 0 14px ${flashColor})`.trim()
  rect.style.boxShadow        = `0 0 28px ${flashColor}`
  rect.getBoundingClientRect()
  rect.style.transition       = `filter ${durationMs}ms, box-shadow ${durationMs}ms`
  rect.style.filter           = prevFilter
  rect.style.boxShadow        = prevShadow
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
