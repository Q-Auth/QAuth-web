<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import QRCode from "qrcode";
import { cn } from "../../lib/utils";

const props = withDefaults(
  defineProps<{
    value: string;
    alt?: string;
    class?: string;
  }>(),
  {
    alt: "QAuth login QR code",
  },
);

const qrDataUrl = ref("");
const hasError = ref(false);
const classes = computed(() => cn("block aspect-square w-full rounded-2xl bg-white object-contain", props.class));

watchEffect(async () => {
  hasError.value = false;

  try {
    qrDataUrl.value = await QRCode.toDataURL(props.value, {
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
      margin: 2,
      scale: 8,
    });
  } catch {
    qrDataUrl.value = "";
    hasError.value = true;
  }
});
</script>

<template>
  <img v-if="qrDataUrl" :src="qrDataUrl" :alt="alt" :class="classes" />
  <div v-else :class="classes" class="grid place-items-center p-4 text-center text-sm font-semibold text-zinc-500">
    {{ hasError ? "QR unavailable" : "Generating QR…" }}
  </div>
</template>
