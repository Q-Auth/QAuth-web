<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{
  open: boolean;
  labelledBy?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const panel = ref<HTMLElement | null>(null);
let previouslyFocused: HTMLElement | null = null;

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) {
      restoreFocus();
      return;
    }

    previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.addEventListener("keydown", handleDocumentKeydown);
    await nextTick();
    focusInitialElement();
  },
);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleDocumentKeydown);
  restoreFocus();
});

function restoreFocus() {
  document.removeEventListener("keydown", handleDocumentKeydown);
  previouslyFocused?.focus?.();
  previouslyFocused = null;
}

function focusInitialElement() {
  const firstFocusable = panel.value?.querySelector<HTMLElement>(focusableSelector);
  (firstFocusable ?? panel.value)?.focus();
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (!props.open) return;

  if (event.key === "Escape") {
    event.preventDefault();
    emit("close");
    return;
  }

  if (event.key === "Tab") {
    trapFocus(event);
  }
}

function trapFocus(event: KeyboardEvent) {
  const focusableElements = Array.from(panel.value?.querySelectorAll<HTMLElement>(focusableSelector) ?? []).filter((element) => element.offsetParent !== null);

  if (focusableElements.length === 0) {
    event.preventDefault();
    panel.value?.focus();
    return;
  }

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 grid place-items-center bg-zinc-950/70 p-4 backdrop-blur" @click.self="emit('close')">
      <div
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="labelledBy"
        tabindex="-1"
        class="max-h-[92vh] w-full max-w-6xl overflow-auto rounded-[2rem] bg-white shadow-2xl outline-none dark:bg-zinc-950"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
