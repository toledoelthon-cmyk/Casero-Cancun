import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, MessageCircle, Sparkles } from "lucide-react";
import { PlanCard } from "@/components/marketplace/PlanCard";
import { TrustStrip } from "@/components/public/TrustStrip";
import { Button } from "@/components/ui/Button";
import { plans } from "@/lib/demo-data";
import { createPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = createPublicMetadata({
  title: "Planes para proveedores en Casero Cancún",
  description:
    "Conoce los planes para publicar tu negocio, tienda o servicio local en Casero Cancún y recibir contactos directos.",
  path: "/planes",
});

const planGuides = [
  { name: "Básico", text: "Para empezar con un perfil visible y contacto directo." },
  { name: "Pro", text: "Para negocios activos que quieren más presencia." },
  { name: "Premium", text: "Para mayor visibilidad en zonas y categorías clave." },
];

export default function PlansPage() {
  return (
    <main className="bg-casero-background">
      <section className="bg-white py-10 sm:py-14 lg:py-16">
        <div className="container-page">
          <div className="mx-auto max-w-5xl rounded-[1.45rem] border border-casero-dark/10 bg-casero-background p-5 text-center shadow-soft sm:p-8 lg:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-casero-green px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden />
              Planes para proveedores
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl font-heading text-4xl font-extrabold leading-tight text-casero-dark sm:text-5xl">Publica tu negocio en Casero Cancún</h1>
            <p className="mx-auto mt-4 max-w-3xl text-base font-semibold leading-7 text-casero-text/72 sm:text-lg">Elige un plan para mostrar tu perfil, tus zonas de atención y tus datos de contacto a clientes que buscan negocios locales.</p>
            <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-casero-orange/35 bg-white px-4 py-3 text-sm font-extrabold text-casero-dark shadow-sm">
              Primer mes gratis para negocios aprobados durante la etapa de lanzamiento.
            </div>
          </div>
          <TrustStrip />
        </div>
      </section>

      <section className="container-page py-10 sm:py-14 lg:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-casero-text/55">Compara opciones</p>
            <h2 className="font-heading text-3xl font-extrabold text-casero-dark">Planes mensuales</h2>
          </div>
          <p className="max-w-xl text-sm font-semibold leading-6 text-casero-text/68">Todos los planes mantienen WhatsApp visible y una ficha pública pensada para que te contacten rápido.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.slug} plan={plan} />
          ))}
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14 lg:py-16">
        <div className="container-page">
          <div className="grid gap-4 rounded-[1.35rem] border border-casero-dark/10 bg-white p-4 shadow-soft md:grid-cols-3 sm:p-5">
            {planGuides.map((guide) => (
              <div key={guide.name} className="rounded-[1rem] bg-casero-background p-5">
                <p className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white font-heading text-lg font-extrabold text-casero-green shadow-sm">{guide.name.charAt(0)}</p>
                <h3 className="mt-4 font-heading text-xl font-extrabold text-casero-dark">{guide.name}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-casero-text/68">{guide.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14 lg:py-16">
        <div className="overflow-hidden rounded-[1.45rem] bg-casero-dark shadow-soft">
          <div className="grid gap-0 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="p-5 text-white sm:p-8 md:p-10">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white ring-1 ring-white/15">
                <BadgeCheck className="h-4 w-4 text-casero-orange" aria-hidden />
                ¿Ya elegiste un plan?
              </p>
              <h2 className="mt-5 max-w-3xl font-heading text-3xl font-extrabold leading-tight sm:text-4xl">Crea tu cuenta y registra tu negocio</h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/74 sm:text-base">Prepara tus datos, elige el plan que más te convenga y empieza a recibir contactos directos por WhatsApp.</p>
            </div>
            <div className="grid gap-3 px-5 pb-5 sm:px-8 sm:pb-8 lg:min-w-[300px] lg:p-10">
              <Button href="/registrar-mi-negocio" variant="primary" className="min-h-14 w-full">
                Registrar negocio <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <Button href="/proveedor/login" variant="outline" className="w-full border-white/25 bg-white text-casero-dark">
                <MessageCircle className="h-4 w-4" aria-hidden />
                Proveedores
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

