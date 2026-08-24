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
};

export function VisualLinkCard({ title, description, href, image, imageAlt, cta, meta }: VisualLinkCardProps) {
  return (
    <Link
      href={href}
      className="group relative block min-h-[255px] overflow-hidden rounded-[1.15rem] border border-white/70 bg-casero-dark shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casero-green"
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/42 to-black/8" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/78 via-black/38 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
        <div className="rounded-xl border border-white/12 bg-slate-950/64 p-4 shadow-sm backdrop-blur-sm">
          {meta ? <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/82">{meta}</p> : null}
          <h2 className="mt-1 font-heading text-2xl font-extrabold leading-tight text-white">{title}</h2>
          <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-white/92">{description}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-casero-dark shadow-sm ring-1 ring-black/5">
            {cta}
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
          </p>
        </div>
      </div>
    </Link>
  );
}