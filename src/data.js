export const mapBounds = {
  midgard: [[0, 0], [4096, 4096]],
  helheim: [[0, 0], [5120, 5120]]
};

export const maps = {
  midgard: L.imageOverlay('maps/midgard.png', mapBounds.midgard),
  helheim: L.imageOverlay('maps/helheim.png', mapBounds.helheim)
};

export const markerLayers = {
  midgard: {
    wood: L.layerGroup(),
    stone: L.layerGroup(),
    bone: L.layerGroup(),
    bifrost: L.layerGroup(),
    moss: L.layerGroup(),
    mushroom: L.layerGroup(),
    iron_ore: L.layerGroup(),
    leather: L.layerGroup(),
    altar: L.layerGroup(),
    chest: L.layerGroup(),
    rack_armor: L.layerGroup(),
    rack_weapon: L.layerGroup(),
    teleport_pad: L.layerGroup(),
    seal: L.layerGroup(),
    boss: L.layerGroup(),
    spawnpoint: L.layerGroup(),
    dungeon: L.layerGroup(),
    obelisk: L.layerGroup(),
    valleysigil: L.layerGroup(),
  },
  helheim: {
    wood: L.layerGroup(),
    stone: L.layerGroup(),
    bone: L.layerGroup(),
    bifrost: L.layerGroup(),
    moss: L.layerGroup(),
    mushroom: L.layerGroup(),
    iron_ore: L.layerGroup(),
    leather: L.layerGroup(),
    altar: L.layerGroup(),
    chest: L.layerGroup(),
    rack_armor: L.layerGroup(),
    rack_weapon: L.layerGroup(),
    teleport_pad: L.layerGroup(),
    seal: L.layerGroup(),
    boss: L.layerGroup(),
    spawnpoint: L.layerGroup(),
    dungeon: L.layerGroup(),
    obelisk: L.layerGroup(),
    valleysigil: L.layerGroup(),
    torkel: L.layerGroup(),
  }
};

export const uiCategories = {
  resources: 'Resources',
  interactables: 'Interactables',
  misc: 'Misc',
  unknown: 'Unknown (Missing configuration)',
}

export const uiCategoryOrder = [
  uiCategories.resources,
  uiCategories.interactables,
  uiCategories.misc,
  uiCategories.unknown,
];

export const uiLayers = {
  wood: {
    name: 'Wood',
    category: uiCategories.resources,
  },
  stone: {
    name: 'Stone',
    category: uiCategories.resources,
  },
  bone: {
    name: 'Bone',
    category: uiCategories.resources,
  },
  bifrost: {
    name: 'Bifrost',
    category: uiCategories.resources,
  },
  moss: {
    name: 'Moss',
    category: uiCategories.resources,
  },
  mushroom: {
    name: 'Mushroom',
    category: uiCategories.resources,
  },
  iron_ore: {
    name: 'Iron Ore',
    category: uiCategories.resources,
  },
  leather: {
    name: 'Leather',
    category: uiCategories.resources,
  },
  altar: {
    name: 'Altar (Damage, Speed, Health)',
    category: uiCategories.interactables,
  },
  chest: {
    name: 'Chest',
    category: uiCategories.interactables,
  },
  rack_armor: {
    name: 'Rack (Armor)',
    category: uiCategories.interactables,
  },
  rack_weapon: {
    name: 'Rack (Weapon)',
    category: uiCategories.interactables,
  },
  teleport_pad: {
    name: 'Teleport Pad',
    category: uiCategories.interactables,
  },
  seal: {
    name: 'Seal/Totem',
    category: uiCategories.misc,
  },
  boss: {
    name: 'Boss',
    category: uiCategories.misc,
  },
  spawnpoint: {
    name: 'Spawnpoint',
    category: uiCategories.misc,
  },
  dungeon: {
    name: 'Dungeon',
    category: uiCategories.misc,
  },
  obelisk: {
    name: 'Obelisk',
    category: uiCategories.misc,
  },
}

export const layerMaps = {
  "Midgard": maps.midgard,
  "Helheim": maps.helheim
};