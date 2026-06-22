import { BadgeCheck, MapPin, Search, ShieldCheck, Sparkles } from "lucide-react";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { featuredBusinesses, serviceCategories } from "@/lib/seed";

const stats = [
  { label: "Categorías prácticas", value: "27" },
  { label: "Zonas iniciales", value: "17" },
  { label: "Contacto directo", value: "WhatsApp" },
];

const trustItems = [
  {
    icon: BadgeCheck,
    title: "Perfiles verificados",
    text: "Señales claras para distinguir proveedores revisados, destacados y recomendados.",
  },
  {
    icon: MapPin,
    title: "Zonas de atención",
    text: "Encuentra opciones por Cancún Centro, Zona Hotelera, Huayacán y más.",
  },
  {
    icon: ShieldCheck,
    title: "Etiquetas útiles",
    text: "Urgencias, factura, garantía, Airbnb, condominios y respuesta rápida.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-casero-navy/10 bg-white">
        <div className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex rounded-md bg-casero-beige px-3 py-1 text-sm font-bold text-casero-green">
              Directorio local para Cancún
            </span>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-normal text-casero-navy sm:text-5xl lg:text-6xl">
              Resuelve reparaciones, mantenimiento y mejoras del hogar con proveedores locales.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-casero-navy/70">
              Casero Cancún conecta hogares, administradores y anfitriones con servicios,
              tiendas de materiales y refacciones confiables en Cancún.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/buscar-servicios">
                <Search className="h-4 w-4" aria-hidden />
                Buscar proveedores
              </Button>
              <Button href="/registrar-mi-negocio" variant="outline">
                Registrar mi negocio
              </Button>
            </div>
            <dl className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-casero-navy/10 bg-casero-background p-4">
                  <dt className="text-sm text-casero-navy/55">{stat.label}</dt>
                  <dd className="mt-1 text-2xl font-black text-casero-navy">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="rounded-lg bg-casero-navy p-5 text-white shadow-soft">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-white/60">Búsqueda popular</p>
                  <p className="text-xl font-black">Aire acondicionado urgente</p>
                </div>
                <Sparkles className="h-8 w-8 text-casero-orange" aria-hidden />
              </div>
              <div className="mt-5 space-y-3">
                {featuredBusinesses.map((business) => (
                  <div key={business.slug} className="rounded-md bg-white/10 p-4">
                    <p className="font-bold">{business.name}</p>
                    <p className="mt-1 text-sm text-white/65">{business.category} · {business.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeader
          eyebrow="Categorías principales"
          title="Servicios que se buscan todos los días en Cancún"
          description="Una estructura pensada para encontrar rápido al proveedor correcto, sin directorios genéricos ni resultados lejanos."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.slice(0, 6).map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-casero-beige/55 py-16">
        <div className="container-page">
          <SectionHeader
            eyebrow="Confianza local"
            title="Diseñado para decidir con menos fricción"
            description="Los perfiles muestran la información que una persona necesita antes de escribir por WhatsApp."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {trustItems.map((item) => (
              <div key={item.title} className="rounded-lg bg-white p-6 shadow-sm">
                <item.icon className="h-8 w-8 text-casero-green" aria-hidden />
                <h3 className="mt-4 text-lg font-black text-casero-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-casero-navy/65">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeader
          eyebrow="Proveedores destacados"
          title="Primeros perfiles de muestra"
          description="Estos ejemplos anticipan cómo se verán los negocios publicados, con WhatsApp directo y etiquetas claras."
        />
        <div className="mt-8 grid gap-5">
          {featuredBusinesses.map((business) => (
            <BusinessCard key={business.slug} business={business} />
          ))}
        </div>
      </section>
    </>
  );
}
