import {
  boxCounts,
  boxPrices,
  dictionaries,
  packagePrices,
  singlePrices,
  type Language,
} from "@/lib/content";
export type PricingItem = {
  id: string;
  kind: "package" | "single" | "box";
  title: string;
  title_nl: string;
  title_en: string;
  title_fr: string;
  description_nl: string;
  description_en: string;
  description_fr: string;
  price: number;
  image: string | null;
  quantity: number | null;
};
export const pricingTitle = (item: PricingItem, lang: Language) =>
  item[`title_${lang}`] || item.title;
export const pricingDescription = (item: PricingItem, lang: Language) =>
  item[`description_${lang}`] || "";
export function basePricing(): PricingItem[] {
  const translate = (
    index: number,
    kind: PricingItem["kind"],
    lang: Language,
  ) => {
    const d = dictionaries[lang].pricing;
    if (kind === "package") {
      const [title, description, features] = d.packages[index] as [
        string,
        string,
        string[],
      ];
      return { title, description: [description, ...features].join("\n") };
    }
    if (kind === "single")
      return { title: d.singleNames[index], description: "" };
    const count = boxCounts[index];
    return {
      title: `${count} ${count === 1 ? d.boxUnit : d.boxUnits}`,
      description: "",
    };
  };
  return (
    [
      {
        kind: "package",
        prices: packagePrices,
        ids: ["package-fivem", "package-discord", "package-streamer"],
      },
      {
        kind: "single",
        prices: singlePrices,
        ids: [
          "single-logo",
          "single-banner",
          "single-logo-animation",
          "single-banner-animation",
          "single-thumbnail",
        ],
      },
      {
        kind: "box",
        prices: boxPrices,
        ids: boxCounts.map((count) => "box-" + count),
      },
    ] as const
  ).flatMap((group) =>
    group.prices.map((price, index) => {
      const nl = translate(index, group.kind, "nl"),
        en = translate(index, group.kind, "en"),
        fr = translate(index, group.kind, "fr");
      return {
        id: group.ids[index],
        kind: group.kind,
        title: nl.title,
        title_nl: nl.title,
        title_en: en.title,
        title_fr: fr.title,
        description_nl: nl.description,
        description_en: en.description,
        description_fr: fr.description,
        price,
        image: null,
        quantity: group.kind === "box" ? boxCounts[index] : null,
      };
    }),
  );
}
