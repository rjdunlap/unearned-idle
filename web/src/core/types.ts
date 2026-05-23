export type CourseMode = 'forward' | 'hold' | 'retreat'
export type DoctrineMode = 'focus' | 'suppression' | 'scatter'
export type StormBoostId = 'thunder_broadside' | 'fair_wind' | 'deep_salvage'
export type ResearchBranchId = 'gunnery' | 'shipwrighting' | 'navigation' | 'occult'
export type RelicId = 'cannon_ruby' | 'netted_astrolabe' | 'brine_compass'
export type ContractId = 'reef_prize' | 'storm_writ' | 'admiralty_chart'
export type PortFacilityId = 'drydock' | 'foundry' | 'observatory' | 'hidden_cove'
export type OfficerId = 'gunner' | 'boatswain' | 'navigator' | 'quartermaster' | 'occultist'

export interface AbilityState {
  active: number    // ticks remaining active (0 = inactive)
  cooldown: number  // ticks remaining on cooldown (0 = ready when active also 0)
}

export interface MusterState {
  gunnery: number
  seamanship: number
  gunnery_xp: number
  seamanship_xp: number
  gunnery_power: number
}

export interface RouteState {
  sector: number
  distance: number
  best_distance: number
  ships_sunk_this_sector: number
  auto_progress: boolean
  course_mode: CourseMode
}

export interface StormheartState {
  active_boosts: StormBoostId[]
  max_boosts: number
}

export interface RunState {
  wave_index: number
  route: RouteState
  resources: Record<string, number>
  upgrade_levels: Record<string, number>
  combat: { player_hull: number; boss_phase: boolean }
  doctrine: DoctrineMode
  milestone_muls: Record<string, number[]>
  milestone_cost_muls: Record<string, number[]>
  milestone_choice_ids: Record<string, string[]>
  stormheart: StormheartState
  abilities: Record<AbilityId, AbilityState>
  timestamp: number
}

export type AbilityId = 'overcharge' | 'repair' | 'loot'

export interface PrestigeState {
  returns: number
  selected_ship: string
  selected_weapon: string
  selected_defense: string
  selected_utility: string
}

export interface ShipwrightState {
  active_recipe: string
  progress: number
  mastery: Record<string, number>
}

export interface ResearchState {
  focus: ResearchBranchId
  progress: Record<ResearchBranchId, number>
}

export interface RelicState {
  active_relic: RelicId
  shards: Record<RelicId, number>
}

export interface ContractState {
  charge: number
  active_contract: ContractId
  completions: Partial<Record<ContractId, number>>
}

export interface PortState {
  facilities: Record<PortFacilityId, number>
}

export interface TrialState {
  completions: Record<string, number>
}

export interface OfficerState {
  active_officer: OfficerId
  xp: Record<OfficerId, number>
}

export interface OrderState {
  auto_burn_brine: boolean
  auto_research_focus: ResearchBranchId
  auto_shipwright_recipe: string
}

export interface PersistentState {
  unlocked_lanes: string[]
  unlocked_systems: string[]
  defeated_bosses: string[]
  best_lane: string
  best_distance: number
  lifetime_ships_sunk: number
  best_sector_ships_sunk: Record<string, number>
  prestige: PrestigeState
  muster: MusterState
  shipwright: ShipwrightState
  research: ResearchState
  relics: RelicState
  contracts: ContractState
  port: PortState
  trials: TrialState
  officers: OfficerState
  orders: OrderState
  persistent_resources: Record<string, number>
}

export interface Settings {
  debug_mode: boolean
  speed_multiplier: number
}
