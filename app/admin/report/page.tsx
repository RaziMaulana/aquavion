"use client";

import { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

import {
  useAgentStore,
  riskBgClass,
} from "@/lib/agentStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminReportPage() {
  const {
    initializeAgent,
    analyses,
    allTasks,
    cycleCount,
    latestInsight,
    agentStatus,
  } = useAgentStore();

  useEffect(() => {
    initializeAgent();
  }, [initializeAgent]);

  const [tab, setTab] = useState<"Monthly" | "Yearly">("Monthly");
  const [search, setSearch] = useState("");

  // SORTING BERDASARKAN TIMESTAMP
  const analysisValues = useMemo(() => {
    const sorted = Object.values(analyses).sort(
      (a, b) => b.timestamp - a.timestamp
    );

    // Monthly = 30 data terbaru
    if (tab === "Monthly") {
      return sorted.slice(0, 30);
    }

    // Yearly = semua data
    return sorted;
  }, [analyses, tab]);

  // SEARCH FILTER
  const filtered = useMemo(() => {
    return analysisValues.filter(
      (a) =>
        a.coastName.toLowerCase().includes(search.toLowerCase()) ||
        a.riskLevel.toLowerCase().includes(search.toLowerCase())
    );
  }, [analysisValues, search]);

  // TOP RISK
  const topRisk = [...analysisValues]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 8);

  const chartLabels = topRisk.map((a) =>
    a.coastName.replace("Pantai ", "")
  );

  const chartScores = topRisk.map((a) => a.riskScore);

  // DISTRIBUTION
  const riskDistribution = {
    KRITIS: analysisValues.filter((a) => a.riskLevel === "KRITIS").length,
    TINGGI: analysisValues.filter((a) => a.riskLevel === "TINGGI").length,
    SEDANG: analysisValues.filter((a) => a.riskLevel === "SEDANG").length,
    RENDAH: analysisValues.filter((a) => a.riskLevel === "RENDAH").length,
  };

  // SUMMARY
  const avgScore = analysisValues.length
    ? Math.round(
      analysisValues.reduce((sum, a) => sum + a.riskScore, 0) /
      analysisValues.length
    )
    : 0;

  const doneTasks = allTasks.filter(
    (t) => t.status === "done"
  ).length;

  const pendingTasks = allTasks.filter(
    (t) => t.status === "pending"
  ).length;

  // CSV EXPORT
  const [exportStatus, setExportStatus] = useState<"idle" | "success" | "empty">("idle");

  const escapeCsvField = (value: string | number): string => {
    const str = String(value);
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const exportCSV = () => {
    if (!analysisValues.length) {
      setExportStatus("empty");
      setTimeout(() => setExportStatus("idle"), 2000);
      return;
    }

    const headers = [
      "Pantai",
      "Skor Risiko",
      "Level Risiko",
      "Tinggi Gelombang (m)",
      "Kecepatan Arus (m/s)",
      "Perubahan Garis Pantai (m/yr)",
      "Prediksi 5 Tahun",
      "Waktu Analisis",
    ];

    const rows = analysisValues.map((a) => [
      escapeCsvField(a.coastName),
      a.riskScore,
      a.riskLevel,
      a.waveH,
      a.currentS,
      a.shorelineChange,
      escapeCsvField(a.prediction5yr),
      escapeCsvField(new Date(a.timestamp).toLocaleString("id-ID")),
    ]);

    const BOM = "\uFEFF";
    const csv =
      BOM +
      [headers.map(escapeCsvField), ...rows]
        .map((r) => r.join(","))
        .join("\r\n");

    try {
      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `coastal-report-${tab.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportStatus("success");
      setTimeout(() => setExportStatus("idle"), 2000);
    } catch (err) {
      console.error("Export CSV gagal:", err);
    }
  };

  // BAR CHART
  const chartData = {
    labels: chartLabels.length ? chartLabels : ["—"],
    datasets: [
      {
        label: "Risk Score",
        data: chartScores.length ? chartScores : [0],
        backgroundColor: chartScores.map((score) =>
          score >= 75
            ? "rgba(239,68,68,0.7)"
            : score >= 55
              ? "rgba(249,115,22,0.7)"
              : score >= 35
                ? "rgba(34,211,238,0.7)"
                : "rgba(74,222,128,0.7)"
        ),
        borderRadius: 10,
      },
    ],
  };

  // DOUGHNUT
  const doughnutData = {
    labels: ["KRITIS", "TINGGI", "SEDANG", "RENDAH"],
    datasets: [
      {
        data: [
          riskDistribution.KRITIS,
          riskDistribution.TINGGI,
          riskDistribution.SEDANG,
          riskDistribution.RENDAH,
        ],
        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#22d3ee",
          "#84cc16",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
          font: { weight: "bold" },
        },
        grid: { display: false },
      },
      y: {
        min: 0,
        max: 100,
        ticks: { color: "#94a3b8" },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };

  return (
    <div className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full pt-10 font-sans text-slate-200">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-2 text-white tracking-tight">
            Abrasion Analysis & Reporting
          </h1>

          <p className="text-slate-400 text-sm">
            Live AI Agent ·{" "}
            <span className="text-cyan-400 font-bold">
              {analysisValues.length}
            </span>{" "}
            data ·{" "}
            <span className="text-lime-400 font-bold">
              {cycleCount}
            </span>{" "}
            siklus ·{" "}
            <span
              className={`font-bold ${agentStatus === "running"
                ? "text-lime-400"
                : "text-slate-500"
                }`}
            >
              {agentStatus}
            </span>
          </p>
        </div>

        {/* EXPORT BUTTON */}
        <div className="self-start flex flex-col items-end gap-1">
          <button
            onClick={exportCSV}
            disabled={exportStatus !== "idle"}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200
              ${exportStatus === "success"
                ? "bg-lime-400 text-slate-950 cursor-default"
                : exportStatus === "empty"
                  ? "bg-slate-600 text-slate-300 cursor-default"
                  : "bg-cyan-400 hover:bg-cyan-300 text-slate-950 active:scale-95"
              }`}
          >
            {exportStatus === "success" ? (
              <>✓ Berhasil Diunduh</>
            ) : exportStatus === "empty" ? (
              <>⚠ Tidak Ada Data</>
            ) : (
              <>⬇ Export CSV</>
            )}
          </button>
          {exportStatus === "idle" && analysisValues.length > 0 && (
            <span className="text-[10px] text-slate-500">
              {analysisValues.length} baris · {tab}
            </span>
          )}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Avg Risk", value: avgScore || "—", color: "text-orange-400" },
          { label: "Kritis", value: riskDistribution.KRITIS, color: "text-red-400" },
          { label: "Total Tasks", value: allTasks.length, color: "text-cyan-400" },
          { label: "Done", value: doneTasks, color: "text-lime-400" },
          { label: "Pending", value: pendingTasks, color: "text-yellow-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center border border-white/5 bg-slate-900/60"
          >
            <div className={`text-2xl font-black ${s.color}`}>
              {s.value}
            </div>

            <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 rounded-3xl p-6 border border-white/10 bg-slate-900/50">
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="font-bold text-white text-lg">
                Highest Coastal Risk
              </h3>

              <p className="text-xs text-slate-500">
                Top risiko abrasi
              </p>
            </div>

            <div className="flex rounded-lg overflow-hidden border border-white/10">
              {(["Monthly", "Yearly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 text-xs font-black ${tab === t
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-400"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72">
            <Bar data={chartData} options={options} />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="rounded-3xl p-6 border border-white/10 bg-slate-900/50">
            <h3 className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-4">
              Risk Distribution
            </h3>

            <div className="h-56">
              <Doughnut data={doughnutData} />
            </div>
          </div>

          <div className="rounded-3xl p-6 border border-cyan-400/20 bg-cyan-400/10">
            <p className="text-[10px] uppercase font-black tracking-widest text-cyan-400 mb-2">
              Latest AI Insight
            </p>

            <p className="text-sm text-cyan-100 leading-relaxed">
              {latestInsight || "Belum ada insight terbaru."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}