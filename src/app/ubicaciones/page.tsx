import type { Metadata } from "next";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { TrustStrip } from "@/components/public/TrustStrip";
import { VisualLinkCard } from "@/components/public/VisualLinkCard";
import { locations } from "@/lib/demo-data";
import { RIVIERA_MAYA_BANNER, ZONE_VISUALS } from "@/lib/publicVisualAssets";
import { createPublicMetadata } from "@/lib/seo";

const featuredZones = locations.filter((location) => location.slug in ZONE_VISUALS);

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
          image={RIVIERA_MAYA_BANNER}
          imageAlt="Riviera Maya y zonas de cobertura"
        />
        <TrustStrip />

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {featuredZones.map((location) => {
            const zone = ZONE_VISUALS[location.slug as keyof typeof ZONE_VISUALS];

            return (
              <VisualLinkCard
                key={location.slug}
                title={zone.title}
                description={zone.description}
                href={`/ubicacion/${location.slug}`}
                image={zone.image}
                imageAlt={zone.imageAlt}
                cta="Ver proveedores"
                meta="Zona de cobertura"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}