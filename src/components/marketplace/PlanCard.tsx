import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SeedPlan } from "@/lib/seed";

type PlanCardProps = {
  plan: SeedPlan;
};

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <article
      className={
        plan.highlighted
          ? "relative rounded-lg border-2 border-casero-green bg-white p-6 shadow-soft"
          : "rounded-lg border border-casero-navy/10 bg-white p-6 shadow-sm"
      }
    >
      {plan.highlighted ? (
        <span className="absolute right-5 top-5 rounded-md bg-casero-green px-3 py-1 text-xs font-bold text-white">
          Más elegido
        </span>
      ) : null}
      <h3 className="text-2xl font-black text-casero-navy">{plan.name}</h3>
      <p className="mt-3 text-sm leading-6 text-casero-navy/65">{plan.summary}</p>
      <div className="mt-6 flex items-end gap-1">
        <span className="text-4xl font-black text-casero-navy">${plan.price}</span>
        <span className="pb-1 text-sm font-semibold text-casero-navy/55">MXN/mes</span>
      </div>
      <ul className="mt-6 space-y-3 text-sm text-casero-navy/75">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <Check className="mt-0.5 h-4 w-4 flex-none text-casero-green" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button href="/registrar-mi-negocio" className="mt-7 w-full" variant={plan.highlighted ? "secondary" : "outline"}>
        Elegir {plan.name}
      </Button>
    </article>
  );
}
