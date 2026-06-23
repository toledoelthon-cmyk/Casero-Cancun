"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { RegistrationCategory, RegistrationLocation, RegistrationPlan } from "@/lib/data/registration";
import { createSupabaseBrowserClient, missingSupabaseMessage } from "@/lib/supabase/client";
import type { BusinessProfileInsert, ProfileType } from "@/lib/supabase/types";
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

export function RegisterBusinessForm({
  plans,
  categories,
  locations,
  supabaseConfigured,
  source,
}: RegisterBusinessFormProps) {
  const [profileType, setProfileType] = useState<ProfileType | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!profileType) {
      return [];
    }

    const categoryType = profileType === "service_provider" ? "service" : "store";
    return categories.filter((category) => category.type === categoryType);
  }, [categories, profileType]);

  const categoryLabel =
    profileType === "service_provider"
      ? "Categoría de servicio"
      : profileType === "material_store"
        ? "Categoría de tienda o materiales"
        : "Categoría principal";

  async function insertBusiness(payload: BusinessProfileInsert, selectedCategoryId: string, locationId: string) {
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
      console.error("business_profiles insert error", error);
      throw error;
    }

    const businessId = data.id;

    const [categoryResult, locationResult] = await Promise.all([
      supabase.from("business_categories").insert({
        business_id: businessId,
        category_id: selectedCategoryId,
      }),
      supabase.from("business_locations").insert({
        business_id: businessId,
        location_id: locationId,
      }),
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
    const selectedProfileType = String(formData.get("profileType") ?? "") as ProfileType | "";
    const selectedCategoryId = String(formData.get("categoryId") ?? "");
    const locationId = String(formData.get("locationId") ?? "");
    const shortDescription = String(formData.get("shortDescription") ?? "").trim();
    const planId = String(formData.get("planId") ?? "");
    const additionalMessage = String(formData.get("additionalMessage") ?? "").trim();

    const normalizedWhatsapp = normalizeWhatsapp(whatsappInput);
    const selectedCategory = categories.find((category) => category.id === selectedCategoryId);

    if (
      !businessName ||
      !responsibleName ||
      !normalizedWhatsapp ||
      !email ||
      !selectedProfileType ||
      !selectedCategory ||
      !locationId ||
      !shortDescription
    ) {
      setStatus("error");
      setFormMessage(
        normalizedWhatsapp
          ? "Completa todos los campos obligatorios para enviar tu solicitud."
          : "Ingresa un WhatsApp válido. Puedes usar 9984032240, +52 998 403 2240 o 52 9984032240.",
      );
      return;
    }

    const baseSlug = slugify(businessName);
    const payload: BusinessProfileInsert = {
      business_name: businessName,
      slug: baseSlug,
      profile_type: selectedProfileType,
      short_description: shortDescription,
      long_description: additionalMessage || null,
      whatsapp: normalizedWhatsapp,
      phone: normalizedWhatsapp,
      email,
      status: "pending",
      plan_id: planId || null,
      main_service: selectedCategory.name,
      invoices: formData.get("invoices") === "on",
      emergency_service: formData.get("emergencyService") === "on",
      attends_airbnb: formData.get("attendsAirbnb") === "on",
      offers_warranty: formData.get("offersWarranty") === "on",
    };

    console.log("Submitting business registration", {
      planId,
      categoryId: selectedCategoryId,
      locationId,
      payload,
    });

    try {
      try {
        await insertBusiness(payload, selectedCategoryId, locationId);
      } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "23505") {
          await insertBusiness(
            { ...payload, slug: `${baseSlug}-${Date.now().toString(36)}` },
            selectedCategoryId,
            locationId,
          );
        } else {
          throw error;
        }
      }

      setStatus("success");
      setFormMessage(successMessage);
      form.reset();
      setProfileType("");
      setCategoryId("");
    } catch (error) {
      console.error("registration submit failed", error);
      setStatus("error");
      setFormMessage(errorMessage);
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
            Tipo de perfil
            <select
              name="profileType"
              required
              value={profileType}
              onChange={(event) => {
                setProfileType(event.target.value as ProfileType | "");
                setCategoryId("");
              }}
              className="mt-2 w-full rounded-md border border-casero-dark/10 px-3 py-2.5 font-normal outline-casero-green"
            >
              <option value="">Selecciona el tipo de perfil</option>
              <option value="service_provider">Proveedor de servicios</option>
              <option value="material_store">Tienda o materiales</option>
            </select>
          </label>

          <label className="text-sm font-bold text-casero-dark">
            {categoryLabel}
            <select
              name="categoryId"
              required
              disabled={isCategoryDisabled}
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
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
          <label className="text-sm font-bold text-casero-dark">
            Zona de atención
            <select
              name="locationId"
              required
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
                  <label className="sm:col-span-2 text-sm font-bold text-casero-dark">
                    Fotos de trabajos realizados
                    <input
                      name="workPhotos"
                      type="file"
                      multiple
                      accept="image/*"
                      className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 text-sm font-normal"
                    />
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
                  <label className="sm:col-span-2 text-sm font-bold text-casero-dark">
                    Fotos del local o productos
                    <input
                      name="storePhotos"
                      type="file"
                      multiple
                      accept="image/*"
                      className="mt-2 w-full rounded-md border border-casero-dark/10 bg-white px-3 py-2.5 text-sm font-normal"
                    />
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
