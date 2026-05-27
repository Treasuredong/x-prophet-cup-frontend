import { formatEther } from "viem";

export function formatOkb(value?: bigint | null, digits = 3) {
  if (value === undefined || value === null) {
    return "0 OKB";
  }

  const asNumber = Number(formatEther(value));
  if (!Number.isFinite(asNumber)) {
    return "0 OKB";
  }

  return `${asNumber.toFixed(digits)} OKB`;
}

export function formatWeight(value?: bigint | null) {
  if (value === undefined || value === null) {
    return "0";
  }
  return Number(formatEther(value)).toFixed(3);
}

export function formatUnix(timestamp?: bigint | number | null) {
  if (!timestamp) {
    return "-";
  }

  const value = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  return new Date(value * 1000).toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

