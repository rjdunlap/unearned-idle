extends Control
## Sprint 01 main scene. Builds all UI in code.
## Layout: top=sea lane (300px), middle=status strip (60px), bottom=tab panel (fills rest).
## Tested at 360x800 portrait. All primary buttons >= 44px.

# --- Palette (Visual Design Bible) ---
const C_BG     := Color("#172033")
const C_OCEAN  := Color("#0F3442")
const C_COPPER := Color("#B96E35")
const C_RED    := Color("#E0443E")
const C_GOLD   := Color("#F2B134")
const C_TEAL   := Color("#22A6A1")
const C_TEXT   := Color("#E8D8B8")
const C_SILVER := Color("#CDD9D9")
const C_GREEN  := Color("#6BC56B")
const C_VIOLET := Color("#7B4FA3")
const C_DARK   := Color("#101216")

# --- UI node references ---
var _lane_label: Label
var _wave_label: Label
var _player_hp_bar: ProgressBar
var _player_hp_label: Label
var _enemy_name_label: Label
var _enemy_family_label: Label
var _enemy_hp_bar: ProgressBar
var _enemy_hp_label: Label
var _enemy_counter_label: Label
var _combat_log: RichTextLabel
var _salvage_label: Label
var _doubloons_label: Label
var _upgrade_name_label: Label
var _upgrade_desc_label: Label
var _upgrade_level_label: Label
var _upgrade_cost_label: Label
var _upgrade_buy_btn: Button
var _advance_btn: Button
var _boss_banner: Label
var _debug_overlay: PanelContainer
var _debug_speed_labels: Array[Button] = []

# State
var _current_lane_id: String = "lane_01"
var _next_lane_id: String = ""
var _log_lines: Array[String] = []
const LOG_MAX: int = 8


func _ready() -> void:
	RenderingServer.set_default_clear_color(C_BG)
	_build_ui()
	_connect_signals()

	# Load save if one exists; fresh GameState is already initialized by autoload
	var loaded := SaveSystem.load_game()
	if loaded:
		_current_lane_id = GameState.get_current_lane()
		_refresh_lane_label()

	Sim.start_combat()
	# Sync HP bar and resources AFTER combat init sets player hull
	_refresh_all_resources()
	_refresh_arsenal_ui()


# ─────────────────────────────────────────────────────────
#  UI Construction
# ─────────────────────────────────────────────────────────

func _build_ui() -> void:
	# Root fills viewport via anchors set in Main.tscn
	var root_vbox := VBoxContainer.new()
	root_vbox.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	root_vbox.add_theme_constant_override("separation", 0)
	add_child(root_vbox)

	_build_sea_lane_panel(root_vbox)
	_build_status_strip(root_vbox)
	_build_bottom_panel(root_vbox)
	_build_debug_overlay()


func _build_sea_lane_panel(parent: Node) -> void:
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(0, 295)
	panel.add_theme_stylebox_override("panel", _flat_style(C_OCEAN, 8, 8))
	parent.add_child(panel)

	var vbox := VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 6)
	panel.add_child(vbox)

	# Lane title row
	var title_row := HBoxContainer.new()
	title_row.add_theme_constant_override("separation", 8)
	vbox.add_child(title_row)

	_lane_label = _make_label("Saltglass Shallows", 16, C_TEAL, true)
	title_row.add_child(_lane_label)
	_lane_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL

	_wave_label = _make_label("Wave 1/3", 13, C_SILVER)
	title_row.add_child(_wave_label)

	_boss_banner = _make_label("⚔  BOSS", 14, C_GOLD, true)
	_boss_banner.visible = false
	title_row.add_child(_boss_banner)

	# Combat area (player | vs | enemy)
	var combat_row := HBoxContainer.new()
	combat_row.add_theme_constant_override("separation", 6)
	combat_row.custom_minimum_size = Vector2(0, 120)
	vbox.add_child(combat_row)

	_build_player_block(combat_row)
	var vs_label := _make_label("VS", 12, C_SILVER)
	vs_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	combat_row.add_child(vs_label)
	_build_enemy_block(combat_row)

	# Counter hint
	_enemy_counter_label = _make_label("", 12, C_GOLD)
	_enemy_counter_label.visible = false
	vbox.add_child(_enemy_counter_label)

	# Combat log
	var log_bg := PanelContainer.new()
	log_bg.add_theme_stylebox_override("panel", _flat_style(C_BG))
	log_bg.size_flags_vertical = Control.SIZE_EXPAND_FILL
	vbox.add_child(log_bg)

	_combat_log = RichTextLabel.new()
	_combat_log.bbcode_enabled = true
	_combat_log.scroll_following = true
	_combat_log.add_theme_color_override("default_color", C_SILVER)
	_combat_log.add_theme_font_size_override("normal_font_size", 12)
	log_bg.add_child(_combat_log)


