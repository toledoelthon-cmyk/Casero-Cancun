import { NextResponse } from "next/server";

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

function getString(payload: Record<string, unknown>, keys: string[]) {
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
  const hasContact = Boolean(getString(record, ["clientWhatsapp", "clientPhone", "clientEmail", "whatsapp", "telefono", "email"]));
  const hasNeed = Boolean(getString(record, ["requestedService", "category", "message", "service", "servicio", "categoria", "mensaje"]));

  return hasContact && hasNeed;
}

function getEnv() {
  return {
    AZC_URL: process.env.AZC_CASERO_REQUESTS_URL?.trim() || "",
    AZC_KEY: process.env.AZC_PUBLIC_LEADS_API_KEY?.trim() || "",
  };
}

export async function GET() {
  const { AZC_URL, AZC_KEY } = getEnv();

  return NextResponse.json({
    ok: true,
    proxy: "casero-azc",
    hasAzcUrl: Boolean(AZC_URL),
    hasAzcApiKey: Boolean(AZC_KEY),
    targetUrlConfigured: Boolean(AZC_URL),
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
      error: "missing_azc_api_key",
      hasUrl: Boolean(AZC_URL),
      hasKey: false,
    });

    return NextResponse.json(
      {
        ok: false,
        error: "missing_azc_api_key",
        message: "Falta AZC_PUBLIC_LEADS_API_KEY en el servidor.",
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
    const azcResponse = safeParseJson(responseText);

    if (!response.ok) {
      console.error("AZC Casero request failed", {
        status: response.status,
        error: getSafeErrorMessage(azcResponse),
        hasUrl: Boolean(AZC_URL),
        hasKey: Boolean(AZC_KEY),
      });

      return NextResponse.json(
        {
          ok: false,
          error: "azc_rejected_request",
          status: response.status,
          message: "AZC rechazó la solicitud.",
          azcResponse,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({ ok: true, status: response.status, requestId: getRequestId(azcResponse), azcResponse });
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