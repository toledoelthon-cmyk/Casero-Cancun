import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Términos y condiciones | Casero Cancún",
  description: "Términos y condiciones provisionales de Casero Cancún.",
};

export default function TermsPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Legal"
        title="Términos y condiciones"
        description="Placeholder provisional. El documento final se agregará antes de publicar el sitio completo."
      />
      <div className="mt-8 rounded-lg border border-casero-dark/10 bg-white p-6 text-sm leading-7 text-casero-text/75">
        Casero Cancún funciona como plataforma de conexión. Cada proveedor, tienda o negocio será
        responsable de la información publicada y de los servicios o productos que ofrece.
      </div>
    </section>
  );
}
