import { useEffect, useMemo } from 'react';
import CategorySwitcher from './workspace/CategorySwitcher.jsx';
import InvestigatorPackage from './workspace/InvestigatorPackage.jsx';
import LunaProgress from './workspace/LunaProgress.jsx';
import ToolPanel from './workspace/ToolPanel.jsx';
import { getDefaultLane, getToolLanes } from './workspace/toolCatalog.js';

const EMPTY_WORK = { activeLane: '', selectedTools: [], notes: '', decision: '' };

export default function VisualWorkspace({ current, progress, latestSubmission, caseWork = EMPTY_WORK, onUpdateCaseWork, onSubmitPackage }) {
  const lanes = useMemo(() => getToolLanes(current), [current]);
  const activeLane = caseWork.activeLane || getDefaultLane(current, lanes);
  const lane = lanes.find((item) => item.id === activeLane) || lanes[0];
  const submitted = latestSubmission?.caseId === current?.id;

  useEffect(() => {
    if (!current?.id || caseWork.activeLane || !lanes.length) return;
    onUpdateCaseWork({ activeLane: getDefaultLane(current, lanes) });
  }, [caseWork.activeLane, current, lanes, onUpdateCaseWork]);

  function toggleTool(toolId) {
    const selectedTools = caseWork.selectedTools || [];
    onUpdateCaseWork({
      selectedTools: selectedTools.includes(toolId)
        ? selectedTools.filter((item) => item !== toolId)
        : [...selectedTools, toolId],
    });
  }

  if (!current || !lane) return <section className="panel"><h3>Select a case to begin.</h3></section>;

  return (
    <section className="visual-workspace">
      <div className="panel xl workspace-case-header">
        <p className="eyebrow">Active investigation</p>
        <h2>{current.type}</h2>
        <p>{current.summary}</p>
        <div className="metric-grid">
          <Metric label="Case" value={current.id} />
          <Metric label="Customer / Party" value={current.customer} />
          <Metric label="Amount" value={`$${current.amount.toLocaleString()}`} />
          <Metric label="Difficulty" value={current.difficulty} />
        </div>
      </div>

      <CategorySwitcher lanes={lanes} activeLane={activeLane} onChange={(value) => onUpdateCaseWork({ activeLane: value })} />

      <div className="workspace-grid">
        <ToolPanel lane={lane} selectedTools={caseWork.selectedTools || []} onToggleTool={toggleTool} />
        <LunaProgress progress={progress} latestSubmission={latestSubmission} />
      </div>

      <InvestigatorPackage
        current={current}
        selectedTools={caseWork.selectedTools || []}
        notes={caseWork.notes || ''}
        decision={caseWork.decision || ''}
        onNotesChange={(notes) => onUpdateCaseWork({ notes })}
        onDecisionChange={(decision) => onUpdateCaseWork({ decision })}
        submitted={submitted}
        onSubmit={(packageData) => onSubmitPackage({ ...packageData, caseId: current.id })}
      />
    </section>
  );
}

function Metric({ label, value }) {
  return <div className="metric"><small>{label}</small><b>{value}</b></div>;
}
