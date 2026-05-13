"use client";

export default function JobStats() {
    return (
        <section className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold mb-2">
                        Efisiensi Eksekusi Lapangan
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Statistik penanganan abrasi 30 hari terakhir
                    </p>
                </div>

                <div className="flex gap-8">
                    <div className="text-center">
                        <div className="text-3xl font-black text-cyan-400">
                            84%
                        </div>
                        <div className="text-xs uppercase text-slate-500 font-bold">
                            SLA Speed
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-black text-lime-400">
                            142
                        </div>
                        <div className="text-xs uppercase text-slate-500 font-bold">
                            Tasks Done
                        </div>
                    </div>
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
    );
}