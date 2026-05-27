"use client";

import type { Locale, MarketCardItem } from "@/lib/content";
import { copy } from "@/lib/content";
import { localizeMatchName } from "@/lib/match-name";
import { cn } from "@/lib/utils";

type Props = {
  locale: Locale;
  market: MarketCardItem;
  outcome: number;
  onOutcomeChange: (outcome: number) => void;
  stake: string;
  onStakeChange: (stake: string) => void;
  isHype: boolean;
  onToggleHype: (value: boolean) => void;
  onSubmit: () => void;
  ctaLabel: string;
  helperText: string;
  utilityPanel?: {
    title: string;
    points: string[];
  } | null;
  prophetVisualTier?: "silver" | "champion" | null;
  disabled?: boolean;
  secondaryActionLabel?: string | null;
  onSecondaryAction?: () => void;
  secondaryDisabled?: boolean;
};

const outcomeLabels = {
  zh: ["主胜", "平局", "客胜"],
  en: ["Home", "Draw", "Away"]
} as const;

export function MarketCard({
  locale,
  market,
  outcome,
  onOutcomeChange,
  stake,
  onStakeChange,
  isHype,
  onToggleHype,
  onSubmit,
  ctaLabel,
  helperText,
  utilityPanel = null,
  prophetVisualTier = null,
  disabled = false,
  secondaryActionLabel = null,
  onSecondaryAction,
  secondaryDisabled = false
}: Props) {
  const t = copy[locale];
  const localizedMatch = localizeMatchName(market.match, locale);
  const momentumLabel = locale === "zh" ? "热度" : "Momentum";
  const kickoffLabel = locale === "zh" ? "开球时间" : "Kickoff";
  const deadlineLabel = locale === "zh" ? "下注截止" : "Bet Deadline";
  const poolLabel = locale === "zh" ? "当前奖池" : "Current Pool";
  const cardTone =
    prophetVisualTier === "champion"
      ? "border border-lime-300/35 bg-gradient-to-br from-lime-300/8 via-white/4 to-cyan-300/8 shadow-[0_0_40px_rgba(217,255,61,0.12)]"
      : prophetVisualTier === "silver"
        ? "border border-cyan-300/30 bg-gradient-to-br from-cyan-300/8 via-white/4 to-sky-400/8 shadow-[0_0_34px_rgba(123,223,242,0.1)]"
        : "glass";
  const utilityTone =
    prophetVisualTier === "champion"
      ? "border-lime-300/30 bg-lime-300/10"
      : "border-cyan-300/20 bg-cyan-300/10";
  const selectedOutcomeTone =
    prophetVisualTier === "champion"
      ? "border-lime-300/60 bg-lime-300/14 text-white"
      : prophetVisualTier === "silver"
        ? "border-cyan-300/55 bg-cyan-300/14 text-white"
        : "border-amber-300/40 bg-amber-300/12 text-white";
  const submitTone =
    prophetVisualTier === "champion"
      ? "from-lime-300 via-yellow-300 to-amber-400"
      : prophetVisualTier === "silver"
        ? "from-cyan-300 via-sky-300 to-blue-400"
        : "from-amber-300 via-orange-400 to-rose-500";
  const auraLabel =
    prophetVisualTier === "champion"
      ? locale === "zh"
        ? "冠军模式"
        : "Champion Mode"
      : prophetVisualTier === "silver"
        ? locale === "zh"
          ? "先知洞察"
          : "Prophet Insight"
        : null;

  return (
    <div className={`${cardTone} rounded-[28px] p-6 fade-up stagger-2`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-[0.24em] text-amber-200">{market.stage}</div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h3 className="min-w-0 text-2xl font-semibold text-white">{localizedMatch}</h3>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_18px_rgba(123,223,242,0.18)]">
              <span className="text-xs uppercase tracking-[0.2em] text-cyan-200/85">{momentumLabel}</span>
              <span className="text-base font-semibold text-white">{market.momentum}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/10 bg-white/8 px-4 py-3 font-medium">
              {`${kickoffLabel} · ${market.kickoff}`}
            </span>
            <span className="rounded-full border border-white/10 bg-white/8 px-4 py-3 font-medium">
              {`${deadlineLabel} · ${market.deadline}`}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-amber-300 bg-amber-300 px-4 py-3 font-semibold text-slate-950 shadow-[0_0_24px_rgba(245,193,106,0.35)]">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-900/75">{poolLabel}</span>
              <span className="text-sm font-semibold text-slate-950">{market.prizePool}</span>
            </span>
            {auraLabel ? (
              <span className="rounded-full border border-white/12 bg-white/10 px-4 py-3 text-white">
                {auraLabel}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {market.hottestCall ? <p className="mt-4 text-sm leading-6 text-slate-300">{market.hottestCall}</p> : null}

      {utilityPanel ? (
        <div className={`mt-5 rounded-[24px] border p-4 ${utilityTone}`}>
          <div className="text-xs uppercase tracking-[0.24em] text-cyan-200">{utilityPanel.title}</div>
          <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
            {utilityPanel.points.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{t.chooseSide}</div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {outcomeLabels[locale].map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => onOutcomeChange(index)}
              className={cn(
                "rounded-2xl border px-4 py-4 text-sm font-semibold transition",
                outcome === index
                  ? selectedOutcomeTone
                  : "border-white/10 bg-white/5 text-slate-300 hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="text-xs uppercase tracking-[0.24em] text-slate-400">{t.stake}</label>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <input
            value={stake}
            onChange={(event) => onStakeChange(event.target.value)}
            className="w-full bg-transparent text-lg text-white outline-none"
            placeholder="0.05"
            inputMode="decimal"
          />
          <span className="text-sm text-slate-400">OKB</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onToggleHype(!isHype)}
        className={cn(
          "mt-5 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition",
          isHype
            ? prophetVisualTier === "champion"
              ? "border-lime-300/35 bg-lime-300/12"
              : prophetVisualTier === "silver"
                ? "border-cyan-300/35 bg-cyan-300/12"
                : "border-rose-300/35 bg-rose-300/12"
            : "border-white/10 bg-white/5 hover:bg-white/8"
        )}
      >
        <div>
          <div className="text-sm font-semibold text-white">{t.hypeMode}</div>
          <div className="mt-1 text-xs text-slate-300">
            {locale === "zh"
              ? "多付 10%，其中 4% 进 Hype 池、4% 归协议收入、2% 用于增长激励"
              : "Pay 10% extra: 4% funds the Hype pool, 4% goes to protocol revenue, and 2% to growth incentives"}
          </div>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-200">
          {isHype ? "ON" : "OFF"}
        </div>
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className={`mt-5 w-full rounded-2xl bg-gradient-to-r ${submitTone} px-5 py-4 text-base font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-55`}
      >
        {ctaLabel}
      </button>
      {secondaryActionLabel && onSecondaryAction ? (
        <button
          type="button"
          onClick={onSecondaryAction}
          disabled={secondaryDisabled}
          className="mt-3 w-full rounded-2xl border border-white/12 bg-white/6 px-5 py-4 text-base font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-45"
        >
          {secondaryActionLabel}
        </button>
      ) : null}
      {helperText ? <p className="mt-3 text-sm leading-6 text-slate-300">{helperText}</p> : null}
    </div>
  );
}
