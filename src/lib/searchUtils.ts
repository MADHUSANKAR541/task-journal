import { JournalEntry } from './supabase';
import { SearchFilters } from '@/components/SearchAndFilter';

export function filterEntries(entries: JournalEntry[], filters: SearchFilters): JournalEntry[] {
  let filtered = [...entries];

  // Search by query (title and content)
  if (filters.query.trim()) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(entry => {
      const titleMatch = entry.title.toLowerCase().includes(query);
      const contentMatch = entry.content.toLowerCase().includes(query);
      return titleMatch || contentMatch;
    });
  }

  // Filter by mood
  if (filters.mood) {
    filtered = filtered.filter(entry => entry.mood === filters.mood);
  }

  // Filter by date range
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    filtered = filtered.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= fromDate;
    });
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999); // End of day
    filtered = filtered.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate <= toDate;
    });
  }

  // Sort entries
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return filtered;
}

export function highlightSearchTerm(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export function getSearchStats(entries: JournalEntry[], filtered: JournalEntry[]): {
  total: number;
  filtered: number;
  showing: string;
} {
  const total = entries.length;
  const filteredCount = filtered.length;
  
  let showing = '';
  if (total === filteredCount) {
    showing = `Showing all ${total} entries`;
  } else {
    showing = `Showing ${filteredCount} of ${total} entries`;
  }

  return {
    total,
    filtered: filteredCount,
    showing
  };
} 