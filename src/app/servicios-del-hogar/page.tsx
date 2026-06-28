import type { Metadata } from "next";
import { SectionBusinessPage } from "@/components/marketplace/SectionBusinessPage";
import { serviceCategories } from "@/lib/demo-data";
import { createPublicMetadata } from "@/lib/seo";

type PageProps = {
  searchParams: Promise<{ ubicacion?: string }>;
};

export const metadata: Metadata = createPublicMetadata({
  title: "Servicios para el hogar en Cancún | Casero Cancún",
  description:
    "Encuentra plomería, electricidad, limpieza, aire acondicionado, pintura y mantenimiento para hogares y propiedades en Cancún.",
  path: "/servicios-del-hogar",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomeServicesPage({ searchParams }: PageProps) {
  const { ubicacion } = await searchParams;

  return (
    <SectionBusinessPage
      section="home_services"
      eyebrow="Servicios del hogar"
      title="Servicios del hogar en Cancún"
      description="Plomería, electricidad, limpieza, aire acondicionado y mantenimiento local para hogares y propiedades."
      categories={serviceCategories}
      selectedLocationSlug={ubicacion ?? "all"}
    />
  );
}
