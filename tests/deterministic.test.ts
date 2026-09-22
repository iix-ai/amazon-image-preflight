import assert from "node:assert/strict";
import {
  getOverallRisk,
  runDeterministicChecks,
} from "../src/analyzer/deterministic.ts";
import {
  hugeImageFile,
  portraitImage,
  tooSmallImage,
  transparentPng,
  validImage,
} from "./fixtures/fixture-metadata.ts";

const statusFor = (checks, id) => checks.find((check) => check.id === id)?.status;

export default [
  {
    name: "accepts a readable 2000x2000 white-background JPEG",
    run() {
      const checks = runDeterministicChecks(validImage);
      assert.equal(statusFor(checks, "readable"), "PASS");
      assert.equal(statusFor(checks, "dimensions"), "PASS");
      assert.equal(statusFor(checks, "file-type"), "PASS");
      assert.equal(statusFor(checks, "transparency"), "PASS");
      assert.equal(statusFor(checks, "dimensions") && checks.find((check) => check.id === "dimensions").measured, "2000 × 2000 px");
      assert.equal(getOverallRisk(checks), "LOW RISK");
    },
  },
  {
    name: "fails images below the minimum dimensions",
    run() {
      const checks = runDeterministicChecks(tooSmallImage);
      assert.equal(statusFor(checks, "dimensions"), "FAIL");
      assert.equal(getOverallRisk(checks), "HIGH RISK");
    },
  },
  {
    name: "fails transparent PNGs and preserves the measured file type",
    run() {
      const checks = runDeterministicChecks(transparentPng);
      assert.equal(statusFor(checks, "file-type"), "PASS");
      assert.equal(statusFor(checks, "transparency"), "FAIL");
      assert.match(checks.find((check) => check.id === "file-type").measured, /PNG/);
    },
  },
  {
    name: "warns when a file is above the local preflight size recommendation",
    run() {
      const checks = runDeterministicChecks(hugeImageFile);
      assert.equal(statusFor(checks, "file-size"), "WARNING");
      assert.match(checks.find((check) => check.id === "file-size").measured, /11\.0 MB/);
    },
  },
  {
    name: "warns for unusual aspect ratios while showing actual dimensions",
    run() {
      const checks = runDeterministicChecks(portraitImage);
      assert.equal(statusFor(checks, "aspect-ratio"), "WARNING");
      assert.equal(checks.find((check) => check.id === "longest-side").measured, "2000 px");
    },
  },
];
