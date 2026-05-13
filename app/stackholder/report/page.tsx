"use client";

/*
FULL UPGRADE — Stakeholder Report Page
PERBAIKAN:
1. Added search + sector filter
2. Added dynamic KPI summary
3. Added modal detail preview
4. Better enterprise layout
5. Chart cards improved
6. Download / Share structure ready
7. Cleaner component architecture
*/

import { useMemo, useState } from "react";
import {
  Download,
  Share2,
  Bot,
  BarChart3,
  LineChart,
  Search,
  Eye,
  X,
  Filter,
  ShieldAlert,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

type RiskLevel = "Critical Risk" | "Moderate" | "Stable";

type ReportCard = {
  title: string;
  sector: string;
  risk: number;
  status: RiskLevel;
  image: string;
  insight: string;
};

const reports: ReportCard[] = [
  {
    title: "Pantai Parangtritis",
    sector: "Sector Yogyakarta-01",
    risk: 88,
    status: "Critical Risk",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    insight:
      "Laju abrasi meningkat 12% dalam 30 hari terakhir dan struktur alami mengalami degradasi signifikan.",
  },
  {
    title: "Teluk Jakarta",
    sector: "Sector North-Capital",
    risk: 42,
    status: "Moderate",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    insight:
      "Penurunan tanah meningkatkan risiko banjir rob permanen dan membutuhkan penguatan tanggul.",
  },
  {
    title: "Pesisir Bali Barat",
    sector: "Sector Bali-West-04",
    risk: 15,
    status: "Stable",
    image:
      "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a",
    insight:
      "Mangrove masih efektif sebagai peredam energi gelombang dan belum membutuhkan intervensi darurat.",
  },
];

const nationalTrendData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
  datasets: [
    {
      label: "Abrasi Nasional (Ha)",
      data: [8200, 9100, 9700, 10800, 11700, 12450],
      borderColor: "#22d3ee",
      backgroundColor: "rgba(34,211,238,0.15)",
      fill: true,
      tension: 0.4,
    },
  ],
};

const islandComparisonData = {
  labels: ["Jawa", "Sumatera", "Kalimantan", "Sulawesi", "Bali"],
  datasets: [
    {
      label: "Laju Abrasi (%)",
      data: [2.4, 1.8, 1.2, 1.5, 0.9],
      backgroundColor: [
        "#ef4444",
        "#fb923c",
        "#22c55e",
        "#38bdf8",
        "#a3e635",
      ],
      borderRadius: 8,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#d3e4fe",
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "#8ca0b8" },
      grid: { color: "rgba(255,255,255,0.05)" },
    },
    y: {
      ticks: { color: "#8ca0b8" },
      grid: { color: "rgba(255,255,255,0.05)" },
    },
  },
};

function getStatusStyle(status: RiskLevel) {
  switch (status) {
    case "Critical Risk":
      return "bg-red-500 text-white";
    case "Moderate":
      return "bg-orange-400 text-black";
    default:
      return "bg-lime-400 text-black";
  }
}

function getRiskBorder(risk: number) {
  if (risk >= 70) return "border-red-500 text-red-400";
  if (risk >= 30) return "border-orange-400 text-orange-300";
  return "border-lime-400 text-lime-400";
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <p className="text-sm text-slate-400 mb-2">{label}</p>
      <h3 className={`text-4xl font-black ${color}`}>{value}</h3>
    </div>
  );
}

