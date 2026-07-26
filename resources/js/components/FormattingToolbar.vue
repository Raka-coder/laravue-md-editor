<script setup lang="ts">
import {
    Bold,
    Italic,
    Heading,
    Link,
    Quote,
    Code,
    List,
    ListOrdered,
    CheckSquare,
    Type,
} from '@lucide/vue';

defineProps<{
    isSyncing: boolean;
    activeFont: string;
}>();

const fontOptions = ['mono', 'sans', 'serif'];
</script>

<template>
    <div
        class="flex flex-wrap items-center justify-between border-b border-[#e3e3e0] bg-[#fcfcfd] px-4 py-2 dark:border-[#3E3E3A] dark:bg-[#121215]"
    >
        <!-- Formatting actions -->
        <div class="flex flex-wrap items-center gap-1">
            <button
                @click="$emit('action', 'bold')"
                title="Bold (Ctrl+B)"
                class="rounded p-1.5 text-slate-600 transition-colors hover:bg-[#f0f0ee] dark:text-slate-400 dark:hover:bg-[#252524]"
            >
                <Bold class="h-4 w-4" />
            </button>
            <button
                @click="$emit('action', 'italic')"
                title="Italic (Ctrl+I)"
                class="rounded p-1.5 text-slate-600 transition-colors hover:bg-[#f0f0ee] dark:text-slate-400 dark:hover:bg-[#252524]"
            >
                <Italic class="h-4 w-4" />
            </button>
            <button
                @click="$emit('action', 'heading')"
                title="Heading"
                class="rounded p-1.5 text-slate-600 transition-colors hover:bg-[#f0f0ee] dark:text-slate-400 dark:hover:bg-[#252524]"
            >
                <Heading class="h-4 w-4" />
            </button>

            <div class="mx-1 h-4 w-px bg-[#e3e3e0] dark:bg-[#3E3E3A]" />

            <button
                @click="$emit('action', 'link')"
                title="Link"
                class="rounded p-1.5 text-slate-600 transition-colors hover:bg-[#f0f0ee] dark:text-slate-400 dark:hover:bg-[#252524]"
            >
                <Link class="h-4 w-4" />
            </button>
            <button
                @click="$emit('action', 'quote')"
                title="Quote"
                class="rounded p-1.5 text-slate-600 transition-colors hover:bg-[#f0f0ee] dark:text-slate-400 dark:hover:bg-[#252524]"
            >
                <Quote class="h-4 w-4" />
            </button>
            <button
                @click="$emit('action', 'code')"
                title="Code Block"
                class="rounded p-1.5 text-slate-600 transition-colors hover:bg-[#f0f0ee] dark:text-slate-400 dark:hover:bg-[#252524]"
            >
                <Code class="h-4 w-4" />
            </button>

            <div class="mx-1 h-4 w-px bg-[#e3e3e0] dark:bg-[#3E3E3A]" />

            <button
                @click="$emit('action', 'list')"
                title="Unordered List"
                class="rounded p-1.5 text-slate-600 transition-colors hover:bg-[#f0f0ee] dark:text-slate-400 dark:hover:bg-[#252524]"
            >
                <List class="h-4 w-4" />
            </button>
            <button
                @click="$emit('action', 'orderedList')"
                title="Ordered List"
                class="rounded p-1.5 text-slate-600 transition-colors hover:bg-[#f0f0ee] dark:text-slate-400 dark:hover:bg-[#252524]"
            >
                <ListOrdered class="h-4 w-4" />
            </button>
            <button
                @click="$emit('action', 'taskList')"
                title="Task List"
                class="rounded p-1.5 text-slate-600 transition-colors hover:bg-[#f0f0ee] dark:text-slate-400 dark:hover:bg-[#252524]"
            >
                <CheckSquare class="h-4 w-4" />
            </button>
        </div>

        <!-- Sync Scroll toggle & Font dropdown -->
        <div class="flex items-center gap-3">
            <!-- Sync scroll checkbox trigger -->
            <label
                class="flex cursor-pointer items-center gap-2 text-xs text-slate-600 select-none dark:text-slate-400"
            >
                <input
                    type="checkbox"
                    :checked="isSyncing"
                    @change="$emit('toggle-sync')"
                    class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-800 dark:bg-zinc-950"
                />
                Sync Scroll
            </label>

            <div class="h-4 w-px bg-[#e3e3e0] dark:bg-[#3E3E3A]" />

            <!-- Font dropdown selection -->
            <div class="flex items-center gap-1.5">
                <Type class="h-3.5 w-3.5 text-slate-500" />
                <select
                    :value="activeFont"
                    @change="
                        (e) =>
                            $emit(
                                'change-font',
                                (e.target as HTMLSelectElement).value,
                            )
                    "
                    class="cursor-pointer border-0 bg-transparent py-0.5 pr-7 pl-1 text-xs font-medium text-slate-600 focus:ring-0 dark:text-slate-400"
                >
                    <option
                        v-for="font in fontOptions"
                        :key="font"
                        :value="font"
                    >
                        {{ font.charAt(0).toUpperCase() + font.slice(1) }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>
