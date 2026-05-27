"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { parseEther, zeroAddress } from "viem";
import { HeroPanel } from "@/components/HeroPanel";
import { HowItWorks } from "@/components/HowItWorks";
import { LocaleSwitch } from "@/components/LocaleSwitch";
import { MarketCard } from "@/components/MarketCard";
import { MarketStatusPanel } from "@/components/MarketStatusPanel";
import { PlayStatusBanner } from "@/components/PlayStatusBanner";
import { ProphetNftModal } from "@/components/ProphetNftModal";
import { ShareMomentumModal } from "@/components/ShareMomentumModal";
import { StreakPanel } from "@/components/StreakPanel";
import { TribeSelector } from "@/components/TribeSelector";
import {
  CONTRACT_ADDRESS,
  X_PROPHET_CUP_ABI,
  type ContractMarketTuple,
  type ContractPositionTuple
} from "@/lib/contract";
import {
  copy,
  leaderboards,
  markets,
  tribes,
  type LeaderboardBoardKey,
  type Locale
} from "@/lib/content";
import { formatOkb, formatUnix, formatWeight } from "@/lib/format";
import { localizeMatchName } from "@/lib/match-name";
import {
  MARKET_VISIBILITY_EVENT,
  readHiddenMarketIds
} from "@/lib/market-visibility";
import { getActiveProphetTier } from "@/lib/prophet-nft";
import { formatAddress } from "@/lib/utils";
import { getContractExplorerUrl, XLAYER_MAINNET } from "@/lib/xlayer";

const isConfigured = CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";
const DEMO_TRIBE_POOLS: Record<number, Record<number, string>> = {
  0: { 1: "0.620 OKB", 2: "1.480 OKB", 3: "0.210 OKB", 4: "0.180 OKB", 5: "0.260 OKB", 6: "0.240 OKB", 7: "0.290 OKB", 8: "0.170 OKB" },
  1: { 1: "0.180 OKB", 2: "0.240 OKB", 3: "0.220 OKB", 4: "0.160 OKB", 5: "0.200 OKB", 6: "0.940 OKB", 7: "1.120 OKB", 8: "0.210 OKB" },
  2: { 1: "0.160 OKB", 2: "0.230 OKB", 3: "1.060 OKB", 4: "0.210 OKB", 5: "0.980 OKB", 6: "0.240 OKB", 7: "0.260 OKB", 8: "0.170 OKB" }
};

type MarketFilterKey = "all" | "active" | "settled";

