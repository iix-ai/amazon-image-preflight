# Amazon Main Image Preflight Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify a browser-local Amazon main-image preflight market experiment with measurable editor outbound intent.

**Architecture:** A single Vite page hosts a thin browser adapter, pure deterministic/visual analysis functions, a centralized Amazon rule catalog, and a privacy-safe analytics adapter. The selected image stays in memory and is decoded with browser APIs; the static build can deploy to GitHub Pages without a backend.

**Tech Stack:** Vanilla TypeScript, Vite, Vitest, HTML/CSS, browser `File`, `Image`, `Canvas`, and `ImageData` APIs.

**Spec:** `docs/superpowers/specs/2026-09-22-amazon-main-image-preflight-design.md`

## Global Constraints

- Support Amazon main image only.
- Keep image processing browser-local; never send image data, filenames, pixels, EXIF, product names, or user text to analytics or third parties.
- Use vanilla TypeScript + Vite; no backend, database, accounts, OAuth, Seller Central API, SP-API, subscription, AI chat, image generation, or background removal.
- Centralize every rule in `src/rules/amazon-main-image.ts` with id, description, source URL, source checked date, and hard/recommendation/estimate kind.
- Label visual checks `Estimated / Best effort` and uncertain semantic checks `Manual review required`.
- Keep `AFFILIATE_PHOTOROOM_URL=""` as the default and record `affiliate=false` when the fallback URL is used.
- Use only anonymous event names from the requested list; tracking must be disableable.
- Never claim Amazon approval, guaranteed compliance, or Amazon affiliation.
- Include mobile responsive layout, privacy copy, source/date, README, EXPERIMENT.md, BACKLOG.md, tests, fixtures, Git history, and a production build.

### Task 1: Project scaffold and repository guardrails

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
- Create: `.gitignore`, `README.md`, `EXPERIMENT.md`, `BACKLOG.md`
- Create: `src/main.ts`, `src/styles.css`
- Test: `tests/smoke.test.ts`

**Interfaces:**
- Produces the Vite/Vitest commands `npm run dev`, `npm run build`, and `npm test`.
- Produces an empty shell that compiles before analyzer behavior is added.

- [ ] **Step 1: Write the failing smoke test**

