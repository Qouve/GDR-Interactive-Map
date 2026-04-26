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

  headerDiv.appendChild(sectionHeader);
  headerDiv.appendChild(selectAllBtn);
  headerDiv.appendChild(removeAllBtn);

  sectionDiv.appendChild(headerDiv)

  return sectionDiv;
}

export function buildFilters(map) {

  const container = document.getElementById("filters");
  container.innerHTML = "";

  const uiDatas = Object.keys(markerLayers[map]).map(cat => ({ cat: cat, data: uiLayers[cat] || undefined }));
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

    const sectionDiv = createSection(bucket.category);

    bucket.items.forEach(item => {
      const label = document.createElement("label");

      label.innerHTML = `
        <input type="checkbox" value="${item.cat}" checked>
        ${item.data?.name || item.cat}
      `;

      sectionDiv.appendChild(label);
    })

    container.appendChild(sectionDiv);
  });

  initFilters(map);
}