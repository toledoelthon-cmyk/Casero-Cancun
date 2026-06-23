import { demoBusinesses, type DemoBusiness } from "@/lib/demo-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BusinessMedia, BusinessProfile, Category, Location } from "@/lib/supabase/types";

type SupabaseBusinessRow = BusinessProfile & {
  business_categories?: Array<{
    categories?: Category | null;
  }> | null;
  business_locations?: Array<{
    locations?: Location | null;
  }> | null;
  business_media?: BusinessMedia[] | null;
};

const businessSelect = `
  *,
  business_categories(categories(*)),
  business_locations(locations(*)),
  business_media(*)
`;

async function withTimeout<T>(promise: PromiseLike<T>, milliseconds = 4000) {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), milliseconds);
    }),
  ]);
}

function fallbackBusinesses() {
  return demoBusinesses.map((business) => ({
    ...business,
    categories: business.categories ?? [business.category],
    locations: business.locations ?? [business.location],
    longDescription:
      business.longDescription ??
      `${business.shortDescription} Perfil demo preparado para mostrar cómo se verá un negocio publicado en Casero Cancún.`,
    mainService: business.mainService ?? business.category,
    media: business.media ?? [],
  }));
}

function buildBadges(profile: BusinessProfile) {
  return [
    profile.is_verified ? "Verificado" : null,
    profile.attends_airbnb ? "Atiende Airbnb" : null,
    profile.invoices ? "Factura" : null,
    profile.emergency_service ? "Urgencias" : null,
    profile.offers_warranty ? "Garantía" : null,
  ].filter((badge): badge is string => Boolean(badge));
}

function buildFeatures(profile: BusinessProfile) {
  return [
    profile.service_at_home ? "Servicio a domicilio" : null,
    profile.free_estimate ? "Presupuesto sin costo" : null,
    profile.service_24_7 ? "Atención 24/7" : null,
    profile.by_appointment ? "Con cita previa" : null,
    profile.accepts_card ? "Acepta tarjeta" : null,
    profile.accepts_transfer ? "Acepta transferencia" : null,
    profile.attends_condos ? "Atiende condominios" : null,
    profile.retail_sales ? "Venta al público" : null,
    profile.wholesale_sales ? "Venta por mayoreo" : null,
    profile.delivery_available ? "Entrega a domicilio" : null,
    profile.authorized_distributor ? "Distribuidor autorizado" : null,
    profile.pet_veterinary_service ? "Atención veterinaria" : null,
    profile.pet_grooming ? "Estética / baño y corte" : null,
    profile.pet_daycare ? "Guardería" : null,
    profile.pet_food_accessories ? "Alimentos o accesorios" : null,
    profile.auto_tow_service ? "Grúa disponible" : null,
    profile.auto_diagnostics ? "Diagnóstico" : null,
    profile.auto_parts ? "Refacciones" : null,
    profile.auto_wash_detailing ? "Lavado / detallado" : null,
  ].filter((feature): feature is string => Boolean(feature));
}

function mapSupabaseBusiness(row: SupabaseBusinessRow): DemoBusiness {
  const categories =
    row.business_categories?.map((item) => item.categories?.name).filter((name): name is string => Boolean(name)) ??
    [];
  const locations =
    row.business_locations?.map((item) => item.locations?.name).filter((name): name is string => Boolean(name)) ?? [];
  const category = categories[0] ?? row.main_service ?? "Servicio local";
  const location = locations[0] ?? row.address ?? "Cancún y alrededores";
  const media =
    row.business_media
      ?.slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((item) => ({
        id: item.id,
        url: item.url,
        type: item.type ?? "image",
        alt: item.alt,
        sortOrder: item.sort_order ?? 0,
      })) ?? [];

  return {
    id: row.id,
    name: row.business_name,
    slug: row.slug,
    profileType: row.profile_type,
    category,
    categories: categories.length > 0 ? categories : [category],
    location,
    locations: locations.length > 0 ? locations : [location],
    shortDescription: row.short_description ?? row.long_description ?? "Negocio local publicado en Casero Cancún.",
    longDescription: row.long_description ?? row.short_description ?? undefined,
    mainService: row.main_service ?? category,
    whatsapp: row.whatsapp ?? row.phone ?? "",
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    website: row.website ?? undefined,
    address: row.address ?? undefined,
    postalCode: row.postal_code ?? undefined,
    showMap: Boolean(row.show_map),
    hasPhysicalLocation: Boolean(row.has_physical_location),
    locationMode: row.location_mode ?? undefined,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    features: buildFeatures(row),
    badges: buildBadges(row),
    rating: 0,
    reviewCount: 0,
    featured: Boolean(row.is_featured),
    verified: Boolean(row.is_verified),
    media,
  };
}

async function getSupabasePublishedBusinesses() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const result = await withTimeout(
    supabase
      .from("business_profiles")
      .select(businessSelect)
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false }),
  );

  if (!result) {
    return null;
  }

  const { data, error } = result;

  if (error || !data) {
    return null;
  }

  return (data as SupabaseBusinessRow[]).map(mapSupabaseBusiness);
}

export async function getPublishedBusinesses() {
  const businesses = await getSupabasePublishedBusinesses();
  return businesses ?? fallbackBusinesses();
}

export async function getBusinessBySlug(slug: string) {
  const supabase = createSupabaseServerClient();

  if (supabase) {
    const result = await withTimeout(
      supabase
        .from("business_profiles")
        .select(businessSelect)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle(),
    );

    if (!result) {
      return fallbackBusinesses().find((business) => business.slug === slug) ?? null;
    }

    const { data, error } = result;

    if (!error && data) {
      return mapSupabaseBusiness(data as SupabaseBusinessRow);
    }
  }

  return fallbackBusinesses().find((business) => business.slug === slug) ?? null;
}

export async function getBusinessesByCategory(slug: string) {
  const businesses = await getPublishedBusinesses();
  const normalizedSlug = slug.toLowerCase();

  return businesses.filter((business) => {
    const categorySlug = business.category
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return categorySlug === normalizedSlug;
  });
}

export async function getBusinessesByLocation(slug: string) {
  const businesses = await getPublishedBusinesses();
  const normalizedSlug = slug.toLowerCase();

  return businesses.filter((business) => {
    const locationSlug = business.location
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return locationSlug === normalizedSlug;
  });
}
