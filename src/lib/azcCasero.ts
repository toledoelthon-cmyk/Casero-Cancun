export type CaseroAZCRequestPayload = {
  clientName?: string;
  clientWhatsapp?: string;
  clientPhone?: string;
  clientEmail?: string;
  requestedService?: string;
  category?: string;
  zona?: string;
  zone?: string;
  city?: string;
  message?: string;
  isUrgent?: boolean;
  requiresInvoice?: boolean;
  source: "casero-frontend" | "casero-frontend-test";
  campaignCode: "pedir_cotizacion" | "debug_c9_3";
  providerId?: string;
  name?: string;
  whatsapp?: string;
  telefono?: string;
  email?: string;
  service?: string;
  servicio?: string;
  categoria?: string;
  mensaje?: string;
  urgente?: boolean;
  factura?: boolean;
  origen?: string;
  metadata?: {
    providerName?: string;
    providerWhatsapp?: string;
    pageUrl?: string;
    cta?: "pedir_cotizacion";
  };
};

export type CaseroAZCResult = {
  ok: boolean;
  status?: number;
  requestId?: string;
  duplicated?: boolean;
  error?: string;
  message?: string;
  azcResponse?: unknown;
};

function getStringField(body: unknown, key: string) {
  return typeof body === "object" && body !== null && key in body && typeof body[key as keyof typeof body] === "string"
    ? (body[key as keyof typeof body] as string)
    : undefined;
}

function getBooleanField(body: unknown, key: string) {
  return typeof body === "object" && body !== null && key in body && typeof body[key as keyof typeof body] === "boolean"
    ? (body[key as keyof typeof body] as boolean)
    : undefined;
}

function getUnknownField(body: unknown, key: string) {
  return typeof body === "object" && body !== null && key in body ? body[key as keyof typeof body] : undefined;
}

export async function sendCaseroRequestToAZC(payload: CaseroAZCRequestPayload): Promise<CaseroAZCResult> {
  try {
    const response = await fetch("/api/azc/casero/solicitudes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let body: unknown;

    try {
      body = await response.json();
    } catch {
      return {
        ok: false,
        status: response.status,
        error: "invalid_proxy_response",
        message: "El proxy interno de AZC no devolvió JSON válido.",
      };
    }

    const proxyOk = getBooleanField(body, "ok");
    const error = getStringField(body, "error");
    const status = getUnknownField(body, "status");

    return {
      ok: response.ok && proxyOk !== false && error === undefined,
      status: typeof status === "number" ? status : response.status,
      requestId: getStringField(body, "requestId"),
      duplicated: getBooleanField(body, "duplicated"),
      error,
      message: getStringField(body, "message"),
      azcResponse: getUnknownField(body, "azcResponse"),
    };
  } catch {
    return {
      ok: false,
      error: "proxy_unavailable",
      message: "No se pudo contactar el proxy interno de AZC.",
    };
  }
}
