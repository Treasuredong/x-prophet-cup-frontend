import type { Locale } from "@/lib/content";

export type ProphetTierId = "bronze" | "silver" | "champion";

export type ProphetTier = {
  id: ProphetTierId;
  threshold: number;
  name: { zh: string; en: string };
  shortPerk: { zh: string; en: string };
  utilities: { zh: string[]; en: string[] };
  image: string;
  accent: string;
};

export const LOCKED_PROPHET_IMAGE = "/images/nft-locked.png";

export const PROPHET_TIERS: ProphetTier[] = [
  {
    id: "bronze",
    threshold: 3,
    name: { zh: "青铜先知", en: "Bronze Prophet" },
    shortPerk: {
      zh: "解锁链上身份徽章和 NFT 晒卡分享。",
      en: "Unlocks your on-chain badge and NFT flex sharing."
    },
    utilities: {
      zh: [
        "自动铸造首张先知 NFT，永久记录你的首个高光连胜。",
        "解锁专属的「晒出我的先知 NFT」分享入口，适合发到 X 做战绩传播。",
        "在个人连胜面板上点亮先知身份徽章，让用户知道你已经不是普通玩家。"
      ],
      en: [
        "Auto-mints your first Prophet NFT and records your first highlight streak.",
        "Unlocks the dedicated Share My Prophet NFT flow for flexing on X.",
        "Lights up your Prophet identity badge in the streak panel so you stand out from regular users."
      ]
    },
    image: "/images/nft-bronze.png",
    accent: "from-amber-300/35 via-orange-500/25 to-rose-500/20"
  },
  {
    id: "silver",
    threshold: 5,
    name: { zh: "白银先知", en: "Silver Prophet" },
    shortPerk: {
      zh: "解锁先知洞察面板，获得更强的下注辅助视图。",
      en: "Unlocks the Prophet Insight panel with enhanced betting context."
    },
    utilities: {
      zh: [
        "开启「先知洞察」功能，在比赛卡里看到更明确的热度、部落和狂热模式策略提示。",
        "拥有更高级别的身份展示，截图和社交分享时辨识度更强。",
        "在当前版本里，它代表你从会玩进阶到会判断的用户层级。"
      ],
      en: [
        "Enables Prophet Insight inside the match card with clearer momentum, tribe, and hype guidance.",
        "Upgrades your profile presence with a stronger visual identity for screenshots and sharing.",
        "In the current product, it marks the jump from casual participation to sharper prediction skill."
      ]
    },
    image: "/images/nft-silver.png",
    accent: "from-cyan-300/35 via-sky-500/20 to-white/15"
  },
  {
    id: "champion",
    threshold: 7,
    name: { zh: "冠军先知", en: "Champion Prophet" },
    shortPerk: {
      zh: "解锁冠军模式：专属宣战文案和冠军聚光卡。",
      en: "Unlocks champion mode with premium challenge copy and a spotlight card."
    },
    utilities: {
      zh: [
        "开启「冠军聚光」展示卡，把你包装成排行榜冲刺中的头号先知。",
        "解锁更强的榜单宣战文案，发推时带上冠军气场而不是普通分享。",
        "它是本期世界杯赛季的顶级荣誉层，适合做最终冲榜和晒成绩的高光资产。"
      ],
      en: [
        "Enables a Champion Spotlight card that frames you as a top-tier on-chain prophet.",
        "Unlocks stronger leaderboard challenge copy so your X posts feel like real title fights.",
        "This is the top prestige tier for the World Cup season and the strongest endgame flex asset."
      ]
    },
    image: "/images/nft-champion.png",
    accent: "from-emerald-300/30 via-lime-400/20 to-yellow-300/20"
  }
];

export function getUnlockedProphetTiers(bestStreak: number, minted: boolean) {
  if (!minted) {
    return [] as ProphetTier[];
  }

  return PROPHET_TIERS.filter((tier) => bestStreak >= tier.threshold);
}

export function getActiveProphetTier(bestStreak: number, minted: boolean) {
  const unlocked = getUnlockedProphetTiers(bestStreak, minted);
  return unlocked[unlocked.length - 1] ?? null;
}

export function getTierProgressText(
  locale: Locale,
  threshold: number,
  bestStreak: number,
  unlocked: boolean
) {
  if (unlocked) {
    return locale === "zh" ? "已永久解锁" : "Permanently unlocked";
  }

  const remaining = Math.max(threshold - bestStreak, 0);
  return locale === "zh"
    ? `还差 ${remaining} 场历史最佳连胜`
    : `${remaining} more wins on your best streak`;
}
