import { watch } from 'vue';
import type { Ref } from 'vue';

const DRAFT_KEY = 'md-editor:draft';
const DEBOUNCE_MS = 500;

export function useDraftStorage(content: Ref<string>) {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const save = (text: string) => {
        try {
            localStorage.setItem(DRAFT_KEY, text);
        } catch {
            // localStorage full or unavailable — silently ignore
        }
    };

    const load = (): string | null => {
        try {
            return localStorage.getItem(DRAFT_KEY);
        } catch {
            return null;
        }
    };

    const clear = () => {
        try {
            localStorage.removeItem(DRAFT_KEY);
        } catch {
            // silently ignore
        }
    };

    // Auto-save on content change with debounce
    watch(
        content,
        (val) => {
            if (timer) {
clearTimeout(timer);
}

            timer = setTimeout(() => save(val), DEBOUNCE_MS);
        },
        { immediate: false },
    );

    return {
        load,
        clear,
        save,
    };
}
