export type DamageType = 'cannon' | 'harpoon' | 'fire' | 'occult' | 'chain'

export interface EnemyStats {
  armor_reduction?: number
  ward_reduction?: number
  evasion?: number
}

export const Balance = {
  calcEffectiveDamage(baseDmg: number, dtype: DamageType, enemy: EnemyStats): number {
    if (baseDmg <= 0) return 0
    const armor = enemy.armor_reduction ?? 0
    const ward  = enemy.ward_reduction  ?? 0
    let dmg = baseDmg
    switch (dtype) {
      case 'cannon':  dmg *= (1 - armor);        break
      case 'harpoon': dmg *= (1 - armor * 0.5);  break
      case 'fire':    dmg *= (1 - ward  * 0.3);  break
      case 'occult':  dmg *= ward > 0 ? (1 + ward) : 0.75; break
      case 'chain':   dmg *= (1 - ward  * 0.5);  break
    }
    return Math.max(0, dmg)
  },

  calcPlayerDamageTaken(rawDmg: number, wardReduction: number): number {
    return Math.max(0, rawDmg * (1 - wardReduction))
  },

  upgradeCost(baseCost: number, scale: number, level: number): number {
    return baseCost * Math.pow(scale, level)
  },

  weaponDamage(baseDamage: number, scalePerLevel: number, upgradeLevel: number): number {
    return baseDamage * (1 + scalePerLevel * upgradeLevel)
  },

  weaponFireRate(fireRateTicks: number): number {
    return fireRateTicks
  },

  getCounterHint(dtype: DamageType, enemy: EnemyStats): string {
    const armor = enemy.armor_reduction ?? 0
    const ward  = enemy.ward_reduction  ?? 0
    if (armor >= 0.30 && dtype === 'cannon') return 'Armor high — use Harpoons'
    if (ward  >= 0.30 && dtype === 'cannon') return 'Ward high — use Shrine Lantern'
    return ''
  },

  // Progressive difficulty: +8% hull/damage per 30 nmi band
  distanceScalar(distance: number): number {
    return 1 + Math.floor(distance / 30) * 0.08
  },

  // Rewards scale faster than difficulty: +12% per 30 nmi band
  rewardScalar(distance: number): number {
    return 1 + Math.floor(distance / 30) * 0.12
  },

  // Muster conversion: 1→1, 10→2, 100→3 levels
  musterLevels(salvage: number): number {
    if (salvage < 1) return 0
    return Math.floor(Math.log10(Math.max(1, salvage))) + 1
  },

  // +3% weapon damage per gunnery level
  gunneryBonus(levels: number): number {
    return 1 + levels * 0.03
  },

  // Up to 60% incoming damage reduction from seamanship
  seamanshipReduction(levels: number): number {
    return Math.min(0.6, levels * 0.015)
  },

  formatNumber(value: number): string {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M'
    if (value >= 10_000)    return (value / 1_000).toFixed(1) + 'K'
    if (value >= 100)       return Math.floor(value).toString()
    return value.toFixed(1)
  },
}
