<script setup lang="ts">
import { generalStore } from "~/stores/generalStore";
import { storeToRefs } from "pinia";

const { $api } = useNuxtApp();
const general = generalStore();
const { data } = storeToRefs(general);
const row = await $api.get('public/privacy')
useHead({
  title: 'Qaydalar'
})

const waLink = computed(() => {
  const p = (data.value?.phone || "994503345616").replace(/[^0-9]/g, "");
  return "https://wa.me/" + p;
});

// The rules text comes from the CMS as loosely-formatted HTML (no real
// <h2> headings), so we derive a table of contents from whatever numbered
// "N. Title" bold lines exist, rather than hard-coding section anchors.
const contentEl = ref<HTMLElement | null>(null);
const toc = ref<{ id: string; label: string }[]>([]);

onMounted(async () => {
  await nextTick();
  if (!contentEl.value) return;
  const items: { id: string; label: string }[] = [];
  contentEl.value.querySelectorAll('strong').forEach((el, i) => {
    const text = (el.textContent || '').trim();
    if (/^\d+\.\s+\S/.test(text)) {
      // Top-level "N. Title" line — style like a section heading.
      const id = 's' + i;
      el.id = id;
      el.classList.add(
        'scroll-mt-24', 'block', 'text-[18px]', 'md:text-[20px]', 'font-black',
        'tracking-tight', 'text-ink-900', 'dark:text-white', 'pt-6', 'pb-2',
        'border-b', 'border-ink-200', 'dark:border-ink-800', 'mb-3'
      );
      items.push({ id, label: text });
    } else if (/^\d+\.\d+\s+\S/.test(text)) {
      // Sub-heading "N.N Title" line — style like a subsection heading.
      el.classList.add('block', 'text-[14.5px]', 'font-black', 'text-ink-900', 'dark:text-white', 'mt-4', 'mb-1.5');
    }
  });
  toc.value = items;
});

const print = () => {
  if (process.client) window.print();
};
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6">

    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px] text-ink-500 dark:text-ink-400 mb-4">
      <nuxt-link to="/" class="hover:text-brand-500 transition">Ana səhifə</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <span class="font-semibold text-ink-900 dark:text-white">Qaydalar</span>
    </nav>

    <!-- Page title -->
    <div class="flex items-center justify-between gap-4 mb-5 flex-wrap">
      <div>
        <h1 class="text-[22px] md:text-[26px] font-black tracking-tight text-ink-900 dark:text-white leading-tight">Qaydalar</h1>
        <p class="mt-1 text-[12.5px] text-ink-500 dark:text-ink-400">Məxfilik Siyasəti, İstifadə Şərtləri və ümumi qaydalar.</p>
      </div>
      <button type="button" @click="print" class="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 hover:text-brand-500 text-ink-700 dark:text-ink-200 text-[11.5px] font-bold transition">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
        Çap et
      </button>
    </div>

    <!-- Two-column layout: TOC + content -->
    <div class="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5 mb-10">

      <!-- LEFT — Table of contents (sticky) -->
      <aside v-if="toc.length" class="lg:sticky lg:top-24 lg:self-start">
        <div class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-3">
          <div class="px-2 mb-2 text-[10.5px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400">Mündəricat</div>
          <nav class="space-y-0.5">
            <a v-for="item in toc" :key="item.id" :href="'#' + item.id"
               class="block px-3 h-9 leading-9 rounded-lg text-[12px] font-bold text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-brand-500 transition truncate">{{ item.label }}</a>
          </nav>
        </div>

        <!-- Quick contact -->
        <div class="mt-3 p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-amber-50 dark:from-brand-500/10 dark:to-amber-500/10 ring-1 ring-ink-200 dark:ring-ink-800">
          <div class="text-[10.5px] font-black uppercase tracking-wider text-brand-500 mb-1">Suala cavab</div>
          <p class="text-[11.5px] text-ink-700 dark:text-ink-200 leading-snug mb-2.5">Hər hansı sualın varsa, dəstək komandamız 7/24 cavabdadır.</p>
          <a :href="waLink" target="_blank" rel="noopener" class="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold transition shadow-soft">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A8 8 0 006.5 17.4L5 22l4.7-1.5a8 8 0 1011.9-10.2 7.92 7.92 0 00-4 2zM12 4a8 8 0 11-8 8 8 8 0 018-8z"/></svg>
            WhatsApp
          </a>
        </div>
      </aside>

      <!-- RIGHT — Content -->
      <article ref="contentEl" class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-6 md:p-8 text-ink-700 dark:text-ink-200 leading-relaxed text-[13.5px] prose-dd" v-html="row.data"></article>
    </div>

  </main>
</template>

<style scoped>
article :deep(ul) {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0.5rem;
}
article :deep(li) {
  margin-bottom: 0.85rem;
}
article :deep(li > *:first-child) {
  margin-top: 0;
}
article :deep(blockquote) {
  padding-left: 1rem;
  margin: 0.5rem 0;
  border-left: 3px solid rgb(255 72 0 / 0.3);
  color: inherit;
}
article :deep(strong) {
  color: inherit;
  font-weight: 800;
}
article :deep(a) {
  color: #FF4800;
  font-weight: 700;
  text-decoration: underline;
}

@media print {
  aside, nav {
    display: none !important;
  }
}
</style>
