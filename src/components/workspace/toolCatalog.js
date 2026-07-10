import { getToolsForClaim, toolRegistry } from '../../toolRegistry.js';

export const LANE_DEFINITIONS = [
  { id: 'customer-context', label: 'Customer / Identity', question: 'Who is the customer and does the identity history support the relationship story?' },
  { id: 'digital-access', label: 'Digital Access', question: 'Do the login, device, IP, session, and MFA events support or challenge the reported story?' },
  { id: 'money-movement', label: 'Financial Activity', question: 'Does the money movement make sense against established behavior and the claim timeline?' },
  { id: 'business-context', label: 'Business Intelligence', question: 'Does the business, ownership, public footprint, and operating activity make sense?' },
  { id: 'trusted-party', label: 'Insider / Vendor / Third Party', question: 'Could an employee, administrator, vendor, merchant, or other trusted party explain the activity?' },
  { id: 'api-open-banking', label: 'API / Open Banking', question: 'Does the token, consent, API client, aggregator, or open-banking connection make sense?' },
  { id: 'documents', label: 'Evidence / Timeline', question: 'What has been documented, how do events connect, and what still needs verification?' },
];

const LANE_ALIASES = {
  'identity-reporting': 'customer-context',
  'payment-verification': 'money-movement',
  decision: 'documents',
};

function normalizeLane(lane) {
  return LANE_ALIASES[lane] || lane;
}

function toLane(definition, tools) {
  return {
    ...definition,
    tools: tools.map((tool) => ({
      id: tool.id,
      label: tool.label,
      question: tool.primaryQuestion,
      requiresSearch: tool.requiresSearch,
      searchKeys: tool.searchKeys,
      reportDepth: tool.reportDepth,
    })),
  };
}

export function getToolLanes(caseItem) {
  const claimTools = getToolsForClaim(caseItem?.type);
  const claimIds = new Set(claimTools.map((tool) => tool.id));
  const available = toolRegistry.filter((tool) => claimIds.has(tool.id));

  return LANE_DEFINITIONS.map((definition) => {
    const laneTools = available.filter((tool) => normalizeLane(tool.lane) === definition.id);
    return toLane(definition, laneTools);
  }).filter((lane) => lane.tools.length > 0);
}

export function getDefaultLane(caseItem, lanes = getToolLanes(caseItem)) {
  const next = String(caseItem?.next || '').toLowerCase();
  const matched = lanes.find((lane) => lane.tools.some((tool) => tool.label.toLowerCase() === next));
  return matched?.id || lanes[0]?.id || 'customer-context';
}
