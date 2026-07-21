import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowUp,
  Broadcast,
  CaretDown,
  ChartBar,
  Check,
  CheckCircle,
  Clock,
  Code,
  Envelope,
  Gear,
  House,
  Lightning,
  MagnifyingGlass,
  PaperPlaneTilt,
  Question,
  Robot,
  Sparkle,
  Target,
  UserCircle,
  Users,
  X,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { getOnboardingSteps, completedStepCount, type OnboardingStepId } from './features/onboarding/model'
import {
  clearPersistedPlan,
  defaultUpgradeState,
  getOfferEligibility,
  persistPlan,
  plans,
  readPersistedPlan,
  upgradeOfferReducer,
  type OfferTrigger,
  type PlanId,
} from './features/upgrade/model'
import { track } from './lib/analytics'
import { useManagedDialog } from './lib/useManagedDialog'

type Journey = 'onboarding' | 'upgrade'

const navGroups: { label: string; items: { icon: Icon; label: string; active?: boolean }[] }[] = [
  { label: '', items: [{ icon: House, label: 'Home', active: true }, { icon: Sparkle, label: 'Agent' }] },
  { label: 'Review', items: [{ icon: Target, label: 'Goals' }, { icon: ChartBar, label: 'Reports' }] },
  { label: 'Send messages', items: [{ icon: Lightning, label: 'Automations' }, { icon: Broadcast, label: 'Broadcasts' }, { icon: PaperPlaneTilt, label: 'Transactional' }, { icon: Envelope, label: 'Message library' }] },
  { label: 'Manage audience', items: [{ icon: Users, label: 'Profiles' }, { icon: UserCircle, label: 'Segments' }] },
]

function Logo() {
  return <div className="logo" aria-label="Customer.io"><img className="customerio-mark" src="/customerio-mark.png" alt="" /><span>customer.io</span></div>
}

function Sidebar({ onUpgrade, selectedPlan }: { onUpgrade: () => void; selectedPlan?: PlanId }) {
  return (
    <aside className="sidebar">
      <button className="workspace-switcher" type="button" aria-label="Switch workspace">
        <Logo />
        <span className="workspace-name"><small>AGM Design LLC</small><strong>AGM Design LLC</strong></span>
        <CaretDown size={14} />
      </button>
      <nav aria-label="Primary navigation">
        {navGroups.map((group) => <div className="nav-group" key={group.label || 'primary'}>
          {group.label && <div className="nav-label">{group.label}</div>}
          {group.items.map(({ icon: ItemIcon, label, active }) => <button className={`nav-item ${active ? 'active' : ''}`} data-pluma-component="NavItem" data-test-nav-item={label.toLowerCase().replaceAll(' ', '-')} key={label} type="button"><ItemIcon size={18} weight={active ? 'fill' : 'regular'} /><span>{label}</span><em className="nav-hover-label">{label}</em></button>)}
        </div>)}
      </nav>
      <div className="sidebar-bottom">
        <div className={`upgrade-beam ${selectedPlan ? 'selected-plan' : ''}`}>
          <button className="upgrade-button" data-pluma-component="Button" data-pluma-variant="primary" data-test-upgrade-trigger onClick={onUpgrade} type="button" aria-describedby="upgrade-trigger-hint"><ArrowUp size={16} weight="bold" />{selectedPlan ? 'Plan selected' : 'Upgrade'}</button>
        </div>
        <span id="upgrade-trigger-hint">{selectedPlan ? '30-day trial unlocked' : '14 days left in trial'}</span>
        <div className="upgrade-tooltip" role="tooltip">See plans and unlock 16 more trial days</div>
      </div>
    </aside>
  )
}

function Topbar() {
  return <>
    <div className="test-banner">Email sending is in <strong>test mode.</strong> <button type="button">Add and verify a sending domain</button> to reach your audience.</div>
    <header className="topbar">
      <button className="search" type="button"><MagnifyingGlass size={17} /><span>Search automations, profiles, docs...</span><kbd>⌘ K</kbd></button>
      <div className="top-actions"><button type="button"><Question size={19} /> Need help?</button><span className="status-dot" aria-label="All systems operational" /><button className="icon-button" type="button" aria-label="Settings"><Gear size={20} /></button></div>
    </header>
  </>
}

