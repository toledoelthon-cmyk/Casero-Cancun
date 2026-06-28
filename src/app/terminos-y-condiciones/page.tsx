import type { Metadata } from "next";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = createPublicMetadata({
  title: "Términos y condiciones | Casero Cancún",
  description:
    "Consulta los términos y condiciones de uso de Casero Cancún para visitantes, proveedores y negocios registrados.",
  path: "/terminos-y-condiciones",
});

export default function TermsPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Legal"
        title="Términos y condiciones"
        description="Reglas básicas para usar Casero Cancún como visitante, proveedor o negocio registrado."
        level={1}
      />
      <div className="mt-8 grid gap-5 rounded-lg border border-casero-dark/10 bg-white p-6 text-sm leading-7 text-casero-text/75">
        <p>
          Casero Cancún funciona como plataforma de conexión entre visitantes y proveedores locales. Cada proveedor, tienda o negocio es responsable de la veracidad, vigencia y legalidad de la información, imágenes, servicios, precios y datos de contacto que publica.
        </p>
        <p>
          Las publicaciones pueden ser revisadas, pausadas, rechazadas o eliminadas definitivamente si incumplen reglas del sitio, contienen información falsa, generan reportes relevantes o afectan la seguridad y confianza del directorio.
        </p>
        <p>
          Las membresías se activan de forma manual después de validar el pago por CoDi, transferencia o Mercado Pago. Realizar un pago o enviar un comprobante no activa automáticamente la publicación; el equipo de Casero Cancún debe revisarlo y aprobarlo.
        </p>
        <p>
          Casero Cancún puede mostrar estadísticas agregadas de visitas a proveedores y administradores para sus propias publicaciones. Estas métricas son informativas y no incluyen datos personales identificables de visitantes.
        </p>
        <p>
          Los visitantes contactan directamente al negocio por WhatsApp, teléfono, correo o los medios disponibles. Casero Cancún no participa en la contratación, cobro, garantía o ejecución de los servicios ofrecidos por cada proveedor.
        </p>
      </div>
    </section>
  );
}
