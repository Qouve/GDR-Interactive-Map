import { ChevronDown, Layers3, LockKeyhole, MapPin, Search, Trash2, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { getCategoryConfig, groupOrder } from '@/lib/category-config'
import { assetUrl } from '@/lib/map-data'
import { cn } from '@/lib/utils'
import type { MarkerData, World } from '@/types'

type SidebarProps = {
  worlds: World[]
  selectedWorld: World
  markers: MarkerData[]
  enabledCategories: Set<string>
  pvpMode: boolean
  savedPinCount: number
  showColoredMap: boolean
  showPersonalPins: boolean
  open: boolean
  onClose: () => void
  onPvpModeChange: (value: boolean) => void
  onClearPersonalPins: () => void
  onShowColoredMapChange: (value: boolean) => void
  onShowPersonalPinsChange: (value: boolean) => void
  onWorldChange: (world: World) => void
  onCategoryChange: (category: string, value: boolean) => void
  onAllCategoriesChange: (categories: string[], value: boolean) => void
}

export function Sidebar({
  worlds,
  selectedWorld,
  markers,
  enabledCategories,
  pvpMode,
  savedPinCount,
  showColoredMap,
  showPersonalPins,
  open,
  onClose,
  onPvpModeChange,
  onClearPersonalPins,
  onShowColoredMapChange,
  onShowPersonalPinsChange,
  onWorldChange,
  onCategoryChange,
  onAllCategoriesChange,
}: SidebarProps) {
  const [search, setSearch] = useState('')
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const marker of markers) {
      counts.set(marker.category, (counts.get(marker.category) ?? 0) + 1)
    }
    return counts
  }, [markers])

  const groupedCategories = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('en')
    return groupOrder.map((group) => ({
      group,
      categories: [...categoryCounts.keys()]
        .filter((category) => getCategoryConfig(category).group === group)
        .filter((category) => getCategoryConfig(category).label.toLocaleLowerCase('en').includes(term))
        .sort((a, b) => getCategoryConfig(a).label.localeCompare(getCategoryConfig(b).label, 'en')),
    }))
  }, [categoryCounts, search])

  function toggleGroup(group: string) {
    setCollapsedGroups((current) => {
      const next = new Set(current)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })
  }

  return (
    <>
      <button
        aria-label="Close navigation"
        className={cn(
          'sidebar-backdrop',
          open ? 'sidebar-backdrop--open' : 'sidebar-backdrop--closed',
        )}
        onClick={onClose}
        type="button"
      />
      <aside
        className={cn(
          'sidebar',
          open ? 'sidebar--open' : 'sidebar--closed',
        )}
      >
        <header className="sidebar-header">
          <div className="sidebar-logo">
            <Layers3 className="icon-medium" />
          </div>
          <div className="sidebar-brand">
            <p className="sidebar-title">Gods, Death &amp; Reapers</p>
            <p className="sidebar-subtitle">Interactive map</p>
          </div>
          <Button aria-label="Close navigation" className="sidebar-close" onClick={onClose} size="icon" variant="ghost">
            <X className="icon-small" />
          </Button>
        </header>

        <Separator />

        <ScrollArea className="sidebar-scroll">
          <div className="sidebar-content">
            <section className="sidebar-section">
              <p className="section-label">World</p>
              <div className="world-grid">
                {worlds.map((world) => (
                  <button
                    key={world.id}
                    className={cn(
                      'world-button',
                      world.id === selectedWorld.id
                        ? 'world-button--active'
                        : 'world-button--inactive',
                      !world.available && 'world-button--disabled',
                    )}
                    disabled={!world.available}
                    onClick={() => onWorldChange(world)}
                    title={world.available ? world.subtitle : 'Map data is not complete yet'}
                    type="button"
                  >
                    <span className="world-button-name">{world.name}</span>
                    <span className="world-button-status">
                      {world.available ? 'Active' : 'Soon'}
                    </span>
                    {!world.available && <LockKeyhole className="world-button-lock" />}
                  </button>
                ))}
              </div>
            </section>

            <section className="dataset-card">
              <div className="dataset-card-row">
                <div>
                  <p className="dataset-card-title">Unstable</p>
                </div>
                <Switch
                  checked={pvpMode}
                  disabled={!selectedWorld.hasPvpData || !selectedWorld.hasStandardData}
                  onCheckedChange={onPvpModeChange}
                />
              </div>
            </section>

            <section className="dataset-card">
              <div className="dataset-card-row">
                <p className="dataset-card-title">Colored map</p>
                <Switch
                  aria-label="Show colored map overlay"
                  checked={showColoredMap}
                  onCheckedChange={onShowColoredMapChange}
                />
              </div>
            </section>

            <section className="sidebar-section">
              <div className="filter-heading">
                <p className="section-label">Map filters</p>
                <button
                  className="filter-clear"
                  onClick={() => onAllCategoriesChange([...categoryCounts.keys()], false)}
                  type="button"
                >
                  Hide all
                </button>
              </div>
              <div className="filter-search-wrap">
                <Search className="filter-search-icon" />
                <input
                  aria-label="Search filters"
                  className="filter-search"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Filter locations ..."
                  type="search"
                  value={search}
                />
              </div>

              {savedPinCount > 0 && (
                <div className="filter-option filter-option--personal">
                  <Checkbox
                    checked={showPersonalPins}
                    id="personal-markers-visibility"
                    onCheckedChange={(checked) => onShowPersonalPinsChange(checked === true)}
                  />
                  <span className="filter-option-icon">
                    <MapPin className="filter-personal-icon" />
                  </span>
                  <label className="filter-option-label" htmlFor="personal-markers-visibility">
                    Personal markers
                  </label>
                  <span className="filter-option-count">{savedPinCount}</span>
                  <button
                    aria-label="Delete all personal markers"
                    className="filter-personal-delete"
                    onClick={() => {
                      if (window.confirm(`Delete all ${savedPinCount} personal markers for ${selectedWorld.name}?`)) {
                        onClearPersonalPins()
                      }
                    }}
                    title="Delete all personal markers"
                    type="button"
                  >
                    <Trash2 className="filter-personal-delete-icon" />
                  </button>
                </div>
              )}

              <div className="filter-groups">
                {groupedCategories.map(({ group, categories }) => {
                  if (categories.length === 0) return null
                  const collapsed = collapsedGroups.has(group)
                  const enabledCount = categories.filter((category) => enabledCategories.has(category)).length

                  return (
                    <div className="filter-group" key={group}>
                      <div className="filter-group-heading">
                        <button
                          className="filter-group-toggle"
                          onClick={() => toggleGroup(group)}
                          type="button"
                        >
                          <ChevronDown className={cn('filter-group-chevron', collapsed && 'filter-group-chevron--collapsed')} />
                          <span className="filter-group-title">{group}</span>
                          <span className="filter-group-count">{enabledCount}/{categories.length}</span>
                        </button>
                        <button
                          className="filter-group-action"
                          onClick={() => onAllCategoriesChange(categories, enabledCount !== categories.length)}
                          type="button"
                        >
                          {enabledCount === categories.length ? 'hide' : 'all'}
                        </button>
                      </div>

                      {!collapsed && (
                        <div className="filter-options">
                          {categories.map((category) => {
                            const config = getCategoryConfig(category)
                            return (
                              <label
                                className="filter-option"
                                key={category}
                              >
                                <Checkbox
                                  checked={enabledCategories.has(category)}
                                  onCheckedChange={(checked) => onCategoryChange(category, checked === true)}
                                />
                                <span className="filter-option-icon">
                                  {config.icon ? (
                                    <img alt="" className="filter-option-image" src={assetUrl(`icons/${config.icon}.png`)} />
                                  ) : (
                                    <span className="filter-option-dot" style={{ backgroundColor: config.color }} />
                                  )}
                                </span>
                                <span className="filter-option-label">{config.label}</span>
                                <span className="filter-option-count">{categoryCounts.get(category)}</span>
                              </label>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </ScrollArea>

        <footer className="sidebar-footer">
          Community map · Data may be incomplete
        </footer>
      </aside>
    </>
  )
}
