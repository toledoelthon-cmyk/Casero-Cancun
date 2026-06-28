import type { MetadataRoute } from "next";
import { categories, locations } from "@/lib/demo-data";
import { hasSupabaseServerConfig, createSupabaseServerClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const staticRoutes = [
  "/",
  "/buscar-servicios",
  "/servicios-del-hogar",
  "/tiendas-y-materiales",
  "/mascotas",
  "/servicios-para-tu-auto",
  "/categorias",
  "/planes",
  "/registrar-mi-negocio",
  "/contacto",
  "/aviso-de-privacidad",
  "/terminos-y-condiciones",
];

async function getPublishedBusinessRoutes() {
  if (!hasSupabaseServerConfig()) {
    return [];
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("business_profiles")
    .select("slug")
    .eq("status", "published")
    .not("slug", "is", null);

  if (error) {
    console.warn("Could not load published businesses for sitemap", error.message);
    return [];
  }

  return (data ?? [])
    .map((business) => business.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => `/negocio/${slug}`);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const categoryRoutes = categories.map((category) => `/categoria/${category.slug}`);
  const locationRoutes = locations.map((location) => `/ubicacion/${location.slug}`);
  const businessRoutes = await getPublishedBusinessRoutes();
  const routes = Array.from(new Set([...staticRoutes, ...categoryRoutes, ...locationRoutes, ...businessRoutes]));

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
  }));
}
