"use client";

type JobStatus = "Completed" | "Verified" | "Delayed";

type JobHistory = {
    duration: string;
    status: JobStatus;
};

export default function HistoryStats({
    historyData,
}: {
    historyData: JobHistory[];
}) {
    const verifiedCount = historyData.filter(
        (job) => job.status === "Verified"
    ).length;

    const avgDuration =
        Math.round(
            historyData.reduce(
                (acc, job) => acc + parseInt(job.duration),
                0
            ) / historyData.length
        ) || 0;

    return (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6">
                <div className="text-slate-400 text-sm mb-2">Total Job</div>
                <div className="text-4xl font-black text-cyan-400">
                    {historyData.length}
                </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6">
                <div className="text-slate-400 text-sm mb-2">Verified</div>
                <div className="text-4xl font-black text-lime-400">
                    {verifiedCount}
                </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6">
                <div className="text-slate-400 text-sm mb-2">Avg Duration</div>
                <div className="text-4xl font-black text-orange-300">
                    {avgDuration}D
                </div>
            </div>

            <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-6">
                <div className="text-slate-400 text-sm mb-2">Success Rate</div>
                <div className="text-4xl font-black text-cyan-300">92%</div>
            </div>
        </section>
    );
}