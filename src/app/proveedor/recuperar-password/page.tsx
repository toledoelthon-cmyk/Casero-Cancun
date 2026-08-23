import type { Metadata } from "next";
import { ProviderRecoverPasswordForm } from "@/components/provider/ProviderRecoverPasswordForm";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Recuperar contraseña | Casero Cancún",
  description: "Recuperación de contraseña para proveedores de Casero Cancún.",
  ...privatePageMetadata,
};

export default function ProviderRecoverPasswordPage() {
  return (
    <section className="container-page grid min-h-[calc(100vh-4rem)] place-items-center py-8 sm:py-12">
      <div className="w-full max-w-md">
        <ProviderRecoverPasswordForm />
      </div>
    </section>
  );
}
