import assert from "node:assert/strict";
import { renderAnalysisResultMarkup } from "../src/ui/render-results.ts";

export default [
  {
    name: "renders measured technical checks, estimates, and manual review",
    run() {
      const markup = renderAnalysisResultMarkup({
        overallRisk: "NEEDS REVIEW",
        deterministic: [{ id: "dimensions", label: "dimensions", status: "PASS", measured: "2000 × 2000 px", detail: "Good." }],
        visual: [{ id: "white-background", label: "white-background", status: "WARNING", measured: "72%", detail: "Review.", confidenceLabel: "Estimated / Best effort" }],
        manual: [{ id: "trademark", label: "Trademark or brand-use conflicts", status: "Manual review required" }],
      });
      assert.match(markup, /NEEDS REVIEW/);
      assert.match(markup, /2000 × 2000 px/);
      assert.match(markup, /Estimated \/ Best effort/);
      assert.match(markup, /Manual review required/);
      assert.match(markup, /Technical checks/);
      assert.match(markup, /Visual estimates/);
      assert.match(markup, /Manual review/);
    },
  },
];
