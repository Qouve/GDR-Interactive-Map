import { AlertTriangle, LoaderCircle, Menu, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { GameMap } from '@/components/game-map'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { getCategoryConfig } from '@/lib/category-config'
import { loadMapDataset } from '@/lib/map-data'
import type { MapDataset, SavedPin, Vector2, World } from '@/types'

const worlds: World[] = [
  { id: 'midgard', name: 'Midgard', subtitle: 'The known world', available: true, hasStandardData: true, hasPvpData: true },
  { id: 'helheim', name: 'Helheim', subtitle: 'Standard and Unstable data', available: true, hasStandardData: true, hasPvpData: true },
  { id: 'asgard', name: 'Asgard', subtitle: 'Standard and Unstable data', available: true, hasStandardData: true, hasPvpData: true },
]

function storedCategories(key: string, fallback: string[], legacyKey?: string) {
  try {
    const value = localStorage.getItem(key) ?? (legacyKey ? localStorage.getItem(legacyKey) : null)
    const migrationKey = `${key}-visible-categories-v2`
    if (!value) {
      localStorage.setItem(migrationKey, 'complete')
      return fallback
    }

    const stored = new Set(JSON.parse(value) as string[])
    const needsVisibleCategoryMigration = localStorage.getItem(migrationKey) !== 'complete'
    const enabled = fallback.filter((category) => {
      if (
        needsVisibleCategoryMigration &&
        (category === 'unknown' || category === 'ratatoskr_stash')
      ) {
        return true
      }
      if (stored.has(category)) return true
      if (category.startsWith('dungeon_')) return stored.has('dungeon')
      if (category.startsWith('obelisk_')) return stored.has('obelisk')
      return false
    })
    localStorage.setItem(migrationKey, 'complete')
    return enabled
  } catch {
    return fallback
  }
}

function storedPins(key: string): SavedPin[] {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as SavedPin[]) : []
  } catch {
    return []
  }
}

function storedPinVisibility(worldId: World['id']) {
  return localStorage.getItem(`${worldId}-show-personal-markers`) !== 'false'
}

function storedWorld(): World {
  const worldId = localStorage.getItem('selected-world')
  return worlds.find((world) => world.id === worldId && world.available) ?? worlds[0]
}

function storedPvpMode(world: World) {
  if (!world.hasStandardData) return world.hasPvpData
  if (!world.hasPvpData) return false
  return localStorage.getItem(`${world.id}-selected-mode`) === 'unstable'
}

