// Hover to isolate: the real system cost and load driver cards for one
// machine, laid out as the machine's overview lays them out at desktop
// width, with the details card beside them drawn rather than real.
import { LoadDriversCard, SystemCostCard, toOverviewCostSummary, vmLoadDriversToOverview } from '@/components/compute/resource-overview';
import {
    useVirtualMachine,
    useVirtualMachineCost,
    useVirtualMachineLoadDrivers,
    VM_OVERVIEW_LOAD_DRIVERS_PARAMS,
} from '@/lib/queries/virtual-machines';

import { Bar, MockHeader, MockShell, MockTabs } from './mock';

const VM = 'vm-ml-01';

function DrawnDetails() {
    const rows = [[64, 92], [52, 48], [76, 70], [60, 108], [48, 86]];
    return (
        <div aria-hidden className="border-stroke-soft flex flex-col gap-4 rounded-xl border p-4">
            <Bar w={58} h={6} />
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {rows.flatMap(([a, b], i) => [
                    <div key={`l${i}`} className="flex items-center justify-between"><Bar w={a} h={7} /><Bar w={b} h={7} /></div>,
                    <div key={`r${i}`} className="flex items-center justify-between"><Bar w={b - 10} h={7} /><Bar w={a + 14} h={7} /></div>,
                ])}
            </div>
        </div>
    );
}

export default function HighlightStage() {
    const vm = useVirtualMachine(VM).data;
    const cost = useVirtualMachineCost(VM, { period: 'last_30d' } as never);
    const driversQuery = useVirtualMachineLoadDrivers(VM, VM_OVERVIEW_LOAD_DRIVERS_PARAMS);
    const summary = toOverviewCostSummary(cost.data ?? vm?.cost_summary ?? null, { isMonthToDate: false });
    const { drivers, composition } = vmLoadDriversToOverview(driversQuery.data);
    return (
        <MockShell>
            <MockHeader />
            <MockTabs count={4} />
            <div className="flex flex-col gap-8 p-4">
                <div className="grid grid-cols-2 gap-2.5">
                    <SystemCostCard costSummary={summary} />
                    <DrawnDetails />
                </div>
                <LoadDriversCard
                    drivers={drivers}
                    composition={composition}
                    totalCores={vm?.capacity?.cpu_cores}
                    isLoading={driversQuery.isLoading}
                    isError={driversQuery.isError}
                    errorMessage={driversQuery.error?.message}
                />
            </div>
        </MockShell>
    );
}
