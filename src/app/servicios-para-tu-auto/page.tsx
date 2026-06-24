import type { Metadata } from "next";
import { SectionBusinessPage } from "@/components/marketplace/SectionBusinessPage";
import { autoServiceCategories } from "@/lib/demo-data";

type PageProps = {
  searchParams: Promise<{ ubicacion?: string }>;
};

export const metadata: Metadata = {
  title: "Servicios para tu auto | Casero Cancun",
  description: "Encuentra mecanicos, talleres, lavado, gruas, llanteras y servicios automotrices en Cancun.",
};

export default async function AutoServicesPage({ searchParams }: PageProps) {
  const { ubicacion } = await searchParams;

  return (
    <SectionBusinessPage
      section="auto_services"
      eyebrow="Servicios para tu auto"
      title="Servicios para tu auto en Cancun"
      description="Mecanicos, talleres, diagnostico, lavado, gruas, llanteras y soluciones automotrices locales."
      categories={autoServiceCategories}
      selectedLocationSlug={ubicacion ?? "all"}
    />
  );
}
