import { GameState } from './game-state'
import { Definitions } from './definitions'
import { Balance, type DamageType } from './balance'

const TICK_RATE  = 10
const TICK_DELTA = 1 / TICK_RATE

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDef = Record<string, any>

export class Sim {
  private _initialized  = false
  private _running      = false
  private _accumulator  = 0
  private _lastTime     = 0
  private _raf          = 0

  private _enemy:          AnyDef = {}
  private _enemyHull      = 0
  private _enemyMaxHull   = 0
  private _playerFireTimer = 0
  private _enemyFireTimer  = 0
  private _wavesInLane     = 3
  private _wave            = 0
  private _bossActive      = false

  // Mirrors Godot signals as optional callbacks
  onEnemySpawned?:      (def: AnyDef, maxHull: number) => void
  onEnemyDamaged?:      (hull: number, maxHull: number, dmg: number, evaded: boolean) => void
  onEnemyDefeated?:     (def: AnyDef, rewards: Record<string, number>) => void
  onPlayerDamaged?:     (hull: number, maxHull: number, dmg: number) => void
  onPlayerHullRestored?:(hull: number, maxHull: number) => void
  onBossSpawned?:       (def: AnyDef, maxHull: number) => void
  onBossDefeated?:      (def: AnyDef) => void
  onWaveCompleted?:     (waveIndex: number) => void
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
    this._enemy           = {}
    this._enemyHull       = 0
    this._enemyMaxHull    = 0
    this._playerFireTimer = 0
    this._enemyFireTimer  = 0
    this._accumulator     = 0
  }

  private _initCombat(): void {
    const laneId = GameState.getCurrentLane()
    const lane   = Definitions.getLane(laneId)
    if (!lane) { console.error(`Sim: no lane '${laneId}'`); return }
    this._wavesInLane = lane['wave_count'] ?? 3
    this._wave        = GameState.getWaveIndex()
    this._bossActive  = GameState.isBossPhase()
    if (GameState.getPlayerHull() <= 0) GameState.setPlayerHull(GameState.getPlayerMaxHull())
    this._bossActive ? this._spawnBoss(lane) : this._spawnWave(lane)
  }

  private _tick(): void {
    if (!this._enemy['id']) return
    const ship      = Definitions.getShip('starter_ship')
    const weaponId  = ship?.['weapon_id'] ?? 'long_nine_cannons'
    const weapon    = Definitions.getWeapon(weaponId)
    const upgLevel  = this._getUpgradeLevel(weaponId)
    const fireRate  = Balance.weaponFireRate(weapon?.['fire_rate_ticks'] ?? 10)

    this._playerFireTimer++
    if (this._playerFireTimer >= fireRate) {
      this._playerFireTimer -= fireRate
      this._playerFires(weapon, upgLevel)
      if (this._enemyHull <= 0) {
        this._onEnemyDefeated(Definitions.getLane(GameState.getCurrentLane())!)
        return
      }
    }

    this._enemyFireTimer++
    const enemyRate = this._enemy['fire_rate_ticks'] ?? 15
    if (this._enemyFireTimer >= enemyRate) {
      this._enemyFireTimer -= enemyRate
      this._enemyFires(ship)
    }
  }

  private _playerFires(weapon: AnyDef | undefined, upgradeLevel: number): void {
    const base   = weapon?.['base_damage']           ?? 1
    const scale  = weapon?.['damage_scale_per_level'] ?? 0.2
    const baseDmg = Balance.weaponDamage(base, scale, upgradeLevel)
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
    const raw = this._enemy['damage'] ?? 5
    const dmg = Balance.calcPlayerDamageTaken(raw, ship?.['ward_reduction'] ?? 0)
    GameState.setPlayerHull(GameState.getPlayerHull() - dmg)
    this.onPlayerDamaged?.(GameState.getPlayerHull(), GameState.getPlayerMaxHull(), dmg)
    if (GameState.getPlayerHull() <= 0) this._onPlayerDefeated()
  }

  private _onEnemyDefeated(lane: AnyDef): void {
    const rewards: Record<string, number> = this._enemy['rewards'] ?? {}
    for (const [id, amt] of Object.entries(rewards)) GameState.addResource(id, amt as number)
    this.onEnemyDefeated?.(this._enemy, rewards)
    const rewardStr = Object.entries(rewards)
      .map(([id, a]) => `${Balance.formatNumber(a as number)} ${id}`)
      .join(', ')
    this.onCombatLog?.(`${this._enemy['display_name'] ?? 'Enemy'} defeated! +${rewardStr}`)
    if (this._bossActive) { this._onBossCleared(lane); return }
    this._wave++
    GameState.advanceWave()
    this.onWaveCompleted?.(this._wave)
    if (this._wave >= this._wavesInLane) {
      GameState.setBossPhase(true)
      this._bossActive = true
      this._spawnBoss(lane)
    } else {
      this._spawnWave(lane)
    }
  }

  private _onBossCleared(lane: AnyDef): void {
    this.onBossDefeated?.(lane['boss'])
    this.onCombatLog?.(`BOSS defeated: ${lane['boss']?.['display_name'] ?? '?'}!`)
    const next: string = lane['unlocks_lane'] ?? ''
    if (next) { GameState.unlockLane(next); this.onCombatLog?.(`Lane unlocked: ${next}`) }
    this._running = false
    this.onLaneCompleted?.(GameState.getCurrentLane(), next)
  }

  private _onPlayerDefeated(): void {
    this.onCombatLog?.('Ship critically damaged! Rallying crew...')
    GameState.setPlayerHull(GameState.getPlayerMaxHull())
    this.onPlayerHullRestored?.(GameState.getPlayerHull(), GameState.getPlayerMaxHull())
  }

  private _spawnWave(lane: AnyDef): void {
    const waveEnemies: string[] = lane['wave_enemies'] ?? []
    const enemyId = waveEnemies[this._wave % waveEnemies.length]
    const def = Definitions.getEnemy(enemyId)
    if (!def) { console.error(`Sim: no enemy '${enemyId}'`); return }
    this._setEnemy(def)
    this.onCombatLog?.(`Wave ${this._wave + 1}: ${def['display_name'] ?? '?'}`)
    this.onEnemySpawned?.(this._enemy, this._enemyMaxHull)
  }

  private _spawnBoss(lane: AnyDef): void {
    const boss = lane['boss']
    if (!boss) { console.error(`Sim: lane '${lane['id']}' has no boss`); return }
    this._setEnemy(boss)
    this.onCombatLog?.(`BOSS: ${boss['display_name'] ?? '?'} appears!`)
    this.onBossSpawned?.(this._enemy, this._enemyMaxHull)
  }

  private _setEnemy(def: AnyDef): void {
    this._enemy           = def
    this._enemyMaxHull    = def['hull'] ?? 30
    this._enemyHull       = this._enemyMaxHull
    this._playerFireTimer = 0
    this._enemyFireTimer  = 0
  }

  private _getUpgradeLevel(weaponId: string): number {
    const upg = Definitions.getUpgradeForWeapon(weaponId)
    return upg ? GameState.getUpgradeLevel(upg['id'] ?? '') : 0
  }
}

export const sim = new Sim()
