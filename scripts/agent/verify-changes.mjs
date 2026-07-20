import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { assertAgentChangesAuthorized, assertAppendOnly } from "../../agent/guardrails.ts";
import { validatePublicationBatch } from "../../agent/batch.ts";
import { articleSchema } from "../../app/lib/blog-schema.ts";
import { evaluateArticleRecord } from "../../agent/evaluator.ts";
import { evaluatePilot, pilotMemoryEntrySchema, productionErrorsByPilotDay } from "../../agent/pilot.ts";
import { products } from "../../app/lib/products.ts";

const baseFlag = process.argv.indexOf("--base");
const explicitBase = baseFlag >= 0 ? process.argv[baseFlag + 1] : null;
const modeFlag = process.argv.indexOf("--mode");
const requestedMode = modeFlag >= 0 ? process.argv[modeFlag + 1] : "content-publish";
if (!["auto", "content-publish", "evolution-proposal"].includes(requestedMode)) throw new Error(`Unsupported Agent mode: ${requestedMode}`);

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

const worktreePaths = git(["status", "--porcelain", "--untracked-files=all"]).split(/\r?\n/).filter(Boolean).map((line) => line.slice(3));
const base = explicitBase ?? (worktreePaths.length ? "HEAD" : "HEAD^");
const committedPaths = base === "HEAD" ? [] : git(["diff", "--name-only", `${base}...HEAD`]).split(/\r?\n/).filter(Boolean);
const paths = [...new Set([...committedPaths, ...worktreePaths])];

let mode = requestedMode;
if (requestedMode === "auto") {
  try {
    assertAgentChangesAuthorized(paths, "content-publish");
    mode = "content-publish";
  } catch (contentError) {
    if (process.env.AGENT_EVOLUTION_APPROVED !== "true") throw contentError;
    mode = "evolution-proposal";
  }
}
assertAgentChangesAuthorized(paths, mode);

