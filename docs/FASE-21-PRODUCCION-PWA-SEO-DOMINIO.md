# Fase 21 - Producción, PWA, SEO y dominio

Documento de cierre para preparar Casero Cancún en producción pública con PWA básica, SEO final, dominio `caserocancun.com` y checklist operativo.

## Estado técnico preparado en código

- PWA básica disponible mediante `/manifest.webmanifest`.
- Manifest configurado con `name`, `short_name`, `description`, `start_url`, `scope`, `display: standalone`, `orientation: portrait`, `lang: es-MX`, `theme_color` y `background_color`.
- Iconos PWA conectados desde `/icons/icon-192.png`, `/icons/icon-512.png`, `/icons/maskable-icon-192.png` y `/icons/maskable-icon-512.png`.
- Favicon y Apple icon conectados desde `/brand/casero-favicon.png` y `/brand/casero-apple-icon.png`.
- Open Graph principal conectado desde `/brand/casero-og-image.png`.
- Canonical, Open Graph, Twitter card y URLs absolutas usan `NEXT_PUBLIC_SITE_URL`, con fallback a `https://caserocancun.com`.
- Sitemap dinámico disponible en `/sitemap.xml`.
- Robots disponible en `/robots.txt`, permite páginas públicas y bloquea `/admin`, `/proveedor` y `/api`.
- Páginas privadas usan metadata `noindex` mediante `privatePageMetadata`.

## Checklist Vercel

- Agregar dominio `caserocancun.com` al proyecto de Vercel.
- Agregar dominio `www.caserocancun.com`.
- Elegir el dominio principal en Vercel, recomendado: `caserocancun.com`.
- Verificar que Vercel muestre DNS válido para ambos dominios.
- Configurar variables de entorno de producción.
- Ejecutar redeploy después de cambiar variables.
- Confirmar que cargan `/`, `/buscar-servicios`, `/planes`, `/contacto`, `/registrar-mi-negocio`, `/manifest.webmanifest`, `/sitemap.xml` y `/robots.txt`.

## Checklist DNS

- Usar exactamente los valores DNS que indique Vercel para el dominio apex y `www`.
- No borrar registros de correo existentes.
- Conservar MX, SPF, DKIM y DMARC si el correo `info@caserocancun.com` está activo.
- Esperar propagación DNS y revisar HTTPS activo en Vercel.

## Variables en Vercel

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_publica
NEXT_PUBLIC_SITE_URL=https://caserocancun.com
NEXT_PUBLIC_MP_LINK_BASIC=
NEXT_PUBLIC_MP_LINK_PRO=
NEXT_PUBLIC_MP_LINK_PREMIUM=
NEXT_PUBLIC_CODI_QR_BASIC=/payments/codi-basic.jpg
NEXT_PUBLIC_CODI_QR_PRO=/payments/codi-pro.jpg
NEXT_PUBLIC_CODI_QR_PREMIUM=/payments/codi-premium.jpg
NEXT_PUBLIC_CODI_QR_GENERAL=
AZC_CASERO_REQUESTS_URL=https://azc-crm.marketinmobiliario.mx/api/public/casero/solicitudes
AZC_CASERO_REQUESTS_API_KEY=valor_real_en_vercel_o_entorno_seguro
```

Notas:
- No usar valores privados reales en repositorio.
- No crear variables `NEXT_PUBLIC_*` para llaves secretas server-side.
- `AZC_CASERO_REQUESTS_API_KEY` debe vivir solo en entorno seguro de Vercel.

## Supabase Auth

Cuando se conecte el dominio final, revisar URLs permitidas en Supabase Auth.

Agregar o confirmar:

- `https://caserocancun.com`
- `https://caserocancun.com/**`
- `https://www.caserocancun.com`
- `https://www.caserocancun.com/**`
- `https://caserocancun.com/proveedor/actualizar-password`
- `https://www.caserocancun.com/proveedor/actualizar-password`

También revisar Site URL y Redirect URLs antes de hacer pruebas de recuperación de contraseña.

## Search Console

- Agregar propiedad de dominio para `caserocancun.com`.
- Verificar propiedad con DNS o método indicado por Google.
- Enviar sitemap: `https://caserocancun.com/sitemap.xml`.
- Revisar que `https://caserocancun.com/robots.txt` permita las páginas públicas.
- Solicitar indexación de páginas principales después del deploy final.

## Checklist visual preproducción

- Home revisado en desktop y mobile.
- Búsqueda revisada en desktop y mobile.
- Categorías revisadas.
- Ubicaciones revisadas.
- Planes revisado.
- Contacto revisado.
- Registrar negocio revisado.
- Perfil de negocio revisado.
- Footer revisado.
- CTAs visibles y con buen contraste.
- WhatsApp visible como acción principal.
- Sin overflow horizontal en mobile.

## Checklist técnico preproducción

- `npm.cmd run lint` OK.
- `npm.cmd run build` OK.
- `/manifest.webmanifest` carga.
- `/sitemap.xml` carga.
- `/robots.txt` carga.
- Favicon carga.
- Apple icon carga.
- OG image carga desde `/brand/casero-og-image.png`.
- Canonicals usan `https://caserocancun.com` en producción.
- Open Graph usa títulos y descripciones por página.

## Checklist funcional preproducción

- Búsqueda carga y filtra.
- Filtros funcionan.
- Botones de WhatsApp abren correctamente.
- Registrar negocio carga.
- Planes cargan y mantienen links configurados.
- Contacto carga.
- Perfil de negocio carga.
- Admin y proveedor siguen protegidos.

## Pendientes manuales de producción

- Conectar dominio en Vercel.
- Configurar DNS sin afectar correo.
- Configurar variables reales en Vercel.
- Revisar redirects de Supabase Auth con dominio final.
- Hacer redeploy de producción.
- Probar PWA en Android Chrome e iOS Safari.
- Validar preview social compartiendo `https://caserocancun.com` en WhatsApp.
- Configurar Search Console y enviar sitemap.
