import type { AbilityId, AbilityState, CourseMode, DoctrineMode, RouteState, RunState, PersistentState, PrestigeState, Settings } from './types'
import { Definitions } from './definitions'
import { Balance } from './balance'
import { SectorPlan } from './sector-plan'

type Listener = (...args: unknown[]) => void
type MusterStat = 'gunnery' | 'seamanship'
type MusterXpKey = 'gunnery_xp' | 'seamanship_xp'

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
    sector: 1,
    distance: 0,
    best_distance: 0,
    auto_progress: true,
    course_mode: 'forward',
  }
}

function defaultAbilityState(): AbilityState {
  return { active: 0, cooldown: 0 }
}

function defaultAbilities(): Record<AbilityId, AbilityState> {
  return {
    overcharge: defaultAbilityState(),
    repair: defaultAbilityState(),
    loot: defaultAbilityState(),
  }
}

function defaultRun(): RunState {
  return {
    wave_index: 0,
    route: defaultRoute(),
    resources: { salvage: 0 },
    upgrade_levels: {},
    combat: { player_hull: 0, boss_phase: false },
    doctrine: 'focus',
    milestone_muls: {},
    milestone_cost_muls: {},
    abilities: defaultAbilities(),
    timestamp: Date.now(),
  }
}

function defaultPrestige(): PrestigeState {
  return {
    returns: 0,
    selected_ship: 'starter_ship',
    selected_weapon: 'long_nine_cannons',
    selected_defense: 'none',
    selected_utility: 'none',
  }
}

function defaultMuster() {
  return {
    gunnery: 0,
    seamanship: 0,
    gunnery_xp: 0,
    seamanship_xp: 0,
    gunnery_power: 50,
  }
}

function defaultPersistent(): PersistentState {
  return {
    unlocked_lanes: ['lane_01'],
    unlocked_systems: ['arsenal'],
    defeated_bosses: [],
    best_lane: 'lane_01',
    best_distance: 0,
    prestige: defaultPrestige(),
    muster: defaultMuster(),
    persistent_resources: { doubloons: 0 },
  }
}

export const MUSTER_MAX_LEVELS_PER_SECOND = 40
export const ABILITY_ACTIVE_TICKS = 50
export const ABILITY_COOLDOWN_TICKS = 400
export type SystemUnlock = 'arsenal' | 'prestige' | 'muster'

