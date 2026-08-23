import type { Metadata } from "next";
import { ProviderUpdatePasswordForm } from "@/components/provider/ProviderUpdatePasswordForm";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Actualizar contraseña | Casero Cancún",
  description: "Actualización de contraseña para proveedores de Casero Cancún.",
  ...privatePageMetadata,
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ProviderUpdatePasswordPage() {
  return (
    <section className="container-page grid min-h-[calc(100vh-4rem)] place-items-center py-8 sm:py-12">
      <div className="w-full max-w-md">
        <ProviderUpdatePasswordForm />
      </div>
    </section>
  );
}
