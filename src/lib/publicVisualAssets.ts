import type { CategorySection } from "@/lib/demo-data";

export const CATEGORY_VISUALS = {
  home_services: {
    title: "Servicios del hogar",
    description: "Reparaciones, limpieza y mantenimiento.",
    href: "/servicios-del-hogar",
    image: "/images/categories/categoria-servicios-hogar-cover.webp",
    imageAlt: "Servicios del hogar en Cancún",
    icon: "/icons/categories/icon-hogar.svg",
  },
  stores_materials: {
    title: "Tiendas y materiales",
    description: "Ferreterías, materiales y productos.",
    href: "/tiendas-y-materiales",
    image: "/images/categories/categoria-materiales-cover.webp",
    imageAlt: "Tiendas de materiales y ferreterías locales",
    icon: "/icons/categories/icon-materiales.svg",
  },
  pets: {
    title: "Mascotas",
    description: "Veterinarias, estética y cuidado.",
    href: "/mascotas",
    image: "/images/categories/categoria-mascotas-cover.webp",
    imageAlt: "Servicios para mascotas en Cancún",
    icon: "/icons/categories/icon-mascotas.svg",
  },
  auto_services: {
    title: "Servicios para tu auto",
    description: "Mecánicos, lavado, grúas y más.",
    href: "/servicios-para-tu-auto",
    image: "/images/categories/categoria-auto-cover.webp",
    imageAlt: "Servicios automotrices locales",
    icon: "/icons/categories/icon-auto.svg",
  },
} satisfies Record<CategorySection, {
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  icon: string;
}>;

export const ZONE_VISUALS = {
  cancun: {
    title: "Cancún",
    description: "Proveedores locales en Cancún.",
    image: "/images/zones/zona-cancun-card.webp",
    imageAlt: "Zona de cobertura en Cancún",
  },
  "puerto-morelos": {
    title: "Puerto Morelos",
    description: "Servicios disponibles en Puerto Morelos.",
    image: "/images/zones/zona-puerto-morelos-card.webp",
    imageAlt: "Zona de cobertura en Puerto Morelos",
  },
  "playa-del-carmen": {
    title: "Playa del Carmen",
    description: "Proveedores en Playa del Carmen.",
    image: "/images/zones/zona-playa-del-carmen-card.webp",
    imageAlt: "Zona de cobertura en Playa del Carmen",
  },
  tulum: {
    title: "Tulum",
    description: "Servicios y negocios en Tulum.",
    image: "/images/zones/zona-tulum-card.webp",
    imageAlt: "Zona de cobertura en Tulum",
  },
} as const;

export const RIVIERA_MAYA_BANNER = "/images/zones/zona-riviera-maya-banner.webp";
export const PUBLIC_HERO_IMAGE = "/images/hero/hero-bg-riviera-desktop.webp";
export const PUBLIC_HERO_MOBILE_IMAGE = "/images/hero/hero-bg-riviera-mobile.webp";

export const TRUST_BADGES = [
  { label: "WhatsApp directo", image: "/images/badges/badge-whatsapp-directo.png", alt: "Sello de WhatsApp directo" },
  { label: "Publicaciones revisadas", image: "/images/badges/badge-publicaciones-revisadas.png", alt: "Sello de publicaciones revisadas" },
  { label: "Proveedores locales", image: "/images/badges/badge-proveedores-locales.png", alt: "Sello de proveedores locales" },
  { label: "Atención confiable", image: "/images/badges/badge-atencion-calidad.png", alt: "Sello de atención confiable" },
] as const;

export const QUICK_SEARCH_VISUALS = [
  { label: "Plomero", href: "/buscar-servicios?q=plomero", icon: "/icons/services/icon-plomeria.svg" },
  { label: "Electricista", href: "/buscar-servicios?q=electricista", icon: "/icons/services/icon-electricidad.svg" },
  { label: "Aire acondicionado", href: "/buscar-servicios?q=aire%20acondicionado", icon: "/icons/services/icon-aire-acondicionado.svg" },
  { label: "Ferretería", href: "/buscar-servicios?q=ferreteria", icon: "/icons/services/icon-ferreteria.svg" },
  { label: "Veterinaria", href: "/buscar-servicios?q=veterinaria", icon: "/icons/services/icon-veterinaria.svg" },
  { label: "Mecánico", href: "/buscar-servicios?q=mecanico", icon: "/icons/services/icon-mecanico.svg" },
] as const;