func _build_player_block(parent: Node) -> void:
	var vbox := VBoxContainer.new()
	vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	vbox.add_theme_constant_override("separation", 4)
	parent.add_child(vbox)

	var ship_label := _make_label("PLAYER", 11, C_TEAL, true)
	vbox.add_child(ship_label)

	# Placeholder ship rect
	var ship_rect := ColorRect.new()
	ship_rect.color = C_TEAL
	ship_rect.custom_minimum_size = Vector2(0, 60)
	ship_rect.size_flags_vertical = Control.SIZE_EXPAND_FILL
	vbox.add_child(ship_rect)

	var ship_name_lbl := _make_label("Saltwind Drifter", 10, C_SILVER)
	vbox.add_child(ship_name_lbl)

	_player_hp_bar = _make_progress_bar(C_GREEN, Color(C_BG, 0.8))
	vbox.add_child(_player_hp_bar)

	_player_hp_label = _make_label("120 / 120", 11, C_TEXT)
	vbox.add_child(_player_hp_label)


func _build_enemy_block(parent: Node) -> void:
	var vbox := VBoxContainer.new()
	vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	vbox.add_theme_constant_override("separation", 4)
	parent.add_child(vbox)

	_enemy_family_label = _make_label("Privateers", 11, C_COPPER)
	vbox.add_child(_enemy_family_label)

	# Placeholder enemy rect
	var enemy_rect := ColorRect.new()
	enemy_rect.color = C_RED
	enemy_rect.custom_minimum_size = Vector2(0, 60)
	enemy_rect.size_flags_vertical = Control.SIZE_EXPAND_FILL
	vbox.add_child(enemy_rect)

	_enemy_name_label = _make_label("Privateer Cutter", 11, C_TEXT, true)
	vbox.add_child(_enemy_name_label)

	_enemy_hp_bar = _make_progress_bar(C_RED, Color(C_BG, 0.8))
	vbox.add_child(_enemy_hp_bar)

	_enemy_hp_label = _make_label("40 / 40", 11, C_TEXT)
	vbox.add_child(_enemy_hp_label)


func _build_status_strip(parent: Node) -> void:
	var strip := PanelContainer.new()
	strip.add_theme_stylebox_override("panel", _flat_style(Color("#0A1A26"), 8, 6))
	strip.custom_minimum_size = Vector2(0, 52)
	parent.add_child(strip)

	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 16)
	strip.add_child(hbox)

	var salvage_ico := _make_label("⚙", 14, C_COPPER)
	hbox.add_child(salvage_ico)

	_salvage_label = _make_label("0", 14, C_COPPER, true)
	hbox.add_child(_salvage_label)

	var sep := VSeparator.new()
	hbox.add_child(sep)

	var doubloon_ico := _make_label("◈", 14, C_GOLD)
	hbox.add_child(doubloon_ico)

	_doubloons_label = _make_label("0", 14, C_GOLD, true)
	hbox.add_child(_doubloons_label)

	# Spacer
	var spacer := Control.new()
	spacer.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hbox.add_child(spacer)

	# Save button (quick access)
	var save_btn := _make_button("SAVE", 13)
	save_btn.custom_minimum_size = Vector2(60, 40)
	save_btn.pressed.connect(_on_quick_save)
	hbox.add_child(save_btn)


