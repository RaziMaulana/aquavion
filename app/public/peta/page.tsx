"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { InfoPanel } from "@/components/InfoPanel";
import { MapFilter } from "@/components/MapFilter";

const MapPanel = dynamic(
  () =>
    import("@/components/MapPanel").then(
      (mod) => mod.MapPanel
    ),
  {
    ssr: false,
  }
);

export default function PublicPetaPage() {
  const [filter, setFilter] = useState("Seluruh Indonesia");
  const [selected, setSelected] = useState("Manggar");

  return (
    <div className="min-h-screen bg-[#031427] text-slate-200">

      {/* NAV */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <h1 className="text-white font-black">OceanVion</h1>

          <nav className="hidden md:flex gap-8 text-sm">
            <a className="text-slate-300 hover:text-cyan-400">Beranda</a>
            <a className="text-cyan-400 border-b-2 border-cyan-400 pb-1">
              Peta Abrasi
            </a>
          </nav>

          <button className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-bold">
            Bergabung
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="pt-24 px-6">
        <div className="max-w-7xl mx-auto mb-6">
          <h1 className="text-5xl font-black text-white">
            Peta Risiko Abrasi
          </h1>
          <p className="text-slate-400 mt-3 max-w-2xl">
            Monitoring berbasis AI + satelit real-time seluruh pesisir Indonesia
          </p>
        </div>

        <div className="max-w-7xl mx-auto relative h-[720px] rounded-3xl overflow-hidden border border-white/10">

          <MapPanel selected={selected} setSelected={setSelected} />

          <MapFilter filter={filter} setFilter={setFilter} />

          <InfoPanel selected={selected} />

        </div>

      </main>

      <footer className="border-t border-white/10 mt-10 py-8 text-center text-sm text-slate-500">
        CoastalGuard ID © 2024
      </footer>

    </div>
  );
}
