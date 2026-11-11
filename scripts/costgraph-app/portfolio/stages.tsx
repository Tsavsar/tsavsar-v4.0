// Stage mode: sign in the way the app does, then show one stage.
import { Toaster, TooltipProvider } from '@costgraph/ui';
import { lazy, Suspense, useEffect, type ComponentType, type LazyExoticComponent } from 'react';

import { useAuthStore } from '@/stores/auth-store';
import { useTenantStore } from '@/stores/tenant-store';

const STAGES: Record<string, LazyExoticComponent<ComponentType>> = {
    guide: lazy(() => import('./stage-guide')),
    support: lazy(() => import('./stage-support')),
    'get-started': lazy(() => import('./stage-get-started')),
    budgets: lazy(() => import('./stage-budgets')),
    provider: lazy(() => import('./stage-provider')),
    highlight: lazy(() => import('./stage-highlight')),
};

export function StageRoot({ name }: Readonly<{ name: string }>) {
    const status = useAuthStore(s => s.status);
    const initialize = useAuthStore(s => s.initialize);
    const tenantId = useTenantStore(s => s.tenantId);
    useEffect(() => {
        void initialize();
    }, [initialize]);
    useEffect(() => {
        if (status === 'authenticated' && !tenantId) useTenantStore.getState().setTenantId('tenant_demo');
    }, [status, tenantId]);
    const Stage = STAGES[name];
    if (!Stage || status !== 'authenticated' || !tenantId) return null;
    return (
        <TooltipProvider>
            <Suspense fallback={null}>
                <Stage />
            </Suspense>
            <Toaster />
        </TooltipProvider>
    );
}
