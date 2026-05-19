"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
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
      <main className="px-6 py-10">
        <div className="max-w-7xl mx-auto mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-medium text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Home
          </Link>

          <h1 className="text-5xl font-black text-white">
            Peta Risiko Abrasi
          </h1>

          <p className="text-slate-400 mt-3 max-w-2xl">
            Monitoring berbasis AI + satelit real-time seluruh pesisir Indonesia
          </p>
        </div>

        <div className="max-w-7xl mx-auto relative h-[720px] rounded-3xl overflow-hidden border border-white/10">
          <MapPanel
            selected={selected}
            setSelected={setSelected}
          />

          <MapFilter
            filter={filter}
            setFilter={setFilter}
          />

          <InfoPanel selected={selected} />
        </div>
      </main>

      <footer className="border-t border-white/10 mt-10 py-8 text-center text-sm text-slate-500">
        AquaVion ID © 2026
      </footer>
    </div>
  );
}