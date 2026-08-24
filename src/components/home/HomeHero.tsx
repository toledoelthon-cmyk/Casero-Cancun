import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

const quickSearchLinks = [
  { label: "Plomero", href: "/buscar-servicios?q=plomero", icon: "/icons/services/icon-plomeria.svg" },
  { label: "Electricista", href: "/buscar-servicios?q=electricista", icon: "/icons/services/icon-electricidad.svg" },
  { label: "Aire acondicionado", href: "/buscar-servicios?q=aire%20acondicionado", icon: "/icons/services/icon-aire-acondicionado.svg" },
  { label: "Ferretería", href: "/buscar-servicios?q=ferreteria", icon: "/icons/services/icon-ferreteria.svg" },
  { label: "Veterinaria", href: "/buscar-servicios?q=veterinaria", icon: "/icons/services/icon-veterinaria.svg" },
  { label: "Mecánico", href: "/buscar-servicios?q=mecanico", icon: "/icons/services/icon-mecanico.svg" },
];

const serviceTiles = [
  {
    label: "Servicios del hogar",
    text: "Reparaciones, limpieza y mantenimiento.",
    href: "/servicios-del-hogar",
    image: "/images/hero/hero-main-service-card.webp",
    alt: "Servicio del hogar atendiendo una reparación local",
    position: "object-center",
  },
  {
    label: "Tiendas y materiales",
    text: "Ferreterías, herramientas y productos.",
    href: "/tiendas-y-materiales",
    image: "/images/hero/hero-card-ferreteria.webp",
    alt: "Ferretería local con materiales y herramientas",
    position: "object-center",
  },
  {
    label: "Mascotas",
    text: "Veterinarias, estética y cuidado.",
    href: "/mascotas",
    image: "/images/hero/hero-card-mascotas.webp",
    alt: "Mascota atendida por servicio local de cuidado",
    position: "object-center",
  },
  {
    label: "Servicios para tu auto",
    text: "Mecánicos, lavado, grúas y más.",
    href: "/servicios-para-tu-auto",
    image: "/images/hero/hero-card-auto.webp",
    alt: "Servicio automotriz local para clientes en Riviera Maya",
    position: "object-center",
  },
];

