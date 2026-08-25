import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  CarFront,
  Globe,
  Home,
  ImageIcon,
  Mail,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Wrench,
} from "lucide-react";
import { BusinessMap } from "@/components/maps/BusinessMap";
import { CaseroServiceCaptureModal } from "@/components/marketplace/CaseroServiceCaptureModal";
import { TrustStrip } from "@/components/public/TrustStrip";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getBusinessBySlug } from "@/lib/data/businesses";
import { JsonLd, breadcrumbJsonLd, businessJsonLd } from "@/lib/jsonLd";
import { createPublicMetadata } from "@/lib/seo";
import { slugify } from "@/lib/utils/slugify";
import type { DemoBusiness } from "@/lib/demo-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BusinessMediaItem = NonNullable<DemoBusiness["media"]>[number];

function hasCoordinates(latitude?: number | null, longitude?: number | null) {
  return typeof latitude === "number" && Number.isFinite(latitude) && typeof longitude === "number" && Number.isFinite(longitude);
}

function isUsableImageUrl(url: string | null | undefined) {
  if (!url?.trim()) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
  } catch {
    return url.startsWith("/");
  }
}

function BusinessVisualPlaceholder({ business, compact = false }: { business: DemoBusiness; compact?: boolean }) {
  const sectionMeta = {
    home_services: { Icon: Home, label: "Servicios del hogar" },
    stores_materials: { Icon: Store, label: "Tiendas y materiales" },
    pets: { Icon: PawPrint, label: "Mascotas" },
    auto_services: { Icon: CarFront, label: "Servicios para tu auto" },
  };
  const { Icon, label } = business.section
    ? sectionMeta[business.section]
    : {
        Icon: business.profileType === "material_store" ? Store : Wrench,
        label: business.profileType === "material_store" ? "Tienda/materiales" : "Proveedor de servicios",
      };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-casero-turquoise/20 via-casero-beige to-casero-orange/25 p-8 text-center">
      <span className={compact ? "grid h-12 w-12 place-items-center rounded-2xl bg-white/90 text-casero-green shadow-sm" : "grid h-20 w-20 place-items-center rounded-2xl bg-white/90 text-casero-green shadow-sm"}>
        <Icon className={compact ? "h-6 w-6" : "h-10 w-10"} aria-hidden />
      </span>
      {!compact ? (
        <>
          <p className="mt-5 font-heading text-2xl font-extrabold text-casero-dark">{label}</p>
          <p className="mt-2 max-w-md text-sm font-semibold text-casero-text/65">Imagen pendiente de carga para este perfil.</p>
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
  const imageUrl = image?.url;

  if (!isUsableImageUrl(imageUrl)) {
    return <BusinessVisualPlaceholder business={business} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={image?.alt ?? business.name}
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

  return createPublicMetadata({
    title: business.name + " | Casero Cancún",
    description: business.shortDescription,
    path: "/negocio/" + business.slug,
  });
}

export default async function BusinessProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  const images = (business.media ?? [])
    .filter((image) => isUsableImageUrl(image.url))
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const mainImage = images[0];
  const gallery = images.slice(1);
  const categories = business.categories ?? [business.category];
  const locations = business.locations ?? [business.location];
  const features = business.features ?? [];
  const shouldShowLocation = Boolean(business.showMap && (business.address || hasCoordinates(business.latitude, business.longitude)));
  const shouldShowMap = Boolean(business.showMap && hasCoordinates(business.latitude, business.longitude));
  const description =
    business.longDescription ??
    `${business.shortDescription} Este perfil está preparado para mostrar información clara, contacto directo y señales de confianza dentro de Casero Cancún.`;
  const path = `/negocio/${business.slug}`;
  const renderQuoteButton = () => (
    <CaseroServiceCaptureModal
      businessName={business.name}
      service={business.mainService ?? business.category}
      zone={locations[0]}
      providerId={business.id}
      providerWhatsapp={business.whatsapp}
      providerPhone={business.phone}
      category={business.category}
      className="w-full"
    />
  );

  return (
    <section className="bg-casero-background pb-24 md:pb-14">
      <JsonLd
        data={[
          businessJsonLd(business),
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Negocios", path: "/buscar-servicios" },
            { name: business.name, path },
          ]),
        ]}
      />

      <div className="relative isolate overflow-hidden bg-casero-dark">
        <div className="absolute inset-0 opacity-35" aria-hidden>
          <BusinessImage business={business} image={mainImage} priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/72 to-black/38" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-casero-background via-transparent to-black/18" aria-hidden />

        <div className="container-page relative z-10 py-6 sm:py-8 lg:py-10">
          <nav className="mb-5 text-sm font-semibold text-white/68" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Inicio</Link>
            <span className="mx-2">&gt;</span>
            <Link href="/buscar-servicios" className="hover:text-white">Negocios</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">{business.name}</span>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[1fr_25rem] lg:items-end">
            <div className="min-w-0 text-white">
              <div className="mb-4 flex flex-wrap gap-2">
                {business.verified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-extrabold text-white shadow-sm">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                    Verificado
                  </span>
                ) : null}
                {business.featured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-casero-orange px-3 py-1.5 text-xs font-extrabold text-casero-dark shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    Destacado
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-extrabold text-white shadow-sm backdrop-blur-sm">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                  WhatsApp directo
                </span>
              </div>

              <div className="flex gap-4">
                <div className="grid h-16 w-16 flex-none place-items-center overflow-hidden rounded-2xl border border-white/20 bg-white shadow-sm sm:h-20 sm:w-20">
                  {isUsableImageUrl(business.logoUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={business.logoUrl} alt={`Logo de ${business.name}`} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-heading text-3xl font-extrabold text-casero-green">{business.name.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/70">{business.category}</p>
                  <h1 className="mt-2 max-w-4xl font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-6xl">
                    {business.name}
                  </h1>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-white/86">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-emerald-50/95 px-3 py-1.5 text-emerald-800 shadow-sm backdrop-blur-sm">
                  <MapPin className="h-4 w-4 text-emerald-700" aria-hidden />
                  {business.location}
                </span>
                {business.rating ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/42 px-3 py-1.5 backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-casero-orange text-casero-orange" aria-hidden />
                    {business.rating.toFixed(1)} ({business.reviewCount} reseñas)
                  </span>
                ) : null}
              </div>
            </div>

            <Card className="border-white/20 bg-white/95 p-4 shadow-soft backdrop-blur-sm sm:p-5">
              <p className="font-heading text-xl font-extrabold text-casero-dark">Contacta a este negocio</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-casero-text/68">
                Solicita información y continúa por WhatsApp con los datos publicados del negocio.
              </p>
              <div className="mt-4">{renderQuoteButton()}</div>
              <div className="mt-4 grid gap-2 text-sm font-semibold text-casero-text/72">
                <p className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-casero-green" aria-hidden />
                  {business.whatsapp || "WhatsApp no disponible"}
                </p>
                {business.phone ? (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-casero-green" aria-hidden />
                    {business.phone}
                  </p>
                ) : null}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container-page mt-6">
        <TrustStrip />
      </div>

      <div className="container-page mt-6 grid gap-6 lg:grid-cols-[1fr_22rem] lg:gap-8">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <h2 className="font-heading text-xl font-extrabold text-casero-dark sm:text-2xl">Sobre el negocio</h2>
            <p className="mt-4 text-base font-medium leading-8 text-casero-text/75">{description}</p>
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="font-heading text-xl font-extrabold text-casero-dark sm:text-2xl">Servicios o productos principales</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="turquoise" className="font-bold">{business.mainService ?? business.category}</Badge>
              {categories.map((category) => (
                <Badge key={category} className="font-bold">{category}</Badge>
              ))}
            </div>
          </Card>

          {features.length > 0 ? (
            <Card className="p-5 sm:p-6">
              <h2 className="font-heading text-xl font-extrabold text-casero-dark sm:text-2xl">Características</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {features.map((feature) => (
                  <Badge key={feature} tone="green" className="font-bold">
                    {feature}
                  </Badge>
                ))}
              </div>
            </Card>
          ) : null}

          <Card className="p-5 sm:p-6">
            <h2 className="font-heading text-xl font-extrabold text-casero-dark sm:text-2xl">Galería de imágenes</h2>
            {images.length > 0 ? (
              <div className="mt-5 grid gap-4">
                <div className="aspect-video overflow-hidden rounded-[1rem] bg-casero-background shadow-sm">
                  <BusinessImage business={business} image={mainImage} />
                </div>
                {gallery.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {gallery.map((image) => (
                      <div key={image.id} className="aspect-video overflow-hidden rounded-[1rem] bg-casero-background shadow-sm">
                        <BusinessImage business={business} image={image} />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="aspect-video overflow-hidden rounded-[1rem] bg-casero-background">
                  <BusinessVisualPlaceholder business={business} compact />
                </div>
                <div className="flex aspect-video flex-col items-center justify-center rounded-[1rem] border border-dashed border-casero-dark/15 bg-white p-6 text-center">
                  <ImageIcon className="h-8 w-8 text-casero-turquoise" aria-hidden />
                  <p className="mt-3 text-sm font-semibold text-casero-text/65">Este negocio aún no ha subido galería.</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        <aside className="space-y-5">
          <Card className="p-5 sm:p-6">
            <h2 className="font-heading text-xl font-extrabold text-casero-dark">Información de contacto</h2>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-casero-text/72">
              <p className="flex items-center gap-2 rounded-xl bg-casero-background px-3 py-2">
                <MessageCircle className="h-4 w-4 text-casero-green" aria-hidden />
                WhatsApp: {business.whatsapp || "No disponible"}
              </p>
              {business.phone ? (
                <p className="flex items-center gap-2 rounded-xl bg-casero-background px-3 py-2">
                  <Phone className="h-4 w-4 text-casero-green" aria-hidden />
                  Teléfono: {business.phone}
                </p>
              ) : null}
              {business.email ? (
                <p className="flex items-center gap-2 rounded-xl bg-casero-background px-3 py-2">
                  <Mail className="h-4 w-4 text-casero-green" aria-hidden />
                  {business.email}
                </p>
              ) : null}
              {business.website ? (
                <a className="flex items-center gap-2 rounded-xl bg-casero-background px-3 py-2 transition hover:text-casero-green" href={business.website} target="_blank" rel="noreferrer">
                  <Globe className="h-4 w-4 text-casero-green" aria-hidden />
                  Sitio web
                </a>
              ) : null}
            </div>
            <div className="mt-5">{renderQuoteButton()}</div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="font-heading text-xl font-extrabold text-casero-dark">Zonas de atención</h2>
            {!business.showMap ? (
              <p className="mt-3 rounded-xl bg-casero-background p-3 text-sm font-semibold text-casero-text/70">Atiende por zonas</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {locations.map((location) => (
                <Link key={location} href={"/ubicacion/" + slugify(location)}>
                  <Badge className="font-bold">{location}</Badge>
                </Link>
              ))}
            </div>
          </Card>

          {shouldShowLocation ? (
            <Card className="p-5 sm:p-6">
              <h2 className="font-heading text-xl font-extrabold text-casero-dark">Ubicación</h2>
              {business.address ? (
                <p className="mt-3 flex items-start gap-2 text-sm font-semibold leading-6 text-casero-text/70">
                  <MapPin className="mt-1 h-4 w-4 text-casero-green" aria-hidden />
                  {business.address}
                </p>
              ) : null}
              {shouldShowMap ? (
                <div className="mt-4 overflow-hidden rounded-[1rem]">
                  <BusinessMap latitude={business.latitude} longitude={business.longitude} markerLabel={business.name} />
                </div>
              ) : null}
            </Card>
          ) : null}

          <Card className="p-5 sm:p-6">
            <h2 className="font-heading text-xl font-extrabold text-casero-dark">Categorías</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link key={category} href={"/categoria/" + slugify(category)}>
                  <Badge tone="turquoise" className="font-bold">{category}</Badge>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="border-casero-green/18 bg-white p-5 sm:p-6">
            <p className="flex items-center gap-2 font-heading text-lg font-extrabold text-casero-dark">
              <ShieldCheck className="h-5 w-5 text-casero-green" aria-hidden />
              Señales de confianza
            </p>
            <div className="mt-4 grid gap-2 text-sm font-semibold text-casero-text/70">
              <p>{business.verified ? "Perfil verificado" : "Perfil pendiente de verificación"}</p>
              <p>{business.featured ? "Negocio destacado" : "Publicación revisada"}</p>
              <p>Contacto directo por WhatsApp</p>
            </div>
          </Card>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-casero-dark/10 bg-white/95 p-3 shadow-soft backdrop-blur md:hidden">
        <div className="container-page px-0">{renderQuoteButton()}</div>
      </div>
    </section>
  );
}