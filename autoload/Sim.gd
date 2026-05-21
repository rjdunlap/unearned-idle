extends Node
## Fixed-step combat simulation. 10 ticks per second, frame-rate independent.
## Call start_combat() from Main after state is ready (save loaded or fresh).
## Call restore_combat_state() after a save is loaded to re-sync from GameState.

const TICK_RATE: float = 10.0
const TICK_DELTA: float = 1.0 / TICK_RATE

var _initialized: bool = false
var _running: bool = false
var _tick_accumulator: float = 0.0

# Current enemy being fought
var _current_enemy: Dictionary = {}
var _enemy_hull: float = 0.0
var _enemy_max_hull: float = 0.0

# Fire timers (in ticks elapsed since last shot)
var _player_fire_timer: float = 0.0
var _enemy_fire_timer: float = 0.0

# Wave tracking (mirrors GameState, kept local for performance)
var _waves_in_lane: int = 3
var _current_wave: int = 0
var _boss_active: bool = false

# --- Signals for UI ---
signal enemy_spawned(enemy_def: Dictionary, max_hull: float)
signal enemy_damaged(current_hull: float, max_hull: float, damage: float, evaded: bool)
signal enemy_defeated(enemy_def: Dictionary, rewards: Dictionary)
signal player_damaged(current_hull: float, max_hull: float, damage: float)
signal player_hull_restored(current_hull: float, max_hull: float)
signal boss_spawned(boss_def: Dictionary, max_hull: float)
signal boss_defeated(boss_def: Dictionary)
signal wave_completed(wave_index: int)
signal lane_completed(lane_id: String, next_lane_id: String)
signal combat_log(message: String)
signal counter_hint(hint: String)


func _ready() -> void:
	set_process(true)


func _process(delta: float) -> void:
	if not _initialized or not _running:
		return
	var scale: float = GameState.settings.get("speed_multiplier", 1.0)
	_tick_accumulator += delta * scale
	while _tick_accumulator >= TICK_DELTA:
		_tick_accumulator -= TICK_DELTA
		_combat_tick()


# --- Public API ---

func start_combat() -> void:
	_reset_local_state()
	_init_combat()
	_initialized = true
	_running = true


func restore_combat_state() -> void:
	## Called after loading a save. Reads restored GameState and re-enters combat.
	_reset_local_state()
	_init_combat()
	_initialized = true
	_running = true


func pause_combat() -> void:
	_running = false


func resume_combat() -> void:
	if _initialized:
		_running = true


func get_enemy_hull() -> float:
	return _enemy_hull


func get_enemy_max_hull() -> float:
	return _enemy_max_hull


func get_current_enemy_def() -> Dictionary:
	return _current_enemy


func is_in_boss_phase() -> bool:
	return _boss_active


# --- Internal init ---

func _reset_local_state() -> void:
	_current_enemy = {}
	_enemy_hull = 0.0
	_enemy_max_hull = 0.0
	_player_fire_timer = 0.0
	_enemy_fire_timer = 0.0
	_tick_accumulator = 0.0


func _init_combat() -> void:
	var lane_id := GameState.get_current_lane()
	var lane_def := Definitions.get_lane(lane_id)
	if lane_def.is_empty():
		push_error("Sim: No lane definition for '%s'" % lane_id)
		return

	_waves_in_lane = lane_def.get("wave_count", 3)
	_current_wave = GameState.get_wave_index()
	_boss_active = GameState.is_boss_phase()

	# Initialize player hull on fresh state
	if GameState.get_player_hull() <= 0.0:
		GameState.set_player_hull(GameState.get_player_max_hull())

	if _boss_active:
		_spawn_boss(lane_def)
	else:
		_spawn_next_wave(lane_def)


# --- Tick ---

func _combat_tick() -> void:
	if _current_enemy.is_empty():
		return

	var ship_def := Definitions.get_ship("starter_ship")
	var weapon_id: String = ship_def.get("weapon_id", "long_nine_cannons")
	var weapon_def := Definitions.get_weapon(weapon_id)
	var upgrade_level := _get_weapon_upgrade_level(weapon_id)

	# Player fires
	_player_fire_timer += 1.0
	var player_fire_rate := Balance.weapon_fire_rate(weapon_def)
	if _player_fire_timer >= player_fire_rate:
		_player_fire_timer -= player_fire_rate
		_player_fires(weapon_def, upgrade_level)
		if _enemy_hull <= 0.0:
			_on_enemy_defeated(Definitions.get_lane(GameState.get_current_lane()))
			return

	# Enemy fires
	_enemy_fire_timer += 1.0
	var enemy_fire_rate: float = float(_current_enemy.get("fire_rate_ticks", 15))
	if _enemy_fire_timer >= enemy_fire_rate:
		_enemy_fire_timer -= enemy_fire_rate
		_enemy_fires(ship_def)


