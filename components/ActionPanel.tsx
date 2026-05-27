"use client";

import type { Locale } from "@/lib/content";

type Props = {
  locale: Locale;
  hasPosition: boolean;
  isResolved: boolean;
  isSettled: boolean;
  isPendingBet: boolean;
  isPendingSettle: boolean;
  isConnected: boolean;
  isConfigured: boolean;
  isOnSupportedChain: boolean;
  onBet: () => void;
  onSettle: () => void;
};

export function ActionPanel({
  locale,
  hasPosition,
  isResolved,
  isSettled,
  isPendingBet,
  isPendingSettle,
  isConnected,
  isConfigured,
  isOnSupportedChain,
  onBet,
  onSettle
}: Props) {
  const settleCopy =
    locale === "zh"
      ? isSettled
        ? "已结算"
        : isPendingSettle
          ? "结算中..."
          : "领取奖励 / 更新连胜"
      : isSettled
        ? "Settled"
        : isPendingSettle
          ? "Settling..."
          : "Claim Reward / Update Streak";

  const helperCopy =
    locale === "zh"
      ? !isConnected
        ? "先连接钱包，页面才能读取你的个人战绩并准备下注。"
        : !isOnSupportedChain
          ? "钱包已连接，但当前网络不对。先切换到 X Layer 主网，再发起下注或结算。"
        : !isConfigured
          ? "当前还没有接入测试网合约，所以发送下注交易不会真正把资金写入链上。"
          : "如果市场已开奖且你已有仓位，这里可以直接触发结算领取。"
      : !isConnected
        ? "Connect your wallet first so the app can read your streak and prepare the bet flow."
        : !isOnSupportedChain
          ? "Your wallet is connected, but the active network is wrong. Switch to X Layer mainnet before betting or settling."
        : !isConfigured
          ? "The mainnet contract is not connected yet, so this bet action will not reach a live on-chain market."
          : "If the market is resolved and you hold a position, settle here to claim rewards.";

  return (
    <section className="glass rounded-[28px] p-6 fade-up">
      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Actions</div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={onBet}
          disabled={isPendingBet || !isConnected || !isOnSupportedChain}
          className="rounded-2xl bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 px-5 py-4 text-base font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPendingBet
            ? locale === "zh"
              ? "下注提交中..."
              : "Submitting bet..."
            : locale === "zh"
              ? "发送下注交易"
              : "Send Bet Transaction"}
        </button>
        <button
          type="button"
          onClick={onSettle}
          disabled={!hasPosition || !isResolved || isSettled || isPendingSettle || !isOnSupportedChain}
          className="rounded-2xl border border-white/12 bg-white/6 px-5 py-4 text-base font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-45"
        >
          {settleCopy}
        </button>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-300">{helperCopy}</p>
    </section>
  );
}
