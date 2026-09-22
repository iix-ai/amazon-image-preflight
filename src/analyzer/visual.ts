import { ruleById } from "../rules/amazon-main-image.ts";

const sampleStep = (width, height) => Math.max(1, Math.ceil(Math.sqrt((width * height) / 40_000)));

const pixelAt = (pixels, width, x, y) => {
  const index = (y * width + x) * 4;
  return [pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]];
};

const colorDistance = (a, b) => Math.sqrt(
  ((a[0] - b[0]) ** 2) + ((a[1] - b[1]) ** 2) + ((a[2] - b[2]) ** 2),
);

const isWhiteish = (pixel) => pixel[0] >= 245 && pixel[1] >= 245 && pixel[2] >= 245 && pixel[3] >= 250;

const estimateBackgroundColor = (input) => {
  const edge = Math.max(1, Math.floor(Math.min(input.width, input.height) * 0.04));
  const pixels = [];
  const step = sampleStep(input.width, input.height);
  for (let y = 0; y < input.height; y += step) {
    for (let x = 0; x < input.width; x += step) {
      if (x < edge || y < edge || x >= input.width - edge || y >= input.height - edge) {
        pixels.push(pixelAt(input.pixels, input.width, x, y));
      }
    }
  }
  if (pixels.length === 0) return [255, 255, 255, 255];
  const totals = pixels.reduce((sum, pixel) => [sum[0] + pixel[0], sum[1] + pixel[1], sum[2] + pixel[2], sum[3] + pixel[3]], [0, 0, 0, 0]);
  return totals.map((value) => value / pixels.length);
};

const findSubjectBounds = (input, background) => {
  const step = sampleStep(input.width, input.height);
  const threshold = Math.max(35, colorDistance(background, [255, 255, 255, 255]) * 0.45);
  let left = input.width;
  let top = input.height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < input.height; y += step) {
    for (let x = 0; x < input.width; x += step) {
      const pixel = pixelAt(input.pixels, input.width, x, y);
      if (pixel[3] < 245 || colorDistance(pixel, background) > threshold) {
        left = Math.min(left, x);
        top = Math.min(top, y);
        right = Math.max(right, x);
        bottom = Math.max(bottom, y);
      }
    }
  }
  return right < left ? null : { left, top, right, bottom };
};

const result = (ruleId, status, measured, detail) => {
  const rule = ruleById(ruleId);
  return {
    id: ruleId,
    label: ruleId,
    group: "visual",
    status,
    measured,
    detail,
    kind: "estimate",
    confidenceLabel: "Estimated / Best effort",
    sourceUrl: rule?.sourceUrl ?? "",
    sourceCheckedDate: rule?.sourceCheckedDate ?? "",
  };
};

const borderDarkRatio = (input) => {
  const edgePixels = [];
  for (let position = 0; position < Math.max(input.width, input.height); position += 1) {
    if (position < input.width) {
      edgePixels.push(pixelAt(input.pixels, input.width, position, 0));
      edgePixels.push(pixelAt(input.pixels, input.width, position, input.height - 1));
    }
    if (position < input.height) {
      edgePixels.push(pixelAt(input.pixels, input.width, 0, position));
      edgePixels.push(pixelAt(input.pixels, input.width, input.width - 1, position));
    }
  }
  if (edgePixels.length === 0) return 0;
  return edgePixels.filter((pixel) => pixel[0] < 70 && pixel[1] < 70 && pixel[2] < 70).length / edgePixels.length;
};

export const estimateVisualChecks = (input) => {
  const source = input.metadata ? { ...input.metadata, pixels: input.pixels } : input;
  const background = estimateBackgroundColor(source);
  const step = sampleStep(source.width, source.height);
  const edge = Math.max(1, Math.floor(Math.min(source.width, source.height) * 0.04));
  let sampled = 0;
  let whiteish = 0;
  for (let y = 0; y < source.height; y += step) {
    for (let x = 0; x < source.width; x += step) {
      if (!(x < edge || y < edge || x >= source.width - edge || y >= source.height - edge)) continue;
      sampled += 1;
      if (isWhiteish(pixelAt(source.pixels, source.width, x, y))) whiteish += 1;
    }
  }
  const whiteRatio = sampled ? whiteish / sampled : 0;
  const bounds = findSubjectBounds(source, background);
  const fillRatio = bounds ? Math.max((bounds.right - bounds.left + 1) / source.width, (bounds.bottom - bounds.top + 1) / source.height) : 0;
  const borderRatio = borderDarkRatio(source);

  return [
    result(
      "white-background",
      whiteRatio >= 0.95 ? "PASS" : "WARNING",
      `${Math.round(whiteRatio * 100)}% white-ish sampled pixels`,
      whiteRatio >= 0.95 ? "The sampled image appears close to white around the frame." : "The sampled background is not consistently white; confirm the main-image background manually.",
    ),
    result(
      "subject-framing",
      fillRatio >= 0.55 ? "PASS" : "WARNING",
      bounds ? `${Math.round(fillRatio * 100)}% maximum frame span` : "No subject boundary estimated",
      fillRatio >= 0.55 ? "The estimated subject span is large enough for a useful frame." : "The estimated subject may be too small in the frame; review crop and product visibility manually.",
    ),
    result(
      "edge-contamination",
      whiteRatio >= 0.9 ? "PASS" : "WARNING",
      `${Math.round(whiteRatio * 100)}% sampled pixels near the estimated background`,
      whiteRatio >= 0.9 ? "No strong background contamination signal was found." : "The edge/background sample contains non-white pixels; review shadows, props, and edge spill.",
    ),
    result(
      "possible-border",
      borderRatio >= 0.6 ? "WARNING" : "PASS",
      `${Math.round(borderRatio * 100)}% dark edge samples`,
      borderRatio >= 0.6 ? "A dark line appears consistently around the outer edge; confirm that it is not a border." : "No strong continuous border signal was detected.",
    ),
  ];
};
