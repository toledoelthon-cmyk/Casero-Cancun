"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils/slugify";
import type { PublicationStatus } from "@/lib/supabase/types";

export type ProviderEditableMedia = {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number | null;
};

type ProviderBusinessImageManagerProps = {
  businessId: string;
  businessName: string;
  businessStatus: PublicationStatus | null;
  planSlug?: string | null;
  media: ProviderEditableMedia[];
};

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const storageBucket = "business-media";

function getPlanLimits(planSlug?: string | null) {
  if (planSlug === "premium") {
    return { maxImages: 15, maxFileSizeMb: 5 };
  }

  if (planSlug === "pro") {
    return { maxImages: 8, maxFileSizeMb: 3 };
  }

  return { maxImages: 3, maxFileSizeMb: 2 };
}

function normalizeMedia(media: ProviderEditableMedia[]) {
  return media.slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

function getStoragePathFromPublicUrl(url: string) {
  const marker = `/${storageBucket}/`;
  const markerIndex = url.indexOf(marker);

  if (markerIndex >= 0) {
    return decodeURIComponent(url.slice(markerIndex + marker.length));
  }

  try {
    const parsedUrl = new URL(url);
    const pathMarker = `/object/public/${storageBucket}/`;
    const pathIndex = parsedUrl.pathname.indexOf(pathMarker);

    if (pathIndex >= 0) {
      return decodeURIComponent(parsedUrl.pathname.slice(pathIndex + pathMarker.length));
    }
  } catch {
    return null;
  }

  return null;
}

export function ProviderBusinessImageManager({
  businessId,
  businessName,
  businessStatus,
  planSlug,
  media,
}: ProviderBusinessImageManagerProps) {
  const [items, setItems] = useState(() => normalizeMedia(media));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const limits = getPlanLimits(planSlug);
  const remainingSlots = limits.maxImages - items.length;
  const orderedItems = useMemo(() => normalizeMedia(items), [items]);

  async function markBusinessPending() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      throw new Error("Supabase no esta configurado.");
    }

    const { error: updateError } = await supabase
      .from("business_profiles")
      .update({ status: "pending", is_verified: false, is_featured: false })
      .eq("id", businessId);

    if (updateError) {
      throw updateError;
    }

    return supabase;
  }

  async function persistOrder(nextItems: ProviderEditableMedia[]) {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      throw new Error("Supabase no esta configurado.");
    }

    const ordered = nextItems.map((item, index) => ({ ...item, sort_order: index }));
    const updates = await Promise.all(
      ordered.map((item) => supabase.from("business_media").update({ sort_order: item.sort_order }).eq("id", item.id)),
    );
    const failed = updates.find((result) => result.error);

    if (failed?.error) {
      throw failed.error;
    }

    setItems(ordered);
  }

  function validateFile(file: File) {
    if (!allowedImageTypes.includes(file.type)) {
      return `${file.name}: formato no permitido. Usa JPG, PNG o WebP.`;
    }

    if (file.size > limits.maxFileSizeMb * 1024 * 1024) {
      return `${file.name}: supera el limite de ${limits.maxFileSizeMb} MB por imagen.`;
    }

    return null;
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    if (files.length > remainingSlots) {
      setError(`Tu plan permite hasta ${limits.maxImages} imagenes. Puedes agregar ${Math.max(remainingSlots, 0)} mas.`);
      return;
    }

    const validationError = files.map(validateFile).find(Boolean);

    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = await markBusinessPending();
      const uploadedItems: ProviderEditableMedia[] = [];

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const safeName = slugify(file.name.replace(/\.[^.]+$/, "")) || "imagen";
        const path = `${businessId}/${Date.now()}-${index}-${safeName}.${extension}`;
        const { error: uploadError } = await supabase.storage.from(storageBucket).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from(storageBucket).getPublicUrl(path);
        const sortOrder = items.length + uploadedItems.length;
        const { data: inserted, error: insertError } = await supabase
          .from("business_media")
          .insert({
            business_id: businessId,
            url: publicUrl,
            type: "image",
            alt: sortOrder === 0 ? `Imagen principal de ${businessName}` : `Imagen de ${businessName}`,
            sort_order: sortOrder,
          })
          .select("id,url,alt,sort_order")
          .single();

        if (insertError) {
          throw insertError;
        }

        uploadedItems.push(inserted);
      }

      setItems((current) => normalizeMedia([...current, ...uploadedItems]));
      setMessage("Tus cambios de imagenes fueron enviados a revision. Tu publicacion volvera a mostrarse cuando Casero Cancun la apruebe.");
    } catch (uploadError) {
      console.error("provider image upload failed", { businessId, uploadError });
      setError("No pudimos subir la imagen. Revisa el archivo e intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(item: ProviderEditableMedia) {
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = await markBusinessPending();
      const { error: deleteError } = await supabase.from("business_media").delete().eq("id", item.id);

      if (deleteError) {
        throw deleteError;
      }

      const storagePath = getStoragePathFromPublicUrl(item.url);

      if (storagePath) {
        const { error: storageError } = await supabase.storage.from(storageBucket).remove([storagePath]);

        if (storageError) {
          console.warn("provider image storage delete warning", { businessId, storagePath, error: storageError });
        }
      }

      await persistOrder(items.filter((current) => current.id !== item.id));
      setMessage("Tus cambios de imagenes fueron enviados a revision. Tu publicacion volvera a mostrarse cuando Casero Cancun la apruebe.");
    } catch (deleteError) {
      console.error("provider image delete failed", { businessId, mediaId: item.id, deleteError });
      setError("No pudimos eliminar la imagen. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  async function handleAltChange(item: ProviderEditableMedia, alt: string) {
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = await markBusinessPending();
      const { error: updateError } = await supabase.from("business_media").update({ alt: alt.trim() || null }).eq("id", item.id);

      if (updateError) {
        throw updateError;
      }

      setItems((current) => current.map((currentItem) => (currentItem.id === item.id ? { ...currentItem, alt: alt.trim() || null } : currentItem)));
      setMessage("Tus cambios de imagenes fueron enviados a revision. Tu publicacion volvera a mostrarse cuando Casero Cancun la apruebe.");
    } catch (updateError) {
      console.error("provider image alt update failed", { businessId, mediaId: item.id, updateError });
      setError("No pudimos actualizar el texto alternativo.");
    } finally {
      setBusy(false);
    }
  }

  async function handleReorder(item: ProviderEditableMedia, direction: "up" | "down" | "primary") {
    const current = normalizeMedia(items);
    const currentIndex = current.findIndex((currentItem) => currentItem.id === item.id);

    if (currentIndex < 0) {
      return;
    }

    const next = current.slice();

    if (direction === "primary") {
      next.splice(currentIndex, 1);
      next.unshift(item);
    } else {
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= next.length) {
        return;
      }

      [next[currentIndex], next[targetIndex]] = [next[targetIndex], next[currentIndex]];
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      await markBusinessPending();
      await persistOrder(next);
      setMessage("Tus cambios de imagenes fueron enviados a revision. Tu publicacion volvera a mostrarse cuando Casero Cancun la apruebe.");
    } catch (reorderError) {
      console.error("provider image reorder failed", { businessId, mediaId: item.id, reorderError });
      setError("No pudimos reordenar las imagenes.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <fieldset className="rounded-lg border border-casero-dark/10 bg-casero-background p-4 sm:p-5">
      <legend className="px-1 text-sm font-bold text-casero-dark">Imagenes del negocio</legend>
      <div className="mt-3 grid gap-3 text-sm text-casero-text/70 sm:grid-cols-[1fr_auto] sm:items-center">
        <p>
          {items.length} de {limits.maxImages} imagenes permitidas. Formatos: JPG, PNG o WebP. Limite: {limits.maxFileSizeMb} MB por imagen.
        </p>
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md bg-casero-green px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-emerald-700">
          Subir imagenes
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" disabled={busy || remainingSlots <= 0} onChange={handleUpload} />
        </label>
      </div>

      {businessStatus === "published" ? (
        <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm font-semibold text-amber-800">
          Si modificas imagenes, la publicacion quedara pendiente hasta nueva aprobacion.
        </p>
      ) : null}
      {message ? <p className="mt-3 rounded-md bg-casero-green/10 p-3 text-sm font-semibold text-casero-green">{message}</p> : null}
      {error ? <p className="mt-3 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {orderedItems.length > 0 ? (
          orderedItems.map((item, index) => (
            <div key={item.id} className="overflow-hidden rounded-lg border border-casero-dark/10 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt ?? businessName} className="aspect-video w-full object-cover" />
              <div className="grid gap-3 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-md bg-casero-beige px-2 py-1 text-xs font-bold text-casero-dark">
                    {index === 0 ? "Imagen principal" : `Imagen ${index + 1}`}
                  </span>
                  <span className="text-xs font-semibold text-casero-text/55">Orden {index}</span>
                </div>
                <label className="text-xs font-bold text-casero-dark">
                  Texto alternativo
                  <input
                    defaultValue={item.alt ?? ""}
                    onBlur={(event) => handleAltChange(item, event.currentTarget.value)}
                    className="mt-1 w-full rounded-md border border-casero-dark/10 px-3 py-2 text-sm font-normal outline-casero-green"
                    disabled={busy}
                  />
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <button type="button" disabled={busy || index === 0} onClick={() => handleReorder(item, "primary")} className="min-h-10 rounded-md border border-casero-dark/10 px-2 py-2 text-xs font-bold disabled:opacity-45">
                    Principal
                  </button>
                  <button type="button" disabled={busy || index === 0} onClick={() => handleReorder(item, "up")} className="min-h-10 rounded-md border border-casero-dark/10 px-2 py-2 text-xs font-bold disabled:opacity-45">
                    Subir
                  </button>
                  <button type="button" disabled={busy || index === orderedItems.length - 1} onClick={() => handleReorder(item, "down")} className="min-h-10 rounded-md border border-casero-dark/10 px-2 py-2 text-xs font-bold disabled:opacity-45">
                    Bajar
                  </button>
                  <button type="button" disabled={busy} onClick={() => handleDelete(item)} className="min-h-10 rounded-md bg-red-50 px-2 py-2 text-xs font-bold text-red-700 disabled:opacity-45">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-md border border-dashed border-casero-dark/20 bg-white p-4 text-sm font-semibold text-casero-text/65 md:col-span-2">
            Aun no hay imagenes para este negocio.
          </p>
        )}
      </div>
    </fieldset>
  );
}

