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
      doctrine:       GameState.run.doctrine,
      milestone_muls: { ...GameState.run.milestone_muls },
      milestone_cost_muls: { ...GameState.run.milestone_cost_muls },
      milestone_choice_ids: { ...GameState.run.milestone_choice_ids },
      stormheart:    { ...GameState.run.stormheart, active_boosts: [...(GameState.run.stormheart?.active_boosts ?? [])] },
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
      shipwright:     {
        ...GameState.persistent.shipwright,
        mastery: { ...(GameState.persistent.shipwright?.mastery ?? {}) },
      },
      research:       {
        ...GameState.persistent.research,
        progress: { ...(GameState.persistent.research?.progress ?? {}) },
      },
      relics:         {
        ...GameState.persistent.relics,
        shards: { ...(GameState.persistent.relics?.shards ?? {}) },
      },
      contracts:      {
        ...GameState.persistent.contracts,
        completions: { ...(GameState.persistent.contracts?.completions ?? {}) },
      },
      port:           {
        facilities: { ...(GameState.persistent.port?.facilities ?? {}) },
      },
      trials:         {
        completions: { ...(GameState.persistent.trials?.completions ?? {}) },
      },
      officers:       {
        ...GameState.persistent.officers,
        xp: { ...(GameState.persistent.officers?.xp ?? {}) },
      },
      orders:         { ...(GameState.persistent.orders ?? {}) },
      lifetime_ships_sunk: GameState.persistent.lifetime_ships_sunk ?? 0,
      best_sector_ships_sunk: { ...(GameState.persistent.best_sector_ships_sunk ?? {}) },
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
      ships_sunk_this_sector: 0,
      auto_progress: true,
      course_mode: 'forward',
    }
    GameState.run.route.sector       ??= 1
    GameState.run.route.ships_sunk_this_sector ??= 0
    GameState.run.combat.boss_phase    = d.boss_phase           ?? false
    GameState.run.resources            = d.resources            ?? { salvage: 0, doubloons: 0 }
    GameState.run.upgrade_levels       = d.upgrade_levels       ?? {}
    GameState.run.doctrine             = d.doctrine             ?? 'focus'
    GameState.run.milestone_muls       = d.milestone_muls       ?? {}
    GameState.run.milestone_cost_muls  = d.milestone_cost_muls  ?? {}
    GameState.run.milestone_choice_ids = d.milestone_choice_ids ?? {}
    GameState.run.stormheart           = d.stormheart           ?? { active_boosts: [], max_boosts: 2 }
    GameState.run.stormheart.active_boosts ??= []
    GameState.run.stormheart.max_boosts ??= 2
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
    if ((defeatedBosses.includes('lane_01_boss') || defeatedBosses.includes('sector_001_boss')) && !unlockedSystems.includes('prestige')) {
      unlockedSystems.push('prestige')
    }
    const secondBossCleared = defeatedBosses.includes('lane_02_boss') || defeatedBosses.includes('sector_002_boss')
    if ((d.prestige?.returns ?? 0) > 0 && secondBossCleared && !unlockedSystems.includes('muster')) {
      unlockedSystems.push('muster')
    }
    GameState.persistent.unlocked_systems = unlockedSystems
    if (!GameState.persistent.unlocked_systems.includes('arsenal')) GameState.persistent.unlocked_systems.push('arsenal')
    GameState.persistent.defeated_bosses = defeatedBosses
    GameState.persistent.best_lane      = d.best_lane      ?? 'lane_01'
    GameState.persistent.best_distance  = d.best_distance  ?? 0
    GameState.persistent.lifetime_ships_sunk = d.lifetime_ships_sunk ?? 0
    GameState.persistent.best_sector_ships_sunk = d.best_sector_ships_sunk ?? {}
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
    GameState.persistent.shipwright = {
      active_recipe: d.shipwright?.active_recipe ?? '',
      progress: Number(d.shipwright?.progress ?? 0),
      mastery: d.shipwright?.mastery ?? {},
    }
    GameState.persistent.research = {
      focus: d.research?.focus ?? 'gunnery',
      progress: {
        gunnery: Number(d.research?.progress?.gunnery ?? 0),
        shipwrighting: Number(d.research?.progress?.shipwrighting ?? 0),
        navigation: Number(d.research?.progress?.navigation ?? 0),
        occult: Number(d.research?.progress?.occult ?? 0),
      },
    }
    GameState.persistent.relics = {
      active_relic: d.relics?.active_relic ?? 'cannon_ruby',
      shards: {
        cannon_ruby: Number(d.relics?.shards?.cannon_ruby ?? 0),
        netted_astrolabe: Number(d.relics?.shards?.netted_astrolabe ?? 0),
        brine_compass: Number(d.relics?.shards?.brine_compass ?? 0),
      },
    }
    GameState.persistent.contracts = {
      charge: Number(d.contracts?.charge ?? 0),
      active_contract: d.contracts?.active_contract ?? 'reef_prize',
      completions: d.contracts?.completions ?? {},
    }
    GameState.persistent.port = {
      facilities: {
        drydock: Number(d.port?.facilities?.drydock ?? 0),
        foundry: Number(d.port?.facilities?.foundry ?? 0),
        observatory: Number(d.port?.facilities?.observatory ?? 0),
        hidden_cove: Number(d.port?.facilities?.hidden_cove ?? 0),
      },
    }
    GameState.persistent.trials = { completions: d.trials?.completions ?? {} }
    GameState.persistent.officers = {
      active_officer: d.officers?.active_officer ?? 'gunner',
      xp: {
        gunner: Number(d.officers?.xp?.gunner ?? 0),
        boatswain: Number(d.officers?.xp?.boatswain ?? 0),
        navigator: Number(d.officers?.xp?.navigator ?? 0),
        quartermaster: Number(d.officers?.xp?.quartermaster ?? 0),
        occultist: Number(d.officers?.xp?.occultist ?? 0),
      },
    }
    GameState.persistent.orders = {
      auto_burn_brine: Boolean(d.orders?.auto_burn_brine ?? false),
      auto_research_focus: d.orders?.auto_research_focus ?? 'gunnery',
      auto_shipwright_recipe: d.orders?.auto_shipwright_recipe ?? '',
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
