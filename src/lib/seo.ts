import type { Metadata } from "next";

export const siteName = "Casero Cancún";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://caserocancun.com").replace(/\/$/, "");

export const defaultDescription =
  "Encuentra servicios del hogar, proveedores locales, tiendas de materiales, mascotas y servicios automotrices en Cancún con contacto directo.";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

type PublicMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
};

export function createPublicMetadata({
  title,
  description = defaultDescription,
  path = "/",
  type = "website",
}: PublicMetadataOptions): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type,
      url,
      siteName,
      locale: "es_MX",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export const privatePageMetadata: Pick<Metadata, "robots"> = {
  robots: {
    index: false,
    follow: false,
  },
};
