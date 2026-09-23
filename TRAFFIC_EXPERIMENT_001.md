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
