# Traffic Experiment 001

## Experiment record

- Experiment start date: 2026-09-23
- Product URL: https://iix-ai.github.io/amazon-image-preflight/
- Acquisition channels: free tool directories; one high-intent SEO acquisition page at `/amazon-main-image-rejected/`
- Status: IN PROGRESS — first directory submission received; waiting for external discovery and production analytics data.

## Directory submissions

| Channel | Submission URL | Submitted date | Status | Resulting listing URL |
|---|---|---:|---|---|
| The Free Tools Directory | https://thefreetoolsdirectory.com/submit | 2026-09-23 | SUBMITTED — form confirmed “Submission received!” | Not issued yet; directory review is pending |
| Ultimate Free Tools | https://ultimatefreetools.com/submit-a-tool/ | — | MANUAL_REQUIRED — submission page requires a publisher account | None |
| GitHub discovery source | https://github.com/maxlibin/free-directory-submissions | — | DISCOVERY_ONLY — source list, not a submission destination | None |

### Directory verification notes

- The Free Tools Directory: submission page was online; form accepted the product without login, CAPTCHA, payment, backlink/badge, or email. Email was left blank because it was optional. The directory describes itself as a free curated index and its terms state that the site is provided free of charge.
- Ultimate Free Tools: site and submission page were online and the page states that listings are free and not pay-to-rank, but the form requires sign-in or account creation. No account was created.
- GitHub `maxlibin/free-directory-submissions`: active discovery list only. Its “no login/no badge/no payment” claims were not treated as proof; candidate submission pages were opened and checked independently.
- Launchpedia: https://launchpedia.co/submit/ — online form, but Name and Email Address fields are required. MANUAL_REQUIRED.
- Startup Collections: https://startupcollections.com/submit-product/ — online form, but Your name and Your email fields are required. MANUAL_REQUIRED.
- Launching Next: https://www.launchingnext.com/submit/ — returned a Cloudflare security verification page/403. MANUAL_REQUIRED.
- SoMuch: https://www.somuch.com/submit-links/ — free queue exists, but the site requires email verification; paid upgrade options are also shown. MANUAL_REQUIRED.

## Funnel measurement

The following counts are intentionally separate from internal QA. No number is invented before the first external analytics read.

| Metric | EXTERNAL REAL TRAFFIC | INTERNAL QA TRAFFIC |
|---|---|---|
| Visitors (`page_view`) | Awaiting first post-submission read | Excluded from market metrics |
| `image_selected` | Awaiting measurement | Excluded from market metrics |
| `analysis_completed` | Awaiting measurement | Excluded from market metrics |
| `fix_cta_clicked` | Awaiting measurement | Excluded from market metrics |
| Photoroom referral | Awaiting measurement | Excluded from market metrics |
| Leads/sales | None observed in this record | Excluded from market metrics |

## Measurement definitions

- Visitor: production `page_view` on the homepage or acquisition page.
- Image selected: the existing `image_selected` event after a user chooses or drops a file.
- Analysis completed: the existing `analysis_completed` event after a local result renders.
- Fix CTA clicked: the existing `fix_cta_clicked` event; the adapter records only the boolean affiliate classification.
- Photoroom referral: a click-through from the existing CTA to the configured Photoroom referral URL. The checker remains usable without it.

## Notes

- Internal smoke tests, local preview visits, and Playwright production QA are not market demand and must not be added to the external counts.
- The directory submission uses the clean canonical homepage URL. No short link, affiliate redirect, UTM parameter, or tracking redirect was used.
- Umami configuration was left unchanged, including `data-exclude-search="true"`; this experiment does not lower the existing privacy setting to add UTM attribution.
- First observation point: read production Umami pageviews and the five funnel signals after directory review/search discovery has had time to produce external sessions.

## Traffic Experiment 002 — YouTube Faceless Demo

- Video asset created date: 2026-09-23
- Upload status: PUBLISHED by the account owner
- Public video: https://www.youtube.com/watch?v=trUGKw1n8gQ
- Published date: 2026-09-24 (the public channel page showed “9 min ago” during QA; exact publish time was not exposed)
- Channel display name: ii-x
- Channel handle / public URL: @ii-x-one — https://www.youtube.com/@ii-x-one
- Asset: V2 production video and V2 thumbnail
- Advanced features: ENABLED (confirmed by the account owner)
- Description product link: CLICKABLE (confirmed by the account owner; anonymous QA could not expand the description)
- Public visibility: the video is listed on the channel’s public Videos page; no Studio access was used
- Views: BASELINE ONLY; do not count owner, user, Playwright, or other internal QA traffic as market evidence
- Resulting external visitors: AWAITING DATA
- `image_selected`: AWAITING DATA
- `analysis_completed`: AWAITING DATA
- `fix_cta_clicked`: AWAITING DATA
- Photoroom lead/sale: AWAITING DATA

### Public-page QA and limits

- The public channel Videos page listed the exact video title, the V2 thumbnail, and a duration of 0:31. The channel identity was resolved by handle, not display name alone.
- The anonymous watch page showed YouTube’s “Sign in to confirm you’re not a bot” gate. No sign-in or verification bypass was attempted; playback, audio, burned-in captions, opening frames, and description contents could not be independently inspected in the watch player.
- The owner confirmed the description’s product URL is clickable. The public QA browser did not open or play the video; any views associated with this QA browsing are internal and excluded from market metrics.
- No copyright or policy warning was visible in the public pages checked. Studio-only copyright/policy status is UNKNOWN and is not inferred from the public listing.
- The older upload on the other, same-display-name `ii-x` channel is not the production video. Do not combine its views, visitors, or other metrics with this experiment.

### Measurement checkpoints

All values begin as AWAITING DATA. Checkpoint calendar dates use the public publish date; because the exact publish time is not publicly exposed, align precise T+ intervals to the owner-visible Studio timestamp. Exclude the user’s own tests, Playwright/Codex QA, repeat refreshes, and views from other owned accounts.

| Checkpoint | Target date | Status |
|---|---:|---|
| T+24h | 2026-09-25 | AWAITING DATA |
| T+72h | 2026-09-27 | AWAITING DATA |
| T+7d | 2026-10-01 | AWAITING DATA |

At each checkpoint, capture YouTube Studio impressions, impressions CTR, views, unique viewers (if available), average view duration, average percentage viewed, audience retention (if available), traffic source types, YouTube Search traffic, and search terms (if available). Also capture website external visitors, YouTube referrers (`youtube.com` / `youtu.be`, if available), `image_selected`, `analysis_completed`, and `fix_cta_clicked`; and Dub/Photoroom clicks, leads, sales, and earnings. No values have been supplied or inferred in this baseline.
