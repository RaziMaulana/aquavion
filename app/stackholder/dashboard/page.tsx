"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// =======================
// SSR SAFE MAP IMPORT
// =======================
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-950 text-cyan-400 font-bold">
        Loading Map...
      </div>
    ),
  }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// =======================
// TYPES
// =======================
type CoastalStatus =
  | "Critical Erosion"
  | "Warning"
  | "Moderate Abrasion"
  | "Survey Active"
  | "Stable";

type CoastalLocation = {
  name: string;
  position: [number, number];
  color: string;
  status: CoastalStatus;
  detail: string;
  yearlyChange: string;
};

// =======================
// DATA
// =======================
const coastalLocations: CoastalLocation[] = [
  {
    name: "Pantai Ancol - Jakarta",
    position: [-6.118, 106.85],
    color: "#f97316",
    status: "Warning",
    detail: "Abrasi meningkat 14% / tahun",
    yearlyChange: "-14%",
  },
  {
    name: "Pantai Pangandaran - Jawa Barat",
    position: [-7.688, 108.653],
    color: "#f97316",
    status: "Moderate Abrasion",
    detail: "Butuh mitigasi tanggul",
    yearlyChange: "-9%",
  },
  {
    name: "Pantai Kuta - Bali",
    position: [-8.718, 115.168],
    color: "#22c55e",
    status: "Stable",
    detail: "Stabil, monitoring rutin",
    yearlyChange: "+1%",
  },
  {
    name: "Pantai Balikpapan - Kalimantan",
    position: [-1.265, 116.831],
    color: "#ef4444",
    status: "Critical Erosion",
    detail: "Prioritas nasional",
    yearlyChange: "-22%",
  },
  {
    name: "Pantai Losari - Makassar",
    position: [-5.147, 119.408],
    color: "#38bdf8",
    status: "Survey Active",
    detail: "AI survey sedang berjalan",
    yearlyChange: "Scanning",
  },
];

// =======================
// HELPERS
// =======================
function getPulseClass(status: CoastalStatus) {
  switch (status) {
    case "Critical Erosion":
      return "animate-ping bg-red-500";
    case "Warning":
    case "Moderate Abrasion":
      return "animate-pulse bg-orange-500";
    case "Survey Active":
      return "animate-pulse bg-sky-400";
    default:
      return "bg-green-500";
  }
}

// =======================
// MAIN PAGE
// =======================
export default function StakeholderDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mapCenter = useMemo<[number, number]>(() => [-2.5, 118], []);

  const criticalCount = useMemo(
    () =>
      coastalLocations.filter(
        (x) => x.status === "Critical Erosion"
      ).length,
    []
  );

  const warningCount = useMemo(
    () =>
      coastalLocations.filter(
        (x) =>
          x.status === "Warning" ||
          x.status === "Moderate Abrasion"
      ).length,
    []
  );

  const stableCount = useMemo(
    () =>
      coastalLocations.filter((x) => x.status === "Stable").length,
    []
  );

  if (!mounted) {
    return (
      <div className="w-full h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 font-bold animate-pulse text-lg">
          Loading Coastal Intelligence...
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden text-white">
      {/* ======================= */}
      {/* MAP */}
      {/* ======================= */}
      <MapContainer
        center={mapCenter}
        zoom={5}
        minZoom={4}
        maxZoom={10}
        zoomControl={true}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{
          background: "#020617",
        }}
      >
        {/* DARK MODE MAP */}
        <TileLayer
          attribution="&copy; CARTO & OpenStreetMap"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* MARKERS */}
        {coastalLocations.map((location) => (
          <CircleMarker
            key={location.name}
            center={location.position}
            radius={12}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: location.color,
              fillOpacity: 0.95,
            }}
          >
            <Popup>
              <div className="text-sm min-w-[220px] text-slate-900">
                <p className="font-bold text-base mb-1">
                  {location.name}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {location.status}
                </p>
                <p className="mt-1">{location.detail}</p>
                <p className="text-xs mt-2 font-semibold">
                  Perubahan garis pantai: {location.yearlyChange}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* ======================= */}
      {/* GLOBAL OVERLAY */}
      {/* ======================= */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-black/80 z-[400]" />

      {/* ======================= */}
      {/* HEADER */}
      {/* ======================= */}
      <div className="absolute top-6 left-6 z-[500] max-w-2xl">
        <div className="bg-slate-900/75 backdrop-blur-2xl border border-cyan-400/20 rounded-3xl px-7 py-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] uppercase tracking-[0.3em] font-black mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            LIVE AI MONITORING
          </div>

          <h1 className="text-cyan-400 text-3xl md:text-4xl font-black tracking-tight">
            Indonesia Coastal Monitoring
          </h1>

          <p className="text-slate-300 text-sm mt-3 leading-relaxed">
            Dashboard pemantauan abrasi, risiko pesisir, dan
            prioritas wilayah pantai Indonesia berbasis AI untuk
            stakeholder nasional.
          </p>
        </div>
      </div>

      {/* ======================= */}
      {/* KPI PANEL */}
      {/* ======================= */}
      <div className="absolute top-6 right-6 z-[500] grid grid-cols-2 gap-4">
        <StatCard
          label="Critical"
          value={criticalCount}
          color="text-red-400"
        />

        <StatCard
          label="Warning"
          value={warningCount}
          color="text-orange-400"
        />

        <StatCard
          label="Stable"
          value={stableCount}
          color="text-green-400"
        />

        <StatCard
          label="Coverage"
          value="98%"
          color="text-cyan-400"
        />
      </div>

      {/* ======================= */}
      {/* LEGEND */}
      {/* ======================= */}
      <div className="absolute bottom-8 left-6 z-[500] bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 space-y-4 min-w-[240px]">
        <h3 className="text-white font-bold text-sm uppercase tracking-widest">
          Status Pantai
        </h3>

        <div className="space-y-3 text-sm">
          <LegendItem
            color="bg-red-500"
            label="Critical Erosion"
          />
          <LegendItem
            color="bg-orange-500"
            label="Warning"
          />
          <LegendItem
            color="bg-sky-400"
            label="Survey Active"
          />
          <LegendItem
            color="bg-green-500"
            label="Stable"
          />
        </div>
      </div>

      {/* ======================= */}
      {/* HOTSPOT PANEL */}
      {/* ======================= */}
      <div className="absolute bottom-8 right-6 z-[500] w-[340px] bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-5">
        <h3 className="text-sm uppercase tracking-widest font-bold text-slate-400 mb-4">
          Priority Hotspot
        </h3>

        <div className="space-y-4">
          {coastalLocations
            .filter(
              (x) =>
                x.status === "Critical Erosion" ||
                x.status === "Warning"
            )
            .slice(0, 3)
            .map((item) => (
              <div
                key={item.name}
                className="flex items-start gap-3"
              >
                <div className="relative mt-1">
                  <span
                    className={`absolute inset-0 rounded-full ${getPulseClass(
                      item.status
                    )} opacity-30`}
                  />
                  <span
                    className="relative block w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                <div>
                  <p className="font-semibold text-sm">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// =======================
// COMPONENTS
// =======================
function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-slate-300">{label}</span>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-slate-900/75 backdrop-blur-xl border border-white/10 rounded-2xl p-4 min-w-[140px]">
      <p className="text-xs uppercase text-slate-400">
        {label}
      </p>
      <p className={`text-3xl font-black ${color}`}>
        {value}
      </p>
    </div>
  );
}