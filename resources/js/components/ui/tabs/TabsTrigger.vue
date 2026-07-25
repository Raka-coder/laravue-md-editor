<script setup lang="ts">
import type { TabsTriggerProps } from 'reka-ui';
import { TabsTrigger } from 'reka-ui';

const props = defineProps<TabsTriggerProps>();
</script>

<template>
    <TabsTrigger
        v-bind="props"
        class="inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-[#706f6c] transition-all data-[state=active]:bg-white data-[state=active]:text-[#1b1b18] data-[state=active]:shadow-sm dark:text-[#A1A09A] dark:data-[state=active]:bg-[#161615] dark:data-[state=active]:text-[#EDEDEC]"
    >
        <slot />
    </TabsTrigger>
</template>
