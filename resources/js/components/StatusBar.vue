<script setup lang="ts">
defineProps<{
    wordCount: number;
    charCount: number;
    readTimeMinutes: number;
}>();
</script>

<template>
    <div
        class="flex items-center justify-between border-t border-[#e3e3e0] bg-white px-4 py-1.5 text-xs text-[#706f6c] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#A1A09A]"
    >
        <div class="flex items-center gap-4">
            <span>{{ wordCount }} words</span>
            <span>{{ charCount }} characters</span>
            <span>{{ readTimeMinutes }} min read</span>
        </div>
        <span class="text-[#a09f9c] dark:text-[#5e5e5a]">Draft auto-saved</span>
    </div>
</template>
