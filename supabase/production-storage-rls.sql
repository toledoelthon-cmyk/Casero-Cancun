-- Production Storage RLS proposal for Casero Cancun.
--
-- Review before running. This replaces development storage policies for the
-- business-media bucket. It keeps public read because the bucket stores public
-- business images, but does not allow public delete/update.
--
-- Current compatibility note:
-- /registrar-mi-negocio still uploads images before provider auth exists. A
-- temporary anon insert policy is included for pending, unowned businesses.
-- Remove it in the provider-auth phase.

insert into storage.buckets (id, name, public)
values ('business-media', 'business-media', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public read business media storage" on storage.objects;
drop policy if exists "Public upload business media storage" on storage.objects;
drop policy if exists "Temporary admin delete business media storage" on storage.objects;
drop policy if exists "Public read business-media storage" on storage.objects;
drop policy if exists "Temporary public upload pending unowned business media storage" on storage.objects;
drop policy if exists "Providers upload own business media storage" on storage.objects;
drop policy if exists "Providers update own business media storage" on storage.objects;
drop policy if exists "Providers delete own business media storage" on storage.objects;
drop policy if exists "Admins manage business-media storage" on storage.objects;

create policy "Public read business-media storage"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'business-media');

-- Permiso temporal para registro publico sin cuenta. La carpeta debe ser el id
-- del negocio pendiente sin owner_user_id: {business_id}/archivo.jpg.
-- Remover en provider-auth.
create policy "Temporary public upload pending unowned business media storage"
  on storage.objects
  for insert
  to anon
  with check (
    bucket_id = 'business-media'
    and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
    and exists (
      select 1
      from public.business_profiles bp
      where bp.id = split_part(name, '/', 1)::uuid
        and bp.owner_user_id is null
        and bp.status = 'pending'
    )
  );

create policy "Providers upload own business media storage"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'business-media'
    and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
    and exists (
      select 1
      from public.business_profiles bp
      where bp.id = split_part(name, '/', 1)::uuid
        and bp.owner_user_id = auth.uid()
    )
  );

create policy "Providers update own business media storage"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'business-media'
    and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
    and exists (
      select 1
      from public.business_profiles bp
      where bp.id = split_part(name, '/', 1)::uuid
        and bp.owner_user_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'business-media'
    and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
    and exists (
      select 1
      from public.business_profiles bp
      where bp.id = split_part(name, '/', 1)::uuid
        and bp.owner_user_id = auth.uid()
    )
  );

create policy "Providers delete own business media storage"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'business-media'
    and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/'
    and exists (
      select 1
      from public.business_profiles bp
      where bp.id = split_part(name, '/', 1)::uuid
        and bp.owner_user_id = auth.uid()
    )
  );

create policy "Admins manage business-media storage"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'business-media' and public.is_admin())
  with check (bucket_id = 'business-media' and public.is_admin());


