import { useMemo, useState } from 'react';
import './FeatureArchitect.css';

const steps = [
  { key: 'identity', label: 'Feature', icon: '✨' },
  { key: 'behavior', label: 'Behavior', icon: '🛠️' },
  { key: 'visuals', label: 'Visuals', icon: '🎨' },
  { key: 'banking', label: 'Bank Data', icon: '🏦' },
  { key: 'review', label: 'Build Plan', icon: '🧠' }
];

const blank = {
  title: '', page: 'Customer 360', claimType: 'Account Takeover', purpose: '',
  trigger: 'Button / investigator opens it', closeBehavior: 'Save progress and allow reopening later',
  layout: 'Neon centered modal', userActions: '', dataNeeded: '', documents: '',
  toolkitConnection: '', futureIdea: '', priority: 'Next upgrade'
};

const chips = {
  purpose: ['compare normal vs suspicious behavior', 'help new investigators know what to review', 'make evidence feel like a real bank system'],
  userActions: ['filter records', 'tag red/green flags', 'open linked documents', 'copy evidence into case notes'],
  dataNeeded: ['IP address, device ID, session ID, timestamps', 'risk score, trusted device status, first-seen date', 'merchant, amount, authorization code, billing/shipping match'],
  documents: ['Login Timeline', 'Device Fingerprint Report', 'Profile Change History', 'Bank Statement', 'Email Header Analysis'],
  toolkitConnection: ['change toolkit by claim type', 'send selected record to Document Viewer', 'add evidence to Case Debrief'],
  futureIdea: ['AI suggestions button', 'auto-generated sample records', 'later advanced build assistant reminder']
};