func _build_bottom_panel(parent: Node) -> void:
	var panel := PanelContainer.new()
	panel.add_theme_stylebox_override("panel", _flat_style(C_BG, 12, 12))
	panel.size_flags_vertical = Control.SIZE_EXPAND_FILL
	parent.add_child(panel)

	var vbox := VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 8)
	panel.add_child(vbox)

	# Tab label (Sprint 01: Arsenal only)
	var tab_row := HBoxContainer.new()
	tab_row.add_theme_constant_override("separation", 4)
	vbox.add_child(tab_row)

	var arsenal_tab := _make_button("ARSENAL", 14)
	arsenal_tab.custom_minimum_size = Vector2(100, 44)
	arsenal_tab.add_theme_color_override("font_color", C_GOLD)
	tab_row.add_child(arsenal_tab)

	var debug_tab := _make_button("DEBUG", 14)
	debug_tab.custom_minimum_size = Vector2(80, 44)
	debug_tab.pressed.connect(_toggle_debug_overlay)
	tab_row.add_child(debug_tab)

	var separator := HSeparator.new()
	vbox.add_child(separator)

	_build_arsenal_panel(vbox)

	# Advance lane button (hidden until lane cleared)
	_advance_btn = _make_button("▶  ADVANCE TO NEXT LANE", 16)
	_advance_btn.custom_minimum_size = Vector2(0, 56)
	_advance_btn.add_theme_color_override("font_color", C_GOLD)
	_advance_btn.visible = false
	_advance_btn.pressed.connect(_on_advance_lane)
	vbox.add_child(_advance_btn)


func _build_arsenal_panel(parent: Node) -> void:
	var header := _make_label("ARSENAL — Long Nine Cannons", 15, C_TEXT, true)
	parent.add_child(header)

	var card := PanelContainer.new()
	card.add_theme_stylebox_override("panel", _flat_style(Color("#1C2A3E"), 12, 10))
	card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	parent.add_child(card)

	var card_vbox := VBoxContainer.new()
	card_vbox.add_theme_constant_override("separation", 6)
	card.add_child(card_vbox)

	var name_row := HBoxContainer.new()
	card_vbox.add_child(name_row)

	_upgrade_name_label = _make_label("Long Nine: Powder Charge", 14, C_TEXT, true)
	_upgrade_name_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	name_row.add_child(_upgrade_name_label)

	_upgrade_level_label = _make_label("Lv. 0", 13, C_SILVER)
	name_row.add_child(_upgrade_level_label)

	_upgrade_desc_label = _make_label("+20% cannon damage per level.", 12, C_SILVER)
	_upgrade_desc_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	card_vbox.add_child(_upgrade_desc_label)

	_upgrade_cost_label = _make_label("Cost: 50 Salvage", 13, C_COPPER)
	card_vbox.add_child(_upgrade_cost_label)

	_upgrade_buy_btn = _make_button("BUY UPGRADE", 15)
	_upgrade_buy_btn.custom_minimum_size = Vector2(0, 52)
	_upgrade_buy_btn.pressed.connect(_on_buy_upgrade)
	card_vbox.add_child(_upgrade_buy_btn)


