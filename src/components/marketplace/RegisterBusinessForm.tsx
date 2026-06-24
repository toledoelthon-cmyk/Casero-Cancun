"use client";

import { FormEvent, useMemo, useState } from "react";
import { MapPicker } from "@/components/maps/MapPicker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { RegistrationCategory, RegistrationLocation, RegistrationPlan } from "@/lib/data/registration";
import { createSupabaseBrowserClient, missingSupabaseMessage } from "@/lib/supabase/client";
import type { BusinessProfileInsert, CategorySection, LocationMode, ProfileType } from "@/lib/supabase/types";
import { slugify } from "@/lib/utils/slugify";
import { normalizeWhatsapp } from "@/lib/utils/whatsapp";

type RegisterBusinessFormProps = {
  plans: RegistrationPlan[];
  categories: RegistrationCategory[];
  locations: RegistrationLocation[];
  supabaseConfigured: boolean;
  source: "supabase" | "demo";
};

const successMessage =
  "Tu solicitud fue enviada correctamente. Revisaremos la información de tu negocio y te contactaremos por WhatsApp.";
const errorMessage = "No pudimos enviar tu solicitud. Intenta de nuevo o contáctanos por WhatsApp.";
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const storageBucket = "business-media";

const businessSectionLabels: Record<CategorySection, string> = {
  home_services: "Servicios del hogar",
  stores_materials: "Tiendas y materiales",
  pets: "Mascotas",
  auto_services: "Servicios para tu auto",
};

function getProfileTypeFromSection(section: CategorySection | ""): ProfileType | "" {
  if (!section) {
    return "";
  }

  return section === "stores_materials" ? "material_store" : "service_provider";
}

function getPlanFileSizeLimit(slug?: string) {
  if (slug === "premium") {
    return 5;
  }

  if (slug === "pro") {
    return 3;
  }

  return 2;
}

function fileToPreview(file: File) {
  return {
    file,
    previewUrl: URL.createObjectURL(file),
  };
}

type ImagePreview = ReturnType<typeof fileToPreview>;

function getDefaultLocationMode(section: CategorySection | ""): LocationMode {
  if (section === "stores_materials") {
    return "physical";
  }

  if (section === "home_services") {
    return "zones_only";
  }

  return "home_service";
}

function getLocationFlags(section: CategorySection | "", locationMode: LocationMode) {
  if (section === "stores_materials") {
    return { hasPhysicalLocation: true, showMap: true, locationMode: "physical" as LocationMode };
  }

  if (locationMode === "physical") {
    return { hasPhysicalLocation: true, showMap: true, locationMode };
  }

  if (locationMode === "both") {
    return { hasPhysicalLocation: true, showMap: true, locationMode };
  }

  if (locationMode === "home_service") {
    return { hasPhysicalLocation: false, showMap: false, locationMode };
  }

  return { hasPhysicalLocation: false, showMap: false, locationMode: "zones_only" as LocationMode };
}

