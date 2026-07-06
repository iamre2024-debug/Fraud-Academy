import { useEffect, useMemo, useState } from 'react';
import FeatureArchitect from './FeatureArchitect.jsx';

const STORE = 'fraud-academy-v22-polish-pass';

const SIDEBAR = [
  ['Dashboard', '⌂'], ['Case Queue', '▤'], ['Case Briefing', '▣'], ['Customer 360', '♙'],
  ['Identity Intel', '⌕'], ['Login History', '▧'], ['Device Intel', '▱'], ['Financial Investigation', '$'],
  ['Business Intelligence', '▥'], ['Bank Account Verification', '◈'], ['Evidence Center', '▰'], ['Customer Contact & Interview', '✆'],
  ['Timeline Builder', '◷'], ['Investigation Workspace', '✦'], ['Investigation Summary', '✎'], ['Case Review', '✓'],
  ['Luna AI', '☾'], ['Fraud Library', '◇'], ['Learning Paths', '☆'],
].map(([id, icon]) => ({ id, icon, label: id }));

const CLAIMS = [
  'Account Takeover', 'First Party Fraud', 'Chargeback / Card Dispute', 'Email Fraud / BEC',
  'Payroll Fraud / Direct Deposit Diversion', 'Credit Risk', 'Check Fraud / Check Image Review',
  'Synthetic Identity', 'Bust-Out Fraud', 'Ghost Employee Fraud', 'Digital Wallet Fraud', 'Money Mule',
  'Vendor Fraud', 'Merchant Fraud', 'ACH Fraud',
];

const defaultPlay = {
  party: 'consumer',
  short: 'A realistic fictional case needs evidence review before any conclusion.',
  objective: 'Review records, compare timelines, and document what makes sense before final review.',
  evidence: ['Customer Context', 'Identity Context', 'Digital Activity', 'Financial Activity', 'Documents', 'Timeline'],
  docs: ['Case Intake', 'Account Snapshot', 'Evidence Packet', 'Timeline Record'],
  briefing: ['Read the case first.', 'Gather evidence in the right workspace.', 'Save the final decision for Case Review.'],
};

