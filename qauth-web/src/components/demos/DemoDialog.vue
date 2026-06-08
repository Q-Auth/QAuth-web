<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { CheckCircle2, Copy, Fingerprint, Loader2, Play, QrCode, Smartphone, X } from "lucide-vue-next";
import Button from "../ui/Button.vue";
import Card from "../ui/Card.vue";
import Dialog from "../ui/Dialog.vue";
import RealQrCode from "./RealQrCode.vue";
import { copy, demoItems } from "../../content";
import { authenticatePasskey, createClaimCode, createLoginSession, registerPasskey, solveProofOfWork } from "../../lib/qauth-demo";
import type { DemoId, Lang } from "../../types";

const props = defineProps<{
  demoId: DemoId | null;
  lang: Lang;
}>();

const emit = defineEmits<{
  close: [];
}>();

const session = ref(createLoginSession());
const claimCode = ref(createClaimCode());
const currentStep = ref(0);
const copied = ref(false);
const copyFailed = ref(false);
const busy = ref(false);
const actionResult = ref("");
const actionError = ref("");
let streamTimer: number | undefined;

const t = computed(() => copy[props.lang]);
const activeDemo = computed(() => demoItems[props.lang].find((demo) => demo.id === props.demoId) ?? null);
const dialogTitleId = computed(() => (activeDemo.value ? `demo-title-${activeDemo.value.id}` : undefined));
const isClaimCodeDemo = computed(() => props.demoId === "classicDesktop" || props.demoId === "classicMobile");
const isPasskeyDemo = computed(() => props.demoId === "register" || props.demoId === "passkeyLogin");
const actionButtonLabel = computed(() => {
  if (props.demoId === "pow") return currentStep.value > 1 ? "Re-solve SHA-256" : "Solve SHA-256";
  if (isPasskeyDemo.value) return t.value.runRealAction;
  return currentStep.value >= (activeDemo.value?.steps.length ?? 1) - 1 ? "↺" : `→ ${t.value.openDemo}`;
});

watch(
  () => props.demoId,
  () => {
    resetDemoState(true);
  },
);

onBeforeUnmount(() => {
  clearStreamTimer();
});

function clearStreamTimer() {
  window.clearInterval(streamTimer);
  streamTimer = undefined;
}

function resetDemoState(regenerate = false) {
  currentStep.value = 0;
  copied.value = false;
  copyFailed.value = false;
  busy.value = false;
  actionResult.value = "";
  actionError.value = "";
  clearStreamTimer();

  if (regenerate) {
    session.value = createLoginSession();
    claimCode.value = createClaimCode();
  }
}

async function runActiveDemo() {
  if (!activeDemo.value || busy.value) return;
  actionError.value = "";
  actionResult.value = "";

  if (props.demoId === "pow") {
    await runProofChallenge();
    return;
  }

  if (props.demoId === "register" || props.demoId === "passkeyLogin") {
    await runPasskeyAction(props.demoId);
    return;
  }

  advanceDemo();
}

function advanceDemo() {
  if (!activeDemo.value) return;
  if (currentStep.value >= activeDemo.value.steps.length - 1) {
    currentStep.value = 0;
    session.value = createLoginSession();
    claimCode.value = createClaimCode();
    actionResult.value = t.value.actionReady;
    return;
  }
  currentStep.value += 1;
}

async function runProofChallenge() {
  busy.value = true;
  currentStep.value = 1;

  try {
    const proof = await solveProofOfWork(session.value.id, 16);
    currentStep.value = 3;
    actionResult.value = `nonce=${proof.nonce} · ${proof.attempts.toLocaleString()} hashes · ${proof.elapsedMs}ms · ${proof.hash.slice(0, 18)}…`;
  } catch (error) {
    actionError.value = error instanceof Error ? error.message : String(error);
  } finally {
    busy.value = false;
  }
}

