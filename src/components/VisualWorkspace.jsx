import { useEffect, useMemo, useState } from 'react';
import CategorySwitcher from './workspace/CategorySwitcher.jsx';
import InvestigatorPackage from './workspace/InvestigatorPackage.jsx';
import LunaProgress from './workspace/LunaProgress.jsx';
import ToolPanel from './workspace/ToolPanel.jsx';
import { TOOL_LANES, getDefaultLane } from './workspace/toolCatalog.js';

export default function VisualWorkspace({ current, progress, latestSubmission, onSubmitPackage }) {
  const [activeLane, setActiveLane] = useState(() => getDefaultLane(current));
  const [selectedTools, setSelectedTools] = useState([]);
  const [notes, setNotes] = useState('');
  const submitted = latestSubmission?.caseId === current?.id;

  useEffect(() => {
    setActiveLane(getDefaultLane(current));
    setSelectedTools([]);
    setNotes('');
  }, [current?.id]);

  const lane = useMemo(
    () => TOOL_LANES.find((item) => item.id === activeLane) || TOOL_LANES[0],
    [activeLane],
  );

  function toggleTool(tool) {
    setSelectedTools((items) => items.includes(tool) ? items.filter((item) => item !== tool) : [...items, tool]);
  }

  return (
    <section className="visual-workspace">
      <div className="panel xl workspace-case-header">
        <p className="eyebrow">Active investigation</p>
        <h2>{current?.type || 'Select a case'}</h2>
        <p>{current?.summary}</p>
        <div className="metric-grid">
          <Metric label="Case" value={current?.id || '—'} />
          <Metric label="Customer / Party" value={current?.customer || '—'} />
          <Metric label="Amount" value={current ? `$${current.amount.toLocaleString()}` : '—'} />
          <Metric label="Difficulty" value={current?.difficulty || '—'} />
        </div>
      </div>

      <CategorySwitcher lanes={TOOL_LANES} activeLane={activeLane} onChange={setActiveLane} />

      <div className="workspace-grid">
        <ToolPanel lane={lane} selectedTools={selectedTools} onToggleTool={toggleTool} />
        <LunaProgress progress={progress} latestSubmission={latestSubmission} />
      </div>

      <InvestigatorPackage
        current={current}
        selectedTools={selectedTools}
        notes={notes}
        onNotesChange={setNotes}
        submitted={submitted}
        onSubmit={(packageData) => onSubmitPackage({ ...packageData, caseId: current.id })}
      />
    </section>
  );
}

function Metric({ label, value }) {
  return <div className="metric"><small>{label}</small><b>{value}</b></div>;
}
