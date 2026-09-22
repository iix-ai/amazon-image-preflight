import assert from "node:assert/strict";
import { estimateVisualChecks } from "../src/analyzer/visual.ts";

const makePixels = (width, height, background, subject) => {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < width * height; index += 1) {
    pixels[index * 4] = background[0];
    pixels[index * 4 + 1] = background[1];
    pixels[index * 4 + 2] = background[2];
    pixels[index * 4 + 3] = background[3] ?? 255;
  }
  for (let y = subject.top; y < subject.bottom; y += 1) {
    for (let x = subject.left; x < subject.right; x += 1) {
      const index = (y * width + x) * 4;
      pixels[index] = subject.color[0];
      pixels[index + 1] = subject.color[1];
      pixels[index + 2] = subject.color[2];
      pixels[index + 3] = subject.color[3] ?? 255;
    }
  }
  return { width, height, pixels };
};

const statusFor = (checks, id) => checks.find((check) => check.id === id)?.status;
const hasEstimateLabel = (checks) => checks.every((check) => check.confidenceLabel === "Estimated / Best effort");

const centeredSubject = (size) => ({
  left: size * 0.2,
  top: size * 0.2,
  right: size * 0.8,
  bottom: size * 0.8,
  color: [80, 80, 80],
});

export default [
  {
    name: "passes a centered product on a white background",
    run() {
      const checks = estimateVisualChecks(makePixels(100, 100, [255, 255, 255, 255], centeredSubject(100)));
      assert.equal(statusFor(checks, "white-background"), "PASS");
      assert.equal(statusFor(checks, "subject-framing"), "PASS");
      assert.equal(hasEstimateLabel(checks), true);
    },
  },
  {
    name: "warns when the background is not white",
    run() {
      const checks = estimateVisualChecks(makePixels(100, 100, [220, 220, 220, 255], centeredSubject(100)));
      assert.equal(statusFor(checks, "white-background"), "WARNING");
    },
  },
  {
    name: "warns when the product occupies too little of the frame",
    run() {
      const checks = estimateVisualChecks(makePixels(100, 100, [255, 255, 255, 255], {
        left: 45,
        top: 45,
        right: 55,
        bottom: 55,
        color: [40, 40, 40],
      }));
      assert.equal(statusFor(checks, "subject-framing"), "WARNING");
    },
  },
  {
    name: "warns when the outer frame resembles a border",
    run() {
      const image = makePixels(100, 100, [255, 255, 255, 255], centeredSubject(100));
      for (let position = 0; position < 100; position += 1) {
        for (const edge of [position * 4, (99 * 100 + position) * 4, (position * 100) * 4, (position * 100 + 99) * 4]) {
          image.pixels[edge] = 20;
          image.pixels[edge + 1] = 20;
          image.pixels[edge + 2] = 20;
        }
      }
      const checks = estimateVisualChecks(image);
      assert.equal(statusFor(checks, "possible-border"), "WARNING");
    },
  },
  {
    name: "keeps a borderline frame estimate labelled and bounded",
    run() {
      const checks = estimateVisualChecks(makePixels(100, 100, [250, 250, 250, 255], {
        left: 25,
        top: 25,
        right: 75,
        bottom: 75,
        color: [160, 160, 160],
      }));
      assert.equal(hasEstimateLabel(checks), true);
      assert.equal(["PASS", "WARNING"].includes(statusFor(checks, "subject-framing")), true);
    },
  },
  {
    name: "accepts the browser loader payload shape",
    run() {
      const image = makePixels(100, 100, [255, 255, 255, 255], centeredSubject(100));
      const checks = estimateVisualChecks({ metadata: { width: image.width, height: image.height }, pixels: image.pixels });
      assert.equal(statusFor(checks, "white-background"), "PASS");
      assert.equal(statusFor(checks, "subject-framing"), "PASS");
    },
  },
];