function StatusBadge({ state }: { state: string }) {
  const labels: Record<string, string> = { active: 'Start here', ready: 'Ready', checking: 'Checking DNS', done: 'Complete', locked: 'Up next' }
  const StateIcon = state === 'checking' ? Clock : state === 'done' ? CheckCircle : null
  return <span className={`status-badge ${state}`}>{StateIcon && <StateIcon size={14} weight="bold" />}{labels[state]}</span>
}

function TaskRow({ task, onAction }: { task: ReturnType<typeof getOnboardingSteps>[number]; onAction: (id: OnboardingStepId) => void }) {
  const actionLabel: Record<OnboardingStepId, string> = { domain: 'Verify domain', profile: 'Add profile', message: 'Create message', send: 'Review and send' }
  const isDomainChecking = task.id === 'domain' && task.status === 'checking'
  return <li className={`task-row ${task.status}`} data-test-onboarding-step={task.id}>
    <div className="task-index" aria-hidden="true">{task.status === 'done' ? <Check size={17} weight="bold" /> : task.order}</div>
    <div className="task-copy"><div className="task-title-line"><h3>{task.title}</h3><StatusBadge state={task.status} /></div><p>{isDomainChecking ? 'We keep checking in the background. You can safely continue.' : task.meta}</p>{isDomainChecking && <div className="checking-line"><span className="spinner" aria-hidden="true" />Last checked just now. We will notify you when it is ready.</div>}</div>
    {(task.status === 'active' || task.status === 'ready') && <button className={task.status === 'active' ? 'primary-button' : 'secondary-button'} onClick={() => onAction(task.id)} type="button">{actionLabel[task.id]}<ArrowRight size={16} /></button>}
  </li>
}

function SetupDrawer({ type, onClose, onComplete }: { type: 'domain' | 'profile'; onClose: () => void; onComplete: () => void }) {
  const dialogRef = useManagedDialog(onClose)
  const isDomain = type === 'domain'
  return <div className="overlay overlay-right" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <aside ref={dialogRef} className="drawer" data-pluma-component="ManagedDrawer" role="dialog" aria-modal="true" aria-labelledby="setup-drawer-title">
      <div className="dialog-header"><div><span>{isDomain ? 'Sending setup' : 'Audience setup'}</span><h2 id="setup-drawer-title">{isDomain ? 'Verify your domain' : 'Add a test profile'}</h2></div><button className="icon-button" onClick={onClose} type="button" aria-label="Close"><X size={20} /></button></div>
      <p className="dialog-intro">{isDomain ? 'Use the domain your customers recognize. Customer.io will provide the DNS records after this step.' : 'Add yourself first. This keeps the first send low risk and makes the result easy to inspect.'}</p>
      {isDomain ? <><label htmlFor="domain">Sending domain</label><div className="input-row"><input id="domain" defaultValue="agmdesign.co" /><span className="valid-icon"><Check size={16} weight="bold" /></span></div><div className="info-panel"><Code size={20} /><div><strong>What happens next</strong><p>You’ll add three DNS records with your provider. Verification can run while you continue setup.</p></div></div></> : <><label htmlFor="email">Email address</label><input id="email" defaultValue="andrew@agmdesign.co" /><label htmlFor="firstName">First name</label><input id="firstName" defaultValue="Andrew" /><div className="info-panel"><Users size={20} /><div><strong>Only this profile will receive the test</strong><p>You can review the audience again before sending.</p></div></div></>}
      <div className="dialog-footer"><button className="secondary-button" onClick={onClose} type="button">Cancel</button><button className="primary-button" onClick={onComplete} type="button">{isDomain ? 'Show DNS records' : 'Add test profile'} <ArrowRight size={16} /></button></div>
    </aside>
  </div>
}

