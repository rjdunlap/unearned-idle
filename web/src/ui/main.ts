import './styles.css'
import { GameState } from '../core/game-state'
import { sim } from '../core/sim'
import { Definitions } from '../core/definitions'
import { Balance } from '../core/balance'
import { SaveSystem } from '../core/save-system'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDef = Record<string, any>

// ── DOM refs ──────────────────────────────────────────────────────────────────
let laneLabel:       HTMLElement
let waveLabel:       HTMLElement
let bossBanner:      HTMLElement
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
let upgradeNameLbl:  HTMLElement
let upgradeLevelLbl: HTMLElement
let upgradeDescLbl:  HTMLElement
let upgradeCostLbl:  HTMLElement
let upgradeBuyBtn:   HTMLButtonElement
let advanceBtn:      HTMLButtonElement
let debugOverlay:    HTMLElement

let currentLaneId = 'lane_01'
let nextLaneId    = ''
const LOG_MAX     = 8
const logLines: string[] = []

// ── Entry point ───────────────────────────────────────────────────────────────
export function init(container: HTMLElement): void {
  buildUI(container)
  connectSignals()
}

// ── UI construction (mirrors Main.gd _build_ui) ───────────────────────────────
function buildUI(root: HTMLElement): void {
  buildSeaLanePanel(root)
  buildStatusStrip(root)
  buildBottomPanel(root)
  buildDebugOverlay(root)
}

function buildSeaLanePanel(root: HTMLElement): void {
  const panel = el('div', 'panel-ocean')
  panel.style.cssText = 'display:flex;flex-direction:column;gap:6px;min-height:295px;'
  root.appendChild(panel)

  // Title row
  const titleRow = el('div', 'lane-title-row')
  laneLabel  = el('span', 'lane-label', 'Saltglass Shallows')
  waveLabel  = el('span', 'wave-label', 'Wave 1/3')
  bossBanner = el('span', 'boss-banner hidden', '⚔ BOSS')
  titleRow.append(laneLabel, waveLabel, bossBanner)
  panel.appendChild(titleRow)

  // Combat row (positioned container for VFX projectiles)
  combatRow = el('div', 'combat-row')
  panel.appendChild(combatRow)
  buildPlayerBlock(combatRow)
  combatRow.appendChild(el('span', 'vs-label', 'VS'))
  buildEnemyBlock(combatRow)

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
  const block = el('div', 'ship-block')
  block.appendChild(el('span', 'sz-11 bold c-teal', 'PLAYER'))
  playerRect = el('div', 'ship-rect ship-rect-player')
  block.appendChild(playerRect)
  block.appendChild(el('span', 'sz-10 c-silver', 'Saltwind Drifter'))
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
  const block = el('div', 'ship-block')
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
  const arsenalTab = btn('ARSENAL', 'sz-14 c-gold')
  arsenalTab.style.minWidth = '100px'
  arsenalTab.style.height = '44px'
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
  parent.appendChild(el('span', 'arsenal-header', 'ARSENAL — Long Nine Cannons'))

  const card = el('div', 'card')

  const nameRow = el('div', 'card-name-row')
  upgradeNameLbl  = el('span', 'upgrade-name', 'Long Nine: Powder Charge')
  upgradeLevelLbl = el('span', 'upgrade-level', 'Lv. 0')
  nameRow.append(upgradeNameLbl, upgradeLevelLbl)
  card.appendChild(nameRow)

  upgradeDescLbl = el('div', 'upgrade-desc', '+20% cannon dmg/level')
  card.appendChild(upgradeDescLbl)

  upgradeCostLbl = el('div', 'upgrade-cost', 'Cost: 50 Salvage')
  card.appendChild(upgradeCostLbl)

  upgradeBuyBtn = btn('BUY UPGRADE', 'btn-lg sz-15') as HTMLButtonElement
  upgradeBuyBtn.addEventListener('click', onBuyUpgrade)
  card.appendChild(upgradeBuyBtn)

  parent.appendChild(card)
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
  enemyName.textContent   = def['display_name'] ?? '?'
  enemyFamily.textContent = def['family']        ?? '?'
  setHpBar(enemyHpFill, enemyHpLabel, maxHull, maxHull, 'red')
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
  waveLabel.textContent = 'BOSS'
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
}

