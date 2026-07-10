export default function CaseQueue({ cases, currentId, onOpenCase, onGenerate }) {
  return (
    <section className="queue-layout">
      <div className="queue-list">
        <div className="section-head">
          <div><p className="eyebrow">Training queue</p><h3>Case Queue</h3></div>
          <button type="button" onClick={onGenerate}>Generate & Open Case ✦</button>
        </div>
        {cases.map((caseItem) => (
          <button
            key={caseItem.id}
            type="button"
            className={`case-card ${currentId === caseItem.id ? 'active' : ''}`}
            onClick={() => onOpenCase(caseItem.id)}
          >
            <span className="case-id">{caseItem.id}</span>
            <b>{caseItem.type}</b>
            <small>{caseItem.customer} · {caseItem.priority} · {caseItem.source}</small>
            <p>{caseItem.summary}</p>
          </button>
        ))}
      </div>
      <aside className="queue-side">
        <div className="panel cute-tip">
          <h3>Instant-open check 🌙</h3>
          <p>Generated cases are inserted into state, selected, and opened in the workspace in the same click. No refresh or storage round-trip is required.</p>
        </div>
      </aside>
    </section>
  );
}
