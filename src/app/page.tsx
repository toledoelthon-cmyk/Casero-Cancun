import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Car,
  ChevronRight,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Search,
  Send,
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
  { label: "WhatsApp directo", icon: MessageCircle },
  { label: "Proveedores locales", icon: MapPin },
  { label: "Publicaciones revisadas", icon: BadgeCheck },
];

const previewCards = [
  {
    title: "Plomería rápida",
    image: "/images/hero/casero-hero-plomeria-cocina.png",
    alt: "Plomero reparando una cocina en un hogar local",
    zone: "Cancún",
    text: "Fugas, destapes y reparaciones.",
    badge: "WhatsApp",
    tone: "green",
  },
  {
    title: "Electricidad y hogar",
    image: "/images/hero/casero-hero-electricista-hogar.png",
    alt: "Electricista trabajando en una instalación del hogar",
    zone: "Cancún",
    text: "Instalaciones y mantenimiento.",
    badge: "A domicilio",
    tone: "turquoise",
  },
  {
    title: "Ferretería y materiales",
    image: "/images/hero/casero-hero-ferreteria-asesoria.png",
    alt: "Asesoría en ferretería local con herramientas y materiales",
    zone: "Puerto Morelos",
    text: "Herramientas y productos.",
    badge: "Abierto",
    tone: "orange",
  },
];

const miniPreviews = [
  {
    label: "Veterinaria",
    image: "/images/hero/casero-hero-veterinaria.png",
    alt: "Atención veterinaria para mascotas",
  },
  {
    label: "Mecánico",
    image: "/images/hero/casero-hero-mecanico-cliente.png",
    alt: "Mecánico atendiendo a un cliente local",
  },
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
  green: "bg-casero-green text-white",
  turquoise: "bg-casero-turquoise text-white",
  orange: "bg-casero-orange text-casero-dark",
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
        <div className="container-page grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-[0.92fr_1.08fr] lg:py-14">
          <div>
            <span className="inline-flex rounded-md bg-white px-3 py-1 text-sm font-bold text-casero-green shadow-sm">
              Cancún y Riviera Maya
            </span>
            <h1 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold tracking-normal text-casero-dark sm:text-5xl lg:text-6xl">
              Encuentra quien te ayude hoy
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-casero-text/75 sm:text-lg sm:leading-8">
              Servicios, tiendas y negocios locales en Cancún, Puerto Morelos, Playa del Carmen y Tulum.
            </p>

            <form action="/buscar-servicios" className="mt-6 rounded-lg border border-casero-dark/10 bg-white p-4 shadow-sm sm:p-5">
              <label className="sr-only" htmlFor="home-search">Buscar servicio o negocio</label>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="flex min-h-13 items-center gap-3 rounded-md border border-casero-dark/10 bg-casero-background px-3 py-1">
                  <Search className="h-5 w-5 flex-none text-casero-green" aria-hidden />
                  <input
                    id="home-search"
                    name="q"
                    type="search"
                    aria-label="Buscar servicio o negocio"
                    placeholder="Busca plomero, electricista, veterinaria..."
                    className="min-h-11 w-full bg-transparent text-base outline-none placeholder:text-casero-text/45"
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
            </form>

            <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap">
              <Button href="/buscar-servicios" className="w-full sm:w-auto">
                <Search className="h-4 w-4" aria-hidden />
                Buscar servicio
              </Button>
              <Button href="/registrar-mi-negocio" variant="secondary" className="w-full sm:w-auto">
                Registrar negocio
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickSearchLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-casero-dark shadow-sm transition hover:bg-casero-orange/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-orange"
                >
                  {item.label}
                </Link>
              ))}
            </div>

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

          <div className="rounded-[1.25rem] border border-casero-dark/10 bg-white p-3 shadow-soft sm:p-4 lg:p-5">
            <div className="relative overflow-hidden rounded-[1rem] bg-casero-dark text-white">
              <div className="relative aspect-[4/3] min-h-[24rem] sm:aspect-[16/11] lg:min-h-[34rem]">
                <Image
                  src="/images/hero/casero-hero-plomeria-cocina.png"
                  alt="Plomero trabajando en una cocina para un servicio local"
                  fill
                  priority
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-casero-dark/82 via-casero-dark/20 to-transparent" />
                <div className="absolute left-4 top-4 rounded-md bg-white/92 px-3 py-2 text-xs font-extrabold text-casero-dark shadow-sm sm:left-5 sm:top-5">
                  Vista previa del directorio
                </div>

                <div className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5">
                  <div className="rounded-[1rem] bg-white/95 p-3 text-casero-dark shadow-soft backdrop-blur sm:p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative h-16 w-16 flex-none overflow-hidden rounded-lg bg-casero-beige sm:h-20 sm:w-20">
                        <Image
                          src="/images/hero/casero-hero-plomeria-cocina.png"
                          alt="Ejemplo visual de servicio de plomería"
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-heading text-lg font-extrabold leading-tight text-casero-dark">Plomería rápida</h2>
                          <span className="rounded-md bg-casero-green px-2 py-1 text-xs font-bold text-white">WhatsApp</span>
                        </div>
                        <p className="mt-1 text-sm text-casero-text/70">Fugas, destapes y reparaciones.</p>
                        <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-casero-text/60">
                          <MapPin className="h-3.5 w-3.5" aria-hidden />
                          Cancún
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {previewCards.slice(1).map((card) => (
                <article key={card.title} className="rounded-[1rem] border border-casero-dark/10 bg-white p-3 shadow-sm">
                  <div className="flex gap-3">
                    <div className="relative h-20 w-20 flex-none overflow-hidden rounded-lg bg-casero-beige">
                      <Image src={card.image} alt={card.alt} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <span className={"rounded-md px-2 py-1 text-xs font-bold " + toneClasses[card.tone]}>{card.badge}</span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-casero-text/55"><MapPin className="h-3 w-3" aria-hidden />{card.zone}</span>
                      </div>
                      <h2 className="mt-2 font-heading text-base font-extrabold leading-tight text-casero-dark">{card.title}</h2>
                      <p className="mt-1 text-sm leading-5 text-casero-text/65">{card.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {miniPreviews.map((preview) => (
                <div key={preview.label} className="flex items-center gap-3 rounded-[1rem] bg-casero-beige/70 p-3">
                  <div className="relative h-14 w-14 flex-none overflow-hidden rounded-lg bg-white">
                    <Image src={preview.image} alt={preview.alt} fill sizes="56px" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-casero-text/50">Ejemplo</p>
                    <p className="font-heading text-base font-extrabold text-casero-dark">{preview.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs font-semibold leading-5 text-casero-text/55">
              Ejemplos de servicios: estas tarjetas son visuales y no representan negocios reales publicados.
            </p>
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
