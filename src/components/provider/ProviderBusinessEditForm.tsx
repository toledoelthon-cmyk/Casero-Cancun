"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPicker } from "@/components/maps/MapPicker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { CategorySection, LocationMode, ProfileType, PublicationStatus } from "@/lib/supabase/types";
import type { RegistrationCategory, RegistrationLocation } from "@/lib/data/registration";

export type ProviderEditableBusiness = {
  id: string;
  business_name: string;
  slug: string;
  status: PublicationStatus | null;
  profile_type: ProfileType;
  section: CategorySection | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  short_description: string | null;
  long_description: string | null;
  main_service: string | null;
  address: string | null;
  postal_code: string | null;
  has_physical_location: boolean | null;
  location_mode: LocationMode | null;
  show_map: boolean | null;
  latitude: number | null;
  longitude: number | null;
  invoices: boolean | null;
  emergency_service: boolean | null;
  service_24_7: boolean | null;
  by_appointment: boolean | null;
  service_at_home: boolean | null;
  free_estimate: boolean | null;
  accepts_card: boolean | null;
  accepts_transfer: boolean | null;
  attends_airbnb: boolean | null;
  attends_condos: boolean | null;
  offers_warranty: boolean | null;
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
  categoryIds: string[];
  locationIds: string[];
};

type ProviderBusinessEditFormProps = {
  business: ProviderEditableBusiness;
  categories: RegistrationCategory[];
  locations: RegistrationLocation[];
};

const sectionLabels: Record<CategorySection, string> = {
  home_services: "Servicios del hogar",
  stores_materials: "Tiendas y materiales",
  pets: "Mascotas",
  auto_services: "Servicios para tu auto",
};

function getProfileTypeFromSection(section: CategorySection): ProfileType {
  return section === "stores_materials" ? "material_store" : "service_provider";
}

function getDefaultLocationMode(section: CategorySection): LocationMode {
  if (section === "stores_materials") {
    return "physical";
  }

  if (section === "home_services") {
    return "zones_only";
  }

  return "home_service";
}

function getLocationFlags(section: CategorySection, locationMode: LocationMode) {
  if (section === "stores_materials") {
    return { hasPhysicalLocation: true, showMap: true, locationMode: "physical" as LocationMode };
  }

  if (locationMode === "physical" || locationMode === "both") {
    return { hasPhysicalLocation: true, showMap: true, locationMode };
  }

  if (locationMode === "home_service") {
    return { hasPhysicalLocation: false, showMap: false, locationMode };
  }

  return { hasPhysicalLocation: false, showMap: false, locationMode: "zones_only" as LocationMode };
}

function successCode(status: PublicationStatus | null) {
  if (status === "published") {
    return "published";
  }

  if (status === "rejected") {
    return "rejected";
  }

  if (status === "pending") {
    return "pending";
  }

  return "updated";
}

