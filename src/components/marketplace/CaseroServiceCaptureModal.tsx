"use client";

import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, MessageCircle, X } from "lucide-react";
import {
  buildCaseroRequestPayload,
  buildCaseroWhatsAppMessage,
  openWhatsApp,
  sendCaseroRequestToAZC,
  type CaseroRequestUrgency,
} from "@/lib/azcCasero";

type CaseroServiceCaptureModalProps = {
  open: boolean;
  onClose: () => void;
  phone: string;
  defaultService?: string;
  defaultMessage?: string;
  category?: string;
  providerName?: string;
  serviceUrl?: string;
};

type Status = "idle" | "success" | "error";

const fieldClass =
  "mt-1.5 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-3 text-sm text-casero-dark outline-casero-green placeholder:text-casero-text/40";

const actionClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70";

export function CaseroServiceCaptureModal({
  open,
  onClose,
  phone,
  defaultService = "",
  defaultMessage = "Hola, quiero solicitar un servicio en Casero Cancun.",
  category,
  providerName,
  serviceUrl,
}: CaseroServiceCaptureModalProps) {
  const whatsappOpenedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [service, setService] = useState(defaultService);
  const [zone, setZone] = useState("");
  const [urgency, setUrgency] = useState<CaseroRequestUrgency>("normal");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      whatsappOpenedRef.current = false;
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    whatsappOpenedRef.current = false;
    setService(defaultService);
    setStatus("idle");
    setValidationError("");

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [defaultService, onClose, open, submitting]);

  if (!open || !mounted) {
    return null;
  }

  function getServiceUrl() {
    return serviceUrl || (typeof window !== "undefined" ? window.location.href : undefined);
  }

  function getWhatsAppMessage() {
    return service.trim() && zone.trim()
      ? buildCaseroWhatsAppMessage({ service, zone, urgency })
      : defaultMessage;
  }

  function handleOpenWhatsApp(event?: MouseEvent<HTMLButtonElement>) {
    event?.preventDefault();
    event?.stopPropagation();

    if (whatsappOpenedRef.current) {
      return;
    }

    whatsappOpenedRef.current = true;
    openWhatsApp(phone, getWhatsAppMessage());

    window.setTimeout(() => {
      whatsappOpenedRef.current = false;
    }, 1500);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (submitting || status === "success") {
      return;
    }

    if (!name.trim() || !clientPhone.trim() || !service.trim() || !zone.trim()) {
      setValidationError("Agrega un WhatsApp o telefono para poder dar seguimiento e indica que servicio necesitas.");
      return;
    }

    setSubmitting(true);
    setStatus("idle");
    setValidationError("");

    const payload = buildCaseroRequestPayload({
      name,
      phone: clientPhone,
      service,
      zone,
      urgency,
      description,
      category,
      providerName,
      serviceUrl: getServiceUrl(),
      cta: "pedir_cotizacion",
    });

    try {
      await sendCaseroRequestToAZC(payload);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  const hasSubmitted = status === "success" || status === "error";

  const modal = (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-casero-dark/60 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="casero-service-capture-title"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mx-auto flex min-h-full max-w-xl items-center justify-center">
        <div className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-lg bg-white shadow-soft" onClick={(event) => event.stopPropagation()}>
          <div className="flex flex-none items-start justify-between gap-4 border-b border-casero-dark/10 p-5">
            <div className="min-w-0 pr-2">
              <h2 id="casero-service-capture-title" className="font-heading text-2xl font-extrabold text-casero-dark">
                Pedir cotizacion
              </h2>
              {providerName ? (
                <p className="mt-1 text-sm font-semibold text-casero-text/60">Proveedor: {providerName}</p>
              ) : null}
            </div>
            <button
              className="grid h-10 w-10 flex-none place-items-center rounded-md text-casero-text/55 transition hover:bg-casero-background hover:text-casero-dark"
              type="button"
              onClick={onClose}
              disabled={submitting}
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()}>
            <div className="grid max-h-[calc(90vh-180px)] min-h-0 flex-1 gap-4 overflow-y-auto p-5 pb-6">
              {status === "success" ? (
                <p className="flex items-start gap-2 rounded-md bg-casero-green/10 p-3 text-sm font-semibold text-casero-green">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" aria-hidden />
                  Tu solicitud se registro correctamente. Ahora puedes continuar por WhatsApp.
                </p>
              ) : null}

              {status === "error" ? (
                <p className="flex items-start gap-2 rounded-md bg-casero-orange/15 p-3 text-sm font-semibold text-casero-dark">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-casero-orange" aria-hidden />
                  No pudimos registrar la solicitud, pero puedes continuar por WhatsApp.
                </p>
              ) : null}

              {validationError ? (
                <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{validationError}</p>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-bold text-casero-dark">
                  Nombre *
                  <input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
                </label>
                <label className="text-sm font-bold text-casero-dark">
                  WhatsApp *
                  <input className={fieldClass} value={clientPhone} onChange={(event) => setClientPhone(event.target.value)} inputMode="tel" autoComplete="tel" />
                </label>
              </div>

              <label className="text-sm font-bold text-casero-dark">
                Servicio requerido *
                <input className={fieldClass} value={service} onChange={(event) => setService(event.target.value)} />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-bold text-casero-dark">
                  Zona o colonia *
                  <input className={fieldClass} value={zone} onChange={(event) => setZone(event.target.value)} />
                </label>
                <label className="text-sm font-bold text-casero-dark">
                  Urgencia
                  <select className={fieldClass} value={urgency} onChange={(event) => setUrgency(event.target.value as CaseroRequestUrgency)}>
                    <option value="normal">normal</option>
                    <option value="alta">alta</option>
                    <option value="urgente">urgente</option>
                  </select>
                </label>
              </div>

              <label className="text-sm font-bold text-casero-dark">
                Descripcion opcional
                <textarea
                  className={`${fieldClass} min-h-24 resize-y`}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </label>

              <p className="text-xs leading-5 text-casero-text/60">
                Al enviar tus datos aceptas que podamos contactarte para dar seguimiento a tu solicitud conforme a nuestro Aviso de Privacidad.
              </p>
            </div>

            <div className="grid flex-none gap-2 border-t border-casero-dark/10 bg-white p-5 sm:grid-cols-[1fr_1.25fr]">
              {hasSubmitted ? (
                <button
                  className={`${actionClass} bg-casero-green text-white shadow-soft hover:bg-emerald-700 focus-visible:ring-casero-green sm:col-start-2`}
                  type="button"
                  onClick={handleOpenWhatsApp}
                  disabled={submitting}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Abrir WhatsApp
                </button>
              ) : (
                <>
                  <button
                    className={`${actionClass} border border-casero-dark/15 bg-white text-casero-dark hover:border-casero-green hover:text-casero-green focus-visible:ring-casero-turquoise`}
                    type="button"
                    onClick={handleOpenWhatsApp}
                    disabled={submitting}
                  >
                    Continuar por WhatsApp
                  </button>
                  <button
                    className={`${actionClass} bg-casero-green text-white shadow-soft hover:bg-emerald-700 focus-visible:ring-casero-green disabled:bg-casero-green/70`}
                    type="submit"
                    disabled={submitting}
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    {submitting ? "Enviando solicitud..." : "Enviar solicitud"}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}