import type { Metadata } from "next";
import Link from "next/link";
import { Search, Store } from "lucide-react";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { EmptyResultsState } from "@/components/public/EmptyResultsState";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { Button } from "@/components/ui/Button";
import { getPublishedBusinessesByCategory } from "@/lib/data/businesses";
import { categories, type CategorySection } from "@/lib/demo-data";
import { JsonLd, breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/jsonLd";
import { createPublicMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const sectionImages: Record<CategorySection, string> = {
  home_services: "/images/categories/categoria-servicios-hogar-cover.webp",
  stores_materials: "/images/categories/categoria-materiales-cover.webp",
  pets: "/images/categories/categoria-mascotas-cover.webp",
  auto_services: "/images/categories/categoria-auto-cover.webp",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  return createPublicMetadata({
    title: category ? category.name + " en Cancún y Riviera Maya | Casero Cancún" : "Categoría no encontrada | Casero Cancún",
    description: category?.description ?? "Explora proveedores y negocios locales publicados por categoría en Casero Cancún.",
    path: "/categoria/" + slug,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const relatedBusinesses = await getPublishedBusinessesByCategory(category.slug);
  const path = "/categoria/" + category.slug;

  return (
    <section className="bg-casero-background py-6 sm:py-8 lg:py-10">
      <JsonLd
        data={[
          collectionPageJsonLd({
            title: category.name + " en Cancún y Riviera Maya",
            description: category.description,
            path,
            businesses: relatedBusinesses,
          }),
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Categorías", path: "/categorias" },
            { name: category.name, path },
          ]),
        ]}
      />
      <div className="container-page">
        <nav className="mb-5 text-sm font-semibold text-casero-text/55" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-casero-green">Inicio</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/categorias" className="hover:text-casero-green">Categorías</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-casero-dark">{category.name}</span>
        </nav>

        <PublicPageHero
          eyebrow="Categoría"
          title={category.name + " en Cancún y Riviera Maya"}
          description={category.description ?? "Explora proveedores locales publicados y contacta directo por WhatsApp."}
          image={sectionImages[category.section]}
          imageAlt={category.name + " en Casero Cancún"}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button href={`/buscar-servicios?q=${encodeURIComponent(category.name)}`} className="w-full font-extrabold sm:w-auto">
              <Search className="h-4 w-4" aria-hidden />
              Buscar opciones
            </Button>
            <Button href="/registrar-mi-negocio" variant="outline" className="w-full font-extrabold sm:w-auto">
              <Store className="h-4 w-4" aria-hidden />
              Registrar negocio
            </Button>
          </div>
        </PublicPageHero>

        <div className="mt-6 flex flex-col justify-between gap-3 rounded-[1rem] border border-casero-dark/10 bg-white p-4 shadow-sm sm:mt-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-casero-text/50">Negocios publicados</p>
            <h2 className="mt-1 font-heading text-2xl font-extrabold text-casero-dark">Listos para contactar</h2>
          </div>
          <p className="text-sm font-bold text-casero-text/68">{relatedBusinesses.length} proveedores en esta categoría</p>
        </div>

        <div className="mt-5 grid gap-4 sm:gap-5">
          {relatedBusinesses.length > 0 ? (
            relatedBusinesses.map((business) => <BusinessCard key={business.id} business={business} />)
          ) : (
            <EmptyResultsState
              title="Aún no hay negocios publicados en esta categoría"
              description="Puedes intentar otra búsqueda o registrar tu negocio para aparecer en esta sección cuando sea aprobado."
            />
          )}
        </div>
      </div>
    </section>
  );
}