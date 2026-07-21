# Customer.io Activation + Conversion Prototype

An interview design artifact exploring two connected self-serve growth moments:

1. **Personalized onboarding** — turns signup intent into a sequenced first-launch plan, keeps useful work moving while DNS processes, and closes with a safe one-person test send.
2. **Trial value offer** — makes the existing Upgrade control more legible with a restrained border beam, contextual coachmark, plan comparison, explicit billing timing, persistence, and recoverable failure handling.

## Run locally

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run test
npm run build
```

## Production-alignment note

Customer.io's public engineering materials identify Go, React, Ember, and TypeScript. The Pluma design system exports React and Ember component packages. This prototype therefore uses React + TypeScript and a token layer designed to map to Pluma, without assuming an unverified Next.js runtime. See `outputs/customerio-engineering-handoff.md` for the replacement map and event contract.

This is an independent design exploration, not an official Customer.io product or validated commercial offer.
