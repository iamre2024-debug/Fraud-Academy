export const TOOL_LANES = [
  {
    id: 'customer',
    label: 'Customer / Identity',
    question: 'Who is the customer and does the identity history support the relationship story?',
    tools: ['Customer 360', 'Identity Intel', 'Contact History', 'Profile Change History'],
  },
  {
    id: 'digital',
    label: 'Digital Access',
    question: 'Do the login, device, IP, session, and MFA events support or challenge the reported story?',
    tools: ['Login History', 'Device Intelligence', 'IP Intelligence', 'Session History', 'MFA / OTP'],
  },
  {
    id: 'financial',
    label: 'Financial Activity',
    question: 'Does the money movement make sense against established behavior and the claim timeline?',
    tools: ['Transaction History', 'Payment Verification', 'Linked Accounts', 'Cash-Out Review'],
  },
  {
    id: 'business',
    label: 'Business Intelligence',
    question: 'Does the business, ownership, public footprint, and operating activity make sense?',
    tools: ['Business Profile', 'Ownership', 'Public Records', 'Website Review'],
  },
  {
    id: 'third-party',
    label: 'Insider / Vendor / Third Party',
    question: 'Could an employee, administrator, vendor, merchant, or other trusted party explain the activity?',
    tools: ['Insider Activity', 'Vendor Verification', 'Admin Change Log', 'Shared Access', 'Third-Party Link Analysis'],
  },
  {
    id: 'api-open-banking',
    label: 'API / Open Banking',
    question: 'Does the token, consent, API client, aggregator, or open-banking connection make sense?',
    tools: ['API Activity', 'Token History', 'Consent Record', 'Aggregator Connections', 'Webhook Events', 'Open Banking Links'],
  },
  {
    id: 'evidence',
    label: 'Evidence / Timeline',
    question: 'What has been documented, how do events connect, and what still needs verification?',
    tools: ['Evidence Center', 'Timeline Builder', 'Link Analysis', 'Case Report'],
  },
];

export function getDefaultLane(caseItem) {
  const hint = caseItem?.next || '';
  return TOOL_LANES.find((lane) => lane.label === hint)?.id || 'customer';
}
