"use client";

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
  Sparkles,
  CheckSquare,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS Components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type TaskStatus = "Available" | "In Progress" | "Completed";

type Task = {
  id: string;
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

const initialTasks: Task[] = [
  {
    id: "task-1",
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
    id: "task-2",
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
    id: "task-3",
    title: "Drone Mapping Sektor Marunda",
    description: "Data pemetaan berhasil diunggah ke server pusat dan divalidasi oleh AI.",
    status: "Completed",
    priority: "Low",
    location: "Pesisir Marunda",
    time: "Kemarin",
    progress: 100,
    icon: "check",
  },
];

// Data Grafik Efektivitas yang dinilai oleh AI Agent
const aiEffectivenessData = {
  labels: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4", "Minggu 5", "Minggu 6"],
  datasets: [
    {
      label: "Skor Efektivitas Operasi Lapangan (%)",
      data: [68, 72, 79, 74, 88, 94],
      borderColor: "#22d3ee",
      backgroundColor: "rgba(34, 211, 238, 0.1)",
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#031427",
      pointBorderColor: "#22d3ee",
      pointBorderWidth: 2,
      pointRadius: 5,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: { color: "#8ca0b8", font: { family: "sans-serif", size: 12 } },
    },
    tooltip: {
      backgroundColor: "#0b1e36",
      titleColor: "#22d3ee",
      bodyColor: "#fff",
      borderColor: "rgba(255,255,255,0.1)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: { color: "#8ca0b8" },
      grid: { color: "rgba(255, 255, 255, 0.05)" },
    },
    y: {
      min: 0,
      max: 100,
      ticks: { color: "#8ca0b8" },
      grid: { color: "rgba(255, 255, 255, 0.05)" },
    },
  },
};

function getTaskIcon(icon: Task["icon"]) {
  switch (icon) {
    case "waves":
      return <Waves className="w-6 h-6 text-cyan-400" />;
    case "construction":
      return <Construction className="w-6 h-6 text-lime-400" />;
    default:
      return <CheckCircle2 className="w-6 h-6 text-emerald-400" />;
  }
}

function getStatusStyle(status: TaskStatus) {
  switch (status) {
    case "Available":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    case "In Progress":
      return "bg-amber-400/10 text-amber-400 border-amber-400/20";
    case "Completed":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
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
  const [taskList, setTaskList] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<"All" | "Available" | "In Progress" | "Completed">("All");

  // State untuk melacak pekerjaan/job mana yang sedang aktif dipilih oleh user
  const [selectedTaskId, setSelectedTaskId] = useState<string>("task-2");
  const [reportText, setReportText] = useState("");

  const filteredTasks = useMemo(() => {
    if (filter === "All") return taskList;
    return taskList.filter((task) => task.status === filter);
  }, [filter, taskList]);

  const activeTask = useMemo(() => {
    return taskList.find((t) => t.id === selectedTaskId) || taskList[0];
  }, [selectedTaskId, taskList]);

  const stats = useMemo(() => {
    const available = taskList.filter((t) => t.status === "Available").length;
    const inProgress = taskList.filter((t) => t.status === "In Progress").length;
    const completed = taskList.filter((t) => t.status === "Completed").length;

    return {
      available,
      inProgress,
      completed,
      total: taskList.length,
    };
  }, [taskList]);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return alert("Harap isi deskripsi bukti pengerjaan.");

    // Update status task menjadi Completed secara dinamis
    setTaskList((prev) =>
      prev.map((t) =>
        t.id === activeTask.id
          ? { ...t, status: "Completed", progress: 100, time: "Baru Saja" }
          : t
      )
    );
    setReportText("");
    alert(`Sukses! Bukti pengerjaan untuk "${activeTask.title}" telah dikirim ke AI Agent.`);
  };

  return (
    <div className="min-h-screen text-[#d3e4fe] bg-[#031427] bg-[radial-gradient(circle_at_top_right,rgba(0,162,230,0.15),transparent_30%)]">
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-12">

        {/* HERO SECTION */}
        <section className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                AI Agent Command Network
              </div>

              <h1 className="text-4xl md:text-5xl font-black mb-4">
                Task Assignment & Field Execution
              </h1>

              <p className="text-slate-400 max-w-3xl leading-relaxed">
                Daftar instruksi taktis otomatis dari AI Agent. Pilih item pekerjaan untuk
                mengakses otentikasi penyerahan dokumen, koordinat GPS, serta bukti visual lapangan.
              </p>
            </div>

            {/* QUICK KPI STATUS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
              <QuickStat label="Belum Dikerjakan" value={stats.available} color="text-cyan-400" />
              <QuickStat label="Sedang Dikerjakan" value={stats.inProgress} color="text-amber-400" />
              <QuickStat label="Selesai" value={stats.completed} color="text-emerald-400" />
              <QuickStat label="Total Instansi" value={stats.total} color="text-slate-300" />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

          {/* LEFT CONTENT: TASK LIST */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_25px_rgba(0,162,230,0.15)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <CheckSquare className="text-cyan-400 w-6 h-6" /> Pekerjaan dari AI Agent
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Klik salah satu kartu untuk menyerahkan bukti pekerjaan</p>
                </div>

                {/* FILTER TAB */}
                <div className="flex flex-wrap bg-slate-800/80 rounded-xl p-1 border border-white/10 text-xs">
                  {(["All", "Available", "In Progress", "Completed"] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`px-3 py-2 rounded-lg font-bold transition ${filter === item ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                        }`}
                    >
                      {item === "All" ? "Semua" : item === "Available" ? "Belum" : item === "In Progress" ? "Progres" : "Selesai"}
                    </button>
                  ))}
                </div>
              </div>

              {/* LIST CARDS */}
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`cursor-pointer transition duration-200 ${selectedTaskId === task.id ? "ring-2 ring-cyan-400" : ""
                      }`}
                  >
                    <TaskCard task={task} isActive={selectedTaskId === task.id} />
                  </div>
                ))}
                {filteredTasks.length === 0 && (
                  <p className="text-center py-8 text-slate-500 text-sm">Tidak ada pekerjaan dalam kategori ini.</p>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR: PROOF OF WORK UPLOAD (DYNAMICALLY DEPENDS ON SELECTED JOB) */}
          <aside className="space-y-6">
            <section className="bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 sticky top-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <CloudUpload className="text-cyan-400 w-6 h-6 animate-bounce" />
                <h2 className="text-2xl font-bold">Bukti Pengerjaan</h2>
              </div>
              <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider font-mono">
                Target: <span className="text-cyan-300 font-bold">{activeTask?.title}</span>
              </p>

              <div className="mb-4 p-3 rounded-xl bg-slate-950/40 border border-white/5 text-xs text-slate-300">
                <span className="font-bold block text-slate-400 mb-1">Status Pekerjaan Saat Ini:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getStatusStyle(activeTask?.status)}`}>
                  {activeTask?.status}
                </span>
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">
                    Deskripsi & Temuan Lapangan
                  </label>
                  <textarea
                    rows={4}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder={`Laporkan hasil penanganan untuk ${activeTask?.title}...`}
                    className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 resize-none placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-slate-400 font-bold mb-3">
                    Lampiran Dokumentasi Foto (Geo-tagged)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {["Kondisi Awal", "Hasil Akhir"].map((label) => (
                      <UploadBox key={label} label={label} />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={activeTask?.status === "Completed"}
                  className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition ${activeTask?.status === "Completed"
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                      : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                    }`}
                >
                  {activeTask?.status === "Completed" ? "Pekerjaan Telah Selesai" : "Kirim Bukti Ke AI Agent"}
                </button>
              </form>

              <div className="mt-6 p-4 rounded-xl bg-slate-950/40 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="text-emerald-400 w-4 h-4" />
                  <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
                    Otentikasi Kriptografi AI
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Setiap berkas diverifikasi silang menggunakan citra satelit SAR dan metadata kamera terenkripsi.
                </p>
              </div>
            </section>
          </aside>
        </div>

        {/* BOTTOM SECTION: AI FIELD EFFECTIVENESS ANALYTICS */}
        <section className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" /> Real-time Autonomous Evaluation
              </div>
              <h2 className="text-2xl font-bold text-white">
                Grafik Efektivitas Lapangan
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Metrik efisiensi dan dampak struktural penanganan abrasi pesisir dinilai langsung oleh kecerdasan buatan.
              </p>
            </div>

            <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl flex gap-6">
              <MetricStat value="94%" label="Skor Saat Ini" color="text-cyan-400" />
              <MetricStat value="+12%" label="Pertumbuhan (MoM)" color="text-emerald-400" />
            </div>
          </div>

          {/* Line Chart Component */}
          <div className="h-72 w-full mt-4">
            <Line data={aiEffectivenessData} options={chartOptions} />
          </div>
        </section>

      </main>

      {/* MOBILE FAB */}
      <button className="fixed md:hidden bottom-6 right-6 w-14 h-14 rounded-full bg-cyan-500 text-slate-950 shadow-2xl flex items-center justify-center active:scale-95 transition">
        <Siren className="w-6 h-6 animate-pulse" />
      </button>
    </div>
  );
}

