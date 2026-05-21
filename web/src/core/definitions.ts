import resourcesData from '@data/definitions/resources.json'
import shipsData from '@data/definitions/ships.json'
import enemiesData from '@data/definitions/enemies.json'
import lanesData from '@data/definitions/lanes.json'
import weaponsData from '@data/definitions/weapons.json'
import upgradesData from '@data/definitions/upgrades.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDef = Record<string, any> & { id: string }

function findById(items: AnyDef[], id: string): AnyDef | undefined {
  return items.find(item => item.id === id)
}

const resources = resourcesData.items as AnyDef[]
const ships     = shipsData.items as AnyDef[]
const enemies   = enemiesData.items as AnyDef[]
const lanes     = lanesData.items as AnyDef[]
const weapons   = weaponsData.items as AnyDef[]
const upgrades  = upgradesData.items as AnyDef[]

export const Definitions = {
  getResource:          (id: string) => findById(resources, id),
  getShip:              (id: string) => findById(ships, id),
  getEnemy:             (id: string) => findById(enemies, id),
  getLane:              (id: string) => findById(lanes, id),
  getWeapon:            (id: string) => findById(weapons, id),
  getUpgrade:           (id: string) => findById(upgrades, id),
  getUpgradeForWeapon:  (weaponId: string) => upgrades.find(u => u['target_weapon'] === weaponId),
  allLanes:             () => lanes,
}
