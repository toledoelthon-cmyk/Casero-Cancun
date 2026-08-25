import type { Metadata } from "next";
import { brandAssets } from "@/lib/brand";

export const siteName = "Casero Cancún";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://caserocancun.com";
export const siteUrl = configuredSiteUrl.replace(/\/$/, "");

export const defaultDescription =
  "Directorio local de servicios, negocios y proveedores en Cancún y Riviera Maya con contacto directo por WhatsApp.";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

export const defaultOgImagePath = brandAssets.ogImage;
export const defaultOgImage = {
  url: absoluteUrl(defaultOgImagePath),
  width: 1200,
  height: 630,
  alt: "Casero Cancún | Servicios, negocios y proveedores en Cancún y Riviera Maya",
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
    metadataBase: new URL(siteUrl),
    title,
    description,
    applicationName: siteName,
    generator: "Next.js",
    creator: siteName,
    publisher: siteName,
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: siteName,
      statusBarStyle: "default",
    },
    formatDetection: {
      telephone: false,
    },
    icons: {
      icon: [
        {
          url: brandAssets.favicon,
          type: "image/png",
        },
        {
          url: "/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/icons/icon-512.png",
          sizes: "512x512",
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
    robots: {
      index: true,
      follow: true,
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



