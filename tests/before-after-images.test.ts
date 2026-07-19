import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import path from "node:path";

const projectRoot = process.cwd();
const componentPath = path.join(projectRoot, "app/components/home/BeforeAfter.tsx");

test("before/after showcase uses six distinct image pairs", () => {
  const source = readFileSync(componentPath, "utf8");
  const pairs = [...source.matchAll(/before:\s*"([^"]+)",\s*after:\s*"([^"]+)"/g)];

  assert.equal(pairs.length, 6);

  for (const [, before, after] of pairs) {
    assert.notEqual(before, after, `${before} must not be reused for both states`);
    assert.ok(existsSync(path.join(projectRoot, "public", before)), `Missing ${before}`);
    assert.ok(existsSync(path.join(projectRoot, "public", after)), `Missing ${after}`);
  }
});
