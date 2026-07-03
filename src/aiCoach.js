const strongEvidenceByType = {
  'Account Takeover': ['Login History', 'Device Fingerprint', 'IP Lookup', 'MFA History', 'Password Reset History'],
  'First-Party Fraud': ['Merchant Evidence', 'Shipping Records', 'Previous Claims', 'Proof of Delivery', 'Merchant Receipt'],
  Chargeback: ['Transaction History With Merchant', 'Authorization Review', 'Merchant Evidence', 'Reason Code Guide', 'Customer Statement'],
  'Credit Risk': ['Income Verification', 'Employment Verification', 'Debt-to-Income Calculator', 'Credit Report Summary', 'Cash Flow Review', 'Bank Statements'],
  'Application Verification': ['Profile Verify', 'Driver License Review', 'Selfie Verification', 'Address Verification', 'Phone Verification', 'Device Fingerprint'],
  'Email Fraud / BEC': ['Email Headers', 'Domain Lookup', 'Sender Analysis', 'Beneficiary Review', 'Payment Timeline', 'Wire History'],
};

const seniorTips = {
  'Account Takeover': 'A senior investigator compares profile-change timing, new-device enrollment, MFA events, and customer interview details before deciding.',
  'First-Party Fraud': 'A senior investigator does not stop at the customer statement. They compare delivery proof, merchant evidence, and repeat claim behavior.',
  Chargeback: 'A senior investigator checks network-style dispute logic: authorization, customer participation, merchant evidence, and whether partial credit is more accurate.',
  'Credit Risk': 'A senior investigator separates fraud risk from credit risk, then verifies income, employment, debt load, cash flow, and support documents.',
  'Application Verification': 'A senior investigator checks identity consistency across profile data, documents, device signals, address history, and phone/email ownership.',
  'Email Fraud / BEC': 'A senior investigator follows the payment-change trail: email headers, domain age, beneficiary history, callback controls, and payment timing.',
};

function includesAny(text, values) {
  const lower = text.toLowerCase();
  return values.some((value) => lower.includes(value.toLowerCase()));
}

export function getAICoachReview(caseData) {
  if (!caseData) {
    return {
      tone: 'neutral',
      headline: 'Complete a case to unlock AI Coach feedback.',
      confidence: 0,
      verdict: 'No case reviewed yet.',
      why: [],
      missed: [],
      next: [],
      seniorTip: 'Finish an investigation first, then review the coach feedback.',
    };
  }

  const correct = caseData.decision === caseData.correct;
  const redFlags = (caseData.flags || []).filter((flag) => flag.kind === 'red');
  const greenFlags = (caseData.flags || []).filter((flag) => flag.kind === 'green');
  const docs = caseData.docs || [];
  const interview = caseData.interview || [];
  const notes = Array.isArray(caseData.notes) ? caseData.notes.join(' ') : String(caseData.notes || '');
  const evidenceText = [
    ...redFlags.map((flag) => flag.text),
    ...greenFlags.map((flag) => flag.text),
    ...docs,
    ...interview.map((entry) => `${entry.q} ${entry.a}`),
    notes,
  ].join(' ');

  const expectedEvidence = strongEvidenceByType[caseData.type] || [];
  const reviewedEvidence = expectedEvidence.filter((item) => includesAny(evidenceText, [item]));
  const missedEvidence = expectedEvidence.filter((item) => !reviewedEvidence.includes(item));

  const confidence = Math.min(
    98,
    Math.max(
      45,
      50 + reviewedEvidence.length * 8 + docs.length * 4 + interview.length * 3 + redFlags.length * 4 + greenFlags.length * 3 + (correct ? 12 : -8),
    ),
  );

  const why = [];
  if (correct) {
    why.push(`Your judgment matched the recommended outcome: ${caseData.correct}.`);
  } else {
    why.push(`Your judgment was ${caseData.decision}, but the recommended outcome was ${caseData.correct}.`);
  }

  if (reviewedEvidence.length) {
    why.push(`You reviewed or tagged useful evidence: ${reviewedEvidence.slice(0, 4).join(', ')}.`);
  }

  if (redFlags.length) {
    why.push(`You identified ${redFlags.length} red flag(s), which helps support risk-based reasoning.`);
  }

  if (greenFlags.length) {
    why.push(`You also tagged ${greenFlags.length} green flag(s), which helps balance the decision instead of only looking for fraud.`);
  }

  const missed = missedEvidence.slice(0, 5).map((item) => `Review ${item} before making a final decision.`);
  if (!docs.length) missed.push('Request at least one supporting document before closing the case.');
  if (!interview.length) missed.push('Ask at least one interview question to compare the customer story against the records.');
  if (!redFlags.length && !greenFlags.length) missed.push('Tag evidence as red or green so your reasoning is visible in the debrief.');

  const next = [
    'Compare the customer story against the timeline and documents.',
    'Separate confirmed evidence from assumptions.',
    'Write one sentence explaining why your decision fits the strongest evidence.',
  ];

  return {
    tone: correct ? 'good' : 'bad',
    headline: correct ? 'Good judgment. Your decision matches the case evidence.' : 'Review needed. Your decision did not match the strongest evidence.',
    confidence,
    verdict: correct ? 'Decision matched' : 'Decision mismatch',
    why,
    missed,
    next,
    seniorTip: seniorTips[caseData.type] || 'A senior investigator checks the strongest evidence, then explains the decision clearly.',
  };
}
