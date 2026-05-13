export function InfoPanel({ selected }: { selected: string }) {
    const data = {
        Manggar: {
            risk: 87,
            status: "Urgent",
            desc: "Abrasi meningkat akibat gelombang ekstrem",
        },
    };

    const info = data[selected as keyof typeof data];

    if (!info) return null;

    return (
        <div className="absolute right-4 top-4 w-[380px] h-[95%] bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-y-auto">

            <h2 className="text-2xl font-black text-white">{selected}</h2>

            <div className="mt-4 text-red-400 font-bold">
                Status: {info.status}
            </div>

            <p className="text-slate-300 mt-4 text-sm">
                {info.desc}
            </p>

            <div className="mt-6 text-cyan-400">
                Risk Score: {info.risk}%
            </div>

        </div>
    );
}