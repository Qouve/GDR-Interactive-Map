import { GameState } from "./state.js";
import { mapBounds } from "./data.js";
import { loadMarkers } from "./markers.js";
import { buildFilters } from "./ui.js";

export const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -3
});

export function loadMap(name) {
  GameState.currentMap = name;
  map.fitBounds(mapBounds[name]);
  buildFilters(name);
  loadMarkers(map, name);
}

