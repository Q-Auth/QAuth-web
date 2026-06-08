<script setup lang="ts">
import { CheckCircle2 } from "lucide-vue-next";
import Badge from "../ui/Badge.vue";
import Card from "../ui/Card.vue";
import { copy, roadmap } from "../../content";
import type { Lang } from "../../types";

defineProps<{ lang: Lang }>();
</script>

<template>
  <section class="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
    <Badge>{{ copy[lang].sections.roadmap }}</Badge>
    <h1 class="mt-5 max-w-4xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.07em]">{{ copy[lang].sections.roadmap }}</h1>
    <div class="mt-10 grid gap-4 md:grid-cols-3">
      <Card v-for="column in roadmap[lang]" :key="column.title" class="border-black/10 bg-white p-8 shadow-none dark:border-white/10 dark:bg-[#171717]">
        <h2 class="text-3xl font-semibold tracking-tight">{{ column.title }}</h2>
        <ul class="mt-8 space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
          <li v-for="item in column.items" :key="item" class="flex gap-3"><CheckCircle2 class="mt-0.5 shrink-0 text-[#111] dark:text-[#f4f4f0]" :size="17" />{{ item }}</li>
        </ul>
      </Card>
    </div>
  </section>
</template>
