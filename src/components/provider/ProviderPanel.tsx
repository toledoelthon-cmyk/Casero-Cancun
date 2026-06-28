"use client";

import { CalendarDays, CarFront, Home, ImageIcon, MapPin, PawPrint, Store, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getManualPaymentLinks } from "@/lib/payments/manual-payment";
import type { UserProfile } from "@/lib/supabase/types";
import type { ProviderBusiness } from "@/app/proveedor/panel/page";

type ProviderPanelProps = {
  profile: UserProfile;
  businesses: ProviderBusiness[];
  updateMessage?: string | null;
};

const statusLabels = {
  pending: "En revision",
  published: "Publicado",
  paused: "Pausado",
  rejected: "Rechazado",
} as const;

const membershipLabels: Record<string, string> = {
  trial: "Prueba gratis",
  active: "Activa",
  past_due: "Pago pendiente",
  expired: "Vencida",
  cancelled: "Cancelada",
  manual_review: "Pendiente de activacion",
  exempt: "Exento de pago",
};

const paymentLabels: Record<string, string> = {
  unpaid: "Sin pagar",
  paid: "Pagado",
  pending: "Pendiente",
  failed: "Fallido",
  refunded: "Reembolsado",
  manual: "Manual",
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  published: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  paused: "bg-slate-100 text-slate-700 ring-slate-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
};

const externalPaymentButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-md px-3 py-2 text-xs font-bold transition";

const sectionLabels = {
  home_services: "Servicios del hogar",
  stores_materials: "Tiendas y materiales",
  pets: "Mascotas",
  auto_services: "Servicios para tu auto",
} as const;

function formatDate(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function isUsableImageUrl(url: string | null | undefined) {
  if (!url?.trim()) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
  } catch {
    return url.startsWith("/");
  }
}

function getMembershipMessage(business: ProviderBusiness) {
  const membershipStatus = business.membership_status ?? "manual_review";

  if (membershipStatus === "trial") {
    return `Prueba gratis activa hasta ${formatDate(business.trial_ends_at ?? business.membership_expires_at)}`;
  }

  if (membershipStatus === "active") {
    return `Membresia activa hasta ${formatDate(business.membership_expires_at)}`;
  }

  if (membershipStatus === "past_due") {
    return "Pago pendiente. Tu membresia requiere atencion.";
  }

  if (membershipStatus === "expired") {
    return "Membresia vencida";
  }

  if (membershipStatus === "cancelled") {
    return "Membresia cancelada";
  }

  if (membershipStatus === "exempt") {
    return business.payment_exempt_until
      ? `Membresia exenta de pago hasta ${formatDate(business.payment_exempt_until)}`
      : "Membresia exenta de pago";
  }

  return "Pendiente de activacion";
}


function getPlaceholderMeta(section: ProviderBusiness["section"]) {
  if (section === "stores_materials") {
    return { Icon: Store, label: "Tienda" };
  }

  if (section === "pets") {
    return { Icon: PawPrint, label: "Mascotas" };
  }

  if (section === "auto_services") {
    return { Icon: CarFront, label: "Auto" };
  }

  if (section === "home_services") {
    return { Icon: Home, label: "Hogar" };
  }

  return { Icon: Wrench, label: "Negocio" };
}

function BusinessImage({ business }: { business: ProviderBusiness }) {
  const imageUrl = business.primaryMedia?.url;

  if (isUsableImageUrl(imageUrl)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={business.primaryMedia?.alt || business.business_name}
        className="h-full w-full object-cover"
      />
    );
  }

  const { Icon, label } = getPlaceholderMeta(business.section);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-casero-turquoise/15 via-casero-beige to-casero-orange/20 p-5 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-md bg-white/85 text-casero-green shadow-sm">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-casero-text/55">{label}</p>
      <ImageIcon className="mt-2 h-4 w-4 text-casero-text/35" aria-hidden />
    </div>
  );
}

function shouldShowPaymentActivation(business: ProviderBusiness) {
  const membershipStatus = business.membership_status ?? "manual_review";
  const paymentStatus = business.payment_status ?? "unpaid";

  return ["manual_review", "expired", "cancelled", "past_due"].includes(membershipStatus) || ["unpaid", "pending", "failed"].includes(paymentStatus);
}

