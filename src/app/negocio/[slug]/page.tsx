import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, MessageCircle, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { getBusinessBySlug } from "@/lib/data/businesses";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return {
      title: "Negocio no encontrado | Casero Cancún",
    };
  }

  return {
    title: `${business.name} | Casero Cancún`,
    description: business.shortDescription,
  };
}

export default async function BusinessProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  const whatsappMessage = "Hola, vi tu perfil en Casero Cancún y quiero información.";

  return (
    <section className="container-page py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          <div className="rounded-lg bg-gradient-to-br from-casero-turquoise/20 via-casero-beige to-casero-orange/20 p-8">
            <div className="flex flex-wrap items-center gap-2">
              {business.verified ? (
                <Badge tone="green" className="gap-1">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                  Verificado
                </Badge>
              ) : null}
              {business.featured ? (
                <Badge tone="orange" className="gap-1">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Destacado
                </Badge>
              ) : null}
              {business.badges.map((badge) => (
                <Badge key={badge} tone={badge === "Urgencias" ? "orange" : "neutral"}>
                  {badge}
                </Badge>
              ))}
            </div>

            <h1 className="mt-6 font-heading text-4xl font-extrabold text-casero-dark md:text-5xl">
              {business.name}
            </h1>
            <p className="mt-3 text-lg font-bold text-casero-turquoise">{business.category}</p>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-casero-text/75">
              {business.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold text-casero-dark">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-casero-orange text-casero-orange" aria-hidden />
                {business.rating.toFixed(1)} ({business.reviewCount} reseñas)
              </span>
              <span className="flex items-center gap-1 text-casero-text/65">
                <MapPin className="h-4 w-4" aria-hidden />
                {business.location}
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Card>
              <h2 className="font-heading text-xl font-bold text-casero-dark">Sobre el negocio</h2>
              <p className="mt-3 text-sm leading-7 text-casero-text/70">
                Perfil demo de Casero Cancún preparado para mostrar cómo se verá la información pública
                de un proveedor o tienda cuando la plataforma esté conectada a Supabase.
              </p>
            </Card>
            <Card>
              <h2 className="font-heading text-xl font-bold text-casero-dark">Zona de atención</h2>
              <p className="mt-3 flex items-center gap-2 text-sm leading-7 text-casero-text/70">
                <MapPin className="h-4 w-4 text-casero-green" aria-hidden />
                {business.location}
              </p>
            </Card>
            <Card>
              <h2 className="font-heading text-xl font-bold text-casero-dark">Categoría</h2>
              <p className="mt-3 text-sm leading-7 text-casero-text/70">{business.category}</p>
            </Card>
            <Card>
              <h2 className="font-heading text-xl font-bold text-casero-dark">Información de contacto</h2>
              <p className="mt-3 flex items-center gap-2 text-sm leading-7 text-casero-text/70">
                <MessageCircle className="h-4 w-4 text-casero-green" aria-hidden />
                WhatsApp directo del negocio
              </p>
            </Card>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-casero-dark/10 bg-white p-6 shadow-sm">
          <p className="font-heading text-lg font-bold text-casero-dark">Contactar negocio</p>
          <p className="mt-2 text-sm leading-6 text-casero-text/65">
            Escribe directo por WhatsApp para pedir disponibilidad, precio o más información.
          </p>
          <div className="mt-6">
            <WhatsAppButton phone={business.whatsapp} label="Contactar por WhatsApp" message={whatsappMessage} />
          </div>
          <div className="mt-6 rounded-md bg-casero-background p-4 text-sm text-casero-text/70">
            <p className="flex items-center gap-2 font-semibold text-casero-dark">
              <ShieldCheck className="h-4 w-4 text-casero-green" aria-hidden />
              Estado del perfil
            </p>
            <p className="mt-2">{business.verified ? "Perfil verificado" : "Perfil pendiente de verificación"}</p>
            <p className="mt-1">{business.featured ? "Negocio destacado" : "Aparición normal"}</p>
          </div>
          <Button
            href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
            className="mt-4 w-full"
            variant="outline"
          >
            Contactar por WhatsApp
          </Button>
        </aside>
      </div>
    </section>
  );
}
