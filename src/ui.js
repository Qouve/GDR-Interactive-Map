import { GameState } from "./state.js";
import { markerLayers, uiCategoryOrder, uiLayers, uiCategories } from "./data.js";

export function isCategoryActive(category) {
  return document.querySelector(`input[value="${category}"]`)?.checked;
}

function applyFilters(map) {
  Object.entries(markerLayers[GameState.currentMap]).forEach(([cat, layer]) => {
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
  const sidebar = document.querySelector('#sidebar');

  sidebar.addEventListener('change', (e) => {
    if (e.target.matches('input')) {
      applyFilters(map, GameState.currentMap);
    }
  });
}

export function buildFilters(map) {

  const container = document.getElementById("filters");
  container.innerHTML = "";

  const uiDatas = Object.keys(markerLayers[map]).map(cat =>  ({ cat: cat, data: uiLayers[cat] || undefined} ));
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

  sortedBuckets.forEach(bucket => {
    if (!bucket.items || bucket.items.length === 0) {
      return;
    }

    const categoryDiv = document.createElement("section");

    const sectionHeader = document.createElement("h3");
    sectionHeader.innerHTML = bucket.category;
    categoryDiv.appendChild(sectionHeader);

    bucket.items.forEach(item => {
      const label = document.createElement("label");

      label.innerHTML = `
        <input type="checkbox" value="${item.cat}" checked>
        ${item.data?.name || item.cat}
      `;
  
      categoryDiv.appendChild(label);
    })

    container.appendChild(categoryDiv);
  });

  initFilters(map);
}