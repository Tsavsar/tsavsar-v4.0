// Stands in for @baselinehq/ts-shared, a private registry package this
// machine can't install. The demos only need its number formatting and a
// few constants; GraphAI's chat parts, which use the rest, aren't shown.
// Swap back to the real package by installing it in the CostGraph checkout.
const nf = (o) => new Intl.NumberFormat('en-US', o);
const num = (v) => (v == null || !Number.isFinite(v) ? 0 : v);

export const formatNumber = (v, o = {}) => nf({ maximumFractionDigits: 2, ...o }).format(num(v));
export const formatCompactNumber = (v, o = {}) =>
  nf({ notation: 'compact', maximumFractionDigits: 1, ...o }).format(num(v));
export const formatCurrency = (v, o = {}) => {
  const { currency = 'USD', compact, ...rest } = o;
  return nf({
    style: 'currency',
    currency,
    ...(compact
      ? { notation: 'compact', maximumFractionDigits: 1 }
      : rest.maximumFractionDigits == null && rest.minimumFractionDigits == null
        ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        : { minimumFractionDigits: Math.min(rest.minimumFractionDigits ?? 0, rest.maximumFractionDigits ?? 20) }),
    ...rest,
  }).format(num(v));
};

// Route ids read back as their own names
export const ROUTE_IDS = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? k : undefined) });
export const SHARED_ROUTES = new Proxy({}, { get: () => ({ path: '/' }) });
export const routeIdSchema = { parse: (x) => x, safeParse: (x) => ({ success: true, data: x }) };
export const DEFAULT_PERSONA = 'default';
export const COST_GRAPH_PERSONAS = ['default'];
export const GRAPH_AI_SERIES_PALETTE = ['#2e7cfa', '#47c2ff', '#ff6a04', '#fd82e1', '#14c874', '#9ba3b0'];
export const isGraphAIArtifact = () => false;
export const isCostGraphUIMessage = () => false;
export const uiMessageText = (m) => (m && Array.isArray(m.parts) ? m.parts.map((p) => p.text ?? '').join('') : '');
export const formatArtifactCell = (v) => String(v ?? '');
export const goalRunDecisionDraftSchema = routeIdSchema;
export default {};
