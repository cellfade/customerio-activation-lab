import { describe, expect, it } from 'vitest'
import { completedStepCount, getOnboardingSteps } from './model'

describe('personalized onboarding model', () => {
  it('promotes profile setup while domain verification is asynchronous', () => {
    const steps = getOnboardingSteps(1)
    expect(steps[0].id).toBe('profile')
    expect(steps.find((step) => step.id === 'domain')?.status).toBe('checking')
    expect(steps[0].status).toBe('active')
  })

  it('counts only completed work', () => {
    expect(completedStepCount(1)).toBe(0)
    expect(completedStepCount(3)).toBe(2)
    expect(completedStepCount(4)).toBe(4)
  })
})
