import { Definitions } from './definitions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDef = Record<string, any>

export interface SectorDef {
  sector: number
  route: 'A' | 'B' | 'C'
  routeName: string
  displayName: string
  region: string
  distance: number
  enemyIds: string[]
  boss: AnyDef | undefined
  elite: boolean
}

const SECTOR_COUNT = 100
const ENCOUNTER_DISTANCE = 30
const BOSS_INTERVAL = 1

const ENEMY_POOLS = [
  ['privateer_cutter', 'privateer_sloop', 'privateer_cutter'],
  ['privateer_sloop', 'ironclad_cutter', 'privateer_cutter'],
  ['ironclad_cutter', 'privateer_sloop', 'ironclad_cutter'],
]

const ROUTE_NAMES = {
  A: 'Trade Wind',
  B: 'Black Reef',
  C: 'Storm Line',
}

const BOSS_TITLES = [
  'Salt Widow',
  'Cracked Bell',
  'Redwake Baron',
  'Ashen Admiral',
  'Grave-Tide Commodore',
]

function routeForSector(sector: number): 'A' | 'B' | 'C' {
  if (sector % 15 === 0) return 'C'
  if (sector % 5 === 0) return 'B'
  return 'A'
}

function bossForSector(sector: number, elite: boolean): AnyDef {
  const authored = Definitions.getSectorDef(sector)
  if (authored?.['boss']) return authored['boss']

  const template = Definitions.getLane(elite ? 'lane_02' : 'lane_01')?.['boss']
  const title = BOSS_TITLES[(sector - 1) % BOSS_TITLES.length]
  return {
    ...template,
    id: `sector_${String(sector).padStart(3, '0')}_boss`,
    display_name: `${title} ${sector}`,
    family: elite ? 'Elite Fleet' : (template?.['family'] ?? 'Privateers'),
    description: elite
      ? 'An elite sector captain guarding a harder route reward.'
      : 'A sector captain blocking passage to deeper water.',
  }
}

const _sectorCache = new Map<number, SectorDef>()

export const SectorPlan = {
  sectorCount: SECTOR_COUNT,
  encounterDistance: ENCOUNTER_DISTANCE,
  bossInterval: BOSS_INTERVAL,

  getSector(sector: number): SectorDef {
    const safeSector = Math.max(1, Math.min(SECTOR_COUNT, Math.floor(sector) || 1))
    const cached = _sectorCache.get(safeSector)
    if (cached) return cached
    const authored = Definitions.getSectorDef(safeSector)
    const route = (authored?.['route'] as 'A' | 'B' | 'C' | undefined) ?? routeForSector(safeSector)
    const elite = route !== 'A'
    const pool = (authored?.['wave_enemies'] as string[] | undefined) ?? ENEMY_POOLS[safeSector <= 12 ? 0 : safeSector <= 45 ? 1 : 2]
    const def: SectorDef = {
      sector: safeSector,
      route,
      routeName: ROUTE_NAMES[route],
      displayName: authored?.['display_name'] ?? `Sector ${safeSector}`,
      region: authored?.['region'] ?? ROUTE_NAMES[route],
      distance: authored?.['distance'] ?? (180 + Math.min(420, Math.floor((safeSector - 1) / 2) * 15)),
      enemyIds: pool,
      boss: bossForSector(safeSector, elite),
      elite,
    }
    _sectorCache.set(safeSector, def)
    return def
  },

  enemyForEncounter(sector: number, encounter: number, distance: number): AnyDef | undefined {
    const def = this.getSector(sector)
    const distanceBand = Math.floor(distance / ENCOUNTER_DISTANCE)
    const id = def.enemyIds[(encounter + distanceBand) % def.enemyIds.length]
    return Definitions.getEnemy(id)
  },

  nextSector(sector: number): number {
    return Math.min(SECTOR_COUNT, Math.max(1, Math.floor(sector) + 1))
  },
}
