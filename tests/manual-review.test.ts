import assert from "node:assert/strict";
import { manualReviewItems } from "../src/analyzer/manual-review.ts";

export default [
  {
    name: "lists semantic and category-sensitive checks as manual review",
    run() {
      assert.equal(manualReviewItems.length, 8);
      assert.equal(manualReviewItems.every((item) => item.status === "Manual review required"), true);
      assert.equal(manualReviewItems.some((item) => /trademark/i.test(item.label)), true);
      assert.equal(manualReviewItems.some((item) => /accessor/i.test(item.label)), true);
    },
  },
];
