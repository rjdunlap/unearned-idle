import { GameState } from './game-state'
import { sim } from './sim'

const SAVE_VERSION    = 2
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
      wave_index:     GameState.getWaveIndex(),
      route:          { ...GameState.run.route },
      boss_phase:     GameState.isBossPhase(),
      resources:      { ...GameState.run.resources },
      upgrade_levels: { ...GameState.run.upgrade_levels },
      abilities:      { ...GameState.run.abilities },
      player_hull:    GameState.getPlayerHull(),
    }
  },

  _buildPersistent() {
    return {
      save_version:   SAVE_VERSION,
      timestamp:      Date.now(),
      unlocked_lanes: [...GameState.persistent.unlocked_lanes],
      unlocked_systems: [...GameState.persistent.unlocked_systems],
      defeated_bosses: [...GameState.persistent.defeated_bosses],
      best_lane:      GameState.persistent.best_lane,
      best_distance:  GameState.persistent.best_distance,
      prestige:       { ...GameState.persistent.prestige },
      muster:         { ...GameState.persistent.muster },
      persistent_resources: { ...(GameState.persistent.persistent_resources ?? {}) },
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _applyRun(d: any): void {
    GameState.run.wave_index           = d.wave_index           ?? 0
    GameState.run.route                = d.route                ?? {
      sector: 1,
      distance: 0,
      best_distance: 0,
      auto_progress: true,
      course_mode: 'forward',
    }
    GameState.run.route.sector       ??= 1
    GameState.run.combat.boss_phase    = d.boss_phase           ?? false
    GameState.run.resources            = d.resources            ?? { salvage: 0, doubloons: 0 }
    GameState.run.upgrade_levels       = d.upgrade_levels       ?? {}
    GameState.run.abilities            = d.abilities            ?? {
      overcharge: { active: 0, cooldown: 0 },
      repair: { active: 0, cooldown: 0 },
      loot: { active: 0, cooldown: 0 },
    }
    GameState.run.abilities.overcharge ??= { active: 0, cooldown: 0 }
    GameState.run.abilities.repair     ??= { active: 0, cooldown: 0 }
    GameState.run.abilities.loot       ??= { active: 0, cooldown: 0 }
    GameState.run.combat.player_hull   = d.player_hull          ?? 0
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _applyPersistent(d: any): void {
    if (!d || !Object.keys(d).length) return
    GameState.persistent.unlocked_lanes = d.unlocked_lanes ?? ['lane_01']
    const defeatedBosses = d.defeated_bosses ?? []
    if (!d.defeated_bosses && (d.unlocked_lanes ?? []).includes('lane_02')) defeatedBosses.push('lane_01_boss')
    if (!d.defeated_bosses && (d.unlocked_lanes ?? []).includes('lane_03')) defeatedBosses.push('lane_02_boss')
    const unlockedSystems = d.unlocked_systems ?? ['arsenal']
    if (defeatedBosses.includes('lane_01_boss') && !unlockedSystems.includes('prestige')) unlockedSystems.push('prestige')
    if ((d.prestige?.returns ?? 0) > 0 && defeatedBosses.includes('lane_02_boss') && !unlockedSystems.includes('muster')) {
      unlockedSystems.push('muster')
    }
    GameState.persistent.unlocked_systems = unlockedSystems
    if (!GameState.persistent.unlocked_systems.includes('arsenal')) GameState.persistent.unlocked_systems.push('arsenal')
    GameState.persistent.defeated_bosses = defeatedBosses
    GameState.persistent.best_lane      = d.best_lane      ?? 'lane_01'
    GameState.persistent.best_distance  = d.best_distance  ?? 0
    GameState.persistent.prestige       = {
      returns:         d.prestige?.returns         ?? 0,
      selected_ship:   d.prestige?.selected_ship   ?? 'starter_ship',
      selected_weapon: d.prestige?.selected_weapon ?? 'long_nine_cannons',
      selected_defense: d.prestige?.selected_defense ?? 'none',
      selected_utility: d.prestige?.selected_utility ?? 'none',
    }
    const gunneryPower = Number(d.muster?.gunnery_power ?? 50)
    const legacyRank = Number(d.muster?.level ?? 0)
    const legacyXp = Number(d.muster?.xp ?? 0)
    const hasSplitLevels = d.muster?.gunnery !== undefined || d.muster?.seamanship !== undefined
    const hasSplitXp = d.muster?.gunnery_xp !== undefined || d.muster?.seamanship_xp !== undefined
    const splitGunnery = Math.round(legacyRank * (gunneryPower / 100))
    GameState.persistent.muster         = {
      gunnery:        hasSplitLevels ? Number(d.muster?.gunnery ?? 0) : splitGunnery,
      seamanship:     hasSplitLevels ? Number(d.muster?.seamanship ?? 0) : Math.max(0, legacyRank - splitGunnery),
      gunnery_xp:     hasSplitXp ? Number(d.muster?.gunnery_xp ?? 0) : legacyXp * (gunneryPower / 100),
      seamanship_xp:  hasSplitXp ? Number(d.muster?.seamanship_xp ?? 0) : legacyXp * (1 - gunneryPower / 100),
      gunnery_power:  gunneryPower,
    }
    GameState.persistent.persistent_resources = d.persistent_resources ?? {}
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _migrate(d: any): unknown {
    if (!d || d.save_version === SAVE_VERSION) return d
    console.warn(`SaveSystem: migrating save v${d.save_version} → v${SAVE_VERSION}`)
    // v1 → v2: doubloons moved from run.resources to persistent.persistent_resources.
    // Run-save doubloons are zeroed; persistent-save gets a fresh bucket.
    if ((d.save_version ?? 0) < 2) {
      if (d.resources?.doubloons !== undefined) {
        console.warn('SaveSystem: doubloons reset — moved to persistent storage (v1→v2 migration).')
        delete d.resources.doubloons
      }
      if (!d.persistent_resources) d.persistent_resources = {}
    }
    d.save_version = SAVE_VERSION
    return d
  },
}
