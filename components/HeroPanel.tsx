"use client";

import Image from "next/image";
import type { Locale } from "@/lib/content";
import { copy } from "@/lib/content";
import { WalletButton } from "@/components/WalletButton";

export function HeroPanel({
  locale,
  onOpenNft
}: {
  locale: Locale;
  onOpenNft: () => void;
}) {
  const t = copy[locale];
  const worldCupSignals =
    locale === "zh"
      ? ["104 场世界杯叙事", "8 大国家队部落", "链上先知连胜榜", "一键发推冲榜"]
      : ["104-match World Cup arc", "8 national tribes", "On-chain prophet streaks", "One-click X flex"];

  const quickStats =
    locale === "zh"
      ? [
          { label: "焦点玩法", value: "连胜 2.0x", detail: "猜中越多，下一场倍率越高" },
          { label: "社交钩子", value: "Hype + NFT", detail: "狂热晒单 + 自动铸造先知徽章" }
        ]
      : [
          { label: "Core hook", value: "Streak to 2.0x", detail: "Every win upgrades the next call" },
          { label: "Social loop", value: "Hype + NFT", detail: "Flex hot calls and auto-mint proof" }
        ];

  return (
    <section className="noise hero-stage relative overflow-hidden rounded-[36px] border border-white/10 px-6 py-8 shadow-card fade-up md:px-10 md:py-12">
      <Image
        src="/images/hero-prophet-stage.jpg"
        alt="X Prophet Cup hero art"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-25"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_40%,rgba(107,223,242,0.25),transparent_24%),radial-gradient(circle_at_22%_18%,rgba(247,201,76,0.18),transparent_22%),linear-gradient(135deg,rgba(4,10,18,0.96),rgba(4,10,18,0.64)_46%,rgba(4,10,18,0.82))]" />
      <div className="hero-orbit absolute right-[14%] top-[16%] hidden h-[360px] w-[360px] rounded-full border border-amber-300/20 lg:block" />
      <div className="hero-orbit absolute right-[18%] top-[20%] hidden h-[280px] w-[280px] rounded-full border border-cyan-300/20 lg:block" />
      <div className="absolute -right-10 top-12 h-44 w-44 rounded-full bg-amber-300/25 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-cyan-300/14 blur-3xl" />
      <div className="absolute right-[8%] top-[28%] hidden h-44 w-44 rounded-full bg-blue-500/18 blur-3xl lg:block" />
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/12 px-4 py-2 text-sm text-amber-100">
            <span className="pulse-ring absolute ml-1 inline-flex h-3 w-3 rounded-full bg-amber-300/40" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-300" />
            {t.badge}
          </div>
          <h1
            className="headline-glow text-5xl uppercase leading-[0.94] text-white md:text-7xl xl:text-[5.5rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <WalletButton locale={locale} />
            <a
              href="#how-it-works"
              className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
            >
              {t.ctaSecondary}
            </a>
            <button
              type="button"
              onClick={onOpenNft}
              className="inline-flex items-center gap-2 rounded-full border-2 border-amber-300 bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(245,193,106,0.35)] transition hover:brightness-105"
            >
              <span aria-hidden="true">🔥</span>
              {locale === "zh" ? "了解先知 NFT" : "Explore Prophet NFT"}
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {worldCupSignals.map((signal) => (
              <div
                key={signal}
                className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.18em] text-slate-100 backdrop-blur"
              >
                {signal}
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {quickStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-white/10 bg-black/30 p-5 backdrop-blur"
              >
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">{item.label}</div>
                <div className="mt-3 text-3xl font-semibold text-white">{item.value}</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[26px] border border-white/10 bg-gradient-to-r from-white/10 via-cyan-300/10 to-amber-300/12 px-5 py-4 backdrop-blur">
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-100">
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-200">
                {locale === "zh" ? "世界杯模式已开启" : "World Cup mode is on"}
              </span>
              <span>{locale === "zh" ? "预测胜负、争夺部落池、解锁先知 NFT。" : "Predict outcomes, split tribe pools, unlock Prophet NFTs."}</span>
            </div>
          </div>
        </div>
        <div className="relative min-h-[540px] lg:min-h-[560px]">
          <div className="hero-gallery absolute inset-0">
            <div className="hero-gallery-aura hero-gallery-aura-amber absolute left-[8%] top-[10%] h-44 w-44 rounded-full blur-3xl" />
            <div className="hero-gallery-aura hero-gallery-aura-cyan absolute bottom-[14%] right-[10%] h-52 w-52 rounded-full blur-3xl" />
            <div className="hero-gallery-ring absolute left-1/2 top-[50%] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
            <div className="hero-gallery-pedestal absolute inset-x-[16%] bottom-[8%] h-14 rounded-full" />

            <div className="hero-card-hover hero-card-float-delayed hero-card-single absolute left-[15%] top-[4%] z-20 w-[84%] max-w-[450px] -translate-x-1/2 md:left-[15%] md:top-[2%] md:w-[88%]">
              <Image
                src="/images/group-100.png"
                alt={locale === "zh" ? "X Prophet Cup 首屏 NFT 主视觉" : "X Prophet Cup hero NFT visual"}
                width={1010}
                height={1158}
                priority
                className="hero-group-visual h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
