<script setup lang="ts">
import { cva } from "class-variance-authority";
import { computed } from "vue";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-white/30",
  {
    variants: {
      variant: {
        default: "bg-[#111] text-white shadow-sm hover:bg-[#2a2a2a] dark:bg-[#f4f4f0] dark:text-[#111] dark:hover:bg-white",
        secondary: "bg-neutral-100 text-[#111] hover:bg-neutral-200 dark:bg-white/10 dark:text-[#f4f4f0] dark:hover:bg-white/15",
        outline: "border border-black/10 bg-transparent text-[#111] hover:bg-black/5 dark:border-white/15 dark:text-[#f4f4f0] dark:hover:bg-white/10",
        ghost: "text-neutral-700 hover:bg-black/5 dark:text-neutral-200 dark:hover:bg-white/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

const props = defineProps<{ variant?: "default" | "secondary" | "outline" | "ghost"; size?: "default" | "sm" | "lg"; class?: string; disabled?: boolean }>();
const classes = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size }), props.class));
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
