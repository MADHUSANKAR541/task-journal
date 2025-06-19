'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, X, RefreshCw } from 'lucide-react';
import { MOODS } from './MoodTracker';
import styles from './SearchAndFilter.module.scss';

export interface SearchFilters {
  query: string;
  mood: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'newest' | 'oldest' | 'title';
}

interface SearchAndFilterProps {
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

export default function SearchAndFilter({ onFiltersChange, className = "" }: SearchAndFilterProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    mood: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'newest'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      mood: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = filters.query || filters.mood || filters.dateFrom || filters.dateTo;

  return (
    <div className={`${styles.searchAndFilter} ${className}`}>
      {/* Main Search Bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchInput}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search entries by title or content..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className={styles.input}
          />
          {filters.query && (
            <button
              onClick={() => handleFilterChange('query', '')}
              className={styles.clearButton}
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`${styles.filterToggle} ${showAdvanced ? styles.active : ''}`}
        >
          <Filter size={20} />
          Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className={styles.advancedFilters}>
          <div className={styles.filterRow}>
            {/* Mood Filter */}
            <div className={styles.filterGroup}>
              <label>Mood</label>
              <select
                value={filters.mood}
                onChange={(e) => handleFilterChange('mood', e.target.value)}
                className={styles.select}
              >
                <option value="">All Moods</option>
                {MOODS.map(mood => (
                  <option key={mood.id} value={mood.id}>
                    {mood.emoji} {mood.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className={styles.filterGroup}>
              <label>From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className={styles.input}
              />
            </div>

            {/* Sort By */}
            <div className={styles.filterGroup}>
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as SearchFilters['sortBy'])}
                className={styles.select}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className={styles.filterActions}>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={styles.clearFiltersButton}
              >
                <RefreshCw size={16} />
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className={styles.activeFilters}>
          <span className={styles.activeFiltersLabel}>Active filters:</span>
          {filters.query && (
            <span className={styles.filterTag}>
              Search: "{filters.query}"
              <button
                onClick={() => handleFilterChange('query', '')}
                className={styles.removeFilter}
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.mood && (
            <span className={styles.filterTag}>
              Mood: {MOODS.find(m => m.id === filters.mood)?.label}
              <button
                onClick={() => handleFilterChange('mood', '')}
                className={styles.removeFilter}
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.dateFrom && (
            <span className={styles.filterTag}>
              From: {new Date(filters.dateFrom).toLocaleDateString()}
              <button
                onClick={() => handleFilterChange('dateFrom', '')}
                className={styles.removeFilter}
              >
                <X size={12} />
              </button>
            </span>
          )}
          {filters.dateTo && (
            <span className={styles.filterTag}>
              To: {new Date(filters.dateTo).toLocaleDateString()}
              <button
                onClick={() => handleFilterChange('dateTo', '')}
                className={styles.removeFilter}
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
} 