# Live Prototype QA

## Summary

Pass for interview demonstration. Both journeys are live in one URL, the production build succeeds, unit checks pass, and the tested Vercel page reported no console errors or warnings.

## Environment

- Live: https://customerio-activation-lab.vercel.app
- Repository: https://github.com/cellfade/customerio-activation-lab
- Desktop browser: Chromium, live Vercel domain
- Mobile viewport: 390 × 844
- Build: Vite 6 + React 19 + TypeScript

## Changes verified

- Personalized goal context appears in onboarding.
- Verify-domain drawer opens and closes through explicit action.
- After domain submission, DNS changes to a background-checking state and Add profile is promoted.
- Upgrade border beam remains attached to the existing trial control.
- Trial offer opens from journey switcher / sidebar trigger.
- Plan modal supports radio-like plan selection, loading, confirmation, and persistent success.
- Forced failure state is represented in the reducer and unit tests without corrupting the chosen plan.
- Mobile coachmark and modal fit the viewport.

## Checks

| Check | Result | Evidence |
|---|---|---|
| Page identity | Pass | Correct title on local and live URLs. |
| Blank / failed render | Pass | Dashboard shell, onboarding, and offer content rendered. |
| Overlay behavior | Pass | Drawer and plan modal opened; explicit close and Escape behavior implemented. |
| Console | Pass | Live-domain check: 0 errors, 0 warnings. |
| Screenshot | Pass | Desktop and 390px mobile captures saved in outputs. |
| Interaction | Pass | Domain → checking/promotion; offer → compare → selection → 30-day confirmation. |

## Interaction loop

1. Open Personalized onboarding.
2. Select Verify domain and submit the prefilled domain.
3. Confirm Add profile moves to the first position while DNS continues in the background.
4. Switch to Trial value offer.
5. Read the coachmark, compare plans, and choose Essentials or Premium.
6. Confirm the sidebar and status toast reflect the selected plan and extended trial.
7. Reset the prototype from the bottom control to replay.

## Evidence

- `customerio-activation-conversion-live.png`
- `customerio-upgrade-offer-mobile-live.png`
- `npm run test`: 2 files, 5 tests passed.
- `npm run build`: successful production bundle.
- Live HTTP response: 200.

## Commands / browser APIs

- `npm run test`
- `npm run build`
- Vercel production deployment
- Playwright navigation, accessibility snapshots, clicks, viewport resize, screenshots, and console inspection
- `curl -I` against production alias

## Remaining risk

- The offer is a product hypothesis, not a confirmed Customer.io promotion.
- Server billing, legal copy, entitlement timing, idempotency, and analytics wiring are mocked.
- Pluma is represented by compatible roles and token values; internal package access was not available, so production components must replace the local primitives.
- Browser QA covered the critical interview path, not the full matrix of browsers, zoom levels, screen readers, and languages.

