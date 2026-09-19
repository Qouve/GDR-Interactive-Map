import type {
  MapConfig,
  MapDataset,
  MapOrientation,
  MarkerData,
  RegionData,
  Vector2,
} from '@/types'

const baseUrl = import.meta.env.BASE_URL

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`)
  if (!response.ok) {
    throw new Error(`Could not load ${path} (${response.status}).`)
  }
  return response.json() as Promise<T>
}

function normalizeMarkerCategory(marker: MarkerData, sourceFile?: string): MarkerData {
  const name = marker.name.toLowerCase()
  const source = sourceFile?.toLowerCase() ?? ''

  if (marker.category === 'unknown') {
    if (source === 'altars.json') return { ...marker, category: 'altar' }
    if (source === 'chests.json') return { ...marker, category: 'chest' }
    if (source === 'dungeons.json' && name.startsWith("actor'")) {
      return { ...marker, category: 'dungeon_entry' }
    }
    if (source.includes('dungeon') && source.includes('exit')) {
      return { ...marker, category: 'dungeon_exit' }
    }

    if (source === 'obelisks.json') {
      if (name.includes('freeforall')) return { ...marker, category: 'obelisk_free' }
      if (name.includes('combat')) return { ...marker, category: 'obelisk_combat' }
      if (name.includes('locked')) return { ...marker, category: 'obelisk_locked' }
    }

    if (source === 'resources.json') {
      if (name.includes('bifrost')) return { ...marker, category: 'bifrost' }
      if (name.includes('bone')) return { ...marker, category: 'bone' }
      if (name.includes('iron')) return { ...marker, category: 'iron_ore' }
      if (name.includes('moss')) return { ...marker, category: 'moss' }
      if (name.includes('mushroom')) return { ...marker, category: 'mushroom' }
      if (name.includes('stone')) return { ...marker, category: 'stone' }
      if (name.includes('wood')) return { ...marker, category: 'wood' }
    }

    if (source === 'weapon_armor.json') {
      if (name.includes('weaponrack') || name.includes('weaponrrack')) {
        return { ...marker, category: 'rack_weapon' }
      }
      if (name.includes('armorrack')) return { ...marker, category: 'rack_armor' }
      if (name.includes('bone')) return { ...marker, category: 'bone' }
      if (name.includes('stone')) return { ...marker, category: 'stone' }
    }
  }

  if (marker.category === 'obelisk') {
    if (name.includes('free')) return { ...marker, category: 'obelisk_free' }
    if (name.includes('combat')) return { ...marker, category: 'obelisk_combat' }
    if (name.includes('locked')) return { ...marker, category: 'obelisk_locked' }
  }

  if (marker.category === 'dungeon') {
    if (sourceFile?.includes('exits') || name.includes('dungeon exit')) {
      return { ...marker, category: 'dungeon_exit' }
    }

    if (sourceFile?.includes('entries') || sourceFile === 'dungeons.json' || !name.includes('exit')) {
      return { ...marker, category: 'dungeon_entry' }
    }
  }

  return marker
}

export async function loadMapDataset(
  world: string,
  pvpMode: boolean,
): Promise<MapDataset> {
  const root = `data/${world}`
  const [config, regions] = await Promise.all([
    fetchJson<MapConfig>(`${root}/map.json`),
    fetchJson<RegionData[]>(`${root}/regions.json`),
  ])

  if (pvpMode) {
    const files = await fetchJson<string[]>(`${root}/unstables/index.json`)
    const markerGroups = await Promise.all(files.map(async (file) => {
      const markers = await fetchJson<MarkerData[]>(`${root}/unstables/${file}`)
      return markers.map((marker) => normalizeMarkerCategory(marker, file))
    }))
    const markers = markerGroups.flat()
    return { config, markers, regions }
  }

  const files = await fetchJson<string[]>(`${root}/stables/index.json`)
  const markerGroups = await Promise.all(files.map(async (file) => {
    const markers = await fetchJson<MarkerData[]>(`${root}/stables/${file}`)
    return markers.map((marker) => normalizeMarkerCategory(marker, file))
  }))

  return { config, markers: markerGroups.flat(), regions }
}

export function assetUrl(path: string) {
  return `${baseUrl}${path}`
}

export function worldToMap(
  worldPosition: Vector2,
  config: MapConfig,
): Vector2 {
  const dx = (worldPosition.x - config.center.x) / config.captureSize.x
  const dy = (worldPosition.y - config.center.y) / config.captureSize.y
  const orientation: MapOrientation = config.orientation ?? 'normal'

  const positions: Record<MapOrientation, Vector2> = {
    normal: { x: 0.5 + dx, y: 0.5 + dy },
    flip_x: { x: 0.5 - dx, y: 0.5 + dy },
    flip_y: { x: 0.5 + dx, y: 0.5 - dy },
    flip_xy: { x: 0.5 - dx, y: 0.5 - dy },
    swap: { x: 0.5 + dy, y: 0.5 + dx },
    swap_flip_x: { x: 0.5 - dy, y: 0.5 + dx },
    swap_flip_y: { x: 0.5 + dy, y: 0.5 - dx },
    swap_flip_xy: { x: 0.5 - dy, y: 0.5 - dx },
  }

  return {
    x: positions[orientation].x * config.textureSize.x,
    y: positions[orientation].y * config.textureSize.y,
  }
}

export function mapToWorld(mapPosition: Vector2, config: MapConfig): Vector2 {
  const u = mapPosition.x / config.textureSize.x
  const v = mapPosition.y / config.textureSize.y
  const orientation: MapOrientation = config.orientation ?? 'normal'

  const deltas: Record<MapOrientation, Vector2> = {
    normal: { x: u - 0.5, y: v - 0.5 },
    flip_x: { x: 0.5 - u, y: v - 0.5 },
    flip_y: { x: u - 0.5, y: 0.5 - v },
    flip_xy: { x: 0.5 - u, y: 0.5 - v },
    swap: { x: v - 0.5, y: u - 0.5 },
    swap_flip_x: { x: v - 0.5, y: 0.5 - u },
    swap_flip_y: { x: 0.5 - v, y: u - 0.5 },
    swap_flip_xy: { x: 0.5 - v, y: 0.5 - u },
  }

  return {
    x: config.center.x + deltas[orientation].x * config.captureSize.x,
    y: config.center.y + deltas[orientation].y * config.captureSize.y,
  }
}
