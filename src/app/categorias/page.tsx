import type { Metadata } from "next";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { VisualLinkCard } from "@/components/public/VisualLinkCard";
import { createPublicMetadata } from "@/lib/seo";

const categorySections = [
  {
    title: "Servicios del hogar",
    description: "Reparaciones, limpieza y mantenimiento.",
    href: "/servicios-del-hogar",
    image: "/images/categories/categoria-servicios-hogar-cover.webp",
    imageAlt: "Servicios del hogar en Cancún",
  },
  {
    title: "Tiendas y materiales",
    description: "Ferreterías, materiales y productos.",
    href: "/tiendas-y-materiales",
    image: "/images/categories/categoria-materiales-cover.webp",
    imageAlt: "Tiendas de materiales y ferreterías locales",
  },
  {
    title: "Mascotas",
    description: "Veterinarias, estética y cuidado.",
    href: "/mascotas",
    image: "/images/categories/categoria-mascotas-cover.webp",
    imageAlt: "Servicios para mascotas en Cancún",
  },
  {
    title: "Servicios para tu auto",
    description: "Mecánicos, lavado, grúas y más.",
    href: "/servicios-para-tu-auto",
    image: "/images/categories/categoria-auto-cover.webp",
    imageAlt: "Servicios automotrices locales",
  },
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

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:gap-5">
          {categorySections.map((section) => (
            <VisualLinkCard key={section.href} {...section} cta="Explorar sección" meta="Casero Cancún" />
          ))}
        </div>
      </div>
    </section>
  );
}