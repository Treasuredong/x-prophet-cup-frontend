"use client";

import Image from "next/image";
import type { Locale } from "@/lib/content";
import {
  LOCKED_PROPHET_IMAGE,
  PROPHET_TIERS,
  getActiveProphetTier,
  getTierProgressText,
  getUnlockedProphetTiers
} from "@/lib/prophet-nft";

export function ProphetNftModal({
  locale,
  bestStreak,
  minted,
  open,
  onClose,
  onShare
}: {
  locale: Locale;
  bestStreak: number;
  minted: boolean;
  open: boolean;
  onClose: () => void;
  onShare: (tierName: string) => void;
}) {
  if (!open) {
    return null;
  }

  const activeTier = getActiveProphetTier(bestStreak, minted);
  const unlockedTiers = getUnlockedProphetTiers(bestStreak, minted);

  const title = locale === "zh" ? "先知 NFT 陈列室" : "Prophet NFT Gallery";
  const subtitle =
    locale === "zh"
      ? "这里的解锁条件统一按历史最佳连胜计算，不会因为后续猜错而掉档。解锁一次就是永久获得对应身份和功能。"
      : "Unlocks are based on your best-ever streak, so you never lose a tier after a miss. Once unlocked, the identity and utility stay with you.";

  const valuePoints =
    locale === "zh"
      ? [
          "链上战绩证明：让预测能力可验证、可截图、可传播。",
          "成长玩法分层：三档 NFT 对应三种不同的用户层级和可见功能。",
          "SocialFi 闭环：每一档都能把你的预测成绩转成更强的分享动机。"
        ]
      : [
          "On-chain proof of skill that is verifiable, screenshot-ready, and shareable.",
          "Layered progression: the three tiers map to different user levels and visible product utility.",
          "A SocialFi loop: every tier creates a stronger reason to share and compete publicly."
        ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/82 px-4 py-8 backdrop-blur">
      <div className="flex min-h-full items-start justify-center md:items-center">
        <div className="relative my-auto w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-[#09111f] shadow-2xl">
          <div className="absolute -left-12 top-12 h-40 w-40 rounded-full bg-amber-300/18 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-cyan-300/12 blur-3xl" />
          <div className="relative max-h-[88vh] overflow-y-auto p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-3xl">
                <div className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-amber-100">
                  {locale === "zh" ? "成长型身份系统" : "Progression Identity System"}
                </div>
                <h3 className="mt-4 text-3xl font-semibold text-white md:text-4xl">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">{subtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="sticky top-0 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-white transition hover:bg-white/12"
              >
                {locale === "zh" ? "关闭" : "Close"}
              </button>
            </div>

            <div className="mt-6 rounded-[26px] border border-white/10 bg-white/5 p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                {locale === "zh" ? "当前先知等级" : "Current Prophet Tier"}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100">
                  {activeTier ? activeTier.name[locale] : locale === "zh" ? "尚未解锁" : "Not unlocked yet"}
                </div>
                <div className="text-sm text-slate-300">
                  {locale === "zh"
                    ? `你的历史最佳连胜为 ${bestStreak} 场`
                    : `Your best streak so far is ${bestStreak}`}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {activeTier
                  ? activeTier.shortPerk[locale]
                  : locale === "zh"
                    ? "先完成历史最佳 3 连胜，首张先知 NFT 会自动铸造，并开始解锁先知身份功能。"
                    : "Reach a best streak of 3 first. Your first Prophet NFT will auto-mint and unlock the Prophet identity system."}
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {PROPHET_TIERS.map((tier) => {
                const unlocked = unlockedTiers.some((item) => item.id === tier.id);

                return (
                  <div
                    key={tier.id}
                    className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br ${tier.accent} p-[1px]`}
                  >
                    <div className="h-full rounded-[27px] bg-slate-950/88 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                            {locale === "zh"
                              ? `历史最佳连胜 ${tier.threshold}+`
                              : `${tier.threshold}+ best streak`}
                          </div>
                          <div className="mt-2 text-xl font-semibold text-white">{tier.name[locale]}</div>
                        </div>
                        <div
                          className={
                            unlocked
                              ? "rounded-full border-2 border-emerald-300 bg-emerald-300/12 px-3 py-1 text-xs font-semibold text-emerald-200"
                              : "rounded-full border-2 border-white bg-white/6 px-3 py-1 text-xs font-semibold text-slate-200"
                          }
                        >
                          {unlocked
                            ? locale === "zh"
                              ? "已解锁"
                              : "Unlocked"
                            : locale === "zh"
                              ? "待解锁"
                              : "Locked"}
                        </div>
                      </div>

                      <div className="relative mt-5 overflow-hidden rounded-[24px] border border-white/10">
                        <Image
                          src={unlocked ? tier.image : LOCKED_PROPHET_IMAGE}
                          alt={unlocked ? tier.name[locale] : locale === "zh" ? "待解锁先知 NFT" : "Locked Prophet NFT"}
                          width={1200}
                          height={1200}
                          className="h-auto w-full"
                        />
                        {!unlocked ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/42">
                            <div className="rounded-full border-2 border-white bg-slate-950/70 px-4 py-2 text-sm font-semibold text-white">
                              {locale === "zh" ? "命中条件后解锁" : "Unlock by hitting the rule"}
                            </div>
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-4 rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
                        <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                          {locale === "zh" ? "解锁条件" : "Unlock Rule"}
                        </div>
                        <p className="mt-2">{getTierProgressText(locale, tier.threshold, bestStreak, unlocked)}</p>
                      </div>

                      <div className="mt-4 rounded-[20px] border border-white/10 bg-black/20 p-4">
                        <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                          {locale === "zh" ? "已落地权益" : "Live Utility"}
                        </div>
                        <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                          {tier.utilities[locale].map((item) => (
                            <p key={item}>{item}</p>
                          ))}
                        </div>
                      </div>

                      {unlocked ? (
                        <button
                          type="button"
                          onClick={() => onShare(tier.name[locale])}
                          className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-300 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:brightness-105"
                        >
                          <span aria-hidden="true">🔥</span>
                          {locale === "zh" ? "晒出我的先知 NFT" : "Share My Prophet NFT"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  {locale === "zh" ? "NFT 玩法" : "How the NFT Works"}
                </div>
                <div className="mt-4 space-y-3 text-sm leading-7 text-slate-200">
                  <p>
                    {locale === "zh"
                      ? "1. 我们用历史最佳连胜，而不是当前连胜，来做永久解锁条件，避免用户掉档后失去成就感。"
                      : "1. We use best-ever streaks, not current streaks, as permanent unlock rules so users do not lose progress after a miss."}
                  </p>
                  <p>
                    {locale === "zh"
                      ? "2. 青铜、白银、冠军三档分别对应身份炫耀、下注辅助、冠军宣战三种不同玩法层。"
                      : "2. Bronze, Silver, and Champion map to three product layers: identity flex, betting assistance, and champion-grade challenge."}
                  </p>
                  <p>
                    {locale === "zh"
                      ? "3. 所有当前版本已落地的权益都在卡片里可见，确保 NFT 不是空泛承诺。"
                      : "3. Every utility shown here is tied to visible in-product behavior so the NFT does not feel like empty futureware."}
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-amber-300/30 bg-gradient-to-br from-amber-300/12 via-white/6 to-cyan-300/10 p-6">
                <div className="text-xs uppercase tracking-[0.24em] text-amber-100">
                  {locale === "zh" ? "为什么它有价值" : "Why It Matters"}
                </div>
                <div className="mt-4 space-y-3 text-sm leading-7 text-white">
                  {valuePoints.map((point) => (
                    <p key={point}>{point}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
