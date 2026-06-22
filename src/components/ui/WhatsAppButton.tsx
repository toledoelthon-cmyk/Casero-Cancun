import { MessageCircle } from "lucide-react";
import { contact } from "@/lib/contact";
import { Button } from "./Button";

type WhatsAppButtonProps = {
  phone?: string;
  label?: string;
  message?: string;
};

export function WhatsAppButton({
  phone = contact.whatsappLinkNumber,
  label = "Contactar por WhatsApp",
  message = "Hola, vengo de Casero Cancún y quiero información.",
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <Button href={href} variant="secondary">
      <MessageCircle className="h-4 w-4" aria-hidden />
      {label}
    </Button>
  );
}
