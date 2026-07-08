import { getToolsForClaim } from './toolRegistry.js';

export const matrixScenarioRegistry = [
  {
    claimType: 'Account Takeover',
    subtype: 'Profile Change + New Device Session',
    party: 'consumer',
    caseReason: 'Customer reports account access concerns after profile changes and unfamiliar digital activity.',
    requiredEvidence: ['Customer 360', 'Login History', 'Device Intel', 'Evidence Center', 'Timeline Builder'],
    searchSeeds: ['TRAINING-ID-6789', 'DEV-ATO-2401', 'IP-172-16-30-40', 'CUST-400000'],
  },
  {
    claimType: 'Payroll Fraud / Direct Deposit Diversion',
    subtype: 'Employee Destination Change',
    party: 'employee',
    caseReason: 'Payroll destination was changed before a payroll run and needs employee and business verification.',
    requiredEvidence: ['Customer 360', 'Business Intelligence', 'Payment Verification', 'Login History', 'Evidence Center'],
    searchSeeds: ['EMP-1042', 'BANK-NEW-8839', 'ADMIN-LOGIN-7721', 'PAYRUN-2026-07'],
  },
  {
    claimType: 'Email Fraud / BEC',
    subtype: 'Vendor Payment Instruction Change',
    party: 'business',
    caseReason: 'A vendor payment instruction changed after an email request and needs independent verification.',
    requiredEvidence: ['Customer 360', 'Business Intelligence', 'Payment Verification', 'Evidence Center', 'Timeline Builder'],
    searchSeeds: ['VENDOR-2210', 'BANK-NEW-8839', 'EMAIL-THREAD-5104', 'ACH-SETUP-7302'],
  },
  {
    claimType: 'Credit Risk',
    subtype: 'Repayment Capacity Review',
    party: 'consumer',
    caseReason: 'A credit request needs cash-flow, repayment, utilization, and ability-to-repay review separate from fraud wording.',
    requiredEvidence: ['Customer 360', 'Financial Investigation', 'Identity Intel', 'Evidence Center', 'Case Review'],
    searchSeeds: ['CUST-CR-1188', 'APP-CR-2026-07', 'INCOME-VERIFY-4412', 'UTIL-REPORT-7019'],
  },
  {
    claimType: 'ACH Fraud',
    subtype: 'New ACH Setup Review',
    party: 'business',
    caseReason: 'ACH authorization and payment destination activity need ownership, setup, and business relationship review.',
    requiredEvidence: ['Customer 360', 'Business Intelligence', 'Payment Verification', 'Financial Investigation', 'Evidence Center'],
    searchSeeds: ['ACH-SETUP-7302', 'BANK-CODE-104000', 'DESTINATION-8839', 'BUS-4471'],
  },
];

export function generateMatrixCase(index = 0) {
  const scenario = matrixScenarioRegistry[index % matrixScenarioRegistry.length];
  const tools = getToolsForClaim(scenario.claimType);

  return {
    id: `CASE-MX-${String(7000 + index).padStart(6, '0')}`,
    type: scenario.claimType,
    subtype: scenario.subtype,
    party: scenario.party,
    summary: scenario.caseReason,
    caseSummaryRule: 'Explain why the case exists using only the customer allegation or system alert.',
    evidenceFirst: true,
    decisionReveal: 'case-review-only',
    requiredEvidence: scenario.requiredEvidence,
    searchSeeds: scenario.searchSeeds,
    tools,
  };
}

export function validateMatrixScenarios(registry = matrixScenarioRegistry) {
  return registry.flatMap((scenario, index) => {
    const issues = [];
    if (!scenario.claimType) issues.push(`scenario ${index}: missing claimType`);
    if (!scenario.caseReason) issues.push(`scenario ${index}: missing caseReason`);
    if (!Array.isArray(scenario.requiredEvidence) || scenario.requiredEvidence.length < 3) issues.push(`${scenario.claimType}: requiredEvidence is too thin`);
    if (!Array.isArray(scenario.searchSeeds) || scenario.searchSeeds.length < 2) issues.push(`${scenario.claimType}: searchSeeds are missing`);
    if (scenario.caseReason.toLowerCase().includes('fraud confirmed')) issues.push(`${scenario.claimType}: caseReason reveals outcome`);
    return issues;
  });
}
