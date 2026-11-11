// Budgets: the real budget list, its charts and its reordering, on a
// drawn page.
import { BudgetList } from '@/components/budgets/budget-list';

import { MockHeader, MockShell, MockTabs } from './mock';

export default function BudgetsStage() {
    return (
        <MockShell>
            <MockHeader />
            <MockTabs count={7} />
            <div className="min-h-0 flex-1 px-5 pt-4">
                <BudgetList />
            </div>
        </MockShell>
    );
}
