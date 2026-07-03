const strongEvidenceByType = {
  'Account Takeover': ['Login History', 'Profile Change History', 'Session History', 'Device Fingerprint', 'IP Lookup', 'MFA History', 'Password Reset History'],
  'First-Party Fraud': ['Merchant Evidence', 'Shipping Records', 'Previous Claims', 'Proof of Delivery', 'Merchant Receipt'],
  Chargeback: ['Transaction History With Merchant', 'Authorization Review', 'Merchant Evidence', 'Reason Code Guide', 'Customer Statement'],
  'Credit Risk': ['Income Verification', 'Employment Verification', 'Debt-to-Income Calculator', 'Credit Report Summary', 'Cash Flow Review', 'Bank Statements'],
  'Application Verification': ['Profile Verify', 'Driver License Review', 'Selfie Verification', 'Address Verification', 'Phone Verification', 'Device Fingerprint'],
  'Email Fraud / BEC': ['Email Headers', 'Domain Lookup', 'Sender Analysis', 'Beneficiary Review', 'Payment Timeline', 'Wire History'],
};

const riskPatterns = {
  'Account Takeover': {
    red: ['new device', 'new network', 'password reset', 'profile change', 'session behavior', 'otp', 'mfa', 'newly added phone'],
    green: ['trusted device', 'normal customer region', 'no risky profile change', 'known behavior'],
    misleading: 'A passed MFA challenge can look legitimate, but it can still be part of social engineering if the contact method changed first.',
    seniorTip: 'A senior investigator builds the event order first: login, profile change, session activity, MFA, device enrollment, and loss event.',
    skills: ['ATO login timeline review', 'Profile-change and session review', 'Device and network analysis'],
  },
  'First-Party Fraud': {
    red: ['proof of delivery', 'prior claims', 'repeated', 'signed proof', 'delivery photo', 'merchant evidence'],
    green: ['incomplete packet', 'signature missing', 'merchant packet has gaps', 'isolated event'],
    misleading: 'A customer denial can sound convincing even when delivery proof and repeat claim behavior tell a different story.',
    seniorTip: 'A senior investigator compares merchant proof, delivery details, and prior claim behavior before deciding.',
    skills: ['First-party fraud pattern review', 'Merchant evidence analysis', 'Non-receipt claim review'],
  },
  Chargeback: {
    red: ['avs full match', 'cvv match', 'otp passed', 'prior purchases', 'merchant relationship'],
    green: ['partial avs', 'different shipping address', 'new email', 'customer statement', 'merchant packet has gaps'],
    misleading: 'A familiar merchant relationship does not automatically prove authorization, and a mismatch does not automatically prove fraud.',
    seniorTip: 'A senior investigator separates authorization evidence from merchant-service evidence before choosing approve, deny, partial credit, or more info.',
    skills: ['Chargeback reason analysis', 'Authorization review', 'Merchant packet comparison'],
  },
  'Credit Risk': {
    red: ['unable to fully verify', 'overdraft', '47%', 'manual underwriting', 'concentrated deposits'],
    green: ['stable employer', 'recurring payroll', 'manageable', 'stable deposits'],
    misleading: 'A strong stated income can be misleading if employment, cash flow, and debt load do not support it.',
    seniorTip: 'A senior investigator separates fraud risk from ability-to-pay risk, then asks for proof when support is incomplete.',
    skills: ['Income verification', 'Debt-to-income review', 'Credit risk escalation'],
  },
  'Application Verification': {
    red: ['thin file', 'recent address', 'recently activated', 'manual review', 'linked records'],
    green: ['full match', 'stable address', 'aged mobile line', 'consistent'],
    misleading: 'One matching identity field does not prove the whole application is legitimate.',
    seniorTip: 'A senior investigator looks for clusters across identity, document, device, address, phone, and email signals.',
    skills: ['Identity verification', 'Document review', 'Synthetic identity screening'],
  },
  'Email Fraud / BEC': {
    red: ['lookalike domain', 'spf softfail', 'dkim missing', 'new receiving account', 'email only'],
    green: ['known vendor domain', 'authentication passed', 'previously used beneficiary', 'confirmed by known phone'],
    misleading: 'A message can appear inside a familiar vendor process and still be fraudulent if payment-change controls failed.',
    seniorTip: 'A senior investigator verifies beneficiary changes through trusted contact data, not the phone number or signature in the email.',
    skills: ['BEC review', 'Email header analysis', 'Beneficiary verification'],
  },
};

