import type { Metadata } from "next";
import { Search, ShieldCheck } from "lucide-react";
import { PublicBusinessDirectory } from "@/components/marketplace/PublicBusinessDirectory";
import { PublicPageHero } from "@/components/public/PublicPageHero";
import { getPublishedBusinesses } from "@/lib/data/businesses";
import { categories, locations } from "@/lib/demo-data";
import { createPublicMetadata } from "@/lib/seo";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata: Metadata = createPublicMetadata({
  title: "Buscar servicios en Cancún y Riviera Maya | Casero Cancún",
  description:
    "Busca proveedores, tiendas de materiales, mascotas y servicios automotrices publicados en Cancún, Puerto Morelos, Playa del Carmen y Tulum.",
  path: "/buscar-servicios",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SearchServicesPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const businesses = await getPublishedBusinesses();

  return (
    <section className="bg-casero-background py-6 sm:py-8 lg:py-10">
      <div className="container-page">
        <PublicPageHero
          eyebrow="Directorio local"
          title="Busca servicios y negocios en Cancún y Riviera Maya"
          description="Encuentra proveedores publicados, filtra por zona o categoría y contacta directo por WhatsApp sin vueltas."
        >
          <form action="/buscar-servicios" className="max-w-2xl rounded-[1.1rem] border border-white/20 bg-white/95 p-3 shadow-soft backdrop-blur-sm">
            <label className="sr-only" htmlFor="hero-search">Buscar servicio o negocio</label>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="flex min-h-14 min-w-0 items-center gap-3 rounded-xl border border-casero-dark/10 bg-casero-background px-4 text-casero-dark">
                <Search className="h-5 w-5 flex-none text-casero-green" aria-hidden />
                <input
                  id="hero-search"
                  name="q"
                  type="search"
                  defaultValue={q ?? ""}
                  placeholder="Plomero, ferretería, veterinaria..."
                  className="w-full min-w-0 bg-transparent text-base font-semibold outline-none placeholder:text-casero-text/48"
                />
              </div>
              <button className="inline-flex min-h-14 items-center justify-center rounded-xl bg-casero-green px-6 text-sm font-extrabold text-white shadow-soft transition hover:bg-emerald-700" type="submit">
                Buscar
              </button>
            </div>
          </form>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-extrabold text-casero-dark">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-casero-green/10 px-3 py-1.5 text-emerald-800 ring-1 ring-casero-green/15">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Publicaciones revisadas
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-casero-dark shadow-sm ring-1 ring-casero-dark/10">WhatsApp visible</span>
            <span className="rounded-full bg-white px-3 py-1.5 text-casero-dark shadow-sm ring-1 ring-casero-dark/10">Proveedores locales</span>
          </div>
        </PublicPageHero>

        <PublicBusinessDirectory
          businesses={businesses}
          categories={categories}
          locations={locations}
          initialQuery={q ?? ""}
          title="Mostrando"
        />
      </div>
    </section>
  );
}