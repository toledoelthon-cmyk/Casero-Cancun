import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminBusinessesPanel } from "@/components/admin/AdminBusinessesPanel";
import { getAdminSession } from "@/lib/auth/admin";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Admin negocios | Casero Cancún",
  description: "Panel administrativo para revisar negocios registrados en Casero Cancún.",
  ...privatePageMetadata,
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminBusinessesPage() {
  const adminSession = await getAdminSession();

  if (!adminSession) {
    redirect("/admin/login");
  }

  return <AdminBusinessesPanel />;
}
