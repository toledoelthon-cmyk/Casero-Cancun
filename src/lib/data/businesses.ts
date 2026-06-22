import { demoBusinesses, type DemoBusiness } from "@/lib/demo-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BusinessProfile, Category, Location } from "@/lib/supabase/types";

type SupabaseBusinessRow = BusinessProfile & {
  business_categories?: Array<{
    categories?: Category | null;
  }> | null;
  business_locations?: Array<{
    locations?: Location | null;
  }> | null;
};

const businessSelect = `
  *,
  business_categories(categories(*)),
  business_locations(locations(*))
`;

function fallbackBusinesses() {
  return demoBusinesses;
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

function mapSupabaseBusiness(row: SupabaseBusinessRow): DemoBusiness {
  const category = row.business_categories?.[0]?.categories?.name ?? row.main_service ?? "Servicio local";
  const location = row.business_locations?.[0]?.locations?.name ?? row.address ?? "Cancún y alrededores";

  return {
    id: row.id,
    name: row.business_name,
    slug: row.slug,
    profileType: row.profile_type,
    category,
    location,
    shortDescription: row.short_description ?? row.long_description ?? "Negocio local publicado en Casero Cancún.",
    whatsapp: row.whatsapp ?? row.phone ?? "",
    badges: buildBadges(row),
    rating: 0,
    reviewCount: 0,
    featured: row.is_featured,
    verified: row.is_verified,
  };
}

async function getSupabasePublishedBusinesses() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("business_profiles")
    .select(businessSelect)
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

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
    const { data, error } = await supabase
      .from("business_profiles")
      .select(businessSelect)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

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
