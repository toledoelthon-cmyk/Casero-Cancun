"use client";

import { useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { EmptyResultsState } from "@/components/public/EmptyResultsState";
import { Card } from "@/components/ui/Card";
import type { CategorySection, DemoBusiness, DemoCategory, DemoLocation } from "@/lib/demo-data";

type PublicBusinessDirectoryProps = {
  businesses: DemoBusiness[];
  categories: DemoCategory[];
  locations: DemoLocation[];
  initialSection?: CategorySection | "all";
  initialQuery?: string;
  title?: string;
};

const sectionOptions: Array<{ label: string; value: CategorySection }> = [
  { label: "Servicios del hogar", value: "home_services" },
  { label: "Tiendas y materiales", value: "stores_materials" },
  { label: "Mascotas", value: "pets" },
  { label: "Servicios para tu auto", value: "auto_services" },
];

const attributeOptions = [
  { label: "Verificado", value: "verified" },
  { label: "Atiende urgencias", value: "emergency" },
  { label: "Servicio a domicilio", value: "home_service" },
  { label: "Emite factura", value: "invoice" },
  { label: "Acepta tarjeta", value: "card" },
  { label: "Atiende Airbnb", value: "airbnb" },
  { label: "Tiene ubicación física", value: "physical" },
  { label: "Muestra mapa", value: "map" },
] as const;

type AttributeValue = (typeof attributeOptions)[number]["value"];

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesAttribute(business: DemoBusiness, attribute: AttributeValue) {
  const badges = business.badges.map(normalize);
  const features = (business.features ?? []).map(normalize);
  const hasCoordinates =
    typeof business.latitude === "number" &&
    Number.isFinite(business.latitude) &&
    typeof business.longitude === "number" &&
    Number.isFinite(business.longitude);

  if (attribute === "verified") return business.verified;
  if (attribute === "emergency") return badges.includes("urgencias");
  if (attribute === "home_service") {
    return business.locationMode === "home_service" || business.locationMode === "both" || features.includes("servicio a domicilio");
  }
  if (attribute === "invoice") return badges.includes("factura");
  if (attribute === "card") return features.includes("acepta tarjeta");
  if (attribute === "airbnb") return badges.includes("atiende airbnb");
  if (attribute === "physical") return Boolean(business.hasPhysicalLocation);
  if (attribute === "map") return Boolean(business.showMap && hasCoordinates);
  return true;
}

export function PublicBusinessDirectory({
  businesses,
  categories,
  locations,
  initialSection = "all",
  initialQuery = "",
  title = "Resultados",
}: PublicBusinessDirectoryProps) {
  const [query, setQuery] = useState(initialQuery);
  const [section, setSection] = useState<CategorySection | "all">(initialSection);
  const [categorySlug, setCategorySlug] = useState("all");
  const [locationSlug, setLocationSlug] = useState("all");
  const [attributes, setAttributes] = useState<AttributeValue[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visibleCategories = useMemo(() => {
    if (section === "all") {
      return categories;
    }

    return categories.filter((category) => category.section === section);
  }, [categories, section]);

  const filteredBusinesses = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return businesses.filter((business) => {
      const businessCategories = business.categorySlugs ?? [];
      const businessLocations = business.locationSlugs ?? [];
      const searchable = normalize(
        [
          business.name,
          business.shortDescription,
          business.category,
          ...(business.categories ?? []),
          business.mainService ?? "",
          ...(business.features ?? []),
          ...(business.badges ?? []),
          business.location,
          ...(business.locations ?? []),
          business.address ?? "",
        ].join(" "),
      );

      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (section === "all" || business.section === section) &&
        (categorySlug === "all" || businessCategories.includes(categorySlug)) &&
        (locationSlug === "all" || businessLocations.includes(locationSlug)) &&
        attributes.every((attribute) => matchesAttribute(business, attribute))
      );
    });
  }, [attributes, businesses, categorySlug, locationSlug, query, section]);

  function toggleAttribute(attribute: AttributeValue) {
    setAttributes((current) =>
      current.includes(attribute) ? current.filter((item) => item !== attribute) : [...current, attribute],
    );
  }

  function clearFilters() {
    setQuery("");
    setSection(initialSection);
    setCategorySlug("all");
    setLocationSlug("all");
    setAttributes([]);
  }

  const activeFilterCount =
    (query.trim() ? 1 : 0) +
    (section !== initialSection ? 1 : 0) +
    (categorySlug !== "all" ? 1 : 0) +
    (locationSlug !== "all" ? 1 : 0) +
    attributes.length;

  const filtersContent = (
    <>
      <div className="flex items-center gap-2 text-sm font-extrabold text-casero-dark">
        <SlidersHorizontal className="h-4 w-4 text-casero-green" aria-hidden />
        Filtros para afinar resultados
      </div>

      <label className="mt-5 block text-sm font-bold text-casero-dark" htmlFor="directory-query">
        Buscar por texto
      </label>
      <div className="mt-2 flex min-h-12 items-center gap-2 rounded-xl border border-casero-dark/10 bg-casero-background px-3">
        <Search className="h-4 w-4 text-casero-green" aria-hidden />
        <input
          id="directory-query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-transparent text-base font-semibold outline-none placeholder:text-casero-text/42 lg:text-sm"
          placeholder="Plomería, ferretería, veterinaria..."
        />
      </div>

      <label className="mt-5 block text-sm font-bold text-casero-dark" htmlFor="directory-section">
        Área
      </label>
      <select
        id="directory-section"
        value={section}
        onChange={(event) => {
          setSection(event.target.value as CategorySection | "all");
          setCategorySlug("all");
        }}
        className="mt-2 w-full rounded-xl border border-casero-dark/10 bg-white px-3 py-3 text-base font-semibold outline-casero-green lg:text-sm"
      >
        <option value="all">Todas las áreas</option>
        {sectionOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <label className="mt-5 block text-sm font-bold text-casero-dark" htmlFor="directory-category">
        Categoría
      </label>
      <select
        id="directory-category"
        value={categorySlug}
        onChange={(event) => setCategorySlug(event.target.value)}
        className="mt-2 w-full rounded-xl border border-casero-dark/10 bg-white px-3 py-3 text-base font-semibold outline-casero-green lg:text-sm"
      >
        <option value="all">Todas las categorías</option>
        {visibleCategories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>

      <label className="mt-5 block text-sm font-bold text-casero-dark" htmlFor="directory-location">
        Zona
      </label>
      <select
        id="directory-location"
        value={locationSlug}
        onChange={(event) => setLocationSlug(event.target.value)}
        className="mt-2 w-full rounded-xl border border-casero-dark/10 bg-white px-3 py-3 text-base font-semibold outline-casero-green lg:text-sm"
      >
        <option value="all">Todas las zonas</option>
        {locations.map((location) => (
          <option key={location.slug} value={location.slug}>
            {location.name}
          </option>
        ))}
      </select>

      <div className="mt-5">
        <p className="text-sm font-bold text-casero-dark">Atributos</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {attributeOptions.map((attribute) => {
            const active = attributes.includes(attribute.value);

            return (
              <button
                key={attribute.value}
                className={
                  active
                    ? "rounded-full bg-casero-green px-3 py-2 text-sm font-extrabold text-white shadow-sm lg:text-xs"
                    : "rounded-full border border-casero-dark/10 bg-white px-3 py-2 text-sm font-bold text-casero-text/70 transition hover:border-casero-green/35 hover:text-casero-dark lg:text-xs"
                }
                type="button"
                onClick={() => toggleAttribute(attribute.value)}
              >
                {attribute.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        className="mt-5 min-h-12 w-full rounded-xl border border-casero-dark/10 bg-white px-3 py-3 text-sm font-extrabold text-casero-dark transition hover:border-casero-green hover:text-casero-green"
        type="button"
        onClick={clearFilters}
      >
        Limpiar filtros
      </button>
    </>
  );

  return (
    <div className="mt-6 grid gap-5 lg:mt-8 lg:grid-cols-[19.5rem_1fr] lg:gap-6">
      <aside>
        <button
          className="flex w-full items-center justify-between rounded-[1rem] border border-casero-dark/10 bg-white px-4 py-3 text-sm font-extrabold text-casero-dark shadow-sm lg:hidden"
          type="button"
          onClick={() => setFiltersOpen((current) => !current)}
          aria-expanded={filtersOpen}
        >
          <span className="inline-flex items-center gap-2">
            <Filter className="h-4 w-4 text-casero-green" aria-hidden />
            Filtrar
          </span>
          <span className="rounded-full bg-casero-background px-2.5 py-1 text-xs text-casero-text/65">{activeFilterCount ? activeFilterCount + " activos" : "Sin filtros"}</span>
        </button>
        <Card className={filtersOpen ? "mt-3 p-4 lg:sticky lg:top-24 lg:mt-0 lg:block lg:p-5" : "hidden lg:sticky lg:top-24 lg:block lg:p-5"}>
          {filtersContent}
        </Card>
      </aside>

      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-3 rounded-[1rem] border border-casero-dark/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-casero-text/50">Resultados publicados</p>
            <p className="mt-1 text-sm font-semibold text-casero-text/68">
              {title}: <strong className="text-casero-dark">{filteredBusinesses.length} negocios publicados</strong>
            </p>
          </div>
          <button
            className="min-h-11 rounded-xl border border-casero-dark/10 bg-casero-background px-3 py-2.5 text-sm font-extrabold text-casero-dark transition hover:border-casero-green hover:bg-white hover:text-casero-green"
            type="button"
            onClick={clearFilters}
          >
            Limpiar filtros
          </button>
        </div>

        <div className="grid gap-4 sm:gap-5">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => <BusinessCard key={business.id} business={business} />)
          ) : (
            <EmptyResultsState
              title="No encontramos proveedores con esos filtros"
              description="Puedes intentar otra búsqueda, cambiar la zona o registrar tu negocio para aparecer aquí cuando sea aprobado."
              resetLabel="Limpiar filtros"
              onReset={clearFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
