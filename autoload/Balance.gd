extends Node
## Stateless formula helpers. No mutable state — pure math.
## Loaded after Definitions, referenced by Sim and UI.


# --- Damage formulas ---

## Effective damage after counters.
## damage_type: "cannon" | "harpoon" | "fire" | "occult" | "chain"
## enemy_def fields used: armor_reduction, ward_reduction, evasion
func calc_effective_damage(base_dmg: float, damage_type: String, enemy_def: Dictionary) -> float:
	if base_dmg <= 0.0:
		return 0.0

	var evasion: float = enemy_def.get("evasion", 0.0)
	if evasion > 0.0 and randf() < evasion:
		return 0.0

	var armor: float  = enemy_def.get("armor_reduction", 0.0)
	var ward: float   = enemy_def.get("ward_reduction", 0.0)
	var dmg := base_dmg

	match damage_type:
		"cannon":
			# Cannon is good vs hull, reduced by armor
			dmg *= (1.0 - armor)
		"harpoon":
			# Harpoon pierces 50% of armor — counter for Ironclads
			dmg *= (1.0 - armor * 0.5)
		"fire":
			# Fire is unaffected by armor but slightly reduced by ward
			dmg *= (1.0 - ward * 0.3)
		"occult":
			# Occult is boosted by enemy ward (ward is fuel), reduced vs mundane hull
			if ward > 0.0:
				dmg *= (1.0 + ward)
			else:
				dmg *= 0.75
		"chain":
			# Chain targets sails, partly blocked by ward
			dmg *= (1.0 - ward * 0.5)
		_:
			pass  # Unknown type: no modifier

	return maxf(0.0, dmg)


## Incoming damage to player after player defenses.
func calc_player_damage_taken(raw_dmg: float, player_def: Dictionary) -> float:
	var ward: float = player_def.get("ward_reduction", 0.0)
	return maxf(0.0, raw_dmg * (1.0 - ward))


# --- Upgrade cost curve ---

## cost(level) = base_cost * scale^level
func upgrade_cost(base_cost: float, scale: float, level: int) -> float:
	return base_cost * pow(scale, float(level))


# --- Weapon output at upgrade level ---

## Weapon base damage multiplied by level bonus.
func weapon_damage(weapon_def: Dictionary, upgrade_level: int) -> float:
	var base: float  = weapon_def.get("base_damage", 1.0)
	var scale: float = weapon_def.get("damage_scale_per_level", 0.20)
	return base * (1.0 + scale * float(upgrade_level))


func weapon_fire_rate(weapon_def: Dictionary) -> float:
	return float(weapon_def.get("fire_rate_ticks", 10))


# --- Counter diagnostic ---

## Returns a human-readable hint if the player's damage type is weak vs this enemy.
func get_counter_hint(damage_type: String, enemy_def: Dictionary) -> String:
	var armor: float = enemy_def.get("armor_reduction", 0.0)
	var ward: float  = enemy_def.get("ward_reduction", 0.0)

	if armor >= 0.30 and damage_type == "cannon":
		return "Armor high — use Harpoons"
	if ward >= 0.30 and damage_type == "cannon":
		return "Ward high — use Shrine Lantern"
	return ""


# --- Resource formatting ---

func format_number(value: float) -> String:
	if value >= 1_000_000.0:
		return "%.2fM" % (value / 1_000_000.0)
	if value >= 10_000.0:
		return "%.1fK" % (value / 1_000.0)
	if value >= 100.0:
		return "%d" % int(value)
	return "%.1f" % value
