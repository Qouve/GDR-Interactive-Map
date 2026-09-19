import L, { CRS, divIcon, type LatLngBoundsExpression, type Map as LeafletMap } from 'leaflet'
import 'leaflet-rotate'
import { Check, Copy, MapPin, Minus, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  ImageOverlay,
  MapContainer,
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet'

import { Button } from '@/components/ui/button'
import { getCategoryConfig } from '@/lib/category-config'
import { assetUrl, mapToWorld, worldToMap } from '@/lib/map-data'
import type { MapConfig, MarkerData, RegionData, SavedPin, Vector2 } from '@/types'

const iconCache = new Map<string, L.DivIcon>()

function markerIcon(category: string) {
  const cached = iconCache.get(category)
  if (cached) return cached

  const config = getCategoryConfig(category)
  const content = config.icon
    ? `<img src="${assetUrl(`icons/${config.icon}.png`)}" alt="" />`
    : `<span style="background:${config.color}"></span>`
  const icon = divIcon({
    className: 'game-marker',
    html: `<div class="game-marker__inner">${content}</div>`,
    iconSize: [38, 44],
    iconAnchor: [19, 42],
    popupAnchor: [0, -40],
  })
  iconCache.set(category, icon)
  return icon
}

const regionIcon = divIcon({ className: 'region-anchor', html: '', iconSize: [1, 1] })
const personalPinIcon = divIcon({
  className: 'personal-marker-anchor',
  html: '<div class="personal-marker"><span></span></div>',
  iconSize: [30, 38],
  iconAnchor: [15, 36],
  popupAnchor: [0, -34],
})

type PersonalPinPopupProps = {
  pin: SavedPin
  onRemove: (id: string) => void
  onRename: (id: string, name: string) => void
}

function PersonalPinPopup({ pin, onRemove, onRename }: PersonalPinPopupProps) {
  const [copied, setCopied] = useState(false)

  async function copyCoordinates() {
    await navigator.clipboard.writeText(
      JSON.stringify({ x: Number(pin.x.toFixed(2)), y: Number(pin.y.toFixed(2)) }, null, 2),
    )
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className="personal-marker-popup">
      <span className="map-popup-category">Personal marker</span>
      <input
        aria-label="Marker name"
        className="personal-marker-name"
        maxLength={60}
        onChange={(event) => onRename(pin.id, event.target.value)}
        placeholder="Name this marker"
        value={pin.name ?? ''}
      />
      <p className="map-popup-coordinates">X {pin.x.toFixed(0)} · Y {pin.y.toFixed(0)}</p>
      <div className="personal-marker-actions">
        <button className="personal-marker-copy" onClick={copyCoordinates} type="button">
          {copied ? <Check className="personal-marker-action-icon" /> : <Copy className="personal-marker-action-icon" />}
          {copied ? 'Copied' : 'Copy coordinates'}
        </button>
        <button className="personal-marker-remove" onClick={() => onRemove(pin.id)} type="button">
          <Trash2 className="personal-marker-action-icon" />
          Remove marker
        </button>
      </div>
    </div>
  )
}

function MapSetup({ config }: { config: MapConfig }) {
  const map = useMap()

  useEffect(() => {
    const bounds: LatLngBoundsExpression = [
      [0, 0],
      [config.textureSize.y, config.textureSize.x],
    ]
    map.fitBounds(bounds, { animate: false, padding: [18, 18] })
    map.setBearing(config.rotation ?? 0)
  }, [config, map])

  return null
}

type MapControlsProps = {
  config: MapConfig
  onAddPin: (position: Vector2) => void
}

function MapControls({ config, onAddPin }: MapControlsProps) {
  const map = useMap()
  const [pinMode, setPinMode] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<Vector2 | null>(null)

  useMapEvents({
    click(event) {
      const worldPosition = mapToWorld({ x: event.latlng.lng, y: event.latlng.lat }, config)
      setCursorPosition(worldPosition)
      if (!pinMode) return
      onAddPin(worldPosition)
      setPinMode(false)
    },
    mousemove(event) {
      setCursorPosition(mapToWorld({ x: event.latlng.lng, y: event.latlng.lat }, config))
    },
  })

  useEffect(() => {
    const container = map.getContainer()
    container.classList.toggle('pin-placement-active', pinMode)
    return () => container.classList.remove('pin-placement-active')
  }, [map, pinMode])

  return (
    <>
      <div className="map-zoom-controls" onClick={(event) => event.stopPropagation()}>
        <Button aria-label="Zoom in" className="map-zoom-in" onClick={() => map.zoomIn()} size="icon" variant="ghost">
          <Plus className="icon-small" />
        </Button>
        <Button aria-label="Zoom out" className="map-zoom-out" onClick={() => map.zoomOut()} size="icon" variant="ghost">
          <Minus className="icon-small" />
        </Button>
        <Button
          aria-label={pinMode ? 'Cancel marker placement' : 'Place a personal marker'}
          aria-pressed={pinMode}
          className="map-pin-tool"
          onClick={() => setPinMode((active) => !active)}
          size="icon"
          variant="ghost"
        >
          <MapPin className="icon-small" />
        </Button>
      </div>

      <div className="map-pin-hint">
        <MapPin className="map-pin-hint-icon" />
        <span className="map-cursor-coordinates">
          {cursorPosition
            ? `X ${cursorPosition.x.toFixed(0)}  Y ${cursorPosition.y.toFixed(0)}`
            : 'X —  Y —'}
        </span>
        <span className="map-pin-hint-separator" />
        <span>{pinMode ? 'Click the map to place your marker' : 'Use the pin tool to save a location'}</span>
      </div>
    </>
  )
}

type GameMapProps = {
  config: MapConfig
  markers: MarkerData[]
  regions: RegionData[]
  savedPins: SavedPin[]
  enabledCategories: Set<string>
  onAddPin: (position: Vector2) => void
  onRemovePin: (id: string) => void
  onRenamePin: (id: string, name: string) => void
  onReady?: (map: LeafletMap) => void
}

export function GameMap({
  config,
  markers,
  regions,
  savedPins,
  enabledCategories,
  onAddPin,
  onRemovePin,
  onRenamePin,
  onReady,
}: GameMapProps) {
  const bounds: LatLngBoundsExpression = [
    [0, 0],
    [config.textureSize.y, config.textureSize.x],
  ]

  const visibleMarkers = markers.filter((marker) => enabledCategories.has(marker.category))
  const showRegions = enabledCategories.has('region')

  return (
    <MapContainer
      attributionControl={false}
      bearing={config.rotation ?? 0}
      center={[config.textureSize.y / 2, config.textureSize.x / 2]}
      className="game-map"
      crs={CRS.Simple}
      maxZoom={3}
      minZoom={-3}
      ref={onReady}
      rotate
      touchRotate
      zoom={0}
      zoomControl={false}
      zoomDelta={0.5}
      zoomSnap={0.25}
    >
      <ImageOverlay bounds={bounds} url={assetUrl(config.image)} />
      <MapSetup config={config} />

      {visibleMarkers.map((marker, index) => {
        const position = worldToMap(marker, config)
        const category = getCategoryConfig(marker.category)
        return (
          <Marker
            autoPanOnFocus={false}
            icon={markerIcon(marker.category)}
            key={`${marker.category}-${marker.x}-${marker.y}-${index}`}
            position={[position.y, position.x]}
          >
            <Popup autoPan={false} className="game-popup" closeButton={false}>
              <div className="map-popup-content">
                <span className="map-popup-category">{category.label}</span>
                <p className="map-popup-title">{marker.name}</p>
                <p className="map-popup-coordinates">X {marker.x.toFixed(0)} · Y {marker.y.toFixed(0)}</p>
              </div>
            </Popup>
          </Marker>
        )
      })}

      {showRegions && regions.map((region) => {
        const usesMapCoordinates =
          region.x >= 0 &&
          region.x <= config.textureSize.x &&
          region.y >= 0 &&
          region.y <= config.textureSize.y
        const position = usesMapCoordinates ? region : worldToMap(region, config)
        return (
          <Marker
            autoPanOnFocus={false}
            icon={regionIcon}
            key={`${region.name}-${region.x}-${region.y}`}
            position={[position.y, position.x]}
          >
            <Tooltip
              className="region-label"
              direction="center"
              offset={region.offset ? [region.offset.x, region.offset.y] : [0, 0]}
              opacity={1}
              permanent
            >
              {region.name}
            </Tooltip>
          </Marker>
        )
      })}

      {savedPins.map((pin) => {
        const position = worldToMap(pin, config)
        return (
          <Marker
            autoPanOnFocus={false}
            icon={personalPinIcon}
            key={pin.id}
            position={[position.y, position.x]}
          >
            <Popup autoPan={false} className="game-popup" closeButton={false}>
              <PersonalPinPopup onRemove={onRemovePin} onRename={onRenamePin} pin={pin} />
            </Popup>
          </Marker>
        )
      })}

      <MapControls config={config} onAddPin={onAddPin} />
    </MapContainer>
  )
}