export const GameState = new class extends Emitter {
  run:        RunState        = defaultRun()
  persistent: PersistentState = defaultPersistent()
  settings:   Settings        = { debug_mode: false, speed_multiplier: 1 }

  initRunState():        void { this.run        = defaultRun() }
  initPersistentState(): void { this.persistent = defaultPersistent() }

  private _prestige(): PrestigeState {
    if (!this.persistent.prestige) this.persistent.prestige = defaultPrestige()
    this.persistent.prestige.returns ??= 0
    this.persistent.prestige.selected_ship ??= 'starter_ship'
    this.persistent.prestige.selected_weapon ??= 'long_nine_cannons'
    this.persistent.prestige.selected_defense ??= 'none'
    this.persistent.prestige.selected_utility ??= 'none'
    return this.persistent.prestige
  }

  private _systems(): string[] {
    if (!this.persistent.unlocked_systems) this.persistent.unlocked_systems = ['arsenal']
    if (!this.persistent.unlocked_systems.includes('arsenal')) this.persistent.unlocked_systems.push('arsenal')
    return this.persistent.unlocked_systems
  }

  private _bosses(): string[] {
    if (!this.persistent.defeated_bosses) this.persistent.defeated_bosses = []
    return this.persistent.defeated_bosses
  }

  private _route(): RouteState {
    if (!this.run.route) this.run.route = defaultRoute()
    this.run.route.sector ??= 1
    return this.run.route
  }

  private _isPersistentResource(id: string): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (Definitions.getResource(id) as any)?.['persistence_tier'] === 'persistent'
  }

  private _resourceBucket(id: string): Record<string, number> {
    if (this._isPersistentResource(id)) {
      if (!this.persistent.persistent_resources) this.persistent.persistent_resources = {}
      return this.persistent.persistent_resources
    }
    return this.run.resources
  }

  getResource(id: string): number { return this._resourceBucket(id)[id] ?? 0 }

  addResource(id: string, amount: number): void {
    if (amount <= 0) return
    const bucket = this._resourceBucket(id)
    bucket[id] = (bucket[id] ?? 0) + amount
    this.emit('resource_changed', id, bucket[id])
  }

  spendResource(id: string, amount: number): boolean {
    const cur = this.getResource(id)
    if (cur < amount) return false
    const bucket = this._resourceBucket(id)
    bucket[id] = cur - amount
    this.emit('resource_changed', id, bucket[id])
    return true
  }

  canAfford(id: string, amount: number): boolean { return this.getResource(id) >= amount }

  getUpgradeLevel(id: string): number { return this.run.upgrade_levels[id] ?? 0 }

  getMilestoneMuls(upgradeId: string): number[] {
    return (this.run.milestone_muls ?? {})[upgradeId] ?? []
  }

  getMilestoneCostMuls(upgradeId: string): number[] {
    return (this.run.milestone_cost_muls ?? {})[upgradeId] ?? []
  }

  applyMilestoneChoice(upgradeId: string, milestoneIndex: number, dmgMul: number, costMul: number): void {
    if (!this.run.milestone_muls)      this.run.milestone_muls = {}
    if (!this.run.milestone_cost_muls) this.run.milestone_cost_muls = {}
    if (!this.run.milestone_muls[upgradeId])      this.run.milestone_muls[upgradeId] = []
    if (!this.run.milestone_cost_muls[upgradeId]) this.run.milestone_cost_muls[upgradeId] = []
    this.run.milestone_muls[upgradeId][milestoneIndex]      = dmgMul
    this.run.milestone_cost_muls[upgradeId][milestoneIndex] = costMul
    this.emit('upgrade_purchased', upgradeId, this.getUpgradeLevel(upgradeId))
  }

  setUpgradeLevel(id: string, level: number): void {
    this.run.upgrade_levels[id] = level
    if (level > 0 && level % 5 === 0) {
      const milestoneIndex = Math.floor(level / 5) - 1
      if (!this.run.milestone_muls)      this.run.milestone_muls = {}
      if (!this.run.milestone_cost_muls) this.run.milestone_cost_muls = {}
      if (!this.run.milestone_muls[id])      this.run.milestone_muls[id] = []
      if (!this.run.milestone_cost_muls[id]) this.run.milestone_cost_muls[id] = []
      if (this.run.milestone_muls[id][milestoneIndex] === undefined) {
        this.run.milestone_muls[id][milestoneIndex]      = 1.25
        this.run.milestone_cost_muls[id][milestoneIndex] = 1.0
      }
      this.emit('upgrade_purchased', id, level)
      return
    }
    this.emit('upgrade_purchased', id, level)
  }

  getDoctrine(): DoctrineMode { return this.run.doctrine ?? 'focus' }

  setDoctrine(mode: DoctrineMode): void {
    this.run.doctrine = mode
    this.emit('doctrine_changed', mode)
  }

  private _abilities(): Record<AbilityId, AbilityState> {
    if (!this.run.abilities) this.run.abilities = defaultAbilities()
    for (const id of ['overcharge', 'repair', 'loot'] as AbilityId[]) {
      if (!this.run.abilities[id]) this.run.abilities[id] = defaultAbilityState()
      this.run.abilities[id].active = Math.max(0, Math.round(this.run.abilities[id].active ?? 0))
      this.run.abilities[id].cooldown = Math.max(0, Math.round(this.run.abilities[id].cooldown ?? 0))
    }
    return this.run.abilities
  }

  getAbilityState(id: AbilityId): AbilityState {
    const state = this._abilities()[id]
    return { active: state.active, cooldown: state.cooldown }
  }

  isAbilityActive(id: AbilityId): boolean { return this._abilities()[id].active > 0 }

  activateAbility(id: AbilityId): boolean {
    const state = this._abilities()[id]
    if (state.active > 0 || state.cooldown > 0) return false
    state.active = ABILITY_ACTIVE_TICKS
    state.cooldown = ABILITY_COOLDOWN_TICKS
    this.emit('ability_changed', id, { ...state })
    return true
  }

  tickAbilities(): void {
    let changed = false
    const abilities = this._abilities()
    for (const id of Object.keys(abilities) as AbilityId[]) {
      const state = abilities[id]
      const beforeActive = state.active
      const beforeCooldown = state.cooldown
      state.active = Math.max(0, state.active - 1)
      state.cooldown = Math.max(0, state.cooldown - 1)
      changed ||= state.active !== beforeActive || state.cooldown !== beforeCooldown
    }
    if (changed) this.emit('ability_changed', 'tick')
  }

  abilityDamageMultiplier(): number { return this.isAbilityActive('overcharge') ? 1.35 : 1.0 }
  abilityFireRateMultiplier(): number { return this.isAbilityActive('overcharge') ? 0.75 : 1.0 }


  getPlayerHull(): number { return this.run.combat.player_hull }

  setPlayerHull(value: number): void {
    const max = this.getPlayerMaxHull()
    this.run.combat.player_hull = Math.max(0, Math.min(value, max))
    this.emit('player_hull_changed', this.run.combat.player_hull, max)
  }

  getPlayerMaxHull(): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ship = Definitions.getShip(this.getSelectedShip()) as any
    const baseHull = ship?.hull ?? 120
    const hullUpgrade = Definitions.getUpgradesForShip(this.getSelectedShip()).find(upg => upg['effect'] === 'ship_hull')
    const hullLevel = hullUpgrade ? this.getUpgradeLevel(hullUpgrade['id'] ?? '') : 0
    const refitIncrement = Number(hullUpgrade?.['effect_scale'] ?? 14)
    const muls = hullUpgrade ? this.getMilestoneMuls(hullUpgrade['id'] ?? '') : []
    const refitHull = Balance.shipHull(baseHull, hullLevel, refitIncrement, muls)
    return refitHull * Balance.seamanshipHullBonus(this.getMusterSeamanship())
  }

  isSystemUnlocked(id: SystemUnlock): boolean { return this._systems().includes(id) }

  unlockSystem(id: SystemUnlock): boolean {
    const systems = this._systems()
    if (systems.includes(id)) return false
    systems.push(id)
    this.emit('system_unlocked', id)
    return true
  }

  hasDefeatedBoss(id: string): boolean { return this._bosses().includes(id) }

  recordBossDefeated(id: string): { firstClear: boolean; unlocked: SystemUnlock[] } {
    const bosses = this._bosses()
    const firstClear = !bosses.includes(id)
    const unlocked: SystemUnlock[] = []
    if (firstClear) bosses.push(id)
    if (id === 'lane_01_boss' && this.unlockSystem('prestige')) unlocked.push('prestige')
    this.emit('boss_defeated_persistent', id, firstClear, unlocked)
    return { firstClear, unlocked }
  }

  getSelectedShip(): string { return this._prestige().selected_ship }
  getSelectedWeapon(): string { return this._prestige().selected_weapon }
  getSelectedDefense(): string { return this._prestige().selected_defense }
  getSelectedUtility(): string { return this._prestige().selected_utility }
  getReturnCount(): number { return this._prestige().returns }

  returnToPort(): void {
    const p = this._prestige()
    const prestige = { ...p, returns: p.returns + 1 }
    const bosses = [...this._bosses()]
    this.run = defaultRun()
    this.persistent.unlocked_lanes = ['lane_01']
    this.persistent.unlocked_systems = [...this._systems()]
    this.persistent.defeated_bosses = bosses
    this.persistent.prestige = prestige
    this.persistent.muster = defaultMuster()
    if (bosses.includes('lane_02_boss')) this.unlockSystem('muster')
    this.emit('returned_to_port', prestige.returns)
    this.emit('muster_changed', 'reset')
    this.emitRouteChanged()
  }

  getWaveIndex():               number  { return this.run.wave_index }
  advanceWave():                void    { this.run.wave_index++ }
  isBossPhase():                boolean { return this.run.combat.boss_phase }
  setBossPhase(active: boolean): void   { this.run.combat.boss_phase = active }

  getCurrentSector(): number { return this._route().sector }

  setCurrentSector(sector: number): void {
    const route = this._route()
    route.sector = Math.max(1, Math.min(SectorPlan.sectorCount, Math.floor(sector) || 1))
    route.distance = 0
    route.best_distance = 0
    this.run.wave_index = 0
    this.run.combat.boss_phase = false
    this.emit('sector_changed', route.sector)
    this.emitRouteChanged()
  }

  advanceSector(): boolean {
    const current = this.getCurrentSector()
    const next = SectorPlan.nextSector(current)
    if (next === current) return false
    this.setCurrentSector(next)
    return true
  }

  getRouteDistance(): number { return this._route().distance }

  getRouteBestDistance(): number { return this._route().best_distance }

  getRouteDistanceGoal(): number {
    return SectorPlan.getSector(this.getCurrentSector()).distance
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
      this.getCurrentSector(),
      this.getCourseMode(),
      this.isAutoProgress(),
    )
  }

  private _muster() {
    if (!this.persistent.muster) {
      this.persistent.muster = defaultMuster()
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const legacy = this.persistent.muster as any
    if (legacy.gunnery === undefined || legacy.seamanship === undefined) {
      const legacyLevel = Number(legacy.level ?? 0)
      const legacyPower = Number(legacy.gunnery_power ?? 50)
      this.persistent.muster.gunnery = Math.round(legacyLevel * (legacyPower / 100))
      this.persistent.muster.seamanship = Math.max(0, legacyLevel - this.persistent.muster.gunnery)
    }
    if (legacy.gunnery_xp === undefined || legacy.seamanship_xp === undefined) {
      const legacyXp = Number(legacy.xp ?? 0)
      const legacyPower = Number(legacy.gunnery_power ?? 50)
      this.persistent.muster.gunnery_xp = legacyXp * (legacyPower / 100)
      this.persistent.muster.seamanship_xp = Math.max(0, legacyXp - this.persistent.muster.gunnery_xp)
    }
    this.persistent.muster.gunnery = Math.max(0, Math.round(this.persistent.muster.gunnery))
    this.persistent.muster.seamanship = Math.max(0, Math.round(this.persistent.muster.seamanship))
    this.persistent.muster.gunnery_xp = Math.max(0, this.persistent.muster.gunnery_xp)
    this.persistent.muster.seamanship_xp = Math.max(0, this.persistent.muster.seamanship_xp)
    this.persistent.muster.gunnery_power ??= 50
    this.persistent.muster.gunnery_power = Math.max(0, Math.min(100, Math.round(this.persistent.muster.gunnery_power)))
    return this.persistent.muster
  }

  getMusterGunnery(): number { return this._muster().gunnery }
  getMusterSeamanship(): number { return this._muster().seamanship }
  getMusterGunneryProgress(): number { return this._muster().gunnery_xp }
  getMusterSeamanshipProgress(): number { return this._muster().seamanship_xp }
  getMusterGunneryPower(): number { return this._muster().gunnery_power }
  getMusterSeamanshipPower(): number { return 100 - this.getMusterGunneryPower() }

  setMusterPower(gunneryPower: number): void {
    const muster = this._muster()
    muster.gunnery_power = Math.max(0, Math.min(100, Math.round(gunneryPower)))
    this.emit('muster_changed', 'allocation', muster.gunnery_power)
  }

  addMusterProgress(amount: number): void {
    const progress = Math.max(0, amount)
    if (progress <= 0) return
    const muster = this._muster()
    const gunneryShare = progress * (muster.gunnery_power / 100)
    muster.gunnery_xp += gunneryShare
    muster.seamanship_xp += progress - gunneryShare
    this.emit('muster_changed', 'progress', progress)
  }

  processMusterProgress(seconds: number): { gunneryLevels: number; seamanshipLevels: number } {
    const maxLevels = Math.max(1, Math.floor(MUSTER_MAX_LEVELS_PER_SECOND * Math.max(0, seconds)))
    const gained = { gunneryLevels: 0, seamanshipLevels: 0 }
    let remaining = maxLevels
    while (remaining > 0) {
      const stat = this._nextReadyMusterStat()
      if (!stat) break
      this._claimMusterLevel(stat)
      if (stat === 'gunnery') gained.gunneryLevels++
      else gained.seamanshipLevels++
      remaining--
    }
    if (gained.gunneryLevels > 0 || gained.seamanshipLevels > 0) {
      this.emit('muster_changed', 'levels', gained)
    }
    return gained
  }

  private _nextReadyMusterStat(): MusterStat | null {
    const muster = this._muster()
    const gNeed = Balance.musterXpForNextLevel(muster.gunnery)
    const sNeed = Balance.musterXpForNextLevel(muster.seamanship)
    const gReady = muster.gunnery_xp >= gNeed
    const sReady = muster.seamanship_xp >= sNeed
    if (!gReady && !sReady) return null
    if (gReady && !sReady) return 'gunnery'
    if (!gReady && sReady) return 'seamanship'
    return muster.gunnery_xp / gNeed >= muster.seamanship_xp / sNeed ? 'gunnery' : 'seamanship'
  }

  private _claimMusterLevel(stat: MusterStat): void {
    const muster = this._muster()
    const xpKey = this._musterXpKey(stat)
    muster[xpKey] -= Balance.musterXpForNextLevel(muster[stat])
    muster[stat]++
  }

  private _musterXpKey(stat: MusterStat): MusterXpKey {
    return stat === 'gunnery' ? 'gunnery_xp' : 'seamanship_xp'
  }
}
