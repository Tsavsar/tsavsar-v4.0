// Real pieces more than one stage uses.
import getStartedActive from '@/assets/nav/get-started-active.svg';
import getStarted from '@/assets/nav/get-started.svg';
import { SetupProgressRing } from '@/components/get-started/setup-progress-ring';
import { currentStageIndex, useSetupGuide } from '@/components/get-started/use-setup-guide';
import { SidebarNavLink } from '@/components/layout/sidebar-items';

/** The sidebar's Get started item with its ring, as the real sidebar draws it */
export function GetStartedItem({ active }: Readonly<{ active?: boolean }>) {
    const { stages } = useSetupGuide();
    const done = currentStageIndex(stages);
    return (
        // its active highlight in the lighter grey, bg-layer, not bg-subtle
        <div className="[&_a[data-active]]:bg-bg-layer">
            <SidebarNavLink
                href="/get-started"
                icon={getStarted}
                activeIcon={getStartedActive}
                active={active}
                label="Get started"
                trailing={<SetupProgressRing className="-my-px" reached={Math.min(done + 1, stages.length)} />}
            />
        </div>
    );
}

/** A page title in real words, for the one stage it matters on */
export function Title({ children }: Readonly<{ children: string }>) {
    return <span className="text-label-md text-text-strong">{children}</span>;
}
