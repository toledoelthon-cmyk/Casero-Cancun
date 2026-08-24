import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Car,
  ChevronRight,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Store,
  Wrench,
} from "lucide-react";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { TrustFeatureCard } from "@/components/marketplace/TrustFeatureCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/jsonLd";
import { autoServiceCategories, petCategories, serviceCategories, storeCategories } from "@/lib/demo-data";
import { createPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = createPublicMetadata({
  title: "Servicios y negocios confiables en Cancún y Riviera Maya | Casero Cancún",
  description:
    "Encuentra proveedores locales, tiendas, mascotas y servicios para tu auto en Cancún, Puerto Morelos, Playa del Carmen y Tulum. Contacta directo por WhatsApp.",
  path: "/",
});

const mainSections = [
  {
    title: "Servicios del hogar",
    text: "Reparaciones, limpieza y mantenimiento.",
    href: "/servicios-del-hogar",
    icon: Wrench,
  },
  {
    title: "Tiendas y materiales",
    text: "Ferreterías, materiales y productos.",
    href: "/tiendas-y-materiales",
    icon: Store,
  },
  {
    title: "Mascotas",
    text: "Veterinarias, estética y cuidado.",
    href: "/mascotas",
    icon: HeartHandshake,
  },
  {
    title: "Servicios para tu auto",
    text: "Mecánicos, lavado, grúas y más.",
    href: "/servicios-para-tu-auto",
    icon: Car,
  },
];

const quickSearchLinks = [
  { label: "Plomero", href: "/categoria/plomeria" },
  { label: "Electricista", href: "/categoria/electricidad" },
  { label: "Aire acondicionado", href: "/categoria/aire-acondicionado" },
  { label: "Ferretería", href: "/categoria/ferreterias" },
  { label: "Veterinaria", href: "/categoria/veterinarias" },
  { label: "Mecánico", href: "/categoria/talleres-mecanicos" },
];

const coverageZones = [
  { label: "Cancún", href: "/ubicacion/cancun" },
  { label: "Puerto Morelos", href: "/ubicacion/puerto-morelos" },
  { label: "Playa del Carmen", href: "/ubicacion/playa-del-carmen" },
  { label: "Tulum", href: "/ubicacion/tulum" },
];

const clientSteps = ["Busca lo que necesitas", "Elige un proveedor", "Contacta por WhatsApp"];
const providerSteps = ["Registra tu negocio", "Revisamos tu publicación", "Recibe contactos por WhatsApp"];

const trustFeatures = [
  {
    icon: Wrench,
    title: "Proveedores locales",
    text: "Explora servicios, tiendas y negocios enfocados en Cancún y Riviera Maya.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp directo",
    text: "Pregunta precio, disponibilidad o agenda sin intermediarios.",
  },
  {
    icon: BadgeCheck,
    title: "Publicaciones revisadas",
    text: "Los perfiles publicados pasan por revisión antes de aparecer en el directorio.",
  },
  {
    icon: MapPin,
    title: "Cobertura por zonas",
    text: "Filtra por ciudad o zona de atención para decidir más rápido.",
  },
];

export default function Home() {
  const highlightedServices = serviceCategories.filter((category) =>
    ["aire-acondicionado", "plomeria", "electricidad", "limpieza-del-hogar", "fumigacion", "mantenimiento-airbnb"].includes(
      category.slug,
    ),
  );
  const highlightedStores = storeCategories.filter((category) =>
    ["ferreterias", "material-electrico", "material-de-plomeria", "herramientas"].includes(category.slug),
  );
  const highlightedPets = petCategories.slice(0, 4);
  const highlightedAuto = autoServiceCategories.slice(0, 4);

  return (
    <>
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />

      <section className="border-b border-casero-dark/10 bg-white">
        <div className="container-page grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div>
            <span className="inline-flex rounded-md bg-casero-beige px-3 py-1 text-sm font-bold text-casero-green">
              Cancún y Riviera Maya
            </span>
            <h1 className="mt-4 max-w-4xl font-heading text-3xl font-extrabold tracking-normal text-casero-dark sm:text-5xl lg:text-6xl">
              Encuentra servicios y negocios confiables en Cancún y Riviera Maya
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-casero-text/75 sm:mt-6 sm:text-lg sm:leading-8">
              Busca proveedores locales en Cancún, Puerto Morelos, Playa del Carmen y Tulum. Compara opciones y contacta directo por WhatsApp.
            </p>
            <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <Button href="/buscar-servicios" className="w-full sm:w-auto">
                <Search className="h-4 w-4" aria-hidden />
                Buscar servicio
              </Button>
              <Button href="/registrar-mi-negocio" variant="secondary" className="w-full sm:w-auto">
                Registrar mi negocio
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-casero-dark p-4 text-white shadow-soft sm:p-5">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-white/60">Búsqueda rápida</p>
                <p className="font-heading text-xl font-bold">¿Qué necesitas hoy?</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-casero-orange" aria-hidden />
            </div>
            <Link
              href="/buscar-servicios"
              className="mt-5 flex min-h-12 items-center gap-3 rounded-md bg-white px-4 py-3 text-casero-text shadow-sm transition hover:bg-casero-beige focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-orange"
            >
              <Search className="h-5 w-5 text-casero-green" aria-hidden />
              <span className="font-semibold text-casero-text/55">¿Qué necesitas hoy?</span>
            </Link>
            <div className="mt-4 flex flex-wrap gap-2">
              {quickSearchLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-orange"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="categorias" className="container-page py-10 sm:py-16">
        <SectionHeader
          eyebrow="Explora por área"
          title="Cuatro formas simples de empezar"
          description="Elige el tipo de ayuda que necesitas y ve directo a negocios publicados."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {mainSections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.href}
                href={section.href}
                className="group flex h-full cursor-pointer flex-col rounded-lg border border-casero-dark/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/40 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green"
              >
                <span className="grid h-12 w-12 place-items-center rounded-md bg-casero-beige text-casero-green">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h2 className="mt-5 font-heading text-xl font-extrabold text-casero-dark">{section.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-casero-text/70">{section.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-casero-green">
                  Ver opciones <ChevronRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="zonas" className="bg-casero-beige/55 py-10 sm:py-16">
        <div className="container-page">
          <SectionHeader
            eyebrow="Zonas"
            title="Zonas de cobertura"
            description="Encuentra proveedores y negocios locales en las principales zonas de la Riviera Maya."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {coverageZones.map((zone) => (
              <Link
                key={zone.href}
                href={zone.href}
                className="flex min-h-20 items-center justify-between rounded-lg border border-casero-dark/10 bg-white p-4 font-heading text-lg font-extrabold text-casero-dark shadow-sm transition hover:border-casero-green/40 hover:text-casero-green hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green"
              >
                <span>{zone.label}</span>
                <MapPin className="h-5 w-5 text-casero-orange" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-casero-dark/10 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-2xl font-extrabold text-casero-dark">¿Cómo funciona?</h2>
            <div className="mt-5 grid gap-3">
              {clientSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-md bg-casero-background p-3">
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-casero-green font-heading font-bold text-white">{index + 1}</span>
                  <span className="font-semibold text-casero-dark">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-casero-green/20 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-2xl font-extrabold text-casero-dark">¿Tienes un negocio o prestas servicios?</h2>
            <div className="mt-5 grid gap-3">
              {providerSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-md bg-casero-background p-3">
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-casero-orange font-heading font-bold text-casero-dark">{index + 1}</span>
                  <span className="font-semibold text-casero-dark">{step}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
              <Button href="/registrar-mi-negocio" className="w-full sm:w-auto" variant="primary">
                Registrar mi negocio
              </Button>
              <Button href="/proveedor/login" variant="outline" className="w-full sm:w-auto">
                Proveedores
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-16">
        <div className="container-page">
          <SectionHeader
            eyebrow="Confianza"
            title="Decide rápido y contacta claro"
            description="Información práctica para explorar, comparar y contactar sin perder tiempo."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustFeatures.map((feature) => (
              <TrustFeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-16">
        <SectionHeader eyebrow="Categorías populares" title="Búsquedas frecuentes en Casero Cancún" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...highlightedServices, ...highlightedStores, ...highlightedPets, ...highlightedAuto].map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="container-page py-10 sm:py-16">
        <div className="rounded-lg bg-casero-dark p-5 text-white shadow-soft sm:p-8 md:p-10">
          <p className="font-heading text-2xl font-extrabold sm:text-3xl">Haz que más clientes encuentren tu negocio</p>
          <p className="mt-3 max-w-3xl text-white/70">
            Registra tu servicio, tienda, negocio de mascotas o servicio automotriz en una plataforma local creada para Casero Cancún y Riviera Maya.
          </p>
          <Button href="/registrar-mi-negocio" className="mt-6 w-full sm:w-auto" variant="primary">
            Registrar mi negocio
          </Button>
        </div>
      </section>
    </>
  );
}