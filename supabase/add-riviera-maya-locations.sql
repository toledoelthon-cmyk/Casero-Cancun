insert into public.locations (
  name,
  slug
)
values
  ('Cancún', 'cancun'),
  ('Puerto Morelos', 'puerto-morelos'),
  ('Playa del Carmen', 'playa-del-carmen'),
  ('Tulum', 'tulum')
on conflict (slug) do update
set
  name = excluded.name;
