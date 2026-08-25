# Fase 22 - Auditoría de producción real y QA funcional

Fecha de auditoría: 25 de agosto de 2026.

Contexto: Casero Cancún ya opera en producción con dominio, variables y configuración principal. Esta auditoría se enfoca en estabilización pública, QA funcional, PWA, SEO técnico, WhatsApp, navegación, copy visible y consistencia menor. No incluye conexión de dominio, DNS ni cambios remotos en Supabase.

## Rutas revisadas desde código

- `/`
- `/buscar-servicios`
- `/categorias`
- `/ubicaciones`
- `/planes`
- `/contacto`
- `/registrar-mi-negocio`
- `/servicios-del-hogar`
- `/tiendas-y-materiales`
- `/mascotas`
- `/servicios-para-tu-auto`
- `/categoria/[slug]`
- `/ubicacion/[slug]`
- `/negocio/[slug]`
- `/aviso-de-privacidad`
- `/terminos-y-condiciones`

## Flujos revisados

### Usuario que busca proveedor

- Home contiene buscador hacia `/buscar-servicios`.
- `/buscar-servicios?q=...` recibe query inicial.
- Directorio permite filtrar por texto, área, categoría, zona y atributos.
- Cards de negocio llevan a `/negocio/[slug]`.
- CTA de cotización continúa hacia WhatsApp mediante el modal de captura.

### Usuario que explora por categoría

- `/categorias` muestra secciones visuales.
- Cards llevan a rutas públicas de sección.
- `/categoria/[slug]` muestra proveedores relacionados o estado vacío.
- Perfil público mantiene CTA de contacto.

### Usuario que explora por zona

- `/ubicaciones` muestra zonas principales.
- Cards llevan a `/ubicacion/[slug]`.
- Página de zona muestra proveedores publicados, categorías disponibles y CTA de búsqueda/registro.

### Proveedor interesado

- `/planes` presenta planes y CTA a `/registrar-mi-negocio`.
- Cards de planes mantienen enlaces de pago/WhatsApp configurados por variables.
- `/registrar-mi-negocio` muestra beneficios, formulario, aviso de cuenta de proveedor y sidebar de seguimiento.

### Contacto

- `/contacto` muestra WhatsApp oficial, correo oficial, ubicación, CTA para registrar negocio y preguntas rápidas.
- Footer mantiene enlaces a WhatsApp, correo, aviso de privacidad y términos.

## WhatsApp y contacto

- WhatsApp oficial centralizado: `+52 990 402 8923`.
- Número para `wa.me`: `529904028923`.
- Correo oficial: `info@caserocancun.com`.
- `src/lib/contact.ts` centraliza WhatsApp/correo.
- `src/lib/casero-leads.ts` mantiene fallback al WhatsApp oficial cuando un proveedor no tiene número válido.
- Cards y perfiles usan mensajes contextuales antes de abrir WhatsApp.

## SEO/PWA revisado

- `src/lib/seo.ts` usa fallback a `https://caserocancun.com`.
- Metadata pública usa canonical, Open Graph y Twitter card.
- OG principal: `/brand/casero-og-image.png`.
- `robots.ts` permite páginas públicas y bloquea `/admin`, `/proveedor` y `/api`.
- `sitemap.ts` incluye rutas públicas, categorías, ubicaciones y negocios publicados cuando hay configuración de Supabase.
- `manifest.ts` define PWA básica instalable.
- Iconos PWA existen en `/public/icons`.
- `layout.tsx` conecta manifest, metadata global e idioma `es-MX`.

## Hallazgos corregidos en esta fase

- Se eliminó un texto público de fallback que decía “Perfil demo...” para evitar copy de prueba si el sitio cae a datos de respaldo.
- Se corrigieron acentos visibles en el footer: “conexión” e “información”.
- Se alineó la descripción global del layout con el mensaje de producción: directorio local en Cancún y Riviera Maya.
- Se documentó esta auditoría con checklist de producción real, separada de la fase previa de dominio.

