export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatAddress(address?: string) {
  if (!address) {
    return "";
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getShareUrl(text: string) {
  const params = new URLSearchParams({
    text,
    url: "https://x-prophet-cup.vercel.app",
    hashtags: "XLayer,XCup,WorldCup,PredictionMarket"
  });

  return `https://x.com/intent/tweet?${params.toString()}`;
}

