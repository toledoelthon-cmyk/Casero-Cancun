-- Estas politicas son temporales para desarrollo.
-- Antes de produccion se reemplazaran por Supabase Auth y rol admin.
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

drop policy if exists "Temporary admin read business locations" on public.business_locations;

create policy "Temporary admin read business locations"
  on public.business_locations
  for select
  using (true);

drop policy if exists "Temporary admin read business media" on public.business_media;

create policy "Temporary admin read business media"
  on public.business_media
  for select
  using (true);
