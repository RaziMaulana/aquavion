"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Radar,
  Brain,
  Lightbulb,
  Shield,
  PlayCircle,
  Compass,
  MapPin,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Layers,
} from "lucide-react";

type Founder = {
  name: string;
  role: string;
  description: string;
  image: string;
};

const founders: Founder[] = [
  {
    name: "Razi Maulana",
    role: "Chief AI Architect",
    description:
      "Specializing in neural network adaptation for maritime spatial data analysis.",
    image: "https://i.pravatar.cc/300?img=12",
  },
  {
    name: "Putri Nabila Safitri",
    role: "Head of Marine Science",
    description:
      "Expert in coastal abrasion modeling and mitigation strategy development.",
    image: "https://i.pravatar.cc/300?img=32",
  },
  {
    name: "Julian Zaky Saputra",
    role: "Director of Operations",
    description:
      "Focusing on system scaling and multi-nodal deployment of monitoring networks.",
    image: "https://i.pravatar.cc/300?img=15",
  },
];

const pillars = [
  {
    title: "Monitoring",
    desc: "Real-time multispectral data acquisition from satellite constellations.",
    icon: Radar,
  },
  {
    title: "Prediction",
    desc: "AI-driven forecasting models for coastal morphological changes.",
    icon: Brain,
  },
  {
    title: "Recommendation",
    desc: "Automated policy suggestions based on predictive impact analysis.",
    icon: Lightbulb,
  },
  {
    title: "Mitigation",
    desc: "Strategic deployment plans for physical coastal defense infrastructure.",
    icon: Shield,
  },
];

const coastalPoints = [
  {
    lat: -1.1398,
    lng: 116.9723,
    location: "Pantai Manggar",
    region: "Balikpapan Timur, Kaltim",
    status: "kritis" as const,
    abrasionRate: "4.2 m/tahun",
    affectedArea: "12.4 Ha",
    prediction: "Potensi kehilangan 18 Ha dalam 5 tahun",
    recommendation: "Pemasangan breakwater segera",
  },
  {
    lat: -6.1,
    lng: 106.75,
    location: "Pantai Utara Jakarta",
    region: "Jakarta Utara, DKI Jakarta",
    status: "waspada" as const,
    abrasionRate: "2.1 m/tahun",
    affectedArea: "8.7 Ha",
    prediction: "Peningkatan erosi 30% dalam 2 tahun",
    recommendation: "Penanaman mangrove di zona kuning",
  },
  {
    lat: -8.72,
    lng: 115.18,
    location: "Pantai Kuta",
    region: "Badung, Bali",
    status: "aman" as const,
    abrasionRate: "0.3 m/tahun",
    affectedArea: "1.2 Ha",
    prediction: "Stabil hingga 10 tahun ke depan",
    recommendation: "Pemantauan rutin setiap 6 bulan",
  },
  {
    lat: -3.32,
    lng: 114.59,
    location: "Pesisir Banjarmasin",
    region: "Kalimantan Selatan",
    status: "waspada" as const,
    abrasionRate: "1.9 m/tahun",
    affectedArea: "6.3 Ha",
    prediction: "Erosi meningkat pada musim barat",
    recommendation: "Monitoring intensif + kajian breakwater",
  },
  {
    lat: -5.13,
    lng: 119.42,
    location: "Pantai Losari",
    region: "Makassar, Sulawesi Selatan",
    status: "aman" as const,
    abrasionRate: "0.5 m/tahun",
    affectedArea: "2.1 Ha",
    prediction: "Kondisi stabil dengan pemeliharaan rutin",
    recommendation: "Pemantauan rutin setiap 6 bulan",
  },
  {
    lat: 3.79,
    lng: 98.67,
    location: "Pesisir Belawan",
    region: "Medan, Sumatera Utara",
    status: "kritis" as const,
    abrasionRate: "3.8 m/tahun",
    affectedArea: "10.1 Ha",
    prediction: "Ancaman serius infrastruktur pelabuhan",
    recommendation: "Intervensi struktur segera diperlukan",
  },
];

