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

export const createAnalyticsAdapter = ({ enabled = false, emit = (event, properties) => console.info("[analytics]", event, properties) } = {}) => ({
  track(event, properties = {}) {
    if (!enabled || !allowedEventSet.has(event)) return;
    emit(event, safeProperties(properties));
  },
});
