// The setup guide that follows you: the real floating card and the real
// ring on the sidebar's Get started item, on a drawn page.
import type * as React from 'react';

import { SetupGuideWidget } from '@/components/get-started/setup-guide-widget';

import { MockChart, MockHeader, MockKpis, MockRows, MockShell, MockSidebar, MockTabs } from './mock';
import { GetStartedItem } from './stage-parts';

// The page behind the card is a drawing, so its links (the sidebar's Get
// started, the card's tasks) don't go anywhere: following one would take the
// stage to a screen it doesn't draw, and the card steps aside on Get started.
const stay = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('a[href]')) e.preventDefault();
};

export default function GuideStage() {
    return (
        <div className="contents" onClickCapture={stay}>
            <MockShell sidebar={<MockSidebar top={<GetStartedItem active />} />}>
                <MockHeader />
                <MockTabs />
                <MockKpis />
                <MockChart height={200} />
                <MockRows n={4} />
                <SetupGuideWidget />
            </MockShell>
        </div>
    );
}
