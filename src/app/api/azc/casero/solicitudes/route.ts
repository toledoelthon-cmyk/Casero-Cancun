import { NextResponse } from "next/server";

const SENSITIVE_KEYS = new Set(["apikey", "api_key", "authorization", "token", "secret", "password", "x-azc-api-key"]);

function getRequestId(body: unknown) {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }

  for (const key of ["requestId", "id", "solicitudId", "leadId"]) {
    if (key in body && typeof body[key as keyof typeof body] === "string") {
      return body[key as keyof typeof body] as string;
    }
  }

  return undefined;
}

function getBoolean(body: unknown, key: string) {
  return typeof body === "object" && body !== null && key in body && typeof body[key as keyof typeof body] === "boolean"
    ? (body[key as keyof typeof body] as boolean)
    : undefined;
}

function getString(body: unknown, key: string) {
  return typeof body === "object" && body !== null && key in body && typeof body[key as keyof typeof body] === "string"
    ? (body[key as keyof typeof body] as string)
    : undefined;
}

function getField(body: unknown, key: string) {
  return typeof body === "object" && body !== null && key in body ? body[key as keyof typeof body] : undefined;
}

function getWarnings(body: unknown) {
  const warnings = getField(body, "warnings");

  return Array.isArray(warnings) ? warnings : [];
}

function redactSensitive(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactSensitive);
  }

  if (typeof value !== "object" || value === null) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
      key,
      SENSITIVE_KEYS.has(key.toLowerCase()) ? "[redacted]" : redactSensitive(entry),
    ]),
  );
}

function getSafeErrorMessage(body: unknown) {
  if (typeof body === "object" && body !== null && "error" in body && typeof body.error === "string") {
    return body.error;
  }

  if (typeof body === "object" && body !== null && "message" in body && typeof body.message === "string") {
    return body.message;
  }

  if (typeof body === "string" && body.trim()) {
    return body.slice(0, 500);
  }

  return "azc_unavailable";
}

function safeParseJson(text: string) {
  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text.slice(0, 1000);
  }
}

function getPayloadString(payload: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = payload[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function validatePayload(payload: unknown) {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return false;
  }

  const record = payload as Record<string, unknown>;
  const hasContact = Boolean(getPayloadString(record, ["clientWhatsapp", "clientPhone", "clientEmail", "whatsapp", "telefono", "email"]));
  const hasNeed = Boolean(getPayloadString(record, ["requestedService", "category", "message", "service", "servicio", "categoria", "mensaje"]));

  return hasContact && hasNeed;
}

function getEnv() {
  const caseroKey = process.env.AZC_CASERO_REQUESTS_API_KEY?.trim() || "";
  const legacyPublicKey = process.env.AZC_PUBLIC_LEADS_API_KEY?.trim() || "";

  return {
    AZC_URL: process.env.AZC_CASERO_REQUESTS_URL?.trim() || "",
    // Casero debe usar AZC_CASERO_REQUESTS_API_KEY. Market conserva AZC_PUBLIC_LEADS_API_KEY;
    // este fallback queda solo para estabilizacion temporal de despliegue.
    AZC_KEY: caseroKey || legacyPublicKey,
    HAS_CASERO_KEY: Boolean(caseroKey),
    LEGACY_FALLBACK_AVAILABLE: Boolean(legacyPublicKey),
  };
}

export async function GET() {
  const { AZC_URL, HAS_CASERO_KEY, LEGACY_FALLBACK_AVAILABLE } = getEnv();

  return NextResponse.json({
    ok: true,
    proxy: "casero-azc",
    hasAzcUrl: Boolean(AZC_URL),
    hasAzcApiKey: HAS_CASERO_KEY,
    targetUrlConfigured: Boolean(AZC_URL),
    keyMode: "casero_separated",
    legacyFallbackAvailable: LEGACY_FALLBACK_AVAILABLE,
  });
}

export async function POST(request: Request) {
  const { AZC_URL, AZC_KEY } = getEnv();

  if (!AZC_URL) {
    console.error("AZC Casero request failed", {
      status: 500,
      error: "missing_azc_url",
      hasUrl: false,
      hasKey: Boolean(AZC_KEY),
    });

    return NextResponse.json(
      {
        ok: false,
        error: "missing_azc_url",
        message: "Falta AZC_CASERO_REQUESTS_URL en el servidor.",
      },
      { status: 500 },
    );
  }

  if (!AZC_KEY) {
    console.error("AZC Casero request failed", {
      status: 500,
      error: "missing_azc_casero_api_key",
      hasUrl: Boolean(AZC_URL),
      hasKey: false,
    });

    return NextResponse.json(
      {
        ok: false,
        error: "missing_azc_casero_api_key",
        message: "Falta AZC_CASERO_REQUESTS_API_KEY en el servidor.",
      },
      { status: 500 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json", message: "El cuerpo no es JSON válido." }, { status: 400 });
  }

  if (!validatePayload(payload)) {
    return NextResponse.json(
      {
        ok: false,
        error: "missing_required_fields",
        message: "Falta contacto o servicio/mensaje.",
      },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(AZC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-azc-api-key": AZC_KEY,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const responseText = await response.text();
    const azcJson = safeParseJson(responseText);
    const safeAzcResponse = redactSensitive(azcJson);

    if (!response.ok) {
      console.error("AZC Casero request failed", {
        status: response.status,
        error: getSafeErrorMessage(azcJson),
        hasUrl: Boolean(AZC_URL),
        hasKey: Boolean(AZC_KEY),
      });

      return NextResponse.json(
        {
          ok: false,
          status: response.status,
          error: "azc_rejected_request",
          message: getString(azcJson, "message") || "AZC rechazó la solicitud.",
          azcResponse: safeAzcResponse,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      ok: true,
      status: response.status,
      requestId: getRequestId(azcJson),
      duplicated: getBoolean(azcJson, "duplicated") || false,
      azcStatus: getField(azcJson, "status"),
      priority: getField(azcJson, "priority"),
      warnings: getWarnings(azcJson),
    });
  } catch (error) {
    console.error("AZC Casero request failed", {
      status: 502,
      error: error instanceof Error ? error.message : "fetch_failed",
      hasUrl: Boolean(AZC_URL),
      hasKey: Boolean(AZC_KEY),
    });

    return NextResponse.json(
      {
        ok: false,
        error: "azc_network_error",
        status: 502,
        message: "No se pudo contactar AZC.",
      },
      { status: 502 },
    );
  }
}
