import {
  categories as demoCategories,
  demoBusinesses,
  locations as demoLocations,
  type CategorySection,
  type DemoBusiness,
} from "@/lib/demo-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BusinessMedia, BusinessProfile, Category, Location } from "@/lib/supabase/types";
import { slugify } from "@/lib/utils/slugify";

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

function getDemoBusinessSection(business: DemoBusiness) {
  return (
    business.section ??
    demoCategories.find((category) => category.name === business.category || business.categories?.includes(category.name))?.section
  );
}

function fallbackBusinesses() {
  return demoBusinesses.map((business) => {
    const categoryNames = business.categories ?? [business.category];
    const locationNames = business.locations ?? [business.location];

    return {
      ...business,
      section: getDemoBusinessSection(business),
      categories: categoryNames,
      categorySlugs:
        business.categorySlugs ??
        categoryNames.map((categoryName) => demoCategories.find((category) => category.name === categoryName)?.slug ?? slugify(categoryName)),
      locations: locationNames,
      locationSlugs:
        business.locationSlugs ??
        locationNames.map((locationName) => demoLocations.find((location) => location.name === locationName)?.slug ?? slugify(locationName)),
      longDescription:
        business.longDescription ??
        `${business.shortDescription} Perfil demo preparado para mostrar como se vera un negocio publicado en Casero Cancun.`,
      mainService: business.mainService ?? business.category,
      media: business.media ?? [],
    };
  });
}

function buildBadges(profile: BusinessProfile) {
  return [
    profile.is_verified ? "Verificado" : null,
    profile.attends_airbnb ? "Atiende Airbnb" : null,
    profile.invoices ? "Factura" : null,
    profile.emergency_service ? "Urgencias" : null,
    profile.offers_warranty ? "Garantia" : null,
  ].filter((badge): badge is string => Boolean(badge));
}

function buildFeatures(profile: BusinessProfile) {
  return [
    profile.service_at_home ? "Servicio a domicilio" : null,
    profile.free_estimate ? "Presupuesto sin costo" : null,
    profile.service_24_7 ? "Atencion 24/7" : null,
    profile.by_appointment ? "Con cita previa" : null,
    profile.accepts_card ? "Acepta tarjeta" : null,
    profile.accepts_transfer ? "Acepta transferencia" : null,
    profile.attends_condos ? "Atiende condominios" : null,
    profile.retail_sales ? "Venta al publico" : null,
    profile.wholesale_sales ? "Venta por mayoreo" : null,
    profile.delivery_available ? "Entrega a domicilio" : null,
    profile.authorized_distributor ? "Distribuidor autorizado" : null,
    profile.pet_veterinary_service ? "Atencion veterinaria" : null,
    profile.pet_grooming ? "Estetica / bano y corte" : null,
    profile.pet_daycare ? "Guarderia" : null,
    profile.pet_food_accessories ? "Alimentos o accesorios" : null,
    profile.auto_tow_service ? "Grua disponible" : null,
    profile.auto_diagnostics ? "Diagnostico" : null,
    profile.auto_parts ? "Refacciones" : null,
    profile.auto_wash_detailing ? "Lavado / detallado" : null,
  ].filter((feature): feature is string => Boolean(feature));
}

function mapSupabaseBusiness(row: SupabaseBusinessRow): DemoBusiness {
  const categoryRows =
    row.business_categories?.map((item) => item.categories).filter((category): category is Category => Boolean(category?.name)) ?? [];
  const locationRows =
    row.business_locations?.map((item) => item.locations).filter((location): location is Location => Boolean(location?.name)) ?? [];
  const categoryNames = categoryRows.map((category) => category.name);
  const locationNames = locationRows.map((location) => location.name);
  const category = categoryNames[0] ?? row.main_service ?? "Servicio local";
  const location = locationNames[0] ?? row.address ?? "Cancun y alrededores";
  const section = row.section ?? categoryRows.find((categoryItem) => categoryItem.section)?.section ?? undefined;
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
    section,
    category,
    categorySlugs: categoryRows.map((categoryItem) => categoryItem.slug),
    categories: categoryNames.length > 0 ? categoryNames : [category],
    location,
    locationSlugs: locationRows.map((locationItem) => locationItem.slug),
    locations: locationNames.length > 0 ? locationNames : [location],
    shortDescription: row.short_description ?? row.long_description ?? "Negocio local publicado en Casero Cancun.",
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

export async function getPublishedBusinessBySlug(slug: string) {
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

export async function getBusinessBySlug(slug: string) {
  return getPublishedBusinessBySlug(slug);
}

export async function getPublishedBusinessesBySection(section: CategorySection) {
  const businesses = await getPublishedBusinesses();
  return businesses.filter((business) => business.section === section);
}

export async function getPublishedBusinessesByCategory(slug: string) {
  const businesses = await getPublishedBusinesses();
  const normalizedSlug = slug.toLowerCase();

  return businesses.filter((business) => {
    const categorySlugs = business.categorySlugs ?? (business.categories ?? [business.category]).map(slugify);
    return categorySlugs.includes(normalizedSlug);
  });
}

export async function getBusinessesByCategory(slug: string) {
  return getPublishedBusinessesByCategory(slug);
}

export async function getPublishedBusinessesByLocation(slug: string) {
  const businesses = await getPublishedBusinesses();
  const normalizedSlug = slug.toLowerCase();

  return businesses.filter((business) => {
    const locationSlugs = business.locationSlugs ?? (business.locations ?? [business.location]).map(slugify);
    return locationSlugs.includes(normalizedSlug);
  });
}

export async function getBusinessesByLocation(slug: string) {
  return getPublishedBusinessesByLocation(slug);
}
