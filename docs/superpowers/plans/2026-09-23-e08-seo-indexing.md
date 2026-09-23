# E08 SEO and Indexing Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing Amazon Main Image Preflight homepage discoverable and understandable to search engines without adding product functionality.

**Architecture:** Keep the single-page static tool and add metadata directly to `index.html`. Add one factual `WebApplication` JSON-LD block, a valid SVG favicon, and root-level `robots.txt`/`sitemap.xml` copied by both the Vite and dependency-light builds. Test the source and generated static artifacts with the existing Node test runner.

**Tech Stack:** Vanilla HTML, SVG, Vite/static fallback build, Node test runner, GitHub Pages.

**Spec:** User request for E08 SEO/indexing launch, 2026-09-23.

## Global Constraints

- Do not add product functionality or alter Umami, Photoroom referral behavior, privacy, or browser-local image processing.
- Canonical must be `https://iix-ai.github.io/amazon-image-preflight/`.
- `robots.txt` must allow normal crawling and point to the canonical sitemap.
- `sitemap.xml` must contain only the real homepage canonical URL.
- Do not add `noindex`, `nofollow`, localhost URLs, fake search volume, Amazon endorsement, approval guarantees, ratings, reviews, or prices.
- Keep asset paths compatible with the existing GitHub Pages project path and both build modes.

---

### Task 1: Lock SEO artifact requirements with failing tests

**Files:**
- Create: `tests/seo.test.ts`

**Interfaces:**
- Consumes: `index.html`, `public/robots.txt`, `public/sitemap.xml`, and the canonical URL.
- Produces: executable assertions for metadata, heading/locale basics, JSON-LD safety, crawler files, and prohibited URL/indexing markers.

- [ ] **Step 1: Write failing source and artifact tests**

Read the files with `node:fs/promises` and assert the exact canonical URL, `index, follow`, title/description presence, Open Graph/Twitter tags, SVG favicon, `lang="en"`, one H1, `WebApplication` JSON-LD without rating/review/price fields, crawlable robots directives, and a one-URL sitemap.

- [ ] **Step 2: Run the test suite and confirm RED**

Run:

```powershell
npm test
```

Expected: the new SEO test fails because the canonical, social metadata, favicon, crawler files, JSON-LD, and artifact paths do not yet exist.

---

### Task 2: Add minimal SEO metadata and crawl artifacts

**Files:**
- Modify: `index.html`
- Create: `public/favicon.svg`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`

**Interfaces:**
- Consumes: Task 1 assertions and the existing homepage copy.
- Produces: canonical HTML metadata, one factual WebApplication schema object, a favicon, crawlable robots policy, and a single canonical sitemap URL.

- [ ] **Step 1: Add head metadata**

Add canonical, explicit `index, follow` robots, Open Graph website metadata, Twitter summary card metadata, and an SVG favicon. Keep the existing Umami script untouched.

- [ ] **Step 2: Add minimal WebApplication JSON-LD**

Use only factual fields: context, type, name, URL, description, application category, browser requirement, and `isAccessibleForFree: true`. Do not add `aggregateRating`, `review`, `offers`, `price`, or Amazon affiliation.

- [ ] **Step 3: Add crawler files**

Create:

```text
User-agent: *
Allow: /

Sitemap: https://iix-ai.github.io/amazon-image-preflight/sitemap.xml
```

and an XML sitemap containing only `https://iix-ai.github.io/amazon-image-preflight/`.

- [ ] **Step 4: Improve one natural body phrase**

Keep the current explanatory copy and add the exact user-intent phrase “Amazon product image requirements” once in the existing checklist context, without repeating keywords or changing the tool flow.

- [ ] **Step 5: Run tests and confirm GREEN**

Run `npm test` and confirm the SEO tests and all existing analyzer/analytics tests pass.

---

### Task 3: Verify generated artifacts and publish

**Files:**
- Verify: `dist/index.html`, `dist/robots.txt`, `dist/sitemap.xml`, `dist/favicon.svg`.
- Modify: `README.md`, `EXPERIMENT.md`, `research/BUILD_DECISION_E08_001.md` only if needed to record the SEO launch.

**Interfaces:**
- Consumes: Task 2 source changes.
- Produces: build-compatible static artifacts, commit `feat: prepare search indexing and SEO metadata`, successful Pages deployment, and public endpoint evidence.

- [ ] **Step 1: Run tests and production build**

Run:

```powershell
npm test
npm run build
```

Confirm the generated root contains the crawler files and no `/assets/` absolute paths, localhost URLs, noindex, or nofollow.

- [ ] **Step 2: Review the diff and scan for secrets**

Run `git diff --check`, inspect changed files, and confirm no credential paths or obvious tokens are tracked.

- [ ] **Step 3: Commit and push**

```powershell
git add index.html public tests/seo.test.ts docs/superpowers/plans/2026-09-23-e08-seo-indexing.md
git commit -m "feat: prepare search indexing and SEO metadata"
git push origin main
```

- [ ] **Step 4: Verify GitHub Actions and public endpoints**

Wait for the Pages workflow to succeed, then verify HTTP 200 for the homepage, `robots.txt`, and `sitemap.xml`; parse the public homepage for canonical, title, description, and absence of noindex.

