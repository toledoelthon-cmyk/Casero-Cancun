# Integración piloto Casero Cancún -> AZC

## Objetivo del piloto

El objetivo del piloto es capturar solicitudes de cotización desde Casero Cancún, enviarlas a Aplex Zone Center (AZC) mediante un proxy interno de Casero y permitir que el usuario continúe por WhatsApp sin bloquear la experiencia.

El flujo está diseñado para que Casero registre la intención del usuario en AZC, muestre feedback claro y deje la apertura de WhatsApp como una acción manual del usuario. Esto evita bloqueos del navegador por aperturas asíncronas y evita dobles ventanas.

## Flujo actual

1. El usuario hace clic en `Pedir cotización`.
2. Casero abre el modal de captura.
3. El usuario llena sus datos.
4. El botón verde registra la solicitud.
5. Casero envía `POST /api/azc/leads`.
6. El proxy interno de Casero reenvía el payload a AZC.
7. AZC crea el lead.
8. AZC ejecuta eventos y automatizaciones.
9. Casero muestra feedback de éxito o error.
10. El usuario puede abrir WhatsApp manualmente.

## Separación de responsabilidades

### Casero

- Muestra el modal de captura.
- Valida campos obligatorios.
- Envía el payload al proxy local.
- Muestra feedback al usuario.
- Abre WhatsApp manualmente cuando el usuario lo decide.

### Proxy Casero

- Recibe el payload desde el frontend.
- Lee `AZC_LEADS_ENDPOINT` y `AZC_PUBLIC_LEADS_API_KEY` desde variables de entorno del servidor.
- Reenvía el payload a AZC.
- Evita exponer la API key al navegador.
- Devuelve respuestas controladas para éxito, errores de configuración y errores de AZC.

### AZC

- Valida la API key.
- Crea o vincula cliente.
- Crea lead.
- Registra eventos.
- Ejecuta automatizaciones.
- Asigna prioridad si aplica.
- Crea tareas automáticas.

## Endpoint interno de Casero

Endpoint:

```http
POST /api/azc/leads
```

Payload esperado:

```json
{
  "platform": "casero-cancun",
  "leadType": "cliente_servicio",
  "action": "pedir_cotizacion",
  "name": "...",
  "phone": "...",
  "city": "Cancún",
  "zone": "...",
  "service": "...",
  "urgency": "normal | alta | urgente",
  "source": "web",
  "message": "...",
  "category": "...",
  "providerName": "...",
  "serviceUrl": "..."
}
```

## Variables de entorno

Variables server-side recomendadas para Casero:

```env
AZC_LEADS_ENDPOINT=http://localhost:3000/api/public/leads
AZC_PUBLIC_LEADS_API_KEY=change-me-local-key
```

Notas:

- `AZC_PUBLIC_LEADS_API_KEY` no debe exponerse al navegador en producción.
- En Next.js debe usarse desde un route handler o código de servidor.
- Después de modificar variables de entorno, reinicia el servidor de Casero.
- Las variables de Supabase existentes pueden mantenerse aparte.
- Las variables `VITE_*` solo deben considerarse compatibilidad local, no el mecanismo principal para producción.

## Comportamiento de botones

### Botón verde: `Enviar solicitud`

- Registra la solicitud en AZC.
- No abre WhatsApp automáticamente.
- Evita doble envío mientras está enviando.
- Muestra feedback de éxito o error.

### Botón secundario: `Continuar por WhatsApp`

- Abre una sola ventana de WhatsApp.
- No registra lead en AZC.
- Usa un gesto directo del usuario.

### Botón posterior al éxito o error: `Abrir WhatsApp`

- Abre una sola ventana de WhatsApp mediante gesto directo del usuario.
- Está protegido contra doble clic o doble evento.

## Mensajes visibles

Éxito:

> Recibimos tus datos. Ahora puedes continuar por WhatsApp.

Error:

> No pudimos registrar tu solicitud en este momento, pero puedes continuar por WhatsApp.

Privacidad:

> Al enviar tus datos aceptas que podamos contactarte para dar seguimiento a tu solicitud conforme a nuestro Aviso de Privacidad.

## Automatizaciones esperadas en AZC

Si `urgency` es `alta` o `urgente`:

- AZC debe marcar prioridad urgente.
- AZC debe crear tarea automática prioritaria.
- AZC debe registrar eventos `automation.*`.

Eventos esperados:

- `lead.external_received`
- `lead.created`
- `automation.rule_triggered`
- `automation.priority_assigned`
- `automation.task_created`

## Checklist de validación local

### A. Entorno

- AZC corriendo en `http://localhost:3000`.
- Casero corriendo en un puerto diferente, por ejemplo `http://127.0.0.1:3001`.
- El endpoint diagnóstico `/api/azc/leads` muestra `hasEndpoint: true` y `hasApiKey: true`.

### B. Modal

- Abre correctamente.
- No hay textos corruptos.
- No se corta.
- Botones visibles.
- Botón verde a la derecha en escritorio.
- Botón secundario a la izquierda en escritorio.

### C. Registro

- Llenar nombre.
- Llenar WhatsApp.
- Llenar servicio.
- Llenar zona.
- Seleccionar urgencia alta.
- Enviar.
- Debe mostrar éxito.
- Debe registrarse en AZC.

### D. WhatsApp

- El botón secundario abre una sola ventana.
- El botón `Abrir WhatsApp` abre una sola ventana.
- No hay doble apertura.
- No hay apertura automática bloqueada por navegador.

### E. AZC

- El lead aparece en Leads.
- La plataforma aparece como Casero Cancún.
- La prioridad queda urgente si aplica.
- Los eventos correctos se registran.
- La tarea automática se crea.

## Problemas corregidos durante el piloto

- API key no expuesta desde frontend gracias al proxy.
- Variables de entorno `AZC_*` necesarias para el proxy.
- Error 503 cuando faltaban endpoint/key.
- Doble apertura de WhatsApp.
- Bloqueo del navegador por apertura async de WhatsApp.
- Textos corruptos por codificación.
- Modal visualmente inestable.

## Pendientes antes de producción

- AZC debe estar desplegado en entorno privado con HTTPS.
- AZC debe usar PostgreSQL o base apta para producción.
- Usar API key real por plataforma.
- No usar `change-me-local-key`.
- Revisar Aviso de Privacidad.
- Confirmar consentimiento del usuario.
- Configurar dominio o URL privada de AZC.
- Configurar logs y monitoreo.
- Configurar backups.
- Agregar rate limiting.
- Validar origen de las solicitudes.
- Reforzar seguridad del panel AZC.