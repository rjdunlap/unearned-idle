import type { AbilityId, AbilityState, ContractId, CourseMode, DoctrineMode, InfamyState, InfamyTreeNodeId, OfficerId, OrderState, PersistentState, PortFacilityId, PortState, PrestigeState, RelicId, RelicState, ResearchBranchId, RouteState, RunState, Settings, ShipwrightState, StormBoostId, StormheartState, TrialState } from './types'
import { Definitions } from './definitions'
import { Balance } from './balance'
import { SectorPlan } from './sector-plan'

type Listener = (...args: unknown[]) => void
type MusterStat = 'gunnery' | 'seamanship'
type MusterXpKey = 'gunnery_xp' | 'seamanship_xp'
type RecipeDef = {
  id: string
  displayName: string
  seconds: number
  salvageCost: number
  masteryCap: number
}

export const SHIPWRIGHT_RECIPES: RecipeDef[] = [
  { id: 'refined_timber', displayName: 'Refined Timber', seconds: 12, salvageCost: 35, masteryCap: 5 },
  { id: 'brass_gear', displayName: 'Brass Gear', seconds: 18, salvageCost: 55, masteryCap: 5 },
  { id: 'salvage_nets', displayName: 'Salvage Nets', seconds: 28, salvageCost: 90, masteryCap: 4 },
  { id: 'fair_wind_rigging', displayName: 'Fair Wind Rigging', seconds: 36, salvageCost: 120, masteryCap: 4 },
]

export const RESEARCH_BRANCHES: ResearchBranchId[] = ['gunnery', 'shipwrighting', 'navigation', 'occult']
export const RELICS: Array<{ id: RelicId; displayName: string; source: string; maxRank: number }> = [
  { id: 'cannon_ruby', displayName: 'Cannon Ruby', source: 'rare prize splinters', maxRank: 5 },
  { id: 'netted_astrolabe', displayName: 'Netted Astrolabe', source: 'salvage-heavy wreckage', maxRank: 5 },
  { id: 'brine_compass', displayName: 'Brine Compass', source: 'storm-line brine traces', maxRank: 5 },
]
export const CONTRACTS: Array<{ id: ContractId; displayName: string; chargeCost: number; reward: Record<string, number> }> = [
  { id: 'reef_prize', displayName: 'Reef Prize Writ', chargeCost: 100, reward: { salvage: 140, doubloons: 1 } },
  { id: 'storm_writ', displayName: 'Storm Writ', chargeCost: 140, reward: { ether_brine: 5, doubloons: 1 } },
  { id: 'admiralty_chart', displayName: 'Admiralty Chart', chargeCost: 160, reward: { doubloons: 2 } },
]
export const PORT_FACILITIES: Array<{ id: PortFacilityId; displayName: string; baseCost: number; maxRank: number }> = [
  { id: 'drydock', displayName: 'Drydock', baseCost: 2, maxRank: 5 },
  { id: 'foundry', displayName: 'Foundry', baseCost: 3, maxRank: 5 },
  { id: 'observatory', displayName: 'Observatory', baseCost: 3, maxRank: 5 },
  { id: 'hidden_cove', displayName: 'Hidden Cove', baseCost: 4, maxRank: 4 },
]
export const OFFICERS: Array<{ id: OfficerId; displayName: string; post: string }> = [
  { id: 'gunner', displayName: 'Master Gunner', post: 'weapon damage' },
  { id: 'boatswain', displayName: 'Boatswain', post: 'max hull' },
  { id: 'navigator', displayName: 'Navigator', post: 'route speed' },
  { id: 'quartermaster', displayName: 'Quartermaster', post: 'salvage value' },
  { id: 'occultist', displayName: 'Occultist', post: 'brine and relic odds' },
]

