"use client";

import dynamic from "next/dynamic";

type BusinessMapProps = {
  latitude?: number | null;
  longitude?: number | null;
  markerLabel?: string;
};

const LeafletDisplayMap = dynamic(
  () => import("@/components/maps/LeafletMapClient").then((module) => module.LeafletMapClient),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-72 place-items-center rounded-md bg-casero-background text-sm font-semibold text-casero-text/60">
        Cargando mapa...
      </div>
    ),
  },
);

function hasCoordinates(latitude?: number | null, longitude?: number | null) {
  return typeof latitude === "number" && Number.isFinite(latitude) && typeof longitude === "number" && Number.isFinite(longitude);
}

export function BusinessMap({ latitude, longitude, markerLabel }: BusinessMapProps) {
  if (!hasCoordinates(latitude, longitude)) {
    return null;
  }

  return (
    <div className="h-72 overflow-hidden rounded-md border border-casero-dark/10 bg-casero-background">
      <LeafletDisplayMap latitude={latitude} longitude={longitude} mode="display" markerLabel={markerLabel} />
    </div>
  );
}
