'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './settings.module.scss';
import Loader from '@/components/Loader';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const start = Date.now();
    setSaving(true);
    setMessage('');

    try {
      // TODO: Implement Supabase settings update
      // const { error } = await supabase
      //   .from('user_settings')
      //   .upsert({
      //     user_id: user.id,
      //     notifications,
      //     email_updates: emailUpdates,
      //     theme,
      //   });

      // if (error) throw error;

      setMessage('Settings saved successfully!');
    } catch (err) {
      setMessage('Failed to save settings. Please try again.');
    } finally {
      const elapsed = Date.now() - start;
      if (elapsed < 2000) {
        setTimeout(() => setSaving(false), 2000 - elapsed);
      } else {
        setSaving(false);
      }
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        {saving && <div className={styles.loaderOverlay}><Loader page="settings" label="Saving settings..." /></div>}
        <h1>Settings</h1>

        {message && (
          <div className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} style={saving ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
          <div className={styles.section}>
            <h2>Appearance</h2>
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <h3>Theme</h3>
                <p>Choose your preferred theme</p>
              </div>
              <div className={styles.themeOptions}>
                <label className={`${styles.themeOption} ${theme === 'light' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={() => handleThemeChange('light')}
                  />
                  <span className={styles.themeLabel}>Light</span>
                </label>
                <label className={`${styles.themeOption} ${theme === 'dark' ? styles.active : ''}`}>
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={() => handleThemeChange('dark')}
                  />
                  <span className={styles.themeLabel}>Dark</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Notifications</h2>
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <h3>Push Notifications</h3>
                <p>Receive notifications about your journal activity</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <h3>Email Updates</h3>
                <p>Receive email notifications about your journal activity</p>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={emailUpdates}
                  onChange={(e) => setEmailUpdates(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.saveButton}
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