for (const file of paths.filter((file) => file.startsWith("agent/memory/") && file.endsWith(".jsonl"))) {
  let before = "";
  try { before = execFileSync("git", ["show", `${base}:${file}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); } catch { before = ""; }
  const after = existsSync(file) ? readFileSync(file, "utf8") : "";
  assertAppendOnly(before, after);
}

if (mode === "content-publish") {
  const publishedFiles = paths.filter((file) => /^content\/blog\/published\/[^/]+\.json$/.test(file));
  if (publishedFiles.length > 5) throw new Error("A content-publish change may touch at most five published articles");

  const contentChanged = paths.some((file) => file.startsWith("content/blog/") && file !== "content/blog/index.ts");
  const reportFiles = paths.filter((file) => /^agent\/reports\/\d{4}-\d{2}-\d{2}-publication\.json$/.test(file));
  if (contentChanged && reportFiles.length !== 1) throw new Error("A content batch requires exactly one dated publication report");

  for (const reportFile of reportFiles) {
    const batch = validatePublicationBatch(JSON.parse(readFileSync(reportFile, "utf8")));
    if (!reportFile.endsWith(`/${batch.date}-publication.json`)) throw new Error("Publication report filename must match its date");
    try {
      execFileSync("git", ["cat-file", "-e", `${base}:${reportFile}`], { stdio: "ignore" });
      throw new Error(`Published batch reports are immutable: ${reportFile}`);
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Published batch reports are immutable")) throw error;
    }
    const articleFiles = paths.filter((file) => /^content\/blog\/(drafts|rejected|published)\/[^/]+\.json$/.test(file));
    const reportedSlugs = batch.candidates.map((candidate) => candidate.slug).sort();
    const changedSlugs = articleFiles.map((file) => file.split("/").at(-1).replace(/\.json$/, "")).sort();
    if (JSON.stringify(reportedSlugs) !== JSON.stringify(changedSlugs)) {
      throw new Error("Publication report must match exactly seven changed candidate files");
    }

    const reportedPublished = batch.candidates.filter((candidate) => candidate.outcome === "published").map((candidate) => candidate.slug).sort();
    const changedPublished = publishedFiles.map((file) => file.split("/").at(-1).replace(/\.json$/, "")).sort();
    if (JSON.stringify(reportedPublished) !== JSON.stringify(changedPublished)) {
      throw new Error("Publication report does not match the changed published article files");
    }

    const publishedDirectory = "content/blog/published";
    const publishedArticles = readdirSync(publishedDirectory).filter((file) => file.endsWith(".json"))
      .map((file) => articleSchema.parse(JSON.parse(readFileSync(path.join(publishedDirectory, file), "utf8"))));
    const validRelatedProductSlugs = new Set(products.map((product) => product.slug));

    for (const candidate of batch.candidates) {
      const directory = candidate.outcome === "published" ? "published" : candidate.outcome === "rejected" ? "rejected" : "drafts";
      const articleFile = `content/blog/${directory}/${candidate.slug}.json`;
      if (!existsSync(articleFile)) throw new Error(`Candidate record missing: ${articleFile}`);
      const article = articleSchema.parse(JSON.parse(readFileSync(articleFile, "utf8")));
      const allowedStatuses = candidate.outcome === "held" ? ["draft", "scheduled"] : [candidate.outcome];
      if (!allowedStatuses.includes(article.status)) throw new Error(`Candidate outcome does not match article status: ${candidate.slug}`);
      if (candidate.contentType !== article.contentType || candidate.revisionCount !== article.revisionCount) {
        throw new Error(`Publication report metadata does not match article: ${candidate.slug}`);
      }
      const evaluation = evaluateArticleRecord(article, {
        existingArticles: publishedArticles,
        assetExists: (imagePath) => existsSync(path.join("public", imagePath.replace(/^\//, ""))),
        validRelatedProductSlugs,
      });
      if (candidate.score !== evaluation.score) throw new Error(`Publication report score does not match independent evaluation: ${candidate.slug}`);
      if (candidate.outcome === "published" && !evaluation.publishable) {
        throw new Error(`Published candidate failed independent evaluation: ${candidate.slug} (${evaluation.failures.join("; ")})`);
      }
    }
  }

  for (const articleFile of paths.filter((file) => /^content\/blog\/(drafts|rejected|published)\/[^/]+\.json$/.test(file))) {
    let before = null;
    const articleName = articleFile.split("/").at(-1);
    for (const directory of ["drafts", "rejected", "published"]) {
      try {
        before = JSON.parse(execFileSync("git", ["show", `${base}:content/blog/${directory}/${articleName}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
        break;
      } catch { before = null; }
    }
    if (!before || !existsSync(articleFile)) continue;
    const after = JSON.parse(readFileSync(articleFile, "utf8"));
    const beforeAttempts = before.quality?.attempts ?? [];
    const afterAttempts = after.quality?.attempts ?? [];
    if (JSON.stringify(afterAttempts.slice(0, beforeAttempts.length)) !== JSON.stringify(beforeAttempts)) {
      throw new Error(`Article revision history is append-only: ${articleFile}`);
    }
  }

  if (publishedFiles.length) {
    const reportDirectory = "agent/reports";
    const reportFilesForPilot = readdirSync(reportDirectory).filter((file) => /^\d{4}-\d{2}-\d{2}-publication\.json$/.test(file)).sort().slice(0, 7);
    const pilotMemory = readFileSync("agent/memory/pilot.jsonl", "utf8").split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line))
      .filter((entry) => entry.type === "pilot-run").map((entry) => pilotMemoryEntrySchema.parse(entry));
    const productionErrorsByDay = productionErrorsByPilotDay(pilotMemory);
    for (let day = 1; day < reportFilesForPilot.length; day += 1) {
      if (!pilotMemory.some((entry) => entry.day === day)) throw new Error(`Post-production pilot record is required for completed day ${day}`);
      const expectedReportDate = reportFilesForPilot[day - 1].slice(0, 10);
      if (pilotMemory.some((entry) => entry.day === day && entry.reportDate !== expectedReportDate)) {
        throw new Error(`Post-production pilot record does not match report date for day ${day}`);
      }
    }
    const pilotRuns = reportFilesForPilot
      .map((file, index) => {
        const batch = validatePublicationBatch(JSON.parse(readFileSync(path.join(reportDirectory, file), "utf8")));
        return {
          day: index + 1,
          candidates: 7,
          passed: batch.candidates.filter((candidate) => candidate.score >= 95).length,
          productionErrors: productionErrorsByDay.get(index + 1) ?? 0,
        };
      });
    if (evaluatePilot(pilotRuns).status === "pause") throw new Error("Pilot is paused; autonomous publishing is disabled");
  }
}

console.log(`Agent guard passed for ${paths.length} changed path(s).`);