Create `tests/smoke.test.ts` with a test importing `PRODUCT_NAME` from `src/config.ts` and asserting it equals `Amazon Main Image Preflight`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run tests/smoke.test.ts`

Expected: FAIL because `src/config.ts` does not exist.

- [ ] **Step 3: Write the minimal project config and config module**

Add the package scripts, Vitest config through `vite.config.ts`, strict TypeScript settings, and `src/config.ts` exporting the product name, empty affiliate URL, and a boolean analytics flag. Add the initial page shell and privacy-safe README placeholders.

- [ ] **Step 4: Run the smoke test and production build**

Run: `npm test -- --run tests/smoke.test.ts` and `npm run build`

Expected: PASS and exit code 0.

- [ ] **Step 5: Commit**

Run: `git add . && git commit -m "chore: scaffold image preflight experiment"`

### Task 2: Centralized Amazon rules and deterministic checks

**Files:**
- Create: `src/rules/amazon-main-image.ts`
- Create: `src/analyzer/types.ts`, `src/analyzer/deterministic.ts`, `src/analyzer/aggregate.ts`
- Test: `tests/deterministic.test.ts`
- Create: `tests/fixtures/fixture-metadata.ts`

**Interfaces:**
- `amazonMainImageRules: readonly RuleDefinition[]`
- `runDeterministicChecks(input: DeterministicInput): CheckResult[]`
- `getOverallRisk(checks: readonly CheckResult[]): OverallRisk`

- [ ] **Step 1: Write failing tests for all deterministic fixtures**

Test the valid 2000×2000 JPEG as all PASS, a 400×400 image as a size FAIL, transparent PNG as an alpha FAIL, an unsupported type as a type FAIL, a large file as a size warning, and wide/tall dimensions as an aspect-ratio warning. Assert that measured values appear in result details.

- [ ] **Step 2: Run deterministic tests to verify they fail**

Run: `npm test -- --run tests/deterministic.test.ts`

Expected: FAIL because the rule catalog and analyzer exports do not exist.

- [ ] **Step 3: Implement the rule catalog and pure checks**

Define each rule with its source URL and `sourceCheckedDate: "2026-09-22"`. Implement checks for readable status, width, height, longest side, allowed file type, file size, alpha presence, and aspect ratio. Return measured values and status without touching DOM APIs.

- [ ] **Step 4: Run deterministic tests to verify they pass**

Run: `npm test -- --run tests/deterministic.test.ts`

Expected: all deterministic tests PASS.

- [ ] **Step 5: Commit**

Run: `git add src/rules src/analyzer tests/deterministic.test.ts tests/fixtures/fixture-metadata.ts && git commit -m "feat: add sourced deterministic image checks"`

### Task 3: Best-effort visual estimates and manual review contract

**Files:**
- Create: `src/analyzer/visual.ts`, `src/analyzer/manual-review.ts`
- Test: `tests/visual.test.ts`
- Modify: `src/analyzer/aggregate.ts`

**Interfaces:**
- `estimateVisualChecks(input: VisualInput): CheckResult[]`
- `manualReviewItems: readonly ManualReviewItem[]`

- [ ] **Step 1: Write failing visual tolerance tests**

Build synthetic pixel buffers for a white canvas with a centered subject, a non-white border/background, a subject occupying too little of the frame, and a borderline occupancy case. Assert status within the configured tolerance and assert every estimate has `confidenceLabel: "Estimated / Best effort"`.

- [ ] **Step 2: Run visual tests to verify they fail**

Run: `npm test -- --run tests/visual.test.ts`

Expected: FAIL because visual estimator exports do not exist.

- [ ] **Step 3: Implement minimal Canvas-independent estimators**

Sample pixels at a bounded stride. Estimate background whiteness from border samples, detect non-background bounding pixels, calculate frame occupancy, flag possible border contamination from edge runs, and return warnings rather than claims when confidence is low. Do not infer trademark, copyright, semantic text, exact product match, category rules, or model/accessory compliance.

- [ ] **Step 4: Run visual tests and full unit tests**

Run: `npm test -- --run tests/visual.test.ts tests/deterministic.test.ts`

Expected: all tests PASS.

- [ ] **Step 5: Commit**

Run: `git add src/analyzer tests/visual.test.ts && git commit -m "feat: add labelled visual estimates and manual review"`

### Task 4: Browser-local file pipeline and event adapter

**Files:**
- Create: `src/browser/image-loader.ts`, `src/analytics/adapter.ts`
- Test: `tests/analytics.test.ts`

**Interfaces:**
- `loadImageForAnalysis(file: File): Promise<LoadedImage>`
- `AnalyticsAdapter.track(event: AnalyticsEvent, properties?: SafeAnalyticsProperties): void`
- `createAnalyticsAdapter(options): AnalyticsAdapter`

- [ ] **Step 1: Write failing analytics tests**

Assert that all allowed event names are accepted, an invalid event is rejected at the type boundary, `affiliate` is the only property emitted for CTA tracking, and disabled tracking emits nothing. Add a file-loader failure test for unreadable image input.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- --run tests/analytics.test.ts`

Expected: FAIL because the adapter and loader exports do not exist.

- [ ] **Step 3: Implement the browser adapter and console/no-op analytics**

Decode with `URL.createObjectURL`, read dimensions and ImageData through an offscreen canvas, revoke the object URL in all paths, and return only analysis-ready data. Implement safe event filtering and production no-op/opt-in console behavior. Never include a File or image-derived value in event properties.

- [ ] **Step 4: Run tests**

