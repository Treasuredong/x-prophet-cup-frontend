"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { RevenueModelSection } from "@/components/RevenueModelSection";
import { WalletButton } from "@/components/WalletButton";
import {
  CONTRACT_ADDRESS,
  X_PROPHET_CUP_ABI,
  type ContractMarketTuple
} from "@/lib/contract";
import { formatUnix } from "@/lib/format";
import {
  readHiddenMarketIds,
  toggleHiddenMarketId,
  writeHiddenMarketIds
} from "@/lib/market-visibility";
import { XLAYER_MAINNET } from "@/lib/xlayer";

const isConfigured = CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000";
type FeedbackTone = "success" | "error" | "info";

function toUnixSeconds(value: string) {
  return Math.floor(new Date(value).getTime() / 1000);
}

function toLocalDatetimeInput(offsetHours: number) {
  const target = new Date(Date.now() + offsetHours * 3600 * 1000);
  const year = target.getFullYear();
  const month = `${target.getMonth() + 1}`.padStart(2, "0");
  const day = `${target.getDate()}`.padStart(2, "0");
  const hours = `${target.getHours()}`.padStart(2, "0");
  const minutes = `${target.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function buildMarketSlug(matchInfo: string, kickoffUnix: number) {
  const normalized = matchInfo
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  return normalized ? `${normalized}-${kickoffUnix}` : `market-${kickoffUnix}`;
}

function getErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error);

  if (raw.includes("User rejected")) return "你取消了钱包确认，交易没有发送。";
  if (raw.includes("DeadlineNotFuture")) return "时间无效：开球时间和下注截止时间都必须晚于当前时间。";
  if (raw.includes("DeadlineMustPrecedeKickoff")) return "时间顺序无效：下注截止时间必须早于开球时间。";
  if (raw.includes("ResolveTooEarly")) return "还不能公布赛果：必须等到下注截止时间之后。";
  if (raw.includes("0xe9445d54")) return "还不能公布赛果：必须等到下注截止时间之后。";
  if (raw.includes("InvalidMarket")) return "赛事编号无效，请重新选择要操作的赛事。";
  if (raw.includes("InvalidOutcome")) return "赛果选项无效，请重新选择主胜、平局或客胜。";
  if (raw.includes("ConnectorChainMismatchError")) return "钱包连接状态和当前链不一致，请断开后重新连接钱包。";
  if (raw.includes("ChainMismatchError")) return "当前钱包网络不正确，请切换到 X Layer 主网后重试。";

  return raw;
}

export default function AdminPage() {
  const { address, chainId, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();
  const [matchInfo, setMatchInfo] = useState("");
  const [kickoff, setKickoff] = useState("");
  const [deadline, setDeadline] = useState("");
  const [resolveMarketId, setResolveMarketId] = useState("0");
  const [winningOutcome, setWinningOutcome] = useState(0);
  const [feedback, setFeedback] = useState<{ tone: FeedbackTone; message: string } | null>(null);
  const [hiddenMarketIds, setHiddenMarketIds] = useState<number[]>([]);

  const quickTemplates = [
    {
      matchInfo: "阿根廷 vs 巴西",
      kickoffOffsetHours: 30
    },
    {
      matchInfo: "英格兰 vs 葡萄牙",
      kickoffOffsetHours: 54
    },
    {
      matchInfo: "法国 vs 西班牙",
      kickoffOffsetHours: 78
    }
  ];

  const { data: ownerData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: X_PROPHET_CUP_ABI,
    functionName: "owner",
    query: { enabled: isConfigured }
  });

  const { data: marketCountData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: X_PROPHET_CUP_ABI,
    functionName: "marketCount",
    query: { enabled: isConfigured }
  });

  const marketIds = useMemo(
    () => Array.from({ length: Number(marketCountData ?? 0) }, (_, index) => index),
    [marketCountData]
  );

  const { data: marketReads } = useReadContracts({
    contracts: marketIds.map((marketId) => ({
      address: CONTRACT_ADDRESS,
      abi: X_PROPHET_CUP_ABI,
      functionName: "getMarket",
      args: [marketId]
    })),
    query: { enabled: isConfigured && marketIds.length > 0 }
  });

  const isOwner =
    typeof ownerData === "string" &&
    typeof address === "string" &&
    ownerData.toLowerCase() === address.toLowerCase();

  const liveMarkets = useMemo(() => {
    return marketIds.map((marketId, index) => {
      const read = marketReads?.[index];
      if (read?.status !== "success" || !read.result) {
        return null;
      }

      const result = read.result as unknown as ContractMarketTuple;
      return {
        id: marketId,
        match: result[1],
        kickoff: formatUnix(result[2]),
        deadline: formatUnix(result[3]),
        resolved: result[6],
        winner: Number(result[7])
      };
    });
  }, [marketIds, marketReads]);

  function openFeedback(message: string, tone: FeedbackTone = "info") {
    setFeedback({ message, tone });
  }

  useEffect(() => {
    setHiddenMarketIds(readHiddenMarketIds());

    function syncHiddenMarkets() {
      setHiddenMarketIds(readHiddenMarketIds());
    }

    window.addEventListener("storage", syncHiddenMarkets);
    window.addEventListener("xpc-market-visibility-updated", syncHiddenMarkets);

    return () => {
      window.removeEventListener("storage", syncHiddenMarkets);
      window.removeEventListener("xpc-market-visibility-updated", syncHiddenMarkets);
    };
  }, []);

  function loadTemplateToForm(template: (typeof quickTemplates)[number]) {
    setMatchInfo(template.matchInfo);
    setKickoff(toLocalDatetimeInput(template.kickoffOffsetHours));
    setDeadline(toLocalDatetimeInput(template.kickoffOffsetHours - 0.33));
    openFeedback(`已将首发模板 ${template.matchInfo} 填入表单，可继续微调后创建`);
  }

  async function copyMarketText(text: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      openFeedback(`已复制：${text}`, "success");
    } catch {
      openFeedback("复制失败，请手动复制。", "error");
    }
  }

  function handleToggleVisibility(marketId: number) {
    const next = toggleHiddenMarketId(marketId);
    setHiddenMarketIds(next);
    const isHidden = next.includes(marketId);
    openFeedback(isHidden ? `Market #${marketId} 已从前台隐藏` : `Market #${marketId} 已恢复前台展示`, "success");
  }

  function handleShowAllMarkets() {
    writeHiddenMarketIds([]);
    setHiddenMarketIds([]);
    openFeedback("已恢复所有赛事在前台展示", "success");
  }

  async function handleCreateMarket() {
    if (!matchInfo.trim()) {
      openFeedback("请先填写比赛名称。", "error");
      return;
    }

    if (!kickoff || !deadline) {
      openFeedback("请先填写开球时间和下注截止时间。", "error");
      return;
    }

    const kickoffUnix = toUnixSeconds(kickoff);
    const deadlineUnix = toUnixSeconds(deadline);

    if (!Number.isFinite(kickoffUnix) || !Number.isFinite(deadlineUnix)) {
      openFeedback("时间格式无效。", "error");
      return;
    }

    if (deadlineUnix >= kickoffUnix) {
      openFeedback("下注截止时间必须早于开球时间。", "error");
      return;
    }

    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: X_PROPHET_CUP_ABI,
        functionName: "createMarket",
        args: [
          buildMarketSlug(matchInfo, kickoffUnix),
          matchInfo,
          BigInt(kickoffUnix),
          BigInt(deadlineUnix),
          0,
          0
        ]
      });

      openFeedback("赛事创建交易已发送，请在钱包中确认或等待链上回执。", "success");
    } catch (error) {
      openFeedback(getErrorMessage(error), "error");
    }
  }

  async function handleResolveMarket() {
    if (!resolveMarketId) {
      openFeedback("请先选择要公布赛果的 Market ID。", "error");
      return;
    }

    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: X_PROPHET_CUP_ABI,
        functionName: "resolveMarket",
        args: [BigInt(resolveMarketId), winningOutcome]
      });

      openFeedback("赛果公布交易已发送，请在钱包中确认或等待链上回执。", "success");
    } catch (error) {
      openFeedback(getErrorMessage(error), "error");
    }
  }

  async function handleCreateQuickTemplates() {
    try {
      for (const item of quickTemplates) {
        const kickoffUnix = Math.floor(Date.now() / 1000) + item.kickoffOffsetHours * 3600;
        const deadlineUnix = kickoffUnix - 20 * 60;

        await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: X_PROPHET_CUP_ABI,
          functionName: "createMarket",
          args: [
            buildMarketSlug(item.matchInfo, kickoffUnix),
            item.matchInfo,
            BigInt(kickoffUnix),
            BigInt(deadlineUnix),
            0,
            0
          ]
        });
      }

      openFeedback("3 场首发模板赛事创建交易已依次发送。", "success");
    } catch (error) {
      openFeedback(getErrorMessage(error), "error");
    }
  }

  return (
    <main className="pitch-grid min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Admin Console</div>
            <h1 className="mt-2 text-4xl font-semibold text-white">X Prophet Cup Admin</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              这是无服务器的链上运营面板。你只需要 owner 钱包，就可以新增赛事、控制赛事数量并在比赛结束后公布赛果。
            </p>
          </div>
          <WalletButton locale="zh" />
        </div>

        <section className="glass rounded-[28px] p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Contract</div>
              <div className="mt-2 break-all text-sm text-white">
                {isConfigured ? CONTRACT_ADDRESS : "未配置合约地址"}
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Owner Access</div>
              <div className="mt-2 text-sm text-white">
                {isOwner ? "当前钱包已获得 owner 权限" : "请连接 owner 钱包进行管理"}
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Chain Status</div>
              <div className="mt-2 text-sm text-white">
                {isConnected
                  ? chainId === XLAYER_MAINNET.chainId
                    ? "已连接 X Layer 主网"
                    : "请切换到 X Layer 主网"
                  : "请先连接钱包"}
              </div>
            </div>
          </div>
        </section>

        <section className="glass rounded-[28px] p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Mainnet Rollout</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">真实测试网验证状态</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
            当前版本已经完成 X Layer 链上完整闭环验证，接下来会按官方要求将正式合约部署到 X Layer 主网，不再使用测试网作为最终参赛环境。
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Live Contract</div>
              <div className="mt-2 break-all text-sm text-white">{CONTRACT_ADDRESS}</div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Launch Markets</div>
              <div className="mt-2 text-sm text-white">已上链 3 场首发赛事</div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">QA Flow</div>
              <div className="mt-2 text-sm text-white">已完成真实下注、开奖、结算与 NFT 解锁验证</div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Live NFT</div>
              <div className="mt-2 text-sm text-white">3 连胜 Prophet NFT 已真实铸造</div>
            </div>
          </div>
          <div className="mt-5 rounded-[22px] border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-slate-200">
            最新一轮链上 QA 已确认：`0.055 OKB` 的 Hype 下注会拆成 `0.047 OKB` 奖励池、`0.002 OKB`
            Hype 池、`0.0035 OKB` 协议收入和 `0.0015 OKB` 增长激励；随后又连续完成 3 次真实命中，已确认
            `userStreak = 3`、`userBestStreak = 3`、`hasMintedProphet = true`，并由测试网钱包真实持有 `token #1`。
          </div>
        </section>

        <section className="glass rounded-[28px] p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Business Model</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">收费模型与商业化说明</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
            这一块不再在前台直接展示给普通用户，而是作为后台运营与赛方评审材料的一部分保留。前台只保留下注区里的手续费说明，后台则集中说明协议收入、增长激励、部落池和 Hype 分账逻辑，方便你做项目叙事和答辩展示。
          </p>
          <div className="mt-6">
            <RevenueModelSection locale="zh" />
          </div>
        </section>

        <section className="glass rounded-[28px] p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Create Market</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">新增赛事</h2>
          <div className="mt-4 rounded-[22px] border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-slate-200">
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">填写说明</div>
            <p className="mt-3">
              比如你要新增 `墨西哥 vs 南非`：
              `比赛名称` 直接填 `墨西哥 vs 南非`，
              再设置 `开球时间` 和 `下注截止时间` 即可。
            </p>
            <p className="mt-2">
              部落不再和参赛球队绑定。8 个固定部落是前台用户下注时选择的 SocialFi 阵营，所以后台创建赛事时只需要管理比赛本身。
            </p>
          </div>
          <div className="mt-4 rounded-[22px] border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
            上线准备阶段可以直接用模板快速生成 3 场焦点战，不需要手动一场一场填。
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCreateQuickTemplates}
                disabled={!isOwner || isPending || !isConfigured}
                className="rounded-full border border-amber-300 bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "交易发送中..." : "快速创建 3 场首发赛事"}
              </button>
              {quickTemplates.map((template) => (
                <button
                  key={template.matchInfo}
                  type="button"
                  onClick={() => loadTemplateToForm(template)}
                  className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/14"
                >
                  回填 {template.matchInfo}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={matchInfo}
              onChange={(event) => setMatchInfo(event.target.value)}
              placeholder="比赛名称，例如 墨西哥 vs 南非"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
            <label className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">开球时间</div>
              <input
                value={kickoff}
                onChange={(event) => setKickoff(event.target.value)}
                type="datetime-local"
                className="w-full bg-transparent text-white outline-none"
              />
            </label>
            <label className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">下注截止时间</div>
              <input
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
                type="datetime-local"
                className="w-full bg-transparent text-white outline-none"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={handleCreateMarket}
            disabled={!isOwner || isPending || !isConfigured}
            className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "交易发送中..." : "创建赛事"}
          </button>
        </section>

        <section className="glass rounded-[28px] p-6">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Resolve Market</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">公布赛果</h2>
          <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
            你可以直接从下方赛事列表复制 market id，或者在这里用下拉选择现有赛事。
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              value={resolveMarketId}
              onChange={(event) => setResolveMarketId(event.target.value)}
              placeholder="market id"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
            <select
              value={resolveMarketId}
              onChange={(event) => setResolveMarketId(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            >
              <option value="">选择已创建赛事</option>
              {liveMarkets.map((market) =>
                market ? (
                  <option key={market.id} value={market.id}>
                    #{market.id} · {market.match}
                  </option>
                ) : null
              )}
            </select>
            <select
              value={winningOutcome}
              onChange={(event) => setWinningOutcome(Number(event.target.value))}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            >
              <option value={0}>主胜 / Home</option>
              <option value={1}>平局 / Draw</option>
              <option value={2}>客胜 / Away</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleResolveMarket}
            disabled={!isOwner || isPending || !isConfigured}
            className="mt-5 rounded-full border border-amber-300 bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "交易发送中..." : "公布赛果"}
          </button>
        </section>

        <section className="glass rounded-[28px] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Current Markets</div>
              <h2 className="mt-2 text-2xl font-semibold text-white">已创建赛事</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                当前数量: {marketIds.length}
              </div>
              <div className="rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm text-amber-100">
                已隐藏: {hiddenMarketIds.length}
              </div>
              <button
                type="button"
                onClick={handleShowAllMarkets}
                className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/14"
              >
                恢复全部前台展示
              </button>
            </div>
          </div>
          <div className="mt-4 rounded-[22px] border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm leading-6 text-slate-200">
            这里的“隐藏/恢复展示”是轻运营模式，不改链上数据，只控制首页是否展示这场赛事。很适合上线准备阶段快速上下架比赛与调整首页节奏。
          </div>
          <div className="mt-6 grid gap-4">
            {liveMarkets.length ? (
              liveMarkets.map((market) =>
                market ? (
                  <div
                    key={market.id}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm text-slate-300"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                          Market #{market.id}
                        </div>
                        <div className="mt-2 text-lg font-semibold text-white">{market.match}</div>
                        <div className="mt-2 leading-6">
                          Kickoff: {market.kickoff}
                          <br />
                          Deadline: {market.deadline}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white">
                          {market.resolved ? `已公布赛果 · ${market.winner}` : "进行中"}
                        </div>
                        <div
                          className={`rounded-full px-3 py-1 text-xs ${
                            hiddenMarketIds.includes(market.id)
                              ? "border border-rose-300/25 bg-rose-300/12 text-rose-100"
                              : "border border-emerald-300/25 bg-emerald-300/12 text-emerald-100"
                          }`}
                        >
                          {hiddenMarketIds.includes(market.id) ? "前台已隐藏" : "前台展示中"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => copyMarketText(String(market.id))}
                        className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/14"
                      >
                        复制 Market ID
                      </button>
                      <button
                        type="button"
                        onClick={() => copyMarketText(market.match)}
                        className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/14"
                      >
                        复制比赛名称
                      </button>
                      {!market.resolved ? (
                        <button
                          type="button"
                          onClick={() => {
                            setResolveMarketId(String(market.id));
                            openFeedback(`已选中 Market #${market.id}，现在只需选择赛果并公布`, "info");
                          }}
                          className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/16"
                        >
                          选中用于公布赛果
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(market.id)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                          hiddenMarketIds.includes(market.id)
                            ? "border border-emerald-300/30 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/16"
                            : "border border-rose-300/30 bg-rose-300/10 text-rose-100 hover:bg-rose-300/16"
                        }`}
                      >
                        {hiddenMarketIds.includes(market.id) ? "恢复前台展示" : "从前台隐藏"}
                      </button>
                    </div>
                  </div>
                ) : null
              )
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-slate-300">
                当前还没有赛事。创建新赛事后，前台会自动展示对应数量。
              </div>
            )}
          </div>
        </section>

      </div>
      {feedback ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
          <div
            className={`w-full max-w-md rounded-[28px] border p-6 shadow-2xl ${
              feedback.tone === "error"
                ? "border-rose-300/25 bg-slate-950 text-rose-100"
                : feedback.tone === "success"
                  ? "border-emerald-300/25 bg-slate-950 text-emerald-100"
                  : "border-cyan-300/25 bg-slate-950 text-cyan-100"
            }`}
          >
            <div className="text-xs uppercase tracking-[0.24em] opacity-80">
              {feedback.tone === "error" ? "操作失败" : feedback.tone === "success" ? "操作已提交" : "操作提示"}
            </div>
            <p className="mt-3 text-sm leading-7">{feedback.message}</p>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="mt-5 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/14"
            >
              我知道了
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
