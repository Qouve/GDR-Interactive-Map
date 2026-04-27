import { saveFilters, loadFilters, GameState, saveSetting } from "./state.js";
import { markerLayers, uiCategoryOrder, uiLayers, uiCategories } from "./data.js";
import { loadMarkers } from "./markers.js";

export function isCategoryActive(category) {
  return document.querySelector(`input[value="${category}"]`)?.checked;
}

export function isUnstableActive() {
  return document.getElementById('map-type')?.checked;
}

function applyFilters(map, mapName) {
  Object.entries(markerLayers[mapName]).forEach(([cat, layer]) => {
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

export function initSettings(map) {
  const mapType = document.getElementById('map-type');

  mapType.addEventListener('change', (e) => {
    loadMarkers(map, GameState.currentMap);
    saveSetting("isUnstableActive", mapType.checked);
  });
}

export function initFilters(map, mapName) {
  const sidebar = document.getElementById('filters');

  sidebar.addEventListener('change', (e) => {
    if (e.target.matches('input')) {
      applyFilters(map, mapName);
      saveFilters(mapName);
    }
  });
}

function createSection(headerLabel) {
  const sectionDiv = document.createElement("div");

  const headerDiv = document.createElement("div");
  const sectionHeader = document.createElement("h4");
  const selectAllBtn = document.createElement("button");
  const removeAllBtn = document.createElement("button");

  sectionHeader.innerHTML = headerLabel;
  selectAllBtn.innerHTML = "Select";
  removeAllBtn.innerHTML = "Remove";

  selectAllBtn.addEventListener("click", () => {
    sectionDiv.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = true;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  removeAllBtn.addEventListener("click", () => {
    sectionDiv.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  headerDiv.className = "section-header-container";
  sectionHeader.className = "section-header-label";
  selectAllBtn.className = "pointer";
  removeAllBtn.className = "pointer";

  headerDiv.appendChild(sectionHeader);
  headerDiv.appendChild(selectAllBtn);
  headerDiv.appendChild(removeAllBtn);

  sectionDiv.appendChild(headerDiv)

  return sectionDiv;
}

export function buildFilters(map, mapName) {

  const container = document.getElementById("filters");
  container.innerHTML = "";


  const uiDatas = Object.keys(markerLayers[mapName]).map(cat => ({ cat: cat, data: uiLayers[cat] || undefined }));
  const buckets = [];
  uiDatas.forEach((item) => {
    const category = item.data?.category || uiCategories.unknown;

    if (!buckets[category]) {
      buckets[category] = [];
    }

    buckets[category].push(item);
  });

  const sortedBuckets = uiCategoryOrder.map((category) => ({
    category,
    items: buckets[category] || [],
  }));

  const saved = loadFilters(mapName);

  sortedBuckets.forEach(bucket => {
    if (!bucket.items || bucket.items.length === 0) {
      return;
    }

    const sectionDiv = createSection(bucket.category);

    bucket.items.forEach(item => {
      const checked = saved[item.cat] ?? true;
      const label = document.createElement("label");

      label.innerHTML = `
        <input type="checkbox" value="${item.cat}" ${checked ? "checked" : ""}>
        ${item.data?.name || item.cat}
      `;
      label.className = "pointer";

      sectionDiv.appendChild(label);
    })

    container.appendChild(sectionDiv);
  });

  initFilters(map, mapName);
}