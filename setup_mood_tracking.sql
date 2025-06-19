-- Mood Tracking Setup Script
-- Run this in your Supabase SQL Editor

-- 1. Add mood column to entries table (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'entries' AND column_name = 'mood'
    ) THEN
        ALTER TABLE entries ADD COLUMN mood VARCHAR(50);
        RAISE NOTICE 'Added mood column to entries table';
    ELSE
        RAISE NOTICE 'Mood column already exists';
    END IF;
END $$;

-- 2. Add index for mood queries (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_entries_mood'
    ) THEN
        CREATE INDEX idx_entries_mood ON entries(mood);
        RAISE NOTICE 'Added mood index';
    ELSE
        RAISE NOTICE 'Mood index already exists';
    END IF;
END $$;

-- 3. Add check constraint for valid mood values (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'check_mood'
    ) THEN
        ALTER TABLE entries ADD CONSTRAINT check_mood 
        CHECK (mood IN ('ecstatic', 'happy', 'content', 'neutral', 'sad', 'anxious', 'angry', 'exhausted') OR mood IS NULL);
        RAISE NOTICE 'Added mood check constraint';
    ELSE
        RAISE NOTICE 'Mood check constraint already exists';
    END IF;
END $$;

-- 4. Verify the setup
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'entries' AND column_name = 'mood';

-- 5. Show existing entries (for verification)
SELECT id, title, mood, created_at 
FROM entries 
ORDER BY created_at DESC 
LIMIT 5; 