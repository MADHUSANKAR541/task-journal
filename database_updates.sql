-- Add mood tracking to entries table
ALTER TABLE entries ADD COLUMN mood VARCHAR(50);

-- Add index for mood queries
CREATE INDEX idx_entries_mood ON entries(mood);

-- Add mood tracking to the entries table with a check constraint
ALTER TABLE entries ADD CONSTRAINT check_mood 
CHECK (mood IN ('ecstatic', 'happy', 'content', 'neutral', 'sad', 'anxious', 'angry', 'exhausted') OR mood IS NULL); 