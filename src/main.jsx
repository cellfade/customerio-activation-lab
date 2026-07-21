import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
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
import './styles.css'

const navGroups = [
  {
    label: '',
    items: [
      { icon: House, label: 'Home', active: true },
      { icon: Sparkle, label: 'Agent' },
    ],
  },
  {
    label: 'Review',
    items: [
      { icon: Target, label: 'Goals' },
      { icon: ChartBar, label: 'Reports' },
    ],
  },
  {
    label: 'Send messages',
    items: [
      { icon: Lightning, label: 'Automations' },
      { icon: Broadcast, label: 'Broadcasts' },
      { icon: PaperPlaneTilt, label: 'Transactional' },
      { icon: Envelope, label: 'Message library' },
    ],
  },
  {
    label: 'Manage audience',
    items: [
      { icon: Users, label: 'Profiles' },
      { icon: UserCircle, label: 'Segments' },
    ],
  },
]

const initialTasks = [
  { id: 'domain', order: 1, title: 'Verify your sending domain', meta: 'About 10 minutes, plus DNS processing', status: 'active' },
  { id: 'profile', order: 2, title: 'Add a test profile', meta: 'Use yourself or a teammate', status: 'ready' },
  { id: 'message', order: 3, title: 'Create your first automated message', meta: 'Start with a welcome template', status: 'locked' },
  { id: 'send', order: 4, title: 'Send a trustworthy test', meta: 'Review audience, sender, and content', status: 'locked' },
]

function Logo() {
  return (
    <div className="logo" aria-label="Customer.io">
      <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>customer.io</span>
    </div>
  )
}

function UpgradeCoachmark({ onClose, onCompare }) {
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <section className="upgrade-coachmark" role="dialog" aria-modal="false" aria-labelledby="upgrade-offer-title">
      <div className="offer-topline"><span>Proposed trial experiment</span><button ref={closeRef} className="icon-button" onClick={onClose} type="button" aria-label="Dismiss upgrade offer"><X size={18} /></button></div>
      <h2 id="upgrade-offer-title">Choose your plan now. Keep testing free through Day 30.</h2>
      <p className="offer-intro">Lock in the plan that fits while you finish setup. Billing starts after the extended trial.</p>
      <div className="offer-benefits">
        <div><CheckCircle size={18} weight="fill" /><span>16 extra days to validate your first campaigns</span></div>
        <div><CheckCircle size={18} weight="fill" /><span>Keep your workspace, integrations, and trial data</span></div>
        <div><CheckCircle size={18} weight="fill" /><span>No charge until the 30-day trial ends</span></div>
      </div>
      <div className="offer-pricing"><div><span>Essentials</span><strong>From $100/month</strong></div><div><span>Premium</span><strong>From $1,000/month</strong></div></div>
      <button className="offer-cta" onClick={onCompare} type="button">Compare plans and extend trial <ArrowRight size={17} /></button>
      <div className="offer-footer"><strong>14 days left to claim</strong><button onClick={onClose} type="button">Maybe later</button></div>
      <small>Concept only. Offer eligibility and billing terms would require validation.</small>
    </section>
  )
}

