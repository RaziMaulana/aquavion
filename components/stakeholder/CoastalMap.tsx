"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
    () => import("react-leaflet").then((m) => m.MapContainer),
    { ssr: false }
);

const TileLayer = dynamic(
    () => import("react-leaflet").then((m) => m.TileLayer),
    { ssr: false }
);

const CircleMarker = dynamic(
    () => import("react-leaflet").then((m) => m.CircleMarker),
    { ssr: false }
);

const Popup = dynamic(
    () => import("react-leaflet").then((m) => m.Popup),
    { ssr: false }
);

export type CoastalLocation = {
    name: string;
    position: [number, number];
    color: string;
    status: string;
};

const coastalLocations: CoastalLocation[] = [
    {
        name: "Pantai Ancol - Jakarta",
        position: [-6.118, 106.85],
        color: "#f97316",
        status: "Warning",
    },
    {
        name: "Pantai Pangandaran - Jawa Barat",
        position: [-7.688, 108.653],
        color: "#f97316",
        status: "Moderate Abrasion",
    },
    {
        name: "Pantai Kuta - Bali",
        position: [-8.718, 115.168],
        color: "#22c55e",
        status: "Stable",
    },
    {
        name: "Pantai Balikpapan - Kalimantan",
        position: [-1.265, 116.831],
        color: "#ef4444",
        status: "Critical Erosion",
    },
    {
        name: "Pantai Losari - Makassar",
        position: [-5.147, 119.408],
        color: "#38bdf8",
        status: "Survey Active",
    },
];

export default function CoastalMap() {
    const mapCenter = useMemo<[number, number]>(() => [-2.5, 118], []);

    return (
        <div className="relative w-full h-screen bg-slate-950 rounded-[32px] overflow-hidden border border-cyan-950">
            <MapContainer
                center={mapCenter}
                zoom={5}
                minZoom={4}
                maxZoom={10}
                scrollWheelZoom
                className="w-full h-full z-0"
            >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

                {coastalLocations.map((location) => (
                    <CircleMarker
                        key={location.name}
                        center={location.position}
                        radius={10}
                        pathOptions={{
                            color: "#ffffff",
                            weight: 3,
                            fillColor: location.color,
                            fillOpacity: 0.9,
                        }}
                    >
                        <Popup>
                            <div className="text-sm font-semibold">
                                <p>{location.name}</p>
                                <p>Status: {location.status}</p>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-950/40 to-black/70 z-[400]" />

            <div className="absolute top-6 left-6 z-[500] bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4">
                <h1 className="text-cyan-400 text-2xl font-bold">
                    Indonesia Coastal Monitoring
                </h1>
                <p className="text-slate-300 text-sm mt-1">
                    Pemantauan abrasi, risiko pesisir, dan prioritas nasional
                </p>
            </div>
        </div>
    );
}