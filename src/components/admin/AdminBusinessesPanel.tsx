"use client";

import Link from "next/link";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { BusinessMap } from "@/components/maps/BusinessMap";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getBusinessViewStatsForBusinesses, type BusinessViewStats } from "@/lib/data/business-view-stats";
import type { BusinessProfileInsert, CategorySection, LocationMode, MembershipStatus, PaymentStatus, ProfileType, PublicationStatus } from "@/lib/supabase/types";

type RelatedCategory = {
  id: string;
  name: string | null;
  slug: string | null;
  section: CategorySection | null;
};

type RelatedLocation = {
  id: string;
  name: string | null;
  slug: string | null;
};

type AdminPlanOption = {
  id: string;
  name: string;
  slug: string;
  max_categories: number | null;
  max_photos: number | null;
};

type AdminCategoryOption = {
  id: string;
  name: string;
  slug: string;
  section: CategorySection | null;
};

type AdminLocationOption = {
  id: string;
  name: string;
  slug: string;
};

type MediaItem = {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number | null;
};

type AdminBusiness = {
  id: string;
  business_name: string;
  responsible_name: string | null;
  slug: string;
  profile_type: ProfileType;
  section: CategorySection | null;
  short_description: string | null;
  long_description: string | null;
  whatsapp: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  postal_code: string | null;
  has_physical_location: boolean;
  location_mode: LocationMode | null;
  show_map: boolean;
  latitude: number | null;
  longitude: number | null;
  status: PublicationStatus;
  is_featured: boolean;
  is_verified: boolean;
  accepts_card: boolean;
  accepts_transfer: boolean;
  invoices: boolean;
  emergency_service: boolean;
  attends_airbnb: boolean;
  attends_condos: boolean;
  offers_warranty: boolean;
  service_24_7: boolean;
  by_appointment: boolean;
  service_at_home: boolean;
  free_estimate: boolean;
  retail_sales: boolean;
  wholesale_sales: boolean;
  delivery_available: boolean;
  authorized_distributor: boolean;
  pet_veterinary_service: boolean;
  pet_grooming: boolean;
  pet_daycare: boolean;
  pet_food_accessories: boolean;
  auto_tow_service: boolean;
  auto_diagnostics: boolean;
  auto_parts: boolean;
  auto_wash_detailing: boolean;
  created_at: string | null;
  plan_id: string | null;
  planName: string | null;
  membership_status: MembershipStatus | null;
  membership_started_at: string | null;
  membership_expires_at: string | null;
  trial_ends_at: string | null;
  payment_status: PaymentStatus | null;
  last_payment_at: string | null;
  next_payment_due_at: string | null;
  payment_exempt_reason: string | null;
  payment_exempt_until: string | null;
  categories: RelatedCategory[];
  locations: RelatedLocation[];
  media: MediaItem[];
  viewStats: BusinessViewStats;
};

type AdminBusinessRow = {
  id: string;
  business_name: string;
  responsible_name: string | null;
  slug: string;
  profile_type: ProfileType;
  section: CategorySection | null;
  short_description: string | null;
  long_description: string | null;
  whatsapp: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  postal_code: string | null;
  has_physical_location: boolean | null;
  location_mode: LocationMode | null;
  show_map: boolean | null;
  latitude: number | null;
  longitude: number | null;
  status: PublicationStatus | null;
  is_featured: boolean | null;
  is_verified: boolean | null;
  accepts_card: boolean | null;
  accepts_transfer: boolean | null;
  invoices: boolean | null;
  emergency_service: boolean | null;
  attends_airbnb: boolean | null;
  attends_condos: boolean | null;
  offers_warranty: boolean | null;
  service_24_7: boolean | null;
  by_appointment: boolean | null;
  service_at_home: boolean | null;
  free_estimate: boolean | null;
  retail_sales: boolean | null;
  wholesale_sales: boolean | null;
  delivery_available: boolean | null;
  authorized_distributor: boolean | null;
  pet_veterinary_service: boolean | null;
  pet_grooming: boolean | null;
  pet_daycare: boolean | null;
  pet_food_accessories: boolean | null;
  auto_tow_service: boolean | null;
  auto_diagnostics: boolean | null;
  auto_parts: boolean | null;
  auto_wash_detailing: boolean | null;
  created_at: string | null;
  plan_id: string | null;
  plans?: { name: string | null } | null;
  membership_status: MembershipStatus | null;
  membership_started_at: string | null;
  membership_expires_at: string | null;
  trial_ends_at: string | null;
  payment_status: PaymentStatus | null;
  last_payment_at: string | null;
  next_payment_due_at: string | null;
  payment_exempt_reason: string | null;
  payment_exempt_until: string | null;
  business_categories?: Array<{ categories?: RelatedCategory | null }> | null;
  business_locations?: Array<{ locations?: RelatedLocation | null }> | null;
  business_media?: MediaItem[] | null;
};

type AdminBusinessUpdate = Partial<BusinessProfileInsert>;

type StatusFilter = "all" | PublicationStatus;

const mediaStorageBucket = "business-media";
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const statusFilters: Array<{ label: string; value: StatusFilter }> = [
  { label: "Todos", value: "all" },
  { label: "Pendientes", value: "pending" },
  { label: "Publicados", value: "published" },
  { label: "Pausados", value: "paused" },
  { label: "Rechazados", value: "rejected" },
];

const statusLabels: Record<PublicationStatus, string> = {
  pending: "Pendiente",
  published: "Publicado",
  paused: "Pausado",
  rejected: "Rechazado",
};

const statusClasses: Record<PublicationStatus, string> = {
  pending: "bg-casero-orange/15 text-casero-dark",
  published: "bg-casero-green/10 text-casero-green",
  paused: "bg-slate-100 text-slate-600",
  rejected: "bg-red-50 text-red-700",
};

const sectionLabels: Record<CategorySection, string> = {
  home_services: "Servicios del hogar",
  stores_materials: "Tiendas y materiales",
  pets: "Mascotas",
  auto_services: "Servicios para tu auto",
};

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

function addDaysIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function nowIso() {
  return new Date().toISOString();
}

function membershipBadge(status: MembershipStatus | null) {
  const value = status ?? "manual_review";
  return <Badge tone={value === "active" || value === "trial" || value === "exempt" ? "green" : value === "expired" || value === "cancelled" ? "orange" : "neutral"}>{membershipLabels[value] ?? value}</Badge>;
}

function paymentBadge(status: PaymentStatus | null) {
  const value = status ?? "unpaid";
  return <Badge tone={value === "paid" || value === "manual" ? "green" : value === "failed" ? "orange" : "neutral"}>Pago: {paymentLabels[value] ?? value}</Badge>;
}


const profileTypeLabels: Record<ProfileType, string> = {
  service_provider: "Proveedor de servicio",
  material_store: "Tienda o materiales",
};

const locationModeLabels: Record<LocationMode, string> = {
  physical: "Local fÃ­sico",
  home_service: "Servicio a domicilio",
  both: "Local fÃ­sico y servicio a domicilio",
  zones_only: "Solo zonas de atenciÃ³n",
};

