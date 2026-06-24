"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { Card } from "@/components/ui/Card";
import type { CategorySection, DemoBusiness, DemoCategory, DemoLocation } from "@/lib/demo-data";

type PublicBusinessDirectoryProps = {
  businesses: DemoBusiness[];
  categories: DemoCategory[];
  locations: DemoLocation[];
  initialSection?: CategorySection | "all";
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

  if (attribute === "verified") return business.verified;
  if (attribute === "emergency") return badges.includes("urgencias");
  if (attribute === "home_service") return business.locationMode === "home_service" || business.locationMode === "both" || features.includes("servicio a domicilio");
  if (attribute === "invoice") return badges.includes("factura");
  if (attribute === "card") return features.includes("acepta tarjeta");
  if (attribute === "airbnb") return badges.includes("atiende airbnb");
  if (attribute === "physical") return Boolean(business.hasPhysicalLocation);
  if (attribute === "map") return Boolean(business.showMap && business.latitude && business.longitude);
  return true;
}

export function PublicBusinessDirectory({
  businesses,
  categories,
  locations,
  initialSection = "all",
  title = "Resultados",
}: PublicBusinessDirectoryProps) {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<CategorySection | "all">(initialSection);
  const [categorySlug, setCategorySlug] = useState("all");
  const [locationSlug, setLocationSlug] = useState("all");
  const [attributes, setAttributes] = useState<AttributeValue[]>([]);

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
          business.location,
          ...(business.locations ?? []),
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

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[19rem_1fr]">
      <aside>
        <Card>
          <div className="flex items-center gap-2 text-sm font-bold text-casero-dark">
            <Filter className="h-4 w-4" aria-hidden />
            Filtros
          </div>

          <label className="mt-5 block text-sm font-bold text-casero-dark" htmlFor="directory-query">
            Buscar por texto
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-md border border-casero-dark/10 bg-casero-background px-3 py-2">
            <Search className="h-4 w-4 text-casero-text/45" aria-hidden />
            <input
              id="directory-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-casero-text/40"
              placeholder="Plomería, ferretería, veterinaria..."
            />
          </div>

          <label className="mt-5 block text-sm font-bold text-casero-dark" htmlFor="directory-section">
            Sección
          </label>
          <select
            id="directory-section"
            value={section}
            onChange={(event) => {
              setSection(event.target.value as CategorySection | "all");
              setCategorySlug("all");
            }}
            className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm"
          >
            <option value="all">Todas las secciones</option>
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
            className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm"
          >
            <option value="all">Todas las categorías</option>
            {visibleCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>

          <label className="mt-5 block text-sm font-bold text-casero-dark" htmlFor="directory-location">
            Ubicación
          </label>
          <select
            id="directory-location"
            value={locationSlug}
            onChange={(event) => setLocationSlug(event.target.value)}
            className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm"
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
                        ? "rounded-md bg-casero-green px-3 py-2 text-xs font-bold text-white"
                        : "rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-xs font-semibold text-casero-text/70"
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
        </Card>
      </aside>

      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-3 rounded-lg border border-casero-dark/10 bg-white p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-casero-text/65">
            {title}: <strong className="text-casero-dark">{filteredBusinesses.length} negocios publicados</strong>
          </p>
          <button
            className="rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-sm font-bold text-casero-dark"
            type="button"
            onClick={() => {
              setQuery("");
              setSection(initialSection);
              setCategorySlug("all");
              setLocationSlug("all");
              setAttributes([]);
            }}
          >
            Limpiar filtros
          </button>
        </div>

        <div className="grid gap-5">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => <BusinessCard key={business.id} business={business} />)
          ) : (
            <Card>
              <p className="text-sm leading-7 text-casero-text/70">
                No encontramos negocios publicados con esos filtros.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
