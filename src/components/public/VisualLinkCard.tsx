import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type VisualLinkCardProps = {
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  cta: string;
  meta?: string;
  icon?: string;
  iconAlt?: string;
};

export function VisualLinkCard({ title, description, href, image, imageAlt, cta, meta, icon, iconAlt = "" }: VisualLinkCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[1.15rem] border border-casero-dark/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-casero-background">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {meta ? <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-casero-green">{meta}</p> : null}
            <h2 className="mt-1 line-clamp-2 font-heading text-xl font-extrabold leading-tight text-slate-950 sm:text-2xl">{title}</h2>
          </div>
          {icon ? (
            <span className="relative h-10 w-10 flex-none overflow-hidden rounded-xl bg-casero-background shadow-sm ring-1 ring-casero-dark/10">
              <Image src={icon} alt={iconAlt} fill sizes="40px" className="object-contain p-2" />
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{description}</p>
        <p className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-casero-green/10 px-3 py-1.5 text-sm font-extrabold text-emerald-800 shadow-sm ring-1 ring-casero-green/15 sm:text-xs">
          {cta}
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
        </p>
      </div>
    </Link>
  );
}
