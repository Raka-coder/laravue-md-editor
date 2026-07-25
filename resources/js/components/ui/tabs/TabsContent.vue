<script setup lang="ts">
import type { TabsContentProps } from 'reka-ui';
import { TabsContent } from 'reka-ui';

const props = defineProps<TabsContentProps>();
</script>

<template>
    <TabsContent v-bind="props" class="outline-none">
        <slot />
    </TabsContent>
</template>
