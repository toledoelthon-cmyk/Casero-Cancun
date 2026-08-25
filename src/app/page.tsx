import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, ChevronRight, MapPin, MessageCircle, Search, Wrench } from "lucide-react";
import { HomeHero } from "@/components/home/HomeHero";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { TrustFeatureCard } from "@/components/marketplace/TrustFeatureCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/jsonLd";
import { autoServiceCategories, petCategories, serviceCategories, storeCategories } from "@/lib/demo-data";
import { CATEGORY_VISUALS } from "@/lib/publicVisualAssets";
import { createPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = createPublicMetadata({
  title: "Servicios y negocios confiables en Cancún y Riviera Maya | Casero Cancún",
  description:
    "Encuentra proveedores locales, tiendas, mascotas y servicios para tu auto en Cancún, Puerto Morelos, Playa del Carmen y Tulum. Contacta directo por WhatsApp.",
  path: "/",
});

const mainSections = [
  { ...CATEGORY_VISUALS.home_services, accent: "bg-casero-green text-white" },
  { ...CATEGORY_VISUALS.stores_materials, accent: "bg-casero-orange text-casero-dark" },
  { ...CATEGORY_VISUALS.pets, accent: "bg-casero-turquoise text-casero-dark" },
  { ...CATEGORY_VISUALS.auto_services, accent: "bg-casero-dark text-white" },
];

const clientSteps = [
  { title: "Busca lo que necesitas", text: "Encuentra servicios, tiendas, mascotas o auto por categoría y zona.", icon: Search },
  { title: "Elige un proveedor", text: "Compara perfiles claros, badges, zonas y datos de contacto.", icon: BadgeCheck },
  { title: "Contacta por WhatsApp", text: "Pregunta disponibilidad, precio o agenda directo con el negocio.", icon: MessageCircle },
];

const providerSteps = ["Registra tu negocio", "Revisamos tu publicación", "Recibe contactos por WhatsApp"];

const trustFeatures = [
  { icon: Wrench, title: "Proveedores locales", text: "Explora servicios, tiendas y negocios enfocados en Cancún y Riviera Maya." },
  { icon: MessageCircle, title: "WhatsApp directo", text: "Pregunta precio, disponibilidad o agenda sin intermediarios." },
  { icon: BadgeCheck, title: "Publicaciones revisadas", text: "Los perfiles publicados pasan por revisión antes de aparecer en el directorio." },
  { icon: MapPin, title: "Cobertura por zonas", text: "Filtra por ciudad o zona de atención para decidir más rápido." },
];

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
      <HomeHero />

      <section id="categorias" className="bg-white py-10 sm:py-14 lg:py-16">
        <div className="container-page">
          <SectionHeader eyebrow="Explora por área" title="Cuatro formas simples de empezar" description="Elige el tipo de ayuda que necesitas y ve directo a negocios publicados." />
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {mainSections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group flex h-full min-h-[270px] flex-col overflow-hidden rounded-[1.25rem] border border-casero-dark/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-casero-beige">
                  <Image src={section.image} alt={section.imageAlt} fill sizes="(min-width: 1280px) 23vw, (min-width: 768px) 48vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-casero-background shadow-sm ring-1 ring-casero-dark/10">
                      <Image src={section.icon} alt="" width={28} height={28} aria-hidden />
                    </span>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold ${section.accent}`}>Ver opciones</span>
                  </div>
                  <h2 className="mt-4 font-heading text-xl font-extrabold leading-tight text-casero-dark">{section.title}</h2>
                  <p className="mt-2 flex-1 text-sm font-semibold leading-6 text-casero-text/68">{section.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-casero-green">
                    Explorar sección <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-casero-background py-10 sm:py-14 lg:py-16">
        <div className="container-page grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <div className="rounded-[1.35rem] border border-casero-dark/10 bg-white p-5 shadow-soft sm:p-6 lg:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-casero-text/55">Cómo funciona</p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold text-casero-dark">Decide rápido y contacta claro</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              {clientSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="grid gap-4 rounded-[1rem] border border-casero-dark/10 bg-casero-background p-4 sm:grid-cols-[auto_1fr] sm:items-center">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-casero-green text-white shadow-sm">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-casero-green">Paso {index + 1}</p>
                      <h3 className="mt-1 font-heading text-lg font-extrabold text-casero-dark">{step.title}</h3>
                      <p className="mt-1 text-sm font-semibold leading-6 text-casero-text/66">{step.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.35rem] border border-casero-green/20 bg-casero-dark p-5 text-white shadow-soft sm:p-6 lg:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/62">Para proveedores</p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold">¿Tienes un negocio o prestas servicios?</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-white/76">Publica tu perfil, muestra tus datos y deja que los clientes te escriban directo por WhatsApp.</p>
            <div className="mt-6 grid gap-3">
              {providerSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-casero-orange font-heading font-extrabold text-casero-dark">{index + 1}</span>
                  <span className="font-bold text-white">{step}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <Button href="/registrar-mi-negocio" className="w-full sm:w-auto" variant="primary">Registrar mi negocio</Button>
              <Button href="/proveedor/login" variant="outline" className="w-full border-white/20 bg-white text-casero-dark sm:w-auto">Proveedores</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14 lg:py-16">
        <div className="container-page">
          <SectionHeader eyebrow="Confianza" title="Información clara antes de contactar" description="Datos visibles, perfiles revisados y contacto directo para tomar mejores decisiones." />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{trustFeatures.map((feature) => <TrustFeatureCard key={feature.title} {...feature} />)}</div>
        </div>
      </section>

      <section className="bg-casero-background py-10 sm:py-14 lg:py-16">
        <div className="container-page">
          <SectionHeader eyebrow="Categorías populares" title="Búsquedas frecuentes en Casero Cancún" description="Atajos útiles para encontrar proveedores sin recorrer todo el directorio." />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[...highlightedServices, ...highlightedStores, ...highlightedPets, ...highlightedAuto].map((category) => <CategoryCard key={category.slug} category={category} />)}</div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14 lg:py-16">
        <div className="container-page">
          <div className="overflow-hidden rounded-[1.4rem] bg-casero-dark shadow-soft">
            <div className="grid gap-0 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="p-5 text-white sm:p-8 md:p-10">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white ring-1 ring-white/15">
                  <CheckCircle2 className="h-4 w-4 text-casero-orange" aria-hidden />
                  Cierre comercial
                </p>
                <h2 className="mt-5 max-w-3xl font-heading text-3xl font-extrabold leading-tight sm:text-4xl">Haz que más clientes encuentren tu negocio</h2>
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-white/74 sm:text-base">Registra tu servicio, tienda, negocio de mascotas o servicio automotriz en una plataforma local creada para Cancún y Riviera Maya.</p>
              </div>
              <div className="px-5 pb-5 sm:px-8 sm:pb-8 lg:p-10">
                <Button href="/registrar-mi-negocio" className="min-h-14 w-full px-7 text-base" variant="primary">Registrar mi negocio</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
