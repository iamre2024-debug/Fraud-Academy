export function getToolkitRecord(tool, c) {
  const high = c.risk === 'High';
  const baseDocs = ['Customer Statement', 'Investigator Notes'];

  const record = {
    title: tool,
    level: high ? 'yellow' : 'green',
    summary: high
      ? 'This result contains inconsistencies or missing support that need follow-up.'
      : 'This result mostly matches the customer profile, but still needs evidence comparison.',
    rows: [
      ['Customer', c.customer],
      ['Case ID', c.id],
      ['Claim Type', c.type],
      ['Amount / Exposure', `$${c.amount.toLocaleString()}`],
    ],
    signals: high
      ? ['Identifier, timeline, or behavior mismatch present.', 'Request documents before final decision.', 'Compare result against Customer 360 and interview.']
      : ['Profile data is mostly consistent.', 'No major unrelated identity link found.', 'Still compare the story against documents.'],
    docs: baseDocs,
    next: ['Tag the strongest red or green flag.', 'Request related documents.', 'Ask one interview question tied to this result.'],
  };

  const set = (extra) => ({ ...record, ...extra, rows: [...record.rows, ...(extra.rows || [])] });

  if (tool === 'Login History') return set({
    level: high ? 'red' : 'green',
    summary: 'Authentication history showing login attempts, login result, device, IP, browser, operating system, session start, and logout behavior.',
    rows: [
      ['Successful Login', high ? '8:41 AM from new device' : '9:12 AM from known device'],
      ['Failed Attempts', high ? '3 failed attempts before success' : '0 failed attempts'],
      ['Device ID', c.device],
      ['IP Address', c.ip],
      ['Location', high ? 'New location outside normal pattern' : 'Normal customer region'],
      ['Browser / OS', high ? 'Chrome Mobile / Android 16 - first seen' : 'Known mobile browser / trusted OS'],
      ['Session End', high ? 'No normal logout event captured' : 'Normal logout after 6 minutes'],
    ],
    signals: high ? ['Multiple failed attempts before success.', 'First login from new device.', 'Login location does not match normal customer behavior.'] : ['Login pattern matches normal behavior.', 'Known device and location.', 'No failed-login burst before access.'],
    docs: ['Login Timeline', 'Device Fingerprint Report', 'IP Lookup', 'Session History'],
    next: ['Compare login timing against profile changes.', 'Open Device Fingerprint Report.', 'Ask whether the customer traveled or shared a code.'],
  });

  if (tool === 'Profile Change History') return set({
    level: high ? 'red' : 'green',
    summary: 'Account maintenance history showing security and contact changes made before or after the disputed activity.',
    rows: [
      ['Password Change', high ? '8:42 AM, one minute after new login' : 'No recent password change'],
      ['Recovery Email', high ? 'Updated during same session' : 'No change in last 90 days'],
      ['Phone Number', high ? 'Changed before OTP delivery' : 'Trusted phone unchanged'],
      ['MFA Device', high ? 'New SMS route enrolled' : 'Existing MFA route retained'],
      ['Security Questions', high ? 'Updated after password reset' : 'No recent update'],
      ['Change Channel', high ? 'Online banking session from new device' : 'Customer service verified request'],
    ],
    signals: high ? ['Multiple security settings changed within minutes.', 'Profile changes occurred before the money movement.', 'ATO pattern: take control first, then transact.'] : ['No risky profile maintenance event.', 'Contact methods are stable.', 'Account maintenance does not support takeover.'],
    docs: ['Profile Change History', 'Password Reset History', 'MFA History', 'Customer 360 Notes'],
    next: ['Compare profile-change timestamps to Login History.', 'Verify old and new phone/email ownership.', 'Ask customer about spoofed bank calls or texts.'],
  });

  if (tool === 'Session History') return set({
    level: high ? 'red' : 'green',
    summary: 'Post-login activity showing what the user did after authentication, including pages viewed, profile changes, payees, and money movement.',
    rows: [
      ['Session Start', high ? '8:41 AM' : '9:12 AM'],
      ['Pages Viewed', high ? 'Security settings, profile, transfer, card controls' : 'Balance, recent transactions, statements'],
      ['Profile Actions', high ? 'Phone updated, MFA route changed' : 'No profile changes'],
      ['Money Movement', high ? 'Transfer or purchase initiated after profile update' : 'No unusual transfer activity'],
      ['Beneficiary / Payee', high ? 'New payee or token used during session' : 'Existing payee only'],
      ['Logout', high ? 'No normal logout captured' : 'Normal logout'],
    ],
    signals: high ? ['Session behavior moved from account control to money movement.', 'New payee/token activity happened after profile changes.', 'No normal logout may suggest rushed takeover activity.'] : ['Session actions match normal customer behavior.', 'No suspicious payee or profile activity.', 'Normal logout captured.'],
    docs: ['Session History', 'Transaction Timeline', 'Profile Change History', 'Payee Change Log'],
    next: ['Follow the session path in order.', 'Open Transaction Timeline to connect access to loss.', 'Tag whether the session behavior supports ATO.'],
  });

  if (tool === 'Merchant Evidence') return set({
    level: high ? 'red' : 'green',
    summary: high ? 'Merchant evidence strongly supports delivery or customer participation.' : 'Merchant packet is incomplete or only partially supports the merchant.',
    rows: [
      ['Merchant', c.merchant],
      ['Order Email', c.email],
      ['Billing Match', high ? 'AVS full match + CVV match' : 'Partial AVS match'],
      ['Delivery / Fulfillment', high ? 'Signed proof and delivery image on file' : 'Tracking exists but signature missing'],
      ['Usage Signal', high ? 'Product activated from customer device' : 'No confirmed product activation'],
    ],
    signals: high ? ['Customer profile matches merchant order.', 'Proof of delivery supports merchant.', 'Prior similar disputes increase first-party risk.'] : ['Merchant packet has gaps.', 'Delivery proof is incomplete.', 'Customer may need partial credit or more info.'],
    docs: ['Merchant Receipt', 'Proof of Delivery', 'Order Confirmation', 'Shipping Records'],
  });

  if (tool === 'Shipping Records') return set({
    level: high ? 'red' : 'yellow',
    rows: [
      ['Carrier', 'QuickShip Logistics'],
      ['Ship To', c.address],
      ['GPS Scan', high ? 'Within 18 feet of billing address' : 'Same apartment complex, unit not confirmed'],
      ['Delivery Photo', high ? 'Porch and house number visible' : 'Package room image only'],
      ['Signature', high ? `${c.customer.split(' ')[1]} initials captured` : 'No signature captured'],
    ],
    signals: high ? ['Delivery location matches customer address.', 'GPS and photo support delivery.', 'Customer non-receipt claim needs stronger proof.'] : ['Delivery proof is not conclusive.', 'Package room creates possible loss risk.', 'Ask customer about building delivery setup.'],
    docs: ['Proof of Delivery', 'Carrier Timeline', 'Delivery Photo'],
  });

  if (tool === 'Previous Claims' || tool === 'Chargeback History') return set({
    level: high ? 'red' : 'green',
    rows: [
      ['Prior Claims 90 Days', high ? '3 claims' : '0 claims'],
      ['Common Pattern', high ? 'High-value non-receipt / unauthorized claims' : 'No repeated pattern'],
      ['Merchants', high ? 'Fashion, electronics, travel' : 'No high-risk cluster'],
      ['Prior Outcomes', high ? '2 courtesy credits, 1 denied' : 'None'],
    ],
    signals: high ? ['Repeated claim behavior is a first-party fraud indicator.', 'Prior courtesy credits may incentivize repeat abuse.', 'Compare current claim story to prior claims.'] : ['No suspicious claim history.', 'This claim may be an isolated event.', 'Focus on current evidence.'],
    docs: ['Prior Claims Memo', 'Dispute History', 'Customer Statement'],
  });

  if (tool === 'Customer Statement') return set({
    level: high ? 'yellow' : 'green',
    rows: [
      ['Statement Received', 'Yes'],
      ['Timeline Clarity', high ? 'Vague and changed once during interview' : 'Clear and consistent'],
      ['Merchant Contact', high ? 'No merchant contact before claim' : 'Customer contacted merchant first'],
      ['Requested Outcome', high ? 'Full refund only' : 'Open to replacement or partial credit'],
    ],
    signals: high ? ['Story needs supporting documents.', 'Ask claim-specific follow-up questions.', 'Do not rely on statement alone.'] : ['Statement is consistent with records.', 'Customer behavior supports good-faith dispute.', 'Still verify merchant evidence.'],
    docs: ['Customer Statement', 'Interview Transcript'],
  });

  if (tool === 'Transaction History With Merchant') return set({
    level: high ? 'red' : 'yellow',
    rows: [
      ['Merchant', c.merchant],
      ['Prior Purchases', high ? '6 in last 90 days' : '1 small purchase 14 months ago'],
      ['Prior Refunds', high ? '2 courtesy refunds' : 'No prior refunds'],
      ['Dispute Pattern', high ? 'Repeated same-merchant disputes' : 'No repeat pattern'],
    ],
    signals: high ? ['Prior merchant relationship weakens unauthorized claim.', 'Repeated disputes need review.', 'Check order match and calls.'] : ['Limited merchant history.', 'Need authorization and merchant proof.', 'Customer story may still be valid.'],
    docs: ['Merchant History', 'Transaction Ledger', 'Prior Disputes'],
  });

  if (tool === 'Prior Customer Calls') return set({
    level: high ? 'red' : 'green',
    rows: [
      ['Calls Found', high ? '2 before dispute' : '1 after transaction posted'],
      ['Relevant Note', high ? 'Customer asked about delivery date before filing unauthorized claim' : 'Customer reported card missing'],
      ['Secure Message', high ? 'Asked about return policy' : 'No merchant message found'],
    ],
    signals: high ? ['Pre-dispute contact suggests awareness of purchase.', 'Compare call notes to claim reason.', 'Potential first-party or friendly fraud.'] : ['Call timing supports customer claim.', 'Document the report timeline.', 'Compare to authorization data.'],
    docs: ['Call Notes', 'Secure Message Transcript'],
  });

  if (tool === 'Order Match Review' || tool === 'Authorization Review') return set({
    level: high ? 'red' : 'yellow',
    rows: [
      ['Name Match', high ? 'Full match' : 'Partial / guest checkout'],
      ['Address Match', high ? c.address : 'Different shipping address'],
      ['Email / Phone', high ? 'Matches Customer 360' : 'New email or phone on order'],
      ['AVS / CVV', high ? 'AVS full match, CVV match' : 'AVS partial, CVV unavailable'],
      ['3DS / OTP', high ? 'OTP passed to phone on file' : 'No step-up completed'],
    ],
    signals: high ? ['Order details support customer participation.', 'Authorization signals are strong.', 'Review prior calls and merchant evidence.'] : ['Mismatch may support unauthorized claim.', 'Need interview and documentation.', 'Check device/IP history.'],
    docs: ['Authorization Log', 'Order Match Sheet', 'Merchant Receipt'],
  });

  if (tool.includes('Password') || tool.includes('MFA') || tool.includes('Device') || tool.includes('IP')) return set({
    level: high ? 'red' : 'green',
    rows: [
      ['Device ID', c.device],
      ['IP Address', c.ip],
      ['Geo / Network', high ? 'New location + VPN/proxy signal' : 'Normal customer region'],
      ['MFA Result', high ? 'SMS OTP to newly added phone' : 'Push MFA to trusted device'],
      ['Trusted Status', high ? 'Not trusted before this case' : 'Previously trusted'],
    ],
    signals: high ? ['New device and network are suspicious.', 'MFA result needs context.', 'Customer interview should ask about phishing.'] : ['Digital activity matches known behavior.', 'Trusted method was used.', 'Focus on transaction evidence.'],
    docs: ['Device Fingerprint Report', 'MFA History', 'IP Lookup', 'Login Timeline'],
  });

  if (tool.includes('Income') || tool.includes('Employment') || tool.includes('Debt') || tool.includes('Credit') || tool.includes('Cash Flow') || tool.includes('Bank Statements')) return set({
    level: high ? 'yellow' : 'green',
    rows: [
      ['Stated Income', `$${(52000 + c.amount).toLocaleString()}`],
      ['Verified Income', high ? 'Unable to fully verify' : 'Matches recurring payroll deposits'],
      ['Employment', high ? 'Employer website recently created' : 'Stable employer verified'],
      ['DTI Estimate', high ? '47%' : '24%'],
      ['Cash Flow', high ? 'Recent overdrafts / concentrated deposits' : 'Stable deposits and low returns'],
    ],
    signals: high ? ['Credit risk needs manual underwriting.', 'Request paystubs and bank statements.', 'Do not approve line increase without verification.'] : ['Income support is consistent.', 'DTI appears manageable.', 'Still check recent inquiries and obligations.'],
    docs: ['Paystub', 'Bank Statement', 'Employer Letter', 'Credit Report Summary'],
  });

  if (tool.includes('Email') || tool.includes('Domain') || tool.includes('Sender') || tool.includes('Beneficiary') || tool.includes('Payment Timeline') || tool.includes('Wire')) return set({
    level: high ? 'red' : 'yellow',
    rows: [
      ['Sender Domain', high ? 'Lookalike domain registered recently' : 'Known vendor domain'],
      ['SPF / DKIM', high ? 'SPF softfail, DKIM missing' : 'Authentication passed'],
      ['Beneficiary', high ? 'New receiving account' : 'Previously used beneficiary'],
      ['Payment Change', high ? 'Instruction change by email only' : 'Confirmed by known phone number'],
      ['Funds Movement', high ? 'Rapid outbound transfer attempts' : 'Normal settlement behavior'],
    ],
    signals: high ? ['BEC/email fraud pattern present.', 'Verify vendor by known phone number.', 'Review beneficiary and payment timeline.'] : ['Email/payment history mostly supports legitimacy.', 'Still document callback control.', 'Watch for subtle domain changes.'],
    docs: ['Email Header', 'Domain Lookup', 'Beneficiary Review', 'Payment Timeline'],
  });

  if (tool.includes('SSN') || tool.includes('License') || tool.includes('Selfie') || tool.includes('Address') || tool.includes('Phone')) return set({
    level: high ? 'yellow' : 'green',
    rows: [
      ['Name / DOB / SSN', high ? 'Partial match or thin file' : 'Full match'],
      ['Address History', high ? 'Recent address added' : 'Stable address history'],
      ['Phone Age', high ? 'Recently activated / prepaid indicator' : 'Aged mobile line'],
      ['Document Review', high ? 'Manual review recommended' : 'Document appears consistent'],
    ],
    signals: high ? ['Application verification needs more documents.', 'Search linked records in Identity Intel.', 'Request driver license and selfie verification.'] : ['Identity appears consistent.', 'No major synthetic ID signal.', 'Still verify document quality.'],
    docs: ['Driver License', 'Selfie Verification', 'Utility Bill', 'Identity Intel Report'],
  });

  return record;
}
