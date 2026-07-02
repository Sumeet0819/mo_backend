CREATE TABLE youtube_videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id text UNIQUE NOT NULL,
  title text,
  url text,
  thumbnail_url text,
  duration integer,
  view_count bigint,
  uploader text,
  synced_at timestamptz DEFAULT now()
);

-- Create an index on video_id for faster lookups
CREATE INDEX idx_youtube_videos_video_id ON youtube_videos(video_id);
