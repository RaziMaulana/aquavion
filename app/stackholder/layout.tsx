"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Briefcase,
  History,
  Menu,
  X,
  Waves,
  Bell,
  Settings,
  Activity
} from "lucide-react";
import { useState, useMemo } from "react";

const navLinks = [
  {
    href: "/stackholder/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/stackholder/report",
    label: "Report",
    icon: BarChart3,
  },
  {
    href: "/stackholder/job",
    label: "Job",
    icon: Briefcase,
  },
  {
    href: "/stackholder/history",
    label: "History",
    icon: History,
  },
];

export default function StakeholderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const operationalMetrics = useMemo(() => {
    return {
      nodeHealth: 98,
      activeTasks: 3,
      pendingValidations: 1,
    };
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.06),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.06),transparent_35%),#020617] text-slate-200 flex flex-col">

      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-2xl">

        {/* TOP BAR */}
        <div className="h-[72px] px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">

          {/* BRAND */}
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/stackholder/dashboard"
              className="flex items-center gap-3 flex-shrink-0"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-cyan-400/20 bg-cyan-400/10">
                <Waves className="w-6 h-6 text-cyan-400" />
              </div>

              <div className="hidden sm:block">
                <h1 className="text-lg font-black tracking-tight text-white">
                  OquaVion
                  <span className="text-cyan-400"> ID</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 font-bold">
                  Stakeholder Portal
                </p>
              </div>
            </Link>

            {/* DESKTOP NAV (Admin Layout Border-Box Style) */}
            <nav className="hidden xl:flex items-center gap-2 ml-4">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;

                // Tampilkan badge indikator jika diperlukan di route tertentu
                const badge = link.href === "/stackholder/job" ? operationalMetrics.activeTasks : 0;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all border ${active
                        ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/20"
                        : "border-transparent text-slate-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}

                    {badge > 0 && (
                      <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/15 text-cyan-400">
                        {badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* RIGHT ACTION CONTROLS */}
          <div className="flex items-center gap-3">

            {/* REALTIME SYSTEM HEALTH TRACKER */}
            <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-2xl border border-white/10 bg-white/[0.03]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
                  Node Health
                </p>
                <p className="text-sm font-black text-cyan-400">
                  {operationalMetrics.nodeHealth}%
                </p>
              </div>

              <div className="w-px h-8 bg-white/10" />

              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
                  Pending Val
                </p>
                <p className="text-sm font-black text-orange-400">
                  {operationalMetrics.pendingValidations}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <button className="p-3 rounded-2xl border border-white/10 bg-white/[0.03] text-slate-400 hover:text-cyan-400 transition hidden sm:inline-flex">
              <Bell className="w-4 h-4" />
            </button>

            <button className="p-3 rounded-2xl border border-white/10 bg-white/[0.03] text-slate-400 hover:text-cyan-400 transition hidden sm:inline-flex">
              <Settings className="w-4 h-4" />
            </button>

            {/* AVATAR */}
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-cyan-400/20 bg-slate-900 shrink-0">
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="stakeholder-profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* MOBILE INTERACTION BUTTON */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-3 rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAV LAYER */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-white/10 px-4 pb-4 pt-3 space-y-2 bg-slate-950/95">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold ${active
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-slate-300 bg-white/[0.03]"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* LIVE TICKER SUB-HEADER BAR */}
        <div className="border-t border-cyan-400/10 bg-cyan-400/[0.02] px-4 sm:px-6 lg:px-10 py-2">
          <div className="text-xs font-mono text-cyan-300/80 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Grid Active · Client Authorized · Monitoring {operationalMetrics.activeTasks} Ongoing Maritime Tasks
          </div>
        </div>

      </header>

      {/* MAIN CONTENT SPACE (With Adjusted Dynamic Top Padding) */}
      <main className="flex-1 pt-[124px] pb-10">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 mt-10 bg-slate-950/70">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span>
              © 2026 AquaVion · Indonesian Maritime Intelligence Grid
            </span>

            <span className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              Grid Stability Status: Excellent ({operationalMetrics.nodeHealth}%)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}