extends Node
## Central mutable state. All game systems read and write through here.
## Emits signals when state changes so UI can react without polling.
##
## State split:
##   run       — resets on Return to Port
##   persistent — survives Return to Port
##   settings  — QoL, never resets

# --- Signals ---
signal resource_changed(resource_id: String, amount: float)
signal lane_changed(lane_id: String)
signal upgrade_purchased(upgrade_id: String, level: int)
signal lane_unlocked(lane_id: String)
signal player_hull_changed(current: float, maximum: float)

# --- Run state ---
var run: Dictionary = {}

# --- Persistent state ---
var persistent: Dictionary = {}

# --- Settings / QoL ---
var settings: Dictionary = {}


func _ready() -> void:
	init_run_state()
	init_persistent_state()
	_init_settings()


func init_run_state() -> void:
	run = {
		"lane_id": "lane_01",
		"wave_index": 0,
		"resources": {
			"salvage": 0.0,
			"doubloons": 0.0,
		},
		"upgrade_levels": {},
		"combat": {
			"player_hull": 0.0,
			"boss_phase": false,
		},
		"timestamp": Time.get_unix_time_from_system(),
	}


func init_persistent_state() -> void:
	persistent = {
		"unlocked_lanes": ["lane_01"],
		"best_lane": "lane_01",
	}


func _init_settings() -> void:
	settings = {
		"debug_mode": false,
		"speed_multiplier": 1.0,
	}


# --- Resource helpers ---

func get_resource(id: String) -> float:
	return run["resources"].get(id, 0.0)


func add_resource(id: String, amount: float) -> void:
	if amount <= 0.0:
		return
	if not run["resources"].has(id):
		run["resources"][id] = 0.0
	run["resources"][id] += amount
	resource_changed.emit(id, run["resources"][id])


func spend_resource(id: String, amount: float) -> bool:
	var current: float = get_resource(id)
	if current < amount:
		return false
	run["resources"][id] = current - amount
	resource_changed.emit(id, run["resources"][id])
	return true


func can_afford(resource_id: String, amount: float) -> bool:
	return get_resource(resource_id) >= amount


# --- Upgrade helpers ---

func get_upgrade_level(upgrade_id: String) -> int:
	return run["upgrade_levels"].get(upgrade_id, 0)


func set_upgrade_level(upgrade_id: String, level: int) -> void:
	run["upgrade_levels"][upgrade_id] = level
	upgrade_purchased.emit(upgrade_id, level)


# --- Lane helpers ---

func get_current_lane() -> String:
	return run.get("lane_id", "lane_01")


func set_current_lane(lane_id: String) -> void:
	run["lane_id"] = lane_id
	run["wave_index"] = 0
	run["combat"]["boss_phase"] = false
	lane_changed.emit(lane_id)
	# Track best lane (simple string comparison by lane number)
	if lane_id > persistent.get("best_lane", "lane_01"):
		persistent["best_lane"] = lane_id


func is_lane_unlocked(lane_id: String) -> bool:
	return lane_id in persistent.get("unlocked_lanes", ["lane_01"])


func unlock_lane(lane_id: String) -> void:
	if is_lane_unlocked(lane_id):
		return
	persistent["unlocked_lanes"].append(lane_id)
	lane_unlocked.emit(lane_id)


# --- Combat state helpers ---

func get_player_hull() -> float:
	return run["combat"].get("player_hull", 0.0)


func set_player_hull(value: float) -> void:
	var ship_def := Definitions.get_ship("starter_ship")
	var max_hull: float = ship_def.get("hull", 120.0)
	run["combat"]["player_hull"] = clampf(value, 0.0, max_hull)
	player_hull_changed.emit(run["combat"]["player_hull"], max_hull)


func get_player_max_hull() -> float:
	return Definitions.get_ship("starter_ship").get("hull", 120.0)


func get_wave_index() -> int:
	return run.get("wave_index", 0)


func advance_wave() -> void:
	run["wave_index"] = run.get("wave_index", 0) + 1


func is_boss_phase() -> bool:
	return run["combat"].get("boss_phase", false)


func set_boss_phase(active: bool) -> void:
	run["combat"]["boss_phase"] = active
