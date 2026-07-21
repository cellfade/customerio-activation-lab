# Prototype plan: First Launch

## Design hypothesis

If Customer.io turns the user's signup intent and workspace readiness into a personalized, resumable launch plan, more trial users will reach a safe first test send with less confusion. If plan differences are introduced at the moment a user needs a capability, upgrade exploration should become more qualified without distracting from activation.

## Chosen scenario

The user selected **Newsletters** and **Automated workflows** during signup. They arrive in a new workspace with no profiles and email still in test mode. The prototype helps them launch a welcome automation to themselves as a test profile.

## Four prototype states

### 1. Personalized Home

- Heading: “Launch your first automated newsletter”
- One primary task: authenticate the sending domain
- A compact plan shows four dependent milestones: sending domain, test profile, draft automation, test send
- The rest of the product remains accessible; this is guidance, not a lockout
- “Why these steps?” explains that the plan comes from the use cases selected during signup

### 2. Domain setup drawer

- Opens through a Pluma-style managed drawer, preserving Home context
- Shows automatic and manual setup paths
- Explains what changes in DNS, why it is safe, who may need to help, and the expected time
- “Ask Agent to explain” passes the current task and records into the existing Agent context
- The Agent cannot access the external DNS provider; the UI says this plainly

### 3. Verification pending

- The primary button transitions into a compact three-record status check
- Records move from Checking to Verified independently
- A small progress change acknowledges momentum without celebratory excess
- Because verification can take time, the next useful action appears immediately: “Add yourself as a test profile”
- A persistent “Domain verification running” item makes the setup safe to leave and resume

### 4. First test send and earned upgrade

- Completing the test send changes the plan from setup to operating mode
- The product offers “Monitor launch health weekly” as an included Agent Routine
- A secondary comparison reveals that daily Routines and custom skills are Premium capabilities
- Upgrade copy explains the operational outcome, not merely the feature name

## Hero micro-interaction

The signature moment is the **pending-state handoff**:

1. The user starts domain verification.
2. The task row compresses into a persistent status item with an animated but reduced-motion-safe checking indicator.
3. The progress meter advances only for work actually completed; it does not falsely mark the domain verified.
4. The next unblocked task slides into primary position: add a test profile.
5. When verification completes, a quiet inline confirmation appears wherever the user is, with “Continue launch” returning them to the exact next step.

This small interaction demonstrates expert handling of latency, truthfulness, continuity, and parallel work. It also mirrors Customer.io's own product promise: respond to behavior at the right moment.

## Interaction and accessibility requirements

- Full keyboard operation and visible focus
- Drawer title announced and focus returned to its trigger on close
- Status changes announced without stealing focus
- No information conveyed by color alone
- Reduced-motion alternative for progress and state transitions
- Dismiss, snooze, and resume behavior for guidance
- No modal chain and no forced tour
- Agent actions labeled as explain, prepare, draft, or apply
- Any action affecting live data requires explicit confirmation

## What we will measure

- Time to first test send
- Completion and resume rates for each milestone
- Domain-setup abandonment and recovery
- Use of parallel tasks while verification is pending
- Agent-assist acceptance and successful completion
- Upgrade exploration after activation versus before activation

## Interview positioning

Present this as a hypothesis based on a trial walkthrough, official documentation, public product positioning, and directional review evidence. Explicitly name the missing inputs: behavioral analytics, support-ticket volume, technical constraints, and user interviews. Recommend validating the dependency model and the value of personalization before proposing production work.

