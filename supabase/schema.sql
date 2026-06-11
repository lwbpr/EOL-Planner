create extension if not exists pgcrypto;

create table if not exists towns (
  slug text primary key,
  name text not null,
  region text not null,
  created_at timestamptz not null default now()
);

create table if not exists resources (
  id text primary key,
  category text not null,
  source text not null,
  name text not null,
  town text,
  town_slug text references towns(slug) on update cascade on delete set null,
  region text,
  regions text[] not null default '{}',
  phone text,
  email text,
  website text,
  socials text[] not null default '{}',
  address text,
  organization text,
  description text,
  summary text not null,
  services text[] not null default '{}',
  needs text[] not null default '{}',
  stages text[] not null default '{}',
  care_settings text[] not null default '{}',
  source_label text not null,
  source_urls text[] not null default '{}',
  coverage text,
  verification text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resources_category_check check (
    category in ('doula', 'apoyo_complementario', 'hospicio', 'servicio_funebre')
  )
);

create index if not exists resources_category_idx on resources (category);
create index if not exists resources_town_slug_idx on resources (town_slug);
create index if not exists resources_region_idx on resources (region);

create table if not exists intake_sessions (
  id uuid primary key default gen_random_uuid(),
  stage text not null,
  care_setting text not null,
  need text not null,
  town_slug text not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table resources enable row level security;
alter table towns enable row level security;
alter table intake_sessions enable row level security;

drop policy if exists "Public read towns" on towns;
create policy "Public read towns"
  on towns
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read resources" on resources;
create policy "Public read resources"
  on resources
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public insert intake_sessions" on intake_sessions;
create policy "Public insert intake_sessions"
  on intake_sessions
  for insert
  to anon, authenticated
  with check (true);