function PaymentActivationBox({ business }: { business: ProviderBusiness }) {
  if (!shouldShowPaymentActivation(business)) {
    return null;
  }

  const planName = business.plan?.name ?? "Sin plan asignado";
  const message = `Hola, soy proveedor de Casero Cancún. Ya realicé el pago por CoDi o transferencia para el negocio ${business.business_name}, plan ${planName}. Quiero enviar mi comprobante para activar mi publicación.`;
  const manualPayment = getManualPaymentLinks(business.plan, message);

  return (
    <div className="mt-5 rounded-md border border-casero-orange/25 bg-casero-orange/10 p-4 text-sm">
      <p className="font-heading text-lg font-extrabold text-casero-dark">Activa tu membresía</p>
      <p className="mt-2 leading-6 text-casero-text/75">
        {manualPayment.hasCodiQr
          ? "Escanea el QR con la app de tu banco y envíanos el comprobante por WhatsApp."
          : "Solicita los datos de pago por WhatsApp y envíanos tu comprobante para activar tu publicación."}
      </p>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-casero-text/55">Plan: {planName}</p>
      {manualPayment.paymentUrl ? (
        <a className={`${externalPaymentButtonClass} mt-3 bg-casero-orange text-casero-dark shadow-sm hover:bg-amber-400`} href={manualPayment.paymentUrl} target="_blank" rel="noreferrer">
          Pagar con Mercado Pago
        </a>
      ) : null}
      {manualPayment.hasCodiQr ? (
        <div className="mt-4 rounded-md bg-white p-4 text-center shadow-sm">
          <p className="font-heading text-base font-extrabold text-casero-dark">Pagar con CoDi</p>
          <div className="mt-3 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={manualPayment.codiQrUrl ?? ""} alt={`QR CoDi para plan ${planName}`} className="h-44 w-44 rounded-md border border-casero-dark/10 bg-white object-contain p-2" />
          </div>
          <p className="mt-3 text-xs font-semibold text-casero-text/65">La activación no es automática. Tu pago será validado manualmente.</p>
        </div>
      ) : null}
      <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
        <a className={`${externalPaymentButtonClass} bg-casero-green text-white shadow-sm hover:bg-emerald-700`} href={manualPayment.whatsappUrl} target="_blank" rel="noreferrer">
          {manualPayment.hasCodiQr || manualPayment.paymentUrl ? "Enviar comprobante por WhatsApp" : "Solicitar datos de pago por WhatsApp"}
        </a>
      </div>
    </div>
  );
}

