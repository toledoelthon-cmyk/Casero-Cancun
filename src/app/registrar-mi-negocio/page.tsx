import type { Metadata } from "next";
import { MessageCircle, Search, ShieldCheck, Store } from "lucide-react";
import { RegisterBusinessForm } from "@/components/marketplace/RegisterBusinessForm";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createSupabaseAuthServerClient } from "@/lib/auth/admin";
import { getRegistrationOptions } from "@/lib/data/registration";
import { createPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = createPublicMetadata({
  title: "Registrar mi negocio en Casero Cancún",
  description:
    "Registra tu negocio, tienda o servicio local para revisión y publicación en el directorio de Casero Cancún.",
  path: "/registrar-mi-negocio",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    text: "Muestra categoría, zona, señales de confianza y datos de contacto claros.",
  },
  {
    icon: ShieldCheck,
    title: "Sin comisión por trabajo",
    text: "Casero Cancún conecta; el acuerdo y seguimiento se hacen directamente con tu cliente.",
  },
];

async function getRegistrationAuthContext() {
  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    return { status: "public" as const };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "public" as const };
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("id,email,full_name,role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("registration auth profile lookup failed", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error,
    });
  }

  if (profile?.role === "provider") {
    return {
      status: "provider" as const,
      userId: user.id,
      email: profile.email ?? user.email ?? null,
      fullName: profile.full_name,
    };
  }

  if (profile?.role === "admin") {
    return {
      status: "admin" as const,
      userId: user.id,
      email: profile.email ?? user.email ?? null,
      fullName: profile.full_name,
    };
  }

  return { status: "public" as const };
}

export default async function RegisterBusinessPage() {
  const registrationOptions = await getRegistrationOptions();
  const registrationAuth = await getRegistrationAuthContext();

  return (
    <>
      <section className="bg-white py-10 sm:py-14 lg:py-16">
        <div className="container-page">
          <div className="max-w-4xl rounded-[1.45rem] border border-casero-dark/10 bg-casero-background p-5 shadow-soft sm:p-8 lg:p-10">
            <span className="inline-flex rounded-full bg-casero-green px-4 py-2 text-sm font-extrabold text-white shadow-sm">
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

          <div className="mt-8 rounded-[1rem] border border-casero-orange/25 bg-casero-orange/10 p-4 text-sm font-extrabold leading-6 text-casero-dark shadow-sm">
            Primer mes gratis para negocios aprobados - WhatsApp visible - Sin comisión por trabajo
            realizado - Perfil revisado antes de publicarse
          </div>
        </div>
      </section>

      <section className="container-page py-10 sm:py-14">
        <SectionHeader
          eyebrow="Beneficios"
          title="Un perfil pensado para que te contacten mejor"
          description="Completa tu perfil con datos claros para que los clientes entiendan qué ofreces y cómo contactarte."
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

      <section className="container-page pb-14 sm:pb-16 lg:pb-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:gap-8">
          <div>
            <SectionHeader
              eyebrow="Solicitud"
              title="Cuéntanos sobre tu negocio"
              description="Completa los datos principales para enviar tu negocio a revisión."
            />
            <div className="mt-6 grid gap-4">
              {registrationAuth.status !== "provider" ? (
                <div className="rounded-lg border border-casero-green/20 bg-casero-green/10 p-4 text-sm font-semibold text-casero-green">
                  <p>Si ya tienes cuenta de proveedor, inicia sesión antes de registrar tu negocio para que quede asociado a tu panel.</p>
                  <Button href="/proveedor/login" variant="secondary" className="mt-3">
                    Iniciar sesión como proveedor
                  </Button>
                </div>
              ) : null}
              <RegisterBusinessForm {...registrationOptions} authContext={registrationAuth} />
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
                Podrás dar seguimiento al estado de tu publicación desde tu panel cuando tu cuenta esté lista.
              </p>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}



