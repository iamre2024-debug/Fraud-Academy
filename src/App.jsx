import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, BookOpenCheck, FileSearch, Home, MessageCircle, Plus, Search, ShieldAlert, Sparkles, Trophy, UserRoundSearch } from 'lucide-react';

const STORAGE_KEY = 'fraud-academy-v2';

const decisions = {
  approve: 'Approve claim',
  deny: 'Deny claim',
  partial: 'Partial credit',
  escalate: 'Escalate review',
};

const templates = [
  {
    type: 'ATO',
    domain: 'Fraud Claim',
    title: 'Midnight Wallet Takeover',
    customer: 'Maya Bennett',
    amount: 1284.76,
    priority: 'High',
    correctDecision: 'approve',
    summary: 'Six digital gift-card transactions hit minutes after a password reset and new device enrollment.',
    evidence: ['Password reset from Denver while customer is in Dallas.', 'Device changed from Pixel 7 to iPhone 16 Pro.', 'SMS OTP was entered, but no biometric login followed.', 'Customer passed phone verification and reports a fake bank text.', 'Purchases were rapid digital gift cards with same cart values.'],
    toolkit: [['Device fingerprint', 'First-seen iPhone 16 Pro. No prior relationship to customer profile.'], ['IP intelligence', 'Residential proxy signal high. Distance mismatch 770 miles.'], ['Auth trail', 'Password reset, new device, wallet token, then purchases in under one hour.'], ['Merchant risk', 'Digital delivery gift cards, no shipping recovery path.']],
    documents: [['Login Timeline', '01:12 reset | 01:38 device enrollment | 02:04 wallet token | 02:11 first purchase'], ['Network Report', 'Proxy confidence high. IP location: Denver, CO. Customer home area: Dallas, TX.'], ['Customer Affidavit', 'Customer denies activity and describes phishing-style SMS before takeover.']],
    interview: [['Did you approve the new device?', 'No. I only use my Pixel and never added an iPhone.'], ['Did anything happen before the charges?', 'I got a text that looked like the bank and clicked it.'], ['Where was your phone?', 'In my purse at work. It was not lost.']],
  },
  {
    type: 'Email Fraud',
    domain: 'Fraud Claim',
    title: 'Payroll Redirect Trap',
    customer: 'Northlake Dental Group',
    amount: 6425.22,
    priority: 'Critical',
    correctDecision: 'approve',
    summary: 'A business client sent payroll to a new ACH account after receiving a spoofed vendor email.',
    evidence: ['Sender domain uses rn instead of m.', 'Receiving account opened eight days ago.', 'Callback verification was skipped.', 'Email copied wording from a legitimate vendor thread.', 'Receiving bank has three similar complaints this week.'],
    toolkit: [['Header check', 'SPF softfail and DKIM missing. Reply-to differs from display sender.'], ['ACH receiver', 'New account, first large credit, quick outbound attempts.'], ['Control failure', 'Payment instruction change approved by email only.'], ['Linked claims', 'Same receiving bank appears in multiple payroll redirect cases.']],
    documents: [['Email Header', 'Lookalike domain, privacy masked registration, no normal mail history.'], ['ACH Detail', 'First incoming credit followed by outbound transfer attempts.'], ['Vendor Statement', 'Legitimate vendor confirms no bank-change request.']],
    interview: [['Who requested the change?', 'It looked like our staffing vendor. The address was barely different.'], ['Was it confirmed by phone?', 'No. We were closing payroll and I rushed it.'], ['Had you paid this account before?', 'Never.']],
  },
  {
    type: 'First Party Fraud',
    domain: 'Fraud Claim',
    title: 'Luxury Bag Non-Receipt',
    customer: 'Darius Cole',
    amount: 2199.99,
    priority: 'Medium',
    correctDecision: 'deny',
    summary: 'Customer disputes a delivered designer bag even though merchant evidence strongly supports delivery.',
    evidence: ['Delivery photo shows customer porch and house number.', 'Carrier GPS scan is within 18 feet of billing address.', 'Signed delivery confirmation uses customer last name.', 'Three non-receipt claims in 74 days.', 'Social post appears to show the same bag after delivery.'],
    toolkit: [['Carrier trace', 'GPS, scan time, and route support successful delivery.'], ['Claim history', 'Repeated high-value non-receipt claims across fashion merchants.'], ['Open-source note', 'Public image appears to show disputed item after delivery date.'], ['Representment packet', 'AVS match, proof of delivery, customer account login before order.']],
    documents: [['Proof of Delivery', 'Photo, timestamp, GPS, and house number align with billing address.'], ['Merchant Packet', 'AVS match, signed delivery, order email, and login history.'], ['Claim Pattern Memo', 'Repeated luxury non-receipt disputes in short window.']],
    interview: [['Do you recognize the porch?', 'That looks like my porch, but someone could have taken it.'], ['Did you contact the merchant?', 'No, I wanted the bank to handle it.'], ['Any recent delivery issues?', 'Yes, a few packages have gone missing.']],
  },
  {
    type: 'Chargeback Claim',
    domain: 'Fraud Claim',
    title: 'Subscription Renewal Fight',
    customer: 'Priya Shah',
    amount: 349,
    priority: 'Low',
    correctDecision: 'partial',
    summary: 'Customer canceled after renewal, but stopped using the product immediately and merchant offered prorated credit.',
    evidence: ['Terms require cancelation three days before renewal.', 'Cancelation request came one day after renewal.', 'No software usage after cancelation request.', 'Merchant offered ten-month prorated refund.', 'Renewal notices were delivered to email on file.'],
    toolkit: [['Network rule check', 'Full reversal is weak, but unused service supports partial resolution.'], ['Terms review', 'Auto-renewal disclosed at checkout and reminder email.'], ['Usage logs', 'No usage after cancelation request.'], ['Resolution path', 'Accept prorated merchant refund and document customer agreement.']],
    documents: [['Subscription Terms', 'Annual renewal unless canceled at least three days prior.'], ['Support Chat', 'Customer requested cancelation after renewal posted.'], ['Refund Offer', 'Merchant offers ten-month prorated refund.']],
    interview: [['When did you cancel?', 'The morning after I saw the charge.'], ['Did you get notices?', 'Probably, but they went to an old folder.'], ['Would you accept prorated credit?', 'Yes, I just do not want to pay for a full year.']],
  },
  {
    type: 'Credit Risk',
    domain: 'Credit Risk Claim',
    title: 'Thin-File Line Increase',
    customer: 'Horizon Event Rentals LLC',
    amount: 25000,
    priority: 'High',
    correctDecision: 'escalate',
    summary: 'New business requests a large credit line increase after fast deposits and rising utilization.',
    evidence: ['Business registered 69 days ago.', 'Deposits concentrated from two related counterparties.', 'Utilization jumped from 12% to 91%.', 'Owner has recent credit inquiries.', 'Website photos appear copied from another company.'],
    toolkit: [['KYB review', 'Active entity, but short operating history and thin file.'], ['Cash-flow review', 'Deposits are concentrated and relationship-linked.'], ['Exposure review', 'Rapid utilization spike creates bust-out risk.'], ['Verification needs', 'Request contracts, invoices, inventory proof, insurance, and guaranty review.']],
    documents: [['KYB Snapshot', 'Active LLC, new formation, owner identity verified.'], ['Bank Review', 'Two related deposits make up most observed inflow.'], ['Credit Memo', 'Manual underwriting recommended before exposure increase.']],
    interview: [['Why increase now?', 'We booked summer events and need inventory quickly.'], ['Can you provide contracts?', 'I can send screenshots today and formal contracts later.'], ['Are the depositors related?', 'One is my cousin helping startup funding.']],
  },
];

