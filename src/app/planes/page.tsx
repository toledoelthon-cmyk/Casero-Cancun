import type { Metadata } from "next";
import { PlanCard } from "@/components/marketplace/PlanCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { plans } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Planes | Casero Cancun para servicios, tiendas, mascotas y auto",
  description:
    "Planes para publicar proveedores de servicios, tiendas y materiales Cancun, negocios de mascotas Cancun, talleres y servicios automotrices Cancun.",
};

export default function PlansPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Planes"
        title="Publica tu negocio en el directorio local de Cancun"
        description="Planes para proveedores de servicios, tiendas, negocios de mascotas, talleres y servicios automotrices con operacion activa."
        align="center"
      />
      <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-casero-orange/25 bg-casero-orange/10 p-4 text-center text-sm font-semibold text-casero-dark">
        Durante la etapa de lanzamiento, los negocios aprobados pueden recibir su primer mes gratis.
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.slug} plan={plan} />
        ))}
      </div>
    </section>
  );
}
