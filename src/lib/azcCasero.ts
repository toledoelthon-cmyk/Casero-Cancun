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
  error?: string;
  message?: string;
  details?: string;
};

function getStringField(body: unknown, key: string) {
  return typeof body === "object" && body !== null && key in body && typeof body[key as keyof typeof body] === "string"
    ? (body[key as keyof typeof body] as string)
    : undefined;
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

    let body: unknown = null;

    try {
      body = await response.json();
    } catch {
      body = null;
    }

    return {
      ok: response.ok && getStringField(body, "error") === undefined,
      status: response.status,
      requestId: getStringField(body, "requestId"),
      error: getStringField(body, "error"),
      message: getStringField(body, "message"),
      details: getStringField(body, "details"),
    };
  } catch {
    return {
      ok: false,
      error: "proxy_unavailable",
      message: "No se pudo contactar el proxy interno de AZC.",
    };
  }
}