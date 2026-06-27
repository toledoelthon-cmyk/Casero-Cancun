-- Production RLS proposal for Casero Cancun.
--
-- Review before running. This file intentionally drops known development
-- policies and recreates production policies based on Supabase Auth plus
-- public.user_profiles.role.
--
-- Current compatibility note:
-- The public registration flow still has no provider login. To avoid breaking
-- /registrar-mi-negocio during this phase, this file keeps narrowly scoped
-- temporary anon insert/read policies for pending, unowned business records.
-- Remove those policies in the provider-auth phase.

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'provider',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_profiles_role_check'
      and conrelid = 'public.user_profiles'::regclass
  ) then
    alter table public.user_profiles
      add constraint user_profiles_role_check
      check (role in ('admin', 'provider'));
  end if;
end;
$$;

alter table public.business_profiles
  add column if not exists owner_user_id uuid references auth.users(id);

create index if not exists user_profiles_role_idx on public.user_profiles (role);
create index if not exists business_profiles_owner_user_id_idx on public.business_profiles (owner_user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.is_provider()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles
    where id = auth.uid()
      and role = 'provider'
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_provider() from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_provider() to authenticated;

alter table public.user_profiles enable row level security;
alter table public.business_profiles enable row level security;
alter table public.business_categories enable row level security;
alter table public.business_locations enable row level security;
alter table public.business_media enable row level security;
alter table public.categories enable row level security;
alter table public.locations enable row level security;
alter table public.plans enable row level security;

-- Drop development and previous draft policies.

drop policy if exists "Temporary admin read all business profiles" on public.business_profiles;
drop policy if exists "Temporary admin update business profiles" on public.business_profiles;
drop policy if exists "Temporary admin read business categories" on public.business_categories;
drop policy if exists "Temporary admin insert business categories" on public.business_categories;
drop policy if exists "Temporary admin delete business categories" on public.business_categories;
drop policy if exists "Temporary admin read business locations" on public.business_locations;
drop policy if exists "Temporary admin insert business locations" on public.business_locations;
drop policy if exists "Temporary admin delete business locations" on public.business_locations;
drop policy if exists "Temporary admin read business media" on public.business_media;
drop policy if exists "Temporary admin insert business media" on public.business_media;
drop policy if exists "Temporary admin update business media" on public.business_media;
drop policy if exists "Temporary admin delete business media" on public.business_media;

drop policy if exists "Public read access for published business profiles" on public.business_profiles;
drop policy if exists "Public insert pending business profiles" on public.business_profiles;
drop policy if exists "Public insert business categories" on public.business_categories;
drop policy if exists "Public insert business locations" on public.business_locations;
drop policy if exists "Public read access for business media" on public.business_media;
drop policy if exists "Public insert business media" on public.business_media;
drop policy if exists "Public read access for plans" on public.plans;
drop policy if exists "Public read access for categories" on public.categories;
drop policy if exists "Public read access for locations" on public.locations;

drop policy if exists "Users can read own profile" on public.user_profiles;
drop policy if exists "Users can create own provider profile" on public.user_profiles;
drop policy if exists "Providers can update own profile" on public.user_profiles;
drop policy if exists "Admins can manage user profiles" on public.user_profiles;
drop policy if exists "Public read plans" on public.plans;
drop policy if exists "Public read categories" on public.categories;
drop policy if exists "Public read locations" on public.locations;
drop policy if exists "Admins manage plans" on public.plans;
drop policy if exists "Admins manage categories" on public.categories;
drop policy if exists "Admins manage locations" on public.locations;
drop policy if exists "Public read published business profiles" on public.business_profiles;
drop policy if exists "Temporary public insert pending unowned business profiles" on public.business_profiles;
drop policy if exists "Temporary public read pending unowned business profiles for registration" on public.business_profiles;
drop policy if exists "Providers read own business profiles" on public.business_profiles;
drop policy if exists "Admins read all business profiles" on public.business_profiles;
drop policy if exists "Providers create own pending business profiles" on public.business_profiles;
drop policy if exists "Providers update own pending or paused business profiles" on public.business_profiles;
drop policy if exists "Admins insert business profiles" on public.business_profiles;
drop policy if exists "Admins update business profiles" on public.business_profiles;
drop policy if exists "Admins delete business profiles" on public.business_profiles;
drop policy if exists "Public read categories for published businesses" on public.business_categories;
drop policy if exists "Public read locations for published businesses" on public.business_locations;
drop policy if exists "Temporary public insert categories for pending unowned businesses" on public.business_categories;
drop policy if exists "Temporary public insert locations for pending unowned businesses" on public.business_locations;
drop policy if exists "Providers read categories for own businesses" on public.business_categories;
drop policy if exists "Providers read locations for own businesses" on public.business_locations;
drop policy if exists "Providers insert categories for own pending or paused businesses" on public.business_categories;
drop policy if exists "Providers insert locations for own pending or paused businesses" on public.business_locations;
drop policy if exists "Providers delete categories for own pending or paused businesses" on public.business_categories;
drop policy if exists "Providers delete locations for own pending or paused businesses" on public.business_locations;
drop policy if exists "Admins manage business categories" on public.business_categories;
drop policy if exists "Admins manage business locations" on public.business_locations;
drop policy if exists "Public read media for published businesses" on public.business_media;
drop policy if exists "Temporary public insert media for pending unowned businesses" on public.business_media;
drop policy if exists "Providers read media for own businesses" on public.business_media;
drop policy if exists "Providers insert media for own pending or paused businesses" on public.business_media;
drop policy if exists "Providers insert media for own businesses" on public.business_media;
drop policy if exists "Providers update media for own pending or paused businesses" on public.business_media;
drop policy if exists "Providers update media for own businesses" on public.business_media;
drop policy if exists "Providers delete media for own pending or paused businesses" on public.business_media;
drop policy if exists "Providers delete media for own businesses" on public.business_media;
drop policy if exists "Admins manage business media" on public.business_media;

-- user_profiles

create policy "Users can read own profile"
  on public.user_profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "Users can create own provider profile"
  on public.user_profiles
  for insert
  to authenticated
  with check (
    id = auth.uid()
    and role = 'provider'
  );

create policy "Providers can update own profile"
  on public.user_profiles
  for update
  to authenticated
  using (
    id = auth.uid()
    and role = 'provider'
  )
  with check (
    id = auth.uid()
    and role = 'provider'
  );

create policy "Admins can manage user profiles"
  on public.user_profiles
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Catalog tables

create policy "Public read plans"
  on public.plans
  for select
  to anon, authenticated
  using (true);

create policy "Public read categories"
  on public.categories
  for select
  to anon, authenticated
  using (true);

create policy "Public read locations"
  on public.locations
  for select
  to anon, authenticated
  using (true);

create policy "Admins manage plans"
  on public.plans
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins manage categories"
  on public.categories
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins manage locations"
  on public.locations
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- business_profiles

create policy "Public read published business profiles"
  on public.business_profiles
  for select
  to anon, authenticated
  using (status = 'published');

-- Permiso temporal para registro publico sin cuenta. En fase provider-auth se
-- reemplazara por registro autenticado con owner_user_id = auth.uid().
create policy "Temporary public insert pending unowned business profiles"
  on public.business_profiles
  for insert
  to anon
  with check (
    owner_user_id is null
    and status = 'pending'
    and coalesce(is_verified, false) = false
    and coalesce(is_featured, false) = false
  );

-- Necesario temporalmente porque el formulario actual usa insert(...).select("id").
-- Esto expone negocios pendientes sin owner_user_id; remover en provider-auth.
create policy "Temporary public read pending unowned business profiles for registration"
  on public.business_profiles
  for select
  to anon
  using (owner_user_id is null and status = 'pending');

create policy "Providers read own business profiles"
  on public.business_profiles
  for select
  to authenticated
  using (owner_user_id = auth.uid());

create policy "Admins read all business profiles"
  on public.business_profiles
  for select
  to authenticated
  using (public.is_admin());

create policy "Providers create own pending business profiles"
  on public.business_profiles
  for insert
  to authenticated
  with check (
    public.is_provider()
    and owner_user_id = auth.uid()
    and status = 'pending'
    and coalesce(is_verified, false) = false
    and coalesce(is_featured, false) = false
  );

create policy "Providers update own pending or paused business profiles"
  on public.business_profiles
  for update
  to authenticated
  using (
    public.is_provider()
    and owner_user_id = auth.uid()
    and status in ('pending', 'published', 'paused', 'rejected')
  )
  with check (
    public.is_provider()
    and owner_user_id = auth.uid()
    and status = 'pending'
    and coalesce(is_verified, false) = false
    and coalesce(is_featured, false) = false
  );

create policy "Admins insert business profiles"
  on public.business_profiles
  for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins update business profiles"
  on public.business_profiles
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Prefer status = 'rejected' or 'paused' operationally. This delete policy is
-- included only for admin cleanup needs.
create policy "Admins delete business profiles"
  on public.business_profiles
  for delete
  to authenticated
  using (public.is_admin());

-- business_categories

create policy "Public read categories for published businesses"
  on public.business_categories
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_categories.business_id
        and bp.status = 'published'
    )
  );

