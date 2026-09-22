import { amazonMainImageRules, ruleById } from "../rules/amazon-main-image.ts";
import { getOverallRisk } from "./aggregate.ts";

const ALLOWED_LABELS = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/tiff": "TIFF",
  "image/gif": "GIF",
};

const result = (ruleId, status, measured, detail, extra = {}) => {
  const rule = ruleById(ruleId);
  return {
    id: ruleId,
    label: ruleId,
    group: "deterministic",
    status,
    measured,
    detail,
    kind: rule?.kind ?? "hard",
    sourceUrl: rule?.sourceUrl ?? "",
    sourceCheckedDate: rule?.sourceCheckedDate ?? "",
    ...extra,
  };
};

const formatBytes = (bytes) => `${(bytes / 1_000_000).toFixed(1)} MB`;

export const runDeterministicChecks = (input) => {
  const checks = [];
  const dimensionsRule = ruleById("dimensions");
  const longestSideRule = ruleById("longest-side");
  const fileTypeRule = ruleById("file-type");
  const fileSizeRule = ruleById("file-size");
  const aspectRule = ruleById("aspect-ratio");

  checks.push(
    result(
      "readable",
      input.readable ? "PASS" : "FAIL",
      input.readable ? "Readable" : "Unreadable",
      input.readable ? "The browser decoded this file." : "The browser could not decode this file.",
    ),
  );

  const dimensionStatus = !input.readable || input.width < dimensionsRule.minimumPixels || input.height < dimensionsRule.minimumPixels
    ? "FAIL"
    : input.width < dimensionsRule.recommendedPixels || input.height < dimensionsRule.recommendedPixels
      ? "WARNING"
      : "PASS";
  checks.push(
    result(
      "dimensions",
      dimensionStatus,
      `${input.width} × ${input.height} px`,
      dimensionStatus === "FAIL"
        ? `At least ${dimensionsRule.minimumPixels} px on both dimensions is recommended for this preflight.`
        : dimensionStatus === "WARNING"
          ? `The image is usable, but ${dimensionsRule.recommendedPixels} px or more gives more room for zoom and inspection.`
          : "Both dimensions meet the preflight recommendation.",
    ),
  );

  const longestSideStatus = input.longestSide < longestSideRule.minimumPixels
    ? "FAIL"
    : input.longestSide < longestSideRule.recommendedPixels
      ? "WARNING"
      : "PASS";
  checks.push(
    result(
      "longest-side",
      longestSideStatus,
      `${input.longestSide} px`,
      longestSideStatus === "PASS" ? "The longest side is large enough for the preflight recommendation." : "Review resolution before uploading.",
    ),
  );

  const fileTypeStatus = fileTypeRule.allowedMimeTypes.includes(input.mimeType) ? "PASS" : "FAIL";
  checks.push(
    result(
      "file-type",
      fileTypeStatus,
      ALLOWED_LABELS[input.mimeType] ?? (input.mimeType || "Unknown"),
      fileTypeStatus === "PASS" ? "The file type is recognized." : "Use JPEG, PNG, TIFF, or GIF and check the current Seller Central guidance.",
    ),
  );

  const fileSizeStatus = input.byteSize > fileSizeRule.recommendedBytes ? "WARNING" : "PASS";
  checks.push(
    result(
      "file-size",
      fileSizeStatus,
      formatBytes(input.byteSize),
      fileSizeStatus === "PASS" ? "The file is below the 10 MB preflight recommendation." : "The file is larger than the 10 MB preflight recommendation; confirm the current upload limit.",
    ),
  );

  checks.push(
    result(
      "transparency",
      input.hasTransparency ? "FAIL" : "PASS",
      input.hasTransparency ? "Alpha pixels detected" : "No alpha pixels detected",
      input.hasTransparency ? "Transparent pixels can conflict with a white-background main-image expectation." : "No transparency was detected.",
    ),
  );

  const aspectRatio = input.height ? input.width / input.height : 0;
  const aspectStatus = aspectRatio < aspectRule.minimumRatio || aspectRatio > aspectRule.maximumRatio ? "WARNING" : "PASS";
  checks.push(
    result(
      "aspect-ratio",
      aspectStatus,
      aspectRatio ? `${aspectRatio.toFixed(2)}:1` : "Unknown",
      aspectStatus === "PASS" ? "The aspect ratio is within the broad preflight range." : "The file is unusually wide or tall; review crop and framing manually.",
    ),
  );

  return checks;
};

export { amazonMainImageRules, getOverallRisk };