export default function App() {
  const [selectedWorld, setSelectedWorld] = useState<World>(storedWorld)
  const [pvpMode, setPvpMode] = useState(() => storedPvpMode(selectedWorld))
  const [dataset, setDataset] = useState<MapDataset | null>(null)
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [savedPins, setSavedPins] = useState<SavedPin[]>(() =>
    storedPins(`${selectedWorld.id}-personal-markers`),
  )
  const [showPersonalPins, setShowPersonalPins] = useState(() =>
    storedPinVisibility(selectedWorld.id),
  )
  const [showColoredMap, setShowColoredMap] = useState(
    () => localStorage.getItem('show-colored-map') === 'true',
  )

  useEffect(() => {
    let active = true

    void loadMapDataset(selectedWorld.id, pvpMode)
      .then((result) => {
        if (!active) return
        setDataset(result)
        const categories = [
          ...new Set(
            result.markers
              .filter((marker) => getCategoryConfig(marker.category).group !== 'Other')
              .map((marker) => marker.category),
          ),
        ]
        categories.push('region')
        const mode = pvpMode ? 'pvp' : 'standard'
        const legacyMode = pvpMode ? 'unstable' : 'stable'
        setEnabledCategories(
          new Set(
            storedCategories(
              `${selectedWorld.id}-${mode}-filters`,
              categories,
              `${selectedWorld.id}-${legacyMode}-filters`,
            ),
          ),
        )
      })
      .catch((reason: unknown) => {
        if (!active) return
        setError(reason instanceof Error ? reason.message : 'The map data could not be loaded.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [selectedWorld.id, pvpMode])

  useEffect(() => {
    if (!dataset) return
    localStorage.setItem(
      `${selectedWorld.id}-${pvpMode ? 'pvp' : 'standard'}-filters`,
      JSON.stringify([...enabledCategories]),
    )
  }, [dataset, enabledCategories, selectedWorld.id, pvpMode])

  useEffect(() => {
    localStorage.setItem(`${selectedWorld.id}-personal-markers`, JSON.stringify(savedPins))
  }, [savedPins, selectedWorld.id])

  useEffect(() => {
    localStorage.setItem(`${selectedWorld.id}-show-personal-markers`, String(showPersonalPins))
  }, [selectedWorld.id, showPersonalPins])

  useEffect(() => {
    localStorage.setItem('show-colored-map', String(showColoredMap))
  }, [showColoredMap])

  useEffect(() => {
    localStorage.setItem('selected-world', selectedWorld.id)
  }, [selectedWorld.id])

  useEffect(() => {
    localStorage.setItem(
      `${selectedWorld.id}-selected-mode`,
      pvpMode ? 'unstable' : 'standard',
    )
  }, [pvpMode, selectedWorld.id])

  const visibleMarkerCount = useMemo(
    () => dataset?.markers.filter((marker) => enabledCategories.has(marker.category)).length ?? 0,
    [dataset, enabledCategories],
  )

  function changeCategory(category: string, value: boolean) {
    setEnabledCategories((current) => {
      const next = new Set(current)
      if (value) next.add(category)
      else next.delete(category)
      return next
    })
  }

  function changeCategories(categories: string[], value: boolean) {
    setEnabledCategories((current) => {
      const next = new Set(current)
      for (const category of categories) {
        if (value) next.add(category)
        else next.delete(category)
      }
      return next
    })
  }

  function changeDataset(value: boolean) {
    if ((value && !selectedWorld.hasPvpData) || (!value && !selectedWorld.hasStandardData)) return
    setLoading(true)
    setError(null)
    setDataset(null)
    setPvpMode(value)
  }

  function changeWorld(world: World) {
    if (!world.available || world.id === selectedWorld.id) return
    setLoading(true)
    setError(null)
    setDataset(null)
    setPvpMode(storedPvpMode(world))
    setSelectedWorld(world)
    setSavedPins(storedPins(`${world.id}-personal-markers`))
    setShowPersonalPins(storedPinVisibility(world.id))
    setSidebarOpen(false)
  }

  function addPin(position: Vector2) {
    setShowPersonalPins(true)
    setSavedPins((current) => [
      ...current,
      { id: crypto.randomUUID(), x: position.x, y: position.y },
    ])
  }

  function removePin(id: string) {
    setSavedPins((current) => current.filter((pin) => pin.id !== id))
  }

  function renamePin(id: string, name: string) {
    setSavedPins((current) =>
      current.map((pin) => (pin.id === id ? { ...pin, name } : pin)),
    )
  }

  return (
    <main className="app-shell">
      <Sidebar
        enabledCategories={enabledCategories}
        markers={dataset ? [...dataset.markers, ...dataset.regions] : []}
        onAllCategoriesChange={changeCategories}
        onCategoryChange={changeCategory}
        onClose={() => setSidebarOpen(false)}
        onPvpModeChange={changeDataset}
        onClearPersonalPins={() => setSavedPins([])}
        onShowColoredMapChange={setShowColoredMap}
        onShowPersonalPinsChange={setShowPersonalPins}
        onWorldChange={changeWorld}
        open={sidebarOpen}
        selectedWorld={selectedWorld}
        savedPinCount={savedPins.length}
        showColoredMap={showColoredMap}
        showPersonalPins={showPersonalPins}
        pvpMode={pvpMode}
        worlds={worlds}
      />

      <section className="map-shell">
        {dataset && (
          <GameMap
            coloredImage={`maps/${selectedWorld.id}_colored.png`}
            config={dataset.config}
            enabledCategories={enabledCategories}
            markers={dataset.markers}
            onAddPin={addPin}
            onRemovePin={removePin}
            onRenamePin={renamePin}
            regions={dataset.regions}
            savedPins={showPersonalPins ? savedPins : []}
            showColoredMap={showColoredMap}
          />
        )}

        <div className="map-header">
          <Button
            aria-label="Open navigation"
            className="map-menu-button"
            onClick={() => setSidebarOpen(true)}
            size="icon"
            variant="outline"
          >
            <Menu className="icon-small" />
          </Button>
          <div className="map-title-card">
            <div className="map-title-row">
              <h1 className="map-title">{selectedWorld.name}</h1>
              {!pvpMode && <ShieldCheck className="map-title-icon" />}
            </div>
            <p className="map-title-status">
              {loading
                ? 'Loading map data'
                : `${pvpMode ? 'Unstable' : 'Standard'} · ${visibleMarkerCount} locations visible`}
            </p>
          </div>
        </div>

        {loading && (
          <div className="map-state map-state--loading">
            <div className="map-state-content">
              <LoaderCircle className="map-state-spinner" />
              Mapping {selectedWorld.name} ...
            </div>
          </div>
        )}

        {error && (
          <div className="map-state map-state--error">
            <div className="map-error-card">
              <AlertTriangle className="map-error-icon" />
              <h2 className="map-error-title">Map unavailable</h2>
              <p className="map-error-description">{error}</p>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
