"use client";

import {
    Waves,
    Construction,
    CheckCircle2,
    MapPin,
    Clock3,
    User,
    RefreshCcw,
} from "lucide-react";

export default function TaskCard({ task }: any) {
    const getTaskIcon = () => {
        switch (task.icon) {
            case "waves":
                return <Waves className="w-6 h-6 text-cyan-400" />;
            case "construction":
                return <Construction className="w-6 h-6 text-lime-400" />;
            default:
                return <CheckCircle2 className="w-6 h-6 text-slate-500" />;
        }
    };

    return (
        <div className="rounded-2xl p-5 border bg-slate-800/70 border-white/10">
            <div className="flex flex-col lg:flex-row justify-between gap-5">
                <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-700 flex items-center justify-center">
                        {getTaskIcon()}
                    </div>

                    <div>
                        <h3 className="font-bold text-lg text-white">{task.title}</h3>

                        <p className="text-slate-400 text-sm mb-3">
                            {task.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs text-slate-500 uppercase">
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
            </div>

            {typeof task.progress === "number" && (
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