async function runPasskeyAction(id: "register" | "passkeyLogin") {
  busy.value = true;
  currentStep.value = 1;

  try {
    const result = id === "register" ? await registerPasskey() : await authenticatePasskey();
    currentStep.value = result.ok ? 3 : 1;
    actionResult.value = `${result.title}. ${result.detail}`;
    if (!result.ok) actionError.value = t.value.passkeyUnavailable;
  } catch (error) {
    currentStep.value = 1;
    actionError.value = error instanceof Error ? error.message : String(error);
  } finally {
    busy.value = false;
  }
}

function playStream() {
  if (!activeDemo.value) return;
  currentStep.value = 0;
  actionResult.value = `EventSource channel /qauth/${session.value.id}/events opened`;
  clearStreamTimer();
  streamTimer = window.setInterval(() => {
    if (!activeDemo.value || currentStep.value >= activeDemo.value.steps.length - 1) {
      clearStreamTimer();
      return;
    }
    currentStep.value += 1;
  }, 850);
}

async function copyClaimCode() {
  copyFailed.value = false;

  try {
    await navigator.clipboard.writeText(claimCode.value);
    copied.value = true;
  } catch {
    copyFailed.value = true;
    copied.value = false;
  }
}
</script>

<template>
  <Dialog :open="demoId !== null" :labelled-by="dialogTitleId" @close="emit('close')">
    <div v-if="activeDemo" class="overflow-hidden bg-[#f7f7f4] text-[#111] dark:bg-[#111] dark:text-[#f4f4f0]">
      <div class="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-[#f7f7f4]/90 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#111]/90">
        <div class="flex items-center gap-3">
          <span class="grid size-11 place-items-center rounded-full border border-black/10 bg-white text-2xl shadow-sm dark:border-white/10 dark:bg-white/10">{{ activeDemo.icon }}</span>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Real browser demo</p>
            <h2 :id="dialogTitleId" class="text-xl font-semibold tracking-tight">{{ activeDemo.title }}</h2>
          </div>
        </div>
        <Button variant="ghost" size="sm" class="rounded-full" @click="emit('close')"><X :size="16" />{{ t.close }}</Button>
      </div>

      <div class="grid gap-5 p-4 md:p-8 lg:grid-cols-[0.92fr_1.08fr]">
        <Card class="overflow-hidden border-black/10 bg-white p-4 shadow-none dark:border-white/10 dark:bg-[#171717]">
          <div class="rounded-[2rem] border border-black/10 bg-[#20211f] p-5 text-white dark:border-white/10">
            <div class="mb-5 flex items-center justify-between text-xs text-neutral-300">
              <span class="font-mono">{{ session.id }}</span>
              <span class="rounded-full border border-white/15 px-3 py-1">bound browser</span>
            </div>

            <div v-if="activeDemo.id === 'desktopQr' || activeDemo.id === 'classicDesktop'" class="rounded-[1.7rem] bg-white p-4">
              <RealQrCode :value="session.payload" class="mx-auto size-56" />
            </div>
            <div v-else-if="activeDemo.id === 'mobileConfirm' || activeDemo.id === 'classicMobile'" class="mx-auto max-w-sm rounded-[2rem] border border-white/10 bg-white/10 p-5">
              <div class="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/30" />
              <Smartphone class="mx-auto text-white" :size="58" />
              <p class="mt-5 text-center text-xl font-semibold">QAuth Workspace</p>
              <p class="mt-2 text-center text-sm text-neutral-300">{{ session.id.slice(0, 18) }}…</p>
            </div>
            <div v-else-if="activeDemo.id === 'pow'" class="space-y-4">
              <div class="h-3 overflow-hidden rounded-full bg-white/10"><div :class="['h-full rounded-full bg-white transition-all', busy ? 'qauth-progress' : 'w-full']" /></div>
              <code class="block rounded-2xl bg-black/40 p-4 text-sm text-neutral-100">SHA-256({{ session.id }}:nonce) starts with 0000</code>
            </div>
            <div v-else-if="activeDemo.id === 'sseFlow'" class="space-y-3">
              <div v-for="(step, index) in activeDemo.steps" :key="step" :class="['rounded-2xl p-4 text-sm ring-1', index <= currentStep ? 'bg-white text-[#111] ring-white' : 'bg-white/5 text-neutral-400 ring-white/10']">{{ index <= currentStep ? '●' : '○' }} {{ step }}</div>
            </div>
            <div v-else class="grid place-items-center rounded-[1.7rem] bg-white/10 p-10 text-center">
              <Fingerprint class="text-white" :size="72" />
              <p class="mt-5 text-2xl font-semibold">WebAuthn</p>
              <p class="mt-2 text-neutral-300">navigator.credentials {{ activeDemo.id === 'register' ? 'create()' : 'get()' }}</p>
            </div>

            <div class="mt-5 rounded-2xl bg-white/10 p-4">
              <p class="text-sm text-neutral-300">{{ t.verifySymbols }}</p>
              <div class="mt-2 flex gap-2 text-2xl"><span v-for="emoji in session.symbols" :key="emoji">{{ emoji }}</span></div>
            </div>
          </div>
        </Card>

        <Card class="border-black/10 bg-white p-6 shadow-none dark:border-white/10 dark:bg-[#171717]">
          <p class="text-neutral-600 dark:text-neutral-300">{{ activeDemo.desc }}</p>
          <div class="mt-6 space-y-3">
            <div v-for="(step, index) in activeDemo.steps" :key="step" :class="['flex items-center gap-3 rounded-2xl border p-4 transition', index <= currentStep ? 'border-[#111] bg-[#111] text-white dark:border-white dark:bg-white dark:text-[#111]' : 'border-black/10 bg-[#f7f7f4] text-neutral-500 dark:border-white/10 dark:bg-white/5 dark:text-neutral-400']">
              <span class="grid size-8 shrink-0 place-items-center rounded-full bg-current/10 font-semibold">{{ index + 1 }}</span>
              <span class="font-medium">{{ step }}</span>
            </div>
          </div>

          <div class="mt-6 rounded-2xl border border-black/10 bg-[#f7f7f4] p-4 font-mono text-xs text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
            <p>payload: {{ session.payload }}</p>
            <p>binding: {{ session.browserBinding }}</p>
          </div>

          <div v-if="isClaimCodeDemo" class="mt-6 rounded-2xl bg-[#111] p-5 text-center text-white dark:bg-white dark:text-[#111]">
            <p class="text-xs font-semibold uppercase tracking-[0.25em] opacity-60">{{ t.claimCode }}</p>
            <p class="mt-3 select-all font-mono text-3xl font-semibold tracking-widest">{{ claimCode }}</p>
            <Button variant="outline" class="mt-4 w-full rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 dark:border-black/20 dark:bg-black/5 dark:text-[#111]" @click="copyClaimCode"><Copy :size="16" />{{ copied ? t.copied : t.copyCode }}</Button>
            <p v-if="copyFailed" class="mt-3 text-sm text-amber-300" role="status">{{ t.copyFailed }}</p>
            <p v-else-if="copied" class="mt-3 text-sm text-emerald-300" role="status">{{ t.copied }}</p>
          </div>

          <p v-if="actionResult" class="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-200" role="status"><CheckCircle2 class="mr-2 inline" :size="16" />{{ actionResult }}</p>
          <p v-if="actionError" class="mt-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-200" role="status">{{ actionError }}</p>

          <div class="mt-6 flex flex-wrap gap-3">
            <Button v-if="activeDemo.id === 'sseFlow'" class="rounded-full" @click="playStream"><Play :size="16" />{{ t.replay }}</Button>
            <Button v-else class="rounded-full" :disabled="busy" @click="runActiveDemo"><Loader2 v-if="busy" class="animate-spin" :size="16" /><QrCode v-else-if="!isPasskeyDemo" :size="16" />{{ actionButtonLabel }}</Button>
            <Button variant="outline" class="rounded-full" @click="resetDemoState(true)">{{ t.reset }}</Button>
          </div>
        </Card>
      </div>
    </div>
  </Dialog>
</template>
