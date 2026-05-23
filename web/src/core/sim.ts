import { GameState } from './game-state'
import { Definitions } from './definitions'
import { Balance, type DamageType } from './balance'
import { SectorPlan } from './sector-plan'
import type { DoctrineMode } from './types'

const TICK_RATE  = 10
const TICK_DELTA = 1 / TICK_RATE
const SHIELD_REGEN_PER_SECOND = 2.2
const FLEE_REGEN_MULTIPLIER = 5
const ENCOUNTER_PAUSE_TICKS = 20  // 2 s between wave encounters
// Enemy closes ~2.8 nmi/sec; a 20 nmi range takes ~7 s to close (matches vanguard CSS travel)
const APPROACH_NMI_PER_TICK = 0.28
// Ship sails 2 nmi/sec = 240 nmi sector clears in ~2 min at 1x speed
const TRAVEL_NMI_PER_TICK = 0.2

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDef = Record<string, any>

interface SimTarget {
  def:       AnyDef
  hull:      number
  maxHull:   number
  scaledDmg: number
  fireTimer: number
}

export class Sim {
  private _initialized  = false
  private _running      = false
  private _accumulator  = 0
  private _lastTime     = 0
  private _raf          = 0

  private _enemy:            AnyDef = {}
  private _enemyHull        = 0
  private _enemyMaxHull     = 0
  private _enemyScaledDmg   = 0
  private _playerFireTimer  = 0
  private _enemyFireTimer   = 0
  private _encounter        = 0
  private _bossActive       = false
  private _fleeing          = false
  // Approach range tracking
  private _combatRange      = 0
  private _maxCombatRange   = 0
  private _playerWeaponRange = 18
  private _enemyWeaponRange  = 16
  // Multi-ship targeting
  private _escorts:     SimTarget[] = []
  private _doctrineShot = 0
  private _encounterPauseTimer = 0

  // Mirrors Godot signals as optional callbacks
  // isSquadMember is kept for old UI compatibility; distance encounters pass false.
  onEnemySpawned?:      (def: AnyDef, maxHull: number, isSquadMember: boolean) => void
  onEnemyApproaching?:  (rangeNmi: number, maxRange: number) => void
  onEnemyDamaged?:      (hull: number, maxHull: number, dmg: number, evaded: boolean) => void
  // isLastInSquad is kept for old UI compatibility; distance encounters pass true.
  onEnemyDefeated?:     (def: AnyDef, rewards: Record<string, number>, isLastInSquad: boolean) => void
  onPlayerDamaged?:     (hull: number, maxHull: number, dmg: number) => void
  onPlayerHullRestored?:(hull: number, maxHull: number) => void
  onPlayerFled?:        (distance: number, goal: number) => void
  onBossSpawned?:       (def: AnyDef, maxHull: number) => void
  onBossDefeated?:      (def: AnyDef) => void
  onWaveCompleted?:     (encounterIndex: number) => void
  onSectorCompleted?:   (sectorId: string, nextSectorId: string) => void
  onCombatLog?:         (msg: string) => void
  onCounterHint?:       (hint: string) => void
  onEscortSpawned?:     (index: number, def: AnyDef, maxHull: number) => void
  onEscortDamaged?:     (index: number, hull: number, maxHull: number, dmg: number, evaded: boolean) => void
  onEscortDefeated?:    (index: number, def: AnyDef, rewards: Record<string, number>) => void

  startCombat(): void {
    cancelAnimationFrame(this._raf)
    this._reset()
    this._initCombat()
    this._initialized = true
    this._running     = true
    this._lastTime    = performance.now()
    this._raf         = requestAnimationFrame(this._loop)
  }

  restoreCombatState(): void { this.startCombat() }
  pauseCombat():  void { this._running = false }
  resumeCombat(): void { if (this._initialized) this._running = true }

  private _loop = (now: number): void => {
    if (!this._initialized) return
    const dt = Math.min((now - this._lastTime) / 1000, 0.5)
    this._lastTime = now
    if (this._running) {
      this._accumulator += dt * GameState.settings.speed_multiplier
      while (this._accumulator >= TICK_DELTA) {
        this._accumulator -= TICK_DELTA
        this._tick()
      }
    }
    this._raf = requestAnimationFrame(this._loop)
  }

