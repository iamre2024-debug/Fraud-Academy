export default function LunaProgress({ progress, latestSubmission }) {
  const percent = Math.min(100, Math.round((progress.completedCases / Math.max(progress.goal, 1)) * 100));
  return (
    <aside className="panel luna-progress-card">
      <div className="luna-cat">🐈‍⬛</div>
      <p className="eyebrow">Luna + Academy Progress</p>
      <h3>{latestSubmission ? 'Package reviewed' : 'Evidence first, decision later'}</h3>
      <div className="progress-ring"><b>{percent}%</b><span>Daily goal</span></div>
      <div className="evidence-line">Completed cases: {progress.completedCases}</div>
      <div className="evidence-line">Packages submitted: {progress.packagesSubmitted}</div>
      <div className="evidence-line">Tools reviewed: {progress.toolsReviewed}</div>
      <p className="muted">
        {latestSubmission
          ? `Luna saved the package for ${latestSubmission.caseId}. Progress updated without changing the active evidence.`
          : 'Luna can coach the process, but will not reveal a score or answer before submission.'}
      </p>
    </aside>
  );
}
