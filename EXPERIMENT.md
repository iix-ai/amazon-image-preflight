# E08 Experiment

## Status

Build stage complete locally. This is a market experiment, not a production SaaS. No income, visitor volume, or conversion benchmark is invented before traffic exists.

## Hypothesis

Amazon sellers will choose a no-login local checker for a concrete pre-upload pause, and a meaningful subset of completed analyses will click through to an image editor.

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

The adapter is implemented and fully disableable. It logs safe event summaries only on localhost and has no production endpoint configured. This keeps the image privacy promise while the experiment waits for a deliberately chosen analytics destination.

## Affiliate state

`AFFILIATE_PHOTOROOM_URL` is intentionally empty. The CTA opens ordinary Photoroom and records `affiliate=false` in the local adapter. Replacing the value with an approved URL is a configuration-only change; no secret is required in this repository.

## What counts as failure

After real traffic, failure signals include low analysis completion, repeated confusion about the independent-tool disclaimer, visual false positives that undermine trust, or no editor outbound intent. The numbers must be collected before applying any stop decision.
