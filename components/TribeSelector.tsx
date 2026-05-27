"use client";

import type { Locale } from "@/lib/content";
import { tribes } from "@/lib/content";
import { cn } from "@/lib/utils";

export function TribeSelector({
  locale,
  activeTribe,
  onChange,
  prophetVisualTier = null
}: {
  locale: Locale;
  activeTribe: number;
  onChange: (tribeId: number) => void;
  prophetVisualTier?: "silver" | "champion" | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tribes.map((tribe) => (
        <button
          key={tribe.id}
          type="button"
          onClick={() => onChange(tribe.id)}
          className={cn(
            "rounded-2xl border p-4 text-left transition",
            activeTribe === tribe.id
              ? prophetVisualTier === "champion"
                ? "border-lime-300 bg-lime-300/12 shadow-[0_0_22px_rgba(217,255,61,0.12)]"
                : prophetVisualTier === "silver"
                  ? "border-cyan-300 bg-cyan-300/12 shadow-[0_0_18px_rgba(123,223,242,0.1)]"
                  : "border-white/30 bg-white/12"
              : "border-white/10 bg-white/5 hover:bg-white/8"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: tribe.accent }}
              aria-hidden="true"
            />
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{tribe.code}</div>
            {activeTribe === tribe.id && prophetVisualTier ? (
              <div
                className={cn(
                  "ml-auto rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                  prophetVisualTier === "champion"
                    ? "bg-lime-300 text-slate-950"
                    : "bg-cyan-300 text-slate-950"
                )}
              >
                {prophetVisualTier === "champion"
                  ? locale === "zh"
                    ? "驻场"
                    : "Live"
                  : locale === "zh"
                    ? "洞察"
                    : "Insight"}
              </div>
            ) : null}
          </div>
          <div className="mt-3 text-sm font-semibold text-white">{tribe.name[locale]}</div>
          {activeTribe === tribe.id && prophetVisualTier === "champion" ? (
            <div className="mt-2 text-xs leading-5 text-lime-100/90">
              {locale === "zh" ? "冠军先知已驻场该部落" : "Champion Prophet is stationed here"}
            </div>
          ) : null}
          {activeTribe === tribe.id && prophetVisualTier === "silver" ? (
            <div className="mt-2 text-xs leading-5 text-cyan-100/90">
              {locale === "zh" ? "白银先知洞察已连接" : "Silver insight connected"}
            </div>
          ) : null}
        </button>
      ))}
    </div>
  );
}
