// Simple case generator for Fraud Academy
// Generates unlimited fictional cases deterministically (based on index) so we can lazy‑load more when the user scrolls or taps "Load More".
// Later we will replace this with a richer generator that pulls templates from the Training Matrix.

const names = [
  "Maya Carter",
  "Jordan Ellis",
  "Tanya Brooks",
  "Darius Hill",
  "Alicia Monroe",
  "Keisha Grant",
];

const types = [
  "Account Takeover",
  "First-Party Fraud",
  "Chargeback / Card Dispute",
  "Email Fraud / BEC",
  "Credit Risk",
];

const parties = [
  "NorthStar Electronics",
  "Velora Boutique",
  "Metro Wireless",
  "Luna Travel",
  "Crown Payroll",
  "QuickShip Market",
];

export function makeCase(i) {
  const type = types[i % types.length];
  const amount = Math.round(300 + ((i * 311) % 9500));
  return {
    id: `FA-2026-${1000 + i}`,
    type,
    customer: names[i % names.length],
    merchant: parties[i % parties.length],
    amount,
    priority: i % 5 === 0 ? "Critical" : i % 2 === 0 ? "High" : "Medium",
  };
}

// Generate `count` cases starting from `offset` (0‑based)
export function generateCases(count = 12, offset = 0) {
  return Array.from({ length: count }, (_, idx) => makeCase(offset + idx));
}
