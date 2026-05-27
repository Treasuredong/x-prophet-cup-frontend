"use client";

import { revenueModel, type Locale } from "@/lib/content";

export function RevenueModelSection({ locale }: { locale: Locale }) {
  const model = revenueModel[locale];

  return (
    <section className="glass rounded-[28px] p-6 fade-up">
      <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">{model.eyebrow}</div>
      <h2 className="mt-2 max-w-5xl text-2xl font-semibold text-white">{model.title}</h2>
      <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">{model.description}</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {model.cards.map((card) => (
          <article key={card.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">{card.title}</div>
            <div className="mt-3 text-2xl font-semibold text-white">{card.metric}</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">{card.detail}</p>
            <div className="mt-4 space-y-3">
              {card.points.map((point) => (
                <div key={point} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm leading-6 text-slate-200">
                  {point}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-[26px] border border-emerald-300/18 bg-emerald-300/8 p-5">
        <div className="text-xs uppercase tracking-[0.22em] text-emerald-200">{model.exampleTitle}</div>
        <p className="mt-3 text-sm leading-7 text-slate-100">{model.exampleBody}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {model.exampleItems.map((item) => (
            <div key={item} className="rounded-[20px] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-100">
              {item}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-300">{model.footer}</p>
    </section>
  );
}
