export type CourseMode = 'forward' | 'hold' | 'retreat'

export interface RouteState {
  distance: number
  best_distance: number
  auto_progress: boolean
  course_mode: CourseMode
}

export interface RunState {
  lane_id: string
  wave_index: number
  route: RouteState
  resources: Record<string, number>
  upgrade_levels: Record<string, number>
  combat: { player_hull: number; boss_phase: boolean }
  timestamp: number
}

export interface PersistentState {
  unlocked_lanes: string[]
  best_lane: string
  best_distance: number
}

export interface Settings {
  debug_mode: boolean
  speed_multiplier: number
}