const statusColor = {
  kritis: "#ef4444",
  waspada: "#f97316",
  aman: "#22c55e",
};

const statusLabel = {
  kritis: "KRITIS",
  waspada: "WASPADA",
  aman: "AMAN",
};

function CoastalMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || mapInstanceRef.current) return;

    // Dynamically load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Dynamically load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      const L = (window as any).L;
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L.map(mapRef.current, {
        center: [-2.5, 118],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap © CARTO",
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);

      coastalPoints.forEach((point) => {
        const color = statusColor[point.status];
        const label = statusLabel[point.status];

        const marker = L.circleMarker([point.lat, point.lng], {
          radius: 10,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 0.9,
          fillOpacity: 0.85,
        }).addTo(map);

        const popupContent = `
          <div style="
            background: #0f2137;
            border: 1px solid ${color}40;
            border-radius: 12px;
            padding: 14px;
            min-width: 220px;
            font-family: sans-serif;
            color: white;
          ">
            <div style="
              display: inline-block;
              background: ${color}25;
              border: 1px solid ${color}60;
              color: ${color};
              font-size: 10px;
              font-weight: 800;
              letter-spacing: 0.1em;
              padding: 3px 10px;
              border-radius: 999px;
              margin-bottom: 10px;
            ">${label}</div>
            <div style="font-size: 15px; font-weight: 800; margin-bottom: 2px;">${point.location}</div>
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 12px;">📍 ${point.region}</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
              <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 8px;">
                <div style="font-size: 10px; color: #64748b; margin-bottom: 2px;">Laju Abrasi</div>
                <div style="font-size: 13px; font-weight: 700; color: ${color};">${point.abrasionRate}</div>
              </div>
              <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 8px;">
                <div style="font-size: 10px; color: #64748b; margin-bottom: 2px;">Terdampak</div>
                <div style="font-size: 13px; font-weight: 700;">${point.affectedArea}</div>
              </div>
            </div>
            <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 8px; margin-bottom: 8px;">
              <div style="font-size: 10px; color: #64748b; margin-bottom: 2px;">Prediksi AI</div>
              <div style="font-size: 11px; color: #cbd5e1;">${point.prediction}</div>
            </div>
            <div style="background: ${color}15; border: 1px solid ${color}30; border-radius: 8px; padding: 8px;">
              <div style="font-size: 10px; color: #64748b; margin-bottom: 2px;">Rekomendasi</div>
              <div style="font-size: 11px; color: ${color}; font-weight: 600;">${point.recommendation}</div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 260,
          className: "aquavion-popup",
        });

        L.circleMarker([point.lat, point.lng], {
          radius: 18,
          fillColor: color,
          color: color,
          weight: 1,
          opacity: 0.2,
          fillOpacity: 0.1,
        }).addTo(map);
      });

      const style = document.createElement("style");
      style.textContent = `
        .aquavion-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important;
          padding: 0 !important;
          border-radius: 12px !important;
        }
        .aquavion-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        .aquavion-popup .leaflet-popup-tip-container {
          display: none;
        }
        .leaflet-container {
          background: #0d1b2a !important;
        }
      `;
      document.head.appendChild(style);
    };

    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-2xl"
      style={{ minHeight: "500px" }}
    />
  );
}

export default function AquavionPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* NAVBAR — Login only */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tight text-cyan-600">
            AQUAVION
          </div>
          <Link
            href="/auth/login"
            className="px-6 py-2.5 rounded-full border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 transition text-sm"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#031427]">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#031427]/40 via-[#031427]/70 to-[#031427]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Radar className="w-4 h-4" />
            AI Coastal Intelligence System
          </span>

          <h1 className="text-5xl md:text-7xl font-black leading-tight max-w-4xl text-white">
            Coastal Intelligence Platform for Abrasion Prediction
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mt-6 leading-relaxed">
            Menggabungkan satellite data, AI prediction model, dan real-time monitoring
            untuk melindungi garis pantai Indonesia.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="/public/peta"
              className="px-8 py-4 rounded-2xl border border-white/10 text-white flex items-center gap-2 hover:bg-white/5 transition"
            >
              <PlayCircle className="w-5 h-5" />
              View Live Map
            </a>
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="py-24 bg-[#031427] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Behind AQUAVION</h2>
            <p className="text-slate-500 text-lg">
              Architects of next-generation maritime intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {founders.map((founder) => (
              <div
                key={founder.name}
                className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition"
              >
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-cyan-100"
                />
                <h3 className="text-2xl font-bold text-slate-900">{founder.name}</h3>
                <p className="text-cyan-600 font-semibold mb-4">{founder.role}</p>
                <p className="text-slate-600 leading-relaxed">{founder.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STRATEGIC PILLARS */}
      <section className="py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:-translate-y-2 hover:shadow-xl transition"
              >
                <Icon className="w-12 h-12 text-cyan-500 mb-6" />
                <h4 className="text-2xl font-bold mb-3">{pillar.title}</h4>
                <p className="text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PIPELINE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-20">System Pipeline</h2>

          <div className="grid md:grid-cols-4 gap-10">
            {[
              ["01", "Data Ingestion", "Satellite Imagery & IoT Buoys"],
              ["02", "Neural Processing", "Feature Extraction & Matching"],
              ["03", "Analysis Hub", "Abrasion Velocity Modeling"],
              ["04", "Action Plan", "Stakeholder Dashboard Delivery"],
            ].map(([num, title, desc]) => (
              <div key={num} className="text-center">
                <div className="w-14 h-14 rounded-full bg-cyan-500 text-white flex items-center justify-center font-black text-lg mx-auto mb-6 shadow-lg">
                  {num}
                </div>
                <h5 className="text-xl font-bold mb-2">{title}</h5>
                <p className="text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANALYSIS MAP SECTION */}
      <section className="py-28 bg-[#031427] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(6,182,212,0.07)_0%,_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(6,182,212,0.05)_0%,_transparent_55%)]" />

        <div className="relative max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-5">
              <Layers className="w-3.5 h-3.5" />
              Hasil Analisis Pesisir
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Peta Pemantauan Real-Time
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Sebaran titik pemantauan abrasi berbasis AI di seluruh wilayah pesisir Indonesia.
              Klik marker untuk melihat detail analisis.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {[
              { color: "#ef4444", label: "Kritis", desc: "> 3 m/tahun" },
              { color: "#f97316", label: "Waspada", desc: "1–3 m/tahun" },
              { color: "#22c55e", label: "Aman", desc: "< 1 m/tahun" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` }}
                />
                <span className="text-white font-semibold text-sm">{item.label}</span>
                <span className="text-slate-500 text-xs">{item.desc}</span>
              </div>
            ))}
          </div>

          {/* Map Container */}
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40"
            style={{ height: "520px" }}>
            <CoastalMap />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { value: "6", label: "Titik Aktif", color: "text-cyan-400" },
              { value: "2", label: "Zona Kritis", color: "text-red-400" },
              { value: "2", label: "Zona Aman", color: "text-emerald-400" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-10">
            <a
              href="/public/peta"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-cyan-500 text-black font-black text-base hover:scale-105 transition shadow-lg shadow-cyan-500/20"
            >
              <MapPin className="w-5 h-5" />
              Lihat Peta Lengkap
              <ArrowRight className="w-5 h-5" />
            </a>
            <p className="text-slate-600 text-sm mt-4">
              Akses lebih dari 200+ titik pemantauan pesisir di seluruh Indonesia
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative text-center mt-20 text-slate-600 text-sm">
          © {new Date().getFullYear()} AQUAVION · AI Coastal Intelligence System · Indonesia
        </div>
      </section>

    </div>
  );
}