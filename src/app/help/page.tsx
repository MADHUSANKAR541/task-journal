'use client';

import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import styles from './help.module.scss';
import Loader from '@/components/Loader';

type SectionKey = 'getting-started' | 'features' | 'faq';

interface Section {
  title: string;
  content: ReactElement;
}

type Sections = Record<SectionKey, Section>;

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>('getting-started');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const sections: Sections = {
    'getting-started': {
      title: 'Getting Started',
      content: (
        <>
          <h2>Welcome to Team Journal</h2>
          <p>Team Journal is a collaborative platform for teams to share their daily experiences, achievements, and challenges.</p>
          
          <h3>Quick Start Guide</h3>
          <ol>
            <li>Create an account or log in if you already have one</li>
            <li>Set up your profile with your name and avatar</li>
            <li>Start creating journal entries</li>
            <li>Share your entries with your team</li>
          </ol>
        </>
      ),
    },
    'features': {
      title: 'Features',
      content: (
        <>
          <h2>Key Features</h2>
          <ul>
            <li>
              <strong>Journal Entries</strong>
              <p>Create, edit, and manage your daily journal entries with rich text formatting.</p>
            </li>
            <li>
              <strong>Team Collaboration</strong>
              <p>Share your entries with team members and comment on their posts.</p>
            </li>
            <li>
              <strong>Notifications</strong>
              <p>Stay updated with real-time notifications for new comments and mentions.</p>
            </li>
            <li>
              <strong>Search & Filter</strong>
              <p>Easily find past entries using our powerful search and filter tools.</p>
            </li>
          </ul>
        </>
      ),
    },
    'faq': {
      title: 'FAQ',
      content: (
        <>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>How do I create a new journal entry?</h3>
              <p>Click the "New Entry" button in the navigation bar or on the journal page. Fill in the title and content, then click "Save" to publish your entry.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Can I edit my entries after publishing?</h3>
              <p>Yes, you can edit your entries at any time. Click the edit button on any of your entries to make changes.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>How do I share my entries with team members?</h3>
              <p>Your entries are automatically visible to your team members. You can also mention specific team members using the @ symbol.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Is my data secure?</h3>
              <p>Yes, we take security seriously. All data is encrypted and stored securely in our database.</p>
            </div>
          </div>
        </>
      ),
    },
  };

  if (loading) {
    return <div className={styles.loaderOverlay}><Loader page="help" label="Loading help..." /></div>;
  }

  return (
    <div className={styles.container}>
      <h1>Help & Documentation</h1>
      
      <div className={styles.content}>
        <div className={styles.sidebar}>
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              className={`${styles.sidebarItem} ${activeSection === key ? styles.active : ''}`}
              onClick={() => setActiveSection(key as SectionKey)}
            >
              {section.title}
            </button>
          ))}
        </div>
        
        <div className={styles.mainContent}>
          {sections[activeSection].content}
        </div>
      </div>
    </div>
  );
} 