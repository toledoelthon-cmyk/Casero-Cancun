export type CaseroAZCRequestPayload = {
  clientName?: string;
  clientWhatsapp: string;
  clientPhone?: string;
  clientEmail?: string;
  requestedService: string;
  category?: string;
  zone?: string;
  city?: string;
  message: string;
  isUrgent?: boolean;
  requiresInvoice?: boolean;
  source: "casero-frontend";
  campaignCode: "pedir_cotizacion";
  providerId?: string;
  metadata?: {
    providerName?: string;
    providerWhatsapp?: string;
    pageUrl?: string;
    cta?: "pedir_cotizacion";
  };
};

export type CaseroAZCResult =
  | {
      ok: true;
      requestId?: string;
    }
  | {
      ok: false;
      error: string;
    };

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

    if (!response.ok) {
      return { ok: false, error: "azc_unavailable" };
    }

    const requestId =
      typeof body === "object" && body !== null && "requestId" in body && typeof body.requestId === "string"
        ? body.requestId
        : undefined;

    return { ok: true, requestId };
  } catch {
    return { ok: false, error: "azc_unavailable" };
  }
}