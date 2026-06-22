import { Filter, Search } from "lucide-react";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories, featuredBusinesses, locations } from "@/lib/seed";

const tags = ["Urgencias", "Factura", "Airbnb", "Zona Hotelera", "Garantía", "24/7"];

export default function SearchServicesPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Buscar servicios"
        title="Encuentra proveedores y tiendas locales"
        description="Filtros visuales preparados para conectarse con Supabase en el siguiente paso."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="space-y-4">
          <Card>
            <div className="flex items-center gap-2 text-sm font-black text-casero-navy">
              <Filter className="h-4 w-4" aria-hidden />
              Filtros
            </div>
            <label className="mt-5 block text-sm font-bold text-casero-navy">Buscar</label>
            <div className="mt-2 flex items-center gap-2 rounded-md border border-casero-navy/10 bg-casero-background px-3 py-2">
              <Search className="h-4 w-4 text-casero-navy/45" aria-hidden />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-casero-navy/40"
                placeholder="Plomería, ferretería..."
              />
            </div>
            <label className="mt-5 block text-sm font-bold text-casero-navy">Categoría</label>
            <select className="mt-2 w-full rounded-md border border-casero-navy/10 bg-white px-3 py-2 text-sm">
              <option>Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.slug}>{category.name}</option>
              ))}
            </select>
            <label className="mt-5 block text-sm font-bold text-casero-navy">Ubicación</label>
            <select className="mt-2 w-full rounded-md border border-casero-navy/10 bg-white px-3 py-2 text-sm">
              <option>Todas las zonas</option>
              {locations.map((location) => (
                <option key={location.slug}>{location.name}</option>
              ))}
            </select>
            <div className="mt-5">
              <p className="text-sm font-bold text-casero-navy">Etiquetas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button key={tag} className="rounded-md border border-casero-navy/10 bg-white px-3 py-1.5 text-xs font-semibold text-casero-navy/70" type="button">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <Button className="mt-6 w-full" variant="secondary">
              Aplicar filtros
            </Button>
          </Card>
        </aside>

        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-3 rounded-lg border border-casero-navy/10 bg-white p-4 sm:flex-row sm:items-center">
            <p className="text-sm text-casero-navy/65">
              Mostrando <strong className="text-casero-navy">3 perfiles de muestra</strong>
            </p>
            <select className="rounded-md border border-casero-navy/10 bg-white px-3 py-2 text-sm">
              <option>Orden recomendado</option>
              <option>Verificados primero</option>
              <option>Respuesta rápida</option>
            </select>
          </div>
          {featuredBusinesses.map((business) => (
            <BusinessCard key={business.slug} business={business} />
          ))}
        </div>
      </div>
    </section>
  );
}