function includesAny(text, values) {
  const lower = text.toLowerCase();
  return values.some((value) => lower.includes(value.toLowerCase()));
}

function unique(list) {
  return [...new Set(list.filter(Boolean))];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getEvidenceText(caseData, redFlags, greenFlags, docs, interview, notes) {
  return [
    caseData.summary,
    caseData.type,
    caseData.correct,
    caseData.decision,
    ...redFlags.map((flag) => flag.text),
    ...greenFlags.map((flag) => flag.text),
    ...docs,
    ...interview.map((entry) => `${entry.q} ${entry.a} ${entry.clue || ''}`),
    notes,
  ].join(' ');
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
  const pattern = riskPatterns[caseData.type] || riskPatterns.Chargeback;
  const evidenceText = getEvidenceText(caseData, redFlags, greenFlags, docs, interview, notes);

  const expectedEvidence = strongEvidenceByType[caseData.type] || [];
  const reviewedEvidence = expectedEvidence.filter((item) => includesAny(evidenceText, [item]));
  const missedEvidence = expectedEvidence.filter((item) => !reviewedEvidence.includes(item));
  const matchedRedSignals = unique(pattern.red.filter((signal) => evidenceText.toLowerCase().includes(signal)));
  const matchedGreenSignals = unique(pattern.green.filter((signal) => evidenceText.toLowerCase().includes(signal)));

  const investigationQuality = clamp(
    38 + reviewedEvidence.length * 9 + docs.length * 5 + interview.length * 4 + redFlags.length * 5 + greenFlags.length * 4,
    38,
    100,
  );
  const accuracyScore = correct ? 100 : caseData.decision === 'Request More Info' || caseData.decision === 'Escalate' ? 68 : 45;
  const confidence = clamp(Math.round((investigationQuality + accuracyScore) / 2), 35, 98);

  const why = [];
  if (correct) {
    why.push(`Your judgment matched the recommended outcome: ${caseData.correct}.`);
  } else {
    why.push(`Your judgment was ${caseData.decision}, but the recommended outcome was ${caseData.correct}.`);
    why.push(`The biggest issue is that the final decision did not line up with the strongest ${caseData.type} evidence pattern.`);
  }

  if (reviewedEvidence.length) {
    why.push(`Evidence that supported the review: ${reviewedEvidence.slice(0, 5).join(', ')}.`);
  }

  if (matchedRedSignals.length) {
    why.push(`Risk signals noticed in the file: ${matchedRedSignals.slice(0, 4).join(', ')}.`);
  }

  if (matchedGreenSignals.length) {
    why.push(`Balancing signals also mattered: ${matchedGreenSignals.slice(0, 4).join(', ')}.`);
  }

  if (redFlags.length && greenFlags.length) {
    why.push('You tagged both red and green evidence, which is stronger than only hunting for suspicious clues.');
  } else if (redFlags.length) {
    why.push('You tagged risk evidence, but a strong debrief should also mention any legitimate explanation you ruled in or out.');
  } else if (greenFlags.length) {
    why.push('You tagged support evidence, but a strong debrief should also show which fraud concerns were checked.');
  }

  why.push(`Misleading clue to watch: ${pattern.misleading}`);

  const missed = missedEvidence.slice(0, 5).map((item) => `Review ${item} before making a final decision.`);
  if (!docs.length) missed.push('Request at least one supporting document before closing the case.');
  if (!interview.length) missed.push('Ask at least one interview question to compare the customer story against the records.');
  if (!redFlags.length && !greenFlags.length) missed.push('Tag evidence as red or green so your reasoning is visible in the debrief.');
  if (!notes) missed.push('Add a short case note explaining which evidence drove your decision.');

  const next = unique([
    `Practice ${pattern.skills[0]}.`,
    `Practice ${pattern.skills[1]}.`,
    `Practice ${pattern.skills[2]}.`,
    'Compare the customer story against the timeline and documents.',
    'Separate confirmed evidence from assumptions.',
    'Write one sentence explaining why your decision fits the strongest evidence.',
  ]);

  return {
    tone: correct ? 'good' : 'bad',
    headline: correct ? 'Good judgment. Your decision matches the case evidence.' : 'Review needed. Your decision did not match the strongest evidence.',
    confidence,
    verdict: correct ? 'Decision matched' : 'Decision mismatch',
    why,
    missed,
    next,
    seniorTip: pattern.seniorTip,
  };
}
