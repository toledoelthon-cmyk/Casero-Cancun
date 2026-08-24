import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartHandshake,
  Home as HomeIcon,
  MapPin,
  MessageCircle,
  Search,
  Send,
  Snowflake,
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
  { title: "Servicios del hogar", text: "Reparaciones, limpieza y mantenimiento.", href: "/servicios-del-hogar", icon: Wrench },
  { title: "Tiendas y materiales", text: "Ferreterías, materiales y productos.", href: "/tiendas-y-materiales", icon: Store },
  { title: "Mascotas", text: "Veterinarias, estética y cuidado.", href: "/mascotas", icon: HeartHandshake },
  { title: "Servicios para tu auto", text: "Mecánicos, lavado, grúas y más.", href: "/servicios-para-tu-auto", icon: Car },
];

const quickSearchLinks = [
  { label: "Plomero", href: "/buscar-servicios?q=plomero" },
  { label: "Electricista", href: "/buscar-servicios?q=electricista" },
  { label: "Aire acondicionado", href: "/buscar-servicios?q=aire%20acondicionado" },
  { label: "Ferretería", href: "/buscar-servicios?q=ferreteria" },
  { label: "Veterinaria", href: "/buscar-servicios?q=veterinaria" },
  { label: "Mecánico", href: "/buscar-servicios?q=mecanico" },
];

const coverageZones = [
  { label: "Cancún", href: "/ubicacion/cancun" },
  { label: "Puerto Morelos", href: "/ubicacion/puerto-morelos" },
  { label: "Playa del Carmen", href: "/ubicacion/playa-del-carmen" },
  { label: "Tulum", href: "/ubicacion/tulum" },
];

const heroBenefits = [
  { label: "Contacto directo por WhatsApp", icon: MessageCircle },
  { label: "Proveedores locales", icon: MapPin },
  { label: "Publicaciones revisadas", icon: BadgeCheck },
];

const previewCards = [
  { name: "Plomero Martínez", category: "Plomería", text: "Destapes, fugas y tinacos.", zone: "Cancún", badge: "Respuesta rápida", icon: Wrench, tone: "green" },
  { name: "Frío Caribe A/C", category: "Aire acondicionado", text: "Instalación y mantenimiento.", zone: "Playa del Carmen", badge: "A domicilio", icon: Snowflake, tone: "turquoise" },
  { name: "Ferretería El Constructor", category: "Materiales", text: "Herramientas, pintura y plomería.", zone: "Puerto Morelos", badge: "Abierto ahora", icon: Store, tone: "orange" },
];

const clientSteps = ["Busca lo que necesitas", "Elige un proveedor", "Contacta por WhatsApp"];
const providerSteps = ["Registra tu negocio", "Revisamos tu publicación", "Recibe contactos por WhatsApp"];

const trustFeatures = [
  { icon: Wrench, title: "Proveedores locales", text: "Explora servicios, tiendas y negocios enfocados en Cancún y Riviera Maya." },
  { icon: MessageCircle, title: "WhatsApp directo", text: "Pregunta precio, disponibilidad o agenda sin intermediarios." },
  { icon: BadgeCheck, title: "Publicaciones revisadas", text: "Los perfiles publicados pasan por revisión antes de aparecer en el directorio." },
  { icon: MapPin, title: "Cobertura por zonas", text: "Filtra por ciudad o zona de atención para decidir más rápido." },
];

const toneClasses: Record<string, string> = {
  green: "bg-casero-green/10 text-casero-green",
  turquoise: "bg-casero-turquoise/10 text-casero-turquoise",
  orange: "bg-casero-orange/15 text-casero-dark",
};

