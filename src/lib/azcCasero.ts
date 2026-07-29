import { contact } from "@/lib/contact";
import { normalizeWhatsapp } from "@/lib/utils/whatsapp";

export type CaseroRequestUrgency = "normal" | "alta" | "urgente";

export type CaseroRequestPayload = {
  clientName?: string;
  clientWhatsapp?: string;
  clientPhone?: string;
  clientEmail?: string;
  requestedService?: string;
  category?: string;
  categorySlug?: string;
  zone?: string;
  city?: string;
  state?: string;
  addressReference?: string;
  message?: string;
  isUrgent?: boolean;
  requiresInvoice?: boolean;
  propertyType?: string;
  preferredTime?: string;
  source?: string;
  campaignCode?: string;
  providerId?: string;
  metadata?: Record<string, unknown>;
};

export type CaseroRequestDraft = {
  name: string;
  phone: string;
  zone: string;
  service: string;
  urgency: CaseroRequestUrgency;
  description?: string;
  category?: string;
  providerId?: string;
  providerName?: string;
  serviceUrl?: string;
  cta?: string;
};

type CaseroRequestProxyResponse = {
  ok?: boolean;
  requestId?: string;
  status?: string;
  priority?: string;
  duplicated?: boolean;
  warnings?: unknown[];
  error?: string;
  message?: string;
};

export function buildCaseroWhatsAppMessage({ service, zone, urgency }: { service: string; zone: string; urgency?: CaseroRequestUrgency }) {
  const cleanService = service.trim() || "servicio";
  const cleanZone = zone.trim() || "mi zona";
  const urgentText = urgency === "alta" || urgency === "urgente" ? "si" : "no";

  return "Hola, quiero solicitar un servicio en Casero Cancun. Servicio: " + cleanService + ". Zona: " + cleanZone + ". Urgente: " + urgentText + ".";
}

export function buildProviderWhatsAppMessage({ service, zone }: { service: string; zone: string }) {
  const cleanService = service.trim() || "servicio";
  const cleanZone = zone.trim() || "mi zona";
  return "Hola, vi tu servicio en Casero Cancun y quiero solicitar informacion. Servicio: " + cleanService + ". Zona: " + cleanZone + ".";
}

export function buildCaseroRequestPayload(draft: CaseroRequestDraft): CaseroRequestPayload {
  const whatsappMessage = buildCaseroWhatsAppMessage({ service: draft.service, zone: draft.zone, urgency: draft.urgency });
  const description = draft.description?.trim();

  return {
    clientName: draft.name.trim(),
    clientWhatsapp: draft.phone.trim(),
    requestedService: draft.service.trim(),
    category: draft.category,
    zone: draft.zone.trim(),
    city: "Cancun",
    state: "Quintana Roo",
    message: description ? whatsappMessage + "\n\nDetalle: " + description : whatsappMessage,
    isUrgent: draft.urgency === "alta" || draft.urgency === "urgente",
    source: "casero-frontend",
    campaignCode: draft.cta ?? "casero_service_capture",
    providerId: draft.providerId,
    metadata: {
      pageUrl: draft.serviceUrl,
      cta: draft.cta ?? "pedir_cotizacion",
      providerName: draft.providerName,
      categoryLabel: draft.category,
    },
  };
}

async function readProxyResponse(response: Response): Promise<CaseroRequestProxyResponse> {
  try {
    return (await response.json()) as CaseroRequestProxyResponse;
  } catch {
    return { ok: false, error: "invalid_proxy_response", message: "Respuesta invalida del proxy local." };
  }
}

export async function sendCaseroRequestToAZC(payload: CaseroRequestPayload) {
  const response = await fetch("/api/azc/casero/solicitudes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await readProxyResponse(response);

  if (!response.ok || data.ok !== true) {
    throw new Error(data.message || "No se pudo registrar la solicitud en AZC.");
  }

  return data;
}

export function openWhatsApp(phone: string, message: string) {
  const normalizedPhone = normalizeWhatsapp(phone) ?? normalizeWhatsapp(contact.whatsappLinkNumber) ?? contact.whatsappLinkNumber;
  const url = "https://wa.me/" + normalizedPhone + "?text=" + encodeURIComponent(message);
  window.open(url, "_blank", "noopener,noreferrer");
}
