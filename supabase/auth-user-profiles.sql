-- Supabase Auth preparation for Casero Cancun.
-- Run this before migrating admin/provider flows away from NEXT_PUBLIC_ADMIN_ACCESS_KEY.

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

create index if not exists user_profiles_role_idx
  on public.user_profiles (role);

alter table public.user_profiles enable row level security;

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

alter table public.business_profiles
  add column if not exists owner_user_id uuid references auth.users(id);

create index if not exists business_profiles_owner_user_id_idx
  on public.business_profiles (owner_user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;

create trigger set_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute function public.set_updated_at();
