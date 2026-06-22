import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getBusinessesByCategory } from "@/lib/data/businesses";
import { categories } from "@/lib/demo-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  return {
    title: category ? `${category.name} | Casero Cancún` : "Categoría no encontrada | Casero Cancún",
    description: category?.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const relatedBusinesses = await getBusinessesByCategory(category.slug);

  return (
    <section className="container-page py-12">
      <SectionHeader eyebrow="Categoría" title={category.name} description={category.description} />

      <div className="mt-8 grid gap-5">
        {relatedBusinesses.length > 0 ? (
          relatedBusinesses.map((business) => <BusinessCard key={business.id} business={business} />)
        ) : (
          <Card>
            <p className="text-sm leading-7 text-casero-text/70">
              Próximamente habrá proveedores disponibles en esta categoría.
            </p>
          </Card>
        )}
      </div>

      <div className="mt-8 rounded-lg bg-casero-dark p-6 text-white">
        <h2 className="font-heading text-2xl font-bold">¿Ofreces este servicio? Registra tu negocio.</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Aparece en Casero Cancún y permite que clientes locales te contacten directo por WhatsApp.
        </p>
        <Button href="/registrar-mi-negocio" className="mt-5">
          Registrar mi negocio
        </Button>
      </div>
    </section>
  );
}
