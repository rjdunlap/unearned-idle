# Data Schemas

This folder documents the expected shape of each JSON definition file in `data/definitions/`.

## resources.json

```json
{
  "items": [
    {
      "id": "string — unique key used in code",
      "display_name": "string — shown in UI",
      "color": "#hexstring — from visual bible palette",
      "persistence_tier": "run | voyage_permanent | charter_permanent | account",
      "icon": "string — placeholder asset key",
      "description": "string — tooltip text"
    }
  ]
}
```

## ships.json

```json
{
  "items": [
    {
      "id": "string",
      "display_name": "string",
      "hull": "float — max HP",
      "ward_reduction": "float [0,1] — fraction of occult damage blocked",
      "speed": "float — lane speed multiplier",
      "weapon_id": "string — default weapon for this ship",
      "description": "string"
    }
  ]
}
```

## enemies.json

```json
{
  "items": [
    {
      "id": "string",
      "display_name": "string",
      "family": "Privateers | Ironclads | Hexed Corsairs | Reef Beasts",
      "hull": "float — max HP",
      "armor_reduction": "float [0,1] — fraction of cannon/physical damage blocked",
      "ward_reduction": "float [0,1] — fraction of occult damage blocked",
      "evasion": "float [0,1] — chance to completely dodge a hit",
      "damage": "float — raw damage per attack",
      "fire_rate_ticks": "int — ticks between attacks (10 ticks = 1 second)",
      "rewards": {
        "salvage": "float",
        "doubloons": "float (optional)"
      },
      "description": "string"
    }
  ]
}
```

## lanes.json

```json
{
  "items": [
    {
      "id": "string",
      "display_name": "string",
      "region": "string — sea region name",
      "wave_count": "int — number of wave enemies before boss",
      "wave_enemies": ["enemy_id", "..."],
      "boss": {
        "id": "string",
        "display_name": "string",
        "... (same fields as enemies.json item)"
      },
      "unlocks_lane": "string — lane_id unlocked on boss clear",
      "description": "string"
    }
  ]
}
```

## weapons.json

```json
{
  "items": [
    {
      "id": "string",
      "display_name": "string",
      "damage_type": "cannon | harpoon | fire | occult | chain",
      "base_damage": "float — damage at level 0",
      "damage_scale_per_level": "float — fractional damage multiplier per upgrade level",
      "fire_rate_ticks": "int — ticks between shots",
      "strong_vs": ["string", "..."],
      "weak_vs": ["string", "..."],
      "description": "string"
    }
  ]
}
```

## upgrades.json

```json
{
  "items": [
    {
      "id": "string",
      "display_name": "string",
      "description": "string",
      "target_weapon": "string — weapon_id this upgrade applies to",
      "cost_resource": "string — resource_id spent to buy",
      "base_cost": "float — cost at level 0",
      "cost_scale": "float — cost multiplier per level (cost = base * scale^level)",
      "max_level": "int",
      "effect": "string — effect key for the combat system",
      "effect_note": "string — human-readable formula note"
    }
  ]
}
```

## Tick Rate Reference

The simulation runs at **10 ticks per second**.

- `fire_rate_ticks: 10` = fires every 1.0 second
- `fire_rate_ticks: 15` = fires every 1.5 seconds
- `fire_rate_ticks: 20` = fires every 2.0 seconds
