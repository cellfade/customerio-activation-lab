import { describe, expect, it } from 'vitest'
import { defaultUpgradeState, getOfferEligibility, upgradeOfferReducer } from './model'

describe('upgrade offer model', () => {
  it('only exposes the offer to eligible active self-serve trials', () => {
    expect(getOfferEligibility({ daysRemaining: 14, hasSelectedPlan: false, isSelfServe: true }).eligible).toBe(true)
    expect(getOfferEligibility({ daysRemaining: 0, hasSelectedPlan: false, isSelfServe: true }).reason).toBe('expired')
    expect(getOfferEligibility({ daysRemaining: 14, hasSelectedPlan: true, isSelfServe: true }).reason).toBe('already-selected')
  })

  it('preserves a selected plan through submit and confirmation', () => {
    const selected = upgradeOfferReducer(defaultUpgradeState, { type: 'SELECT_PLAN', plan: 'premium' })
    const submitting = upgradeOfferReducer(selected, { type: 'SUBMIT' })
    const confirmed = upgradeOfferReducer(submitting, { type: 'CONFIRM', plan: 'premium' })
    expect(confirmed.persistedPlan).toBe('premium')
    expect(confirmed.view).toBe('confirmed')
  })

  it('makes a failed plan save recoverable', () => {
    const state = upgradeOfferReducer(defaultUpgradeState, { type: 'FAIL', message: 'Temporary error' })
    expect(state.view).toBe('error')
    expect(state.selectedPlan).toBe('essentials')
  })
})
