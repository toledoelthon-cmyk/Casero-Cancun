import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Aviso de privacidad | Casero Cancún",
  description: "Aviso de privacidad provisional de Casero Cancún.",
};

export default function PrivacyPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Legal"
        title="Aviso de privacidad"
        description="Placeholder provisional. El texto legal definitivo se agregará antes del lanzamiento público."
      />
      <div className="mt-8 rounded-lg border border-casero-dark/10 bg-white p-6 text-sm leading-7 text-casero-text/75">
        Casero Cancún preparará este aviso para explicar qué datos se recopilan, cómo se usan, cómo
        se protegen y qué derechos tienen usuarios, proveedores y negocios publicados.
      </div>
    </section>
  );
}
