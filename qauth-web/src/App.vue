<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Languages, Moon, ShieldCheck, Sun } from "lucide-vue-next";
import Button from "./components/ui/Button.vue";
import DemoDialog from "./components/demos/DemoDialog.vue";
import DocsView from "./components/views/DocsView.vue";
import LandingView from "./components/views/LandingView.vue";
import RoadmapView from "./components/views/RoadmapView.vue";
import SecurityView from "./components/views/SecurityView.vue";
import { copy } from "./content";
import type { DemoId, Lang, NavTarget, RoutePath } from "./types";

const ROUTES: RoutePath[] = ["/", "/demo", "/docs", "/security", "/roadmap"];

const lang = ref<Lang>("zh");
const dark = ref(false);
const path = ref<RoutePath>("/");
const modalDemo = ref<DemoId | null>(null);

const t = computed(() => copy[lang.value]);
const navItems = computed<NavTarget[]>(() => [
  { label: t.value.nav.position, to: "/" },
  { label: t.value.nav.capabilities, to: "/demo", hash: "#capabilities" },
  { label: t.value.nav.flow, to: "/demo", hash: "#flow" },
  { label: t.value.nav.demos, to: "/demo", hash: "#demos" },
  { label: t.value.nav.security, to: "/security" },
  { label: t.value.nav.roadmap, to: "/roadmap" },
]);
const currentRoute = computed<RoutePath>(() => path.value);

onMounted(() => {
  lang.value = localStorage.getItem("qauth-lang") === "en" ? "en" : "zh";
  dark.value = localStorage.getItem("qauth-theme") === "dark" || (!localStorage.getItem("qauth-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
  syncPathFromLocation();
  applyTheme();
  document.documentElement.lang = lang.value === "zh" ? "zh-CN" : "en";
  window.addEventListener("popstate", syncPathFromLocation);
});

onBeforeUnmount(() => {
  window.removeEventListener("popstate", syncPathFromLocation);
});

watch(lang, (value) => {
  localStorage.setItem("qauth-lang", value);
  document.documentElement.lang = value === "zh" ? "zh-CN" : "en";
});

watch(dark, applyTheme);

function normalizePath(value: string): RoutePath {
  return ROUTES.includes(value as RoutePath) ? (value as RoutePath) : "/";
}

function syncPathFromLocation() {
  path.value = normalizePath(window.location.pathname);
  if (window.location.hash) scrollToHash(window.location.hash);
}

function applyTheme() {
  document.documentElement.classList.toggle("dark", dark.value);
  localStorage.setItem("qauth-theme", dark.value ? "dark" : "light");
}

function navigate(target: string | NavTarget) {
  const to = typeof target === "string" ? target : `${target.to}${target.hash ?? ""}`;
  const url = new URL(to, window.location.origin);
  const nextPath = normalizePath(url.pathname);
  history.pushState({}, "", `${nextPath}${url.hash}`);
  path.value = nextPath;

  if (url.hash) scrollToHash(url.hash);
  else scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToHash(hash: string) {
  nextTick(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }));
}

function openDemo(id: DemoId) {
  modalDemo.value = id;
}
</script>

<template>
  <main class="qauth-page-bg min-h-screen overflow-hidden text-[#111] dark:text-[#f4f4f0]">
    <header class="sticky top-0 z-40 border-b border-black/10 bg-[#f7f7f4]/90 backdrop-blur-2xl dark:border-white/10 dark:bg-[#111]/85">
      <div class="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 md:px-8">
        <button class="group flex items-center gap-3" @click="navigate('/')">
          <span class="grid size-9 place-items-center rounded-full bg-[#111] text-white dark:bg-white dark:text-[#111]"><ShieldCheck :size="18" /></span>
          <span class="text-left">
            <span class="block text-base font-semibold tracking-tight">QAuth</span>
            <span class="hidden text-xs text-neutral-500 dark:text-neutral-400 sm:block">{{ t.badge }}</span>
          </span>
        </button>

        <nav class="hidden items-center gap-5 lg:flex">
          <button v-for="item in navItems" :key="item.label" class="text-sm font-medium text-neutral-600 transition hover:text-[#111] dark:text-neutral-300 dark:hover:text-white" @click="navigate(item)">
            {{ item.label }}
          </button>
        </nav>

        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" class="rounded-full" @click="lang = lang === 'zh' ? 'en' : 'zh'"><Languages :size="15" />{{ lang.toUpperCase() }}</Button>
          <Button variant="ghost" size="sm" class="rounded-full" @click="dark = !dark"><Sun v-if="dark" :size="16" /><Moon v-else :size="16" /></Button>
          <Button size="sm" class="rounded-full px-4" @click="navigate('/demo#demos')">{{ t.demo }}</Button>
        </div>
      </div>
    </header>

    <LandingView v-if="currentRoute === '/' || currentRoute === '/demo'" :lang="lang" @navigate="navigate" @open-demo="openDemo" />
    <DocsView v-else-if="currentRoute === '/docs'" :lang="lang" @navigate="navigate" />
    <SecurityView v-else-if="currentRoute === '/security'" :lang="lang" />
    <RoadmapView v-else-if="currentRoute === '/roadmap'" :lang="lang" />

    <DemoDialog :demo-id="modalDemo" :lang="lang" @close="modalDemo = null" />
  </main>
</template>
