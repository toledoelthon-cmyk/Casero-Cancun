import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { DemoPlan } from "@/lib/demo-data";
import { getManualPaymentLinks } from "@/lib/payments/manual-payment";

type PlanCardProps = {
  plan: DemoPlan;
};

const externalButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

export function PlanCard({ plan }: PlanCardProps) {
  const paymentMessage = `Hola, quiero solicitar información para pagar por CoDi o transferencia el plan ${plan.name} de Casero Cancún.`;
  const manualPayment = getManualPaymentLinks(plan, paymentMessage);
  const hasPremiumAnnualPromotion = plan.slug === "premium";

  return (
    <article
      className={
        plan.highlighted
          ? "relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border-2 border-casero-green bg-white p-6 shadow-soft"
          : "flex h-full flex-col rounded-[1.35rem] border border-casero-dark/10 bg-white p-6 shadow-sm"
      }
    >
      <div className="absolute right-5 top-5 flex flex-col items-end gap-2">
        {plan.highlighted ? (
          <span className="rounded-full bg-casero-green px-3 py-1.5 text-xs font-extrabold text-white shadow-sm">
            Más elegido
          </span>
        ) : null}
        {hasPremiumAnnualPromotion ? (
          <span className="rounded-full bg-casero-orange px-3 py-1.5 text-xs font-extrabold text-casero-dark shadow-sm">
            20% off anual
          </span>
        ) : null}
      </div>
      <p className="pr-28 text-xs font-extrabold uppercase tracking-[0.14em] text-casero-green">Plan mensual</p>
      <h3 className="mt-2 font-heading text-3xl font-extrabold text-casero-dark">{plan.name}</h3>
      <p className="mt-3 min-h-[48px] text-sm font-semibold leading-6 text-casero-text/68">{plan.summary}</p>
      <div className="mt-6 rounded-[1rem] bg-casero-background p-4">
        <div className="flex items-end gap-1">
          <span className="font-heading text-4xl font-extrabold text-casero-dark">${plan.price}</span>
          <span className="pb-1 text-sm font-bold text-casero-text/55">MXN/mes</span>
        </div>
      </div>
      <ul className="mt-6 grid gap-3 text-sm text-casero-text/76">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 rounded-xl bg-white text-sm font-semibold leading-6">
            <Check className="mt-0.5 h-4 w-4 flex-none text-casero-green" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 rounded-2xl border border-casero-dark/10 bg-casero-background px-4 py-3 text-sm font-semibold leading-6 text-casero-text/68">
        Después de realizar tu pago, envíanos el comprobante por WhatsApp para activar tu membresía.
      </p>
      {manualPayment.hasCodiQr ? (
        <p className="mt-2 text-xs font-semibold text-casero-text/55">
          También puedes pagar por CoDi después de registrar tu negocio.
        </p>
      ) : null}
      <div className="mt-auto grid gap-2 pt-5">
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
            Solicitar datos por WhatsApp
          </a>
        )}
      </div>
      <Button href="/registrar-mi-negocio" className="mt-3 w-full rounded-xl font-extrabold" variant={plan.highlighted ? "secondary" : "outline"}>
        Elegir {plan.name}
      </Button>
    </article>
  );
}


