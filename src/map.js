import { GameState, saveLastLoadedMap } from "./state.js";
import { mapBounds } from "./data.js";
import { loadMarkers } from "./markers.js";
import { buildFilters } from "./ui.js";
import { mapToWorld, getMapOrientation } from "./markers.js";

export const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -3,
  maxZoom: 3,
  zoomSnap: 0,
  zoomDelta: 0.5,
  rotate: true,
});

map.setView([2048, 2048], 0);
map.setBearing(135);

const coordinateControl = L.control({
    position: "bottomleft"
});

let currentWorldPos = null;

document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() === "s" && currentWorldPos) {
        const text = JSON.stringify({
            x: currentWorldPos.x,
            y: currentWorldPos.y
        }, null, 2);

        navigator.clipboard.writeText(text);

        console.log("Koordinaten kopiert:", text);
    }
});

coordinateControl.onAdd = function () {
    const div = L.DomUtil.create("div", "map-coordinates");

    div.innerHTML = "X: 0 Y: 0";

    map.on("mousemove", e => {
        currentWorldPos = mapToWorld(
            {
                x: e.latlng.lng,
                y: e.latlng.lat
            },
            GameState.mapData.center,
            GameState.mapData.textureSize,
            GameState.mapData.captureSize,
            getMapOrientation(GameState.mapData.orientation),
        );

        div.innerHTML = `
        X: ${currentWorldPos.x.toFixed(2)}
        &nbsp; Y: ${currentWorldPos.y.toFixed(2)}
        <br>
        Lat: ${e.latlng.lat.toFixed(2)}
        &nbsp; Lng: ${e.latlng.lng.toFixed(2)}
    `;
    });

    return div;
};

coordinateControl.addTo(map);

export async function loadMap(name) {
  saveLastLoadedMap(name);
  GameState.currentMap = name;
  const path = `data/${name}/`;
  GameState.mapData = await(await fetch(path + "map.json")).json();
  map.fitBounds(mapBounds[name], { animate: false});
  map.setBearing(GameState.mapData.rotation ?? 0);
  buildFilters(map, name);
  loadMarkers(map, name);
}

