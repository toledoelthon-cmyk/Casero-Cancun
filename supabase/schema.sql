create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  price_mxn integer not null,
  description text,
  features jsonb,
  max_categories integer,
  max_photos integer,
  is_featured_plan boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  type text not null check (type in ('service', 'store')),
  section text check (section in ('home_services', 'stores_materials', 'pets', 'auto_services')),
  description text,
  icon text,
  created_at timestamptz default now()
);

alter table public.categories
  add column if not exists section text;

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

create index if not exists plans_slug_idx on public.plans (slug);
create index if not exists categories_slug_idx on public.categories (slug);
create index if not exists categories_type_idx on public.categories (type);
create index if not exists categories_section_idx on public.categories (section);
create index if not exists locations_slug_idx on public.locations (slug);

alter table public.plans enable row level security;
alter table public.categories enable row level security;
alter table public.locations enable row level security;

create policy "Public read access for plans"
  on public.plans
  for select
  using (true);

create policy "Public read access for categories"
  on public.categories
  for select
  using (true);

create policy "Public read access for locations"
  on public.locations
  for select
  using (true);

create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references public.plans(id),
  business_name text not null,
  responsible_name text,
  slug text unique not null,
  profile_type text not null check (profile_type in ('service_provider', 'material_store')),
  section text check (section in ('home_services', 'stores_materials', 'pets', 'auto_services')),
  short_description text,
  long_description text,
  main_service text,
  phone text,
  whatsapp text,
  email text,
  website text,
  address text,
  postal_code text,
  has_physical_location boolean default false,
  location_mode text check (location_mode in ('physical', 'home_service', 'both', 'zones_only')),
  show_map boolean default false,
  latitude numeric,
  longitude numeric,
  attends_outside_cancun boolean default false,
  status text default 'pending' check (status in ('pending', 'published', 'paused', 'rejected')),
  is_featured boolean default false,
  is_verified boolean default false,
  accepts_card boolean default false,
  accepts_transfer boolean default false,
  invoices boolean default false,
  emergency_service boolean default false,
  service_24_7 boolean default false,
  by_appointment boolean default false,
  service_at_home boolean default false,
  free_estimate boolean default false,
  attends_airbnb boolean default false,
  attends_condos boolean default false,
  offers_warranty boolean default false,
  retail_sales boolean default false,
  wholesale_sales boolean default false,
  delivery_available boolean default false,
  authorized_distributor boolean default false,
  pet_veterinary_service boolean default false,
  pet_grooming boolean default false,
  pet_daycare boolean default false,
  pet_food_accessories boolean default false,
  auto_tow_service boolean default false,
  auto_diagnostics boolean default false,
  auto_parts boolean default false,
  auto_wash_detailing boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.business_profiles
  add column if not exists responsible_name text;

alter table public.business_profiles
  add column if not exists section text;

alter table public.business_profiles
  add column if not exists has_physical_location boolean default false,
  add column if not exists location_mode text,
  add column if not exists show_map boolean default false,
  add column if not exists latitude numeric,
  add column if not exists longitude numeric,
  add column if not exists service_at_home boolean default false,
  add column if not exists free_estimate boolean default false,
  add column if not exists retail_sales boolean default false,
  add column if not exists wholesale_sales boolean default false,
  add column if not exists delivery_available boolean default false,
  add column if not exists authorized_distributor boolean default false,
  add column if not exists pet_veterinary_service boolean default false,
  add column if not exists pet_grooming boolean default false,
  add column if not exists pet_daycare boolean default false,
  add column if not exists pet_food_accessories boolean default false,
  add column if not exists auto_tow_service boolean default false,
  add column if not exists auto_diagnostics boolean default false,
  add column if not exists auto_parts boolean default false,
  add column if not exists auto_wash_detailing boolean default false;

create index if not exists business_profiles_slug_idx on public.business_profiles (slug);
create index if not exists business_profiles_status_idx on public.business_profiles (status);
create index if not exists business_profiles_profile_type_idx on public.business_profiles (profile_type);
create index if not exists business_profiles_section_idx on public.business_profiles (section);
create index if not exists business_profiles_is_featured_idx on public.business_profiles (is_featured);
create index if not exists business_profiles_is_verified_idx on public.business_profiles (is_verified);

alter table public.business_profiles enable row level security;

create policy "Public read access for published business profiles"
  on public.business_profiles
  for select
  using (status = 'published');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_business_profiles_updated_at on public.business_profiles;

create trigger set_business_profiles_updated_at
  before update on public.business_profiles
  for each row
  execute function public.set_updated_at();

create table if not exists public.business_categories (
  business_id uuid references public.business_profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  primary key (business_id, category_id)
);

create table if not exists public.business_locations (
  business_id uuid references public.business_profiles(id) on delete cascade,
  location_id uuid references public.locations(id) on delete cascade,
  primary key (business_id, location_id)
);

create table if not exists public.business_media (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.business_profiles(id) on delete cascade,
  url text not null,
  type text default 'image',
  alt text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.business_categories enable row level security;
alter table public.business_locations enable row level security;
alter table public.business_media enable row level security;

create policy "Public read access for business media"
  on public.business_media
  for select
  using (true);

drop policy if exists "Public insert business media" on public.business_media;

create policy "Public insert business media"
  on public.business_media
  for insert
  with check (true);

drop policy if exists "Public insert pending business profiles" on public.business_profiles;

create policy "Public insert pending business profiles"
  on public.business_profiles
  for insert
  with check (status = 'pending');

drop policy if exists "Public insert business categories" on public.business_categories;

create policy "Public insert business categories"
  on public.business_categories
  for insert
  with check (true);

drop policy if exists "Public insert business locations" on public.business_locations;

create policy "Public insert business locations"
  on public.business_locations
  for insert
  with check (true);