  private _reset(): void {
    this._enemy            = {}
    this._enemyHull        = 0
    this._enemyMaxHull     = 0
    this._enemyScaledDmg   = 0
    this._playerFireTimer  = 0
    this._enemyFireTimer   = 0
    this._accumulator      = 0
    this._encounter        = 0
    this._fleeing          = false
    this._combatRange      = 0
    this._maxCombatRange   = 0
    this._escorts             = []
    this._doctrineShot        = 0
    this._encounterPauseTimer = 0
  }

  private _initCombat(): void {
    this._encounter  = GameState.getWaveIndex()
    this._bossActive = GameState.isBossPhase() || GameState.getRouteDistance() >= this._routeGoal()
    if (GameState.getPlayerHull() <= 0) GameState.setPlayerHull(GameState.getPlayerMaxHull())
    GameState.setBossPhase(this._bossActive)
    this._bossActive ? this._spawnBoss() : this._spawnEncounter()
  }

  private _tick(): void {
    GameState.tickAbilities()
    this._processMusterLevels()
    if (this._fleeing) {
      this._processFleeRegen()
      return
    }
    this._regenerateShield()
    this._processRepairAbility()
    if (!this._enemy['id']) {
      if (this._encounterPauseTimer > 0) {
        this._encounterPauseTimer--
        return
      }
      if (GameState.getRouteDistance() >= this._routeGoal()) {
        GameState.setBossPhase(true)
        this._bossActive = true
        this._spawnBoss()
      } else {
        this._spawnEncounter()
      }
      return
    }

    // Continuous travel: ship moves every tick regardless of combat outcome
    const courseMode = GameState.getCourseMode()
    if (GameState.isAutoProgress() && courseMode !== 'hold') {
      const dir = courseMode === 'retreat' ? -1 : 1
      GameState.addRouteDistance(TRAVEL_NMI_PER_TICK * dir)
    }

    if (!this._enemy['id']) return

    // Close approach distance each tick
    if (this._combatRange > 0) {
      this._combatRange = Math.max(0, this._combatRange - APPROACH_NMI_PER_TICK)
      this.onEnemyApproaching?.(this._combatRange, this._maxCombatRange)
    }

    const playerCanFire = this._combatRange <= this._playerWeaponRange
    const enemyCanFire  = this._combatRange <= this._enemyWeaponRange
    if (!playerCanFire && !enemyCanFire) return

    const ship     = Definitions.getShip(GameState.getSelectedShip())
    const weaponId = GameState.getSelectedWeapon()
    const weapon   = Definitions.getWeapon(weaponId)
    const upgLevel = this._getUpgradeLevel(weaponId)
    const fireRate = Balance.weaponFireRate(weapon?.['fire_rate_ticks'] ?? 10) * GameState.abilityFireRateMultiplier()

    if (playerCanFire) {
      this._playerFireTimer++
      if (this._playerFireTimer >= fireRate) {
        this._playerFireTimer -= fireRate
        if (this._playerFires(weapon, upgLevel)) return
      }
    }

    const enemyRate = this._enemy['fire_rate_ticks'] ?? 15
    if (enemyCanFire) {
      this._enemyFireTimer++
      if (this._enemyFireTimer >= enemyRate) {
        this._enemyFireTimer -= enemyRate
        this._enemyFires(ship)
      }

      for (let i = 0; i < this._escorts.length; i++) {
        const escort = this._escorts[i]
        if (escort.hull <= 0) continue
        escort.fireTimer++
        const escortRate = escort.def['fire_rate_ticks'] ?? 15
        if (escort.fireTimer >= escortRate) {
          escort.fireTimer -= escortRate
          const raw = escort.scaledDmg
          const dmg = Balance.calcPlayerDamageTaken(raw, ship?.['ward_reduction'] ?? 0)
          GameState.setPlayerHull(GameState.getPlayerHull() - dmg)
          this.onPlayerDamaged?.(GameState.getPlayerHull(), GameState.getPlayerMaxHull(), dmg)
          if (GameState.getPlayerHull() <= 0) { this._onPlayerDefeated(); return }
        }
      }
    }
  }

