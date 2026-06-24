"use client";

import dynamic from "next/dynamic";

type MapPosition = {
  latitude: number;
  longitude: number;
};

type MapPickerProps = {
  latitude: number | null;
  longitude: number | null;
  onChange: (position: MapPosition) => void;
};

const LeafletPicker = dynamic(
  () => import("@/components/maps/LeafletMapClient").then((module) => module.LeafletMapClient),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-80 place-items-center rounded-md bg-white text-sm font-semibold text-casero-text/60">
        Cargando mapa...
      </div>
    ),
  },
);

function formatCoordinate(value: number | null) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(6) : "No seleccionada";
}

export function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
  return (
    <div className="md:col-span-2">
      <div className="overflow-hidden rounded-lg border border-casero-dark/10 bg-white p-3">
        <div className="h-72 overflow-hidden rounded-md bg-casero-background sm:h-80">
          <LeafletPicker latitude={latitude} longitude={longitude} mode="picker" onChange={onChange} />
        </div>
        <div className="mt-3 grid gap-2 text-xs font-semibold text-casero-text/65 sm:grid-cols-2">
          <p>Latitud: {formatCoordinate(latitude)}</p>
          <p>Longitud: {formatCoordinate(longitude)}</p>
        </div>
        <p className="mt-2 text-xs leading-5 text-casero-text/55">
          Toca el mapa o mueve el marcador para capturar la ubicación exacta.
        </p>
      </div>
    </div>
  );
}
