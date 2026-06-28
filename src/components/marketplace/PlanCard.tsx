import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { DemoPlan } from "@/lib/demo-data";
import { getManualPaymentLinks } from "@/lib/payments/manual-payment";

type PlanCardProps = {
  plan: DemoPlan;
};

const externalButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

export function PlanCard({ plan }: PlanCardProps) {
  const paymentMessage = `Hola, quiero solicitar información para pagar por CoDi o transferencia el plan ${plan.name} de Casero Cancún.`;
  const manualPayment = getManualPaymentLinks(plan, paymentMessage);

  return (
    <article
      className={
        plan.highlighted
          ? "relative rounded-lg border-2 border-casero-green bg-white p-6 shadow-soft"
          : "rounded-lg border border-casero-dark/10 bg-white p-6 shadow-sm"
      }
    >
      {plan.highlighted ? (
        <span className="absolute right-5 top-5 rounded-md bg-casero-green px-3 py-1 text-xs font-bold text-white">
          Más elegido
        </span>
      ) : null}
      <h3 className="font-heading text-2xl font-extrabold text-casero-dark">{plan.name}</h3>
      <p className="mt-3 text-sm leading-6 text-casero-text/65">{plan.summary}</p>
      <div className="mt-6 flex items-end gap-1">
        <span className="font-heading text-4xl font-extrabold text-casero-dark">${plan.price}</span>
        <span className="pb-1 text-sm font-semibold text-casero-text/55">MXN/mes</span>
      </div>
      <ul className="mt-6 space-y-3 text-sm text-casero-text/75">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <Check className="mt-0.5 h-4 w-4 flex-none text-casero-green" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm leading-6 text-casero-text/65">
        Después de realizar tu pago, envíanos el comprobante por WhatsApp para activar tu membresía.
      </p>
      {manualPayment.hasCodiQr ? (
        <p className="mt-2 text-xs font-semibold text-casero-text/55">
          También puedes pagar por CoDi después de registrar tu negocio.
        </p>
      ) : null}
      <div className="mt-4 grid gap-2">
        {manualPayment.paymentUrl ? (
          <>
            <a className={`${externalButtonClass} bg-casero-orange text-casero-dark shadow-soft hover:bg-amber-400`} href={manualPayment.paymentUrl} target="_blank" rel="noreferrer">
              Pagar con Mercado Pago
            </a>
            <a className={`${externalButtonClass} border border-casero-dark/15 bg-white text-casero-dark hover:border-casero-green hover:text-casero-green`} href={manualPayment.whatsappUrl} target="_blank" rel="noreferrer">
              Enviar comprobante por WhatsApp
            </a>
          </>
        ) : (
          <a className={`${externalButtonClass} bg-casero-green text-white shadow-soft hover:bg-emerald-700`} href={manualPayment.whatsappUrl} target="_blank" rel="noreferrer">
            {manualPayment.paymentUrl ? manualPayment.label : "Solicitar datos por WhatsApp"}
          </a>
        )}
      </div>
      <Button href="/registrar-mi-negocio" className="mt-4 w-full" variant={plan.highlighted ? "secondary" : "outline"}>
        Elegir {plan.name}
      </Button>
    </article>
  );
}


