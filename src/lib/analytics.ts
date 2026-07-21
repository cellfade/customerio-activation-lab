import type { OfferTrigger, PlanId } from '../features/upgrade/model'

export type PrototypeEvent =
  | { name: 'prototype_journey_changed'; journey: 'onboarding' | 'upgrade' }
  | { name: 'onboarding_step_started'; step: string }
  | { name: 'onboarding_step_completed'; step: string }
  | { name: 'upgrade_offer_impression'; trigger: OfferTrigger; daysRemaining: number; variant: 'extend-to-30' }
  | { name: 'upgrade_offer_dismissed'; trigger: OfferTrigger }
  | { name: 'upgrade_plan_compare_opened'; trigger: OfferTrigger }
  | { name: 'upgrade_plan_selected'; plan: PlanId; trigger: OfferTrigger }
  | { name: 'upgrade_plan_selection_failed'; plan: PlanId; trigger: OfferTrigger }

export function track(event: PrototypeEvent): void {
  window.dispatchEvent(new CustomEvent('cio:prototype-event', { detail: event }))
  if (import.meta.env.DEV) console.info('[prototype analytics]', event)
}
