insert into public.plans (
  name,
  slug,
  price_mxn,
  description,
  features,
  max_categories,
  max_photos,
  is_featured_plan
)
values
  (
    'Básico',
    'basico',
    179,
    'Para negocios que quieren aparecer y recibir contactos directos.',
    '[
      "Perfil público",
      "WhatsApp visible",
      "Teléfono y correo de contacto",
      "Zona de atención",
      "Descripción del negocio",
      "Hasta 2 categorías",
      "Hasta 3 fotos",
      "Aparición normal"
    ]'::jsonb,
    2,
    3,
    false
  ),
  (
    'Pro',
    'pro',
    299,
    'Más visibilidad para proveedores activos y tiendas locales.',
    '[
      "Todo lo del Básico",
      "Hasta 5 categorías",
      "Hasta 8 fotos",
      "Etiqueta de proveedor recomendado",
      "Mejor posición en resultados",
      "Botón de WhatsApp destacado"
    ]'::jsonb,
    5,
    8,
    false
  ),
  (
    'Premium',
    'premium',
    549,
    'Prioridad alta y presencia destacada en las zonas clave.',
    '[
      "Todo lo del Pro",
      "Hasta 8 categorías",
      "Hasta 15 fotos",
      "Perfil destacado en página principal",
      "Prioridad alta en búsquedas",
      "Aparición destacada en su categoría",
      "Promoción destacada"
    ]'::jsonb,
    8,
    15,
    true
  )
on conflict (slug) do update
set
  name = excluded.name,
  price_mxn = excluded.price_mxn,
  description = excluded.description,
  features = excluded.features,
  max_categories = excluded.max_categories,
  max_photos = excluded.max_photos,
  is_featured_plan = excluded.is_featured_plan;

insert into public.categories (
  name,
  slug,
  type
)
values
  ('Aire acondicionado', 'aire-acondicionado', 'service'),
  ('Plomería', 'plomeria', 'service'),
  ('Electricidad', 'electricidad', 'service'),
  ('Limpieza del hogar', 'limpieza-del-hogar', 'service'),
  ('Fumigación', 'fumigacion', 'service'),
  ('Jardinería', 'jardineria', 'service'),
  ('Pintura', 'pintura', 'service'),
  ('Albañilería', 'albanileria', 'service'),
  ('Cerrajería', 'cerrajeria', 'service'),
  ('Carpintería', 'carpinteria', 'service'),
  ('Mudanzas', 'mudanzas', 'service'),
  ('Mantenimiento general', 'mantenimiento-general', 'service'),
  ('Mantenimiento Airbnb', 'mantenimiento-airbnb', 'service'),
  ('Albercas', 'albercas', 'service'),
  ('Cámaras de seguridad', 'camaras-de-seguridad', 'service'),
  ('Ferreterías', 'ferreterias', 'store'),
  ('Material eléctrico', 'material-electrico', 'store'),
  ('Material de plomería', 'material-de-plomeria', 'store'),
  ('Pinturas e impermeabilizantes', 'pinturas-e-impermeabilizantes', 'store'),
  ('Herramientas', 'herramientas', 'store'),
  ('Refacciones para electrodomésticos', 'refacciones-para-electrodomesticos', 'store'),
  ('Aire acondicionado y refacciones', 'aire-acondicionado-y-refacciones', 'store'),
  ('Materiales de construcción', 'materiales-de-construccion', 'store'),
  ('Productos de limpieza', 'productos-de-limpieza', 'store'),
  ('Jardinería y viveros', 'jardineria-y-viveros', 'store'),
  ('Maderas y carpintería', 'maderas-y-carpinteria', 'store'),
  ('Material para herrería', 'material-para-herreria', 'store')
on conflict (slug) do update
set
  name = excluded.name,
  type = excluded.type;

