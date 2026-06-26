# Auditoria funcional

## Enlaces y navegacion revisados

### Problemas encontrados

- En la pagina de inicio, las tarjetas de la seccion "Busqueda rapida" parecian clicables pero no tenian enlace. Ya estaban corregidas para apuntar a categorias reales.
- En la pagina de inicio, las tarjetas principales de "Servicios del hogar", "Tiendas y materiales", "Mascotas" y "Servicios para tu auto" podian percibirse como clicables, pero solo el boton interno navegaba.

### Problemas corregidos

- Header revisado:
  - Inicio -> `/`
  - Buscar servicios -> `/buscar-servicios`
  - Tiendas y materiales -> `/tiendas-y-materiales`
  - Mascotas -> `/mascotas`
  - Servicios para tu auto -> `/servicios-para-tu-auto`
  - Planes -> `/planes`
  - Registrar negocio -> `/registrar-mi-negocio`
  - Contacto -> `/contacto`
- Menu movil revisado: abre, cierra y cada enlace ejecuta `closeMenu()` al tocarse.
- Footer revisado con enlaces a rutas existentes:
  - `/`
  - `/buscar-servicios`
  - `/categorias`
  - `/tiendas-y-materiales`
  - `/mascotas`
  - `/servicios-para-tu-auto`
  - `/planes`
  - `/registrar-mi-negocio`
  - `/contacto`
  - `/aviso-de-privacidad`
  - `/terminos-y-condiciones`
- Home revisada:
  - Botones del hero navegan a rutas existentes.
  - Tarjetas principales de secciones ahora son enlaces completos.
  - Busqueda rapida enlaza a:
    - Plomeria -> `/categoria/plomeria`
    - Ferreterias -> `/categoria/ferreterias`
    - Veterinarias -> `/categoria/veterinarias`
    - Talleres mecanicos -> `/categoria/talleres-mecanicos`
  - CTA de registrar negocio enlaza a `/registrar-mi-negocio`.
  - Categorias destacadas usan `CategoryCard` con enlace a `/categoria/[slug]`.
  - Botones de planes usan `/registrar-mi-negocio`.
  - Botones de WhatsApp tienen `href` real hacia `wa.me`.

### Pendientes

- El menu movil muestra "Registrar negocio" como enlace de navegacion y tambien como CTA visual. Ambos funcionan; se mantiene por ahora como refuerzo de conversion.
- Cuando se migre el registro a proveedor autenticado, revisar nuevamente botones de registro para dirigir al flujo correcto.

## Busqueda, filtros y perfiles revisados

### Problemas encontrados

- En `/buscar-servicios`, la busqueda por texto no consideraba algunos campos utiles como servicio principal, atributos, badges o direccion.
- El filtro de atributo "Muestra mapa" dependia de coordenadas truthy; ahora valida coordenadas numericas finitas.
- El mensaje sin resultados era correcto, pero podia ser mas claro para orientar al usuario.

### Problemas corregidos

- `/buscar-servicios` revisado:
  - Busqueda por texto activa.
  - Filtro por seccion activo.
  - Filtro por categoria activo.
  - Filtro por ubicacion activo.
  - Filtros por atributos activos.
  - Botones de limpiar filtros activos.
  - Mensaje sin resultados actualizado con sugerencia de probar otra categoria, zona o texto.
- El buscador ahora incluye nombre, descripcion, categoria, categorias secundarias, servicio principal, atributos, badges, ubicacion, zonas y direccion.
- Las consultas publicas siguen pasando por `getPublishedBusinesses`, `getPublishedBusinessesBySection`, `getPublishedBusinessesByCategory`, `getPublishedBusinessesByLocation` y `getPublishedBusinessBySlug`, que filtran `status = 'published'` cuando Supabase esta configurado.
- Secciones revisadas:
  - `/servicios-del-hogar`
  - `/tiendas-y-materiales`
  - `/mascotas`
  - `/servicios-para-tu-auto`
  - Todas muestran categorias de su seccion, negocios publicados, botones de perfil y WhatsApp.
- Categorias revisadas:
  - `/categorias` muestra categorias con `CategoryCard`, todas con enlace a `/categoria/[slug]`.
  - `/categoria/[slug]` muestra negocios publicados de la categoria o mensaje claro cuando no hay resultados.
- Ubicaciones revisadas:
  - `/ubicacion/[slug]` muestra negocios publicados de la zona o mensaje claro cuando no hay resultados.
