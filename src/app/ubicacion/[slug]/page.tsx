import type { Metadata } from "next";
import Link from "next/link";
import { Search, Store } from "lucide-react";
import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { EmptyResultsState } from "@/components/public/EmptyResultsState";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getPublishedBusinessesByLocation } from "@/lib/data/businesses";
import { locations } from "@/lib/demo-data";
import { JsonLd, breadcrumbJsonLd, collectionPageJsonLd, locationPlaceJsonLd } from "@/lib/jsonLd";
import { createPublicMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const zoneImages: Record<string, string> = {
  cancun: "/images/zones/zona-cancun-card.webp",
  "puerto-morelos": "/images/zones/zona-puerto-morelos-card.webp",
  "playa-del-carmen": "/images/zones/zona-playa-del-carmen-card.webp",
  tulum: "/images/zones/zona-tulum-card.webp",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = locations.find((item) => item.slug === slug);

  return createPublicMetadata({
    title: location ? "Servicios en " + location.name + " | Casero Cancún" : "Ubicación no encontrada | Casero Cancún",
    description: location
      ? "Negocios publicados que atienden " + location.name + " en Casero Cancún."
      : "Explora negocios locales por zona de atención en Cancún y Riviera Maya.",
    path: "/ubicacion/" + slug,
  });
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = locations.find((item) => item.slug === slug);

  if (!location) {
    notFound();
  }

  const relatedBusinesses = await getPublishedBusinessesByLocation(location.slug);
  const availableCategories = Array.from(
    new Set(relatedBusinesses.flatMap((business) => business.categories ?? [business.category])),
  );
  const path = "/ubicacion/" + location.slug;
  const heroImage = zoneImages[location.slug] ?? "/images/zones/zona-riviera-maya-banner.webp";

  return (
    <section className="bg-casero-background py-6 sm:py-8 lg:py-10">
      <JsonLd
        data={[
          collectionPageJsonLd({
            title: "Servicios en " + location.name,
            description: "Negocios publicados que atienden " + location.name + " en Casero Cancún.",
            path,
            businesses: relatedBusinesses,
          }),
          locationPlaceJsonLd(location),
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Ubicaciones", path: "/ubicaciones" },
            { name: location.name, path },
          ]),
        ]}
      />
      <div className="container-page">
        <nav className="mb-5 text-sm font-semibold text-casero-text/55" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-casero-green">Inicio</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/ubicaciones" className="hover:text-casero-green">Ubicaciones</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-casero-dark">{location.name}</span>
        </nav>

        <PublicPageHero
          eyebrow="Ubicación"
          title={"Servicios y negocios en " + location.name}
          description={"Encuentra proveedores locales publicados que atienden " + location.name + " y contacta directo por WhatsApp."}
          image={heroImage}
          imageAlt={"Zona de cobertura en " + location.name}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button href={`/buscar-servicios?q=${encodeURIComponent(location.name)}`} className="w-full font-extrabold sm:w-auto">
              <Search className="h-4 w-4" aria-hidden />
              Buscar proveedores
            </Button>
            <Button href="/registrar-mi-negocio" variant="outline" className="w-full font-extrabold sm:w-auto">
              <Store className="h-4 w-4" aria-hidden />
              Registrar negocio
            </Button>
          </div>
        </PublicPageHero>

        {availableCategories.length > 0 ? (
          <Card className="mt-6 p-5 sm:mt-8 sm:p-6">
            <h2 className="font-heading text-xl font-extrabold text-casero-dark">Categorías disponibles en esta zona</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <span key={category} className="rounded-full bg-casero-beige px-3 py-1.5 text-xs font-extrabold text-casero-dark">
                  {category}
                </span>
              ))}
            </div>
          </Card>
        ) : null}

        <div className="mt-6 flex flex-col justify-between gap-3 rounded-[1rem] border border-casero-dark/10 bg-white p-4 shadow-sm sm:mt-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-casero-text/50">Proveedores por zona</p>
            <h2 className="mt-1 font-heading text-2xl font-extrabold text-casero-dark">Negocios que atienden {location.name}</h2>
          </div>
          <p className="text-sm font-bold text-casero-text/68">{relatedBusinesses.length} negocios publicados</p>
        </div>

        <div className="mt-5 grid gap-4 sm:gap-5">
          {relatedBusinesses.length > 0 ? (
            relatedBusinesses.map((business) => <BusinessCard key={business.id} business={business} />)
          ) : (
            <EmptyResultsState
              title="Aún no hay negocios publicados en esta zona"
              description={`Puedes intentar buscar otra zona o registrar tu negocio para aparecer en ${location.name} cuando sea aprobado.`}
            />
          )}
        </div>
      </div>
    </section>
  );
}