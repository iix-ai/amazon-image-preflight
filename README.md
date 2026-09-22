# Amazon Main Image Preflight

This is a market experiment, not a production SaaS.

Amazon Main Image Preflight is a small static browser tool for Amazon sellers who want a quick pause before uploading a product main image to Seller Central. It checks measurable file risks locally, adds clearly labelled best-effort visual estimates, and points to a separate editor as the next action.

## Product hypothesis

An unfamiliar Amazon seller with an existing product image will use a free, no-login, local-first preflight if it gives concrete measurements and a trustworthy boundary around what it cannot know. After seeing the result, some users will click an image editor to fix the next issue.

## User and exact task

- User: Amazon seller or listing operator.
- Exact task: choose one Amazon main image, see size/format/background/framing risks, and decide whether to inspect or edit it before uploading.
- First version: Amazon main image only.

## Monetization hypotheses

- Primary experiment: editor outbound intent, initially through a Photoroom link.
- Affiliate hypothesis: a user who sees an image risk has a natural next step in a listing-image editor; approval and paid referral conversion are unknown.
- Future hypothesis: a one-time batch report could be useful, but this build does not implement payment, email collection, or batch processing.

## Privacy model

Image processing runs in the browser tab with `File`, `Image`, and Canvas APIs. The selected image is not uploaded, permanently stored, or sent to a third party by this code. Analytics is an adapter with no network endpoint: on localhost it can write anonymous event names to the console; on a deployed hostname it is disabled by default. Events never include filename, image data, pixels, EXIF, product name, or user text.

Allowed event names are `page_view`, `image_selected`, `analysis_completed`, `result_low_risk`, `result_needs_review`, `result_high_risk`, `fix_cta_clicked`, and `check_another_clicked`. The only optional property is `affiliate: boolean` on the fix CTA event.

## Rules and source date

Rules are centralized in `src/rules/amazon-main-image.ts`. The initial source is the [Amazon seller image guidance PDF](https://m.media-amazon.com/images/G/28/AS/AGS/SU/CN_GS_Listing_Optimization_1.1_General_Guidance_EN.pdf), with an official Seller Central forum reference for the framing estimate. Source checked date: `2026-09-22`.

The tool does not claim Amazon approval, guaranteed compliance, guaranteed acceptance, or Amazon affiliation. Visual checks say `Estimated / Best effort`; semantic and category-sensitive questions say `Manual review required`.

## Development

```text
npm install
npm test
npm run build
npm run preview
```

The repository includes a Vite configuration for the normal developer workflow. The checked-in build command also has a dependency-light static build path so the experiment can be assembled in restricted environments; it copies the browser-local TypeScript modules into `dist` as browser JavaScript and keeps the Vite setup available when dependencies are installed.

## Experiment status

The implementation is ready for a first usage/outbound-intent experiment once a public static URL is available. See [EXPERIMENT.md](EXPERIMENT.md) for the measurement definitions and [BACKLOG.md](BACKLOG.md) for explicitly deferred work.
