# Casero Cancun Security Notes

This folder currently contains both development policies and production-ready drafts.

## Temporary policies

`admin-policies-temporary.sql` is for development only. It lets the temporary admin panel use the anon key to read and update businesses, categories, locations, media, and some storage objects.

`schema.sql` also includes temporary public insert policies for business registration. These are useful while the app has no Supabase Auth provider flow, but they should not remain as-is for production.

## Before production

Complete these steps before treating the project as production-secure:

1. Run `supabase/auth-user-profiles.sql`.
2. Add Supabase Auth login for admins and providers.
3. Update business registration so authenticated providers create rows with `owner_user_id = auth.uid()`.
4. Replace `/admin/negocios` access based on `NEXT_PUBLIC_ADMIN_ACCESS_KEY` with an authenticated admin check.
5. Remove temporary anon/admin policies.
6. Apply and test the policies from `supabase/production-rls-draft.sql`.
7. Test anon, provider, and admin flows separately in Supabase.

## Creating an admin user

Create a user in Supabase Auth first. Then insert or update the matching profile:

```sql
insert into public.user_profiles (id, email, full_name, role)
values (
  'AUTH_USER_UUID_HERE',
  'admin@example.com',
  'Admin Name',
  'admin'
)
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = 'admin',
  updated_at = now();
```

Provider users should use `role = 'provider'`.

## Service role warning

Never expose the Supabase service role key in frontend code, browser components, public env vars, or Vercel variables prefixed with `NEXT_PUBLIC_`.

The service role bypasses RLS. It should only be used in trusted server-only environments for tightly scoped maintenance tasks. This project should keep frontend and public server reads on the anon key plus RLS, and use Supabase Auth claims/profiles to decide admin and provider access.
