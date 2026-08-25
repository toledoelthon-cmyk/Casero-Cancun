import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Search, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

const quickSearchLinks = [
  { label: "Plomero", href: "/buscar-servicios?q=plomero", icon: "/icons/services/icon-plomeria.svg" },
  { label: "Electricista", href: "/buscar-servicios?q=electricista", icon: "/icons/services/icon-electricidad.svg" },
  { label: "Aire acondicionado", shortLabel: "Aire A/C", href: "/buscar-servicios?q=aire%20acondicionado", icon: "/icons/services/icon-aire-acondicionado.svg", wide: true },
  { label: "Ferretería", href: "/buscar-servicios?q=ferreteria", icon: "/icons/services/icon-ferreteria.svg" },
  { label: "Veterinaria", href: "/buscar-servicios?q=veterinaria", icon: "/icons/services/icon-veterinaria.svg" },
  { label: "Mecánico", href: "/buscar-servicios?q=mecanico", icon: "/icons/services/icon-mecanico.svg" },
];

const marketplaceCards = [
  {
    title: "Plomería",
    href: "/buscar-servicios?q=plomero",
    image: "/images/hero/hero-main-service-card.webp",
    alt: "Servicio local de plomería atendiendo una reparación en casa",
    position: "object-[42%_center]",
  },
  {
    title: "A/C y Electricidad",
    href: "/buscar-servicios?q=aire%20acondicionado",
    image: "/images/hero/hero-card-electricidad.webp",
    alt: "Técnico local revisando instalación eléctrica y aire acondicionado",
    position: "object-[45%_center]",
  },
  {
    title: "Ferretería y Materiales",
    href: "/buscar-servicios?q=ferreteria",
    image: "/images/hero/hero-card-ferreteria.webp",
    alt: "Ferretería local con materiales y atención a clientes",
    position: "object-[40%_center]",
  },
  {
    title: "Veterinaria",
    href: "/buscar-servicios?q=veterinaria",
    image: "/images/hero/hero-card-mascotas.webp",
    alt: "Servicio local de mascotas y veterinaria",
    position: "object-[center_42%]",
  },
  {
    title: "Mecánico",
    href: "/buscar-servicios?q=mecanico",
    image: "/images/hero/hero-card-auto.webp",
    alt: "Servicio mecánico local para auto",
    position: "object-[48%_center]",
  },
];
const zoneTiles = [
  {
    label: "Cancún",
    href: "/ubicacion/cancun",
    image: "/images/zones/zona-cancun-card.webp",
    alt: "Zona de cobertura en Cancún",
    position: "object-center",
  },
  {
    label: "Puerto Morelos",
    href: "/ubicacion/puerto-morelos",
    image: "/images/zones/zona-puerto-morelos-card.webp",
    alt: "Zona de cobertura en Puerto Morelos",
    position: "object-[center_45%]",
  },
  {
    label: "Playa del Carmen",
    href: "/ubicacion/playa-del-carmen",
    image: "/images/zones/zona-playa-del-carmen-card.webp",
    alt: "Zona de cobertura en Playa del Carmen",
    position: "object-center",
  },
  {
    label: "Tulum",
    href: "/ubicacion/tulum",
    image: "/images/zones/zona-tulum-card.webp",
    alt: "Zona de cobertura en Tulum",
    position: "object-[center_45%]",
  },
];

const trustSeals = [
  { label: "WhatsApp directo", image: "/images/badges/badge-whatsapp-directo.png", alt: "Sello de WhatsApp directo" },
  { label: "Publicaciones revisadas", image: "/images/badges/badge-publicaciones-revisadas.png", alt: "Sello de publicaciones revisadas" },
  { label: "Proveedores locales", image: "/images/badges/badge-proveedores-locales.png", alt: "Sello de proveedores locales" },
  { label: "Atención confiable", image: "/images/badges/badge-atencion-calidad.png", alt: "Sello de atención confiable" },
];

type MarketplaceCard = (typeof marketplaceCards)[number];