function onLaneCompleted(laneId: string, nextId: string): void {
  nextLaneId            = nextId
  waveLabel.textContent = 'CLEAR!'
  bossBanner.classList.add('hidden')
  if (nextId) {
    advanceBtn.textContent = `▶  ADVANCE TO ${nextId.replace('lane_0', 'LANE ').toUpperCase()}`
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
function onBuyUpgrade(): void {
  const upg = Definitions.getUpgradeForWeapon('long_nine_cannons')
  if (!upg) return
  const upgradeId = upg['id'] ?? ''
  const level     = GameState.getUpgradeLevel(upgradeId)
  const maxLevel  = upg['max_level'] ?? 10
  if (level >= maxLevel) { appendLog('Long Nine Cannons already at max level.'); return }
  const cost       = Balance.upgradeCost(upg['base_cost'] ?? 50, upg['cost_scale'] ?? 2, level)
  const resourceId = upg['cost_resource'] ?? 'salvage'
  if (!GameState.canAfford(resourceId, cost)) {
    appendLog(`Need ${Balance.formatNumber(cost)} ${resourceId}`)
    return
  }
  GameState.spendResource(resourceId, cost)
  GameState.setUpgradeLevel(upgradeId, level + 1)
  appendLog(`<span class="log-gold">Long Nine upgraded to Lv.${level + 1}!</span>`)
}

function refreshArsenalUI(): void {
  const upg = Definitions.getUpgradeForWeapon('long_nine_cannons')
  if (!upg) return
  const upgradeId  = upg['id'] ?? ''
  const level      = GameState.getUpgradeLevel(upgradeId)
  const maxLevel   = upg['max_level'] ?? 10
  const cost       = Balance.upgradeCost(upg['base_cost'] ?? 50, upg['cost_scale'] ?? 2, level)
  const resourceId = upg['cost_resource'] ?? 'salvage'
  const weapon     = Definitions.getWeapon('long_nine_cannons')
  const dmg        = Balance.weaponDamage(weapon?.['base_damage'] ?? 10, weapon?.['damage_scale_per_level'] ?? 0.2, level)

  upgradeLevelLbl.textContent = `Lv. ${level}`
  upgradeDescLbl.textContent  = `+20% cannon dmg/level  |  Current: ${dmg.toFixed(1)} dmg/shot`

  if (level >= maxLevel) {
    upgradeCostLbl.textContent  = 'MAXED'
    upgradeBuyBtn.disabled      = true
  } else {
    upgradeCostLbl.textContent  = `Cost: ${Balance.formatNumber(cost)} ${resourceId}`
    upgradeBuyBtn.disabled      = !GameState.canAfford(resourceId, cost)
  }
}

// ── Lane advance ──────────────────────────────────────────────────────────────
function onAdvanceLane(): void {
  if (!nextLaneId || !GameState.isLaneUnlocked(nextLaneId)) return
  advanceBtn.classList.add('hidden')
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
  waveLabel.textContent = `Wave 1/${total}`
}

// ── Debug helpers ─────────────────────────────────────────────────────────────
function debugJumpLane(laneId: string): void {
  advanceBtn.classList.add('hidden')
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
  currentLaneId = GameState.getCurrentLane()
  refreshLaneLabel()
  refreshAllResources()
  refreshArsenalUI()
  sim.restoreCombatState()
  appendLog('<span class="log-teal">Game loaded.</span>')
}

// ── Full refresh ──────────────────────────────────────────────────────────────
export function refreshAll(): void {
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
  rect.style.transition       = 'none'
  rect.style.backgroundColor  = flashColor
  rect.getBoundingClientRect()
  rect.style.transition       = `background-color ${durationMs}ms`
  rect.style.backgroundColor  = restoreColor
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
