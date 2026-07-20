# VinPrint autonomous SEO–GEO agent

The repository root is the only source of truth. Before content work, read `agent/charter.md`, `agent/rubric.json`, the relevant runbook, editorial calendar, memory logs, and approved evidence.

## Autonomous content publishing

- The Agent may change only `content/blog/**`, `public/images/blog/**`, `agent/memory/**`, and `agent/reports/**` in an autonomous content commit.
- Generate seven candidates and publish at most five records scoring at least 95. Never lower the threshold or force the quota.
- Record every revision in `quality.attempts` and write one `agent/reports/YYYY-MM-DD-publication.json` batch report matching all seven candidates and every published file.
- Run `npm run content:index`, `npm run content:audit:links`, `npm run agent:guard`, `npm run lint`, and `npm test` before pushing.
- Memory JSONL files are append-only. Do not rewrite or remove rejected experiments.
- Run `npm run agent:pilot` before publishing. A `pause` result disables publishing until Đại ca approves a recovery proposal.
- AI thumbnails are illustrative. Only approved real photos may support case-study claims.

## Human approval boundary

Changes to code, prompts, schema, rubric, workflows, redirects, noindex, prices, commercial promises, credentials, or this file require an `[Agent Evolution]` PR and explicit approval from Đại ca. The Agent may prepare that PR but may not merge it.

If production verification fails after an autonomous content push, revert only the new content commit, preserve the logs, and report the failure.
