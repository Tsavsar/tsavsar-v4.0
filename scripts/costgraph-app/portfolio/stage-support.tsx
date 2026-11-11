// Support: the real Help & support button in a drawn sidebar, the real
// card it opens, and the real side panel it docks into, on a drawn page.
import { SupportButton } from '@/components/support/support-button';
import { SupportDock } from '@/components/support/support-dock';

import { MockChart, MockHeader, MockKpis, MockRows, MockShell, MockSidebar, MockTabs } from './mock';

export default function SupportStage() {
    return (
        <MockShell sidebar={<MockSidebar bottom={<SupportButton />} />} right={<SupportDock />}>
            <MockHeader />
            <MockTabs />
            <MockKpis />
            <MockChart height={240} />
            <MockRows n={4} />
        </MockShell>
    );
}
