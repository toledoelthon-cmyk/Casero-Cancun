import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, Search, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

const quickSearchLinks = [
  { label: "Plomero", href: "/buscar-servicios?q=plomero", icon: "/icons/services/icon-plomeria.svg" },
  { label: "Electricista", href: "/buscar-servicios?q=electricista", icon: "/icons/services/icon-electricidad.svg" },
  { label: "Aire acondicionado", href: "/buscar-servicios?q=aire%20acondicionado", icon: "/icons/services/icon-aire-acondicionado.svg" },
  { label: "Ferretería", href: "/buscar-servicios?q=ferreteria", icon: "/icons/services/icon-ferreteria.svg" },
  { label: "Veterinaria", href: "/buscar-servicios?q=veterinaria", icon: "/icons/services/icon-veterinaria.svg" },
  { label: "Mecánico", href: "/buscar-servicios?q=mecanico", icon: "/icons/services/icon-mecanico.svg" },
];

const marketplaceCards = [
  {
    title: "Plomería rápida",
    text: "Fugas, destapes y reparaciones para casa o negocio.",
    zone: "Cancún",
    badge: "WhatsApp",
    href: "/buscar-servicios?q=plomero",
    image: "/images/hero/hero-main-service-card.webp",
    alt: "Servicio local de plomería atendiendo una reparación en casa",
    featured: true,
    position: "object-center",
  },
  {
    title: "Aire y electricidad",
    text: "Instalaciones, mantenimiento y revisiones a domicilio.",
    zone: "Cancún",
    badge: "A domicilio",
    href: "/buscar-servicios?q=aire%20acondicionado",
    image: "/images/hero/hero-card-electricidad.webp",
    alt: "Técnico local revisando instalación eléctrica y aire acondicionado",
    position: "object-center",
  },
  {
    title: "Ferretería y materiales",
    text: "Herramientas, refacciones y productos cerca de ti.",
    zone: "Puerto Morelos",
    badge: "Abierto",
    href: "/buscar-servicios?q=ferreteria",
    image: "/images/hero/hero-card-ferreteria.webp",
    alt: "Ferretería local con materiales y atención a clientes",
    position: "object-center",
  },
];

const miniMarketplaceCards = [
  {
    title: "Veterinaria",
    href: "/buscar-servicios?q=veterinaria",
    image: "/images/hero/hero-card-mascotas.webp",
    alt: "Servicio local de mascotas y veterinaria",
  },
  {
    title: "Mecánico",
    href: "/buscar-servicios?q=mecanico",
    image: "/images/hero/hero-card-auto.webp",
    alt: "Servicio mecánico local para auto",
  },
];

const zoneTiles = [
  {
    label: "Cancún",
    href: "/ubicacion/cancun",
    image: "/images/zones/zona-cancun-card.webp",
    alt: "Zona de cobertura en Cancún",
  },
  {
    label: "Puerto Morelos",
    href: "/ubicacion/puerto-morelos",
    image: "/images/zones/zona-puerto-morelos-card.webp",
    alt: "Zona de cobertura en Puerto Morelos",
  },
  {
    label: "Playa del Carmen",
    href: "/ubicacion/playa-del-carmen",
    image: "/images/zones/zona-playa-del-carmen-card.webp",
    alt: "Zona de cobertura en Playa del Carmen",
  },
  {
    label: "Tulum",
    href: "/ubicacion/tulum",
    image: "/images/zones/zona-tulum-card.webp",
    alt: "Zona de cobertura en Tulum",
  },
];

const trustSeals = [
  { label: "WhatsApp directo", image: "/images/badges/badge-whatsapp-directo.png", alt: "Sello de WhatsApp directo" },
  { label: "Publicaciones revisadas", image: "/images/badges/badge-publicaciones-revisadas.png", alt: "Sello de publicaciones revisadas" },
  { label: "Proveedores locales", image: "/images/badges/badge-proveedores-locales.png", alt: "Sello de proveedores locales" },
  { label: "Atención confiable", image: "/images/badges/badge-atencion-calidad.png", alt: "Sello de atención confiable" },
];