export default function FeatureArchitect({ open, ideas = [], onClose, onSave, onDelete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(blank);
  const plan = useMemo(() => makePlan(form), [form]);
  if (!open) return null;

  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const addChip = (key, value) => update(key, form[key] ? `${form[key]}; ${value}` : value);
  const next = () => setStep(x => Math.min(steps.length - 1, x + 1));
  const back = () => setStep(x => Math.max(0, x - 1));
  const save = () => {
    const saved = { id: `UPG-${Date.now()}`, createdAt: new Date().toLocaleString(), ...form, plan };
    onSave(saved);
    setForm(blank);
    setStep(0);
  };

  return <div className="architect-shell" role="dialog" aria-modal="true">
    <div className="architect-orb one" /><div className="architect-orb two" />
    <section className="architect-modal">
      <header className="architect-head">
        <div><span className="architect-kicker">Fraud Academy Upgrade Lab</span><h2>🧠 Feature Architect</h2><p>Plan a new upgrade, save the idea, and keep it ready for the next build pass.</p></div>
        <button className="architect-x" onClick={onClose} aria-label="Close Feature Architect">×</button>
      </header>
      <div className="architect-steps">{steps.map((x, i) => <button key={x.key} className={i === step ? 'active' : ''} onClick={() => setStep(i)}>{x.icon}<span>{x.label}</span></button>)}</div>
      <div className="architect-body">
        {step === 0 && <Panel title="What are we building?" note="Start messy. This is where the tiny idea goblin gets a badge and a cubicle."><Field label="Feature name" value={form.title} onChange={v => update('title', v)} placeholder="Example: Login History Review" /><div className="architect-two"><Select label="Where should it live?" value={form.page} onChange={v => update('page', v)} options={['Dashboard', 'Case Queue', 'Customer 360', 'Identity Intel', 'Investigation Toolkit', 'Documents', 'Interview', 'Flags & Decision', 'Case Debrief', 'Encyclopedia']} /><Select label="Main claim type" value={form.claimType} onChange={v => update('claimType', v)} options={['Account Takeover', 'First Party Fraud', 'Chargebacks', 'Email Fraud', 'Credit Risk', 'All claim types']} /></div><Textarea label="Purpose" value={form.purpose} onChange={v => update('purpose', v)} placeholder="What should this upgrade help the investigator understand or do?" chipKey="purpose" addChip={addChip} /></Panel>}
        {step === 1 && <Panel title="How should it behave?" note="This decides how the investigator opens it, uses it, and comes back later."><Select label="How should it trigger?" value={form.trigger} onChange={v => update('trigger', v)} options={['Button / investigator opens it', 'Floating action button', 'Page-specific prompt', 'After case selection', 'After running a toolkit search']} /><Select label="When closed" value={form.closeBehavior} onChange={v => update('closeBehavior', v)} options={['Save progress and allow reopening later', 'Reset the conversation', 'Minimize into a docked bubble', 'Save as draft until finished']} /><Textarea label="User actions" value={form.userActions} onChange={v => update('userActions', v)} placeholder="What should the user click, type, filter, save, compare, or tag?" chipKey="userActions" addChip={addChip} /></Panel>}
        {step === 2 && <Panel title="How should it look?" note="Keep the banking dashboard serious, but let the purple/pink neon do its little runway walk."><Select label="Visual layout" value={form.layout} onChange={v => update('layout', v)} options={['Neon centered modal', 'Right-side investigator drawer', 'Bottom-right chat bubble', 'Full-screen command center', 'Inline dashboard card']} /><Select label="Priority" value={form.priority} onChange={v => update('priority', v)} options={['Next upgrade', 'Soon', 'Later idea', 'Research first']} /><Textarea label="Design notes" value={form.futureIdea} onChange={v => update('futureIdea', v)} placeholder="Any pretty details, animations, quick buttons, or future AI ideas?" chipKey="futureIdea" addChip={addChip} /></Panel>}
        {step === 3 && <Panel title="What realistic bank data should it create?" note="This is the good stuff: believable fictional records for training."><Textarea label="Data fields needed" value={form.dataNeeded} onChange={v => update('dataNeeded', v)} placeholder="Example: IP, device ID, first-seen date, customer ID, profile change type..." chipKey="dataNeeded" addChip={addChip} /><Textarea label="Documents or reports" value={form.documents} onChange={v => update('documents', v)} placeholder="What should Document Viewer generate from this?" chipKey="documents" addChip={addChip} /><Textarea label="Toolkit / case connections" value={form.toolkitConnection} onChange={v => update('toolkitConnection', v)} placeholder="How should this connect to Customer 360, Toolkit, Debrief, or scoring?" chipKey="toolkitConnection" addChip={addChip} /></Panel>}
        {step === 4 && <Panel title="Generated build plan" note="Saved plans will still appear next time you open Fraud Academy on this browser."><div className="architect-plan">{plan.map(([k, v]) => <div key={k} className="architect-plan-row"><b>{k}</b><span>{v}</span></div>)}</div><div className="architect-save-row"><button className="btn secondary" onClick={() => { setForm(blank); setStep(0); }}>Clear Form</button><button className="btn" disabled={!form.title.trim()} onClick={save}>Save Upgrade Plan</button></div></Panel>}
      </div>
      <footer className="architect-foot"><button className="btn secondary" disabled={step === 0} onClick={back}>← Back</button>{step < steps.length - 1 ? <button className="btn" onClick={next}>Next →</button> : <button className="btn green" disabled={!form.title.trim()} onClick={save}>Save Plan ✓</button>}</footer>
      <aside className="architect-library"><div className="architect-library-head"><h3>💾 Saved Upgrade Ideas</h3><span>{ideas.length}</span></div>{ideas.length ? ideas.slice(0, 4).map(item => <div className="architect-saved" key={item.id}><b>{item.title}</b><p>{item.page} · {item.claimType}</p><small>{item.createdAt}</small><button onClick={() => onDelete(item.id)}>Remove</button></div>) : <p className="muted">No saved upgrade plans yet. Your first one is about to hatch.</p>}</aside>
    </section>
  </div>;
}

function Panel({ title, note, children }) { return <div className="architect-panel"><h3>{title}</h3><p className="muted">{note}</p>{children}</div>; }
function Field({ label, value, onChange, placeholder }) { return <label className="architect-field"><span>{label}</span><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} /></label>; }
function Select({ label, value, onChange, options }) { return <label className="architect-field"><span>{label}</span><select value={value} onChange={e => onChange(e.target.value)}>{options.map(x => <option key={x}>{x}</option>)}</select></label>; }
function Textarea({ label, value, onChange, placeholder, chipKey, addChip }) { return <label className="architect-field"><span>{label}</span><textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows="4" />{chips[chipKey] && <div className="architect-chips">{chips[chipKey].map(chip => <button type="button" key={chip} onClick={() => addChip(chipKey, chip)}>+ {chip}</button>)}</div>}</label>; }
function makePlan(form) { const safe = (value, fallback) => value?.trim() || fallback; return [['Feature', safe(form.title, 'Untitled upgrade idea')], ['Home Page', form.page], ['Claim Focus', form.claimType], ['Purpose', safe(form.purpose, 'Needs a clear investigator purpose before build.')], ['Behavior', `${form.trigger}. Close behavior: ${form.closeBehavior}.`], ['UI Direction', `${form.layout} using Fraud Academy dark neon banking dashboard styling.`], ['Investigator Actions', safe(form.userActions, 'Define the clicks, filters, tags, and review steps.')], ['Fictional Banking Data', safe(form.dataNeeded, 'Add realistic fictional customer, account, device, transaction, or risk fields.')], ['Documents', safe(form.documents, 'Identify generated reports for Document Viewer.')], ['Connections', safe(form.toolkitConnection, 'Connect to Customer 360, Toolkit, Documents, Debrief, and scoring where useful.')], ['Priority', form.priority], ['Later Roadmap Reminder', 'Version 2: AI build assistant. Version 3: advanced reviewed app update workflow.']]; }
