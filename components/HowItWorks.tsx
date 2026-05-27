"use client";

import type { Locale } from "@/lib/content";
import { copy } from "@/lib/content";

type Props = {
  locale: Locale;
};

export function HowItWorks({ locale }: Props) {
  const t = copy[locale];

  const steps =
    locale === "zh"
      ? [
          {
            title: "1. 选比赛 + 选部落",
            body: "先在比赛列表里选择一场比赛，再从 8 个固定部落里选一个作为你的 SocialFi 阵营。部落不跟球队绑定，而是跟随这笔预测进入共享池。"
          },
          {
            title: "2. 选赛果 + 是否狂热加注",
            body: "在主胜、平局、客胜中选一个结果，输入 OKB 金额。想冲热榜就打开狂热加注，多付 10%，其中一部分进入 Hype 奖池，一部分沉淀为协议收入和增长激励。"
          },
          {
            title: "3. 等开奖后回来结算",
            body: "命中后领取奖励并更新连胜；连胜越高，下次预测权重越高。连中 3 场会自动铸造 Prophet NFT。"
          }
        ]
      : [
          {
            title: "1. Pick a match and a tribe",
            body: "Choose a match, then pick one of the 8 fixed tribes as your SocialFi faction. The tribe is not tied to the teams in the match and follows the position into the shared pool."
          },
          {
            title: "2. Pick the outcome and hype mode",
            body: "Choose home, draw, or away, then enter your OKB stake. Turn on hype mode to pay 10% extra, with the surcharge split across the Hype pool, protocol revenue, and growth incentives."
          },
          {
            title: "3. Return after resolution",
            body: "Claim rewards after the market resolves. Correct calls increase your streak, and a 3-win streak auto-mints a Prophet NFT."
          }
        ];

  return (
    <section id="how-it-works" className="glass rounded-[28px] p-6 fade-up">
      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{t.howTitle}</div>
      <h2 className="mt-2 text-2xl font-semibold text-white">{t.howTitle}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{t.howDesc}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="text-base font-semibold text-white">{step.title}</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
