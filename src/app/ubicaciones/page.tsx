import type { Metadata } from "next";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { VisualLinkCard } from "@/components/public/VisualLinkCard";
import { locations } from "@/lib/demo-data";
import { createPublicMetadata } from "@/lib/seo";

const zoneImages: Record<string, string> = {
  cancun: "/images/zones/zona-cancun-card.webp",
  "puerto-morelos": "/images/zones/zona-puerto-morelos-card.webp",
  "playa-del-carmen": "/images/zones/zona-playa-del-carmen-card.webp",
  tulum: "/images/zones/zona-tulum-card.webp",
};

const zoneDescriptions: Record<string, string> = {
  cancun: "Proveedores locales en Cancún.",
  "puerto-morelos": "Servicios disponibles en Puerto Morelos.",
  "playa-del-carmen": "Proveedores en Playa del Carmen.",
  tulum: "Servicios y negocios en Tulum.",
};

const featuredZones = locations.filter((location) => Object.keys(zoneImages).includes(location.slug));

export const metadata: Metadata = createPublicMetadata({
  title: "Zonas y ubicaciones en Cancún | Casero Cancún",
  description:
    "Explora zonas de atención en Cancún para encontrar proveedores, tiendas y servicios locales publicados en Casero Cancún.",
  path: "/ubicaciones",
});

export default function LocationsPage() {
  return (
    <section className="bg-casero-background py-6 sm:py-8 lg:py-10">
      <div className="container-page">
        <PublicPageHero
          eyebrow="Ubicaciones"
          title="Busca proveedores por zona de atención"
          description="Explora negocios locales en Cancún, Puerto Morelos, Playa del Carmen y Tulum con cards claras y contacto directo."
          image="/images/zones/zona-riviera-maya-banner.webp"
          imageAlt="Riviera Maya y zonas de cobertura"
        />

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {featuredZones.map((location) => (
            <VisualLinkCard
              key={location.slug}
              title={location.name}
              description={zoneDescriptions[location.slug]}
              href={`/ubicacion/${location.slug}`}
              image={zoneImages[location.slug]}
              imageAlt={`Zona de cobertura en ${location.name}`}
              cta="Ver proveedores"
              meta="Zona de cobertura"
            />
          ))}
        </div>
      </div>
    </section>
  );
}