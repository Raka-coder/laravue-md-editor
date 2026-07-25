<script setup lang="ts">
import { Download, Upload, Copy, RotateCcw, Moon, Sun, AlertTriangle } from '@lucide/vue';
import { ref } from 'vue';
import { useAppearance } from '@/composables/useAppearance';
import { useFileHandler } from '@/composables/useFileHandler';

const emit = defineEmits<{
    import: [content: string];
    reset: [];
    copy: [];
    'update:filename': [value: string];
}>();

const props = defineProps<{
    markdownContent: string;
    filename: string;
}>();

const { exportFile } = useFileHandler();
const { appearance, toggleAppearance } = useAppearance();

const showConfirmReset = ref(false);

function handleFileInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
return;
}

    const reader = new FileReader();
    reader.onload = (ev) => {
        const content = ev.target?.result as string;

        if (content) {
            emit('import', content);
            // Sync filename from imported file
            const nameWithoutExt = file.name.endsWith('.md') ? file.name : `${file.name}.md`;
            emit('update:filename', nameWithoutExt);
        }
    };
    reader.readAsText(file);
    input.value = '';
}

function handleExport() {
    exportFile(props.markdownContent, props.filename);
}

function triggerReset() {
    emit('reset');
    showConfirmReset.value = false;
}
</script>

<template>
    <div class="flex items-center justify-between border-b border-[#e3e3e0] bg-white px-4 py-2 dark:border-[#3E3E3A] dark:bg-[#161615]">
        <!-- Document Name and Operations -->
        <div class="flex items-center gap-3">
            <!-- Filename input -->
            <input 
                type="text" 
                :value="filename" 
                @input="e => $emit('update:filename', (e.target as HTMLInputElement).value)"
                placeholder="untitled.md"
                class="bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-emerald-500 focus:ring-0 px-1 py-0.5 text-sm font-semibold max-w-[180px] outline-none text-slate-800 dark:text-slate-200 transition-colors"
            />
            
            <div class="h-4 w-px bg-[#e3e3e0] dark:bg-[#3E3E3A]" />

            <!-- Import button -->
            <label class="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-[#706f6c] transition-colors hover:bg-[#f0f0ee] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:bg-[#252524] dark:hover:text-[#EDEDEC]">
                <Upload class="h-3.5 w-3.5" />
                Import
                <input type="file" accept=".md" class="hidden" @change="handleFileInput" />
            </label>

            <!-- Export button -->
            <button @click="handleExport" class="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-[#706f6c] transition-colors hover:bg-[#f0f0ee] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:bg-[#252524] dark:hover:text-[#EDEDEC]">
                <Download class="h-3.5 w-3.5" />
                Export
            </button>

            <!-- Copy button -->
            <button @click="$emit('copy')" class="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-[#706f6c] transition-colors hover:bg-[#f0f0ee] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:bg-[#252524] dark:hover:text-[#EDEDEC]">
                <Copy class="h-3.5 w-3.5" />
                Copy
            </button>
        </div>

        <!-- System controls (Theme / Reset) -->
        <div class="flex items-center gap-2">
            <!-- Theme toggle -->
            <button @click="toggleAppearance" class="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-[#706f6c] transition-colors hover:bg-[#f0f0ee] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:bg-[#252524] dark:hover:text-[#EDEDEC]" title="Toggle theme">
                <Sun v-if="appearance === 'dark'" class="h-3.5 w-3.5" />
                <Moon v-else class="h-3.5 w-3.5" />
            </button>

            <!-- Reset button -->
            <button @click="showConfirmReset = true" class="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/20" title="Reset workspace">
                <RotateCcw class="h-3.5 w-3.5" />
            </button>
        </div>

        <!-- Custom Reset Confirmation Modal -->
        <div v-if="showConfirmReset" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
            <div class="w-full max-w-sm rounded-[1.5rem] bg-white p-6 shadow-xl dark:bg-zinc-900 border border-slate-200 dark:border-slate-800">
                <div class="flex items-center gap-3 text-rose-600 mb-3">
                    <AlertTriangle class="h-5 w-5" />
                    <h3 class="font-bold text-sm">Reset Workspace?</h3>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    This action will clear all current content and reset the editor back to default. This cannot be undone.
                </p>
                <div class="flex justify-end gap-2">
                    <button @click="showConfirmReset = false" class="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300">
                        Cancel
                    </button>
                    <button @click="triggerReset" class="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 active:scale-95 transition-all">
                        Reset
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
