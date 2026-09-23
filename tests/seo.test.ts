import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const canonicalUrl = "https://iix-ai.github.io/amazon-image-preflight/";
const googleVerificationContent = "nPNz9a1I1R472bInoIXao9xMFYCZg04_dLBXrRK0gLo";

const readProjectFile = (relativePath) => readFile(join(root, relativePath), "utf8");

export default [
  {
    name: "declares crawlable canonical social and application metadata",
    async run() {
      const index = await readProjectFile("index.html");
      assert.match(index, /<html lang="en">/);
      assert.match(index, /<title>Amazon Main Image Checker – Preflight Product Photos Before Upload<\/title>/);
      assert.match(index, /<meta name="description" content="Check Amazon product image requirements/);
      assert.match(index, new RegExp(`<link rel="canonical" href="${canonicalUrl.replaceAll(".", "\\.")}" \/>`));
      assert.match(index, /<meta name="robots" content="index, follow" \/>/);
      const verificationTags = index.match(/<meta name="google-site-verification"[^>]*>/g) || [];
      assert.equal(verificationTags.length, 1);
      assert.match(index, new RegExp(`<meta name="google-site-verification" content="${googleVerificationContent}" \/>`));
      assert.match(index, /<meta property="og:type" content="website" \/>/);
      assert.match(index, new RegExp(`<meta property="og:url" content="${canonicalUrl.replaceAll(".", "\\.")}" \/>`));
      assert.match(index, /<meta name="twitter:card" content="summary" \/>/);
      assert.match(index, /<link rel="icon" href="\.\/favicon\.svg" type="image\/svg\+xml" \/>/);
      assert.equal((index.match(/<h1\b/g) || []).length, 1);
      assert.doesNotMatch(index, /noindex|nofollow|localhost|src="\/assets\//i);
      assert.doesNotMatch(index, /Amazon Official|Amazon Approved|Guaranteed (Acceptance|Compliance)/i);

      const jsonLdMatch = index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      assert.ok(jsonLdMatch, "expected one JSON-LD script");
      const jsonLd = JSON.parse(jsonLdMatch[1]);
      assert.equal(jsonLd["@type"], "WebApplication");
      assert.equal(jsonLd.url, canonicalUrl);
      assert.equal(jsonLd.isAccessibleForFree, true);
      assert.equal(jsonLd.aggregateRating, undefined);
      assert.equal(jsonLd.review, undefined);
      assert.equal(jsonLd.offers, undefined);
      assert.equal(jsonLd.price, undefined);
    },
  },
  {
    name: "keeps search-intent copy grounded in the existing tool",
    async run() {
      const index = await readProjectFile("index.html");
      for (const phrase of ["Amazon product image requirements", "white", "framing", "image size", "Seller Central"]) {
        assert.match(index, new RegExp(phrase, "i"));
      }
    },
  },
  {
    name: "publishes a crawlable homepage sitemap",
    async run() {
      const robots = await readProjectFile("public/robots.txt");
      const sitemap = await readProjectFile("public/sitemap.xml");
      assert.match(robots, /User-agent:\s*\*/);
      assert.match(robots, /Allow:\s*\//);
      assert.match(robots, new RegExp(String.raw`Sitemap:\s*${canonicalUrl.replaceAll(".", "\\.")}sitemap\.xml`));
      assert.match(sitemap, /<urlset[^>]+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
      assert.equal((sitemap.match(/<loc>/g) || []).length, 1);
      assert.match(sitemap, new RegExp(`<loc>${canonicalUrl.replaceAll(".", "\\.")}<\/loc>`));
    },
  },
];
