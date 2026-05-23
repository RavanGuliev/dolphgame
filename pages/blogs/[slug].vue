<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import { formatDateOnly } from "~/utils/dateFormatter";

const { $api } = useNuxtApp();
const route = useRoute();
const row = await $api.get("public/blog?slug=" + route.params.slug);
const recent = await $api.get("public/blogs?count=5").catch(() => ({ data: [] }));

const others = computed<any[]>(() => (recent.data || []).filter((b: any) => b.slug !== route.params.slug).slice(0, 4));

useHead({ title: row.data.title });
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6">
    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px] text-ink-500 dark:text-ink-400 mb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
      <nuxt-link to="/" class="hover:text-brand-500 transition">Ana səhifə</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <nuxt-link to="/blogs" class="hover:text-brand-500 transition">Xəbərlər</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <span class="font-semibold text-ink-900 dark:text-white truncate">{{ row.data.title }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      <!-- Article -->
      <article class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 overflow-hidden">
        <div v-if="row.data.image" class="aspect-[16/8] overflow-hidden bg-ink-100 dark:bg-ink-800">
          <img :src="row.data.image" :alt="row.data.title" class="w-full h-full object-cover" />
        </div>
        <div class="p-5 md:p-8">
          <h1 class="text-2xl md:text-3xl font-black tracking-tight text-ink-900 dark:text-white leading-tight">{{ row.data.title }}</h1>
          <div class="mt-2 inline-flex items-center gap-1.5 text-[12px] text-ink-500 dark:text-ink-400">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            {{ formatDateOnly(row.data.created_at) }}
          </div>

          <div class="mt-5 prose-dd text-[14.5px] leading-relaxed text-ink-700 dark:text-ink-200" v-html="row.data.content"></div>

          <div class="mt-7 pt-5 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between gap-3 flex-wrap">
            <nuxt-link to="/blogs" class="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-200 text-[13px] font-bold transition">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Digər xəbərlər
            </nuxt-link>
            <div class="flex items-center gap-2">
              <span class="text-[12px] font-semibold text-ink-500 dark:text-ink-400 mr-1">Paylaş</span>
              <a href="https://www.facebook.com" target="_blank" rel="noopener" aria-label="Facebook" class="w-9 h-9 rounded-lg bg-ink-100 dark:bg-ink-800 hover:bg-brand-500 hover:text-white text-ink-600 dark:text-ink-300 grid place-items-center transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12a12 12 0 10-13.88 11.85v-7H8v-3h2.4V9.5c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3H15c-1.2 0-1.5.7-1.5 1.5V12h2.7l-.4 3h-2.3v7A12 12 0 0024 12z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter" class="w-9 h-9 rounded-lg bg-ink-100 dark:bg-ink-800 hover:bg-brand-500 hover:text-white text-ink-600 dark:text-ink-300 grid place-items-center transition">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://wa.me/" target="_blank" rel="noopener" aria-label="WhatsApp" class="w-9 h-9 rounded-lg bg-ink-100 dark:bg-ink-800 hover:bg-emerald-500 hover:text-white text-ink-600 dark:text-ink-300 grid place-items-center transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.552 4.098 1.523 5.823L0 24l6.335-1.653A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </article>

      <!-- Sidebar: other blogs -->
      <aside v-if="others.length" class="lg:sticky lg:top-[140px] self-start">
        <div class="flex items-center gap-2 mb-3 px-1">
          <span class="w-1 h-5 bg-brand-500 rounded-full"></span>
          <h3 class="text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">Digər xəbərlər</h3>
        </div>
        <div class="space-y-3">
          <nuxt-link v-for="b in others" :key="b.slug" :to="{ name: 'blogs-slug', params: { slug: b.slug } }" class="group flex gap-3 p-2.5 rounded-xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 transition">
            <span class="w-16 h-16 rounded-lg overflow-hidden bg-ink-100 dark:bg-ink-800 shrink-0">
              <img :src="b.image" :alt="b.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
            </span>
            <div class="min-w-0 flex-1">
              <h4 class="text-[13px] font-bold text-ink-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-500 transition">{{ b.title }}</h4>
              <div class="mt-1 text-[11px] text-ink-500 dark:text-ink-400">{{ formatDateOnly(b.created_at) }}</div>
            </div>
          </nuxt-link>
        </div>
      </aside>
    </div>
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
.prose-dd :deep(blockquote) { border-left: 3px solid #FF4800; padding-left: 1rem; color: #6B7280; margin: 1rem 0; }
.prose-dd :deep(strong) { color: inherit; font-weight: 700; }
</style>
