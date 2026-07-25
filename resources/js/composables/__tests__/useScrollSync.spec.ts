import { describe, it, expect } from 'vitest';
import { useScrollSync } from '../useScrollSync';

describe('useScrollSync', () => {
    it('calculates proportional scroll positions correctly', () => {
        const source = { scrollTop: 50, scrollHeight: 200, clientHeight: 100 } as HTMLElement;
        const target = { scrollTop: 0, scrollHeight: 400, clientHeight: 100 } as HTMLElement;

        const { sync } = useScrollSync();
        sync(source, target);

        // percentage scrolled = 50 / (200 - 100) = 0.5 (50%)
        // target scrollTop = 0.5 * (400 - 100) = 150
        expect(target.scrollTop).toBe(150);
    });

    it('does not sync when isSyncing is disabled', () => {
        const source = { scrollTop: 50, scrollHeight: 200, clientHeight: 100 } as HTMLElement;
        const target = { scrollTop: 0, scrollHeight: 400, clientHeight: 100 } as HTMLElement;

        const { sync, isSyncing } = useScrollSync();
        isSyncing.value = false;
        sync(source, target);

        expect(target.scrollTop).toBe(0);
    });
});
