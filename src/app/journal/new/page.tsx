'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import RichTextEditor from '@/components/RichTextEditor';
import MoodTracker from '@/components/MoodTracker';
import styles from './new.module.scss';

export default function NewEntryPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

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
    setLoading(true);
    setError('');

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      let imageUrl = null;
      
      // Upload image if exists
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

      // Prepare insert data
      const insertData: any = {
        user_id: user.id,
        title,
        content,
        image_url: imageUrl,
      };

      // Only include mood if it's not empty
      if (mood && mood.trim() !== '') {
        insertData.mood = mood;
      }

      console.log('Creating entry with data:', insertData);

      // Create entry
      const { error: insertError } = await supabase
        .from('entries')
        .insert([insertData]);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      router.push('/journal');
    } catch (err) {
      console.error('Create entry error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to create journal entry: ${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>New Journal Entry</h1>
        <Link href="/journal" className={styles.backButton}>
          Back to Journal
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
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Entry'}
          </button>
        </div>
      </form>
    </div>
  );
} 