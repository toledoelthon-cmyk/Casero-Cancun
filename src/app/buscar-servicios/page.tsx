import type { Metadata } from "next";
import { PublicBusinessDirectory } from "@/components/marketplace/PublicBusinessDirectory";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPublishedBusinesses } from "@/lib/data/businesses";
import { categories, locations } from "@/lib/demo-data";
import { createPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = createPublicMetadata({
  title: "Buscar servicios locales en Cancún | Casero Cancún",
  description:
    "Busca proveedores, tiendas de materiales, servicios para mascotas y servicios automotrices publicados en Cancún.",
  path: "/buscar-servicios",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SearchServicesPage() {
  const businesses = await getPublishedBusinesses();

  return (
    <section className="container-page py-8 sm:py-12">
      <div className="rounded-lg bg-white p-5 shadow-sm md:p-8">
        <SectionHeader
          eyebrow="Directorio local"
          title="Busca negocios publicados en Casero Cancún"
          description="Filtra por texto, sección, categoría, ubicación y atributos para encontrar proveedores, tiendas y servicios locales."
          level={1}
        />
      </div>

      <PublicBusinessDirectory
        businesses={businesses}
        categories={categories}
        locations={locations}
        title="Mostrando"
      />
    </section>
  );
}