function MarketplaceCard({ card }: { card: MarketplaceCard }) {
  return (
    <Link
      href={card.href}
      className="group block h-full overflow-hidden rounded-[1.1rem] border border-white/70 bg-casero-dark shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green"
    >
      <article className="h-full overflow-hidden rounded-[1.1rem] bg-casero-dark">
        <div className="relative h-full min-h-[178px] overflow-hidden bg-casero-dark sm:min-h-[190px] lg:min-h-[166px] xl:min-h-[178px]">
          <Image
            src={card.image}
            alt={card.alt}
            fill
            sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 30vw, 100vw"
            className={"object-cover transition duration-500 group-hover:scale-[1.03] " + card.position}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/78 via-black/34 to-transparent" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
            <h2 className="rounded-full bg-slate-950/68 px-3.5 py-2 text-center font-heading text-base font-extrabold leading-tight text-white shadow-sm backdrop-blur-sm sm:text-lg">
              {card.title}
            </h2>
          </div>
        </div>
      </article>
    </Link>
  );
}
function MarketplacePreview() {
  return (
    <div className="grid min-w-0 gap-3">
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

      <div className="grid gap-3 sm:grid-cols-2">
        {marketplaceCards.map((card, index) => (
          <div key={card.href} className={index === 4 ? "sm:col-span-2 lg:col-span-1" : "h-full"}>
            <MarketplaceCard card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickSearchSection() {
  return (
    <section className="border-y border-casero-dark/10 bg-white py-5 sm:py-6">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-casero-text/55">Atajos útiles</p>
            <h2 className="font-heading text-2xl font-extrabold text-casero-dark">Búsquedas rápidas</h2>
          </div>
          <p className="max-w-lg text-sm font-semibold leading-6 text-casero-text/62">Elige un servicio frecuente y ve directo a proveedores locales disponibles.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {quickSearchLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                "group flex min-h-[70px] min-w-0 items-center gap-3 rounded-2xl border border-casero-dark/10 bg-casero-background px-3.5 py-3 text-sm font-extrabold text-casero-dark shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:bg-white hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green sm:text-[15px] " +
                (item.wide ? "flex-[1.35_1_220px] sm:flex-[1.45_1_250px]" : "flex-[1_1_160px] sm:flex-[1_1_180px]")
              }
            >
              <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-white transition group-hover:bg-casero-orange/20">
                <Image src={item.icon} alt="" width={28} height={28} aria-hidden />
              </span>
              <span className="min-w-0 leading-tight">
                {item.shortLabel ? (
                  <>
                    <span className="sm:hidden">{item.shortLabel}</span>
                    <span className="hidden whitespace-nowrap sm:inline">{item.label}</span>
                  </>
                ) : (
                  item.label
                )}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ZoneTiles() {
  return (
    <section className="bg-casero-background py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="rounded-[1.4rem] border border-casero-dark/10 bg-white p-4 shadow-soft sm:p-5 lg:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-casero-text/55">Cobertura local</p>
              <h2 className="font-heading text-2xl font-extrabold text-casero-dark sm:text-3xl">Zonas de cobertura</h2>
            </div>
            <p className="max-w-md text-sm font-semibold leading-6 text-casero-text/68">Encuentra proveedores locales en Cancún, Puerto Morelos, Playa del Carmen y Tulum.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {zoneTiles.map((zone) => (
              <Link
                key={zone.href}
                href={zone.href}
                className="group overflow-hidden rounded-[1.15rem] border border-casero-dark/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green"
              >
                <div className="relative aspect-[16/10] min-h-[170px] bg-casero-beige lg:min-h-[190px]">
                  <Image src={zone.image} alt={zone.alt} fill sizes="(min-width: 1024px) 23vw, 50vw" className={"object-cover " + zone.position} />
                  <div className="absolute inset-0 bg-gradient-to-t from-casero-dark/96 via-casero-dark/48 to-casero-dark/10" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                    <div className="rounded-xl bg-casero-dark/76 p-3 backdrop-blur-sm">
                      <p className="font-heading text-2xl font-extrabold leading-tight text-white">{zone.label}</p>
                      <p className="mt-1 text-sm font-bold text-white/94">Ver proveedores</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSeals() {
  return (
    <section className="bg-white pb-8 sm:pb-10 lg:pb-12">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid gap-3 rounded-[1.4rem] border border-casero-dark/10 bg-white p-3 shadow-soft sm:grid-cols-2 sm:p-4 lg:grid-cols-4">
          {trustSeals.map((seal) => (
            <div key={seal.label} className="flex min-h-[86px] items-center gap-4 rounded-[1.1rem] border border-casero-dark/10 bg-casero-background px-4 py-3 shadow-sm">
              <span className="relative h-14 w-14 flex-none overflow-hidden rounded-full bg-white shadow-sm">
                <Image src={seal.image} alt={seal.alt} fill sizes="56px" className="object-contain p-1" />
              </span>
              <span className="font-heading text-base font-extrabold leading-tight text-casero-dark">{seal.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeHero() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-casero-dark/10 bg-casero-background">
        <Image
          src="/images/hero/hero-bg-riviera-desktop.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-center opacity-28 blur-[1px] md:block"
          aria-hidden
        />
        <Image
          src="/images/hero/hero-bg-riviera-mobile.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-24 blur-[1px] md:hidden"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-casero-background via-casero-background/95 to-casero-background/78" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-white/42 via-casero-background/28 to-casero-background" aria-hidden />
        <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-casero-background/72 via-casero-background/34 to-transparent md:w-2/3" aria-hidden />

        <div className="relative z-10 mx-auto w-full max-w-[1536px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-11 xl:px-12 xl:py-12">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center xl:gap-9">
            <div className="max-w-[720px]">
              <span className="inline-flex items-center gap-2 rounded-full bg-casero-green px-4 py-2 text-sm font-extrabold text-white shadow-soft">
                <Star className="h-4 w-4 fill-current" aria-hidden />
                Marketplace local para Cancún y Riviera Maya
              </span>

              <h1 className="mt-4 max-w-[13ch] font-heading text-[clamp(2.8rem,4.8vw,5.5rem)] font-extrabold leading-[0.98] tracking-normal text-casero-dark">
                Servicios y negocios locales en un solo lugar
              </h1>
              <p className="mt-4 max-w-[640px] text-lg font-medium leading-8 text-casero-text/78 sm:text-xl sm:leading-9">
                Busca proveedores locales, compara opciones y contacta directo por WhatsApp.
              </p>

              <form action="/buscar-servicios" className="mt-5 max-w-[660px] rounded-[1.2rem] border border-white/70 bg-white/94 p-3 shadow-soft backdrop-blur">
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

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap">
                <Button href="/buscar-servicios" className="min-h-14 w-full px-7 py-3 text-base sm:w-auto">
                  <Search className="h-5 w-5" aria-hidden />
                  Buscar servicio
                </Button>
                <Button href="/registrar-mi-negocio" variant="secondary" className="min-h-14 w-full px-7 py-3 text-base sm:w-auto">
                  Registrar negocio
                </Button>
              </div>
            </div>

            <MarketplacePreview />
          </div>
        </div>
      </section>

      <QuickSearchSection />
      <ZoneTiles />
      <TrustSeals />
    </>
  );
}