- Perfiles publicos revisados:
  - `/negocio/[slug]` obtiene datos con `getBusinessBySlug`, que usa `getPublishedBusinessBySlug`.
  - Negocios `pending`, `paused` o `rejected` no se muestran cuando Supabase esta configurado; la pagina cae en `notFound()`.
  - Perfil incluye imagen principal, galeria, categorias, zonas, descripcion, atributos, direccion, mapa si aplica y WhatsApp.

### Pendientes

- Las listas de categorias y ubicaciones visibles siguen saliendo de `demo-data`; los slugs principales coinciden con el seed actual, pero si Supabase recibe categorias nuevas habra que mover esas listas a lectura dinamica.
- Cuando se active provider-auth y RLS final, volver a probar filtros y perfiles con usuarios anon, provider y admin.

## Registro, admin, WhatsApp y responsive revisados

### Problemas encontrados

- Los botones de WhatsApp recibian el telefono tal como venia del negocio; si algun registro admin dejaba espacios o formato con `+52`, convenia normalizar antes de generar `wa.me`.
- Despues de enviar una solicitud de registro correctamente, el mensaje de exito no ofrecía una accion directa para avisar por WhatsApp.

### Problemas corregidos

- Registro revisado:
  - Datos principales requeridos.
  - Seleccion de plan por tarjetas.
  - Tipo de negocio / seccion.
  - Categorias multiples con limite por plan.
  - Zonas multiples con limite por plan.
  - Caracteristicas por tipo de negocio.
  - Mapa condicional segun seccion y modo de ubicacion.
  - Imagenes con limite por plan, tipo permitido y peso maximo.
  - Mensajes de error y exito visibles.
  - Insercion en Supabase con `status = 'pending'`.
- Limites por plan revisados:
  - Basico: 2 categorias, 2 zonas, 3 fotos.
  - Pro: 5 categorias, 5 zonas, 8 fotos.
  - Premium: 8 categorias, 10 zonas, 15 fotos.
- WhatsApp revisado:
  - Boton flotante usa `wa.me` con numero general configurado.
  - BusinessCard usa boton WhatsApp con mensaje prellenado.
  - Perfil publico usa WhatsApp con mensaje contextual.
  - Contacto usa el WhatsApp oficial.
  - Despues del registro exitoso se muestra boton para avisar por WhatsApp.
  - Los telefonos de negocio se normalizan antes de crear la URL `wa.me`.
- Admin revisado:
  - `/admin/login` usa Supabase Auth.
  - `/admin/negocios` requiere sesion admin.
  - Cerrar sesion hace `signOut()` y redirige al login.
  - Refrescar recarga desde Supabase.
  - Filtros por estado usan `pending`, `published`, `paused`, `rejected`.
  - Acciones de aprobar, rechazar, pausar, volver a pendiente, verificar y destacar actualizan Supabase y recargan lista.
  - Edicion y gestion de imagenes recargan datos despues de guardar.
- Estados revisados:
  - `pending`, `paused` y `rejected` no aparecen publicamente porque las consultas publicas filtran `status = 'published'`.
  - `published` aparece publicamente en busqueda, secciones, categorias, ubicaciones y perfil.
- Responsive revisado a nivel de componentes:
  - Formulario usa grids responsivos y botones de altura tactil.
  - Filtros publicos tienen panel movil.
  - Modales admin usan `max-h` y scroll interno.
  - Botones principales mantienen ancho completo en movil cuando aplica.

### Pendientes

- Probar manualmente en dispositivo real el formulario largo de registro, especialmente carga de imagenes y selector de mapa.
- Probar manualmente el admin con RLS de produccion aplicada, porque por ahora conviven politicas temporales/drafts.
- Revisar si el boton de WhatsApp posterior al registro debe enviar un mensaje especifico con nombre del negocio cuando se defina el flujo final.
- Migrar el registro publico a proveedor autenticado para retirar permisos temporales anon.

### Recomendaciones antes de conectar dominio oficial

- Aplicar y probar RLS final en Supabase con usuarios anon, provider y admin.
- Confirmar que el bucket `business-media` no permite delete/update anon.
- Crear checklist manual en movil para registro, busqueda, perfil publico y admin.
- Confirmar variables de entorno de Vercel y retirar `NEXT_PUBLIC_ADMIN_ACCESS_KEY` si ya no se usa.
- Revisar textos legales y datos de contacto definitivos antes de publicar el dominio.
