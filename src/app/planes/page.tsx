import { PlanCard } from "@/components/marketplace/PlanCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { plans } from "@/lib/seed";

export default function PlansPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Planes"
        title="Publica tu negocio en el directorio local de Cancún"
        description="Tres planes pensados para proveedores independientes, tiendas de materiales y negocios con operación activa."
        align="center"
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.slug} plan={plan} />
        ))}
      </div>
    </section>
  );
}
