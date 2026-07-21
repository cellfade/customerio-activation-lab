export type OnboardingStepId = 'domain' | 'profile' | 'message' | 'send'
export type OnboardingStatus = 'active' | 'ready' | 'checking' | 'done' | 'locked'

export type OnboardingStep = {
  id: OnboardingStepId
  order: number
  title: string
  meta: string
  status: OnboardingStatus
}

const baseSteps: OnboardingStep[] = [
  { id: 'domain', order: 1, title: 'Verify your sending domain', meta: 'About 10 minutes, plus DNS processing', status: 'active' },
  { id: 'profile', order: 2, title: 'Add a test profile', meta: 'Use yourself or a teammate', status: 'ready' },
  { id: 'message', order: 3, title: 'Create your first automated message', meta: 'Start with a welcome template', status: 'locked' },
  { id: 'send', order: 4, title: 'Send a trustworthy test', meta: 'Review audience, sender, and content', status: 'locked' },
]

export function getOnboardingSteps(progress: number): OnboardingStep[] {
  return baseSteps.map((step) => {
    if (progress === 0) return step
    if (progress === 1) {
      if (step.id === 'domain') return { ...step, status: 'checking' }
      if (step.id === 'profile') return { ...step, status: 'active' }
    }
    if (progress === 2) {
      if (step.id === 'domain') return { ...step, status: 'checking' }
      if (step.id === 'profile') return { ...step, status: 'done' }
      if (step.id === 'message') return { ...step, status: 'active' }
    }
    if (progress === 3) {
      if (step.id === 'domain' || step.id === 'profile' || step.id === 'message') return { ...step, status: 'done' }
      if (step.id === 'send') return { ...step, status: 'active' }
    }
    return step
  }).sort((a, b) => progress === 1 ? (a.id === 'profile' ? -1 : b.id === 'profile' ? 1 : 0) : a.order - b.order)
}

export function completedStepCount(progress: number): number {
  if (progress < 2) return 0
  if (progress === 2) return 1
  if (progress === 3) return 2
  return 4
}
