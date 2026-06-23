"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ProfileType, PublicationStatus } from "@/lib/supabase/types";

type AdminBusiness = {
  id: string;
  business_name: string;
  slug: string;
  profile_type: ProfileType;
  short_description: string | null;
  whatsapp: string | null;
  email: string | null;
  status: PublicationStatus;
  is_featured: boolean;
  is_verified: boolean;
  created_at: string | null;
  plan_id: string | null;
  planName: string | null;
  categories: string[];
  locations: string[];
};

type AdminBusinessRow = {
  id: string;
  business_name: string;
  slug: string;
  profile_type: ProfileType;
  short_description: string | null;
  whatsapp: string | null;
  email: string | null;
  status: PublicationStatus | null;
  is_featured: boolean | null;
  is_verified: boolean | null;
  created_at: string | null;
  plan_id: string | null;
  plans?: { name: string | null } | null;
  business_categories?: Array<{ categories?: { name: string | null } | null }> | null;
  business_locations?: Array<{ locations?: { name: string | null } | null }> | null;
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

function mapBusiness(row: AdminBusinessRow): AdminBusiness {
  return {
    id: row.id,
    business_name: row.business_name,
    slug: row.slug,
    profile_type: row.profile_type,
    short_description: row.short_description,
    whatsapp: row.whatsapp,
    email: row.email,
    status: row.status ?? "pending",
    is_featured: Boolean(row.is_featured),
    is_verified: Boolean(row.is_verified),
    created_at: row.created_at,
    plan_id: row.plan_id,
    planName: row.plans?.name ?? null,
    categories:
      row.business_categories
        ?.map((item) => item.categories?.name)
        .filter((name): name is string => Boolean(name)) ?? [],
    locations:
      row.business_locations
        ?.map((item) => item.locations?.name)
        .filter((name): name is string => Boolean(name)) ?? [],
  };
}

function statusBadge(status: PublicationStatus) {
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function AdminBusinessesPanel({ queryAccessKey }: { queryAccessKey?: string }) {
  const adminKey = process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY;
  const [accessInput, setAccessInput] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      setError("Supabase no está configurado. Revisa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.");
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
          slug,
          profile_type,
          short_description,
          whatsapp,
          email,
          status,
          is_featured,
          is_verified,
          created_at,
          plan_id,
          plans(name),
          business_categories(categories(name)),
          business_locations(locations(name))
        `,
      )
      .order("created_at", { ascending: false });

    if (loadError) {
      console.error("admin businesses load error", loadError);
      setError("No pudimos cargar los negocios. Revisa la consola y las políticas de Supabase.");
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
  }

  async function updateBusiness(id: string, updates: Partial<Pick<AdminBusiness, "status" | "is_featured" | "is_verified">>) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase no está configurado.");
      return;
    }

    setActionLoadingId(id);
    setError(null);

    const { error: updateError } = await supabase.from("business_profiles").update(updates).eq("id", id);

    if (updateError) {
      console.error("admin business update error", { id, updates, error: updateError });
      setError("No pudimos actualizar el negocio. Revisa la consola y las políticas temporales.");
      setActionLoadingId(null);
      return;
    }

    await loadBusinesses();
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
            Negocios registrados
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-casero-text/70">
            Revisa solicitudes, cambia estados y marca negocios como verificados o destacados.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => void loadBusinesses()}>
            Refrescar
          </Button>
          <Button type="button" variant="ghost" onClick={logout}>
            Cerrar sesión admin
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
            {item.label}
          </button>
        ))}
      </div>

      {error ? <p className="mt-6 rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p> : null}
      {loading ? <p className="mt-6 text-sm font-semibold text-casero-text/70">Cargando negocios...</p> : null}

      <div className="mt-6 grid gap-4">
        {filteredBusinesses.map((business) => {
          const isActionLoading = actionLoadingId === business.id;

          return (
            <Card key={business.id}>
              <div className="flex flex-col justify-between gap-4 lg:flex-row">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {statusBadge(business.status)}
                    {business.is_verified ? <Badge tone="green">Verificado</Badge> : <Badge>No verificado</Badge>}
                    {business.is_featured ? <Badge tone="orange">Destacado</Badge> : null}
                  </div>
                  <h2 className="mt-3 font-heading text-xl font-bold text-casero-dark">{business.business_name}</h2>
                  <p className="mt-1 text-xs font-semibold text-casero-text/50">/{business.slug}</p>
                  <p className="mt-3 text-sm leading-6 text-casero-text/70">
                    {business.short_description ?? "Sin descripción breve."}
                  </p>
                  <div className="mt-4 grid gap-2 text-sm text-casero-text/70 sm:grid-cols-2 lg:grid-cols-3">
                    <p>
                      <strong>Tipo:</strong>{" "}
                      {business.profile_type === "service_provider" ? "Proveedor de servicio" : "Tienda/materiales"}
                    </p>
                    <p>
                      <strong>WhatsApp:</strong> {business.whatsapp ?? "Sin WhatsApp"}
                    </p>
                    <p>
                      <strong>Email:</strong> {business.email ?? "Sin correo"}
                    </p>
                    <p>
                      <strong>Plan:</strong> {business.planName ?? business.plan_id ?? "Sin plan"}
                    </p>
                    <p>
                      <strong>Categorías:</strong> {business.categories.join(", ") || "Sin categoría"}
                    </p>
                    <p>
                      <strong>Ubicaciones:</strong> {business.locations.join(", ") || "Sin ubicación"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
                  <button
                    className="rounded-md bg-casero-green px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                    disabled={isActionLoading}
                    type="button"
                    onClick={() => void updateBusiness(business.id, { status: "published" })}
                  >
                    Aprobar
                  </button>
                  <button
                    className="rounded-md bg-red-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                    disabled={isActionLoading}
                    type="button"
                    onClick={() => void updateBusiness(business.id, { status: "rejected" })}
                  >
                    Rechazar
                  </button>
                  <button
                    className="rounded-md bg-slate-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                    disabled={isActionLoading}
                    type="button"
                    onClick={() => void updateBusiness(business.id, { status: "paused" })}
                  >
                    Pausar
                  </button>
                  <button
                    className="rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-xs font-bold text-casero-dark disabled:opacity-50"
                    disabled={isActionLoading}
                    type="button"
                    onClick={() => void updateBusiness(business.id, { status: "pending" })}
                  >
                    Volver a pendiente
                  </button>
                  <button
                    className="rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-xs font-bold text-casero-dark disabled:opacity-50"
                    disabled={isActionLoading}
                    type="button"
                    onClick={() => void updateBusiness(business.id, { is_verified: !business.is_verified })}
                  >
                    {business.is_verified ? "Quitar verificación" : "Verificar"}
                  </button>
                  <button
                    className="rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-xs font-bold text-casero-dark disabled:opacity-50"
                    disabled={isActionLoading}
                    type="button"
                    onClick={() => void updateBusiness(business.id, { is_featured: !business.is_featured })}
                  >
                    {business.is_featured ? "Quitar destacado" : "Destacar"}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {!loading && filteredBusinesses.length === 0 ? (
        <Card className="mt-6">
          <p className="text-sm text-casero-text/70">No hay negocios para este filtro.</p>
        </Card>
      ) : null}
    </section>
  );
}
