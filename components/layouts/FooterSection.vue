<script setup lang="ts">
import { generalStore } from "~/stores/generalStore";
import { storeToRefs } from "pinia";

const { $api } = useNuxtApp();
const general = generalStore();
const { data } = storeToRefs(general);

const categories = ref<any>([]);
$api.get("public/categories").then((r: any) => (categories.value = r));
const categoryList = computed<any[]>(() => categories.value?.data ?? []);

const waLink = computed(() => {
  const p = (data.value?.phone || "994503345616").replace(/[^0-9]/g, "");
  return "https://wa.me/" + p;
});

const year = new Date().getFullYear();

const scrollTop = () => {
  if (process.client) window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <footer class="mt-16">
    <!-- ════════ MAIN FOOTER ════════ -->
    <section class="border-t border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-10">

        <!-- Top: brand + columns -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-8">

          <!-- Brand -->
          <div class="col-span-2">
            <nuxt-link to="/" class="inline-flex items-center gap-2 mb-3">
              <span class="w-9 h-9 rounded-xl bg-brand-500 grid place-items-center text-white shadow-pop">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </span>
              <span class="font-black text-[18px] tracking-tight text-ink-900 dark:text-white">DolPh <span class="text-brand-500">Game</span></span>
            </nuxt-link>
            <p class="text-[12.5px] text-ink-500 dark:text-ink-400 leading-relaxed max-w-xs">Azərbaycanın №1 oyun top-up və abunə platforması. UC, hesab, abunə — saniyələr içində.</p>

            <!-- Social -->
            <div class="mt-4 flex items-center gap-1.5">
              <a :href="data?.instagram || '#'" target="_blank" rel="noopener" aria-label="Instagram" class="w-8 h-8 rounded-lg bg-ink-50 dark:bg-ink-800 hover:bg-brand-500 hover:text-white text-ink-500 dark:text-ink-400 grid place-items-center transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="TikTok" class="w-8 h-8 rounded-lg bg-ink-50 dark:bg-ink-800 hover:bg-brand-500 hover:text-white text-ink-500 dark:text-ink-400 grid place-items-center transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V8.43a8.16 8.16 0 004.77 1.52V6.5a4.85 4.85 0 01-1.84-.81z"/></svg>
              </a>
              <a :href="data?.youtube || '#'" target="_blank" rel="noopener" aria-label="YouTube" class="w-8 h-8 rounded-lg bg-ink-50 dark:bg-ink-800 hover:bg-brand-500 hover:text-white text-ink-500 dark:text-ink-400 grid place-items-center transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6z"/></svg>
              </a>
              <a :href="waLink" target="_blank" rel="noopener" aria-label="WhatsApp" class="w-8 h-8 rounded-lg bg-ink-50 dark:bg-ink-800 hover:bg-brand-500 hover:text-white text-ink-500 dark:text-ink-400 grid place-items-center transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A8 8 0 006.5 17.4L5 22l4.7-1.5a8 8 0 1011.9-10.2 7.92 7.92 0 00-4 2zM12 4a8 8 0 11-8 8 8 8 0 018-8z"/></svg>
              </a>
              <a :href="data?.facebook || '#'" target="_blank" rel="noopener" aria-label="Facebook" class="w-8 h-8 rounded-lg bg-ink-50 dark:bg-ink-800 hover:bg-brand-500 hover:text-white text-ink-500 dark:text-ink-400 grid place-items-center transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12a12 12 0 10-13.88 11.85v-8.38h-3.05V12h3.05V9.36c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.88V12h3.33l-.53 3.47h-2.8v8.38A12 12 0 0024 12z"/></svg>
              </a>
            </div>
          </div>

          <!-- Kateqoriyalar -->
          <div>
            <h4 class="text-[11px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-3">Kateqoriyalar</h4>
            <ul class="space-y-2">
              <li v-for="cat in categoryList.slice(0, 5)" :key="cat.id">
                <nuxt-link :to="'/category/' + cat.slug" class="text-[12.5px] text-ink-700 dark:text-ink-200 hover:text-brand-500 transition">{{ cat.name }}</nuxt-link>
              </li>
            </ul>
          </div>

          <!-- Yardım -->
          <div>
            <h4 class="text-[11px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-3">Yardım</h4>
            <ul class="space-y-2">
              <li><nuxt-link to="/pages/faq" class="text-[12.5px] text-ink-700 dark:text-ink-200 hover:text-brand-500 transition">Tez-tez verilən suallar</nuxt-link></li>
              <li><nuxt-link to="/pages/about" class="text-[12.5px] text-ink-700 dark:text-ink-200 hover:text-brand-500 transition">Necə işləyir?</nuxt-link></li>
              <li><nuxt-link to="/pages/privacy" class="text-[12.5px] text-ink-700 dark:text-ink-200 hover:text-brand-500 transition">Geri qaytarma</nuxt-link></li>
              <li><nuxt-link to="/pages/privacy" class="text-[12.5px] text-ink-700 dark:text-ink-200 hover:text-brand-500 transition">Müqavilə</nuxt-link></li>
              <li><nuxt-link to="/pages/privacy" class="text-[12.5px] text-ink-700 dark:text-ink-200 hover:text-brand-500 transition">Məxfilik</nuxt-link></li>
            </ul>
          </div>

          <!-- Əlaqə -->
          <div>
            <h4 class="text-[11px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-3">Əlaqə</h4>
            <ul class="space-y-2">
              <li>
                <a :href="'mailto:' + (data?.email || 'info@dolphgame.com')" class="text-[12.5px] text-ink-700 dark:text-ink-200 hover:text-brand-500 transition inline-flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {{ data?.email || 'info@dolphgame.com' }}
                </a>
              </li>
              <li>
                <a :href="'tel:' + (data?.phone || '+994503345616')" class="text-[12.5px] text-ink-700 dark:text-ink-200 hover:text-brand-500 transition inline-flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  {{ data?.phone || '+994 50 334 56 16' }}
                </a>
              </li>
              <li>
                <a :href="waLink" target="_blank" rel="noopener" class="text-[12.5px] text-ink-700 dark:text-ink-200 hover:text-brand-500 transition inline-flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A8 8 0 006.5 17.4L5 22l4.7-1.5a8 8 0 1011.9-10.2 7.92 7.92 0 00-4 2zM12 4a8 8 0 11-8 8 8 8 0 018-8z"/></svg>
                  WhatsApp dəstək
                </a>
              </li>
              <li class="text-[12.5px] text-ink-500 dark:text-ink-400 inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ data?.address || 'Bakı, Azərbaycan' }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom row: payments + copyright -->
        <div class="mt-8 pt-5 border-t border-ink-200 dark:border-ink-800 flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[10.5px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">Ödəniş</span>
            <span class="inline-flex items-center h-6 px-2 rounded-md bg-ink-50 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[10px] font-black tracking-wider text-ink-700 dark:text-ink-200">VISA</span>
            <span class="inline-flex items-center h-6 px-2 rounded-md bg-ink-50 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[10px] font-black tracking-wider text-ink-700 dark:text-ink-200">MASTERCARD</span>
            <span class="inline-flex items-center h-6 px-2 rounded-md bg-ink-50 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[10px] font-black tracking-wider text-ink-700 dark:text-ink-200">m10</span>
            <span class="inline-flex items-center h-6 px-2 rounded-md bg-ink-50 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[10px] font-black tracking-wider text-ink-700 dark:text-ink-200">MilliÖN</span>
            <span class="inline-flex items-center h-6 px-2 rounded-md bg-ink-50 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[10px] font-black tracking-wider text-ink-700 dark:text-ink-200">BirBank</span>
          </div>
          <div class="text-[11.5px] text-ink-500 dark:text-ink-400">
            © {{ year }} <span class="font-black text-ink-900 dark:text-white">DolPh Game MMC</span> · Bütün hüquqlar qorunur
          </div>
        </div>

      </div>
    </section>

    <!-- Scroll to top ROCKET FAB -->
    <button @click="scrollTop" aria-label="Yuxarı qayıt" class="rocket-btn ripple fixed bottom-24 md:bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-pop flex items-center justify-center transition group">
      <svg class="rocket-body w-6 h-6 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/>
        <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
      <span class="rocket-flame absolute -bottom-1 left-1/2 -translate-x-1/2 pointer-events-none">
        <svg class="w-3 h-4" viewBox="0 0 12 16" fill="none">
          <path d="M6 0c-2 3-4 5-4 9a4 4 0 008 0c0-4-2-6-4-9z" fill="#FBBF24"/>
          <path d="M6 3c-1 2-2.5 3.5-2.5 6a2.5 2.5 0 005 0c0-2.5-1.5-4-2.5-6z" fill="#F87171"/>
        </svg>
      </span>
    </button>
  </footer>
</template>