function ViewStatsSummary({ stats }: { stats: ProviderBusiness["viewStats"] }) {
  const items = [
    ["Totales", stats.total],
    ["7 dias", stats.last7Days],
    ["30 dias", stats.last30Days],
  ] as const;

  return (
    <div className="mt-5 grid grid-cols-3 gap-2 rounded-md border border-casero-dark/10 bg-white p-3 text-center">
      {items.map(([label, value]) => (
        <div key={label}>
          <p className="font-heading text-lg font-extrabold text-casero-dark">{value}</p>
          <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-casero-text/50">{label}</p>
        </div>
      ))}
    </div>
  );
}
function ProviderBusinessCard({ business }: { business: ProviderBusiness }) {
  const status = business.status ?? "pending";
  const statusLabel = statusLabels[status as keyof typeof statusLabels] ?? "En revision";
  const sectionLabel = business.section ? sectionLabels[business.section] : "Sin seccion";
  const categories = business.categories.map((category) => category.name);
  const locations = business.locations.map((location) => location.name);
  const membershipStatus = business.membership_status ?? "manual_review";
  const paymentStatus = business.payment_status ?? "unpaid";

  return (
    <article className="overflow-hidden rounded-lg border border-casero-dark/10 bg-white shadow-sm">
      <div className="aspect-[4/3] overflow-hidden bg-casero-background sm:aspect-video">
        <BusinessImage business={business} />
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-heading text-xl font-extrabold leading-tight text-casero-dark">{business.business_name}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-casero-text/60">
              <CalendarDays className="h-4 w-4" aria-hidden />
              Registrado: {formatDate(business.created_at)}
            </p>
          </div>
          <span
            className={`w-fit rounded-md px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ring-1 ${
              statusStyles[status] ?? statusStyles.pending
            }`}
          >
            {statusLabel}
          </span>
        </div>

        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-bold text-casero-dark">Plan</dt>
            <dd className="mt-1 text-casero-text/70">{business.plan?.name ?? "Sin plan asignado"}</dd>
          </div>
          <div>
            <dt className="font-bold text-casero-dark">Seccion</dt>
            <dd className="mt-1 text-casero-text/70">{sectionLabel}</dd>
          </div>
        </dl>

        <div className="mt-5 rounded-md bg-casero-background p-3 text-sm">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-casero-green/10 px-2.5 py-1 text-xs font-bold text-casero-green">
              {membershipLabels[membershipStatus] ?? membershipStatus}
            </span>
            <span className="rounded-md bg-casero-beige px-2.5 py-1 text-xs font-bold text-casero-dark">
              Pago: {paymentLabels[paymentStatus] ?? paymentStatus}
            </span>
          </div>
          <p className="mt-2 font-semibold text-casero-text/75">{getMembershipMessage(business)}</p>
          {business.next_payment_due_at ? (
            <p className="mt-1 text-xs font-semibold text-casero-text/55">Proximo pago: {formatDate(business.next_payment_due_at)}</p>
          ) : null}
        </div>

        <ViewStatsSummary stats={business.viewStats} />
        <PaymentActivationBox business={business} />

        <div className="mt-5 grid gap-4">
          <div>
            <p className="text-sm font-bold text-casero-dark">Categorias</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <span key={category} className="rounded-md bg-casero-turquoise/12 px-3 py-1 text-xs font-semibold text-casero-green">
                    {category}
                  </span>
                ))
              ) : (
                <span className="text-sm text-casero-text/60">Sin categorias</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-casero-dark">Zonas</p>
            <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-casero-text/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{locations.length > 0 ? locations.join(", ") : "Sin zonas asignadas"}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {status === "published" ? (
            <Button href={`/negocio/${business.slug}`} variant="secondary">
              Ver perfil publico
            </Button>
          ) : null}
          <Button href={`/proveedor/negocio/${business.id}/editar`} variant="outline">
            Editar informacion
          </Button>
          {status === "rejected" ? (
            <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700 sm:col-span-2">
              Contacta a Casero Cancun para mas informacion.
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ProviderPanel({ profile, businesses, updateMessage }: ProviderPanelProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();

    if (supabase) {
      await supabase.auth.signOut();
    }

    router.replace("/proveedor/login");
    router.refresh();
  }

  return (
    <section className="container-page py-8 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-casero-green">Panel proveedor</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold text-casero-dark sm:text-4xl">
            Hola, {profile.full_name || profile.email || "proveedor"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-casero-text/70">
            Revisa tus negocios registrados, su estado de publicacion y las acciones disponibles.
          </p>
        </div>
        <div className="grid gap-2 sm:flex sm:items-center">
          <Button href="/registrar-mi-negocio" variant="primary">
            Registrar otro negocio
          </Button>
          <Button type="button" variant="outline" onClick={handleSignOut}>
            Cerrar sesion
          </Button>
        </div>
      </div>

      {updateMessage ? (
        <div className="mt-6 rounded-md border border-casero-green/20 bg-casero-green/10 p-4 text-sm font-semibold text-casero-green">
          {updateMessage}
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {businesses.length > 0 ? (
          businesses.map((business) => <ProviderBusinessCard key={business.id} business={business} />)
        ) : (
          <div className="rounded-lg border border-dashed border-casero-dark/20 bg-white p-5 sm:p-7 lg:col-span-2">
            <h2 className="font-heading text-xl font-extrabold text-casero-dark">Aun no tienes negocios registrados.</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-casero-text/70">
              Registra tu negocio para que el equipo de Casero Cancun pueda revisarlo y prepararlo para publicacion.
            </p>
            <Button href="/registrar-mi-negocio" className="mt-4" variant="primary">
              Registrar mi negocio
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}








