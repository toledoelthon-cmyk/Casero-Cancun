import { notFound } from "next/navigation";
import { BadgeCheck, MapPin } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { featuredBusinesses } from "@/lib/seed";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BusinessProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const business = featuredBusinesses.find((item) => item.slug === slug);

  if (!business) {
    notFound();
  }

  return (
    <section className="container-page py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="h-64 rounded-lg bg-gradient-to-br from-casero-turquoise/25 via-casero-beige to-casero-orange/25" />
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {business.verified ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-casero-green/10 px-3 py-1 text-sm font-bold text-casero-green">
                <BadgeCheck className="h-4 w-4" />
                Verificado
              </span>
            ) : null}
            {business.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-white px-3 py-1 text-sm font-semibold text-casero-navy/70">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-5 text-4xl font-black text-casero-navy">{business.name}</h1>
          <p className="mt-2 text-lg font-bold text-casero-turquoise">{business.category}</p>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-casero-navy/70">
            {business.description} Perfil demostrativo preparado para conectarse con PostgreSQL,
            reseñas, galería real y estado de publicación.
          </p>
        </div>
        <aside className="h-fit rounded-lg border border-casero-navy/10 bg-white p-6 shadow-sm">
          <p className="flex items-center gap-2 text-sm text-casero-navy/65">
            <MapPin className="h-4 w-4" aria-hidden />
            {business.location}
          </p>
          <div className="mt-6">
            <WhatsAppButton />
          </div>
        </aside>
      </div>
    </section>
  );
}
