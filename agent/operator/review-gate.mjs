// Loaded from the trusted base branch by pull_request_target / issue_comment.
// No checkout, evaluation, or execution of pull-request content is permitted.
export function autonomousFile(file) {
  const safe = (p) => typeof p === "string" && !p.includes("\\") && !p.includes(":") && !p.split("/").some(x => !x || x === ".." || x === ".") &&
    /^(agent\/operator\/drafts\/|agent\/reports\/|agent\/memory\/)/.test(p) && /\.(md|json|jsonl)$/.test(p);
  return ["added", "modified"].includes(file.status) && safe(file.filename) && !file.previous_filename;
}

export function evaluateApproval({ files, headSha, comments, adminLogins, title, branch }) {
  if (!Array.isArray(files) || !files.length || !/^[0-9a-f]{40}$/.test(headSha)) return { approved: false, reason: "Missing complete diff or valid head" };
  if (files.every(autonomousFile)) return { approved: true, reason: "Internal draft/report changes only; no production authorization" };
  if (!title.startsWith("[Agent Evolution]") || !branch.startsWith("agent-evolution/")) return { approved: false, reason: "Use an Agent Evolution PR" };
  const allowed = new Set(adminLogins);
  const relevant = comments.filter(c => allowed.has(c.user?.login) && c.user?.type === "User" &&
    [ `/approve-agent-evolution ${headSha}`, `/revoke-agent-evolution ${headSha}` ].includes(c.body?.trim()))
    .sort((a,b) => (Date.parse(a.updated_at || a.created_at) - Date.parse(b.updated_at || b.created_at)) || a.id-b.id);
  const last = relevant.at(-1);
  return last?.body.trim() === `/approve-agent-evolution ${headSha}`
    ? { approved: true, reason: "Owner/admin approval on this exact head", approvalCommentId: last.id }
    : { approved: false, reason: "Owner/admin must approve this exact head; absent or revoked approval" };
}

export async function runGate({ github, context, core }) {
  const number = context.payload.pull_request?.number ?? context.payload.issue?.number;
  if (!number) throw new Error("PR context required");
  const { data: pr } = await github.rest.pulls.get({ ...context.repo, pull_number: number });
  const files = await github.paginate(github.rest.pulls.listFiles, { ...context.repo, pull_number: number, per_page: 100 });
  if (files.length !== pr.changed_files) throw new Error("Incomplete changed-file list; manual review required");
  const comments = await github.paginate(github.rest.issues.listComments, { ...context.repo, issue_number: number, per_page: 100 });
  const admins = [];
  for (const login of new Set(comments.filter(c => c.user?.type === "User" && /^\/(approve|revoke)-agent-evolution /.test(c.body?.trim() || "")).map(c => c.user.login))) {
    const { data } = await github.rest.repos.getCollaboratorPermissionLevel({ ...context.repo, username: login });
    if (data.permission === "admin") admins.push(login);
  }
  const result = evaluateApproval({ files, headSha: pr.head.sha, comments, adminLogins: admins, title: pr.title, branch: pr.head.ref });
  core.info(JSON.stringify({ headSha: pr.head.sha, ...result }));
  return { ...result, headSha: pr.head.sha };
}