  private _playerFires(weapon: AnyDef | undefined, upgradeLevel: number): boolean {
    const base      = weapon?.['base_damage'] ?? 1
    const upgrade   = Definitions.getUpgradeForWeapon(weapon?.['id'] ?? '')
    const increment = Number(upgrade?.['effect_scale'] ?? base * (weapon?.['damage_scale_per_level'] ?? 0.2))
    const gunnery   = GameState.getMusterGunnery()
    const muls      = upgrade ? GameState.getMilestoneMuls(upgrade['id'] ?? '') : []
    const baseDmg   = Balance.weaponDamage(base, increment, upgradeLevel, muls)
      * Balance.gunneryBonus(gunnery)
      * GameState.abilityDamageMultiplier()
    const dtype     = (weapon?.['damage_type'] ?? 'cannon') as DamageType

    const escortIdx = this._pickDoctrineTarget(GameState.getDoctrine())
    if (escortIdx >= 0) {
      const escort = this._escorts[escortIdx]
      if (!escort || escort.hull <= 0) {
        return this._fireAtSelectedTarget(baseDmg, dtype)
      }
      const evasion   = escort.def['evasion'] ?? 0
      const effective = Balance.calcEffectiveDamage(baseDmg, dtype, escort.def)
      const evaded    = evasion > 0 && effective < escort.hull && Math.random() < evasion
      if (!evaded) escort.hull = Math.max(0, escort.hull - effective)
      this.onEscortDamaged?.(escortIdx, escort.hull, escort.maxHull, evaded ? 0 : effective, evaded)
      if (escort.hull <= 0) this._onEscortDefeated(escortIdx)
      return false
    } else {
      return this._fireAtSelectedTarget(baseDmg, dtype)
    }
  }

  private _fireAtSelectedTarget(baseDmg: number, dtype: DamageType): boolean {
    const evasion   = this._enemy['evasion'] ?? 0
    const effective = Balance.calcEffectiveDamage(baseDmg, dtype, this._enemy)
    const evaded    = evasion > 0 && effective < this._enemyHull && Math.random() < evasion
    if (!evaded) this._enemyHull = Math.max(0, this._enemyHull - effective)
    this.onEnemyDamaged?.(this._enemyHull, this._enemyMaxHull, evaded ? 0 : effective, evaded)
    const hint = Balance.getCounterHint(dtype, this._enemy)
    if (hint) this.onCounterHint?.(hint)
    if (this._enemyHull <= 0) { this._onEnemyDefeated(); return true }
    return false
  }

  private _pickDoctrineTarget(doctrine: DoctrineMode): number {
    const activeEscorts = this._escorts.filter(e => e.hull > 0)
    if (activeEscorts.length === 0 || doctrine === 'focus') return -1

    if (doctrine === 'scatter') {
      const pick = Math.floor(Math.random() * (1 + activeEscorts.length))
      if (pick === 0) return -1
      let count = 0
      for (let i = 0; i < this._escorts.length; i++) {
        if (this._escorts[i].hull > 0 && ++count === pick) return i
      }
      return -1
    }

    // suppression: cycle selected target -> escorts -> selected target -> ...
    this._doctrineShot = (this._doctrineShot + 1) % (1 + activeEscorts.length)
    if (this._doctrineShot === 0) return -1
    let count = 0
    for (let i = 0; i < this._escorts.length; i++) {
      if (this._escorts[i].hull > 0 && ++count === this._doctrineShot) return i
    }
    return -1
  }

  private _onEscortDefeated(index: number): void {
    const escort = this._escorts[index]
    if (!escort) return
    const rewards = this._scaleRewards(escort.def['rewards'] ?? { salvage: 10 })
    this.onEscortDefeated?.(index, escort.def, rewards)
    const rewardStr = Object.entries(rewards).map(([id, a]) => `${Balance.formatNumber(a as number)} ${id}`).join(', ')
    this.onCombatLog?.(`${escort.def['display_name'] ?? 'Escort'} sunk! Wreckage visible${rewardStr ? `: ${rewardStr}` : '.'}`)
  }

  private _enemyFires(ship: AnyDef | undefined): void {
    const raw = this._enemyScaledDmg > 0 ? this._enemyScaledDmg : (this._enemy['damage'] ?? 5)
    const dmg = Balance.calcPlayerDamageTaken(raw, ship?.['ward_reduction'] ?? 0)
    GameState.setPlayerHull(GameState.getPlayerHull() - dmg)
    this.onPlayerDamaged?.(GameState.getPlayerHull(), GameState.getPlayerMaxHull(), dmg)
    if (GameState.getPlayerHull() <= 0) this._onPlayerDefeated()
  }

  private _scaleRewards(base: Record<string, number>): Record<string, number> {
    const scalar = Balance.rewardScalar(GameState.getRouteDistance())
    const out: Record<string, number> = {}
    for (const [id, amt] of Object.entries(base)) out[id] = Math.round((amt as number) * scalar)
    return out
  }