const claimPlaybook = {
  'Account Takeover': {
    party: 'consumer',
    short: 'Customer reports digital activity after profile changes and new access events.',
    objective: 'Review profile changes, login/device behavior, MFA events, and money movement before deciding whether access was unauthorized.',
    evidence: ['Profile Change Timeline', 'Login History', 'Device Context', 'MFA / OTP Record', 'Financial Movement', 'Customer Contact'],
    docs: ['Login Activity Report', 'MFA / OTP Record', 'Device Activity Report', 'Profile Update Confirmation', 'Secure Message Log', 'Written Statement'],
    briefing: ['Compare normal login behavior to new session behavior.', 'Review profile changes before the reported activity.', 'Confirm whether the transaction timeline makes sense.'],
  },
  'First Party Fraud': {
    party: 'consumer',
    short: 'Customer claim needs comparison to prior behavior, merchant records, and account history.',
    objective: 'Compare the claim to customer history, merchant evidence, prior disputes, and timeline context without labeling the customer early.',
    evidence: ['Customer History', 'Prior Claims', 'Merchant Activity', 'Transaction Timeline', 'Customer Statement'],
    docs: ['Customer Claim Form', 'Merchant Response', 'Prior Dispute History', 'Transaction Receipt', 'Contact Notes'],
    briefing: ['Review prior claim and merchant history.', 'Compare customer statement with records.', 'Document what supports or contradicts the claim.'],
  },
  'Chargeback / Card Dispute': {
    party: 'merchant',
    short: 'Cardholder disputes a transaction and merchant evidence must be reviewed.',
    objective: 'Determine whether the evidence supports the dispute reason, not simply whether the customer is upset.',
    evidence: ['Receipt', 'Order Details', 'Shipping / Delivery', 'Merchant Response', 'Refund History', 'Customer Communication'],
    docs: ['Receipt', 'Invoice', 'Merchant Response Letter', 'Shipping Confirmation', 'Proof of Delivery', 'Refund History', 'Dispute Correspondence'],
    briefing: ['Review the dispute reason code context.', 'Compare merchant evidence to the customer claim.', 'Check contact attempts and refund history.'],
  },
  'Email Fraud / BEC': {
    party: 'business',
    short: 'Payment instructions changed after an email request that needs business verification.',
    objective: 'Review email thread, payment request, vendor or employee bank change, account ownership, and confirmation attempts.',
    evidence: ['Email Thread', 'Invoice / Payment Request', 'Bank Account Verification', 'Business Contact Attempt', 'Payment Timeline'],
    docs: ['Email Thread', 'Invoice', 'Vendor Bank Change Request', 'ACH Authorization', 'Business Verification Notes'],
    briefing: ['Review who requested the change.', 'Confirm whether payment instructions were independently verified.', 'Compare new account to prior payment history.'],
  },
  'Payroll Fraud / Direct Deposit Diversion': {
    party: 'employee',
    short: 'Payroll or direct deposit details changed and need employee/business verification.',
    objective: 'Determine whether the payroll change makes business sense and whether the bank account links to the correct employee.',
    evidence: ['Payroll Change Request', 'Employee Profile', 'Bank Account Verification', 'Business Confirmation', 'Admin Login History'],
    docs: ['Direct Deposit Form', 'Payroll Change Request', 'Employee Record', 'HR Request', 'Bank Verification Record'],
    briefing: ['Review employee creation and payroll change history.', 'Confirm bank ownership and first payroll use.', 'Document business or employee contact attempts.'],
  },
  'Credit Risk': {
    party: 'consumer',
    short: 'Credit request needs repayment-capacity and behavior review, separate from fraud.',
    objective: 'Review cash flow, debt obligations, repayment history, income consistency, and utilization before a credit decision.',
    evidence: ['Credit Summary', 'Payment History', 'Income Verification', 'Cash Flow', 'Utilization', 'Account Age'],
    docs: ['Credit Summary', 'Payment History', 'Bank Statement', 'Income Verification', 'Application Record'],
    briefing: ['Keep credit risk separate from fraud.', 'Review ability and willingness to repay.', 'Use credit decision wording only.'],
  },
  'Check Fraud / Check Image Review': {
    party: 'consumer',
    short: 'Check image, endorsement, deposit channel, and return/hold timeline need review.',
    objective: 'Review front/back check images, endorsement, alteration indicators, deposit behavior, hold timeline, and account history.',
    evidence: ['Front Check Image', 'Back Check Image', 'Endorsement Review', 'Deposit Channel', 'Hold / Return Timeline', 'Account History'],
    docs: ['Front Check Image', 'Back Check Image', 'Mobile Deposit Confirmation', 'Hold Notice', 'Return Item Notice', 'Check Image Review Report'],
    briefing: ['Review check image quality and endorsement.', 'Compare deposit pattern to account history.', 'Check hold and return timeline.'],
  },
  'Synthetic Identity': {
    party: 'consumer',
    short: 'Identity profile has limited history and needs identity, credit, and public-record review.',
    objective: 'Review identity age, contact history, public records, credit behavior, application details, and device/contact consistency.',
    evidence: ['Identity Age', 'SSN / DOB Context', 'Address History', 'Phone / Email Age', 'Public Records', 'Credit Behavior'],
    docs: ['Identity Report', 'Application Record', 'Credit Summary', 'Address History', 'KYC Review', 'Public Records Report'],
    briefing: ['Review identity depth and public record consistency.', 'Compare contact age to application story.', 'Check device and financial behavior.'],
  },
  'Bust-Out Fraud': {
    party: 'credit',
    short: 'Account relationship builds, utilization rises, then repayment behavior changes.',
    objective: 'Review account aging, rising utilization, payment decline, deposit or revenue trend, large draws, and credit-risk context.',
    evidence: ['Credit Line History', 'Utilization Trend', 'Payment History', 'Deposit / Revenue Trend', 'Large Draw Activity'],
    docs: ['Credit Line History', 'Utilization Report', 'Payment History', 'Revenue Trend', 'Statement Package', 'Public Record Report'],
    briefing: ['Review history before the recent activity.', 'Compare repayment behavior and utilization changes.', 'Keep fraud and credit-risk wording separate until review.'],
  },
  'Ghost Employee Fraud': {
    party: 'business',
    short: 'A payroll profile may not connect cleanly to a real employee relationship.',
    objective: 'Review employee creation, payroll history, bank ownership, admin actions, business verification, and shared-account context.',
    evidence: ['Employee Creation Record', 'Payroll History', 'Bank Account Ownership', 'Admin Logs', 'Business Verification'],
    docs: ['Employee Creation Record', 'Payroll Run Report', 'Direct Deposit Form', 'Admin Change Log', 'Bank Verification Record'],
    briefing: ['Review who created the employee record.', 'Confirm bank account ownership and payroll history.', 'Contact business/payroll owner if needed.'],
  },
  'Digital Wallet Fraud': {
    party: 'consumer',
    short: 'Wallet enrollment and tokenized transactions need device, MFA, and timeline review.',
    objective: 'Review wallet enrollment, device used, tokenization, MFA/OTP, merchant transactions, and profile/login timeline.',
    evidence: ['Wallet Enrollment', 'Tokenization Record', 'Device Context', 'MFA / OTP', 'Wallet Transactions'],
    docs: ['Wallet Enrollment Confirmation', 'Tokenization Record', 'Device Activity Report', 'MFA / OTP Record', 'Wallet Transaction Log'],
    briefing: ['Review whether wallet enrollment fits device history.', 'Compare MFA and login timeline.', 'Review wallet merchant activity.'],
  },
  'Money Mule': {
    party: 'consumer',
    short: 'Account activity shows incoming funds followed by rapid movement or cash-out.',
    objective: 'Review incoming/outgoing transfer pattern, linked accounts, cash-out, recipient history, and relationship context.',
    evidence: ['Incoming Transfers', 'Outgoing Transfers', 'Linked Accounts', 'ATM / Cash-Out', 'Recipient History'],
    docs: ['Transfer Log', 'Linked Account Verification', 'ATM Withdrawal Record', 'Recipient History', 'Contact Notes'],
    briefing: ['Review velocity of funds.', 'Compare sender/recipient history.', 'Document cash-out and linked account context.'],
  },
  'Vendor Fraud': {
    party: 'business',
    short: 'Vendor payment or bank details changed and need ownership/business verification.',
    objective: 'Review vendor profile, bank change request, invoice, ACH setup, prior payment history, and contact attempts.',
    evidence: ['Vendor Profile', 'Bank Change Request', 'Invoice', 'ACH Setup', 'Prior Payment History', 'Contact Attempts'],
    docs: ['Vendor Bank Change Request', 'Invoice', 'ACH Authorization', 'Vendor Profile', 'Business Verification Notes'],
    briefing: ['Review whether the vendor change makes business sense.', 'Verify bank account ownership and history.', 'Document independent confirmation attempts.'],
  },
  'Merchant Fraud': {
    party: 'merchant',
    short: 'Merchant activity, refunds, delivery, and dispute history need review.',
    objective: 'Review merchant profile, transaction pattern, refund behavior, dispute history, fulfillment, and customer contact records.',
    evidence: ['Merchant Profile', 'Transaction Pattern', 'Refund History', 'Dispute History', 'Fulfillment Records'],
    docs: ['Merchant Profile', 'Transaction Batch', 'Refund History', 'Delivery Records', 'Customer Communication'],
    briefing: ['Review merchant history and dispute patterns.', 'Compare fulfillment evidence to claim records.', 'Avoid early merchant labels.'],
  },
  'ACH Fraud': {
    party: 'business',
    short: 'ACH setup, authorization, and debit/credit activity need verification.',
    objective: 'Review ACH authorization, setup timeline, account ownership, business/vendor relationship, and debit/credit activity.',
    evidence: ['ACH Authorization', 'Setup Timeline', 'Bank Account Verification', 'Debit / Credit History', 'Business Relationship'],
    docs: ['ACH Authorization', 'Setup Confirmation', 'Bank Verification Record', 'ACH Activity Log', 'Business Contact Notes'],
    briefing: ['Review who authorized ACH activity.', 'Verify bank account and business relationship.', 'Compare ACH timing to other events.'],
  },
};

