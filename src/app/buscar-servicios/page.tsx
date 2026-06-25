import type { Metadata } from "next";
import { PublicBusinessDirectory } from "@/components/marketplace/PublicBusinessDirectory";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPublishedBusinesses } from "@/lib/data/businesses";
import { categories, locations } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Buscar servicios locales Cancun | Mascotas, auto, tiendas y materiales",
  description:
    "Busca servicios locales Cancun, tiendas y materiales Cancun, mascotas Cancun y servicios automotrices Cancun en un solo directorio.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SearchServicesPage() {
  const businesses = await getPublishedBusinesses();

  return (
    <section className="container-page py-8 sm:py-12">
      <div className="rounded-lg bg-white p-5 shadow-sm md:p-8">
        <SectionHeader
          eyebrow="Directorio local"
          title="Busca negocios publicados en Casero Cancun"
          description="Filtra por texto, seccion, categoria, ubicacion y atributos para encontrar proveedores, tiendas y servicios locales."
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
