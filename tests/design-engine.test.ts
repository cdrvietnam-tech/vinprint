import assert from "node:assert/strict";
import test from "node:test";
import {
  buildOrderBrief,
  createDesignVariants,
  defaultStudioForm,
  escapeXml,
  interpretBrief,
  projectCodeFrom,
} from "../app/lib/design-engine.ts";

const scenarios = [
  {
    ...defaultStudioForm,
    prompt: "Tem oval cho serum vitamin C, màu cam kem, tối giản cao cấp",
    productType: "my-pham",
    brand: "Lumière",
    productName: "Vitamin C Serum",
  },
  {
    ...defaultStudioForm,
    prompt: "Tem tròn dễ thương màu hồng cho nến thơm",
    productType: "nen-thom",
    brand: "Mây",
    productName: "Nến Hoa Hồng",
  },
  {
    ...defaultStudioForm,
    prompt: "Nhãn chai nước màu xanh dương hiện đại",
    productType: "do-uong",
    brand: "Aqua+",
    productName: "Nước Khoáng",
    shape: "rounded",
    style: "minimal",
    palette: "blue",
  },
];

test("interprets Vietnamese prompts and creates three complete concepts", () => {
  for (const form of scenarios) {
    const brief = interpretBrief(form);
    const variants = createDesignVariants(brief);

    assert.equal(variants.length, 3);
    assert.ok(
      variants.every((variant) =>
        variant.labelSvg.includes(escapeXml(form.brand.toUpperCase())),
      ),
    );
    assert.ok(variants.every((variant) => variant.mockupSvg.includes("MOCKUP")));
    assert.ok(variants.every((variant) => variant.labelSvg.startsWith("<?xml")));
  }
});

test("builds a stable order code and a Zalo-ready brief", () => {
  const brief = interpretBrief(scenarios[0]);
  const firstCode = projectCodeFrom(brief);
  const secondCode = projectCodeFrom(brief);
  const content = buildOrderBrief(brief, firstCode);

  assert.equal(firstCode, secondCode);
  assert.match(firstCode, /^VP-[A-Z0-9]{6}$/);
  assert.match(content, /HỒ SƠ ĐẶT IN VINPRINT/);
  assert.match(content, /Zalo VinPrint: 0844998499/);
  assert.match(content, /Gửi file \+ số lượng \+ chất liệu/);
});
