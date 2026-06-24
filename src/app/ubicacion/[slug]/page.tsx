import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPublishedBusinessesByLocation } from "@/lib/data/businesses";
import { locations } from "@/lib/demo-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = locations.find((item) => item.slug === slug);

  return {
    title: location ? `${location.name} | Casero Cancun` : "Ubicacion no encontrada | Casero Cancun",
    description: location ? `Negocios publicados que atienden ${location.name} en Casero Cancun.` : undefined,
  };
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = locations.find((item) => item.slug === slug);

  if (!location) {
    notFound();
  }

  const relatedBusinesses = await getPublishedBusinessesByLocation(location.slug);
  const availableCategories = Array.from(
    new Set(relatedBusinesses.flatMap((business) => business.categories ?? [business.category])),
  );

  return (
    <section className="container-page py-8 sm:py-12">
      <SectionHeader
        eyebrow="Ubicacion"
        title={location.name}
        description="Negocios publicados que atienden esta zona."
      />

      {availableCategories.length > 0 ? (
        <Card className="mt-6 p-5 sm:mt-8 sm:p-6">
          <h2 className="font-heading text-xl font-bold text-casero-dark">Categorias disponibles en esta zona</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <span key={category} className="rounded-md bg-casero-beige px-3 py-1.5 text-xs font-bold text-casero-dark">
                {category}
              </span>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5">
        {relatedBusinesses.length > 0 ? (
          relatedBusinesses.map((business) => <BusinessCard key={business.id} business={business} />)
        ) : (
          <Card className="p-5 sm:p-6">
            <p className="text-sm leading-7 text-casero-text/70">
              Proximamente habra proveedores disponibles en esta zona.
            </p>
          </Card>
        )}
      </div>

      <div className="mt-8 rounded-lg bg-casero-dark p-5 text-white sm:p-6">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">Registra tu negocio en esta zona.</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Ayuda a que mas clientes de {location.name} encuentren tu servicio, tienda o proveedor local.
        </p>
        <Button href="/registrar-mi-negocio" className="mt-5 w-full sm:w-auto">
          Registrar mi negocio
        </Button>
      </div>
    </section>
  );
}
