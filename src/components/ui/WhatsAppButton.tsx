"use client";

import { MessageCircle } from "lucide-react";
import { MouseEvent, useState } from "react";
import { CaseroServiceCaptureModal } from "@/components/marketplace/CaseroServiceCaptureModal";
import { contact } from "@/lib/contact";
import { normalizeWhatsapp } from "@/lib/utils/whatsapp";
import { Button } from "./Button";

type WhatsAppButtonProps = {
  phone?: string;
  label?: string;
  message?: string;
  className?: string;
  captureLead?: boolean;
  leadContext?: {
    category?: string;
    providerName?: string;
    service?: string;
    serviceUrl?: string;
  };
};

export function WhatsAppButton({
  phone = contact.whatsappLinkNumber,
  label = "Contactar por WhatsApp",
  message = "Hola, vengo de Casero Cancún y quiero información.",
  className,
  captureLead = false,
  leadContext,
}: WhatsAppButtonProps) {
  const [captureOpen, setCaptureOpen] = useState(false);
  const normalizedPhone = normalizeWhatsapp(phone) ?? contact.whatsappLinkNumber;
  const href = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;

  function handleCaptureClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setCaptureOpen(true);
  }

  if (captureLead) {
    return (
      <>
        <Button type="button" variant="secondary" className={className} onClick={handleCaptureClick}>
          <MessageCircle className="h-4 w-4" aria-hidden />
          {label}
        </Button>
        <CaseroServiceCaptureModal
          open={captureOpen}
          onClose={() => setCaptureOpen(false)}
          phone={normalizedPhone}
          defaultMessage={message}
          defaultService={leadContext?.service}
          category={leadContext?.category}
          providerName={leadContext?.providerName}
          serviceUrl={leadContext?.serviceUrl}
        />
      </>
    );
  }

  return (
    <Button href={href} variant="secondary" className={className}>
      <MessageCircle className="h-4 w-4" aria-hidden />
      {label}
    </Button>
  );
}
