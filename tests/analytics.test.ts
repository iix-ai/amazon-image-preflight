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
      const customEvents = ANALYTICS_EVENTS.filter((event) => event !== "page_view");
      assert.equal(emitted.length, customEvents.length);
      assert.deepEqual(emitted.map((entry) => entry.event), customEvents);
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
    name: "sends safe custom events to Umami without duplicating automatic pageviews",
    run() {
      const emitted = [];
      const tracked = [];
      const analytics = createAnalyticsAdapter({
        enabled: true,
        tracker: { track: (event, properties) => tracked.push({ event, properties }) },
        emit: (event, properties) => emitted.push({ event, properties }),
      });
      analytics.track("page_view");
      analytics.track("image_selected", { filename: "private.jpg", pixels: "secret", width: 2000 });
      analytics.track("fix_cta_clicked", { affiliate: true, productName: "private product" });
      assert.deepEqual(tracked, [
        { event: "image_selected", properties: undefined },
        { event: "fix_cta_clicked", properties: { affiliate: true } },
      ]);
      assert.deepEqual(emitted, []);
    },
  },
  {
    name: "falls back to the safe local emitter when Umami is unavailable",
    run() {
      const emitted = [];
      const analytics = createAnalyticsAdapter({ enabled: true, emit: (event, properties) => emitted.push({ event, properties }) });
      analytics.track("analysis_completed", { filename: "private.jpg", exif: "secret" });
      assert.deepEqual(emitted, [{ event: "analysis_completed", properties: {} }]);
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
