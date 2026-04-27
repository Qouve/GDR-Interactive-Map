import { icons } from "./icons.js";
import { isCategoryActive, isUnstableActive } from "./ui.js";
import { markerLayers } from "./data.js";

function clear() {
  Object.values(markerLayers).forEach(m =>
    Object.values(m).forEach(l => l.clearLayers())
  );
}

export async function loadMarkers(map, name) {

  clear();

  const path = `data/${name}/`;

  const markerData = await fetch(path + (isUnstableActive() ? "unstables.json" : "stables.json"));
  const regionData = await fetch(path + "regions.json");
  
  const markers = await markerData.json();
  const regions = await regionData.json();

  markers.forEach(m => {
    const marker = L.marker([m.y, m.x], {
      icon: icons[m.category] || icons.default
    }).bindPopup(m.name);
    const layer = markerLayers[name][m.category];
    if (!layer) {
      console.error(name, "is missing category", m.category);
      return;
    }
    layer.addLayer(marker);
  });

  regions.forEach(region => {
    const polygon = L.marker([region.y, region.x], { opacity: 0, fill: 0});

    polygon.bindTooltip(region.name, {
      permanent: true,
      direction: "center",
      className: "region-label",
      offset: region.offset ? [region.offset.x, region.offset.y] : [0,0]
    });

    const layer = markerLayers[name][region.category];
    if (!layer) {
      console.error(name, "is missing category", region.category);
      return;
    }

    layer.addLayer(polygon);
  });

  Object.entries(markerLayers[name]).forEach(([cat, layer]) => {
    if (isCategoryActive(cat)) {
      layer.addTo(map);
    }
  });
}