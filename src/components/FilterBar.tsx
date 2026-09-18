import { Moon, Search, Sun } from 'lucide-react'
import type { Category, TextRole } from '../lib/types'

interface FilterBarProps {
  search: string
  onSearchChange: (v: string) => void
  categories: Category[]
  category: Category | 'all'
  onCategoryChange: (v: Category | 'all') => void
  roles: TextRole[]
  role: TextRole | 'all'
  onRoleChange: (v: TextRole | 'all') => void
  theme: 'dark' | 'light'
  onThemeToggle: () => void
}

export default function FilterBar({
  search,
  onSearchChange,
  categories,
  category,
  onCategoryChange,
  roles,
  role,
  onRoleChange,
  theme,
  onThemeToggle,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
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
      <div className="filter-pills" role="group" aria-label="Filter by category">
        <button type="button" aria-pressed={category === 'all'} onClick={() => onCategoryChange('all')} className="k-pill">
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => onCategoryChange(c)}
            className="k-pill"
          >
            {c}
          </button>
        ))}
      </div>
      <div className="filter-pills" role="group" aria-label="Filter by role">
        <button type="button" aria-pressed={role === 'all'} onClick={() => onRoleChange('all')} className="k-pill">
          All roles
        </button>
        {roles.map((r) => (
          <button key={r} type="button" aria-pressed={role === r} onClick={() => onRoleChange(r)} className="k-pill">
            {r}
          </button>
        ))}
      </div>
      <button
        type="button"
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        onClick={onThemeToggle}
        className="k-theme-btn"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  )
}
