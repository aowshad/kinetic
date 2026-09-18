import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import type { Category, TextRole } from '../lib/types'

interface PillOption<T extends string> {
  value: T
  count: number
}

export default function FilterBar({
  condensed,
  search,
  onSearchChange,
  categories,
  selectedCategories,
  onToggleCategory,
  activeCategory,
  roles,
  selectedRoles,
  onToggleRole,
  onClear,
  hasActiveFilters,
}: {
  condensed: boolean
  search: string
  onSearchChange: (v: string) => void
  categories: PillOption<Category>[]
  selectedCategories: Category[]
  onToggleCategory: (c: Category) => void
  activeCategory: Category | null
  roles: PillOption<TextRole>[]
  selectedRoles: TextRole[]
  onToggleRole: (r: TextRole) => void
  onClear: () => void
  hasActiveFilters: boolean
}) {
  const [searchExpanded, setSearchExpanded] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const collapsed = condensed && !searchExpanded && search.length === 0

  useEffect(() => {
    if (searchExpanded) searchInputRef.current?.focus()
  }, [searchExpanded])

  return (
    <search className={condensed ? 'filter-bar condensed' : 'filter-bar'} aria-label="Filters">
      {collapsed ? (
        <button
          type="button"
          onClick={() => setSearchExpanded(true)}
          aria-label="Search animations"
          className="filter-search-icon"
        >
          <Search size={14} />
        </button>
      ) : (
        <label className="filter-search">
          <Search size={14} />
          <input
            ref={searchInputRef}
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onBlur={() => setSearchExpanded(false)}
            placeholder="Search animations"
            aria-label="Search animations"
          />
        </label>
      )}

      <div className="filter-group">
        <div className="filter-group-row">
          {!condensed && <span className="filter-group-label">Category</span>}
          <div className="filter-pills" role="group" aria-label="Filter by category">
            {categories.map(({ value, count }) => (
              <button
                key={value}
                type="button"
                aria-pressed={selectedCategories.includes(value)}
                disabled={count === 0 && !selectedCategories.includes(value)}
                data-scroll-active={activeCategory === value && selectedCategories.length === 0}
                onClick={() => onToggleCategory(value)}
                className="k-pill"
              >
                {value} <span className="k-pill-count">· {count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="filter-group filter-group-role">
        <div className="filter-group-row">
          {!condensed && <span className="filter-group-label">Text role</span>}
          <div className="filter-pills" role="group" aria-label="Filter by text role">
            {roles.map(({ value, count }) => (
              <button
                key={value}
                type="button"
                aria-pressed={selectedRoles.includes(value)}
                disabled={count === 0 && !selectedRoles.includes(value)}
                onClick={() => onToggleRole(value)}
                className="k-pill"
              >
                {value} <span className="k-pill-count">· {count}</span>
              </button>
            ))}
          </div>
        </div>
        {!condensed && <p className="filter-help">Animations can suit more than one role.</p>}
      </div>

      {hasActiveFilters && (
        <button type="button" onClick={onClear} className="filter-clear">
          <X size={13} />
          Clear filters
        </button>
      )}
    </search>
  )
}
