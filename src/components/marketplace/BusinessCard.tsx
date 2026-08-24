import Link from "next/link";
import { BadgeCheck, CarFront, Home, MapPin, MessageCircle, PawPrint, Star, Store, Wrench } from "lucide-react";
import { CaseroServiceCaptureModal } from "@/components/marketplace/CaseroServiceCaptureModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { DemoBusiness } from "@/lib/demo-data";

type LegacyBusiness = {
  name: string;
  slug: string;
  category: string;
  location: string;
  description: string;
  tags: string[];
  verified?: boolean;
  featured?: boolean;
};

type BusinessCardProps = {
  business: DemoBusiness | LegacyBusiness;
};

function isDemoBusiness(business: DemoBusiness | LegacyBusiness): business is DemoBusiness {
  return "shortDescription" in business;
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

function getPlaceholderMeta(business: DemoBusiness | LegacyBusiness) {
  if (isDemoBusiness(business)) {
    if (business.section === "stores_materials") {
      return { Icon: Store, label: "Tiendas y materiales" };
    }

    if (business.section === "pets") {
      return { Icon: PawPrint, label: "Mascotas" };
    }

    if (business.section === "auto_services") {
      return { Icon: CarFront, label: "Servicios para tu auto" };
    }

    if (business.section === "home_services") {
      return { Icon: Home, label: "Servicios del hogar" };
    }
  }

  return isDemoBusiness(business) && business.profileType === "material_store"
    ? { Icon: Store, label: "Tienda o materiales" }
    : { Icon: Wrench, label: "Proveedor de servicios" };
}

function BusinessPlaceholder({ business }: { business: DemoBusiness | LegacyBusiness }) {
  const { Icon, label } = getPlaceholderMeta(business);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-casero-turquoise/18 via-casero-beige to-casero-orange/20 p-6 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/90 text-casero-green shadow-sm">
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <p className="mt-4 font-heading text-2xl font-extrabold text-casero-dark">{business.name.charAt(0)}</p>
      <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.14em] text-casero-text/55">{label}</p>
    </div>
  );
}

const sectionLabels = {
  home_services: "Servicios del hogar",
  stores_materials: "Tiendas y materiales",
  pets: "Mascotas",
  auto_services: "Servicios para tu auto",
} as const;

function BusinessImage({ business }: { business: DemoBusiness | LegacyBusiness }) {
  const image = isDemoBusiness(business)
    ? business.media
        ?.filter((item) => isUsableImageUrl(item.url))
        .slice()
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0]
    : undefined;

  const imageUrl = image?.url;

  if (!isUsableImageUrl(imageUrl)) {
    return <BusinessPlaceholder business={business} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={image?.alt ?? business.name}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
    />
  );
}

export function BusinessCard({ business }: BusinessCardProps) {
  const description = isDemoBusiness(business) ? business.shortDescription : business.description;
  const badges = isDemoBusiness(business) ? business.badges : business.tags;
  const whatsapp = isDemoBusiness(business) ? business.whatsapp : undefined;
  const phone = isDemoBusiness(business) ? business.phone : undefined;
  const providerId = isDemoBusiness(business) ? business.id : undefined;
  const service = isDemoBusiness(business) ? business.mainService ?? business.category : business.category;
  const rating = isDemoBusiness(business) ? business.rating : undefined;
  const reviewCount = isDemoBusiness(business) ? business.reviewCount : undefined;
  const section = isDemoBusiness(business) && business.section ? sectionLabels[business.section] : undefined;
  const categories = isDemoBusiness(business) ? (business.categories ?? [business.category]).slice(0, 3) : [business.category];
  const locations = isDemoBusiness(business) ? (business.locations ?? [business.location]).slice(0, 2) : [business.location];
  const visibleBadges = badges.slice(0, 4);

  return (
    <article className="group overflow-hidden rounded-[1.15rem] border border-casero-dark/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft">
      <div className="grid lg:grid-cols-[17.5rem_1fr]">
        <Link href={`/negocio/${business.slug}`} className="relative block min-h-[220px] overflow-hidden bg-casero-background lg:min-h-full">
          <BusinessImage business={business} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/82 via-black/35 to-transparent p-3 text-white" aria-hidden />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {business.featured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-extrabold text-white shadow-sm backdrop-blur-sm">
                <Star className="h-3.5 w-3.5 fill-casero-orange text-casero-orange" aria-hidden />
                Recomendado
              </span>
            ) : null}
            {business.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-1 text-xs font-extrabold text-white shadow-sm backdrop-blur-sm">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                Verificado
              </span>
            ) : null}
          </div>
        </Link>

        <div className="flex min-w-0 flex-col p-4 sm:p-5 lg:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              {section ? <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-casero-green">{section}</p> : null}
              <Link href={`/negocio/${business.slug}`}>
                <h3 className="mt-1 font-heading text-xl font-extrabold leading-snug text-casero-dark transition hover:text-casero-green sm:text-2xl">
                  {business.name}
                </h3>
              </Link>
            </div>
            {rating ? (
              <p className="inline-flex flex-none items-center gap-1 rounded-full bg-casero-orange/18 px-3 py-1.5 text-sm font-extrabold text-casero-dark">
                <Star className="h-4 w-4 fill-casero-orange text-casero-orange" aria-hidden />
                {rating.toFixed(1)}
                <span className="font-semibold text-casero-text/58">({reviewCount})</span>
              </p>
            ) : null}
          </div>

          <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-casero-text/70 sm:line-clamp-3">{description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} tone="turquoise" className="font-bold">
                {category}
              </Badge>
            ))}
          </div>

          <p className="mt-4 flex items-start gap-2 rounded-xl bg-casero-background px-3 py-2 text-sm font-bold text-casero-text/72">
            <MapPin className="mt-0.5 h-4 w-4 flex-none text-casero-green" aria-hidden />
            <span>{locations.join(", ")}</span>
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {visibleBadges.map((tag) => (
              <Badge key={tag} tone={tag === "Verificado" ? "green" : tag === "Urgencias" ? "orange" : "neutral"} className="font-bold">
                {tag}
              </Badge>
            ))}
            {badges.length > visibleBadges.length ? <Badge className="font-bold">+{badges.length - visibleBadges.length}</Badge> : null}
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:mt-auto lg:pt-5">
            <CaseroServiceCaptureModal
              businessName={business.name}
              service={service}
              zone={locations[0]}
              providerId={providerId}
              providerWhatsapp={whatsapp}
              providerPhone={phone}
              category={business.category}
              className="w-full"
            />
            <Button href={`/negocio/${business.slug}`} variant="outline" className="w-full font-extrabold">
              <MessageCircle className="h-4 w-4" aria-hidden />
              Ver perfil
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}