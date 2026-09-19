export type Vector2 = {
  x: number
  y: number
}

export type MapOrientation =
  | 'normal'
  | 'flip_x'
  | 'flip_y'
  | 'flip_xy'
  | 'swap'
  | 'swap_flip_x'
  | 'swap_flip_y'
  | 'swap_flip_xy'

export type MapConfig = {
  image: string
  center: Vector2
  captureSize: Vector2
  textureSize: Vector2
  rotation?: number
  orientation?: MapOrientation
}

export type MarkerData = {
  category: string
  name: string
  x: number
  y: number
}

export type RegionData = MarkerData & {
  offset?: Vector2
}

export type World = {
  id: 'midgard' | 'helheim' | 'asgard'
  name: string
  subtitle: string
  available: boolean
  hasStandardData: boolean
  hasPvpData: boolean
}

export type MapDataset = {
  config: MapConfig
  markers: MarkerData[]
  regions: RegionData[]
}

export type SavedPin = Vector2 & {
  id: string
  name?: string
}
