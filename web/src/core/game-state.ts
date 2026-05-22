import type { CourseMode, RouteState, RunState, PersistentState, Settings } from './types'
import { Definitions } from './definitions'
import { Balance } from './balance'

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

function defaultRoute(): RouteState {
  return {
    distance: 0,
    best_distance: 0,
    auto_progress: true,
    course_mode: 'forward',
  }
}

function defaultRun(): RunState {
  return {
    lane_id: 'lane_01',
    wave_index: 0,
    route: defaultRoute(),
    resources: { salvage: 0, doubloons: 0 },
    upgrade_levels: {},
    combat: { player_hull: 0, boss_phase: false },
    timestamp: Date.now(),
  }
}

function defaultPersistent(): PersistentState {
  return { unlocked_lanes: ['lane_01'], best_lane: 'lane_01', best_distance: 0, muster: { gunnery: 0, seamanship: 0 } }
}

export const MUSTER_CAP = 40

export const GameState = new class extends Emitter {
  run:        RunState        = defaultRun()
  persistent: PersistentState = defaultPersistent()
  settings:   Settings        = { debug_mode: false, speed_multiplier: 1 }

  initRunState():        void { this.run        = defaultRun() }
  initPersistentState(): void { this.persistent = defaultPersistent() }

  private _route(): RouteState {
    if (!this.run.route) this.run.route = defaultRoute()
    return this.run.route
  }

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
    const route = this._route()
    this.run.lane_id             = id
    this.run.wave_index          = 0
    this.run.combat.boss_phase   = false
    route.distance               = 0
    route.best_distance          = 0
    this.emit('lane_changed', id)
    this.emitRouteChanged()
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

  getRouteDistance(): number { return this._route().distance }

  getRouteBestDistance(): number { return this._route().best_distance }

  getRouteDistanceGoal(): number {
    const lane = Definitions.getLane(this.getCurrentLane())
    const explicit = Number(lane?.['distance'] ?? lane?.['route_distance'] ?? 0)
    if (explicit > 0) return explicit
    const fallbackThreats = Number(lane?.['wave_count'] ?? 4)
    return Math.max(180, fallbackThreats * 90)
  }

  setRouteDistance(value: number): void {
    const route = this._route()
    route.distance = Math.max(0, value)
    route.best_distance = Math.max(route.best_distance, route.distance)
    this.persistent.best_distance = Math.max(this.persistent.best_distance ?? 0, route.distance)
    this.emitRouteChanged()
  }

  addRouteDistance(delta: number): void {
    this.setRouteDistance(this.getRouteDistance() + delta)
  }

  getCourseMode(): CourseMode { return this._route().course_mode }

  setCourseMode(mode: CourseMode): void {
    this._route().course_mode = mode
    this.emitRouteChanged()
  }

  isAutoProgress(): boolean { return this._route().auto_progress }

  setAutoProgress(active: boolean): void {
    this._route().auto_progress = active
    this.emitRouteChanged()
  }

  emitRouteChanged(): void {
    this.emit(
      'route_changed',
      this.getRouteDistance(),
      this.getRouteBestDistance(),
      this.getRouteDistanceGoal(),
      this.getCourseMode(),
      this.isAutoProgress(),
    )
  }

  private _muster() {
    if (!this.persistent.muster) this.persistent.muster = { gunnery: 0, seamanship: 0 }
    return this.persistent.muster
  }

  getMusterGunnery():   number { return this._muster().gunnery }
  getMusterSeamanship(): number { return this._muster().seamanship }

  trainMuster(stat: 'gunnery' | 'seamanship', salvageAmount: number): number {
    const levels = Balance.musterLevels(salvageAmount)
    if (levels <= 0) return 0
    const muster = this._muster()
    const current = muster[stat]
    const gain = Math.min(levels, MUSTER_CAP - current)
    if (gain <= 0) return 0
    if (!this.spendResource('salvage', salvageAmount)) return 0
    muster[stat] = current + gain
    this.emit('muster_changed', stat, muster[stat])
    return gain
  }
}
