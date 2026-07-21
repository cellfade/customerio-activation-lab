export type PlanId = 'essentials' | 'premium'
export type OfferTrigger = 'first-session' | 'activation-milestone' | 'sidebar'
export type OfferView = 'closed' | 'coachmark' | 'plans' | 'submitting' | 'confirmed' | 'error'

export type UpgradeOfferState = {
  view: OfferView
  selectedPlan: PlanId
  trigger: OfferTrigger
  persistedPlan?: PlanId
  message?: string
}

export type UpgradeOfferAction =
  | { type: 'OPEN'; trigger: OfferTrigger }
  | { type: 'DISMISS' }
  | { type: 'COMPARE' }
  | { type: 'SELECT_PLAN'; plan: PlanId }
  | { type: 'SUBMIT' }
  | { type: 'CONFIRM'; plan: PlanId }
  | { type: 'FAIL'; message: string }
  | { type: 'RESET' }

export const defaultUpgradeState: UpgradeOfferState = {
  view: 'coachmark',
  selectedPlan: 'essentials',
  trigger: 'first-session',
}

export function upgradeOfferReducer(state: UpgradeOfferState, action: UpgradeOfferAction): UpgradeOfferState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, view: 'coachmark', trigger: action.trigger, message: undefined }
    case 'DISMISS':
      return { ...state, view: 'closed' }
    case 'COMPARE':
      return { ...state, view: 'plans' }
    case 'SELECT_PLAN':
      return { ...state, selectedPlan: action.plan }
    case 'SUBMIT':
      return { ...state, view: 'submitting', message: undefined }
    case 'CONFIRM':
      return { ...state, view: 'confirmed', selectedPlan: action.plan, persistedPlan: action.plan }
    case 'FAIL':
      return { ...state, view: 'error', message: action.message }
    case 'RESET':
      return defaultUpgradeState
  }
}

export type OfferEligibility = {
  eligible: boolean
  daysRemaining: number
  extendedTrialDays: number
  reason: 'eligible' | 'expired' | 'already-selected' | 'not-self-serve'
}

export function getOfferEligibility({
  daysRemaining,
  hasSelectedPlan,
  isSelfServe,
}: {
  daysRemaining: number
  hasSelectedPlan: boolean
  isSelfServe: boolean
}): OfferEligibility {
  if (hasSelectedPlan) return { eligible: false, daysRemaining, extendedTrialDays: 30, reason: 'already-selected' }
  if (!isSelfServe) return { eligible: false, daysRemaining, extendedTrialDays: 30, reason: 'not-self-serve' }
  if (daysRemaining <= 0) return { eligible: false, daysRemaining, extendedTrialDays: 30, reason: 'expired' }
  return { eligible: true, daysRemaining, extendedTrialDays: 30, reason: 'eligible' }
}

export const plans = {
  essentials: {
    id: 'essentials' as const,
    name: 'Essentials',
    price: '$100',
    qualifier: 'Best place to start',
    features: ['5,000 profiles', '1 million emails / month', '2 object types'],
  },
  premium: {
    id: 'premium' as const,
    name: 'Premium',
    price: '$1,000',
    qualifier: 'For growing teams',
    features: ['Custom profile volume', 'Custom email volume', 'Premium integrations'],
  },
}

const STORAGE_KEY = 'cio-upgrade-offer:v1'

export function readPersistedPlan(): PlanId | undefined {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    if (!value) return undefined
    const parsed = JSON.parse(value) as { plan?: PlanId }
    return parsed.plan === 'essentials' || parsed.plan === 'premium' ? parsed.plan : undefined
  } catch {
    return undefined
  }
}

export function persistPlan(plan: PlanId): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan, selectedAt: new Date().toISOString() }))
}

export function clearPersistedPlan(): void {
  window.localStorage.removeItem(STORAGE_KEY)
}
