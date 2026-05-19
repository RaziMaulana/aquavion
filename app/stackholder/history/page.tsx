"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  CalendarDays,
  MapPin,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Eye,
  FileText,
  Waves,
  ShieldCheck,
  ChevronRight,
  X,
  TimerReset,
  ClipboardCheck,
  Archive,
  Download,
} from "lucide-react";

type JobStatus = "Completed" | "Verified" | "Delayed";

type Priority = "High" | "Medium" | "Low";

type JobHistory = {
  id: number;
  title: string;
  sector: string;
  location: string;
  completedDate: string;
  duration: string;
  durationDays: number;
  team: string;
  impact: string;
  status: JobStatus;
  priority: Priority;
  summary: string;
};

const historyData: JobHistory[] = [
  {
    id: 1,
    title: "Audit Kerusakan Tanggul Pantai Utara",
    sector: "Sector Jakarta-North-A1",
    location: "Jakarta Utara",
    completedDate: "12 Mei 2026",
    duration: "4 Hari",
    durationDays: 4,
    team: "12 Personel",
    impact: "Retakan utama berhasil dipetakan & mitigasi awal selesai",
    status: "Verified",
    priority: "High",
    summary:
      "Inspeksi struktur tanggul terhadap abrasi ekstrem dan gelombang pasang tinggi.",
  },
  {
    id: 2,
    title: "Rehabilitasi Mangrove Area Z3",
    sector: "Sector Bekasi-Coast-Z3",
    location: "Bekasi Pesisir",
    completedDate: "03 Mei 2026",
    duration: "12 Hari",
    durationDays: 12,
    team: "24 Personel",
    impact: "2.400 bibit tertanam, proteksi alami meningkat",
    status: "Completed",
    priority: "Medium",
    summary:
      "Program restorasi garis pantai dengan penanaman mangrove dan monitoring pertumbuhan.",
  },
  {
    id: 3,
    title: "Drone Mapping Sektor Marunda",
    sector: "Sector Marunda-D7",
    location: "Marunda",
    completedDate: "28 April 2026",
    duration: "2 Hari",
    durationDays: 2,
    team: "2 Drone Unit",
    impact: "98% area berhasil dipetakan",
    status: "Completed",
    priority: "Low",
    summary:
      "Pemetaan topografi pesisir menggunakan LiDAR dan dokumentasi visual udara.",
  },
  {
    id: 4,
    title: "Perbaikan Darurat Penahan Ombak",
    sector: "Sector Tanjung Pasir-C2",
    location: "Tangerang Pesisir",
    completedDate: "20 April 2026",
    duration: "7 Hari",
    durationDays: 7,
    team: "18 Personel",
    impact: "Penahanan abrasi sementara stabil",
    status: "Delayed",
    priority: "High",
    summary:
      "Intervensi cepat pada struktur penahan ombak akibat kerusakan pasca badai.",
  },
];

function getStatusStyle(status: JobStatus) {
  switch (status) {
    case "Verified":
      return "bg-lime-400/10 text-lime-400 border-lime-400/20";
    case "Completed":
      return "bg-cyan-400/10 text-cyan-400 border-cyan-400/20";
    case "Delayed":
      return "bg-orange-400/10 text-orange-300 border-orange-400/20";
    default:
      return "bg-slate-700/20 text-slate-300 border-white/10";
  }
}

function getPriorityStyle(priority: Priority) {
  switch (priority) {
    case "High":
      return "text-red-400";
    case "Medium":
      return "text-orange-300";
    case "Low":
      return "text-cyan-300";
    default:
      return "text-slate-300";
  }
}