export function RegisterBusinessForm({
  plans,
  categories,
  locations,
  supabaseConfigured,
  source,
}: RegisterBusinessFormProps) {
  const [businessSection, setBusinessSection] = useState<CategorySection | "">("");
  const [locationMode, setLocationMode] = useState<LocationMode>("zones_only");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [locationIds, setLocationIds] = useState<string[]>([]);
  const [planId, setPlanId] = useState("");
  const [mapPosition, setMapPosition] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null,
  });
  const [logoFile, setLogoFile] = useState<ImagePreview | null>(null);
  const [businessFiles, setBusinessFiles] = useState<ImagePreview[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!businessSection) {
      return [];
    }

    return categories.filter((category) => category.section === businessSection);
  }, [businessSection, categories]);

  const profileType = getProfileTypeFromSection(businessSection);
  const categoryLabel =
    profileType === "service_provider"
      ? "Categoría de servicio"
      : profileType === "material_store"
        ? "Categoría de tienda o materiales"
        : "Categoría principal";

  const selectedPlan = plans.find((plan) => plan.id === planId);
  const maxCategories = selectedPlan?.maxCategories ?? 2;
  const maxLocations = selectedPlan?.maxLocations ?? 2;
  const maxPhotos = selectedPlan?.maxPhotos ?? 3;
  const maxFileSizeMb = getPlanFileSizeLimit(selectedPlan?.slug);
  const selectedImages = [...(logoFile ? [logoFile] : []), ...businessFiles];
  const exceedsPlanLimit = selectedImages.length > maxPhotos;
  const exceedsCategoryLimit = categoryIds.length > maxCategories;
  const exceedsLocationLimit = locationIds.length > maxLocations;
  const selectedCategoryItems = filteredCategories.filter((category) => categoryIds.includes(category.id));
  const availableCategoryItems = filteredCategories.filter((category) => !categoryIds.includes(category.id));
  const selectedLocationItems = locations.filter((location) => locationIds.includes(location.id));
  const availableLocationItems = locations.filter((location) => !locationIds.includes(location.id));
  const locationFlags = getLocationFlags(businessSection, locationMode);
  const shouldShowAddressFields = locationFlags.showMap;

  function validateFiles(nextLogoFile: ImagePreview | null, nextBusinessFiles: ImagePreview[]) {
    const files = [...(nextLogoFile ? [nextLogoFile] : []), ...nextBusinessFiles];

    if (files.length > maxPhotos) {
      return `Supera el máximo del plan seleccionado. Este plan permite hasta ${maxPhotos} imágenes.`;
    }

    const invalidType = files.find((item) => !allowedImageTypes.includes(item.file.type));
    if (invalidType) {
      return `Formato no permitido: ${invalidType.file.name}. Usa JPG, PNG o WebP.`;
    }

    const maxBytes = maxFileSizeMb * 1024 * 1024;
    const oversized = files.find((item) => item.file.size > maxBytes);
    if (oversized) {
      return `Imagen demasiado pesada: ${oversized.file.name}. El límite de este plan es ${maxFileSizeMb} MB por imagen.`;
    }

    return null;
  }

  function handleLogoChange(fileList: FileList | null) {
    const file = fileList?.[0];
    const nextLogoFile = file ? fileToPreview(file) : null;
    const validationError = validateFiles(nextLogoFile, businessFiles);
    setLogoFile(nextLogoFile);
    setFormMessage(validationError);
    setStatus(validationError ? "error" : "idle");
  }

  function handleBusinessFilesChange(fileList: FileList | null) {
    const nextBusinessFiles = Array.from(fileList ?? []).map(fileToPreview);
    const validationError = validateFiles(logoFile, nextBusinessFiles);
    setBusinessFiles(nextBusinessFiles);
    setFormMessage(validationError);
    setStatus(validationError ? "error" : "idle");
  }

  function removeLogo() {
    const validationError = validateFiles(null, businessFiles);
    setLogoFile(null);
    setFormMessage(validationError);
    setStatus(validationError ? "error" : "idle");
  }

  function removeBusinessFile(index: number) {
    const nextBusinessFiles = businessFiles.filter((_, itemIndex) => itemIndex !== index);
    const validationError = validateFiles(logoFile, nextBusinessFiles);
    setBusinessFiles(nextBusinessFiles);
    setFormMessage(validationError);
    setStatus(validationError ? "error" : "idle");
  }

  function addCategory(categoryId: string) {
    if (categoryIds.includes(categoryId)) {
      return;
    }

    if (categoryIds.length >= maxCategories) {
      setStatus("error");
      setFormMessage(`Tu plan permite seleccionar hasta ${maxCategories} categorías.`);
      return;
    }

    setCategoryIds([...categoryIds, categoryId]);
    setStatus("idle");
    setFormMessage(null);
  }

  function removeCategory(categoryId: string) {
    setCategoryIds(categoryIds.filter((id) => id !== categoryId));
    setStatus("idle");
    setFormMessage(null);
  }

  function addLocation(locationId: string) {
    if (locationIds.includes(locationId)) {
      return;
    }

    if (locationIds.length >= maxLocations) {
      setStatus("error");
      setFormMessage(`Tu plan permite seleccionar hasta ${maxLocations} zonas.`);
      return;
    }

    setLocationIds([...locationIds, locationId]);
    setStatus("idle");
    setFormMessage(null);
  }

  function removeLocation(locationId: string) {
    setLocationIds(locationIds.filter((id) => id !== locationId));
    setStatus("idle");
    setFormMessage(null);
  }

  async function uploadBusinessImages(businessId: string, businessSlug: string, businessName: string) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      throw new Error(missingSupabaseMessage);
    }

    const images = selectedImages;

    for (let index = 0; index < images.length; index += 1) {
      const image = images[index];
      const fileExtension = image.file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const safeFileName = slugify(image.file.name.replace(/\.[^.]+$/, ""));
      const path = `${businessId}/${businessSlug}-${index}-${safeFileName}-${Date.now()}.${fileExtension}`;
      const { error: uploadError } = await supabase.storage.from(storageBucket).upload(path, image.file, {
        cacheControl: "3600",
        upsert: false,
        contentType: image.file.type,
      });

      if (uploadError) {
        console.error("business image upload error", { path, error: uploadError });
        throw new Error("Error al subir imagen. Revisa el archivo e intenta de nuevo.");
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(storageBucket).getPublicUrl(path);

      const { error: mediaError } = await supabase.from("business_media").insert({
        business_id: businessId,
        url: publicUrl,
        type: "image",
        alt: index === 0 ? `Imagen principal de ${businessName}` : `Imagen de ${businessName}`,
        sort_order: index,
      });

      if (mediaError) {
        console.error("business_media insert error", mediaError);
        throw new Error("Error al subir imagen. No pudimos guardar la imagen en la galeria.");
      }
    }
  }

  async function insertBusiness(payload: BusinessProfileInsert, selectedCategoryIds: string[], selectedLocationIds: string[]) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase || !supabaseConfigured || source !== "supabase") {
      console.error(missingSupabaseMessage, {
        supabaseConfigured,
        source,
      });
      throw new Error(missingSupabaseMessage);
    }

    const { data, error } = await supabase.from("business_profiles").insert(payload).select("id").single();

    if (error) {
      console.error("business_profiles insert error", { error, payload });
      throw error;
    }

    const businessId = data.id;

    const [categoryResult, locationResult] = await Promise.all([
      supabase.from("business_categories").insert(
        selectedCategoryIds.map((categoryId) => ({
          business_id: businessId,
          category_id: categoryId,
        })),
      ),
      supabase.from("business_locations").insert(
        selectedLocationIds.map((locationId) => ({
          business_id: businessId,
          location_id: locationId,
        })),
      ),
    ]);

    if (categoryResult.error) {
      console.error("business_categories insert error", categoryResult.error);
    }

    if (locationResult.error) {
      console.error("business_locations insert error", locationResult.error);
    }

    if (categoryResult.error || locationResult.error) {
      throw categoryResult.error ?? locationResult.error;
    }

    await uploadBusinessImages(businessId, payload.slug, payload.business_name);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Supabase env check", {
      hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    });
    setStatus("loading");
    setFormMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const businessName = String(formData.get("businessName") ?? "").trim();
    const responsibleName = String(formData.get("responsibleName") ?? "").trim();
    const whatsappInput = String(formData.get("whatsapp") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const shortDescription = String(formData.get("shortDescription") ?? "").trim();
    const submittedPlanId = String(formData.get("planId") ?? "");
    const additionalMessage = String(formData.get("additionalMessage") ?? "").trim();
    const latitudeInput = shouldShowAddressFields ? String(formData.get("latitude") ?? "").trim() : "";
    const longitudeInput = shouldShowAddressFields ? String(formData.get("longitude") ?? "").trim() : "";
    const latitude = latitudeInput ? Number(latitudeInput) : null;
    const longitude = longitudeInput ? Number(longitudeInput) : null;

    const normalizedWhatsapp = normalizeWhatsapp(whatsappInput);
    const selectedCategories = categories.filter((category) => categoryIds.includes(category.id));
    const selectedLocations = locations.filter((location) => locationIds.includes(location.id));
    const categoriesMatchSelectedSection = selectedCategories.every((category) => category.section === businessSection);
    const imageValidationError = validateFiles(logoFile, businessFiles);
    const selectionValidationError = exceedsCategoryLimit
      ? `Tu plan permite seleccionar hasta ${maxCategories} categorias.`
      : exceedsLocationLimit
        ? `Tu plan permite seleccionar hasta ${maxLocations} ubicaciones.`
        : selectedCategories.length > 0 && !categoriesMatchSelectedSection
          ? "Las categorias seleccionadas no corresponden a la seccion elegida."
        : null;

    if (
      !businessName ||
      !responsibleName ||
      !normalizedWhatsapp ||
      !email ||
      !profileType ||
      !businessSection ||
      selectedCategories.length === 0 ||
      locationIds.length === 0 ||
      !shortDescription ||
      imageValidationError ||
      selectionValidationError
    ) {
      setStatus("error");
      setFormMessage(
        imageValidationError ??
          selectionValidationError ??
          (normalizedWhatsapp
          ? "Completa todos los campos obligatorios para enviar tu solicitud."
          : "Ingresa un WhatsApp válido. Puedes usar 9984032240, +52 998 403 2240 o 52 9984032240."),
      );
      return;
    }

    const baseSlug = slugify(businessName);
    const payload: BusinessProfileInsert = {
      business_name: businessName,
      responsible_name: responsibleName,
      slug: baseSlug,
      profile_type: profileType,
      section: businessSection,
      short_description: shortDescription,
      long_description: additionalMessage || null,
      whatsapp: normalizedWhatsapp,
      phone: normalizedWhatsapp,
      email,
      address: shouldShowAddressFields ? String(formData.get("address") ?? "").trim() || null : null,
      postal_code: shouldShowAddressFields ? String(formData.get("postalCode") ?? "").trim() || null : null,
      has_physical_location: locationFlags.hasPhysicalLocation,
      location_mode: locationFlags.locationMode,
      show_map: locationFlags.showMap,
      latitude: shouldShowAddressFields && Number.isFinite(latitude) ? latitude : null,
      longitude: shouldShowAddressFields && Number.isFinite(longitude) ? longitude : null,
      status: "pending",
      plan_id: submittedPlanId || null,
      main_service: selectedCategories[0].name,
      invoices: formData.get("invoices") === "on",
      emergency_service: formData.get("emergencyService") === "on",
      service_24_7: formData.get("service247") === "on",
      by_appointment: formData.get("byAppointment") === "on",
      service_at_home: formData.get("serviceAtHome") === "on" || locationFlags.locationMode === "home_service" || locationFlags.locationMode === "both",
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
    };

    console.log("Submitting business registration", {
      selectedSection: businessSection,
      "profile_type enviado": profileType,
      "section enviada": businessSection,
      "categorias seleccionadas": selectedCategories.map((category) => ({
        id: category.id,
        name: category.name,
        section: category.section,
      })),
      "ubicaciones seleccionadas": selectedLocations.map((location) => ({
        id: location.id,
        name: location.name,
      })),
      planId: submittedPlanId,
      profileType,
      section: businessSection,
      categoryIds,
      locationIds,
      payload,
    });

    try {
      try {
        await insertBusiness(payload, categoryIds, locationIds);
      } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "23505") {
          await insertBusiness(
            { ...payload, slug: `${baseSlug}-${Date.now().toString(36)}` },
            categoryIds,
            locationIds,
          );
        } else {
          throw error;
        }
      }

      setStatus("success");
      setFormMessage(successMessage);
      form.reset();
      setBusinessSection("");
      setCategoryIds([]);
      setLocationIds([]);
      setPlanId("");
      setMapPosition({ latitude: null, longitude: null });
      setLogoFile(null);
      setBusinessFiles([]);
    } catch (error) {
      console.error("registration submit failed", {
        error,
        profileType,
        section: businessSection,
        categoryIds,
        locationIds,
      });
      setStatus("error");
      setFormMessage(error instanceof Error && error.message.startsWith("Error al subir imagen") ? error.message : errorMessage);
    }
  }

  const isLoading = status === "loading";
  const isCategoryDisabled = !profileType;

  return (
    <Card>
      {formMessage ? (
        <div
          className={
            status === "success"
              ? "mb-5 rounded-md border border-casero-green/20 bg-casero-green/10 p-4 text-sm font-semibold text-casero-green"
              : "mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
          }
        >
          {formMessage}
        </div>
      ) : null}

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-casero-dark">
            Nombre del negocio
            <input
              name="businessName"
              required
              autoComplete="organization"
              className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green"
              placeholder="Ej. Plomería Express del Caribe"
            />
          </label>
          <label className="text-sm font-bold text-casero-dark">
            Nombre del responsable
            <input
              name="responsibleName"
              required
              autoComplete="name"
              className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green"
              placeholder="Nombre y apellido"
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-casero-dark">
            WhatsApp
            <input
              name="whatsapp"
              required
              autoComplete="tel"
              className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green"
              placeholder="9984032240"
            />
          </label>
          <label className="text-sm font-bold text-casero-dark">
            Correo
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green"
              placeholder="negocio@correo.com"
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-bold text-casero-dark">
            Tipo de negocio
            <select
              name="businessSection"
              required
              value={businessSection}
              onChange={(event) => {
                const nextSection = event.target.value as CategorySection | "";
                setBusinessSection(nextSection);
                setLocationMode(getDefaultLocationMode(nextSection));
                setCategoryIds([]);
                setMapPosition({ latitude: null, longitude: null });
              }}
              className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green"
            >
              <option value="">Selecciona una seccion</option>
              {Object.entries(businessSectionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="rounded-lg border border-casero-dark/10 bg-casero-background p-4">
            <legend className="px-1 text-sm font-bold text-casero-dark">{categoryLabel}</legend>
            <p className="mt-2 text-sm font-semibold text-casero-text/70">
              {categoryIds.length} de {maxCategories} categorías seleccionadas según tu plan
            </p>
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-casero-green">Categorías seleccionadas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCategoryItems.length > 0 ? (
                  selectedCategoryItems.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => removeCategory(category.id)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-md bg-casero-green px-3 py-2 text-sm font-bold text-white"
                      aria-label={`Quitar ${category.name}`}
                    >
                      {category.name}
                      <span className="text-base leading-none" aria-hidden>×</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-casero-text/55">Aún no has seleccionado categorías.</p>
                )}
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-casero-dark/60">Categorías disponibles</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {!businessSection ? (
                  <p className="text-sm text-casero-text/55">Primero selecciona el tipo de negocio.</p>
                ) : availableCategoryItems.length > 0 ? (
                  availableCategoryItems.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => addCategory(category.id)}
                      className="min-h-11 rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-left text-sm font-bold text-casero-dark shadow-sm transition hover:border-casero-green/40 hover:text-casero-green"
                    >
                      {category.name}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-casero-text/55">No hay más categorías disponibles.</p>
                )}
              </div>
            </div>
          </fieldset>

          <label className="hidden">
            Categorias
            <select
              name="categoryIds"
              aria-label={categoryLabel}
              multiple
              disabled={!businessSection}
              value={categoryIds}
              onChange={(event) => {
                const nextCategoryIds = Array.from(event.target.selectedOptions).map((option) => option.value);
                if (nextCategoryIds.length > maxCategories) {
                  setStatus("error");
                  setFormMessage(`Tu plan permite seleccionar hasta ${maxCategories} categorias.`);
                  return;
                }

                setStatus("idle");
                setFormMessage(null);
                setCategoryIds(nextCategoryIds);
              }}
              className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green disabled:cursor-not-allowed disabled:bg-casero-background disabled:text-casero-text/45"
            >
              <option value="">
                {isCategoryDisabled ? "Primero selecciona el tipo de perfil" : "Selecciona una categoría"}
              </option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <fieldset className="rounded-lg border border-casero-dark/10 bg-casero-background p-4">
            <legend className="px-1 text-sm font-bold text-casero-dark">Zonas de atención</legend>
            <p className="mt-2 text-sm font-semibold text-casero-text/70">
              {locationIds.length} de {maxLocations} zonas seleccionadas según tu plan
            </p>
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-casero-green">Zonas seleccionadas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedLocationItems.length > 0 ? (
                  selectedLocationItems.map((location) => (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => removeLocation(location.id)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-md bg-casero-turquoise px-3 py-2 text-sm font-bold text-white"
                      aria-label={`Quitar ${location.name}`}
                    >
                      {location.name}
                      <span className="text-base leading-none" aria-hidden>×</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-casero-text/55">Aún no has seleccionado zonas.</p>
                )}
              </div>
            </div>
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-casero-dark/60">Zonas disponibles</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {availableLocationItems.length > 0 ? (
                  availableLocationItems.map((location) => (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() => addLocation(location.id)}
                      className="min-h-11 rounded-md border border-casero-dark/10 bg-white px-3 py-2 text-left text-sm font-bold text-casero-dark shadow-sm transition hover:border-casero-turquoise/50 hover:text-casero-turquoise"
                    >
                      {location.name}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-casero-text/55">No hay más zonas disponibles.</p>
                )}
              </div>
            </div>
          </fieldset>

          <label className="hidden">
            Zona de atención
            <select
              name="locationIds"
              multiple
              value={locationIds}
              onChange={(event) => {
                const nextLocationIds = Array.from(event.target.selectedOptions).map((option) => option.value);
                if (nextLocationIds.length > maxLocations) {
                  setStatus("error");
                  setFormMessage(`Tu plan permite seleccionar hasta ${maxLocations} ubicaciones.`);
                  return;
                }

                setStatus("idle");
                setFormMessage(null);
                setLocationIds(nextLocationIds);
              }}
              className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green"
            >
              <option value="">Selecciona una zona</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-bold text-casero-dark">
            Plan de interés
            <select
              name="planId"
              value={planId}
              onChange={(event) => {
                const nextPlanId = event.target.value;
                setPlanId(nextPlanId);
                const nextPlan = plans.find((plan) => plan.id === nextPlanId);
                const nextMaxCategories = nextPlan?.maxCategories ?? 2;
                const nextMaxLocations = nextPlan?.maxLocations ?? 2;
                const nextMaxPhotos = nextPlan?.maxPhotos ?? 3;

                if (categoryIds.length > nextMaxCategories) {
                  setStatus("error");
                  setFormMessage(
                    `Tu plan permite seleccionar hasta ${nextMaxCategories} categorias. Elimina categorias sobrantes para continuar.`,
                  );
                } else if (locationIds.length > nextMaxLocations) {
                  setStatus("error");
                  setFormMessage(
                    `Tu plan permite seleccionar hasta ${nextMaxLocations} ubicaciones. Elimina ubicaciones sobrantes para continuar.`,
                  );
                } else if (selectedImages.length > nextMaxPhotos) {
                  setStatus("error");
                  setFormMessage(
                    `Supera el máximo del plan seleccionado. Este plan permite hasta ${nextMaxPhotos} imágenes. Elimina imágenes sobrantes para continuar.`,
                  );
                } else {
                  setStatus("idle");
                  setFormMessage(null);
                }
              }}
              className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green"
            >
              <option value="">Por definir</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ${plan.priceMxn} MXN/mes
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset className="rounded-lg border border-casero-dark/10 bg-casero-background p-4">
          <legend className="px-1 text-sm font-bold text-casero-dark">Ubicación y mapa</legend>
          {businessSection === "home_services" ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-casero-text/75">
                <input name="locationMode" type="radio" value="physical" checked={locationMode === "physical"} onChange={() => setLocationMode("physical")} className="h-4 w-4 accent-casero-green" />
                Sí, mostrar ubicación en mapa
              </label>
              <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-casero-text/75">
                <input name="locationMode" type="radio" value="zones_only" checked={locationMode === "zones_only"} onChange={() => setLocationMode("zones_only")} className="h-4 w-4 accent-casero-green" />
                No, solo mostrar zonas de atención
              </label>
            </div>
          ) : null}

          {businessSection === "pets" || businessSection === "auto_services" ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                ["physical", businessSection === "pets" ? "Local físico" : "Sí"],
                ["home_service", businessSection === "pets" ? "A domicilio" : "No, solo servicio a domicilio"],
                ["both", businessSection === "pets" ? "Ambos" : "Ambas"],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-casero-text/75">
                  <input name="locationMode" type="radio" value={value} checked={locationMode === value} onChange={() => setLocationMode(value as LocationMode)} className="h-4 w-4 accent-casero-green" />
                  {label}
                </label>
              ))}
            </div>
          ) : null}

          {businessSection === "stores_materials" ? (
            <p className="mt-2 text-sm leading-6 text-casero-text/70">
              Las tiendas y materiales se publican como local físico con dirección y mapa.
            </p>
          ) : null}

          {shouldShowAddressFields ? (
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <label className="text-sm font-bold text-casero-dark">
                Dirección
                <input name="address" autoComplete="street-address" className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green" placeholder="Calle, avenida, colonia o referencia" />
              </label>
              <label className="text-sm font-bold text-casero-dark">
                Código postal
                <input name="postalCode" className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 font-normal outline-casero-green" placeholder="77500" />
              </label>
              <input name="latitude" type="hidden" value={mapPosition.latitude ?? ""} />
              <input name="longitude" type="hidden" value={mapPosition.longitude ?? ""} />
              <MapPicker
                latitude={mapPosition.latitude}
                longitude={mapPosition.longitude}
                onChange={(position) => setMapPosition(position)}
              />
            </div>
          ) : (
            <p className="mt-4 rounded-md bg-white p-3 text-sm font-semibold text-casero-text/65">
              Se mostrará como negocio que atiende por zonas.
            </p>
          )}
        </fieldset>

        <fieldset className="rounded-lg border border-casero-dark/10 bg-casero-background p-4">
          <legend className="px-1 text-sm font-bold text-casero-dark">Imágenes del perfil</legend>
          <p className="mt-2 text-sm leading-6 text-casero-text/70">
            Plan seleccionado: {selectedPlan?.name ?? "Básico por defecto"} · máximo {maxPhotos} imágenes ·{" "}
            {maxFileSizeMb} MB por imagen. Formatos: JPG, PNG o WebP.
          </p>
          {exceedsPlanLimit ? (
            <p className="mt-3 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
              Supera el máximo del plan seleccionado. Elimina imágenes sobrantes para continuar.
            </p>
          ) : null}

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-bold text-casero-dark">
              Logo opcional
              <input
                name="logo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => handleLogoChange(event.target.files)}
                className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 text-sm font-normal"
              />
            </label>
            <label className="text-sm font-bold text-casero-dark">
              Fotos del negocio, productos o trabajos realizados
              <input
                name="businessPhotos"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => handleBusinessFilesChange(event.target.files)}
                className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 text-sm font-normal"
              />
            </label>
          </div>

          {selectedImages.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {logoFile ? (
                <div className="overflow-hidden rounded-lg border border-casero-dark/10 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoFile.previewUrl} alt="Preview logo" className="aspect-video w-full object-cover" />
                  <div className="flex items-center justify-between gap-2 p-3">
                    <span className="text-xs font-semibold text-casero-text/70">Logo · imagen principal</span>
                    <button type="button" onClick={removeLogo} className="text-xs font-bold text-red-700">
                      Eliminar
                    </button>
                  </div>
                </div>
              ) : null}
              {businessFiles.map((item, index) => (
                <div key={`${item.file.name}-${index}`} className="overflow-hidden rounded-lg border border-casero-dark/10 bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.previewUrl} alt={`Preview ${item.file.name}`} className="aspect-video w-full object-cover" />
                  <div className="flex items-center justify-between gap-2 p-3">
                    <span className="truncate text-xs font-semibold text-casero-text/70">
                      {logoFile ? `Imagen ${index + 2}` : index === 0 ? "Imagen principal" : `Imagen ${index + 1}`}
                    </span>
                    <button type="button" onClick={() => removeBusinessFile(index)} className="text-xs font-bold text-red-700">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </fieldset>

        {profileType ? (
          <fieldset className="rounded-lg border border-casero-dark/10 bg-casero-background p-4">
            <legend className="px-1 text-sm font-bold text-casero-dark">Características inteligentes</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                ["serviceAtHome", "Servicio a domicilio"],
                ["emergencyService", "Atiende urgencias"],
                ["service247", "Atención 24/7"],
                ["byAppointment", "Servicio con cita previa"],
                ["freeEstimate", "Presupuesto sin costo"],
                ["invoices", "Emite factura"],
                ["acceptsCard", "Acepta tarjeta"],
                ["acceptsTransfer", "Acepta transferencia"],
                ["offersWarranty", "Ofrece garantía"],
              ].map(([name, label]) => (
                <label key={name} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                  <input name={name} type="checkbox" className="h-4 w-4 accent-casero-green" />
                  {label}
                </label>
              ))}

              {businessSection === "home_services" ? (
                <>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="attendsCondos" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Atiende condominios
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="attendsAirbnb" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Atiende rentas vacacionales / Airbnb
                  </label>
                </>
              ) : null}

              {businessSection === "stores_materials" ? (
                <>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="retailSales" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Venta al público
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="wholesaleSales" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Venta por mayoreo
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="deliveryAvailable" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Entrega a domicilio
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="authorizedDistributor" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Distribuidor autorizado
                  </label>
                </>
              ) : null}

              {businessSection === "pets" ? (
                <>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="petVeterinaryService" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Atención veterinaria
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="petGrooming" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Estética / baño y corte
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="petDaycare" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Guardería
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="petFoodAccessories" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Venta de alimentos o accesorios
                  </label>
                </>
              ) : null}

              {businessSection === "auto_services" ? (
                <>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="autoTowService" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Grúa disponible
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="autoDiagnostics" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Diagnóstico
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="autoParts" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Refacciones
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="autoWashDetailing" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    Lavado / detallado
                  </label>
                </>
              ) : null}
            </div>
          </fieldset>
        ) : null}

        {profileType ? (
          <fieldset className="rounded-lg border border-casero-dark/10 bg-casero-background p-4">
            <legend className="px-1 text-sm font-bold text-casero-dark">
              {profileType === "service_provider" ? "Detalles del servicio" : "Detalles de la tienda"}
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {profileType === "service_provider" ? (
                <>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="emergencyService" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    ¿Atiende urgencias?
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="attendsAirbnb" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    ¿Atiende Airbnb?
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="offersWarranty" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    ¿Ofrece garantía?
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="invoices" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    ¿Emite factura?
                  </label>
                </>
              ) : (
                <>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="hasPhysicalStore" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    ¿Tiene tienda física?
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="doesDelivery" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    ¿Hace entregas a domicilio?
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="acceptsWhatsappOrders" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    ¿Acepta pedidos por WhatsApp?
                  </label>
                  <label className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm text-casero-text/75">
                    <input name="invoices" type="checkbox" className="h-4 w-4 accent-casero-green" />
                    ¿Emite factura?
                  </label>
                </>
              )}
            </div>
          </fieldset>
        ) : null}

        <label className="text-sm font-bold text-casero-dark">
          Descripción breve
          <textarea
            name="shortDescription"
            required
            className="mt-2 min-h-24 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green"
            placeholder="Qué haces, qué vendes o qué tipo de clientes atiendes."
          />
        </label>

        <label className="text-sm font-bold text-casero-dark">
          Mensaje adicional
          <textarea
            name="additionalMessage"
            className="mt-2 min-h-24 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green"
            placeholder="Cuéntanos si atiendes urgencias, Airbnb, Zona Hotelera o si tienes alguna duda."
          />
        </label>

        <Button type="submit" variant="secondary" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar solicitud"}
        </Button>
      </form>
    </Card>
  );
}
