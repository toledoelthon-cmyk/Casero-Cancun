import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { demoBusinesses, locations } from "@/lib/demo-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = locations.find((item) => item.slug === slug);

  return {
    title: location ? `${location.name} | Casero Cancún` : "Ubicación no encontrada | Casero Cancún",
    description: location ? `Negocios demo que atienden ${location.name} en Casero Cancún.` : undefined,
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = locations.find((item) => item.slug === slug);

  if (!location) {
    notFound();
  }

  const relatedBusinesses = demoBusinesses.filter((business) => business.location === location.name);

  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Ubicación"
        title={location.name}
        description="Negocios demo relacionados con esta zona de atención."
      />

      <div className="mt-8 grid gap-5">
        {relatedBusinesses.length > 0 ? (
          relatedBusinesses.map((business) => <BusinessCard key={business.id} business={business} />)
        ) : (
          <Card>
            <p className="text-sm leading-7 text-casero-text/70">
              Próximamente habrá proveedores disponibles en esta zona.
            </p>
          </Card>
        )}
      </div>

      <div className="mt-8 rounded-lg bg-casero-dark p-6 text-white">
        <h2 className="font-heading text-2xl font-bold">Registra tu negocio en esta zona.</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Ayuda a que más clientes de {location.name} encuentren tu servicio, tienda o proveedor local.
        </p>
        <Button href="/registrar-mi-negocio" className="mt-5">
          Registrar mi negocio
        </Button>
      </div>
    </section>
  );
}
