// A provider's month by service: the real chart card, with its tooltip,
// pinned day and viewing chips, fed the way the provider page feeds it.
import { CostSummaryChart } from '@/components/cost-overview/cost-summary-chart';
import { useViewingChips } from '@/components/cost-overview/use-viewing-chips';
import { ViewingChips } from '@/components/cost-overview/viewing-chips';
import { CostCurrencyProvider } from '@/lib/cost-currency';
import { stackDimensions, useStackBy } from '@/lib/cost-query-state';
import { useCostFacets, useCostQuery } from '@/lib/queries/cost';

import { MockHeader, MockKpis, MockShell } from './mock';

const PERIOD = { period: 'last_30d' } as const;

export default function ProviderStage() {
    const { stackBy, setStackBy } = useStackBy();
    const query = useCostQuery(
        { ...PERIOD, group_by: 'service', filters: { provider: ['aws'] }, stack_by: stackBy, layer: 'billed' },
        { keepPrevious: true }
    );
    const facets = useCostFacets({ ...PERIOD, layer: 'billed' }).data;
    const data = query.data;
    const series = data?.series ?? [];
    const { chips, hiddenStacks, stackLabel, toggleStack } = useViewingChips(series, stackBy, data?.stackLabels ?? undefined);
    return (
        <MockShell>
            <MockHeader />
            <MockKpis />
            <div className="px-5">
                <CostCurrencyProvider value={data?.reportingCurrency ?? 'USD'}>
                    <CostSummaryChart
                        series={series}
                        days={data?.days ?? undefined}
                        isLoading={query.isLoading}
                        stackLabel={stackLabel}
                        hiddenStacks={hiddenStacks}
                        isRefreshing={query.isFetching}
                        onRefresh={() => void query.refetch()}
                        stackBy={stackBy}
                        stackDims={stackDimensions(facets)}
                        onStackByChange={next => void setStackBy(next)}
                        footer={<ViewingChips chips={chips} onToggle={toggleStack} />}
                    />
                </CostCurrencyProvider>
            </div>
        </MockShell>
    );
}
