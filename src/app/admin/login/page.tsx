import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminSession } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Login admin | Casero Cancún",
  description: "Acceso administrativo para Casero Cancún.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLoginPage() {
  const adminSession = await getAdminSession();

  if (adminSession) {
    redirect("/admin/negocios");
  }

  return (
    <section className="container-page grid min-h-[calc(100vh-4rem)] place-items-center py-8 sm:py-12">
      <div className="w-full max-w-md">
        <AdminLoginForm />
      </div>
    </section>
  );
}
