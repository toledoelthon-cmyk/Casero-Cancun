"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { CategorySection, LocationMode, ProfileType, PublicationStatus } from "@/lib/supabase/types";

type RelatedCategory = {
  name: string | null;
  section: CategorySection | null;
};

type MediaItem = {
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
  categories: RelatedCategory[];
  locations: string[];
  media: MediaItem[];
};

type AdminBusinessRow = {
  id: string;
  business_name: string;
  responsible_name: string | null;
  slug: string;
  profile_type: ProfileType;
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
  business_categories?: Array<{ categories?: RelatedCategory | null }> | null;
  business_locations?: Array<{ locations?: { name: string | null } | null }> | null;
  business_media?: MediaItem[] | null;
};

type StatusFilter = "all" | PublicationStatus;

const storageKey = "casero_admin_access";
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

function mapBusiness(row: AdminBusinessRow): AdminBusiness {
  const media = [...(row.business_media ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return {
    id: row.id,
    business_name: row.business_name,
    responsible_name: row.responsible_name,
    slug: row.slug,
    profile_type: row.profile_type,
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
    categories:
      row.business_categories
        ?.map((item) => item.categories)
        .filter((category): category is RelatedCategory => Boolean(category?.name)) ?? [],
    locations:
      row.business_locations
        ?.map((item) => item.locations?.name)
        .filter((name): name is string => Boolean(name)) ?? [],
    media,
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
  const section = business.categories.find((category) => category.section)?.section;
  return section ? sectionLabels[section] : "Sin seccion";
}

function statusBadge(status: PublicationStatus) {
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

function BusinessImage({ business }: { business: AdminBusiness }) {
  const mainImage = business.media[0];

  if (!mainImage?.url) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-md bg-casero-beige text-xs font-bold text-casero-green">
        Sin imagen
      </div>
    );
  }

  return (
    <Image
      src={mainImage.url}
      alt={mainImage.alt ?? business.business_name}
      width={320}
      height={180}
      className="aspect-video w-full rounded-md object-cover"
      unoptimized
    />
  );
}

function AdminActions({
  business,
  disabled,
  onUpdate,
}: {
  business: AdminBusiness;
  disabled: boolean;
  onUpdate: (id: string, updates: Partial<Pick<AdminBusiness, "status" | "is_featured" | "is_verified">>) => void;
}) {
  const buttonClass = "rounded-md px-3 py-2 text-xs font-bold disabled:opacity-50";

  return (
    <div className="flex flex-wrap gap-2">
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
    </div>
  );
}

function DetailModal({
  business,
  actionLoadingId,
  onClose,
  onUpdate,
}: {
  business: AdminBusiness;
  actionLoadingId: string | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Pick<AdminBusiness, "status" | "is_featured" | "is_verified">>) => void;
}) {
  const attributes = [
    ["Emite factura", business.invoices],
    ["Atiende urgencias", business.emergency_service],
    ["Atiende Airbnb", business.attends_airbnb],
    ["Ofrece garantia", business.offers_warranty],
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-casero-dark/65 p-4">
      <div className="mx-auto max-w-5xl rounded-lg bg-casero-background p-5 shadow-soft md:p-7">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              {statusBadge(business.status)}
              {business.is_verified ? <Badge tone="green">Verificado</Badge> : <Badge>No verificado</Badge>}
              {business.is_featured ? <Badge tone="orange">Destacado</Badge> : null}
            </div>
            <h2 className="mt-3 font-heading text-2xl font-extrabold text-casero-dark">{business.business_name}</h2>
            <p className="mt-1 text-sm font-semibold text-casero-text/55">/{business.slug}</p>
          </div>
          <button className="rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm font-bold text-casero-dark" type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <Card>
            <h3 className="font-heading text-lg font-bold text-casero-dark">Informacion principal</h3>
            <dl className="mt-4 grid gap-3 text-sm text-casero-text/75 sm:grid-cols-2">
              <div><dt className="font-bold text-casero-dark">Responsable</dt><dd>{business.responsible_name ?? "No capturado"}</dd></div>
              <div><dt className="font-bold text-casero-dark">WhatsApp</dt><dd>{business.whatsapp ?? "Sin WhatsApp"}</dd></div>
              <div><dt className="font-bold text-casero-dark">Correo</dt><dd>{business.email ?? "Sin correo"}</dd></div>
              <div><dt className="font-bold text-casero-dark">Telefono</dt><dd>{business.phone ?? "Sin telefono"}</dd></div>
              <div><dt className="font-bold text-casero-dark">Tipo</dt><dd>{business.profile_type === "service_provider" ? "Proveedor de servicio" : "Tienda/materiales"}</dd></div>
              <div><dt className="font-bold text-casero-dark">Seccion</dt><dd>{getSection(business)}</dd></div>
              <div><dt className="font-bold text-casero-dark">Plan</dt><dd>{business.planName ?? business.plan_id ?? "Sin plan"}</dd></div>
              <div><dt className="font-bold text-casero-dark">Fecha</dt><dd>{formatDate(business.created_at)}</dd></div>
              <div><dt className="font-bold text-casero-dark">Modo de ubicaciÃ³n</dt><dd>{business.location_mode ?? "No definido"}</dd></div>
              <div><dt className="font-bold text-casero-dark">Mostrar mapa</dt><dd>{business.show_map ? "SÃ­" : "No"}</dd></div>
              <div><dt className="font-bold text-casero-dark">DirecciÃ³n</dt><dd>{business.address ?? "No capturada"}</dd></div>
              <div><dt className="font-bold text-casero-dark">Coordenadas</dt><dd>{business.latitude && business.longitude ? `${business.latitude}, ${business.longitude}` : "No capturadas"}</dd></div>
            </dl>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-bold text-casero-dark">Categorias</p>
                <p className="mt-2 text-sm leading-6 text-casero-text/70">
                  {business.categories.map((category) => category.name).join(", ") || "Sin categorias"}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-casero-dark">Ubicaciones</p>
                <p className="mt-2 text-sm leading-6 text-casero-text/70">
                  {business.locations.join(", ") || "Sin ubicaciones"}
                </p>
              </div>
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
                Ver perfil publico
              </Link>
            ) : null}
          </Card>
        </div>

        <Card className="mt-5">
          <h3 className="font-heading text-lg font-bold text-casero-dark">Descripcion</h3>
          <p className="mt-3 text-sm leading-6 text-casero-text/75">{business.short_description ?? "Sin descripcion breve."}</p>
          <p className="mt-3 text-sm leading-6 text-casero-text/75">{business.long_description ?? "Sin descripcion larga."}</p>
        </Card>

        <Card className="mt-5">
          <h3 className="font-heading text-lg font-bold text-casero-dark">Galeria</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {business.media.length > 0 ? (
              business.media.map((item, index) => (
                <Image
                  key={`${item.url}-${index}`}
                  src={item.url}
                  alt={item.alt ?? `${business.business_name} ${index + 1}`}
                  width={480}
                  height={270}
                  className="aspect-video w-full rounded-md object-cover"
                  unoptimized
                />
              ))
            ) : (
              <p className="text-sm text-casero-text/70">Sin imagenes cargadas.</p>
            )}
          </div>
        </Card>

        <Card className="mt-5">
          <h3 className="font-heading text-lg font-bold text-casero-dark">Acciones</h3>
          <div className="mt-4">
            <AdminActions business={business} disabled={actionLoadingId === business.id} onUpdate={onUpdate} />
          </div>
        </Card>
      </div>
    </div>
  );
}

