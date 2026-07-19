import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { AI_DESIGN_SHOWCASES } from "../app/components/home/ai-design-showcases";

test("approved AI Design showcases have complete optimized asset sets", async () => {
  assert.deepEqual(
    AI_DESIGN_SHOWCASES.map((showcase) => showcase.id),
    ["kim-hieu-milk-tea", "mina-honey", "thy-kieu-body"],
  );

  assert.deepEqual(
    AI_DESIGN_SHOWCASES.map((showcase) => [
      showcase.id,
      showcase.final.src,
      showcase.final.width,
      showcase.final.height,
    ]),
    [
      ["kim-hieu-milk-tea", "/images/ai-design/milk-tea-final.webp", 715, 1481],
      ["mina-honey", "/images/ai-design/mina-honey-final.webp", 747, 1307],
      ["thy-kieu-body", "/images/ai-design/thy-kieu-body-final.webp", 835, 1095],
    ],
  );

  for (const showcase of AI_DESIGN_SHOWCASES) {
    for (const stage of [showcase.old, showcase.ai, showcase.final]) {
      assert.match(stage.src, /^\/images\/ai-design\/.+\.webp$/);
      assert.ok(stage.width > 0);
      assert.ok(stage.height > 0);
      assert.ok(stage.alt.length > 0);
      await access(path.join(process.cwd(), "public", stage.src.slice(1)));
    }
  }
});
