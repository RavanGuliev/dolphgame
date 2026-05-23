<script setup lang="ts">
const { $api } = useNuxtApp();
const row = await $api.get("public/about");
useHead({ title: "Haqqımızda" });
</script>

<template>
  <main class="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">
    <!-- Header -->
    <div class="text-center mb-8">
      <span class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 ring-1 ring-brand-500/20">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        DolPh Game
      </span>
      <h1 class="mt-4 text-2xl md:text-3xl font-black tracking-tight text-ink-900 dark:text-white">Haqqımızda</h1>
    </div>

    <!-- Content -->
    <article class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-5 md:p-8 shadow-soft">
      <div class="prose-dd text-[14px] leading-relaxed text-ink-700 dark:text-ink-200" v-html="row.data"></div>
    </article>
  </main>
</template>

<style scoped>
.prose-dd :deep(h1),
.prose-dd :deep(h2),
.prose-dd :deep(h3),
.prose-dd :deep(h4) { font-weight: 800; color: #111827; margin: 1.2rem 0 .5rem; }
:global(html.dark) .prose-dd :deep(h1),
:global(html.dark) .prose-dd :deep(h2),
:global(html.dark) .prose-dd :deep(h3),
:global(html.dark) .prose-dd :deep(h4) { color: #fff; }
.prose-dd :deep(p) { margin-bottom: .85rem; }
.prose-dd :deep(ul) { list-style: disc; padding-left: 1.4rem; margin-bottom: .85rem; }
.prose-dd :deep(ol) { list-style: decimal; padding-left: 1.4rem; margin-bottom: .85rem; }
.prose-dd :deep(li) { margin-bottom: .3rem; }
.prose-dd :deep(a) { color: #FF4800; font-weight: 600; }
.prose-dd :deep(img) { max-width: 100%; border-radius: .75rem; margin: 1rem 0; }
.prose-dd :deep(strong) { color: inherit; font-weight: 700; }
</style>
