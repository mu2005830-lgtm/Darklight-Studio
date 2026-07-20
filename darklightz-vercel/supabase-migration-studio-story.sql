-- Migration: add studio_story_image_url to site_settings
-- Run this in the Supabase SQL editor if the column does not yet exist.

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS studio_story_image_url text NOT NULL DEFAULT '';
