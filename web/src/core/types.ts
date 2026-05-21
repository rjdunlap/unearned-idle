export interface RunState {
  lane_id: string
  wave_index: number
  resources: Record<string, number>
  upgrade_levels: Record<string, number>
  combat: { player_hull: number; boss_phase: boolean }
  timestamp: number
}

export interface PersistentState {
  unlocked_lanes: string[]
  best_lane: string
}

export interface Settings {
  debug_mode: boolean
  speed_multiplier: number
}