func _build_debug_overlay() -> void:
	_debug_overlay = PanelContainer.new()
	_debug_overlay.visible = false
	_debug_overlay.set_anchors_and_offsets_preset(Control.PRESET_BOTTOM_WIDE)
	_debug_overlay.offset_top = -280
	_debug_overlay.add_theme_stylebox_override("panel", _flat_style(Color(C_DARK, 0.95), 12, 8))
	add_child(_debug_overlay)

	var vbox := VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 6)
	_debug_overlay.add_child(vbox)

	vbox.add_child(_make_label("— DEBUG OVERLAY —", 13, C_GOLD, true))

	# Speed controls
	var speed_row := HBoxContainer.new()
	speed_row.add_theme_constant_override("separation", 6)
	vbox.add_child(speed_row)
	speed_row.add_child(_make_label("Speed:", 12, C_SILVER))
	for mul in [1, 3, 10]:
		var btn := _make_button("%dx" % mul, 13)
		btn.custom_minimum_size = Vector2(50, 44)
		var m: int = mul
		btn.pressed.connect(func(): _set_speed(float(m)))
		_debug_speed_labels.append(btn)
		speed_row.add_child(btn)

	# Resource grants
	var res_row := HBoxContainer.new()
	res_row.add_theme_constant_override("separation", 6)
	vbox.add_child(res_row)
	res_row.add_child(_make_label("Salvage:", 12, C_SILVER))
	for amt in [50, 500]:
		var btn := _make_button("+%d" % amt, 13)
		btn.custom_minimum_size = Vector2(60, 44)
		var a: int = amt
		btn.pressed.connect(func(): GameState.add_resource("salvage", float(a)))
		res_row.add_child(btn)

	var dbl_row := HBoxContainer.new()
	dbl_row.add_theme_constant_override("separation", 6)
	vbox.add_child(dbl_row)
	dbl_row.add_child(_make_label("Doubloons:", 12, C_SILVER))
	for amt in [10, 100]:
		var btn := _make_button("+%d" % amt, 13)
		btn.custom_minimum_size = Vector2(60, 44)
		var a: int = amt
		btn.pressed.connect(func(): GameState.add_resource("doubloons", float(a)))
		dbl_row.add_child(btn)

	# Lane jump
	var lane_row := HBoxContainer.new()
	lane_row.add_theme_constant_override("separation", 6)
	vbox.add_child(lane_row)
	lane_row.add_child(_make_label("Lane:", 12, C_SILVER))
	for lane_id in ["lane_01", "lane_02"]:
		var btn := _make_button(lane_id.replace("lane_0", "L"), 13)
		btn.custom_minimum_size = Vector2(50, 44)
		var lid: String = lane_id
		btn.pressed.connect(func(): _debug_jump_lane(lid))
		lane_row.add_child(btn)

	# Save / Load / Reset
	var io_row := HBoxContainer.new()
	io_row.add_theme_constant_override("separation", 6)
	vbox.add_child(io_row)
	var save_btn := _make_button("SAVE", 13)
	save_btn.custom_minimum_size = Vector2(70, 44)
	save_btn.pressed.connect(SaveSystem.save_game)
	io_row.add_child(save_btn)
	var load_btn := _make_button("LOAD", 13)
	load_btn.custom_minimum_size = Vector2(70, 44)
	load_btn.pressed.connect(_debug_load)
	io_row.add_child(load_btn)
	var reset_btn := _make_button("RESET", 13)
	reset_btn.custom_minimum_size = Vector2(70, 44)
	reset_btn.add_theme_color_override("font_color", C_RED)
	reset_btn.pressed.connect(SaveSystem.reset_game)
	io_row.add_child(reset_btn)


# ─────────────────────────────────────────────────────────
#  Signal connections
# ─────────────────────────────────────────────────────────

func _connect_signals() -> void:
	# Sim combat signals
	Sim.enemy_spawned.connect(_on_enemy_spawned)
	Sim.enemy_damaged.connect(_on_enemy_damaged)
	Sim.enemy_defeated.connect(_on_enemy_defeated)
	Sim.player_damaged.connect(_on_player_damaged)
	Sim.player_hull_restored.connect(_on_player_hull_restored)
	Sim.boss_spawned.connect(_on_boss_spawned)
	Sim.boss_defeated.connect(_on_boss_defeated)
	Sim.wave_completed.connect(_on_wave_completed)
	Sim.lane_completed.connect(_on_lane_completed)
	Sim.combat_log.connect(_on_combat_log)
	Sim.counter_hint.connect(_on_counter_hint)

	# GameState signals
	GameState.resource_changed.connect(_on_resource_changed)
	GameState.upgrade_purchased.connect(_on_upgrade_purchased)
	GameState.lane_unlocked.connect(_on_lane_unlocked)


# ─────────────────────────────────────────────────────────
#  Sim signal handlers
# ─────────────────────────────────────────────────────────

