import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Car, MapPin, MessageCircle, PawPrint, Search, Send, Store, Wrench, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

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

const quickCategories = [
  { label: "Hogar", href: "/servicios-del-hogar", icon: Wrench },
  { label: "Materiales", href: "/tiendas-y-materiales", icon: Store },
  { label: "Mascotas", href: "/mascotas", icon: PawPrint },
  { label: "Auto", href: "/servicios-para-tu-auto", icon: Car },
];

const serviceCards = [
  {
    title: "Plomería rápida",
    image: "/images/hero/casero-hero-plomeria-cocina.png",
    alt: "Plomero reparando una cocina en un hogar local",
    zone: "Cancún",
    text: "Fugas, destapes y reparaciones.",
    badge: "WhatsApp",
    tone: "bg-casero-green text-white",
    featured: true,
  },
  {
    title: "Electricidad y hogar",
    image: "/images/hero/casero-hero-electricista-hogar.png",
    alt: "Electricista trabajando en una instalación del hogar",
    zone: "Cancún",
    text: "Instalaciones y mantenimiento.",
    badge: "A domicilio",
    tone: "bg-casero-turquoise text-white",
  },
  {
    title: "Ferretería y materiales",
    image: "/images/hero/casero-hero-ferreteria-asesoria.png",
    alt: "Asesoría en ferretería local con herramientas y materiales",
    zone: "Puerto Morelos",
    text: "Herramientas y productos.",
    badge: "Abierto",
    tone: "bg-casero-orange text-casero-dark",
  },
];

const miniCards = [
  {
    title: "Veterinaria",
    image: "/images/hero/casero-hero-veterinaria.png",
    alt: "Atención veterinaria para mascotas",
    href: "/buscar-servicios?q=veterinaria",
  },
  {
    title: "Mecánico",
    image: "/images/hero/casero-hero-mecanico-cliente.png",
    alt: "Mecánico atendiendo a un cliente local",
    href: "/buscar-servicios?q=mecanico",
  },
];

function ServicePreviewCard({ card }: { card: (typeof serviceCards)[number] }) {
  return (
    <article className={card.featured ? "overflow-hidden rounded-[1rem] border border-casero-dark/10 bg-white shadow-soft md:row-span-2" : "overflow-hidden rounded-[1rem] border border-casero-dark/10 bg-white shadow-sm"}>
      <div className={card.featured ? "relative aspect-[4/3] bg-casero-beige md:aspect-[5/4]" : "relative aspect-[16/10] bg-casero-beige"}>
        <Image
          src={card.image}
          alt={card.alt}
          fill
          priority={card.featured}
          sizes={card.featured ? "(min-width: 1024px) 28vw, 100vw" : "(min-width: 1024px) 18vw, 100vw"}
          className="object-cover"
        />
        <span className={"absolute left-3 top-3 rounded-md px-2.5 py-1.5 text-xs font-extrabold shadow-sm " + card.tone}>
          {card.badge}
        </span>
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-extrabold leading-tight text-casero-dark">{card.title}</h2>
            <p className="mt-1 text-sm leading-5 text-casero-text/70">{card.text}</p>
          </div>
          <span className="grid h-9 w-9 flex-none place-items-center rounded-md bg-casero-green text-white">
            <MessageCircle className="h-4 w-4" aria-hidden />
          </span>
        </div>
        <p className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-casero-text/60">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {card.zone}
        </p>
      </div>
    </article>
  );
}

export function HomeHero() {
  return (
    <section className="overflow-hidden border-b border-casero-dark/10 bg-casero-background">
      <div className="container-page py-8 sm:py-12 lg:py-14">
        <div className="rounded-[1.5rem] border border-casero-dark/10 bg-white p-4 shadow-soft sm:p-5 lg:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="lg:pr-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-md bg-casero-beige px-3 py-1 text-sm font-bold text-casero-green">
                  Cancún y Riviera Maya
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-casero-green/10 px-3 py-1 text-sm font-bold text-casero-green">
                  <Zap className="h-3.5 w-3.5" aria-hidden />
                  Contacto rápido
                </span>
              </div>

              <h1 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold tracking-normal text-casero-dark sm:text-5xl lg:text-6xl">
                Servicios y negocios locales en un solo lugar
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-casero-text/75 sm:text-lg sm:leading-8">
                Busca proveedores locales, compara opciones y contacta directo por WhatsApp.
              </p>

              <form action="/buscar-servicios" className="mt-6 rounded-[1rem] border border-casero-dark/10 bg-casero-background p-3 shadow-sm sm:p-4">
                <label className="sr-only" htmlFor="home-search">Buscar servicio o negocio</label>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <div className="flex min-h-12 items-center gap-3 rounded-md border border-casero-dark/10 bg-white px-3">
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
                    className="rounded-md bg-casero-beige px-3 py-2 text-sm font-semibold text-casero-dark transition hover:bg-casero-orange/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-orange"
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

              <div className="mt-5 grid gap-2 sm:grid-cols-4">
                {quickCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="flex min-h-12 items-center gap-2 rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm font-extrabold text-casero-dark shadow-sm transition hover:border-casero-green/40 hover:text-casero-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green"
                    >
                      <Icon className="h-4 w-4 text-casero-green" aria-hidden />
                      {category.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.25rem] bg-casero-background p-3 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-casero-text/50">Vista previa del directorio</p>
                  <p className="font-heading text-xl font-extrabold text-casero-dark">Servicios cerca de ti</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {coverageZones.map((zone) => (
                    <Link key={zone.href} href={zone.href} className="rounded-md bg-white px-2.5 py-1.5 text-xs font-bold text-casero-text shadow-sm hover:text-casero-green">
                      {zone.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                <ServicePreviewCard card={serviceCards[0]} />
                <div className="grid gap-3">
                  {serviceCards.slice(1).map((card) => (
                    <ServicePreviewCard key={card.title} card={card} />
                  ))}
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {miniCards.map((card) => (
                  <Link key={card.href} href={card.href} className="flex items-center gap-3 rounded-[1rem] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
                    <div className="relative h-14 w-14 flex-none overflow-hidden rounded-lg bg-casero-beige">
                      <Image src={card.image} alt={card.alt} fill sizes="56px" className="object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-casero-text/50">Ejemplo</p>
                      <p className="font-heading text-base font-extrabold text-casero-dark">{card.title}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <p className="mt-3 text-xs font-semibold leading-5 text-casero-text/55">
                Ejemplos visuales de servicios; no representan negocios reales publicados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
