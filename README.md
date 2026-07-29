# Casero Cancún

Directorio local de servicios, proveedores y negocios en Cancún.

## Integración con AZC

Casero Cancún incluye un piloto local de captura de leads conectado a Aplex Zone Center (AZC). El flujo permite capturar solicitudes de cotización desde el modal `Pedir cotización`, registrar la solicitud en AZC mediante el proxy interno de Casero y después permitir que el usuario continúe por WhatsApp manualmente.

Documentación completa: [Integración piloto Casero Cancún -> AZC](docs/INTEGRACION_AZC_CASERO_PILOTO.md)

Variables requeridas para el proxy server-side de Casero:

```env
AZC_LEADS_ENDPOINT=http://localhost:3000/api/public/leads
AZC_PUBLIC_LEADS_API_KEY=change-me-local-key
```

Para pruebas locales, corre AZC en `http://localhost:3000` y Casero en otro puerto, por ejemplo:

```powershell
npx.cmd next dev --hostname 127.0.0.1 --port 3001
```

Después de cambiar variables de entorno, reinicia el servidor de Casero.