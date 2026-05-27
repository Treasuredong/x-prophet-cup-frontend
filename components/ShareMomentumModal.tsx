"use client";

import type { Locale } from "@/lib/content";
import { getShareUrl } from "@/lib/utils";

export function ShareMomentumModal({
  locale,
  open,
  onClose,
  title,
  body,
  shareText
}: {
  locale: Locale;
  open: boolean;
  onClose: () => void;
  title: string;
  body: string;
  shareText: string;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/82 px-4 py-8 backdrop-blur">
      <div className="w-full max-w-xl overflow-hidden rounded-[30px] border border-white/10 bg-[#09111f] shadow-2xl">
        <div className="bg-gradient-to-r from-amber-300/16 via-rose-400/10 to-cyan-300/12 p-6">
          <div className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-amber-100">
            {locale === "zh" ? "分享动量" : "Share Momentum"}
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
          <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-slate-200">
            {shareText}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={getShareUrl(shareText)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              {locale === "zh" ? "立即发到 X" : "Post to X"}
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
            >
              {locale === "zh" ? "稍后再说" : "Maybe Later"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