export const INFAMY_TREE_NODES: Array<{
  id: InfamyTreeNodeId; displayName: string; cost: number; desc: string
}> = [
  { id: 'notorious_captain',  displayName: 'Notorious Captain',   cost: 10, desc: '+10% Doubloon prizes from all enemies and bosses.' },
  { id: 'relic_hunter',       displayName: 'Relic Hunter',        cost: 15, desc: '+25% relic shard drop chance from kills and bosses.' },
  { id: 'persistent_contract',displayName: 'Persistent Contract', cost: 25, desc: 'Active contract and its charge survive Return to Port.' },
  { id: 'iron_reputation',    displayName: 'Iron Reputation',     cost: 30, desc: '+15% max hull permanently across all runs.' },
  { id: 'fearsome_colors',    displayName: 'Fearsome Colors',     cost: 40, desc: 'Bounty hunters appear more often; all Infamy gains +50%.' },
]

export const BOUNTY_HUNTERS: Array<{
  id: string; displayName: string; infamyThreshold: number; hullMul: number; desc: string
}> = [
  { id: 'scatterwick',    displayName: 'Scatterwick',        infamyThreshold: 20,  hullMul: 1.5, desc: 'Wiry scout with a taste for blood money.' },
  { id: 'pale_creditor',  displayName: 'The Pale Creditor',  infamyThreshold: 50,  hullMul: 2.2, desc: 'Armored debt-collector. Iron-hulled and self-repairing.' },
  { id: 'mother_mast',    displayName: 'Mother Mast',        infamyThreshold: 100, hullMul: 3.0, desc: 'Warded occultist. Heavy ward; occult counterfire.' },
  { id: 'iron_collector', displayName: 'The Iron Collector', infamyThreshold: 200, hullMul: 4.0, desc: 'All defenses maximized. The price on your head is now sovereign.' },
]

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
    ships_sunk_this_sector: 0,
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

