# Fraud Academy Changelog

## 2026-07-06

### Added
- Upgraded `Customer 360` inside `src/App.jsx` with tabbed sections for Overview, Account History, Devices, Locations, Accounts, Prior Fraud, Contact History, Behavior, and Notes.

### Improved
- Customer 360 now keeps the existing purple/pink command-center layout while making customer context easier to review one investigation area at a time.
- Added direct action paths from Customer 360 tabs into Device Intel, Login History, Customer Contact & Interview, Financial Investigation, and Evidence Center.
- Added neutral investigator reminders so Customer 360 stays context-focused instead of making the final determination early.

### Current Next Step
Upgrade Identity Intel with tabbed results: Overview, Addresses, Phones, Emails, Associates, Applications, Alerts, and Documents.

## 2026-07-05

### Added
- Expanded `src/documentReports.js` with document-specific templates for Driver License, Bank Statement, Paystub, Police Report, Merchant Receipt, Business License, Authorization Log, Order Match Sheet, Payment Timeline, Carrier Timeline, and Prior Claims Memo.

### Improved
- Document Viewer 2.0 now gives more realistic fictional banking records with report sections, investigator notes, confidence, and training tips instead of falling back to generic document text for those records.
- Kept the existing layout, purple/pink neon theme, React + Vite + PWA structure, and mobile-friendly design intact.

### Current Next Step
Upgrade Customer 360 with tabs or collapsible sections: Overview, Account History, Devices, Locations, Accounts, Prior Fraud, Contact History, Behavior, and Notes.

## 2026-07-04

### Added
- Added `src/toolkitPolish.css` as a safe polish layer for active Toolkit selection styling.

### Improved
- Active Toolkit buttons now show a stronger selected state with neon border, glow, gradient depth, a selected badge, and better keyboard focus styling.
- Kept the existing page layout, purple/pink neon theme, React + Vite + PWA structure, and mobile-friendly behavior intact.

### Current Next Step
Expand Document Viewer 2.0 with more document-specific templates for every requested record.

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
- Added `src/documentReports.js` so Document Viewer records now show status, confidence, report details, investigator notes, and training tips.
- Added `src/interviewScripts.js` so interviews now return claim-specific answers, tone, credibility, and clues instead of repeating the same response.
- Added `Session History` as an Account Takeover investigation tool.
- Added document reports for `Profile Change History` and `Session History`.
- Expanded Customer 360 with account/client history: profile changes, known devices, known locations, customer since, products, prior claims, contact history, prior fraud, and behavior patterns.

### Fixed
- Fixed case selection flow.
- Fixed Interview buttons so question taps add transcript entries.
- Improved mobile responsiveness and visual polish.
- Improved Toolkit active selection data flow by tracking the selected tool in button state.
- Moved `Profile Change History` out of the ATO Toolkit and into Customer 360 account history.
- Updated AI Coach evidence matching so Profile Change History and Session History count as core Account Takeover evidence.

### Current Next Step
Keep the current layout stable. Next, deepen Customer 360 with tabs or collapsible sections, then add more document-specific templates.