function getFallbackMarket(locale: Locale, id: number) {
  const seeded = markets[locale][id];
  if (seeded) {
    return seeded;
  }

  return {
    id,
    slug: `market-${id}`,
    stage: locale === "zh" ? `扩展赛事 ${id + 1}` : `Extended Match ${id + 1}`,
    match: locale === "zh" ? `待配置赛事 #${id + 1}` : `Configurable Match #${id + 1}`,
    kickoff: "-",
    deadline: "-",
    homeTribe: 1,
    awayTribe: 2,
    momentum: 50,
    prizePool: "0.000 OKB",
    hottestCall:
      locale === "zh"
        ? ""
        : ""
  };
}

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);
  const [locale, setLocale] = useState<Locale>("zh");
  const [activeMarket, setActiveMarket] = useState(0);
  const [selectedOutcome, setSelectedOutcome] = useState(0);
  const [selectedTribe, setSelectedTribe] = useState(2);
  const [stake, setStake] = useState("0.05");
  const [isHype, setIsHype] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState<LeaderboardBoardKey>("daily");
  const [isNftModalOpen, setIsNftModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalTitle, setShareModalTitle] = useState("");
  const [shareModalBody, setShareModalBody] = useState("");
  const [shareModalText, setShareModalText] = useState("");
  const [tribePoolAmount, setTribePoolAmount] = useState("0.000 OKB");
  const [marketFilter, setMarketFilter] = useState<MarketFilterKey>("all");
  const [hiddenMarketIds, setHiddenMarketIds] = useState<number[]>([]);

  const { address, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();
  const [betHash, setBetHash] = useState<`0x${string}` | undefined>();
  const [settleHash, setSettleHash] = useState<`0x${string}` | undefined>();
  const t = copy[locale];
  const isOnSupportedChain = chainId === XLAYER_MAINNET.chainId;
  const seededMarkets = markets[locale];
  const currentFallbackMarket = getFallbackMarket(locale, activeMarket);
  const activeTribeName = tribes.find((tribe) => tribe.id === selectedTribe)?.name[locale] ?? "-";
  const leaderboardGroups = leaderboards[locale];
  const activeLeaderboard = leaderboardGroups[leaderboardTab];
  const leaderboardTabs: { key: LeaderboardBoardKey; label: string }[] =
    locale === "zh"
      ? [
          { key: "daily", label: "今日榜" },
          { key: "overall", label: "总榜" },
          { key: "hype", label: "狂热榜" }
        ]
      : [
          { key: "daily", label: "Daily" },
          { key: "overall", label: "All-time" },
          { key: "hype", label: "Hype" }
        ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setHiddenMarketIds(readHiddenMarketIds());

    function syncHiddenMarkets() {
      setHiddenMarketIds(readHiddenMarketIds());
    }

    window.addEventListener("storage", syncHiddenMarkets);
    window.addEventListener(MARKET_VISIBILITY_EVENT, syncHiddenMarkets);

    return () => {
      window.removeEventListener("storage", syncHiddenMarkets);
      window.removeEventListener(MARKET_VISIBILITY_EVENT, syncHiddenMarkets);
    };
  }, []);

  useEffect(() => {
    const fallback = DEMO_TRIBE_POOLS[activeMarket]?.[selectedTribe] ?? "0.000 OKB";
    setTribePoolAmount(fallback);
  }, [activeMarket, selectedTribe]);

  const { data: marketCountData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: X_PROPHET_CUP_ABI,
    functionName: "marketCount",
    query: { enabled: isConfigured && mounted }
  });

  const marketIds = useMemo(() => {
    if (isConfigured && marketCountData !== undefined) {
      return Array.from({ length: Number(marketCountData) }, (_, index) => index);
    }

    return markets[locale].map((market) => market.id);
  }, [locale, marketCountData]);

  const { data: marketReads } = useReadContracts({
    contracts: mounted
      ? marketIds.map((marketId) => ({
          address: CONTRACT_ADDRESS,
          abi: X_PROPHET_CUP_ABI,
          functionName: "getMarket",
          args: [marketId]
        }))
      : [],
    query: { enabled: isConfigured && mounted }
  });

  const { data: streakData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: X_PROPHET_CUP_ABI,
    functionName: "userStreak",
    args: [address ?? zeroAddress],
    query: { enabled: Boolean(address) && isConfigured && mounted }
  });

  const { data: bestStreakData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: X_PROPHET_CUP_ABI,
    functionName: "userBestStreak",
    args: [address ?? zeroAddress],
    query: { enabled: Boolean(address) && isConfigured && mounted }
  });

  const { data: mintedData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: X_PROPHET_CUP_ABI,
    functionName: "hasMintedProphet",
    args: [address ?? zeroAddress],
    query: { enabled: Boolean(address) && isConfigured && mounted }
  });

  const { data: positionReads } = useReadContracts({
    contracts: mounted && address
      ? marketIds.map((marketId) => ({
          address: CONTRACT_ADDRESS,
          abi: X_PROPHET_CUP_ABI,
          functionName: "getPosition",
          args: [marketId, address]
        }))
      : [],
    query: { enabled: Boolean(address) && isConfigured && mounted }
  });


  useWaitForTransactionReceipt({
    hash: betHash,
    query: { enabled: Boolean(betHash) }
  });

  useWaitForTransactionReceipt({
    hash: settleHash,
    query: { enabled: Boolean(settleHash) }
  });

  useEffect(() => {
    let cancelled = false;

    async function loadTribePool() {
      const fallback = DEMO_TRIBE_POOLS[activeMarket]?.[selectedTribe] ?? "0.000 OKB";

      if (!publicClient || !isConfigured || !mounted) {
        if (!cancelled) {
          setTribePoolAmount(fallback);
        }
        return;
      }

      try {
        const result = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: X_PROPHET_CUP_ABI,
          functionName: "tribeFeePool",
          args: [BigInt(activeMarket), selectedTribe]
        });

        if (!cancelled) {
          setTribePoolAmount(formatOkb(result as bigint));
        }
      } catch {
        if (!cancelled) {
          setTribePoolAmount(fallback);
        }
      }
    }

    loadTribePool();

    return () => {
      cancelled = true;
    };
  }, [activeMarket, mounted, publicClient, selectedTribe]);

  const liveMarkets = useMemo(() => {
    return marketIds.map((marketId, index) => {
      const fallbackMarket = getFallbackMarket(locale, marketId);
      const read = marketReads?.[index];
      if (read?.status !== "success" || !read.result) {
        return {
          ...fallbackMarket,
          resolved: false,
          winningOutcome: null as number | null
        };
      }

      const result = read.result as unknown as ContractMarketTuple;

        return {
          ...fallbackMarket,
          slug: result[0] || fallbackMarket.slug,
          match: localizeMatchName(result[1] || fallbackMarket.match, locale),
          kickoff: formatUnix(result[2]),
          deadline: formatUnix(result[3]),
        homeTribe: Number(result[4]),
        awayTribe: Number(result[5]),
        prizePool: formatOkb(result[8]),
        momentum: fallbackMarket.momentum,
        hottestCall: fallbackMarket.hottestCall,
        resolved: result[6],
        winningOutcome: Number(result[7])
      };
    });
  }, [locale, marketIds, marketReads]);

  const visibleMarkets = useMemo(() => {
    const nonHiddenMarkets = liveMarkets.filter((market) => !hiddenMarketIds.includes(market.id));

    if (marketFilter === "active") {
      return nonHiddenMarkets.filter((market) => !market.resolved);
    }

    if (marketFilter === "settled") {
      return nonHiddenMarkets.filter((market) => market.resolved);
    }

    return nonHiddenMarkets;
  }, [hiddenMarketIds, liveMarkets, marketFilter]);

  useEffect(() => {
    if (!visibleMarkets.length) {
      return;
    }

    const hasActive = visibleMarkets.some((market) => market.id === activeMarket);
    if (!hasActive) {
      setActiveMarket(visibleMarkets[0].id);
    }
  }, [activeMarket, visibleMarkets]);

  const currentMarket = visibleMarkets.find((market) => market.id === activeMarket) ?? visibleMarkets[0] ?? liveMarkets[0];
  const safeCurrentMarket = currentMarket ?? getFallbackMarket(locale, 0);
  const currentMarketIndex = marketIds.findIndex((marketId) => marketId === currentMarket?.id);
  const currentRead = currentMarketIndex >= 0 ? marketReads?.[currentMarketIndex] : undefined;
  const currentLiveTuple =
    currentRead?.status === "success" && currentRead.result
      ? (currentRead.result as unknown as ContractMarketTuple)
      : null;
  const currentPosition =
    currentMarketIndex >= 0 &&
    positionReads?.[currentMarketIndex]?.status === "success" &&
    positionReads[currentMarketIndex]?.result
      ? (positionReads[currentMarketIndex].result as unknown as ContractPositionTuple)
      : null;

  const streak = Number(streakData ?? 2);
  const bestStreak = Number(bestStreakData ?? 5);
  const minted = mintedData ?? false;
  const marketCount = Number(marketCountData ?? liveMarkets.length);
  const activeProphetTier = getActiveProphetTier(bestStreak, minted);
  const activeCount = liveMarkets.filter((market) => !market.resolved && !hiddenMarketIds.includes(market.id)).length;
  const settledCount = liveMarkets.filter((market) => market.resolved && !hiddenMarketIds.includes(market.id)).length;

  const hasPosition = currentPosition ? currentPosition[4] > 0n : false;
  const isSettled = currentPosition ? currentPosition[3] : false;
  const positionSummary = hasPosition
    ? `${formatOkb(currentPosition?.[4])} · ${currentPosition?.[2] ? "Hype" : "Normal"} · ${
        isSettled ? t.settled : t.notSettled
      }`
    : t.noPosition;

  const rewardPool = currentLiveTuple ? formatOkb(currentLiveTuple[8]) : currentFallbackMarket.prizePool;
  const hypePool = currentLiveTuple ? formatOkb(currentLiveTuple[9]) : "1.100 OKB";
  const protocolRevenuePool = currentLiveTuple ? formatOkb(currentLiveTuple[10]) : "1.080 OKB";
  const growthPool = currentLiveTuple ? formatOkb(currentLiveTuple[11]) : "0.540 OKB";
  const totalVolume = currentLiveTuple ? formatOkb(currentLiveTuple[12]) : "36.400 OKB";
  const outcomeWeights = currentLiveTuple
    ? currentLiveTuple[13].map((value) => formatWeight(value))
    : ["9.100", "4.200", "6.800"];
  const isResolved = currentLiveTuple ? currentLiveTuple[6] : false;
  const winningOutcome = currentLiveTuple ? Number(currentLiveTuple[7]) : null;
  const contractExplorerUrl = getContractExplorerUrl(CONTRACT_ADDRESS);
  const marketFilterTabs =
    locale === "zh"
      ? [
          { key: "all" as const, label: `全部 ${liveMarkets.filter((market) => !hiddenMarketIds.includes(market.id)).length}` },
          { key: "active" as const, label: `进行中 ${activeCount}` },
          { key: "settled" as const, label: `已结算 ${settledCount}` }
        ]
      : [
          { key: "all" as const, label: `All ${liveMarkets.filter((market) => !hiddenMarketIds.includes(market.id)).length}` },
          { key: "active" as const, label: `Live ${activeCount}` },
          { key: "settled" as const, label: `Settled ${settledCount}` }
        ];

  const shareText = useMemo(() => {
    const intro =
      locale === "zh"
        ? `我在 X 先知杯预测 ${safeCurrentMarket.match}，选择 ${activeTribeName} 部落，目标冲击连胜 NFT。`
        : `I just made a call on ${safeCurrentMarket.match} in X Prophet Cup with ${activeTribeName}. Chasing my Prophet NFT streak.`;

    return `${intro} @XLayerOfficial`;
  }, [activeTribeName, locale, safeCurrentMarket.match]);

  const prophetUtilityPanel = useMemo(() => {
    if (!activeProphetTier || activeProphetTier.id === "bronze") {
      return null;
    }

    if (activeProphetTier.id === "silver") {
      return {
        title: locale === "zh" ? "先知洞察已解锁" : "Prophet Insight Unlocked",
        points:
          locale === "zh"
            ? [
                `当前热度 ${safeCurrentMarket.momentum}，适合围绕 ${safeCurrentMarket.match} 做更明确的观点输出。`,
                `你已进入白银先知层，下注时优先观察部落头奖和狂热模式的传播收益。`
              ]
            : [
                `Current momentum is ${safeCurrentMarket.momentum}, which makes ${safeCurrentMarket.match} a stronger thesis-sharing opportunity.`,
                "As a Silver Prophet, prioritize tribe jackpot alignment and hype mode when you want stronger visibility."
              ]
      };
    }

    return {
      title: locale === "zh" ? "冠军模式已解锁" : "Champion Mode Unlocked",
      points:
        locale === "zh"
          ? [
              `你已解锁冠军级先知身份，当前这场 ${safeCurrentMarket.match} 适合直接发起榜单宣战。`,
              "现在最值得做的是用更强观点参与狂热模式，并通过 X 分享把自己推到全站注意力中心。"
            ]
          : [
              `You are now in Champion mode, and ${safeCurrentMarket.match} is ideal for a public leaderboard challenge.`,
              "The best move now is a stronger thesis, hype mode participation, and an aggressive X share to seize attention."
            ]
    };
  }, [activeProphetTier, locale, safeCurrentMarket.match, safeCurrentMarket.momentum]);

  const predictionHistory = useMemo(() => {
    if (!positionReads?.length) {
      return [];
    }

    try {
      const labels = locale === "zh" ? ["主胜", "平局", "客胜"] : ["Home", "Draw", "Away"];
      return positionReads
        .map((read, index) => {
          if (read?.status !== "success" || !read.result) return null;

          const position = read.result as unknown as ContractPositionTuple;
          if (position[4] <= 0n) return null;

          const marketId = marketIds[index];
          const market = liveMarkets[index] ?? getFallbackMarket(locale, marketId);
          const outcomeIndex = Number(position[0] ?? 0);
          const tribeName = tribes.find((tribe) => tribe.id === Number(position[1]))?.name[locale] ?? "-";
          const won =
            position[3] && market.winningOutcome !== null ? Number(market.winningOutcome) === outcomeIndex : false;
          const status = position[3]
            ? won
              ? locale === "zh"
                ? "已命中"
                : "Won"
              : locale === "zh"
                ? "未命中"
                : "Lost"
            : locale === "zh"
              ? "待结算"
              : "Pending";

          return {
            id: marketId,
            match: market.match,
            outcome: labels[outcomeIndex] ?? labels[0],
            tribe: tribeName,
            stake: formatOkb(position[4]),
            mode: position[2]
              ? locale === "zh"
                ? "狂热"
                : "Hype"
              : locale === "zh"
                ? "普通"
                : "Normal",
            status,
            result: position[3]
              ? locale === "zh"
                ? "结果已上链，焦点战卡片与状态面板已同步更新"
                : "Result is now on-chain and synced to the feature card and status panel"
              : locale === "zh"
                ? "等待比赛结束后由官方 resolve，上链后可结算"
                : "Waiting for official resolve after the match, then you can settle"
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .sort((a, b) => b.id - a.id);
    } catch {
      return [];
    }
  }, [liveMarkets, locale, marketIds, positionReads]);

  const tribeAuraPanel = useMemo(() => {
    if (!activeProphetTier) {
      return null;
    }

    if (activeProphetTier.id === "silver") {
      return {
        title: locale === "zh" ? "部落洞察已激活" : "Tribe Insight Active",
        body:
          locale === "zh"
            ? `你以白银先知身份进入 ${activeTribeName}，现在更适合优先关注本部落的头奖积累和社交热度扩散。`
            : `You are entering ${activeTribeName} as a Silver Prophet. Prioritize this tribe's jackpot momentum and social spread.`
      };
    }

    if (activeProphetTier.id === "champion") {
      return {
        title: locale === "zh" ? "冠军驻场已开启" : "Champion Stationed",
        body:
          locale === "zh"
            ? `你已以冠军先知身份驻场 ${activeTribeName}。这个部落现在会成为你发起宣战、聚集关注和承接流量的主阵地。`
            : `You are now stationed in ${activeTribeName} as a Champion Prophet. This tribe becomes your home base for challenges, attention, and conversion.`
      };
    }

    return null;
  }, [activeProphetTier, activeTribeName, locale]);

  function openShareModal(title: string, body: string, text: string) {
    setShareModalTitle(title);
    setShareModalBody(body);
    setShareModalText(text);
    setIsShareModalOpen(true);
  }

  const betCtaLabel =
    locale === "zh"
      ? !isConnected
        ? "连接钱包后开始"
        : !isOnSupportedChain
          ? "先切换到 X Layer"
        : !isConfigured
          ? "先体验产品流程"
          : "发送下注交易"
      : !isConnected
        ? "Connect Wallet to Start"
        : !isOnSupportedChain
          ? "Switch to X Layer First"
        : !isConfigured
          ? "Explore the Product Flow"
          : "Send Bet Transaction";

  const betHelperText =
    locale === "zh"
      ? !isConnected
        ? "你现在看到的是完整玩法界面，但先连接钱包，才能读取你的个人 streak 和真实链上状态。"
        : !isOnSupportedChain
        ? "钱包已经连接，但当前网络还不是 X Layer 主网。先切链，再进行真实下注和结算。"
        : !isConfigured
          ? "当前还没有接入测试网合约，所以点击后会先带你体验完整流程；真正下注会在合约接入后开启。"
          : ""
      : !isConnected
        ? "The full flow is visible already, but connect your wallet first to read your streak and live contract state."
        : !isOnSupportedChain
          ? "Your wallet is connected, but it is not on X Layer mainnet yet. Switch networks before placing or settling live bets."
        : !isConfigured
          ? "The mainnet contract is not connected yet, so the click guides you through the full flow before real on-chain betting is enabled."
          : "";

  const settleCtaLabel =
    locale === "zh"
      ? isSettled
        ? "已结算"
        : isPending
          ? "结算中..."
          : "领取奖励 / 更新连胜"
      : isSettled
        ? "Settled"
        : isPending
          ? "Settling..."
          : "Claim Reward / Update Streak";

  async function handleBet() {
    if (!currentMarket) {
      return;
    }

    if (!isConfigured || !isConnected || !isOnSupportedChain) {
      openShareModal(
        locale === "zh" ? "先扩散这场预测" : "Start the Social Momentum",
        locale === "zh"
          ? !isConnected
            ? "先连接钱包，再把这场预测真正写进链上；现在你也可以先发到 X，提前吸引围观和讨论。"
            : !isOnSupportedChain
              ? "当前钱包网络还不是 X Layer 主网，你可以先把这场预测发到 X，顺便为切链后的真实下注预热。"
              : "当前还没有接入测试网合约，你可以先把这场预测发到 X，提前吸引围观和跟单讨论。"
          : !isConnected
            ? "Connect your wallet before turning this into a live on-chain bet. You can still post the call to X and start the discussion now."
            : !isOnSupportedChain
              ? "Your wallet is on the wrong network right now, so use this moment to post the call on X and build attention before switching."
              : "The mainnet contract is not connected yet, so use this moment to post your call and start social traction on X.",
        shareText
      );
      return;
    }

    const baseStake = parseEther(stake || "0");
    const totalStake = isHype ? (baseStake * 11n) / 10n : baseStake;

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: X_PROPHET_CUP_ABI,
      functionName: "placeBet",
      args: [BigInt(currentMarket.id), selectedOutcome, selectedTribe, isHype],
      value: totalStake
    });
    setBetHash(hash);
    openShareModal(
      locale === "zh" ? "下注已提交，去发推冲热度" : "Bet Submitted, Push It to X",
      locale === "zh"
        ? "链上下注已经发出。现在最适合立刻分享你的赛果观点，把链上动作转成社交流量。"
        : "Your on-chain bet has been sent. This is the best moment to turn the action into social reach.",
      shareText
    );
  }

  async function handleSettle() {
    if (!currentMarket) {
      return;
    }

    if (!isConfigured || !isConnected) {
      return;
    }

    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: X_PROPHET_CUP_ABI,
      functionName: "settlePosition",
      args: [BigInt(currentMarket.id)]
    });
    setSettleHash(hash);
  }

  return (
    <main className="pitch-grid min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="glass rounded-full px-4 py-2 text-sm text-slate-300">
            {isConnected ? formatAddress(address) : t.connectHint}
          </div>
          <LocaleSwitch locale={locale} onChange={setLocale} />
        </div>

        <HeroPanel locale={locale} onOpenNft={() => setIsNftModalOpen(true)} />
        <PlayStatusBanner
          locale={locale}
          isConnected={isConnected}
          isConfigured={isConfigured}
          isOnSupportedChain={isOnSupportedChain}
        />
        <HowItWorks locale={locale} />

        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-6">
            <StreakPanel locale={locale} streak={streak} bestStreak={bestStreak} minted={minted} />

            <section className="glass rounded-[28px] p-6 fade-up stagger-2">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{t.chooseTribe}</div>
              <h2 className="mt-2 text-2xl font-semibold text-white">{t.tribe}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {locale === "zh"
                  ? "部落选择不需要单独交易，下注时会自动绑定你的球迷身份。"
                  : "Tribe identity is attached to the bet, so users do not need a separate transaction."}
              </p>
              <div className="mt-5">
                <TribeSelector
                  locale={locale}
                  activeTribe={selectedTribe}
                  onChange={setSelectedTribe}
                  prophetVisualTier={
                    activeProphetTier?.id === "champion"
                      ? "champion"
                      : activeProphetTier?.id === "silver"
                        ? "silver"
                        : null
                  }
                />
              </div>
              {tribeAuraPanel ? (
                <div
                  className={`mt-5 rounded-[22px] border p-4 text-sm leading-6 ${
                    activeProphetTier?.id === "champion"
                      ? "border-lime-300/30 bg-lime-300/10 text-lime-100"
                      : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
                  }`}
                >
                  <div className="text-xs uppercase tracking-[0.22em]">
                    {tribeAuraPanel.title}
                  </div>
                  <p className="mt-3">{tribeAuraPanel.body}</p>
                </div>
              ) : null}
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    {locale === "zh" ? "当前部落共享池" : "Current Tribe Pool"}
                  </div>
                  <div className="mt-3 text-2xl font-semibold text-white">{tribePoolAmount}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {locale === "zh"
                      ? `这是当前比赛下 ${activeTribeName} 已累计的共享池额度。`
                      : `This is the current shared pool size accumulated for ${activeTribeName} in this match.`}
                  </p>
                </div>
                <div className="rounded-[22px] border border-cyan-300/15 bg-cyan-300/8 p-4 text-sm leading-6 text-slate-200">
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">
                    {locale === "zh" ? "快速例子" : "Quick Example"}
                  </div>
                  <p className="mt-3">
                    {locale === "zh"
                      ? "比如阿根廷部落里 3 个人分别下注 1、2、3 OKB，并且都押中了这场比赛的最终赛果，6% 费用里有 2% 进入部落池，总共沉淀 0.12 OKB；结算时，他们会按 1:2:3 的有效持仓比例瓜分这 0.12 OKB 头奖。"
                      : "If 3 Argentina tribe members stake 1, 2, and 3 OKB and all land the correct outcome for this market, 2% of each bet flows into the tribe pool for a total of 0.12 OKB. On settlement, they split that 0.12 OKB jackpot by a 1:2:3 effective-weight ratio."}
                  </p>
                </div>
              </div>
              <div className="mt-5 rounded-[22px] border border-cyan-300/15 bg-cyan-300/8 p-4 text-sm leading-6 text-slate-200">
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">
                  {locale === "zh" ? "共享池说明" : "Shared Pool Rules"}
                </div>
                <p className="mt-3">
                  {locale === "zh"
                    ? "每笔下注会收取 6% 基础手续费：3% 归协议收入，2% 注入你所选部落的共享池，1% 进入增长激励池。部落不跟参赛球队绑定，只要你和同部落成员押中了这场比赛的最终赛果，就会按当场有效持仓比例瓜分该部落头奖。"
                    : "Each bet carries a 6% base fee: 3% goes to protocol revenue, 2% flows into the selected tribe jackpot, and 1% enters the growth incentive pool. Tribes are not tied to the teams in the match. If you and your tribe peers land the correct outcome, you split that tribe jackpot by effective position size."}
                </p>
                <p className="mt-2">
                  {locale === "zh"
                    ? "部落身份可以随时切换，但每一笔下注都会锁定提交当下选择的部落，所以切换只影响后续新下注，不会改写历史战绩。"
                    : "You can switch tribes at any time, but each bet locks in the tribe chosen at submission. Switching later only affects future bets, not historical positions."}
                </p>
              </div>
            </section>

            <section className="glass rounded-[28px] p-6 fade-up stagger-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  {t.scoreboardTitle}
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  Top 10
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {leaderboardTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setLeaderboardTab(tab.key)}
                    className={
                      leaderboardTab === tab.key
                        ? "rounded-full border border-white/20 bg-white/14 px-4 py-2 text-sm font-semibold text-white"
                        : "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8"
                    }
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="mt-5 grid gap-3">
                {activeLeaderboard.slice(0, 3).map((entry, index) => (
                  <div
                    key={entry.name}
                    className={`relative overflow-hidden rounded-[24px] border p-5 ${
                      index === 0
                        ? "border-4 border-amber-300 bg-gradient-to-br from-amber-300/22 via-orange-500/18 to-white/6"
                        : index === 1
                          ? "border-4 border-cyan-300 bg-gradient-to-br from-cyan-300/18 via-blue-500/15 to-white/6"
                          : "border-4 border-emerald-300 bg-gradient-to-br from-emerald-300/18 via-lime-500/12 to-white/6"
                    }`}
                  >
                    <div className="absolute right-4 top-4 text-4xl">
                      {index === 0 ? "🏆" : index === 1 ? "⚡" : "🔥"}
                    </div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-200">
                      #{index + 1} · {entry.tribe}
                    </div>
                    <div className="mt-3 text-xl font-semibold text-white">{entry.name}</div>
                    <div className="mt-2 text-sm text-slate-100">{entry.vibe}</div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-200">
                        {entry.streak} streak
                      </div>
                      <div className="text-sm font-semibold text-white">{entry.score}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        openShareModal(
                          locale === "zh" ? "向榜单前三发起宣战" : "Challenge the Heat Board",
                          locale === "zh"
                            ? `用你的预测向 ${entry.name} 宣战，把世界杯观点直接发到 X，吸引更多人加入这场比赛。`
                            : `Call out ${entry.name} on X and challenge the leaderboard with your World Cup thesis.`,
                          locale === "zh"
                            ? `${activeProphetTier?.id === "champion" ? "冠军先知宣战：" : ""}我正在 X 先知杯冲击${tabLabelForShare(leaderboardTab, locale)}，目标超越 ${entry.name}。${safeCurrentMarket.match} 这场我有不同观点，来 XLayer 上链见真章。 @XLayerOfficial`
                            : `${activeProphetTier?.id === "champion" ? "Champion Prophet challenge:" : ""} I am climbing the ${tabLabelForShare(leaderboardTab, locale)} on X Prophet Cup and coming for ${entry.name}. I have a different read on ${safeCurrentMarket.match}. Let the on-chain receipts speak. @XLayerOfficial`
                        )
                      }
                      className="mt-4 inline-flex rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/14"
                    >
                      {locale === "zh" ? "发推宣战" : "Challenge on X"}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-3">
                {activeLeaderboard.slice(3).map((entry, index) => (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-4"
                  >
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        #{index + 4} · {entry.tribe}
                      </div>
                      <div className="mt-1 font-semibold text-white">{entry.name}</div>
                      <div className="mt-1 text-xs text-slate-400">{entry.vibe}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">{entry.score}</div>
                      <div className="mt-1 text-xs text-slate-400">{entry.streak} streak</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6" id="markets">
            <section className="glass rounded-[28px] p-6 fade-up">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    {t.featuredMarkets}
                  </div>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{t.title}</h2>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {marketFilterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setMarketFilter(tab.key)}
                    className={
                      marketFilter === tab.key
                        ? "rounded-full border border-white/20 bg-white/14 px-4 py-2 text-sm font-semibold text-white"
                        : "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8"
                    }
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {visibleMarkets.map((market) => (
                  <button
                    key={market.id}
                    type="button"
                    onClick={() => setActiveMarket(market.id)}
                    className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                      activeMarket === market.id
                        ? "bg-white text-slate-950"
                        : "border border-white/10 bg-white/5 text-slate-300 hover:text-white"
                    }`}
                  >
                    {market.match}
                  </button>
                ))}
              </div>
              {!visibleMarkets.length ? (
                <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                  {locale === "zh"
                    ? "当前筛选条件下没有可展示赛事。你可以去 admin 恢复赛事展示，或者切换到其他筛选查看。"
                    : "No matches are visible under this filter. Restore markets from admin or switch filters to continue."}
                </div>
              ) : null}
            </section>

            {currentMarket ? (
              <>
                <MarketCard
                  locale={locale}
                  market={currentMarket}
                  outcome={selectedOutcome}
                  onOutcomeChange={setSelectedOutcome}
                  stake={stake}
                  onStakeChange={setStake}
                  isHype={isHype}
                  onToggleHype={setIsHype}
                  onSubmit={handleBet}
                  ctaLabel={betCtaLabel}
                  helperText={betHelperText}
                  utilityPanel={prophetUtilityPanel}
                  prophetVisualTier={
                    activeProphetTier?.id === "champion"
                      ? "champion"
                      : activeProphetTier?.id === "silver"
                        ? "silver"
                        : null
                  }
                  secondaryActionLabel={hasPosition ? settleCtaLabel : null}
                  onSecondaryAction={handleSettle}
                  secondaryDisabled={!hasPosition || !isResolved || isSettled || isPending || !isOnSupportedChain}
                />

                <MarketStatusPanel
                  locale={locale}
                  isConfigured={isConfigured}
                  marketCount={marketCount}
                  rewardPool={rewardPool}
                  hypePool={hypePool}
                  protocolRevenuePool={protocolRevenuePool}
                  growthPool={growthPool}
                  totalVolume={totalVolume}
                  outcomeWeights={outcomeWeights}
                  resolved={isResolved}
                  winningOutcome={winningOutcome}
                  currentPositionText={positionSummary}
                  explorerContractUrl={contractExplorerUrl}
                />
              </>
            ) : null}

            <section className="glass rounded-[28px] p-6 fade-up">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    {locale === "zh" ? "我的预测记录" : "My Prediction History"}
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {locale === "zh" ? "我的下单与结算状态" : "My Bets and Settlement Status"}
                  </h2>
                </div>
              </div>

              {predictionHistory.length ? (
                <div className="mt-6 grid gap-4">
                  {predictionHistory.map((item) => (
                    <div
                      key={`${item.id}-${item.match}`}
                      className="rounded-[24px] border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                            {item.tribe} · {item.mode}
                          </div>
                          <div className="mt-2 text-lg font-semibold text-white">{item.match}</div>
                          <div className="mt-2 text-sm text-slate-300">
                            {locale === "zh" ? "我的选择" : "My pick"}: {item.outcome} · {item.stake}
                          </div>
                        </div>
                        <div
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            item.status === "待结算" || item.status === "Pending"
                              ? "border border-amber-300/30 bg-amber-300/12 text-amber-100"
                              : item.status === "已命中" || item.status === "Won"
                                ? "border border-emerald-300/30 bg-emerald-300/12 text-emerald-100"
                                : "border border-rose-300/30 bg-rose-300/12 text-rose-100"
                          }`}
                        >
                          {item.status}
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-300">{item.result}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[24px] border border-dashed border-white/12 bg-white/5 p-6">
                  <div className="text-sm font-semibold text-white">
                    {locale === "zh" ? "你的第一笔预测会从这里开始累计" : "Your first prediction will appear here"}
                  </div>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                    {locale === "zh"
                      ? "当你连接钱包并完成首笔预测后，这里会开始展示你的赛果选择、部落归属、金额、狂热模式和结算状态。早期阶段没有记录是正常的。"
                      : "Once you connect a wallet and place your first prediction, this section will start tracking your outcome, tribe, stake, hype mode, and settlement status. Seeing no history yet is normal in the early stage."}
                  </p>
                </div>
              )}
            </section>

            <section className="grid gap-6 md:grid-cols-3">
              {[
                { title: t.prophet, desc: t.prophetDesc },
                { title: t.tribe, desc: t.tribeDesc },
                { title: t.hype, desc: t.hypeDesc }
              ].map((item) => (
                <div key={item.title} className="glass rounded-[28px] p-6 fade-up">
                  <div className="text-lg font-semibold text-white">{item.title}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.desc}</p>
                </div>
              ))}
            </section>

            {activeProphetTier?.id === "champion" ? (
              <section className="glass rounded-[28px] p-6 fade-up">
                <div className="text-xs uppercase tracking-[0.24em] text-amber-200">
                  {locale === "zh" ? "冠军聚光" : "Champion Spotlight"}
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {locale === "zh" ? "你已进入冠军先知模式" : "You Are in Champion Prophet Mode"}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {locale === "zh"
                    ? "冠军先知是本期最高荣誉层。你现在会获得更强的榜单宣战文案、更高辨识度的身份展示，以及最适合在 X 上冲热度的分享时机。"
                    : "Champion Prophet is the top prestige tier this season. You now get stronger challenge copy, higher-visibility identity framing, and the best moments to turn calls into X momentum."}
                </p>
              </section>
            ) : null}

          </div>
        </div>

        <footer className="pb-8 text-center text-sm text-slate-400">{t.footer}</footer>
      </div>
      <ProphetNftModal
        locale={locale}
        bestStreak={bestStreak}
        minted={minted}
        open={isNftModalOpen}
        onClose={() => setIsNftModalOpen(false)}
        onShare={(tierName) =>
          openShareModal(
            locale === "zh" ? "晒出你的先知 NFT" : "Share Your Prophet NFT",
            locale === "zh"
              ? "你的先知 NFT 已经解锁，这是最适合对外展示战绩和身份的高光时刻。"
              : "Your Prophet NFT is unlocked. This is the best moment to show your streak and status publicly.",
            locale === "zh"
              ? `我刚在 X 先知杯解锁了 ${tierName}，世界杯预测连胜正在上链。来 X Layer 看我冲击下一张先知 NFT。 @XLayerOfficial`
              : `I just unlocked ${tierName} in X Prophet Cup. My World Cup streak is now on-chain on X Layer. Come watch me chase the next Prophet NFT. @XLayerOfficial`
          )
        }
      />
      <ShareMomentumModal
        locale={locale}
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={shareModalTitle}
        body={shareModalBody}
        shareText={shareModalText}
      />
    </main>
  );
}

function tabLabelForShare(tab: LeaderboardBoardKey, locale: Locale) {
  if (locale === "zh") {
    if (tab === "daily") return "今日榜";
    if (tab === "overall") return "总榜";
    return "狂热榜";
  }

  if (tab === "daily") return "Daily Board";
  if (tab === "overall") return "All-time Board";
  return "Hype Board";
}
