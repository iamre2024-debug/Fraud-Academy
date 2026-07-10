import { useCallback, useEffect, useMemo, useState } from 'react';
import CaseQueue from './components/CaseQueue.jsx';
import VisualWorkspace from './components/VisualWorkspace.jsx';
import FeatureArchitect from './FeatureArchitect.jsx';
import { BUILT_IN_CASES, generateCase } from './data/cases.js';

const STORE = 'fraud-academy-v24-integrated-case-flow';
const EMPTY_WORK = { activeLane: '', selectedTools: [], notes: '', decision: '' };

function baseState() {
  return {
    page: 'Case Queue', cases: BUILT_IN_CASES, selectedId: BUILT_IN_CASES[0].id,
    generatedCount: 0, submissions: [], completed: [], workByCase: {},
    progress: { completedCases: 0, packagesSubmitted: 0, toolsReviewed: 0, goal: 3 },
    architectOpen: false, featureIdeas: [],
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE));
    if (!saved) return baseState();
    const completedIds = new Set((saved.completed || []).map((item) => item.id));
    const activeBuiltIns = BUILT_IN_CASES.filter((item) => !completedIds.has(item.id));
    const generated = (saved.cases || []).filter((item) => item.source === 'generated');
    const cases = dedupeCases([...generated, ...activeBuiltIns]);
    return { ...baseState(), ...saved, cases, selectedId: cases.some((item) => item.id === saved.selectedId) ? saved.selectedId : cases[0]?.id || '', architectOpen: false };
  } catch { return baseState(); }
}

