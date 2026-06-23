-- Politicas temporales de desarrollo para Casero Cancun.
-- Permiten leer y subir imagenes al bucket business-media durante desarrollo.
-- Antes de produccion se deben reemplazar por Supabase Auth y permisos por proveedor/admin.
-- No se crean politicas publicas de update ni delete.

insert into storage.buckets (id, name, public)
values ('business-media', 'business-media', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public read business media storage" on storage.objects;

create policy "Public read business media storage"
  on storage.objects
  for select
  using (bucket_id = 'business-media');

drop policy if exists "Public upload business media storage" on storage.objects;

create policy "Public upload business media storage"
  on storage.objects
  for insert
  with check (bucket_id = 'business-media');
