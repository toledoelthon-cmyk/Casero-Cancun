import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Car, HeartHandshake, MapPin, MessageCircle, Search, ShieldCheck, Store, Wrench } from "lucide-react";
import { CategoryCard } from "@/components/marketplace/CategoryCard";
import { TrustFeatureCard } from "@/components/marketplace/TrustFeatureCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { autoServiceCategories, petCategories, serviceCategories, storeCategories } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Casero Cancun | Servicios locales, mascotas, auto, tiendas y materiales",
  description:
    "Encuentra servicios locales Cancun, tiendas y materiales Cancun, mascotas Cancun y servicios automotrices Cancun con contacto directo por WhatsApp.",
};

const mainSections = [
  {
    title: "Servicios del hogar",
    text: "Plomeria, electricidad, limpieza, pintura, mantenimiento, aire acondicionado y mas.",
    href: "/servicios-del-hogar",
    button: "Buscar servicios del hogar",
    icon: Wrench,
  },
  {
    title: "Tiendas y materiales",
    text: "Ferreterias, materiales de construccion, herramientas, refacciones y suministros locales.",
    href: "/tiendas-y-materiales",
    button: "Ver tiendas y materiales",
    icon: Store,
  },
  {
    title: "Mascotas",
    text: "Veterinarias, estetica canina, alimentos, accesorios, paseadores y servicios para mascotas.",
    href: "/mascotas",
    button: "Ver servicios para mascotas",
    icon: HeartHandshake,
  },
  {
    title: "Servicios para tu auto",
    text: "Talleres, lavado, gruas, llanteras, diagnostico, refacciones y servicios automotrices.",
    href: "/servicios-para-tu-auto",
    button: "Ver servicios para tu auto",
    icon: Car,
  },
];

const trustFeatures = [
  {
    icon: Wrench,
    title: "Negocios locales",
    text: "Servicios, tiendas, mascotas y soluciones para auto con enfoque en Cancun y zonas cercanas.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp directo",
    text: "Contacta sin intermediarios para pedir precio, disponibilidad o agendar una visita.",
  },
  {
    icon: MapPin,
    title: "Zonas claras",
    text: "Identifica si atienden Centro, Zona Hotelera, Huayacan, Cumbres, Puerto Cancun y mas.",
  },
  {
    icon: BadgeCheck,
    title: "Perfiles revisados",
    text: "La plataforma esta preparada para publicar perfiles aprobados y negocios verificados.",
  },
];

const steps = [
  "Busca la solucion",
  "Revisa perfiles y zonas",
  "Contacta por WhatsApp",
  "Agenda directamente con el negocio",
];

const quickSearchLinks = [
  { label: "Plomeria", href: "/categoria/plomeria" },
  { label: "Ferreterias", href: "/categoria/ferreterias" },
  { label: "Veterinarias", href: "/categoria/veterinarias" },
  { label: "Talleres mecanicos", href: "/categoria/talleres-mecanicos" },
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
      <section className="overflow-hidden border-b border-casero-dark/10 bg-white">
        <div className="container-page grid items-center gap-8 py-8 sm:py-12 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex rounded-md bg-casero-beige px-3 py-1 text-sm font-bold text-casero-green">
              Directorio local para Cancun
            </span>
            <h1 className="mt-4 max-w-4xl font-heading text-3xl font-extrabold tracking-normal text-casero-dark sm:text-5xl lg:text-6xl">
              Servicios, negocios y soluciones locales en Cancun.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-casero-text/75 sm:mt-6 sm:text-lg sm:leading-8">
              Casero Cancun conecta clientes con proveedores locales, tiendas de materiales, negocios de mascotas y
              servicios automotrices confiables.
            </p>
            <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <Button href="/buscar-servicios" className="w-full sm:w-auto">
                <Search className="h-4 w-4" aria-hidden />
                Buscar en el directorio
              </Button>
              <Button href="/registrar-mi-negocio" variant="secondary" className="w-full sm:w-auto">
                Registrar negocio
              </Button>
              <Button href="/categorias" variant="outline" className="w-full sm:w-auto">
                Ver categorias
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-casero-dark p-4 text-white shadow-soft sm:p-5">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-white/60">Busqueda rapida</p>
                <p className="font-heading text-xl font-bold">Hogar, materiales, mascotas y auto</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-casero-orange" aria-hidden />
            </div>
            <div className="mt-5 grid gap-3">
              {quickSearchLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex cursor-pointer items-center gap-3 rounded-md bg-white/10 p-3 transition hover:bg-white/15 active:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-orange sm:p-4"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-white/10">
                    <Store className="h-4 w-4 text-casero-orange" aria-hidden />
                  </span>
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-16">
        <SectionHeader
          eyebrow="Explora por seccion"
          title="Encuentra lo que necesitas en Cancun"
          description="Cuatro accesos principales para resolver necesidades de casa, compras locales, mascotas y auto."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {mainSections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.href}
                href={section.href}
                className="group flex h-full cursor-pointer flex-col rounded-lg border border-casero-dark/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/40 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green sm:p-5"
              >
                <span className="grid h-12 w-12 place-items-center rounded-md bg-casero-beige text-casero-green">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h2 className="mt-5 font-heading text-xl font-extrabold text-casero-dark">{section.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-casero-text/70">{section.text}</p>
                <span className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-casero-dark/15 bg-white px-5 py-2.5 text-sm font-semibold text-casero-dark transition group-hover:border-casero-green group-hover:text-casero-green">
                  {section.button}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-casero-beige/55 py-10 sm:py-16">
        <div className="container-page">
          <SectionHeader
            eyebrow="Confianza"
            title="Una plataforma pensada para decidir rapido y con claridad"
            description="Informacion practica para contactar al negocio correcto sin perder tiempo entre resultados genericos."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustFeatures.map((feature) => (
              <TrustFeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-16">
        <SectionHeader eyebrow="Categorias destacadas" title="Servicios locales Cancun para cada necesidad" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...highlightedServices, ...highlightedStores, ...highlightedPets, ...highlightedAuto].map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-white py-10 sm:py-16">
        <div className="container-page">
          <SectionHeader eyebrow="Como funciona" title="De la busqueda al contacto directo" align="center" />
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

      <section className="container-page py-10 sm:py-16">
        <div className="rounded-lg bg-casero-dark p-5 text-white shadow-soft sm:p-8 md:p-10">
          <p className="font-heading text-2xl font-extrabold sm:text-3xl">Haz que mas clientes encuentren tu negocio</p>
          <p className="mt-3 max-w-3xl text-white/70">
            Registra tu servicio, tienda, negocio de mascotas o servicio automotriz en una plataforma local creada para Cancun.
          </p>
          <Button href="/registrar-mi-negocio" className="mt-6 w-full sm:w-auto" variant="primary">
            Registrar negocio
          </Button>
        </div>
      </section>
    </>
  );
}
