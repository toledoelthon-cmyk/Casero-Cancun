import Link from "next/link";
import { BadgeCheck, CarFront, Home, MapPin, PawPrint, Star, Store, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
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
      <span className="grid h-14 w-14 place-items-center rounded-md bg-white/80 text-casero-green shadow-sm">
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <p className="mt-4 font-heading text-xl font-extrabold text-casero-dark">{business.name.charAt(0)}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-casero-text/55">{label}</p>
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
      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
    />
  );
}

export function BusinessCard({ business }: BusinessCardProps) {
  const description = isDemoBusiness(business) ? business.shortDescription : business.description;
  const badges = isDemoBusiness(business) ? business.badges : business.tags;
  const whatsapp = isDemoBusiness(business) ? business.whatsapp : undefined;
  const rating = isDemoBusiness(business) ? business.rating : undefined;
  const reviewCount = isDemoBusiness(business) ? business.reviewCount : undefined;
  const section = isDemoBusiness(business) && business.section ? sectionLabels[business.section] : undefined;
  const categories = isDemoBusiness(business) ? (business.categories ?? [business.category]).slice(0, 3) : [business.category];
  const locations = isDemoBusiness(business) ? (business.locations ?? [business.location]).slice(0, 3) : [business.location];

  return (
    <article className="group overflow-hidden rounded-lg border border-casero-dark/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/negocio/${business.slug}`} className="block aspect-video overflow-hidden bg-casero-background">
        <BusinessImage business={business} />
      </Link>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          {business.featured ? (
            <Badge tone="orange" className="gap-1">
              <Star className="h-3.5 w-3.5 fill-casero-orange text-casero-orange" aria-hidden />
              Recomendado
            </Badge>
          ) : null}
          {business.verified ? (
            <Badge tone="green" className="gap-1">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              Verificado
            </Badge>
          ) : null}
        </div>

        <Link href={`/negocio/${business.slug}`}>
          <h3 className="mt-3 font-heading text-xl font-extrabold text-casero-dark hover:text-casero-green">
            {business.name}
          </h3>
        </Link>
        {section ? <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-casero-green">{section}</p> : null}
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category} tone="turquoise">
              {category}
            </Badge>
          ))}
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-casero-text/70">{description}</p>
        <p className="mt-3 flex items-start gap-2 text-sm text-casero-text/60">
          <MapPin className="h-4 w-4" aria-hidden />
          <span>{locations.join(", ")}</span>
        </p>

        {rating ? (
          <p className="mt-3 text-sm font-semibold text-casero-dark">
            {rating.toFixed(1)} <span className="text-casero-orange">★</span>{" "}
            <span className="font-normal text-casero-text/55">({reviewCount} reseñas)</span>
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((tag) => (
            <Badge key={tag} tone={tag === "Verificado" ? "green" : tag === "Urgencias" ? "orange" : "neutral"}>
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <WhatsAppButton phone={whatsapp} label="WhatsApp" />
          <Button href={`/negocio/${business.slug}`} variant="outline">
            Ver perfil
          </Button>
        </div>
      </div>
    </article>
  );
}
