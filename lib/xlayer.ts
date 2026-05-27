import { defineChain } from "viem";

export const XLAYER_MAINNET = {
  chainId: 196,
  chainName: "X Layer",
  rpcUrl: "https://rpc.xlayer.tech",
  explorerBaseUrl: "https://www.okx.com/web3/explorer/xlayer"
} as const;

export const xLayerMainnetChain = defineChain({
  id: XLAYER_MAINNET.chainId,
  name: XLAYER_MAINNET.chainName,
  nativeCurrency: {
    decimals: 18,
    name: "OKB",
    symbol: "OKB"
  },
  rpcUrls: {
    default: {
      http: [XLAYER_MAINNET.rpcUrl]
    }
  },
  blockExplorers: {
    default: {
      name: "OKX X Layer Explorer",
      url: XLAYER_MAINNET.explorerBaseUrl
    }
  },
  testnet: false
});

export function getContractExplorerUrl(address: string) {
  return `${XLAYER_MAINNET.explorerBaseUrl}/address/${address}`;
}

export function getTxExplorerUrl(hash: string) {
  return `${XLAYER_MAINNET.explorerBaseUrl}/tx/${hash}`;
}
