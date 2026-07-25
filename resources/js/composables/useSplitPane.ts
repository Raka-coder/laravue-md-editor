import { ref } from 'vue';

export function useSplitPane(initialRatio = 0.52) {
    const splitRatio = ref(Number(localStorage.getItem('md-editor:split-ratio')) || initialRatio);
    const isDragging = ref(false);

    const startDrag = () => {
        isDragging.value = true;
    };

    const onDrag = (e: MouseEvent) => {
        if (!isDragging.value) {
return;
}

        const newRatio = e.clientX / window.innerWidth;

        if (newRatio > 0.2 && newRatio < 0.8) {
            splitRatio.value = newRatio;
        }
    };

    const endDrag = () => {
        if (!isDragging.value) {
return;
}

        isDragging.value = false;
        localStorage.setItem('md-editor:split-ratio', String(splitRatio.value));
    };

    return {
        splitRatio,
        isDragging,
        startDrag,
        onDrag,
        endDrag,
    };
}