const tabs = [
  ['Home', Home],
  ['Case', ShieldAlert],
  ['Toolkit', UserRoundSearch],
  ['Docs', FileSearch],
  ['Interview', MessageCircle],
  ['Debrief', BookOpenCheck],
  ['Stats', Trophy],
];

function makeCase(template, index = 0) {
  return { ...template, id: `${template.type.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${index + 1}`, createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) };
}

function freshProgress() {
  return { activeCases: templates.map(makeCase), completedCases: [], notes: {}, decisions: {}, xp: 0, correct: 0, total: 0 };
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.activeCases) return saved;
  } catch {}
  return freshProgress();
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [page, setPage] = useState('Home');
  const [selectedId, setSelectedId] = useState(progress.activeCases[0]?.id);
  const selectedCase = useMemo(() => progress.activeCases.find((item) => item.id === selectedId) || progress.activeCases[0], [progress.activeCases, selectedId]);
  const notes = selectedCase ? progress.notes[selectedCase.id] || '' : '';
  const decision = selectedCase ? progress.decisions[selectedCase.id] || '' : '';
  const accuracy = progress.total ? Math.round((progress.correct / progress.total) * 100) : 0;
  const level = Math.floor(progress.xp / 100) + 1;

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)), [progress]);

  function openCase(item, target = 'Case') {
    setSelectedId(item.id);
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function generateCase() {
    const template = templates[(progress.activeCases.length + progress.completedCases.length) % templates.length];
    const next = makeCase(template, progress.activeCases.length);
    setProgress((current) => ({ ...current, activeCases: [next, ...current.activeCases] }));
    openCase(next, 'Case');
  }

  function saveNotes(value) {
    if (!selectedCase) return;
    setProgress((current) => ({ ...current, notes: { ...current.notes, [selectedCase.id]: value } }));
  }

  function chooseDecision(value) {
    if (!selectedCase) return;
    setProgress((current) => ({ ...current, decisions: { ...current.decisions, [selectedCase.id]: value } }));
  }

  function completeCase() {
    if (!selectedCase || !decision) return;
    const correct = decision === selectedCase.correctDecision;
    const closed = { ...selectedCase, traineeDecision: decision, correct, notes, closedAt: new Date().toLocaleString() };
    const remaining = progress.activeCases.filter((item) => item.id !== selectedCase.id);
    setProgress((current) => ({ ...current, activeCases: remaining, completedCases: [closed, ...current.completedCases], xp: current.xp + (correct ? 75 : 35), correct: current.correct + (correct ? 1 : 0), total: current.total + 1 }));
    setSelectedId(remaining[0]?.id);
    setPage('Debrief');
  }

  return (
    <div className="phone-app">
      <header className="app-hero">
        <div className="hero-glow" />
        <div className="brand-row">
          <div className="brand-icon"><Search size={24} /></div>
          <div>
            <p className="eyebrow">Fraud Ops Training</p>
            <h1>Fraud Academy</h1>
          </div>
        </div>
        <div className="hero-copy">
          <h2>Case Lab</h2>
          <p>Tap a claim, inspect the evidence, make your call, and debrief like a real investigator.</p>
        </div>
        <div className="stat-strip">
          <MiniStat label="Level" value={level} />
          <MiniStat label="XP" value={progress.xp} />
          <MiniStat label="Accuracy" value={`${accuracy}%`} />
        </div>
      </header>

      <main className="screen-card">
        {page === 'Home' && <HomeScreen activeCases={progress.activeCases} completed={progress.completedCases.length} openCase={openCase} generateCase={generateCase} />}
        {page !== 'Home' && page !== 'Stats' && !selectedCase && <Empty generateCase={generateCase} />}
        {selectedCase && page === 'Case' && <CaseScreen item={selectedCase} notes={notes} decision={decision} saveNotes={saveNotes} chooseDecision={chooseDecision} completeCase={completeCase} />}
        {selectedCase && page === 'Toolkit' && <RecordScreen item={selectedCase} title="Investigation Toolkit" rows={selectedCase.toolkit} icon={<UserRoundSearch />} />}
        {selectedCase && page === 'Docs' && <RecordScreen item={selectedCase} title="Document Viewer" rows={selectedCase.documents} icon={<FileSearch />} document />}
        {selectedCase && page === 'Interview' && <Interview item={selectedCase} />}
        {selectedCase && page === 'Debrief' && <Debrief item={selectedCase} notes={notes} decision={decision} />}
        {page === 'Stats' && <Stats progress={progress} accuracy={accuracy} level={level} />}
      </main>

      <nav className="bottom-tabs" aria-label="Fraud Academy navigation">
        {tabs.map(([name, Icon]) => (
          <button key={name} className={page === name ? 'tab active' : 'tab'} onClick={() => setPage(name)}>
            <Icon size={18} />
            <span>{name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function HomeScreen({ activeCases, completed, openCase, generateCase }) {
  const fraudCount = activeCases.filter((item) => item.domain === 'Fraud Claim').length;
  const creditCount = activeCases.filter((item) => item.domain === 'Credit Risk Claim').length;
  return <section className="stack fade-in">
    <div className="section-title"><div><p className="eyebrow">Active Queue</p><h3>{activeCases.length} investigations</h3></div><button className="pill-button" onClick={generateCase}><Plus size={16} /> New</button></div>
    <div className="quick-grid"><MiniStat label="Fraud" value={fraudCount} /><MiniStat label="Credit Risk" value={creditCount} /><MiniStat label="Closed" value={completed} /></div>
    <div className="case-rail">
      {activeCases.map((item) => <button key={item.id} className="claim-card" onClick={() => openCase(item)}>
        <span className={item.domain === 'Credit Risk Claim' ? 'tag credit' : 'tag'}>{item.domain}</span>
        <h4>{item.title}</h4>
        <p>{item.customer}</p>
        <div className="claim-foot"><strong>${item.amount.toLocaleString()}</strong><span>{item.priority}</span><span>{item.type}</span></div>
      </button>)}
    </div>
  </section>;
}

function CaseScreen({ item, notes, decision, saveNotes, chooseDecision, completeCase }) {
  return <section className="stack fade-in"><CaseHeader item={item} />
    <Panel title="Evidence Board">{item.evidence.map((line, index) => <div className="evidence-row" key={line}><b>{index + 1}</b><span>{line}</span></div>)}</Panel>
    <Panel title="Case Notes"><textarea value={notes} onChange={(event) => saveNotes(event.target.value)} placeholder="Write the facts that support your decision..." />
      <div className="decision-grid">{Object.entries(decisions).map(([key, label]) => <button key={key} className={decision === key ? 'choice active' : 'choice'} onClick={() => chooseDecision(key)}>{label}</button>)}</div>
      <button className="complete" disabled={!decision} onClick={completeCase}>Complete case</button>
    </Panel>
  </section>;
}

function RecordScreen({ item, title, rows, icon, document }) {
  return <section className="stack fade-in"><CaseHeader item={item} /><div className="section-title"><div className="title-chip">{icon}<h3>{title}</h3></div></div>
    {rows.map(([name, detail]) => <article className={document ? 'doc-page' : 'record-card'} key={name}><p className="eyebrow">{name}</p><p>{detail}</p></article>)}
  </section>;
}

function Interview({ item }) {
  return <section className="stack fade-in"><CaseHeader item={item} /><Panel title="Customer Interview">{item.interview.map(([q, a]) => <div className="chat-pair" key={q}><p className="agent">Investigator: {q}</p><p className="customer">Customer: {a}</p></div>)}</Panel></section>;
}

function Debrief({ item, notes, decision }) {
  const noteWords = notes.toLowerCase();
  const matched = item.evidence.filter((line) => line.toLowerCase().split(' ').some((word) => word.length > 6 && noteWords.includes(word.replace(/[^a-z0-9]/g, ''))));
  return <section className="stack fade-in"><CaseHeader item={item} />
    <Panel title="Case Debrief"><div className="verdict"><BadgeCheck /><div><p className="eyebrow">Recommended Outcome</p><h3>{decisions[item.correctDecision]}</h3></div></div><p>{decision ? `Your call: ${decisions[decision]}.` : 'Choose a decision in Case Lab to compare your answer.'}</p></Panel>
    <Panel title="Evidence That Matters">{item.evidence.map((line) => <div className="evidence-row" key={line}><Sparkles size={16} /><span>{line}</span></div>)}</Panel>
    <Panel title="Notes Check"><p>{matched.length ? `Your notes connect to ${matched.length} evidence point(s).` : 'Your notes need stronger evidence references before closing.'}</p></Panel>
  </section>;
}

function Stats({ progress, accuracy, level }) {
  return <section className="stack fade-in"><div className="quick-grid"><MiniStat label="Level" value={level} /><MiniStat label="XP" value={progress.xp} /><MiniStat label="Accuracy" value={`${accuracy}%`} /></div><Panel title="Closed Cases">{progress.completedCases.length ? progress.completedCases.map((item) => <div className="history" key={`${item.id}-${item.closedAt}`}><strong>{item.title}</strong><span className={item.correct ? 'good' : 'review'}>{item.correct ? 'Correct' : 'Review'}</span><small>{decisions[item.traineeDecision]} • {item.closedAt}</small></div>) : <p>No cases closed yet.</p>}</Panel></section>;
}

function CaseHeader({ item }) {
  return <article className="case-header"><div><span className={item.domain === 'Credit Risk Claim' ? 'tag credit' : 'tag'}>{item.domain}</span><h3>{item.title}</h3><p>{item.summary}</p></div><div className="exposure"><span>Exposure</span><strong>${item.amount.toLocaleString()}</strong></div></article>;
}

function Panel({ title, children }) { return <article className="panel"><h3>{title}</h3><div className="panel-body">{children}</div></article>; }
function MiniStat({ label, value }) { return <div className="mini-stat"><span>{label}</span><strong>{value}</strong></div>; }
function Empty({ generateCase }) { return <section className="empty"><h3>No active case selected</h3><p>Generate a new case to keep practicing.</p><button className="pill-button" onClick={generateCase}><Plus size={16} /> Generate case</button></section>; }