-- Permiso temporal para registro publico sin cuenta. Remover en provider-auth.
create policy "Temporary public insert categories for pending unowned businesses"
  on public.business_categories
  for insert
  to anon
  with check (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_categories.business_id
        and bp.owner_user_id is null
        and bp.status = 'pending'
    )
  );

create policy "Providers read categories for own businesses"
  on public.business_categories
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_categories.business_id
        and bp.owner_user_id = auth.uid()
    )
  );

create policy "Providers insert categories for own pending or paused businesses"
  on public.business_categories
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_categories.business_id
        and bp.owner_user_id = auth.uid()
        and bp.status in ('pending', 'paused')
    )
  );

create policy "Providers delete categories for own pending or paused businesses"
  on public.business_categories
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_categories.business_id
        and bp.owner_user_id = auth.uid()
        and bp.status in ('pending', 'paused')
    )
  );

create policy "Admins manage business categories"
  on public.business_categories
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- business_locations

create policy "Public read locations for published businesses"
  on public.business_locations
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_locations.business_id
        and bp.status = 'published'
    )
  );

-- Permiso temporal para registro publico sin cuenta. Remover en provider-auth.
create policy "Temporary public insert locations for pending unowned businesses"
  on public.business_locations
  for insert
  to anon
  with check (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_locations.business_id
        and bp.owner_user_id is null
        and bp.status = 'pending'
    )
  );

