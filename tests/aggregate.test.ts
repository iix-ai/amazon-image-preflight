import assert from "node:assert/strict";
import { createAnalysisResult, getOverallRisk } from "../src/analyzer/aggregate.ts";
import { manualReviewItems } from "../src/analyzer/manual-review.ts";

export default [
  {
    name: "maps a deterministic failure to high risk",
    run() {
      assert.equal(getOverallRisk([{ status: "FAIL" }]), "HIGH RISK");
    },
  },
  {
    name: "maps warnings to needs review and all passes to low risk",
    run() {
      assert.equal(getOverallRisk([{ status: "WARNING" }, { status: "PASS" }]), "NEEDS REVIEW");
      assert.equal(getOverallRisk([{ status: "PASS" }]), "LOW RISK");
    },
  },
  {
    name: "keeps manual review items separate from automated risk scoring",
    run() {
      const result = createAnalysisResult({ deterministic: [{ status: "PASS" }], visual: [{ status: "PASS" }], manual: manualReviewItems });
      assert.equal(result.overallRisk, "LOW RISK");
      assert.equal(result.manual.length, 8);
      assert.equal(result.manual[0].status, "Manual review required");
    },
  },
];
