create table if not exists public.business_profile_views (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business_profiles(id) on delete cascade,
  visited_at timestamptz default now(),
  visitor_key text,
  referrer text,
  user_agent text
);

create index if not exists business_profile_views_business_id_idx
  on public.business_profile_views (business_id);

create index if not exists business_profile_views_visited_at_idx
  on public.business_profile_views (visited_at);

create index if not exists business_profile_views_business_id_visited_at_idx
  on public.business_profile_views (business_id, visited_at);

alter table public.business_profile_views enable row level security;

