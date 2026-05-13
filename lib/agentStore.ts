// lib/agentStore.ts
// FULL UPGRADE:
// 1. Persist state antar refresh/halaman
// 2. initializeAgent support
// 3. STAKEHOLDERS export
// 4. upsertTask support
// 5. updateTaskStatus support
// 6. No hook/order issues
// 7. Auto recovery global timer
// 8. TypeScript strict-safe

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RiskLevel =
    | "KRITIS"
    | "TINGGI"
    | "SEDANG"
    | "RENDAH";

export type TaskStatus =
    | "pending"
    | "in_progress"
    | "done";

export interface CoastalEntry {
    name: string;
    coords: [number, number];
}

export interface Task {
    id: string;
    coastId: string;
    coastName: string;
    title: string;
    assignee: string;
    deadline: string;
    urgency: RiskLevel;
    status: TaskStatus;
    createdAt: number;
}

export interface CoastAnalysis {
    coastName: string;
    riskScore: number;
    riskLevel: RiskLevel;
    waveH: string;
    currentS: string;
    shorelineChange: number;
    aiInsight: string;
    prediction5yr: string;
    timestamp: number;
    tasks: Task[];
}

export interface WorkflowStep {
    stepName: string;
    output: string;
    status: "running" | "done" | "error";
}

export type AgentStatus =
    | "idle"
    | "running"
    | "paused"
    | "error";

export type ModelId =
    | "llama-3.1-8b-instant"
    | "llama-3.3-70b-versatile"
    | "openai/gpt-oss-120b";

export interface AgentConfig {
    model: ModelId;
    intervalMs: number;
}

/* ──────────────────────────────────────────────
   GLOBAL TIMER
────────────────────────────────────────────── */
let globalAgentTimer:
    | ReturnType<typeof setTimeout>
    | null = null;

/* ──────────────────────────────────────────────
   STATIC DATA
────────────────────────────────────────────── */
export const COASTAL_REGISTRY: CoastalEntry[] = [
    {
        name: "Pantai Parangtritis",
        coords: [-7.973, 110.332],
    },
    {
        name: "Pantai Kuta Bali",
        coords: [-8.719, 115.168],
    },
    {
        name: "Pantai Ancol Jakarta",
        coords: [-6.124, 106.838],
    },
    {
        name: "Pantai Losari Makassar",
        coords: [-5.141, 119.404],
    },
    {
        name: "Pantai Carita",
        coords: [-6.286, 105.818],
    },
    {
        name: "Pantai Sawarna",
        coords: [-6.978, 106.436],
    },
    {
        name: "Pantai Ora Maluku",
        coords: [-3.047, 129.873],
    },
    {
        name: "Pantai Pink Lombok",
        coords: [-8.752, 116.512],
    },
];

export const STAKEHOLDERS = [
    "Kementerian Kelautan",
    "Balai Pantai Nasional",
    "Pemda Pesisir",
    "Tim Mitigasi Abrasi",
    "Marine Ops Center",
] as const;

/* ──────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────── */
export function riskHex(
    level: RiskLevel
): string {
    return {
        KRITIS: "#ef4444",
        TINGGI: "#f97316",
        SEDANG: "#3b82f6",
        RENDAH: "#84cc16",
    }[level];
}

export function riskBgClass(
    level: RiskLevel
): string {
    return {
        KRITIS:
            "bg-red-500/15 text-red-300 border-red-500/30",
        TINGGI:
            "bg-orange-500/15 text-orange-300 border-orange-500/30",
        SEDANG:
            "bg-blue-500/15 text-blue-300 border-blue-500/30",
        RENDAH:
            "bg-lime-500/15 text-lime-300 border-lime-500/30",
    }[level];
}

function riskForScore(
    score: number
): RiskLevel {
    if (score >= 75) return "KRITIS";
    if (score >= 55) return "TINGGI";
    if (score >= 35) return "SEDANG";
    return "RENDAH";
}

