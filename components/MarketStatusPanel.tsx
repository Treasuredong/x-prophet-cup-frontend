"use client";

import type { Locale } from "@/lib/content";

type Props = {
  locale: Locale;
  isConfigured: boolean;
  marketCount: number;
  rewardPool: string;
  hypePool: string;
  protocolRevenuePool: string;
  growthPool: string;
  totalVolume: string;
  outcomeWeights: string[];
  resolved: boolean;
  winningOutcome: number | null;
  currentPositionText: string;
  explorerContractUrl: string;
};

const outcomeCopy = {
  zh: ["主胜", "平局", "客胜"],
  en: ["Home", "Draw", "Away"]
} as const;

export function MarketStatusPanel({
  locale,
  isConfigured,
  marketCount,
  rewardPool,
  hypePool,
  protocolRevenuePool,
  growthPool,
  totalVolume,
  outcomeWeights,
  resolved,
  winningOutcome,
  currentPositionText,
  explorerContractUrl
}: Props) {
  return (
    <section className="glass rounded-[28px] p-6 fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
            {locale === "zh" ? "链上状态" : "On-chain Status"}
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {resolved
              ? locale === "zh"
                ? "市场已开奖"
                : "Resolved"
              : locale === "zh"
                ? "市场开放中"
                : "Open"}
          </h2>
        </div>
        <a
          href={explorerContractUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300"
        >
          {locale === "zh" ? "查看合约 Explorer" : "Open Contract Explorer"}
        </a>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          {
            label: locale === "zh" ? "链上市场数" : "Market Count",
            value: `${marketCount}`
          },
          {
            label: locale === "zh" ? "奖励池" : "Reward Pool",
            value: rewardPool
          },
          {
            label: locale === "zh" ? "狂热池" : "Hype Pool",
            value: hypePool
          },
          {
            label: locale === "zh" ? "协议收入池" : "Protocol Revenue",
            value: protocolRevenuePool
          },
          {
            label: locale === "zh" ? "增长激励池" : "Growth Pool",
            value: growthPool
          },
          {
            label: locale === "zh" ? "总成交量" : "Total Volume",
            value: totalVolume
          }
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
            <div className="mt-2 text-xl font-semibold text-white">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {outcomeWeights.map((weight, index) => (
          <div key={`${index}-${weight}`} className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {outcomeCopy[locale][index]}
            </div>
            <div className="mt-2 text-lg font-semibold text-white">{weight}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-white/5 p-4 text-sm leading-6 text-slate-300">
        <div>
          {locale === "zh" ? "我的当前仓位：" : "My current position:"} {currentPositionText}
        </div>
        <div className="mt-2">
          {resolved && winningOutcome !== null
            ? locale === "zh"
              ? `本场胜出结果：${outcomeCopy.zh[winningOutcome]}`
              : `Winning outcome: ${outcomeCopy.en[winningOutcome]}`
            : locale === "zh"
              ? "开奖后这里会展示胜出结果和可结算状态。"
              : "The winner and settlement status appear here after resolution."}
        </div>
        <div className="mt-2">
          {isConfigured
            ? locale === "zh"
              ? "当前已连接真实合约读写。"
              : "Live contract reads and writes are enabled."
            : locale === "zh"
              ? "当前还未接入合约地址，页面暂时展示产品预热数据。"
              : "No contract is connected yet, so the page is temporarily showing product warm-up data."}
        </div>
      </div>
    </section>
  );
}
