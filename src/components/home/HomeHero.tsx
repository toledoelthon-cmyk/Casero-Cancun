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
  if (card.featured) {
    return (
      <article className="overflow-hidden rounded-[1.15rem] border border-casero-dark/10 bg-white shadow-soft">
        <div className="relative min-h-[250px] overflow-hidden bg-casero-beige sm:min-h-[300px] lg:min-h-[330px]">
          <Image
            src={card.image}
            alt={card.alt}
            fill
            priority
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-casero-dark/88 via-casero-dark/44 to-transparent p-4 pt-16 text-white">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className={"rounded-md px-2.5 py-1.5 text-xs font-extrabold shadow-sm " + card.tone}>
                {card.badge}
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-casero-green text-white shadow-soft">
                <MessageCircle className="h-4 w-4" aria-hidden />
              </span>
            </div>
            <h2 className="font-heading text-2xl font-extrabold leading-tight">{card.title}</h2>
            <p className="mt-1 max-w-sm text-sm font-medium leading-5 text-white/82">{card.text}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-white/78">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {card.zone}
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="grid overflow-hidden rounded-[1rem] border border-casero-dark/10 bg-white shadow-sm sm:grid-cols-[132px_1fr] lg:grid-cols-1 xl:grid-cols-[132px_1fr]">
      <div className="relative min-h-[130px] bg-casero-beige sm:min-h-full lg:min-h-[150px] xl:min-h-full">
        <Image
          src={card.image}
          alt={card.alt}
          fill
          sizes="(min-width: 1280px) 132px, (min-width: 1024px) 22vw, 100vw"
          className="object-cover"
        />
        <span className={"absolute left-2.5 top-2.5 rounded-md px-2 py-1 text-[11px] font-extrabold shadow-sm " + card.tone}>
          {card.badge}
        </span>
      </div>
      <div className="flex min-h-[130px] flex-col justify-between p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-heading text-base font-extrabold leading-tight text-casero-dark sm:text-lg lg:text-base xl:text-lg">{card.title}</h2>
            <p className="mt-1 text-sm leading-5 text-casero-text/70">{card.text}</p>
          </div>
          <span className="grid h-8 w-8 flex-none place-items-center rounded-md bg-casero-green/10 text-casero-green">
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
      <div className="container-page py-7 sm:py-10 lg:py-12">
        <div className="rounded-[1.5rem] border border-casero-dark/10 bg-white p-4 shadow-soft sm:p-5 lg:p-7">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(560px,1.18fr)] lg:items-center">
            <div className="max-w-2xl lg:pr-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-md bg-casero-beige px-3 py-1 text-sm font-bold text-casero-green">
                  Cancún y Riviera Maya
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-casero-green/10 px-3 py-1 text-sm font-bold text-casero-green">
                  <Zap className="h-3.5 w-3.5" aria-hidden />
                  Contacto rápido
                </span>
              </div>

              <h1 className="mt-4 max-w-[12ch] font-heading text-[clamp(2.35rem,6.4vw,4.6rem)] font-extrabold leading-[0.98] tracking-normal text-casero-dark lg:max-w-[13ch]">
                Servicios y negocios locales en un solo lugar
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-casero-text/75 sm:text-lg sm:leading-8">
                Busca proveedores locales, compara opciones y contacta directo por WhatsApp.
              </p>

              <form action="/buscar-servicios" className="mt-6 rounded-[1.1rem] border border-casero-dark/10 bg-casero-background p-2.5 shadow-sm sm:p-3">
                <label className="sr-only" htmlFor="home-search">Buscar servicio o negocio</label>
                <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="flex min-h-14 min-w-0 items-center gap-3 rounded-lg border border-casero-dark/10 bg-white px-4 shadow-[0_1px_0_rgba(27,31,35,0.04)]">
                    <Search className="h-5 w-5 flex-none text-casero-green" aria-hidden />
                    <input
                      id="home-search"
                      name="q"
                      type="search"
                      aria-label="Buscar servicio o negocio"
                      placeholder="Busca plomero, electricista, veterinaria..."
                      className="min-h-12 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-casero-text/45 sm:text-[17px]"
                    />
                  </div>
                  <button
                    className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-casero-green px-6 py-3 text-sm font-extrabold text-white shadow-soft transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casero-green focus-visible:ring-offset-2"
                    type="submit"
                  >
                    Buscar
                    <Send className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </form>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
                <Button href="/buscar-servicios" className="w-full px-6 py-3 text-base sm:w-auto">
                  <Search className="h-4 w-4" aria-hidden />
                  Buscar servicio
                </Button>
                <Button href="/registrar-mi-negocio" variant="secondary" className="w-full px-6 py-3 text-base sm:w-auto">
                  Registrar negocio
                </Button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {quickSearchLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg bg-casero-beige px-3.5 py-2.5 text-sm font-bold text-casero-dark transition hover:bg-casero-orange/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-orange sm:text-[15px]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-5 grid gap-2 rounded-[1rem] border border-casero-dark/10 bg-white p-2 shadow-sm sm:grid-cols-3">
                {heroBenefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.label} className="flex min-h-12 items-center gap-2 rounded-lg bg-casero-background px-3 py-2 text-sm font-bold leading-tight text-casero-text">
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-md bg-casero-green/10 text-casero-green">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
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

            <div className="rounded-[1.25rem] border border-casero-dark/10 bg-casero-background p-3 shadow-sm sm:p-4">
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

              <div className="grid gap-3 xl:grid-cols-[1.05fr_0.95fr]">
                <ServicePreviewCard card={serviceCards[0]} />
                <div className="grid gap-3">
                  {serviceCards.slice(1).map((card) => (
                    <ServicePreviewCard key={card.title} card={card} />
                  ))}
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {miniCards.map((card) => (
                  <Link key={card.href} href={card.href} className="flex min-h-20 items-center gap-3 rounded-[1rem] border border-casero-dark/10 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
                    <div className="relative h-16 w-16 flex-none overflow-hidden rounded-xl bg-casero-beige">
                      <Image src={card.image} alt={card.alt} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-casero-text/50">Ejemplo</p>
                      <p className="font-heading text-base font-extrabold text-casero-dark">{card.title}</p>
                      <p className="mt-1 text-xs font-semibold text-casero-green">Ver opciones</p>
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
