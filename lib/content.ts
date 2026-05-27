export type Locale = "zh" | "en";

export type MarketCardItem = {
  id: number;
  slug: string;
  stage: string;
  match: string;
  kickoff: string;
  deadline: string;
  homeTribe: number;
  awayTribe: number;
  momentum: number;
  prizePool: string;
  hottestCall: string;
};

export type LeaderboardBoardKey = "daily" | "overall" | "hype";

export type LeaderboardEntry = {
  name: string;
  streak: number;
  tribe: string;
  vibe: string;
  score: string;
};

export type RevenueModelCard = {
  title: string;
  metric: string;
  detail: string;
  points: string[];
};

export type RevenueModelContent = {
  eyebrow: string;
  title: string;
  description: string;
  cards: RevenueModelCard[];
  exampleTitle: string;
  exampleBody: string;
  exampleItems: string[];
  footer: string;
};

export const tribes = [
  { id: 1, code: "BRA", name: { zh: "巴西部落", en: "Brazil Tribe" }, accent: "#f7c94c" },
  { id: 2, code: "ARG", name: { zh: "阿根廷部落", en: "Argentina Tribe" }, accent: "#7bdff2" },
  { id: 3, code: "FRA", name: { zh: "法国部落", en: "France Tribe" }, accent: "#6c8cff" },
  { id: 4, code: "GER", name: { zh: "德国部落", en: "Germany Tribe" }, accent: "#ffd166" },
  { id: 5, code: "ESP", name: { zh: "西班牙部落", en: "Spain Tribe" }, accent: "#ff6b6b" },
  { id: 6, code: "ENG", name: { zh: "英格兰部落", en: "England Tribe" }, accent: "#c3f0ff" },
  { id: 7, code: "POR", name: { zh: "葡萄牙部落", en: "Portugal Tribe" }, accent: "#6ce5b1" },
  { id: 8, code: "USA", name: { zh: "美国部落", en: "USA Tribe" }, accent: "#ff9f1c" }
];

export const markets: Record<Locale, MarketCardItem[]> = {
  zh: [
    {
      id: 0,
      slug: "arg-vs-bra",
      stage: "焦点战",
      match: "阿根廷 vs 巴西",
      kickoff: "2026-05-24 20:00 UTC",
      deadline: "2026-05-24 19:40 UTC",
      homeTribe: 2,
      awayTribe: 1,
      momentum: 88,
      prizePool: "24.8 OKB",
      hottestCall: "梅西接班人对决，阿根廷热度领先"
    },
    {
      id: 1,
      slug: "eng-vs-por",
      stage: "社媒爆点",
      match: "英格兰 vs 葡萄牙",
      kickoff: "2026-05-25 18:00 UTC",
      deadline: "2026-05-25 17:40 UTC",
      homeTribe: 6,
      awayTribe: 7,
      momentum: 74,
      prizePool: "18.2 OKB",
      hottestCall: "C 罗话题带动狂热指数飙升"
    },
    {
      id: 2,
      slug: "fra-vs-esp",
      stage: "高胜率场",
      match: "法国 vs 西班牙",
      kickoff: "2026-05-26 19:30 UTC",
      deadline: "2026-05-26 19:10 UTC",
      homeTribe: 3,
      awayTribe: 5,
      momentum: 79,
      prizePool: "21.4 OKB",
      hottestCall: "战术流对撞，平局票开始抬头"
    }
  ],
  en: [
    {
      id: 0,
      slug: "arg-vs-bra",
      stage: "Headline Match",
      match: "Argentina vs Brazil",
      kickoff: "2026-05-24 20:00 UTC",
      deadline: "2026-05-24 19:40 UTC",
      homeTribe: 2,
      awayTribe: 1,
      momentum: 88,
      prizePool: "24.8 OKB",
      hottestCall: "Argentina sentiment is leading the timeline."
    },
    {
      id: 1,
      slug: "eng-vs-por",
      stage: "Social Spike",
      match: "England vs Portugal",
      kickoff: "2026-05-25 18:00 UTC",
      deadline: "2026-05-25 17:40 UTC",
      homeTribe: 6,
      awayTribe: 7,
      momentum: 74,
      prizePool: "18.2 OKB",
      hottestCall: "Ronaldo discourse is driving a hype rush."
    },
    {
      id: 2,
      slug: "fra-vs-esp",
      stage: "Sharp Pick",
      match: "France vs Spain",
      kickoff: "2026-05-26 19:30 UTC",
      deadline: "2026-05-26 19:10 UTC",
      homeTribe: 3,
      awayTribe: 5,
      momentum: 79,
      prizePool: "21.4 OKB",
      hottestCall: "Draw tickets are starting to trend among whales."
    }
  ]
};

