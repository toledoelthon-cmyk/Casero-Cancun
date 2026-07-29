"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { sendCaseroRequestToAZC } from "@/lib/azcCasero";
import { buildCaseroWhatsappMessage, buildCaseroWhatsappUrl, getCaseroWhatsappTarget } from "@/lib/casero-leads";
import { Button } from "@/components/ui/Button";

type CaseroServiceCaptureModalProps = {
  businessName: string;
  service?: string;
  category?: string;
  zone?: string;
  providerId?: string;
  providerWhatsapp?: string;
  providerPhone?: string;
  className?: string;
};

type SubmitState = "idle" | "loading" | "success" | "fallback";

export function CaseroServiceCaptureModal({
  businessName,
  service,
  category,
  zone,
  providerId,
  providerWhatsapp,
  providerPhone,
  className,
}: CaseroServiceCaptureModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [requestedService, setRequestedService] = useState(service ?? category ?? "");
  const [requestedZone, setRequestedZone] = useState(zone ?? "");
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const isSubmittingRef = useRef(false);

  const statusMessage = useMemo(() => {
    if (submitState === "loading") {
      return "Registrando solicitud...";
    }

    if (submitState === "success") {
      return "Solicitud registrada. Te llevaremos a WhatsApp.";
    }

    if (submitState === "fallback") {
      return "No pudimos registrar la solicitud en AZC, pero puedes continuar por WhatsApp.";
    }

    return "";
  }, [submitState]);

  function resetModalState() {
    setFieldError("");
    setSubmitState("idle");
    isSubmittingRef.current = false;
  }

  function openModal() {
    resetModalState();
    setIsOpen(true);
  }

  function closeModal() {
    if (isSubmittingRef.current) {
      return;
    }

    setIsOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    setFieldError("");

    const cleanPhone = customerPhone.trim();
    const cleanService = requestedService.trim();
    const cleanZone = requestedZone.trim();
    const cleanMessage = message.trim();

    if (!cleanPhone) {
      setFieldError("Falta WhatsApp o teléfono.");
      return;
    }

    if (!cleanService && !cleanMessage) {
      setFieldError("Indica qué servicio necesitas.");
      return;
    }

    const selectedService = cleanService || service || category || "Cotización Casero Cancún";
    const targetWhatsapp = getCaseroWhatsappTarget({ providerWhatsapp, providerPhone });
    const whatsappMessage = buildCaseroWhatsappMessage({
      providerName: businessName,
      service: selectedService,
      zone: cleanZone,
      message: cleanMessage,
    });
    const whatsappUrl = buildCaseroWhatsappUrl({
      targetWhatsapp,
      providerName: businessName,
      service: selectedService,
      zone: cleanZone,
      message: cleanMessage,
    });

    isSubmittingRef.current = true;
    setSubmitState("loading");

    try {
      const result = await sendCaseroRequestToAZC({
        clientName: customerName.trim() || undefined,
        clientWhatsapp: cleanPhone,
        clientPhone: cleanPhone,
        clientEmail: customerEmail.trim() || undefined,
        requestedService: selectedService,
        category: category ?? service,
        zone: cleanZone || undefined,
        city: "Cancún",
        message: cleanMessage || whatsappMessage,
        isUrgent: false,
        requiresInvoice: false,
        source: "casero-frontend",
        campaignCode: "pedir_cotizacion",
        providerId,
        metadata: {
          providerName: businessName,
          providerWhatsapp: targetWhatsapp,
          pageUrl: window.location.href,
          cta: "pedir_cotizacion",
        },
      });

      setSubmitState(result.ok ? "success" : "fallback");
    } catch {
      setSubmitState("fallback");
    } finally {
      window.setTimeout(() => {
        window.location.assign(whatsappUrl);
        isSubmittingRef.current = false;
        setIsOpen(false);
        setSubmitState("idle");
      }, 700);
    }
  }

  return (
    <>
      <Button type="button" variant="primary" className={className} onClick={openModal}>
        <MessageCircle className="h-4 w-4" aria-hidden />
        Pedir cotización
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-casero-dark/50 p-0 sm:items-center sm:p-4">
          <div className="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-lg bg-white shadow-soft sm:max-w-lg sm:rounded-lg">
            <div className="flex items-start justify-between gap-4 border-b border-casero-dark/10 px-4 py-3 sm:px-5">
              <div>
                <h2 className="font-heading text-lg font-extrabold text-casero-dark">Pedir cotización</h2>
                <p className="mt-0.5 text-xs font-semibold text-casero-text/60">{businessName}</p>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={closeModal}
                className="grid h-9 w-9 flex-none place-items-center rounded-md text-casero-text/65 transition hover:bg-casero-background hover:text-casero-dark"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <form className="grid gap-3 overflow-y-auto px-4 py-4 sm:px-5" onSubmit={handleSubmit}>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-bold text-casero-dark">
                  Nombre
                  <input
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    className="min-h-10 rounded-md border border-casero-dark/15 px-3 text-sm font-normal outline-none focus:border-casero-green focus:ring-2 focus:ring-casero-green/20"
                    placeholder="Tu nombre"
                  />
                </label>

                <label className="grid gap-1 text-xs font-bold text-casero-dark">
                  WhatsApp o teléfono
                  <input
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    className="min-h-10 rounded-md border border-casero-dark/15 px-3 text-sm font-normal outline-none focus:border-casero-green focus:ring-2 focus:ring-casero-green/20"
                    inputMode="tel"
                    placeholder="Ej. 998 123 4567"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-xs font-bold text-casero-dark">
                  Servicio
                  <input
                    value={requestedService}
                    onChange={(event) => setRequestedService(event.target.value)}
                    className="min-h-10 rounded-md border border-casero-dark/15 px-3 text-sm font-normal outline-none focus:border-casero-green focus:ring-2 focus:ring-casero-green/20"
                    placeholder="Servicio requerido"
                  />
                </label>

                <label className="grid gap-1 text-xs font-bold text-casero-dark">
                  Zona
                  <input
                    value={requestedZone}
                    onChange={(event) => setRequestedZone(event.target.value)}
                    className="min-h-10 rounded-md border border-casero-dark/15 px-3 text-sm font-normal outline-none focus:border-casero-green focus:ring-2 focus:ring-casero-green/20"
                    placeholder="Zona de Cancún"
                  />
                </label>
              </div>

              <label className="grid gap-1 text-xs font-bold text-casero-dark">
                Email opcional
                <input
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  className="min-h-10 rounded-md border border-casero-dark/15 px-3 text-sm font-normal outline-none focus:border-casero-green focus:ring-2 focus:ring-casero-green/20"
                  inputMode="email"
                  placeholder="correo@ejemplo.com"
                />
              </label>

              <label className="grid gap-1 text-xs font-bold text-casero-dark">
                Mensaje
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="min-h-20 rounded-md border border-casero-dark/15 px-3 py-2 text-sm font-normal outline-none focus:border-casero-green focus:ring-2 focus:ring-casero-green/20"
                  placeholder="Cuéntanos qué necesitas cotizar"
                />
              </label>

              {fieldError ? <p className="rounded-md bg-red-50 p-2.5 text-sm font-semibold text-red-700">{fieldError}</p> : null}
              {statusMessage ? (
                <p className="rounded-md bg-casero-background p-2.5 text-sm font-semibold text-casero-text/75">{statusMessage}</p>
              ) : null}

              <div className="sticky bottom-0 -mx-4 -mb-4 flex flex-col-reverse gap-2 border-t border-casero-dark/10 bg-white px-4 py-3 sm:-mx-5 sm:-mb-4 sm:flex-row sm:justify-end sm:px-5">
                <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmittingRef.current}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmittingRef.current}>
                  {submitState === "loading" ? "Enviando..." : "Continuar a WhatsApp"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}