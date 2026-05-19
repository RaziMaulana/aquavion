"use client";

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
  ShieldAlert,
  Calendar,
  FileText,
  AlertTriangle,
  MapPin,
  SlidersHorizontal,
  Layers,
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
import { jsPDF } from "jspdf";

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
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    insight: "Laju abrasi meningkat 12% dalam 30 hari terakhir dan struktur alami mengalami degradasi signifikan.",
  },
  {
    title: "Teluk Jakarta",
    sector: "Sector North-Capital",
    risk: 42,
    status: "Moderate",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    insight: "Penurunan tanah meningkatkan risiko banjir rob permanen dan membutuhkan penguatan tanggul.",
  },
  {
    title: "Pesisir Bali Barat",
    sector: "Sector Bali-West-04",
    risk: 15,
    status: "Stable",
    image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a",
    insight: "Mangrove masih efektif sebagai peredam energi gelombang dan belum membutuhkan intervensi darurat.",
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
      backgroundColor: ["#ef4444", "#fb923c", "#22c55e", "#38bdf8", "#a3e635"],
      borderRadius: 8,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#d3e4fe" } },
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
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    case "Moderate":
      return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
    default:
      return "bg-lime-500/10 text-lime-400 border border-lime-500/20";
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
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <p className="text-sm text-slate-400 mb-2">{label}</p>
      <h3 className={`text-4xl font-black ${color}`}>{value}</h3>
    </div>
  );
}