export const copy = {
  zh: {
    badge: "预测市场 + 球迷身份 + 连胜成长 + 狂热榜单 + 先知NFT",
    title: "X 先知杯",
    subtitle:
      "部署在 X Layer 上的世界杯原生预测市场，在这里用户不只是预测世界杯胜负，还能冲击连胜、加入球迷部落、参与共享奖池、解锁先知 NFT，并将每一次预言沉淀为可传播的链上身份。",
    ctaPrimary: "连接钱包开始预言",
    ctaSecondary: "查看玩法亮点",
    scoreboardTitle: "今日上头榜",
    scoreboardNote: "实时连胜、部落头奖、狂热指数都会推动全站热度。",
    prophet: "先知连胜",
    prophetDesc: "连中越多，下一单的链上权重越高，最高 2.0x。",
    tribe: "球迷部落共享池",
    tribeDesc: "每笔下注抽取 6%，其中 2% 进入你所选部落的共享池；只要押中这场比赛，就能按部落内有效持仓瓜分头奖。",
    hype: "狂热指数",
    hypeDesc: "多付 10% 开启狂热加注，其中 4% 进入 Hype 池，4% 归协议收入，2% 用于增长激励。",
    featuredMarkets: "精选比赛",
    featuredMarketsDesc: "为上线首期准备的 3 场高传播焦点战，便于用户快速体验整套玩法。",
    placeBet: "提交预测",
    chooseSide: "选择赛果",
    chooseTribe: "选择部落",
    stake: "下注金额（OKB）",
    hypeMode: "开启狂热加注",
    share: "一键分享到 X",
    insights: "参赛策略",
    insightsDesc:
      "首页直接向评委解释：为什么这个产品能把世界杯流量带上链，为什么适合 X Layer 的低 gas 优势，为什么有长期 SocialFi 和 NFT 扩展空间。",
    footer: "Serverless on Vercel. Contracts on X Layer Mainnet. Built for X Cup.",
    streakCard: "当前连胜",
    bestStreak: "历史最佳",
    nextMint: "距离 Prophet NFT",
    connectHint: "连接钱包后可读取你的 streak、下注和分享战绩。",
    demoHint: "未接入合约时，页面会先以产品预热数据展示完整玩法闭环。",
    liveHint: "接入合约地址后，比赛卡片会优先读取链上真实数据。",
    noPosition: "暂无仓位",
    settled: "已结算",
    notSettled: "待结算",
    won: "命中",
    lost: "未命中",
    howTitle: "3 步开玩",
    howDesc: "我们把玩法压缩得很轻，但每一步都有传播点：先选固定部落身份，再做预测，最后把连胜和 NFT 战绩晒到 X。"
  },
  en: {
    badge: "Prediction Market + Fan Identity + Streak Growth + Hype Board + Prophet NFT",
    title: "X Prophet Cup",
    subtitle:
      "A World Cup-native prediction market built on X Layer, where users do more than predict match outcomes. They can chase streaks, join fan tribes, compete for shared prize pools, unlock Prophet NFTs, and turn every call into a shareable on-chain identity.",
    ctaPrimary: "Connect Wallet",
    ctaSecondary: "See Why It Wins",
    scoreboardTitle: "Heat Board",
    scoreboardNote: "Streaks, tribe jackpots, and hype mode all push visibility and retention.",
    prophet: "Prophet Streak",
    prophetDesc: "Every correct call boosts the weight of the next one, up to 2.0x.",
    tribe: "Fan Tribe Jackpot",
    tribeDesc: "Every bet takes a 6% fee, with 2% routed into your selected tribe jackpot. Any correct call in that tribe can split the pot by effective weight.",
    hype: "Hype Index",
    hypeDesc: "Pay 10% extra to enter hype mode, where 4% goes to the Hype pool, 4% to protocol revenue, and 2% to growth incentives.",
    featuredMarkets: "Featured Matches",
    featuredMarketsDesc: "Three high-signal launch matches designed to help users experience the full loop quickly.",
    placeBet: "Submit Prediction",
    chooseSide: "Choose Outcome",
    chooseTribe: "Choose Tribe",
    stake: "Stake (OKB)",
    hypeMode: "Turn On Hype Mode",
    share: "Share to X",
    insights: "Why This Can Win",
    insightsDesc:
      "The homepage explains the pitch to judges immediately: why it can convert World Cup attention into on-chain users, why low gas matters, and why the social + NFT loop has legs.",
    footer: "Serverless on Vercel. Contracts on X Layer Mainnet. Built for X Cup.",
    streakCard: "Current Streak",
    bestStreak: "Best Run",
    nextMint: "Until Prophet NFT",
    connectHint: "Connect your wallet to read streaks, place bets, and broadcast your calls.",
    demoHint: "Before the contract is wired in, the UI stays explorable with product warm-up data.",
    liveHint: "Once the contract address is configured, market cards read live on-chain data first.",
    noPosition: "No position yet",
    settled: "Settled",
    notSettled: "Pending settlement",
    won: "Won",
    lost: "Lost",
    howTitle: "How It Works",
    howDesc: "The loop is intentionally lightweight: pick a fixed tribe identity, make a prediction, then return for streaks, settlement, and a shareable NFT outcome."
  }
} as const;

