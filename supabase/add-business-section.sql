alter table public.business_profiles
add column if not exists section text;

create index if not exists business_profiles_section_idx
on public.business_profiles (section);
