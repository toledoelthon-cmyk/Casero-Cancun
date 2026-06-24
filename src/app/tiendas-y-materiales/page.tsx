import type { Metadata } from "next";
import { SectionBusinessPage } from "@/components/marketplace/SectionBusinessPage";
import { storeCategories } from "@/lib/demo-data";

type PageProps = {
  searchParams: Promise<{ ubicacion?: string }>;
};

export const metadata: Metadata = {
  title: "Tiendas y materiales | Casero Cancun",
  description: "Encuentra ferreterias, materiales, herramientas y refacciones para el hogar en Cancun.",
};

export default async function StoresPage({ searchParams }: PageProps) {
  const { ubicacion } = await searchParams;

  return (
    <SectionBusinessPage
      section="stores_materials"
      eyebrow="Tiendas y materiales"
      title="Tiendas y materiales en Cancun"
      description="Encuentra ferreterias, materiales, herramientas, refacciones y proveedores locales publicados."
      categories={storeCategories}
      selectedLocationSlug={ubicacion ?? "all"}
    />
  );
}