const finalOptions = {
  'Account Takeover': ['Unauthorized Access Supported', 'Customer Claim Not Supported', 'More Review Needed', 'Escalate'],
  'First Party Fraud': ['Customer Claim Supported', 'Customer Claim Not Supported', 'Insufficient Evidence', 'Escalate'],
  'Chargeback / Card Dispute': ['Customer Claim Supported', 'Merchant Evidence Supported', 'Insufficient Evidence', 'Escalate'],
  'Email Fraud / BEC': ['Hold Payment', 'Approve Change', 'Reject Change', 'Escalate', 'Request Business Verification'],
  'Payroll Fraud / Direct Deposit Diversion': ['Hold', 'Approve Change', 'Reject Change', 'Escalate', 'Request Business Verification'],
  'Credit Risk': ['Approve', 'Decline', 'Counteroffer', 'Request More Info', 'Escalate'],
  'Check Fraud / Check Image Review': ['Pay', 'Return', 'Hold', 'Escalate', 'Request More Info'],
  'Synthetic Identity': ['Approve', 'Decline', 'Escalate', 'Request More Info', 'Identity Review'],
  'Bust-Out Fraud': ['Restrict', 'Decline', 'Escalate', 'Request More Info', 'Credit Review'],
  'Ghost Employee Fraud': ['Hold Payroll', 'Reject Change', 'Escalate', 'Request Business Verification'],
  'Digital Wallet Fraud': ['Customer Claim Supported', 'Customer Claim Not Supported', 'More Review Needed', 'Escalate'],
  'Money Mule': ['Restrict Account', 'Escalate', 'Refer for Review', 'Request More Info'],
  'Vendor Fraud': ['Hold Payment', 'Approve Change', 'Reject Change', 'Escalate', 'Request Vendor Verification'],
  'Merchant Fraud': ['Customer Claim Supported', 'Merchant Evidence Supported', 'Insufficient Evidence', 'Escalate'],
  'ACH Fraud': ['Hold ACH', 'Return ACH', 'Approve ACH', 'Escalate', 'Request More Info'],
};

const names = ['Jessica Marie Johnson', 'Olivia M. Carter', 'Brandon T. Lewis', 'Riya K. Patel', 'Marcus D. Hill', 'Tiffany R. Anderson'];
const companies = ['Sunset Landscaping LLC', 'Crown Payroll Services', 'Velora Boutique', 'Metro Wireless', 'NorthStar Electronics', 'Blue Orchid Supply Co.'];
const quickAccess = ['Addresses', 'Phones', 'Emails', 'Associates', 'Businesses', 'Social Media', 'Relatives', 'More'];

function suggestedNext(type) {
  if (type.includes('BEC') || type.includes('Vendor') || type.includes('Ghost') || type.includes('Payroll') || type.includes('ACH')) return 'Bank Account Verification';
  if (type.includes('Synthetic')) return 'Identity Intel';
  if (type.includes('Wallet') || type.includes('Account Takeover')) return 'Login History';
  if (type.includes('Check')) return 'Evidence Center';
  if (type.includes('Bust') || type.includes('Credit')) return 'Financial Investigation';
  return 'Customer 360';
}

function makeCase(i) {
  const type = CLAIMS[i % CLAIMS.length];
  const play = claimPlaybook[type] || defaultPlay;
  const person = names[i % names.length];
  const company = companies[i % companies.length];
  const customer = ['business', 'merchant'].includes(play.party) ? company : person;
  return {
    id: `CASE-2026-${String(4871 + i).padStart(6, '0')}`,
    type,
    party: play.party,
    customer,
    person,
    business: company,
    amount: Math.round(240 + ((i * 773) % 24800)),
    priority: i % 5 === 0 ? 'Review Priority' : i % 3 === 0 ? 'Needs Follow-Up' : 'Needs Review',
    difficulty: ['Level 1', 'Level 2', 'Level 3', 'Level 4'][i % 4],
    received: `07/${String((i % 5) + 1).padStart(2, '0')}/2026`,
    channel: ['Mobile Banking', 'Secure Message', 'Branch Intake', 'Business Portal', 'Dispute Form'][i % 5],
    summary: play.short,
    objective: play.objective,
    evidence: play.evidence,
    docs: play.docs,
    briefing: play.briefing,
    phone: `(555) 867-${String(5309 + i).slice(-4)}`,
    email: `${person.toLowerCase().replaceAll(' ', '.')}@examplemail.com`,
    address: `${1200 + i * 37} Maple Drive, Dallas, TX 7520${i % 9}`,
    profileId: `CUST-${400000 + i * 97}`,
    accountAge: `${2 + (i % 8)} yrs ${i % 11} mos`,
    relationship: `${1 + (i % 9)} years`,
    device: `DEV-${90000 + i * 41}`,
    ip: `172.${16 + i}.${30 + i}.${40 + i}`,
    bankAccount: `****-${String(6789 + i).slice(-4)}`,
    next: suggestedNext(type),
  };
}

function baseState() {
  return {
    page: 'Dashboard',
    cases: Array.from({ length: 30 }, (_, i) => makeCase(i)),
    selectedId: 'CASE-2026-004871',
    filter: 'All Cases',
    reviewed: [],
    notes: [],
    docs: [],
    contacts: [],
    completed: [],
    finalDecision: '',
    lastClosed: null,
    architectOpen: false,
    featureIdeas: [],
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE));
    return saved ? { ...baseState(), ...saved, architectOpen: false } : baseState();
  } catch {
    return baseState();
  }
}

