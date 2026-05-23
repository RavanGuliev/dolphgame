<script setup lang="ts">
import { ref } from "vue";
useHead({ title: "Yardım" });
const { $api } = useNuxtApp();
const rows = await $api.get("public/faqs");

const openIndex = ref<number | null>(0);
const toggle = (i: number) => (openIndex.value = openIndex.value === i ? null : i);
</script>

<template>
  <main class="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10">
    <!-- Header -->
    <div class="text-center mb-8">
      <span class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
        Yardım mərkəzi
      </span>
      <h1 class="mt-4 text-2xl md:text-3xl font-black tracking-tight text-ink-900 dark:text-white">Suallar və cavablar</h1>
      <p class="mt-2 text-sm text-ink-500 dark:text-ink-400">Ən çox verilən sualların cavablarını burada tapın.</p>
    </div>

    <!-- Accordion -->
    <div class="space-y-3">
      <div
        v-for="(row, key) in rows.data"
        :key="key"
        class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 overflow-hidden transition"
        :class="{ 'ring-brand-500/60 shadow-card': openIndex === key }"
      >
        <button @click="toggle(key)" type="button" class="w-full flex items-center gap-3 p-4 md:p-5 text-left">
          <span class="w-7 h-7 shrink-0 rounded-lg grid place-items-center text-[12px] font-black transition" :class="openIndex === key ? 'bg-brand-500 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400'">{{ key + 1 }}</span>
          <span class="flex-1 text-[14px] md:text-[15px] font-bold text-ink-900 dark:text-white">{{ row.title }}</span>
          <svg class="w-4 h-4 shrink-0 text-ink-400 transition-transform" :class="{ 'rotate-180 text-brand-500': openIndex === key }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div v-show="openIndex === key" class="px-4 md:px-5 pb-5 -mt-1">
          <div class="pl-10 text-[13.5px] leading-relaxed text-ink-600 dark:text-ink-300 prose-dd" v-html="row.description"></div>
        </div>
      </div>

      <div v-if="!rows.data || !rows.data.length" class="text-center py-10 text-sm text-ink-500 dark:text-ink-400">Hələ sual yoxdur.</div>
    </div>
  </main>
</template>

<style scoped>
.prose-dd :deep(p) { margin-bottom: .6rem; }
.prose-dd :deep(ul) { list-style: disc; padding-left: 1.25rem; margin-bottom: .6rem; }
.prose-dd :deep(a) { color: #FF4800; }
.prose-dd :deep(strong) { color: inherit; font-weight: 700; }
</style>
