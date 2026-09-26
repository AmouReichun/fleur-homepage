import * as fs from "fs";
import * as path from "path";

const STATS_PATH = path.join(process.cwd(), "data", "monthly-generate-count.json");

function getMonthKey(): string {
  const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 7);
}

function readStats(): Record<string, number> {
  try {
    return JSON.parse(fs.readFileSync(STATS_PATH, "utf-8"));
  } catch {
    return {};
  }
}

export function getMonthlyCount(): number {
  return readStats()[getMonthKey()] ?? 0;
}

export function getRemainingQuota(limit: number): number {
  return Math.max(0, limit - getMonthlyCount());
}

export function addToMonthlyCount(n: number): void {
  const stats = readStats();
  const key = getMonthKey();
  stats[key] = (stats[key] ?? 0) + n;
  fs.mkdirSync(path.dirname(STATS_PATH), { recursive: true });
  fs.writeFileSync(STATS_PATH, JSON.stringify(stats, null, 2) + "\n", "utf-8");
}