function PreflightModal({ onClose, onSend }: { onClose: () => void; onSend: () => void }) {
  const dialogRef = useManagedDialog(onClose)
  return <div className="overlay overlay-center" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section ref={dialogRef} className="preflight modal-card" role="dialog" aria-modal="true" aria-labelledby="preflight-title">
      <div className="dialog-header"><div><span>Final check</span><h2 id="preflight-title">Ready to send your test</h2></div><button className="icon-button" onClick={onClose} type="button" aria-label="Close"><X size={20} /></button></div>
      <div className="preflight-list"><div><span>Audience</span><strong>Andrew Miller</strong><small>1 test profile</small></div><div><span>From</span><strong>Andrew at AGM Design</strong><small>andrew@agmdesign.co</small></div><div><span>Message</span><strong>Welcome to AGM Design</strong><small>Automated workflow</small></div></div>
      <div className="safety-note"><CheckCircle size={21} weight="fill" /><span>This is a test send. No other profiles can receive it.</span></div>
      <div className="dialog-footer"><button className="secondary-button" onClick={onClose} type="button">Back</button><button className="primary-button" onClick={onSend} type="button">Send test <PaperPlaneTilt size={16} /></button></div>
    </section>
  </div>
}

function SuccessPanel({ onReplay, onShowOffer }: { onReplay: () => void; onShowOffer: () => void }) {
  return <main className="main-content"><section className="success-panel" aria-live="polite"><div className="success-icon"><Check size={26} weight="bold" /></div><div className="success-copy"><span>First launch complete</span><h1>Your test message is on its way.</h1><p>You proved the full loop: trusted sender, known audience, automated message, and observable delivery.</p></div><div className="success-actions"><button className="primary-button" onClick={onShowOffer} type="button">Choose a plan + extend trial</button><button className="text-button" onClick={onReplay} type="button">Replay onboarding</button></div><div className="routine-offer"><div className="routine-icon"><Robot size={22} /></div><div><span>Make launch health automatic</span><strong>Ask Agent to check deliverability every week</strong><p>Weekly Routines are included in your trial. Daily schedules and custom skills are available on Premium.</p></div><button className="secondary-button" type="button">Create weekly Routine</button></div></section></main>
}

function OnboardingWorkspace({ onActivation }: { onActivation: () => void }) {
  const [progress, setProgress] = useState(0)
  const [drawer, setDrawer] = useState<'domain' | 'profile' | null>(null)
  const [preflight, setPreflight] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const steps = useMemo(() => getOnboardingSteps(progress), [progress])

  const handleAction = (id: OnboardingStepId) => {
    track({ name: 'onboarding_step_started', step: id })
    if (id === 'domain' || id === 'profile') setDrawer(id)
    if (id === 'message') { setProgress(3); setAnnouncement('Welcome message created. Review your test send next.'); track({ name: 'onboarding_step_completed', step: id }) }
    if (id === 'send') setPreflight(true)
  }

  const completeDrawer = () => {
    if (!drawer) return
    track({ name: 'onboarding_step_completed', step: drawer })
    if (drawer === 'domain') { setProgress(1); setAnnouncement('Domain verification is running. Add a test profile while we check DNS.') }
    else { setProgress(2); setAnnouncement('Test profile added. Create your first automated message next.') }
    setDrawer(null)
  }

  if (progress === 4) return <SuccessPanel onReplay={() => setProgress(0)} onShowOffer={onActivation} />

  return <main className="main-content">
    <div className="page-heading"><div><span className="eyebrow">Personalized from signup</span><h1>Workspace setup</h1><p>A launch plan shaped around your selected goals: automated workflows and newsletters.</p></div><div className="completion"><strong>{completedStepCount(progress)} of 4</strong><span>steps complete</span></div></div>
    <section className="launch-plan" aria-labelledby="launch-title"><div className="plan-header"><div className="plan-icon"><PaperPlaneTilt size={23} /></div><div><h2 id="launch-title">Andrew, get your first automated workflow ready</h2><p>We saved what you told us during signup. Start with email, then prove the experience with one test profile.</p><div className="intent-chips"><span>Automated workflows</span><span>Newsletters</span><button type="button">Edit goals</button></div></div><button className="agent-link" type="button"><Sparkle size={16} /> Ask Agent about this plan</button></div><ol className="task-list">{steps.map((step) => <TaskRow key={step.id} task={step} onAction={handleAction} />)}</ol></section>
    <section className="parallel-note"><Lightning size={20} weight="fill" /><p><strong>Keep moving while DNS updates.</strong> Adding a test profile doesn’t depend on domain verification, so it becomes the recommended next action.</p></section>
    <div className="up-next"><h2>Explore after your first send</h2><div className="explore-row"><button type="button">Invite a teammate <ArrowRight size={15} /></button><button type="button">Connect product data <ArrowRight size={15} /></button><button type="button">Browse welcome templates <ArrowRight size={15} /></button></div></div>
    <div className="sr-only" aria-live="polite">{announcement}</div>
    {drawer && <SetupDrawer type={drawer} onClose={() => setDrawer(null)} onComplete={completeDrawer} />}
    {preflight && <PreflightModal onClose={() => setPreflight(false)} onSend={() => { setPreflight(false); setProgress(4); track({ name: 'onboarding_step_completed', step: 'send' }) }} />}
    <OnboardingDemoControls progress={progress} onProgress={setProgress} />
  </main>
}