func _on_enemy_spawned(enemy_def: Dictionary, max_hull: float) -> void:
	_enemy_name_label.text = enemy_def.get("display_name", "?")
	_enemy_family_label.text = enemy_def.get("family", "?")
	_enemy_hp_bar.max_value = max_hull
	_enemy_hp_bar.value = max_hull
	_enemy_hp_label.text = "%s / %s" % [Balance.format_number(max_hull), Balance.format_number(max_hull)]
	_enemy_counter_label.visible = false
	_boss_banner.visible = false


func _on_enemy_damaged(current: float, maximum: float, damage: float, evaded: bool) -> void:
	_enemy_hp_bar.value = current
	_enemy_hp_label.text = "%s / %s" % [Balance.format_number(current), Balance.format_number(maximum)]
	if evaded:
		_append_log("[color=#CDD9D9]— Evaded![/color]")


func _on_enemy_defeated(enemy_def: Dictionary, rewards: Dictionary) -> void:
	_enemy_hp_bar.value = 0.0
	_enemy_hp_label.text = "0 / ?"


func _on_player_damaged(current: float, maximum: float, _damage: float) -> void:
	_player_hp_bar.value = current
	_player_hp_label.text = "%s / %s" % [Balance.format_number(current), Balance.format_number(maximum)]
	if current / maximum < 0.25:
		_player_hp_bar.modulate = C_RED
	elif current / maximum < 0.5:
		_player_hp_bar.modulate = C_GOLD
	else:
		_player_hp_bar.modulate = Color.WHITE


func _on_player_hull_restored(current: float, maximum: float) -> void:
	_player_hp_bar.value = current
	_player_hp_bar.max_value = maximum
	_player_hp_label.text = "%s / %s" % [Balance.format_number(current), Balance.format_number(maximum)]
	_player_hp_bar.modulate = Color.WHITE


func _on_boss_spawned(boss_def: Dictionary, max_hull: float) -> void:
	_on_enemy_spawned(boss_def, max_hull)
	_boss_banner.visible = true
	_wave_label.text = "BOSS"
	_enemy_name_label.add_theme_color_override("font_color", C_GOLD)
	_append_log("[color=#F2B134]⚔ Boss phase![/color]")


func _on_boss_defeated(_boss_def: Dictionary) -> void:
	_boss_banner.visible = false
	_enemy_name_label.remove_theme_color_override("font_color")


func _on_wave_completed(wave_index: int) -> void:
	_wave_label.text = "Wave %d/%d" % [wave_index + 1, Definitions.get_lane(_current_lane_id).get("wave_count", 3)]


func _on_lane_completed(lane_id: String, next_lane_id: String) -> void:
	_next_lane_id = next_lane_id
	_wave_label.text = "CLEAR!"
	_boss_banner.visible = false
	if next_lane_id != "":
		_advance_btn.text = "▶  ADVANCE TO %s" % next_lane_id.replace("lane_0", "LANE ").to_upper()
		_advance_btn.visible = true
		_append_log("[color=#6BC56B]Lane cleared! Advance when ready.[/color]")
	else:
		_append_log("[color=#6BC56B]Lane cleared![/color]")


func _on_combat_log(message: String) -> void:
	_append_log(message)


func _on_counter_hint(hint: String) -> void:
	_enemy_counter_label.text = "⚠ " + hint
	_enemy_counter_label.visible = true


# ─────────────────────────────────────────────────────────
#  GameState signal handlers
# ─────────────────────────────────────────────────────────

func _on_resource_changed(resource_id: String, amount: float) -> void:
	match resource_id:
		"salvage":
			_salvage_label.text = Balance.format_number(amount)
			_refresh_arsenal_ui()
		"doubloons":
			_doubloons_label.text = Balance.format_number(amount)


func _on_upgrade_purchased(_upgrade_id: String, _level: int) -> void:
	_refresh_arsenal_ui()


func _on_lane_unlocked(lane_id: String) -> void:
	_append_log("[color=#22A6A1]Unlocked: %s[/color]" % lane_id)


# ─────────────────────────────────────────────────────────
#  Arsenal logic
# ─────────────────────────────────────────────────────────

