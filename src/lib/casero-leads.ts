import { contact } from "@/lib/contact";

export const CASERO_OFFICIAL_WHATSAPP = "529904028923";

export type CaseroWhatsappMessageInput = {
  providerName?: string;
  service?: string;
  zone?: string;
  message?: string;
};

export type CaseroWhatsappTargetInput = {
  providerWhatsapp?: string;
  providerPhone?: string;
};

export type CaseroWhatsappUrlInput = CaseroWhatsappMessageInput & {
  targetWhatsapp?: string;
};

export function normalizeWhatsAppNumber(value?: string | null) {
  const digits = value?.replace(/\D/g, "") ?? "";

  if (digits.length === 10) {
    return `52${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("52")) {
    return digits;
  }

  return null;
}

export function getCaseroWhatsappTarget({ providerWhatsapp, providerPhone }: CaseroWhatsappTargetInput) {
  return normalizeWhatsAppNumber(providerWhatsapp) ?? normalizeWhatsAppNumber(providerPhone) ?? CASERO_OFFICIAL_WHATSAPP;
}

export function buildCaseroWhatsappMessage({ providerName, service, zone, message }: CaseroWhatsappMessageInput) {
  const cleanService = service?.trim() || "No especificado";
  const cleanZone = zone?.trim() || "No especificada";
  const cleanMessage = message?.trim() || "Sin mensaje adicional";
  const providerText = providerName?.trim() ? ` Proveedor: ${providerName.trim()}.` : "";

  return `Hola, quiero solicitar una cotización en ${contact.brand}.${providerText} Servicio: ${cleanService}. Zona: ${cleanZone}. Mensaje: ${cleanMessage}.`;
}

export function buildCaseroWhatsappUrl({ targetWhatsapp, providerName, service, zone, message }: CaseroWhatsappUrlInput) {
  const destination = normalizeWhatsAppNumber(targetWhatsapp) ?? CASERO_OFFICIAL_WHATSAPP;
  const whatsappMessage = buildCaseroWhatsappMessage({ providerName, service, zone, message });

  return `https://wa.me/${destination}?text=${encodeURIComponent(whatsappMessage)}`;
}