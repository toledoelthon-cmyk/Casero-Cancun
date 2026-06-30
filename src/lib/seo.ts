import type { Metadata } from "next";
import { brandAssets } from "@/lib/brand";

export const siteName = "Casero Cancún";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://caserocancun.com").replace(/\/$/, "");

export const defaultDescription =
  "Encuentra servicios del hogar, proveedores locales, tiendas de materiales, mascotas y servicios automotrices en Cancún con contacto directo.";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

export const defaultOgImagePath = brandAssets.ogImage;
export const defaultOgImage = {
  url: absoluteUrl(defaultOgImagePath),
  width: 1200,
  height: 630,
  alt: "Casero Cancún | Servicios, proveedores y negocios locales en Cancún",
};

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
    icons: {
      icon: [
        {
          url: brandAssets.favicon,
          type: "image/png",
        },
      ],
      shortcut: [brandAssets.favicon],
      apple: [
        {
          url: brandAssets.appleIcon,
          type: "image/png",
        },
      ],
    },
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
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage.url],
    },
  };
}

export const privatePageMetadata: Pick<Metadata, "robots"> = {
  robots: {
    index: false,
    follow: false,
  },
};
