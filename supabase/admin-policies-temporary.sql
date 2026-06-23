-- Políticas temporales de desarrollo. Reemplazar por Supabase Auth y rol admin antes de producción.
-- Estas políticas permiten que el panel admin temporal, usando anon key, revise y actualice negocios.
-- No usar estas políticas en producción.

create policy "Temporary admin read all business profiles"
  on public.business_profiles
  for select
  using (true);

create policy "Temporary admin update business profiles"
  on public.business_profiles
  for update
  using (true)
  with check (true);

create policy "Temporary admin read business categories"
  on public.business_categories
  for select
  using (true);

create policy "Temporary admin read business locations"
  on public.business_locations
  for select
  using (true);
