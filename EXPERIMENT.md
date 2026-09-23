# E08 Experiment

## Status

First real traffic experiment started 2026-09-23. This is a market experiment, not a production SaaS. No income, visitor volume, or conversion benchmark is invented before traffic exists.

## Hypothesis

Amazon sellers will choose a no-login local checker for a concrete pre-upload pause, and a meaningful subset of completed analyses will click through to an image editor.

## Deployment

- Start date: 2026-09-23
- Commit: `246a10c` (`feat: enable experiment analytics and Photoroom referral`)
- Public URL: https://iix-ai.github.io/amazon-image-preflight/

## Funnel events

| Event | Meaning |
|---|---|
| `page_view` | The tool page loaded. |
| `image_selected` | A user selected or dropped a file. No file metadata is attached. |
| `analysis_completed` | A local analysis result was rendered. |
| `result_low_risk` | The rendered result had no automated warnings/fails. |
| `result_needs_review` | The rendered result had at least one warning. |
| `result_high_risk` | The rendered result had at least one fail. |
| `fix_cta_clicked` | The user clicked the editor CTA. |
| `check_another_clicked` | The user reset the tool to inspect another image. |

## Measures

- Visitors: count of `page_view` events.
- Image selected: count of `image_selected` events.
- Analysis completed: count of `analysis_completed` events.
- Completion rate: `analysis_completed / image_selected`.
- Fix CTA clicks: count of `fix_cta_clicked` events.
- Commercial-intent rate: `fix_cta_clicked / analysis_completed`.

These are definitions, not targets. Real data is required before deciding whether the hypothesis is supported, revised, or killed.

## Current analytics state

Umami Cloud production tracking is enabled with website ID `6093a209-3768-405a-a796-101dacf83bec`. The browser script automatically records `page_view`; the adapter does not emit a duplicate pageview custom event. The adapter maps the remaining funnel events to Umami and only allows the boolean `affiliate` property on `fix_cta_clicked`. URL search parameters are excluded by the tracker configuration. Do Not Track is respected. The adapter remains fully disableable and falls back to safe console summaries when no tracker is available locally.

## Affiliate state

`AFFILIATE_PHOTOROOM_URL` is enabled as `https://refer.photoroom.com/lanlulu`. The CTA opens that URL in a new tab with `noopener noreferrer sponsored` and records `affiliate=true`. The page discloses: “We may earn a commission if you purchase through this link.” The tool remains free and the editor CTA is optional.

## Privacy contract

The experiment never sends the image, filename, pixels, dimensions, EXIF, product data, or user input to analytics. Image analysis remains browser-local. Umami receives only the existing event names and, for the editor CTA, the non-sensitive `affiliate: true` classification.

## What counts as failure

After real traffic, failure signals include low analysis completion, repeated confusion about the independent-tool disclaimer, visual false positives that undermine trust, or no editor outbound intent. The numbers must be collected before applying any stop decision.
