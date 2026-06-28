import { contact } from "@/lib/contact";

type ManualPaymentPlan = {
  slug?: string | null;
  name?: string | null;
};

const paymentLinks: Record<string, string | undefined> = {
  basico: process.env.NEXT_PUBLIC_MP_LINK_BASIC,
  basic: process.env.NEXT_PUBLIC_MP_LINK_BASIC,
  pro: process.env.NEXT_PUBLIC_MP_LINK_PRO,
  premium: process.env.NEXT_PUBLIC_MP_LINK_PREMIUM,
};

const defaultCodiQrLinks: Record<string, string> = {
  basico: "/payments/codi-basic.jpg",
  basic: "/payments/codi-basic.jpg",
  pro: "/payments/codi-pro.jpg",
  premium: "/payments/codi-premium.jpg",
};

const codiQrLinks: Record<string, string | undefined> = {
  basico: process.env.NEXT_PUBLIC_CODI_QR_BASIC,
  basic: process.env.NEXT_PUBLIC_CODI_QR_BASIC,
  pro: process.env.NEXT_PUBLIC_CODI_QR_PRO,
  premium: process.env.NEXT_PUBLIC_CODI_QR_PREMIUM,
};

function normalizePlanSlug(plan?: ManualPaymentPlan | string | null) {
  const value = typeof plan === "string" ? plan : plan?.slug ?? plan?.name ?? "";

  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function cleanPublicUrl(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function buildManualPaymentWhatsappUrl(message: string) {
  return `https://wa.me/${contact.whatsappLinkNumber}?text=${encodeURIComponent(message)}`;
}

export function getManualPaymentLinks(plan?: ManualPaymentPlan | string | null, message?: string) {
  const normalizedSlug = normalizePlanSlug(plan);
  const paymentUrl = cleanPublicUrl(paymentLinks[normalizedSlug]);
  const codiQrUrl =
    cleanPublicUrl(codiQrLinks[normalizedSlug]) ??
    cleanPublicUrl(process.env.NEXT_PUBLIC_CODI_QR_GENERAL) ??
    cleanPublicUrl(defaultCodiQrLinks[normalizedSlug]);
  const planName = typeof plan === "string" ? plan : (plan?.name ?? normalizedSlug) || "plan seleccionado";
  const defaultMessage = `Hola, quiero solicitar información para pagar por CoDi o transferencia el plan ${planName} de Casero Cancún.`;
  const hasCodiQr = Boolean(codiQrUrl);

  return {
    paymentUrl,
    codiQrUrl,
    hasCodiQr,
    codiInstructions:
      "Escanea el código QR desde la app de tu banco, realiza el pago del plan seleccionado y envíanos el comprobante por WhatsApp para activar tu publicación.",
    selectedManualMethod: hasCodiQr ? "codi" : paymentUrl ? "mercado_pago" : "whatsapp",
    whatsappUrl: buildManualPaymentWhatsappUrl(message ?? defaultMessage),
    label: paymentUrl ? "Pagar con Mercado Pago" : hasCodiQr ? "Pagar con CoDi" : "Solicitar datos por WhatsApp",
  };
}
