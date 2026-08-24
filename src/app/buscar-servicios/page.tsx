import type { Metadata } from "next";
import { PublicBusinessDirectory } from "@/components/marketplace/PublicBusinessDirectory";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPublishedBusinesses } from "@/lib/data/businesses";
import { categories, locations } from "@/lib/demo-data";
import { createPublicMetadata } from "@/lib/seo";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata: Metadata = createPublicMetadata({
  title: "Buscar servicios en Cancún y Riviera Maya | Casero Cancún",
  description:
    "Busca proveedores, tiendas de materiales, mascotas y servicios automotrices publicados en Cancún, Puerto Morelos, Playa del Carmen y Tulum.",
  path: "/buscar-servicios",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SearchServicesPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const businesses = await getPublishedBusinesses();

  return (
    <section className="container-page py-8 sm:py-12">
      <div className="rounded-lg bg-white p-5 shadow-sm md:p-8">
        <SectionHeader
          eyebrow="Directorio local"
          title="Busca servicios y negocios en Casero Cancún"
          description="Filtra por texto, área, categoría, zona y atributos para encontrar opciones locales sin leer de más."
          level={1}
        />
      </div>

      <PublicBusinessDirectory
        businesses={businesses}
        categories={categories}
        locations={locations}
        initialQuery={q ?? ""}
        title="Mostrando"
      />
    </section>
  );
}