  private _onEnemyDefeated(): void {
    this._escorts      = []
    this._doctrineShot = 0
    if (this._bossActive) {
      const rewards = this._scaleRewards(this._enemy['rewards'] ?? {})
      this._awardMusterProgress(true)
      this.onEnemyDefeated?.(this._enemy, rewards, true)
      const rewardStr = Object.entries(rewards).map(([id, a]) => `${Balance.formatNumber(a as number)} ${id}`).join(', ')
      this.onCombatLog?.(`${this._enemy['display_name'] ?? 'Enemy'} defeated! Prize wreckage visible${rewardStr ? `: ${rewardStr}` : '.'}`)
      this._onBossCleared()
      return
    }

    const rewards = this._scaleRewards(this._enemy['rewards'] ?? {})
    this._awardMusterProgress(false)
    this.onEnemyDefeated?.(this._enemy, rewards, true)
    const rewardStr = Object.entries(rewards).map(([id, a]) => `${Balance.formatNumber(a as number)} ${id}`).join(', ')
    this.onCombatLog?.(`${this._enemy['display_name'] ?? 'Enemy'} defeated! Wreckage visible${rewardStr ? `: ${rewardStr}` : '.'}`)

    this._encounter++
    GameState.advanceWave()
    this.onWaveCompleted?.(this._encounter)
    this._enemy            = {}
    this._enemyHull        = 0
    this._encounterPauseTimer = ENCOUNTER_PAUSE_TICKS
  }

  private _onBossCleared(): void {
    const sector = SectorPlan.getSector(GameState.getCurrentSector())
    this.onBossDefeated?.(this._enemy)
    this.onCombatLog?.(`BOSS defeated: ${this._enemy['display_name'] ?? '?'}!`)
    const bossId = this._enemy['id'] ?? ''
    const milestone = bossId ? GameState.recordBossDefeated(bossId) : { firstClear: false, unlocked: [] }
    if (milestone.firstClear) {
      this.onCombatLog?.(`<span class="log-gold">Milestone charted: ${this._enemy['display_name'] ?? 'Boss'} defeated.</span>`)
    }
    GameState.setRouteDistance(this._routeGoal())
    const nextSector = SectorPlan.nextSector(sector.sector)
    const nextId = nextSector > sector.sector ? `sector_${nextSector}` : ''
    this.onSectorCompleted?.(`sector_${sector.sector}`, nextId)
    if (nextId && GameState.isAutoProgress()) {
      GameState.advanceSector()
      this._reset()
      this._initCombat()
      return
    }
    this._running = false
  }

  private _awardMusterProgress(isBoss: boolean): void {
    if (!GameState.isSystemUnlocked('muster')) return
    const progress = Balance.musterProgressReward(this._enemyMaxHull, isBoss)
    GameState.addMusterProgress(progress)
  }

  private _processMusterLevels(): void {
    if (!GameState.isSystemUnlocked('muster')) return
    const result = GameState.processMusterProgress(TICK_DELTA)
    if (result.gunneryLevels === 0 && result.seamanshipLevels === 0) return
    const parts: string[] = []
    if (result.gunneryLevels > 0) parts.push(`Gunnery +${result.gunneryLevels}`)
    if (result.seamanshipLevels > 0) parts.push(`Seamanship +${result.seamanshipLevels}`)
    this.onCombatLog?.(`<span class="log-teal">Muster advanced: ${parts.join(', ')}</span>`)
  }

  private _onPlayerDefeated(): void {
    this.onCombatLog?.('Shield collapsed! Falling back to safer water...')
    this._enemy        = {}
    this._enemyHull    = 0
    this._enemyMaxHull = 0
    this._bossActive   = false
    this._escorts      = []
    this._doctrineShot = 0
    this._fleeing      = true
    GameState.setBossPhase(false)
    GameState.setPlayerHull(1)
    this.onPlayerHullRestored?.(1, GameState.getPlayerMaxHull())
    this.onPlayerFled?.(GameState.getRouteDistance(), this._routeGoal())
  }

  private _processFleeRegen(): void {
    GameState.addRouteDistance(-TRAVEL_NMI_PER_TICK * 4)
    const max    = GameState.getPlayerMaxHull()
    const cur    = GameState.getPlayerHull()
    const healed = Math.min(max, cur + SHIELD_REGEN_PER_SECOND * FLEE_REGEN_MULTIPLIER * TICK_DELTA)
    GameState.setPlayerHull(healed)
    this.onPlayerHullRestored?.(healed, max)
    if (healed >= max) {
      this._fleeing = false
      this._spawnEncounter()
    }
  }

