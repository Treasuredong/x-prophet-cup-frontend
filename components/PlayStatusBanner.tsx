"use client";

import type { Locale } from "@/lib/content";
import { cn } from "@/lib/utils";

type Props = {
  locale: Locale;
  isConnected: boolean;
  isConfigured: boolean;
  isOnSupportedChain: boolean;
};

export function PlayStatusBanner({ locale, isConnected, isConfigured, isOnSupportedChain }: Props) {
  const status = !isConnected ? "wallet" : !isOnSupportedChain ? "network" : !isConfigured ? "demo" : "live";

  const tone =
    status === "live"
      ? "border-emerald-300/20 bg-emerald-300/8 text-emerald-100"
      : status === "network"
        ? "border-amber-300/20 bg-amber-300/10 text-amber-100"
      : status === "demo"
        ? "border-amber-300/20 bg-amber-300/10 text-amber-100"
        : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";

  const title =
    locale === "zh"
      ? status === "live"
        ? "已连接真实试玩模式"
        : status === "network"
          ? "当前网络不正确"
        : status === "demo"
          ? "当前是产品探索模式"
          : "先连接钱包再开始玩"
      : status === "live"
        ? "Live Mainnet Mode"
        : status === "network"
          ? "Wrong Network Detected"
        : status === "demo"
          ? "Product Exploration Mode"
          : "Connect Wallet to Start";

  const body =
    locale === "zh"
      ? status === "live"
        ? "现在提交预测会发起真实主网交易，开奖后可以回来结算奖励和连胜。"
        : status === "network"
          ? "钱包已经连接，但还没有切到 X Layer 主网。先完成切链，再进行真实下注和结算。"
        : status === "demo"
          ? "你现在可以完整浏览产品玩法和交互流程，但还不会真正发起下注。接入主网合约后，页面会自动切到真实链上玩法。"
          : "先连接钱包，你就能读取个人 streak、切换到 X Layer 主网，并准备真实玩法。"
      : status === "live"
        ? "Predictions now submit real mainnet transactions, and you can return after resolution to settle rewards and streaks."
        : status === "network"
          ? "Your wallet is connected, but it is not on X Layer mainnet yet. Switch networks before placing or settling live bets."
        : status === "demo"
          ? "You can explore the full product flow right now, but the app will not submit a real bet until the live mainnet contract is connected."
          : "Connect your wallet first to read your streak, switch to X Layer mainnet, and prepare for live play.";

  return (
    <section className={cn("rounded-[24px] border px-5 py-4 fade-up", tone)}>
      <div className="text-sm font-semibold">{title}</div>
      <p className="mt-2 text-sm leading-6 opacity-90">{body}</p>
    </section>
  );
}
