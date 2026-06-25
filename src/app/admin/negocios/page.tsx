import type { Metadata } from "next";
import { AdminBusinessesPanel } from "@/components/admin/AdminBusinessesPanel";

export const metadata: Metadata = {
  title: "Admin negocios | Casero Cancún",
  description: "Panel temporal para revisar negocios registrados en Casero Cancún.",
};

type PageProps = {
  searchParams: Promise<{ key?: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminBusinessesPage({ searchParams }: PageProps) {
  const { key } = await searchParams;

  return <AdminBusinessesPanel queryAccessKey={key} />;
}
