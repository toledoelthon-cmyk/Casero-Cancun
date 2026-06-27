import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ProviderPanel } from "@/components/provider/ProviderPanel";
import { createSupabaseAuthServerClient } from "@/lib/auth/admin";
import { getProviderAccess } from "@/lib/auth/provider";
import type { BusinessMedia, BusinessProfile, Category, Location, Plan } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Panel proveedor | Casero Cancun",
  description: "Panel para proveedores registrados en Casero Cancun.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export type ProviderBusiness = Pick<
  BusinessProfile,
  "id" | "business_name" | "slug" | "status" | "section" | "created_at" | "updated_at" | "membership_status" | "membership_expires_at" | "trial_ends_at" | "payment_status" | "next_payment_due_at" | "last_payment_at" | "payment_exempt_reason" | "payment_exempt_until"
> & {
  plan?: Pick<Plan, "id" | "name" | "slug"> | null;
  categories: Pick<Category, "id" | "name" | "slug">[];
  locations: Pick<Location, "id" | "name" | "slug">[];
  primaryMedia?: Pick<BusinessMedia, "id" | "url" | "alt" | "sort_order"> | null;
};

type ProviderBusinessRow = Pick<
  BusinessProfile,
  "id" | "business_name" | "slug" | "status" | "section" | "created_at" | "updated_at" | "membership_status" | "membership_expires_at" | "trial_ends_at" | "payment_status" | "next_payment_due_at" | "last_payment_at" | "payment_exempt_reason" | "payment_exempt_until"
> & {
  plans?: Pick<Plan, "id" | "name" | "slug"> | null;
  business_categories?: Array<{
    categories?: Pick<Category, "id" | "name" | "slug"> | null;
  }> | null;
  business_locations?: Array<{
    locations?: Pick<Location, "id" | "name" | "slug"> | null;
  }> | null;
  business_media?: Array<Pick<BusinessMedia, "id" | "url" | "alt" | "sort_order">> | null;
};


type ProviderPanelPageProps = {
  searchParams?: Promise<{ actualizado?: string }>;
};

function getProviderUpdateMessage(code: string | undefined) {
  if (code === "published") {
    return "Tus cambios fueron enviados a revision. La publicacion quedara pendiente hasta que Casero Cancun la apruebe nuevamente.";
  }

  if (code === "pending") {
    return "Tus cambios fueron actualizados y siguen en revision.";
  }

  if (code === "rejected") {
    return "Tu negocio fue reenviado a revision.";
  }

  if (code === "updated") {
    return "Tus cambios fueron enviados a revision.";
  }

  return null;
}
function mapProviderBusiness(row: ProviderBusinessRow): ProviderBusiness {
  const categories =
    row.business_categories
      ?.map((item) => item.categories)
      .filter((category): category is Pick<Category, "id" | "name" | "slug"> => Boolean(category)) ?? [];
  const locations =
    row.business_locations
      ?.map((item) => item.locations)
      .filter((location): location is Pick<Location, "id" | "name" | "slug"> => Boolean(location)) ?? [];
  const primaryMedia =
    row.business_media
      ?.slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .find((media) => Boolean(media.url?.trim())) ?? null;

  return {
    id: row.id,
    business_name: row.business_name,
    slug: row.slug,
    status: row.status,
    section: row.section,
    created_at: row.created_at,
    updated_at: row.updated_at,
    membership_status: row.membership_status,
    membership_expires_at: row.membership_expires_at,
    trial_ends_at: row.trial_ends_at,
    payment_status: row.payment_status,
    next_payment_due_at: row.next_payment_due_at,
    last_payment_at: row.last_payment_at,
    payment_exempt_reason: row.payment_exempt_reason,
    payment_exempt_until: row.payment_exempt_until,
    plan: row.plans ?? null,
    categories,
    locations,
    primaryMedia,
  };
}

export default async function ProviderPanelPage({ searchParams }: ProviderPanelPageProps) {
  const resolvedSearchParams = await searchParams;
  const updateMessage = getProviderUpdateMessage(resolvedSearchParams?.actualizado);
  const providerAccess = await getProviderAccess();

  if (providerAccess.status === "unauthenticated") {
    redirect("/proveedor/login");
  }

  if (providerAccess.status === "forbidden") {
    return (
      <section className="container-page grid min-h-[calc(100vh-4rem)] place-items-center py-8 sm:py-12">
        <div className="w-full max-w-lg rounded-lg border border-red-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-red-700">Acceso no permitido</p>
          <h1 className="mt-3 font-heading text-2xl font-extrabold text-casero-dark">
            Esta cuenta no es de proveedor
          </h1>
          <p className="mt-3 text-sm leading-6 text-casero-text/70">
            Para entrar al panel necesitas una cuenta con rol de proveedor. Las cuentas admin deben usar el panel administrativo.
          </p>
          <Button href="/proveedor/login" className="mt-5" variant="secondary">
            Ir al login de proveedor
          </Button>
        </div>
      </section>
    );
  }

  const supabase = await createSupabaseAuthServerClient();
  const { data: businesses, error } = supabase
    ? await supabase
        .from("business_profiles")
        .select(
          `
          id,
          business_name,
          slug,
          status,
          section,
          created_at,
          updated_at,
          membership_status,
          membership_expires_at,
          trial_ends_at,
          payment_status,
          next_payment_due_at,
          last_payment_at,
          payment_exempt_reason,
          payment_exempt_until,
          plans(id,name,slug),
          business_categories(categories(id,name,slug)),
          business_locations(locations(id,name,slug)),
          business_media(id,url,alt,sort_order)
        `,
        )
        .eq("owner_user_id", providerAccess.session.user.id)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  if (error) {
    console.error("provider businesses load failed", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error,
    });
  }

  return (
    <ProviderPanel
      profile={providerAccess.session.profile}
      businesses={(businesses as ProviderBusinessRow[] | null | undefined)?.map(mapProviderBusiness) ?? []}
      updateMessage={updateMessage}
    />
  );
}


