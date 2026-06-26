import type { Metadata } from "next";
import { SectionBusinessPage } from "@/components/marketplace/SectionBusinessPage";
import { petCategories } from "@/lib/demo-data";

type PageProps = {
  searchParams: Promise<{ ubicacion?: string }>;
};

export const metadata: Metadata = {
  title: "Mascotas Cancún | Veterinarias, estética, alimentos y servicios",
  description: "Encuentra mascotas Cancún: veterinarias, estética canina, alimentos, accesorios, paseadores y servicios para mascotas.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PetsPage({ searchParams }: PageProps) {
  const { ubicacion } = await searchParams;

  return (
    <SectionBusinessPage
      section="pets"
      eyebrow="Mascotas"
      title="Servicios y tiendas para mascotas en Cancún"
      description="Veterinarias, estética, guardería, alimentos, accesorios y servicios a domicilio para mascotas."
      categories={petCategories}
      selectedLocationSlug={ubicacion ?? "all"}
    />
  );
}