export default function App() {
  const [s, setS] = useState(loadState);
  const current = useMemo(() => s.cases.find(x => x.id === s.selectedId) || s.cases[0] || s.lastClosed, [s.cases, s.selectedId, s.lastClosed]);

  useEffect(() => localStorage.setItem(STORE, JSON.stringify({ ...s, architectOpen: false })), [s]);

  const patch = update => setS(prev => ({ ...prev, ...update }));
  const go = page => setS(prev => ({ ...prev, page, reviewed: markReviewed(prev.reviewed, page) }));
  const mark = item => setS(prev => ({ ...prev, reviewed: markReviewed(prev.reviewed, item) }));
  const addDocs = docs => setS(prev => ({ ...prev, docs: [...new Set([...prev.docs, ...docs])], page: 'Evidence Center', reviewed: markReviewed(prev.reviewed, 'Evidence Center') }));
  const addNote = text => setS(prev => ({ ...prev, notes: [{ text, at: new Date().toLocaleTimeString() }, ...prev.notes] }));
  const addContact = text => setS(prev => ({ ...prev, contacts: [{ text, at: new Date().toLocaleTimeString() }, ...prev.contacts] }));
  const selectCase = id => setS(prev => ({ ...prev, selectedId: id, page: 'Case Briefing', reviewed: [], notes: [], docs: [], contacts: [], finalDecision: '' }));
  const saveIdea = idea => setS(prev => ({ ...prev, featureIdeas: [idea, ...(prev.featureIdeas || [])] }));
  const deleteIdea = id => setS(prev => ({ ...prev, featureIdeas: (prev.featureIdeas || []).filter(x => x.id !== id) }));
  const complete = () => {
    if (!current || !s.finalDecision) return;
    const closed = { ...current, finalDecision: s.finalDecision, reviewed: s.reviewed, docs: s.docs, contacts: s.contacts, notes: s.notes, closedAt: new Date().toLocaleString() };
    const remaining = s.cases.filter(x => x.id !== current.id);
    setS(prev => ({ ...prev, cases: remaining, selectedId: remaining[0]?.id || '', completed: [closed, ...prev.completed], lastClosed: closed, page: 'Investigation Summary', reviewed: [], notes: [], docs: [], contacts: [], finalDecision: '' }));
  };

  const props = { s, current, patch, go, mark, addDocs, addNote, addContact, selectCase, complete };

  return <div className="app-shell">
    <Sidebar s={s} current={current} go={go} />
    <main className="workspace-main">
      <TopBar s={s} current={current} patch={patch} />
      {s.page === 'Dashboard' && <Dashboard {...props} />}
      {s.page === 'Case Queue' && <CaseQueue {...props} />}
      {s.page === 'Case Briefing' && <CaseBriefing {...props} />}
      {s.page === 'Customer 360' && <Customer360 {...props} />}
      {s.page === 'Identity Intel' && <IdentityIntel {...props} />}
      {s.page === 'Login History' && <LoginHistory {...props} />}
      {s.page === 'Device Intel' && <EvidenceWorkspace title="Device Intel" question="Does this device make sense for this customer, employee, vendor, or session?" docs={['Device Activity Report', 'Wallet Enrollment Record', 'Device Comparison']} {...props} />}
      {s.page === 'Financial Investigation' && <EvidenceWorkspace title="Financial Investigation" question="Does the money make sense?" docs={['Financial Activity Report', 'Transfer Timeline', 'Deposit Review']} {...props} />}
      {s.page === 'Business Intelligence' && <EvidenceWorkspace title="Business Intelligence" question="Does this business activity make sense?" docs={['Business Profile', 'Website Review', 'Public Records']} {...props} />}
      {s.page === 'Bank Account Verification' && <EvidenceWorkspace title="Bank Account Verification" question="Does this bank account make sense for this setup or payment change?" docs={['Bank Account Verification', 'Ownership Link Review', 'Verification Attempt Log']} {...props} />}
      {s.page === 'Evidence Center' && <EvidenceCenter {...props} />}
      {s.page === 'Customer Contact & Interview' && <CustomerContact {...props} />}
      {s.page === 'Timeline Builder' && <TimelineBuilder {...props} />}
      {s.page === 'Investigation Workspace' && <InvestigationWorkspace {...props} />}
      {s.page === 'Investigation Summary' && <InvestigationSummary {...props} />}
      {s.page === 'Case Review' && <CaseReview {...props} />}
      {s.page === 'Luna AI' && <LunaAI {...props} />}
      {s.page === 'Fraud Library' && <FraudLibrary />}
      {s.page === 'Learning Paths' && <LearningPaths />}
    </main>
    <MobileNav s={s} go={go} />
    <button className="architect-fab" onClick={() => patch({ architectOpen: true })}>✨<span>New Upgrade Idea</span></button>
    <FeatureArchitect open={s.architectOpen} ideas={s.featureIdeas || []} onClose={() => patch({ architectOpen: false })} onSave={saveIdea} onDelete={deleteIdea} />
  </div>;
}

function markReviewed(list, page) {
  if (['Dashboard', 'Case Queue', 'Luna AI', 'Fraud Library', 'Learning Paths'].includes(page)) return list;
  return [...new Set([...list, page])];
}

function Sidebar({ s, current, go }) {
  return <aside className="global-sidebar">
    <div className="brand-lockup"><div className="brand-mark">FA</div><div><h1>Fraud Academy</h1><p>Investigator Workspace</p></div></div>
    <nav className="sidebar-nav">{SIDEBAR.map(item => <button key={item.id} onClick={() => go(item.id)} className={s.page === item.id ? 'active' : ''}><span>{item.icon}</span>{item.label}</button>)}</nav>
    <div className="luna-card"><div className="luna-cat">🐈‍⬛</div><b>Luna AI Mentor</b><p>Need help? Ask Luna without giving away the answer.</p><button onClick={() => go('Luna AI')}>Chat with Luna</button></div>
    <button className="current-case-card" onClick={() => go('Case Briefing')}><span>Current Case</span><b>{current?.id || 'Queue Clear'}</b><small>{current?.type || 'No active case'}</small></button>
  </aside>;
}

