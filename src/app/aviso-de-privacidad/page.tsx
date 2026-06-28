import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = createPublicMetadata({
  title: "Aviso de privacidad | Casero Cancún",
  description:
    "Consulta el aviso de privacidad de Casero Cancún y el tratamiento de datos para usuarios, proveedores y negocios registrados.",
  path: "/aviso-de-privacidad",
});

export default function PrivacyPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Legal"
        title="Aviso de privacidad"
        description="Conoce cómo Casero Cancún trata la información de visitantes, proveedores y negocios registrados."
        level={1}
      />
      <div className="mt-8 grid gap-5 rounded-lg border border-casero-dark/10 bg-white p-6 text-sm leading-7 text-casero-text/75">
        <p>
          Casero Cancún recopila la información que los proveedores envían para crear o administrar su publicación, como nombre del negocio, datos de contacto, descripción, categorías, zonas de atención, ubicación, imágenes y datos de membresía.
        </p>
        <p>
          También podemos registrar datos técnicos anónimos de navegación, como fecha de visita, referencia, navegador aproximado y un identificador temporal, para generar estadísticas de visitas por publicación. Estas estadísticas no muestran datos personales de visitantes al proveedor.
        </p>
        <p>
          Los pagos de membresía se gestionan manualmente por CoDi, transferencia o Mercado Pago. El envío de comprobantes y la activación de la membresía no son automáticos; un administrador revisa la información antes de activar, renovar o modificar el estado de la publicación.
        </p>
        <p>
          Los datos se usan para operar el directorio, revisar publicaciones, facilitar el contacto directo por WhatsApp o correo, prevenir abuso y mejorar la experiencia del sitio. Puedes escribir a info@caserocancun.com para solicitar revisión, actualización o eliminación de datos aplicables.
        </p>
      </div>
    </section>
  );
}