func _player_fires(weapon_def: Dictionary, upgrade_level: int) -> void:
	var base_dmg := Balance.weapon_damage(weapon_def, upgrade_level)
	var damage_type: String = weapon_def.get("damage_type", "cannon")
	var enemy_stats := {
		"armor_reduction": _current_enemy.get("armor_reduction", 0.0),
		"ward_reduction":  _current_enemy.get("ward_reduction", 0.0),
		"evasion":         _current_enemy.get("evasion", 0.0),
	}

	# Check evasion before calling Balance (we want the evaded signal)
	var evasion: float = enemy_stats["evasion"]
	var evaded := evasion > 0.0 and randf() < evasion
	var effective := 0.0
	if not evaded:
		effective = Balance.calc_effective_damage(base_dmg, damage_type, enemy_stats)
		_enemy_hull -= effective
		_enemy_hull = maxf(0.0, _enemy_hull)

	enemy_damaged.emit(_enemy_hull, _enemy_max_hull, effective, evaded)

	# Emit counter hint once when the hint changes
	var hint := Balance.get_counter_hint(damage_type, _current_enemy)
	if hint != "":
		counter_hint.emit(hint)


func _enemy_fires(ship_def: Dictionary) -> void:
	var raw_dmg: float = _current_enemy.get("damage", 5.0)
	var player_def := {"ward_reduction": ship_def.get("ward_reduction", 0.0)}
	var dmg := Balance.calc_player_damage_taken(raw_dmg, player_def)
	var current := GameState.get_player_hull() - dmg
	GameState.set_player_hull(current)
	player_damaged.emit(GameState.get_player_hull(), GameState.get_player_max_hull(), dmg)

	if GameState.get_player_hull() <= 0.0:
		_on_player_defeated()


# --- State transitions ---

func _on_enemy_defeated(lane_def: Dictionary) -> void:
	var rewards: Dictionary = _current_enemy.get("rewards", {})
	for resource_id in rewards:
		GameState.add_resource(resource_id, float(rewards[resource_id]))
	enemy_defeated.emit(_current_enemy, rewards)

	var reward_text := _format_rewards(rewards)
	combat_log.emit(_current_enemy.get("display_name", "Enemy") + " defeated! +" + reward_text)

	if _boss_active:
		_on_boss_cleared(lane_def)
		return

	_current_wave += 1
	GameState.advance_wave()
	wave_completed.emit(_current_wave)

	if _current_wave >= _waves_in_lane:
		GameState.set_boss_phase(true)
		_boss_active = true
		_spawn_boss(lane_def)
	else:
		_spawn_next_wave(lane_def)


func _on_boss_cleared(lane_def: Dictionary) -> void:
	var boss_def: Dictionary = lane_def.get("boss", {})
	boss_defeated.emit(boss_def)
	combat_log.emit("BOSS defeated: " + boss_def.get("display_name", "?") + "!")

	var next_lane_id: String = lane_def.get("unlocks_lane", "")
	if next_lane_id != "":
		GameState.unlock_lane(next_lane_id)
		combat_log.emit("Lane unlocked: " + next_lane_id)

	_running = false
	lane_completed.emit(GameState.get_current_lane(), next_lane_id)


func _on_player_defeated() -> void:
	combat_log.emit("Ship critically damaged! Rallying crew...")
	# Sprint 01: immediate respawn at full hull to keep the demo flowing
	GameState.set_player_hull(GameState.get_player_max_hull())
	player_hull_restored.emit(GameState.get_player_hull(), GameState.get_player_max_hull())


func _spawn_next_wave(lane_def: Dictionary) -> void:
	var wave_enemies: Array = lane_def.get("wave_enemies", [])
	if wave_enemies.is_empty():
		push_error("Sim: Lane '%s' has no wave_enemies" % lane_def.get("id", "?"))
		return
	var enemy_id: String = wave_enemies[_current_wave % wave_enemies.size()]
	var enemy_def := Definitions.get_enemy(enemy_id)
	if enemy_def.is_empty():
		push_error("Sim: No enemy definition for '%s'" % enemy_id)
		return
	_set_enemy(enemy_def)
	combat_log.emit("Wave %d: %s" % [_current_wave + 1, enemy_def.get("display_name", "?")])
	enemy_spawned.emit(_current_enemy, _enemy_max_hull)


func _spawn_boss(lane_def: Dictionary) -> void:
	var boss_def: Dictionary = lane_def.get("boss", {})
	if boss_def.is_empty():
		push_error("Sim: Lane '%s' has no boss" % lane_def.get("id", "?"))
		return
	_set_enemy(boss_def)
	combat_log.emit("BOSS: " + boss_def.get("display_name", "?") + " appears!")
	boss_spawned.emit(_current_enemy, _enemy_max_hull)


func _set_enemy(enemy_def: Dictionary) -> void:
	_current_enemy = enemy_def
	_enemy_max_hull = float(enemy_def.get("hull", 30.0))
	_enemy_hull = _enemy_max_hull
	_player_fire_timer = 0.0
	_enemy_fire_timer = 0.0


# --- Helpers ---

func _get_weapon_upgrade_level(weapon_id: String) -> int:
	var upgrade_def := Definitions.get_upgrade_for_weapon(weapon_id)
	if upgrade_def.is_empty():
		return 0
	return GameState.get_upgrade_level(upgrade_def.get("id", ""))


func _format_rewards(rewards: Dictionary) -> String:
	var parts: Array[String] = []
	for id in rewards:
		parts.append("%s %s" % [Balance.format_number(float(rewards[id])), id])
	return ", ".join(parts)
