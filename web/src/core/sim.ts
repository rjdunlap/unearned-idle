import { GameState } from './game-state'
import { Definitions } from './definitions'
import { Balance, type DamageType } from './balance'

const TICK_RATE  = 10
const TICK_DELTA = 1 / TICK_RATE
const ENCOUNTER_DISTANCE = 30
const RETREAT_DISTANCE = 45
const FLEE_RECOVERY_SECONDS = 2.4
const SHIELD_REGEN_PER_SECOND = 2.2
// Enemy closes ~2.8 nmi/sec; a 20 nmi range takes ~7 s to close (matches vanguard CSS travel)
const APPROACH_NMI_PER_TICK = 0.28

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDef = Record<string, any>

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
  private _recoveryTicks    = 0
  // Approach range tracking
  private _combatRange      = 0
  private _maxCombatRange   = 0
  private _playerWeaponRange = 18
  private _enemyWeaponRange  = 16

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
  onLaneCompleted?:     (laneId: string, nextLaneId: string) => void
  onCombatLog?:         (msg: string) => void
  onCounterHint?:       (hint: string) => void

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
    this._recoveryTicks    = 0
    this._combatRange      = 0
    this._maxCombatRange   = 0
  }

  private _initCombat(): void {
    const laneId = GameState.getCurrentLane()
    const lane   = Definitions.getLane(laneId)
    if (!lane) { console.error(`Sim: no lane '${laneId}'`); return }
    this._encounter  = GameState.getWaveIndex()
    this._bossActive = GameState.isBossPhase() || GameState.getRouteDistance() >= this._routeGoal(lane)
    if (GameState.getPlayerHull() <= 0) GameState.setPlayerHull(GameState.getPlayerMaxHull())
    GameState.setBossPhase(this._bossActive)
    this._bossActive ? this._spawnBoss(lane) : this._spawnEncounter(lane)
  }

  private _tick(): void {
    this._regenerateShield()
    if (this._recoveryTicks > 0) {
      this._recoveryTicks--
      if (this._recoveryTicks <= 0) {
        const lane = Definitions.getLane(GameState.getCurrentLane())
        if (lane) this._spawnEncounter(lane)
      }
      return
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

    const ship     = Definitions.getShip('starter_ship')
    const weaponId = ship?.['weapon_id'] ?? 'long_nine_cannons'
    const weapon   = Definitions.getWeapon(weaponId)
    const upgLevel = this._getUpgradeLevel(weaponId)
    const fireRate = Balance.weaponFireRate(weapon?.['fire_rate_ticks'] ?? 10)

    if (playerCanFire) {
      this._playerFireTimer++
      if (this._playerFireTimer >= fireRate) {
        this._playerFireTimer -= fireRate
        this._playerFires(weapon, upgLevel)
        if (this._enemyHull <= 0) {
          this._onEnemyDefeated(Definitions.getLane(GameState.getCurrentLane())!)
          return
        }
      }
    }

    const enemyRate = this._enemy['fire_rate_ticks'] ?? 15
    if (enemyCanFire) {
      this._enemyFireTimer++
      if (this._enemyFireTimer >= enemyRate) {
        this._enemyFireTimer -= enemyRate
        this._enemyFires(ship)
      }
    }
  }

  private _playerFires(weapon: AnyDef | undefined, upgradeLevel: number): void {
    const base    = weapon?.['base_damage']           ?? 1
    const scale   = weapon?.['damage_scale_per_level'] ?? 0.2
    const gunnery = GameState.getMusterGunnery()
    const baseDmg = Balance.weaponDamage(base, scale, upgradeLevel) * Balance.gunneryBonus(gunnery)
    const dtype   = (weapon?.['damage_type'] ?? 'cannon') as DamageType
    const evasion = this._enemy['evasion'] ?? 0
    const evaded  = evasion > 0 && Math.random() < evasion
    let effective = 0
    if (!evaded) {
      effective = Balance.calcEffectiveDamage(baseDmg, dtype, this._enemy)
      this._enemyHull = Math.max(0, this._enemyHull - effective)
    }
    this.onEnemyDamaged?.(this._enemyHull, this._enemyMaxHull, effective, evaded)
    const hint = Balance.getCounterHint(dtype, this._enemy)
    if (hint) this.onCounterHint?.(hint)
  }

  private _enemyFires(ship: AnyDef | undefined): void {
    const raw        = this._enemyScaledDmg > 0 ? this._enemyScaledDmg : (this._enemy['damage'] ?? 5)
    const seamanship = GameState.getMusterSeamanship()
    const reduction  = Balance.seamanshipReduction(seamanship)
    const dmg        = Balance.calcPlayerDamageTaken(raw, ship?.['ward_reduction'] ?? 0) * (1 - reduction)
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

  private _onEnemyDefeated(lane: AnyDef): void {
    if (this._bossActive) {
      const rewards = this._scaleRewards(this._enemy['rewards'] ?? {})
      for (const [id, amt] of Object.entries(rewards)) GameState.addResource(id, amt)
      this.onEnemyDefeated?.(this._enemy, rewards, true)
      const rewardStr = Object.entries(rewards).map(([id, a]) => `${Balance.formatNumber(a as number)} ${id}`).join(', ')
      this.onCombatLog?.(`${this._enemy['display_name'] ?? 'Enemy'} defeated! +${rewardStr}`)
      this._onBossCleared(lane)
      return
    }

    const rewards = this._scaleRewards(this._enemy['rewards'] ?? {})
    for (const [id, amt] of Object.entries(rewards)) GameState.addResource(id, amt)
    this.onEnemyDefeated?.(this._enemy, rewards, true)
    const rewardStr = Object.entries(rewards).map(([id, a]) => `${Balance.formatNumber(a as number)} ${id}`).join(', ')
    this.onCombatLog?.(`${this._enemy['display_name'] ?? 'Enemy'} defeated! +${rewardStr}`)

    this._encounter++
    GameState.advanceWave()
    this._moveAlongCourse()
    this.onWaveCompleted?.(this._encounter)
    if (GameState.getRouteDistance() >= this._routeGoal(lane)) {
      GameState.setBossPhase(true)
      this._bossActive = true
      this._spawnBoss(lane)
    } else {
      this._spawnEncounter(lane)
    }
  }

  private _onBossCleared(lane: AnyDef): void {
    this.onBossDefeated?.(lane['boss'])
    this.onCombatLog?.(`BOSS defeated: ${lane['boss']?.['display_name'] ?? '?'}!`)
    GameState.setRouteDistance(this._routeGoal(lane))
    const next: string = lane['unlocks_lane'] ?? ''
    if (next) {
      GameState.unlockLane(next)
      const nextName = Definitions.getLane(next)?.['display_name'] ?? next
      this.onCombatLog?.(`Waters charted: ${nextName}`)
    }
    this.onLaneCompleted?.(GameState.getCurrentLane(), next)
    if (next && GameState.isAutoProgress()) {
      GameState.setCurrentLane(next)
      this._reset()
      this._initCombat()
      return
    }
    this._running = false
  }

  private _onPlayerDefeated(): void {
    this.onCombatLog?.('Shield collapsed! Falling back to safer water...')
    this._enemy = {}
    this._enemyHull = 0
    this._enemyMaxHull = 0
    this._bossActive = false
    GameState.setBossPhase(false)
    GameState.addRouteDistance(-RETREAT_DISTANCE)
    GameState.setPlayerHull(GameState.getPlayerMaxHull() * 0.55)
    this.onPlayerHullRestored?.(GameState.getPlayerHull(), GameState.getPlayerMaxHull())
    const lane = Definitions.getLane(GameState.getCurrentLane())
    this.onPlayerFled?.(GameState.getRouteDistance(), lane ? this._routeGoal(lane) : GameState.getRouteDistanceGoal())
    this._recoveryTicks = Math.round(FLEE_RECOVERY_SECONDS * TICK_RATE)
  }

  private _spawnEncounter(lane: AnyDef): void {
    const waveEnemies: string[] = lane['wave_enemies'] ?? []
    const distanceBand = Math.floor(GameState.getRouteDistance() / ENCOUNTER_DISTANCE)
    const enemyId = waveEnemies[(distanceBand + this._encounter) % Math.max(1, waveEnemies.length)]
    const def = Definitions.getEnemy(enemyId)
    if (!def) { console.error(`Sim: no enemy '${enemyId}'`); return }
    this._bossActive = false
    GameState.setBossPhase(false)
    this._setEnemy(def)
    this.onCombatLog?.(`${Math.floor(GameState.getRouteDistance())} nmi: ${def['display_name'] ?? '?'} sighted`)
    this.onEnemySpawned?.(this._enemy, this._enemyMaxHull, false)
  }

  private _spawnBoss(lane: AnyDef): void {
    const boss = lane['boss']
    if (!boss) { console.error(`Sim: lane '${lane['id']}' has no boss`); return }
    this._setEnemy(boss)
    this.onCombatLog?.(`BOSS: ${boss['display_name'] ?? '?'} appears!`)
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
    const ship   = Definitions.getShip('starter_ship')
    const weapon = Definitions.getWeapon(ship?.['weapon_id'] ?? 'long_nine_cannons')
    this._playerWeaponRange = weapon?.['range_nmi'] ?? 18
    this._enemyWeaponRange  = def['range_nmi'] ?? 16
    this._maxCombatRange    = Math.max(this._playerWeaponRange, this._enemyWeaponRange)
    this._combatRange       = this._maxCombatRange
  }

  private _getUpgradeLevel(weaponId: string): number {
    const upg = Definitions.getUpgradeForWeapon(weaponId)
    return upg ? GameState.getUpgradeLevel(upg['id'] ?? '') : 0
  }

  private _moveAlongCourse(): void {
    const mode = GameState.getCourseMode()
    if (!GameState.isAutoProgress() || mode === 'hold') return
    const delta = mode === 'retreat' ? -ENCOUNTER_DISTANCE : ENCOUNTER_DISTANCE
    GameState.addRouteDistance(delta)
  }

  private _routeGoal(lane: AnyDef): number {
    const explicit = Number(lane['distance'] ?? lane['route_distance'] ?? 0)
    if (explicit > 0) return explicit
    return GameState.getRouteDistanceGoal()
  }

  private _regenerateShield(): void {
    const cur = GameState.getPlayerHull()
    const max = GameState.getPlayerMaxHull()
    if (cur <= 0 || cur >= max) return
    GameState.setPlayerHull(Math.min(max, cur + SHIELD_REGEN_PER_SECOND * TICK_DELTA))
  }
}

export const sim = new Sim()