create policy "Providers read locations for own businesses"
  on public.business_locations
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_locations.business_id
        and bp.owner_user_id = auth.uid()
    )
  );

create policy "Providers insert locations for own pending or paused businesses"
  on public.business_locations
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_locations.business_id
        and bp.owner_user_id = auth.uid()
        and bp.status in ('pending', 'paused')
    )
  );

create policy "Providers delete locations for own pending or paused businesses"
  on public.business_locations
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_locations.business_id
        and bp.owner_user_id = auth.uid()
        and bp.status in ('pending', 'paused')
    )
  );

create policy "Admins manage business locations"
  on public.business_locations
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- business_media

create policy "Public read media for published businesses"
  on public.business_media
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_media.business_id
        and bp.status = 'published'
    )
  );

-- Permiso temporal para registro publico sin cuenta. Remover en provider-auth.
create policy "Temporary public insert media for pending unowned businesses"
  on public.business_media
  for insert
  to anon
  with check (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_media.business_id
        and bp.owner_user_id is null
        and bp.status = 'pending'
    )
  );

create policy "Providers read media for own businesses"
  on public.business_media
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_media.business_id
        and bp.owner_user_id = auth.uid()
    )
  );

create policy "Providers insert media for own businesses"
  on public.business_media
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_media.business_id
        and bp.owner_user_id = auth.uid()
    )
  );

create policy "Providers update media for own businesses"
  on public.business_media
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_media.business_id
        and bp.owner_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_media.business_id
        and bp.owner_user_id = auth.uid()
    )
  );

create policy "Providers delete media for own businesses"
  on public.business_media
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_media.business_id
        and bp.owner_user_id = auth.uid()
    )
  );

create policy "Admins manage business media"
  on public.business_media
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());



-- Membership/payment fields are admin-only application fields:
-- membership_status, payment_status, membership_started_at,
-- membership_expires_at, trial_ends_at, last_payment_at,
-- next_payment_due_at, payment_exempt_reason, payment_exempt_until.
-- Provider forms must never send these fields; admin screens are the only UI
-- allowed to update them until payment automation is implemented.