export default function StakeholderHistoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Finished" | "Completed" | "Verified" | "Delayed">("All");
  const [selectedJob, setSelectedJob] = useState<JobHistory | null>(null);

  // BODY LOCK WHEN MODAL OPEN
  useEffect(() => {
    if (selectedJob) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedJob]);

  // ESCAPE KEY TO CLOSE MODAL
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedJob(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // DOWNLOAD REPORT FUNCTION
  const handleDownloadReport = (job: JobHistory) => {
    const reportMeta = `
==================================================
        COASTALGUARD ID - OPERATIONAL REPORT      
==================================================
ID JOB         : CG-${job.id}2026
JUDUL AKSI     : ${job.title}
SEKTOR WILAYAH : ${job.sector}
LOKASI UTAMA   : ${job.location}
STATUS AUDIT   : ${job.status}
PRIORITAS      : ${job.priority}
TANGGAL RILIS  : ${job.completedDate}
DURASI KERJA   : ${job.duration}
STRUKTUR TIM   : ${job.team}

RINGKASAN OPERASIONAL:
${job.summary}

DAMPAK STRUKTURAL:
${job.impact}
==================================================
Sistem Validasi Terenkripsi - Generated Berbasis AI Agent
    `;

    const blob = new Blob([reportMeta.trim()], { type: "text/plain;charset=utf-8" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = `Report_Operational_CG-${job.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();

    return historyData.filter((job) => {
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.sector.toLowerCase().includes(q);

      let matchFilter = true;
      if (filter === "Finished") {
        matchFilter = job.status === "Completed" || job.status === "Verified";
      } else if (filter !== "All") {
        matchFilter = job.status === filter;
      }

      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const stats = useMemo(() => {
    const verified = historyData.filter((j) => j.status === "Verified").length;
    const completed = historyData.filter((j) => j.status === "Completed").length;
    const delayed = historyData.filter((j) => j.status === "Delayed").length;

    const success =
      Math.round(
        (historyData.filter((j) => j.status !== "Delayed").length /
          historyData.length) *
        100
      ) || 0;

    const avgDuration = Math.round(
      historyData.reduce((sum, job) => sum + job.durationDays, 0) /
      historyData.length
    );

    return {
      total: historyData.length,
      finished: verified + completed,
      verified,
      delayed,
      avgDuration,
      success,
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#031427] text-[#d3e4fe] bg-[radial-gradient(circle_at_top_right,rgba(0,162,230,0.12),transparent_30%)]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.25em] mb-3">
            <Archive className="w-3 h-3" />
            Operational Archive
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            History Pekerjaan Lapangan
          </h1>

          <p className="text-slate-400 mt-2 max-w-3xl text-sm md:text-base">
            Arsip nasional stakeholder, evaluasi lapangan, dan rekam jejak
            mitigasi abrasi pesisir berbasis data operasional.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* SUMMARY STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
          <SummaryCard
            label="Total Job"
            value={stats.total}
            color="text-slate-300"
            icon={ClipboardCheck}
          />
          <SummaryCard
            label="Selesai (Total)"
            value={stats.finished}
            color="text-cyan-400"
            icon={CheckCircle2}
          />
          <SummaryCard
            label="Delayed"
            value={stats.delayed}
            color="text-orange-300"
            icon={AlertTriangle}
          />
          <SummaryCard
            label="Avg Duration"
            value={`${stats.avgDuration}D`}
            color="text-sky-300"
            icon={TimerReset}
          />
          <SummaryCard
            label="Success Rate"
            value={`${stats.success}%`}
            color="text-lime-400"
            icon={ShieldCheck}
          />
        </section>

        {/* NEW SEARCH & FILTER BAR CONTROLLER */}
        <section className="bg-slate-900/40 border border-white/10 backdrop-blur-xl rounded-2xl p-4 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-lg">
          {/* SEARCH INPUT */}
          <div className="relative w-full lg:max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan judul, lokasi, atau sektor..."
              className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 outline-none focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/10 text-sm transition text-white placeholder-slate-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* FILTER TABS */}
          <div className="w-full lg:w-auto overflow-x-auto no-scrollbar flex bg-slate-950/60 rounded-xl p-1 border border-white/5">
            <div className="flex gap-1 min-w-max">
              {(["All", "Finished", "Completed", "Verified", "Delayed"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${filter === item
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {item === "All" && "Semua Data"}
                  {item === "Finished" && "Selesai (All)"}
                  {item === "Completed" && "Completed"}
                  {item === "Verified" && "Verified"}
                  {item === "Delayed" && "Delayed"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* HISTORY LIST */}
        <section className="space-y-6">
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-cyan-500/30 transition shadow-2xl"
            >
              <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">

                {/* LEFT DETAILS */}
                <div className="flex gap-4 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/5 shrink-0">
                    <Waves className="w-8 h-8 text-cyan-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h2 className="text-2xl font-bold text-white">{job.title}</h2>

                      <span
                        className={`px-3 py-1 rounded-full border text-[10px] uppercase font-black tracking-[0.2em] ${getStatusStyle(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>

                      <span
                        className={`text-xs font-bold uppercase ${getPriorityStyle(
                          job.priority
                        )}`}
                      >
                        {job.priority} Priority
                      </span>
                    </div>

                    <p className="text-slate-400 leading-relaxed mb-4">
                      {job.summary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
                      <InfoItem icon={MapPin} value={job.location} />
                      <InfoItem icon={CalendarDays} value={job.completedDate} />
                      <InfoItem icon={Clock3} value={job.duration} />
                      <InfoItem icon={ShieldCheck} value={job.team} />
                    </div>
                  </div>
                </div>

                {/* RIGHT ACTION PANEL */}
                <div className="xl:w-80 space-y-4">
                  <div className="bg-slate-950/40 rounded-2xl border border-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">
                      Dampak Operasional
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {job.impact}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {/* BUTTON DETAIL */}
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="flex-1 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-sm hover:brightness-110 transition flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Detail
                    </button>

                    {/* BUTTON REPORT DOWNLOAD */}
                    <button
                      onClick={() => handleDownloadReport(job)}
                      className="flex-1 py-3 rounded-2xl border border-white/10 text-slate-300 hover:bg-white/5 font-bold text-sm flex items-center justify-center gap-2 transition"
                    >
                      <FileText className="w-4 h-4" />
                      Report
                    </button>
                  </div>
                </div>

              </div>
            </article>
          ))}
        </section>

        {/* EMPTY HANDLING */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-24 bg-slate-900/20 border border-dashed border-white/10 rounded-3xl">
            <AlertTriangle className="w-12 h-12 mx-auto text-orange-300 mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-white">Tidak ada data ditemukan</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Gagal menemukan kata kunci &ldquo;<span className="text-cyan-400 font-semibold">{search}</span>&rdquo; pada status filter yang aktif. Coba gunakan kata kunci lain.
            </p>
          </div>
        )}
      </main>

      {/* DYNAMIC DETAIL MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
          <div className="max-w-3xl w-full bg-slate-950 border border-white/10 rounded-3xl p-8 relative shadow-2xl">

            <div className="flex justify-between items-start gap-4 mb-6">
              <div>
                <span className={`inline-block px-3 py-1 text-[10px] uppercase font-black rounded mb-2 border ${getStatusStyle(selectedJob.status)}`}>
                  {selectedJob.status}
                </span>
                <h2 className="text-3xl font-black text-white">{selectedJob.title}</h2>
                <p className="text-cyan-400 font-mono text-xs mt-1">{selectedJob.sector}</p>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <hr className="border-white/10 mb-6" />

            <div className="space-y-6">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Deskripsi Operasional</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedJob.summary}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ModalCard label="Lokasi Utama" value={selectedJob.location} />
                <ModalCard label="Tanggal Penutupan" value={selectedJob.completedDate} />
                <ModalCard label="Durasi Kerja" value={selectedJob.duration} />
                <ModalCard label="Kekuatan Tim" value={selectedJob.team} />
              </div>

              <div className="bg-slate-900/90 rounded-2xl p-5 border border-white/5">
                <h4 className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-2">Operational Impact Evaluated</h4>
                <p className="text-slate-200 text-sm leading-relaxed">{selectedJob.impact}</p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => handleDownloadReport(selectedJob)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                Unduh Rekam Berkas (.txt)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <div className="font-bold text-white mb-1">AquaVion</div>
            <p className="text-sm text-slate-500">
              Arsip histori pekerjaan stakeholder &amp; evaluasi operasional.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-500">
            <button className="hover:text-cyan-300 transition">Export Archive</button>
            <button className="hover:text-cyan-300 transition">Audit Logs</button>
            <button className="hover:text-cyan-300 transition flex items-center gap-2">
              Performance Review
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* SUB-COMPONENTS */
function SummaryCard({
  label,
  value,
  color,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  color: string;
  icon: LucideIcon;
}) {
  return (
    <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-slate-400 text-sm">{label}</div>
        <Icon className="w-5 h-5 text-slate-500" />
      </div>
      <div className={`text-4xl font-black ${color}`}>{value}</div>
    </div>
  );
}

function InfoItem({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <div className="flex items-center gap-2 text-slate-400">
      <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
      <span>{value}</span>
    </div>
  );
}

function ModalCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-white/5 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">
        {label}
      </p>
      <p className="text-slate-200 font-semibold text-sm">{value}</p>
    </div>
  );
}