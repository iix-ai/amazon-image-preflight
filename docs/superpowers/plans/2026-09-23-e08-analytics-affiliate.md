# E08 Analytics and Affiliate Configuration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable privacy-preserving Umami production tracking and the approved Photoroom referral CTA without adding product functionality.

**Architecture:** Keep the existing anonymous analytics adapter as the single event boundary. It will call the browser-provided `window.umami.track` for allowed custom events, strip all properties except the boolean affiliate classification, and ignore `page_view` because the Umami script automatically records it. The static HTML will load Umami with search-query exclusion and the runtime will set the referral CTA URL and disclosure.

**Tech Stack:** Vanilla TypeScript, static HTML/CSS, dependency-light Node build, custom Node test runner, Umami Cloud browser tracker, GitHub Pages.

**Spec:** User request for E08 first real traffic tracking and affiliate configuration, 2026-09-23.

## Global Constraints

- Keep Amazon Main Image Preflight as the only product and do not add features.
- Keep image processing browser-local; no image, filename, pixels, EXIF, product data, or user input may enter analytics.
- Allow only the existing anonymous event names and `affiliate: boolean` on the CTA event.
- Do not send a duplicate custom `page_view`; Umami's automatic pageview remains authoritative.
- Use `https://cloud.umami.is/script.js` with website ID `6093a209-3768-405a-a796-101dacf83bec`.
- Use `https://refer.photoroom.com/lanlulu` with `target="_blank"` and `rel="noopener noreferrer sponsored"`.
- Preserve the existing test/build fallback and GitHub Pages deployment workflow.

---

### Task 1: Lock the privacy and event contract with failing tests

**Files:**
- Modify: `tests/analytics.test.ts`
- Modify: `tests/smoke.test.ts`

**Interfaces:**
- Consumes: `createAnalyticsAdapter`, `ANALYTICS_EVENTS`, and `config.ts`.
- Produces: executable assertions for Umami event calls, duplicate pageview suppression, property sanitization, and the production affiliate configuration.

- [ ] **Step 1: Add failing adapter tests**

Add tests that inject a tracker with `track(event, properties)`, assert every non-pageview allowed event reaches it, assert `page_view` reaches neither tracker nor fallback emitter, and assert sensitive properties are dropped while `affiliate: true` survives.

- [ ] **Step 2: Add failing configuration assertions**

Assert `AFFILIATE_PHOTOROOM_URL` equals `https://refer.photoroom.com/lanlulu` and that the product configuration retains the existing product name.

- [ ] **Step 3: Run the focused test command and confirm RED**

Run:

```powershell
npm test
```

Expected: the new tracker/configuration assertions fail because the adapter has no tracker integration, still emits `page_view` through its current call path, and the affiliate URL is empty.

---

### Task 2: Implement the minimum Umami/referral integration

**Files:**
- Modify: `src/analytics/adapter.ts`
- Modify: `src/config.ts`
- Modify: `src/main.ts`
- Modify: `index.html`

**Interfaces:**
- Consumes: the failing contract from Task 1 and the existing event calls.
- Produces: `createAnalyticsAdapter({ enabled, tracker, emit })` with safe Umami dispatch; production referral configuration; Umami browser script; affiliate disclosure and secure CTA attributes.

- [ ] **Step 1: Implement tracker dispatch**

Add a small `UmamiTracker` type and resolve an injected tracker or `globalThis.umami` at event time. For allowed events other than `page_view`, call `track(event)` when there are no safe properties or `track(event, { affiliate })` for the CTA. If no tracker exists, preserve the existing local console emitter. Return without emitting for `page_view`.

- [ ] **Step 2: Configure referral and production adapter**

Set `AFFILIATE_PHOTOROOM_URL` to the supplied referral URL. Keep the runtime CTA assignment and `affiliate: Boolean(AFFILIATE_PHOTOROOM_URL)` classification. Enable the adapter in the browser so production Umami receives the events, while the fallback emitter remains local-only behavior when the tracker is unavailable.

- [ ] **Step 3: Load Umami with privacy-safe URL handling**

Add the supplied deferred Cloud script and website ID to `index.html`, plus `data-exclude-search="true"` so URL query values are not collected. Keep automatic pageviews enabled. Update the CTA's static fallback href, set `rel="noopener noreferrer sponsored"`, and replace the CTA note with the requested commission disclosure.

- [ ] **Step 4: Run the focused test command and confirm GREEN**

Run:

```powershell
npm test
```

Expected: all tests pass, including the new Umami/referral contract tests.

---

### Task 3: Update experiment records

**Files:**
- Modify: `README.md`
- Modify: `EXPERIMENT.md`
- Modify: `C:\Users\Administrator\Documents\Codex\2026-09-20\ai-product-factory-cto-1-agents-2\research\BUILD_DECISION_E08_001.md`

**Interfaces:**
- Consumes: the implemented website ID, referral URL, privacy boundary, and deployment intent.
- Produces: accurate production tracking/affiliate status and experiment start date without inventing traffic or conversion data.

- [ ] **Step 1: Update README privacy and experiment configuration**

Document Umami Cloud, the website ID, automatic pageview behavior, excluded URL search parameters, allowed event properties, referral URL, and affiliate disclosure.

- [ ] **Step 2: Update EXPERIMENT.md**

Set the status to first real traffic experiment, record the 2026-09-23 start date, mark production Umami enabled, define the same funnel metrics, and state that no traffic benchmark is assumed.

- [ ] **Step 3: Update BUILD_DECISION handoff**

Record production tracking enabled, the website ID, affiliate link enabled, disclosure, deployment commit placeholder to be filled with the actual commit after commit creation, and the experiment start date.

---

### Task 4: Verify, commit, deploy, and smoke test

**Files:**
- Verify: `dist/index.html`, `dist/src/analytics/adapter.js` or Vite output equivalent, and Git tracked files.

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces: verified production build, commit on `origin/main`, successful GitHub Pages workflow, and public smoke-test evidence.

- [ ] **Step 1: Run tests and production build**

Run:

```powershell
npm test
npm run build
```

Confirm zero test failures, exit code 0, Umami script in the built HTML, referral URL in the built output, and no absolute `/assets/` path regression.

- [ ] **Step 2: Scan tracked files for credentials and prohibited analytics payloads**

Confirm no `.env`, key, token, password, or API key files are tracked, and inspect the adapter/build output to ensure only `affiliate` can be sent as custom event data.

- [ ] **Step 3: Commit the scoped changes**

```powershell
git add src index.html tests README.md EXPERIMENT.md docs/superpowers/plans .github/workflows
git commit -m "feat: enable experiment analytics and Photoroom referral"
```

Record the resulting commit hash in `BUILD_DECISION_E08_001.md`, then amend only that documentation update if required.

- [ ] **Step 4: Push and verify GitHub Actions/Pages**

Run `git push origin main`, inspect the workflow run until it succeeds, and confirm the Pages URL is live over HTTPS.

- [ ] **Step 5: Run public smoke tests**

At `https://iix-ai.github.io/amazon-image-preflight/`, verify the Umami script loads, upload a fixture, verify one local analysis result, inspect the CTA href/rel/data affiliate flag, and inspect browser network/log evidence to ensure no image or filename is sent to Umami. Check mobile layout and reset the temporary viewport before finishing.

