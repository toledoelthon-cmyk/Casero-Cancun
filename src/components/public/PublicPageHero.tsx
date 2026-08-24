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
      <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 1200px, 100vw" className="object-cover opacity-48" priority={false} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/86 via-black/62 to-black/28" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-white/10" aria-hidden />
      <div className="relative z-10 max-w-4xl px-5 py-8 text-white sm:px-7 sm:py-10 lg:px-9 lg:py-12">
        <p className="inline-flex rounded-full bg-white/14 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur-sm">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white/88 sm:text-lg sm:leading-8">
          {description}
        </p>
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}