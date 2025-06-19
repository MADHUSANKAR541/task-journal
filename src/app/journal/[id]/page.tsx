'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';
import { MOODS } from '@/components/MoodTracker';
import styles from './entry.module.scss';
import Loader from '@/components/Loader';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
  image_url?: string;
}

export default function EntryPage({ params }: { params: { id: string } }) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
    fetchEntry();
    }
  }, [params.id, user]);

  const fetchEntry = async () => {
    const start = Date.now();
    try {
      console.log('Fetching entry:', params.id);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single();
      
      console.log('Entry fetch response:', { data, error });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setEntry(data);
    } catch (err) {
      console.error('Fetch entry error:', err);
      setError(`Failed to fetch journal entry: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      const elapsed = Date.now() - start;
      if (elapsed < 2000) {
        setTimeout(() => setLoading(false), 2000 - elapsed);
      } else {
      setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    setIsDeleting(true);
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', params.id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      router.push('/journal');
    } catch (err) {
      console.error('Delete entry error:', err);
      setError(`Failed to delete journal entry: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsDeleting(false);
    }
  };

  const getMoodDisplay = (moodId?: string) => {
    if (!moodId) return null;
    return MOODS.find(mood => mood.id === moodId);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className={styles.loaderOverlay}><Loader page="entry" label="Loading entry..." /></div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <div className={styles.error}>{error}</div>
          <Link href="/journal" className={styles.backButton}>
            Back to Journal
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  if (!entry) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <div className={styles.error}>Entry not found</div>
          <Link href="/journal" className={styles.backButton}>
            Back to Journal
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  const moodDisplay = getMoodDisplay(entry.mood);

  return (
    <ProtectedRoute>
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{entry.title}</h1>
        <div className={styles.actions}>
          <Link
            href={`/journal/${params.id}/edit`}
            className={styles.editButton}
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className={styles.deleteButton}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <Link href="/journal" className={styles.backButton}>
            Back to Journal
          </Link>
        </div>
      </div>

      <div className={styles.metadata}>
        <time dateTime={entry.created_at}>
          {new Date(entry.created_at).toLocaleDateString()}
        </time>
          {moodDisplay && (
            <div className={styles.moodDisplay}>
              <span className={styles.moodEmoji}>{moodDisplay.emoji}</span>
              <span className={styles.moodLabel}>{moodDisplay.label}</span>
            </div>
          )}
      </div>

      {entry.image_url && (
        <div className={styles.imageContainer}>
          <img src={entry.image_url} alt={entry.title} />
        </div>
      )}

      <div className={styles.content}>
          <div 
            dangerouslySetInnerHTML={{ __html: entry.content }}
            className={styles.richContent}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
} 