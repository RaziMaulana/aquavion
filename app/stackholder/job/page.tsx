"use client";

/*
STAKEHOLDER JOB PAGE — ENTERPRISE UPGRADE
IMPROVEMENTS:
1. Live filter state (All / Available / In Progress / Completed)
2. Dynamic KPI summary
3. Better upload panel UX
4. Task progress + urgency
5. Type-safe reusable components
6. Mobile + desktop polish
7. Notification / operational status widgets
*/

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Waves,
  Construction,
  CheckCircle2,
  MapPin,
  Clock3,
  User,
  RefreshCcw,
  CloudUpload,
  Camera,
  ShieldCheck,
  Siren,
  Bell,
  Settings,
  Activity,
  AlertTriangle,
} from "lucide-react";

type TaskStatus = "Available" | "In Progress" | "Completed";

type Task = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: "High" | "Medium" | "Low";
  location?: string;
  time?: string;
  assignee?: string;
  progress?: number;
  icon: "waves" | "construction" | "check";
};

const tasks: Task[] = [
  {
    title: "Audit Kerusakan Tanggul",
    description:
      "Pemeriksaan tanggul sektor pantai utara dengan indikasi retakan struktural akibat abrasi ekstrem.",
    status: "Available",
    priority: "High",
    location: "Jakarta Utara",
    time: "4 Jam Lalu",
    icon: "waves",
  },
  {
    title: "Penanaman Mangrove Area Z3",
    description:
      "Restorasi garis pantai tahap II. Laporan visual harian wajib diunggah sebelum 18:00 WIB.",
    status: "In Progress",
    priority: "Medium",
    assignee: "Budi Santoso",
    time: "Deadline Hari Ini",
    progress: 45,
    icon: "construction",
  },
  {
    title: "Drone Mapping Sektor Marunda",
    description: "Data pemetaan berhasil diunggah ke server pusat.",
    status: "Completed",
    priority: "Low",
    icon: "check",
  },
];

function getTaskIcon(icon: Task["icon"]) {
  switch (icon) {
    case "waves":
      return <Waves className="w-6 h-6 text-cyan-400" />;
    case "construction":
      return <Construction className="w-6 h-6 text-lime-400" />;
    default:
      return <CheckCircle2 className="w-6 h-6 text-slate-500" />;
  }
}

function getStatusStyle(status: TaskStatus) {
  switch (status) {
    case "Available":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    case "In Progress":
      return "bg-lime-400/10 text-lime-400 border-lime-400/20";
    case "Completed":
      return "bg-slate-800 text-slate-400 border-slate-700";
    default:
      return "bg-slate-800 text-slate-400 border-slate-700";
  }
}

function getPriorityStyle(priority: Task["priority"]) {
  switch (priority) {
    case "High":
      return "text-red-400";
    case "Medium":
      return "text-orange-300";
    case "Low":
      return "text-cyan-300";
    default:
      return "text-slate-400";
  }
}