func _on_buy_upgrade() -> void:
	var upgrade_def := Definitions.get_upgrade_for_weapon("long_nine_cannons")
	if upgrade_def.is_empty():
		return
	var upgrade_id: String = upgrade_def.get("id", "")
	var current_level := GameState.get_upgrade_level(upgrade_id)
	var max_level: int = upgrade_def.get("max_level", 10)
	if current_level >= max_level:
		_append_log("Long Nine Cannons already at max level.")
		return
	var cost := Balance.upgrade_cost(
		upgrade_def.get("base_cost", 50.0),
		upgrade_def.get("cost_scale", 2.0),
		current_level
	)
	var resource_id: String = upgrade_def.get("cost_resource", "salvage")
	if not GameState.can_afford(resource_id, cost):
		_append_log("Need %s %s" % [Balance.format_number(cost), resource_id])
		return
	GameState.spend_resource(resource_id, cost)
	GameState.set_upgrade_level(upgrade_id, current_level + 1)
	_append_log("[color=#F2B134]Long Nine upgraded to Lv.%d![/color]" % (current_level + 1))


func _refresh_arsenal_ui() -> void:
	var upgrade_def := Definitions.get_upgrade_for_weapon("long_nine_cannons")
	if upgrade_def.is_empty():
		return
	var upgrade_id: String = upgrade_def.get("id", "")
	var level := GameState.get_upgrade_level(upgrade_id)
	var max_level: int = upgrade_def.get("max_level", 10)
	var cost := Balance.upgrade_cost(upgrade_def.get("base_cost", 50.0), upgrade_def.get("cost_scale", 2.0), level)
	var resource_id: String = upgrade_def.get("cost_resource", "salvage")

	_upgrade_level_label.text = "Lv. %d" % level
	if level >= max_level:
		_upgrade_cost_label.text = "MAXED"
		_upgrade_buy_btn.disabled = true
	else:
		_upgrade_cost_label.text = "Cost: %s %s" % [Balance.format_number(cost), resource_id]
		_upgrade_buy_btn.disabled = not GameState.can_afford(resource_id, cost)

	# Show current effective damage
	var weapon_def := Definitions.get_weapon("long_nine_cannons")
	var dmg := Balance.weapon_damage(weapon_def, level)
	_upgrade_desc_label.text = "+20%% cannon dmg/level  |  Current: %.1f dmg/shot" % dmg


# ─────────────────────────────────────────────────────────
#  Lane advance
# ─────────────────────────────────────────────────────────

func _on_advance_lane() -> void:
	if _next_lane_id == "" or not GameState.is_lane_unlocked(_next_lane_id):
		return
	_advance_btn.visible = false
	_current_lane_id = _next_lane_id
	_next_lane_id = ""
	GameState.set_current_lane(_current_lane_id)
	_refresh_lane_label()
	Sim.start_combat()


func _refresh_lane_label() -> void:
	var lane_def := Definitions.get_lane(_current_lane_id)
	_lane_label.text = lane_def.get("display_name", _current_lane_id)
	var wave_count: int = lane_def.get("wave_count", 3)
	_wave_label.text = "Wave 1/%d" % wave_count


# ─────────────────────────────────────────────────────────
#  Debug overlay
# ─────────────────────────────────────────────────────────

func _toggle_debug_overlay() -> void:
	_debug_overlay.visible = not _debug_overlay.visible


func _on_quick_save() -> void:
	SaveSystem.save_game()
	_append_log("[color=#6BC56B]Game saved.[/color]")


func _set_speed(multiplier: float) -> void:
	GameState.settings["speed_multiplier"] = multiplier
	_append_log("Speed: %.0fx" % multiplier)


func _debug_jump_lane(lane_id: String) -> void:
	_advance_btn.visible = false
	_current_lane_id = lane_id
	_next_lane_id = ""
	# Force-unlock for debug
	if not GameState.is_lane_unlocked(lane_id):
		GameState.persistent["unlocked_lanes"].append(lane_id)
	GameState.set_current_lane(lane_id)
	_refresh_lane_label()
	Sim.start_combat()
	_append_log("[color=#CDD9D9]DEBUG: jumped to %s[/color]" % lane_id)


