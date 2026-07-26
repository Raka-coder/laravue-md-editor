import { ref } from 'vue';

export function useScrollSync() {
    const isSyncing = ref(true);

    const sync = (source: HTMLElement, target: HTMLElement) => {
        if (!isSyncing.value) {
            return;
        }

        const sourcePercentage =
            source.scrollTop / (source.scrollHeight - source.clientHeight);
        target.scrollTop =
            sourcePercentage * (target.scrollHeight - target.clientHeight);
    };

    return {
        isSyncing,
        sync,
    };
}
