import { AFFILIATE_PHOTOROOM_URL, DEFAULT_ANALYTICS_ENABLED, PHOTOROOM_FALLBACK_URL } from "./config.ts";
import { createAnalysisResult } from "./analyzer/aggregate.ts";
import { runDeterministicChecks } from "./analyzer/deterministic.ts";
import { manualReviewItems } from "./analyzer/manual-review.ts";
import { estimateVisualChecks } from "./analyzer/visual.ts";
import { loadImageForAnalysis } from "./browser/image-loader.ts";
import { createAnalyticsAdapter } from "./analytics/adapter.ts";
import { renderAnalysisResult } from "./ui/render-results.ts";

const dropzone = document.querySelector("#dropzone");
const input = document.querySelector("#image-input");
const status = document.querySelector("#analysis-status");
const results = document.querySelector("#results");
const resultsContent = document.querySelector("#results-content");
const fixCta = document.querySelector("#fix-cta");
const checkAnother = document.querySelector("#check-another");
const analytics = createAnalyticsAdapter({
  enabled: DEFAULT_ANALYTICS_ENABLED,
});
const editorUrl = AFFILIATE_PHOTOROOM_URL || PHOTOROOM_FALLBACK_URL;

const unavailableVisualChecks = () => ["white-background", "subject-framing", "edge-contamination", "possible-border"].map((id) => ({
  id,
  label: id,
  group: "visual",
  status: "WARNING",
  measured: "Not available",
  detail: "Visual estimate unavailable because the image could not be decoded.",
  confidenceLabel: "Estimated / Best effort",
}));

const setStatus = (message, state = "") => {
  status.textContent = message;
  status.dataset.state = state;
};

const resetTool = () => {
  results.hidden = true;
  resultsContent.innerHTML = "";
  input.value = "";
  setStatus("");
  dropzone.classList.remove("dropzone--active");
};

const analyzeFile = async (file) => {
  analytics.track("image_selected");
  results.hidden = true;
  setStatus("Analyzing locally…", "loading");
  try {
    const loaded = await loadImageForAnalysis(file);
    const deterministic = runDeterministicChecks(loaded.metadata);
    const visual = loaded.metadata.readable ? estimateVisualChecks(loaded) : unavailableVisualChecks();
    const analysis = createAnalysisResult({ deterministic, visual, manual: manualReviewItems });
    renderAnalysisResult(resultsContent, analysis);
    fixCta.href = editorUrl;
    fixCta.dataset.affiliate = String(Boolean(AFFILIATE_PHOTOROOM_URL));
    analytics.track("analysis_completed");
    analytics.track(analysis.overallRisk === "LOW RISK" ? "result_low_risk" : analysis.overallRisk === "NEEDS REVIEW" ? "result_needs_review" : "result_high_risk");
    results.hidden = false;
    setStatus("Analysis complete. Review the result before uploading.", "complete");
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch {
    setStatus("We could not analyze that file. Try a JPEG, PNG, TIFF, or GIF.", "error");
  }
};

input.addEventListener("change", () => {
  const file = input.files?.[0];
  if (file) void analyzeFile(file);
});

dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("dropzone--active");
});

dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dropzone--active"));

dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.classList.remove("dropzone--active");
  const file = event.dataTransfer?.files?.[0];
  if (file) void analyzeFile(file);
});

dropzone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    input.click();
  }
});

fixCta.addEventListener("click", () => {
  analytics.track("fix_cta_clicked", { affiliate: Boolean(AFFILIATE_PHOTOROOM_URL) });
});

checkAnother.addEventListener("click", () => {
  analytics.track("check_another_clicked");
  resetTool();
  input.focus();
});
