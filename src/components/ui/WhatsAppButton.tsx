import { MessageCircle } from "lucide-react";
import { contact } from "@/lib/contact";
import { normalizeWhatsapp } from "@/lib/utils/whatsapp";
import { Button } from "./Button";

type WhatsAppButtonProps = {
  phone?: string;
  label?: string;
  message?: string;
  className?: string;
};

export function WhatsAppButton({
  phone = contact.whatsappLinkNumber,
  label = "Contactar por WhatsApp",
  message = "Hola, vengo de Casero Cancún y quiero información.",
  className,
}: WhatsAppButtonProps) {
  const normalizedPhone = normalizeWhatsapp(phone) ?? contact.whatsappLinkNumber;
  const href = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;

  return (
    <Button href={href} variant="secondary" className={className}>
      <MessageCircle className="h-4 w-4" aria-hidden />
      {label}
    </Button>
  );
}
