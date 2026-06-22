"use client";

import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/contact";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-casero-green px-4 font-heading text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casero-green focus-visible:ring-offset-2 sm:px-5"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