export const revenueModel: Record<Locale, RevenueModelContent> = {
  zh: {
    eyebrow: "收费模型 v1",
    title: "这不是只靠补贴的竞猜产品，而是一套可以持续赚钱的链上体育市场。",
    description:
      "X Prophet Cup 的收入来自三层引擎：基础交易手续费、Hype 增值玩法费，以及后续可扩展的赛季权益与流量分发收入。平台收入与用户奖励池明确拆开，既保留玩法刺激，也保留真实可持续的利润空间。",
    cards: [
      {
        title: "基础交易手续费",
        metric: "每笔下注收取 6%",
        detail: "这是最稳定的协议收入来源，也是后续增长的底座。",
        points: [
          "3% 直接归协议收入，形成可持续现金流。",
          "2% 注入用户所选部落共享池，维持社群粘性。",
          "1% 进入增长池，用于邀请返佣、赛季榜单和任务激励。"
        ]
      },
      {
        title: "Hype 模式增值收费",
        metric: "额外加收 10%",
        detail: "Hype 不是单纯加倍刺激，而是高毛利玩法升级层。",
        points: [
          "4% 进入 Hype 专属奖池，提升用户冲榜动力。",
          "4% 计入协议收入，成为高 ARPU 收入来源。",
          "2% 用于社交传播激励，让高热度内容反哺增长。"
        ]
      },
      {
        title: "赛季权益收入",
        metric: "Prophet Pass / 高级身份",
        detail: "不是卖 JPG，而是卖身份、数据、特权和持续参与权。",
        points: [
          "赛季通行证可解锁高级数据面板、专属身份框和先行市场。",
          "高级 Prophet 身份可以获得更强的展示位、榜单权益或手续费折扣。",
          "这部分收入适合作为订阅型或赛季型现金流。"
        ]
      },
      {
        title: "流量分发与合作收入",
        metric: "Tribe 冠名 / 品牌合作 / KOL 联动",
        detail: "当世界杯流量和链上互动聚集后，平台本身就成为广告与合作入口。",
        points: [
          "部落榜单、赛季挑战和热门赛事可以开放品牌赞助。",
          "钱包、交易平台、体育 KOL 和 Web3 项目都可接入合作位。",
          "卖的不是广告位本身，而是世界杯链上用户注意力。"
        ]
      }
    ],
    exampleTitle: "示例单位经济",
    exampleBody:
      "假设某一周核心赛事总下注量达到 1,000 OKB，其中 25% 用户开启 Hype 模式：",
    exampleItems: [
      "基础下注手续费可直接产生约 30 OKB 协议收入。",
      "Hype 模式可额外产生约 10 OKB 协议收入。",
      "同一周还会累积 20 OKB 部落共享池和 10 OKB 增长激励池，用来维持用户活跃与裂变。"
    ],
    footer:
      "这意味着平台的收入不是靠用户亏损，而是靠交易量、Hype 渗透率、赛季权益和社交传播带来的持续复购。"
  },
  en: {
    eyebrow: "Monetization v1",
    title: "This is not a subsidy-only prediction app. It is an on-chain sports market designed to generate durable revenue.",
    description:
      "X Prophet Cup is powered by three revenue engines: base transaction fees, Hype-mode upgrade fees, and long-term extensions such as season access and traffic monetization. Platform revenue and player reward pools are separated on purpose so the product stays fun without giving up real margin.",
    cards: [
      {
        title: "Base transaction fee",
        metric: "6% fee on every bet",
        detail: "This is the protocol's most reliable revenue layer and the foundation for scale.",
        points: [
          "3% goes directly to protocol revenue for sustainable cash flow.",
          "2% flows into the bettor's selected tribe jackpot to preserve fan-community stickiness.",
          "1% enters a growth pool for referrals, seasonal leaderboards, and mission incentives."
        ]
      },
      {
        title: "Hype mode upsell",
        metric: "Additional 10% upgrade fee",
        detail: "Hype is not just excitement. It is a higher-margin premium play layer.",
        points: [
          "4% funds the Hype-only reward pool and increases leaderboard intensity.",
          "4% counts as protocol revenue and lifts ARPU materially.",
          "2% is allocated to social growth incentives so viral behavior compounds distribution."
        ]
      },
      {
        title: "Seasonal access revenue",
        metric: "Prophet Pass / premium identity",
        detail: "The monetization path is not about selling JPEGs. It is about selling identity, data, and access.",
        points: [
          "A season pass can unlock premium analytics, visual identity layers, and early markets.",
          "Higher Prophet tiers can receive boosted visibility, ranking privileges, or fee rebates.",
          "This becomes a subscription-like or season-based cash flow stream."
        ]
      },
      {
        title: "Traffic distribution revenue",
        metric: "Tribe sponsorships / brand deals / KOL campaigns",
        detail: "Once World Cup attention and on-chain engagement converge, the product itself becomes a partnership surface.",
        points: [
          "Tribe rankings, seasonal challenges, and headline matches can be sponsored.",
          "Wallets, exchanges, sports KOLs, and Web3 projects can buy collaboration slots.",
          "The product is not selling ad space alone. It is selling access to on-chain football attention."
        ]
      }
    ],
    exampleTitle: "Sample unit economics",
    exampleBody:
      "Assume weekly headline matches generate 1,000 OKB in volume and 25% of users opt into Hype mode:",
    exampleItems: [
      "Base betting fees can generate roughly 30 OKB in direct protocol revenue.",
      "Hype mode can add another 10 OKB of protocol revenue.",
      "The same week also builds 20 OKB in tribe jackpots and 10 OKB in growth incentives to sustain retention and referrals."
    ],
    footer:
      "That means revenue does not depend on users losing. It compounds through volume, Hype adoption, seasonal access, and repeatable social distribution."
  }
};

