<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref, computed, onMounted, watch } from 'vue';
import { toast } from 'vue-sonner';

import EditorPanel from '@/components/EditorPanel.vue';
import FormattingToolbar from '@/components/FormattingToolbar.vue';
import MenuBar from '@/components/MenuBar.vue';
import PreviewPanel from '@/components/PreviewPanel.vue';
import StatusBar from '@/components/StatusBar.vue';
import { Toaster } from '@/components/ui/sonner';
import Tabs from '@/components/ui/tabs/Tabs.vue';
import TabsContent from '@/components/ui/tabs/TabsContent.vue';
import TabsList from '@/components/ui/tabs/TabsList.vue';
import TabsTrigger from '@/components/ui/tabs/TabsTrigger.vue';
import { useDraftStorage } from '@/composables/useDraftStorage';
import { useMarkdownParser } from '@/composables/useMarkdownParser';
import { useSplitPane } from '@/composables/useSplitPane';

// Markdown text content and draft storage
const markdown = ref('# Hello Markdown\n\nStart typing here...');
const { load: loadDraft, clear: clearDraft } = useDraftStorage(markdown);

// Settings state initialized with localStorage support
const filename = ref(
    localStorage.getItem('md-editor:filename') || 'untitled.md',
);
const activeFont = ref(localStorage.getItem('md-editor:font') || 'mono');
const isSyncing = ref(
    localStorage.getItem('md-editor:sync-scroll') !== 'false',
);

// Listeners to persist settings
watch(filename, (val) => localStorage.setItem('md-editor:filename', val));
watch(activeFont, (val) => localStorage.setItem('md-editor:font', val));
watch(isSyncing, (val) =>
    localStorage.setItem('md-editor:sync-scroll', String(val)),
);

onMounted(() => {
    const draft = loadDraft();

    if (draft) {
        markdown.value = draft;
    }
});

const { parse } = useMarkdownParser();
const { splitRatio, startDrag, onDrag, endDrag } = useSplitPane();

const parsed = computed(() => parse(markdown.value));

const editorPanelRef = ref<any>(null);
const previewPanelRef = ref<any>(null);

// Scroll synchronization mechanism with loop prevention
let activeScrollSource: HTMLElement | null = null;
let scrollTimeout: number | null = null;

function handleScroll(source: HTMLElement, target: HTMLElement) {
    if (!isSyncing.value) {
        return;
    }

    if (activeScrollSource === null) {
        activeScrollSource = source;
    }

    if (activeScrollSource === source) {
        const sourcePercentage =
            source.scrollTop / (source.scrollHeight - source.clientHeight);
        target.scrollTop =
            sourcePercentage * (target.scrollHeight - target.clientHeight);
    }

    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    scrollTimeout = window.setTimeout(() => {
        activeScrollSource = null;
    }, 150);
}

function handleEditorScroll() {
    const editorScroller = editorPanelRef.value?.getScroller();
    const previewScroller = previewPanelRef.value?.getScroller();

    if (editorScroller && previewScroller) {
        handleScroll(editorScroller, previewScroller);
    }
}

function handlePreviewScroll() {
    const editorScroller = editorPanelRef.value?.getScroller();
    const previewScroller = previewPanelRef.value?.getScroller();

    if (editorScroller && previewScroller) {
        handleScroll(previewScroller, editorScroller);
    }
}

// Reset workspace with confirmations
function handleReset() {
    markdown.value = '# Hello Markdown\n\nStart typing here...';
    filename.value = 'untitled.md';
    clearDraft();
    toast.success('Workspace reset to default!');
}

// Import document updates
function handleImport(content: string) {
    markdown.value = content;
    toast.success('Document imported successfully!');
}

// Copy to Clipboard integration
function handleCopy() {
    if (navigator.clipboard) {
        navigator.clipboard
            .writeText(markdown.value)
            .then(() => {
                toast.success('Markdown copied to clipboard!');
            })
            .catch(() => {
                toast.error('Failed to copy markdown.');
            });
    } else {
        toast.error('Clipboard API is not supported on this browser.');
    }
}

function handleToolbarAction(action: string) {
    editorPanelRef.value?.triggerAction(action);
}

function handleChangeFont(font: string) {
    activeFont.value = font;
}
</script>