function MobileNav({ s, go }) {
  return <div className="mobile-nav">{SIDEBAR.slice(0, 6).map(x => <button key={x.id} className={s.page === x.id ? 'active' : ''} onClick={() => go(x.id)}><span>{x.icon}</span><small>{x.label.split(' ')[0]}</small></button>)}</div>;
}

function TopBar({ s, current, patch }) {
  return <header className="topbar"><div><p className="eyebrow">Investigation Workspace</p><h2>{s.page}</h2><p className="muted">Teaching investigators how to think, not what to think.</p></div><div className="top-actions"><span className="pill xp">💎 2,450 XP</span><span className="pill fire">🔥 12 Day Streak</span><span className="pill glow">{current?.priority || 'Ready'}</span><button className="soft-btn" onClick={() => patch(baseState())}>Reset Training</button></div></header>;
}

function Dashboard({ s, current, go }) {
  return <section className="dashboard-polish">
    <div className="dash-hero cute-sparkles"><div><p className="eyebrow">Good evening, Ree! 👋</p><h2>Ready to solve some cases?</h2><p>Cozy investigator mode is on. Evidence first. Conclusions later.</p></div><div className="hero-mascot">👩🏽‍💻🌙</div></div>
    <div className="dash-stats">
      <CuteStat icon="◉" label="Fraud Detection Accuracy" value="70%" caption="Keep going!" />
      <CuteStat icon="▣" label="Active Cases" value={s.cases.length} caption="View cases →" />
      <CuteStat icon="✦" label="Cases Solved" value={s.completed.length} caption="This month" />
      <CuteStat icon="☆" label="Pending Review" value="3" caption="See reviews" />
    </div>
    <div className="dash-main-card next-case-card"><div><p className="eyebrow">Your Next Case ✦</p><h3>{current?.type}</h3><CaseMini c={current} /><button onClick={() => go('Case Briefing')}>Continue Case →</button></div><div className="mug-art">☕<span>♡</span></div></div>
    <div className="dash-main-card progress-card"><h3>Your Progress ✦</h3><div className="progress-ring"><b>70%</b><span>Accuracy</span></div><p>Accuracy Goal: 90%</p><small>You’re on your way! 💗</small></div>
    <div className="dash-bottom-card crew-card"><h3>Meet Your Crew 💜</h3><div className="crew-row"><span>🐈‍⬛ Luna</span><span>☁️ Cloudy</span><span>⭐ Nova</span></div></div>
    <div className="dash-bottom-card goal-card"><h3>Daily Goal 🌸</h3><Checklist items={['Complete 3 investigations', 'Review one timeline', 'Ask Luna one question']} done={s.reviewed.length} /></div>
    <div className="dash-bottom-card achievement-card"><h3>Recent Achievement</h3><p>Evidence Explorer reviewed 25+ full reports.</p><button onClick={() => go('Learning Paths')}>View Achievements</button></div>
  </section>;
}

function CuteStat({ icon, label, value, caption }) { return <div className="cute-stat"><span>{icon}</span><b>{value}</b><small>{label}</small><em>{caption}</em></div>; }
function CaseMini({ c }) { if (!c) return null; return <div className="case-mini"><span>{c.id}</span><small>{c.customer}</small><small>{c.priority} · {c.difficulty}</small></div>; }

function CaseQueue({ s, current, patch, selectCase }) {
  const filtered = s.filter === 'All Cases' ? s.cases : s.cases.filter(c => c.type === s.filter);
  return <section className="queue-layout"><div className="queue-list"><div className="section-head"><h3>Case Queue</h3><select value={s.filter} onChange={e => patch({ filter: e.target.value })}><option>All Cases</option>{CLAIMS.map(c => <option key={c}>{c}</option>)}</select></div>{filtered.map(c => <button key={c.id} className={`case-card ${current?.id === c.id ? 'active' : ''}`} onClick={() => selectCase(c.id)}><span className="case-id">{c.id}</span><b>{c.type}</b><small>{c.customer} · {c.priority}</small><p>{c.summary}</p></button>)}</div><aside className="queue-side"><div className="panel"><h3>Today’s Snapshot</h3><Stat label="Active" value={s.cases.length} /><Stat label="Completed" value={s.completed.length} /></div><div className="panel cute-tip"><h3>Luna Tip 🌙</h3><p>Choose a case, read the briefing first, then gather evidence. Do not jump straight to a decision.</p></div></aside></section>;
}

function CaseBriefing({ current, go }) {
  return <section className="workspace-grid"><div className="panel xl"><h3>What am I investigating?</h3><CaseSnapshot c={current} /><h4>Objectives</h4>{current?.briefing.map(x => <div className="evidence-line" key={x}>✦ {x}</div>)}<div className="button-row"><button onClick={() => go('Investigation Workspace')}>Start Investigation</button><button onClick={() => go(current?.next || 'Customer 360')}>Open Suggested Workspace</button></div></div><CoachCard title="Briefing Rule" text="This is a supervisor assignment. It tells you what happened, what is known, and what needs to be verified." /></section>;
}

