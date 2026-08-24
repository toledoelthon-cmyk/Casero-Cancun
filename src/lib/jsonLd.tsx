import { brandAssets } from "@/lib/brand";
import type { DemoBusiness, DemoLocation } from "@/lib/demo-data";
import { absoluteUrl, siteName, siteUrl } from "@/lib/seo";

const coverageArea = ["Cancún", "Puerto Morelos", "Playa del Carmen", "Tulum", "Riviera Maya"];

type JsonLdValue = string | number | boolean | null | JsonLdValue[] | { [key: string]: JsonLdValue };

export function JsonLd({ data }: { data: JsonLdValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    inLanguage: "es-MX",
    potentialAction: {
      "@type": "SearchAction",
      target: absoluteUrl("/buscar-servicios") + "?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: absoluteUrl(brandAssets.logoHorizontal),
    areaServed: coverageArea.map((name) => ({ "@type": "Place", name })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageJsonLd({
  title,
  description,
  path,
  businesses,
}: {
  title: string;
  description?: string;
  path: string;
  businesses: DemoBusiness[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: description ?? "",
    url: absoluteUrl(path),
    isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: businesses.map((business, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl("/negocio/" + business.slug),
        name: business.name,
      })),
    },
  };
}

export function locationPlaceJsonLd(location: DemoLocation) {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: location.name,
    url: absoluteUrl("/ubicacion/" + location.slug),
    containedInPlace: { "@type": "Place", name: "Riviera Maya" },
  };
}

export function businessJsonLd(business: DemoBusiness) {
  const image = business.media?.find((item) => item.url)?.url ?? business.logoUrl;
  const categories = business.categories ?? [business.category];
  const locations = business.locations ?? [business.location];
  const data: Record<string, JsonLdValue> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.longDescription ?? business.shortDescription,
    url: absoluteUrl("/negocio/" + business.slug),
    areaServed: locations.map((name) => ({ "@type": "Place", name })),
    category: categories.join(", "),
  };

  if (image) data.image = image.startsWith("/") ? absoluteUrl(image) : image;
  if (business.whatsapp) data.telephone = business.whatsapp;
  else if (business.phone) data.telephone = business.phone;
  if (business.address) data.address = { "@type": "PostalAddress", streetAddress: business.address };
  if (business.website) data.sameAs = [business.website];

  return data;
}
