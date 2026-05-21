extends Node
## Loads and caches all static JSON definition files.
## Read-only after _ready(). All other autoloads depend on this loading first.

var resources: Dictionary = {}
var ships: Dictionary = {}
var enemies: Dictionary = {}
var lanes: Dictionary = {}
var weapons: Dictionary = {}
var upgrades: Dictionary = {}

var _load_errors: Array[String] = []


func _ready() -> void:
	resources = _load_json("res://data/definitions/resources.json")
	ships     = _load_json("res://data/definitions/ships.json")
	enemies   = _load_json("res://data/definitions/enemies.json")
	lanes     = _load_json("res://data/definitions/lanes.json")
	weapons   = _load_json("res://data/definitions/weapons.json")
	upgrades  = _load_json("res://data/definitions/upgrades.json")
	_validate_all()
	if _load_errors.size() > 0:
		push_error("Definitions: %d error(s) on load. Check output above." % _load_errors.size())


func _load_json(path: String) -> Dictionary:
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		var msg := "Cannot open: %s (error %d)" % [path, FileAccess.get_open_error()]
		push_error("Definitions: " + msg)
		_load_errors.append(msg)
		return {}
	var json := JSON.new()
	var err := json.parse(file.get_as_text())
	file.close()
	if err != OK:
		var msg := "JSON parse error in %s at line %d: %s" % [path, json.get_error_line(), json.get_error_message()]
		push_error("Definitions: " + msg)
		_load_errors.append(msg)
		return {}
	var data = json.get_data()
	if not data is Dictionary:
		var msg := "Root is not a Dictionary in %s" % path
		push_error("Definitions: " + msg)
		_load_errors.append(msg)
		return {}
	return data


func _validate_all() -> void:
	for pair in [["resources", resources], ["ships", ships], ["enemies", enemies],
				 ["lanes", lanes], ["weapons", weapons], ["upgrades", upgrades]]:
		var label: String = pair[0]
		var data: Dictionary = pair[1]
		if not data.has("items") or not data["items"] is Array:
			push_error("Definitions: '%s' missing required Array key 'items'" % label)
			_load_errors.append("'%s' missing 'items'" % label)


# --- Lookup helpers ---

func get_resource(id: String) -> Dictionary:
	return _find_by_id(resources, id)


func get_ship(id: String) -> Dictionary:
	return _find_by_id(ships, id)


func get_enemy(id: String) -> Dictionary:
	return _find_by_id(enemies, id)


func get_lane(id: String) -> Dictionary:
	return _find_by_id(lanes, id)


func get_weapon(id: String) -> Dictionary:
	return _find_by_id(weapons, id)


func get_upgrade(id: String) -> Dictionary:
	return _find_by_id(upgrades, id)


func get_upgrade_for_weapon(weapon_id: String) -> Dictionary:
	for item in upgrades.get("items", []):
		if item.get("target_weapon") == weapon_id:
			return item
	return {}


func _find_by_id(data: Dictionary, id: String) -> Dictionary:
	for item in data.get("items", []):
		if item.get("id") == id:
			return item
	return {}


func is_loaded() -> bool:
	return _load_errors.is_empty()
