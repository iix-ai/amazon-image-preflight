import assert from "node:assert/strict";
import { AFFILIATE_PHOTOROOM_URL, PRODUCT_NAME } from "../src/config.ts";

export default {
  name: "project configuration identifies the product",
  run() {
    assert.equal(PRODUCT_NAME, "Amazon Main Image Preflight");
    assert.equal(AFFILIATE_PHOTOROOM_URL, "https://refer.photoroom.com/lanlulu");
  },
};
