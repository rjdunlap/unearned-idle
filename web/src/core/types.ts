export type CourseMode = 'forward' | 'hold' | 'retreat'
export type DoctrineMode = 'focus' | 'suppression' | 'scatter'

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
  auto_progress: boolean
  course_mode: CourseMode
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

export interface PersistentState {
  unlocked_lanes: string[]
  unlocked_systems: string[]
  defeated_bosses: string[]
  best_lane: string
  best_distance: number
  prestige: PrestigeState
  muster: MusterState
  persistent_resources: Record<string, number>
}

export interface Settings {
  debug_mode: boolean
  speed_multiplier: number
}