/* TASK CARD COMPONENT */
function TaskCard({ task, isActive }: { task: Task; isActive: boolean }) {
  return (
    <div
      className={`rounded-xl p-5 border transition-all duration-300 ${isActive
          ? "bg-slate-800 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          : "bg-slate-800/40 border-white/5 hover:border-white/20"
        }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-xl bg-slate-900/80 flex items-center justify-center shrink-0 border border-white/5">
            {getTaskIcon(task.icon)}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="font-bold text-base text-white">{task.title}</h3>
              <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded border ${getStatusStyle(task.status)}`}>
                {task.status === "Available" ? "Belum Dikerjakan" : task.status === "In Progress" ? "Sedang Dikerjakan" : "Selesai"}
              </span>
              <span className={`text-xs font-semibold ${getPriorityStyle(task.priority)}`}>
                {task.priority} Priority
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm mb-3 max-w-xl leading-relaxed">
              {task.description}
            </p>

            <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              {task.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {task.location}
                </span>
              )}
              {task.assignee && (
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {task.assignee}
                </span>
              )}
              {task.time && (
                <span className="flex items-center gap-1">
                  {task.status === "In Progress" ? (
                    <RefreshCcw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  ) : (
                    <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  {task.time}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="sm:text-right shrink-0">
          <span className={`text-xs font-bold px-4 py-2 rounded-lg border transition ${isActive ? "bg-cyan-500 text-slate-950 border-cyan-400" : "bg-slate-900 text-slate-400 border-white/5"
            }`}>
            {isActive ? "Dipilih" : "Pilih Job"}
          </span>
        </div>
      </div>

      {task.progress && (
        <div className="mt-4">
          <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-mono">
            <span>Kesiapan Sektor</span>
            <span>{task.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-950 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${task.status === "Completed" ? "bg-emerald-400" : "bg-amber-400"
                }`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* SMALL COMPONENTS */
function UploadBox({ label }: { label: string }) {
  return (
    <div className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500 hover:text-cyan-400 transition cursor-pointer bg-slate-900/50">
      <Camera className="mb-1 w-5 h-5" />
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4 min-w-[130px] flex flex-col justify-between">
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider leading-tight mb-2">
        {label}
      </p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

function MetricStat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="text-left sm:text-right">
      <div className={`text-2xl font-black ${color} leading-none mb-1`}>{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
        {label}
      </div>
    </div>
  );
}