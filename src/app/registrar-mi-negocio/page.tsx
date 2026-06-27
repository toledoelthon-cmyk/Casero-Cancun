import type { Metadata } from "next";
import { MessageCircle, Search, ShieldCheck, Store } from "lucide-react";
import { RegisterBusinessForm } from "@/components/marketplace/RegisterBusinessForm";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createSupabaseAuthServerClient } from "@/lib/auth/admin";
import { getRegistrationOptions } from "@/lib/data/registration";

export const metadata: Metadata = {
  title: "Registrar mi negocio | Casero Cancun",
  description: "Registra tu negocio, tienda o servicio para aparecer en Casero Cancun.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const benefits = [
  {
    icon: Search,
    title: "Mas visibilidad local",
    text: "Aparece en una plataforma creada para busquedas reales dentro de Cancun.",
  },
  {
    icon: MessageCircle,
    title: "Contacto directo por WhatsApp",
    text: "Los clientes pueden escribirte sin intermediarios ni comisiones por trabajo realizado.",
  },
  {
    icon: Store,
    title: "Perfil profesional",
    text: "Muestra categoria, zona, badges, resenas demo y datos de contacto claros.",
  },
  {
    icon: ShieldCheck,
    title: "Sin comision por trabajo",
    text: "Casero Cancun conecta; el acuerdo y seguimiento se hacen directamente con tu cliente.",
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
      <section className="bg-white py-8 sm:py-12">
        <div className="container-page">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-md bg-casero-beige px-3 py-1 text-sm font-bold text-casero-green">
              Registro de proveedores
            </span>
            <h1 className="mt-4 font-heading text-3xl font-extrabold text-casero-dark sm:text-4xl md:text-5xl">
              Haz que mas clientes encuentren tu negocio en Cancun
            </h1>
            <p className="mt-4 text-base leading-7 text-casero-text/75 sm:text-lg sm:leading-8">
              Registra tu servicio, tienda o proveedor local en Casero Cancun y obten visibilidad
              en una plataforma creada para conectar negocios locales con clientes reales.
            </p>
          </div>

          <div className="mt-8 rounded-lg border border-casero-orange/25 bg-casero-orange/10 p-4 text-sm font-bold text-casero-dark">
            Primer mes gratis para negocios aprobados - WhatsApp visible - Sin comision por trabajo
            realizado - Perfil revisado antes de publicarse
          </div>
        </div>
      </section>

      <section className="container-page py-8 sm:py-12">
        <SectionHeader
          eyebrow="Beneficios"
          title="Un perfil pensado para que te contacten mejor"
          description="La recepcion de solicitudes guardara negocios pendientes cuando Supabase este configurado."
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
              title="Cuentanos sobre tu negocio"
              description="Completa los datos principales para enviar tu negocio a revision."
            />
            <div className="mt-6">
              <RegisterBusinessForm {...registrationOptions} authContext={registrationAuth} />
            </div>
          </div>

          <aside className="space-y-4">
            <Card>
              <h2 className="font-heading text-lg font-bold text-casero-dark">Que pasa despues</h2>
              <p className="mt-2 text-sm leading-6 text-casero-text/70">
                Cada solicitud entrara a revision antes de publicarse en el directorio.
              </p>
            </Card>
            <Card>
              <h2 className="font-heading text-lg font-bold text-casero-dark">Estado de publicacion</h2>
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

