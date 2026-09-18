import { Search, X } from 'lucide-react'
import type { Category, TextRole } from '../lib/types'

interface PillOption<T extends string> {
  value: T
  count: number
}

export default function FilterBar({
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
}: {
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
}) {
  return (
    <search className="filter-bar" aria-label="Filters">
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

      <div className="filter-group">
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
              {value} <span className="k-pill-count">{count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
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
              {value} <span className="k-pill-count">{count}</span>
            </button>
          ))}
        </div>
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
