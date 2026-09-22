import assert from "node:assert/strict";
import { createAnalyticsAdapter, ANALYTICS_EVENTS } from "../src/analytics/adapter.ts";

export default [
  {
    name: "accepts only the anonymous experiment events",
    run() {
      const emitted = [];
      const analytics = createAnalyticsAdapter({ enabled: true, emit: (event, properties) => emitted.push({ event, properties }) });
      for (const event of ANALYTICS_EVENTS) analytics.track(event);
      analytics.track("not-an-event", { filename: "private.jpg" });
      assert.equal(emitted.length, ANALYTICS_EVENTS.length);
      assert.deepEqual(emitted.map((entry) => entry.event), [...ANALYTICS_EVENTS]);
    },
  },
  {
    name: "keeps the CTA affiliate boolean and drops image-derived properties",
    run() {
      const emitted = [];
      const analytics = createAnalyticsAdapter({ enabled: true, emit: (event, properties) => emitted.push({ event, properties }) });
      analytics.track("fix_cta_clicked", { affiliate: false, filename: "private.jpg", pixels: "secret" });
      assert.deepEqual(emitted[0], { event: "fix_cta_clicked", properties: { affiliate: false } });
    },
  },
  {
    name: "can be fully disabled",
    run() {
      const emitted = [];
      const analytics = createAnalyticsAdapter({ enabled: false, emit: (event) => emitted.push(event) });
      analytics.track("page_view");
      assert.deepEqual(emitted, []);
    },
  },
];
