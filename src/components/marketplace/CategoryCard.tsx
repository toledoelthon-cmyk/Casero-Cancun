import Link from "next/link";
import { ArrowRight, Car, HeartHandshake, Store, Wrench } from "lucide-react";
import type { CategorySection } from "@/lib/demo-data";

type CategoryCardProps = {
  category: {
    name: string;
    slug: string;
    type: "service_provider" | "material_store";
    section?: CategorySection;
    description?: string;
  };
};

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon =
    category.section === "pets"
      ? HeartHandshake
      : category.section === "auto_services"
        ? Car
        : category.type === "service_provider"
          ? Wrench
          : Store;

  return (
    <Link
      href={`/categoria/${category.slug}`}
      className="group flex h-full min-h-[190px] flex-col rounded-[1rem] border border-casero-dark/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/35 hover:shadow-soft sm:p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-casero-beige text-casero-green shadow-sm transition group-hover:bg-casero-green group-hover:text-white">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-casero-background text-casero-dark/45 transition group-hover:bg-casero-orange group-hover:text-casero-dark">
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
      <h3 className="mt-5 font-heading text-lg font-extrabold leading-tight text-casero-dark sm:text-xl">{category.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-casero-text/66">{category.description}</p>
      <p className="mt-auto pt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-casero-green">Ver proveedores</p>
    </Link>
  );
}