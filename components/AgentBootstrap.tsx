"use client";

import { useEffect, useRef } from "react";
import { useAgentStore } from "@/lib/agentStore";

export default function AgentBootstrap() {
    const startedRef = useRef(false);

    useEffect(() => {
        const state = useAgentStore.getState();

        // Hindari double start saat StrictMode / rerender
        if (startedRef.current) return;
        startedRef.current = true;

        // Jika sebelumnya running, lanjutkan lagi
        if (state.agentStatus === "running") {
            state.startAgent();
        }

        // Subscribe untuk memastikan kalau status running tapi timer hilang
        const unsub = useAgentStore.subscribe((s) => {
            if (s.agentStatus === "running") {
                const current = useAgentStore.getState();
                current.startAgent();
            }
        });

        return () => {
            unsub();
        };
    }, []);

    return null;
}