"use client";

import { useEffect, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  Brain,
  CheckCircle2,
  Cpu,
  PauseCircle,
  PlayCircle,
  Settings2,
  ShieldCheck,
  TimerReset,
  Waves,
} from "lucide-react";

import {
  useAgentStore,
  COASTAL_REGISTRY,
  riskBgClass,
} from "@/lib/agentStore";

const MODEL_OPTIONS = [
  {
    id: "llama-3.1-8b-instant",
    label: "Llama 3.1 8B",
    speed: "Fast",
  },
  {
    id: "llama-3.3-70b-versatile",
    label: "Llama 3.3 70B",
    speed: "Balanced",
  },
  {
    id: "openai/gpt-oss-120b",
    label: "GPT OSS 120B",
    speed: "Advanced",
  },
] as const;

export default function AdminAgentPage() {
  const {
    initialized,
    initializeAgent,

    agentStatus,
    config,

    analyses,
    allTasks,

    currentCoastIndex,
    cycleCount,
    currentWorkflow,
    latestInsight,
    agentError,

    setConfig,
    startAgent,
    stopAgent,
  } = useAgentStore();

  /* =============================
     INIT AGENT SEKALI
  ============================= */
  useEffect(() => {
    if (!initialized) {
      initializeAgent();
    }
  }, [initialized, initializeAgent]);

  /* =============================
     MEMOIZED DATA
  ============================= */
  const analysisValues = useMemo(
    () => Object.values(analyses),
    [analyses]
  );

  const currentCoast = useMemo(
    () =>
      COASTAL_REGISTRY[
      currentCoastIndex
      ] ?? null,
    [currentCoastIndex]
  );

  const avgRisk = useMemo(() => {
    if (!analysisValues.length) return 0;

    return Math.round(
      analysisValues.reduce(
        (sum, item) =>
          sum + item.riskScore,
        0
      ) / analysisValues.length
    );
  }, [analysisValues]);

  const criticalCount = useMemo(
    () =>
      analysisValues.filter(
        (a) =>
          a.riskLevel ===
          "KRITIS"
      ).length,
    [analysisValues]
  );

  const pendingTasks = useMemo(
    () =>
      allTasks.filter(
        (t) =>
          t.status ===
          "pending"
      ).length,
    [allTasks]
  );

  const coverage = useMemo(
    () =>
      Math.round(
        (analysisValues.length /
          COASTAL_REGISTRY.length) *
        100
      ),
    [analysisValues.length]
  );

  const activeModel = useMemo(
    () =>
      MODEL_OPTIONS.find(
        (m) =>
          m.id === config.model
      ),
    [config.model]
  );

  const isRunning =
    agentStatus === "running";

  /* =============================
     UI
  ============================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 px-6 lg:px-10 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HERO */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8">
          <div className="flex flex-col xl:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 rounded-3xl bg-cyan-400/10 border border-cyan-400/20">
                  <Bot className="w-8 h-8 text-cyan-400" />
                </div>

                <div>
                  <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                    AI Agent Control Center
                  </h1>

                  <p className="text-slate-400 mt-2">
                    Autonomous coastal
                    surveillance engine ·
                    orchestration, inference,
                    and task generation
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div
                  className={`px-4 py-2 rounded-full border text-xs font-black tracking-[0.25em] ${isRunning
                      ? "bg-lime-400/10 text-lime-300 border-lime-400/20"
                      : "bg-white/5 text-slate-400 border-white/10"
                    }`}
                >
                  {isRunning
                    ? "RUNNING"
                    : agentStatus.toUpperCase()}
                </div>

                <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-slate-300">
                  {analysisValues.length}/
                  {
                    COASTAL_REGISTRY.length
                  } nodes
                </div>

                <div className="px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-xs font-bold text-cyan-300">
                  {activeModel?.label ??
                    config.model}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 min-w-[240px]">
              {isRunning ? (
                <button
                  onClick={stopAgent}
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-red-500 hover:bg-red-400 transition font-black"
                >
                  <PauseCircle className="w-5 h-5" />
                  Stop Agent
                </button>
              ) : (
                <button
                  onClick={startAgent}
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition font-black"
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Agent
                </button>
              )}

              <button
                onClick={() =>
                  setConfig({
                    intervalMs:
                      config.intervalMs ===
                        30000
                        ? 15000
                        : 30000,
                  })
                }
                className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-bold"
              >
                <TimerReset className="w-5 h-5" />
                Interval:{" "}
                {
                  config.intervalMs /
                  1000
                }
                s
              </button>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {agentError && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-300 mt-0.5" />
            <div>
              <p className="font-black uppercase text-xs tracking-[0.3em] text-red-300 mb-1">
                Agent Error
              </p>
              <p className="text-sm text-red-200">
                {agentError}
              </p>
            </div>
          </div>
        )}

        {/* STATS */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              label: "Cycle",
              value: cycleCount,
              icon: Activity,
              color: "text-cyan-400",
            },
            {
              label: "Avg Risk",
              value:
                avgRisk || "—",
              icon: ShieldCheck,
              color: "text-orange-400",
            },
            {
              label: "Critical",
              value:
                criticalCount,
              icon: AlertTriangle,
              color: "text-red-400",
            },
            {
              label: "Pending",
              value:
                pendingTasks,
              icon: Cpu,
              color: "text-lime-400",
            },
            {
              label: "Coverage",
              value: `${coverage}%`,
              icon: Waves,
              color: "text-blue-400",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl p-5 border border-white/10 bg-white/[0.03]"
            >
              <div className="flex items-center justify-between mb-3">
                <card.icon
                  className={`w-5 h-5 ${card.color}`}
                />

                <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold">
                  {card.label}
                </span>
              </div>

              <div
                className={`text-3xl font-black ${card.color}`}
              >
                {card.value}
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* MODEL CONFIG */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3 mb-5">
                <Settings2 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">
                  Agent Model Configuration
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {MODEL_OPTIONS.map(
                  (model) => (
                    <button
                      key={model.id}
                      onClick={() =>
                        setConfig({
                          model:
                            model.id,
                        })
                      }
                      className={`rounded-2xl p-4 border text-left transition ${config.model ===
                          model.id
                          ? "border-cyan-400/30 bg-cyan-400/10"
                          : "border-white/10 bg-black/20"
                        }`}
                    >
                      <p className="font-bold text-white">
                        {
                          model.label
                        }
                      </p>

                      <p className="text-sm text-slate-400">
                        {
                          model.speed
                        }
                      </p>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* WORKFLOW */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center gap-3 mb-5">
                <Brain className="w-5 h-5 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">
                  Live Workflow
                </h2>
              </div>

              {currentWorkflow.length ===
                0 ? (
                <p className="text-slate-500">
                  Menunggu eksekusi
                  agent...
                </p>
              ) : (
                <div className="space-y-3">
                  {currentWorkflow.map(
                    (
                      step,
                      i
                    ) => (
                      <div
                        key={i}
                        className="flex gap-3 rounded-2xl p-4 border border-white/5 bg-black/20"
                      >
                        {step.status ===
                          "done" ? (
                          <CheckCircle2 className="w-5 h-5 text-lime-400 mt-0.5" />
                        ) : (
                          <Activity className="w-5 h-5 text-cyan-400 mt-0.5" />
                        )}

                        <div>
                          <p className="font-bold text-white">
                            {
                              step.stepName
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            {
                              step.output
                            }
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* ACTIVE NODE */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Active Coastal Node
              </h2>

              {currentCoast ? (
                <div>
                  <p className="text-cyan-400 font-bold text-lg">
                    {
                      currentCoast.name
                    }
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Lat:{" "}
                    {
                      currentCoast
                        .coords[0]
                    }
                    , Lng:{" "}
                    {
                      currentCoast
                        .coords[1]
                    }
                  </p>
                </div>
              ) : (
                <p className="text-slate-500">
                  Tidak ada node
                </p>
              )}
            </div>

            {/* LATEST INSIGHT */}
            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-cyan-400 mb-2">
                Latest Insight
              </p>

              <p className="text-cyan-100 leading-relaxed">
                {latestInsight ||
                  "Belum ada insight terbaru."}
              </p>
            </div>

            {/* RECENT ANALYSIS */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Recent Coast Status
              </h2>

              <div className="space-y-3 max-h-[320px] overflow-y-auto">
                {analysisValues
                  .slice()
                  .sort(
                    (a, b) =>
                      b.timestamp -
                      a.timestamp
                  )
                  .slice(0, 6)
                  .map((a) => (
                    <div
                      key={
                        a.coastName
                      }
                      className="rounded-2xl p-3 border border-white/5 bg-black/20"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-bold text-slate-200 text-sm">
                          {
                            a.coastName
                          }
                        </p>

                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-black border ${riskBgClass(
                            a.riskLevel
                          )}`}
                        >
                          {
                            a.riskScore
                          }
                        </span>
                      </div>

                      <p className="text-xs text-slate-500">
                        {
                          a.riskLevel
                        }{" "}
                        ·{" "}
                        {
                          a.prediction5yr
                        }
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}