import type { Metadata } from "next";
import { BadgeCheck, MapPin, MessageCircle, Search, ShieldCheck, Store, Wrench } from "lucide-react";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { TrustFeatureCard } from "@/components/marketplace/TrustFeatureCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { materialCategories, serviceCategories } from "@/lib/seed";

export const metadata: Metadata = {
  title: "Casero Cancún | Encuentra servicios y soluciones para tu hogar",
  description:
    "Encuentra servicios del hogar, tiendas de materiales y proveedores locales en Cancún con contacto directo por WhatsApp.",
};

const trustFeatures = [
  {
    icon: Wrench,
    title: "Proveedores locales",
    text: "Servicios, técnicos, tiendas y negocios enfocados en Cancún y sus zonas cercanas.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp directo",
    text: "Contacta sin intermediarios para pedir precio, disponibilidad o agendar una visita.",
  },
  {
    icon: MapPin,
    title: "Zonas claras",
    text: "Identifica si atienden Centro, Zona Hotelera, Huayacán, Cumbres, Puerto Cancún y más.",
  },
  {
    icon: BadgeCheck,
    title: "Perfiles revisados",
    text: "La plataforma está preparada para publicar perfiles aprobados y negocios verificados.",
  },
];

const steps = [
  "Busca el servicio",
  "Revisa perfiles y zonas",
  "Contacta por WhatsApp",
  "Agenda directamente con el proveedor",
];

export default function Home() {
  const highlightedServices = serviceCategories.filter((category) =>
    ["aire-acondicionado", "plomeria", "electricidad", "limpieza-del-hogar", "fumigacion", "mantenimiento-airbnb"].includes(
      category.slug,
    ),
  );
  const highlightedStores = materialCategories.filter((category) =>
    [
      "ferreterias",
      "material-electrico",
      "material-de-plomeria",
      "pinturas-e-impermeabilizantes",
      "herramientas",
      "materiales-de-construccion",
    ].includes(category.slug),
  );

  return (
    <>
      <section className="overflow-hidden border-b border-casero-dark/10 bg-white">
        <div className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex rounded-md bg-casero-beige px-3 py-1 text-sm font-bold text-casero-green">
              Directorio local para Cancún
            </span>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl font-extrabold tracking-normal text-casero-dark sm:text-5xl lg:text-6xl">
              Encuentra servicios y soluciones para tu hogar en Cancún
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-casero-text/75">
              Casero Cancún conecta clientes con proveedores locales, tiendas de materiales y
              servicios confiables para el hogar, propiedades y negocios.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/buscar-servicios">
                <Search className="h-4 w-4" aria-hidden />
                Buscar servicios
              </Button>
              <Button href="/registrar-mi-negocio" variant="secondary">
                Registrar mi negocio
              </Button>
              <Button href="/tiendas-y-materiales" variant="outline">
                Ver tiendas y materiales
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-casero-dark p-5 text-white shadow-soft">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-white/60">Búsqueda rápida</p>
                <p className="font-heading text-xl font-bold">Servicios para hogar y propiedades</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-casero-orange" aria-hidden />
            </div>
            <div className="mt-5 grid gap-3">
              {["Aire acondicionado", "Plomería", "Ferreterías", "Mantenimiento Airbnb"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md bg-white/10 p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-white/10">
                    <Store className="h-4 w-4 text-casero-orange" aria-hidden />
                  </span>
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeader
          eyebrow="Confianza"
          title="Una plataforma pensada para decidir rápido y con claridad"
          description="Información práctica para contactar al negocio correcto sin perder tiempo entre resultados genéricos."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustFeatures.map((feature) => (
            <TrustFeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="bg-casero-beige/55 py-16">
        <div className="container-page">
          <SectionHeader
            eyebrow="Categorías destacadas"
            title="Servicios esenciales para hogares, rentas y negocios"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlightedServices.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeader
          eyebrow="Tiendas y materiales"
          title="Compra materiales, herramientas y refacciones en Cancún"
          description="Directorio preparado para ferreterías, materiales eléctricos, plomería, pinturas y construcción."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlightedStores.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeader eyebrow="Cómo funciona" title="De la búsqueda al contacto directo" align="center" />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-lg border border-casero-dark/10 bg-casero-background p-5">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-casero-green font-heading font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-casero-dark">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="rounded-lg bg-casero-dark p-8 text-white shadow-soft md:p-10">
          <p className="font-heading text-3xl font-extrabold">Haz que más clientes encuentren tu negocio</p>
          <p className="mt-3 max-w-3xl text-white/70">
            Registra tu negocio, tienda o servicio y aparece en una plataforma local creada para Cancún.
          </p>
          <Button href="/registrar-mi-negocio" className="mt-6" variant="primary">
            Registrar mi negocio
          </Button>
        </div>
      </section>
    </>
  );
}
