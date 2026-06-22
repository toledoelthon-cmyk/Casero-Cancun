import Link from "next/link";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

type BusinessCardProps = {
  business: {
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
  return (
    <article className="grid gap-5 rounded-lg border border-casero-navy/10 bg-white p-5 shadow-sm sm:grid-cols-[8rem_1fr]">
      <div className="flex h-32 items-center justify-center rounded-md bg-gradient-to-br from-casero-turquoise/20 via-casero-beige to-casero-orange/20 text-3xl font-black text-casero-navy">
        {business.name.charAt(0)}
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {business.featured ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-casero-orange/15 px-2.5 py-1 text-xs font-bold text-casero-navy">
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
          <h3 className="mt-3 text-xl font-black text-casero-navy hover:text-casero-green">
            {business.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm font-semibold text-casero-turquoise">{business.category}</p>
        <p className="mt-3 text-sm leading-6 text-casero-navy/70">{business.description}</p>
        <p className="mt-3 flex items-center gap-2 text-sm text-casero-navy/60">
          <MapPin className="h-4 w-4" aria-hidden />
          {business.location}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {business.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-casero-background px-2.5 py-1 text-xs font-semibold text-casero-navy/70">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-5">
          <WhatsAppButton label="WhatsApp" />
        </div>
      </div>
    </article>
  );
}
