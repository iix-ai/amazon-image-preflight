export const getOverallRisk = (checks) => {
  if (checks.some((check) => check.status === "FAIL")) return "HIGH RISK";
  if (checks.some((check) => check.status === "WARNING")) return "NEEDS REVIEW";
  return "LOW RISK";
};

export const createAnalysisResult = ({ deterministic, visual, manual }) => ({
  deterministic,
  visual,
  manual,
  overallRisk: getOverallRisk([...deterministic, ...visual]),
});
