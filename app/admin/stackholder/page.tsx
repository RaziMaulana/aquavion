// app/admin/stackholder/page.tsx
"use client";

import { useMemo, useState } from "react";
import {
  useAgentStore,
  riskBgClass,
} from "@/lib/agentStore";

/**
 * FIX:
 * - Hapus import STAKEHOLDERS (tidak ada di store)
 * - Hapus upsertTask (tidak ada di store)
 * - Gunakan stakeholder statis lokal
 * - Tambahkan typing lengkap
 * - Task update langsung via setTasks / setState generic
 */

type StakeholderRole =
  | "BMKG"
  | "Pemda"
  | "Kementerian"
  | "Relawan"
  | "Masyarakat";

type Stakeholder = {
  id: string;
  name: string;
  role: StakeholderRole;
  region: string;
  status: "active" | "idle";
};

const STAKEHOLDERS: Stakeholder[] = [
  {
    id: "st-1",
    name: "BMKG Pesisir Nasional",
    role: "BMKG",
    region: "Nasional",
    status: "active",
  },
  {
    id: "st-2",
    name: "Pemda Kalimantan Timur",
    role: "Pemda",
    region: "Kalimantan Timur",
    status: "active",
  },
  {
    id: "st-3",
    name: "Kementerian Kelautan",
    role: "Kementerian",
    region: "Indonesia",
    status: "active",
  },
  {
    id: "st-4",
    name: "Relawan Abrasi",
    role: "Relawan",
    region: "Regional",
    status: "idle",
  },
  {
    id: "st-5",
    name: "Forum Masyarakat Pesisir",
    role: "Masyarakat",
    region: "Lokal",
    status: "active",
  },
];

export default function AdminStakeholderPage() {
  const allTasks = useAgentStore((s) => s.allTasks);
  const latestInsight = useAgentStore((s) => s.latestInsight);
  const analyses = useAgentStore((s) => s.analyses);

  const setState = useAgentStore.setState;

  const [filter, setFilter] = useState("all");

  const analysisValues = Object.values(analyses);

  const criticalCount = analysisValues.filter(
    (a) =>
      a.riskLevel === "KRITIS" ||
      a.riskLevel === "TINGGI"
  ).length;

  const filteredTasks = useMemo(() => {
    if (filter === "all") return allTasks;

    return allTasks.filter(
      (task) => task.status === filter
    );
  }, [allTasks, filter]);

  const assignStakeholder = (
    taskId: string,
    assignee: string
  ) => {
    const updated = allTasks.map((task) =>
      task.id === taskId
        ? {
          ...task,
          assignee,
          status: "in_progress" as const,
        }
        : task
    );

    setState({
      allTasks: updated,
    });
  };

  const markDone = (taskId: string) => {
    const updated = allTasks.map((task) =>
      task.id === taskId
        ? {
          ...task,
          status: "done" as const,
        }
        : task
    );

    setState({
      allTasks: updated,
    });
  };

  return (
    <div className="px-6 lg:px-10 py-10 max-w-7xl mx-auto text-slate-200">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
            Stakeholder Command Center
          </h1>

          <p className="text-slate-400 mt-2 text-sm max-w-2xl">
            Koordinasi stakeholder nasional untuk mitigasi
            abrasi, distribusi tugas otomatis, dan
            monitoring penyelesaian aksi lapangan.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Stakeholders",
              value: STAKEHOLDERS.length,
              color: "text-cyan-400",
            },
            {
              label: "Critical",
              value: criticalCount,
              color: "text-red-400",
            },
            {
              label: "Tasks",
              value: allTasks.length,
              color: "text-orange-400",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl px-5 py-4 border border-white/10 bg-slate-900/50 text-center"
            >
              <div
                className={`text-2xl font-black ${item.color}`}
              >
                {item.value}
              </div>

              <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INSIGHT */}
      <div className="mb-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
        <p className="text-[10px] uppercase tracking-widest font-black text-cyan-400 mb-2">
          Latest AI Coordination Insight
        </p>

        <p className="text-cyan-100 leading-relaxed">
          {latestInsight ||
            "Belum ada insight koordinasi terbaru."}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Stakeholder list */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h2 className="font-bold text-white">
                Active Stakeholders
              </h2>
            </div>

            <div className="divide-y divide-white/5">
              {STAKEHOLDERS.map((s: Stakeholder) => (
                <div
                  key={s.id}
                  className="p-4 flex items-center gap-4"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${s.status === "active"
                        ? "bg-lime-400"
                        : "bg-slate-600"
                      }`}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {s.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {s.role} · {s.region}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 overflow-hidden">
            {/* Toolbar */}
            <div className="p-5 border-b border-white/10 flex flex-col md:flex-row justify-between gap-4">
              <h2 className="font-bold text-white">
                Task Distribution Board
              </h2>

              <div className="flex gap-2">
                {["all", "pending", "in_progress", "done"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${filter === status
                          ? "bg-cyan-400 text-slate-950"
                          : "bg-white/5 text-slate-400"
                        }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Tasks */}
            {filteredTasks.length === 0 ? (
              <div className="p-10 text-center text-slate-600">
                Tidak ada task.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-5 flex flex-col xl:flex-row xl:items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black border ${riskBgClass(
                            task.urgency
                          )}`}
                        >
                          {task.urgency}
                        </span>

                        <span className="text-[10px] text-slate-500 uppercase">
                          {task.status}
                        </span>
                      </div>

                      <p className="font-bold text-white">
                        {task.title}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {task.assignee} · Deadline:{" "}
                        {task.deadline}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <select
                        onChange={(e) =>
                          assignStakeholder(
                            task.id,
                            e.target.value
                          )
                        }
                        value={task.assignee}
                        className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
                      >
                        <option value={task.assignee}>
                          {task.assignee}
                        </option>

                        {STAKEHOLDERS.map((s) => (
                          <option
                            key={s.id}
                            value={s.name}
                          >
                            {s.name}
                          </option>
                        ))}
                      </select>

                      {task.status !== "done" && (
                        <button
                          onClick={() =>
                            markDone(task.id)
                          }
                          className="px-4 py-2 rounded-xl bg-lime-400 text-slate-950 text-xs font-black uppercase"
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
