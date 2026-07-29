import { NextResponse } from "next/server";

// This server-side proxy forwards Casero leads to AZC without exposing the AZC API key to the browser.

type AZCLeadRequestBody = {
  platform?: unknown;
  leadType?: unknown;
  action?: unknown;
  name?: unknown;
  phone?: unknown;
  city?: unknown;
  zone?: unknown;
  service?: unknown;
  urgency?: unknown;
  source?: unknown;
  message?: unknown;
  category?: unknown;
  providerName?: unknown;
  serviceUrl?: unknown;
};

function getAZCConfig() {
  const endpoint = (process.env.AZC_LEADS_ENDPOINT || process.env.VITE_AZC_LEADS_ENDPOINT)?.trim() || null;
  const apiKey = (process.env.AZC_PUBLIC_LEADS_API_KEY || process.env.VITE_AZC_PUBLIC_LEADS_API_KEY)?.trim() || null;

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
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function optionalText(value: unknown, maxLength: number) {
  const cleanValue = text(value, maxLength);
  return cleanValue || undefined;
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

  return NextResponse.json({
    ok: true,
    hasEndpoint: diagnostics.hasEndpoint,
    hasApiKey: diagnostics.hasApiKey,
    endpoint,
  });
}

export async function POST(request: Request) {
  const { endpoint, apiKey, diagnostics } = getAZCConfig();

  if (!endpoint || !apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.error("azc lead proxy missing configuration", diagnostics);
    }

    return NextResponse.json(
      {
        ok: false,
        code: "AZC_PROXY_NOT_CONFIGURED",
        error: "El proxy local de AZC no está configurado.",
        diagnostics,
      },
      { status: 503 },
    );
  }

  let body: AZCLeadRequestBody;

  try {
    body = (await request.json()) as AZCLeadRequestBody;
  } catch {
    return NextResponse.json({ ok: false, code: "INVALID_JSON", error: "JSON inválido." }, { status: 400 });
  }

  const lead = {
    platform: "casero-cancun",
    leadType: "cliente_servicio",
    action: "pedir_cotizacion",
    name: text(body.name, 120),
    phone: text(body.phone, 40),
    city: "Cancún",
    zone: text(body.zone, 120),
    service: text(body.service, 160),
    urgency: text(body.urgency, 20) || "normal",
    source: "web",
    message: text(body.message, 1200),
    category: optionalText(body.category, 160),
    providerName: optionalText(body.providerName, 160),
    serviceUrl: optionalText(body.serviceUrl, 500),
  };

  if (!lead.name || !lead.phone || !lead.zone || !lead.service) {
    return NextResponse.json({ ok: false, code: "MISSING_REQUIRED_FIELDS", error: "Faltan campos obligatorios." }, { status: 400 });
  }

  try {
    const azcResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-azc-api-key": apiKey,
      },
      body: JSON.stringify(lead),
      cache: "no-store",
    });

    const azcBody = await readAZCResponse(azcResponse);

    if (!azcResponse.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("azc lead forwarding error", {
          status: azcResponse.status,
          statusText: azcResponse.statusText,
          hasEndpoint: true,
          hasApiKey: true,
          body: azcBody,
        });
      }

      if (azcResponse.status === 400) {
        return NextResponse.json(
          { ok: false, code: "AZC_BAD_REQUEST", error: "AZC no aceptó la solicitud.", details: azcBody },
          { status: 400 },
        );
      }

      if (azcResponse.status === 401) {
        return NextResponse.json(
          { ok: false, code: "AZC_UNAUTHORIZED", error: "No se pudo autenticar con AZC." },
          { status: 502 },
        );
      }

      return NextResponse.json(
        { ok: false, code: "AZC_REQUEST_FAILED", error: "AZC no aceptó la solicitud.", details: azcBody },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, data: azcBody });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("azc lead forwarding failed", {
        hasEndpoint: true,
        hasApiKey: true,
        error: error instanceof Error ? error.message : "unknown error",
      });
    }

    return NextResponse.json(
      { ok: false, code: "AZC_UNAVAILABLE", error: "AZC no está disponible en este momento." },
      { status: 502 },
    );
  }
}