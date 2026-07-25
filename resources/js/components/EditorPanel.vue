<script setup lang="ts">
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
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
            EditorView.lineWrapping,
            keymap.of([
                ...defaultKeymap,
                ...historyKeymap,
                {
                    key: 'Mod-b',
                    run: (v) => {
 formatAction(v, 'bold');

 return true; 
}
                },
                {
                    key: 'Mod-i',
                    run: (v) => {
 formatAction(v, 'italic');

 return true; 
}
                }
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

watch(() => props.modelValue, (newVal) => {
    if (view && newVal !== view.state.doc.toString()) {
        view.dispatch({
            changes: { from: 0, to: view.state.doc.length, insert: newVal }
        });
    }
});

function triggerAction(actionType: any) {
    if (!view) {
return;
}

    view.focus();
    formatAction(view, actionType);
}

defineExpose({
    triggerAction,
    getScroller: () => editorContainer.value?.querySelector('.cm-scroller') as HTMLElement | null
});
</script>

<template>
    <div class="h-full w-full overflow-hidden flex flex-col">
        <div 
            ref="editorContainer" 
            class="flex-1 overflow-hidden text-sm leading-relaxed" 
            :class="{
                'font-mono': activeFont === 'mono',
                'font-sans': activeFont === 'sans',
                'font-serif': activeFont === 'serif'
            }"
        />
    </div>
</template>

<style>
.cm-editor {
    height: 100%;
}
.cm-scroller {
    font-family: inherit;
    outline: none;
}
.dark .cm-editor {
    background-color: #121215;
    color: #EDEDEC;
}
.dark .cm-gutters {
    background-color: #121215;
    border-right: 1px solid #3E3E3A;
    color: #5e5e5a;
}
.cm-gutters {
    background-color: #fcfcfd;
    border-right: 1px solid #e3e3e0;
    color: #a09f9c;
}
</style>
