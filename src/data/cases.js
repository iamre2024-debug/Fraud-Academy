export const BUILT_IN_CASES = [
  {
    id: 'CASE-ATO-001',
    source: 'built-in',
    type: 'Account Takeover',
    customer: 'Jessica Marie Johnson',
    priority: 'High',
    difficulty: 'Level 2',
    amount: 2480,
    summary: 'Customer reports access activity after profile changes and a new device session.',
    next: 'Digital Access',
  },
  {
    id: 'CASE-FPF-002',
    source: 'built-in',
    type: 'First Party Fraud',
    customer: 'Marcus D. Hill',
    priority: 'Review',
    difficulty: 'Level 3',
    amount: 1198,
    summary: 'A card claim needs comparison against prior behavior, merchant records, and account history.',
    next: 'Financial Activity',
  },
  {
    id: 'CASE-VND-003',
    source: 'built-in',
    type: 'Vendor Fraud',
    customer: 'Blue Orchid Supply Co.',
    priority: 'High',
    difficulty: 'Level 4',
    amount: 18750,
    summary: 'Vendor payment instructions changed and require independent ownership and business verification.',
    next: 'Vendor / Third Party',
  },
];

const TYPES = ['Account Takeover', 'First Party Fraud', 'Chargeback / Card Dispute', 'Vendor Fraud', 'API Abuse', 'Open Banking Fraud'];
const NAMES = ['Olivia M. Carter', 'Brandon T. Lewis', 'Riya K. Patel', 'Tiffany R. Anderson', 'NorthStar Electronics', 'Crown Payroll Services'];

export function generateCase(sequence = Date.now()) {
  const index = Math.abs(Number(sequence)) % TYPES.length;
  const suffix = String(sequence).slice(-6).padStart(6, '0');
  const type = TYPES[index];
  return {
    id: `CASE-GEN-${suffix}`,
    source: 'generated',
    type,
    customer: NAMES[index],
    priority: index % 2 ? 'Review' : 'High',
    difficulty: `Level ${(index % 4) + 1}`,
    amount: 500 + ((index + 3) * 1375),
    summary: `Generated ${type} training case. Review records and timelines before reaching a conclusion.`,
    next: type.includes('Vendor') ? 'Vendor / Third Party' : type.includes('API') || type.includes('Open Banking') ? 'API / Open Banking' : 'Customer / Identity',
  };
}
