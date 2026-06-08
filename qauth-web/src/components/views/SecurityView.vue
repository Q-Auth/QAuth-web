<script setup lang="ts">
import { LockKeyhole, ShieldCheck } from "lucide-vue-next";
import Badge from "../ui/Badge.vue";
import Card from "../ui/Card.vue";
import { copy, protections } from "../../content";
import type { Lang } from "../../types";

defineProps<{ lang: Lang }>();
</script>

<template>
  <section class="mx-auto max-w-[1440px] px-4 py-16 md:px-8">
    <Badge><LockKeyhole :size="14" /> {{ copy[lang].sections.security }}</Badge>
    <h1 class="mt-5 max-w-4xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.07em]">{{ copy[lang].sections.security }}</h1>
    <div class="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card v-for="item in protections[lang]" :key="item" class="qauth-card-hover border-black/10 bg-white p-8 shadow-none dark:border-white/10 dark:bg-[#171717]">
        <ShieldCheck class="mb-8 text-[#111] dark:text-[#f4f4f0]" />
        <p class="text-xl font-semibold tracking-tight">{{ item }}</p>
      </Card>
    </div>
  </section>
</template>
