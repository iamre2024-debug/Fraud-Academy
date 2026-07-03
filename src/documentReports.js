const reportDetails = {
  'Device Fingerprint Report': {
    status: 'High Risk',
    confidence: '34%',
    sections: [
      ['Device ID', 'First seen today; not previously trusted on this profile.'],
      ['Device Type', 'Android mobile browser with a new browser fingerprint.'],
      ['Known Device', 'No. Customer profile normally uses a different trusted device.'],
      ['Location Velocity', 'New access location conflicts with expected customer geography.'],
      ['Risk Signals', 'New device, profile change, and transaction activity occurred in the same short window.'],
    ],
    notes: ['Compare this report against Login Timeline and MFA History.', 'Ask customer whether anyone requested a security code or device approval.'],
    tip: 'Device reports matter most when they are compared to timing. A new device is suspicious, but a new device plus password reset plus money movement is much stronger.',
  },
  'Login Timeline': {
    status: 'Review Required',
    confidence: '91%',
    sections: [
      ['8:41 AM', 'Successful login from a new device and new network.'],
      ['8:42 AM', 'Password changed.'],
      ['8:43 AM', 'Phone number or MFA route updated.'],
      ['8:44 AM', 'OTP accepted on newly updated contact method.'],
      ['8:46 AM', 'Disputed transaction or transfer initiated.'],
    ],
    notes: ['The sequence supports Account Takeover because profile changes happened before the loss.', 'Interview should focus on phishing, spoofed calls, and security code sharing.'],
    tip: 'Login history is not just a list of events. The order of events is the evidence.',
  },
  'MFA History': {
    status: 'Control Break',
    confidence: '82%',
    sections: [
      ['OTP Delivery', 'Code sent to a newly added or recently changed contact method.'],
      ['Challenge Result', 'Passed on first attempt.'],
      ['Customer Recognition', 'Customer denies approving new authentication setup.'],
      ['Risk Concern', 'MFA may have been bypassed through social engineering rather than technical failure.'],
    ],
    notes: ['Check whether the customer received a spoofed call or text.', 'Compare MFA event time against password reset and device enrollment.'],
    tip: 'A passed OTP does not always mean the customer authorized the activity. Social engineering can make bad activity look authenticated.',
  },
  'IP Lookup': {
    status: 'Network Mismatch',
    confidence: '76%',
    sections: [
      ['IP Address', 'New network not seen on this customer profile before.'],
      ['Geo Signal', 'Location differs from normal customer region.'],
      ['Network Type', 'Residential or proxy-like signal requires comparison with device history.'],
      ['Velocity', 'Travel pattern is unlikely based on previous login timing.'],
    ],
    notes: ['Do not rely on IP alone. Compare against device, customer interview, and transaction timing.'],
    tip: 'IP data is a supporting clue. It gets stronger when it lines up with other suspicious changes.',
  },
  'Proof of Delivery': {
    status: 'Merchant Support',
    confidence: '88%',
    sections: [
      ['Delivery Address', 'Matches billing or verified customer address.'],
      ['GPS / Scan', 'Carrier scan is near the expected delivery location.'],
      ['Photo / Signature', 'Delivery image or signature supports merchant position.'],
      ['Claim Pattern', 'Compare with prior non-receipt disputes before deciding.'],
    ],
    notes: ['Strong delivery proof can support denial in first-party fraud, but still review household access and merchant packet quality.'],
    tip: 'For non-receipt claims, proof of delivery plus repeated claim behavior can be stronger than either clue alone.',
  },
  'Email Header': {
    status: 'Spoofing Indicators',
    confidence: '89%',
    sections: [
      ['Sender Domain', 'Lookalike or newly registered sender domain.'],
      ['Authentication', 'SPF/DKIM/DMARC mismatch or missing authentication.'],
      ['Thread Context', 'Language copied from a legitimate vendor thread.'],
      ['Payment Change', 'Bank instructions changed without callback verification.'],
    ],
    notes: ['Confirm whether the beneficiary was new and whether callback controls were followed.'],
    tip: 'BEC reviews are about process failure and payment-change verification, not just whether the email looked real.',
  },
};

export function getDocumentReport(name, caseData) {
  const fallback = {
    status: caseData.risk === 'High' ? 'Needs Review' : 'Mostly Consistent',
    confidence: caseData.risk === 'High' ? '62%' : '84%',
    sections: [
      ['Customer', caseData.customer],
      ['Case ID', caseData.id],
      ['Claim Type', caseData.type],
      ['Record Signal', caseData.risk === 'High' ? 'Contains mismatch, missing support, or timeline issue.' : 'Mostly matches the claim record but still needs comparison.'],
    ],
    notes: ['Compare this document with Toolkit results, Customer 360, and Interview answers.'],
    tip: 'A document is strongest when it confirms or contradicts another piece of evidence.',
  };

  return reportDetails[name] || fallback;
}
