-- TourLink CRM — initial schema.
-- Two-tier tourism CRM driven from WhatsApp (the "Concierge / Twiga").
-- Additive only. RLS is ENABLED with NO public policies: every table is reached
-- exclusively through the server-side service-role client, scoped by team_id.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Workspace. One team per business (TourLink; VisaPermitLink added later).
-- ---------------------------------------------------------------------------
create table if not exists teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Tier 1 — Accounts (the CRM funnel).
-- ---------------------------------------------------------------------------
create table if not exists accounts (
  id            uuid primary key default gen_random_uuid(),
  team_id       uuid not null references teams(id) on delete cascade,
  name          text not null,
  kind          text not null default 'individual',
  status        text not null default 'lead',
  owner_name    text not null default 'Business Dev',
  source        text,
  country       text,
  contact_phone text,
  contact_email text,
  vip           boolean not null default false,
  value         numeric not null default 0,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists accounts_team_idx on accounts(team_id);
create index if not exists accounts_phone_idx on accounts(contact_phone);

-- One delivery board per account (holds its cards).
create table if not exists boards (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references teams(id) on delete cascade,
  account_id  uuid references accounts(id) on delete set null,
  name        text not null,
  created_at  timestamptz not null default now()
);
create index if not exists boards_team_idx on boards(team_id);
create index if not exists boards_account_idx on boards(account_id);

-- ---------------------------------------------------------------------------
-- Tier 2 — Trips (a booked journey) and their building blocks.
-- ---------------------------------------------------------------------------
create table if not exists trips (
  id            uuid primary key default gen_random_uuid(),
  team_id       uuid not null references teams(id) on delete cascade,
  account_id    uuid not null references accounts(id) on delete cascade,
  name          text not null,
  status        text not null default 'planning',
  destinations  text[] not null default '{}',
  start_date    date,
  end_date      date,
  pax           int,
  value         numeric not null default 0,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists trips_team_idx on trips(team_id);
create index if not exists trips_account_idx on trips(account_id);

create table if not exists segments (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references teams(id) on delete cascade,
  trip_id     uuid not null references trips(id) on delete cascade,
  name        text not null,
  kind        text not null default 'other',
  value       numeric not null default 0,
  status      text not null default 'proposed',
  nights      int,
  start_date  date,
  supplier    text,
  sort        int not null default 0,
  notes       text
);
create index if not exists segments_trip_idx on segments(trip_id);

create table if not exists payments (
  id           uuid primary key default gen_random_uuid(),
  team_id      uuid not null references teams(id) on delete cascade,
  trip_id      uuid not null references trips(id) on delete cascade,
  label        text not null,
  trigger      text,
  amount       numeric not null default 0,
  status       text not null default 'pending',
  due_date     date,
  invoiced_at  timestamptz,
  paid_at      timestamptz,
  sort         int not null default 0
);
create index if not exists payments_trip_idx on payments(trip_id);

create table if not exists trip_docs (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references teams(id) on delete cascade,
  trip_id     uuid not null references trips(id) on delete cascade,
  code        text,
  label       text not null,
  status      text not null default 'todo',
  owner_name  text,
  due         date,
  sort        int not null default 0
);
create index if not exists trip_docs_trip_idx on trip_docs(trip_id);

-- ---------------------------------------------------------------------------
-- Pipeline cards (opportunities / enquiries).
-- ---------------------------------------------------------------------------
create table if not exists cards (
  id             uuid primary key default gen_random_uuid(),
  board_id       uuid not null references boards(id) on delete cascade,
  account_id     uuid references accounts(id) on delete set null,
  trip_id        uuid references trips(id) on delete set null,
  title          text not null,
  type           text not null default 'Enquiry',
  stage          text not null default 'enquiry',
  owner_name     text not null default 'Business Dev',
  priority       text not null default 'Medium',
  source         text,
  value          numeric not null default 0,
  pax            int,
  destinations   text[] not null default '{}',
  travel_from    date,
  travel_to      date,
  due            date,
  outcome        text not null default 'open',
  outcome_reason text,
  notes          text,
  docs           jsonb not null default '[]',
  position       int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists cards_board_idx on cards(board_id);
create index if not exists cards_account_idx on cards(account_id);
create index if not exists cards_stage_idx on cards(stage);

-- ---------------------------------------------------------------------------
-- Activity feed + outbound message queue.
-- ---------------------------------------------------------------------------
create table if not exists activity (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references teams(id) on delete cascade,
  actor_name  text not null,
  verb        text not null,
  subject     text not null,
  detail      text,
  account_id  uuid references accounts(id) on delete set null,
  trip_id     uuid references trips(id) on delete set null,
  card_id     uuid references cards(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists activity_team_idx on activity(team_id, created_at desc);

create table if not exists outbox (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references teams(id) on delete cascade,
  target      text not null,
  kind        text not null default 'message',
  text        text not null,
  media_url   text,
  status      text not null default 'queued',
  created_at  timestamptz not null default now(),
  sent_at     timestamptz
);
create index if not exists outbox_status_idx on outbox(status, created_at);

-- ---------------------------------------------------------------------------
-- updated_at touch trigger.
-- ---------------------------------------------------------------------------
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'accounts_touch') then
    create trigger accounts_touch before update on accounts for each row execute function touch_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'trips_touch') then
    create trigger trips_touch before update on trips for each row execute function touch_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'cards_touch') then
    create trigger cards_touch before update on cards for each row execute function touch_updated_at();
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- RLS on, deny-all to anon/auth roles. The service-role key (server only)
-- bypasses RLS. Never expose these tables to the browser anon key.
-- ---------------------------------------------------------------------------
alter table teams      enable row level security;
alter table accounts   enable row level security;
alter table boards     enable row level security;
alter table trips      enable row level security;
alter table segments   enable row level security;
alter table payments   enable row level security;
alter table trip_docs  enable row level security;
alter table cards      enable row level security;
alter table activity   enable row level security;
alter table outbox     enable row level security;
