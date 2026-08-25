import { BadgePercent, MessageCircle, Sparkles } from "lucide-react";
import { contact } from "@/lib/contact";

const premiumAnnualMessage =
  "Hola, quiero información sobre la promoción del 20% de descuento en el Plan Premium anual de Casero Cancún.";

export const premiumAnnualDiscountWhatsappUrl = `https://wa.me/${contact.whatsappLinkNumber}?text=${encodeURIComponent(
  premiumAnnualMessage,
)}`;

export function PremiumAnnualDiscountBanner() {
  return (
    <section className="overflow-hidden rounded-[1.45rem] border border-casero-orange/30 bg-casero-dark shadow-soft">
      <div className="grid gap-0 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="relative p-5 text-white sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-casero-green/32 via-transparent to-casero-orange/28" aria-hidden />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full bg-casero-orange px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-casero-dark shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden />
              Promoción exclusiva Premium
            </p>
            <h2 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              20% de descuento en Plan Premium pagando un año
            </h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-white/78 sm:text-base">
              Contrata el Plan Premium anual y ahorra mientras das mayor visibilidad a tu negocio en Casero Cancún.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-extrabold text-white ring-1 ring-white/15">
              <BadgePercent className="h-4 w-4 text-casero-orange" aria-hidden />
              Promoción exclusiva para el Plan Premium anual.
            </p>
          </div>
        </div>
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 lg:min-w-[320px] lg:p-8">
          <a
            href={premiumAnnualDiscountWhatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-casero-orange px-6 py-3 text-center text-base font-extrabold text-casero-dark shadow-soft transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casero-orange focus-visible:ring-offset-2"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            Solicitar promoción Premium
          </a>
        </div>
      </div>
    </section>
  );
}