function Customer360({ current, addDocs, go }) {
  const [tab, setTab] = useState('Overview');
  const tabs = ['Overview', 'Account History', 'Devices', 'Locations', 'Accounts', 'Prior Fraud', 'Contact History', 'Behavior', 'Notes'];
  const profileEvents = ['Password updated', 'Phone number updated', 'Email address updated', 'Address updated', 'MFA enabled'];
  const isBusiness = ['business', 'merchant', 'employee'].includes(current?.party);

  return <section className="customer360 polished-customer">
    <div className="customer-profile panel charm-panel"><span className="corner-charm">💗</span><div className="avatar portrait">{current?.customer?.[0] || 'C'}</div><h3>{current?.customer}</h3><p>{current?.profileId}</p><span className="status-pill">Active Customer</span><Info k="Customer Since" v="2017" /><Info k="Relationship" v={current?.relationship} /><Info k="Products" v="Checking · Savings · Card" /><Info k="Channel" v={current?.channel} /></div>
    <div className="panel relationship-panel"><h3>Customer 360 Sections ✦</h3><div className="tabs">{tabs.map(x => <button key={x} className={tab === x ? 'active' : ''} onClick={() => setTab(x)}>{x}</button>)}</div>
      {tab === 'Overview' && <div><div className="metric-grid bright"><Metric label="Customer Since" value="2017" /><Metric label="Products" value="4" /><Metric label="Verified Phone" value="Yes" /><Metric label="Verified Email" value="Yes" /><Metric label="Current Address" value="5 yrs" /><Metric label="Trusted Devices" value="3" /></div><h4>Contact Information</h4><Info k="Phone" v={current?.phone} /><Info k="Email" v={current?.email} /><Info k="Address" v={current?.address} /><Info k="Preferred Contact" v="Email" /></div>}
      {tab === 'Account History' && <div><h4>Profile Change Timeline ✨</h4>{profileEvents.map((x, i) => <TimelineItem key={x} label={x} time={`07/0${i + 1}/2026`} />)}<Info k="Investigator Question" v="Did this change happen before the claimed activity?" /><button onClick={() => addDocs(['Profile Change Timeline', 'Customer Snapshot'])}>Add Profile Evidence</button></div>}
      {tab === 'Devices' && <div><h4>Known Devices</h4><Info k="Primary Device" v="iPhone 14 Pro · Dallas TX · trusted" /><Info k="Desktop" v="Chrome on Windows · trusted" /><Info k="New Device" v={`${current?.device} · review required`} /><Info k="Investigator Question" v="Is the current case tied to a known or first-seen device?" /><button onClick={() => go('Device Intel')}>Open Device Intel →</button></div>}
      {tab === 'Locations' && <div><h4>Normal Locations</h4><Info k="Home Market" v="Dallas, TX" /><Info k="Common Login Area" v="Dallas / Fort Worth" /><Info k="Recent Review Area" v="Houston, TX" /><Info k="Out-of-Pattern" v="Miami, FL session needs comparison" /><button onClick={() => go('Login History')}>Compare Login Locations →</button></div>}
      {tab === 'Accounts' && <div><h4>Account Summary 💳</h4><Info k="Checking" v="•••• 4837 · $4,298.31" /><Info k="Savings" v="•••• 6789 · $12,560.08" /><Info k="Credit Card" v="•••• 2846 · $1,243.75" /><Info k="Auto Loan" v="•••• 5711 · $18,230.41" /><Info k="External Account" v={current?.bankAccount} /></div>}
      {tab === 'Prior Fraud' && <div><h4>Prior Claims & Reviews</h4><Info k="Prior Claims" v="2 in last 24 months" /><Info k="Prior Outcome" v="One supported, one not supported" /><Info k="Watch Point" v="Compare claim facts without assuming repeat behavior." /><Info k="Claim Type Context" v={current?.type} /><button onClick={() => addDocs(['Prior Claims Memo'])}>Add Prior Claims Memo</button></div>}
      {tab === 'Contact History' && <div><h4>Contact History</h4><Info k="Last Secure Message" v="07/02/2026 · customer asked about account access" /><Info k="Last Call" v="06/28/2026 · verified by OTP" /><Info k="Branch Visit" v={isBusiness ? 'Business contact visited branch in May' : 'No recent branch visit'} /><Info k="Follow-Up Rule" v="Use contact only when evidence calls for it." /><button onClick={() => go('Customer Contact & Interview')}>Open Contact & Interview →</button></div>}
      {tab === 'Behavior' && <div><h4>Normal Behavior Pattern</h4><Info k="Normal Spend" v="Grocery, gas, delivery, utilities" /><Info k="Normal Transfer Style" v="Small P2P transfers under $250" /><Info k="Normal Login Time" v="Morning and evening" /><Info k="Current Case Lens" v="Compare new activity to this baseline before decision." /><button onClick={() => go('Financial Investigation')}>Open Financial Investigation →</button></div>}
      {tab === 'Notes' && <div><h4>Investigator Notes</h4><p className="muted">Use Customer 360 to understand what is normal for the customer or business. This page gives context, not the final answer.</p><Info k="Training Reminder" v="Evidence first. Neutral language. Final decision later." /><Info k="Next Best Step" v={current?.next} /></div>}
    </div>
    <div className="panel case-snapshot-card"><h3>Current Case Snapshot</h3><CaseSnapshot c={current} /><button onClick={() => go('Identity Intel')}>Identity Intel →</button></div>
    <div className="customer-action-bar"><button onClick={() => go('Identity Intel')}>Identity Intel</button><button onClick={() => go('Login History')}>Login History</button><button onClick={() => go('Device Intel')}>Device Intel</button><button onClick={() => go('Financial Investigation')}>Financial Intel</button><button onClick={() => go('Evidence Center')}>Evidence Center</button><button onClick={() => go('Timeline Builder')}>Timeline Builder</button></div>
  </section>;
}

