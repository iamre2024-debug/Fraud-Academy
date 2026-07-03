import { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  FileSearch,
  FolderOpen,
  Gauge,
  MessageSquareText,
  Plus,
  ShieldAlert,
  Sparkles,
  UserRoundSearch,
} from 'lucide-react';

const STORAGE_KEY = 'fraud-academy-progress-v1';

const caseTemplates = [
  {
    type: 'ATO',
    domain: 'Fraud Claim',
    title: 'Mobile Wallet Takeover',
    customer: 'Maya Bennett',
    amount: 1284.76,
    priority: 'High',
    correctDecision: 'approve',
    summary: 'Customer reports six mobile wallet purchases after a password reset and a new device enrollment overnight.',
    evidence: [
      'Password reset came from an IP address 770 miles from the customer home ZIP.',
      'Device fingerprint changed from Pixel 7 to iPhone 16 Pro thirty minutes before the first purchase.',
      'One-time passcode was delivered by SMS and successfully entered on the first attempt.',
      'Customer called from the phone number on file and passed voice verification.',
      'Merchant pattern shows rapid gift card purchases and digital delivery.',
    ],
    interview: [
      ['Where was your phone during the activity?', 'In my purse at work. I did not lose it, but I did get a text that looked like the bank asking me to verify something.'],
      ['Did you authorize a new device?', 'No. I only use my Pixel. I have never owned an iPhone.'],
      ['Did anyone else know your online banking password?', 'No, but I reused that password on a shopping site.'],
    ],
  },
  {
    type: 'Email Fraud',
    domain: 'Fraud Claim',
    title: 'Payroll Redirect Email',
    customer: 'Northlake Dental Group',
    amount: 6425.22,
    priority: 'Critical',
    correctDecision: 'approve',
    summary: 'Business client says payroll was redirected after a spoofed vendor email changed ACH instructions.',
    evidence: [
      'Sender domain used rn instead of m in northlakedental.com.',
      'ACH destination account was opened eight days before the transaction.',
      'Callback procedure was skipped by the office manager under time pressure.',
      'The email contained copied language from a legitimate prior vendor message.',
      'Three similar complaints were linked to the receiving bank this week.',
    ],
    interview: [
      ['Who requested the payment change?', 'It looked like our staffing vendor, but now I see the email address was slightly wrong.'],
      ['Was the change confirmed by phone?', 'No. We were closing payroll and I rushed it.'],
      ['Have you paid this account before?', 'Never. This was the first payment to that routing and account number.'],
    ],
  },
  {
    type: 'First Party Fraud',
    domain: 'Fraud Claim',
    title: 'Luxury Goods Non-Receipt',
    customer: 'Darius Cole',
    amount: 2199.99,
    priority: 'Medium',
    correctDecision: 'deny',
    summary: 'Cardholder disputes a delivered designer bag, claiming the package never arrived.',
    evidence: [
      'Delivery photo shows the package at the customer front door with matching house number.',
      'Carrier GPS scan is within 18 feet of the billing address.',
      'Merchant submitted signed delivery confirmation using the customer last name.',
      'Customer filed three non-receipt claims in the last 74 days.',
      'Customer social post two days later shows the same bag in the background.',
    ],
    interview: [
      ['Do you recognize the delivery photo?', 'That looks like my porch, but anyone could have taken it after delivery.'],
      ['Did you contact the merchant first?', 'No, I wanted the bank to handle it.'],
      ['Have you had recent delivery issues?', 'Yeah, a few packages have gone missing lately.'],
    ],
  },
  {
    type: 'Chargeback Claim',
    domain: 'Fraud Claim',
    title: 'Subscription Cancelation Dispute',
    customer: 'Priya Shah',
    amount: 349.0,
    priority: 'Low',
    correctDecision: 'partial',
    summary: 'Customer says a software subscription renewed after cancelation, but merchant says notice was late.',
    evidence: [
      'Merchant terms require cancelation three days before renewal.',
      'Customer chat transcript shows cancelation request one day after renewal.',
      'Customer stopped using the software the same day the request was sent.',
      'Merchant offered a prorated refund for ten unused months.',
      'Prior billing notices were delivered to the email address on file.',
    ],
    interview: [
      ['When did you cancel?', 'I messaged them the morning after I saw the charge.'],
      ['Did you receive renewal notices?', 'Probably, but they went to my old email folder.'],
      ['Would you accept the merchant prorated credit?', 'Yes, I just do not want to pay for a full year.'],
    ],
  },
  {
    type: 'Credit Risk',
    domain: 'Credit Risk Claim',
    title: 'Thin-File Business Line Increase',
    customer: 'Horizon Event Rentals LLC',
    amount: 25000,
    priority: 'High',
    correctDecision: 'escalate',
    summary: 'New business requests a large credit line increase after two months of strong deposits and rising card spend.',
    evidence: [
      'Business was registered 69 days ago and has no prior commercial credit history.',
      'Deposits are high but concentrated from two counterparties with matching addresses.',
      'Utilization moved from 12 percent to 91 percent in four weeks.',
      'Owner personal credit has two recent inquiries and one new revolving account.',
      'Website is live but inventory photos appear copied from another rental company.',
    ],
    interview: [
      ['Why do you need the increase now?', 'We booked several summer events and need to buy inventory quickly.'],
      ['Can you provide invoices or contracts?', 'I can send some screenshots today and formal contracts later.'],
      ['Are the deposit counterparties related?', 'One is my cousin helping with startup funding.'],
    ],
  },
];

