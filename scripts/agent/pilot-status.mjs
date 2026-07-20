import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { evaluatePilot, pilotMemoryEntrySchema, productionErrorsByPilotDay } from "../../agent/pilot.ts";
import { validatePublicationBatch } from "../../agent/batch.ts";

const pilotMemory = readFileSync("agent/memory/pilot.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line))
  .filter((entry) => entry.type === "pilot-run").map((entry) => pilotMemoryEntrySchema.parse(entry));
const productionErrorsByDay = productionErrorsByPilotDay(pilotMemory);
const runs = readdirSync("agent/reports").filter((file) => /^\d{4}-\d{2}-\d{2}-publication\.json$/.test(file)).sort().slice(0, 7)
  .map((file, index) => {
    const batch = validatePublicationBatch(JSON.parse(readFileSync(path.join("agent/reports", file), "utf8")));
    return {
      day: index + 1,
      candidates: 7,
      passed: batch.candidates.filter((candidate) => candidate.score >= 95).length,
      productionErrors: productionErrorsByDay.get(index + 1) ?? 0,
    };
  });
console.log(JSON.stringify(evaluatePilot(runs), null, 2));
