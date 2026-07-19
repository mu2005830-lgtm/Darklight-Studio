-- ── Reviews System ──────────────────────────────────────────────────────────
-- Run this SQL in your Supabase SQL Editor to add the reviews table.
-- https://supabase.com/dashboard/project/clhmisxqjinlcgmxhhsd/sql

create table if not exists reviews (
  id          serial primary key,
  name        text    not null,
  company     text,
  rating      integer not null default 5,
  review      text    not null,
  logo_url    text,
  image_url   text,
  -- pending | approved | rejected
  status      text    not null default 'pending',
  created_at  timestamp not null default now(),
  updated_at  timestamp not null default now()
);

-- Index for fast public fetch (approved reviews only)
create index if not exists reviews_status_idx on reviews (status);
