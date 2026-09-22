import assert from "node:assert/strict";
import { loadImageForAnalysis } from "../src/browser/image-loader.ts";

export default [
  {
    name: "loads only pixel data and measurable metadata from a browser image",
    async run() {
      const file = new File([new Uint8Array([1, 2, 3])], "private-product.jpg", { type: "image/jpeg" });
      let revoked = false;
      const pixels = new Uint8ClampedArray([
        255, 255, 255, 255,
        255, 255, 255, 128,
        255, 255, 255, 255,
        255, 255, 255, 255,
      ]);
      const result = await loadImageForAnalysis(file, {
        createObjectUrl: () => "blob:local-only",
        revokeObjectUrl: () => { revoked = true; },
        createImage: () => ({ width: 2, height: 2, set src(value) { this._src = value; queueMicrotask(() => this.onload()); } }),
        createCanvas: () => ({
          width: 2,
          height: 2,
          getContext: () => ({ drawImage() {}, getImageData: () => ({ data: pixels }) }),
        }),
      });
      assert.deepEqual(result.metadata, {
        readable: true,
        width: 2,
        height: 2,
        longestSide: 2,
        mimeType: "image/jpeg",
        byteSize: 3,
        hasTransparency: true,
      });
      assert.equal(result.pixels, pixels);
      assert.equal(revoked, true);
    },
  },
  {
    name: "returns an unreadable result when image decoding fails",
    async run() {
      const file = new File([new Uint8Array([1])], "bad.jpg", { type: "image/jpeg" });
      const result = await loadImageForAnalysis(file, {
        createObjectUrl: () => "blob:local-only",
        revokeObjectUrl: () => {},
        createImage: () => ({ set src(value) { this._src = value; queueMicrotask(() => this.onerror(new Error("bad image"))); } }),
      });
      assert.equal(result.metadata.readable, false);
    },
  },
];
