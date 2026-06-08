<script setup lang="ts">
import { CheckCircle2 } from "lucide-vue-next";
import Badge from "../ui/Badge.vue";
import Button from "../ui/Button.vue";
import Card from "../ui/Card.vue";
import { copy, docsItems } from "../../content";
import type { Lang } from "../../types";

defineProps<{ lang: Lang }>();
defineEmits<{ navigate: [to: string] }>();
</script>

<template>
  <section class="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
    <Badge>{{ copy[lang].sections.docs }}</Badge>
    <h1 class="mt-5 max-w-4xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.07em]">QAuth Docs</h1>
    <p class="mt-6 max-w-2xl text-xl leading-8 text-neutral-600 dark:text-neutral-300">{{ copy[lang].docsDesc }}</p>
    <div class="mt-10 grid gap-px overflow-hidden rounded-[2rem] border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 md:grid-cols-2">
      <Card v-for="item in docsItems[lang]" :key="item" class="qauth-card-hover rounded-none border-0 bg-[#f7f7f4] p-8 shadow-none dark:bg-[#171717]"><CheckCircle2 class="mb-8" />{{ item }}</Card>
    </div>
    <Button class="mt-8 rounded-full" @click="$emit('navigate', '/demo')">{{ copy[lang].backDemo }}</Button>
  </section>
</template>
