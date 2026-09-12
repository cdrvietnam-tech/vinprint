type AgentMode = "content-publish" | "evolution-proposal";

const lockedPaths = [
  "agent/charter.md",
  "agent/rubric.json",
  "agent/evaluator.ts",
  "agent/guardrails.ts",
  ".github/workflows/",
  "app/",
  "worker/",
];

const contentPublishPaths = [
  "agent/operator/drafts/",
  "agent/memory/",
  "agent/reports/",
];

function normalizePath(path: string) {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}

export function assertAgentChangesAuthorized(paths: string[], mode: AgentMode) {
  if (!["content-publish", "evolution-proposal"].includes(mode)) throw new Error("Unknown Agent mode");
  for (const rawPath of paths) {
    const path = normalizePath(rawPath);
    if (path.startsWith("/") || path.includes(":") || path.split("/").some((part) => part === ".." || !part)) throw new Error(`Unsafe path: ${path}`);
    const locked = lockedPaths.some((prefix) => path === prefix || path.startsWith(prefix));
    if (mode === "content-publish" && locked) throw new Error(`Locked surface cannot be changed by Agent: ${path}`);
    if (mode === "content-publish" && !contentPublishPaths.some((prefix) => path.startsWith(prefix))) {
      throw new Error(`Path is not authorized for content-publish mode: ${path}`);
    }
    if (mode === "content-publish" && !/\.(md|json|jsonl)$/.test(path)) throw new Error(`Only local draft/report data is authorized: ${path}`);
  }
}

export function assertAppendOnly(before: string, after: string) {
  if (!after.startsWith(before)) throw new Error("Memory log is append-only and existing history was changed");
}
