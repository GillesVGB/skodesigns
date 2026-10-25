import { env } from "./platform";
import { projects, type Project } from "@/lib/content";
import { basePricing, type PricingItem } from "@/lib/pricing-catalog";
export async function readCatalog(): Promise<Project[]> {
  if (!env.DB) return projects;
  const [hidden, added] = await env.DB.batch([
    env.DB.prepare("SELECT id FROM hidden_projects"),
    env.DB.prepare(
      "SELECT id,title,category,image,width,height,featured FROM portfolio_items WHERE deleted_at IS NULL ORDER BY created_at DESC",
    ),
  ]);
  const hiddenIds = new Set(
    (hidden.results as unknown as { id: string }[]).map((row) => row.id),
  );
  const additions = (added.results as Record<string, unknown>[]).map((row) => ({
    ...row,
    featured: !!row.featured,
  })) as Project[];
  return [
    ...additions,
    ...projects.filter((project) => !hiddenIds.has(project.id)),
  ];
}
export async function readPricing(): Promise<PricingItem[]> {
  if (!env.DB) return basePricing();
  const rows = await env.DB.prepare(
    "SELECT * FROM store_items ORDER BY created_at ASC",
  ).all<PricingItem & { deleted_at: number | null }>();
  const overrides = new Map(rows.results.map((row) => [row.id, row]));
  const baseline = basePricing().flatMap((item) => {
    const override = overrides.get(item.id);
    return override ? (override.deleted_at === null ? [override] : []) : [item];
  });
  const baseIds = new Set(basePricing().map((item) => item.id));
  return [
    ...baseline,
    ...rows.results.filter(
      (row) => row.deleted_at === null && !baseIds.has(row.id),
    ),
  ];
}
