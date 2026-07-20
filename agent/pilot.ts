import { z } from "zod";

export type PilotRun = {
  day: number;
  candidates: number;
  passed: number;
  productionErrors: number;
};

export const pilotRunSchema = z.object({
  day: z.number().int().min(1).max(7),
  candidates: z.literal(7),
  passed: z.number().int().min(0).max(7),
  productionErrors: z.number().int().min(0),
});

export const pilotMemoryEntrySchema = pilotRunSchema.extend({
  type: z.literal("pilot-run"),
  reportDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  recordedAt: z.string().datetime({ offset: true }),
});

export function productionErrorsByPilotDay(entries: unknown[]) {
  const errors = new Map<number, number>();
  for (const input of entries) {
    const entry = pilotMemoryEntrySchema.parse(input);
    errors.set(entry.day, (errors.get(entry.day) ?? 0) + entry.productionErrors);
  }
  return errors;
}

export type PilotEvaluation = {
  status: "active" | "continue" | "pause";
  completedDays: number;
  passRate: number;
  productionErrors: number;
};

export function evaluatePilot(runs: PilotRun[]): PilotEvaluation {
  const ordered = runs.map((run) => pilotRunSchema.parse(run)).sort((a, b) => a.day - b.day).slice(0, 7);
  if (new Set(ordered.map((run) => run.day)).size !== ordered.length) throw new Error("Pilot days must be unique");
  const candidates = ordered.reduce((total, run) => total + run.candidates, 0);
  const passed = ordered.reduce((total, run) => total + run.passed, 0);
  const productionErrors = ordered.reduce((total, run) => total + run.productionErrors, 0);
  const passRate = candidates > 0 ? passed / candidates : 0;
  const status = productionErrors > 0 ? "pause" : ordered.length < 7 ? "active" : passRate >= 0.8 ? "continue" : "pause";
  return { status, completedDays: ordered.length, passRate, productionErrors };
}
