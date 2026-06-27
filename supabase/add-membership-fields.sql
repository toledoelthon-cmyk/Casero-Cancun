alter table public.business_profiles
  add column if not exists membership_status text default 'manual_review',
  add column if not exists membership_started_at timestamptz,
  add column if not exists membership_expires_at timestamptz,
  add column if not exists trial_ends_at timestamptz,
  add column if not exists payment_status text default 'unpaid',
  add column if not exists last_payment_at timestamptz,
  add column if not exists next_payment_due_at timestamptz,
  add column if not exists payment_exempt_reason text,
  add column if not exists payment_exempt_until timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'business_profiles_membership_status_check'
      and conrelid = 'public.business_profiles'::regclass
  ) then
    alter table public.business_profiles
      add constraint business_profiles_membership_status_check
      check (membership_status in ('trial', 'active', 'past_due', 'expired', 'cancelled', 'manual_review', 'exempt'));
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'business_profiles_payment_status_check'
      and conrelid = 'public.business_profiles'::regclass
  ) then
    alter table public.business_profiles
      add constraint business_profiles_payment_status_check
      check (payment_status in ('unpaid', 'paid', 'pending', 'failed', 'refunded', 'manual'));
  end if;
end;
$$;