const toolkitByType = {
  ATO: [
    ['Device intelligence', 'New iPhone 16 Pro, jailbroken signal false, first seen 34 minutes before wallet provisioning.'],
    ['Network trace', 'Login ASN belongs to a residential proxy provider; distance mismatch is severe.'],
    ['Authentication trail', 'SMS OTP passed, but no biometric login occurred after new device enrollment.'],
    ['Merchant risk', 'Three digital gift card merchants, same cart values, all completed under nine minutes.'],
  ],
  'Email Fraud': [
    ['Domain review', 'Lookalike domain registered yesterday with privacy masking and no mail history.'],
    ['ACH receiver profile', 'Receiving account age eight days, first large credit, immediate outbound wires attempted.'],
    ['Business process check', 'Callback control absent; payment instruction change approved only by email.'],
    ['Linked claims', 'Receiving bank has three active fraud notices tied to similar payroll language.'],
  ],
  'First Party Fraud': [
    ['Carrier package trace', 'GPS, delivery image, scan time, and route all support delivery to billing address.'],
    ['Claim history', 'Three recent non-receipt claims, two with high-value fashion merchants.'],
    ['Open-source check', 'Public post appears to show disputed item after delivery date.'],
    ['Merchant evidence', 'Signed proof of delivery and AVS match supplied in representment packet.'],
  ],
  'Chargeback Claim': [
    ['Card network rule check', 'Late cancelation weakens full chargeback rights; prorated service credit may apply.'],
    ['Merchant terms', 'Renewal language was disclosed at checkout and in billing reminder email.'],
    ['Usage logs', 'No usage after cancelation request, supporting partial unused-service recovery.'],
    ['Resolution path', 'Recommend partial credit acceptance and merchant confirmation in writing.'],
  ],
  'Credit Risk': [
    ['KYB review', 'Secretary of State active registration, but entity age is under 90 days.'],
    ['Cash-flow review', 'Deposits are concentrated and relationship-linked, not diversified operating revenue.'],
    ['Exposure review', 'Current utilization spike plus thin file creates elevated bust-out risk.'],
    ['Verification needs', 'Request contracts, invoices, insurance, inventory proof, and owner guaranty review.'],
  ],
};

