import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminBusinessesPanel } from "@/components/admin/AdminBusinessesPanel";
import { getAdminSession } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Admin negocios | Casero Cancún",
  description: "Panel administrativo para revisar negocios registrados en Casero Cancún.",
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
