import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ContactPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Contacto"
        title="Hablemos de Casero Cancún"
        description="Espacio inicial para dudas de proveedores, alianzas locales y soporte del directorio."
      />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Card>
          <MessageCircle className="h-8 w-8 text-casero-green" aria-hidden />
          <h3 className="mt-4 text-xl font-black text-casero-navy">WhatsApp</h3>
          <p className="mt-2 text-sm leading-6 text-casero-navy/65">
            Canal ideal para proveedores que quieren registrar o mejorar su perfil.
          </p>
          <Button href="https://wa.me/529981234567" className="mt-5" variant="secondary">
            Escribir por WhatsApp
          </Button>
        </Card>
        <Card>
          <Mail className="h-8 w-8 text-casero-turquoise" aria-hidden />
          <h3 className="mt-4 text-xl font-black text-casero-navy">Correo</h3>
          <p className="mt-2 text-sm leading-6 text-casero-navy/65">
            Para solicitudes comerciales, soporte y administración del marketplace.
          </p>
          <Button href="mailto:hola@caserocancun.com" className="mt-5" variant="outline">
            hola@caserocancun.com
          </Button>
        </Card>
      </div>
    </section>
  );
}
