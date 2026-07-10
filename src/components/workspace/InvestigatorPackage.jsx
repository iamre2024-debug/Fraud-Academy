export default function InvestigatorPackage({ current, selectedTools, notes, decision, onNotesChange, onDecisionChange, onSubmit, submitted }) {
  function submit(event) {
    event.preventDefault();
    if (!decision || !notes.trim() || selectedTools.length === 0) return;
    onSubmit({ decision, notes: notes.trim(), selectedTools });
  }

  return (
    <form className="panel investigator-package" onSubmit={submit}>
      <p className="eyebrow">Stable case package</p>
      <h3>Investigator Package</h3>
      <div className="evidence-line">Case: {current?.id}</div>
      <div className="evidence-line">Tools reviewed: {selectedTools.length}</div>
      <label htmlFor="investigator-notes">Investigator notes</label>
      <textarea
        id="investigator-notes"
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        placeholder="Document what supports, contradicts, or adds context to the claim."
        rows={7}
      />
      <label htmlFor="case-decision">Final review decision</label>
      <select id="case-decision" value={decision} onChange={(event) => onDecisionChange(event.target.value)}>
        <option value="">Choose after evidence review</option>
        <option>Claim Supported</option>
        <option>Claim Not Supported</option>
        <option>More Review Needed</option>
        <option>Escalate</option>
      </select>
      <button type="submit" disabled={!decision || !notes.trim() || selectedTools.length === 0 || submitted}>
        {submitted ? 'Package Submitted ✓' : 'Submit Investigator Package'}
      </button>
    </form>
  );
}
