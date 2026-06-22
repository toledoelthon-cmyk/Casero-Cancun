import { MessageCircle } from "lucide-react";
import { Button } from "./Button";

type WhatsAppButtonProps = {
  phone?: string;
  label?: string;
  message?: string;
};

export function WhatsAppButton({
  phone = "529981234567",
  label = "Contactar por WhatsApp",
  message = "Hola, encontré su negocio en Casero Cancún y me gustaría pedir información.",
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <Button href={href} variant="secondary">
      <MessageCircle className="h-4 w-4" aria-hidden />
      {label}
    </Button>
  );
}