export default function JobTaskPage() {
  const [filter, setFilter] = useState<
    "All" | "Available" | "In Progress" | "Completed"
  >("All");

  const filteredTasks = useMemo(() => {
    if (filter === "All") return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [filter]);

  const stats = useMemo(() => {
    const available = tasks.filter((t) => t.status === "Available").length;
    const inProgress = tasks.filter(
      (t) => t.status === "In Progress"
    ).length;
    const completed = tasks.filter(
      (t) => t.status === "Completed"
    ).length;

    return {
      available,
      inProgress,
      completed,
      total: tasks.length,
    };
  }, []);

  return (
    <div className="min-h-screen text-[#d3e4fe] bg-[#031427] bg-[radial-gradient(circle_at_top_right,rgba(0,162,230,0.15),transparent_30%)]">
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* HERO */}
        <section className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Live Field Operations
              </div>

              <h1 className="text-4xl md:text-5xl font-black mb-4">
                Task Assignment & Field Execution
              </h1>

              <p className="text-slate-400 max-w-3xl leading-relaxed">
                Kelola penanganan abrasi pesisir secara real-time dengan
                sinkronisasi laporan lapangan, dokumentasi visual, dan
                monitoring progres nasional.
              </p>
            </div>

            {/* QUICK STATUS */}
            <div className="grid grid-cols-2 gap-4">
              <QuickStat
                label="Available"
                value={stats.available}
                color="text-cyan-400"
              />
              <QuickStat
                label="In Progress"
                value={stats.inProgress}
                color="text-lime-400"
              />
              <QuickStat
                label="Completed"
                value={stats.completed}
                color="text-slate-300"
              />
              <QuickStat
                label="Critical"
                value={tasks.filter((t) => t.priority === "High").length}
                color="text-red-400"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* TASK LIST */}
            <section className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_25px_rgba(0,162,230,0.15)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <h2 className="text-2xl font-bold">
                  Daftar Tugas Lapangan
                </h2>

                <div className="flex flex-wrap bg-slate-800 rounded-xl p-1 border border-white/10 text-sm">
                  {["All", "Available", "In Progress", "Completed"].map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() =>
                          setFilter(
                            item as
                            | "All"
                            | "Available"
                            | "In Progress"
                            | "Completed"
                          )
                        }
                        className={`px-4 py-2 rounded-lg font-bold transition ${filter === item
                            ? "bg-cyan-500 text-slate-950"
                            : "text-slate-400 hover:text-white"
                          }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-5">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.title} task={task} />
                ))}
              </div>
            </section>

            {/* STATS */}
            <section className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Efisiensi Eksekusi Lapangan
                  </h2>

                  <p className="text-slate-400 text-sm">
                    Statistik penanganan abrasi 30 hari terakhir
                  </p>
                </div>

                <div className="flex gap-8">
                  <MetricStat
                    value="84%"
                    label="SLA Speed"
                    color="text-cyan-400"
                  />
                  <MetricStat
                    value="142"
                    label="Tasks Done"
                    color="text-lime-400"
                  />
                </div>
              </div>

              <div className="h-64 flex items-end gap-3">
                {[35, 55, 45, 70, 90, 60, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-cyan-500/20 rounded-t-xl border-t-2 border-cyan-400"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="space-y-6">
            {/* UPLOAD */}
            <section className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-28">
              <div className="flex items-center gap-3 mb-6">
                <CloudUpload className="text-cyan-400" />
                <h2 className="text-2xl font-bold">Upload Hasil</h2>
              </div>

              <form className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">
                    Deskripsi Laporan
                  </label>

                  <textarea
                    rows={5}
                    placeholder="Jelaskan kondisi lapangan..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">
                    Dokumentasi Foto
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    {["Before", "After"].map((label) => (
                      <UploadBox key={label} label={label} />
                    ))}
                  </div>
                </div>

                <button className="w-full py-4 rounded-2xl bg-cyan-500 text-slate-950 font-black uppercase tracking-widest hover:brightness-110 transition">
                  Kirim Laporan
                </button>
              </form>

              <div className="mt-6 p-4 rounded-2xl bg-slate-800 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="text-lime-400 w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest font-bold">
                    Data Integrity Check
                  </span>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">
                  Sistem memvalidasi GPS, timestamp, dan metadata visual
                  otomatis untuk menjaga akurasi laporan lapangan.
                </p>
              </div>
            </section>

            {/* OPS STATUS */}
            <section className="bg-slate-900/70 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">
                Operational Alerts
              </h3>

              <div className="space-y-4">
                <AlertItem
                  icon={Bell}
                  text="2 sektor membutuhkan verifikasi tambahan"
                />
                <AlertItem
                  icon={Activity}
                  text="Monitoring AI aktif di Balikpapan"
                />
                <AlertItem
                  icon={Settings}
                  text="Sinkronisasi drone berhasil"
                />
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* MOBILE FAB */}
      <button className="fixed md:hidden bottom-6 right-6 w-14 h-14 rounded-full bg-red-500 text-white shadow-2xl flex items-center justify-center active:scale-95 transition">
        <Siren className="w-6 h-6" />
      </button>
    </div>
  );
}

/* TASK CARD */
function TaskCard({ task }: { task: Task }) {
  return (
    <div
      className={`rounded-2xl p-5 border transition ${task.status === "In Progress"
          ? "bg-slate-800/70 border-cyan-500/20 shadow-[0_0_25px_rgba(0,162,230,0.15)]"
          : task.status === "Completed"
            ? "bg-slate-800/40 border-white/10 opacity-70"
            : "bg-slate-800/70 border-white/10 hover:border-cyan-500/40"
        }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-700 flex items-center justify-center">
            {getTaskIcon(task.icon)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-white">
                {task.title}
              </h3>

              <span
                className={`px-2 py-1 text-[10px] uppercase font-bold rounded border ${getStatusStyle(
                  task.status
                )}`}
              >
                {task.status}
              </span>

              <span
                className={`text-xs font-bold uppercase ${getPriorityStyle(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            </div>

            <p className="text-slate-400 text-sm mb-3 leading-relaxed">
              {task.description}
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-semibold uppercase">
              {task.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {task.location}
                </span>
              )}

              {task.assignee && (
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {task.assignee}
                </span>
              )}

              {task.time && (
                <span className="flex items-center gap-1">
                  {task.status === "In Progress" ? (
                    <RefreshCcw className="w-4 h-4" />
                  ) : (
                    <Clock3 className="w-4 h-4" />
                  )}
                  {task.time}
                </span>
              )}
            </div>
          </div>
        </div>

        <TaskAction status={task.status} />
      </div>

      {task.progress && (
        <div className="mt-5 h-2 rounded-full bg-slate-900 overflow-hidden">
          <div
            className="h-full bg-lime-400 rounded-full"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */
function TaskAction({ status }: { status: TaskStatus }) {
  if (status === "Available") {
    return (
      <div className="flex gap-3">
        <button className="px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 text-sm font-bold hover:brightness-110 transition">
          Ambil Tugas
        </button>
        <button className="px-5 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 transition">
          Abaikan
        </button>
      </div>
    );
  }

  if (status === "In Progress") {
    return (
      <button className="px-5 py-3 rounded-xl border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 transition text-sm font-bold">
        Update Laporan
      </button>
    );
  }

  return (
    <button className="px-5 py-3 rounded-xl border border-slate-700 text-slate-500 hover:bg-white/5 transition text-sm font-bold">
      Lihat Hasil
    </button>
  );
}

function UploadBox({ label }: { label: string }) {
  return (
    <div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500 hover:text-cyan-400 transition cursor-pointer">
      <Camera className="mb-2" />
      <span className="text-xs font-bold uppercase">{label}</span>
    </div>
  );
}

function QuickStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-4 min-w-[120px]">
      <p className="text-xs uppercase text-slate-500 mb-1">
        {label}
      </p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function MetricStat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-black ${color}`}>{value}</div>
      <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">
        {label}
      </div>
    </div>
  );
}

function AlertItem({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm text-slate-300">
      <Icon className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
      <span>{text}</span>
    </div>
  );
}