function Sidebar({ onUpgrade, planSelected }) {
  return (
    <aside className="sidebar">
      <div className="workspace">
        <Logo />
        <div className="workspace-name"><span>AGM Design LLC</span><strong>AGM Design LLC</strong></div>
        <CaretDown size={14} />
      </div>
      <nav aria-label="Primary navigation">
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label || 'primary'}>
            {group.label && <div className="nav-label">{group.label}</div>}
            {group.items.map(({ icon: Icon, label, active }) => (
              <button className={`nav-item ${active ? 'active' : ''}`} key={label} type="button">
                <Icon size={18} weight={active ? 'fill' : 'regular'} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className={`upgrade-beam ${planSelected ? 'selected-plan' : ''}`}>
          <button className="upgrade-button" onClick={onUpgrade} type="button"><ArrowUp size={16} weight="bold" />{planSelected ? 'Plan selected' : 'Upgrade'}</button>
        </div>
        <span>{planSelected ? '30-day trial unlocked' : '14 days left in trial'}</span>
      </div>
    </aside>
  )
}

function PlanModal({ onClose, onConfirm }) {
  const [plan, setPlan] = useState('essentials')
  const closeRef = useRef(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-scrim plan-scrim">
      <section className="plan-modal" role="dialog" aria-modal="true" aria-labelledby="plan-modal-title">
        <div className="drawer-header"><div><span>30-day trial offer</span><h2 id="plan-modal-title">Choose a plan before your timer expires</h2></div><button ref={closeRef} className="icon-button" onClick={onClose} type="button" aria-label="Close plan comparison"><X size={20} /></button></div>
        <p className="plan-intro">Your paid subscription starts after Day 30. You can change or cancel the plan before billing begins.</p>
        <div className="plan-options" role="radiogroup" aria-label="Plan options">
          <button className={plan === 'essentials' ? 'plan-option selected' : 'plan-option'} onClick={() => setPlan('essentials')} role="radio" aria-checked={plan === 'essentials'} type="button">
            <div><span>Essentials</span><strong>$100<small>/month</small></strong></div><p>5,000 profiles<br />1 million emails per month<br />2 object types</p><em>Best place to start</em>
          </button>
          <button className={plan === 'premium' ? 'plan-option selected' : 'plan-option'} onClick={() => setPlan('premium')} role="radio" aria-checked={plan === 'premium'} type="button">
            <div><span>Premium</span><strong>$1,000<small>/month</small></strong></div><p>Custom profile volume<br />Custom email volume<br />Premium integrations</p><em>For growing teams</em>
          </button>
        </div>
        <div className="trial-extension-row"><Clock size={21} weight="fill" /><div><strong>Your trial changes from 14 to 30 days</strong><span>Billing begins after the extended trial. No charge today.</span></div></div>
        <div className="drawer-footer"><button className="secondary-button" onClick={onClose} type="button">Back</button><button className="primary-button" onClick={() => onConfirm(plan)} type="button">Choose {plan === 'essentials' ? 'Essentials' : 'Premium'} and extend trial <ArrowRight size={16} /></button></div>
        <small className="concept-note">Prototype assumption. Final pricing, eligibility, cancellation, and billing language require review.</small>
      </section>
    </div>
  )
}

function Topbar() {
  return (
    <>
      <div className="test-banner">Email sending is in <strong>test mode.</strong> <button type="button">Add and verify a sending domain</button> to reach your audience.</div>
      <header className="topbar">
        <div className="search"><MagnifyingGlass size={17} /><span>Search automations, profiles, docs...</span><kbd>⌘ K</kbd></div>
        <div className="top-actions"><button type="button"><Question size={19} /> Need help?</button><span className="status-dot" aria-label="All systems operational" /><button className="icon-button" type="button" aria-label="Settings"><Gear size={20} /></button></div>
      </header>
    </>
  )
}

function StatusBadge({ state }) {
  const labels = { active: 'Start here', ready: 'Ready', checking: 'Checking DNS', done: 'Complete', locked: 'Up next' }
  const Icon = state === 'checking' ? Clock : state === 'done' ? CheckCircle : null
  return <span className={`status-badge ${state}`}>{Icon && <Icon size={14} weight="bold" />}{labels[state]}</span>
}

function TaskRow({ task, onAction }) {
  const isDomainChecking = task.id === 'domain' && task.status === 'checking'
  const actionLabel = task.id === 'domain' ? 'Verify domain' : task.id === 'profile' ? 'Add profile' : task.id === 'message' ? 'Create message' : 'Review and send'
  return (
    <li className={`task-row ${task.status}`}>
      <div className="task-index" aria-hidden="true">{task.status === 'done' ? <Check size={17} weight="bold" /> : task.order}</div>
      <div className="task-copy">
        <div className="task-title-line"><h3>{task.title}</h3><StatusBadge state={task.status} /></div>
        <p>{isDomainChecking ? 'We will keep checking in the background. You can safely continue.' : task.meta}</p>
        {isDomainChecking && <div className="checking-line"><span className="spinner" aria-hidden="true" />Last checked just now. We will notify you when it is ready.</div>}
      </div>
      {(task.status === 'active' || task.status === 'ready') && (
        <button className={task.status === 'active' ? 'primary-button' : 'secondary-button'} onClick={() => onAction(task.id)} type="button">
          {actionLabel}<ArrowRight size={16} />
        </button>
      )}
    </li>
  )
}

function Drawer({ type, onClose, onComplete }) {
  const closeRef = useRef(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const domain = type === 'domain'
  return (
    <div className="drawer-scrim" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className="drawer-header"><div><span>{domain ? 'Sending setup' : 'Audience setup'}</span><h2 id="drawer-title">{domain ? 'Verify your domain' : 'Add a test profile'}</h2></div><button ref={closeRef} className="icon-button" onClick={onClose} type="button" aria-label="Close"><X size={20} /></button></div>
        {domain ? (
          <>
            <p className="drawer-intro">Use the domain your customers recognize. Customer.io will provide the DNS records after this step.</p>
            <label className="field-label" htmlFor="domain">Sending domain</label>
            <div className="input-row"><input id="domain" defaultValue="agmdesign.co" autoFocus /><span className="valid-icon"><Check size={16} weight="bold" /></span></div>
            <div className="info-panel"><Code size={20} /><div><strong>What happens next</strong><p>You will add three DNS records with your provider. Verification can take a few minutes or longer.</p></div></div>
            <div className="drawer-footer"><button className="secondary-button" onClick={onClose} type="button">Cancel</button><button className="primary-button" onClick={onComplete} type="button">Show DNS records <ArrowRight size={16} /></button></div>
          </>
        ) : (
          <>
            <p className="drawer-intro">Add yourself first. This keeps the first send low risk and makes the result easy to inspect.</p>
            <label className="field-label" htmlFor="email">Email address</label>
            <input id="email" defaultValue="andrew@agmdesign.co" autoFocus />
            <label className="field-label" htmlFor="firstName">First name</label>
            <input id="firstName" defaultValue="Andrew" />
            <div className="info-panel"><Users size={20} /><div><strong>Only this profile will receive the test</strong><p>You can review the audience again before sending.</p></div></div>
            <div className="drawer-footer"><button className="secondary-button" onClick={onClose} type="button">Cancel</button><button className="primary-button" onClick={onComplete} type="button">Add test profile <ArrowRight size={16} /></button></div>
          </>
        )}
      </aside>
    </div>
  )
}

function Preflight({ onClose, onSend }) {
  const closeRef = useRef(null)
  useEffect(() => { closeRef.current?.focus() }, [])
  return (
    <div className="modal-scrim">
      <section className="preflight" role="dialog" aria-modal="true" aria-labelledby="preflight-title">
        <div className="drawer-header"><div><span>Final check</span><h2 id="preflight-title">Ready to send your test</h2></div><button ref={closeRef} className="icon-button" onClick={onClose} type="button" aria-label="Close"><X size={20} /></button></div>
        <div className="preflight-list">
          <div><span>Audience</span><strong>Andrew Miller</strong><small>1 test profile</small></div>
          <div><span>From</span><strong>Andrew at AGM Design</strong><small>andrew@agmdesign.co</small></div>
          <div><span>Message</span><strong>Welcome to AGM Design</strong><small>Automated workflow</small></div>
        </div>
        <div className="safety-note"><CheckCircle size={21} weight="fill" /><span>This is a test send. No other profiles can receive it.</span></div>
        <div className="drawer-footer"><button className="secondary-button" onClick={onClose} type="button">Back</button><button className="primary-button" onClick={onSend} type="button">Send test <PaperPlaneTilt size={16} /></button></div>
      </section>
    </div>
  )
}

function SuccessPanel({ onReset }) {
  return (
    <section className="success-panel" aria-live="polite">
      <div className="success-icon"><Check size={26} weight="bold" /></div>
      <div className="success-copy"><span>First launch complete</span><h1>Your test message is on its way.</h1><p>You proved the full loop: trusted sender, known audience, automated message, and observable delivery.</p></div>
      <div className="success-actions"><button className="secondary-button" type="button">View delivery</button><button className="text-button" onClick={onReset} type="button">Replay prototype</button></div>
      <div className="routine-offer">
        <div className="routine-icon"><Robot size={22} /></div>
        <div><span>Make launch health automatic</span><strong>Ask Agent to check deliverability every week</strong><p>Weekly Routines are included in your trial. Daily schedules and custom skills are available on Premium.</p></div>
        <button className="primary-button" type="button">Create weekly Routine</button>
      </div>
    </section>
  )
}

function Workspace({ step, setStep }) {
  const [drawer, setDrawer] = useState(null)
  const [preflight, setPreflight] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  const tasks = initialTasks.map((task) => {
    if (step === 0) return task
    if (step === 1) {
      if (task.id === 'domain') return { ...task, status: 'checking' }
      if (task.id === 'profile') return { ...task, status: 'active' }
    }
    if (step === 2) {
      if (task.id === 'domain') return { ...task, status: 'checking' }
      if (task.id === 'profile') return { ...task, status: 'done' }
      if (task.id === 'message') return { ...task, status: 'active' }
    }
    if (step === 3) {
      if (task.id === 'domain' || task.id === 'profile' || task.id === 'message') return { ...task, status: 'done' }
      if (task.id === 'send') return { ...task, status: 'active' }
    }
    return task
  }).sort((a, b) => {
    if (step === 1) return a.id === 'profile' ? -1 : b.id === 'profile' ? 1 : 0
    return 0
  })

  const handleAction = (id) => {
    if (id === 'domain') setDrawer('domain')
    if (id === 'profile') setDrawer('profile')
    if (id === 'message') { setStep(3); setAnnouncement('Welcome message created. Review your test send next.') }
    if (id === 'send') setPreflight(true)
  }

  const completeDrawer = () => {
    if (drawer === 'domain') {
      setStep(1)
      setAnnouncement('Domain verification is running. Add a test profile while we check DNS.')
    } else {
      setStep(2)
      setAnnouncement('Test profile added. Create your first automated message next.')
    }
    setDrawer(null)
  }

  if (step === 4) return <main className="main-content"><SuccessPanel onReset={() => setStep(0)} /></main>

  const completedCount = step === 0 || step === 1 ? 0 : step === 2 ? 1 : 2

  return (
    <main className="main-content">
      <div className="page-heading">
        <div><h1>Workspace setup</h1><p>A launch plan shaped around automated workflows and newsletters.</p></div>
        <div className="completion"><strong>{completedCount} of 4</strong><span>steps complete</span></div>
      </div>
      <section className="launch-plan" aria-labelledby="launch-title">
        <div className="plan-header">
          <div className="plan-icon"><PaperPlaneTilt size={23} /></div>
          <div><h2 id="launch-title">Andrew, get your first automated workflow ready</h2><p>We saved what you told us during signup. Start with email, then prove the experience with one test profile.</p></div>
          <button className="agent-link" type="button"><Sparkle size={16} /> Ask Agent about this plan</button>
        </div>
        <ol className="task-list">
          {tasks.map((task) => <TaskRow key={task.id} task={task} onAction={handleAction} />)}
        </ol>
      </section>
      <section className="parallel-note"><div><Lightning size={20} weight="fill" /></div><p><strong>Keep moving while DNS updates.</strong> Adding a test profile does not depend on domain verification, so it becomes your recommended next action.</p></section>
      <div className="up-next"><h2>Explore after your first send</h2><div className="explore-row"><button type="button">Invite a teammate <ArrowRight size={15} /></button><button type="button">Connect your product data <ArrowRight size={15} /></button><button type="button">Browse welcome templates <ArrowRight size={15} /></button></div></div>
      <div className="sr-only" aria-live="polite">{announcement}</div>
      {drawer && <Drawer type={drawer} onClose={() => setDrawer(null)} onComplete={completeDrawer} />}
      {preflight && <Preflight onClose={() => setPreflight(false)} onSend={() => { setPreflight(false); setStep(4) }} />}
    </main>
  )
}

function DemoBar({ step, setStep }) {
  const labels = ['Start', 'DNS checking', 'Profile added', 'Ready to send', 'Success']
  return (
    <div className="demo-bar" aria-label="Prototype state controls">
      <span>Prototype path</span>
      {labels.map((label, index) => <button key={label} className={step === index ? 'selected' : ''} onClick={() => setStep(index)} type="button">{label}</button>)}
    </div>
  )
}

function App() {
  const [step, setStep] = useState(0)
  const [offerOpen, setOfferOpen] = useState(true)
  const [planModal, setPlanModal] = useState(false)
  const [planSelected, setPlanSelected] = useState(false)
  return (
    <div className="app-shell">
      <Sidebar onUpgrade={() => setOfferOpen(true)} planSelected={planSelected} />
      <div className="app-stage">
        <Topbar />
        <Workspace step={step} setStep={setStep} />
      </div>
      <DemoBar step={step} setStep={setStep} />
      {offerOpen && <UpgradeCoachmark onClose={() => setOfferOpen(false)} onCompare={() => { setOfferOpen(false); setPlanModal(true) }} />}
      {planModal && <PlanModal onClose={() => setPlanModal(false)} onConfirm={() => { setPlanModal(false); setPlanSelected(true) }} />}
      {planSelected && <div className="plan-toast" role="status"><CheckCircle size={18} weight="fill" />Plan selected. Your trial now runs for 30 days.</div>}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