function ReportCardComponent({
  report,
  onView,
}: {
  report: ReportCard;
  onView: () => void;
}) {
  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col shadow-2xl hover:border-cyan-500/20 transition">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">{report.title}</h3>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 mt-1">
            {report.sector}
          </p>
        </div>

        <div
          className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-bold text-sm ${getRiskBorder(
            report.risk
          )}`}
        >
          {report.risk}%
        </div>
      </div>

      <div className="relative h-48 rounded-2xl overflow-hidden mb-6 border border-white/10">
        <img
          src={report.image}
          alt={report.title}
          className="w-full h-full object-cover"
        />

        <div
          className={`absolute top-3 right-3 text-[10px] font-bold px-3 py-1 rounded-full uppercase ${getStatusStyle(
            report.status
          )}`}
        >
          {report.status}
        </div>
      </div>

      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex-1 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-4 h-4 text-lime-400" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-lime-400 font-bold">
            AI Insight
          </span>
        </div>

        <p className="text-sm text-slate-300 italic leading-relaxed">
          "{report.insight}"
        </p>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 rounded-xl text-xs uppercase flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          PDF
        </button>

        <button
          onClick={onView}
          className="w-12 border border-white/10 rounded-xl hover:bg-white/5 flex items-center justify-center"
        >
          <Eye className="w-4 h-4 text-slate-300" />
        </button>

        <button className="w-12 border border-white/10 rounded-xl hover:bg-white/5 flex items-center justify-center">
          <Share2 className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </div>
  );
}

export default function CoastalReportPage() {
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);

  const filteredReports = useMemo(() => {
    return reports.filter(
      (report) =>
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.sector.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const stats = useMemo(() => {
    const critical = reports.filter((r) => r.status === "Critical Risk").length;
    const avgRisk = Math.round(
      reports.reduce((sum, r) => sum + r.risk, 0) / reports.length
    );

    return {
      total: reports.length,
      critical,
      avgRisk,
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#031427] text-[#d3e4fe] px-6 lg:px-10 py-10 bg-[radial-gradient(circle_at_top_right,rgba(0,162,230,0.12),transparent_30%)]">
      {/* HERO */}
      <section className="max-w-[1600px] mx-auto mb-10">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs uppercase tracking-widest font-bold mb-5">
              <ShieldAlert className="w-4 h-4" />
              National Abrasion Intelligence
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4">
              Coastal Risk Report Center
            </h1>

            <p className="text-slate-400 max-w-3xl">
              Ringkasan analitik abrasi nasional berbasis AI untuk keputusan
              strategis stakeholder dan mitigasi prioritas tinggi.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari sektor / wilayah..."
              className="w-full lg:w-80 pl-11 pr-4 py-4 rounded-2xl bg-slate-900/70 border border-white/10 outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard label="Total Reports" value={stats.total} color="text-cyan-400" />
        <SummaryCard label="Critical Zones" value={stats.critical} color="text-red-400" />
        <SummaryCard label="Avg National Risk" value={`${stats.avgRisk}%`} color="text-orange-300" />
      </section>

      {/* REPORT GRID */}
      <section className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <ReportCardComponent
            key={report.title}
            report={report}
            onView={() => setSelectedReport(report)}
          />
        ))}

        {/* CHART SECTION */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl xl:col-span-3">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="text-cyan-400" />
            <h3 className="text-2xl font-bold">National Trend Analytics</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h4 className="text-sm font-bold text-cyan-300 mb-4 uppercase">
                Total Area Terdampak
              </h4>

              <div className="h-80">
                <Line data={nationalTrendData} options={chartOptions} />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-cyan-300 mb-4 uppercase">
                Perbandingan Antar Pulau
              </h4>

              <div className="h-80">
                <Bar data={islandComparisonData} options={chartOptions} />
              </div>
            </div>
          </div>

          <button className="w-full mt-8 border border-cyan-400/40 hover:bg-cyan-400/10 text-cyan-300 py-4 rounded-2xl text-xs uppercase font-bold flex items-center justify-center gap-2">
            <LineChart className="w-4 h-4" />
            Buka Laporan Tahunan Lengkap
          </button>
        </div>
      </section>

      {/* MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-slate-950 border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-black">{selectedReport.title}</h2>
                <p className="text-slate-400 mt-2">{selectedReport.sector}</p>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-xl hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={selectedReport.image}
              alt={selectedReport.title}
              className="w-full h-72 object-cover rounded-2xl mb-6 border border-white/10"
            />

            <div className="bg-slate-900 rounded-2xl p-5 border border-white/5">
              <p className="text-sm text-slate-400 mb-2">AI Strategic Insight</p>
              <p className="text-slate-200 leading-relaxed">
                {selectedReport.insight}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}