-- Darklightz schema for Supabase Postgres.
-- Mirrors the Drizzle schema in api/_lib/db/schema/*.ts exactly.
-- Run once in the Supabase SQL editor (or `psql "$DATABASE_URL" -f supabase-schema.sql`)
-- before running `pnpm run db:push`, or use this file as the source of truth instead
-- of drizzle-kit push if you prefer plain SQL.

-- ============================================================
-- Phase 1 tables (original)
-- ============================================================

create table if not exists services (
  id serial primary key,
  title text not null,
  slug text not null unique,
  summary text not null,
  description text not null,
  icon text not null,
  sort_order integer not null default 0
);

create table if not exists portfolio_projects (
  id serial primary key,
  title text not null,
  slug text not null unique,
  category text not null,
  summary text not null,
  image_url text not null,
  tags text[] not null default '{}',
  year integer not null,
  sort_order integer not null default 0
);

create table if not exists case_studies (
  id serial primary key,
  title text not null,
  slug text not null unique,
  client text not null,
  summary text not null,
  challenge text not null,
  solution text not null,
  result text not null,
  image_url text not null,
  metric_label text not null,
  metric_value text not null,
  sort_order integer not null default 0
);

create table if not exists testimonials (
  id serial primary key,
  name text not null,
  role text not null,
  company text not null,
  quote text not null,
  avatar_url text not null,
  sort_order integer not null default 0
);

create table if not exists blog_posts (
  id serial primary key,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_image_url text not null,
  author text not null,
  category text not null,
  published_at timestamptz not null default now()
);

create table if not exists pricing_plans (
  id serial primary key,
  name text not null,
  tagline text not null,
  price text not null,
  billing_note text not null,
  features text[] not null default '{}',
  is_featured boolean not null default false,
  sort_order integer not null default 0
);

create table if not exists contact_submissions (
  id serial primary key,
  name text not null,
  email text not null,
  company text,
  budget text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id serial primary key,
  name text not null,
  email text not null,
  company text,
  service text not null,
  preferred_date timestamptz not null,
  message text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Phase 2 tables — CMS
-- ============================================================

-- Single-row global site configuration.
-- The `singleton` column + unique constraint enforces exactly one row at the DB level.
create table if not exists site_settings (
  id serial primary key,
  site_name text not null default 'Darklightz Studio',
  tagline text not null default '',
  contact_email text not null default '',
  contact_phone text not null default '',
  contact_address text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  og_image_url text not null default '',
  favicon_url text not null default '',
  logo_text text not null default 'DARKLIGHTZ',
  logo_url text not null default '',
  primary_color text not null default '#ffffff',
  accent_color text not null default '#ffffff',
  font_heading text not null default 'Syne',
  font_body text not null default 'Plus Jakarta Sans',
  hero_title text not null default '',
  hero_subtitle text not null default '',
  hero_cta_text text not null default '',
  hero_cta_url text not null default '',
  updated_at timestamptz not null default now(),
  singleton bool not null default true,
  constraint site_settings_singleton unique (singleton)
);

-- Social / external links shown in footer and contact pages
create table if not exists social_links (
  id serial primary key,
  platform text not null,
  url text not null,
  icon text not null default '',
  sort_order integer not null default 0
);

-- Studio team members
create table if not exists team_members (
  id serial primary key,
  name text not null,
  role text not null,
  bio text not null default '',
  avatar_url text not null default '',
  linkedin_url text not null default '',
  sort_order integer not null default 0
);

-- Frequently-asked questions
create table if not exists faq_items (
  id serial primary key,
  question text not null,
  answer text not null,
  category text not null default '',
  sort_order integer not null default 0
);

-- Client logos / references
create table if not exists clients (
  id serial primary key,
  name text not null,
  logo_url text not null default '',
  website_url text not null default '',
  sort_order integer not null default 0
);
