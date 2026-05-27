"use client";

import type { Locale } from "@/lib/content";
import { cn } from "@/lib/utils";

export function LocaleSwitch({
  locale,
  onChange
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div className="glass inline-flex rounded-full p-1">
      {(["zh", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition",
            item === locale ? "bg-white text-slate-900" : "text-slate-300 hover:text-white"
          )}
        >
          {item === "zh" ? "中文" : "EN"}
        </button>
      ))}
    </div>
  );
}

