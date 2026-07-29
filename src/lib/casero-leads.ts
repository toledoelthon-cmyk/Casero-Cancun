import { contact } from "@/lib/contact";
import { normalizeWhatsapp } from "@/lib/utils/whatsapp";

export const CASERO_OFFICIAL_WHATSAPP = "529904028923";

export type CaseroWhatsappMessageInput = {
  service?: string;
  zone?: string;
  message?: string;
};

export function buildCaseroWhatsappMessage({ service, zone, message }: CaseroWhatsappMessageInput) {
  const cleanService = service?.trim() || "No especificado";
  const cleanZone = zone?.trim() || "No especificada";
  const cleanMessage = message?.trim() || "Sin mensaje adicional";

  return `Hola, quiero solicitar una cotización en ${contact.brand}. Servicio: ${cleanService}. Zona: ${cleanZone}. Mensaje: ${cleanMessage}.`;
}

export function buildCaseroWhatsappUrl(phone: string | undefined, message: string) {
  const normalizedPhone = phone ? normalizeWhatsapp(phone) : null;
  const destination = normalizedPhone ?? CASERO_OFFICIAL_WHATSAPP;

  return `https://wa.me/${destination}?text=${encodeURIComponent(message)}`;
}
