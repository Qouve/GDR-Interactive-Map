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
        }).bindPopup(m.name + " at ["+m.x+","+m.y+"]");
        const layer = markerLayers[name][m.category];
        if (!layer) {
          console.error(name, "is missing category", m.category);
          return;
        }
        layer.addLayer(marker);
      });

      // Todo add regions to a custom regions.json for each map
      //const polygon = L.polygon([
      //  [2119, 2800],
      //], { opacity: 0, fill: 0 }).addTo(map);

      //polygon.bindTooltip("Test", {
      //  permanent: true,
      //  direction: "center",
      //  className: "region-label"
      //});

      //polygon.addTo(map);

      Object.entries(markerLayers[name]).forEach(([cat, layer]) => {
        if (isCategoryActive(cat)) {
          layer.addTo(map);
        }
      });
    });
}