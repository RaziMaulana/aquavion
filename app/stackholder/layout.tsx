"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Settings } from "lucide-react";

const navLinks = [
  { href: "/stackholder/dashboard", label: "Dashboard" },
  { href: "/stackholder/report", label: "Report" },
  { href: "/stackholder/job", label: "Job Task" },
  { href: "/stackholder/history", label: "History" },
];

export default function StakeholderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-[#031427] text-[#d3e4fe]">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

          {/* BRAND */}
          <div className="text-cyan-400 font-black text-lg tracking-wide uppercase">
            OquaVion
          </div>

          {/* NAV */}
          <nav className="hidden md:flex items-center gap-10 text-sm">
            {navLinks.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition font-medium ${active
                      ? "text-cyan-400 border-b-2 border-cyan-400 pb-1"
                      : "text-slate-400 hover:text-white"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ACTION */}
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-cyan-400 transition">
              <Bell className="w-5 h-5" />
            </button>

            <button className="text-slate-400 hover:text-cyan-400 transition">
              <Settings className="w-5 h-5" />
            </button>

            <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-400/30">
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 pt-20 pb-10">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950/80 py-6 px-6 lg:px-10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="text-xs text-slate-400">
            <span className="text-white font-bold">CoastalGuard ID</span> ·
            {" "}© 2024 Indonesian Maritime Agency
          </div>

          <div className="flex gap-6 text-xs">
            {["Privacy", "Terms", "Data", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-slate-500 hover:text-cyan-300 transition"
              >
                {item}
              </a>
            ))}
          </div>

        </div>
      </footer>

    </div>
  );
}