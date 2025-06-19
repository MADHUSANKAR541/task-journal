'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ProtectedRoute from '@/components/ProtectedRoute';
import RichTextEditor from '@/components/RichTextEditor';
import MoodTracker from '@/components/MoodTracker';
import styles from './edit.module.scss';
import Loader from '@/components/Loader';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
  image_url?: string;
}

export default function EditEntryPage({ params }: { params: { id: string } }) {
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
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
      console.log('Fetching entry for edit:', params.id);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single();
      
      console.log('Edit entry fetch response:', { data, error });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setEntry(data);
      setTitle(data.title);
      setContent(data.content);
      setMood(data.mood || '');
      if (data.image_url) {
        setPreviewUrl(data.image_url);
      }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      let imageUrl = entry?.image_url;
      
      // Upload new image if exists
      if (image) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('journal-images')
          .upload(fileName, image);
        
        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('journal-images')
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;
      }

      // Prepare update data
      const updateData: any = {
        title,
        content,
        image_url: imageUrl,
      };

      // Only include mood if it's not empty
      if (mood && mood.trim() !== '') {
        updateData.mood = mood;
      } else {
        updateData.mood = null;
      }

      console.log('Updating entry with data:', updateData);

      // Update entry
      const { error: updateError } = await supabase
        .from('entries')
        .update(updateData)
        .eq('id', params.id)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      router.push(`/journal/${params.id}`);
    } catch (err) {
      console.error('Update entry error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to update journal entry: ${errorMessage}`);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className={styles.loaderOverlay}><Loader page="edit" label="Loading entry..." /></div>
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

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Edit Journal Entry</h1>
          <Link href={`/journal/${params.id}`} className={styles.backButton}>
            Back to Entry
          </Link>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Give your entry a title"
            />
          </div>

          <div className={styles.formGroup}>
            <MoodTracker
              selectedMood={mood}
              onMoodChange={setMood}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Write your thoughts here..."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image">Image (Optional)</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewUrl && (
              <div className={styles.imagePreview}>
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
} 