import { icons } from "./icons.js";
import { isCategoryActive, isUnstableActive } from "./ui.js";
import { markerLayers } from "./data.js";

function clear() {
  Object.values(markerLayers).forEach(m =>
    Object.values(m).forEach(l => l.clearLayers())
  );
}

export const MapOrientation = Object.freeze({
    NORMAL: "normal",
    FLIP_X: "flip_x",
    FLIP_Y: "flip_y",
    FLIP_XY: "flip_xy",
    SWAP: "swap",
    SWAP_FLIP_X: "swap_flip_x",
    SWAP_FLIP_Y: "swap_flip_y",
    SWAP_FLIP_XY: "swap_flip_xy"
});

export function getMapOrientation(value) {
  const key = Object.keys(MapOrientation).find(
    key => MapOrientation[key] === value
  );

  return key ? MapOrientation[key] : MapOrientation.NORMAL;
}

const MAP_CENTER_X = -41803.523;
const MAP_CENTER_Y = -45084.605;

const CAPTURE_SIZE = 80000.0;
const TEXTURE_SIZE = 4096.0;

/**
 * @param {{x:number, y:number}} worldPos
 * @param {{x:number, y:number}} worldCenter
 * @param {{x:number, y:number}} textureSize
 * @param {{x:number, y:number}} captureSize
 * @param {string} orientation
 *
 * @returns {{x:number, y:number}}
 */
export function worldToMap(
    worldPos,
    worldCenter,
    textureSize,
    captureSize,
    orientation = MapOrientation.NORMAL
) {
    const dx = (worldPos.x - worldCenter.x) / captureSize.x;
    const dy = (worldPos.y - worldCenter.y) / captureSize.y;

    let u;
    let v;

    switch (orientation) {
        case MapOrientation.FLIP_X:
            u = 0.5 - dx;
            v = 0.5 + dy;
            break;

        case MapOrientation.FLIP_Y:
            u = 0.5 + dx;
            v = 0.5 - dy;
            break;

        case MapOrientation.FLIP_XY:
            u = 0.5 - dx;
            v = 0.5 - dy;
            break;

        case MapOrientation.SWAP:
            u = 0.5 + dy;
            v = 0.5 + dx;
            break;

        case MapOrientation.SWAP_FLIP_X:
            u = 0.5 - dy;
            v = 0.5 + dx;
            break;

        case MapOrientation.SWAP_FLIP_Y:
            u = 0.5 + dy;
            v = 0.5 - dx;
            break;

        case MapOrientation.SWAP_FLIP_XY:
            u = 0.5 - dy;
            v = 0.5 - dx;
            break;

        case MapOrientation.NORMAL:
        default:
            u = 0.5 + dx;
            v = 0.5 + dy;
            break;
    }

    return {
        x: u * textureSize.x,
        y: v * textureSize.y
    };
}

export function mapToWorld(
    mapPos,
    worldCenter,
    textureSize,
    captureSize,
    orientation = MapOrientation.NORMAL
) {
    const u = mapPos.x / textureSize.x;
    const v = mapPos.y / textureSize.y;

    let dx;
    let dy;

    switch (orientation) {
        case MapOrientation.FLIP_X:
            dx = 0.5 - u;
            dy = v - 0.5;
            break;

        case MapOrientation.FLIP_Y:
            dx = u - 0.5;
            dy = 0.5 - v;
            break;

        case MapOrientation.FLIP_XY:
            dx = 0.5 - u;
            dy = 0.5 - v;
            break;

        case MapOrientation.SWAP:
            dx = v - 0.5;
            dy = u - 0.5;
            break;

        case MapOrientation.SWAP_FLIP_X:
            dx = v - 0.5;
            dy = 0.5 - u;
            break;

        case MapOrientation.SWAP_FLIP_Y:
            dx = 0.5 - v;
            dy = u - 0.5;
            break;

        case MapOrientation.SWAP_FLIP_XY:
            dx = 0.5 - v;
            dy = 0.5 - u;
            break;

        case MapOrientation.NORMAL:
        default:
            dx = u - 0.5;
            dy = v - 0.5;
            break;
    }

    return {
        x: worldCenter.x + dx * captureSize.x,
        y: worldCenter.y + dy * captureSize.y
    };
}

export async function loadMarkers(map, name) {
  clear();

  const path = `data/${name}/`;

  const mapData = await(await fetch(path + "map.json")).json();

  let markers = [];

    if (isUnstableActive()) {
        const markerData = await fetch(path + "unstables.json");
        markers = await markerData.json();
    } else {
        const indexResponse = await fetch(path + "stables/index.json");
        const files = await indexResponse.json();

        const markerFiles = await Promise.all(
            files.map(file =>
            fetch(path + "stables/" + file)
                .then(response => response.json())
            )
        );

        markers = markerFiles.flat();
    }

  const markerData = await fetch(path + (isUnstableActive() ? "unstables.json" : "stables.json"));
  const regionData = await fetch(path + "regions.json");
  
  const regions = await regionData.json();

  markers.forEach(m => {
    
const worldPos = {
    x: m.x,
    y: m.y
};
    const newPixels = worldToMap(
    worldPos,
    mapData.center,
    mapData.textureSize,
    mapData.captureSize,
    getMapOrientation(mapData.orientation),
);
    const marker = L.marker([newPixels.y, newPixels.x], {
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
    
    const newPixels = worldToMap(
    { x: region.x, y: region.y},
    mapData.center,
    mapData.textureSize,
    mapData.captureSize,
    getMapOrientation(mapData.orientation),
);

    const label = L.tooltip({
        permanent: true,
        direction: "center",
        className: "region-label",
        interactive: false,
        offset: region.offset
            ? [region.offset.x, region.offset.y]
            : [0, 0]
    })
    .setLatLng([newPixels.y, newPixels.x])
    .setContent(region.name);
    const layer = markerLayers[name][region.category];
    if (!layer) {
      console.error(name, "is missing category", region.category);
      return;
    }

    layer.addLayer(label);
  });

  Object.entries(markerLayers[name]).forEach(([cat, layer]) => {
    if (isCategoryActive(cat)) {
      layer.addTo(map);
    }
  });
}