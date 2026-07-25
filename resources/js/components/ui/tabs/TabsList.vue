<script setup lang="ts">
import type { TabsListProps } from 'reka-ui';
import { TabsList } from 'reka-ui';

const props = defineProps<TabsListProps>();
</script>

<template>
    <TabsList v-bind="props" class="inline-flex items-center gap-1 rounded-lg bg-[#f0f0ee] p-1 dark:bg-[#252524]">
        <slot />
    </TabsList>
</template>
