"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatAddress } from "@/lib/utils";

export function WalletButton({ locale }: { locale: "zh" | "en" }) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, authenticationStatus, openAccountModal, openChainModal, openConnectModal }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

        if (!connected) {
          return (
            <button
              type="button"
              onClick={openConnectModal}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              {locale === "zh" ? "连接钱包" : "Connect Wallet"}
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button
              type="button"
              onClick={openChainModal}
              className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            >
              {locale === "zh" ? "切换到 X Layer" : "Switch to X Layer"}
            </button>
          );
        }

        return (
          <button
            type="button"
            onClick={openAccountModal}
            className="rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
          >
            {formatAddress(account.address)} · {locale === "zh" ? "钱包" : "Wallet"}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
