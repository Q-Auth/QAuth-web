<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../../lib/utils";
const props = defineProps<{ class?: string }>();
const classes = computed(() => cn("rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#171717]", props.class));
</script>
<template><section :class="classes"><slot /></section></template>
