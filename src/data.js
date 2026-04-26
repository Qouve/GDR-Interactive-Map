export const mapBounds = {
  midgard: [[0, 0], [4096, 4096]],
  helheim: [[0, 0], [5120, 5120]]
};

export const maps = {
  midgard: L.imageOverlay('maps/midgard.png', mapBounds.midgard),
  helheim: L.imageOverlay('maps/helheim.png', mapBounds.helheim)
};

export const markerLayers = {
  midgard: { wood: L.layerGroup() },
  helheim: { wood: L.layerGroup() }
};

export const layerMaps = { 
  "Midgard": maps.midgard,
  "Helheim": maps.helheim 
};