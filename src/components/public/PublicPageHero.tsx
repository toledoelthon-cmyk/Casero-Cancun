import Image from "next/image";
import { ReactNode } from "react";
import { clsx } from "clsx";

type PublicPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  className?: string;
};

export function PublicPageHero({
  eyebrow,
  title,
  description,
  image = "/images/hero/hero-bg-riviera-desktop.webp",
  imageAlt = "",
  children,
  className,
}: PublicPageHeroProps) {
  return (
    <section className={clsx("relative isolate overflow-hidden rounded-[1.35rem] border border-casero-dark/10 bg-casero-dark shadow-soft", className)}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="(min-width: 1024px) 1200px, 100vw"
        className="object-cover opacity-64"
        priority={false}
      />
      <div className="absolute inset-0 bg-slate-950/36" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/52 to-black/18" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-transparent to-white/8" aria-hidden />
      <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="max-w-4xl rounded-[1.2rem] border border-white/14 bg-slate-950/68 p-5 text-white shadow-soft backdrop-blur-sm sm:p-6 lg:p-7">
          <p className="inline-flex rounded-full bg-white/16 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-sm ring-1 ring-white/12 backdrop-blur-sm">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white/92 sm:text-lg sm:leading-8">
            {description}
          </p>
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}