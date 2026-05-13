"use client";

import {
    Waves,
    MapPin,
    CalendarDays,
    Clock3,
    ShieldCheck,
    Eye,
    FileText,
} from "lucide-react";

export default function HistoryCard({
    job,
    getStatusStyle,
    getPriorityStyle,
}: any) {
    return (
        <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-cyan-500/30 transition shadow-2xl">
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                <div className="flex gap-4 flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/5">
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
                            <div className="flex items-center gap-2 text-slate-400">
                                <MapPin className="w-4 h-4 text-cyan-400" />
                                {job.location}
                            </div>

                            <div className="flex items-center gap-2 text-slate-400">
                                <CalendarDays className="w-4 h-4 text-cyan-400" />
                                {job.completedDate}
                            </div>

                            <div className="flex items-center gap-2 text-slate-400">
                                <Clock3 className="w-4 h-4 text-cyan-400" />
                                {job.duration}
                            </div>

                            <div className="flex items-center gap-2 text-slate-400">
                                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                {job.team}
                            </div>
                        </div>
                    </div>
                </div>

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
                        <button className="flex-1 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2">
                            <Eye className="w-4 h-4" />
                            Detail
                        </button>

                        <button className="flex-1 py-3 rounded-2xl border border-white/10 text-slate-300 font-bold text-sm flex items-center justify-center gap-2">
                            <FileText className="w-4 h-4" />
                            Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}