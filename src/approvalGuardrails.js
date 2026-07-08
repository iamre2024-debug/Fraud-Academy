import { validateToolRegistry } from './toolRegistry.js';
import { validateMatrixScenarios } from './matrixScenarioRegistry.js';

const forbiddenRevealTerms = [
  'fraud score',
  'red flag',
  'green flag',
  'ai recommendation',
  'correct answer',
  'confirmed fraud',
  'confirmed non-fraud',
];

export function runApprovalGuardrails() {
  const issues = [
    ...validateToolRegistry(),
    ...validateMatrixScenarios(),
  ];

  const unsafeTerms = forbiddenRevealTerms.filter(term => term.includes('score') && term !== 'fraud score');
  if (unsafeTerms.length) issues.push(`Unexpected unsafe term configuration: ${unsafeTerms.join(', ')}`);

  const result = {
    ok: issues.length === 0,
    issues,
    rules: [
      'Evidence First',
      'Training Safe wording',
      'Search before detailed reveal when required',
      'Case Review is the only final-decision surface',
      'Credit Risk keeps credit decision wording separate from fraud claim wording',
    ],
  };

  if (typeof window !== 'undefined') {
    window.fraudAcademyApproval = result;
    if (!result.ok) console.warn('Fraud Academy approval guardrail issues:', issues);
  }

  return result;
}

runApprovalGuardrails();
