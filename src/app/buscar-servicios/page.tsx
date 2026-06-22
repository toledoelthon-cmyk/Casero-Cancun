import type { Metadata } from "next";
import { Filter, Search } from "lucide-react";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { demoBusinesses, locations, serviceCategories } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Buscar servicios | Casero Cancún",
  description: "Busca proveedores de servicios del hogar, mantenimiento y reparaciones en Cancún.",
};

const tags = ["Verificado", "Atiende Airbnb", "Factura", "Urgencias", "Garantía"];
const serviceProviders = demoBusinesses.filter((business) => business.profileType === "service_provider");

export default function SearchServicesPage() {
  return (
    <section className="container-page py-12">
      <div className="rounded-lg bg-white p-6 shadow-sm md:p-8">
        <SectionHeader
          eyebrow="Buscar servicios"
          title="Busca servicios del hogar en Cancún"
          description="Explora proveedores demo para reparaciones, mantenimiento, limpieza y soluciones para propiedades. Los filtros son visuales por ahora."
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="space-y-4">
          <Card>
            <div className="flex items-center gap-2 text-sm font-bold text-casero-dark">
              <Filter className="h-4 w-4" aria-hidden />
              Filtros
            </div>
            <label className="mt-5 block text-sm font-bold text-casero-dark">Palabra clave</label>
            <div className="mt-2 flex items-center gap-2 rounded-md border border-casero-dark/10 bg-casero-background px-3 py-2">
              <Search className="h-4 w-4 text-casero-text/45" aria-hidden />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-casero-text/40"
                placeholder="Plomería, limpieza..."
              />
            </div>

            <label className="mt-5 block text-sm font-bold text-casero-dark">Categoría</label>
            <select className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm">
              <option>Todas las categorías</option>
              {serviceCategories.map((category) => (
                <option key={category.slug}>{category.name}</option>
              ))}
            </select>

            <label className="mt-5 block text-sm font-bold text-casero-dark">Ubicación</label>
            <select className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm">
              <option>Todas las zonas</option>
              {locations.map((location) => (
                <option key={location.slug}>{location.name}</option>
              ))}
            </select>

            <div className="mt-5">
              <p className="text-sm font-bold text-casero-dark">Etiquetas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    className="rounded-md border border-casero-dark/10 bg-white px-3 py-1.5 text-xs font-semibold text-casero-text/70"
                    type="button"
                  >
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
          <div className="flex flex-col justify-between gap-3 rounded-lg border border-casero-dark/10 bg-white p-4 sm:flex-row sm:items-center">
            <p className="text-sm text-casero-text/65">
              Mostrando <strong className="text-casero-dark">{serviceProviders.length} proveedores demo</strong>
            </p>
            <select className="rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm">
              <option>Orden recomendado</option>
              <option>Verificados primero</option>
              <option>Mejor calificación</option>
            </select>
          </div>

          <div className="grid gap-5">
            {serviceProviders.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