const docsByType = {
  ATO: [
    ['Login Timeline', '01:12 password reset; 01:38 new device enrolled; 02:04 wallet token added; 02:11 first gift card purchase.'],
    ['Customer Affidavit', 'Customer denies device enrollment and confirms phishing-style text before the activity.'],
    ['Network Report', 'IP geolocation: Denver, CO. Customer billing ZIP: Dallas, TX. Proxy confidence: high.'],
  ],
  'Email Fraud': [
    ['Email Header', 'Return-path domain differs by one character; SPF softfail; DKIM absent.'],
    ['ACH Detail', 'Receiver account opened recently; first incoming credit; rapid transfer attempts after posting.'],
    ['Vendor Statement', 'Legitimate vendor confirms no banking instruction change was requested.'],
  ],
  'First Party Fraud': [
    ['Proof of Delivery', 'Photo confirms porch, house number, timestamp, and GPS proximity to billing address.'],
    ['Merchant Packet', 'AVS match, signed delivery, order email, and customer account login before purchase.'],
    ['Claim Pattern Memo', 'Repeated non-receipt pattern across luxury merchants within a short period.'],
  ],
  'Chargeback Claim': [
    ['Subscription Terms', 'Annual renewal auto-bills unless canceled at least three days before renewal.'],
    ['Support Chat', 'Cancelation request received one day after renewal and processed immediately.'],
    ['Refund Offer', 'Merchant offers ten-month prorated refund while denying full reversal.'],
  ],
  'Credit Risk': [
    ['KYB Snapshot', 'Active LLC, new formation, limited web presence, owner identity verified.'],
    ['Bank Statement Review', 'Two related deposits make up 83 percent of observed inflow.'],
    ['Credit Memo', 'Recommend manual underwriting before any exposure increase.'],
  ],
};

const navItems = [
  ['Dashboard', Gauge],
  ['Case Lab', ShieldAlert],
  ['Toolkit', UserRoundSearch],
  ['Documents', FileSearch],
  ['Interview', MessageSquareText],
  ['Debrief', BookOpenCheck],
  ['Stats', BadgeCheck],
];

const decisionLabels = {
  approve: 'Approve claim',
  deny: 'Deny claim',
  partial: 'Offer partial credit',
  escalate: 'Escalate for review',
};

function makeCase(template, index) {
  const stamp = Math.floor(Date.now() / 1000).toString(36).toUpperCase();
  return {
    ...template,
    id: `${template.type.slice(0, 3).toUpperCase()}-${stamp}-${index + 1}`,
    createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
  };
}

function getSavedProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.activeCases?.length) return saved;
  } catch {
    // Ignore broken local data and start fresh.
  }

  return {
    activeCases: caseTemplates.slice(0, 4).map(makeCase),
    completedCases: [],
    notes: {},
    decisions: {},
    score: { correct: 0, total: 0 },
  };
}

