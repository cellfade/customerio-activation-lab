# Customer.io upgrade concept: Earn 30 days

## The product bet

Trial users may notice the persistent Upgrade button without understanding why they should act before their trial expires. The concept turns that low-information CTA into a specific, time-bound exchange:

> Choose a paid plan before the 14-day timer expires. Keep full trial access through Day 30. Billing starts after the extended trial.

This is a proposed experiment, not a claim about Customer.io's current policy.

## Why this is a useful interview prototype

It demonstrates more than visual polish:

- Monetization judgment: the offer reduces risk instead of relying only on urgency.
- Product ethics: billing timing and the hypothetical nature of the incentive are explicit.
- Interaction craft: the Upgrade CTA gets a restrained border-beam signal, a dismissible coachmark, plan comparison, confirmation, and a reduced-motion fallback.
- Systems thinking: the experience connects the sidebar timer, plan selection, trial state, billing date, and confirmation status.
- Experiment design: the concept can be measured against the current persistent CTA.

## Recommended experience

### Trigger

Do not show the coachmark immediately after account creation. Trigger it after an activation signal, such as:

- a sending domain verification request;
- a test profile added;
- a first draft created; or
- a return visit with fewer than seven trial days remaining.

The prototype opens the coachmark automatically so the interview path is easy to demonstrate.

### Compact state

The current green Upgrade button remains recognizable. A narrow animated border beam adds salience without turning the entire sidebar into an advertisement.

### Coachmark

The coachmark answers four questions in one glance:

1. What do I get? Sixteen additional trial days.
2. Why act now? The offer is available while the original timer is active.
3. What will it cost? Essentials and Premium entry prices are visible.
4. When will I be charged? After the extended trial ends.

### Plan comparison

The second step keeps the choice narrow: Essentials or Premium. It repeats the billing commitment and gives the user a clear way back.

### Confirmation

After selection, the sidebar changes from Upgrade to Plan selected, the timer changes to 30-day trial unlocked, and a status message confirms the new state.

## Guardrails

- Do not create false scarcity. Eligibility and expiration must be real.
- Do not charge immediately if the interface promises an extended free trial.
- Do not auto-select a plan based on hidden assumptions.
- Do not show the coachmark repeatedly after dismissal.
- Preserve Escape dismissal, keyboard access, visible focus, and reduced-motion behavior.
- Confirm cancellation, downgrade, refund, and billing terms with Legal and Finance before launch.

## Experiment design

### Hypothesis

If qualified trial users can secure more evaluation time by choosing a plan early, then more users will compare plans and select one because the decision reduces evaluation risk instead of ending the trial.

### Primary metrics

- Upgrade CTA to coachmark-open rate
- Coachmark to plan-comparison rate
- Plan-comparison to plan-selection rate
- Trial-to-paid conversion
- Time from activation signal to plan selection

### Guardrail metrics

- Coachmark dismissal rate
- Repeated dismissal or rage-click behavior
- Plan cancellation before billing
- Refund and billing-support contacts
- Activation completion for exposed versus control users
- Downstream retention by selected plan

### Suggested test cells

- Control: current persistent Upgrade CTA
- Variant A: border beam plus benefit coachmark
- Variant B: benefit coachmark without motion
- Variant C: coachmark triggered after a meaningful activation event

## Interview talk track

1. "I noticed the Upgrade action is visually prominent but explains very little before the pricing page."
2. "I wanted to test a value exchange, not simply make the button louder."
3. "The offer lets a user commit to a plan without losing evaluation time."
4. "The border beam earns attention, while the coachmark carries the value, pricing, and billing truth."
5. "I would trigger it after an activation signal and measure conversion alongside trust guardrails."
6. "The 30-day offer is a product hypothesis. I would validate economics, eligibility, and policy before shipping it."

## Prototype path

1. Observe the moving border beam around Upgrade.
2. Open or inspect the coachmark.
3. Choose Compare plans and extend trial.
4. Switch between Essentials and Premium.
5. Select a plan.
6. Observe the updated sidebar state and confirmation message.

