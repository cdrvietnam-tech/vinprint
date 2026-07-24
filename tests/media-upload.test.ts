import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getCollectionImageProfile,
  isOptimizableStillImage,
  resolveOptimizedDimensions,
} from "../app/lib/media-upload";

test("managed image uploads use web-friendly collection profiles", () => {
  assert.deepEqual(getCollectionImageProfile("hero"), {
    maxWidth: 1600,
    maxHeight: 1200,
    quality: 0.82,
  });
  assert.deepEqual(getCollectionImageProfile("hot-products"), {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.82,
  });
});

test("still images are optimized while animated and video formats stay intact", () => {
  for (const type of ["image/png", "image/jpeg", "image/webp", "image/avif"]) {
    assert.equal(isOptimizableStillImage(type), true);
  }
  for (const type of ["image/gif", "video/mp4", "video/webm"]) {
    assert.equal(isOptimizableStillImage(type), false);
  }
});

test("optimization preserves the full aspect ratio without upscaling", () => {
  assert.deepEqual(resolveOptimizedDimensions(4000, 2000, 1200, 1200), { width: 1200, height: 600 });
  assert.deepEqual(resolveOptimizedDimensions(800, 1200, 1200, 1200), { width: 800, height: 1200 });
  assert.deepEqual(resolveOptimizedDimensions(640, 480, 1200, 1200), { width: 640, height: 480 });
});
