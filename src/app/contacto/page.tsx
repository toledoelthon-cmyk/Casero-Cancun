import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { contact, whatsappUrl } from "@/lib/contact";
import { createPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = createPublicMetadata({
  title: "Contacto | Casero Cancún",
  description:
    "Contacta a Casero Cancún por WhatsApp o correo para registrar tu negocio, resolver dudas o pedir información del directorio.",
  path: "/contacto",
});

export default function ContactPage() {
  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Contacto"
        title="Hablemos de Casero Cancún"
        description="Escríbenos para registrar tu negocio, resolver dudas o preparar tu perfil dentro de la plataforma."
          level={1}
        />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <Card>
          <MessageCircle className="h-8 w-8 text-casero-green" aria-hidden />
          <h3 className="mt-4 font-heading text-xl font-bold text-casero-dark">WhatsApp oficial</h3>
          <p className="mt-2 text-sm leading-6 text-casero-text/65">{contact.whatsappDisplay}</p>
          <Button href={whatsappUrl} className="mt-5" variant="secondary">
            Escribir por WhatsApp
          </Button>
        </Card>
        <Card>
          <Mail className="h-8 w-8 text-casero-turquoise" aria-hidden />
          <h3 className="mt-4 font-heading text-xl font-bold text-casero-dark">Correo oficial</h3>
          <p className="mt-2 text-sm leading-6 text-casero-text/65">{contact.email}</p>
          <Button href={`mailto:${contact.email}`} className="mt-5" variant="outline">
            Enviar correo
          </Button>
        </Card>
        <Card>
          <MapPin className="h-8 w-8 text-casero-orange" aria-hidden />
          <h3 className="mt-4 font-heading text-xl font-bold text-casero-dark">Ubicación</h3>
          <p className="mt-2 text-sm leading-6 text-casero-text/65">{contact.location}</p>
          <Button href="/registrar-mi-negocio" className="mt-5" variant="primary">
            Registrar negocio
          </Button>
        </Card>
      </div>
    </section>
  );
}