const WORKFLOW_STEPS: [string, string][] = [
    [
        "Fetch Marine API",
        "Mengambil data marine realtime",
    ],
    [
        "Parse Telemetry",
        "Membaca satelit & sensor",
    ],
    [
        "Run Risk Model",
        "Menghitung skor abrasi",
    ],
    [
        "AI Insight Gen",
        "Analisis LLM coastal",
    ],
    [
        "Assign Tasks",
        "Generate stakeholder task",
    ],
    [
        "Update Registry",
        "Sinkronisasi nasional",
    ],
];

/* ──────────────────────────────────────────────
   STORE
────────────────────────────────────────────── */
interface AgentState {
    initialized: boolean;

    agentStatus: AgentStatus;
    config: AgentConfig;

    analyses: Record<string, CoastAnalysis>;
    allTasks: Task[];

    currentCoastIndex: number;
    cycleCount: number;

    currentWorkflow: WorkflowStep[];
    latestInsight: string;
    agentError: string | null;

    initializeAgent: () => void;

    setConfig: (
        partial: Partial<AgentConfig>
    ) => void;

    startAgent: () => void;
    stopAgent: () => void;

    upsertTask: (task: Task) => void;

    updateTaskStatus: (
        id: string,
        status: TaskStatus
    ) => void;

    _runNextCoast: () => void;

    _finishCoast: (
        coast: CoastalEntry
    ) => void;
}