function IdentityIntel({ current, addDocs }) {
  return <section className="identity-workspace cute-sparkles">
    <div className="identity-search panel"><span className="corner-charm">🦋</span><p className="eyebrow">People Search & Intelligence</p><h3>Identity Intel Workspace</h3><div className="tabs"><button className="active">SSN / ID</button><button>Name + DOB</button><button>Phone</button><button>Email</button></div><label>Search by SSN / ID Number</label><div className="search-input"><span>***-**-6789</span><button>⌕</button></div><button className="run-search" onClick={() => addDocs(['Identity Report', 'Address History', 'Phone History', 'Email History'])}>⌕ Run Search</button><div className="secure-row"><span>🔒 Secure</span><span>Encrypted</span><span>Confidential</span></div></div>
    <div className="profile-summary panel"><h3>Profile Summary</h3><div className="profile-top"><div className="portrait-img">{current?.person?.[0] || 'J'}</div><div><b>{current?.person}</b><p>DOB: 06/15/1992 · Age 32</p><p>SSN: ***-**-6789</p><p>{current?.email}</p></div><span className="status-pill">Verified</span></div><div className="metric-grid"><Metric label="Addresses" value="8" /><Metric label="Phones" value="5" /><Metric label="Emails" value="3" /><Metric label="Associates" value="7" /></div></div>
    <div className="panel evidence-explorer"><h3>Evidence Explorer</h3>{['Identity Report', 'Address History', 'Phone History', 'Email History', 'Public Records', 'Criminal Records', 'Business Affiliations'].map((x, i) => <div className="report-row" key={x}><span>{x}</span><b>{i + 2} Records</b><button>View</button></div>)}</div>
    <div className="panel quick-access"><h3>Quick Access</h3>{quickAccess.map(x => <span className="quick-pill" key={x}>{x}</span>)}</div>
    <div className="panel chart-card"><h3>Top Evidence Categories</h3><div className="donut"><b>39</b><span>Total Records</span></div><p className="muted">Public records, address history, phone history, business records, and other identity context.</p></div>
    <div className="panel ai-card"><h3>AI Insights</h3><p>Use identity records as context. Luna should not decide the claim during active investigation.</p><button onClick={() => addDocs(['AI Identity Context Notes'])}>Add Context Notes</button></div>
  </section>;
}

function LoginHistory({ current, addDocs }) {
  const rows = ['Dallas, Texas · Chrome on Windows', 'Dallas, Texas · iPhone 14 Pro', 'Houston, Texas · Safari on iPhone', 'Miami, Florida · Chrome on Android', 'Orlando, Florida · Edge on Windows'];
  return <section className="login-mobile-shell">
    <div className="phone-card login-phone"><div className="phone-top"><span>☰</span><b>Fraud Academy</b><span>🐈‍⬛</span></div><h2>Login History ✦</h2><div className="login-person"><div className="portrait-img small">{current?.person?.[0] || 'J'}</div><div><b>{current?.person}</b><p>Last Login: Today at 8:42 AM</p></div></div><div className="metric-grid"><Metric label="Total Logins" value="24" /><Metric label="Unique Locations" value="5" /><Metric label="Unique Devices" value="18" /><Metric label="Needs Review" value="2" /></div><h3>Recent Logins</h3>{rows.map((row, i) => <div className="login-row" key={row}><span>{i < 2 ? 'Known' : i === 2 ? 'Review' : 'Compare'}</span><b>{row}</b><small>IP {current?.ip}</small></div>)}<button onClick={() => addDocs(['Login Activity Report', 'MFA / OTP Record'])}>Review Activity Context</button></div>
    <div className="phone-card login-phone"><div className="phone-top"><span>←</span><b>Login History</b><span>⚙</span></div><div className="tabs"><button className="active">Logins</button><button>Devices</button><button>Locations</button><button>Review</button></div><div className="metric-grid"><Metric label="Total Logins" value="24" /><Metric label="Locations" value="5" /><Metric label="Devices" value="18" /><Metric label="Review Items" value="2" /></div>{rows.slice(0, 4).map((row, i) => <div className="login-row wide" key={row}><span>{i < 2 ? 'Known' : 'Needs Review'}</span><b>{row}</b><small>Compare to normal login behavior.</small></div>)}<button onClick={() => addDocs(['Login Comparison Report'])}>Add Login Evidence</button></div>
  </section>;
}

function EvidenceWorkspace({ title, question, current, addDocs, docs }) {
  return <section className="workspace-grid"><div className="panel xl"><p className="eyebrow">{question}</p><h3>{title}</h3><CaseSnapshot c={current} /><div className="metric-grid"><Metric label="Case Amount" value={`$${current?.amount.toLocaleString()}`} /><Metric label="Account Age" value={current?.accountAge} /><Metric label="Review Status" value={current?.priority} /><Metric label="Suggested Next" value={current?.next} /></div>{current?.evidence.map(e => <div className="evidence-line" key={e}>✦ {e}</div>)}<button onClick={() => addDocs(docs)}>Add Related Evidence</button></div><CoachCard title="Does this make sense?" text="Review facts, records, timelines, and context. Do not label evidence before the final review step." /></section>;
}

function EvidenceCenter({ current, s, addDocs }) {
  const docs = [...new Set([...(current?.docs || []), ...s.docs])];
  return <section className="evidence-layout"><div className="panel"><h3>Evidence Inbox</h3>{docs.map(d => <button className="doc-chip" key={d}>{d}</button>)}<button onClick={() => addDocs(current?.docs || [])}>Generate Claim Packet</button></div><div className="document-viewer"><h3>{docs[0] || 'Select Document'}</h3><p>Training document generated for {current?.type}. Evidence is fictional and should be reviewed in context.</p><Info k="Case" v={current?.id} /><Info k="Related Party" v={current?.customer} /><Info k="Document Purpose" v="Supports investigation context, not a final decision." /><Info k="Review Question" v="Does this document support, contradict, or add context to the claim?" /></div></section>;
}

function CustomerContact({ current, addContact }) {
  return <section className="workspace-grid"><div className="panel xl"><h3>Initial Contact / Claim Intake</h3><Info k="Channel" v={current?.channel} /><Info k="Initial Statement" v={current?.summary} /><Info k="Contact Type" v={current?.party === 'business' ? 'Business / vendor / payroll contact' : 'Customer contact'} /><Info k="Follow-Up" v="Use targeted follow-up only when evidence calls for it." /><button onClick={() => addContact(`Intake reviewed for ${current?.type}`)}>Mark Intake Reviewed</button></div><CoachCard title="Interview Rule" text="Not every claim needs a forced interview. Use intake records, secure messages, dispute forms, merchant contact, and follow-up questions only when needed." /></section>;
}

