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

  upgradeCost(baseCost: number, scale: number, level: number, costMuls?: number[]): number {
    return baseCost * Math.pow(scale, level) * this.upgradeCostMultiplier(level, costMuls)
  },

  upgradeCostMultiplier(level: number, costMuls?: number[]): number {
    const milestones = Math.floor(Math.max(0, level) / 5)
    if (!costMuls || milestones === 0) return 1.0
    let result = 1.0
    for (let i = 0; i < milestones; i++) result *= costMuls[i] ?? 1.0
    return result
  },

  weaponDamage(baseDamage: number, incrementPerLevel: number, upgradeLevel: number, muls?: number[]): number {
    return (baseDamage + incrementPerLevel * upgradeLevel) * this.upgradeMilestoneMultiplier(upgradeLevel, muls)
  },

  shipHull(baseHull: number, upgradeLevel: number, incrementPerLevel: number, muls?: number[]): number {
    return (baseHull + incrementPerLevel * upgradeLevel) * this.upgradeMilestoneMultiplier(upgradeLevel, muls)
  },

  upgradeMilestoneMultiplier(level: number, muls?: number[]): number {
    const milestones = Math.floor(Math.max(0, level) / 5)
    if (!muls || muls.length === 0) return Math.pow(1.25, milestones)
    let result = 1.0
    for (let i = 0; i < milestones; i++) result *= muls[i] ?? 1.25
    return result
  },

  nextUpgradeMilestone(level: number): number {
    return Math.ceil((level + 1) / 5) * 5
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

  // Progressive difficulty: compound 14% per 30 nmi band, ×1.6 per sector.
  // Sector factor is gentle so upgrades let players stay relevant; reward
  // growth outpaces it so the reward/effort ratio improves with depth.
  distanceScalar(distance: number, sector = 1): number {
    const band = Math.floor(distance / 30)
    return Math.pow(1.6, Math.max(0, sector - 1)) * Math.pow(1.14, band)
  },

  // Reward scalar: compound 30% per 30 nmi band, ×3 per sector.
  // This produces ~5× across a full sector's distance bands, and a clear
  // jump between sectors — matching the USI pattern of stacked exponential
  // growth rather than the flat +12% linear the old formula used.
  rewardScalar(distance: number, sector = 1): number {
    const band = Math.floor(distance / 30)
    return Math.pow(3, Math.max(0, sector - 1)) * Math.pow(1.30, band)
  },

  musterXpForNextLevel(level: number): number {
    return Math.round(8 * Math.pow(1.25, level))
  },

  musterProgressReward(enemyMaxHull: number, isBoss: boolean): number {
    const divisor = isBoss ? 10 : 12
    const floor = isBoss ? 20 : 4
    return Math.max(floor, Math.round(enemyMaxHull / divisor))
  },

  // +3% weapon damage per gunnery level
  gunneryBonus(levels: number): number {
    return 1 + levels * 0.03
  },

  // +3% max hull per seamanship level
  seamanshipHullBonus(levels: number): number {
    return 1 + levels * 0.03
  },

  formatNumber(value: number): string {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M'
    if (value >= 10_000)    return (value / 1_000).toFixed(1) + 'K'
    if (value >= 100)       return Math.floor(value).toString()
    return value.toFixed(1)
  },
}
