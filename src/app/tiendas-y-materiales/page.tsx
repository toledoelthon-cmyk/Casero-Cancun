import type { Metadata } from "next";
import { SectionBusinessPage } from "@/components/marketplace/SectionBusinessPage";
import { storeCategories } from "@/lib/demo-data";

type PageProps = {
  searchParams: Promise<{ ubicacion?: string }>;
};

export const metadata: Metadata = {
  title: "Tiendas y materiales Cancún | Ferreterías, herramientas y refacciones",
  description: "Encuentra tiendas y materiales Cancún: ferreterias, materiales de construcción, herramientas, refacciones y suministros locales.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StoresPage({ searchParams }: PageProps) {
  const { ubicacion } = await searchParams;

  return (
    <SectionBusinessPage
      section="stores_materials"
      eyebrow="Tiendas y materiales"
      title="Tiendas y materiales en Cancún"
      description="Encuentra ferreterias, materiales, herramientas, refacciones y proveedores locales publicados."
      categories={storeCategories}
      selectedLocationSlug={ubicacion ?? "all"}
    />
  );
}
