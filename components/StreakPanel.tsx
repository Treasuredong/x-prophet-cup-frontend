"use client";

import type { Locale } from "@/lib/content";
import { copy } from "@/lib/content";
import { getActiveProphetTier } from "@/lib/prophet-nft";

export function StreakPanel({
  locale,
  streak,
  bestStreak,
  minted
}: {
  locale: Locale;
  streak: number;
  bestStreak: number;
  minted: boolean;
}) {
  const t = copy[locale];
  const progress = Math.min((streak / 3) * 100, 100);
  const activeTier = getActiveProphetTier(bestStreak, minted);
  const panelTone =
    activeTier?.id === "champion"
      ? "border border-lime-300/40 bg-gradient-to-br from-lime-300/10 via-amber-300/8 to-cyan-300/10 shadow-[0_0_40px_rgba(217,255,61,0.12)]"
      : activeTier?.id === "silver"
        ? "border border-cyan-300/30 bg-gradient-to-br from-cyan-300/10 via-white/5 to-sky-400/10 shadow-[0_0_34px_rgba(123,223,242,0.1)]"
        : "glass";
  const badgeTone =
    activeTier?.id === "champion"
      ? "border-lime-300/50 bg-lime-300/12 text-lime-100"
      : activeTier?.id === "silver"
        ? "border-cyan-300/40 bg-cyan-300/12 text-cyan-100"
        : "border-amber-300/30 bg-amber-300/10 text-amber-100";
  const identityTone =
    activeTier?.id === "champion"
      ? "border-lime-300/30 bg-lime-300/10 text-lime-100"
      : activeTier?.id === "silver"
        ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
        : "border-amber-300/30 bg-amber-300/10 text-amber-100";
  const identityIcon =
    activeTier?.id === "champion" ? "👑" : activeTier?.id === "silver" ? "⚡" : activeTier ? "🔥" : "🔒";

  return (
    <div className={`${panelTone} rounded-[28px] p-6 fade-up stagger-1`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{t.streakCard}</div>
          <div className="mt-3 text-5xl font-semibold text-white">{streak}</div>
        </div>
        <div className={`rounded-full border px-4 py-2 text-sm ${badgeTone}`}>
          {minted ? "NFT Minted" : `${3 - Math.min(streak, 3)} ${locale === "zh" ? "场" : "wins"}`}
        </div>
      </div>
      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-5 rounded-[22px] border border-white/10 bg-white/5 p-4">
        <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
          {locale === "zh" ? "先知身份" : "Prophet Identity"}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <div className={`rounded-full border px-3 py-1 text-sm font-semibold ${identityTone}`}>
            {identityIcon} {activeTier ? activeTier.name[locale] : locale === "zh" ? "待解锁" : "Locked"}
          </div>
          <div className="text-sm text-slate-300">
            {activeTier
              ? activeTier.shortPerk[locale]
              : locale === "zh"
                ? "历史最佳 3 连胜后自动开启先知身份系统。"
                : "Unlocks automatically once your best streak reaches 3."}
          </div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-slate-300">
        <div className="rounded-2xl bg-white/5 p-4">
          <div className="text-slate-400">{t.bestStreak}</div>
          <div className="mt-2 text-2xl text-white">{bestStreak}</div>
        </div>
        <div className="rounded-2xl bg-white/5 p-4">
          <div className="text-slate-400">{t.nextMint}</div>
          <div className="mt-2 text-2xl text-white">{minted ? "0" : Math.max(3 - streak, 0)}</div>
        </div>
      </div>
    </div>
  );
}