function defaultStormheart(): StormheartState {
  return { active_boosts: [], max_boosts: 2 }
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
    milestone_choice_ids: {},
    stormheart: defaultStormheart(),
    abilities: defaultAbilities(),
    run_infamy: 0,
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

function defaultShipwright(): ShipwrightState {
  return { active_recipe: '', progress: 0, mastery: {} }
}

function defaultResearch() {
  return {
    focus: 'gunnery' as ResearchBranchId,
    progress: { gunnery: 0, shipwrighting: 0, navigation: 0, occult: 0 },
  }
}

function defaultRelics(): RelicState {
  return { active_relic: 'cannon_ruby', shards: { cannon_ruby: 0, netted_astrolabe: 0, brine_compass: 0 } }
}

function defaultContracts() {
  return { charge: 0, active_contract: 'reef_prize' as ContractId, completions: {} }
}

function defaultPort(): PortState {
  return { facilities: { drydock: 0, foundry: 0, observatory: 0, hidden_cove: 0 } }
}

function defaultTrials(): TrialState {
  return { completions: {} }
}

function defaultOfficers() {
  return { active_officer: 'gunner' as OfficerId, xp: { gunner: 0, boatswain: 0, navigator: 0, quartermaster: 0, occultist: 0 } }
}

function defaultOrders(): OrderState {
  return { auto_burn_brine: false, auto_research_focus: 'gunnery', auto_shipwright_recipe: '' }
}

function defaultInfamy(): InfamyState {
  return { carried: 0, marks: 0, tree_nodes: {} }
}

function defaultPersistent(): PersistentState {
  return {
    unlocked_lanes: ['lane_01'],
    unlocked_systems: ['arsenal'],
    defeated_bosses: [],
    best_lane: 'lane_01',
    best_distance: 0,
    lifetime_ships_sunk: 0,
    best_sector_ships_sunk: {},
    prestige: defaultPrestige(),
    muster: defaultMuster(),
    shipwright: defaultShipwright(),
    research: defaultResearch(),
    relics: defaultRelics(),
    contracts: defaultContracts(),
    port: defaultPort(),
    trials: defaultTrials(),
    officers: defaultOfficers(),
    orders: defaultOrders(),
    infamy: defaultInfamy(),
    persistent_resources: { doubloons: 0 },
  }
}

export const MUSTER_MAX_LEVELS_PER_SECOND = 40
export const ABILITY_ACTIVE_TICKS = 50
export const ABILITY_COOLDOWN_TICKS = 400
export type SystemUnlock = 'arsenal' | 'prestige' | 'muster' | 'stormheart' | 'shipwright' | 'research' | 'relics' | 'contracts' | 'port' | 'trials' | 'officers' | 'orders' | 'ledger' | 'infamy'

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
    this.run.route.ships_sunk_this_sector ??= 0
    return this.run.route
  }

  private _stormheart(): StormheartState {
    if (!this.run.stormheart) this.run.stormheart = defaultStormheart()
    this.run.stormheart.active_boosts ??= []
    this.run.stormheart.max_boosts ??= 2
    return this.run.stormheart
  }

  private _shipwright(): ShipwrightState {
    if (!this.persistent.shipwright) this.persistent.shipwright = defaultShipwright()
    this.persistent.shipwright.active_recipe ??= ''
    this.persistent.shipwright.progress ??= 0
    this.persistent.shipwright.mastery ??= {}
    return this.persistent.shipwright
  }

  private _research() {
    if (!this.persistent.research) this.persistent.research = defaultResearch()
    this.persistent.research.focus ??= 'gunnery'
    this.persistent.research.progress ??= defaultResearch().progress
    for (const id of RESEARCH_BRANCHES) this.persistent.research.progress[id] ??= 0
    return this.persistent.research
  }

  private _relics(): RelicState {
    if (!this.persistent.relics) this.persistent.relics = defaultRelics()
    this.persistent.relics.active_relic ??= 'cannon_ruby'
    this.persistent.relics.shards ??= defaultRelics().shards
    for (const relic of RELICS) this.persistent.relics.shards[relic.id] ??= 0
    return this.persistent.relics
  }

  private _contracts() {
    if (!this.persistent.contracts) this.persistent.contracts = defaultContracts()
    this.persistent.contracts.charge ??= 0
    this.persistent.contracts.active_contract ??= 'reef_prize'
    this.persistent.contracts.completions ??= {}
    return this.persistent.contracts
  }

  private _port(): PortState {
    if (!this.persistent.port) this.persistent.port = defaultPort()
    this.persistent.port.facilities ??= defaultPort().facilities
    for (const facility of PORT_FACILITIES) this.persistent.port.facilities[facility.id] ??= 0
    return this.persistent.port
  }

  private _trials(): TrialState {
    if (!this.persistent.trials) this.persistent.trials = defaultTrials()
    this.persistent.trials.completions ??= {}
    return this.persistent.trials
  }

  private _officers() {
    if (!this.persistent.officers) this.persistent.officers = defaultOfficers()
    this.persistent.officers.active_officer ??= 'gunner'
    this.persistent.officers.xp ??= defaultOfficers().xp
    for (const officer of OFFICERS) this.persistent.officers.xp[officer.id] ??= 0
    return this.persistent.officers
  }

  private _orders(): OrderState {
    if (!this.persistent.orders) this.persistent.orders = defaultOrders()
    this.persistent.orders.auto_burn_brine ??= false
    this.persistent.orders.auto_research_focus ??= 'gunnery'
    this.persistent.orders.auto_shipwright_recipe ??= ''
    return this.persistent.orders
  }

  private _infamy(): InfamyState {
    if (!this.persistent.infamy) this.persistent.infamy = defaultInfamy()
    this.persistent.infamy.carried    ??= 0
    this.persistent.infamy.marks      ??= 0
    this.persistent.infamy.tree_nodes ??= {}
    return this.persistent.infamy
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

  getMilestoneChoiceIds(upgradeId: string): string[] {
    return (this.run.milestone_choice_ids ?? {})[upgradeId] ?? []
  }

  applyMilestoneChoice(upgradeId: string, milestoneIndex: number, dmgMul: number, costMul: number, choiceId = ''): void {
    if (!this.run.milestone_muls)      this.run.milestone_muls = {}
    if (!this.run.milestone_cost_muls) this.run.milestone_cost_muls = {}
    if (!this.run.milestone_choice_ids) this.run.milestone_choice_ids = {}
    if (!this.run.milestone_muls[upgradeId])      this.run.milestone_muls[upgradeId] = []
    if (!this.run.milestone_cost_muls[upgradeId]) this.run.milestone_cost_muls[upgradeId] = []
    if (!this.run.milestone_choice_ids[upgradeId]) this.run.milestone_choice_ids[upgradeId] = []
    this.run.milestone_muls[upgradeId][milestoneIndex]      = dmgMul
    this.run.milestone_cost_muls[upgradeId][milestoneIndex] = costMul
    this.run.milestone_choice_ids[upgradeId][milestoneIndex] = choiceId
    this.emit('upgrade_purchased', upgradeId, this.getUpgradeLevel(upgradeId))
  }

  setUpgradeLevel(id: string, level: number): void {
    this.run.upgrade_levels[id] = level
    if (level > 0 && level % 5 === 0) {
      const milestoneIndex = Math.floor(level / 5) - 1
      if (!this.run.milestone_muls)      this.run.milestone_muls = {}
      if (!this.run.milestone_cost_muls) this.run.milestone_cost_muls = {}
      if (!this.run.milestone_choice_ids) this.run.milestone_choice_ids = {}
      if (!this.run.milestone_muls[id])      this.run.milestone_muls[id] = []
      if (!this.run.milestone_cost_muls[id]) this.run.milestone_cost_muls[id] = []
      if (!this.run.milestone_choice_ids[id]) this.run.milestone_choice_ids[id] = []
      if (this.run.milestone_muls[id][milestoneIndex] === undefined) {
        this.run.milestone_muls[id][milestoneIndex]      = 1.25
        this.run.milestone_cost_muls[id][milestoneIndex] = 1.0
        this.run.milestone_choice_ids[id][milestoneIndex] = 'standard'
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

  getStormBoosts(): StormBoostId[] { return [...this._stormheart().active_boosts] }
  isStormBoostActive(id: StormBoostId): boolean { return this._stormheart().active_boosts.includes(id) }
  getStormMaxBoosts(): number { return this._stormheart().max_boosts }

  burnEtherBrine(): boolean {
    if (!this.spendResource('ether_brine', 5)) return false
    this.addResource('storm_power', 20)
    this.emit('stormheart_changed')
    return true
  }

  toggleStormBoost(id: StormBoostId): void {
    const storm = this._stormheart()
    if (storm.active_boosts.includes(id)) {
      storm.active_boosts = storm.active_boosts.filter(boost => boost !== id)
    } else {
      storm.active_boosts.push(id)
    }
    this.emit('stormheart_changed')
  }

  tickStormheart(seconds: number): void {
    const active = this._stormheart().active_boosts
    if (active.length === 0) return
    const overLimit = Math.max(0, active.length - this.getStormMaxBoosts())
    const drain = (active.length * 0.42 + overLimit * 0.7) * seconds
    const cur = this.getResource('storm_power')
    if (cur <= 0) {
      this._stormheart().active_boosts = []
      this.emit('stormheart_changed')
      return
    }
    const next = Math.max(0, cur - drain)
    this.run.resources.storm_power = next
    this.emit('resource_changed', 'storm_power', next)
    if (next <= 0) {
      this._stormheart().active_boosts = []
      this.emit('stormheart_changed')
    }
  }

  stormDamageMultiplier(): number { return this.isStormBoostActive('thunder_broadside') ? 1.2 : 1 }
  stormDistanceMultiplier(): number { return this.isStormBoostActive('fair_wind') ? 1.35 : 1 }
  stormSalvageMultiplier(): number { return this.isStormBoostActive('deep_salvage') ? 1.25 : 1 }


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
    return refitHull * Balance.seamanshipHullBonus(this.getMusterSeamanship()) * this.portHullMultiplier() * this.officerHullMultiplier() * this.infamyHullMultiplier()
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
    if (this._bossUnlocksPrestige(id) && this.unlockSystem('prestige')) unlocked.push('prestige')
    this.addInfamy(firstClear ? 30 : 5)
    this.emit('boss_defeated_persistent', id, firstClear, unlocked)
    return { firstClear, unlocked }
  }

  private _bossUnlocksPrestige(id: string): boolean {
    return id === 'lane_01_boss' || id === 'sector_001_boss'
  }

  private _hasDefeatedSectorBoss(sector: number): boolean {
    const sectorBossId = `sector_${String(sector).padStart(3, '0')}_boss`
    const laneBossId = `lane_${String(sector).padStart(2, '0')}_boss`
    return this.hasDefeatedBoss(sectorBossId) || this.hasDefeatedBoss(laneBossId)
  }

  getSelectedShip(): string { return this._prestige().selected_ship }
  getSelectedWeapon(): string { return this._prestige().selected_weapon }
  getSelectedDefense(): string { return this._prestige().selected_defense }
  getSelectedUtility(): string { return this._prestige().selected_utility }
  getReturnCount(): number { return this._prestige().returns }

  returnToPort(): void {
    // Infamy conversion: earn 40% of run infamy as marks, carry forward 20%
    const earnedMarks  = this.pendingInfamyMarks()
    const carryForward = Math.floor((this.run.run_infamy ?? 0) * 0.2)
    this._infamy().marks   += earnedMarks
    this._infamy().carried  = this.getCarriedInfamy() + carryForward

    // Save contract state if Persistent Contract node is owned
    const savedContract = this.getInfamyTreeNode('persistent_contract')
      ? { ...this._contracts() }
      : null

    const p = this._prestige()
    const prestige = { ...p, returns: p.returns + 1 }
    const bosses = [...this._bosses()]
    this.run = defaultRun()
    this.persistent.unlocked_lanes = ['lane_01']
    this.persistent.unlocked_systems = [...this._systems()]
    this.persistent.defeated_bosses = bosses
    this.persistent.prestige = prestige
    this.persistent.muster = defaultMuster()
    if (bosses.includes('lane_02_boss') || bosses.includes('sector_002_boss')) this.unlockSystem('muster')

    // Restore saved contract if node is owned
    if (savedContract) this.persistent.contracts = savedContract

    this.emit('returned_to_port', prestige.returns)
    this.emit('muster_changed', 'reset')
    this.emit('infamy_changed')
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
    route.ships_sunk_this_sector = 0
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

  getShipsSunkThisSector(): number { return this._route().ships_sunk_this_sector }

  getLifetimeShipsSunk(): number {
    this.persistent.lifetime_ships_sunk ??= 0
    return this.persistent.lifetime_ships_sunk
  }

  getBestShipsSunkForCurrentSector(): number {
    this.persistent.best_sector_ships_sunk ??= {}
    return this.persistent.best_sector_ships_sunk[`sector_${this.getCurrentSector()}`] ?? 0
  }

  recordShipSunk(): void {
    const route = this._route()
    route.ships_sunk_this_sector = Math.max(0, (route.ships_sunk_this_sector ?? 0) + 1)
    this.persistent.lifetime_ships_sunk = this.getLifetimeShipsSunk() + 1
    this.persistent.best_sector_ships_sunk ??= {}
    const key = `sector_${route.sector}`
    this.persistent.best_sector_ships_sunk[key] = Math.max(
      this.persistent.best_sector_ships_sunk[key] ?? 0,
      route.ships_sunk_this_sector,
    )
    this.emit('ship_sunk_recorded', route.ships_sunk_this_sector, this.persistent.lifetime_ships_sunk)
  }

  awardResearchForKill(isBoss: boolean): void {
    const route = SectorPlan.getSector(this.getCurrentSector())
    const base = isBoss ? 18 : 3
    const focus = this.getResearchFocus()
    const weights = this._researchWeights(route.routeTag)
    for (const branch of RESEARCH_BRANCHES) {
      const focusMul = branch === focus ? 2.5 : 1
      this._research().progress[branch] += base * weights[branch] * focusMul
    }
    this.emit('research_changed')
  }

  awardSideSystemKill(isBoss: boolean): void {
    const route = SectorPlan.getSector(this.getCurrentSector())
    const charge = (isBoss ? 18 : 4) + Math.floor(this.getPortFacilityRank('observatory') * 1.5)
    this._contracts().charge = Math.min(999, this._contracts().charge + charge)
    const activeOfficer = this.getActiveOfficer()
    this._officers().xp[activeOfficer] += isBoss ? 24 : 5
    const occultRank = Math.floor(this.getResearchProgress('occult') / 100)
    const relicChance = (isBoss ? 0.45 : 0.06) + occultRank * 0.01 + this.officerOccultBonus() + this.infamyRelicBonus() + (route.routeTag === 'storm_line' ? 0.03 : 0)
    if (Math.random() < relicChance) {
      const relicId = route.routeTag === 'storm_line' ? 'brine_compass' : route.routeTag === 'black_reef' ? 'netted_astrolabe' : 'cannon_ruby'
      this._relics().shards[relicId] += isBoss ? 3 : 1
      this.emit('relics_changed', relicId)
    }
    this.emit('contracts_changed')
    this.emit('officers_changed')
  }

  private _researchWeights(routeTag: string): Record<ResearchBranchId, number> {
    if (routeTag === 'black_reef') return { gunnery: 1.35, shipwrighting: 1.45, navigation: 0.8, occult: 0.85 }
    if (routeTag === 'storm_line') return { gunnery: 0.85, shipwrighting: 0.85, navigation: 1.45, occult: 1.35 }
    return { gunnery: 1, shipwrighting: 1, navigation: 1, occult: 1 }
  }

  salvageRewardMultiplier(): number {
    let bonus = 0
    for (const [upgradeId, choiceIds] of Object.entries(this.run.milestone_choice_ids ?? {})) {
      const upgrade = Definitions.getUpgrade(upgradeId)
      if (!upgrade) continue
      const choices = upgrade['milestone_choices'] as Array<Record<string, unknown>> | undefined
      if (!choices) continue
      for (const choiceId of choiceIds) {
        const choice = choices.find(c => c['id'] === choiceId)
        bonus += Number(choice?.['salvage_per_sector_sunk'] ?? 0) * this.getShipsSunkThisSector()
      }
    }
    bonus += this.shipwrightMastery('salvage_nets') * 0.06
    bonus += Math.floor(this.getResearchProgress('shipwrighting') / 100) * 0.02
    bonus += this.portSalvageBonus()
    bonus += this.officerSalvageBonus()
    bonus += this.relicSalvageBonus()
    return Math.min(2.5, 1 + bonus)
  }

  getShipwrightState(): ShipwrightState { return { ...this._shipwright(), mastery: { ...this._shipwright().mastery } } }
  shipwrightMastery(id: string): number { return this._shipwright().mastery[id] ?? 0 }

  startShipwrightRecipe(id: string): boolean {
    const recipe = SHIPWRIGHT_RECIPES.find(r => r.id === id)
    if (!recipe || this._shipwright().active_recipe) return false
    const discount = Math.max(0.55, 1 - this.shipwrightMastery(id) * 0.06)
    if (!this.spendResource('salvage', recipe.salvageCost * discount)) return false
    const state = this._shipwright()
    state.active_recipe = id
    state.progress = 0
    this.emit('shipwright_changed')
    return true
  }

  tickShipwright(seconds: number): void {
    const state = this._shipwright()
    if (!state.active_recipe) return
    const recipe = SHIPWRIGHT_RECIPES.find(r => r.id === state.active_recipe)
    if (!recipe) {
      state.active_recipe = ''
      state.progress = 0
      return
    }
    const speed = 1 + Math.floor(this.getResearchProgress('shipwrighting') / 100) * 0.05
    state.progress += seconds * speed
    if (state.progress < recipe.seconds) {
      this.emit('shipwright_changed')
      return
    }
    state.mastery[recipe.id] = Math.min(recipe.masteryCap, (state.mastery[recipe.id] ?? 0) + 1)
    state.active_recipe = ''
    state.progress = 0
    this.emit('shipwright_changed', recipe.id)
  }

  getResearchFocus(): ResearchBranchId { return this._research().focus }

  setResearchFocus(id: ResearchBranchId): void {
    this._research().focus = id
    this.emit('research_changed')
  }

  getResearchProgress(id: ResearchBranchId): number { return this._research().progress[id] ?? 0 }

  getRelicState(): RelicState { return { active_relic: this._relics().active_relic, shards: { ...this._relics().shards } } }
  getRelicRank(id: RelicId): number { return Math.min(5, Math.floor((this._relics().shards[id] ?? 0) / 10)) }
  getActiveRelic(): RelicId { return this._relics().active_relic }

  setActiveRelic(id: RelicId): void {
    this._relics().active_relic = id
    this.emit('relics_changed', id)
  }

  relicDamageMultiplier(): number {
    return this.getActiveRelic() === 'cannon_ruby' ? 1 + this.getRelicRank('cannon_ruby') * 0.04 : 1
  }

  relicSalvageBonus(): number {
    return this.getActiveRelic() === 'netted_astrolabe' ? this.getRelicRank('netted_astrolabe') * 0.05 : 0
  }

  relicBrineChanceBonus(): number {
    return this.getActiveRelic() === 'brine_compass' ? this.getRelicRank('brine_compass') * 0.015 : 0
  }

  getContractState() { return { ...this._contracts(), completions: { ...this._contracts().completions } } }

  setActiveContract(id: ContractId): void {
    this._contracts().active_contract = id
    this.emit('contracts_changed')
  }

  completeActiveContract(): boolean {
    const state = this._contracts()
    const contract = CONTRACTS.find(c => c.id === state.active_contract)
    if (!contract || state.charge < contract.chargeCost) return false
    state.charge -= contract.chargeCost
    state.completions[contract.id] = (state.completions[contract.id] ?? 0) + 1
    for (const [id, amount] of Object.entries(contract.reward)) this.addResource(id, amount)
    this.addInfamy(20)
    this.emit('contracts_changed')
    return true
  }

  getPortFacilityRank(id: PortFacilityId): number { return this._port().facilities[id] ?? 0 }

  getPortState(): PortState { return { facilities: { ...this._port().facilities } } }

  portUpgradeCost(id: PortFacilityId): number {
    const facility = PORT_FACILITIES.find(f => f.id === id)
    const rank = this.getPortFacilityRank(id)
    return Math.ceil((facility?.baseCost ?? 3) * Math.pow(1.8, rank))
  }

  upgradePortFacility(id: PortFacilityId): boolean {
    const facility = PORT_FACILITIES.find(f => f.id === id)
    if (!facility) return false
    const rank = this.getPortFacilityRank(id)
    if (rank >= facility.maxRank) return false
    if (!this.spendResource('doubloons', this.portUpgradeCost(id))) return false
    this._port().facilities[id] = rank + 1
    this.emit('port_changed', id)
    return true
  }

  portHullMultiplier(): number { return 1 + this.getPortFacilityRank('drydock') * 0.05 }
  portSalvageBonus(): number { return this.getPortFacilityRank('foundry') * 0.04 }
  portContractBonus(): number { return this.getPortFacilityRank('observatory') * 0.06 }
  portRareDropBonus(): number { return this.getPortFacilityRank('hidden_cove') * 0.01 }

  getTrialCompletions(): Record<string, number> { return { ...this._trials().completions } }

  completeTrial(id: string): boolean {
    if (this._trials().completions[id]) return false
    const ok =
      (id === 'gunnery_trial' && this.getUpgradeLevel('long_nine_upgrade') >= 5) ||
      (id === 'shipwright_trial' && Object.values(this._shipwright().mastery).some(v => v >= 1)) ||
      (id === 'storm_trial' && this.getResource('ether_brine') >= 5) ||
      (id === 'research_trial' && RESEARCH_BRANCHES.some(branch => this.getResearchProgress(branch) >= 100))
    if (!ok) return false
    this._trials().completions[id] = 1
    this.addResource('doubloons', id === 'storm_trial' ? 2 : 1)
    this.emit('trials_changed', id)
    return true
  }

  getOfficerState() { return { active_officer: this._officers().active_officer, xp: { ...this._officers().xp } } }
  getActiveOfficer(): OfficerId { return this._officers().active_officer }
  setActiveOfficer(id: OfficerId): void {
    this._officers().active_officer = id
    this.emit('officers_changed')
  }
  getOfficerRank(id: OfficerId): number { return Math.floor((this._officers().xp[id] ?? 0) / 100) }
  officerDamageMultiplier(): number { return this.getActiveOfficer() === 'gunner' ? 1 + this.getOfficerRank('gunner') * 0.03 : 1 }
  officerHullMultiplier(): number { return this.getActiveOfficer() === 'boatswain' ? 1 + this.getOfficerRank('boatswain') * 0.04 : 1 }
  officerDistanceMultiplier(): number { return this.getActiveOfficer() === 'navigator' ? 1 + this.getOfficerRank('navigator') * 0.03 : 1 }
  officerSalvageBonus(): number { return this.getActiveOfficer() === 'quartermaster' ? this.getOfficerRank('quartermaster') * 0.04 : 0 }
  officerOccultBonus(): number { return this.getActiveOfficer() === 'occultist' ? this.getOfficerRank('occultist') * 0.01 : 0 }

  getOrdersState(): OrderState { return { ...this._orders() } }

  setOrder<K extends keyof OrderState>(key: K, value: OrderState[K]): void {
    this._orders()[key] = value
    this.emit('orders_changed')
  }

  tickOrders(): void {
    const orders = this._orders()
    if (orders.auto_research_focus && this.getResearchFocus() !== orders.auto_research_focus) {
      this.setResearchFocus(orders.auto_research_focus)
    }
    if (orders.auto_burn_brine && this.getResource('storm_power') < 5 && this.getResource('ether_brine') >= 5) {
      this.burnEtherBrine()
    }
    if (orders.auto_shipwright_recipe && !this._shipwright().active_recipe) {
      this.startShipwrightRecipe(orders.auto_shipwright_recipe)
    }
  }

  // ── Infamy ──────────────────────────────────────────────────────────────
  getRunInfamy(): number    { return Math.floor(this.run.run_infamy ?? 0) }
  getCarriedInfamy(): number { return Math.floor(this._infamy().carried) }
  getTotalInfamy(): number  { return this.getRunInfamy() + this.getCarriedInfamy() }
  getInfamyMarks(): number  { return this._infamy().marks }

  /** Marks earned if you Return to Port right now (40% of run infamy). */
  pendingInfamyMarks(): number { return Math.floor(this.getRunInfamy() * 0.4) }

  addInfamy(amount: number): void {
    if (amount <= 0) return
    const mul = this.getInfamyTreeNode('fearsome_colors') ? 1.5 : 1
    this.run.run_infamy = (this.run.run_infamy ?? 0) + Math.round(amount * mul)
    this.emit('infamy_changed')
  }

  getInfamyTreeNode(id: InfamyTreeNodeId): boolean {
    return Boolean(this._infamy().tree_nodes[id])
  }

  buyInfamyTreeNode(id: InfamyTreeNodeId): boolean {
    const node = INFAMY_TREE_NODES.find(n => n.id === id)
    if (!node || this.getInfamyTreeNode(id) || this._infamy().marks < node.cost) return false
    this._infamy().marks -= node.cost
    this._infamy().tree_nodes[id] = true
    this.emit('infamy_changed')
    return true
  }

  /** Which bounty hunter is currently pursuing the player (highest eligible). */
  getCurrentBountyHunter(): typeof BOUNTY_HUNTERS[0] | null {
    const total = this.getTotalInfamy()
    const eligible = BOUNTY_HUNTERS.filter(h => h.infamyThreshold <= total)
    return eligible.length > 0 ? (eligible[eligible.length - 1] ?? null) : null
  }

  infamyHullMultiplier(): number    { return this.getInfamyTreeNode('iron_reputation') ? 1.15 : 1 }
  infamyDoubloonMultiplier(): number { return this.getInfamyTreeNode('notorious_captain') ? 1.10 : 1 }
  infamyRelicBonus(): number        { return this.getInfamyTreeNode('relic_hunter') ? 0.25 : 0 }

  // ── Route ────────────────────────────────────────────────────────────────
  getRouteDistanceGoal(): number {
    return SectorPlan.getSector(this.getCurrentSector()).distance
  }

  hasDefeatedCurrentSectorBoss(sector = this.getCurrentSector()): boolean {
    return this._hasDefeatedSectorBoss(sector)
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
