import { GameState } from './game-state'
import { sim } from './sim'

const SAVE_VERSION    = 1
const RUN_KEY         = 'ub_run_state'
const PERSISTENT_KEY  = 'ub_persistent_state'

export const SaveSystem = {
  saveGame(): void {
    localStorage.setItem(RUN_KEY,        JSON.stringify(this._buildRun()))
    localStorage.setItem(PERSISTENT_KEY, JSON.stringify(this._buildPersistent()))
    console.log('SaveSystem: saved.')
  },

  loadGame(): boolean {
    const raw = localStorage.getItem(RUN_KEY)
    if (!raw) { console.log('SaveSystem: no save found — starting fresh.'); return false }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const run  = this._migrate(JSON.parse(raw)) as any
      const persRaw = localStorage.getItem(PERSISTENT_KEY)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pers = persRaw ? this._migrate(JSON.parse(persRaw)) as any : {}
      this._applyRun(run)
      this._applyPersistent(pers)
      console.log(`SaveSystem: loaded (v${run.save_version ?? 0}).`)
      return true
    } catch {
      console.warn('SaveSystem: corrupt save data — starting fresh.')
      return false
    }
  },

  resetGame(): void {
    localStorage.removeItem(RUN_KEY)
    localStorage.removeItem(PERSISTENT_KEY)
    GameState.initRunState()
    GameState.initPersistentState()
    sim.startCombat()
    console.log('SaveSystem: reset.')
  },

  _buildRun() {
    return {
      save_version:   SAVE_VERSION,
      timestamp:      Date.now(),
      lane_id:        GameState.getCurrentLane(),
      wave_index:     GameState.getWaveIndex(),
      boss_phase:     GameState.isBossPhase(),
      resources:      { ...GameState.run.resources },
      upgrade_levels: { ...GameState.run.upgrade_levels },
      player_hull:    GameState.getPlayerHull(),
    }
  },

  _buildPersistent() {
    return {
      save_version:   SAVE_VERSION,
      timestamp:      Date.now(),
      unlocked_lanes: [...GameState.persistent.unlocked_lanes],
      best_lane:      GameState.persistent.best_lane,
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _applyRun(d: any): void {
    GameState.run.lane_id              = d.lane_id              ?? 'lane_01'
    GameState.run.wave_index           = d.wave_index           ?? 0
    GameState.run.combat.boss_phase    = d.boss_phase           ?? false
    GameState.run.resources            = d.resources            ?? { salvage: 0, doubloons: 0 }
    GameState.run.upgrade_levels       = d.upgrade_levels       ?? {}
    GameState.run.combat.player_hull   = d.player_hull          ?? 0
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _applyPersistent(d: any): void {
    if (!d || !Object.keys(d).length) return
    GameState.persistent.unlocked_lanes = d.unlocked_lanes ?? ['lane_01']
    GameState.persistent.best_lane      = d.best_lane      ?? 'lane_01'
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _migrate(d: any): unknown {
    if (!d || d.save_version === SAVE_VERSION) return d
    console.warn(`SaveSystem: migrating save v${d.save_version} → v${SAVE_VERSION}`)
    d.save_version = SAVE_VERSION
    return d
  },
}
