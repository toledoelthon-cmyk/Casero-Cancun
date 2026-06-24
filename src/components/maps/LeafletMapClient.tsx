"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

type MapPosition = {
  latitude: number;
  longitude: number;
};

type LeafletMapClientProps = {
  latitude?: number | null;
  longitude?: number | null;
  mode: "display" | "picker";
  markerLabel?: string;
  onChange?: (position: MapPosition) => void;
};

const cancunCenter: MapPosition = {
  latitude: 21.1619,
  longitude: -86.8515,
};

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function getPosition(latitude?: number | null, longitude?: number | null): MapPosition | null {
  if (typeof latitude !== "number" || !Number.isFinite(latitude) || typeof longitude !== "number" || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

function MapClickHandler({ onChange }: { onChange?: (position: MapPosition) => void }) {
  useMapEvents({
    click(event) {
      onChange?.({
        latitude: Number(event.latlng.lat.toFixed(6)),
        longitude: Number(event.latlng.lng.toFixed(6)),
      });
    },
  });

  return null;
}

export function LeafletMapClient({
  latitude,
  longitude,
  mode,
  markerLabel = "Ubicación del negocio",
  onChange,
}: LeafletMapClientProps) {
  const selectedPosition = getPosition(latitude, longitude);
  const hasPosition = Boolean(selectedPosition);
  const position = selectedPosition ?? cancunCenter;
  const markerPosition: [number, number] = [position.latitude, position.longitude];
  const canPick = mode === "picker";

  return (
    <MapContainer center={markerPosition} zoom={hasPosition ? 16 : 12} scrollWheelZoom className="h-full min-h-80 w-full rounded-md">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {canPick ? <MapClickHandler onChange={onChange} /> : null}
      {(hasPosition || canPick) ? (
        <Marker
          position={markerPosition}
          icon={markerIcon}
          draggable={canPick}
          alt={markerLabel}
          eventHandlers={
            canPick
              ? {
                  dragend(event) {
                    const marker = event.target;
                    const nextPosition = marker.getLatLng();
                    onChange?.({
                      latitude: Number(nextPosition.lat.toFixed(6)),
                      longitude: Number(nextPosition.lng.toFixed(6)),
                    });
                  },
                }
              : undefined
          }
        />
      ) : null}
    </MapContainer>
  );
}
