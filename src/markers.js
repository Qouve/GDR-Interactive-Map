import { icons } from "./icons.js";
import { isCategoryActive } from "./ui.js";
import { markerLayers } from "./data.js";

function clear() {
  Object.values(markerLayers).forEach(m =>
    Object.values(m).forEach(l => l.clearLayers())
  );
}

export function loadMarkers(map, name) {
  
  clear();

  fetch(`data/${name}.json`)
    .then(r => r.json())
    .then(data => {
      data.forEach(m => {
        const marker = L.marker([m.y, m.x], {
          icon: icons[m.category] || icons.default
        }).bindPopup(m.name);
        markerLayers[name][m.category].addLayer(marker);
      });

      Object.entries(markerLayers[name]).forEach(([cat, layer]) => {
        if (isCategoryActive(cat)) {
          layer.addTo(map);
        }
      });
    });
}