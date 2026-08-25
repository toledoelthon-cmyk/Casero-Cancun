import { Search, Store } from "lucide-react";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { EmptyResultsState } from "@/components/public/EmptyResultsState";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { TrustStrip } from "@/components/public/TrustStrip";
import { Button } from "@/components/ui/Button";
import { getPublishedBusinessesBySection } from "@/lib/data/businesses";
import type { CategorySection, DemoCategory } from "@/lib/demo-data";
import { locations } from "@/lib/demo-data";
import { CATEGORY_VISUALS } from "@/lib/publicVisualAssets";

type SectionBusinessPageProps = {
  section: CategorySection;
  eyebrow: string;
  title: string;
  description: string;
  categories: DemoCategory[];
  selectedLocationSlug?: string;
};

export async function SectionBusinessPage({
  section,
  eyebrow,
  title,
  description,
  categories,
  selectedLocationSlug = "all",
}: SectionBusinessPageProps) {
  const businesses = await getPublishedBusinessesBySection(section);
  const filteredBusinesses =
    selectedLocationSlug === "all"
      ? businesses
      : businesses.filter((business) => business.locationSlugs?.includes(selectedLocationSlug));

  return (
    <section className="bg-casero-background py-6 sm:py-8 lg:py-10">
      <div className="container-page">
        <PublicPageHero eyebrow={eyebrow} title={title} description={description} image={CATEGORY_VISUALS[section].image} imageAlt={CATEGORY_VISUALS[section].imageAlt}>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button href="/buscar-servicios" className="w-full font-extrabold sm:w-auto">
              <Search className="h-4 w-4" aria-hidden />
              Buscar proveedores
            </Button>
            <Button href="/registrar-mi-negocio" variant="outline" className="w-full font-extrabold sm:w-auto">
              <Store className="h-4 w-4" aria-hidden />
              Registrar negocio
            </Button>
          </div>
        </PublicPageHero>
        <TrustStrip />

        <div className="mt-8 sm:mt-10">
          <h2 className="font-heading text-2xl font-extrabold text-casero-dark">Categorías</h2>
          <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>

        <div className="mt-10 sm:mt-12">
          <div className="flex flex-col justify-between gap-4 rounded-[1rem] border border-casero-dark/10 bg-white p-4 shadow-sm md:flex-row md:items-end md:p-5">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-casero-text/50">Negocios publicados</p>
              <h2 className="mt-1 font-heading text-2xl font-extrabold text-casero-dark">Listos para contactar</h2>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-casero-text/68">
                Solo mostramos negocios publicados por el equipo de Casero Cancún.
              </p>
            </div>
            <form className="w-full rounded-xl border border-casero-dark/10 bg-casero-background p-3 md:w-72">
              <label className="text-sm font-bold text-casero-dark" htmlFor="location">
                Filtrar por ubicación
              </label>
              <select
                id="location"
                name="ubicacion"
                defaultValue={selectedLocationSlug}
                className="mt-2 w-full rounded-xl border border-casero-dark/10 bg-white px-3 py-3 text-base font-semibold outline-casero-green md:text-sm"
              >
                <option value="all">Todas las zonas</option>
                {locations.map((location) => (
                  <option key={location.slug} value={location.slug}>
                    {location.name}
                  </option>
                ))}
              </select>
              <button className="mt-2 min-h-11 w-full rounded-xl bg-casero-green px-3 py-2.5 text-sm font-extrabold text-white transition hover:bg-emerald-700" type="submit">
                Filtrar
              </button>
            </form>
          </div>

          <div className="mt-6 grid gap-4 sm:gap-5">
            {filteredBusinesses.length > 0 ? (
              filteredBusinesses.map((business) => <BusinessCard key={business.id} business={business} />)
            ) : (
              <EmptyResultsState
                title="Aún no hay negocios publicados para esta sección y zona"
                description="Puedes intentar otra ubicación o registrar tu negocio para aparecer aquí cuando sea aprobado."
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
