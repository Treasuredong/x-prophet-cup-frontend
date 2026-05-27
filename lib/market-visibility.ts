"use client";

export const MARKET_VISIBILITY_STORAGE_KEY = "xpc-hidden-market-ids";
export const MARKET_VISIBILITY_EVENT = "xpc-market-visibility-updated";

export function readHiddenMarketIds(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(MARKET_VISIBILITY_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 0);
  } catch {
    return [];
  }
}

export function writeHiddenMarketIds(ids: number[]) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = Array.from(new Set(ids))
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 0)
    .sort((left, right) => left - right);

  window.localStorage.setItem(MARKET_VISIBILITY_STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(MARKET_VISIBILITY_EVENT, { detail: normalized }));
}

export function toggleHiddenMarketId(marketId: number) {
  const hidden = readHiddenMarketIds();
  const next = hidden.includes(marketId)
    ? hidden.filter((value) => value !== marketId)
    : [...hidden, marketId];

  writeHiddenMarketIds(next);
  return next;
}
