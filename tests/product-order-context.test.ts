import test from "node:test";
import assert from "node:assert/strict";
import { products, productBySlug } from "../app/lib/products";
import { productOrderContext } from "../app/lib/product-order-context";

test("every catalog product has a specific checklist and valid related choices", () => {
  assert.deepEqual(Object.keys(productOrderContext).sort(), products.map(p=>p.slug).sort());
  const checklists = new Set<string>();
  for (const product of products) {
    const context = productOrderContext[product.slug];
    assert.equal(context.checks.length, 3);
    assert.equal(context.related.length, 3);
    assert.equal(new Set(context.related).size, 3);
    for (const slug of context.related) {
      assert.ok(productBySlug[slug], `${product.slug} links to missing ${slug}`);
      assert.notEqual(slug, product.slug);
    }
    checklists.add(JSON.stringify(context.checks));
  }
  assert.equal(checklists.size, products.length);
  assert.ok(productOrderContext["tem-bac"].related.includes("tem-vang"));
  assert.ok(productOrderContext["tem-phu-san-pham"].related.includes("tem-giay"));
});
