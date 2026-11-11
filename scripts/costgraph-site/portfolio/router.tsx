// The website's router, swapped in for the portfolio build: a memory router
// on the frame's own route, or with ?stage=, one real piece of the site on
// a drawn page.
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { StageRoot } from './stages';

const params = new URLSearchParams(location.search);
const route = params.get('route') || '/';
const stage = params.get('stage');

export function DemoRouter({ children }: Readonly<{ children: ReactNode }>) {
    return <MemoryRouter initialEntries={[route]}>{stage ? <StageRoot name={stage} /> : children}</MemoryRouter>;
}