Run: `npm test -- --run tests/analytics.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

Run: `git add src/browser src/analytics tests/analytics.test.ts && git commit -m "feat: add local image pipeline and privacy-safe events"`

### Task 5: Tool UI, copy, CTA, and responsive styling

**Files:**
- Modify: `index.html`, `src/main.ts`, `src/styles.css`
- Create: `src/ui/render-results.ts`
- Test: `tests/aggregate.test.ts`

**Interfaces:**
- `renderAnalysisResult(container: HTMLElement, result: AnalysisResult): void`
- UI emits only the specified analytics event names.

- [ ] **Step 1: Write failing aggregation tests**

Assert that deterministic/visual FAIL yields HIGH RISK, warnings yield NEEDS REVIEW, and an all-pass set yields LOW RISK. Assert manual review items render as required review, not as PASS.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run tests/aggregate.test.ts`

Expected: FAIL until the result renderer/aggregation contract exists.

- [ ] **Step 3: Implement the page flow**

Build drag/drop and choose-image input, immediate local analysis, grouped result sections, actual measured values, overall risk badge, Photoroom CTA with `affiliate` fallback flag, check-another CTA, and batch-coming-soon copy. Include required SEO sections, FAQ, privacy explanation, source/date link, and independent-tool disclaimer.

- [ ] **Step 4: Run unit tests and build**

Run: `npm test -- --run tests/aggregate.test.ts` and `npm run build`

Expected: PASS and exit code 0.

- [ ] **Step 5: Commit**

Run: `git add index.html src tests/aggregate.test.ts && git commit -m "feat: ship Amazon main image preflight UI"`

### Task 6: Fixtures, documentation, and static deployment configuration

**Files:**
- Create: `tests/fixtures/README.md` and six fixture descriptors/assets
- Modify: `README.md`, `EXPERIMENT.md`, `BACKLOG.md`
- Create: `.github/workflows/deploy.yml`
- Create: `public/.nojekyll`

- [ ] **Step 1: Add fixture descriptors and documentation**

Document the six named cases: valid 2000×2000 white background, too small, transparent PNG, non-white background, product too small, and borderline. Keep fixtures local and synthetic; no user image is checked in.

- [ ] **Step 2: Add experiment and privacy documentation**

Record product hypothesis, user, exact task, monetization/affiliate hypothesis, measures, formula, privacy model, rule source date, current status, and failure signals without inventing benchmarks.

- [ ] **Step 3: Add minimal Pages workflow**

Use the repository's Node version, `npm ci`, `npm run build`, and upload `dist` with GitHub Pages actions. No secrets are referenced.

- [ ] **Step 4: Run complete verification**

Run: `npm test -- --run`, `npm run build`, `git diff --check`, and a repository scan that checks for private keys/tokens and verifies no image upload/network code exists.

- [ ] **Step 5: Commit**

Run: `git add . && git commit -m "docs: define experiment and Pages deployment"`

### Task 7: Browser smoke test, GitHub attempt, and research handoff

**Files:**
- Modify: `research/BUILD_DECISION_E08_001.md` in the original AI Product Factory research directory
- No product source changes unless verification finds a defect.

- [ ] **Step 1: Run the production preview and inspect desktop/mobile flows**

Start `npm run preview -- --host 127.0.0.1`, load the page in a browser, select a local fixture or generated image, verify analysis and both CTAs, and inspect at a narrow mobile viewport. Stop the preview after inspection.

- [ ] **Step 2: Re-run complete verification after any fixes**

Run: `npm test -- --run`, `npm run build`, `git diff --check`, and `git status --short --branch`.

- [ ] **Step 3: Check GitHub CLI and create the repository if authenticated**

Run `gh --version` and `gh auth status`. If authenticated, create public `amazon-image-preflight`, add the remote, push `main`, and enable the Pages workflow. If login is required, do not claim success; preserve all local commits and report the minimum login command.

- [ ] **Step 4: Record the build decision**

Write the research handoff with why research stopped, fixed scope, local repo path/repo URL, deployment URL if available, affiliate status, analytics status, known risks, and the next experiment action.

- [ ] **Step 5: Final verification and report**

Run `git log --oneline -n 10`, `git status --short --branch`, `npm test -- --run`, and `npm run build`; report only statuses backed by those outputs.
