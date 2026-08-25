import type { Metadata } from "next";
import { HelpCircle, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { TrustStrip } from "@/components/public/TrustStrip";
import { Button } from "@/components/ui/Button";
import { contact, whatsappUrl } from "@/lib/contact";
import { createPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = createPublicMetadata({
  title: "Contacto | Casero Cancún",
  description:
    "Contacta a Casero Cancún por WhatsApp o correo para registrar tu negocio, resolver dudas o pedir información del directorio.",
  path: "/contacto",
});

const contactCards = [
  {
    title: "WhatsApp oficial",
    value: contact.whatsappDisplay,
    action: "Escribir por WhatsApp",
    href: whatsappUrl,
    icon: MessageCircle,
    tone: "bg-casero-green text-white",
    button: "secondary" as const,
  },
  {
    title: "Correo oficial",
    value: contact.email,
    action: "Enviar correo",
    href: `mailto:${contact.email}`,
    icon: Mail,
    tone: "bg-casero-turquoise text-casero-dark",
    button: "outline" as const,
  },
  {
    title: "Ubicación",
    value: contact.location,
    action: "Registrar negocio",
    href: "/registrar-mi-negocio",
    icon: MapPin,
    tone: "bg-casero-orange text-casero-dark",
    button: "primary" as const,
  },
];

const quickQuestions = [
  { question: "¿Cómo registro mi negocio?", answer: "Entra al registro, completa tus datos y elige el plan que quieres activar." },
  { question: "¿Cuánto tarda la revisión?", answer: "Revisamos la información antes de publicar para mantener perfiles claros y confiables." },
  { question: "¿Cómo contacto a Casero Cancún?", answer: "Puedes escribir por WhatsApp o correo desde esta misma página." },
];

export default function ContactPage() {
  return (
    <main className="bg-casero-background">
      <section className="bg-white py-10 sm:py-14 lg:py-16">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="rounded-[1.45rem] border border-casero-dark/10 bg-casero-background p-5 shadow-soft sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-casero-green px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-sm">
                <Send className="h-4 w-4" aria-hidden />
                Contacto directo
              </span>
              <h1 className="mt-5 font-heading text-4xl font-extrabold leading-tight text-casero-dark sm:text-5xl">Hablemos de Casero Cancún</h1>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-casero-text/72 sm:text-lg">Escríbenos para registrar tu negocio, resolver dudas o preparar tu perfil dentro de la plataforma.</p>
            </div>
            <TrustStrip />
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14 lg:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="flex h-full flex-col rounded-[1.25rem] border border-casero-dark/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft sm:p-6">
                <span className={`grid h-14 w-14 place-items-center rounded-2xl shadow-sm ${card.tone}`}>
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <h2 className="mt-5 font-heading text-xl font-extrabold text-casero-dark">{card.title}</h2>
                <p className="mt-2 break-words text-base font-extrabold leading-6 text-casero-dark">{card.value}</p>
                <Button href={card.href} className="mt-6 w-full" variant={card.button}>{card.action}</Button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14 lg:py-16">
        <div className="container-page">
          <div className="grid gap-6 rounded-[1.4rem] border border-casero-dark/10 bg-casero-background p-5 shadow-soft lg:grid-cols-[1fr_auto] lg:items-center sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-casero-text/55">Para proveedores</p>
              <h2 className="mt-2 font-heading text-3xl font-extrabold text-casero-dark">¿Quieres registrar tu negocio?</h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-casero-text/72 sm:text-base">Prepara tu información, elige tu plan y empieza a recibir contactos por WhatsApp.</p>
            </div>
            <Button href="/registrar-mi-negocio" className="min-h-14 w-full px-7 text-base lg:w-auto" variant="primary">Registrar negocio</Button>
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14 lg:py-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-casero-green shadow-sm ring-1 ring-casero-dark/10">
            <HelpCircle className="h-5 w-5" aria-hidden />
          </span>
          <h2 className="font-heading text-3xl font-extrabold text-casero-dark">Preguntas rápidas</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {quickQuestions.map((item) => (
            <article key={item.question} className="rounded-[1.1rem] border border-casero-dark/10 bg-white p-5 shadow-sm">
              <h3 className="font-heading text-lg font-extrabold text-casero-dark">{item.question}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-casero-text/68">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
