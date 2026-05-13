"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";

type Props = {
    selected: string;
    setSelected: (val: string) => void;
};

const locations = [
    {
        name: "Manggar",
        position: [-1.265, 116.831] as [number, number],
        status: "Critical",
        color: "#ef4444",
    },
    {
        name: "Ancol",
        position: [-6.118, 106.85] as [number, number],
        status: "Warning",
        color: "#f97316",
    },
    {
        name: "Kuta",
        position: [-8.718, 115.168] as [number, number],
        status: "Safe",
        color: "#22c55e",
    },
];

export function MapPanel({ selected, setSelected }: Props) {
    const center = useMemo<[number, number]>(() => [-2.5, 118], []);

    return (
        <MapContainer
            center={center}
            zoom={5}
            scrollWheelZoom
            className="h-full w-full z-0"
            style={{ background: "#031427" }}
        >
            {/* DARK MAP LAYER (biar seperti UI kamu) */}
            <TileLayer
                attribution=""
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* MARKERS */}
            {locations.map((loc) => (
                <CircleMarker
                    key={loc.name}
                    center={loc.position}
                    radius={10}
                    pathOptions={{
                        color: "#fff",
                        weight: 2,
                        fillColor: loc.color,
                        fillOpacity: 0.9,
                    }}
                    eventHandlers={{
                        click: () => setSelected(loc.name),
                    }}
                >
                    <Popup>
                        <div className="text-sm">
                            <p className="font-bold">{loc.name}</p>
                            <p>Status: {loc.status}</p>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}