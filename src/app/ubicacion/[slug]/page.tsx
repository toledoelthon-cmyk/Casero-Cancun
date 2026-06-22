import { notFound } from "next/navigation";
import { BusinessCard } from "@/components/marketplace/BusinessCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { featuredBusinesses, locations } from "@/lib/seed";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = locations.find((item) => item.slug === slug);

  if (!location) {
    notFound();
  }

  return (
    <section className="container-page py-12">
      <SectionHeader
        eyebrow="Ubicación"
        title={location.name}
        description="Proveedores y tiendas que atienden esta zona. Listado de muestra listo para conectarse a Supabase."
      />
      <div className="mt-8 grid gap-5">
        {featuredBusinesses.map((business) => (
          <BusinessCard key={business.slug} business={business} />
        ))}
      </div>
    </section>
  );
}
