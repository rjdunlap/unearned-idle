import type { RunState, PersistentState, Settings } from './types'
import { Definitions } from './definitions'

type Listener = (...args: unknown[]) => void

class Emitter {
  private _map = new Map<string, Listener[]>()

  on(event: string, fn: Listener): void {
    if (!this._map.has(event)) this._map.set(event, [])
    this._map.get(event)!.push(fn)
  }

  emit(event: string, ...args: unknown[]): void {
    this._map.get(event)?.forEach(fn => fn(...args))
  }
}

function defaultRun(): RunState {
  return {
    lane_id: 'lane_01',
    wave_index: 0,
    resources: { salvage: 0, doubloons: 0 },
    upgrade_levels: {},
    combat: { player_hull: 0, boss_phase: false },
    timestamp: Date.now(),
  }
}

function defaultPersistent(): PersistentState {
  return { unlocked_lanes: ['lane_01'], best_lane: 'lane_01' }
}

export const GameState = new class extends Emitter {
  run:        RunState        = defaultRun()
  persistent: PersistentState = defaultPersistent()
  settings:   Settings        = { debug_mode: false, speed_multiplier: 1 }

  initRunState():        void { this.run        = defaultRun() }
  initPersistentState(): void { this.persistent = defaultPersistent() }

  getResource(id: string): number { return this.run.resources[id] ?? 0 }

  addResource(id: string, amount: number): void {
    if (amount <= 0) return
    this.run.resources[id] = (this.run.resources[id] ?? 0) + amount
    this.emit('resource_changed', id, this.run.resources[id])
  }

  spendResource(id: string, amount: number): boolean {
    const cur = this.getResource(id)
    if (cur < amount) return false
    this.run.resources[id] = cur - amount
    this.emit('resource_changed', id, this.run.resources[id])
    return true
  }

  canAfford(id: string, amount: number): boolean { return this.getResource(id) >= amount }

  getUpgradeLevel(id: string): number { return this.run.upgrade_levels[id] ?? 0 }

  setUpgradeLevel(id: string, level: number): void {
    this.run.upgrade_levels[id] = level
    this.emit('upgrade_purchased', id, level)
  }

  getCurrentLane(): string { return this.run.lane_id }

  setCurrentLane(id: string): void {
    this.run.lane_id             = id
    this.run.wave_index          = 0
    this.run.combat.boss_phase   = false
    this.emit('lane_changed', id)
    if (id > this.persistent.best_lane) this.persistent.best_lane = id
  }

  isLaneUnlocked(id: string): boolean { return this.persistent.unlocked_lanes.includes(id) }

  unlockLane(id: string): void {
    if (this.isLaneUnlocked(id)) return
    this.persistent.unlocked_lanes.push(id)
    this.emit('lane_unlocked', id)
  }

  getPlayerHull(): number { return this.run.combat.player_hull }

  setPlayerHull(value: number): void {
    const max = this.getPlayerMaxHull()
    this.run.combat.player_hull = Math.max(0, Math.min(value, max))
    this.emit('player_hull_changed', this.run.combat.player_hull, max)
  }

  getPlayerMaxHull(): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (Definitions.getShip('starter_ship') as any)?.hull ?? 120
  }

  getWaveIndex():               number  { return this.run.wave_index }
  advanceWave():                void    { this.run.wave_index++ }
  isBossPhase():                boolean { return this.run.combat.boss_phase }
  setBossPhase(active: boolean): void   { this.run.combat.boss_phase = active }
}
