import type { Metadata } from "next";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { autoServiceCategories, petCategories, serviceCategories, storeCategories } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Categorias | Servicios locales Cancun, mascotas, auto, tiendas y materiales",
  description:
    "Explora categorias de servicios locales Cancun, tiendas y materiales Cancun, mascotas Cancun y servicios automotrices Cancun.",
};

export default function CategoriesPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Categorias"
        title="Busca por tipo de solucion"
        description="Explora las cuatro secciones principales de Casero Cancun y entra a resultados por categoria."
      />

      {[
        ["Servicios del hogar", serviceCategories],
        ["Tiendas y materiales", storeCategories],
        ["Mascotas", petCategories],
        ["Servicios para tu auto", autoServiceCategories],
      ].map(([title, items]) => (
        <div key={title as string} className="mt-10">
          <h2 className="font-heading text-2xl font-extrabold text-casero-dark">{title as string}</h2>
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
