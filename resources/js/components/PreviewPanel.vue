<script setup lang="ts">
import mermaid from 'mermaid';
import { watch, nextTick, onMounted, ref } from 'vue';
import { useAppearance } from '@/composables/useAppearance';

const props = defineProps<{
    html: string;
    filename: string;
}>();

const { resolvedAppearance } = useAppearance();

// Initialize mermaid
onMounted(() => {
    mermaid.initialize({
        startOnLoad: false,
        theme: resolvedAppearance.value === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
    });
    renderMermaid();
});

// Watch HTML changes to render diagrams
watch(
    () => props.html,
    () => {
        nextTick(() => {
            renderMermaid();
        });
    },
);

// Re-initialize mermaid when appearance changes
watch(resolvedAppearance, (newTheme) => {
    mermaid.initialize({
        startOnLoad: false,
        theme: newTheme === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
    });
    // Trigger render after re-initialization
    nextTick(() => {
        renderMermaid();
    });
});

const previewScroller = ref<HTMLDivElement | null>(null);

function renderMermaid() {
    const elements = document.querySelectorAll('.mermaid');

    if (elements.length === 0) {
        return;
    }

    mermaid
        .run({
            querySelector: '.mermaid',
        })
        .catch((err) => {
            console.error('Mermaid render error:', err);
        });
}

const emit = defineEmits<{
    scroll: [e: Event];
}>();

defineExpose({
    getScroller: () => previewScroller.value,
});
</script>

<template>
    <div
        class="flex h-full flex-col overflow-hidden bg-white dark:bg-[#121215]"
    >
        <!-- File Header Tab -->
        <div
            class="flex items-center justify-between border-b border-[#e3e3e0] bg-[#fcfcfd] px-4 py-2 dark:border-[#3E3E3A] dark:bg-[#161615]"
        >
            <span
                class="font-mono text-xs font-bold text-slate-500 select-none dark:text-slate-400"
            >
                {{ filename || 'untitled.md' }}
            </span>
            <span
                class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase select-none dark:bg-zinc-800 dark:text-slate-400"
            >
                Preview
            </span>
        </div>

         <!-- HTML Renderer Container -->
         <div
             ref="previewScroller"
             class="flex-1 overflow-auto p-6"
             @scroll="(e) => emit('scroll', e)"
         >
            <div
                class="markdown-body min-h-full bg-white dark:bg-[#121215] dark:text-[#EDEDEC]"
                v-html="html"
            />
        </div>
    </div>
</template>

<style>
/* Override github-markdown-css variables based on theme classes */
.markdown-body {
    font-family: inherit;
    background-color: transparent !important;
    --color-canvas-default: #ffffff !important;
    --color-fg-default: #1b1b18 !important;
    --color-border-default: #e3e3e0 !important;
    --color-canvas-subtle: #f5f5f4 !important;
}

.dark .markdown-body {
    --color-canvas-default: #121215 !important;
    --color-fg-default: #ededec !important;
    --color-border-default: #3e3e3a !important;
    --color-canvas-subtle: #161615 !important;
}

/* Custom styles for mermaid diagrams inside the preview */
.mermaid {
    background-color: transparent !important;
    display: flex;
    justify-content: center;
    padding: 1rem;
    overflow-x: auto;
    border-radius: 0.5rem;
}
</style>
