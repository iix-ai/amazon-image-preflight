export const ANALYTICS_EVENTS = [
  "page_view",
  "image_selected",
  "analysis_completed",
  "result_low_risk",
  "result_needs_review",
  "result_high_risk",
  "fix_cta_clicked",
  "check_another_clicked",
];

const allowedEventSet = new Set(ANALYTICS_EVENTS);

const safeProperties = (properties = {}) => {
  if (typeof properties.affiliate !== "boolean") return {};
  return { affiliate: properties.affiliate };
};

export type UmamiTracker = {
  track: (event: string, properties?: Record<string, boolean>) => void;
};

const getGlobalTracker = () => (globalThis as typeof globalThis & { umami?: UmamiTracker }).umami;

export const createAnalyticsAdapter = ({
  enabled = false,
  emit = (event, properties) => console.info("[analytics]", event, properties),
  tracker,
} = {}) => ({
  track(event, properties = {}) {
    if (!enabled || !allowedEventSet.has(event) || event === "page_view") return;

    const safe = safeProperties(properties);
    const activeTracker = tracker || getGlobalTracker();
    if (activeTracker?.track) {
      if (Object.keys(safe).length === 0) {
        activeTracker.track(event);
      } else {
        activeTracker.track(event, safe);
      }
      return;
    }

    emit(event, safe);
  },
});
