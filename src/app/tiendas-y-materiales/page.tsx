import type { Metadata } from "next";
import { SectionBusinessPage } from "@/components/marketplace/SectionBusinessPage";
import { storeCategories } from "@/lib/demo-data";
import { createPublicMetadata } from "@/lib/seo";

type PageProps = {
  searchParams: Promise<{ ubicacion?: string }>;
};

export const metadata: Metadata = createPublicMetadata({
  title: "Tiendas y materiales en Cancún | Casero Cancún",
  description:
    "Encuentra ferreterías, materiales de construcción, herramientas, refacciones y suministros locales para proyectos en Cancún.",
  path: "/tiendas-y-materiales",
});

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
