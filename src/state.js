export const GameState = {
  currentMap: "helheim"
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