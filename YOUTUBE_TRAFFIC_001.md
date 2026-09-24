# YouTube Traffic Experiment 001

## Production publication

- Status: PUBLISHED by the account owner
- Published date: 2026-09-24 (the public channel page showed “9 min ago” during QA; exact publish time was not exposed)
- Production video: https://www.youtube.com/watch?v=trUGKw1n8gQ
- Channel display name: ii-x
- Production channel handle / public URL: @ii-x-one — https://www.youtube.com/@ii-x-one
- Asset: V2 production video and V2 thumbnail
- Advanced features: ENABLED (account-owner confirmed)
- Description product link: CLICKABLE (account-owner confirmed)
- Public QA: the video appears in the channel’s public Videos listing with the expected title, thumbnail, and 0:31 duration. Anonymous watch-page playback was blocked by YouTube’s “Sign in to confirm you’re not a bot” gate. No Google login, verification, or automation restriction bypass was attempted.
- Studio-only copyright/policy checks: UNKNOWN from public-page QA; no visible restriction warning appeared on the public pages checked.
- Internal QA traffic: public-page visits are not market evidence. Exclude user-owned tests, Playwright/Codex QA, repeated refreshes, and other owned-account views from all reported metrics.

## Final YouTube metadata

### TITLE

Amazon Main Image Rejected? Check This Before You Re-Upload

### DESCRIPTION

Free Amazon Main Image Preflight:
https://iix-ai.github.io/amazon-image-preflight/

Check image dimensions, transparency, white-background signals and product framing before re-uploading your Amazon MAIN image.

The checker runs locally in your browser. No account required.

Independent tool. Not affiliated with or endorsed by Amazon. Seller Central makes the final decision.

The tool may contain affiliate links. If you purchase through one of them, the site may earn a commission at no extra cost to you.

#AmazonSeller #AmazonFBA #ProductImages

The account owner confirmed that the product URL in the published description is clickable. The anonymous QA session could not read the expanded description, so this is recorded as owner-confirmed rather than independently extracted from the public watch page.

## Public QA findings

- The public channel page identifies the production channel as `@ii-x-one`; do not identify this experiment by the display name `ii-x` alone because another same-display-name channel has an older, non-production upload.
- The channel’s public Videos page lists this video and displays the 0:31 runtime and V2 thumbnail. This supports public visibility; no authenticated Studio state was read.
- The watch page loaded with the correct title and channel name but showed YouTube’s bot-confirmation sign-in gate. Playback, audio, burned-in captions, opening frames, and public-page description text were not independently verified. No playback was attempted.
- No copyright/policy warning was visible in the pages checked. This does not establish Studio copyright-check status.
- Do not merge metrics from the old upload on the other `ii-x` channel into this production experiment.

## Automation constraint

Google rejected automated Chromium login with an “This browser or app may not be secure” message. Future YouTube Studio login or upload automation must not attempt to bypass Google’s automated-browser restrictions. Manual authenticated publishing by the account owner remains acceptable.

## Measurement baseline and checkpoints

All metrics are pending; no market result is claimed from publication or QA. Calendar dates below are based on the public publish date. Since the exact publication timestamp is not publicly exposed, use the account-owner-visible Studio timestamp to align precise relative deadlines.

| Checkpoint | Target date | Status |
|---|---:|---|
| T+24h | 2026-09-25 | AWAITING DATA |
| T+72h | 2026-09-27 | AWAITING DATA |
| T+7d | 2026-10-01 | AWAITING DATA |

Capture these fields at each checkpoint:

- YouTube Studio: impressions; impressions click-through rate; views; unique viewers (if available); average view duration; average percentage viewed; audience retention (if available); traffic source types; YouTube Search traffic; search terms (if available).
- Website / Umami: external visitors; referrers from `youtube.com` / `youtu.be` if available; `image_selected`; `analysis_completed`; `fix_cta_clicked`.
- Dub / Photoroom: clicks; leads; sales; earnings.

Exclude the user’s own tests, Playwright/Codex QA, repeat refreshes, and views by other owned accounts. The YouTube QA in this record did not play the video; regardless, public QA browsing is classified as internal and excluded.
