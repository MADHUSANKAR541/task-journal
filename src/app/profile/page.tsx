'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './profile.module.scss';
import Loader from '@/components/Loader';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || '');
  const [bio, setBio] = useState(user?.user_metadata?.bio || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const start = Date.now();
    setSaving(true);
    setMessage('');

    try {
      // TODO: Implement Supabase profile update
      // const { error } = await supabase.auth.updateUser({
      //   data: {
      //     full_name: displayName,
      //     bio: bio,
      //   }
      // });

      // if (error) throw error;

      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      const elapsed = Date.now() - start;
      if (elapsed < 2000) {
        setTimeout(() => setSaving(false), 2000 - elapsed);
      } else {
        setSaving(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>

        {message && (
          <div className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        {saving && <div className={styles.loaderOverlay}><Loader page="profile" label="Saving profile..." /></div>}

        <div className={styles.profileSection}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {user?.user_metadata?.full_name ? 
                user.user_metadata.full_name.charAt(0).toUpperCase() : 
                user?.email?.charAt(0).toUpperCase()}
            </div>
            <h2>{user?.user_metadata?.full_name || 'User'}</h2>
            <p className={styles.email}>{user?.email}</p>
          </div>

          <div className={styles.accountInfo}>
            <h3>Account Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{user?.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Member Since</span>
                <span className={styles.value}>
                  {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Last Sign In</span>
                <span className={styles.value}>
                  {user?.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.profileForm}>
            <div className={styles.formHeader}>
              <h3>Profile Details</h3>
              <button
                type="button"
                className={styles.editButton}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="displayName">Display Name</label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.profileDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Display Name</span>
                  <span className={styles.value}>
                    {user?.user_metadata?.full_name || 'Not set'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Bio</span>
                  <span className={styles.value}>
                    {user?.user_metadata?.bio || 'No bio added yet'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 