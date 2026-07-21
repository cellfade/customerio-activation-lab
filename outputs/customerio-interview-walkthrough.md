# Five-minute interview walkthrough

## 0:00 — Frame the problem

“I looked at activation and monetization as one journey. The current product gives users a broad setup checklist and a persistent Upgrade control, but the relationship between progress, value, and commitment can be clearer.”

## 0:45 — Show personalized onboarding

Open **1. Personalized onboarding**.

“The signup choices aren’t discarded. Automated workflows and newsletters shape the plan and its language. The first target is not ‘configure the whole platform’; it is a safe, observable first send.”

Click **Verify domain**, then **Show DNS records**.

“DNS is inherently asynchronous. Instead of leaving the customer in a waiting state, the plan promotes Add profile and explains why it is safe to continue. This is the key micro-interaction: the sequence responds to system state.”

Use the demo states to show **Profile added**, **Ready to send**, and **Success**.

## 2:15 — Show the value callout

Switch to **2. Trial value offer**.

“I kept the existing sidebar affordance and made its importance legible with a restrained border beam. On hover it explains the value before click. The coachmark is specific: 16 more evaluation days, no charge today, and no loss of workspace data.”

Click **Compare plans and extend trial**.

“The modal makes the commitment and billing boundary explicit. The customer selects a plan now; paid service begins after the proposed 30-day trial. This would need revenue, billing, and legal validation, so I label the concept as an experiment rather than presenting invented policy as fact.”

Optionally toggle **Fail next save** before submitting.

“I included a recoverable failure state because a design artifact for engineering should define behavior between the polished frames.”

## 4:00 — Close with product and engineering judgment

“The implementation uses React and TypeScript because those are confirmed in Customer.io’s public engineering material. I did not force Next.js. Pluma supports React and Ember, so the local components are explicit replacement seams for NavItem, managed Drawer, Modal, Form, and OptionCard.”

“I would measure plan-selection rate, but protect the experience with refund, cancellation, support-contact, and offer-dismissal guardrails. I’d first validate whether activated users understand the offer and perceive it as helpful rather than coercive.”