function TimelineBuilder({ current }) {
  const events = ['Case received', 'Profile or relationship record reviewed', ...(current?.evidence || []).slice(0, 4), 'Evidence packet generated', 'Investigation summary drafted'];
  return <section className="panel xl"><h3>Timeline Builder</h3><p className="muted">What happened first, and how do events connect?</p><div className="timeline">{events.map((e, i) => <TimelineItem key={`${e}-${i}`} label={e} time={`Step ${i + 1}`} />)}</div></section>;
}

function InvestigationWorkspace({ current, s, go, addNote }) {
  return <section className="workspace-grid"><div className="panel xl"><h3>Investigation Workspace</h3><CaseSnapshot c={current} /><h4>Workspace Progress</h4><Checklist items={['Customer 360', 'Identity Intel', 'Login History', 'Device Intel', 'Financial Investigation', 'Evidence Center', 'Timeline Builder']} checked={s.reviewed} /><div className="button-row">{current?.evidence.map(x => <button key={x} onClick={() => addNote(`Reviewed ${x} for ${current.type}`)}>{x}</button>)}</div></div><div className="panel"><h3>Suggested Next</h3><p>{current?.next}</p><button onClick={() => go(current?.next || 'Customer 360')}>Open Workspace</button><h3>AI Case Summary Draft</h3><p className="muted">Luna drafts from reviewed evidence. Investigator edits and approves later.</p></div></section>;
}

function InvestigationSummary({ s, current, go }) {
  const c = s.lastClosed || current;
  return <section className="panel xl"><h3>Investigation Summary Draft</h3><p className="muted">AI-assisted, not AI-controlled.</p><div className="summary-box"><p><b>Claim Type:</b> {c?.type}</p><p><b>What was checked:</b> {(c?.reviewed || s.reviewed).join(', ') || 'No reviewed evidence recorded yet.'}</p><p><b>Findings:</b> Records were reviewed for consistency across customer, identity, digital, financial, document, and timeline context.</p><p><b>Decision / Action:</b> {c?.finalDecision || 'Pending Case Review'}</p><p><b>Short explanation:</b> Evidence should be documented using neutral language and routed to Case Review.</p></div><button onClick={() => go('Case Review')}>Go to Case Review</button></section>;
}

function CaseReview({ s, current, patch, complete }) {
  const options = finalOptions[current?.type] || ['More Review Needed', 'Escalate', 'Request More Info'];
  return <section className="workspace-grid"><div className="panel xl"><h3>Case Review / Final Determination</h3><p className="muted">Decision buttons appear here only after evidence review.</p>{options.map(o => <button key={o} className={`decision ${s.finalDecision === o ? 'active' : ''}`} onClick={() => patch({ finalDecision: o })}>{o}</button>)}<button disabled={!s.finalDecision} onClick={complete}>Confirm Final Decision</button></div><CoachCard title="QA Review" text="QA evaluates process, evidence reviewed, documentation, and reasoning. It does not reward guessing early." /></section>;
}

function LunaAI({ current }) {
  return <section className="workspace-grid"><div className="panel xl luna-workspace"><h3>Luna AI Mentor</h3><p>Luna explains, coaches, and drafts. Luna does not solve the case early.</p><Prompt text={`What should I compare in a ${current?.type} case?`} /><Prompt text="Help me write a neutral investigation summary from reviewed evidence." /><Prompt text="What evidence should I review next without giving me the answer?" /></div><CoachCard title="Guardrail" text="Luna cannot label evidence as fraud, reveal hidden evidence, skip steps, or make the final decision during active investigation." /></section>;
}

function FraudLibrary() {
  return <section className="library-grid">{CLAIMS.map(c => <div className="panel" key={c}><h3>{c}</h3><p>{(claimPlaybook[c] || defaultPlay).short}</p><h4>Evidence to Review</h4>{(claimPlaybook[c] || defaultPlay).evidence.slice(0, 4).map(e => <span className="topic" key={e}>{e}</span>)}</div>)}</section>;
}

function LearningPaths() {
  return <section className="library-grid">{CLAIMS.map((c, i) => <div className="panel" key={c}><h3>{c} Path</h3><p>Lessons, labs, practice cases, Luna coaching, and debrief examples.</p><div className="progress"><div style={{ width: `${15 + (i % 5) * 15}%` }} /></div></div>)}</section>;
}

function Stat({ label, value }) { return <div className="stat-card"><span>{label}</span><b>{value}</b></div>; }
function Info({ k, v }) { return <div className="info-row"><b>{k}</b><span>{v}</span></div>; }
function Metric({ label, value }) { return <div className="metric"><span>{label}</span><b>{value}</b></div>; }
function TimelineItem({ time, label }) { return <div className="timeline-item"><span>{time}</span><b>{label}</b></div>; }
function Checklist({ items, checked = [], done }) { return <div>{items.map((x, i) => <div className="check" key={x}><span>{checked.includes(x) || (done && i < done) ? '✓' : '○'}</span>{x}</div>)}</div>; }
function CoachCard({ title, text }) { return <aside className="coach-card"><h3>{title}</h3><p>{text}</p></aside>; }
function Prompt({ text }) { return <button className="prompt">{text}</button>; }
function CaseSnapshot({ c }) { if (!c) return <p>No active case.</p>; return <div className="snapshot"><Info k="Case ID" v={c.id} /><Info k="Claim Type" v={c.type} /><Info k="Customer / Party" v={c.customer} /><Info k="Amount" v={`$${c.amount.toLocaleString()}`} /><Info k="Review Status" v={c.priority} /><Info k="Summary" v={c.summary} /></div>; }
