<script setup lang="ts">
import HeaderSection from "~/components/layouts/HeaderSection.vue";
import FooterSection from "~/components/layouts/FooterSection.vue";
import { generalStore } from "~/stores/generalStore";
import { storeToRefs } from "pinia";

const error = useError();
const router = useRouter();
const { $api } = useNuxtApp();
const general = generalStore();
const { data } = storeToRefs(general);

const waLink = computed(() => {
  const p = (data.value?.phone || "994503345616").replace(/[^0-9]/g, "");
  return "https://wa.me/" + p;
});

const categories = ref<any[]>([]);
$api.get("public/categories?count=6").then((res: any) => {
  categories.value = res.data || [];
});

const search = ref("");
const submitSearch = () => {
  router.push({ path: "/games", query: search.value.trim() ? { q: search.value.trim() } : {} });
};

const goBack = () => {
  if (process.client) router.back();
};
</script>

<template>
  <div>
    <header-section />

    <main class="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
      <div class="text-center max-w-2xl mx-auto">

        <!-- 404 illustration -->
        <div class="relative inline-block mb-7">
          <div aria-hidden="true" class="absolute inset-0 -m-8 rounded-full bg-brand-500/10 blur-3xl"></div>
          <div aria-hidden="true" class="absolute -top-2 left-4 w-2 h-2 rounded-full bg-amber-400/80 animate-ping"></div>
          <div aria-hidden="true" class="absolute top-6 -right-2 w-1.5 h-1.5 rounded-full bg-brand-400/80"></div>
          <div aria-hidden="true" class="absolute -bottom-2 left-12 w-1 h-1 rounded-full bg-white"></div>
          <div aria-hidden="true" class="absolute bottom-8 -right-4 w-1.5 h-1.5 rounded-full bg-amber-300/70 animate-pulse"></div>

          <div class="relative flex items-center justify-center gap-2 md:gap-4">
            <span class="text-[120px] md:text-[180px] font-black tabular-nums leading-none tracking-tighter text-ink-900 dark:text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.08)]">4</span>

            <div class="relative">
              <div class="w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full bg-gradient-to-br from-brand-500 to-[#FF6A2E] grid place-items-center shadow-pop ring-4 ring-white dark:ring-ink-900">
                <svg class="w-14 h-14 md:w-20 md:h-20 text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.18)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="6"/>
                  <line x1="7" y1="11" x2="9" y2="11"/>
                  <line x1="8" y1="10" x2="8" y2="12"/>
                  <circle cx="15" cy="11" r="0.8" fill="currentColor"/>
                  <circle cx="17" cy="13" r="0.8" fill="currentColor"/>
                  <line x1="7" y1="14" x2="7" y2="14.01"/>
                </svg>
              </div>
              <span class="absolute -top-1 -right-2 inline-flex items-center h-6 px-2.5 rounded-full bg-rose-500 text-white text-[10.5px] font-black tracking-wider uppercase shadow-pop rotate-12">
                <svg class="w-3 h-3 mr-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M11 1L0 14h11l-1 9 11-13H11l1-9z"/></svg>
                Lost
              </span>
            </div>

            <span class="text-[120px] md:text-[180px] font-black tabular-nums leading-none tracking-tighter text-ink-900 dark:text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.08)]">4</span>
          </div>
        </div>

        <!-- Title -->
        <h1 class="text-[26px] md:text-[34px] font-black tracking-tight text-ink-900 dark:text-white leading-tight">
          <template v-if="error?.statusCode === 404">Səhifə <span class="text-brand-500">tapılmadı</span></template>
          <template v-else>Xəta baş verdi <span class="text-brand-500">({{ error?.statusCode }})</span></template>
        </h1>
        <p class="mt-3 text-[13.5px] md:text-[15px] text-ink-500 dark:text-ink-400 leading-relaxed max-w-md mx-auto">
          Axtardığın səhifə yox edilib və ya köçürülüb. Aşağıdan axtara və ya populyar kateqoriyalara baxa bilərsən.
        </p>

        <!-- Search -->
        <form @submit.prevent="submitSearch" class="mt-6 relative max-w-md mx-auto">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input v-model="search" type="text" placeholder="Oyun, məhsul və ya abunə axtar..." class="w-full h-12 pl-11 pr-24 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 placeholder:text-ink-400 text-ink-900 dark:text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 transition text-[13.5px]" />
          <button type="submit" class="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 h-9 px-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-[12px] font-bold transition active:scale-95 shadow-pop">
            Axtar
          </button>
        </form>

        <!-- Primary actions -->
        <div class="mt-6 flex items-center justify-center gap-2 flex-wrap">
          <nuxt-link to="/" class="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-[13.5px] font-black transition shadow-pop active:scale-95">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></svg>
            Ana səhifəyə qayıt
          </nuxt-link>
          <button type="button" @click="goBack" class="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 hover:text-brand-500 text-ink-700 dark:text-ink-200 text-[13.5px] font-bold transition">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Geri qayıt
          </button>
        </div>

        <!-- Popular categories -->
        <div v-if="categories.length" class="mt-12 pt-8 border-t border-ink-200 dark:border-ink-800">
          <p class="text-[11px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-4">Populyar kateqoriyalar</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <nuxt-link v-for="cat in categories" :key="cat.slug" :to="{ name: 'category-slug', params: { slug: cat.slug } }"
                       class="group flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 hover:-translate-y-0.5 transition">
              <span class="shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-ink-100 dark:bg-ink-800"><img :src="cat.image" :alt="cat.name" class="w-full h-full object-cover"></span>
              <span class="text-[12px] font-black text-ink-900 dark:text-white truncate">{{ cat.name }}</span>
            </nuxt-link>
          </div>
        </div>

        <!-- Need help -->
        <div class="mt-8 inline-flex items-center gap-2 text-[12px] text-ink-500 dark:text-ink-400">
          <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A8 8 0 006.5 17.4L5 22l4.7-1.5a8 8 0 1011.9-10.2 7.92 7.92 0 00-4 2zM12 4a8 8 0 11-8 8 8 8 0 018-8z"/></svg>
          Kömək lazımdır?
          <a :href="waLink" target="_blank" rel="noopener" class="font-black text-brand-500 hover:text-brand-600 transition">WhatsApp dəstəyi →</a>
        </div>

      </div>
    </main>

    <footer-section />
  </div>
</template>
