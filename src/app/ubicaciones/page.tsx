import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { locations } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Ubicaciones | Casero Cancún",
  description: "Explora zonas de atención para servicios, tiendas y proveedores locales en Cancún.",
};

export default function LocationsPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Ubicaciones"
        title="Busca proveedores por zona de atención"
        description="Tarjetas demo para explorar negocios por zona dentro de Cancún y alrededores."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <Link
            key={location.slug}
            href={`/ubicacion/${location.slug}`}
            className="group flex items-center justify-between gap-4 rounded-lg border border-casero-dark/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/40 hover:shadow-soft"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 flex-none place-items-center rounded-md bg-casero-beige text-casero-green">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-heading font-bold text-casero-dark">{location.name}</span>
                <span className="mt-1 block text-xs font-semibold text-casero-text/55">/{location.slug}</span>
              </span>
            </span>
            <ArrowRight className="h-5 w-5 flex-none text-casero-dark/35 transition group-hover:translate-x-1 group-hover:text-casero-green" />
          </Link>
        ))}
      </div>
    </section>
  );
}
