# Amazon Main Image Preflight Design

## Goal

Ship a disposable, static market experiment that lets an unfamiliar Amazon seller select a main image, receive a local preflight result, and take a measurable next commercial action.

This is a market experiment, not a production SaaS.

## Fixed scope

- Amazon main image only.
- Browser-local image analysis; the selected image is not uploaded, stored, or sent to third parties.
- Vanilla TypeScript + Vite; no backend, database, login, OAuth, Seller Central API, SP-API, subscriptions, image generation, background removal, or marketplace expansion.
- The home page is the tool. The flow is select/drag image → analyze immediately → show result groups → offer editor CTA or check another image.
- All policy-sensitive conclusions are framed as preflight risks, never as Amazon approval or guaranteed acceptance.

## Product contract

Page title: `Amazon Main Image Checker – Preflight Product Photos Before Upload`.

Hero copy:

> Amazon Main Image Preflight
> Check common Amazon main-image risks before uploading to Seller Central.

Required disclosure: `Independent tool. Not affiliated with Amazon. Final decisions are made by Amazon / Seller Central.`

The result has three groups:

1. Deterministic checks: readable image, width, height, longest side, file type, file size, alpha/transparency, and aspect ratio. Every item shows measured values and PASS/WARNING/FAIL.
2. Best-effort visual estimates: background whiteness, edge/background contamination, subject bounding box, approximate frame occupancy, and possible border. Every item is explicitly labelled `Estimated / Best effort`.
3. Manual review: trademark, copyright, misleading product claims, category-specific props, human-model rules, accessory inclusion, exact product match, and complex watermark/text semantics. Each item says `Manual review required`.

Overall risk is derived conservatively: any deterministic FAIL or visual FAIL is HIGH RISK; otherwise any warning is NEEDS REVIEW; otherwise LOW RISK. Manual-review items remain visible and do not become an automated compliance verdict.

## Architecture and data flow

`src/rules/amazon-main-image.ts` is the single policy configuration source. Each rule has `id`, `description`, `sourceUrl`, `sourceCheckedDate`, and `kind` (`hard`, `recommendation`, or `estimate`). Rule values are kept separate from UI copy so source dates and thresholds can be updated without searching the UI.

The analyzer is split into pure functions:

- deterministic metadata checks consume file metadata and decoded image dimensions;
- visual estimation consumes sampled `ImageData` and returns confidence/estimate labels;
- aggregation maps check statuses to the overall risk.

The browser adapter owns `File` decoding, object URLs, Canvas sampling, and cleanup. No analyzer function receives a filename, EXIF payload, product name, or network client.

The analytics adapter exposes only the required event names and an optional `affiliate` boolean for the fix CTA. The default implementation writes safe event summaries to console in development and is disabled by configuration in production unless explicitly enabled. No image, filename, pixels, EXIF, product text, or user input is tracked.

The Photoroom configuration is `AFFILIATE_PHOTOROOM_URL=""`. Empty configuration falls back to the ordinary Photoroom website and records `affiliate=false`; a future affiliate URL changes only configuration.

## Rules and source policy

Only Amazon official seller education/help materials are used for rule sources. The initial source is the official Amazon seller image guidance PDF already recorded as S22 in the research evidence ledger. Recommendations and estimates are labelled separately from hard checks. The source checked date is `2026-09-22`.

The implementation will not encode unsupported category-specific or semantic claims. Those belong to the manual-review list.

## Testing and fixtures

Vitest covers pure deterministic checks for:

- valid 2000×2000 white-background image;
- too-small image;
- transparent PNG;
- non-white background;
- product too small in frame;
- borderline visual case.

Visual estimate assertions use tolerances and assert the estimate label. Production build is verified with `npm run build`. The static preview is checked in a browser at desktop and narrow mobile widths.

## SEO and experiment content

The single page contains useful sections titled `What this checks`, `What this cannot check`, `Amazon main image checklist`, `Why white backgrounds fail`, `Why product framing matters`, and `FAQ`. It does not claim search volume or Amazon affiliation.

`README.md` records the product hypothesis, user, exact task, monetization and affiliate hypotheses, success/failure measures, privacy model, rule source/date, and experiment status. `EXPERIMENT.md` defines visitors, image_selected, analysis_completed, completion rate, fix_cta_clicked, and commercial-intent rate (`fix_cta_clicked / analysis_completed`) without inventing benchmarks. `BACKLOG.md` records future ideas without implementing them.

## Deployment

The build is static and GitHub Pages is the preferred deployment. If GitHub CLI cannot be installed/authenticated, local Git history and all verification still complete; the final report gives only the minimal manual login/deployment action needed. No credentials or affiliate/analytics secrets are committed.