  private _spawnEncounter(): void {
    const sector = GameState.getCurrentSector()
    const def = SectorPlan.enemyForEncounter(sector, this._encounter, GameState.getRouteDistance())
    if (!def) { console.error(`Sim: no enemy for sector '${sector}'`); return }
    this._bossActive   = false
    this._escorts      = []
    this._doctrineShot = 0
    GameState.setBossPhase(false)
    this._setEnemy(def)
    this._spawnEscorts()
    this.onCombatLog?.(`Sector ${sector}, ${Math.floor(GameState.getRouteDistance())} nmi: ${def['display_name'] ?? '?'} sighted`)
    this.onEnemySpawned?.(this._enemy, this._enemyMaxHull, false)
  }

  private _spawnEscorts(): void {
    const sectorDef = SectorPlan.getSector(GameState.getCurrentSector())
    const allIds    = sectorDef.enemyIds
    if (allIds.length < 2) return
    const selectedId = this._enemy['id'] ?? ''
    const escortIds  = allIds.filter(id => id !== selectedId)
    const scalar     = Balance.distanceScalar(GameState.getRouteDistance())
    const count      = Math.min(2, Math.max(1, escortIds.length))
    for (let index = 0; index < count; index++) {
      const escortId = escortIds[index % escortIds.length] ?? allIds[(index + 1) % allIds.length]
      const escortDef = Definitions.getEnemy(escortId)
      if (!escortDef) continue
      const hull = Math.round((escortDef['hull'] ?? 20) * scalar * 0.7)
      const escort: SimTarget = {
        def:       escortDef,
        hull,
        maxHull:   hull,
        scaledDmg: (escortDef['damage'] ?? 3) * scalar * 0.5,
        fireTimer: Math.floor(Math.random() * 5),
      }
      this._escorts.push(escort)
      this.onEscortSpawned?.(index, escortDef, hull)
    }
  }

  private _spawnBoss(): void {
    const sector = SectorPlan.getSector(GameState.getCurrentSector())
    const boss = sector.boss
    if (!boss) { console.error(`Sim: sector '${sector.sector}' has no boss`); return }
    this._setEnemy(boss)
    this.onCombatLog?.(`SECTOR ${sector.sector} BOSS: ${boss['display_name'] ?? '?'} appears!`)
    this.onBossSpawned?.(this._enemy, this._enemyMaxHull)
  }

  private _setEnemy(def: AnyDef): void {
    const scalar           = Balance.distanceScalar(GameState.getRouteDistance())
    this._enemy            = def
    this._enemyMaxHull     = Math.round((def['hull'] ?? 30) * scalar)
    this._enemyHull        = this._enemyMaxHull
    this._enemyScaledDmg   = (def['damage'] ?? 5) * scalar
    this._playerFireTimer  = 0
    this._enemyFireTimer   = 0

    // Set up approach ranges
    const weapon = Definitions.getWeapon(GameState.getSelectedWeapon())
    this._playerWeaponRange = weapon?.['range_nmi'] ?? 18
    this._enemyWeaponRange  = def['range_nmi'] ?? 16
    this._maxCombatRange    = Math.max(this._playerWeaponRange, this._enemyWeaponRange)
    this._combatRange       = this._maxCombatRange
  }

  private _getUpgradeLevel(weaponId: string): number {
    const upg = Definitions.getUpgradeForWeapon(weaponId)
    return upg ? GameState.getUpgradeLevel(upg['id'] ?? '') : 0
  }

  private _routeGoal(): number {
    return GameState.getRouteDistanceGoal()
  }

  private _regenerateShield(): void {
    const cur = GameState.getPlayerHull()
    const max = GameState.getPlayerMaxHull()
    if (cur <= 0 || cur >= max) return
    GameState.setPlayerHull(Math.min(max, cur + SHIELD_REGEN_PER_SECOND * TICK_DELTA))
  }

  private _processRepairAbility(): void {
    if (!GameState.isAbilityActive('repair')) return
    const max = GameState.getPlayerMaxHull()
    const cur = GameState.getPlayerHull()
    if (cur <= 0 || cur >= max) return
    const repairPerTick = max * 0.018
    GameState.setPlayerHull(Math.min(max, cur + repairPerTick))
    this.onPlayerHullRestored?.(GameState.getPlayerHull(), max)
  }
}

export const sim = new Sim()
