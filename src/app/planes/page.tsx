import type { Metadata } from "next";
import { PlanCard } from "@/components/marketplace/PlanCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { plans } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Planes | Casero Cancún para servicios, tiendas, mascotas y auto",
  description:
    "Planes para publicar proveedores de servicios, tiendas y materiales Cancún, negocios de mascotas Cancún, talleres y servicios automotrices Cancún.",
};

export default function PlansPage() {
  return (
    <section className="container-page py-8 sm:py-12">
      <SectionHeader
        eyebrow="Planes"
        title="Publica tu negocio en el directorio local de Cancún"
        description="Planes para proveedores de servicios, tiendas, negocios de mascotas, talleres y servicios automotrices con operación activa."
        align="center"
      />
      <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-casero-orange/25 bg-casero-orange/10 p-4 text-center text-sm font-semibold text-casero-dark">
        Durante la etapa de lanzamiento, los negocios aprobados pueden recibir su primer mes gratis.
      </div>
      <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.slug} plan={plan} />
        ))}
      </div>
      <div className="mt-10 rounded-lg bg-casero-dark p-5 text-center text-white shadow-soft sm:p-8">
        <h2 className="font-heading text-2xl font-extrabold">Ya elegiste un plan?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/72">
          Crea tu cuenta de proveedor y registra tu negocio para administrarlo desde tu panel.
        </p>
        <div className="mt-5 grid gap-3 sm:flex sm:justify-center">
          <Button href="/proveedor/login" variant="primary">
            Crear cuenta de proveedor
          </Button>
          <Button href="/registrar-mi-negocio" variant="outline" className="border-white/25 bg-white text-casero-dark">
            Registrar negocio
          </Button>
        </div>
      </div>
    </section>
  );
}

