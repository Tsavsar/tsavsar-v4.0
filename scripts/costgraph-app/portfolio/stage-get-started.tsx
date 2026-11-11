// Get started: the real setup guide, and the real flow behind its
// "Connect a Cluster" task, on a drawn page. The guide's link moves this
// stage's own router, so the flow opens here and comes back here.
import { useLocation, useNavigate } from 'react-router-dom';

import { CreateClusterFlow } from '@/components/compute/clusters/create-cluster/create-cluster-flow';
import { GetStartedHero } from '@/components/get-started/get-started-hero';
import { SetupGuide } from '@/components/get-started/setup-guide';
import { useSetupGuide } from '@/components/get-started/use-setup-guide';

import { Fade } from './fade';
import { MockHeader, MockRows, MockShell, MockSidebar } from './mock';
import { GetStartedItem, Title } from './stage-parts';

function Guide() {
    const { stages } = useSetupGuide();
    return (
        <>
            <MockHeader title={<Title>Get started</Title>} />
            {/* the page's own container: the guide's columns are container queries */}
            <div className="bg-bg-default @container flex min-w-0 flex-1 flex-col">
                <GetStartedHero onConnectGitHub={() => undefined} />
                <div className="flex flex-col gap-9 p-5">
                    <SetupGuide stages={stages} />
                    <MockRows n={2} />
                </div>
            </div>
        </>
    );
}

function ConnectCluster() {
    const navigate = useNavigate();
    return (
        <>
            <MockHeader />
            <div className="mx-auto mt-6 w-115 max-w-[calc(100%-2rem)] pb-12">
                <CreateClusterFlow onCancel={() => navigate('/get-started')} onOpenCluster={() => navigate('/get-started')} />
            </div>
        </>
    );
}

export default function GetStartedStage() {
    const { pathname } = useLocation();
    const inFlow = pathname.startsWith('/compute/clusters');
    return (
        <MockShell sidebar={<MockSidebar top={<GetStartedItem active />} />}>
            {/* the page fades out, then the next one fades in */}
            <Fade id={inFlow ? 'flow' : 'guide'} className="flex min-h-0 min-w-0 flex-1 flex-col">
                {inFlow ? <ConnectCluster /> : <Guide />}
            </Fade>
        </MockShell>
    );
}
