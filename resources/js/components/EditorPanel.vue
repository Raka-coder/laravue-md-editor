<script setup lang="ts">
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { formatAction } from '@/lib/editorHelpers';

const props = defineProps<{
    modelValue: string;
    activeFont: string;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: string];
    scroll: [e: Event];
}>();

const editorContainer = ref<HTMLDivElement | null>(null);
let view: EditorView | null = null;

const markdownHighlightStyle = HighlightStyle.define([
    { tag: t.heading, class: 'cm-md-heading' },
    { tag: t.strong, class: 'cm-md-strong' },
    { tag: t.emphasis, class: 'cm-md-emphasis' },
    { tag: t.monospace, class: 'cm-md-monospace' },
    { tag: t.quote, class: 'cm-md-quote' },
    { tag: t.link, class: 'cm-md-link' },
    { tag: t.url, class: 'cm-md-url' },
    { tag: t.list, class: 'cm-md-list' },
    { tag: t.keyword, class: 'cm-md-keyword' },
    { tag: t.processingInstruction, class: 'cm-md-keyword' },
]);

onMounted(() => {
    if (!editorContainer.value) {
        return;
    }

    const startState = EditorState.create({
        doc: props.modelValue,
        extensions: [
            lineNumbers(),
            history(),
            markdown(),
            syntaxHighlighting(markdownHighlightStyle),
            EditorView.lineWrapping,
            keymap.of([
                ...defaultKeymap,
                ...historyKeymap,
                {
                    key: 'Mod-b',
                    run: (v) => {
                        formatAction(v, 'bold');

                        return true;
                    },
                },
                {
                    key: 'Mod-i',
                    run: (v) => {
                        formatAction(v, 'italic');

                        return true;
                    },
                },
            ]),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    emit('update:modelValue', update.state.doc.toString());
                }
            }),
        ],
    });

    view = new EditorView({
        state: startState,
        parent: editorContainer.value,
    });

    const scroller = editorContainer.value.querySelector('.cm-scroller');

    if (scroller) {
        scroller.addEventListener('scroll', handleScroll);
    }
});

onBeforeUnmount(() => {
    if (view) {
        const scroller = editorContainer.value?.querySelector('.cm-scroller');

        if (scroller) {
            scroller.removeEventListener('scroll', handleScroll);
        }

        view.destroy();
    }
});

function handleScroll(e: Event) {
    emit('scroll', e);
}

watch(
    () => props.modelValue,
    (newVal) => {
        if (view && newVal !== view.state.doc.toString()) {
            view.dispatch({
                changes: { from: 0, to: view.state.doc.length, insert: newVal },
            });
        }
    },
);

function triggerAction(actionType: any) {
    if (!view) {
        return;
    }

    view.focus();
    formatAction(view, actionType);
}

defineExpose({
    triggerAction,
    getScroller: () =>
        editorContainer.value?.querySelector(
            '.cm-scroller',
        ) as HTMLElement | null,
});
</script>

<template>
    <div class="flex h-full w-full flex-col overflow-hidden">
        <div
            ref="editorContainer"
            class="flex-1 overflow-hidden text-sm leading-relaxed"
            :class="{
                'font-mono': activeFont === 'mono',
                'font-sans': activeFont === 'sans',
                'font-serif': activeFont === 'serif',
            }"
        />
    </div>
</template>

<style>
.cm-editor {
    height: 100%;
    background-color: #ffffff;
    color: #0f172a; /* Slate-900 */
}
.cm-scroller {
    font-family: inherit;
    outline: none;
}
.cm-content {
    caret-color: #0f172a !important;
}
.cm-cursor {
    border-left-color: #0f172a !important;
}
.dark .cm-editor {
    background-color: #121215;
    color: #ededec;
}
.dark .cm-content {
    caret-color: #ededec !important;
}
.dark .cm-cursor {
    border-left-color: #ededec !important;
}
.dark .cm-gutters {
    background-color: #121215;
    border-right: 1px solid #3e3e3a;
    color: #5e5e5a;
}
.cm-gutters {
    background-color: #fcfcfd;
    border-right: 1px solid #e3e3e0;
    color: #a09f9c;
}

/* Markdown Highlighting Styles (Scoped to .cm-editor) */
.cm-editor .cm-md-heading {
    color: #059669; /* Emerald-600 */
    font-weight: 700;
}
.dark .cm-editor .cm-md-heading {
    color: #34d399; /* Emerald-400 */
}

.cm-editor .cm-md-strong {
    font-weight: 700;
    color: #0f172a; /* Slate-900 */
}
.dark .cm-editor .cm-md-strong {
    color: #f1f5f9; /* Slate-100 */
}

.cm-editor .cm-md-emphasis {
    font-style: italic;
    color: #334155; /* Slate-700 */
}
.dark .cm-editor .cm-md-emphasis {
    color: #cbd5e1; /* Slate-300 */
}

.cm-editor .cm-md-monospace {
    color: #ea580c; /* Orange-600 */
    font-family:
        monospace, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        monospace;
}
.dark .cm-editor .cm-md-monospace {
    color: #fb923c; /* Orange-400 */
}

.cm-editor .cm-md-quote {
    color: #475569; /* Slate-600 */
    font-style: italic;
}
.dark .cm-editor .cm-md-quote {
    color: #94a3b8; /* Slate-400 */
}

.cm-editor .cm-md-link {
    color: #2563eb; /* Blue-600 */
    text-decoration: underline;
}
.dark .cm-editor .cm-md-link {
    color: #60a5fa; /* Blue-400 */
}

.cm-editor .cm-md-url {
    color: #475569; /* Slate-600 */
}
.dark .cm-editor .cm-md-url {
    color: #94a3b8; /* Slate-400 */
}

.cm-editor .cm-md-list {
    color: #0d9488; /* Teal-600 */
}
.dark .cm-editor .cm-md-list {
    color: #2dd4bf; /* Teal-400 */
}

.cm-editor .cm-md-keyword {
    color: #64748b; /* Slate-500 */
}
.dark .cm-editor .cm-md-keyword {
    color: #475569; /* Slate-600 */
}
</style>