<template>
    <Head>
        <title>Web Markdown Editor - Real-time Markdown Editor & Preview</title>
        <meta
            name="description"
            content="A feature-rich, high-performance web markdown editor featuring live syntax highlighting, split view preview, scroll sync, and layout customization."
        />
        <meta
            name="keywords"
            content="markdown, markdown editor, live preview, syntax highlighting, scroll sync, split view, web editor, online editor"
        />

        <!-- OpenGraph tags -->
        <meta
            property="og:title"
            content="Web Markdown Editor - Real-time Markdown Editor & Preview"
        />
        <meta
            property="og:description"
            content="A feature-rich, high-performance web markdown editor featuring live syntax highlighting, split view preview, scroll sync, and layout customization."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Web Markdown Editor" />

        <!-- Twitter Card tags -->
        <meta name="twitter:card" content="summary" />
        <meta
            name="twitter:title"
            content="Web Markdown Editor - Real-time Markdown Editor & Preview"
        />
        <meta
            name="twitter:description"
            content="A feature-rich, high-performance web markdown editor featuring live syntax highlighting, split view preview, scroll sync, and layout customization."
        />

        <!-- Canonical URL -->
        <link rel="canonical" href="/" />
    </Head>

    <main
        class="flex h-screen flex-col bg-[#FDFDFC] dark:bg-[#0a0a0a]"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
    >
        <h1 class="sr-only">
            Web Markdown Editor - Real-time Markdown Editor & Preview
        </h1>
        <!-- Menu Bar -->
        <MenuBar
            v-model:filename="filename"
            :markdown-content="markdown"
            @import="handleImport"
            @reset="handleReset"
            @copy="handleCopy"
        />

        <!-- Desktop Split Pane Workspace -->
        <div class="hidden flex-1 flex-col overflow-hidden md:flex">
            <!-- Formatting & Preference Toolbar -->
            <FormattingToolbar
                :is-syncing="isSyncing"
                :active-font="activeFont"
                @action="handleToolbarAction"
                @toggle-sync="isSyncing = !isSyncing"
                @change-font="handleChangeFont"
            />

            <div class="flex flex-1 overflow-hidden">
                <!-- Editor Pane -->
                <div
                    class="overflow-hidden border-r border-[#e3e3e0] dark:border-[#3E3E3A]"
                    :style="{ width: `${splitRatio * 100}%` }"
                >
                    <EditorPanel
                        ref="editorPanelRef"
                        v-model="markdown"
                        :active-font="activeFont"
                        @scroll="handleEditorScroll"
                    />
                </div>

                <!-- Drag Handle -->
                <div
                    class="relative flex w-2 cursor-col-resize items-center justify-center bg-transparent transition-colors hover:bg-emerald-500/20 active:bg-emerald-500/30"
                    @mousedown.prevent="startDrag"
                >
                    <div
                        class="h-8 w-0.5 rounded-full bg-[#e3e3e0] dark:bg-[#3E3E3A]"
                    />
                </div>

                <!-- Preview Pane -->
                <div
                    class="flex-1 overflow-hidden"
                    :style="{ width: `${(1 - splitRatio) * 100}%` }"
                >
                    <PreviewPanel
                        ref="previewPanelRef"
                        :html="parsed.html.value"
                        :filename="filename"
                        :active-font="activeFont"
                        @scroll="handlePreviewScroll"
                    />
                </div>
            </div>
        </div>

        <!-- Mobile: Tabbed View (Reka UI Tabs) -->
        <div class="flex flex-1 flex-col md:hidden">
            <Tabs default-value="edit" class="flex flex-1 flex-col">
                <div
                    class="flex justify-center border-b border-[#e3e3e0] px-4 py-2 dark:border-[#3E3E3A]"
                >
                    <TabsList>
                        <TabsTrigger value="edit"> Edit </TabsTrigger>
                        <TabsTrigger value="preview"> Preview </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="edit" class="flex-1 overflow-hidden">
                    <EditorPanel
                        ref="editorPanelRef"
                        v-model="markdown"
                        :active-font="activeFont"
                    />
                </TabsContent>

                <TabsContent value="preview" class="flex-1 overflow-hidden">
                    <PreviewPanel
                        ref="previewPanelRef"
                        :html="parsed.html.value"
                        :filename="filename"
                        :active-font="activeFont"
                    />
                </TabsContent>
            </Tabs>
        </div>

        <!-- Status Bar -->
        <StatusBar
            :word-count="parsed.wordCount.value"
            :char-count="parsed.charCount.value"
            :read-time-minutes="parsed.readTimeMinutes.value"
        />

        <!-- Sonner Toaster component for notification feedbacks -->
        <Toaster />
    </main>
</template>

<style>
.dark .hljs {
    background: #1e1e1e;
    color: #d4d4d4;
}

.dark .hljs-keyword {
    color: #569cd6;
}
.dark .hljs-string {
    color: #ce9178;
}
.dark .hljs-number {
    color: #b5cea8;
}
.dark .hljs-comment {
    color: #6a9955;
}
.dark .hljs-function {
    color: #dcdcaa;
}
.dark .hljs-title {
    color: #dcdcaa;
}
.dark .hljs-built_in {
    color: #4ec9b0;
}
.dark .hljs-attr {
    color: #9cdcfe;
}
.dark .hljs-attribute {
    color: #9cdcfe;
}
.dark .hljs-literal {
    color: #569cd6;
}
.dark .hljs-type {
    color: #4ec9b0;
}
.dark .hljs-meta {
    color: #dcdcaa;
}
.dark .hljs-tag {
    color: #569cd6;
}
.dark .hljs-name {
    color: #569cd6;
}
.dark .hljs-selector-class {
    color: #d7ba7d;
}
.dark .hljs-selector-id {
    color: #d7ba7d;
}

pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 1em;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
}
</style>
