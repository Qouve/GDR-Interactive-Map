export type CategoryConfig = {
  label: string
  group: 'Resources' | 'Interactions' | 'Locations' | 'Regions' | 'Debug' | 'Other'
  icon?: string
  color: string
}

export const categoryConfig: Record<string, CategoryConfig> = {
  wood: { label: 'Wood', group: 'Resources', icon: 'wood', color: '#bb8a55' },
  stone: { label: 'Stone', group: 'Resources', icon: 'stone', color: '#a9a9a2' },
  bone: { label: 'Bone', group: 'Resources', icon: 'bone', color: '#e3d8bc' },
  bifrost: { label: 'Bifrost', group: 'Resources', icon: 'bifrost', color: '#8ad8de' },
  moss: { label: 'Moss', group: 'Resources', icon: 'moss', color: '#71955d' },
  mushroom: { label: 'Mushrooms', group: 'Resources', icon: 'mushroom', color: '#ce8f62' },
  iron: { label: 'Iron ore', group: 'Resources', icon: 'iron_ore', color: '#849aa2' },
  iron_ore: { label: 'Iron ore', group: 'Resources', icon: 'iron_ore', color: '#849aa2' },
  altar: { label: 'Altars', group: 'Interactions', icon: 'altar_damage', color: '#cf815f' },
  chest: { label: 'Chests', group: 'Interactions', icon: 'chest', color: '#d2a15c' },
  rack_armor: { label: 'Armor racks', group: 'Interactions', icon: 'rack_armor', color: '#8da7b3' },
  rack_weapon: { label: 'Weapon racks', group: 'Interactions', icon: 'rack_weapon', color: '#8da7b3' },
  teleport_pad: { label: 'Teleport pads', group: 'Interactions', icon: 'teleport_pad', color: '#9f8cd5' },
  boss: { label: 'Bosses', group: 'Locations', icon: 'boss', color: '#d86b5d' },
  dungeon: { label: 'Dungeon (unclassified)', group: 'Locations', icon: 'dungeon', color: '#b995d1' },
  dungeon_entry: { label: 'Dungeon entrances', group: 'Locations', icon: 'dungeon', color: '#b995d1' },
  dungeon_exit: { label: 'Dungeon exits', group: 'Locations', icon: 'dungeon', color: '#9275aa' },
  obelisk: { label: 'Obelisk (unclassified)', group: 'Locations', icon: 'obelisk', color: '#7dbbc0' },
  obelisk_free: { label: 'Obelisks · Free', group: 'Locations', icon: 'obelisk_free', color: '#77bca4' },
  obelisk_combat: { label: 'Obelisks · Combat', group: 'Locations', icon: 'obelisk_combat', color: '#c98568' },
  obelisk_locked: { label: 'Obelisks · Locked', group: 'Locations', icon: 'obelisk_locked', color: '#9886bd' },
  spawnpoint: { label: 'Spawn points', group: 'Locations', icon: 'spawnpoint', color: '#d9c86b' },
  seal: { label: 'Seals & totems', group: 'Locations', icon: 'seal', color: '#d6ae73' },
  sigil: { label: 'Sigils', group: 'Resources', icon: 'sigil', color: '#b1cf85' },
  torkel: { label: 'Dreadspawn / Torkel', group: 'Locations', icon: 'boss', color: '#bd675f' },
  ratatoskr_stash: { label: 'Ratatoskr stashes', group: 'Locations', icon: 'sad_nuts', color: '#c89259' },
  region: { label: 'Region labels', group: 'Regions', color: '#e4dcc6' },
  unknown: { label: 'Unknown', group: 'Debug', color: '#8a8a84' },
}

export const groupOrder = ['Resources', 'Interactions', 'Locations', 'Regions', 'Debug'] as const

export function getCategoryConfig(category: string): CategoryConfig {
  return (
    categoryConfig[category] ?? {
      label: category.replaceAll('_', ' '),
      group: 'Other',
      color: '#8a8a84',
    }
  )
}