function App() {
  const [progress, setProgress] = useState(getSavedProgress);
  const [page, setPage] = useState('Dashboard');
  const [selectedId, setSelectedId] = useState(progress.activeCases[0]?.id);

  const selectedCase = useMemo(
    () => progress.activeCases.find((item) => item.id === selectedId) || progress.activeCases[0],
    [progress.activeCases, selectedId],
  );

  const selectedNotes = selectedCase ? progress.notes[selectedCase.id] || '' : '';
  const selectedDecision = selectedCase ? progress.decisions[selectedCase.id] || '' : '';

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  function updateNotes(value) {
    if (!selectedCase) return;
    setProgress((current) => ({
      ...current,
      notes: { ...current.notes, [selectedCase.id]: value },
    }));
  }

  function updateDecision(value) {
    if (!selectedCase) return;
    setProgress((current) => ({
      ...current,
      decisions: { ...current.decisions, [selectedCase.id]: value },
    }));
  }

  function generateCase() {
    const template = caseTemplates[(progress.activeCases.length + progress.completedCases.length) % caseTemplates.length];
    const newCase = makeCase(template, progress.activeCases.length);
    setProgress((current) => ({ ...current, activeCases: [newCase, ...current.activeCases] }));
    setSelectedId(newCase.id);
    setPage('Case Lab');
  }

  function completeCase() {
    if (!selectedCase || !selectedDecision) return;
    const correct = selectedDecision === selectedCase.correctDecision;
    const completed = {
      ...selectedCase,
      closedAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      traineeDecision: selectedDecision,
      correct,
      notes: selectedNotes,
    };

    setProgress((current) => {
      const activeCases = current.activeCases.filter((item) => item.id !== selectedCase.id);
      return {
        ...current,
        activeCases,
        completedCases: [completed, ...current.completedCases],
        score: {
          correct: current.score.correct + (correct ? 1 : 0),
          total: current.score.total + 1,
        },
      };
    });

    const nextCase = progress.activeCases.find((item) => item.id !== selectedCase.id);
    setSelectedId(nextCase?.id);
    setPage(nextCase ? 'Dashboard' : 'Stats');
  }

  const accuracy = progress.score.total ? Math.round((progress.score.correct / progress.score.total) * 100) : 0;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><Sparkles size={24} /></div>
          <div>
            <p className="eyebrow">Neon Case Lab</p>
            <h1>Fraud Academy</h1>
          </div>
        </div>

        <nav className="nav-stack" aria-label="Main pages">
          {navItems.map(([item, Icon]) => (
            <button className={page === item ? 'nav-button active' : 'nav-button'} key={item} onClick={() => setPage(item)}>
              <Icon size={18} />
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <button className="generate-button" onClick={generateCase}>
          <Plus size={18} />
          Generate case
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Investigator dashboard</p>
            <h2>{page}</h2>
          </div>
          <div className="score-pill">
            <ClipboardCheck size={18} />
            <span>{accuracy}% accuracy</span>
          </div>
        </header>

        {page === 'Dashboard' && (
          <Dashboard
            activeCases={progress.activeCases}
            completedCases={progress.completedCases}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            setPage={setPage}
          />
        )}

        {page !== 'Dashboard' && page !== 'Stats' && !selectedCase && (
          <EmptyState generateCase={generateCase} />
        )}

        {selectedCase && page === 'Case Lab' && (
          <CaseLab
            item={selectedCase}
            notes={selectedNotes}
            decision={selectedDecision}
            updateNotes={updateNotes}
            updateDecision={updateDecision}
            completeCase={completeCase}
          />
        )}

        {selectedCase && page === 'Toolkit' && <Toolkit item={selectedCase} />}
        {selectedCase && page === 'Documents' && <Documents item={selectedCase} />}
        {selectedCase && page === 'Interview' && <Interview item={selectedCase} />}
        {selectedCase && page === 'Debrief' && <Debrief item={selectedCase} notes={selectedNotes} decision={selectedDecision} />}
        {page === 'Stats' && <Stats progress={progress} accuracy={accuracy} />}
      </section>
    </main>
  );
}

function Dashboard({ activeCases, completedCases, selectedId, setSelectedId, setPage }) {
  return (
    <div className="dashboard-grid">
      <section className="hero-panel">
        <p className="eyebrow">Active queue</p>
        <h3>{activeCases.length} open investigations</h3>
        <p>Fraud claims and credit risk reviews stay separated by domain. Completed cases leave this queue and move into your debrief history.</p>
        <div className="metric-row">
          <Metric label="Fraud claims" value={activeCases.filter((item) => item.domain === 'Fraud Claim').length} />
          <Metric label="Credit risk" value={activeCases.filter((item) => item.domain === 'Credit Risk Claim').length} />
          <Metric label="Closed" value={completedCases.length} />
        </div>
      </section>

      <section className="case-list">
        {activeCases.map((item) => (
          <button
            className={selectedId === item.id ? 'case-card active' : 'case-card'}
            key={item.id}
            onClick={() => {
              setSelectedId(item.id);
              setPage('Case Lab');
            }}
          >
            <span className="case-domain">{item.domain}</span>
            <strong>{item.title}</strong>
            <span>{item.customer}</span>
            <span className="case-meta">${item.amount.toLocaleString()} | {item.priority} priority | {item.type}</span>
          </button>
        ))}
      </section>
    </div>
  );
}

function CaseLab({ item, notes, decision, updateNotes, updateDecision, completeCase }) {
  return (
    <div className="case-layout">
      <CaseHeader item={item} />
      <section className="evidence-panel">
        <h3>Evidence Board</h3>
        <ul>
          {item.evidence.map((line) => <li key={line}>{line}</li>)}
        </ul>
      </section>
      <section className="note-panel">
        <h3>Case Notes</h3>
        <textarea value={notes} onChange={(event) => updateNotes(event.target.value)} placeholder="Write what matters: device changes, claim history, delivery proof, KYB concerns, merchant evidence..." />
        <div className="decision-grid">
          {Object.entries(decisionLabels).map(([value, label]) => (
            <button className={decision === value ? 'decision active' : 'decision'} key={value} onClick={() => updateDecision(value)}>
              {label}
            </button>
          ))}
        </div>
        <button className="complete-button" disabled={!decision} onClick={completeCase}>Complete case</button>
      </section>
    </div>
  );
}

function Toolkit({ item }) {
  return (
    <div className="tool-grid">
      <CaseHeader item={item} />
      {toolkitByType[item.type].map(([title, detail]) => (
        <article className="tool-card" key={title}>
          <BriefcaseBusiness size={20} />
          <h3>{title}</h3>
          <p>{detail}</p>
        </article>
      ))}
    </div>
  );
}

function Documents({ item }) {
  return (
    <div className="document-viewer">
      <CaseHeader item={item} />
      {docsByType[item.type].map(([title, detail]) => (
        <article className="document-page" key={title}>
          <div className="document-tab"><FolderOpen size={18} /> {title}</div>
          <p>{detail}</p>
        </article>
      ))}
    </div>
  );
}

function Interview({ item }) {
  return (
    <div className="interview-stack">
      <CaseHeader item={item} />
      {item.interview.map(([question, answer]) => (
        <article className="transcript" key={question}>
          <p className="question">Investigator: {question}</p>
          <p>Customer: {answer}</p>
        </article>
      ))}
    </div>
  );
}

function Debrief({ item, notes, decision }) {
  const noteText = notes.toLowerCase();
  const covered = item.evidence.filter((line) => line.toLowerCase().split(' ').some((word) => word.length > 5 && noteText.includes(word.replace(/[^a-z0-9]/g, ''))));

  return (
    <div className="debrief-panel">
      <CaseHeader item={item} />
      <section className="debrief-card">
        <p className="eyebrow">Recommended outcome</p>
        <h3>{decisionLabels[item.correctDecision]}</h3>
        <p>{decision ? `Your selected outcome: ${decisionLabels[decision]}.` : 'Pick a decision in Case Lab to compare your call.'}</p>
      </section>
      <section className="debrief-card">
        <h3>Why this outcome fits the evidence</h3>
        <ul>
          {item.evidence.map((line) => <li key={line}>{line}</li>)}
        </ul>
      </section>
      <section className="debrief-card">
        <h3>Notes quality check</h3>
        <p>{covered.length ? `Your notes appear to mention ${covered.length} evidence point(s).` : 'Your notes do not mention much of the evidence yet. Add the strongest facts before closing the case.'}</p>
      </section>
    </div>
  );
}

function Stats({ progress, accuracy }) {
  return (
    <div className="stats-grid">
      <Metric label="Accuracy" value={`${accuracy}%`} />
      <Metric label="Completed cases" value={progress.completedCases.length} />
      <Metric label="Active queue" value={progress.activeCases.length} />
      <section className="history-panel">
        <h3>Closed Case History</h3>
        {progress.completedCases.length === 0 && <p>No closed cases yet. Finish one investigation to start your record.</p>}
        {progress.completedCases.map((item) => (
          <article className="history-row" key={`${item.id}-${item.closedAt}`}>
            <span>{item.title}</span>
            <strong className={item.correct ? 'right' : 'wrong'}>{item.correct ? 'Correct' : 'Review needed'}</strong>
            <small>{decisionLabels[item.traineeDecision]} | {item.closedAt}</small>
          </article>
        ))}
      </section>
    </div>
  );
}

function CaseHeader({ item }) {
  return (
    <section className="case-header">
      <div>
        <p className="eyebrow">{item.domain} | {item.id}</p>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
      </div>
      <div className="amount-box">
        <span>Exposure</span>
        <strong>${item.amount.toLocaleString()}</strong>
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState({ generateCase }) {
  return (
    <section className="empty-state">
      <h3>No active cases</h3>
      <p>Generate a new case to keep practicing.</p>
      <button className="generate-button inline" onClick={generateCase}>Generate case</button>
    </section>
  );
}

export default App;