function OnboardingDemoControls({ progress, onProgress }: { progress: number; onProgress: (step: number) => void }) {
  const labels = ['Start', 'DNS checking', 'Profile added', 'Ready to send', 'Success']
  return <div className="demo-state-controls" aria-label="Onboarding demo states"><span>Demo states</span>{labels.map((label, index) => <button className={progress === index ? 'selected' : ''} key={label} onClick={() => onProgress(index)} type="button">{label}</button>)}</div>
}

function UpgradeCoachmark({ trigger, onClose, onCompare }: { trigger: OfferTrigger; onClose: () => void; onCompare: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { closeRef.current?.focus(); track({ name: 'upgrade_offer_impression', trigger, daysRemaining: 14, variant: 'extend-to-30' }) }, [trigger])
  useEffect(() => { const handler = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); document.addEventListener('keydown', handler); return () => document.removeEventListener('keydown', handler) }, [onClose])
  return <section className="upgrade-coachmark" role="dialog" aria-modal="false" aria-labelledby="upgrade-offer-title" data-test-upgrade-coachmark>
    <div className="offer-topline"><span>Proposed trial experiment</span><button ref={closeRef} className="icon-button" onClick={onClose} type="button" aria-label="Dismiss upgrade offer"><X size={18} /></button></div>
    <h2 id="upgrade-offer-title">Choose your plan now. Keep testing free through Day 30.</h2><p className="offer-intro">Lock in the plan that fits while you finish setup. Billing starts after the extended trial.</p>
    <div className="offer-benefits"><div><CheckCircle size={18} weight="fill" /><span>16 extra days to validate your first campaigns</span></div><div><CheckCircle size={18} weight="fill" /><span>Keep your workspace, integrations, and trial data</span></div><div><CheckCircle size={18} weight="fill" /><span>No charge until the 30-day trial ends</span></div></div>
    <div className="offer-pricing"><div><span>Essentials</span><strong>From $100/month</strong></div><div><span>Premium</span><strong>From $1,000/month</strong></div></div>
    <button className="offer-cta" onClick={onCompare} type="button">Compare plans and extend trial <ArrowRight size={17} /></button><div className="offer-footer"><strong>14 days left to claim</strong><button onClick={onClose} type="button">Maybe later</button></div><small>Concept only. Offer eligibility and billing terms require validation.</small>
  </section>
}

