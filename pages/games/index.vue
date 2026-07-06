<script setup lang="ts">
import { useHead } from "@unhead/vue";

const { $api } = useNuxtApp();
const categoriesRes = await $api.get("public/categories?count=50");
const categories = categoriesRes.data as any[];

const allGames: any[] = [];
const seen = new Set<number>();
categories.forEach((cat: any) => {
  (cat.games || []).forEach((g: any) => {
    if (!seen.has(g.id)) {
      seen.add(g.id);
      allGames.push({ ...g, category: { slug: cat.slug, name: cat.name } });
    }
  });
});

const route = useRoute();
const search = ref(typeof route.query.q === "string" ? route.query.q : "");
const activeCategory = ref("all");

const filteredGames = computed(() => {
  let list = allGames;
  if (activeCategory.value !== "all") {
    list = list.filter((g) => g.category.slug === activeCategory.value);
  }
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase();
    list = list.filter((g) => g.name.toLowerCase().includes(q));
  }
  return list;
});

useHead({ title: "Bütün oyunlar" });
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6">

    <!-- Breadcrumb + title -->
    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px] text-ink-500 dark:text-ink-400 mb-4">
      <nuxt-link to="/" class="hover:text-brand-500 transition">Ana səhifə</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <span class="font-semibold text-ink-900 dark:text-white">Bütün oyunlar</span>
    </nav>

    <div class="flex items-center gap-2 mb-5 flex-wrap">
      <h1 class="text-[22px] md:text-[26px] font-black tracking-tight text-ink-900 dark:text-white">Bütün oyunlar</h1>
      <span class="inline-flex items-center h-6 px-2 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-[11.5px] font-black tabular-nums ring-1 ring-brand-500/20">{{ allGames.length }} oyun</span>
    </div>

    <!-- Search + category chips -->
    <div class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-3 mb-5">
      <div class="flex items-center gap-3 flex-wrap">
        <div class="relative flex-1 min-w-[200px]">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input v-model="search" type="text" placeholder="Oyun axtar..." class="w-full h-10 pl-10 pr-3 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 placeholder:text-ink-400 text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:bg-white dark:focus:bg-ink-900 focus:ring-2 focus:ring-brand-500/15 transition text-[13px]" />
        </div>
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button type="button" @click="activeCategory = 'all'"
                  class="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[12px] font-bold ring-1 transition"
                  :class="activeCategory === 'all' ? 'bg-brand-500 text-white ring-brand-500' : 'bg-ink-50 dark:bg-ink-800 text-ink-700 dark:text-ink-200 ring-ink-200 dark:ring-ink-700 hover:ring-brand-500 hover:text-brand-500'">
            Hamısı
          </button>
          <button v-for="cat in categories" :key="cat.slug" type="button" @click="activeCategory = cat.slug"
                  class="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[12px] font-bold ring-1 transition"
                  :class="activeCategory === cat.slug ? 'bg-brand-500 text-white ring-brand-500' : 'bg-ink-50 dark:bg-ink-800 text-ink-700 dark:text-ink-200 ring-ink-200 dark:ring-ink-700 hover:ring-brand-500 hover:text-brand-500'">
            {{ cat.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Game grid -->
    <div v-if="filteredGames.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 mb-8">
      <nuxt-link
        v-for="row in filteredGames"
        :key="row.slug"
        :to="{ name: 'game-slug', params: { slug: row.slug } }"
        class="group"
      >
        <div class="relative aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-ink-200 dark:ring-ink-800 group-hover:ring-brand-500 group-hover:-translate-y-1 group-hover:shadow-pop transition-all duration-300 bg-ink-50 dark:bg-ink-800">
          <img :src="row.image" :alt="row.name" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <span class="absolute top-2 left-2 inline-flex items-center h-5 px-1.5 rounded-md bg-white/15 backdrop-blur text-white text-[9px] font-black tracking-wider uppercase ring-1 ring-white/25">{{ row.category.name }}</span>
        </div>
        <div class="mt-2.5 px-1">
          <h3 class="text-[12.5px] md:text-[13px] font-black text-ink-900 dark:text-white truncate leading-tight">{{ row.name }}</h3>
        </div>
      </nuxt-link>
    </div>

    <!-- Empty -->
    <div v-else class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-12 text-center mb-8">
      <div class="w-12 h-12 mx-auto rounded-2xl bg-ink-100 dark:bg-ink-800 grid place-items-center mb-3">
        <svg class="w-5 h-5 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      </div>
      <h3 class="text-[13.5px] font-black text-ink-900 dark:text-white">Oyun tapılmadı</h3>
      <p class="mt-1 text-[12px] text-ink-500 dark:text-ink-400">Axtarış sözünü və ya filtri dəyişin.</p>
    </div>

    <!-- Request game CTA -->
    <section class="rounded-2xl bg-gradient-to-br from-brand-50 via-white to-amber-50 dark:from-brand-500/10 dark:via-ink-900 dark:to-amber-500/10 ring-1 ring-ink-200 dark:ring-ink-800 p-5 md:p-6 mb-10">
      <div class="flex items-center justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-3">
          <span class="shrink-0 w-12 h-12 rounded-2xl bg-brand-500 text-white grid place-items-center shadow-pop">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          </span>
          <div>
            <h3 class="text-[15px] font-black text-ink-900 dark:text-white">Axtardığın oyun yoxdur?</h3>
            <p class="mt-0.5 text-[12px] text-ink-500 dark:text-ink-400">Bizə yaz — 24 saat içində əlavə edək.</p>
          </div>
        </div>
        <nuxt-link to="/pages/contact" class="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-[12.5px] font-bold transition shadow-pop active:scale-95">
          Oyun istəyi göndər
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </nuxt-link>
      </div>
    </section>

  </main>
</template>