export function ProviderBusinessEditForm({ business, categories, locations }: ProviderBusinessEditFormProps) {
  const router = useRouter();
  const initialSection = business.section ?? "home_services";
  const [section, setSection] = useState<CategorySection>(initialSection);
  const [locationMode, setLocationMode] = useState<LocationMode>(business.location_mode ?? getDefaultLocationMode(initialSection));
  const [categoryIds, setCategoryIds] = useState<string[]>(business.categoryIds);
  const [locationIds, setLocationIds] = useState<string[]>(business.locationIds);
  const [mapPosition, setMapPosition] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: business.latitude,
    longitude: business.longitude,
  });
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.section === section),
    [categories, section],
  );
  const locationFlags = getLocationFlags(section, locationMode);
  const shouldShowAddressFields = locationFlags.showMap;
  const fieldClass = "mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green";
  const sectionClass = "rounded-lg border border-casero-dark/10 bg-casero-background p-4 sm:p-5";

  function toggleCategory(categoryId: string) {
    setCategoryIds((current) =>
      current.includes(categoryId) ? current.filter((id) => id !== categoryId) : [...current, categoryId],
    );
  }

  function toggleLocation(locationId: string) {
    setLocationIds((current) =>
      current.includes(locationId) ? current.filter((id) => id !== locationId) : [...current, locationId],
    );
  }

  function handleSectionChange(nextSection: CategorySection) {
    setSection(nextSection);
    setLocationMode(getDefaultLocationMode(nextSection));
    setCategoryIds([]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (categoryIds.length === 0 || locationIds.length === 0) {
      setStatus("error");
      setMessage("Selecciona al menos una categoria y una zona para reenviar tu negocio a revision.");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setStatus("error");
      setMessage("Supabase no esta configurado.");
      return;
    }

    setStatus("saving");
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const mainService = String(formData.get("mainService") ?? "").trim();
    const selectedFirstCategory = filteredCategories.find((category) => categoryIds.includes(category.id));
    const updatePayload = {
      business_name: String(formData.get("businessName") ?? "").trim(),
      profile_type: getProfileTypeFromSection(section),
      section,
      whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      short_description: String(formData.get("shortDescription") ?? "").trim() || null,
      long_description: String(formData.get("longDescription") ?? "").trim() || null,
      main_service: mainService || selectedFirstCategory?.name || null,
      address: shouldShowAddressFields ? String(formData.get("address") ?? "").trim() || null : null,
      postal_code: shouldShowAddressFields ? String(formData.get("postalCode") ?? "").trim() || null : null,
      has_physical_location: locationFlags.hasPhysicalLocation,
      location_mode: locationFlags.locationMode,
      show_map: locationFlags.showMap,
      latitude: shouldShowAddressFields && Number.isFinite(mapPosition.latitude) ? mapPosition.latitude : null,
      longitude: shouldShowAddressFields && Number.isFinite(mapPosition.longitude) ? mapPosition.longitude : null,
      invoices: formData.get("invoices") === "on",
      emergency_service: formData.get("emergencyService") === "on",
      service_24_7: formData.get("service247") === "on",
      by_appointment: formData.get("byAppointment") === "on",
      service_at_home:
        formData.get("serviceAtHome") === "on" || locationFlags.locationMode === "home_service" || locationFlags.locationMode === "both",
      free_estimate: formData.get("freeEstimate") === "on",
      accepts_card: formData.get("acceptsCard") === "on",
      accepts_transfer: formData.get("acceptsTransfer") === "on",
      attends_airbnb: formData.get("attendsAirbnb") === "on",
      attends_condos: formData.get("attendsCondos") === "on",
      offers_warranty: formData.get("offersWarranty") === "on",
      retail_sales: formData.get("retailSales") === "on",
      wholesale_sales: formData.get("wholesaleSales") === "on",
      delivery_available: formData.get("deliveryAvailable") === "on",
      authorized_distributor: formData.get("authorizedDistributor") === "on",
      pet_veterinary_service: formData.get("petVeterinaryService") === "on",
      pet_grooming: formData.get("petGrooming") === "on",
      pet_daycare: formData.get("petDaycare") === "on",
      pet_food_accessories: formData.get("petFoodAccessories") === "on",
      auto_tow_service: formData.get("autoTowService") === "on",
      auto_diagnostics: formData.get("autoDiagnostics") === "on",
      auto_parts: formData.get("autoParts") === "on",
      auto_wash_detailing: formData.get("autoWashDetailing") === "on",
      status: "pending" as const,
      is_verified: false,
      is_featured: false,
    };

    try {
      const { error: profileError } = await supabase.from("business_profiles").update(updatePayload).eq("id", business.id);

      if (profileError) {
        throw profileError;
      }

      const [deleteCategories, deleteLocations] = await Promise.all([
        supabase.from("business_categories").delete().eq("business_id", business.id),
        supabase.from("business_locations").delete().eq("business_id", business.id),
      ]);

      if (deleteCategories.error || deleteLocations.error) {
        throw deleteCategories.error ?? deleteLocations.error;
      }

      const [insertCategories, insertLocations] = await Promise.all([
        supabase.from("business_categories").insert(
          categoryIds.map((categoryId) => ({
            business_id: business.id,
            category_id: categoryId,
          })),
        ),
        supabase.from("business_locations").insert(
          locationIds.map((locationId) => ({
            business_id: business.id,
            location_id: locationId,
          })),
        ),
      ]);

      if (insertCategories.error || insertLocations.error) {
        throw insertCategories.error ?? insertLocations.error;
      }

      router.replace(`/proveedor/panel?actualizado=${successCode(business.status)}`);
      router.refresh();
    } catch (error) {
      console.error("provider business update failed", { businessId: business.id, error });
      setStatus("error");
      setMessage("No pudimos guardar los cambios. Revisa la informacion e intenta de nuevo.");
    }
  }

  const isSaving = status === "saving";

  return (
    <Card className="p-4 sm:p-6">
      {message ? <p className="mb-5 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{message}</p> : null}
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <fieldset className={sectionClass}>
          <legend className="px-1 text-sm font-bold text-casero-dark">Datos principales</legend>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-bold text-casero-dark md:col-span-2">
              Nombre del negocio
              <input name="businessName" defaultValue={business.business_name} required className={fieldClass} />
            </label>
            <label className="text-sm font-bold text-casero-dark">
              WhatsApp
              <input name="whatsapp" defaultValue={business.whatsapp ?? ""} required className={fieldClass} />
            </label>
            <label className="text-sm font-bold text-casero-dark">
              Telefono
              <input name="phone" defaultValue={business.phone ?? ""} className={fieldClass} />
            </label>
            <label className="text-sm font-bold text-casero-dark md:col-span-2">
              Correo
              <input name="email" type="email" defaultValue={business.email ?? ""} required className={fieldClass} />
            </label>
            <label className="text-sm font-bold text-casero-dark md:col-span-2">
              Servicio principal
              <input name="mainService" defaultValue={business.main_service ?? ""} className={fieldClass} />
            </label>
            <label className="text-sm font-bold text-casero-dark md:col-span-2">
              Descripcion breve
              <textarea name="shortDescription" defaultValue={business.short_description ?? ""} required className={`${fieldClass} min-h-24`} />
            </label>
            <label className="text-sm font-bold text-casero-dark md:col-span-2">
              Descripcion completa
              <textarea name="longDescription" defaultValue={business.long_description ?? ""} className={`${fieldClass} min-h-28`} />
            </label>
          </div>
        </fieldset>

        <fieldset className={sectionClass}>
          <legend className="px-1 text-sm font-bold text-casero-dark">Seccion y categorias</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(Object.keys(sectionLabels) as CategorySection[]).map((item) => (
              <label key={item} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-casero-text/75">
                <input type="radio" name="section" checked={section === item} onChange={() => handleSectionChange(item)} className="h-4 w-4 accent-casero-green" />
                {sectionLabels[item]}
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`min-h-10 rounded-md border px-3 py-2 text-left text-sm font-bold transition ${
                  categoryIds.includes(category.id)
                    ? "border-casero-green bg-casero-green text-white"
                    : "border-casero-dark/10 bg-white text-casero-dark hover:border-casero-green/50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={sectionClass}>
          <legend className="px-1 text-sm font-bold text-casero-dark">Zonas y mapa</legend>
          {section !== "stores_materials" ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {([
                ["physical", "Local fisico"],
                ["home_service", "A domicilio"],
                ["zones_only", "Solo zonas"],
                ["both", "Ambos"],
              ] as Array<[LocationMode, string]>).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-casero-text/75">
                  <input type="radio" name="locationMode" checked={locationMode === value} onChange={() => setLocationMode(value)} className="h-4 w-4 accent-casero-green" />
                  {label}
                </label>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm leading-6 text-casero-text/70">Las tiendas se publican como local fisico con direccion y mapa.</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {locations.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => toggleLocation(location.id)}
                className={`min-h-10 rounded-md border px-3 py-2 text-left text-sm font-bold transition ${
                  locationIds.includes(location.id)
                    ? "border-casero-green bg-casero-green text-white"
                    : "border-casero-dark/10 bg-white text-casero-dark hover:border-casero-green/50"
                }`}
              >
                {location.name}
              </button>
            ))}
          </div>

          {shouldShowAddressFields ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold text-casero-dark">
                Direccion
                <input name="address" defaultValue={business.address ?? ""} className={fieldClass} />
              </label>
              <label className="text-sm font-bold text-casero-dark">
                Codigo postal
                <input name="postalCode" defaultValue={business.postal_code ?? ""} className={fieldClass} />
              </label>
              <MapPicker latitude={mapPosition.latitude} longitude={mapPosition.longitude} onChange={setMapPosition} />
            </div>
          ) : null}
        </fieldset>

        <fieldset className={sectionClass}>
          <legend className="px-1 text-sm font-bold text-casero-dark">Caracteristicas</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              ["serviceAtHome", "Servicio a domicilio", business.service_at_home],
              ["emergencyService", "Atiende urgencias", business.emergency_service],
              ["service247", "Atencion 24/7", business.service_24_7],
              ["byAppointment", "Con cita previa", business.by_appointment],
              ["freeEstimate", "Presupuesto sin costo", business.free_estimate],
              ["invoices", "Emite factura", business.invoices],
              ["acceptsCard", "Acepta tarjeta", business.accepts_card],
              ["acceptsTransfer", "Acepta transferencia", business.accepts_transfer],
              ["offersWarranty", "Ofrece garantia", business.offers_warranty],
              ["attendsCondos", "Atiende condominios", business.attends_condos],
              ["attendsAirbnb", "Atiende Airbnb", business.attends_airbnb],
              ["retailSales", "Venta al publico", business.retail_sales],
              ["wholesaleSales", "Venta por mayoreo", business.wholesale_sales],
              ["deliveryAvailable", "Entrega a domicilio", business.delivery_available],
              ["authorizedDistributor", "Distribuidor autorizado", business.authorized_distributor],
              ["petVeterinaryService", "Atencion veterinaria", business.pet_veterinary_service],
              ["petGrooming", "Estetica / bano y corte", business.pet_grooming],
              ["petDaycare", "Guarderia", business.pet_daycare],
              ["petFoodAccessories", "Alimentos o accesorios", business.pet_food_accessories],
              ["autoTowService", "Grua disponible", business.auto_tow_service],
              ["autoDiagnostics", "Diagnostico", business.auto_diagnostics],
              ["autoParts", "Refacciones", business.auto_parts],
              ["autoWashDetailing", "Lavado / detallado", business.auto_wash_detailing],
            ].map(([name, label, checked]) => (
              <label key={String(name)} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                <input name={String(name)} type="checkbox" defaultChecked={Boolean(checked)} className="h-4 w-4 accent-casero-green" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" variant="secondary" disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar y enviar a revision"}
          </Button>
          <Button href="/proveedor/panel" variant="outline">
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
