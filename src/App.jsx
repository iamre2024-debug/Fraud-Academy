import { useEffect, useMemo, useState } from 'react';
import CaseQueue from './components/CaseQueue.jsx';
import VisualWorkspace from './components/VisualWorkspace.jsx';
import FeatureArchitect from './FeatureArchitect.jsx';
import { BUILT_IN_CASES, generateCase } from './data/cases.js';

const STORE = 'fraud-academy-v23-stable-package-flow';

function baseState() {
  return {
    page: 'Case Queue',
    cases: BUILT_IN_CASES,
    selectedId: BUILT_IN_CASES[0].id,
    generatedCount: 0,
    submissions: [],
    progress: { completedCases: 0, packagesSubmitted: 0, toolsReviewed: 0, goal: 3 },
    architectOpen: false,
    featureIdeas: [],
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE));
    if (!saved) return baseState();
    const mergedCases = [...BUILT_IN_CASES, ...(saved.cases || []).filter((item) => item.source === 'generated')];
    return { ...baseState(), ...saved, cases: dedupeCases(mergedCases), architectOpen: false };
  } catch {
    return baseState();
  }
}

export default function App() {
  const [state, setState] = useState(loadState);
  const current = useMemo(
    () => state.cases.find((item) => item.id === state.selectedId) || state.cases[0],
    [state.cases, state.selectedId],
  );
  const latestSubmission = state.submissions[0] || null;

  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify({ ...state, architectOpen: false }));
  }, [state]);

  function openCase(caseId) {
    setState((previous) => ({ ...previous, selectedId: caseId, page: 'Investigation Workspace' }));
  }

  function generateAndOpen() {
    setState((previous) => {
      const generatedCount = previous.generatedCount + 1;
      const generated = generateCase(Date.now() + generatedCount);
      return {
        ...previous,
        generatedCount,
        cases: [generated, ...previous.cases],
        selectedId: generated.id,
        page: 'Investigation Workspace',
      };
    });
  }

  function submitPackage(packageData) {
    setState((previous) => {
      const alreadySubmitted = previous.submissions.some((item) => item.caseId === packageData.caseId);
      if (alreadySubmitted) return previous;
      const submission = { ...packageData, submittedAt: new Date().toISOString() };
      return {
        ...previous,
        submissions: [submission, ...previous.submissions],
        progress: {
          ...previous.progress,
          completedCases: previous.progress.completedCases + 1,
          packagesSubmitted: previous.progress.packagesSubmitted + 1,
          toolsReviewed: previous.progress.toolsReviewed + packageData.selectedTools.length,
        },
      };
    });
  }

  function resetTraining() {
    setState(baseState());
  }

  function saveIdea(idea) {
    setState((previous) => ({ ...previous, featureIdeas: [idea, ...previous.featureIdeas] }));
  }

  function deleteIdea(id) {
    setState((previous) => ({ ...previous, featureIdeas: previous.featureIdeas.filter((idea) => idea.id !== id) }));
  }

  return (
    <div className="app-shell">
      <aside className="global-sidebar">
        <div className="brand-lockup"><div className="brand-mark">FA</div><div><h1>Fraud Academy</h1><p>Investigation OS</p></div></div>
        <nav className="sidebar-nav">
          <button className={state.page === 'Case Queue' ? 'active' : ''} onClick={() => setState((p) => ({ ...p, page: 'Case Queue' }))}><span>▤</span>Case Queue</button>
          <button className={state.page === 'Investigation Workspace' ? 'active' : ''} onClick={() => setState((p) => ({ ...p, page: 'Investigation Workspace' }))}><span>✦</span>Investigation Workspace</button>
          <button className={state.page === 'Academy Progress' ? 'active' : ''} onClick={() => setState((p) => ({ ...p, page: 'Academy Progress' }))}><span>☆</span>Academy Progress</button>
        </nav>
        <div className="luna-card"><div className="luna-cat">🐈‍⬛</div><b>Luna AI Mentor</b><p>Process coaching stays separate from the final decision until the package is submitted.</p></div>
        <button className="current-case-card" onClick={() => setState((p) => ({ ...p, page: 'Investigation Workspace' }))}><span>Current Case</span><b>{current?.id}</b><small>{current?.type}</small></button>
      </aside>

      <main className="workspace-main">
        <header className="topbar">
          <div><p className="eyebrow">Stable Luna / package flow</p><h2>{state.page}</h2><p className="muted">Evidence first. Neutral tools. Defensible decisions.</p></div>
          <div className="top-actions"><span className="pill xp">💎 {state.progress.toolsReviewed * 50} XP</span><span className="pill glow">{state.progress.packagesSubmitted} Packages</span><button className="soft-btn" onClick={resetTraining}>Reset Training</button></div>
        </header>

        {state.page === 'Case Queue' && <CaseQueue cases={state.cases} currentId={state.selectedId} onOpenCase={openCase} onGenerate={generateAndOpen} />}
        {state.page === 'Investigation Workspace' && <VisualWorkspace current={current} progress={state.progress} latestSubmission={latestSubmission} onSubmitPackage={submitPackage} />}
        {state.page === 'Academy Progress' && <AcademyProgress state={state} onOpenCase={openCase} />}
      </main>

      <button className="architect-fab" onClick={() => setState((p) => ({ ...p, architectOpen: true }))}>✨<span>New Upgrade Idea</span></button>
      <FeatureArchitect open={state.architectOpen} ideas={state.featureIdeas} onClose={() => setState((p) => ({ ...p, architectOpen: false }))} onSave={saveIdea} onDelete={deleteIdea} />
    </div>
  );
}

function AcademyProgress({ state, onOpenCase }) {
  const percent = Math.min(100, Math.round((state.progress.completedCases / state.progress.goal) * 100));
  return (
    <section className="dashboard-polish">
      <div className="dash-hero cute-sparkles"><div><p className="eyebrow">Academy Progress ✦</p><h2>Luna package progress is connected</h2><p>Progress changes only after an investigator submits a complete package.</p></div><div className="hero-mascot">🐈‍⬛🌙</div></div>
      <div className="dash-stats">
        <Stat label="Daily Goal" value={`${percent}%`} />
        <Stat label="Cases Completed" value={state.progress.completedCases} />
        <Stat label="Packages Submitted" value={state.progress.packagesSubmitted} />
        <Stat label="Tools Reviewed" value={state.progress.toolsReviewed} />
      </div>
      <div className="panel xl"><h3>Submission History</h3>{state.submissions.length ? state.submissions.map((item) => <button className="case-card" key={item.caseId} onClick={() => onOpenCase(item.caseId)}><b>{item.caseId}</b><small>{item.decision} · {item.selectedTools.length} tools</small><p>{item.notes}</p></button>) : <p className="muted">No packages submitted yet. Complete evidence review in the workspace first.</p>}</div>
    </section>
  );
}

function Stat({ label, value }) {
  return <div className="cute-stat"><span>✦</span><b>{value}</b><small>{label}</small></div>;
}

function dedupeCases(cases) {
  return [...new Map(cases.map((item) => [item.id, item])).values()];
}