function mapBusiness(row: AdminBusinessRow): AdminBusiness {
  const media = [...(row.business_media ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return {
    id: row.id,
    business_name: row.business_name,
    responsible_name: row.responsible_name,
    slug: row.slug,
    profile_type: row.profile_type,
    section: row.section,
    short_description: row.short_description,
    long_description: row.long_description,
    whatsapp: row.whatsapp,
    email: row.email,
    phone: row.phone,
    website: row.website,
    address: row.address,
    postal_code: row.postal_code,
    has_physical_location: Boolean(row.has_physical_location),
    location_mode: row.location_mode,
    show_map: Boolean(row.show_map),
    latitude: row.latitude,
    longitude: row.longitude,
    status: row.status ?? "pending",
    is_featured: Boolean(row.is_featured),
    is_verified: Boolean(row.is_verified),
    accepts_card: Boolean(row.accepts_card),
    accepts_transfer: Boolean(row.accepts_transfer),
    invoices: Boolean(row.invoices),
    emergency_service: Boolean(row.emergency_service),
    attends_airbnb: Boolean(row.attends_airbnb),
    attends_condos: Boolean(row.attends_condos),
    offers_warranty: Boolean(row.offers_warranty),
    service_24_7: Boolean(row.service_24_7),
    by_appointment: Boolean(row.by_appointment),
    service_at_home: Boolean(row.service_at_home),
    free_estimate: Boolean(row.free_estimate),
    retail_sales: Boolean(row.retail_sales),
    wholesale_sales: Boolean(row.wholesale_sales),
    delivery_available: Boolean(row.delivery_available),
    authorized_distributor: Boolean(row.authorized_distributor),
    pet_veterinary_service: Boolean(row.pet_veterinary_service),
    pet_grooming: Boolean(row.pet_grooming),
    pet_daycare: Boolean(row.pet_daycare),
    pet_food_accessories: Boolean(row.pet_food_accessories),
    auto_tow_service: Boolean(row.auto_tow_service),
    auto_diagnostics: Boolean(row.auto_diagnostics),
    auto_parts: Boolean(row.auto_parts),
    auto_wash_detailing: Boolean(row.auto_wash_detailing),
    created_at: row.created_at,
    plan_id: row.plan_id,
    planName: row.plans?.name ?? null,
    membership_status: row.membership_status ?? "manual_review",
    membership_started_at: row.membership_started_at,
    membership_expires_at: row.membership_expires_at,
    trial_ends_at: row.trial_ends_at,
    payment_status: row.payment_status ?? "unpaid",
    last_payment_at: row.last_payment_at,
    next_payment_due_at: row.next_payment_due_at,
    payment_exempt_reason: row.payment_exempt_reason,
    payment_exempt_until: row.payment_exempt_until,
    categories:
      row.business_categories
        ?.map((item) => item.categories)
        .filter((category): category is RelatedCategory => Boolean(category?.name)) ?? [],
    locations:
      row.business_locations
        ?.map((item) => item.locations)
        .filter((location): location is RelatedLocation => Boolean(location?.name)) ?? [],
    media,
    viewStats: { total: 0, last7Days: 0, last30Days: 0 },
  };
}

function formatDate(value: string | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSection(business: AdminBusiness) {
  const section = business.section ?? business.categories.find((category) => category.section)?.section;
  return section ? sectionLabels[section] : "Sin secciÃ³n";
}

function getProfileTypeLabel(profileType: ProfileType) {
  return profileTypeLabels[profileType];
}

function getLocationModeLabel(locationMode: LocationMode | null) {
  return locationMode ? locationModeLabels[locationMode] : "No definido";
}

function hasCoordinates(latitude: number | null, longitude: number | null) {
  return typeof latitude === "number" && Number.isFinite(latitude) && typeof longitude === "number" && Number.isFinite(longitude);
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

function getBusinessSectionText(business: AdminBusiness) {
  const section = business.section ?? business.categories.find((category) => category.section)?.section;
  return section ? sectionLabels[section] : business.profile_type === "material_store" ? "Tiendas y materiales" : "Servicios locales";
}

function statusBadge(status: PublicationStatus) {
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

function BusinessImagePlaceholder({ business, compact = false }: { business: AdminBusiness; compact?: boolean }) {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-md bg-gradient-to-br from-casero-turquoise/15 via-casero-beige to-casero-orange/20 p-4 text-center">
      <span className={compact ? "grid h-10 w-10 place-items-center rounded-md bg-white/85 font-heading text-lg font-extrabold text-casero-green shadow-sm" : "grid h-14 w-14 place-items-center rounded-md bg-white/85 font-heading text-2xl font-extrabold text-casero-green shadow-sm"}>
        {business.business_name.charAt(0)}
      </span>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-casero-text/55">{getBusinessSectionText(business)}</p>
    </div>
  );
}

function SafeAdminImage({
  src,
  alt,
  className,
  placeholder,
}: {
  src: string | null | undefined;
  alt: string;
  className: string;
  placeholder: ReactNode;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const safeSrc = src ?? "";

  if (failed || !isUsableImageUrl(safeSrc)) {
    return <>{placeholder}</>;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={safeSrc} alt={alt} className={className} onError={() => setFailed(true)} />;
}

function BusinessImage({ business }: { business: AdminBusiness }) {
  const mainImage = business.media.find((media) => isUsableImageUrl(media.url));

  return (
    <SafeAdminImage
      src={mainImage?.url}
      alt={mainImage?.alt ?? business.business_name}
      className="aspect-video w-full rounded-md object-cover"
      placeholder={<BusinessImagePlaceholder business={business} compact />}
    />
  );
}

function AdminActions({
  business,
  disabled,
  onUpdate,
  onRequestDelete,
}: {
  business: AdminBusiness;
  disabled: boolean;
  onUpdate: (id: string, updates: AdminBusinessUpdate) => void;
  onRequestDelete: (businessId: string) => void;
}) {
  const buttonClass = "min-h-10 rounded-md px-3 py-2 text-xs font-bold disabled:opacity-50";

  return (
    <div className="grid gap-2 sm:flex sm:flex-wrap">
      <button className={`${buttonClass} bg-casero-green text-white`} disabled={disabled} type="button" onClick={() => onUpdate(business.id, { status: "published" })}>
        Aprobar
      </button>
      <button className={`${buttonClass} bg-red-600 text-white`} disabled={disabled} type="button" onClick={() => onUpdate(business.id, { status: "rejected" })}>
        Rechazar
      </button>
      <button className={`${buttonClass} bg-slate-600 text-white`} disabled={disabled} type="button" onClick={() => onUpdate(business.id, { status: "paused" })}>
        Pausar
      </button>
      <button className={`${buttonClass} border border-casero-dark/10 bg-white text-casero-dark`} disabled={disabled} type="button" onClick={() => onUpdate(business.id, { status: "pending" })}>
        Volver a pendiente
      </button>
      <button className={`${buttonClass} border border-casero-dark/10 bg-white text-casero-dark`} disabled={disabled} type="button" onClick={() => onUpdate(business.id, { is_verified: !business.is_verified })}>
        {business.is_verified ? "Quitar verificado" : "Verificar"}
      </button>
      <button className={`${buttonClass} border border-casero-dark/10 bg-white text-casero-dark`} disabled={disabled} type="button" onClick={() => onUpdate(business.id, { is_featured: !business.is_featured })}>
        {business.is_featured ? "Quitar destacado" : "Destacar"}
      </button>
      <button className={`${buttonClass} bg-casero-orange text-casero-dark`} disabled={disabled} type="button" onClick={() => { const expiresAt = addDaysIso(30); onUpdate(business.id, { membership_status: "trial", payment_status: "manual", membership_started_at: nowIso(), trial_ends_at: expiresAt, membership_expires_at: expiresAt, last_payment_at: null, next_payment_due_at: expiresAt, payment_exempt_reason: null, payment_exempt_until: null }); }}>
        Activar prueba 30 dias
      </button>
      <button className={`${buttonClass} bg-casero-green text-white`} disabled={disabled} type="button" onClick={() => { const now = nowIso(); const expiresAt = addDaysIso(30); onUpdate(business.id, { membership_status: "active", payment_status: "manual", membership_started_at: business.membership_started_at ?? now, last_payment_at: now, next_payment_due_at: expiresAt, membership_expires_at: expiresAt, trial_ends_at: null, payment_exempt_reason: null, payment_exempt_until: null }); }}>
        Activar manual 30 dias
      </button>
      <button className={`${buttonClass} border border-casero-dark/10 bg-white text-casero-dark`} disabled={disabled} type="button" onClick={() => onUpdate(business.id, { membership_status: "expired" })}>
        Marcar vencida
      </button>
      <button className={`${buttonClass} border border-casero-dark/10 bg-white text-casero-dark`} disabled={disabled} type="button" onClick={() => onUpdate(business.id, { membership_status: "cancelled" })}>
        Cancelar membresia
      </button>
      <button className={`${buttonClass} border border-casero-dark/10 bg-white text-casero-dark`} disabled={disabled} type="button" onClick={() => onUpdate(business.id, { membership_status: "exempt", payment_status: "manual", payment_exempt_reason: "Exencion manual aplicada por administrador", payment_exempt_until: null, membership_expires_at: null, trial_ends_at: null, next_payment_due_at: null })}>
        Exentar pago
      </button>
      <button className={`${buttonClass} border border-casero-dark/10 bg-white text-casero-dark`} disabled={disabled} type="button" onClick={() => onUpdate(business.id, { membership_status: "manual_review", payment_status: "unpaid", payment_exempt_reason: null, payment_exempt_until: null, membership_expires_at: null, trial_ends_at: null, next_payment_due_at: null, last_payment_at: null })}>
        Quitar exencion
      </button>
      <button className={`${buttonClass} bg-red-700 text-white ring-2 ring-red-200`} disabled={disabled} type="button" onClick={() => onRequestDelete(business.id)}>
        Eliminar
      </button>
    </div>
  );
}

function AdminViewStatsSummary({ stats }: { stats: BusinessViewStats }) {
  const items = [
    ["Visitas totales", stats.total],
    ["Ultimos 7 dias", stats.last7Days],
    ["Ultimos 30 dias", stats.last30Days],
  ] as const;

  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-md bg-casero-background p-3">
          <p className="font-heading text-2xl font-extrabold text-casero-dark">{value}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-casero-text/50">{label}</p>
        </div>
      ))}
    </div>
  );
}
function DetailModal({
  business,
  actionLoadingId,
  onClose,
  onUpdate,
  onRequestDelete,
}: {
  business: AdminBusiness;
  actionLoadingId: string | null;
  onClose: () => void;
  onUpdate: (id: string, updates: AdminBusinessUpdate) => void;
  onRequestDelete: (businessId: string) => void;
}) {
  const attributes = [
    ["Emite factura", business.invoices],
    ["Atiende urgencias", business.emergency_service],
    ["Atiende Airbnb", business.attends_airbnb],
    ["Ofrece garantÃ­a", business.offers_warranty],
    ["Acepta tarjeta", business.accepts_card],
    ["Acepta transferencia", business.accepts_transfer],
    ["Servicio a domicilio", business.service_at_home],
    ["AtenciÃ³n 24/7", business.service_24_7],
    ["Cita previa", business.by_appointment],
    ["Presupuesto sin costo", business.free_estimate],
    ["Venta al pÃºblico", business.retail_sales],
    ["Venta por mayoreo", business.wholesale_sales],
    ["Entrega a domicilio", business.delivery_available],
    ["Distribuidor autorizado", business.authorized_distributor],
    ["AtenciÃ³n veterinaria", business.pet_veterinary_service],
    ["EstÃ©tica mascotas", business.pet_grooming],
    ["GuarderÃ­a mascotas", business.pet_daycare],
    ["Alimentos/accesorios mascotas", business.pet_food_accessories],
    ["GrÃºa disponible", business.auto_tow_service],
    ["DiagnÃ³stico automotriz", business.auto_diagnostics],
    ["Refacciones", business.auto_parts],
    ["Lavado / detallado", business.auto_wash_detailing],
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-casero-dark/65 p-2 sm:p-4">
      <div className="mx-auto max-h-[calc(100vh-1rem)] max-w-5xl overflow-y-auto rounded-lg bg-casero-background p-4 shadow-soft sm:max-h-none sm:p-5 md:p-7">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              {statusBadge(business.status)}
              {business.is_verified ? <Badge tone="green">Verificado</Badge> : <Badge>No verificado</Badge>}
              {business.is_featured ? <Badge tone="orange">Destacado</Badge> : null}
              {membershipBadge(business.membership_status)}
              {paymentBadge(business.payment_status)}
            </div>
            <h2 className="mt-3 font-heading text-2xl font-extrabold text-casero-dark">{business.business_name}</h2>
            <p className="mt-1 text-sm font-semibold text-casero-text/55">/{business.slug}</p>
          </div>
          <button className="min-h-11 rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm font-bold text-casero-dark" type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <Card>
            <h3 className="font-heading text-lg font-bold text-casero-dark">InformaciÃ³n principal</h3>
            <AdminViewStatsSummary stats={business.viewStats} />
            <dl className="mt-4 grid gap-3 text-sm text-casero-text/75 sm:grid-cols-2">
              <div><dt className="font-bold text-casero-dark">Responsable</dt><dd>{business.responsible_name ?? "No capturado"}</dd></div>
              <div><dt className="font-bold text-casero-dark">WhatsApp</dt><dd>{business.whatsapp ?? "Sin WhatsApp"}</dd></div>
              <div><dt className="font-bold text-casero-dark">Correo</dt><dd>{business.email ?? "Sin correo"}</dd></div>
              <div><dt className="font-bold text-casero-dark">TelÃ©fono</dt><dd>{business.phone ?? "Sin telÃ©fono"}</dd></div>
              <div><dt className="font-bold text-casero-dark">Tipo</dt><dd>{getProfileTypeLabel(business.profile_type)}</dd></div>
              <div><dt className="font-bold text-casero-dark">SecciÃ³n</dt><dd>{getSection(business)}</dd></div>
              <div><dt className="font-bold text-casero-dark">Plan</dt><dd>{business.planName ?? business.plan_id ?? "Sin plan"}</dd></div>
              <div><dt className="font-bold text-casero-dark">Fecha</dt><dd>{formatDate(business.created_at)}</dd></div>
              <div><dt className="font-bold text-casero-dark">Estado de membresia</dt><dd>{membershipLabels[business.membership_status ?? "manual_review"]}</dd></div>
              <div><dt className="font-bold text-casero-dark">Estado de pago</dt><dd>{paymentLabels[business.payment_status ?? "unpaid"]}</dd></div>
              <div><dt className="font-bold text-casero-dark">Inicio de membresia</dt><dd>{formatDate(business.membership_started_at)}</dd></div>
              <div><dt className="font-bold text-casero-dark">Vencimiento de membresia</dt><dd>{formatDate(business.membership_expires_at)}</dd></div>
              <div><dt className="font-bold text-casero-dark">Fin de prueba gratis</dt><dd>{formatDate(business.trial_ends_at)}</dd></div>
              <div><dt className="font-bold text-casero-dark">Proximo pago</dt><dd>{formatDate(business.next_payment_due_at)}</dd></div>
              <div><dt className="font-bold text-casero-dark">Ultimo pago</dt><dd>{formatDate(business.last_payment_at)}</dd></div>
              <div><dt className="font-bold text-casero-dark">Razon de exencion</dt><dd>{business.payment_exempt_reason ?? "Sin exencion"}</dd></div>
              <div><dt className="font-bold text-casero-dark">Limite de exencion</dt><dd>{formatDate(business.payment_exempt_until)}</dd></div>
              <div><dt className="font-bold text-casero-dark">Modo de ubicaciÃ³n</dt><dd>{getLocationModeLabel(business.location_mode)}</dd></div>
              <div><dt className="font-bold text-casero-dark">Mostrar mapa</dt><dd>{business.show_map ? "SÃ­" : "No"}</dd></div>
              <div><dt className="font-bold text-casero-dark">DirecciÃ³n</dt><dd>{business.address ?? "No capturada"}</dd></div>
              <div><dt className="font-bold text-casero-dark">Coordenadas</dt><dd>{hasCoordinates(business.latitude, business.longitude) ? `${business.latitude}, ${business.longitude}` : "No capturadas"}</dd></div>
            </dl>

            <div className="mt-5 rounded-md border border-casero-orange/25 bg-casero-orange/10 p-4 text-sm text-casero-text/75">
              <h4 className="font-heading text-lg font-extrabold text-casero-dark">Validación manual de pago</h4>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                <div><dt className="font-bold text-casero-dark">Plan seleccionado</dt><dd>{business.planName ?? business.plan_id ?? "Sin plan"}</dd></div>
                <div><dt className="font-bold text-casero-dark">Estado de membresía</dt><dd>{membershipLabels[business.membership_status ?? "manual_review"]}</dd></div>
                <div><dt className="font-bold text-casero-dark">Estado de pago</dt><dd>{paymentLabels[business.payment_status ?? "unpaid"]}</dd></div>
                <div><dt className="font-bold text-casero-dark">Último pago</dt><dd>{formatDate(business.last_payment_at)}</dd></div>
                <div><dt className="font-bold text-casero-dark">Próximo pago</dt><dd>{formatDate(business.next_payment_due_at)}</dd></div>
                <div><dt className="font-bold text-casero-dark">Vencimiento</dt><dd>{formatDate(business.membership_expires_at)}</dd></div>
              </dl>
              <p className="mt-3 font-semibold text-casero-dark">
                Después de verificar el comprobante de CoDi, transferencia o Mercado Pago, usa “Activar manual 30 días” para activar o renovar la membresía.
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-casero-text/60">
                Verifica monto, fecha, referencia y cuenta destino antes de activar.
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-bold text-casero-dark">CategorÃ­as</p>
                <p className="mt-2 text-sm leading-6 text-casero-text/70">
                  {business.categories.map((category) => category.name).join(", ") || "Sin categorÃ­as"}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-casero-dark">Ubicaciones</p>
                <p className="mt-2 text-sm leading-6 text-casero-text/70">
                  {business.locations.map((location) => location.name).join(", ") || "Sin ubicaciones"}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-heading text-lg font-bold text-casero-dark">Mapa</h3>
            <div className="mt-4">
              {hasCoordinates(business.latitude, business.longitude) ? (
                <BusinessMap
                  latitude={business.latitude}
                  longitude={business.longitude}
                  markerLabel={business.business_name}
                />
              ) : business.show_map ? (
                <p className="rounded-md bg-casero-orange/10 p-4 text-sm font-semibold text-casero-dark">
                  Este negocio solicitÃ³ mostrar mapa, pero aÃºn no capturÃ³ coordenadas.
                </p>
              ) : (
                <p className="rounded-md bg-white p-4 text-sm font-semibold text-casero-text/65">
                  Este negocio no solicitÃ³ mostrar mapa.
                </p>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="font-heading text-lg font-bold text-casero-dark">Atributos</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {attributes.map(([label, enabled]) => (
                <Badge key={label as string} tone={enabled ? "green" : "neutral"}>
                  {enabled ? label : `${label}: no`}
                </Badge>
              ))}
            </div>
            {business.status === "published" ? (
              <Link className="mt-5 inline-flex rounded-md bg-casero-green px-4 py-2 text-sm font-bold text-white" href={`/negocio/${business.slug}`}>
                Ver perfil pÃºblico
              </Link>
            ) : null}
          </Card>
        </div>

        <Card className="mt-5">
          <h3 className="font-heading text-lg font-bold text-casero-dark">DescripciÃ³n</h3>
          <p className="mt-3 text-sm leading-6 text-casero-text/75">{business.short_description ?? "Sin descripciÃ³n breve."}</p>
          <p className="mt-3 text-sm leading-6 text-casero-text/75">{business.long_description ?? "Sin descripciÃ³n larga."}</p>
        </Card>

        <Card className="mt-5">
          <h3 className="font-heading text-lg font-bold text-casero-dark">GalerÃ­a</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {business.media.length > 0 ? (
              business.media.map((item, index) => (
                <SafeAdminImage
                  key={item.id}
                  src={item.url}
                  alt={item.alt ?? `${business.business_name} ${index + 1}`}
                  className="aspect-video w-full rounded-md object-cover"
                  placeholder={<BusinessImagePlaceholder business={business} compact />}
                />
              ))
            ) : (
              <p className="text-sm text-casero-text/70">Sin imÃ¡genes cargadas.</p>
            )}
          </div>
        </Card>

        <Card className="mt-5">
          <h3 className="font-heading text-lg font-bold text-casero-dark">Acciones</h3>
          <div className="mt-4">
            <AdminActions business={business} disabled={actionLoadingId === business.id} onUpdate={onUpdate} onRequestDelete={onRequestDelete} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function DeleteBusinessModal({
  business,
  confirmationText,
  deleting,
  onConfirmationChange,
  onClose,
  onConfirm,
}: {
  business: AdminBusiness;
  confirmationText: string;
  deleting: boolean;
  onConfirmationChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const canDelete = confirmationText === "ELIMINAR";

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-casero-dark/70 p-3 sm:p-4">
      <div className="mx-auto mt-10 max-w-lg rounded-lg bg-white p-5 shadow-soft sm:p-6">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-red-700">Accion irreversible</p>
        <h2 className="mt-2 font-heading text-2xl font-extrabold text-casero-dark">Eliminar publicacion</h2>
        <p className="mt-3 text-sm leading-6 text-casero-text/75">
          Esta accion eliminara definitivamente el negocio, sus imagenes y relaciones. No se puede deshacer.
        </p>
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-800">
          Negocio: {business.business_name}
        </div>
        <label className="mt-5 block text-sm font-bold text-casero-dark">
          Escribe ELIMINAR para continuar
          <input
            value={confirmationText}
            onChange={(event) => onConfirmationChange(event.target.value)}
            className="mt-2 w-full rounded-md border border-red-200 bg-white px-3 py-2.5 font-normal outline-red-600"
            autoFocus
          />
        </label>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={deleting}
            onClick={onClose}
            className="min-h-11 rounded-md border border-casero-dark/10 bg-white px-4 py-2 text-sm font-bold text-casero-dark disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canDelete || deleting}
            onClick={onConfirm}
            className="min-h-11 rounded-md bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-45"
          >
            {deleting ? "Eliminando..." : "Eliminar definitivamente"}
          </button>
        </div>
      </div>
    </div>
  );
}
function getPlanLimits(plan?: AdminPlanOption) {
  if (plan?.slug === "premium") {
    return { maxCategories: 8, maxLocations: 10, maxImages: 15, maxImageSizeMb: 5 };
  }

  if (plan?.slug === "pro") {
    return { maxCategories: 5, maxLocations: 5, maxImages: 8, maxImageSizeMb: 3 };
  }

  return { maxCategories: plan?.max_categories ?? 2, maxLocations: 2, maxImages: plan?.max_photos ?? 3, maxImageSizeMb: 2 };
}

function checkboxValue(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function getStoragePathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${mediaStorageBucket}/`;
  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(index + marker.length).split("?")[0] ?? "");
}

function MediaAltEditor({
  media,
  disabled,
  onSave,
}: {
  media: MediaItem;
  disabled: boolean;
  onSave: (media: MediaItem, alt: string) => void;
}) {
  const [alt, setAlt] = useState(media.alt ?? "");

  useEffect(() => {
    setAlt(media.alt ?? "");
  }, [media.id, media.alt]);

  return (
    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
      <input
        value={alt}
        onChange={(event) => setAlt(event.target.value)}
        placeholder="Texto alt de la imagen"
        className="min-w-0 flex-1 rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm outline-casero-green"
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSave(media, alt)}
        className="rounded-md bg-casero-dark px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
      >
        Guardar alt
      </button>
    </div>
  );
}

function EditBusinessModal({
  business,
  plans,
  categories,
  locations,
  saving,
  mediaActionLoadingId,
  error,
  onClose,
  onSave,
  onPromoteImage,
  onMoveImage,
  onDeleteImage,
  onSaveImageAlt,
  onUploadImages,
}: {
  business: AdminBusiness;
  plans: AdminPlanOption[];
  categories: AdminCategoryOption[];
  locations: AdminLocationOption[];
  saving: boolean;
  mediaActionLoadingId: string | null;
  error: string | null;
  onClose: () => void;
  onSave: (business: AdminBusiness, formData: FormData, categoryIds: string[], locationIds: string[]) => void;
  onPromoteImage: (business: AdminBusiness, media: MediaItem) => void;
  onMoveImage: (business: AdminBusiness, media: MediaItem, direction: "up" | "down") => void;
  onDeleteImage: (business: AdminBusiness, media: MediaItem) => void;
  onSaveImageAlt: (media: MediaItem, alt: string) => void;
  onUploadImages: (business: AdminBusiness, files: File[], alt: string, plan: AdminPlanOption | undefined) => void;
}) {
  const [planId, setPlanId] = useState(business.plan_id ?? "");
  const [section, setSection] = useState<CategorySection>(business.section ?? business.categories[0]?.section ?? "home_services");
  const [showMap, setShowMap] = useState(business.show_map);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadAlt, setUploadAlt] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>(business.categories.map((category) => category.id));
  const [locationIds, setLocationIds] = useState<string[]>(business.locations.map((location) => location.id));
  const selectedPlan = plans.find((plan) => plan.id === planId);
  const limits = getPlanLimits(selectedPlan);
  const filteredCategories = categories.filter((category) => category.section === section);
  const mapWarning = showMap && !hasCoordinates(business.latitude, business.longitude);

  function toggleCategory(categoryId: string) {
    setCategoryIds((current) => {
      if (current.includes(categoryId)) {
        return current.filter((id) => id !== categoryId);
      }

      if (current.length >= limits.maxCategories) {
        return current;
      }

      return [...current, categoryId];
    });
  }

  function toggleLocation(locationId: string) {
    setLocationIds((current) => {
      if (current.includes(locationId)) {
        return current.filter((id) => id !== locationId);
      }

      if (current.length >= limits.maxLocations) {
        return current;
      }

      return [...current, locationId];
    });
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-casero-dark/65 p-2 sm:p-4">
      <form
        className="mx-auto grid max-h-[calc(100vh-1rem)] max-w-5xl gap-5 overflow-y-auto rounded-lg bg-casero-background p-4 shadow-soft sm:max-h-none sm:p-5 md:p-7"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(business, new FormData(event.currentTarget), categoryIds, locationIds);
        }}
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-casero-green">Editar negocio</p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold text-casero-dark">{business.business_name}</h2>
          </div>
          <button className="min-h-11 rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm font-bold text-casero-dark" type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>

        {error ? <p className="rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p> : null}
        {mapWarning ? (
          <p className="rounded-md bg-casero-orange/10 p-4 text-sm font-semibold text-casero-dark">
            Este negocio quiere mostrar mapa, pero no tiene coordenadas.
          </p>
        ) : null}

        <Card>
          <h3 className="font-heading text-lg font-bold text-casero-dark">Datos principales</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["business_name", "Nombre del negocio", business.business_name, true],
              ["responsible_name", "Responsable", business.responsible_name ?? "", false],
              ["whatsapp", "WhatsApp", business.whatsapp ?? "", true],
              ["phone", "TelÃ©fono", business.phone ?? "", false],
              ["email", "Correo", business.email ?? "", true],
              ["main_service", "Servicio principal", business.categories[0]?.name ?? "", false],
              ["address", "DirecciÃ³n", business.address ?? "", false],
              ["postal_code", "CÃ³digo postal", business.postal_code ?? "", false],
              ["latitude", "Latitud", business.latitude?.toString() ?? "", false],
              ["longitude", "Longitud", business.longitude?.toString() ?? "", false],
            ].map(([name, label, value, required]) => (
              <label key={name as string} className="text-sm font-bold text-casero-dark">
                {label}
                <input
                  name={name as string}
                  defaultValue={value as string}
                  required={Boolean(required)}
                  className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green"
                />
              </label>
            ))}
            <label className="text-sm font-bold text-casero-dark md:col-span-2">
              DescripciÃ³n breve
              <textarea name="short_description" defaultValue={business.short_description ?? ""} className="mt-2 min-h-24 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green" />
            </label>
            <label className="text-sm font-bold text-casero-dark md:col-span-2">
              DescripciÃ³n larga
              <textarea name="long_description" defaultValue={business.long_description ?? ""} className="mt-2 min-h-28 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green" />
            </label>
          </div>
        </Card>

        <Card>
          <h3 className="font-heading text-lg font-bold text-casero-dark">ClasificaciÃ³n y publicaciÃ³n</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="text-sm font-bold text-casero-dark">
              Plan
              <select name="plan_id" value={planId} onChange={(event) => setPlanId(event.target.value)} className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green">
                <option value="">Sin plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-casero-dark">
              Tipo
              <select name="profile_type" defaultValue={business.profile_type} className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green">
                <option value="service_provider">Proveedor de servicio</option>
                <option value="material_store">Tienda o materiales</option>
              </select>
            </label>
            <label className="text-sm font-bold text-casero-dark">
              SecciÃ³n
              <select
                name="section"
                value={section}
                onChange={(event) => {
                  setSection(event.target.value as CategorySection);
                  setCategoryIds([]);
                }}
                className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green"
              >
                {Object.entries(sectionLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-casero-dark">
              Estado
              <select name="status" defaultValue={business.status} className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green">
                {statusFilters.filter((item) => item.value !== "all").map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-casero-dark">
              Modo de ubicaciÃ³n
              <select name="location_mode" defaultValue={business.location_mode ?? "zones_only"} className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green">
                {Object.entries(locationModeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>
        </Card>

        <Card>
          <h3 className="font-heading text-lg font-bold text-casero-dark">CategorÃ­as y zonas</h3>
          <p className="mt-2 text-sm text-casero-text/65">
            LÃ­mite del plan: {limits.maxCategories} categorÃ­as y {limits.maxLocations} zonas.
          </p>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold text-casero-dark">CategorÃ­as seleccionadas: {categoryIds.length}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {filteredCategories.map((category) => {
                  const active = categoryIds.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={active ? "rounded-md bg-casero-green px-3 py-2 text-xs font-bold text-white" : "rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-xs font-bold text-casero-dark"}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-casero-dark">Zonas seleccionadas: {locationIds.length}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {locations.map((location) => {
                  const active = locationIds.includes(location.id);
                  return (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => toggleLocation(location.id)}
                      className={active ? "rounded-md bg-casero-turquoise px-3 py-2 text-xs font-bold text-white" : "rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-xs font-bold text-casero-dark"}
                    >
                      {location.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-heading text-lg font-bold text-casero-dark">Atributos</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["has_physical_location", "Tiene ubicaciÃ³n fÃ­sica", business.has_physical_location],
              ["show_map", "Mostrar mapa", business.show_map],
              ["service_at_home", "Servicio a domicilio", business.service_at_home],
              ["emergency_service", "Atiende urgencias", business.emergency_service],
              ["service_24_7", "AtenciÃ³n 24/7", business.service_24_7],
              ["by_appointment", "Con cita previa", business.by_appointment],
              ["free_estimate", "Presupuesto sin costo", business.free_estimate],
              ["invoices", "Emite factura", business.invoices],
              ["accepts_card", "Acepta tarjeta", business.accepts_card],
              ["accepts_transfer", "Acepta transferencia", business.accepts_transfer],
              ["attends_airbnb", "Atiende Airbnb", business.attends_airbnb],
              ["attends_condos", "Atiende condominios", business.attends_condos],
              ["offers_warranty", "Ofrece garantÃ­a", business.offers_warranty],
              ["retail_sales", "Venta al pÃºblico", business.retail_sales],
              ["wholesale_sales", "Venta por mayoreo", business.wholesale_sales],
              ["delivery_available", "Entrega a domicilio", business.delivery_available],
              ["authorized_distributor", "Distribuidor autorizado", business.authorized_distributor],
              ["pet_veterinary_service", "AtenciÃ³n veterinaria", business.pet_veterinary_service],
              ["pet_grooming", "EstÃ©tica mascotas", business.pet_grooming],
              ["pet_daycare", "GuarderÃ­a mascotas", business.pet_daycare],
              ["pet_food_accessories", "Alimentos/accesorios mascotas", business.pet_food_accessories],
              ["auto_tow_service", "GrÃºa disponible", business.auto_tow_service],
              ["auto_diagnostics", "DiagnÃ³stico automotriz", business.auto_diagnostics],
              ["auto_parts", "Refacciones", business.auto_parts],
              ["auto_wash_detailing", "Lavado / detallado", business.auto_wash_detailing],
              ["is_verified", "Verificado", business.is_verified],
              ["is_featured", "Destacado", business.is_featured],
            ].map(([name, label, checked]) => (
              <label key={name as string} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                <input
                  name={name as string}
                  type="checkbox"
                  checked={name === "show_map" ? showMap : undefined}
                  defaultChecked={name === "show_map" ? undefined : Boolean(checked)}
                  onChange={name === "show_map" ? (event) => setShowMap(event.target.checked) : undefined}
                  className="h-4 w-4 accent-casero-green"
                />
                {label}
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div>
              <h3 className="font-heading text-lg font-bold text-casero-dark">ImÃ¡genes del negocio</h3>
              <p className="mt-2 text-sm text-casero-text/65">
                {business.media.length} de {limits.maxImages} imÃ¡genes permitidas por plan. TamaÃ±o mÃ¡ximo: {limits.maxImageSizeMb} MB por imagen.
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-casero-text/60">
                Verifica monto, fecha, referencia y cuenta destino antes de activar.
              </p>
            </div>
            <Badge tone={business.media.length >= limits.maxImages ? "orange" : "green"}>
              {business.media.length >= limits.maxImages ? "LÃ­mite alcanzado" : "Puede agregar imÃ¡genes"}
            </Badge>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {business.media.length > 0 ? (
              business.media.map((media, index) => {
                const isMain = index === 0;
                const disabled = Boolean(mediaActionLoadingId);

                return (
                  <div key={media.id} className="rounded-lg border border-casero-dark/10 bg-white p-3">
                    <div className="relative aspect-video overflow-hidden rounded-md bg-casero-background">
                      <SafeAdminImage
                        src={media.url}
                        alt={media.alt ?? business.business_name}
                        className="h-full w-full object-cover"
                        placeholder={<BusinessImagePlaceholder business={business} compact />}
                      />
                      {isMain ? (
                        <span className="absolute left-3 top-3 rounded-md bg-casero-green px-2 py-1 text-xs font-bold text-white">
                          Imagen principal
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-3 grid gap-1 text-xs text-casero-text/65">
                      <p><strong>sort_order:</strong> {media.sort_order ?? index}</p>
                      <p className="break-all"><strong>URL:</strong> {media.url}</p>
                    </div>
                    <MediaAltEditor media={media} disabled={disabled} onSave={onSaveImageAlt} />
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                      <button
                        type="button"
                        disabled={disabled || isMain}
                        onClick={() => onPromoteImage(business, media)}
                        className="min-h-10 rounded-md bg-casero-green px-3 py-2 text-xs font-bold text-white disabled:opacity-45"
                      >
                        Marcar principal
                      </button>
                      <button
                        type="button"
                        disabled={disabled || index === 0}
                        onClick={() => onMoveImage(business, media, "up")}
                        className="min-h-10 rounded-md border border-casero-dark/10 px-3 py-2 text-xs font-bold text-casero-dark disabled:opacity-45"
                      >
                        Subir
                      </button>
                      <button
                        type="button"
                        disabled={disabled || index === business.media.length - 1}
                        onClick={() => onMoveImage(business, media, "down")}
                        className="min-h-10 rounded-md border border-casero-dark/10 px-3 py-2 text-xs font-bold text-casero-dark disabled:opacity-45"
                      >
                        Bajar
                      </button>
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => onDeleteImage(business, media)}
                        className="min-h-10 rounded-md bg-red-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-45"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-dashed border-casero-dark/15 bg-white p-5 text-sm text-casero-text/65 md:col-span-2">
                Este negocio todavÃ­a no tiene imÃ¡genes.
              </div>
            )}
          </div>

          <div className="mt-5 rounded-lg bg-casero-background p-4">
            <h4 className="text-sm font-bold text-casero-dark">Agregar nuevas imÃ¡genes</h4>
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <label className="text-sm font-bold text-casero-dark">
                Archivos
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(event) => setUploadFiles(Array.from(event.target.files ?? []))}
                  className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm font-normal"
                />
              </label>
              <label className="text-sm font-bold text-casero-dark">
                Alt para estas imÃ¡genes
                <input
                  value={uploadAlt}
                  onChange={(event) => setUploadAlt(event.target.value)}
                  placeholder="Ej. Trabajo realizado en CancÃºn"
                  className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green"
                />
              </label>
              <button
                type="button"
                disabled={Boolean(mediaActionLoadingId) || uploadFiles.length === 0}
                onClick={() => onUploadImages(business, uploadFiles, uploadAlt, selectedPlan)}
                className="rounded-md bg-casero-orange px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                Subir imÃ¡genes
              </button>
            </div>
          </div>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button className="rounded-md border border-casero-dark/10 bg-white px-4 py-2 text-sm font-bold text-casero-dark" type="button" onClick={onClose}>
            Cancelar
          </button>
          <Button type="submit" variant="secondary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function AdminBusinessesPanel() {
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [plans, setPlans] = useState<AdminPlanOption[]>([]);
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [locations, setLocations] = useState<AdminLocationOption[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(null);
  const [deletingBusinessId, setDeletingBusinessId] = useState<string | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [mediaActionLoadingId, setMediaActionLoadingId] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadBusinesses = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase no esta configurado. Revisa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return false;
    }

    setLoading(true);
    setError(null);

    const { data, error: loadError } = await supabase
      .from("business_profiles")
      .select(
        `
          id,
          business_name,
          responsible_name,
          slug,
          profile_type,
          short_description,
          long_description,
          whatsapp,
          phone,
          email,
          website,
          address,
          postal_code,
          has_physical_location,
          location_mode,
          show_map,
          latitude,
          longitude,
          status,
          is_featured,
          is_verified,
          accepts_card,
          accepts_transfer,
          invoices,
          emergency_service,
          service_24_7,
          by_appointment,
          service_at_home,
          free_estimate,
          attends_airbnb,
          attends_condos,
          offers_warranty,
          retail_sales,
          wholesale_sales,
          delivery_available,
          authorized_distributor,
          pet_veterinary_service,
          pet_grooming,
          pet_daycare,
          pet_food_accessories,
          auto_tow_service,
          auto_diagnostics,
          auto_parts,
          auto_wash_detailing,
          created_at,
          plan_id,
          membership_status,
          membership_started_at,
          membership_expires_at,
          trial_ends_at,
          payment_status,
          last_payment_at,
          next_payment_due_at,
          payment_exempt_reason,
          payment_exempt_until,
          plans(name),
          business_categories(categories(id,name,slug,section)),
          business_locations(locations(id,name,slug)),
          business_media(id,url,alt,sort_order)
        `,
      )
      .order("created_at", { ascending: false });

    if (loadError) {
      console.error("admin businesses load error", loadError);
      setError("No pudimos cargar los negocios. Revisa la consola y las polÃ­ticas de Supabase.");
      setLoading(false);
      return false;
    }

    const [plansResult, categoriesResult, locationsResult] = await Promise.all([
      supabase.from("plans").select("id,name,slug,max_categories,max_photos").order("price_mxn", { ascending: true }),
      supabase.from("categories").select("id,name,slug,section").order("name", { ascending: true }),
      supabase.from("locations").select("id,name,slug").order("name", { ascending: true }),
    ]);

    if (plansResult.error || categoriesResult.error || locationsResult.error) {
      console.error("admin options load error", {
        plansError: plansResult.error,
        categoriesError: categoriesResult.error,
        locationsError: locationsResult.error,
      });
      setError("No pudimos cargar planes, categorÃ­as o ubicaciones para ediciÃ³n.");
    } else {
      setPlans((plansResult.data ?? []) as AdminPlanOption[]);
      setCategories((categoriesResult.data ?? []) as AdminCategoryOption[]);
      setLocations((locationsResult.data ?? []) as AdminLocationOption[]);
    }

    const businessRows = (data ?? []) as unknown as AdminBusinessRow[];
    const viewStatsByBusinessId = await getBusinessViewStatsForBusinesses(
      supabase,
      businessRows.map((business) => business.id),
    );

    setBusinesses(
      businessRows.map((business) => ({
        ...mapBusiness(business),
        viewStats: viewStatsByBusinessId[business.id] ?? { total: 0, last7Days: 0, last30Days: 0 },
      })),
    );
    setLoading(false);
    return true;
  }, []);

  useEffect(() => {
    void loadBusinesses();
  }, [loadBusinesses]);

  const filteredBusinesses = useMemo(() => {
    if (filter === "all") {
      return businesses;
    }

    return businesses.filter((business) => business.status === filter);
  }, [businesses, filter]);

  const counts = useMemo(
    () =>
      businesses.reduce<Record<StatusFilter, number>>(
        (accumulator, business) => {
          accumulator.all += 1;
          accumulator[business.status] += 1;
          return accumulator;
        },
        { all: 0, pending: 0, published: 0, paused: 0, rejected: 0 },
      ),
    [businesses],
  );

  const selectedBusiness = businesses.find((business) => business.id === selectedBusinessId) ?? null;
  const editingBusiness = businesses.find((business) => business.id === editingBusinessId) ?? null;
  const deletingBusiness = businesses.find((business) => business.id === deletingBusinessId) ?? null;

  async function logout() {
    const supabase = createSupabaseBrowserClient();

    if (supabase) {
      await supabase.auth.signOut();
    }

    setBusinesses([]);
    setSelectedBusinessId(null);
    setEditingBusinessId(null);
    setDeletingBusinessId(null);
    setDeleteConfirmationText("");
    setEditError(null);
    setMediaActionLoadingId(null);
    window.location.assign("/admin/login");
  }

  async function updateBusiness(id: string, updates: AdminBusinessUpdate) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase no esta configurado.");
      return;
    }

    setActionLoadingId(id);
    setError(null);
    setNotice(null);

    const { error: updateError } = await supabase.from("business_profiles").update(updates).eq("id", id);

    if (updateError) {
      console.error("admin business update error", { id, updates, error: updateError });
      setError("No pudimos actualizar el negocio. Revisa la consola y las polÃ­ticas temporales.");
      setActionLoadingId(null);
      return;
    }

    const refreshed = await loadBusinesses();

    if (refreshed) {
      setNotice("Negocio actualizado correctamente.");
    } else {
      setError("El negocio se actualizo, pero no pudimos refrescar la lista desde Supabase.");
    }

    setActionLoadingId(null);
  }

  function requestDeleteBusiness(businessId: string) {
    setError(null);
    setNotice(null);
    setDeleteConfirmationText("");
    setDeletingBusinessId(businessId);
  }

  function closeDeleteBusinessModal() {
    if (deleteLoading) {
      return;
    }

    setDeletingBusinessId(null);
    setDeleteConfirmationText("");
  }

  async function deleteBusiness() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase || !deletingBusiness) {
      setError("Supabase no esta configurado.");
      return;
    }

    if (deleteConfirmationText !== "ELIMINAR") {
      setError("Escribe ELIMINAR para confirmar la eliminacion definitiva.");
      return;
    }

    setDeleteLoading(true);
    setActionLoadingId(deletingBusiness.id);
    setError(null);
    setNotice(null);

    const mediaResult = await supabase.from("business_media").select("id,url").eq("business_id", deletingBusiness.id);

    if (mediaResult.error) {
      console.error("admin business delete media load error", { businessId: deletingBusiness.id, error: mediaResult.error });
      setError("No pudimos obtener las imagenes del negocio para eliminarlo.");
      setDeleteLoading(false);
      setActionLoadingId(null);
      return;
    }

    const storagePaths = Array.from(
      new Set(
        (mediaResult.data ?? [])
          .map((media) => getStoragePathFromPublicUrl(media.url))
          .filter((path): path is string => Boolean(path)),
      ),
    );

    if (storagePaths.length > 0) {
      const { error: storageError } = await supabase.storage.from(mediaStorageBucket).remove(storagePaths);

      if (storageError) {
        console.warn("admin business delete storage warning", { businessId: deletingBusiness.id, storagePaths, error: storageError });
      }
    }

    const deleteMedia = await supabase.from("business_media").delete().eq("business_id", deletingBusiness.id);

    if (deleteMedia.error) {
      console.error("admin business delete media records error", { businessId: deletingBusiness.id, error: deleteMedia.error });
      setError("No pudimos eliminar los registros de imagenes.");
      setDeleteLoading(false);
      setActionLoadingId(null);
      return;
    }

    const deleteCategories = await supabase.from("business_categories").delete().eq("business_id", deletingBusiness.id);

    if (deleteCategories.error) {
      console.error("admin business delete categories error", { businessId: deletingBusiness.id, error: deleteCategories.error });
      setError("No pudimos eliminar las categorias asociadas.");
      setDeleteLoading(false);
      setActionLoadingId(null);
      return;
    }

    const deleteLocations = await supabase.from("business_locations").delete().eq("business_id", deletingBusiness.id);

    if (deleteLocations.error) {
      console.error("admin business delete locations error", { businessId: deletingBusiness.id, error: deleteLocations.error });
      setError("No pudimos eliminar las ubicaciones asociadas.");
      setDeleteLoading(false);
      setActionLoadingId(null);
      return;
    }

    const deleteProfile = await supabase.from("business_profiles").delete().eq("id", deletingBusiness.id);

    if (deleteProfile.error) {
      console.error("admin business delete profile error", { businessId: deletingBusiness.id, error: deleteProfile.error });
      setError("No pudimos eliminar la publicacion.");
      setDeleteLoading(false);
      setActionLoadingId(null);
      return;
    }

    setSelectedBusinessId(null);
    setEditingBusinessId(null);
    setDeletingBusinessId(null);
    setDeleteConfirmationText("");

    const refreshed = await loadBusinesses();

    if (refreshed) {
      setNotice("Publicación eliminada correctamente.");
    } else {
      setError("La publicacion se elimino, pero no pudimos refrescar la lista.");
    }

    setDeleteLoading(false);
    setActionLoadingId(null);
  }
  async function saveBusinessEdit(business: AdminBusiness, formData: FormData, categoryIds: string[], locationIds: string[]) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setEditError("Supabase no esta configurado.");
      return;
    }

    const planId = String(formData.get("plan_id") ?? "");
    const selectedPlan = plans.find((plan) => plan.id === planId);
    const limits = getPlanLimits(selectedPlan);
    const businessName = String(formData.get("business_name") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!businessName || !whatsapp || !email) {
      setEditError("Nombre del negocio, WhatsApp y correo son obligatorios.");
      return;
    }

    if (categoryIds.length === 0 || locationIds.length === 0) {
      setEditError("Selecciona al menos una categorÃ­a y una ubicaciÃ³n.");
      return;
    }

    if (categoryIds.length > limits.maxCategories) {
      setEditError(`El plan seleccionado permite hasta ${limits.maxCategories} categorÃ­as.`);
      return;
    }

    if (locationIds.length > limits.maxLocations) {
      setEditError(`El plan seleccionado permite hasta ${limits.maxLocations} zonas.`);
      return;
    }

    const latitudeInput = String(formData.get("latitude") ?? "").trim();
    const longitudeInput = String(formData.get("longitude") ?? "").trim();
    const latitude = latitudeInput ? Number(latitudeInput) : null;
    const longitude = longitudeInput ? Number(longitudeInput) : null;

    const updates = {
      business_name: businessName,
      responsible_name: String(formData.get("responsible_name") ?? "").trim() || null,
      whatsapp,
      phone: String(formData.get("phone") ?? "").trim() || null,
      email,
      short_description: String(formData.get("short_description") ?? "").trim() || null,
      long_description: String(formData.get("long_description") ?? "").trim() || null,
      main_service: String(formData.get("main_service") ?? "").trim() || null,
      plan_id: planId || null,
      profile_type: String(formData.get("profile_type") ?? business.profile_type) as ProfileType,
      section: String(formData.get("section") ?? business.section ?? "home_services") as CategorySection,
      address: String(formData.get("address") ?? "").trim() || null,
      postal_code: String(formData.get("postal_code") ?? "").trim() || null,
      has_physical_location: checkboxValue(formData, "has_physical_location"),
      location_mode: String(formData.get("location_mode") ?? "zones_only") as LocationMode,
      show_map: checkboxValue(formData, "show_map"),
      latitude: Number.isFinite(latitude) ? latitude : null,
      longitude: Number.isFinite(longitude) ? longitude : null,
      service_at_home: checkboxValue(formData, "service_at_home"),
      emergency_service: checkboxValue(formData, "emergency_service"),
      service_24_7: checkboxValue(formData, "service_24_7"),
      by_appointment: checkboxValue(formData, "by_appointment"),
      free_estimate: checkboxValue(formData, "free_estimate"),
      invoices: checkboxValue(formData, "invoices"),
      accepts_card: checkboxValue(formData, "accepts_card"),
      accepts_transfer: checkboxValue(formData, "accepts_transfer"),
      attends_airbnb: checkboxValue(formData, "attends_airbnb"),
      attends_condos: checkboxValue(formData, "attends_condos"),
      offers_warranty: checkboxValue(formData, "offers_warranty"),
      retail_sales: checkboxValue(formData, "retail_sales"),
      wholesale_sales: checkboxValue(formData, "wholesale_sales"),
      delivery_available: checkboxValue(formData, "delivery_available"),
      authorized_distributor: checkboxValue(formData, "authorized_distributor"),
      pet_veterinary_service: checkboxValue(formData, "pet_veterinary_service"),
      pet_grooming: checkboxValue(formData, "pet_grooming"),
      pet_daycare: checkboxValue(formData, "pet_daycare"),
      pet_food_accessories: checkboxValue(formData, "pet_food_accessories"),
      auto_tow_service: checkboxValue(formData, "auto_tow_service"),
      auto_diagnostics: checkboxValue(formData, "auto_diagnostics"),
      auto_parts: checkboxValue(formData, "auto_parts"),
      auto_wash_detailing: checkboxValue(formData, "auto_wash_detailing"),
      status: String(formData.get("status") ?? business.status) as PublicationStatus,
      is_verified: checkboxValue(formData, "is_verified"),
      is_featured: checkboxValue(formData, "is_featured"),
    };

    setEditSaving(true);
    setEditError(null);
    setNotice(null);

    const { error: profileError } = await supabase.from("business_profiles").update(updates).eq("id", business.id);

    if (profileError) {
      console.error("admin business edit profile error", { id: business.id, updates, error: profileError });
      setEditError("No pudimos guardar los datos principales. Revisa la consola.");
      setEditSaving(false);
      return;
    }

    const deleteCategories = await supabase.from("business_categories").delete().eq("business_id", business.id);
    const deleteLocations = await supabase.from("business_locations").delete().eq("business_id", business.id);

    if (deleteCategories.error || deleteLocations.error) {
      console.error("admin business edit relation delete error", {
        categoriesError: deleteCategories.error,
        locationsError: deleteLocations.error,
      });
      setEditError("No pudimos reemplazar categorÃ­as o ubicaciones.");
      setEditSaving(false);
      return;
    }

    const insertCategories = await supabase.from("business_categories").insert(
      categoryIds.map((categoryId) => ({ business_id: business.id, category_id: categoryId })),
    );
    const insertLocations = await supabase.from("business_locations").insert(
      locationIds.map((locationId) => ({ business_id: business.id, location_id: locationId })),
    );

    if (insertCategories.error || insertLocations.error) {
      console.error("admin business edit relation insert error", {
        categoriesError: insertCategories.error,
        locationsError: insertLocations.error,
      });
      setEditError("No pudimos guardar categorÃ­as o ubicaciones.");
      setEditSaving(false);
      return;
    }

    await loadBusinesses();
    setEditingBusinessId(null);
    setNotice("Cambios guardados correctamente.");
    setEditSaving(false);
  }

  async function saveMediaOrder(business: AdminBusiness, orderedMedia: MediaItem[], actionLabel: string) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setEditError("Supabase no esta configurado.");
      return;
    }

    setMediaActionLoadingId(actionLabel);
    setEditError(null);
    setNotice(null);

    const updates = await Promise.all(
      orderedMedia.map((media, index) =>
        supabase.from("business_media").update({ sort_order: index }).eq("id", media.id),
      ),
    );
    const updateError = updates.find((result) => result.error)?.error;

    if (updateError) {
      console.error("admin business media order error", { businessId: business.id, orderedMedia, error: updateError });
      setEditError("No pudimos reordenar las imÃ¡genes. Revisa la consola.");
      setMediaActionLoadingId(null);
      return;
    }

    await loadBusinesses();
    setNotice("ImÃ¡genes actualizadas correctamente.");
    setMediaActionLoadingId(null);
  }

  function promoteImage(business: AdminBusiness, media: MediaItem) {
    const orderedMedia = [media, ...business.media.filter((item) => item.id !== media.id)];
    void saveMediaOrder(business, orderedMedia, `promote-${media.id}`);
  }

  function moveImage(business: AdminBusiness, media: MediaItem, direction: "up" | "down") {
    const orderedMedia = [...business.media];
    const currentIndex = orderedMedia.findIndex((item) => item.id === media.id);
    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= orderedMedia.length) {
      return;
    }

    [orderedMedia[currentIndex], orderedMedia[nextIndex]] = [orderedMedia[nextIndex], orderedMedia[currentIndex]];
    void saveMediaOrder(business, orderedMedia, `move-${media.id}`);
  }

  async function deleteImage(business: AdminBusiness, media: MediaItem) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setEditError("Supabase no esta configurado.");
      return;
    }

    setMediaActionLoadingId(`delete-${media.id}`);
    setEditError(null);
    setNotice(null);

    const { error: deleteError } = await supabase.from("business_media").delete().eq("id", media.id);

    if (deleteError) {
      console.error("admin business media delete error", { businessId: business.id, media, error: deleteError });
      setEditError("No pudimos eliminar la imagen. Revisa la consola.");
      setMediaActionLoadingId(null);
      return;
    }

    const storagePath = getStoragePathFromPublicUrl(media.url);

    if (storagePath) {
      const { error: storageError } = await supabase.storage.from(mediaStorageBucket).remove([storagePath]);

      if (storageError) {
        console.warn("admin business media storage delete warning", { businessId: business.id, storagePath, error: storageError });
      }
    } else {
      console.warn("admin business media storage path not detected", { businessId: business.id, url: media.url });
    }

    const remainingMedia = business.media.filter((item) => item.id !== media.id);

    if (remainingMedia.length > 0) {
      await saveMediaOrder(business, remainingMedia, `reorder-after-delete-${media.id}`);
      return;
    }

    await loadBusinesses();
    setNotice("Imagen eliminada correctamente.");
    setMediaActionLoadingId(null);
  }

  async function saveImageAlt(media: MediaItem, alt: string) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setEditError("Supabase no esta configurado.");
      return;
    }

    setMediaActionLoadingId(`alt-${media.id}`);
    setEditError(null);
    setNotice(null);

    const { error: updateError } = await supabase.from("business_media").update({ alt: alt.trim() || null }).eq("id", media.id);

    if (updateError) {
      console.error("admin business media alt error", { media, alt, error: updateError });
      setEditError("No pudimos guardar el texto alt. Revisa la consola.");
      setMediaActionLoadingId(null);
      return;
    }

    await loadBusinesses();
    setNotice("Texto alt actualizado correctamente.");
    setMediaActionLoadingId(null);
  }

  async function uploadBusinessImages(business: AdminBusiness, files: File[], alt: string, selectedPlan?: AdminPlanOption) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setEditError("Supabase no esta configurado.");
      return;
    }

    const limits = getPlanLimits(selectedPlan ?? plans.find((plan) => plan.id === business.plan_id));
    const availableSlots = limits.maxImages - business.media.length;

    if (files.length === 0) {
      setEditError("Selecciona al menos una imagen para subir.");
      return;
    }

    if (availableSlots <= 0 || files.length > availableSlots) {
      setEditError(`Este plan permite hasta ${limits.maxImages} imÃ¡genes.`);
      return;
    }

    const invalidType = files.find((file) => !allowedImageTypes.includes(file.type));

    if (invalidType) {
      setEditError(`Formato no permitido: ${invalidType.name}. Usa JPG, PNG o WebP.`);
      return;
    }

    const maxBytes = limits.maxImageSizeMb * 1024 * 1024;
    const oversized = files.find((file) => file.size > maxBytes);

    if (oversized) {
      setEditError(`La imagen ${oversized.name} supera ${limits.maxImageSizeMb} MB.`);
      return;
    }

    setMediaActionLoadingId("upload");
    setEditError(null);
    setNotice(null);

    for (const [index, file] of files.entries()) {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
      const path = `businesses/${business.id}/admin-${Date.now()}-${index}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from(mediaStorageBucket).upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

      if (uploadError) {
        console.error("admin business media upload error", { businessId: business.id, fileName: file.name, error: uploadError });
        setEditError("No pudimos subir una imagen. Revisa la consola.");
        setMediaActionLoadingId(null);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(mediaStorageBucket).getPublicUrl(path);

      const { error: mediaError } = await supabase.from("business_media").insert({
        business_id: business.id,
        url: publicUrl,
        type: "image",
        alt: alt.trim() || business.business_name,
        sort_order: business.media.length + index,
      });

      if (mediaError) {
        console.error("admin business media insert error", { businessId: business.id, publicUrl, error: mediaError });
        setEditError("La imagen subiÃ³, pero no pudimos guardar el registro. Revisa la consola.");
        setMediaActionLoadingId(null);
        return;
      }
    }

    await loadBusinesses();
    setNotice("ImÃ¡genes subidas correctamente.");
    setMediaActionLoadingId(null);
  }

  return (
    <section className="container-page py-8 sm:py-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-casero-green">Admin</p>
          <h1 className="mt-3 font-heading text-2xl font-extrabold text-casero-dark sm:text-3xl md:text-4xl">
            Solicitudes de negocios
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-casero-text/70">
            Revisa categorÃ­as, zonas, imÃ¡genes y atributos antes de publicar negocios en Casero CancÃºn.
          </p>
        </div>
        <div className="grid gap-2 sm:flex sm:flex-wrap">
          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => void loadBusinesses()}>
            Refrescar
          </Button>
          <Button type="button" variant="ghost" className="w-full sm:w-auto" onClick={logout}>
            Cerrar sesiÃ³n admin
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:flex-wrap">
        {statusFilters.map((item) => (
          <button
            key={item.value}
            className={
              filter === item.value
                ? "min-h-10 rounded-md bg-casero-green px-3 py-2 text-sm font-bold text-white"
                : "min-h-10 rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm font-bold text-casero-text"
            }
            type="button"
            onClick={() => setFilter(item.value)}
          >
            {item.label} ({counts[item.value]})
          </button>
        ))}
      </div>

      {notice ? <p className="mt-6 rounded-md bg-casero-green/10 p-4 text-sm font-semibold text-casero-green">{notice}</p> : null}
      {error ? <p className="mt-6 rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p> : null}
      {loading ? <p className="mt-6 text-sm font-semibold text-casero-text/70">Cargando negocios...</p> : null}

      <div className="mt-6 hidden overflow-hidden rounded-lg border border-casero-dark/10 bg-white shadow-sm lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-casero-beige/70 text-xs uppercase tracking-[0.12em] text-casero-dark">
            <tr>
              <th className="px-4 py-3">Negocio</th>
              <th className="px-4 py-3">SecciÃ³n</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-casero-dark/10">
            {filteredBusinesses.map((business) => (
              <tr key={business.id} className="align-top">
                <td className="px-4 py-4">
                  <div className="grid grid-cols-[96px_1fr] gap-3">
                    <BusinessImage business={business} />
                    <div>
                      <p className="font-heading font-bold text-casero-dark">{business.business_name}</p>
                      <p className="mt-1 text-xs text-casero-text/55">{formatDate(business.created_at)}</p>
                      <p className="mt-2 text-xs text-casero-text/65">
                        {business.categories.map((category) => category.name).join(", ") || "Sin categorÃ­as"}
                      </p>
                      <p className="mt-1 text-xs text-casero-text/65">
                        {business.locations.map((location) => location.name).join(", ") || "Sin ubicaciones"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-casero-text">{getSection(business)}</p>
                  <p className="mt-1 text-xs text-casero-text/60">
                    {getProfileTypeLabel(business.profile_type)}
                  </p>
                </td>
                <td className="px-4 py-4 text-casero-text/75">{business.planName ?? business.plan_id ?? "Sin plan"}</td>
                <td className="px-4 py-4 text-casero-text/75">
                  <p>{business.whatsapp ?? "Sin WhatsApp"}</p>
                  <p className="mt-1 text-xs">{business.email ?? "Sin correo"}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {statusBadge(business.status)}
                    {business.is_verified ? <Badge tone="green">Verificado</Badge> : null}
                    {business.is_featured ? <Badge tone="orange">Destacado</Badge> : null}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button className="mb-3 rounded-md bg-casero-orange px-3 py-2 text-xs font-bold text-white" type="button" onClick={() => setSelectedBusinessId(business.id)}>
                    Revisar
                  </button>
                  <button className="mb-3 ml-2 rounded-md bg-casero-green px-3 py-2 text-xs font-bold text-white" type="button" onClick={() => {
                    setEditError(null);
                    setEditingBusinessId(business.id);
                  }}>
                    Editar
                  </button>
                  <AdminActions business={business} disabled={actionLoadingId === business.id} onUpdate={updateBusiness} onRequestDelete={requestDeleteBusiness} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 lg:hidden">
        {filteredBusinesses.map((business) => (
          <Card key={business.id} className="p-4 sm:p-6">
            <BusinessImage business={business} />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {statusBadge(business.status)}
              {business.is_verified ? <Badge tone="green">Verificado</Badge> : <Badge>No verificado</Badge>}
              {business.is_featured ? <Badge tone="orange">Destacado</Badge> : null}
            </div>
            <h2 className="mt-3 font-heading text-xl font-bold text-casero-dark">{business.business_name}</h2>
            <p className="mt-1 text-xs font-semibold text-casero-text/50">/{business.slug}</p>
            <div className="mt-4 grid gap-2 text-sm text-casero-text/70">
              <p><strong>Tipo:</strong> {getProfileTypeLabel(business.profile_type)}</p>
              <p><strong>SecciÃ³n:</strong> {getSection(business)}</p>
              <p><strong>Plan:</strong> {business.planName ?? business.plan_id ?? "Sin plan"}</p>
              <p><strong>WhatsApp:</strong> {business.whatsapp ?? "Sin WhatsApp"}</p>
              <p><strong>Email:</strong> {business.email ?? "Sin correo"}</p>
              <p><strong>Fecha:</strong> {formatDate(business.created_at)}</p>
              <p><strong>CategorÃ­as:</strong> {business.categories.map((category) => category.name).join(", ") || "Sin categorÃ­as"}</p>
              <p><strong>Ubicaciones:</strong> {business.locations.map((location) => location.name).join(", ") || "Sin ubicaciones"}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="min-h-10 rounded-md bg-casero-orange px-3 py-2 text-xs font-bold text-white" type="button" onClick={() => setSelectedBusinessId(business.id)}>
                Revisar
              </button>
              <button className="min-h-10 rounded-md bg-casero-green px-3 py-2 text-xs font-bold text-white" type="button" onClick={() => {
                setEditError(null);
                setEditingBusinessId(business.id);
              }}>
                Editar
              </button>
            </div>
            <div className="mt-4">
              <AdminActions business={business} disabled={actionLoadingId === business.id} onUpdate={updateBusiness} onRequestDelete={requestDeleteBusiness} />
            </div>
          </Card>
        ))}
      </div>

      {!loading && filteredBusinesses.length === 0 ? (
        <Card className="mt-6">
          <p className="text-sm text-casero-text/70">No hay negocios para este filtro.</p>
        </Card>
      ) : null}

      {selectedBusiness ? (
        <DetailModal
          business={selectedBusiness}
          actionLoadingId={actionLoadingId}
          onClose={() => setSelectedBusinessId(null)}
          onUpdate={updateBusiness}
          onRequestDelete={requestDeleteBusiness}
        />
      ) : null}

      {deletingBusiness ? (
        <DeleteBusinessModal
          business={deletingBusiness}
          confirmationText={deleteConfirmationText}
          deleting={deleteLoading}
          onConfirmationChange={setDeleteConfirmationText}
          onClose={closeDeleteBusinessModal}
          onConfirm={() => void deleteBusiness()}
        />
      ) : null}

      {editingBusiness ? (
        <EditBusinessModal
          business={editingBusiness}
          plans={plans}
          categories={categories}
          locations={locations}
          saving={editSaving}
          mediaActionLoadingId={mediaActionLoadingId}
          error={editError}
          onClose={() => {
            setEditError(null);
            setEditingBusinessId(null);
          }}
          onSave={saveBusinessEdit}
          onPromoteImage={promoteImage}
          onMoveImage={moveImage}
          onDeleteImage={deleteImage}
          onSaveImageAlt={saveImageAlt}
          onUploadImages={uploadBusinessImages}
        />
      ) : null}
    </section>
  );
}













