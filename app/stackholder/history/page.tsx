"use client";

/*
STAKEHOLDER HISTORY PAGE — ENTERPRISE REFINED VERSION
IMPROVEMENTS:
1. Better type safety for Lucide icons
2. Modal with richer operational details
3. Export / Audit / Report actions ready
4. Keyboard + body scroll lock modal
5. Cleaner performance metrics
6. Status counts auto-generated
7. Better responsive spacing
*/

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
  const [filter, setFilter] = useState<"All" | JobStatus>("All");
  const [selectedJob, setSelectedJob] = useState<JobHistory | null>(null);

  // BODY LOCK
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

  // ESC CLOSE
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedJob(null);
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();

    return historyData.filter((job) => {
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.sector.toLowerCase().includes(q);

      const matchFilter = filter === "All" ? true : job.status === filter;

      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const stats = useMemo(() => {
    const verified = historyData.filter((j) => j.status === "Verified").length;
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
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.25em] mb-3">
              <Archive className="w-3 h-3" />
              Operational Archive
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              History Pekerjaan Lapangan
            </h1>

            <p className="text-slate-400 mt-3 max-w-3xl">
              Arsip nasional stakeholder, evaluasi lapangan, dan rekam jejak
              mitigasi abrasi pesisir berbasis data operasional.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* SEARCH */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari history pekerjaan..."
                className="w-full sm:w-72 pl-11 pr-4 py-3 rounded-2xl bg-slate-900/70 border border-white/10 outline-none focus:border-cyan-500 text-sm"
              />
            </div>

            {/* FILTER */}
            <div className="flex flex-wrap bg-slate-900/70 rounded-2xl p-1 border border-white/10">
              {["All", "Completed", "Verified", "Delayed"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item as "All" | JobStatus)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition ${filter === item
                      ? "bg-cyan-500 text-slate-950"
                      : "text-slate-400 hover:text-white"
                    }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* SUMMARY */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
          <SummaryCard
            label="Total Job"
            value={stats.total}
            color="text-cyan-400"
            icon={ClipboardCheck}
          />
          <SummaryCard
            label="Verified"
            value={stats.verified}
            color="text-lime-400"
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
            color="text-cyan-300"
            icon={ShieldCheck}
          />
        </section>

        {/* HISTORY LIST */}
        <section className="space-y-6">
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-cyan-500/30 transition shadow-2xl"
            >
              <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                {/* LEFT */}
                <div className="flex gap-4 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/5 shrink-0">
                    <Waves className="w-8 h-8 text-cyan-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h2 className="text-2xl font-bold">{job.title}</h2>

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
                      <InfoItem
                        icon={CalendarDays}
                        value={job.completedDate}
                      />
                      <InfoItem icon={Clock3} value={job.duration} />
                      <InfoItem icon={ShieldCheck} value={job.team} />
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
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
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="flex-1 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-sm hover:brightness-110 transition flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Detail
                    </button>

                    <button className="flex-1 py-3 rounded-2xl border border-white/10 text-slate-300 hover:bg-white/5 font-bold text-sm flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" />
                      Report
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* EMPTY */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-24">
            <AlertTriangle className="w-12 h-12 mx-auto text-orange-300 mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              Tidak ada data ditemukan
            </h3>
            <p className="text-slate-400">
              Coba gunakan kata kunci lain atau ubah filter status.
            </p>
          </div>
        )}
      </main>

      {/* DETAIL MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-slate-950 border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-start gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-black">
                  {selectedJob.title}
                </h2>
                <p className="text-slate-400 mt-2">
                  {selectedJob.sector}
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 rounded-xl hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed mb-6">
              {selectedJob.summary}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <ModalCard label="Lokasi" value={selectedJob.location} />
              <ModalCard label="Tanggal" value={selectedJob.completedDate} />
              <ModalCard label="Durasi" value={selectedJob.duration} />
              <ModalCard label="Tim" value={selectedJob.team} />
            </div>

            <div className="bg-slate-900 rounded-2xl p-5 border border-white/5">
              <p className="text-sm text-slate-400 mb-2">
                Operational Impact
              </p>
              <p className="text-slate-200">
                {selectedJob.impact}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <div className="font-bold text-white mb-1">
              CoastalGuard ID
            </div>

            <p className="text-sm text-slate-500">
              Arsip histori pekerjaan stakeholder & evaluasi operasional.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-500">
            <button className="hover:text-cyan-300 transition">
              Export Archive
            </button>

            <button className="hover:text-cyan-300 transition">
              Audit Logs
            </button>

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

/* COMPONENTS */
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

      <div className={`text-4xl font-black ${color}`}>
        {value}
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  value,
}: {
  icon: LucideIcon;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-slate-400">
      <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
      <span>{value}</span>
    </div>
  );
}

function ModalCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-white/5 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">
        {label}
      </p>
      <p className="text-slate-200 font-semibold">{value}</p>
    </div>
  );
}