function ReportCardComponent({
  report,
  onView,
  onDownload,
}: {
  report: ReportCard;
  onView: () => void;
  onDownload: () => void;
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

        <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-bold text-sm ${getRiskBorder(report.risk)}`}>
          {report.risk}%
        </div>
      </div>

      <div className="relative h-48 rounded-2xl overflow-hidden mb-6 border border-white/10">
        <img src={report.image} alt={report.title} className="w-full h-full object-cover" />
        <div className={`absolute top-3 right-3 text-[10px] font-bold px-3 py-1 rounded-full uppercase ${getStatusStyle(report.status)} bg-slate-950/80 backdrop-blur-md`}>
          {report.status}
        </div>
      </div>

      <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex-1 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-4 h-4 text-lime-400" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-lime-400 font-bold">AI Insight</span>
        </div>
        <p className="text-sm text-slate-300 italic leading-relaxed">"{report.insight}"</p>
      </div>

      <div className="flex gap-3">
        <button onClick={onDownload} className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 rounded-xl text-xs uppercase flex items-center justify-center gap-2 transition">
          <Download className="w-4 h-4" /> PDF
        </button>
        <button onClick={onView} className="w-12 border border-white/10 rounded-xl hover:bg-white/5 flex items-center justify-center transition">
          <Eye className="w-4 h-4 text-slate-300" />
        </button>
        <button className="w-12 border border-white/10 rounded-xl hover:bg-white/5 flex items-center justify-center transition">
          <Share2 className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </div>
  );
}

export default function CoastalReportPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Critical Risk" | "Moderate" | "Stable">("All");
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);
  const [isAnnualModalOpen, setIsAnnualModalOpen] = useState(false);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.sector.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || report.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const stats = useMemo(() => {
    const critical = reports.filter((r) => r.status === "Critical Risk").length;
    const avgRisk = Math.round(reports.reduce((sum, r) => sum + r.risk, 0) / reports.length);
    return { total: reports.length, critical, avgRisk };
  }, []);

  const handleDownloadPDF = (report: ReportCard) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFillColor(3, 20, 39);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(34, 211, 238);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("NATIONAL ABRASION INTELLIGENCE REPORT", 14, 18);
    doc.setTextColor(211, 228, 254);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Generated automatically via Coastal Risk Report Center", 14, 26);

    const reportDate = new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
    doc.text(`Date: ${reportDate}`, 155, 26);
    doc.setTextColor(33, 37, 41);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(report.title, 14, 60);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`Sector ID: ${report.sector.toUpperCase()}`, 14, 68);

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 76, 182, 30, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    doc.text("Risk Level Assessment:", 20, 86);

    if (report.status === "Critical Risk") doc.setTextColor(239, 68, 68);
    else if (report.status === "Moderate") doc.setTextColor(251, 146, 60);
    else doc.setTextColor(34, 197, 94);
    doc.setFontSize(14);
    doc.text(`${report.status} (${report.risk}%)`, 20, 96);

    doc.setFillColor(240, 253, 250);
    doc.setDrawColor(45, 212, 191);
    doc.roundedRect(14, 115, 182, 45, 4, 4, "FD");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(13, 148, 136);
    doc.text("AI STRATEGIC INSIGHT", 22, 125);

    doc.setFont("helvetica", "italic");
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(11);
    const splitInsight = doc.splitTextToSize(report.insight, 166);
    doc.text(splitInsight, 22, 134);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 275, 196, 275);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Confidential — For Internal Stakeholder Decision Only.", 14, 282);
    doc.save(`Laporan_Risiko_${report.title.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#031427] text-[#d3e4fe] px-4 sm:px-6 lg:px-10 py-10 bg-[radial-gradient(circle_at_top_right,rgba(0,162,230,0.12),transparent_30%)]">

      {/* HERO SECTION */}
      <section className="max-w-[1600px] mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs uppercase tracking-widest font-bold mb-5">
          <ShieldAlert className="w-4 h-4" />
          National Abrasion Intelligence
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
          Coastal Risk Report Center
        </h1>
        <p className="text-slate-400 max-w-3xl">
          Ringkasan analitik abrasi nasional berbasis AI untuk keputusan strategis stakeholder dan mitigasi prioritas tinggi.
        </p>
      </section>

      {/* COMMAND CENTER CENTRALIZED SEARCH & FILTER SYSTEM */}
      <section className="max-w-[1600px] mx-auto mb-10">
        <div className="bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4 lg:p-6 shadow-2xl flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">

          {/* SEARCH INPUT FIELD */}
          <div className="relative flex-1 group">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kata kunci sektor atau nama wilayah pesisir..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-900/60 border border-white/10 outline-none focus:border-cyan-500/80 focus:bg-slate-900/90 text-sm placeholder-slate-500 text-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* DYNAMIC SEGMENTED METRIC FILTER CONTROLS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider px-1">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Risk Grid:</span>
            </div>

            <div className="flex flex-wrap p-1.5 bg-slate-900/80 rounded-2xl border border-white/5 gap-1">
              {(["All", "Critical Risk", "Moderate", "Stable"] as const).map((mode) => {
                const isActive = statusFilter === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setStatusFilter(mode)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wide ${isActive
                        ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/10"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                      }`}
                  >
                    {mode === "All" ? "Semua Sektor" : mode}
                  </button>
                );
              })}
            </div>

            {/* LIVE DATA COUNTER INDICATION */}
            <div className="hidden md:flex items-center gap-2 px-4 py-3 bg-cyan-400/5 border border-cyan-400/10 rounded-2xl text-xs font-mono text-cyan-400">
              <Layers className="w-4 h-4" />
              <span>Result: {filteredReports.length}</span>
            </div>
          </div>

        </div>
      </section>

      {/* SUMMARY CARDS */}
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
            onDownload={() => handleDownloadPDF(report)}
          />
        ))}

        {filteredReports.length === 0 && (
          <div className="col-span-1 md:col-span-2 xl:col-span-3 bg-slate-900/20 border border-dashed border-white/10 rounded-3xl p-16 text-center">
            <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-1">Data Sektor Tidak Ditemukan</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Sektor pencarian "<span className="text-cyan-400 font-semibold">{search}</span>" dengan filter <span className="text-cyan-400 font-semibold">{statusFilter}</span> tidak cocok dengan pangkalan data intelijen abrasi kami.
            </p>
          </div>
        )}

        {/* CHART SECTION */}
        <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl xl:col-span-3 mt-4">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="text-cyan-400" />
            <h3 className="text-2xl font-bold">National Trend Analytics</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h4 className="text-sm font-bold text-cyan-300 mb-4 uppercase">Total Area Terdampak</h4>
              <div className="h-80">
                <Line data={nationalTrendData} options={chartOptions} />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-cyan-300 mb-4 uppercase">Perbandingan Antar Pulau</h4>
              <div className="h-80">
                <Bar data={islandComparisonData} options={chartOptions} />
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAnnualModalOpen(true)}
            className="w-full mt-8 border border-cyan-400/40 hover:bg-cyan-400/10 text-cyan-300 py-4 rounded-2xl text-xs uppercase font-bold flex items-center justify-center gap-2 transition"
          >
            <LineChart className="w-4 h-4" />
            Buka Laporan Tahunan Lengkap
          </button>
        </div>
      </section>

      {/* MODAL DETAIL PER REPORT */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-slate-950 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-black">{selectedReport.title}</h2>
                <p className="text-slate-400 mt-2">{selectedReport.sector}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 rounded-xl hover:bg-white/5 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <img src={selectedReport.image} alt={selectedReport.title} className="w-full h-72 object-cover rounded-2xl mb-6 border border-white/10" />

            <div className="bg-slate-900 rounded-2xl p-5 border border-white/5 flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-slate-400 mb-2">AI Strategic Insight</p>
                <p className="text-slate-200 leading-relaxed">{selectedReport.insight}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleDownloadPDF(selectedReport)}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4" /> Unduh Dokumen Lengkap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LAPORAN TAHUNAN NASIONAL LENGKAP */}
      {isAnnualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-5xl w-full bg-[#051932] border border-cyan-500/30 rounded-3xl p-6 md:p-10 my-8 shadow-2xl relative">
            <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">
                  <Calendar className="w-4 h-4" /> Consolidated Annual Report 2026
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white">Laporan Strategis Abrasi Nasional</h2>
              </div>
              <button
                onClick={() => setIsAnnualModalOpen(false)}
                className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-cyan-300 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" /> Ringkasan Eksekutif AI
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Berdasarkan pemantauan satelit dan agregasi sensor data di sepanjang semester pertama tahun 2026,
                  laju degradasi wilayah pesisir Indonesia mengalami tren peningkatan sebesar <strong className="text-red-400">8.4% YoY</strong>.
                  Pulau Jawa memegang kontribusi risiko tertinggi akibat beban kombinasi dari abrasi gelombang laut tinggi
                  dan landasan tanah urban (land subsidence) yang masif di pesisir utara.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-950/50 p-4 border border-white/5 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Tren Kumulatif (Ha)</h4>
                  <div className="h-48">
                    <Line data={nationalTrendData} options={chartOptions} />
                  </div>
                </div>
                <div className="bg-slate-950/50 p-4 border border-white/5 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Persentase Risiko Regional</h4>
                  <div className="h-48">
                    <Bar data={islandComparisonData} options={chartOptions} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" /> Matriks Lokasi & Penanganan Prioritas
                </h3>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-slate-300 text-xs uppercase font-mono border-b border-white/10">
                        <th className="p-4">Wilayah / Sektor</th>
                        <th className="p-4">Indeks Risiko</th>
                        <th className="p-4">Status Proteksi</th>
                        <th className="p-4">Rekomendasi Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-300 divide-y divide-white/5 bg-slate-950/20">
                      {reports.map((r, i) => (
                        <tr key={i} className="hover:bg-white/5 transition">
                          <td className="p-4 font-bold text-white">
                            {r.title}
                            <span className="block text-xs font-normal text-slate-400">{r.sector}</span>
                          </td>
                          <td className="p-4 font-mono font-bold text-cyan-300">{r.risk}%</td>
                          <td className="p-4">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusStyle(r.status)}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-400 max-w-xs truncate md:max-w-none md:whitespace-normal">
                            {r.status === "Critical Risk" ? "Intervensi struktur keras/tanggul darurat" : r.status === "Moderate" ? "Restorasi vegetasi & pemeliharaan berkala" : "Monitoring pasif via satelit harian"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-200/70 leading-relaxed">
                  <strong>Pemberitahuan Keamanan:</strong> Laporan tahunan konsolidasi ini mengandung metrik pertahanan pesisir nasional strategis. Pendistribusian dokumen tanpa otorisasi tertulis dari <em>National Abrasion Intelligence</em> dilarang.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-white/10 pt-6 mt-6">
              <button onClick={() => window.print()} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-xs uppercase font-bold text-slate-300 transition">
                Cetak Halaman
              </button>
              <button
                onClick={() => alert("Menyiapkan berkas ZIP semua lampiran dokumen...")}
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" /> Ekspor Arsip Laporan (.ZIP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}