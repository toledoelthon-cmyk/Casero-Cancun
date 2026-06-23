import type { Metadata } from "next";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { autoServiceCategories, petCategories, serviceCategories, storeCategories } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Categorías | Casero Cancún",
  description: "Explora categorías de servicios, mantenimiento, reparaciones, tiendas y materiales en Cancún.",
};

export default function CategoriesPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Categorías"
        title="Busca por tipo de solución"
        description="Cada categoría enlazará a su página de resultados cuando conectemos la base de datos."
      />

      {[
        ["Servicios del hogar", serviceCategories],
        ["Tiendas y materiales", storeCategories],
        ["Mascotas", petCategories],
        ["Servicios para tu auto", autoServiceCategories],
      ].map(([title, items]) => (
        <div key={title as string} className="mt-10">
          <h3 className="font-heading text-xl font-bold text-casero-dark">{title as string}</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(items as typeof serviceCategories).map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