## Hallazgos sin cambio de código

- El dominio ya está en producción; no se requiere conectar DNS desde esta fase.
- No se detectaron números viejos de WhatsApp en código público centralizado.
- No se detectaron CTAs principales rotos en rutas públicas revisadas.
- Las referencias a Supabase en código corresponden a implementación interna, no a copy público de páginas principales.
- Los documentos históricos de integración pueden mencionar Vercel, localhost o Supabase porque son documentación técnica, no páginas públicas.

## Checklist de pruebas en navegador real

- Abrir `/` y probar buscador del hero.
- Abrir `/buscar-servicios?q=plomero` y cambiar filtros.
- Abrir una card de negocio desde búsqueda.
- Abrir `/categorias` y navegar a una sección.
- Abrir `/ubicaciones` y navegar a Cancún, Puerto Morelos, Playa del Carmen y Tulum.
- Abrir `/planes` y verificar botones de plan.
- Abrir `/contacto` y probar WhatsApp/correo.
- Abrir `/registrar-mi-negocio` y recorrer el formulario sin enviar datos reales innecesarios.
- Abrir `/aviso-de-privacidad` y `/terminos-y-condiciones` desde el footer.

## Checklist mobile

- Probar en Android Chrome.
- Probar en iPhone Safari.
- Confirmar que no haya overflow horizontal.
- Confirmar que el menú móvil abre/cierra.
- Confirmar que filtros de `/buscar-servicios` son cómodos.
- Confirmar que botones de WhatsApp y CTAs tienen tamaño táctil suficiente.
- Confirmar que el botón flotante de WhatsApp no tapa acciones críticas.
- Confirmar que el formulario de registro se puede recorrer sin cortes visuales.

## Checklist WhatsApp

- Probar botón flotante global.
- Probar WhatsApp desde `/contacto`.
- Probar “Pedir cotización” desde una card de negocio.
- Probar CTA de WhatsApp en perfil de negocio.
- Probar WhatsApp en planes cuando un plan no tenga link de pago directo.
- Confirmar que el mensaje prellenado es entendible.
- Confirmar que el destino sea el negocio cuando hay WhatsApp de proveedor válido y el oficial de Casero como fallback.

## Checklist SEO/PWA

- Abrir `/manifest.webmanifest`.
- Abrir `/robots.txt`.
- Abrir `/sitemap.xml`.
- Confirmar que canonicals usan `https://caserocancun.com` en producción.
- Validar preview social de `https://caserocancun.com` en WhatsApp.
- Confirmar favicon y Apple icon en navegador.
- Probar instalación PWA en Android Chrome.
- Probar “Agregar a pantalla de inicio” en iOS Safari.

## Checklist Search Console

- Revisar cobertura de indexación.
- Enviar o reenviar `https://caserocancun.com/sitemap.xml`.
- Revisar páginas excluidas por robots/noindex.
- Revisar errores 404.
- Revisar Core Web Vitals cuando haya datos suficientes.
- Revisar consultas de búsqueda relacionadas con Cancún, proveedores, ferreterías, veterinarias y servicios para auto.

## Checklist posterior a campañas

- Monitorear Search Console semanalmente durante las primeras campañas.
- Revisar Analytics o herramienta equivalente.
- Probar formularios con datos reales controlados.
- Cargar proveedores reales de prueba por cada sección.
- Probar WhatsApp desde móviles reales.
- Revisar velocidad con PageSpeed/Lighthouse.
- Revisar indexación de categorías, ubicaciones y perfiles publicados.
- Revisar que planes y pagos mantengan enlaces correctos antes de pauta.

## Límites respetados

- No se tocó Supabase remoto.
- No se tocó RLS.
- No se tocó schema.
- No se tocaron pagos, Mercado Pago ni CoDi.
- No se modificó lógica de aprobación/publicación.
- No se modificaron endpoints públicos.
- No se cambiaron variables reales de producción.