export const leaderboards: Record<
  Locale,
  Record<LeaderboardBoardKey, LeaderboardEntry[]>
> = {
  zh: {
    daily: [
      { name: "0xMESSI...10", streak: 7, tribe: "阿根廷", vibe: "今日命中率 91%", score: "+132 热度" },
      { name: "0xRONA...88", streak: 6, tribe: "葡萄牙", vibe: "狂热加注 4 连中", score: "+118 狂热分" },
      { name: "0xPELE...27", streak: 5, tribe: "巴西", vibe: "部落头奖瓜分领先", score: "+103 传播分" },
      { name: "0xKYLI...91", streak: 4, tribe: "法国", vibe: "午间爆点帖上榜", score: "+94" },
      { name: "0xBELL...77", streak: 4, tribe: "英格兰", vibe: "连续两场冷门命中", score: "+88" },
      { name: "0xYAMA...66", streak: 3, tribe: "西班牙", vibe: "平局观点被转发", score: "+81" },
      { name: "0xPULI...17", streak: 3, tribe: "美国", vibe: "部落讨论区活跃", score: "+73" },
      { name: "0xMUSI...42", streak: 3, tribe: "德国", vibe: "早盘预测最早入场", score: "+69" },
      { name: "0xOTAM...55", streak: 2, tribe: "阿根廷", vibe: "结算后立即晒单", score: "+64" },
      { name: "0xRICH...20", streak: 2, tribe: "巴西", vibe: "Hype 模式讨论热", score: "+60" }
    ],
    overall: [
      { name: "0xMESSI...10", streak: 12, tribe: "阿根廷", vibe: "总连胜王者", score: "12 连胜" },
      { name: "0xPELE...27", streak: 10, tribe: "巴西", vibe: "累计头奖最高", score: "41.8 OKB" },
      { name: "0xRONA...88", streak: 9, tribe: "葡萄牙", vibe: "最强社交传播", score: "3.2k impressions" },
      { name: "0xKYLI...91", streak: 8, tribe: "法国", vibe: "大赛命中率稳定", score: "88%" },
      { name: "0xBELL...77", streak: 8, tribe: "英格兰", vibe: "冷门盘口专家", score: "31.4 OKB" },
      { name: "0xMUSI...42", streak: 7, tribe: "德国", vibe: "多次提前建仓", score: "29.9 OKB" },
      { name: "0xYAMA...66", streak: 7, tribe: "西班牙", vibe: "平局票名人堂", score: "26.5 OKB" },
      { name: "0xPULI...17", streak: 6, tribe: "美国", vibe: "新用户转化最多", score: "98 invites" },
      { name: "0xALVA...11", streak: 6, tribe: "西班牙", vibe: "部落池协同优秀", score: "24.1 OKB" },
      { name: "0xOTAM...55", streak: 5, tribe: "阿根廷", vibe: "NFT 晒单最活跃", score: "17 NFTs" }
    ],
    hype: [
      { name: "0xRONA...88", streak: 6, tribe: "葡萄牙", vibe: "狂热模式全站第一", score: "9 次 Hype" },
      { name: "0xMESSI...10", streak: 5, tribe: "阿根廷", vibe: "热度返还最高", score: "2.6 OKB" },
      { name: "0xKYLI...91", streak: 5, tribe: "法国", vibe: "最容易引发跟单", score: "71 followers" },
      { name: "0xRICH...20", streak: 4, tribe: "巴西", vibe: "高风险高回报", score: "7 次 Hype" },
      { name: "0xYAMA...66", streak: 4, tribe: "西班牙", vibe: "冷门 Hype 命中", score: "6 次 Hype" },
      { name: "0xBELL...77", streak: 3, tribe: "英格兰", vibe: "社媒互动拉满", score: "58 comments" },
      { name: "0xPULI...17", streak: 3, tribe: "美国", vibe: "最会做赛后复盘", score: "49 saves" },
      { name: "0xMUSI...42", streak: 3, tribe: "德国", vibe: "Hype ROI 靠前", score: "+28%" },
      { name: "0xPELE...27", streak: 3, tribe: "巴西", vibe: "球迷转发最高", score: "44 reposts" },
      { name: "0xALVA...11", streak: 2, tribe: "西班牙", vibe: "热点发言持续上墙", score: "39 mentions" }
    ]
  },
  en: {
    daily: [
      { name: "0xMESSI...10", streak: 7, tribe: "Argentina", vibe: "91% hit rate today", score: "+132 heat" },
      { name: "0xRONA...88", streak: 6, tribe: "Portugal", vibe: "4 straight hype hits", score: "+118 hype" },
      { name: "0xPELE...27", streak: 5, tribe: "Brazil", vibe: "Leading tribe split", score: "+103 social" },
      { name: "0xKYLI...91", streak: 4, tribe: "France", vibe: "Midday post went viral", score: "+94" },
      { name: "0xBELL...77", streak: 4, tribe: "England", vibe: "Two upset calls landed", score: "+88" },
      { name: "0xYAMA...66", streak: 3, tribe: "Spain", vibe: "Draw thesis got reposted", score: "+81" },
      { name: "0xPULI...17", streak: 3, tribe: "USA", vibe: "Most active tribe chatter", score: "+73" },
      { name: "0xMUSI...42", streak: 3, tribe: "Germany", vibe: "Earliest sharp entry", score: "+69" },
      { name: "0xOTAM...55", streak: 2, tribe: "Argentina", vibe: "Shared right after settle", score: "+64" },
      { name: "0xRICH...20", streak: 2, tribe: "Brazil", vibe: "Hype mode discussion spike", score: "+60" }
    ],
    overall: [
      { name: "0xMESSI...10", streak: 12, tribe: "Argentina", vibe: "Longest all-time run", score: "12 streak" },
      { name: "0xPELE...27", streak: 10, tribe: "Brazil", vibe: "Largest jackpot haul", score: "41.8 OKB" },
      { name: "0xRONA...88", streak: 9, tribe: "Portugal", vibe: "Strongest social pull", score: "3.2k impressions" },
      { name: "0xKYLI...91", streak: 8, tribe: "France", vibe: "Elite knockout accuracy", score: "88%" },
      { name: "0xBELL...77", streak: 8, tribe: "England", vibe: "Upset market specialist", score: "31.4 OKB" },
      { name: "0xMUSI...42", streak: 7, tribe: "Germany", vibe: "Consistent early entries", score: "29.9 OKB" },
      { name: "0xYAMA...66", streak: 7, tribe: "Spain", vibe: "Hall of fame draw caller", score: "26.5 OKB" },
      { name: "0xPULI...17", streak: 6, tribe: "USA", vibe: "Most new users converted", score: "98 invites" },
      { name: "0xALVA...11", streak: 6, tribe: "Spain", vibe: "Strong tribe coordination", score: "24.1 OKB" },
      { name: "0xOTAM...55", streak: 5, tribe: "Argentina", vibe: "Most NFT flex posts", score: "17 NFTs" }
    ],
    hype: [
      { name: "0xRONA...88", streak: 6, tribe: "Portugal", vibe: "Top hype mode player", score: "9 hype bets" },
      { name: "0xMESSI...10", streak: 5, tribe: "Argentina", vibe: "Largest rebate return", score: "2.6 OKB" },
      { name: "0xKYLI...91", streak: 5, tribe: "France", vibe: "Most copied signal", score: "71 followers" },
      { name: "0xRICH...20", streak: 4, tribe: "Brazil", vibe: "High risk high reward", score: "7 hype bets" },
      { name: "0xYAMA...66", streak: 4, tribe: "Spain", vibe: "Underdog hype hits", score: "6 hype bets" },
      { name: "0xBELL...77", streak: 3, tribe: "England", vibe: "Max social interaction", score: "58 comments" },
      { name: "0xPULI...17", streak: 3, tribe: "USA", vibe: "Best post-match recaps", score: "49 saves" },
      { name: "0xMUSI...42", streak: 3, tribe: "Germany", vibe: "Strong hype ROI", score: "+28%" },
      { name: "0xPELE...27", streak: 3, tribe: "Brazil", vibe: "Most fan reposts", score: "44 reposts" },
      { name: "0xALVA...11", streak: 2, tribe: "Spain", vibe: "Hot takes kept surfacing", score: "39 mentions" }
    ]
  }
};
