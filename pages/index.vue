<script setup lang="ts">
import {generalStore} from "~/stores/generalStore";
import { Swiper, SwiperSlide} from 'swiper/vue';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import {authStore} from "~/stores/authStore";
import {formatDateOnly} from "~/utils/dateFormatter";

const {$api} = useNuxtApp()
const general = generalStore()
const {data} = storeToRefs(general)
const sliders =  ref([])
const best = ref([])
const populars = ref([])
const tiktok = ref([])
const pubg = ref([])
const free_fire = ref([])
const point_blank = ref([])
const valorant = ref([])
const blogs = ref([])
const auth = authStore()
const {headers} = storeToRefs(auth)

useHead({
  title: data.value.title,
  meta: [
    {name: 'description', content: data.value.description}
  ]
})
$api.get('public/slides').then(res => {
  sliders.value = res
})
$api.get('public/categories?count=15').then(res => {
  best.value = res
})
$api.get('public/top-products?count=10', headers.value).then(res => {
  populars.value = res
})
$api.get('public/products?game=7&count=10', headers.value).then(res => {
  tiktok.value = res
})
$api.get('public/products?game=1&count=10', headers.value).then(res => {
  pubg.value = res
})
$api.get('public/products?game=3&count=10', headers.value).then(res => {
  free_fire.value = res
})
$api.get('public/products?game=8&count=10', headers.value).then(res => {
  point_blank.value = res
})
$api.get('public/products?game=6&count=10', headers.value).then(res => {
  valorant.value = res
})
$api.get('public/blogs?count=3').then(res => {
  blogs.value = res
})

const bsTabs = [
  {slug: 'populars', name: 'Populyar'},
  {slug: 'tiktok', name: 'TikTok'},
  {slug: 'pubg', name: 'PUBG'},
  {slug: 'free_fire', name: 'Free Fire'},
  {slug: 'point_blank', name: 'Point Blank'},
  {slug: 'valorant', name: 'Valorant'},
]
const activeBsTab = ref('populars')
const bsSources: Record<string, any> = {populars, tiktok, pubg, free_fire, point_blank, valorant}
const activeProducts = computed(() => bsSources[activeBsTab.value].value)
</script>

