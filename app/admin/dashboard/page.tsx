// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

import {
  useAgentStore,
  COASTAL_REGISTRY,
  riskHex,
} from "@/lib/agentStore";

// =======================
// CHART SETUP
// =======================
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

// =======================
// LEAFLET COMPONENTS
// =======================
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

// =======================
// COMPONENT
// =======================
export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  const {
    analyses,
    allTasks,
    latestInsight,
    agentStatus,
    currentCoastIndex,
    cycleCount,
    currentWorkflow,
    startAgent,
    stopAgent,
    initializeAgent,
  } = useAgentStore();

  // =======================
  // INIT
  // =======================
  useEffect(() => {
    let active = true;

    const init = async () => {
      if (typeof window === "undefined") return;

      const leafletModule = await import("leaflet");

      // FIX DEFAULT ICON ERROR
      delete (leafletModule.Icon.Default.prototype as any)._getIconUrl;

      leafletModule.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!active) return;

      setL(leafletModule);
      setMounted(true);

      initializeAgent();

      if (useAgentStore.getState().agentStatus === "idle") {
        startAgent();
      }
    };

    init();

    return () => {
      active = false;
    };
  }, [initializeAgent, startAgent]);

  // =======================
  // DATA
  // =======================
  const analysisValues = useMemo(() => {
    return Object.values(analyses).sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }, [analyses]);

  const avgScore = analysisValues.length
    ? Math.round(
      analysisValues.reduce(
        (sum, item) => sum + item.riskScore,
        0
      ) / analysisValues.length
    )
    : 0;

  const criticalCount = analysisValues.filter(
    (a) =>
      a.riskLevel === "KRITIS" ||
      a.riskLevel === "TINGGI"
  ).length;

  const pendingTasks = allTasks.filter(
    (t) => t.status === "pending"
  ).length;

  const trend = analysisValues.slice(-8);

  const activeCoast =
    COASTAL_REGISTRY[currentCoastIndex];

  // =======================
  // SAFE ICON
  // =======================
  const getIcon = (coastName: string) => {
    if (!L?.divIcon) return undefined;

    const analysis = analyses[coastName];

    const isActive =
      activeCoast?.name === coastName &&
      agentStatus === "running";

    const color = isActive
      ? "#22d3ee"
      : analysis
        ? riskHex(analysis.riskLevel)
        : "#64748b";

    const size = isActive ? 20 : 14;

    return L.divIcon({
      className: "custom-div-icon",
      html: `
        <div style="
          width:${size}px;
          height:${size}px;
          border-radius:9999px;
          background:${color};
          border:2px solid rgba(255,255,255,0.9);
          box-shadow:0 0 14px ${color};
          ${isActive
          ? "animation:pulse 1.2s infinite;"
          : ""
        }
        "></div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // =======================
  // LOADING SAFE
  // =======================
  if (!mounted || !L) {
    return <div className="h-screen bg-slate-950" />;
  }

  // =======================
  // UI
  // =======================
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black">
            Live Coastal Monitoring
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {analysisValues.length} pantai ·{" "}
            {cycleCount} siklus
          </p>
        </div>

        <button
          onClick={() =>
            agentStatus === "running"
              ? stopAgent()
              : startAgent()
          }
          className={`px-5 py-3 rounded-xl font-bold transition ${agentStatus === "running"
              ? "bg-red-500 hover:bg-red-400"
              : "bg-cyan-400 hover:bg-cyan-300 text-slate-950"
            }`}
        >
          {agentStatus === "running"
            ? "Stop Agent"
            : "Start Agent"}
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Avg Risk", value: avgScore || "—" },
          { label: "Critical", value: criticalCount },
          { label: "Pending", value: pendingTasks },
          {
            label: "Scanned",
            value: analysisValues.length,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-slate-900/60 border border-white/10 rounded-2xl p-4"
          >
            <div className="text-3xl font-black">
              {item.value}
            </div>
            <div className="text-xs text-slate-400 uppercase mt-2">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* MAP */}
        <div className="col-span-12 lg:col-span-8 bg-slate-900/50 rounded-3xl p-3 border border-white/10">
          <div className="h-[500px] rounded-2xl overflow-hidden">
            <MapContainer
              center={[-2.5, 118]}
              zoom={5}
              scrollWheelZoom={false}
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              {/* DARK MAP */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap &copy; CARTO"
              />

              {COASTAL_REGISTRY.map((coast) => {
                const analysis = analyses[coast.name];

                return (
                  <Marker
                    key={coast.name}
                    position={coast.coords}
                    icon={getIcon(coast.name)}
                  >
                    <Popup>
                      <div className="text-sm min-w-[180px]">
                        <strong>{coast.name}</strong>
                        <br />
                        {analysis
                          ? `${analysis.riskLevel} (${analysis.riskScore})`
                          : "Menunggu analisis"}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* SIDE */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* INSIGHT */}
          <div className="bg-cyan-400 text-slate-950 rounded-3xl p-6">
            <p className="text-xs uppercase font-black mb-2">
              Latest Insight
            </p>
            <p className="font-semibold">
              {latestInsight ||
                "Belum ada insight."}
            </p>
          </div>

          {/* WORKFLOW */}
          <div className="bg-slate-900/50 rounded-3xl p-6 border border-white/10">
            <h3 className="text-cyan-400 font-black text-xs uppercase mb-4">
              Live Workflow
            </h3>

            <div className="space-y-3">
              {currentWorkflow.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  Menunggu...
                </p>
              ) : (
                currentWorkflow.map((step, i) => (
                  <div key={i}>
                    <p className="font-bold text-sm">
                      {step.stepName}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {step.output}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* TREND */}
        <div className="col-span-12 bg-slate-900/50 rounded-3xl p-6 border border-white/10">
          <h3 className="font-bold mb-4">
            Abrasion Risk Trend
          </h3>

          <div className="h-64">
            <Line
              data={{
                labels:
                  trend.length > 0
                    ? trend.map((t) =>
                      t.coastName.replace(
                        "Pantai ",
                        ""
                      )
                    )
                    : ["—"],
                datasets: [
                  {
                    label: "Risk",
                    data:
                      trend.length > 0
                        ? trend.map(
                          (t) => t.riskScore
                        )
                        : [0],
                    fill: true,
                    borderColor: "#22d3ee",
                    backgroundColor:
                      "rgba(34,211,238,0.1)",
                    tension: 0.35,
                    pointRadius: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    min: 0,
                    max: 100,
                    ticks: {
                      color: "#64748b",
                    },
                    grid: {
                      color:
                        "rgba(255,255,255,0.05)",
                    },
                  },
                  x: {
                    ticks: {
                      color: "#64748b",
                    },
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}