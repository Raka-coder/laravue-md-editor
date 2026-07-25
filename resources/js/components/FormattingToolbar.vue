<script setup lang="ts">
import { Bold, Italic, Heading, Link, Quote, Code, List, ListOrdered, CheckSquare, Type } from '@lucide/vue';

defineProps<{
    isSyncing: boolean;
    activeFont: string;
}>();

const fontOptions = ['mono', 'sans', 'serif'];
</script>

<template>
    <div class="flex flex-wrap items-center justify-between border-b border-[#e3e3e0] bg-[#fcfcfd] px-4 py-2 dark:border-[#3E3E3A] dark:bg-[#121215]">
        <!-- Formatting actions -->
        <div class="flex flex-wrap items-center gap-1">
            <button @click="$emit('action', 'bold')" title="Bold (Ctrl+B)" class="rounded p-1.5 hover:bg-[#f0f0ee] dark:hover:bg-[#252524] text-slate-600 dark:text-slate-400 transition-colors">
                <Bold class="h-4 w-4" />
            </button>
            <button @click="$emit('action', 'italic')" title="Italic (Ctrl+I)" class="rounded p-1.5 hover:bg-[#f0f0ee] dark:hover:bg-[#252524] text-slate-600 dark:text-slate-400 transition-colors">
                <Italic class="h-4 w-4" />
            </button>
            <button @click="$emit('action', 'heading')" title="Heading" class="rounded p-1.5 hover:bg-[#f0f0ee] dark:hover:bg-[#252524] text-slate-600 dark:text-slate-400 transition-colors">
                <Heading class="h-4 w-4" />
            </button>
            
            <div class="h-4 w-px bg-[#e3e3e0] dark:bg-[#3E3E3A] mx-1" />
            
            <button @click="$emit('action', 'link')" title="Link" class="rounded p-1.5 hover:bg-[#f0f0ee] dark:hover:bg-[#252524] text-slate-600 dark:text-slate-400 transition-colors">
                <Link class="h-4 w-4" />
            </button>
            <button @click="$emit('action', 'quote')" title="Quote" class="rounded p-1.5 hover:bg-[#f0f0ee] dark:hover:bg-[#252524] text-slate-600 dark:text-slate-400 transition-colors">
                <Quote class="h-4 w-4" />
            </button>
            <button @click="$emit('action', 'code')" title="Code Block" class="rounded p-1.5 hover:bg-[#f0f0ee] dark:hover:bg-[#252524] text-slate-600 dark:text-slate-400 transition-colors">
                <Code class="h-4 w-4" />
            </button>
            
            <div class="h-4 w-px bg-[#e3e3e0] dark:bg-[#3E3E3A] mx-1" />
            
            <button @click="$emit('action', 'list')" title="Unordered List" class="rounded p-1.5 hover:bg-[#f0f0ee] dark:hover:bg-[#252524] text-slate-600 dark:text-slate-400 transition-colors">
                <List class="h-4 w-4" />
            </button>
            <button @click="$emit('action', 'orderedList')" title="Ordered List" class="rounded p-1.5 hover:bg-[#f0f0ee] dark:hover:bg-[#252524] text-slate-600 dark:text-slate-400 transition-colors">
                <ListOrdered class="h-4 w-4" />
            </button>
            <button @click="$emit('action', 'taskList')" title="Task List" class="rounded p-1.5 hover:bg-[#f0f0ee] dark:hover:bg-[#252524] text-slate-600 dark:text-slate-400 transition-colors">
                <CheckSquare class="h-4 w-4" />
            </button>
        </div>

        <!-- Sync Scroll toggle & Font dropdown -->
        <div class="flex items-center gap-3">
            <!-- Sync scroll checkbox trigger -->
            <label class="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 select-none">
                <input 
                    type="checkbox" 
                    :checked="isSyncing" 
                    @change="$emit('toggle-sync')" 
                    class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 dark:border-slate-800 dark:bg-zinc-950" 
                />
                Sync Scroll
            </label>

            <div class="h-4 w-px bg-[#e3e3e0] dark:bg-[#3E3E3A]" />

            <!-- Font dropdown selection -->
            <div class="flex items-center gap-1.5">
                <Type class="h-3.5 w-3.5 text-slate-500" />
                <select 
                    :value="activeFont" 
                    @change="e => $emit('change-font', (e.target as HTMLSelectElement).value)" 
                    class="bg-transparent border-0 py-0.5 pl-1 pr-7 text-xs font-medium text-slate-600 dark:text-slate-400 focus:ring-0 cursor-pointer"
                >
                    <option v-for="font in fontOptions" :key="font" :value="font">
                        {{ font.charAt(0).toUpperCase() + font.slice(1) }}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>
