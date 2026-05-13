"use client";

import {
    CloudUpload,
    Camera,
    ShieldCheck,
} from "lucide-react";

export default function UploadPanel() {
    return (
        <section className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-28">
            <div className="flex items-center gap-3 mb-6">
                <CloudUpload className="text-cyan-400" />
                <h2 className="text-2xl font-bold">Upload Hasil</h2>
            </div>

            <form className="space-y-5">
                <textarea
                    rows={5}
                    placeholder="Jelaskan kondisi lapangan..."
                    className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white"
                />

                <div className="grid grid-cols-2 gap-4">
                    {["Before", "After"].map((label) => (
                        <div
                            key={label}
                            className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-slate-500"
                        >
                            <Camera className="mb-2" />
                            <span className="text-xs font-bold uppercase">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                <button className="w-full py-4 rounded-2xl bg-cyan-500 text-slate-950 font-black uppercase">
                    Kirim Laporan
                </button>
            </form>

            <div className="mt-6 p-4 rounded-2xl bg-slate-800 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="text-lime-400 w-4 h-4" />
                    <span className="text-xs uppercase font-bold">
                        Data Integrity Check
                    </span>
                </div>

                <p className="text-sm text-slate-400">
                    GPS dan timestamp divalidasi otomatis untuk menjaga akurasi laporan.
                </p>
            </div>
        </section>
    );
}