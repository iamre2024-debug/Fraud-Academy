export default function ToolPanel({ lane, selectedTools, onToggleTool }) {
  return (
    <section className="panel xl workspace-tool-panel">
      <p className="eyebrow">Investigator question</p>
      <h3>{lane.label}</h3>
      <p>{lane.question}</p>
      <div className="tool-grid">
        {lane.tools.map((tool) => {
          const selected = selectedTools.includes(tool.id);
          return (
            <button
              key={tool.id}
              type="button"
              className={`doc-chip ${selected ? 'active' : ''}`}
              onClick={() => onToggleTool(tool.id)}
              aria-pressed={selected}
            >
              <span>{selected ? '✓' : '＋'}</span> {tool.label}
              <small>{tool.requiresSearch ? 'Search required' : 'Context tool'} · {tool.reportDepth}</small>
            </button>
          );
        })}
      </div>
      <p className="muted">Selected tools become part of the investigator package. They do not reveal a decision.</p>
    </section>
  );
}
