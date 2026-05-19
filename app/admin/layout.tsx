"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bot,
  LayoutDashboard,
  Menu,
  Settings,
  Shield,
  Users,
  Waves,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { useAgentStore, COASTAL_REGISTRY } from "@/lib/agentStore";

const navLinks = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/report",
    label: "Report",
    icon: BarChart3,
  },
  {
    href: "/admin/stackholder",
    label: "Stakeholder",
    icon: Users,
  },
  {
    href: "/admin/agent",
    label: "AI Agent",
    icon: Bot,
  },
  {
    href: "/admin/system",
    label: "System",
    icon: Settings,
  },
];

function AgentBootstrap() {
  const pathname = usePathname();
  const bootRef = useRef(false);

  useEffect(() => {
    const state = useAgentStore.getState();

    // Initial boot sekali
    if (!bootRef.current) {
      bootRef.current = true;

      if (state.agentStatus === "running") {
        state.startAgent();
      }
    }

    if (state.agentStatus === "running") {
      state.startAgent();
    }
  }, [pathname]);

  return null;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    agentStatus,
    startAgent,
    stopAgent,
    analyses,
    allTasks,
    cycleCount,
  } = useAgentStore();

  const isRunning = agentStatus === "running";

  const analysisVals = Object.values(analyses);

  const criticalCount = analysisVals.filter(
    (a) => a.riskLevel === "KRITIS"
  ).length;

  const highRiskCount = analysisVals.filter(
    (a) => a.riskLevel === "KRITIS" || a.riskLevel === "TINGGI"
  ).length;

  const pendingTasks = allTasks.filter(
    (task) => task.status === "pending"
  ).length;

  const avgRisk = analysisVals.length
    ? Math.round(
      analysisVals.reduce((sum, item) => sum + item.riskScore, 0) /
      analysisVals.length
    )
    : 0;

  const systemHealth = useMemo(() => {
    let score = 100;

    if (agentStatus === "error") score -= 40;
    if (!isRunning) score -= 10;

    score -= Math.min(pendingTasks * 2, 20);
    score -= Math.min(criticalCount * 5, 25);

    return Math.max(score, 0);
  }, [agentStatus, isRunning, pendingTasks, criticalCount]);

  const topPadding = isRunning ? "pt-[124px]" : "pt-[88px]";

  return (
    <>
      {/* GLOBAL BOOTSTRAP */}
      <AgentBootstrap />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_35%),#020617] text-slate-200 flex flex-col">
        {/* HEADER */}
        <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-2xl">
          {/* TOP BAR */}
          <div className="h-[72px] px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
            {/* BRAND */}
            <div className="flex items-center gap-4 min-w-0">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 flex-shrink-0"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-cyan-400/20 bg-cyan-400/10">
                  <Waves className="w-6 h-6 text-cyan-400" />
                </div>

                <div className="hidden sm:block">
                  <h1 className="text-lg font-black tracking-tight text-white">
                    AquaVion
                    <span className="text-cyan-400"> ID</span>
                  </h1>

                  <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 font-bold">
                    Maritime AI Command
                  </p>
                </div>
              </Link>

              {/* DESKTOP NAV */}
              <nav className="hidden xl:flex items-center gap-2 ml-4">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  const Icon = link.icon;

                  const badge =
                    link.href === "/admin/agent"
                      ? criticalCount
                      : link.href === "/admin/stakeholder"
                        ? pendingTasks
                        : 0;

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
                        <span
                          className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${link.href === "/admin/agent"
                              ? "bg-red-500/15 text-red-400"
                              : "bg-orange-500/15 text-orange-400"
                            }`}
                        >
                          {badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              {/* HEALTH */}
              <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-2xl border border-white/10 bg-white/[0.03]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
                    Health
                  </p>
                  <p className="text-sm font-black text-cyan-400">
                    {systemHealth}%
                  </p>
                </div>

                <div className="w-px h-8 bg-white/10" />

                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
                    Avg Risk
                  </p>
                  <p className="text-sm font-black text-orange-400">
                    {avgRisk || "—"}
                  </p>
                </div>

                <div className="w-px h-8 bg-white/10" />

                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
                    Cycles
                  </p>
                  <p className="text-sm font-black text-white">
                    {cycleCount}
                  </p>
                </div>
              </div>

              {/* AGENT BUTTON */}
              {isRunning ? (
                <button
                  onClick={stopAgent}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-black uppercase"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={startAgent}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl border border-lime-500/20 bg-lime-500/10 text-lime-400 text-xs font-black uppercase"
                >
                  Run
                </button>
              )}

              {/* MOBILE */}
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

          {/* MOBILE NAV */}
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

          {/* LIVE TICKER */}
          {isRunning && (
            <div className="border-t border-cyan-400/10 bg-cyan-400/[0.04] px-4 sm:px-6 lg:px-10 py-2">
              <div className="text-xs font-mono text-cyan-300/80">
                Agent active · {analysisVals.length}/{COASTAL_REGISTRY.length}{" "}
                coastal nodes ·{" "}
                {highRiskCount > 0
                  ? `${highRiskCount} high-risk sectors`
                  : "all sectors stable"}{" "}
                · {pendingTasks} pending tasks · cycle #{cycleCount}
              </div>
            </div>
          )}
        </header>

        {/* MAIN */}
        <main className={`flex-1 ${topPadding}`}>
          {children}
        </main>

        {/* FOOTER */}
        <footer className="border-t border-white/5 mt-10 bg-slate-950/70">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <span>
                © 2026 AquaVion · Indonesian Maritime Intelligence Grid
              </span>

              <span className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" />
                System Health: {systemHealth}%
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}