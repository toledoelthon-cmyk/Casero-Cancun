import type { Metadata } from "next";
import { SectionBusinessPage } from "@/components/marketplace/SectionBusinessPage";
import { petCategories } from "@/lib/demo-data";

type PageProps = {
  searchParams: Promise<{ ubicacion?: string }>;
};

export const metadata: Metadata = {
  title: "Mascotas | Casero Cancun",
  description: "Encuentra veterinarias, estetica canina, alimentos, accesorios y servicios para mascotas en Cancun.",
};

export default async function PetsPage({ searchParams }: PageProps) {
  const { ubicacion } = await searchParams;

  return (
    <SectionBusinessPage
      section="pets"
      eyebrow="Mascotas"
      title="Servicios y tiendas para mascotas en Cancun"
      description="Veterinarias, estetica, guarderia, alimentos, accesorios y servicios a domicilio para mascotas."
      categories={petCategories}
      selectedLocationSlug={ubicacion ?? "all"}
    />
  );
}
