import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPublishedBusinessesBySection } from "@/lib/data/businesses";
import type { CategorySection, DemoCategory } from "@/lib/demo-data";
import { locations } from "@/lib/demo-data";

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
    <section className="container-page py-8 sm:py-12">
      <div className="rounded-lg bg-white p-5 shadow-sm md:p-8">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      </div>

      <div className="mt-8 sm:mt-10">
        <h2 className="font-heading text-xl font-bold text-casero-dark">Categorías</h2>
        <div className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>

      <div className="mt-10 sm:mt-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Negocios publicados"
            title="Listos para contactar"
            description="Solo mostramos negocios publicados por el equipo de Casero Cancún."
          />
          <form className="w-full rounded-lg border border-casero-dark/10 bg-white p-4 shadow-sm md:w-72">
            <label className="text-sm font-bold text-casero-dark" htmlFor="location">
              Filtrar por ubicación
            </label>
            <select
              id="location"
              name="ubicacion"
              defaultValue={selectedLocationSlug}
              className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 text-sm outline-casero-green"
            >
              <option value="all">Todas las zonas</option>
              {locations.map((location) => (
                <option key={location.slug} value={location.slug}>
                  {location.name}
                </option>
              ))}
            </select>
            <button className="mt-2 w-full rounded-md bg-casero-green px-3 py-2 text-sm font-bold text-white" type="submit">
              Filtrar
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-4 sm:gap-5">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => <BusinessCard key={business.id} business={business} />)
          ) : (
            <Card>
              <p className="text-sm leading-7 text-casero-text/70">
                Próximamente habrá negocios publicados para esta sección y zona.
              </p>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-10 rounded-lg bg-casero-dark p-5 text-white shadow-soft md:p-8">
        <h2 className="font-heading text-xl font-extrabold sm:text-2xl">Registra tu negocio en esta sección</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
          Aparece en Casero Cancún para que clientes locales encuentren tu negocio y te contacten directo por WhatsApp.
        </p>
        <Button href="/registrar-mi-negocio" className="mt-5 w-full sm:w-auto" variant="primary">
          Registrar negocio
        </Button>
      </div>
    </section>
  );
}
