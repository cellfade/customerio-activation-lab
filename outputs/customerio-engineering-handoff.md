# Customer.io Activation + Conversion Prototype — Engineering Handoff

## What this artifact demonstrates

This is one connected growth story with two switchable journeys:

1. **Personalized onboarding:** carry the user’s signup intent (“Automated workflows” and “Newsletters”) into a sequenced first-launch plan. Domain verification becomes an asynchronous state instead of a dead end; adding a safe test profile is promoted while DNS processes.
2. **Trial value offer:** make the persistent Upgrade control more legible, explain a proposed “select a plan now, keep evaluating through Day 30” offer, compare plans, make billing timing explicit, and preserve/recover state.

The concept is intentionally labeled as an experiment. Pricing, eligibility, cancellation, and billing language are not represented as approved Customer.io policy.

## Why React + TypeScript, not a forced Next.js clone

Customer.io’s public engineering role describes Go, React, Ember, and TypeScript in the product stack. Pluma publishes React and Ember packages. The prototype is therefore a framework-light React + TypeScript feature artifact that can be mounted in the appropriate host instead of coupling the concept to an unverified Next.js runtime.

Primary references:

- [Customer.io Senior Fullstack Engineer](https://job-boards.greenhouse.io/customerio/jobs/7776591?gh_src=pfj)
- [Pluma NavItem](https://pluma.customer.io/components/nav-item/code)
- [Pluma Modal](https://pluma.customer.io/components/modal)
- [Pluma Drawer Manager](https://pluma.customer.io/components/drawer-manager)
- [Pluma tokens](https://pluma.customer.io/foundations/tokens/all-tokens)
- [Pluma MCP server](https://pluma.customer.io/overview/mcp-server)
- [Customer.io logo guidance](https://brand.customer.io/docs/logo)

## Pluma fidelity update

The public prototype now uses the official Customer.io mark and exact public Pluma token values for product surfaces, navigation, text, borders, elevation, focus, type scale, and motion. Inspectable `data-pluma-component` seams identify the intended `NavItem`, `Button`, `OptionCardGroup`, managed `Modal`, and managed `Drawer` replacements.

The Pluma packages are private: the published MCP setup requires a GitHub token and authenticated `.npmrc`, and anonymous registry requests return 404. For that reason this artifact does not fake package imports. `src/pluma/INTEGRATION.md` documents the authenticated production swap and dry-run-first CLI workflow.

## Production replacement map

| Prototype seam | Customer.io production mapping |
|---|---|
| `src/styles/tokens.css` | Public values mirror Pluma 0.34.3; replace aliases with private `themeVars` accessors. |
| Sidebar buttons | `NavItem` from `@customerio/pluma-components/react`. |
| `SetupDrawer` | Managed `Drawer` through Pluma `useDrawer` / `useDrawers`. |
| `PlanModal` | Managed `Modal`, `ModalBody`, and `ModalFooter`. |
| Native buttons/fields | Pluma `Button`, `Form`, `TextField`, and `OptionCardGroup`. |
| `useManagedDialog` | Remove when mounted inside Pluma; Pluma supplies focus entry, trapping, Escape, and return focus. |
| `track()` | Replace the window event adapter with the internal analytics client. |
| `persistPlan()` | Replace localStorage with a server-authoritative billing mutation and idempotency key. |

## State and error contract

The upgrade experience is a reducer with `closed`, `coachmark`, `plans`, `submitting`, `confirmed`, and `error` states. It preserves the chosen plan during a recoverable failure, disables duplicate submits, and only persists after success.

Eligibility is separated from presentation and currently accepts:

- remaining trial days;
- whether a plan was already selected;
- whether the workspace is eligible for self-serve purchase.

Production eligibility should come from one server response so UI copy, offer end date, billing start date, plan availability, and legal terms cannot drift.

## Proposed event contract

- `onboarding_step_started { step }`
- `onboarding_step_completed { step }`
- `upgrade_offer_impression { trigger, daysRemaining, variant }`
- `upgrade_offer_dismissed { trigger }`
- `upgrade_plan_compare_opened { trigger }`
- `upgrade_plan_selected { plan, trigger }`
- `upgrade_plan_selection_failed { plan, trigger }`

Recommended experiment measures:

- Primary: eligible activated workspaces selecting a plan.
- Secondary: trial-to-paid conversion and time to first successful test send.
- Guardrails: refunds, cancellations before billing, support contacts, and dismiss/reopen frequency.
- Diagnostic cuts: activation milestone, workspace size, selected onboarding goals, and plan.

## Accessibility and motion

- Dialogs expose labels, Escape dismissal, focus containment, and return focus.
- Plan options use radio semantics and visible selected/focus states.
- State changes use `aria-live` / status messaging.
- Reduced-motion preferences remove border-beam, spinner, and transition motion.
- The coachmark becomes a bottom sheet-like surface on narrow screens.

## Suggested delivery slices

1. Instrument existing onboarding and upgrade paths to establish baseline.
2. Carry signup intent into a server-backed activation-plan payload.
3. Ship asynchronous-domain step promotion behind an experiment flag.
4. Add the trial-offer eligibility endpoint and analytics only.
5. Ship the coachmark to a small eligible cohort; validate comprehension before enabling plan selection.
6. Add server-authoritative plan selection with idempotency, error recovery, and billing/legal review.