export default function Home() {
  const highlightedServices = serviceCategories.filter((category) =>
    ["aire-acondicionado", "plomeria", "electricidad", "limpieza-del-hogar", "fumigacion", "mantenimiento-airbnb"].includes(category.slug),
  );
  const highlightedStores = storeCategories.filter((category) =>
    ["ferreterias", "material-electrico", "material-de-plomeria", "herramientas"].includes(category.slug),
  );
  const highlightedPets = petCategories.slice(0, 4);
  const highlightedAuto = autoServiceCategories.slice(0, 4);

  return (
    <>
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />

      <section className="overflow-hidden border-b border-casero-dark/10 bg-casero-background">
        <div className="container-page grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
          <div>
            <span className="inline-flex rounded-md bg-white px-3 py-1 text-sm font-bold text-casero-green shadow-sm">Cancún y Riviera Maya</span>
            <h1 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold tracking-normal text-casero-dark sm:text-5xl lg:text-6xl">
              Encuentra servicios confiables cerca de ti
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-casero-text/75 sm:text-lg sm:leading-8">
              Busca proveedores locales en Cancún, Puerto Morelos, Playa del Carmen y Tulum. Compara opciones y contacta directo por WhatsApp.
            </p>

            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <Button href="/buscar-servicios" className="w-full sm:w-auto">
                <Search className="h-4 w-4" aria-hidden />
                Buscar servicio
              </Button>
              <Button href="/registrar-mi-negocio" variant="secondary" className="w-full sm:w-auto">
                Registrar negocio
              </Button>
            </div>

            <form action="/buscar-servicios" className="mt-6 rounded-lg border border-casero-dark/10 bg-white p-4 shadow-sm sm:p-5">
              <label className="font-heading text-lg font-extrabold text-casero-dark" htmlFor="home-search">¿Qué necesitas hoy?</label>
              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="flex min-h-12 items-center gap-3 rounded-md border border-casero-dark/10 bg-casero-background px-3">
                  <Search className="h-5 w-5 text-casero-green" aria-hidden />
                  <input
                    id="home-search"
                    name="q"
                    type="search"
                    aria-label="Buscar servicio o negocio"
                    placeholder="Busca plomero, electricista, veterinaria..."
                    className="w-full bg-transparent text-base outline-none placeholder:text-casero-text/45"
                  />
                </div>
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-casero-green px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casero-green focus-visible:ring-offset-2"
                  type="submit"
                >
                  Buscar
                  <Send className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {quickSearchLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md bg-casero-beige px-3 py-2 text-sm font-semibold text-casero-dark transition hover:bg-casero-orange/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-orange"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </form>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {heroBenefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.label} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-bold text-casero-text shadow-sm">
                    <Icon className="h-4 w-4 text-casero-green" aria-hidden />
                    <span>{benefit.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative rounded-lg border border-casero-dark/10 bg-white p-4 shadow-soft sm:p-5 lg:p-6">
            <div className="absolute right-5 top-5 hidden rounded-md bg-casero-orange px-3 py-2 text-xs font-extrabold text-casero-dark shadow-sm sm:block">
              Vista previa del directorio
            </div>
            <div className="rounded-lg bg-gradient-to-br from-casero-green/12 via-casero-turquoise/10 to-casero-orange/20 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-white text-casero-green shadow-sm">
                  <HomeIcon className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-casero-text/55">Marketplace local</p>
                  <p className="font-heading text-xl font-extrabold text-casero-dark">Servicios listos para contactar</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {previewCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <article key={card.name} className="rounded-lg border border-casero-dark/10 bg-white p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <span className={"grid h-12 w-12 flex-none place-items-center rounded-md " + toneClasses[card.tone]}>
                          <Icon className="h-6 w-6" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-heading text-lg font-extrabold leading-tight text-casero-dark">{card.name}</h2>
                            <span className="rounded-md bg-casero-beige px-2 py-1 text-xs font-bold text-casero-dark">{card.badge}</span>
                          </div>
                          <p className="mt-1 text-sm font-bold text-casero-green">{card.category}</p>
                          <p className="mt-1 text-sm text-casero-text/70">{card.text}</p>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-casero-text/60">
                              <MapPin className="h-3.5 w-3.5" aria-hidden />
                              {card.zone}
                            </span>
                            <span className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-casero-green px-3 py-2 text-xs font-bold text-white">
                              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                              WhatsApp
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="flex items-center gap-2 text-sm font-bold text-casero-dark">
                    <CheckCircle2 className="h-4 w-4 text-casero-green" aria-hidden />
                    Publicaciones revisadas
                  </p>
                  <p className="mt-1 text-xs leading-5 text-casero-text/60">Previews visuales, no negocios publicados.</p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="flex items-center gap-2 text-sm font-bold text-casero-dark">
                    <Clock3 className="h-4 w-4 text-casero-orange" aria-hidden />
                    Contacto rápido
                  </p>
                  <p className="mt-1 text-xs leading-5 text-casero-text/60">Busca, compara y escribe por WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categorias" className="container-page py-10 sm:py-16">
        <SectionHeader eyebrow="Explora por área" title="Cuatro formas simples de empezar" description="Elige el tipo de ayuda que necesitas y ve directo a negocios publicados." />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {mainSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href} className="group flex h-full cursor-pointer flex-col rounded-lg border border-casero-dark/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/40 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green">
                <span className="grid h-12 w-12 place-items-center rounded-md bg-casero-beige text-casero-green"><Icon className="h-6 w-6" aria-hidden /></span>
                <h2 className="mt-5 font-heading text-xl font-extrabold text-casero-dark">{section.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-casero-text/70">{section.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-casero-green">Ver opciones <ChevronRight className="h-4 w-4" aria-hidden /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="zonas" className="bg-casero-beige/55 py-10 sm:py-16">
        <div className="container-page">
          <SectionHeader eyebrow="Zonas" title="Zonas de cobertura" description="Encuentra proveedores locales en Cancún y Riviera Maya." />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {coverageZones.map((zone) => (
              <Link key={zone.href} href={zone.href} className="flex min-h-20 items-center justify-between rounded-lg border border-casero-dark/10 bg-white p-4 font-heading text-lg font-extrabold text-casero-dark shadow-sm transition hover:border-casero-green/40 hover:text-casero-green hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green">
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
                <div key={step} className="flex items-center gap-3 rounded-md bg-casero-background p-3"><span className="grid h-9 w-9 place-items-center rounded-md bg-casero-green font-heading font-bold text-white">{index + 1}</span><span className="font-semibold text-casero-dark">{step}</span></div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-casero-green/20 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-heading text-2xl font-extrabold text-casero-dark">¿Tienes un negocio o prestas servicios?</h2>
            <div className="mt-5 grid gap-3">
              {providerSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-md bg-casero-background p-3"><span className="grid h-9 w-9 place-items-center rounded-md bg-casero-orange font-heading font-bold text-casero-dark">{index + 1}</span><span className="font-semibold text-casero-dark">{step}</span></div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
              <Button href="/registrar-mi-negocio" className="w-full sm:w-auto" variant="primary">Registrar mi negocio</Button>
              <Button href="/proveedor/login" variant="outline" className="w-full sm:w-auto">Proveedores</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-16">
        <div className="container-page">
          <SectionHeader eyebrow="Confianza" title="Decide rápido y contacta claro" description="Información práctica para explorar, comparar y contactar sin perder tiempo." />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{trustFeatures.map((feature) => <TrustFeatureCard key={feature.title} {...feature} />)}</div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-16">
        <SectionHeader eyebrow="Categorías populares" title="Búsquedas frecuentes en Casero Cancún" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[...highlightedServices, ...highlightedStores, ...highlightedPets, ...highlightedAuto].map((category) => <CategoryCard key={category.slug} category={category} />)}</div>
      </section>

      <section className="container-page py-10 sm:py-16">
        <div className="rounded-lg bg-casero-dark p-5 text-white shadow-soft sm:p-8 md:p-10">
          <p className="font-heading text-2xl font-extrabold sm:text-3xl">Haz que más clientes encuentren tu negocio</p>
          <p className="mt-3 max-w-3xl text-white/70">Registra tu servicio, tienda, negocio de mascotas o servicio automotriz en una plataforma local creada para Casero Cancún y Riviera Maya.</p>
          <Button href="/registrar-mi-negocio" className="mt-6 w-full sm:w-auto" variant="primary">Registrar mi negocio</Button>
        </div>
      </section>
    </>
  );
}
