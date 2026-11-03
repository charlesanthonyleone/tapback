# Decisions needed from Charles

Items that need your permission, an account, or money. Work continues around each one; nothing here has been bought or signed up for.

| # | Decision | Why it matters | Current state / zero-cost option |
|---|----------|----------------|----------------------------------|
| 1 | **Waitlist provider** (for example a free tier of Buttondown, Formspree, Tally or a Google Form) | The waitlist forms currently save only in the visitor's own browser. No email reaches you. | The forms say plainly that the waitlist isn't connected yet. Wiring in a provider is a single `fetch` call in `site.js` once you choose one and create the account. |
| 2 | **Support & press email address** | Press still shows a "coming soon" placeholder. Support now links to GitHub Issues (see below). | Clearly labelled placeholders. |
| 3 | **Custom domain** | The site lives at charlesanthonyleone.github.io/tapback. | Change `URL` in `src/build.py` and add a `CNAME` file once a domain is bought. |
| 4 | **Payments for Pro ($2.99/mo)** | Pricing is listed as "planned". There's no checkout. | No payment code is in the repo, and no Stripe keys are read or used. |
| 5 | **App Store / Play Store developer accounts** ($99/yr Apple, $25 one-time Google) | Needed to ship a native app. | The prototype runs through iOS Shortcuts / MacroDroid (see `prototype/`). |
| 6 | **Legal review** of privacy.html and terms.html | Both are marked DRAFT and name no legal entity. | Drafts are shown with a banner. |
| 7 | **Founder name** shown site-wide is "Roseann Mary Geiger" (from `CONFIG.FOUNDER` / build.py). | Please confirm it's correct and should be public. | Unchanged from the previous commit. |
| 8 | **In-browser natural voice** downloads the Kokoro model (~90 MB) from Hugging Face + jsDelivr, but only when the visitor turns it on. | It's a third-party CDN download, with no cost to you. | Opt-in. Preset lines are pre-rendered and self-hosted. |

## From worker B
- **Support contact (TB-14):** the Support page used to show an internal "Placeholder: add a support address" note to the public. It now points to GitHub Issues on the public repo. Pick a real support email, or approve GitHub Issues as the channel, before launch.