function QuickSearchButtons() {
  return (
    <div className="mt-7">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-heading text-xl font-extrabold text-casero-dark">Búsquedas rápidas</p>
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold text-casero-green shadow-sm">Popular</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {quickSearchLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-h-[76px] items-center gap-3 rounded-2xl border border-white/70 bg-white/94 px-3.5 py-3 text-sm font-extrabold text-casero-dark shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green sm:text-[15px]"
          >
            <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-casero-beige transition group-hover:bg-casero-orange/20">
              <Image src={item.icon} alt="" width={28} height={28} aria-hidden />
            </span>
            <span className="leading-tight">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function MarketplacePreview() {
  const featured = marketplaceCards[0];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-casero-text/55">Vista previa del directorio</p>
          <p className="font-heading text-2xl font-extrabold text-casero-dark sm:text-3xl">Servicios cerca de ti</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-casero-green px-4 py-2 text-sm font-extrabold text-white shadow-soft">
          <MessageCircle className="h-4 w-4" aria-hidden />
          Contacto rápido
        </span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr] xl:items-stretch">
        <Link
          href={featured.href}
          className="group overflow-hidden rounded-[1.35rem] border border-white/70 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green"
        >
          <div className="relative aspect-[4/3] min-h-[330px] bg-casero-beige sm:aspect-[16/10] lg:aspect-[4/3] xl:h-full xl:min-h-[520px]">
            <Image
              src={featured.image}
              alt={featured.alt}
              fill
              priority
              sizes="(min-width: 1280px) 42vw, (min-width: 1024px) 48vw, 100vw"
              className={"object-cover " + featured.position}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-casero-dark/86 via-casero-dark/22 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-casero-green px-3 py-1.5 text-xs font-extrabold shadow-sm">{featured.badge}</span>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-casero-green text-white shadow-soft">
                  <MessageCircle className="h-5 w-5" aria-hidden />
                </span>
              </div>
              <h2 className="font-heading text-3xl font-extrabold leading-tight sm:text-4xl">{featured.title}</h2>
              <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-white/84 sm:text-base">{featured.text}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-white/82">
                <MapPin className="h-4 w-4" aria-hidden />
                {featured.zone}
              </p>
            </div>
          </div>
        </Link>

        <div className="grid gap-4">
          {marketplaceCards.slice(1).map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group grid overflow-hidden rounded-[1.2rem] border border-white/70 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green sm:grid-cols-[220px_1fr] xl:grid-cols-1"
            >
              <div className="relative aspect-[16/10] min-h-[190px] bg-casero-beige sm:aspect-auto sm:min-h-full xl:aspect-[16/9] xl:min-h-[210px]">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(min-width: 1280px) 28vw, (min-width: 640px) 220px, 100vw"
                  className={"object-cover " + card.position}
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1.5 text-xs font-extrabold text-casero-green shadow-sm">
                  {card.badge}
                </span>
              </div>
              <div className="flex min-h-[170px] flex-col justify-between p-4 sm:p-5">
                <div>
                  <h2 className="font-heading text-2xl font-extrabold leading-tight text-casero-dark xl:text-[1.6rem]">{card.title}</h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-casero-text/72">{card.text}</p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-casero-text/62">
                    <MapPin className="h-4 w-4 text-casero-orange" aria-hidden />
                    {card.zone}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-casero-green/10 text-casero-green">
                    <MessageCircle className="h-5 w-5" aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          ))}

          <div className="grid gap-4 sm:grid-cols-2">
            {miniMarketplaceCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group overflow-hidden rounded-[1.1rem] border border-white/70 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green"
              >
                <div className="relative aspect-[16/9] min-h-[135px] bg-casero-beige">
                  <Image src={card.image} alt={card.alt} fill sizes="(min-width: 1280px) 14vw, 50vw" className="object-cover object-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-casero-dark/76 via-casero-dark/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <p className="font-heading text-xl font-extrabold leading-tight">{card.title}</p>
                    <p className="mt-1 text-xs font-bold text-white/84">Ver opciones</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ZoneTiles() {
  return (
    <div className="rounded-[1.4rem] border border-white/60 bg-white/88 p-4 shadow-soft backdrop-blur sm:p-5 lg:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-casero-text/55">Cobertura local</p>
          <p className="font-heading text-2xl font-extrabold text-casero-dark sm:text-3xl">Zonas de cobertura</p>
        </div>
        <p className="max-w-md text-sm font-semibold leading-6 text-casero-text/62">Encuentra proveedores locales en Cancún, Puerto Morelos, Playa del Carmen y Tulum.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {zoneTiles.map((zone) => (
          <Link
            key={zone.href}
            href={zone.href}
            className="group overflow-hidden rounded-[1.15rem] border border-casero-dark/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green"
          >
            <div className="relative aspect-[16/10] min-h-[170px] bg-casero-beige lg:min-h-[190px]">
              <Image src={zone.image} alt={zone.alt} fill sizes="(min-width: 1024px) 23vw, 50vw" className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-casero-dark/78 via-casero-dark/18 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="font-heading text-2xl font-extrabold leading-tight">{zone.label}</p>
                <p className="mt-1 text-sm font-bold text-white/84">Ver proveedores</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TrustSeals() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {trustSeals.map((seal) => (
        <div key={seal.label} className="flex min-h-[86px] items-center gap-4 rounded-[1.1rem] border border-white/65 bg-white/92 px-4 py-3 shadow-sm backdrop-blur">
          <span className="relative h-14 w-14 flex-none overflow-hidden rounded-full bg-white shadow-sm">
            <Image src={seal.image} alt={seal.alt} fill sizes="56px" className="object-contain p-1" />
          </span>
          <span className="font-heading text-base font-extrabold leading-tight text-casero-dark">{seal.label}</span>
        </div>
      ))}
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-casero-dark/10 bg-casero-background lg:min-h-[700px]">
      <Image
        src="/images/hero/hero-bg-riviera-desktop.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hidden object-cover object-center opacity-70 md:block"
        aria-hidden
      />
      <Image
        src="/images/hero/hero-bg-riviera-mobile.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center opacity-52 md:hidden"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-casero-background via-casero-background/92 to-casero-background/46" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-white/16 via-transparent to-casero-background/86" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-16 xl:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.25fr] lg:items-center xl:gap-14">
          <div className="max-w-[760px]">
            <span className="inline-flex items-center gap-2 rounded-full bg-casero-green px-4 py-2 text-sm font-extrabold text-white shadow-soft">
              <Star className="h-4 w-4 fill-current" aria-hidden />
              Marketplace local para Cancún y Riviera Maya
            </span>

            <h1 className="mt-5 max-w-[12.8ch] font-heading text-[clamp(3rem,5vw,5.7rem)] font-extrabold leading-[0.96] tracking-normal text-casero-dark">
              Servicios y negocios locales en un solo lugar
            </h1>
            <p className="mt-5 max-w-[640px] text-lg font-medium leading-8 text-casero-text/78 sm:text-xl sm:leading-9">
              Busca proveedores locales, compara opciones y contacta directo por WhatsApp.
            </p>

            <form action="/buscar-servicios" className="mt-7 max-w-[640px] rounded-[1.2rem] border border-white/70 bg-white/94 p-3 shadow-soft backdrop-blur">
              <label className="sr-only" htmlFor="home-search">Buscar servicio o negocio</label>
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="flex min-h-16 min-w-0 items-center gap-3 rounded-xl border border-casero-dark/10 bg-casero-background px-4">
                  <Search className="h-6 w-6 flex-none text-casero-green" aria-hidden />
                  <input
                    id="home-search"
                    name="q"
                    type="search"
                    aria-label="Buscar servicio o negocio"
                    placeholder="Busca plomero, electricista, veterinaria..."
                    className="min-h-14 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-casero-text/48 sm:text-lg"
                  />
                </div>
                <button
                  className="inline-flex min-h-16 items-center justify-center gap-2 rounded-xl bg-casero-green px-7 py-3 text-base font-extrabold text-white shadow-soft transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casero-green focus-visible:ring-offset-2"
                  type="submit"
                >
                  Buscar
                  <Send className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </form>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
              <Button href="/buscar-servicios" className="min-h-14 w-full px-7 py-3 text-base sm:w-auto">
                <Search className="h-5 w-5" aria-hidden />
                Buscar servicio
              </Button>
              <Button href="/registrar-mi-negocio" variant="secondary" className="min-h-14 w-full px-7 py-3 text-base sm:w-auto">
                Registrar negocio
              </Button>
            </div>

            <QuickSearchButtons />
          </div>

          <MarketplacePreview />
        </div>

        <div className="mt-8 grid gap-5 lg:mt-12">
          <ZoneTiles />
          <TrustSeals />
        </div>
      </div>
    </section>
  );
}