export function AdminBusinessesPanel({ queryAccessKey }: { queryAccessKey?: string }) {
  const adminKey = process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY;
  const [accessInput, setAccessInput] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!adminKey) {
      return;
    }

    const storedAccess = window.localStorage.getItem(storageKey);

    if (storedAccess === adminKey || queryAccessKey === adminKey) {
      window.localStorage.setItem(storageKey, adminKey);
      setHasAccess(true);
    }
  }, [adminKey, queryAccessKey]);

  const loadBusinesses = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase no esta configurado. Revisa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
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
          plans(name),
          business_categories(categories(name,section)),
          business_locations(locations(name)),
          business_media(url,alt,sort_order)
        `,
      )
      .order("created_at", { ascending: false });

    if (loadError) {
      console.error("admin businesses load error", loadError);
      setError("No pudimos cargar los negocios. Revisa la consola y las politicas de Supabase.");
      setLoading(false);
      return;
    }

    setBusinesses(((data ?? []) as unknown as AdminBusinessRow[]).map(mapBusiness));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (hasAccess) {
      void loadBusinesses();
    }
  }, [hasAccess, loadBusinesses]);

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

  function handleAccessSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminKey) {
      setError("Falta configurar NEXT_PUBLIC_ADMIN_ACCESS_KEY.");
      return;
    }

    if (accessInput === adminKey) {
      window.localStorage.setItem(storageKey, adminKey);
      setHasAccess(true);
      setError(null);
      return;
    }

    setError("Clave admin incorrecta.");
  }

  function logout() {
    window.localStorage.removeItem(storageKey);
    setHasAccess(false);
    setBusinesses([]);
    setAccessInput("");
    setSelectedBusinessId(null);
  }

  async function updateBusiness(id: string, updates: Partial<Pick<AdminBusiness, "status" | "is_featured" | "is_verified">>) {
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
      setError("No pudimos actualizar el negocio. Revisa la consola y las politicas temporales.");
      setActionLoadingId(null);
      return;
    }

    await loadBusinesses();
    setNotice("Negocio actualizado correctamente.");
    setActionLoadingId(null);
  }

  if (!hasAccess) {
    return (
      <section className="container-page py-12">
        <div className="mx-auto max-w-xl">
          <Card>
            <h1 className="font-heading text-2xl font-extrabold text-casero-dark">Acceso admin temporal</h1>
            <p className="mt-3 text-sm leading-6 text-casero-text/70">
              Ingresa la clave temporal para revisar negocios registrados.
            </p>
            <form className="mt-6 grid gap-4" onSubmit={handleAccessSubmit}>
              <label className="text-sm font-bold text-casero-dark">
                Clave admin
                <input
                  value={accessInput}
                  onChange={(event) => setAccessInput(event.target.value)}
                  className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green"
                  type="password"
                />
              </label>
              {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
              <Button type="submit" variant="secondary">
                Entrar
              </Button>
            </form>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-casero-green">Admin temporal</p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold text-casero-dark md:text-4xl">
            Solicitudes de negocios
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-casero-text/70">
            Revisa categorias, zonas, imagenes y atributos antes de publicar negocios en Casero Cancun.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => void loadBusinesses()}>
            Refrescar
          </Button>
          <Button type="button" variant="ghost" onClick={logout}>
            Cerrar sesion admin
          </Button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {statusFilters.map((item) => (
          <button
            key={item.value}
            className={
              filter === item.value
                ? "rounded-md bg-casero-green px-3 py-2 text-sm font-bold text-white"
                : "rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm font-bold text-casero-text"
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
              <th className="px-4 py-3">Seccion</th>
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
                        {business.categories.map((category) => category.name).join(", ") || "Sin categorias"}
                      </p>
                      <p className="mt-1 text-xs text-casero-text/65">
                        {business.locations.join(", ") || "Sin ubicaciones"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-casero-text">{getSection(business)}</p>
                  <p className="mt-1 text-xs text-casero-text/60">
                    {business.profile_type === "service_provider" ? "Proveedor de servicio" : "Tienda/materiales"}
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
                  <AdminActions business={business} disabled={actionLoadingId === business.id} onUpdate={updateBusiness} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-4 lg:hidden">
        {filteredBusinesses.map((business) => (
          <Card key={business.id}>
            <BusinessImage business={business} />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {statusBadge(business.status)}
              {business.is_verified ? <Badge tone="green">Verificado</Badge> : <Badge>No verificado</Badge>}
              {business.is_featured ? <Badge tone="orange">Destacado</Badge> : null}
            </div>
            <h2 className="mt-3 font-heading text-xl font-bold text-casero-dark">{business.business_name}</h2>
            <p className="mt-1 text-xs font-semibold text-casero-text/50">/{business.slug}</p>
            <div className="mt-4 grid gap-2 text-sm text-casero-text/70">
              <p><strong>Tipo:</strong> {business.profile_type === "service_provider" ? "Proveedor de servicio" : "Tienda/materiales"}</p>
              <p><strong>Seccion:</strong> {getSection(business)}</p>
              <p><strong>Plan:</strong> {business.planName ?? business.plan_id ?? "Sin plan"}</p>
              <p><strong>WhatsApp:</strong> {business.whatsapp ?? "Sin WhatsApp"}</p>
              <p><strong>Email:</strong> {business.email ?? "Sin correo"}</p>
              <p><strong>Fecha:</strong> {formatDate(business.created_at)}</p>
              <p><strong>Categorias:</strong> {business.categories.map((category) => category.name).join(", ") || "Sin categorias"}</p>
              <p><strong>Ubicaciones:</strong> {business.locations.join(", ") || "Sin ubicaciones"}</p>
            </div>
            <div className="mt-4">
              <button className="rounded-md bg-casero-orange px-3 py-2 text-xs font-bold text-white" type="button" onClick={() => setSelectedBusinessId(business.id)}>
                Revisar
              </button>
            </div>
            <div className="mt-4">
              <AdminActions business={business} disabled={actionLoadingId === business.id} onUpdate={updateBusiness} />
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
        />
      ) : null}
    </section>
  );
}
