import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { materialCategories, serviceCategories } from "@/lib/seed";

export default function CategoriesPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Categorías"
        title="Busca por tipo de solución"
        description="Servicios, mantenimiento, reparaciones, tiendas de materiales y refacciones locales."
      />

      <div className="mt-10">
        <h3 className="text-xl font-black text-casero-navy">Servicios para el hogar</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-black text-casero-navy">Tiendas y materiales</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materialCategories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
