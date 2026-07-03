# Fraud Academy Roadmap

## Builder Rule
When the user says **run**, run the Fraud Academy Builder workflow:
1. Review the current GitHub repository.
2. Continue from the next unchecked roadmap item.
3. Make a small safe GitHub update if possible.
4. Preserve the purple/pink neon investigator theme, React + Vite + PWA setup, mobile-friendly layout, completed-case queue behavior, Case Debrief, and claim-specific evidence flow.
5. If GitHub editing is unavailable, write the next code patch in chat so it can be applied later.

## Current Priority
- [x] Restore v15 command-center style layout.
- [x] Keep case queue, Customer 360, Identity Intel, Toolkit, Documents, Interview, Flags & Decision, Case Debrief, and Encyclopedia.
- [x] Upgrade Toolkit results from generic text to detailed fictional records.
- [ ] Rebuild Toolkit layout into grouped sections similar to v14: Account Access, Digital Signals, Money Movement, Customer Evidence, Documents, and Credit Review.
- [ ] Make active Toolkit selection visibly highlighted.
- [ ] Add richer document chips/cards from Toolkit results that open the Document Viewer.
- [ ] Upgrade Document Viewer so each document looks like a detailed fictional record instead of a simple placeholder.
- [ ] Upgrade Customer 360 with relationship age, prior cases, accounts, trusted devices, contact history, and behavioral profile.
- [ ] Upgrade Identity Intel with tabbed results: Overview, Addresses, Phones, Emails, Associates, Applications, Alerts, and Documents.
- [ ] Upgrade Interview into a deeper branching conversation by claim type.
- [ ] Improve Case Debrief so it references the exact flags, tools, documents, and interview answers the user reviewed.
- [ ] Add unlimited generated cases with varied evidence and outcomes.
- [ ] Add XP, levels, badges, and achievements.
- [ ] Add polish: animations, mobile spacing, card transitions, empty states, and install prompts.

## Design Direction
Fraud Academy should feel like a fictional internal bank fraud investigator workstation, not a basic tutorial app. Keep it colorful, professional, and mobile-first with a purple/pink neon detective style.

## Claim Types To Preserve
- Account Takeover
- Email Fraud / BEC
- First-Party Fraud
- Chargeback
- ACH / Wire style fraud scenarios
- Application Verification
- Credit Risk
- Business Verification / KYB

## Next Builder Step
Build the grouped Toolkit layout first. Do not rewrite the whole app. Make a small working patch that improves the existing Toolkit screen and keeps the current detailed toolkit records working.
