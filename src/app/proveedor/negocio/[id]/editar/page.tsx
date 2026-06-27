import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ProviderBusinessEditForm, type ProviderEditableBusiness } from "@/components/provider/ProviderBusinessEditForm";
import { createSupabaseAuthServerClient } from "@/lib/auth/admin";
import { getProviderAccess } from "@/lib/auth/provider";
import { getRegistrationOptions } from "@/lib/data/registration";
import type { BusinessMedia, BusinessProfile, Category, Location, Plan } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Editar negocio | Casero Cancun",
  description: "Edicion de negocio para proveedores de Casero Cancun.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type EditBusinessRow = BusinessProfile & {
  plans?: Pick<Plan, "slug"> | null;
  business_categories?: Array<{ categories?: Pick<Category, "id"> | null }> | null;
  business_locations?: Array<{ locations?: Pick<Location, "id"> | null }> | null;
  business_media?: Array<Pick<BusinessMedia, "id" | "url" | "alt" | "sort_order">> | null;
};

type EditPageProps = {
  params: Promise<{ id: string }>;
};

function mapEditableBusiness(row: EditBusinessRow): ProviderEditableBusiness {
  return {
    id: row.id,
    business_name: row.business_name,
    slug: row.slug,
    status: row.status,
    profile_type: row.profile_type,
    section: row.section,
    whatsapp: row.whatsapp,
    phone: row.phone,
    email: row.email,
    short_description: row.short_description,
    long_description: row.long_description,
    main_service: row.main_service,
    address: row.address,
    postal_code: row.postal_code,
    has_physical_location: row.has_physical_location,
    location_mode: row.location_mode,
    show_map: row.show_map,
    latitude: row.latitude,
    longitude: row.longitude,
    invoices: row.invoices,
    emergency_service: row.emergency_service,
    service_24_7: row.service_24_7,
    by_appointment: row.by_appointment,
    service_at_home: row.service_at_home,
    free_estimate: row.free_estimate,
    accepts_card: row.accepts_card,
    accepts_transfer: row.accepts_transfer,
    attends_airbnb: row.attends_airbnb,
    attends_condos: row.attends_condos,
    offers_warranty: row.offers_warranty,
    retail_sales: row.retail_sales,
    wholesale_sales: row.wholesale_sales,
    delivery_available: row.delivery_available,
    authorized_distributor: row.authorized_distributor,
    pet_veterinary_service: row.pet_veterinary_service,
    pet_grooming: row.pet_grooming,
    pet_daycare: row.pet_daycare,
    pet_food_accessories: row.pet_food_accessories,
    auto_tow_service: row.auto_tow_service,
    auto_diagnostics: row.auto_diagnostics,
    auto_parts: row.auto_parts,
    auto_wash_detailing: row.auto_wash_detailing,
    categoryIds:
      row.business_categories
        ?.map((item) => item.categories?.id)
        .filter((id): id is string => Boolean(id)) ?? [],
    locationIds:
      row.business_locations
        ?.map((item) => item.locations?.id)
        .filter((id): id is string => Boolean(id)) ?? [],
    planSlug: row.plans?.slug ?? null,
    media:
      row.business_media
        ?.slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) ?? [],
  };
}

export default async function ProviderBusinessEditPage({ params }: EditPageProps) {
  const { id } = await params;
  const providerAccess = await getProviderAccess();

  if (providerAccess.status === "unauthenticated") {
    redirect("/proveedor/login");
  }

  if (providerAccess.status === "forbidden") {
    return (
      <section className="container-page grid min-h-[calc(100vh-4rem)] place-items-center py-8 sm:py-12">
        <div className="w-full max-w-lg rounded-lg border border-red-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-red-700">Acceso no permitido</p>
          <h1 className="mt-3 font-heading text-2xl font-extrabold text-casero-dark">Esta cuenta no es de proveedor</h1>
          <p className="mt-3 text-sm leading-6 text-casero-text/70">
            Para editar un negocio necesitas una cuenta con rol de proveedor.
          </p>
          <Button href="/proveedor/login" className="mt-5" variant="secondary">
            Ir al login de proveedor
          </Button>
        </div>
      </section>
    );
  }

  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    notFound();
  }

  const [{ data: business, error }, registrationOptions] = await Promise.all([
    supabase
      .from("business_profiles")
      .select(
        `
        *,
        plans(slug),
        business_categories(categories(id)),
        business_locations(locations(id)),
        business_media(id,url,alt,sort_order)
      `,
      )
      .eq("id", id)
      .eq("owner_user_id", providerAccess.session.user.id)
      .maybeSingle(),
    getRegistrationOptions(),
  ]);

  if (error) {
    console.error("provider edit business load failed", {
      businessId: id,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error,
    });
  }

  if (!business) {
    notFound();
  }

  return (
    <section className="container-page py-8 sm:py-12">
      <div className="mb-6 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-casero-green">Editar negocio</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-casero-dark sm:text-4xl">
          Actualiza la informacion de {business.business_name}
        </h1>
        <p className="mt-3 text-sm leading-6 text-casero-text/70">
          Al guardar, el negocio volvera a revision y no se mostrara publicamente hasta que Casero Cancun lo apruebe.
        </p>
      </div>
      <ProviderBusinessEditForm
        business={mapEditableBusiness(business as EditBusinessRow)}
        categories={registrationOptions.categories}
        locations={registrationOptions.locations}
      />
    </section>
  );
}
