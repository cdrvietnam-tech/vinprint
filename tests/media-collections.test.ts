import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_MEDIA_COLLECTIONS,
  isValidManagedMediaItemId,
} from "../app/lib/media-collections";

test("every bundled media item id is accepted by collection mutation endpoints", () => {
  for (const [collection, items] of Object.entries(DEFAULT_MEDIA_COLLECTIONS)) {
    for (const item of items) {
      assert.equal(
        isValidManagedMediaItemId(item.id),
        true,
        `${collection}/${item.id} must be deletable and restorable`,
      );
    }
  }
});

test("managed media ids reject unsafe path characters", () => {
  for (const id of ["../hot-1", "hot/1", "hot 1", "", "-hot-1"]) {
    assert.equal(isValidManagedMediaItemId(id), false);
  }
});
