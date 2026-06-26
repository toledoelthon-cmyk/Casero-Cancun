import type { Metadata } from "next";
import { SectionBusinessPage } from "@/components/marketplace/SectionBusinessPage";
import { autoServiceCategories } from "@/lib/demo-data";

type PageProps = {
  searchParams: Promise<{ ubicacion?: string }>;
};

export const metadata: Metadata = {
  title: "Servicios automotrices Cancún | Talleres, lavado, grúas y llanteras",
  description: "Encuentra servicios automotrices Cancún: mecánicos, talleres, lavado, grúas, llanteras, diagnóstico y refacciones.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AutoServicesPage({ searchParams }: PageProps) {
  const { ubicacion } = await searchParams;

  return (
    <SectionBusinessPage
      section="auto_services"
      eyebrow="Servicios para tu auto"
      title="Servicios para tu auto en Cancún"
      description="Mecánicos, talleres, diagnóstico, lavado, grúas, llanteras y soluciones automotrices locales."
      categories={autoServiceCategories}
      selectedLocationSlug={ubicacion ?? "all"}
    />
  );
}