function PlanModal({ selectedPlan, state, message, onClose, onSelect, onSubmit }: { selectedPlan: PlanId; state: string; message?: string; onClose: () => void; onSelect: (plan: PlanId) => void; onSubmit: () => void }) {
  const dialogRef = useManagedDialog(onClose)
  const isSubmitting = state === 'submitting'
  return <div className="overlay overlay-center" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section ref={dialogRef} className="plan-modal modal-card" data-pluma-component="ManagedModal" role="dialog" aria-modal="true" aria-labelledby="plan-modal-title" data-test-plan-modal>
      <div className="dialog-header"><div><span>30-day trial offer</span><h2 id="plan-modal-title">Choose a plan before your timer expires</h2></div><button className="icon-button" onClick={onClose} type="button" aria-label="Close plan comparison"><X size={20} /></button></div>
      <p className="plan-intro">Your paid subscription starts after Day 30. You can change or cancel before billing begins.</p>
      <div className="plan-options" data-pluma-component="OptionCardGroup" role="radiogroup" aria-label="Plan options">{Object.values(plans).map((plan) => <button className={`plan-option ${selectedPlan === plan.id ? 'selected' : ''}`} data-pluma-component="OptionCard" key={plan.id} onClick={() => onSelect(plan.id)} role="radio" aria-checked={selectedPlan === plan.id} type="button"><div><span>{plan.name}</span><strong>{plan.price}<small>/month</small></strong></div><ul>{plan.features.map((feature) => <li key={feature}><Check size={13} weight="bold" />{feature}</li>)}</ul><em>{plan.qualifier}</em></button>)}</div>
      <div className="trial-extension-row"><Clock size={21} weight="fill" /><div><strong>Your trial changes from 14 to 30 days</strong><span>Billing begins after the extended trial. No charge today.</span></div></div>
      {state === 'error' && <div className="error-banner" role="alert"><strong>We couldn’t save your plan.</strong><span>{message} Your trial is unchanged; try again.</span></div>}
      <div className="dialog-footer"><button className="secondary-button" onClick={onClose} type="button" disabled={isSubmitting}>Back</button><button className="primary-button" onClick={onSubmit} type="button" disabled={isSubmitting}>{isSubmitting ? <><span className="button-spinner" />Saving plan…</> : <>Choose {plans[selectedPlan].name} and extend trial <ArrowRight size={16} /></>}</button></div>
      <small className="concept-note">Prototype assumption. Final pricing, eligibility, cancellation, and billing language require legal and revenue review.</small>
    </section>
  </div>
}

function UpgradeWorkspace() {
  return <main className="main-content upgrade-context"><div className="page-heading"><div><span className="eyebrow">Conversion moment</span><h1>Workspace setup</h1><p>Trial value is framed in the context of activation—not as a disconnected pricing interruption.</p></div><div className="completion"><strong>14 days</strong><span>left in trial</span></div></div><section className="upgrade-rationale"><div className="rationale-main"><span>Why this moment</span><h2>Make the path to value visible before asking for commitment.</h2><p>The offer connects more evaluation time to work the customer is already doing: verifying a sender, connecting data, and sending a trustworthy first campaign.</p><div className="rationale-grid"><div><strong>Contextual</strong><span>Anchored to the persistent trial control.</span></div><div><strong>Specific</strong><span>16 additional days—not “upgrade for more.”</span></div><div><strong>Reversible</strong><span>No charge today; cancel before billing.</span></div></div></div><div className="experiment-card"><span>Experiment hypothesis</span><p>If eligible self-serve trials can select a plan without ending evaluation time, more activated workspaces will convert with fewer billing surprises.</p><dl><div><dt>Primary</dt><dd>Plan selection rate</dd></div><div><dt>Guardrail</dt><dd>Refund + support rate</dd></div><div><dt>Segment</dt><dd>Activated self-serve trials</dd></div></dl></div></section></main>
}

