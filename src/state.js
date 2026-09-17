/**
 * @typedef {Object} Vector2
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} MapData
 * @property {string} image
 * @property {Vector2} center
 * @property {Vector2} captureSize
 * @property {Vector2} textureSize
 * @property {number} rotation
 * @property {string} orientation
 */

export const GameState = {
  currentMap: "helheim",
  /** @type {MapData | null} */
  mapData: null,
};

export function saveFilters(map) {
  const values = {};

  document.querySelectorAll('#sidebar input[type="checkbox"]').forEach(cb => {
    values[cb.value] = cb.checked;
  });

  localStorage.setItem(`${map}-filters`, JSON.stringify(values));
}

export function loadFilters(map) {
  try {
    return JSON.parse(localStorage.getItem(`${map}-filters`)) || {};
  } catch {
    return {};
  }
}

export function saveLastLoadedMap(map) {
  localStorage.setItem("last-loaded-map", map);
}
export function loadLastLoadedMap() {
  try {
    return localStorage.getItem("last-loaded-map") || null;
  } catch {
    return null;
  }
}

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem("settings")) || {};
  } catch {
    return {};
  }
}
export function saveSetting(name, value) {
  const settings = loadSettings();

  settings[name] = value;

  localStorage.setItem("settings", JSON.stringify(settings));
}

export function loadSetting(name, defaultValue = null) {
  try {
    const settings = loadSettings();
    return settings?.[name] || defaultValue;
  } catch {
    return defaultValue;
  }
}