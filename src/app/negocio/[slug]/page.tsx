import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Globe,
  ImageIcon,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { getBusinessBySlug } from "@/lib/data/businesses";
import type { DemoBusiness } from "@/lib/demo-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type BusinessMediaItem = NonNullable<DemoBusiness["media"]>[number];

function BusinessVisualPlaceholder({ business, compact = false }: { business: DemoBusiness; compact?: boolean }) {
  const Icon = business.profileType === "material_store" ? Store : Wrench;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-casero-turquoise/20 via-casero-beige to-casero-orange/25 p-8 text-center">
      <span className={compact ? "grid h-12 w-12 place-items-center rounded-md bg-white/85 text-casero-green" : "grid h-20 w-20 place-items-center rounded-lg bg-white/85 text-casero-green shadow-sm"}>
        <Icon className={compact ? "h-6 w-6" : "h-10 w-10"} aria-hidden />
      </span>
      {!compact ? (
        <>
          <p className="mt-5 font-heading text-2xl font-extrabold text-casero-dark">
            {business.profileType === "material_store" ? "Tienda/materiales" : "Proveedor de servicios"}
          </p>
          <p className="mt-2 max-w-md text-sm text-casero-text/65">Imagen pendiente de carga para este perfil.</p>
        </>
      ) : null}
    </div>
  );
}

function BusinessImage({
  business,
  image,
  priority = false,
}: {
  business: DemoBusiness;
  image?: BusinessMediaItem;
  priority?: boolean;
}) {
  if (!image?.url) {
    return <BusinessVisualPlaceholder business={business} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.url}
      alt={image.alt ?? business.name}
      loading={priority ? "eager" : "lazy"}
      className="h-full w-full object-cover"
    />
  );
}

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
  const images = business.media ?? [];
  const mainImage = images[0];
  const gallery = images.slice(1);
  const categories = business.categories ?? [business.category];
  const locations = business.locations ?? [business.location];
  const description =
    business.longDescription ??
    `${business.shortDescription} Este perfil está preparado para mostrar información clara, contacto directo y señales de confianza dentro de Casero Cancún.`;

  return (
    <section className="bg-casero-background pb-14">
      <div className="relative bg-white">
        <div className="aspect-[16/9] max-h-[34rem] w-full overflow-hidden bg-casero-beige md:aspect-[21/8]">
          <BusinessImage business={business} image={mainImage} priority />
        </div>
        <div className="container-page">
          <div className="-mt-16 rounded-lg border border-casero-dark/10 bg-white p-5 shadow-soft md:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="flex gap-4">
                <div className="grid h-20 w-20 flex-none place-items-center overflow-hidden rounded-lg border border-casero-dark/10 bg-white shadow-sm">
                  {business.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={business.logoUrl} alt={`Logo de ${business.name}`} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-heading text-3xl font-extrabold text-casero-green">
                      {business.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
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
                  <h1 className="mt-3 font-heading text-3xl font-extrabold text-casero-dark md:text-5xl">
                    {business.name}
                  </h1>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-casero-text/65">
                    <span className="text-casero-turquoise">{business.category}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" aria-hidden />
                      {business.location}
                    </span>
                    {business.rating ? (
                      <span className="flex items-center gap-1 text-casero-dark">
                        <Star className="h-4 w-4 fill-casero-orange text-casero-orange" aria-hidden />
                        {business.rating.toFixed(1)} ({business.reviewCount} reseñas)
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <WhatsAppButton phone={business.whatsapp} label="Contactar por WhatsApp" message={whatsappMessage} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Card>
            <h2 className="font-heading text-2xl font-bold text-casero-dark">Sobre el negocio</h2>
            <p className="mt-4 text-base leading-8 text-casero-text/75">{description}</p>
          </Card>

          <Card>
            <h2 className="font-heading text-2xl font-bold text-casero-dark">Servicios o productos principales</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="turquoise">{business.mainService ?? business.category}</Badge>
              {categories.map((category) => (
                <Badge key={category}>{category}</Badge>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-heading text-2xl font-bold text-casero-dark">Galería de imágenes</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {gallery.length > 0 ? (
                gallery.map((image) => (
                  <div key={image.id} className="aspect-video overflow-hidden rounded-lg bg-casero-background">
                    <BusinessImage business={business} image={image} />
                  </div>
                ))
              ) : (
                <>
                  <div className="aspect-video overflow-hidden rounded-lg bg-casero-background">
                    <BusinessVisualPlaceholder business={business} compact />
                  </div>
                  <div className="flex aspect-video flex-col items-center justify-center rounded-lg border border-dashed border-casero-dark/15 bg-white p-6 text-center">
                    <ImageIcon className="h-8 w-8 text-casero-turquoise" aria-hidden />
                    <p className="mt-3 text-sm font-semibold text-casero-text/65">
                      Este negocio aún no ha subido galería.
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card>
            <h2 className="font-heading text-xl font-bold text-casero-dark">Información de contacto</h2>
            <div className="mt-4 grid gap-3 text-sm text-casero-text/70">
              <p className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-casero-green" aria-hidden />
                WhatsApp: {business.whatsapp || "No disponible"}
              </p>
              {business.phone ? (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-casero-green" aria-hidden />
                  Teléfono: {business.phone}
                </p>
              ) : null}
              {business.email ? (
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-casero-green" aria-hidden />
                  {business.email}
                </p>
              ) : null}
              {business.website ? (
                <p className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-casero-green" aria-hidden />
                  {business.website}
                </p>
              ) : null}
            </div>
            <div className="mt-5">
              <WhatsAppButton phone={business.whatsapp} label="Contactar por WhatsApp" message={whatsappMessage} />
            </div>
          </Card>

          <Card>
            <h2 className="font-heading text-xl font-bold text-casero-dark">Zonas de atención</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {locations.map((location) => (
                <Badge key={location}>{location}</Badge>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-heading text-xl font-bold text-casero-dark">Categorías</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category} tone="turquoise">
                  {category}
                </Badge>
              ))}
            </div>
          </Card>

          <Card>
            <p className="flex items-center gap-2 font-heading text-lg font-bold text-casero-dark">
              <ShieldCheck className="h-5 w-5 text-casero-green" aria-hidden />
              Señales de confianza
            </p>
            <div className="mt-4 grid gap-2 text-sm text-casero-text/70">
              <p>{business.verified ? "Perfil verificado" : "Perfil pendiente de verificación"}</p>
              <p>{business.featured ? "Negocio destacado" : "Aparición normal"}</p>
              <p>Contacto directo por WhatsApp</p>
            </div>
          </Card>

          <Button
            href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
            className="w-full"
            variant="secondary"
          >
            Contactar por WhatsApp
          </Button>
        </aside>
      </div>
    </section>
  );
}
