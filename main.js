import { map, loadMap } from "./src/map.js";
import { initFilters, initSettings } from "./src/ui.js";
import { maps, layerMaps } from "./src/data.js";
import { GameState } from "./src/state.js";

// init
maps.midgard.addTo(map);
loadMap("midgard");
L.control.layers(layerMaps, null, { collapsed: false }).addTo(map);

// input
map.on('baselayerchange', e => {
  loadMap(e.name.toLowerCase());
});

initFilters(map, GameState.currentMap);
initSettings(map);