func _debug_load() -> void:
	SaveSystem.load_game()
	_current_lane_id = GameState.get_current_lane()
	_refresh_lane_label()
	_refresh_all_resources()
	_refresh_arsenal_ui()
	Sim.restore_combat_state()
	_append_log("[color=#22A6A1]Game loaded.[/color]")


# ─────────────────────────────────────────────────────────
#  Refresh helpers
# ─────────────────────────────────────────────────────────

func _refresh_all_resources() -> void:
	_salvage_label.text   = Balance.format_number(GameState.get_resource("salvage"))
	_doubloons_label.text = Balance.format_number(GameState.get_resource("doubloons"))

	# Player hull
	var max_hull := GameState.get_player_max_hull()
	var cur_hull := GameState.get_player_hull()
	_player_hp_bar.max_value = max_hull
	_player_hp_bar.value = cur_hull
	_player_hp_label.text = "%s / %s" % [Balance.format_number(cur_hull), Balance.format_number(max_hull)]


func _append_log(message: String) -> void:
	_log_lines.append(message)
	if _log_lines.size() > LOG_MAX:
		_log_lines.pop_front()
	_combat_log.text = ""
	for line in _log_lines:
		_combat_log.append_text(line + "\n")


# ─────────────────────────────────────────────────────────
#  UI factory helpers
# ─────────────────────────────────────────────────────────

func _make_label(text: String, font_size: int, color: Color, bold: bool = false) -> Label:
	var lbl := Label.new()
	lbl.text = text
	lbl.add_theme_font_size_override("font_size", font_size)
	lbl.add_theme_color_override("font_color", color)
	if bold:
		lbl.add_theme_color_override("font_shadow_color", Color(0, 0, 0, 0.4))
	return lbl


func _make_button(text: String, font_size: int) -> Button:
	var btn := Button.new()
	btn.text = text
	btn.add_theme_font_size_override("font_size", font_size)
	var style := _flat_style(Color("#243048"))
	style.corner_radius_top_left = 4
	style.corner_radius_top_right = 4
	style.corner_radius_bottom_left = 4
	style.corner_radius_bottom_right = 4
	btn.add_theme_stylebox_override("normal", style)
	var hover_style := _flat_style(Color("#2E3D5C"))
	hover_style.corner_radius_top_left = 4
	hover_style.corner_radius_top_right = 4
	hover_style.corner_radius_bottom_left = 4
	hover_style.corner_radius_bottom_right = 4
	btn.add_theme_stylebox_override("hover", hover_style)
	return btn


func _make_progress_bar(fill_color: Color, bg_color: Color) -> ProgressBar:
	var bar := ProgressBar.new()
	bar.min_value = 0.0
	bar.max_value = 100.0
	bar.value = 100.0
	bar.show_percentage = false
	bar.custom_minimum_size = Vector2(0, 12)
	var fill_style := _flat_style(fill_color)
	fill_style.corner_radius_top_left = 2
	fill_style.corner_radius_top_right = 2
	fill_style.corner_radius_bottom_left = 2
	fill_style.corner_radius_bottom_right = 2
	var bg_style := _flat_style(bg_color)
	bg_style.corner_radius_top_left = 2
	bg_style.corner_radius_top_right = 2
	bg_style.corner_radius_bottom_left = 2
	bg_style.corner_radius_bottom_right = 2
	bar.add_theme_stylebox_override("fill", fill_style)
	bar.add_theme_stylebox_override("background", bg_style)
	return bar


func _flat_style(color: Color, pad_h: int = 0, pad_v: int = 0) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = color
	if pad_h > 0 or pad_v > 0:
		style.content_margin_left   = pad_h
		style.content_margin_right  = pad_h
		style.content_margin_top    = pad_v
		style.content_margin_bottom = pad_v
	return style


func _set_margin(node: Control, left: int, top: int, right: int, bottom: int) -> void:
	# Only works on MarginContainer. For PanelContainer use content_margin on the StyleBox.
	node.add_theme_constant_override("margin_left",   left)
	node.add_theme_constant_override("margin_top",    top)
	node.add_theme_constant_override("margin_right",  right)
	node.add_theme_constant_override("margin_bottom", bottom)