insert into public.categories (
  name,
  slug,
  type,
  section
)
values
  ('Aire acondicionado', 'aire-acondicionado', 'service', 'home_services'),
  ('Plomeria', 'plomeria', 'service', 'home_services'),
  ('Electricidad', 'electricidad', 'service', 'home_services'),
  ('Limpieza del hogar', 'limpieza-del-hogar', 'service', 'home_services'),
  ('Fumigacion', 'fumigacion', 'service', 'home_services'),
  ('Jardineria', 'jardineria', 'service', 'home_services'),
  ('Pintura', 'pintura', 'service', 'home_services'),
  ('Albanileria', 'albanileria', 'service', 'home_services'),
  ('Cerrajeria', 'cerrajeria', 'service', 'home_services'),
  ('Carpinteria', 'carpinteria', 'service', 'home_services'),
  ('Mudanzas', 'mudanzas', 'service', 'home_services'),
  ('Mantenimiento general', 'mantenimiento-general', 'service', 'home_services'),
  ('Mantenimiento Airbnb', 'mantenimiento-airbnb', 'service', 'home_services'),
  ('Albercas', 'albercas', 'service', 'home_services'),
  ('Camaras de seguridad', 'camaras-de-seguridad', 'service', 'home_services'),
  ('Ferreterias', 'ferreterias', 'store', 'stores_materials'),
  ('Material electrico', 'material-electrico', 'store', 'stores_materials'),
  ('Material de plomeria', 'material-de-plomeria', 'store', 'stores_materials'),
  ('Pinturas e impermeabilizantes', 'pinturas-e-impermeabilizantes', 'store', 'stores_materials'),
  ('Herramientas', 'herramientas', 'store', 'stores_materials'),
  ('Refacciones para electrodomesticos', 'refacciones-para-electrodomesticos', 'store', 'stores_materials'),
  ('Aire acondicionado y refacciones', 'aire-acondicionado-y-refacciones', 'store', 'stores_materials'),
  ('Materiales de construccion', 'materiales-de-construccion', 'store', 'stores_materials'),
  ('Productos de limpieza', 'productos-de-limpieza', 'store', 'stores_materials'),
  ('Jardineria y viveros', 'jardineria-y-viveros', 'store', 'stores_materials'),
  ('Maderas y carpinteria', 'maderas-y-carpinteria', 'store', 'stores_materials'),
  ('Material para herreria', 'material-para-herreria', 'store', 'stores_materials'),
  ('Veterinarias', 'veterinarias', 'service', 'pets'),
  ('Estetica canina', 'estetica-canina', 'service', 'pets'),
  ('Bano y corte para mascotas', 'bano-y-corte-para-mascotas', 'service', 'pets'),
  ('Paseadores de perros', 'paseadores-de-perros', 'service', 'pets'),
  ('Guarderia para mascotas', 'guarderia-para-mascotas', 'service', 'pets'),
  ('Entrenamiento canino', 'entrenamiento-canino', 'service', 'pets'),
  ('Alimentos para mascotas', 'alimentos-para-mascotas', 'store', 'pets'),
  ('Accesorios para mascotas', 'accesorios-para-mascotas', 'store', 'pets'),
  ('Veterinario a domicilio', 'veterinario-a-domicilio', 'service', 'pets'),
  ('Transporte de mascotas', 'transporte-de-mascotas', 'service', 'pets'),
  ('Mecanicos a domicilio', 'mecanicos-a-domicilio', 'service', 'auto_services'),
  ('Talleres mecanicos', 'talleres-mecanicos', 'service', 'auto_services'),
  ('Electrico automotriz', 'electrico-automotriz', 'service', 'auto_services'),
  ('Cerrajeria automotriz', 'cerrajeria-automotriz', 'service', 'auto_services'),
  ('Lavado de autos', 'lavado-de-autos', 'service', 'auto_services'),
  ('Detallado automotriz', 'detallado-automotriz', 'service', 'auto_services'),
  ('Hojalateria y pintura', 'hojalateria-y-pintura', 'service', 'auto_services'),
  ('Gruas', 'gruas', 'service', 'auto_services'),
  ('Llanteras', 'llanteras', 'store', 'auto_services'),
  ('Cambio de aceite', 'cambio-de-aceite', 'service', 'auto_services'),
  ('Aire acondicionado automotriz', 'aire-acondicionado-automotriz', 'service', 'auto_services'),
  ('Diagnostico automotriz', 'diagnostico-automotriz', 'service', 'auto_services')
on conflict (slug) do update
set
  name = excluded.name,
  type = excluded.type,
  section = excluded.section;

insert into public.locations (
  name,
  slug
)
values
  ('Cancún Centro', 'cancun-centro'),
  ('Cancún y alrededores', 'cancun-y-alrededores'),
  ('Zona Hotelera', 'zona-hotelera'),
  ('Puerto Cancún', 'puerto-cancun'),
  ('Bonampak', 'bonampak'),
  ('Puerto Juárez', 'puerto-juarez'),
  ('Alfredo V. Bonfil', 'alfredo-v-bonfil'),
  ('Av. Huayacán', 'av-huayacan'),
  ('Cumbres Cancún', 'cumbres-cancun'),
  ('Jardines del Sur', 'jardines-del-sur'),
  ('Álamos Cancún', 'alamos-cancun'),
  ('Av. La Luna', 'av-la-luna'),
  ('Av. Kabah', 'av-kabah'),
  ('Av. Nichupté', 'av-nichupte'),
  ('Av. López Portillo', 'av-lopez-portillo'),
  ('Costa Mujeres', 'costa-mujeres'),
  ('Puerto Morelos', 'puerto-morelos')
on conflict (slug) do update
set
  name = excluded.name;
