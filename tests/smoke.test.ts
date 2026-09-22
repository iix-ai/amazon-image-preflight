import assert from "node:assert/strict";
import { PRODUCT_NAME } from "../src/config.ts";

export default {
  name: "project configuration identifies the product",
  run() {
    assert.equal(PRODUCT_NAME, "Amazon Main Image Preflight");
  },
};
