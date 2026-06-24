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
    <section className="container-page py-12">
      <div className="rounded-lg bg-white p-6 shadow-sm md:p-8">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-xl font-bold text-casero-dark">Categorias</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Negocios publicados"
            title="Listos para contactar"
            description="Solo mostramos negocios publicados por el equipo de Casero Cancun."
          />
          <form className="w-full md:w-72">
            <label className="text-sm font-bold text-casero-dark" htmlFor="location">
              Filtrar por ubicacion
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

        <div className="mt-6 grid gap-5">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => <BusinessCard key={business.id} business={business} />)
          ) : (
            <Card>
              <p className="text-sm leading-7 text-casero-text/70">
                Proximamente habra negocios publicados para esta seccion y zona.
              </p>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-10 rounded-lg bg-casero-dark p-6 text-white shadow-soft md:p-8">
        <h2 className="font-heading text-2xl font-extrabold">Registra tu negocio en esta seccion</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
          Aparece en Casero Cancun para que clientes locales encuentren tu negocio y te contacten directo por WhatsApp.
        </p>
        <Button href="/registrar-mi-negocio" className="mt-5" variant="primary">
          Registrar negocio
        </Button>
      </div>
    </section>
  );
}
