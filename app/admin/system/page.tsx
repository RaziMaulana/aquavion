"use client";

import { useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  Cpu,
  Database,
  Globe,
  Radar,
  Server,
  ShieldCheck,
  Waves,
  XCircle,
} from "lucide-react";

import {
  useAgentStore,
  riskBgClass,
  riskHex,
  COASTAL_REGISTRY,
} from "@/lib/agentStore";

const API_SOURCES = [
  {
    icon: Waves,
    name: "Open-Meteo Marine",
    url: "https://open-meteo.com/en/docs/marine-weather-api",
    status: "Online",
    latency: "142ms",
  },
  {
    icon: Globe,
    name: "Copernicus Marine",
    url: "https://marine.copernicus.eu",
    status: "Online",
    latency: "189ms",
  },
  {
    icon: Database,
    name: "Balai Pantai RI",
    url: "https://www.balaipantai.com",
    status: "Online",
    latency: "224ms",
  },
  {
    icon: Radar,
    name: "NOAA",
    url: "https://www.noaa.gov",
    status: "Online",
    latency: "168ms",
  },
  {
    icon: Globe,
    name: "USGS EarthExplorer",
    url: "https://earthexplorer.usgs.gov",
    status: "Online",
    latency: "251ms",
  },
  {
    icon: Waves,
    name: "Global Surface Water",
    url: "https://global-surface-water.appspot.com",
    status: "Online",
    latency: "201ms",
  },
  {
    icon: Bot,
    name: "GROQ AI",
    url: "https://console.groq.com",
    status: "Online",
    latency: "92ms",
  },
];

export default function AdminSystemPage() {
  const {
    agentStatus,
    config,
    cycleCount,
    currentCoastIndex,
    analyses,
    allTasks,
    currentWorkflow,
    agentError,
  } = useAgentStore();

  // =============================
  // SEMUA HOOK HARUS DI ATAS
  // =============================
  const isRunning = agentStatus === "running";

  const analysisValues = useMemo(
    () => Object.values(analyses),
    [analyses]
  );

  const criticalCount = useMemo(
    () =>
      analysisValues.filter(
        (a) => a.riskLevel === "KRITIS"
      ).length,
    [analysisValues]
  );

  const avgScore = useMemo(() => {
    if (!analysisValues.length) return 0;

    return Math.round(
      analysisValues.reduce(
        (sum, item) => sum + item.riskScore,
        0
      ) / analysisValues.length
    );
  }, [analysisValues]);

  const pendingTasks = useMemo(
    () =>
      allTasks.filter(
        (t) => t.status === "pending"
      ).length,
    [allTasks]
  );

  const currentCoast = useMemo(
    () => COASTAL_REGISTRY[currentCoastIndex],
    [currentCoastIndex]
  );

  const inferenceLoad = useMemo(
    () =>
      Math.min(
        Math.round(
          (analysisValues.length /
            COASTAL_REGISTRY.length) *
          100
        ),
        100
      ),
    [analysisValues.length]
  );

  // FIX UTAMA:
  // useMemo TIDAK BOLEH setelah conditional return
  const healthScore = useMemo(() => {
    let score = 100;

    if (agentError) score -= 35;
    if (!isRunning) score -= 15;

    score -= Math.min(pendingTasks, 10);

    return Math.max(score, 0);
  }, [
    agentError,
    isRunning,
    pendingTasks,
  ]);

  const lastStep = useMemo(
    () =>
      currentWorkflow.length > 0
        ? currentWorkflow[
        currentWorkflow.length - 1
        ]
        : null,
    [currentWorkflow]
  );

  // =============================
  // NON-HOOK LOGIC SETELAHNYA
  // =============================
  const statusTone =
    agentStatus === "running"
      ? {
        badge:
          "bg-lime-400/10 text-lime-300 border-lime-400/20",
        dot: "bg-lime-400",
        label: "AGENT ACTIVE",
      }
      : agentStatus === "error"
        ? {
          badge:
            "bg-red-400/10 text-red-300 border-red-400/20",
          dot: "bg-red-400",
          label: "SYSTEM ERROR",
        }
        : agentStatus === "paused"
          ? {
            badge:
              "bg-yellow-400/10 text-yellow-300 border-yellow-400/20",
            dot: "bg-yellow-400",
            label: "PAUSED",
          }
          : {
            badge:
              "bg-white/5 text-slate-400 border-white/10",
            dot: "bg-slate-500",
            label: "IDLE",
          };

  return (
    <div className="min-h-screen px-6 lg:px-10 py-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />

          <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-cyan-400/10 border border-cyan-400/20">
                  <Server className="w-7 h-7 text-cyan-400" />
                </div>

                <div>
                  <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">
                    System Status & Health
                  </h1>

                  <p className="text-slate-400 mt-1">
                    Infrastruktur AI coastal
                    surveillance · live telemetry &
                    operational diagnostics
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black tracking-[0.25em] ${statusTone.badge}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${statusTone.dot} ${isRunning
                        ? "animate-pulse"
                        : ""
                      }`}
                  />
                  {statusTone.label}
                </div>

                <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-slate-300">
                  {analysisValues.length}/
                  {COASTAL_REGISTRY.length} coastal
                  nodes mapped
                </div>
              </div>
            </div>

            {/* HEALTH CIRCLE */}
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40">
                <svg className="w-40 h-40 -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="12"
                    fill="none"
                  />

                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="427"
                    strokeDashoffset={
                      427 -
                      (427 * healthScore) / 100
                    }
                    className="text-cyan-400"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">
                    {healthScore}%
                  </span>

                  <span className="text-[10px] tracking-[0.35em] text-slate-500 font-bold uppercase">
                    Health
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {agentError && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-300 mt-0.5" />

            <div>
              <p className="font-black text-red-300 uppercase text-xs tracking-[0.3em] mb-1">
                Agent Error Detected
              </p>

              <p className="text-sm text-red-200/90 font-mono">
                {agentError}
              </p>
            </div>
          </div>
        )}

        {/* TOP METRICS */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Cycle Count",
              value: cycleCount,
              sub: "runtime loops",
              icon: Activity,
              color: "text-cyan-400",
            },
            {
              label: "Avg Risk",
              value: avgScore || "—",
              sub: "/100 score",
              icon: ShieldCheck,
              color: "text-orange-400",
            },
            {
              label: "Critical",
              value: criticalCount,
              sub: "high alert",
              icon: AlertTriangle,
              color: "text-red-400",
            },
            {
              label: "Pending Tasks",
              value: pendingTasks,
              sub: "field ops",
              icon: Cpu,
              color: "text-lime-400",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl p-5 border border-white/10 bg-white/[0.03] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <card.icon
                  className={`w-5 h-5 ${card.color}`}
                />

                <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold">
                  {card.label}
                </span>
              </div>

              <div
                className={`text-3xl font-black ${card.color}`}
              >
                {card.value}
              </div>

              <p className="text-xs text-slate-500 mt-1">
                {card.sub}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}