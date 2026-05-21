extends Node
## Saves and loads run + persistent state separately.
## Version-tagged. Migration placeholder increments SAVE_VERSION when format changes.
## Call load_game() from Main._ready() before Sim.start_combat().

const SAVE_VERSION: int = 1
const SAVE_DIR: String = "user://saves"
const RUN_PATH: String = "user://saves/run_state.json"
const PERSISTENT_PATH: String = "user://saves/persistent_state.json"

signal save_completed()
signal load_completed(success: bool)


func save_game() -> void:
	_ensure_save_dir()
	_write_json(RUN_PATH, _build_run_payload())
	_write_json(PERSISTENT_PATH, _build_persistent_payload())
	save_completed.emit()
	print("SaveSystem: saved.")


func load_game() -> bool:
	if not FileAccess.file_exists(RUN_PATH):
		print("SaveSystem: no save found — starting fresh.")
		load_completed.emit(false)
		return false

	var run_data := _read_json(RUN_PATH)
	var pers_data := _read_json(PERSISTENT_PATH)

	if run_data.is_empty():
		push_warning("SaveSystem: run state file empty or corrupt.")
		load_completed.emit(false)
		return false

	run_data  = _migrate(run_data)
	pers_data = _migrate(pers_data)

	_apply_run(run_data)
	_apply_persistent(pers_data)

	load_completed.emit(true)
	print("SaveSystem: loaded (version %d)." % run_data.get("save_version", 0))
	return true


func reset_game() -> void:
	_delete_file(RUN_PATH)
	_delete_file(PERSISTENT_PATH)
	GameState.init_run_state()
	GameState.init_persistent_state()
	Sim.start_combat()
	print("SaveSystem: reset.")


# --- Payload builders ---

func _build_run_payload() -> Dictionary:
	return {
		"save_version": SAVE_VERSION,
		"timestamp": Time.get_unix_time_from_system(),
		"lane_id": GameState.get_current_lane(),
		"wave_index": GameState.get_wave_index(),
		"boss_phase": GameState.is_boss_phase(),
		"resources": GameState.run["resources"].duplicate(),
		"upgrade_levels": GameState.run["upgrade_levels"].duplicate(),
		"player_hull": GameState.get_player_hull(),
	}


func _build_persistent_payload() -> Dictionary:
	return {
		"save_version": SAVE_VERSION,
		"timestamp": Time.get_unix_time_from_system(),
		"unlocked_lanes": GameState.persistent["unlocked_lanes"].duplicate(),
		"best_lane": GameState.persistent.get("best_lane", "lane_01"),
	}


# --- Apply loaders ---

func _apply_run(data: Dictionary) -> void:
	GameState.run["lane_id"]               = data.get("lane_id", "lane_01")
	GameState.run["wave_index"]            = data.get("wave_index", 0)
	GameState.run["combat"]["boss_phase"]  = data.get("boss_phase", false)
	GameState.run["resources"]             = data.get("resources", {"salvage": 0.0, "doubloons": 0.0})
	GameState.run["upgrade_levels"]        = data.get("upgrade_levels", {})
	GameState.run["combat"]["player_hull"] = float(data.get("player_hull", 0.0))


func _apply_persistent(data: Dictionary) -> void:
	if data.is_empty():
		return
	GameState.persistent["unlocked_lanes"] = data.get("unlocked_lanes", ["lane_01"])
	GameState.persistent["best_lane"]      = data.get("best_lane", "lane_01")


# --- Migration ---

func _migrate(data: Dictionary) -> Dictionary:
	var v: int = data.get("save_version", 0)
	if v == SAVE_VERSION:
		return data
	push_warning("SaveSystem: migrating save v%d → v%d" % [v, SAVE_VERSION])
	# Placeholder: add per-version transforms here as needed.
	data["save_version"] = SAVE_VERSION
	return data


# --- File I/O ---

func _ensure_save_dir() -> void:
	var dir := DirAccess.open("user://")
	if dir == null:
		push_error("SaveSystem: cannot open user:// directory")
		return
	if not dir.dir_exists("saves"):
		var err := dir.make_dir("saves")
		if err != OK:
			push_error("SaveSystem: cannot create saves/ directory (error %d)" % err)


func _write_json(path: String, data: Dictionary) -> void:
	var file := FileAccess.open(path, FileAccess.WRITE)
	if file == null:
		push_error("SaveSystem: cannot write to %s (error %d)" % [path, FileAccess.get_open_error()])
		return
	file.store_string(JSON.stringify(data, "\t"))
	file.close()


func _read_json(path: String) -> Dictionary:
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		return {}
	var json := JSON.new()
	var err := json.parse(file.get_as_text())
	file.close()
	if err != OK:
		push_error("SaveSystem: JSON error in %s: %s" % [path, json.get_error_message()])
		return {}
	var data = json.get_data()
	return data if data is Dictionary else {}


func _delete_file(path: String) -> void:
	if not FileAccess.file_exists(path):
		return
	var dir := DirAccess.open(path.get_base_dir())
	if dir:
		dir.remove(path.get_file())