export default function App() {
  const [state, setState] = useState(loadState);
  const current = useMemo(() => state.cases.find((item) => item.id === state.selectedId) || state.cases[0] || null, [state.cases, state.selectedId]);
  const latestSubmission = useMemo(() => state.submissions.find((item) => item.caseId === current?.id) || null, [current?.id, state.submissions]);
  const currentWork = current ? state.workByCase[current.id] || EMPTY_WORK : EMPTY_WORK;

  useEffect(() => localStorage.setItem(STORE, JSON.stringify({ ...state, architectOpen: false })), [state]);

  const openCase = (caseId) => setState((previous) => ({ ...previous, selectedId: caseId, page: 'Investigation Workspace' }));

  function generateAndOpen() {
    setState((previous) => {
      const generatedCount = previous.generatedCount + 1;
      const generated = generateCase(Date.now() + generatedCount);
      return { ...previous, generatedCount, cases: [generated, ...previous.cases], selectedId: generated.id, page: 'Investigation Workspace' };
    });
  }

  const updateCurrentWork = useCallback((patch) => {
    setState((previous) => {
      if (!previous.selectedId) return previous;
      return { ...previous, workByCase: { ...previous.workByCase, [previous.selectedId]: { ...(previous.workByCase[previous.selectedId] || EMPTY_WORK), ...patch } } };
    });
  }, []);

  function submitPackage(packageData) {
    setState((previous) => {
      if (previous.submissions.some((item) => item.caseId === packageData.caseId)) return previous;
      const activeCase = previous.cases.find((item) => item.id === packageData.caseId);
      if (!activeCase) return previous;
      const submission = { ...packageData, submittedAt: new Date().toISOString() };
      const remaining = previous.cases.filter((item) => item.id !== packageData.caseId);
      return {
        ...previous, submissions: [submission, ...previous.submissions],
        completed: [{ ...activeCase, status: 'Completed', submission }, ...previous.completed],
        cases: remaining, selectedId: remaining[0]?.id || '', page: 'Academy Progress',
        progress: { ...previous.progress, completedCases: previous.progress.completedCases + 1, packagesSubmitted: previous.progress.packagesSubmitted + 1, toolsReviewed: previous.progress.toolsReviewed + packageData.selectedTools.length },
      };
    });
  }

  function resetTraining() { localStorage.removeItem(STORE); setState(baseState()); }
  const saveIdea = (idea) => setState((previous) => ({ ...previous, featureIdeas: [idea, ...previous.featureIdeas] }));
  const deleteIdea = (id) => setState((previous) => ({ ...previous, featureIdeas: previous.featureIdeas.filter((idea) => idea.id !== id) }));

  return <div className="app-shell">
    <aside className="global-sidebar">
      <div className="brand-lockup"><div className="brand-mark">FA</div><div><h1>Fraud Academy</h1><p>Investigation OS</p></div></div>
      <nav className="sidebar-nav">
        <button className={state.page === 'Case Queue' ? 'active' : ''} onClick={() => setState((p) => ({ ...p, page: 'Case Queue' }))}><span>▤</span>Case Queue</button>
        <button className={state.page === 'Investigation Workspace' ? 'active' : ''} onClick={() => setState((p) => ({ ...p, page: 'Investigation Workspace' }))}><span>✦</span>Investigation Workspace</button>
        <button className={state.page === 'Academy Progress' ? 'active' : ''} onClick={() => setState((p) => ({ ...p, page: 'Academy Progress' }))}><span>☆</span>Academy Progress</button>
      </nav>
      <div className="luna-card"><div className="luna-cat">🐈‍⬛</div><b>Luna AI Mentor</b><p>Process coaching stays separate from the final decision until the package is submitted.</p></div>
      <button className="current-case-card" disabled={!current} onClick={() => setState((p) => ({ ...p, page: 'Investigation Workspace' }))}><span>Current Case</span><b>{current?.id || 'Queue Clear'}</b><small>{current?.type || 'No active case'}</small></button>
    </aside>
    <main className="workspace-main">
      <header className="topbar"><div><p className="eyebrow">Stable Luna / package flow</p><h2>{state.page}</h2><p className="muted">Evidence first. Neutral tools. Defensible decisions.</p></div><div className="top-actions"><span className="pill xp">💎 {state.progress.toolsReviewed * 50} XP</span><span className="pill glow">{state.progress.packagesSubmitted} Packages</span><button className="soft-btn" onClick={resetTraining}>Reset Training</button></div></header>
      {state.page === 'Case Queue' && <CaseQueue cases={state.cases} currentId={state.selectedId} completedCount={state.completed.length} onOpenCase={openCase} onGenerate={generateAndOpen} />}
      {state.page === 'Investigation Workspace' && <VisualWorkspace current={current} progress={state.progress} latestSubmission={latestSubmission} caseWork={currentWork} onUpdateCaseWork={updateCurrentWork} onSubmitPackage={submitPackage} />}
      {state.page === 'Academy Progress' && <AcademyProgress state={state} />}
    </main>
    <button className="architect-fab" onClick={() => setState((p) => ({ ...p, architectOpen: true }))}>✨<span>New Upgrade Idea</span></button>
    <FeatureArchitect open={state.architectOpen} ideas={state.featureIdeas} onClose={() => setState((p) => ({ ...p, architectOpen: false }))} onSave={saveIdea} onDelete={deleteIdea} />
  </div>;
}

function AcademyProgress({ state }) {
  const percent = Math.min(100, Math.round((state.progress.completedCases / state.progress.goal) * 100));
  return <section className="dashboard-polish">
    <div className="dash-hero cute-sparkles"><div><p className="eyebrow">Academy Progress ✦</p><h2>Luna package progress is connected</h2><p>Progress changes only after an investigator submits a complete package.</p></div><div className="hero-mascot">🐈‍⬛🌙</div></div>
    <div className="dash-stats"><Stat label="Daily Goal" value={`${percent}%`} /><Stat label="Cases Completed" value={state.progress.completedCases} /><Stat label="Packages Submitted" value={state.progress.packagesSubmitted} /><Stat label="Tools Reviewed" value={state.progress.toolsReviewed} /></div>
    <div className="panel xl"><h3>Completed Case History</h3>{state.completed.length ? state.completed.map((item) => <article className="case-card" key={item.id}><b>{item.id}</b><small>{item.submission.decision} · {item.submission.selectedTools.length} tools</small><p>{item.submission.notes}</p></article>) : <p className="muted">No packages submitted yet. Complete evidence review in the workspace first.</p>}</div>
  </section>;
}

function Stat({ label, value }) { return <div className="cute-stat"><span>✦</span><b>{value}</b><small>{label}</small></div>; }
function dedupeCases(cases) { return [...new Map(cases.map((item) => [item.id, item])).values()]; }
