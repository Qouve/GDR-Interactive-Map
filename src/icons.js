
function createResourceIcon(imageName) {
  return createCustomResourceIcon(imageName);
}

function createCustomResourceIcon(imageName, className) {
  const classNames = ['marker-border', className].join(' ');
  return L.divIcon({
    iconSize: [32, 32],
    popupAnchor: [0, -8],
    className: classNames,
    html: `
      <div class="marker-div">
        <img src="icons/${imageName}.png" class="marker-image marker-border" />
      </div>`
  });
}

export const icons = {
  default: new L.Icon.Default(),
  wood: createResourceIcon('wood'),
  stone: createResourceIcon('stone'),
  bone: createResourceIcon('bone'),
  bifrost: createResourceIcon('bifrost'),
  moss: createResourceIcon('moss'),
  mushroom: createResourceIcon('mushroom'),
  iron_ore: createResourceIcon('iron_ore'),
  leather: createResourceIcon('leather'),

  altar: createResourceIcon('altar_damage'),
  chest: createResourceIcon('chest'),
  rack_armor: createCustomResourceIcon('rack_armor', 'rack'),
  rack_weapon: createCustomResourceIcon('rack_weapon', 'rack'),
  teleport_pad: createResourceIcon('teleport_pad'),
  
  seal: createResourceIcon('seal'),
  boss: createResourceIcon('boss'),
  spawnpoint: createResourceIcon('spawnpoint'),
  dungeon: createResourceIcon('dungeon'),
  obelisk: createResourceIcon('obelisk'),

  valleysigil: createResourceIcon('boss'),
  torkel: createResourceIcon('boss'),
};
