"use client";

import { FormEvent, useMemo, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { sendCaseroRequestToAZC } from "@/lib/azcCasero";
import { buildCaseroWhatsappMessage, buildCaseroWhatsappUrl } from "@/lib/casero-leads";
import { Button } from "@/components/ui/Button";

type CaseroServiceCaptureModalProps = {
  businessName: string;
  service?: string;
  zone?: string;
  providerId?: string;
  providerWhatsapp?: string;
  className?: string;
};

type SubmitState = "idle" | "loading" | "success" | "fallback";

export function CaseroServiceCaptureModal({
  businessName,
  service,
  zone,
  providerId,
  providerWhatsapp,
  className,
}: CaseroServiceCaptureModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [requestedService, setRequestedService] = useState(service ?? "");
  const [requestedZone, setRequestedZone] = useState(zone ?? "");
  const [message, setMessage] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

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
  }

  function openModal() {
    resetModalState();
    setIsOpen(true);
  }

  function closeModal() {
    if (submitState === "loading") {
      return;
    }

    setIsOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError("");

    const cleanPhone = customerPhone.trim();
    const cleanService = requestedService.trim();
    const cleanMessage = message.trim();

    if (!cleanPhone) {
      setFieldError("Falta WhatsApp o teléfono.");
      return;
    }

    if (!cleanService && !cleanMessage) {
      setFieldError("Indica qué servicio necesitas.");
      return;
    }

    const whatsappMessage = buildCaseroWhatsappMessage({
      service: cleanService || service,
      zone: requestedZone,
      message: cleanMessage,
    });
    const whatsappUrl = buildCaseroWhatsappUrl(providerWhatsapp, whatsappMessage);

    setSubmitState("loading");

    try {
      const result = await sendCaseroRequestToAZC({
        customerName: customerName.trim() || undefined,
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        message: cleanMessage || whatsappMessage,
        service: cleanService || service || "Cotización Casero Cancún",
        zone: requestedZone.trim() || undefined,
        providerId,
        providerName: businessName,
        providerWhatsapp,
        source: "casero_business_profile",
      });

      setSubmitState(result.ok ? "success" : "fallback");
    } catch {
      setSubmitState("fallback");
    } finally {
      window.setTimeout(() => {
        window.location.assign(whatsappUrl);
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
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-lg bg-white p-5 shadow-soft sm:max-w-lg sm:rounded-lg sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-extrabold text-casero-dark">Pedir cotización</h2>
                <p className="mt-1 text-sm text-casero-text/65">{businessName}</p>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={closeModal}
                className="grid h-10 w-10 flex-none place-items-center rounded-md text-casero-text/65 transition hover:bg-casero-background hover:text-casero-dark"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-1 text-sm font-semibold text-casero-dark">
                Nombre
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className="min-h-11 rounded-md border border-casero-dark/15 px-3 text-sm font-normal outline-none focus:border-casero-green focus:ring-2 focus:ring-casero-green/20"
                  placeholder="Tu nombre"
                />
              </label>

              <label className="grid gap-1 text-sm font-semibold text-casero-dark">
                WhatsApp o teléfono
                <input
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  className="min-h-11 rounded-md border border-casero-dark/15 px-3 text-sm font-normal outline-none focus:border-casero-green focus:ring-2 focus:ring-casero-green/20"
                  inputMode="tel"
                  placeholder="Ej. 998 123 4567"
                />
              </label>

              <label className="grid gap-1 text-sm font-semibold text-casero-dark">
                Email opcional
                <input
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  className="min-h-11 rounded-md border border-casero-dark/15 px-3 text-sm font-normal outline-none focus:border-casero-green focus:ring-2 focus:ring-casero-green/20"
                  inputMode="email"
                  placeholder="correo@ejemplo.com"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-semibold text-casero-dark">
                  Servicio
                  <input
                    value={requestedService}
                    onChange={(event) => setRequestedService(event.target.value)}
                    className="min-h-11 rounded-md border border-casero-dark/15 px-3 text-sm font-normal outline-none focus:border-casero-green focus:ring-2 focus:ring-casero-green/20"
                    placeholder="Servicio requerido"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-casero-dark">
                  Zona
                  <input
                    value={requestedZone}
                    onChange={(event) => setRequestedZone(event.target.value)}
                    className="min-h-11 rounded-md border border-casero-dark/15 px-3 text-sm font-normal outline-none focus:border-casero-green focus:ring-2 focus:ring-casero-green/20"
                    placeholder="Zona de Cancún"
                  />
                </label>
              </div>

              <label className="grid gap-1 text-sm font-semibold text-casero-dark">
                Mensaje
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="min-h-28 rounded-md border border-casero-dark/15 px-3 py-2 text-sm font-normal outline-none focus:border-casero-green focus:ring-2 focus:ring-casero-green/20"
                  placeholder="Cuéntanos qué necesitas cotizar"
                />
              </label>

              {fieldError ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{fieldError}</p> : null}
              {statusMessage ? (
                <p className="rounded-md bg-casero-background p-3 text-sm font-semibold text-casero-text/75">{statusMessage}</p>
              ) : null}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={closeModal} disabled={submitState === "loading"}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitState === "loading"}>
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
