import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { materialCategories } from "@/lib/seed";

export default function StoresPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Tiendas y materiales"
        title="Encuentra materiales, refacciones y tiendas locales"
        description="Categorías para resolver compras de reparación, mantenimiento y mejoras del hogar."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materialCategories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}
