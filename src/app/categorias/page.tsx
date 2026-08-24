import type { Metadata } from "next";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { TrustStrip } from "@/components/public/TrustStrip";
import { VisualLinkCard } from "@/components/public/VisualLinkCard";
import { CATEGORY_VISUALS } from "@/lib/publicVisualAssets";
import { createPublicMetadata } from "@/lib/seo";

const categorySections = [
  CATEGORY_VISUALS.home_services,
  CATEGORY_VISUALS.stores_materials,
  CATEGORY_VISUALS.pets,
  CATEGORY_VISUALS.auto_services,
];

export const metadata: Metadata = createPublicMetadata({
  title: "Categorías de servicios locales en Cancún | Casero Cancún",
  description:
    "Explora categorías de servicios del hogar, tiendas de materiales, mascotas y servicios para auto disponibles en Casero Cancún.",
  path: "/categorias",
});

export default function CategoriesPage() {
  return (
    <section className="bg-casero-background py-6 sm:py-8 lg:py-10">
      <div className="container-page">
        <PublicPageHero
          eyebrow="Categorías"
          title="Explora soluciones locales por tipo de necesidad"
          description="Cuatro secciones claras para encontrar proveedores, tiendas y servicios publicados en Cancún y Riviera Maya."
        />
        <TrustStrip />

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:gap-5">
          {categorySections.map((section) => (
            <VisualLinkCard key={section.href} {...section} cta="Explorar sección" meta="Casero Cancún" iconAlt="" />
          ))}
        </div>
      </div>
    </section>
  );
}