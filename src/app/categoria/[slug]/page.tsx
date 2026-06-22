import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categories, featuredBusinesses } from "@/lib/seed";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Categoría"
        title={category.name}
        description={category.description}
      />
      <div className="mt-8 grid gap-5">
        {featuredBusinesses.map((business) => (
          <BusinessCard key={business.slug} business={business} />
        ))}
      </div>
    </section>
  );
}