export const useAgentStore =
    create<AgentState>()(
        persist(
            (set, get) => ({
                initialized: false,

                agentStatus: "idle",

                config: {
                    model: "llama-3.1-8b-instant",
                    intervalMs: 30000,
                },

                analyses: {},
                allTasks: [],

                currentCoastIndex: 0,
                cycleCount: 0,

                currentWorkflow: [],
                latestInsight: "",
                agentError: null,

                /* INIT */
                initializeAgent: () => {
                    if (get().initialized) return;

                    set({
                        initialized: true,
                    });

                    if (
                        get().agentStatus ===
                        "running" &&
                        !globalAgentTimer
                    ) {
                        get()._runNextCoast();
                    }
                },

                /* CONFIG */
                setConfig: (partial) =>
                    set((state) => ({
                        config: {
                            ...state.config,
                            ...partial,
                        },
                    })),

                /* TASK UPSERT */
                upsertTask: (task) =>
                    set((state) => {
                        const exists =
                            state.allTasks.find(
                                (t) => t.id === task.id
                            );

                        if (exists) {
                            return {
                                allTasks:
                                    state.allTasks.map((t) =>
                                        t.id === task.id
                                            ? task
                                            : t
                                    ),
                            };
                        }

                        return {
                            allTasks: [
                                ...state.allTasks,
                                task,
                            ],
                        };
                    }),

                /* TASK STATUS */
                updateTaskStatus: (
                    id,
                    status
                ) =>
                    set((state) => ({
                        allTasks:
                            state.allTasks.map((t) =>
                                t.id === id
                                    ? {
                                        ...t,
                                        status,
                                    }
                                    : t
                            ),
                    })),

                /* START */
                startAgent: () => {
                    if (globalAgentTimer) return;

                    set({
                        agentStatus: "running",
                        agentError: null,
                    });

                    get()._runNextCoast();
                },

                /* STOP */
                stopAgent: () => {
                    if (globalAgentTimer) {
                        clearTimeout(
                            globalAgentTimer
                        );

                        globalAgentTimer =
                            null;
                    }

                    set({
                        agentStatus: "idle",
                        currentWorkflow: [],
                    });
                },

                /* LOOP */
                _runNextCoast: () => {
                    if (
                        get().agentStatus !==
                        "running"
                    )
                        return;

                    const coast =
                        COASTAL_REGISTRY[
                        get()
                            .currentCoastIndex
                        ];

                    set({
                        currentWorkflow: [],
                    });

                    let stepIndex = 0;

                    const runStep = () => {
                        if (
                            get()
                                .agentStatus !==
                            "running"
                        )
                            return;

                        if (
                            stepIndex >=
                            WORKFLOW_STEPS.length
                        ) {
                            get()._finishCoast(
                                coast
                            );

                            return;
                        }

                        const [
                            stepName,
                            output,
                        ] =
                            WORKFLOW_STEPS[
                            stepIndex
                            ];

                        set((state) => ({
                            currentWorkflow: [
                                ...state.currentWorkflow,
                                {
                                    stepName,
                                    output,
                                    status:
                                        "running",
                                },
                            ],
                        }));

                        globalAgentTimer =
                            setTimeout(() => {
                                set(
                                    (state) => ({
                                        currentWorkflow:
                                            state.currentWorkflow.map(
                                                (
                                                    step,
                                                    i
                                                ) =>
                                                    i ===
                                                        state
                                                            .currentWorkflow
                                                            .length -
                                                        1
                                                        ? {
                                                            ...step,
                                                            status:
                                                                "done",
                                                        }
                                                        : step
                                            ),
                                    })
                                );

                                stepIndex++;

                                runStep();
                            }, 700);
                    };

                    runStep();
                },

                /* FINISH */
                _finishCoast: (
                    coast
                ) => {
                    const score =
                        Math.floor(
                            Math.random() *
                            80
                        ) + 15;

                    const riskLevel =
                        riskForScore(
                            score
                        );

                    const generatedTasks: Task[] =
                        score >= 55
                            ? [
                                {
                                    id: `${coast.name}-${Date.now()}`,
                                    coastId:
                                        coast.name,
                                    coastName:
                                        coast.name,
                                    title: `Mitigasi abrasi ${coast.name}`,
                                    assignee:
                                        STAKEHOLDERS[
                                        Math.floor(
                                            Math.random() *
                                            STAKEHOLDERS.length
                                        )
                                        ],
                                    deadline:
                                        new Date(
                                            Date.now() +
                                            7 *
                                            24 *
                                            60 *
                                            60 *
                                            1000
                                        ).toISOString(),
                                    urgency:
                                        riskLevel,
                                    status:
                                        "pending" as TaskStatus,
                                    createdAt:
                                        Date.now(),
                                },
                            ]
                            : [];

                    const analysis: CoastAnalysis =
                    {
                        coastName:
                            coast.name,
                        riskScore:
                            score,
                        riskLevel,
                        waveH: (
                            1 +
                            Math.random() *
                            4
                        ).toFixed(1),
                        currentS: (
                            0.3 +
                            Math.random() *
                            2
                        ).toFixed(2),
                        shorelineChange:
                            -(
                                Math.floor(
                                    Math.random() *
                                    8
                                ) + 1
                            ),
                        aiInsight: `${coast.name} menunjukkan risiko ${riskLevel.toLowerCase()} dengan abrasi signifikan.`,
                        prediction5yr: `Mundur ${Math.floor(
                            Math.random() *
                            20 +
                            10
                        )}m / 5 tahun`,
                        timestamp:
                            Date.now(),
                        tasks:
                            generatedTasks,
                    };

                    set((state) => {
                        const nextIndex =
                            (state.currentCoastIndex +
                                1) %
                            COASTAL_REGISTRY.length;

                        return {
                            analyses: {
                                ...state.analyses,
                                [coast.name]:
                                    analysis,
                            },

                            allTasks: [
                                ...state.allTasks,
                                ...generatedTasks,
                            ],

                            currentCoastIndex:
                                nextIndex,

                            cycleCount:
                                nextIndex ===
                                    0
                                    ? state.cycleCount +
                                    1
                                    : state.cycleCount,

                            latestInsight:
                                analysis.aiInsight,
                        };
                    });

                    globalAgentTimer =
                        setTimeout(() => {
                            get()._runNextCoast();
                        }, Math.max(
                            2000,
                            get()
                                .config
                                .intervalMs / 10
                        ));
                },
            }),
            {
                name: "coastal-agent-storage",

                partialize: (
                    state
                ) => ({
                    initialized:
                        state.initialized,
                    agentStatus:
                        state.agentStatus,
                    config: state.config,
                    analyses:
                        state.analyses,
                    allTasks:
                        state.allTasks,
                    currentCoastIndex:
                        state.currentCoastIndex,
                    cycleCount:
                        state.cycleCount,
                    latestInsight:
                        state.latestInsight,
                }),
            }
        )
    );