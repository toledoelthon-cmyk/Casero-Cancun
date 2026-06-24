import type { Metadata } from "next";
import { SectionBusinessPage } from "@/components/marketplace/SectionBusinessPage";
import { serviceCategories } from "@/lib/demo-data";

type PageProps = {
  searchParams: Promise<{ ubicacion?: string }>;
};

export const metadata: Metadata = {
  title: "Servicios del hogar | Casero Cancun",
  description: "Encuentra proveedores publicados para reparaciones, mantenimiento y mejoras del hogar en Cancun.",
};

export default async function HomeServicesPage({ searchParams }: PageProps) {
  const { ubicacion } = await searchParams;

  return (
    <SectionBusinessPage
      section="home_services"
      eyebrow="Servicios del hogar"
      title="Servicios del hogar en Cancun"
      description="Plomeria, electricidad, limpieza, aire acondicionado y mantenimiento local para hogares y propiedades."
      categories={serviceCategories}
      selectedLocationSlug={ubicacion ?? "all"}
    />
  );
}
