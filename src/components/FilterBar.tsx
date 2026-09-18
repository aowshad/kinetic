import { forwardRef } from 'react'
import { Search, X } from 'lucide-react'
import type { Category, TextRole } from '../lib/types'

interface PillOption<T extends string> {
  value: T
  count: number
}

const FilterBar = forwardRef<HTMLElement, {
  stuck: boolean
  search: string
  onSearchChange: (v: string) => void
  categories: PillOption<Category>[]
  selectedCategories: Category[]
  onToggleCategory: (c: Category) => void
  roles: PillOption<TextRole>[]
  selectedRoles: TextRole[]
  onToggleRole: (r: TextRole) => void
  onClear: () => void
  hasActiveFilters: boolean
  viewingLabel: string | null
}>(function FilterBar(
  {
    stuck,
    search,
    onSearchChange,
    categories,
    selectedCategories,
    onToggleCategory,
    roles,
    selectedRoles,
    onToggleRole,
    onClear,
    hasActiveFilters,
    viewingLabel,
  },
  ref,
) {
  return (
    <search ref={ref} className={stuck ? 'filter-bar stuck' : 'filter-bar'} aria-label="Filters">
      <div className="filter-bar-inner">
        <div className="filter-search-row">
          <label className="filter-search">
            <Search size={14} />
            <input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search animations"
              aria-label="Search animations"
            />
          </label>
          {viewingLabel && <span className="filter-viewing">Viewing: {viewingLabel}</span>}
        </div>

        <div className="filter-group">
          <div className="filter-group-row">
            <span className="filter-group-label">Category</span>
            <div className="filter-pills" role="group" aria-label="Filter by category">
              {categories.map(({ value, count }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selectedCategories.includes(value)}
                  disabled={count === 0 && !selectedCategories.includes(value)}
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
            <span className="filter-group-label">Text role</span>
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
          <p className="filter-help">Animations can suit more than one role.</p>
        </div>

        {hasActiveFilters && (
          <button type="button" onClick={onClear} className="filter-clear">
            <X size={13} />
            Clear filters
          </button>
        )}
      </div>
    </search>
  )
})

export default FilterBar
