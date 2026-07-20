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
  "content/blog/",
  "public/images/blog/",
  "agent/memory/",
  "agent/reports/",
];

function normalizePath(path: string) {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}

export function assertAgentChangesAuthorized(paths: string[], mode: AgentMode) {
  for (const rawPath of paths) {
    const path = normalizePath(rawPath);
    const locked = lockedPaths.some((prefix) => path === prefix || path.startsWith(prefix));
    if (mode === "content-publish" && locked) throw new Error(`Locked surface cannot be changed by Agent: ${path}`);
    if (mode === "content-publish" && !contentPublishPaths.some((prefix) => path.startsWith(prefix))) {
      throw new Error(`Path is not authorized for content-publish mode: ${path}`);
    }
  }
}

export function assertAppendOnly(before: string, after: string) {
  if (!after.startsWith(before)) throw new Error("Memory log is append-only and existing history was changed");
}
