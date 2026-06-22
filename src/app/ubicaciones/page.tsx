import Link from "next/link";
import { MapPin } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { locations } from "@/lib/seed";

export default function LocationsPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Ubicaciones"
        title="Busca proveedores por zona de atención"
        description="Casero Cancún está pensado para búsquedas hiperlocales dentro de Cancún y alrededores."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <Link
            key={location.slug}
            href={`/ubicacion/${location.slug}`}
            className="flex items-center gap-3 rounded-lg border border-casero-navy/10 bg-white p-5 shadow-sm transition hover:border-casero-green/40 hover:shadow-soft"
          >
            <span className="grid h-10 w-10 place-items-center rounded-md bg-casero-beige text-casero-green">
              <MapPin className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-bold text-casero-navy">{location.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
