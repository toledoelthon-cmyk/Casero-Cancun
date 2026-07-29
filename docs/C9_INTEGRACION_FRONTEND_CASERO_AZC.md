# C9 Integracion frontend Casero con AZC

## Objetivo

Conectar el frontend publico de Casero Cancun con AZC para registrar solicitudes reales de servicio antes de continuar por WhatsApp.

## Stack detectado

Proyecto: C:\Proyectos\Casero-Cancun
Stack: Next.js App Router con src/app, TypeScript y route handlers.

## Endpoint AZC

POST https://azc-crm.marketinmobiliario.mx/api/public/casero/solicitudes

El endpoint requiere el header x-azc-api-key, agregado solo por el proxy server-side del frontend Casero.

## Proxy seguro

Se creo:

- src/app/api/azc/casero/solicitudes/route.ts

El navegador llama a /api/azc/casero/solicitudes. El route handler valida datos minimos, agrega x-azc-api-key desde process.env y reenvia a AZC. La API key no se manda al browser y no se escribe en logs.

## Variables de entorno

Variables server-side requeridas en Casero:

- AZC_CASERO_REQUESTS_URL=https://azc-crm.marketinmobiliario.mx/api/public/casero/solicitudes
- AZC_CASERO_REQUESTS_API_KEY=valor_real_en_vercel_o_entorno_seguro

La API key oficial para Casero es AZC_CASERO_REQUESTS_API_KEY y no debe iniciar con NEXT_PUBLIC_. No modificar .env real; cargar el mismo valor real en Vercel Casero y Vercel AZC, y redeployar ambos proyectos. AZC_PUBLIC_LEADS_API_KEY queda asociado a Market y no debe usarse para Casero salvo fallback temporal documentado.

## Helper frontend

Se creo:

- src/lib/azcCasero.ts

Expone sendCaseroRequestToAZC(payload), buildCaseroRequestPayload, buildCaseroWhatsAppMessage y openWhatsApp. El helper llama al proxy interno, no al endpoint publico AZC directo.

## Formularios y CTAs conectados

Se conecto el modal de cotizacion:

- src/components/marketplace/CaseroServiceCaptureModal.tsx

Lo usan los CTAs de pedir cotizacion desde tarjetas y fichas de negocio. El flujo intenta registrar solicitud en AZC; si falla, muestra aviso suave y permite continuar por WhatsApp.

## Payload normalizado

Campos principales enviados: clientName, clientWhatsapp, requestedService, category, zone, city, state, message, isUrgent, source, campaignCode, providerId y metadata con pageUrl, cta, providerName y categoryLabel.

## WhatsApp

WhatsApp oficial Casero se mantiene en formato wa.me como 529904028923 desde src/lib/contact.ts. Para proveedor se conserva el telefono del negocio cuando existe. No se usa WhatsApp Business API.

## Manejo de errores

Si AZC no esta disponible, el proxy responde ok false con error azc_unavailable y mensaje seguro. El usuario puede continuar por WhatsApp.

## Validacion de produccion

1. Configurar variables server-side en Vercel o entorno seguro.
2. Abrir una ficha de negocio o tarjeta con Pedir cotizacion.
3. Enviar nombre, WhatsApp, servicio, zona y urgencia.
4. Confirmar en AZC que se creo CaseroRequest, actividad request_created y tareas automaticas.
5. Repetir dentro de 10 minutos para validar idempotencia.
6. Verificar en DevTools que no aparece x-azc-api-key en requests del browser.

## Restricciones

No se implemento email marketing Casero, no se creo Brevo Casero, no se enviaron emails, no se uso IA externa, no se hizo scraping, no se automatizaron campanas y no se expusieron secretos.

## Siguiente fase

C9.1 puede conectar formularios generales adicionales si se agregan al sitio. C10 puede preparar email marketing Casero separado con dominio, usuario Brevo, footer y limites propios.

## C9.5 Separacion de keys

Casero usa AZC_CASERO_REQUESTS_API_KEY para el proxy /api/azc/casero/solicitudes. Market conserva AZC_PUBLIC_LEADS_API_KEY para sus leads inmobiliarios. No usar NEXT_PUBLIC_AZC_CASERO_REQUESTS_API_KEY ni exponer la key en navegador, logs o respuestas. Despues de cambiar variables en Vercel, redeployar Casero y AZC.
