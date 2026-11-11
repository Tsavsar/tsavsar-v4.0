// Mounts one demo inside its iframe, with the providers the real app has
// (the same set the CostGraph Storybook uses), the theme the case study is
// in, and a MemoryRouter so links inside the demo never navigate the frame.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';

import { TooltipProvider } from '@costgraph/ui';

const params = new URLSearchParams(location.search);

function setTheme(theme: string | null) {
    const t = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
    document.documentElement.style.colorScheme = t;
}
setTheme(params.get('theme'));

// The case study tells its frames when the theme flips
addEventListener('message', (e) => {
    if (e.origin !== location.origin) return;
    if (e.data?.type === 'cg-theme') setTheme(e.data.theme);
});

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

export function mount(node: ReactNode, opts: { path?: string } = {}) {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: Infinity, refetchOnWindowFocus: false } },
    });
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[opts.path ?? '/']}>
                    <NuqsAdapter>
                        <TooltipProvider>{node}</TooltipProvider>
                    </NuqsAdapter>
                </MemoryRouter>
            </QueryClientProvider>
        </StrictMode>
    );
}

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
