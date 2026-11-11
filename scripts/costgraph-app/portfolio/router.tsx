// The app's router, swapped in for the portfolio build. A memory router,
// so a frame opens on its own screen (?route=) and never touches the case
// study's address bar. With ?stage=, the frame shows one real component in
// a drawn version of the dashboard instead of the whole app.
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { StageRoot } from './stages';

const params = new URLSearchParams(location.search);
const route = params.get('route') || '/';
const stage = params.get('stage');

export function DemoRouter({ children }: Readonly<{ children: ReactNode }>) {
    if (stage) {
        return (
            <MemoryRouter initialEntries={[route]}>
                <NuqsAdapter>
                    <StageRoot name={stage} />
                </NuqsAdapter>
            </MemoryRouter>
        );
    }
    return <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>;
}
