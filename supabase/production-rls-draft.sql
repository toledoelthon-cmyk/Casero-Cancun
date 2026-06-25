-- Production RLS draft for Casero Cancun.
--
-- Do not run this file until the temporary anon/admin policies have been removed.
-- Existing temporary policies in admin-policies-temporary.sql allow broad anon access
-- and will override the intended production restrictions while they remain active.
--
-- Suggested migration order:
-- 1. Run auth-user-profiles.sql.
-- 2. Create at least one admin row in public.user_profiles.
-- 3. Update the app to use Supabase Auth sessions for admin/provider screens.
-- 4. Drop temporary development policies.
-- 5. Apply the policies below.

alter table public.plans enable row level security;
alter table public.categories enable row level security;
alter table public.locations enable row level security;
alter table public.business_profiles enable row level security;
alter table public.business_categories enable row level security;
alter table public.business_locations enable row level security;
alter table public.business_media enable row level security;
alter table public.user_profiles enable row level security;

-- User profiles

create policy "Users can read own profile"
  on public.user_profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "Admins can manage user profiles"
  on public.user_profiles
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Public catalog data

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

-- Business profiles

create policy "Public read published business profiles"
  on public.business_profiles
  for select
  to anon, authenticated
  using (status = 'published');

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
    and status in ('pending', 'paused')
  )
  with check (
    public.is_provider()
    and owner_user_id = auth.uid()
    and status in ('pending', 'paused')
    and coalesce(is_verified, false) = false
    and coalesce(is_featured, false) = false
  );

create policy "Admins manage all business profiles"
  on public.business_profiles
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Business categories and locations

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

create policy "Providers manage categories for own pending or paused businesses"
  on public.business_categories
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_categories.business_id
        and bp.owner_user_id = auth.uid()
        and bp.status in ('pending', 'paused')
    )
  )
  with check (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_categories.business_id
        and bp.owner_user_id = auth.uid()
        and bp.status in ('pending', 'paused')
    )
  );

create policy "Providers manage locations for own pending or paused businesses"
  on public.business_locations
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_locations.business_id
        and bp.owner_user_id = auth.uid()
        and bp.status in ('pending', 'paused')
    )
  )
  with check (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_locations.business_id
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

create policy "Admins manage business locations"
  on public.business_locations
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Business media

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

create policy "Providers manage media for own pending or paused businesses"
  on public.business_media
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_media.business_id
        and bp.owner_user_id = auth.uid()
        and bp.status in ('pending', 'paused')
    )
  )
  with check (
    exists (
      select 1
      from public.business_profiles bp
      where bp.id = business_media.business_id
        and bp.owner_user_id = auth.uid()
        and bp.status in ('pending', 'paused')
    )
  );

create policy "Admins manage business media"
  on public.business_media
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Storage draft for business-media bucket.
-- Keep bucket paths scoped by business id, then verify ownership through business_media
-- or a path convention before applying write/delete storage policies.

create policy "Public read published business media storage"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'business-media');

create policy "Admins manage business media storage"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'business-media' and public.is_admin())
  with check (bucket_id = 'business-media' and public.is_admin());
