import Link from "next/link";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import type { DemoBusiness } from "@/lib/demo-data";

type BusinessCardProps = {
  business:
    | DemoBusiness
    | {
        name: string;
        slug: string;
        category: string;
        location: string;
        description: string;
        tags: string[];
        verified?: boolean;
        featured?: boolean;
      };
};

export function BusinessCard({ business }: BusinessCardProps) {
  const description = "shortDescription" in business ? business.shortDescription : business.description;
  const badges = "badges" in business ? business.badges : business.tags;
  const whatsapp = "whatsapp" in business ? business.whatsapp : undefined;
  const rating = "rating" in business ? business.rating : undefined;
  const reviewCount = "reviewCount" in business ? business.reviewCount : undefined;

  return (
    <article className="grid gap-5 rounded-lg border border-casero-dark/10 bg-white p-5 shadow-sm sm:grid-cols-[8rem_1fr]">
      <div className="flex h-32 items-center justify-center rounded-md bg-gradient-to-br from-casero-turquoise/20 via-casero-beige to-casero-orange/20 font-heading text-3xl font-extrabold text-casero-dark">
        {business.name.charAt(0)}
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {business.featured ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-casero-orange/15 px-2.5 py-1 text-xs font-bold text-casero-dark">
              <Star className="h-3.5 w-3.5 fill-casero-orange text-casero-orange" />
              Recomendado
            </span>
          ) : null}
          {business.verified ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-casero-green/10 px-2.5 py-1 text-xs font-bold text-casero-green">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verificado
            </span>
          ) : null}
        </div>
        <Link href={`/negocio/${business.slug}`}>
          <h3 className="mt-3 font-heading text-xl font-extrabold text-casero-dark hover:text-casero-green">
            {business.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm font-semibold text-casero-turquoise">{business.category}</p>
        <p className="mt-3 text-sm leading-6 text-casero-text/70">{description}</p>
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
        <div className="mt-5">
          <WhatsAppButton phone={whatsapp} label="WhatsApp" />
        </div>
      </div>
    </article>
  );
}
