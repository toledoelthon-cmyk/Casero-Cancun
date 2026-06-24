-- Politicas temporales de desarrollo. Reemplazar por Supabase Auth y rol admin antes de produccion.
-- Permiten que el panel admin temporal use la anon key para revisar y actualizar solicitudes.

drop policy if exists "Temporary admin read all business profiles" on public.business_profiles;

create policy "Temporary admin read all business profiles"
  on public.business_profiles
  for select
  using (true);

drop policy if exists "Temporary admin update business profiles" on public.business_profiles;

create policy "Temporary admin update business profiles"
  on public.business_profiles
  for update
  using (true)
  with check (true);

drop policy if exists "Temporary admin read business categories" on public.business_categories;

create policy "Temporary admin read business categories"
  on public.business_categories
  for select
  using (true);

drop policy if exists "Temporary admin insert business categories" on public.business_categories;

create policy "Temporary admin insert business categories"
  on public.business_categories
  for insert
  with check (true);

drop policy if exists "Temporary admin delete business categories" on public.business_categories;

create policy "Temporary admin delete business categories"
  on public.business_categories
  for delete
  using (true);

drop policy if exists "Temporary admin read business locations" on public.business_locations;

create policy "Temporary admin read business locations"
  on public.business_locations
  for select
  using (true);

drop policy if exists "Temporary admin insert business locations" on public.business_locations;

create policy "Temporary admin insert business locations"
  on public.business_locations
  for insert
  with check (true);

drop policy if exists "Temporary admin delete business locations" on public.business_locations;

create policy "Temporary admin delete business locations"
  on public.business_locations
  for delete
  using (true);

drop policy if exists "Temporary admin read business media" on public.business_media;

create policy "Temporary admin read business media"
  on public.business_media
  for select
  using (true);

drop policy if exists "Temporary admin insert business media" on public.business_media;

create policy "Temporary admin insert business media"
  on public.business_media
  for insert
  with check (true);

drop policy if exists "Temporary admin update business media" on public.business_media;

create policy "Temporary admin update business media"
  on public.business_media
  for update
  using (true)
  with check (true);

drop policy if exists "Temporary admin delete business media" on public.business_media;

create policy "Temporary admin delete business media"
  on public.business_media
  for delete
  using (true);

drop policy if exists "Temporary admin delete business media storage" on storage.objects;

create policy "Temporary admin delete business media storage"
  on storage.objects
  for delete
  using (bucket_id = 'business-media');
