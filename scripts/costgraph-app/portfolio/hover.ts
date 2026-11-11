// Hover to isolate, without the flicker. Pointing at a segment or a row
// takes effect at once; letting go waits a moment and is dropped if the
// pointer reaches another one first. So crossing the gap between two
// segments, or between two legend rows, never flashes every colour back on
// before the next one takes over.
import { useCallback, useEffect, useRef, useState } from 'react';

export function useSteadyKey(delay = 120) {
    const [key, setKey] = useState<string | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    useEffect(() => () => clearTimeout(timer.current), []);
    const set = useCallback(
        (next: string | null) => {
            clearTimeout(timer.current);
            if (next !== null) setKey(next);
            else timer.current = setTimeout(() => setKey(null), delay);
        },
        [delay]
    );
    return [key, set] as const;
}
