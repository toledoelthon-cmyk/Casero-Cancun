import type { Metadata } from "next";
import { MessageCircle, Search, ShieldCheck, Store } from "lucide-react";
import { RegisterBusinessForm } from "@/components/marketplace/RegisterBusinessForm";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getRegistrationOptions } from "@/lib/data/registration";

export const metadata: Metadata = {
  title: "Registrar mi negocio | Casero Cancún",
  description: "Registra tu negocio, tienda o servicio para aparecer en Casero Cancún.",
};

const benefits = [
  {
    icon: Search,
    title: "Más visibilidad local",
    text: "Aparece en una plataforma creada para búsquedas reales dentro de Cancún.",
  },
  {
    icon: MessageCircle,
    title: "Contacto directo por WhatsApp",
    text: "Los clientes pueden escribirte sin intermediarios ni comisiones por trabajo realizado.",
  },
  {
    icon: Store,
    title: "Perfil profesional",
    text: "Muestra categoría, zona, badges, reseñas demo y datos de contacto claros.",
  },
  {
    icon: ShieldCheck,
    title: "Sin comisión por trabajo",
    text: "Casero Cancún conecta; el acuerdo y seguimiento se hacen directamente con tu cliente.",
  },
];

export default async function RegisterBusinessPage() {
  const registrationOptions = await getRegistrationOptions();

  return (
    <>
      <section className="bg-white py-8 sm:py-12">
        <div className="container-page">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-md bg-casero-beige px-3 py-1 text-sm font-bold text-casero-green">
              Registro de proveedores
            </span>
            <h1 className="mt-4 font-heading text-3xl font-extrabold text-casero-dark sm:text-4xl md:text-5xl">
              Haz que más clientes encuentren tu negocio en Cancún
            </h1>
            <p className="mt-4 text-base leading-7 text-casero-text/75 sm:text-lg sm:leading-8">
              Registra tu servicio, tienda o proveedor local en Casero Cancún y obtén visibilidad
              en una plataforma creada para conectar negocios locales con clientes reales.
            </p>
          </div>

          <div className="mt-8 rounded-lg border border-casero-orange/25 bg-casero-orange/10 p-4 text-sm font-bold text-casero-dark">
            Primer mes gratis para negocios aprobados · WhatsApp visible · Sin comisión por trabajo
            realizado · Perfil revisado antes de publicarse
          </div>
        </div>
      </section>

      <section className="container-page py-8 sm:py-12">
        <SectionHeader
          eyebrow="Beneficios"
          title="Un perfil pensado para que te contacten mejor"
          description="La recepción de solicitudes guardará negocios pendientes cuando Supabase esté configurado."
        />
        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="p-5 sm:p-6">
              <benefit.icon className="h-8 w-8 text-casero-green" aria-hidden />
              <h2 className="mt-4 font-heading text-lg font-bold text-casero-dark">{benefit.title}</h2>
              <p className="mt-2 text-sm leading-6 text-casero-text/70">{benefit.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-page pb-12 sm:pb-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:gap-8">
          <div>
            <SectionHeader
              eyebrow="Solicitud"
              title="Cuéntanos sobre tu negocio"
              description="Completa los datos principales para enviar tu negocio a revisión."
            />
            <div className="mt-6">
              <RegisterBusinessForm {...registrationOptions} />
            </div>
          </div>

          <aside className="space-y-4">
            <Card>
              <h2 className="font-heading text-lg font-bold text-casero-dark">Qué pasa después</h2>
              <p className="mt-2 text-sm leading-6 text-casero-text/70">
                Cada solicitud entrará a revisión antes de publicarse en el directorio.
              </p>
            </Card>
            <Card>
              <h2 className="font-heading text-lg font-bold text-casero-dark">Estado de publicación</h2>
              <p className="mt-2 text-sm leading-6 text-casero-text/70">
                La estructura contempla perfiles pendientes, publicados, pausados y rechazados.
              </p>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
