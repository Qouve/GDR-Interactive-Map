import { GameState } from "./state.js";
import { markerLayers } from "./data.js";

export function isCategoryActive(category) {
  return document.querySelector(`input[value="${category}"]`)?.checked;
}

function applyFilters(map, name) {
  Object.entries(markerLayers[name]).forEach(([cat, layer]) => {
    if (isCategoryActive(cat)) {
      if (!map.hasLayer(layer)) {
        map.addLayer(layer);
      }
    } else {
      if (map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    }
  });
}

export function initFilters(map) {
  document.querySelectorAll('#sidebar input').forEach(cb => {
    cb.addEventListener('change', () => {
      applyFilters(map, GameState.currentMap);
    });
  });
}

export function buildFilters(map) {

  const container = document.getElementById("filters");
  container.innerHTML = "";

  Object.keys(markerLayers[map]).forEach(cat => {

    const label = document.createElement("label");

    label.innerHTML = `
      <input type="checkbox" value="${cat}" checked>
      ${cat}
    `;

    container.appendChild(label);
  });
}