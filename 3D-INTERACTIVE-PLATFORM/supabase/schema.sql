-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Videos uploaded by creators
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INT,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  view_count INT NOT NULL DEFAULT 0
);

-- Individual scenes detected within a video
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  scene_index INT NOT NULL,
  start_time_seconds FLOAT,
  end_time_seconds FLOAT,
  keyframe_url TEXT,
  scene_3d_url TEXT,
  thumbnail_url TEXT,
  location_hint TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'failed')),
  world_labs_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Shoppable hotspots placed inside a 3D scene
CREATE TABLE hotspots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  object_name TEXT NOT NULL,
  position_x FLOAT NOT NULL DEFAULT 0,
  position_y FLOAT NOT NULL DEFAULT 1,
  position_z FLOAT NOT NULL DEFAULT 0,
  product_url TEXT,
  product_price DECIMAL(10, 2),
  product_image_url TEXT,
  ai_confidence FLOAT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (allow public read for now)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotspots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read ready videos" ON videos
  FOR SELECT USING (status = 'ready');

CREATE POLICY "Creators can insert their videos" ON videos
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their videos" ON videos
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Public can read scenes" ON scenes
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage scenes" ON scenes
  USING (true) WITH CHECK (true);

CREATE POLICY "Public can read hotspots" ON hotspots
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage hotspots" ON hotspots
  USING (true) WITH CHECK (true);

-- Indexes for common queries
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX idx_scenes_video_id ON scenes(video_id);
CREATE INDEX idx_hotspots_scene_id ON hotspots(scene_id);
