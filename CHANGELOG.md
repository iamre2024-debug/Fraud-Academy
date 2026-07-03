# Fraud Academy Changelog

## 2026-07-03

### Added
- Created a React + Vite + PWA foundation for Fraud Academy.
- Restored the v15 command-center style inspired by the original single-file HTML app.
- Added core pages: Dashboard, Case Queue, Customer 360, Identity Intel, Investigation Toolkit, Documents, Interview, Flags & Decision, Case Debrief, and Encyclopedia.
- Added saved progress through browser local storage.
- Added completed-case behavior so closed cases are removed from the active queue.
- Added claim-specific tools for Account Takeover, First-Party Fraud, Chargeback, Credit Risk, Application Verification, and Email Fraud / BEC.
- Added detailed fictional Toolkit records through `src/toolkitRecords.js`.
- Added Toolkit-related document opening flow.
- Added stronger mobile command-center styling.
- Added `ROADMAP.md` for future builder runs.
- Added AI Coach Debrief through `src/aiCoach.js` to explain whether the user's judgment matched, why it was right or wrong, what evidence was missed, and what a senior investigator would check next.

### Fixed
- Fixed case selection flow.
- Fixed Interview buttons so question taps add transcript entries.
- Improved mobile responsiveness and visual polish.

### Current Next Step
Keep the current layout stable. Next, deepen the existing screens with Document Viewer 2.0, better Customer 360 records, and stronger evidence matching in Case Debrief.