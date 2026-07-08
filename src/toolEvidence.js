import { SEARCH_PATTERN, getToolById } from './toolRegistry.js';

export function buildToolEvidence({ toolId, currentCase, searchValue = '', rows = [] } = {}) {
  const tool = getToolById(toolId);
  if (!tool) {
    return {
      ok: false,
      toolId,
      question: 'Unknown tool. Check the tool registry before showing evidence.',
      rows: [],
      nextActions: ['Open tool registry', 'Confirm tool id', 'Retry evidence build'],
    };
  }

  const searched = Boolean(String(searchValue).trim());
  const locked = tool.requiresSearch && !searched;

  return {
    ok: true,
    toolId: tool.id,
    label: tool.label,
    lane: tool.lane,
    primaryQuestion: tool.primaryQuestion,
    reportDepth: tool.reportDepth,
    revealMode: tool.revealMode,
    locked,
    lockReason: locked ? 'Search required before detailed records are shown.' : '',
    searchPattern: SEARCH_PATTERN,
    searchKeys: tool.searchKeys,
    caseContext: currentCase ? {
      caseId: currentCase.id,
      claimType: currentCase.type,
      subtype: currentCase.subtype || 'General review',
      party: currentCase.party,
      caseReason: currentCase.summary,
    } : null,
    rows: locked ? [] : rows,
    nextActions: locked
      ? ['Enter a supported training search key', 'Expand the matching record', 'Review history before linking evidence']
      : ['Expand relevant records', 'Compare against Customer 360 history', 'Add useful records to the timeline'],
    guardrail: 'No fraud, non-fraud, score, red flag, green flag, or recommendation reveal before Case Review.',
  };
}

export function buildSyntheticRows(currentCase = {}, toolId = '') {
  const seeds = currentCase.searchSeeds || [currentCase.profileId, currentCase.device, currentCase.ip, currentCase.bankAccount].filter(Boolean);
  return seeds.map((seed, index) => ({
    id: `${toolId || 'tool'}-${index + 1}`,
    record: seed,
    date: `07/${String(index + 1).padStart(2, '0')}/2026`,
    source: 'Fictional training data',
    detail: `Record connects to ${currentCase.id || 'the active case'} for investigator review only.`,
    investigatorQuestion: 'Does this record support, contradict, or add context to the story?',
  }));
}
