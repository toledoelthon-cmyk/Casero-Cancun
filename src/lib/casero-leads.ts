import { normalizeWhatsapp } from "@/lib/utils/whatsapp";

export type CaseroLeadUrgency = "normal" | "alta" | "urgente";

export type CaseroLeadPayload = {
  platform: "casero-cancun";
  leadType: "cliente_servicio";
  action: "pedir_cotizacion";
  name: string;
  phone: string;
  city: "Cancún";
  zone: string;
  service: string;
  urgency: CaseroLeadUrgency;
  source: "web";
  message: string;
  category?: string;
  providerName?: string;
  serviceUrl?: string;
};

type CaseroLeadProxyResponse = {
  ok?: boolean;
  code?: string;
  error?: string;
  data?: unknown;
  diagnostics?: unknown;
  details?: unknown;
};

export type CaseroLeadDraft = {
  name: string;
  phone: string;
  zone: string;
  service: string;
  urgency: CaseroLeadUrgency;
  description?: string;
  category?: string;
  providerName?: string;
  serviceUrl?: string;
};

export function buildCaseroWhatsAppMessage({
  service,
  zone,
  urgency,
}: {
  service: string;
  zone: string;
  urgency?: CaseroLeadUrgency;
}) {
  const cleanService = service.trim();
  const cleanZone = zone.trim();

  if (urgency === "alta" || urgency === "urgente") {
    return `Hola, necesito un servicio urgente de ${cleanService} en ${cleanZone}. Vi tu perfil en Casero Cancún.`;
  }

  return `Hola, vi tu perfil en Casero Cancún y quiero cotizar un servicio de ${cleanService} en ${cleanZone}.`;
}

export function buildCaseroLeadPayload(draft: CaseroLeadDraft): CaseroLeadPayload {
  const whatsappMessage = buildCaseroWhatsAppMessage({
    service: draft.service,
    zone: draft.zone,
    urgency: draft.urgency,
  });
  const description = draft.description?.trim();

  return {
    platform: "casero-cancun",
    leadType: "cliente_servicio",
    action: "pedir_cotizacion",
    name: draft.name.trim(),
    phone: draft.phone.trim(),
    city: "Cancún",
    zone: draft.zone.trim(),
    service: draft.service.trim(),
    urgency: draft.urgency,
    source: "web",
    message: description ? `${whatsappMessage}\n\nDetalle: ${description}` : whatsappMessage,
    category: draft.category,
    providerName: draft.providerName,
    serviceUrl: draft.serviceUrl,
  };
}

async function readProxyResponse(response: Response): Promise<CaseroLeadProxyResponse> {
  try {
    return (await response.json()) as CaseroLeadProxyResponse;
  } catch {
    return { ok: false, code: "INVALID_PROXY_RESPONSE", error: "Respuesta inválida del proxy local." };
  }
}

export async function sendCaseroLeadToAZC(payload: CaseroLeadPayload) {
  if (process.env.NODE_ENV === "development") {
    console.log("[Casero AZC] payload", payload);
  }

  try {
    const response = await fetch("/api/azc/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await readProxyResponse(response);

    if (process.env.NODE_ENV === "development") {
      console.log("[Casero AZC] response", data);
    }

    if (!response.ok || data.ok !== true) {
      throw new Error(data.error || "No pudimos registrar la solicitud.");
    }

    return data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Casero AZC] fetch error", error);
    }

    throw error;
  }
}

export function openWhatsApp(phone: string, message: string) {
  const normalizedPhone = normalizeWhatsapp(phone);
  const url = `https://wa.me/${normalizedPhone ?? phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}