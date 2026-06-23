import Link from "next/link";
import { BadgeCheck, MapPin, Star, Store, Wrench } from "lucide-react";
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

function BusinessPlaceholder({ type, name }: { type?: DemoBusiness["profileType"]; name: string }) {
  const Icon = type === "material_store" ? Store : Wrench;
  const label = type === "material_store" ? "Tienda/materiales" : "Proveedor de servicios";

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-casero-turquoise/18 via-casero-beige to-casero-orange/20 p-6 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-md bg-white/80 text-casero-green shadow-sm">
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <p className="mt-4 font-heading text-xl font-extrabold text-casero-dark">{name.charAt(0)}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-casero-text/55">{label}</p>
    </div>
  );
}

function BusinessImage({ business }: { business: DemoBusiness | LegacyBusiness }) {
  const image = isDemoBusiness(business) ? business.media?.[0] : undefined;

  if (!image?.url) {
    return <BusinessPlaceholder type={isDemoBusiness(business) ? business.profileType : undefined} name={business.name} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.url}
      alt={image.alt ?? business.name}
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
        <p className="mt-1 text-sm font-semibold text-casero-turquoise">{business.category}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-casero-text/70">{description}</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-casero-text/60">
          <MapPin className="h-4 w-4" aria-hidden />
          {business.location}
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
