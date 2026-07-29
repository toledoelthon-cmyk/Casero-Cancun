import { NextResponse } from "next/server";

type CaseroRequestBody = Record<string, unknown>;

const DEFAULT_AZC_REQUESTS_URL = "https://azc-crm.marketinmobiliario.mx/api/public/casero/solicitudes";

function getAZCConfig() {
  const endpoint = (process.env.AZC_CASERO_REQUESTS_URL || DEFAULT_AZC_REQUESTS_URL).trim();
  const apiKey = (process.env.AZC_PUBLIC_LEADS_API_KEY || process.env.AZC_CASERO_API_KEY || process.env.AZC_API_KEY)?.trim() || null;

  return {
    endpoint,
    apiKey,
    diagnostics: {
      hasEndpoint: Boolean(endpoint),
      hasApiKey: Boolean(apiKey),
    },
  };
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function optionalText(value: unknown, maxLength: number) {
  const clean = text(value, maxLength);
  return clean || undefined;
}

function bool(value: unknown) {
  if (value === true) return true;
  if (typeof value === "number") return value === 1;
  if (typeof value !== "string") return false;
  return ["true", "si", "si", "1", "urgente", "factura"].includes(value.trim().toLowerCase());
}

function getMetadata(body: CaseroRequestBody) {
  const metadata = body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata) ? body.metadata : {};
  return {
    ...metadata,
    pageUrl: optionalText(body.pageUrl, 500) || (metadata as Record<string, unknown>).pageUrl,
    cta: optionalText(body.cta, 120) || (metadata as Record<string, unknown>).cta,
    providerName: optionalText(body.providerName, 160) || (metadata as Record<string, unknown>).providerName,
    categoryLabel: optionalText(body.categoryLabel, 160) || (metadata as Record<string, unknown>).categoryLabel,
  };
}

async function readAZCResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }
  try {
    const responseText = await response.text();
    return responseText ? { message: responseText.slice(0, 500) } : undefined;
  } catch {
    return undefined;
  }
}

export async function GET() {
  const { endpoint, diagnostics } = getAZCConfig();
  return NextResponse.json({ ok: true, endpoint, hasEndpoint: diagnostics.hasEndpoint, hasApiKey: diagnostics.hasApiKey });
}

export async function POST(request: Request) {
  const { endpoint, apiKey, diagnostics } = getAZCConfig();

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "azc_proxy_not_configured", message: "El proxy de solicitudes Casero no esta configurado.", diagnostics },
      { status: 503 },
    );
  }

  let body: CaseroRequestBody;
  try {
    body = (await request.json()) as CaseroRequestBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json", message: "El cuerpo debe ser JSON valido." }, { status: 400 });
  }

  const clientWhatsapp = optionalText(body.clientWhatsapp ?? body.whatsapp, 40);
  const clientPhone = optionalText(body.clientPhone ?? body.phone, 40);
  const clientEmail = optionalText(body.clientEmail ?? body.email, 160);
  const requestedService = optionalText(body.requestedService ?? body.service, 180);
  const category = optionalText(body.category, 160);
  const message = optionalText(body.message, 1200);
  const isUrgent = bool(body.isUrgent);

  const hasContact = Boolean(clientWhatsapp || clientPhone || clientEmail);
  const hasService = Boolean(requestedService || category || optionalText(body.categorySlug, 120) || message);

  if (!hasContact) {
    return NextResponse.json({ ok: false, error: "missing_contact", message: "Agrega un WhatsApp o telefono para poder dar seguimiento." }, { status: 400 });
  }

  if (!hasService) {
    return NextResponse.json({ ok: false, error: "missing_service", message: "Indica que servicio necesitas." }, { status: 400 });
  }

  if (isUrgent && !clientWhatsapp && !clientPhone) {
    return NextResponse.json({ ok: false, error: "urgent_phone_required", message: "Para una urgencia agrega WhatsApp o telefono." }, { status: 400 });
  }

  const payload = {
    clientName: optionalText(body.clientName ?? body.name, 120),
    clientWhatsapp,
    clientPhone,
    clientEmail,
    requestedService,
    category,
    categorySlug: optionalText(body.categorySlug, 120),
    zone: optionalText(body.zone, 120),
    city: optionalText(body.city, 120) || "Cancun",
    state: optionalText(body.state, 120) || "Quintana Roo",
    addressReference: optionalText(body.addressReference, 300),
    message,
    isUrgent,
    requiresInvoice: bool(body.requiresInvoice),
    propertyType: optionalText(body.propertyType, 120),
    preferredTime: optionalText(body.preferredTime, 160),
    source: optionalText(body.source, 80) || "casero-frontend",
    campaignCode: optionalText(body.campaignCode, 120),
    providerId: optionalText(body.providerId, 120),
    metadata: getMetadata(body),
  };

  try {
    const azcResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-azc-api-key": apiKey,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const azcBody = await readAZCResponse(azcResponse);

    if (!azcResponse.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("azc casero request forwarding error", {
          status: azcResponse.status,
          statusText: azcResponse.statusText,
          hasEndpoint: true,
          hasApiKey: true,
          body: azcBody,
        });
      }

      return NextResponse.json(
        { ok: false, error: "azc_unavailable", message: "No se pudo registrar la solicitud en AZC." },
        { status: azcResponse.status === 400 ? 400 : 502 },
      );
    }

    const bodyObject = azcBody && typeof azcBody === "object" ? (azcBody as Record<string, unknown>) : {};

    return NextResponse.json({
      ok: true,
      requestId: bodyObject.requestId,
      status: bodyObject.status,
      priority: bodyObject.priority,
      duplicated: Boolean(bodyObject.duplicated),
      warnings: Array.isArray(bodyObject.warnings) ? bodyObject.warnings : [],
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("azc casero request forwarding failed", {
        hasEndpoint: true,
        hasApiKey: true,
        error: error instanceof Error ? error.message : "unknown error",
      });
    }

    return NextResponse.json(
      { ok: false, error: "azc_unavailable", message: "No se pudo registrar la solicitud en AZC." },
      { status: 502 },
    );
  }
}
