<script setup lang="ts">
import { ArrowRight, CheckCircle2, Fingerprint, LockKeyhole, Play, ShieldCheck, Smartphone } from "lucide-vue-next";
import Badge from "../ui/Badge.vue";
import Button from "../ui/Button.vue";
import Card from "../ui/Card.vue";
import RealQrCode from "../demos/RealQrCode.vue";
import { capabilities, copy, demoItems, flow } from "../../content";
import { createLoginSession } from "../../lib/qauth-demo";
import type { DemoId, Lang } from "../../types";

const props = defineProps<{
  lang: Lang;
}>();

const emit = defineEmits<{
  navigate: [to: string];
  openDemo: [id: DemoId];
}>();

const heroSession = createLoginSession();
</script>

<template>
  <template v-if="props.lang">
    <section id="position" class="mx-auto grid max-w-[1440px] items-end gap-10 px-4 pb-16 pt-10 md:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:pb-24 lg:pt-14">
      <div class="max-w-4xl">
        <p class="mb-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">QAuth / Device-first Authentication Engine</p>
        <h1 class="max-w-5xl text-[clamp(3.8rem,10vw,9.4rem)] font-semibold leading-[0.86] tracking-[-0.075em] text-[#111] dark:text-[#f4f4f0]">
          {{ copy[lang].heroA }}<br />{{ copy[lang].heroB }}
        </h1>
        <p class="mt-8 max-w-2xl text-xl leading-8 text-neutral-700 dark:text-neutral-300">{{ copy[lang].heroDesc }}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <Button size="lg" class="rounded-full px-6" @click="emit('navigate', '/demo#demos')">{{ copy[lang].cta1 }}<ArrowRight :size="18" /></Button>
          <Button variant="outline" size="lg" class="rounded-full px-6" @click="emit('navigate', '/security')"><ShieldCheck :size="18" />{{ copy[lang].cta2 }}</Button>
        </div>
      </div>

      <Card class="overflow-hidden rounded-[2rem] border-black/10 bg-[#20211f] p-4 text-white shadow-none dark:border-white/10">
        <div class="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p class="text-sm text-neutral-400">What can I approve?</p>
            <p class="text-2xl font-semibold tracking-tight">QAuth login</p>
          </div>
          <Badge class="border-white/15 bg-white/10 text-white">Live browser APIs</Badge>
        </div>
        <div class="grid gap-4 pt-4 md:grid-cols-[0.85fr_1fr]">
          <div class="rounded-[1.75rem] bg-white p-4"><RealQrCode :value="heroSession.payload" class="mx-auto h-60" /></div>
          <div class="space-y-4">
            <div class="rounded-[1.75rem] border border-white/10 bg-white/10 p-5">
              <Smartphone class="text-white" />
              <p class="mt-5 text-2xl font-semibold">QAuth Workspace</p>
              <p class="mt-2 font-mono text-xs text-neutral-300">{{ heroSession.id }}</p>
            </div>
            <div class="rounded-[1.75rem] border border-white/10 bg-white/10 p-5">
              <p class="text-sm text-neutral-300">Approval symbols</p>
              <p class="mt-3 text-3xl"><span v-for="emoji in heroSession.symbols" :key="emoji" class="mr-2">{{ emoji }}</span></p>
            </div>
          </div>
        </div>
      </Card>
    </section>

    <section id="capabilities" class="mx-auto max-w-[1440px] scroll-mt-28 px-4 py-12 md:px-8">
      <div class="mb-8 flex flex-col justify-between gap-4 border-t border-black/10 pt-5 dark:border-white/10 md:flex-row">
        <div>
          <Badge>{{ copy[lang].nav.capabilities }}</Badge>
          <h2 class="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{{ copy[lang].sections.capabilities }}</h2>
        </div>
        <p class="max-w-md text-neutral-600 dark:text-neutral-300">{{ copy[lang].sections.capabilitiesDesc }}</p>
      </div>
      <div class="grid gap-px overflow-hidden rounded-[2rem] border border-black/10 bg-black/10 dark:border-white/10 dark:bg-white/10 md:grid-cols-2 xl:grid-cols-4">
        <Card v-for="item in capabilities[lang]" :key="item.title" class="qauth-card-hover rounded-none border-0 bg-[#f7f7f4] p-6 shadow-none dark:bg-[#111]">
          <component :is="item.icon" class="text-[#111] dark:text-[#f4f4f0]" :size="30" />
          <h3 class="mt-8 text-2xl font-semibold tracking-tight">{{ item.title }}</h3>
          <p class="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{{ item.desc }}</p>
        </Card>
      </div>
    </section>

    <section id="flow" class="mx-auto max-w-[1440px] scroll-mt-28 px-4 py-12 md:px-8">
      <Card class="overflow-hidden border-black/10 bg-[#111] text-white shadow-none dark:border-white/10">
        <div class="grid gap-10 p-6 md:grid-cols-[0.72fr_1.28fr] md:p-10">
          <div>
            <Badge class="border-white/15 bg-white/10 text-white">{{ copy[lang].nav.flow }}</Badge>
            <h2 class="mt-5 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{{ copy[lang].sections.flow }}</h2>
            <p class="mt-4 text-neutral-300">{{ copy[lang].sections.flowDesc }}</p>
          </div>
          <div class="grid gap-px overflow-hidden rounded-[1.7rem] bg-white/10">
            <div v-for="(step, index) in flow[lang]" :key="step" class="flex items-center gap-4 bg-[#20211f] p-5">
              <span class="grid size-9 shrink-0 place-items-center rounded-full bg-white font-semibold text-[#111]">{{ index + 1 }}</span>
              <span class="font-medium">{{ step }}</span>
            </div>
          </div>
        </div>
      </Card>
    </section>

    <section id="demos" class="mx-auto max-w-[1440px] scroll-mt-28 px-4 py-12 md:px-8">
      <div class="mb-8 border-t border-black/10 pt-5 dark:border-white/10">
        <Badge>{{ copy[lang].nav.demos }}</Badge>
        <h2 class="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{{ copy[lang].sections.demo }}</h2>
        <p class="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-300">{{ copy[lang].sections.demoDesc }}</p>
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <button v-for="demo in demoItems[lang]" :key="demo.id" class="group text-left" @click="emit('openDemo', demo.id)">
          <Card class="qauth-card-hover h-full overflow-hidden border-black/10 bg-white p-6 shadow-none dark:border-white/10 dark:bg-[#171717]">
            <div class="mb-8 flex items-center justify-between">
              <span class="text-4xl">{{ demo.icon }}</span>
              <span class="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-neutral-600 transition group-hover:bg-[#111] group-hover:text-white dark:border-white/10 dark:text-neutral-300 dark:group-hover:bg-white dark:group-hover:text-[#111]">{{ copy[lang].openDemo }}</span>
            </div>
            <h3 class="text-2xl font-semibold tracking-tight">{{ demo.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{{ demo.desc }}</p>
            <div class="mt-8 flex items-center gap-2 text-sm font-medium"><Play :size="15" />{{ copy[lang].runRealAction }}</div>
          </Card>
        </button>
      </div>
    </section>

    <section class="mx-auto max-w-[1440px] px-4 pb-20 pt-8 md:px-8">
      <div class="grid gap-4 md:grid-cols-4">
        <div v-for="item in [copy[lang].trusted, copy[lang].qr, copy[lang].passkey, copy[lang].live]" :key="item" class="rounded-[1.5rem] border border-black/10 bg-white p-5 text-sm font-medium dark:border-white/10 dark:bg-[#171717]">
          <CheckCircle2 class="mb-4 text-[#111] dark:text-[#f4f4f0]" :size="18" />{{ item }}
        </div>
      </div>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <Card class="border-black/10 bg-[#d9d5c9] p-8 shadow-none dark:border-white/10 dark:bg-[#242424]"><Fingerprint :size="34" /><h3 class="mt-8 text-3xl font-semibold tracking-tight">Passkey-first</h3></Card>
        <Card class="border-black/10 bg-[#cbd7c3] p-8 shadow-none dark:border-white/10 dark:bg-[#1f2a20]"><LockKeyhole :size="34" /><h3 class="mt-8 text-3xl font-semibold tracking-tight">No token in QR</h3></Card>
      </div>
    </section>
  </template>
</template>