<template>
  <main>

    <!-- 1. HERO SLIDER -->
    <section class="bg-ink-50 dark:bg-ink-900/50 py-6 md:py-8">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div v-if="sliders.data?.length" class="relative overflow-hidden rounded-3xl ring-1 ring-ink-200 dark:ring-ink-800 shadow-soft">
          <swiper :modules="[Pagination, Autoplay]" :slides-per-view="1" :space-between="0"
                  :autoplay="{delay: 4000}" :pagination="{ clickable: true }">
            <swiper-slide v-for="slide in sliders.data" :key="slide.id">
              <nuxt-link :to="slide.url ?? '#'" class="block aspect-[16/8] md:aspect-[21/8] bg-ink-100 dark:bg-ink-800">
                <img class="w-full h-full object-cover" :src="slide.image" alt="dolphgame">
              </nuxt-link>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </section>

    <!-- 2. KATEQORİYALAR -->
    <section class="bg-white dark:bg-ink-900 py-10 md:py-14">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="flex items-end justify-between gap-3 mb-6 flex-wrap">
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-brand-500 text-white grid place-items-center shadow-pop">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>
            </span>
            <div>
              <h2 class="text-[18px] md:text-[22px] font-black tracking-tight text-ink-900 dark:text-white leading-tight">Kateqoriyalar</h2>
              <p class="text-[11.5px] text-ink-500 dark:text-ink-400 mt-0.5">Oyun və xidmət seçimləri</p>
            </div>
          </div>
          <nuxt-link to="/games" class="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-ink-50 dark:bg-ink-800 hover:bg-brand-500 hover:text-white text-[12px] font-bold text-ink-700 dark:text-ink-200 transition">Hamısına bax
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </nuxt-link>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          <nuxt-link v-for="cat in best.data" :key="cat.slug" :to="{name: 'category-slug', params: {slug: cat.slug}}"
                     class="group relative overflow-hidden rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 hover:-translate-y-0.5 hover:shadow-card transition aspect-[4/3]">
            <img :src="cat.image" :alt="cat.name" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            <div aria-hidden="true" class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <span class="absolute bottom-2 left-0 right-0 px-2 text-center text-[11px] font-black text-white truncate">{{ cat.name }}</span>
          </nuxt-link>
        </div>
      </div>
    </section>

    <!-- 3. DOLPH DIGITAL BANNER -->
    <section class="bg-ink-50 dark:bg-ink-900/50 py-10 md:py-14">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <nuxt-link to="/category/dolphdigital" class="block relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a0a1f] via-[#1a1042] to-[#0a0a1f] ring-1 ring-ink-200 dark:ring-ink-800 shadow-soft">
          <div aria-hidden="true" class="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-violet-500/30 blur-3xl"></div>
          <div aria-hidden="true" class="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl"></div>
          <div class="relative grid md:grid-cols-[1fr_auto] items-center gap-6 p-6 md:p-10">
            <div>
              <span class="inline-flex items-center gap-1.5 h-6 px-2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10.5px] font-black tracking-wider uppercase ring-1 ring-emerald-500/30">
                <span class="relative w-1.5 h-1.5 rounded-full bg-emerald-300"><span class="absolute inset-0 rounded-full bg-emerald-300 animate-ping opacity-70"></span></span>
                Yeni xidmət
              </span>
              <h2 class="mt-3 text-[24px] md:text-[34px] font-black tracking-tight text-white leading-tight">DolPh <span class="text-brand-500">Digital</span></h2>
              <p class="mt-2 text-[13px] md:text-[14.5px] text-white/70 max-w-xl">Netflix, Spotify, YouTube Premium, ChatGPT, Canva və 20+ premium abunə — saniyələr içində, rəsmi qiymətdən 30%-dək ucuz.</p>
              <div class="mt-4 flex items-center gap-2 flex-wrap">
                <span class="inline-flex items-center h-7 px-2.5 rounded-md bg-white/10 backdrop-blur text-white text-[11px] font-bold ring-1 ring-white/20">Netflix</span>
                <span class="inline-flex items-center h-7 px-2.5 rounded-md bg-white/10 backdrop-blur text-white text-[11px] font-bold ring-1 ring-white/20">Spotify</span>
                <span class="inline-flex items-center h-7 px-2.5 rounded-md bg-white/10 backdrop-blur text-white text-[11px] font-bold ring-1 ring-white/20">YouTube</span>
                <span class="inline-flex items-center h-7 px-2.5 rounded-md bg-white/10 backdrop-blur text-white text-[11px] font-bold ring-1 ring-white/20">ChatGPT</span>
                <span class="inline-flex items-center h-7 px-2.5 rounded-md bg-white/10 backdrop-blur text-white text-[11px] font-bold ring-1 ring-white/20">+16</span>
              </div>
              <div class="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-black text-[13.5px] transition shadow-pop">Kəşf et
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </div>
            </div>
            <div class="hidden md:flex items-center justify-center">
              <div class="grid grid-cols-3 gap-2.5 -rotate-6">
                <span class="w-14 h-14 rounded-2xl bg-[#E50914] grid place-items-center text-white font-black text-[22px] shadow-pop">N</span>
                <span class="w-14 h-14 rounded-2xl bg-[#1ED760] grid place-items-center text-black shadow-pop"><svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg></span>
                <span class="w-14 h-14 rounded-2xl bg-[#FF0000] grid place-items-center text-white shadow-pop"><svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><polygon points="9 7 17 12 9 17"/></svg></span>
                <span class="w-14 h-14 rounded-2xl bg-[#10A37F] grid place-items-center text-white font-black text-[12px] shadow-pop">GPT</span>
                <span class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00C4CC] to-[#7D2AE7] grid place-items-center text-white font-black text-[20px] shadow-pop">C</span>
                <span class="w-14 h-14 rounded-2xl bg-[#FA0F00] grid place-items-center text-white font-black text-[16px] shadow-pop">Ai</span>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </section>

    <!-- 4. BEST SELLERS — TABBED -->
    <section class="bg-white dark:bg-ink-900 py-10 md:py-14">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="flex items-end justify-between gap-3 mb-5 flex-wrap">
          <div>
            <h2 class="text-[18px] md:text-[22px] font-black tracking-tight text-ink-900 dark:text-white leading-tight">Ən çox satılan məhsullar</h2>
            <p class="text-[11.5px] text-ink-500 dark:text-ink-400 mt-0.5">Müştərilərin ən çox seçdiyi məhsullar</p>
          </div>
          <div class="inline-flex p-1 rounded-xl bg-ink-100 dark:bg-ink-800 flex-wrap gap-1">
            <button v-for="tab in bsTabs" :key="tab.slug" type="button" @click="activeBsTab = tab.slug"
                    class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[11.5px] font-bold transition"
                    :class="activeBsTab === tab.slug ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
              {{ tab.name }}
            </button>
          </div>
        </div>
        <div v-if="activeProducts?.data?.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <nuxt-link v-for="product in activeProducts.data" :key="product.slug"
                     :to="{name: 'game-product-slug', params: {slug: product.slug}}"
                     class="group relative overflow-hidden rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 hover:-translate-y-0.5 hover:shadow-card transition-all duration-300">
            <div class="aspect-square relative bg-ink-50 dark:bg-ink-800 overflow-hidden">
              <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <div class="p-3">
              <h3 class="text-[12.5px] font-black text-ink-900 dark:text-white truncate leading-tight">{{ product.name }}</h3>
              <div class="mt-1.5 flex items-baseline gap-1.5">
                <span class="text-[14px] font-black text-emerald-600 dark:text-emerald-400">{{ product.price.toFixed(2) }} AZN</span>
                <span v-if="product.old_price" class="text-[11px] text-ink-400 line-through">{{ product.old_price.toFixed(2) }} AZN</span>
              </div>
            </div>
          </nuxt-link>
        </div>
        <div v-else class="rounded-2xl bg-ink-50 dark:bg-ink-800/60 ring-1 ring-ink-200 dark:ring-ink-700 p-10 text-center text-[13px] text-ink-500 dark:text-ink-400">Məhsul tapılmadı.</div>
      </div>
    </section>

    <!-- 5. SMM PANEL BANNER -->
    <section class="bg-ink-50 dark:bg-ink-900/50 py-10 md:py-14">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <nuxt-link to="/category/instagram-panel" class="block relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1422] via-[#0e2a4a] to-[#1a1042] ring-1 ring-ink-200 dark:ring-ink-800 shadow-soft">
          <div aria-hidden="true" class="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-sky-500/30 blur-3xl"></div>
          <div aria-hidden="true" class="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl"></div>
          <div class="relative grid md:grid-cols-[1fr_auto] items-center gap-6 p-6 md:p-10">
            <div>
              <span class="inline-flex items-center gap-1.5 h-6 px-2 rounded-full bg-sky-500/20 text-sky-300 text-[10.5px] font-black tracking-wider uppercase ring-1 ring-sky-500/30">SMM Panel</span>
              <h2 class="mt-3 text-[24px] md:text-[34px] font-black tracking-tight text-white leading-tight">Sosial media <span class="text-sky-300">böyütməsi</span></h2>
              <p class="mt-2 text-[13px] md:text-[14.5px] text-white/70 max-w-xl">İzləyici, bəyəni, baxış, izlənmə — Instagram, TikTok, YouTube, Telegram və daha çoxu. Real, sürətli və sərfəli.</p>
              <div class="mt-4 grid grid-cols-2 gap-2 max-w-md">
                <div class="flex items-center gap-2 text-[11.5px] text-white/85"><svg class="w-3 h-3 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Real istifadəçilər</div>
                <div class="flex items-center gap-2 text-[11.5px] text-white/85"><svg class="w-3 h-3 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Sürətli çatdırılma</div>
                <div class="flex items-center gap-2 text-[11.5px] text-white/85"><svg class="w-3 h-3 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Düşmə zəmanəti</div>
                <div class="flex items-center gap-2 text-[11.5px] text-white/85"><svg class="w-3 h-3 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> 0,49 AZN-dən</div>
              </div>
              <div class="mt-5 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black text-[13.5px] transition shadow-pop">Sifariş ver
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </div>
            </div>
            <div class="hidden md:flex items-center justify-center">
              <div class="grid grid-cols-3 gap-2.5 -rotate-6">
                <span class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] grid place-items-center text-white shadow-pop"><svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></span>
                <span class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00F2EA] via-black to-[#FF0050] grid place-items-center text-white shadow-pop"><svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V8.43a8.16 8.16 0 004.77 1.52V6.5a4.85 4.85 0 01-1.84-.81z"/></svg></span>
                <span class="w-14 h-14 rounded-2xl bg-[#FF0000] grid place-items-center text-white shadow-pop"><svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><polygon points="9 7 17 12 9 17"/></svg></span>
                <span class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#37AEE2] to-[#1E96C8] grid place-items-center text-white shadow-pop"><svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg></span>
                <span class="w-14 h-14 rounded-2xl bg-[#1877F2] grid place-items-center text-white shadow-pop"><svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg></span>
                <span class="w-14 h-14 rounded-2xl bg-black grid place-items-center text-white shadow-pop"><svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></span>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </section>

    <!-- 6. TESTIMONIALS -->
    <section class="bg-white dark:bg-ink-900 py-10 md:py-14">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="text-center mb-7">
          <span class="inline-flex items-center gap-1.5 h-6 px-2 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10.5px] font-black uppercase tracking-wider ring-1 ring-amber-500/20">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
            Müştəri rəyləri
          </span>
          <h2 class="mt-2 text-[20px] md:text-[26px] font-black tracking-tight text-ink-900 dark:text-white">Müştərilər bizim haqqımızda nə deyir</h2>
          <div class="mt-3 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 shadow-soft">
            <div class="flex items-center gap-0.5">
              <svg v-for="n in 5" :key="n" class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
            </div>
            <span class="text-[14px] font-black text-ink-900 dark:text-white tabular-nums">4.9<span class="text-ink-400">/5.0</span></span>
            <span class="w-px h-4 bg-ink-200 dark:bg-ink-700"></span>
            <span class="text-[12px] text-ink-500 dark:text-ink-400 font-semibold">2 384 rəy</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <article class="relative p-5 rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500/50 transition">
            <svg aria-hidden="true" class="absolute top-4 right-4 w-6 h-6 text-brand-500/15" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z"/></svg>
            <div class="flex items-center gap-1 mb-3">
              <svg v-for="n in 5" :key="n" class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
            </div>
            <p class="text-[13px] text-ink-700 dark:text-ink-200 leading-relaxed">"PUBG UC-ni 30 saniyə içində aldım. Çox sürətli və problemsiz!"</p>
            <div class="mt-4 flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-[#FF6A2E] grid place-items-center text-white font-black text-[12px] shadow-soft">A</span>
              <div class="min-w-0"><div class="text-[12.5px] font-black text-ink-900 dark:text-white">Aysel M.</div><div class="text-[10.5px] text-ink-500 dark:text-ink-400">PUBG UC · 2 gün əvvəl</div></div>
            </div>
          </article>

          <article class="relative p-5 rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500/50 transition">
            <svg aria-hidden="true" class="absolute top-4 right-4 w-6 h-6 text-brand-500/15" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z"/></svg>
            <div class="flex items-center gap-1 mb-3">
              <svg v-for="n in 5" :key="n" class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
            </div>
            <p class="text-[13px] text-ink-700 dark:text-ink-200 leading-relaxed">"Netflix Premium 12 ayı 2 dəfə ucuz aldım. Hesab 1 dəqiqədə gəldi!"</p>
            <div class="mt-4 flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center text-white font-black text-[12px] shadow-soft">N</span>
              <div class="min-w-0"><div class="text-[12.5px] font-black text-ink-900 dark:text-white">Nicat A.</div><div class="text-[10.5px] text-ink-500 dark:text-ink-400">Netflix · 5 gün əvvəl</div></div>
            </div>
          </article>

          <article class="relative p-5 rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500/50 transition">
            <svg aria-hidden="true" class="absolute top-4 right-4 w-6 h-6 text-brand-500/15" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z"/></svg>
            <div class="flex items-center gap-1 mb-3">
              <svg v-for="n in 5" :key="n" class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
            </div>
            <p class="text-[13px] text-ink-700 dark:text-ink-200 leading-relaxed">"Instagram izləyici sifariş etdim — 24 saatda tamamlandı. Real izləyicilər, düşmür."</p>
            <div class="mt-4 flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-emerald-500 grid place-items-center text-white font-black text-[12px] shadow-soft">K</span>
              <div class="min-w-0"><div class="text-[12.5px] font-black text-ink-900 dark:text-white">Kamran S.</div><div class="text-[10.5px] text-ink-500 dark:text-ink-400">SMM Panel · 1 həftə əvvəl</div></div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 7. XƏBƏRLƏR -->
    <section v-if="blogs.data?.length" class="bg-ink-50 dark:bg-ink-900/50 py-10 md:py-14">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="flex items-end justify-between gap-3 mb-6 flex-wrap">
          <div class="flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-brand-500 text-white grid place-items-center shadow-pop">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z"/></svg>
            </span>
            <div>
              <h2 class="text-[18px] md:text-[22px] font-black tracking-tight text-ink-900 dark:text-white leading-tight">Xəbərlər</h2>
              <p class="text-[11.5px] text-ink-500 dark:text-ink-400 mt-0.5">Son yeniliklər və kampaniyalar</p>
            </div>
          </div>
          <nuxt-link to="/blogs" class="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-ink-100 dark:bg-ink-800 hover:bg-brand-500 hover:text-white text-[12px] font-bold text-ink-700 dark:text-ink-200 transition">Hamısına bax
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </nuxt-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <nuxt-link v-for="row in blogs.data" :key="row.slug" :to="{name: 'blogs-slug', params: {slug: row.slug}}"
                     class="group relative rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 hover:-translate-y-0.5 hover:shadow-card transition overflow-hidden">
            <div class="aspect-[16/9] relative bg-ink-100 dark:bg-ink-800 overflow-hidden">
              <img :src="row.image" :alt="row.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <div class="p-4">
              <div class="text-[10.5px] font-bold text-ink-500 dark:text-ink-400 mb-1.5">{{ formatDateOnly(row.created_at) }}</div>
              <h3 class="text-[14px] font-black text-ink-900 dark:text-white leading-tight group-hover:text-brand-500 transition line-clamp-2">{{ row.title }}</h3>
              <p class="mt-1.5 text-[12px] text-ink-500 dark:text-ink-400 leading-snug line-clamp-2">{{ row.description }}</p>
            </div>
          </nuxt-link>
        </div>
      </div>
    </section>

  </main>
</template>

<style scoped>
</style>