const zoneTiles = [
  {
    label: "Cancún",
    href: "/ubicacion/cancun",
    image: "/images/zones/zona-cancun-card.webp",
    alt: "Zona hotelera y ciudad de Cancún",
  },
  {
    label: "Puerto Morelos",
    href: "/ubicacion/puerto-morelos",
    image: "/images/zones/zona-puerto-morelos-card.webp",
    alt: "Costa de Puerto Morelos en la Riviera Maya",
  },
  {
    label: "Playa del Carmen",
    href: "/ubicacion/playa-del-carmen",
    image: "/images/zones/zona-playa-del-carmen-card.webp",
    alt: "Playa del Carmen y zona urbana local",
  },
  {
    label: "Tulum",
    href: "/ubicacion/tulum",
    image: "/images/zones/zona-tulum-card.webp",
    alt: "Tulum y entorno de la Riviera Maya",
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
    <div className="rounded-[1.25rem] border border-white/60 bg-white/92 p-3 shadow-soft backdrop-blur sm:p-4">
      <div className="flex items-center justify-between gap-3 px-1 pb-3">
        <p className="font-heading text-lg font-extrabold text-casero-dark">Búsquedas rápidas</p>
        <span className="rounded-md bg-casero-green/10 px-2.5 py-1 text-xs font-extrabold text-casero-green">Popular</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {quickSearchLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-h-16 items-center gap-3 rounded-xl border border-casero-dark/10 bg-white px-3 py-2.5 text-sm font-extrabold text-casero-dark shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green"
          >
            <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-casero-beige transition group-hover:bg-casero-orange/20">
              <Image src={item.icon} alt="" width={24} height={24} aria-hidden />
            </span>
            <span className="leading-tight">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ServiceTiles() {
  return (
    <div className="rounded-[1.25rem] border border-white/60 bg-white/92 p-3 shadow-soft backdrop-blur sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-casero-text/50">Directorio local</p>
          <p className="font-heading text-lg font-extrabold text-casero-dark">Servicios y negocios</p>
        </div>
        <MessageCircle className="h-5 w-5 text-casero-green" aria-hidden />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {serviceTiles.map((tile, index) => (
          <Link
            key={tile.href}
            href={tile.href}
            className={
              "group overflow-hidden rounded-xl border border-casero-dark/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green " +
              (index === 0 ? "sm:col-span-2" : "")
            }
          >
            <div className={index === 0 ? "relative aspect-[16/8] bg-casero-beige" : "relative aspect-[16/10] bg-casero-beige"}>
              <Image
                src={tile.image}
                alt={tile.alt}
                fill
                sizes={index === 0 ? "(min-width: 1024px) 44vw, 100vw" : "(min-width: 1024px) 22vw, 50vw"}
                className={"object-cover " + tile.position}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-casero-dark/72 via-casero-dark/12 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <p className="font-heading text-lg font-extrabold leading-tight">{tile.label}</p>
                <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-white/82">{tile.text}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ZoneTiles() {
  return (
    <div className="rounded-[1.25rem] border border-white/55 bg-white/88 p-3 shadow-soft backdrop-blur sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-casero-text/50">Cobertura</p>
          <p className="font-heading text-lg font-extrabold text-casero-dark">Cancún y Riviera Maya</p>
        </div>
        <MapPin className="h-5 w-5 text-casero-orange" aria-hidden />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {zoneTiles.map((zone) => (
          <Link
            key={zone.href}
            href={zone.href}
            className="group overflow-hidden rounded-xl border border-casero-dark/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green"
          >
            <div className="relative aspect-[16/10] bg-casero-beige">
              <Image src={zone.image} alt={zone.alt} fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-casero-dark/74 via-casero-dark/18 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <p className="font-heading text-lg font-extrabold leading-tight">{zone.label}</p>
                <p className="mt-1 text-xs font-bold text-white/82">Ver proveedores</p>
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
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {trustSeals.map((seal) => (
        <div key={seal.label} className="flex min-h-16 items-center gap-3 rounded-xl border border-white/55 bg-white/90 px-3 py-2.5 shadow-sm backdrop-blur">
          <span className="relative h-11 w-11 flex-none overflow-hidden rounded-full bg-white">
            <Image src={seal.image} alt={seal.alt} fill sizes="44px" className="object-contain p-1" />
          </span>
          <span className="text-sm font-extrabold leading-tight text-casero-dark">{seal.label}</span>
        </div>
      ))}
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-casero-dark/10 bg-casero-background">
      <Image
        src="/images/hero/hero-bg-riviera-desktop.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hidden object-cover object-center md:block"
        aria-hidden
      />
      <Image
        src="/images/hero/hero-bg-riviera-mobile.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center md:hidden"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-br from-casero-background/96 via-casero-background/82 to-casero-green/28" aria-hidden />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.82))]" aria-hidden />

      <div className="container-page relative z-10 py-7 sm:py-10 lg:py-12">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.88fr)_minmax(580px,1.12fr)] lg:items-start">
          <div className="rounded-[1.5rem] border border-white/60 bg-white/90 p-4 shadow-soft backdrop-blur sm:p-6 lg:sticky lg:top-6 lg:p-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-casero-green px-3.5 py-1.5 text-sm font-extrabold text-white shadow-sm">
              <MessageCircle className="h-4 w-4" aria-hidden />
              Marketplace local verificado
            </span>

            <h1 className="mt-4 max-w-[12.5ch] font-heading text-[clamp(2.35rem,6.1vw,4.5rem)] font-extrabold leading-[0.98] tracking-normal text-casero-dark lg:max-w-[13ch]">
              Servicios y negocios locales en un solo lugar
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-casero-text/78 sm:text-lg sm:leading-8">
              Busca proveedores locales, compara opciones y contacta directo por WhatsApp.
            </p>

            <form action="/buscar-servicios" className="mt-6 rounded-[1.15rem] border border-casero-dark/10 bg-white p-2.5 shadow-soft sm:p-3">
              <label className="sr-only" htmlFor="home-search">Buscar servicio o negocio</label>
              <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
                <div className="flex min-h-14 min-w-0 items-center gap-3 rounded-xl border border-casero-dark/10 bg-casero-background px-4">
                  <Search className="h-5 w-5 flex-none text-casero-green" aria-hidden />
                  <input
                    id="home-search"
                    name="q"
                    type="search"
                    aria-label="Buscar servicio o negocio"
                    placeholder="Busca plomero, electricista, veterinaria..."
                    className="min-h-12 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-casero-text/48 sm:text-[17px]"
                  />
                </div>
                <button
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-casero-green px-6 py-3 text-sm font-extrabold text-white shadow-soft transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casero-green focus-visible:ring-offset-2"
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
          </div>

          <div className="grid gap-4">
            <QuickSearchButtons />
            <ServiceTiles />
          </div>
        </div>

        <div className="mt-5 grid gap-4">
          <ZoneTiles />
          <TrustSeals />
        </div>
      </div>
    </section>
  );
}
