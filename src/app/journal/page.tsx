'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, JournalEntry } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';
import WritingAnalytics from '@/components/WritingAnalytics';
import SearchAndFilter, { SearchFilters } from '@/components/SearchAndFilter';
import { filterEntries, getSearchStats } from '@/lib/searchUtils';
import { MOODS } from '@/components/MoodTracker';
import styles from './journal.module.scss';
import Loader from '@/components/Loader';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    mood: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'newest'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  useEffect(() => {
    const filtered = filterEntries(entries, filters);
    setFilteredEntries(filtered);
  }, [entries, filters]);

  const fetchEntries = async () => {
    const start = Date.now();
    try {
      console.log('Fetching entries for user:', user?.id);
      
      if (!user?.id) {
        console.error('No user ID available');
        setError('User not authenticated');
        return;
      }

      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setEntries(data || []);
      console.log('Entries set:', data?.length || 0);
    } catch (err) {
      console.error('Fetch entries error:', err);
      setError(`Failed to fetch journal entries: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      const elapsed = Date.now() - start;
      if (elapsed < 2000) {
        setTimeout(() => setLoading(false), 2000 - elapsed);
      } else {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user?.id);

      if (error) throw error;
      await fetchEntries();
    } catch (err) {
      setError('Failed to delete entry');
    }
  };

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  const getMoodDisplay = (moodId?: string) => {
    if (!moodId) return null;
    return MOODS.find(mood => mood.id === moodId);
  };

  const searchStats = getSearchStats(entries, filteredEntries);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className={styles.loaderOverlay}><Loader page="journal" label="Loading your journal..." /></div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Journal</h1>
          <Link href="/journal/new" className={styles.newEntryButton}>
            New Entry
          </Link>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {entries.length > 0 && (
          <div className={styles.analyticsSection}>
            <WritingAnalytics />
          </div>
        )}

        {entries.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Start Your Journaling Journey</h2>
            <p>Create your first journal entry to begin reflecting on your thoughts and experiences.</p>
            <Link href="/journal/new" className={styles.newEntryButton}>
              Write Your First Entry
            </Link>
          </div>
        ) : (
          <>
            <SearchAndFilter onFiltersChange={handleFiltersChange} />
            
            <div className={styles.searchStats}>
              <span>{searchStats.showing}</span>
            </div>

            <div className={styles.entryList}>
              {filteredEntries.length === 0 ? (
                <div className={styles.noResults}>
                  <h3>No entries found</h3>
                  <p>Try adjusting your search criteria or filters.</p>
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <div key={entry.id} className={styles.entryCard}>
                    <div className={styles.entryHeader}>
                      <div className={styles.entryTitleSection}>
                        <h2 className={styles.entryTitle}>{entry.title}</h2>
                        {getMoodDisplay(entry.mood) && (
                          <div className={styles.entryMood}>
                            <span className={styles.moodEmoji}>
                              {getMoodDisplay(entry.mood)?.emoji}
                            </span>
                            <span className={styles.moodLabel}>
                              {getMoodDisplay(entry.mood)?.label}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className={styles.entryDate}>
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.entryContent}>
                      {entry.content.substring(0, 200)}
                      {entry.content.length > 200 ? '...' : ''}
                    </div>
                    {entry.image_url && (
                      <div className={styles.entryImage}>
                        <img src={entry.image_url} alt={entry.title} />
                      </div>
                    )}
                    <div className={styles.entryFooter}>
                      <div className={styles.entryActions}>
                        <Link
                          href={`/journal/${entry.id}`}
                          className={styles.actionButton}
                        >
                          View
                        </Link>
                        <Link
                          href={`/journal/${entry.id}/edit`}
                          className={styles.actionButton}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className={`${styles.actionButton} ${styles.delete}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
} 