export const SEARCH_PATTERN = ['Record', 'Expand', 'Search', 'History', 'Link Analysis', 'Generate Report', 'Timeline', 'Case Report'];

export const toolRegistry = [
  {
    id: 'customer-360',
    label: 'Customer 360',
    lane: 'customer-context',
    primaryQuestion: 'Who is the customer, business, employee, vendor, or merchant before the claim is evaluated?',
    revealMode: 'context-only',
    requiresSearch: false,
    searchKeys: ['customerId', 'profileId', 'phone', 'email', 'address'],
    reportDepth: 'snapshot',
    safeLanguage: true,
  },
  {
    id: 'identity-intel',
    label: 'Identity Intel',
    lane: 'identity-reporting',
    primaryQuestion: 'Does the identity profile have enough history and consistency to support the relationship story?',
    revealMode: 'search-before-report',
    requiresSearch: true,
    searchKeys: ['trainingId', 'nameDob', 'phone', 'email', 'address', 'businessName', 'ein'],
    reportDepth: 'deep-report',
    safeLanguage: true,
  },
  {
    id: 'login-history',
    label: 'Login History',
    lane: 'digital-access',
    primaryQuestion: 'Do the access events verify or challenge the customer story?',
    revealMode: 'search-before-context',
    requiresSearch: true,
    searchKeys: ['customerId', 'caseIp', 'deviceId', 'sessionId', 'phone', 'email'],
    reportDepth: 'event-history',
    safeLanguage: true,
  },
  {
    id: 'device-intel',
    label: 'Device Intel',
    lane: 'digital-access',
    primaryQuestion: 'Does this device fit the established device history, session pattern, and relationship context?',
    revealMode: 'search-before-context',
    requiresSearch: true,
    searchKeys: ['deviceId', 'sessionId', 'customerId', 'caseIp'],
    reportDepth: 'event-history',
    safeLanguage: true,
  },
  {
    id: 'financial-investigation',
    label: 'Financial Investigation',
    lane: 'money-movement',
    primaryQuestion: 'Does the money movement make sense against the known history and claim story?',
    revealMode: 'evidence-snapshot',
    requiresSearch: true,
    searchKeys: ['customerId', 'accountId', 'destinationId', 'transactionId', 'bankCode'],
    reportDepth: 'snapshot',
    safeLanguage: true,
  },
  {
    id: 'business-intel',
    label: 'Business Intelligence',
    lane: 'business-context',
    primaryQuestion: 'Does the business profile, ownership, public footprint, and activity make sense?',
    revealMode: 'search-before-report',
    requiresSearch: true,
    searchKeys: ['businessName', 'ein', 'phone', 'email', 'address', 'website'],
    reportDepth: 'deep-report',
    safeLanguage: true,
  },
  {
    id: 'bank-account-verification',
    label: 'Payment Verification',
    lane: 'payment-verification',
    primaryQuestion: 'Does this payment destination make sense for the customer, employee, vendor, or business relationship?',
    revealMode: 'search-before-context',
    requiresSearch: true,
    searchKeys: ['destinationId', 'bankCode', 'accountHolder', 'employeeId', 'vendorId'],
    reportDepth: 'event-history',
    safeLanguage: true,
  },
  {
    id: 'evidence-center',
    label: 'Evidence Center',
    lane: 'documents',
    primaryQuestion: 'Which records have been gathered and what do they document without making the final decision?',
    revealMode: 'documents-only',
    requiresSearch: false,
    searchKeys: ['caseId', 'documentId', 'transactionId', 'customerId'],
    reportDepth: 'document-view',
    safeLanguage: true,
  },
  {
    id: 'case-review',
    label: 'Case Review',
    lane: 'decision',
    primaryQuestion: 'After reviewing evidence, what defensible decision can the investigator document?',
    revealMode: 'final-only',
    requiresSearch: false,
    searchKeys: ['caseId'],
    reportDepth: 'case-report',
    safeLanguage: true,
  },
];

export function getToolById(id) {
  return toolRegistry.find(tool => tool.id === id);
}

export function getToolsForClaim(claimType = '') {
  const base = ['customer-360', 'identity-intel', 'evidence-center', 'case-review'];
  const claim = claimType.toLowerCase();
  const extras = [];

  if (claim.includes('account takeover') || claim.includes('wallet') || claim.includes('email')) extras.push('login-history', 'device-intel');
  if (claim.includes('payroll') || claim.includes('vendor') || claim.includes('ach') || claim.includes('bec') || claim.includes('ghost')) extras.push('business-intel', 'bank-account-verification');
  if (claim.includes('credit') || claim.includes('bust') || claim.includes('money mule') || claim.includes('check') || claim.includes('chargeback')) extras.push('financial-investigation');
  if (claim.includes('merchant')) extras.push('business-intel', 'financial-investigation');

  return [...new Set([...base, ...extras])].map(getToolById).filter(Boolean);
}

export function validateToolRegistry(registry = toolRegistry) {
  return registry.flatMap(tool => {
    const issues = [];
    if (!tool.primaryQuestion) issues.push(`${tool.id}: missing primaryQuestion`);
    if (!tool.revealMode) issues.push(`${tool.id}: missing revealMode`);
    if (!Array.isArray(tool.searchKeys)) issues.push(`${tool.id}: searchKeys must be an array`);
    if (tool.label?.includes('Bank Account Verification')) issues.push(`${tool.id}: use Payment Verification wording`);
    return issues;
  });
}
