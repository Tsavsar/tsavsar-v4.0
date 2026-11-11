// The website's closing band, "Put your bill to work": the real FinalCta
// from @costgraph/site. The case study gives this frame a real 1440px
// window, the website's desktop width, and scales the frame itself. The
// band is never transformed inside, so its canvas measures 1440 and lays out
// the same grid of characters, at the same size, as costgraph.ai. Its
// buttons are real but stay in the frame.
import '../.gen/site.css';

import { FinalCta } from '@/../../../packages/site/src/final-cta';

import { mount } from '../shared/mount';

// The demo is a picture of the band, not a way off the page
addEventListener(
    'click',
    e => {
        if ((e.target as Element).closest('a')) e.preventDefault();
    },
    true
);

function Band() {
    return (
        <div className="overflow-hidden" style={{ width: '100vw', height: '100vh' }}>
            <FinalCta />
        </div>
    );
}

mount(<Band />);
