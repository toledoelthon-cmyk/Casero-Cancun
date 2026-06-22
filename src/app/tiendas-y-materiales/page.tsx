import type { Metadata } from "next";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPublishedBusinesses } from "@/lib/data/businesses";
import { storeCategories } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Tiendas y materiales | Casero Cancún",
  description: "Encuentra ferreterías, materiales, herramientas y refacciones para el hogar en Cancún.",
};

export default async function StoresPage() {
  const businesses = await getPublishedBusinesses();
  const materialStores = businesses.filter((business) => business.profileType === "material_store");

  return (
    <section className="container-page py-12">
      <div className="rounded-lg bg-white p-6 shadow-sm md:p-8">
        <SectionHeader
          eyebrow="Tiendas y materiales"
          title="Tiendas y materiales en Cancún"
          description="Explora categorías y negocios demo para comprar herramientas, materiales, refacciones y productos para mantenimiento."
        />
      </div>

      <div className="mt-10">
        <h3 className="font-heading text-xl font-bold text-casero-dark">Categorías de tiendas</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {storeCategories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <SectionHeader
          eyebrow="Negocios demo"
          title="Tiendas listas para contactar por WhatsApp"
          description="Ejemplos de cómo se mostrarán las ferreterías y proveedores de materiales cuando el directorio esté conectado."
        />
        <div className="mt-6 grid gap-5">
          {materialStores.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      </div>
    </section>
  );
}
