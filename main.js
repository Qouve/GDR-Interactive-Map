import { map, loadMap } from "./src/map.js";
import { initFilters, initSettings } from "./src/ui.js";
import { maps, layerMaps } from "./src/data.js";
import { GameState, loadLastLoadedMap, loadSetting } from "./src/state.js";

// init
let lastLoadedMap = loadLastLoadedMap();
if (!lastLoadedMap || !Object.hasOwn(maps, lastLoadedMap)) {
  lastLoadedMap = "midgard";
}

maps[lastLoadedMap].addTo(map);
loadMap(lastLoadedMap);

L.control.layers(layerMaps, null, { collapsed: false }).addTo(map);

// input
map.on('baselayerchange', e => {
  loadMap(e.name.toLowerCase());
});

initFilters(map, GameState.currentMap);
initSettings(map);

const isUnstableActive = loadSetting("isUnstableActive");
const checkbox = document.getElementById("map-type");

checkbox.checked = !!isUnstableActive;
checkbox.dispatchEvent(new Event('change', { bubbles: true }));