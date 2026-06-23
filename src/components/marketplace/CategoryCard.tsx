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
      className="group flex h-full flex-col rounded-lg border border-casero-dark/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-casero-green/40 hover:shadow-soft"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-11 w-11 place-items-center rounded-md bg-casero-beige text-casero-green">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <ArrowRight className="h-5 w-5 text-casero-dark/35 transition group-hover:translate-x-1 group-hover:text-casero-green" />
      </div>
      <h3 className="mt-5 font-heading text-lg font-bold text-casero-dark">{category.name}</h3>
      <p className="mt-2 text-sm leading-6 text-casero-text/65">{category.description}</p>
    </Link>
  );
}
