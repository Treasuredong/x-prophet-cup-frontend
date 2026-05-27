"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "wagmi";
import { injected } from "@wagmi/core";
import { walletConnect } from "@wagmi/connectors";
import { http } from "viem";
import { xLayerMainnetChain } from "@/lib/xlayer";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID?.trim();
const canUseWalletConnect = typeof window !== "undefined" && Boolean(walletConnectProjectId);

const connectors = canUseWalletConnect
  ? [
      injected(),
      walletConnect({
        projectId: walletConnectProjectId!,
        showQrModal: true
      })
    ]
  : [injected()];

const config = createConfig({
  chains: [xLayerMainnetChain],
  connectors,
  transports: {
    [xLayerMainnetChain.id]: http(xLayerMainnetChain.rpcUrls.default.http[0])
  }
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
