import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProviderLoginForm } from "@/components/provider/ProviderLoginForm";
import { getProviderAccess } from "@/lib/auth/provider";

export const metadata: Metadata = {
  title: "Login proveedor | Casero Cancun",
  description: "Acceso y registro de proveedores para Casero Cancun.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProviderLoginPage() {
  const providerAccess = await getProviderAccess();

  if (providerAccess.status === "allowed") {
    redirect("/proveedor/panel");
  }

  return (
    <section className="container-page grid min-h-[calc(100vh-4rem)] place-items-center py-8 sm:py-12">
      <div className="w-full max-w-md">
        {providerAccess.status === "forbidden" ? (
          <p className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">
            Acceso no permitido. Esta cuenta no tiene rol de proveedor.
          </p>
        ) : null}
        <ProviderLoginForm />
      </div>
    </section>
  );
}
