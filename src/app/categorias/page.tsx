import type { Metadata } from "next";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { autoServiceCategories, petCategories, serviceCategories, storeCategories } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Categorías | Servicios locales Cancún, mascotas, auto, tiendas y materiales",
  description:
    "Explora categorías de servicios locales Cancún, tiendas y materiales Cancún, mascotas Cancún y servicios automotrices Cancún.",
};

export default function CategoriesPage() {
  return (
    <section className="container-page py-8 sm:py-12">
      <SectionHeader
        eyebrow="Categorías"
        title="Busca por tipo de solucion"
        description="Explora las cuatro secciones principales de Casero Cancún y entra a resultados por categoría."
      />

      {[
        ["Servicios del hogar", serviceCategories],
        ["Tiendas y materiales", storeCategories],
        ["Mascotas", petCategories],
        ["Servicios para tu auto", autoServiceCategories],
      ].map(([title, items]) => (
        <div key={title as string} className="mt-8 sm:mt-10">
          <h2 className="font-heading text-xl font-extrabold text-casero-dark sm:text-2xl">{title as string}</h2>
          <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {(items as typeof serviceCategories).map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
