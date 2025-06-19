'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { MOODS } from './MoodTracker';
import { 
  Calendar, 
  FileText, 
  TrendingUp, 
  Clock,
  BarChart3,
  Target
} from 'lucide-react';
import styles from './WritingAnalytics.module.scss';

interface Entry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
}

interface Analytics {
  totalEntries: number;
  totalWords: number;
  averageWordsPerEntry: number;
  currentStreak: number;
  longestStreak: number;
  moodDistribution: Record<string, number>;
  recentActivity: { date: string; count: number }[];
}

export default function WritingAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data: entries, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const analytics = calculateAnalytics(entries || []);
      setAnalytics(analytics);
    } catch (err) {
      console.error('Fetch analytics error:', err);
      setError(`Failed to fetch analytics: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (entries: Entry[]): Analytics => {
    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, entry) => {
      // Strip HTML tags and count words
      const textContent = entry.content.replace(/<[^>]*>/g, '');
      return sum + textContent.split(/\s+/).filter(word => word.length > 0).length;
    }, 0);
    
    const averageWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

    // Calculate streaks
    const dates = entries.map(entry => new Date(entry.created_at).toDateString());
    const uniqueDates = [...new Set(dates)].sort().reverse();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);
      const nextDate = i < uniqueDates.length - 1 ? new Date(uniqueDates[i + 1]) : null;
      
      if (nextDate) {
        const diffDays = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 0;
        }
      } else {
        tempStreak++;
      }
      
      // Check current streak
      if (uniqueDates[i] === today || uniqueDates[i] === yesterday) {
        currentStreak = tempStreak;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate mood distribution
    const moodDistribution: Record<string, number> = {};
    entries.forEach(entry => {
      if (entry.mood) {
        moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
      }
    });

    // Calculate recent activity (last 7 days)
    const recentActivity: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      const count = dates.filter(d => d === dateString).length;
      recentActivity.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count
      });
    }

    return {
      totalEntries,
      totalWords,
      averageWordsPerEntry,
      currentStreak,
      longestStreak,
      moodDistribution,
      recentActivity
    };
  };

  const getMoodLabel = (moodId: string) => {
    return MOODS.find(mood => mood.id === moodId)?.label || moodId;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        {error}
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className={styles.analytics}>
      <h2 className={styles.title}>Writing Analytics</h2>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileText size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{analytics.totalEntries}</div>
            <div className={styles.statLabel}>Total Entries</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{analytics.totalWords.toLocaleString()}</div>
            <div className={styles.statLabel}>Total Words</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BarChart3 size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{analytics.averageWordsPerEntry}</div>
            <div className={styles.statLabel}>Avg. Words/Entry</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Target size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{analytics.currentStreak}</div>
            <div className={styles.statLabel}>Current Streak</div>
          </div>
        </div>
      </div>

      {Object.keys(analytics.moodDistribution).length > 0 && (
        <div className={styles.section}>
          <h3>Mood Distribution</h3>
          <div className={styles.moodStats}>
            {Object.entries(analytics.moodDistribution).map(([moodId, count]) => (
              <div key={moodId} className={styles.moodStat}>
                <span className={styles.moodName}>{getMoodLabel(moodId)}</span>
                <span className={styles.moodCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3>Recent Activity (Last 7 Days)</h3>
        <div className={styles.activityChart}>
          {analytics.recentActivity.map((day, index) => (
            <div key={index} className={styles.activityBar}>
              <div 
                className={styles.bar} 
                style={{ height: `${Math.max(day.count * 20, 4)}px` }}
              />
              <span className={styles.dayLabel}>{day.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 