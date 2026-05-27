import type { Locale } from "@/lib/content";

const TEAM_NAME_MAP: Record<string, string> = {
  阿根廷: "Argentina",
  巴西: "Brazil",
  法国: "France",
  德国: "Germany",
  西班牙: "Spain",
  英格兰: "England",
  葡萄牙: "Portugal",
  美国: "United States",
  墨西哥: "Mexico",
  南非: "South Africa",
  韩国: "South Korea",
  捷克: "Czech Republic",
  加拿大: "Canada",
  波黑: "Bosnia and Herzegovina",
  日本: "Japan",
  荷兰: "Netherlands",
  比利时: "Belgium",
  克罗地亚: "Croatia",
  塞尔维亚: "Serbia",
  瑞士: "Switzerland",
  摩洛哥: "Morocco",
  丹麦: "Denmark",
  澳大利亚: "Australia",
  喀麦隆: "Cameroon",
  波兰: "Poland",
  乌拉圭: "Uruguay",
  哥伦比亚: "Colombia",
  智利: "Chile",
  奥地利: "Austria",
  瑞典: "Sweden",
  挪威: "Norway",
  土耳其: "Turkey",
  乌克兰: "Ukraine"
};

function translateTeamName(name: string, locale: Locale) {
  const cleaned = name.trim();
  if (locale === "zh") return cleaned;
  return TEAM_NAME_MAP[cleaned] ?? cleaned;
}

export function localizeMatchName(match: string, locale: Locale) {
  if (locale === "zh") return match;

  const parts = match.split(/\s+vs\s+|\s+VS\s+|\s+v\s+/i).map((part) => part.trim());
  if (parts.length >= 2) {
    return `${translateTeamName(parts[0], locale)} vs ${translateTeamName(parts[1], locale)}`;
  }

  return translateTeamName(match, locale);
}
