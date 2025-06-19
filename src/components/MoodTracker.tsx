'use client';

import { useState } from 'react';
import styles from './MoodTracker.module.scss';

export interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

const MOODS: Mood[] = [
  { id: 'ecstatic', emoji: '🤩', label: 'Ecstatic', color: '#FFD700' },
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#FFA500' },
  { id: 'content', emoji: '😌', label: 'Content', color: '#90EE90' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: '#87CEEB' },
  { id: 'sad', emoji: '😔', label: 'Sad', color: '#6495ED' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#DDA0DD' },
  { id: 'angry', emoji: '😠', label: 'Angry', color: '#FF6347' },
  { id: 'exhausted', emoji: '😴', label: 'Exhausted', color: '#708090' },
];

interface MoodTrackerProps {
  selectedMood?: string;
  onMoodChange: (moodId: string) => void;
  className?: string;
}

export default function MoodTracker({ 
  selectedMood, 
  onMoodChange, 
  className = "" 
}: MoodTrackerProps) {
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  return (
    <div className={`${styles.moodTracker} ${className}`}>
      <label className={styles.label}>How are you feeling today?</label>
      <div className={styles.moodGrid}>
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            type="button"
            className={`${styles.moodButton} ${
              selectedMood === mood.id ? styles.selected : ''
            }`}
            onClick={() => onMoodChange(mood.id)}
            onMouseEnter={() => setHoveredMood(mood.id)}
            onMouseLeave={() => setHoveredMood(null)}
            title={mood.label}
          >
            <span className={styles.emoji}>{mood.emoji}</span>
            {(hoveredMood === mood.id || selectedMood === mood.id) && (
              <span className={styles.label}>{mood.label}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export { MOODS }; 