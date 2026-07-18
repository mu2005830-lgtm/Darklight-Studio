-- ============================================================
-- Darklightz Client Portal — Phase 3 migration
-- Run in the Supabase SQL editor (or via psql) AFTER the base
-- supabase-schema.sql has been applied.
-- ============================================================

-- Portal user profiles (linked to Supabase Auth)
create table if not exists portal_users (
  id            serial primary key,
  supabase_user_id text not null unique,
  email         text not null,
  name          text not null default '',
  company       text not null default '',
  phone         text not null default '',
  avatar_url    text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Client projects (created by admin, assigned to a portal user)
-- status: pending | active | in_progress | completed | cancelled
create table if not exists portal_projects (
  id                    serial primary key,
  portal_user_id        integer not null references portal_users(id) on delete cascade,
  title                 text not null,
  order_id              text not null default '',
  service_name          text not null default '',
  assigned_team_member  text not null default '',
  status                text not null default 'pending',
  progress_pct          integer not null default 0,
  start_date            text not null default '',
  est_completion_date   text not null default '',
  latest_update         text not null default '',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Project milestones
create table if not exists portal_milestones (
  id           serial primary key,
  project_id   integer not null references portal_projects(id) on delete cascade,
  title        text not null,
  description  text not null default '',
  status       text not null default 'pending',  -- pending | complete
  due_date     text not null default '',
  completed_at timestamptz,
  sort_order   integer not null default 0
);

-- Deliverable / uploaded files attached to a project
create table if not exists portal_project_files (
  id           serial primary key,
  project_id   integer not null references portal_projects(id) on delete cascade,
  name         text not null,
  url          text not null,
  size_bytes   integer not null default 0,
  uploaded_by  text not null default 'admin',   -- admin | client
  created_at   timestamptz not null default now()
);

-- Internal messages between client and admin
create table if not exists portal_messages (
  id             serial primary key,
  project_id     integer references portal_projects(id) on delete cascade,
  portal_user_id integer not null references portal_users(id) on delete cascade,
  sender         text not null default 'client',  -- admin | client
  body           text not null,
  is_read        boolean not null default false,
  created_at     timestamptz not null default now()
);

-- Revision requests from clients
-- status: pending | in_progress | completed
create table if not exists portal_revision_requests (
  id             serial primary key,
  project_id     integer not null references portal_projects(id) on delete cascade,
  portal_user_id integer not null references portal_users(id) on delete cascade,
  description    text not null,
  status         text not null default 'pending',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Support tickets
-- status: open | in_progress | closed
create table if not exists portal_support_tickets (
  id             serial primary key,
  portal_user_id integer not null references portal_users(id) on delete cascade,
  subject        text not null,
  body           text not null,
  status         text not null default 'open',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Support ticket replies
create table if not exists portal_support_replies (
  id        serial primary key,
  ticket_id integer not null references portal_support_tickets(id) on delete cascade,
  sender    text not null default 'admin',  -- admin | client
  body      text not null,
  created_at timestamptz not null default now()
);

-- Invoices
-- status: draft | sent | paid | overdue
create table if not exists portal_invoices (
  id             serial primary key,
  portal_user_id integer not null references portal_users(id) on delete cascade,
  project_id     integer references portal_projects(id) on delete set null,
  title          text not null,
  amount_cents   integer not null default 0,
  currency       text not null default 'USD',
  status         text not null default 'draft',
  issued_at      text not null default '',
  due_at         text not null default '',
  paid_at        text not null default '',
  invoice_url    text not null default '',
  created_at     timestamptz not null default now()
);

-- Notifications
-- type: info | progress | message | revision | ticket | invoice
create table if not exists portal_notifications (
  id             serial primary key,
  portal_user_id integer not null references portal_users(id) on delete cascade,
  type           text not null default 'info',
  title          text not null,
  body           text not null default '',
  is_read        boolean not null default false,
  related_id     integer,
  created_at     timestamptz not null default now()
);

-- ── Supabase Auth RLS policies ─────────────────────────────────────────────
-- Enable RLS on all portal tables.
-- Policy: service_role bypasses RLS automatically, so the API (using the
-- service role key) can read/write freely. If you want to allow direct
-- Supabase client access from the browser too, add user-scoped policies.

alter table portal_users              enable row level security;
alter table portal_projects           enable row level security;
alter table portal_milestones         enable row level security;
alter table portal_project_files      enable row level security;
alter table portal_messages           enable row level security;
alter table portal_revision_requests  enable row level security;
alter table portal_support_tickets    enable row level security;
alter table portal_support_replies    enable row level security;
alter table portal_invoices           enable row level security;
alter table portal_notifications      enable row level security;

-- Service role bypass (already the Supabase default, but made explicit)
-- The Express API uses the service role key, so it bypasses RLS entirely.
-- No additional policies needed for API access.