function DemoSwitcher({ journey, onJourney, failNext, onFailNext, onReset }: { journey: Journey; onJourney: (journey: Journey) => void; failNext: boolean; onFailNext: (value: boolean) => void; onReset: () => void }) {
  return <div className="prototype-switcher"><div><span>Interview prototype</span><strong>Activation + conversion</strong></div><div className="journey-tabs" role="tablist" aria-label="Prototype journeys"><button role="tab" aria-selected={journey === 'onboarding'} className={journey === 'onboarding' ? 'selected' : ''} onClick={() => onJourney('onboarding')} type="button">1. Personalized onboarding</button><button role="tab" aria-selected={journey === 'upgrade'} className={journey === 'upgrade' ? 'selected' : ''} onClick={() => onJourney('upgrade')} type="button">2. Trial value offer</button></div><div className="prototype-tools"><label><input type="checkbox" checked={failNext} onChange={(event) => onFailNext(event.target.checked)} /> Fail next save</label><button onClick={onReset} type="button">Reset prototype</button></div></div>
}

export default function App() {
  const [journey, setJourney] = useState<Journey>('onboarding')
  const persistedPlan = useMemo(() => readPersistedPlan(), [])
  const eligibility = getOfferEligibility({ daysRemaining: 14, hasSelectedPlan: Boolean(persistedPlan), isSelfServe: true })
  const [offer, dispatch] = useReducer(upgradeOfferReducer, { ...defaultUpgradeState, view: persistedPlan ? 'confirmed' : 'closed', persistedPlan })
  const [failNext, setFailNext] = useState(false)
  const [toastVisible, setToastVisible] = useState(Boolean(persistedPlan))

  const changeJourney = (next: Journey) => { setJourney(next); track({ name: 'prototype_journey_changed', journey: next }); if (next === 'upgrade' && eligibility.eligible && !offer.persistedPlan) dispatch({ type: 'OPEN', trigger: 'first-session' }) }
  const openOffer = (trigger: OfferTrigger) => { setJourney('upgrade'); dispatch({ type: 'OPEN', trigger }) }
  const dismissOffer = useCallback(() => { track({ name: 'upgrade_offer_dismissed', trigger: offer.trigger }); dispatch({ type: 'DISMISS' }) }, [offer.trigger])
  const compare = () => { track({ name: 'upgrade_plan_compare_opened', trigger: offer.trigger }); dispatch({ type: 'COMPARE' }) }
  const submit = async () => {
    const plan = offer.selectedPlan
    dispatch({ type: 'SUBMIT' })
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    if (failNext) { setFailNext(false); dispatch({ type: 'FAIL', message: 'The billing service returned a temporary error.' }); track({ name: 'upgrade_plan_selection_failed', plan, trigger: offer.trigger }); return }
    persistPlan(plan); dispatch({ type: 'CONFIRM', plan }); setToastVisible(true); track({ name: 'upgrade_plan_selected', plan, trigger: offer.trigger })
  }
  const reset = () => { clearPersistedPlan(); dispatch({ type: 'RESET' }); dispatch({ type: 'DISMISS' }); setToastVisible(false); setFailNext(false); setJourney('onboarding') }

  return <div className="app-shell">
    <Sidebar onUpgrade={() => openOffer('sidebar')} selectedPlan={offer.persistedPlan} />
    <div className="app-stage"><Topbar />{journey === 'onboarding' ? <OnboardingWorkspace onActivation={() => openOffer('activation-milestone')} /> : <UpgradeWorkspace />}</div>
    <DemoSwitcher journey={journey} onJourney={changeJourney} failNext={failNext} onFailNext={setFailNext} onReset={reset} />
    {offer.view === 'coachmark' && <UpgradeCoachmark trigger={offer.trigger} onClose={dismissOffer} onCompare={compare} />}
    {(offer.view === 'plans' || offer.view === 'submitting' || offer.view === 'error') && <PlanModal selectedPlan={offer.selectedPlan} state={offer.view} message={offer.message} onClose={() => dispatch({ type: 'DISMISS' })} onSelect={(plan) => dispatch({ type: 'SELECT_PLAN', plan })} onSubmit={submit} />}
    {toastVisible && offer.persistedPlan && <div className="plan-toast" role="status"><CheckCircle size={18} weight="fill" /><span><strong>{plans[offer.persistedPlan].name} selected.</strong> Your trial now runs for 30 days.</span><button aria-label="Dismiss confirmation" onClick={() => setToastVisible(false)} type="button"><X size={15} /></button></div>}
  </div>
}
