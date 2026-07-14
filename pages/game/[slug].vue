<script setup lang="ts">
import { useRoute } from "vue-router";
import { useHead } from "@unhead/vue";
import OrderModal from "~/components/modals/orderModal.vue";
import { authStore } from "~/stores/authStore";
import { basketStore } from "#imports";
import { computed, ref, nextTick } from "vue";
import Comments from "~/components/comment/comments.vue";

const { $api, $toast } = useNuxtApp();
const route = useRoute();
const auth = authStore();
const { headers } = storeToRefs(auth);
const game = await $api.get(`public/game?slug=${route.params.slug}`).then((res) => res.data);
const products = await $api.get(`public/products?game=${game.id}&count=50`, headers.value).then((res) => res.data);
const others = await $api.get(`public/category?slug=${game.category.slug}`).then((res) => res.data);

const basket = basketStore();
const { setBaskets } = basket;

const isDigital = computed(() => game.category.slug === 'dolphdigital');

// ── qty keyed by product id (robust to sort/filter) ──
const qty = ref<Record<number, number>>({});
products.forEach((p: any) => (qty.value[p.id] = 1));
const getQty = (p: any) => (p ? qty.value[p.id] ?? 1 : 1);
const isProductLocked = (p: any) => !!p && Number(p.only_one_order) === 1;
const incQty = (p: any) => {
  if (isProductLocked(p)) return $toast.error("Maksimum sifariş limiti 1 ədəddir");
  qty.value[p.id]++;
};
const decQty = (p: any) => {
  if (isProductLocked(p)) return $toast.error("Maksimum sifariş limiti 1 ədəddir");
  if (qty.value[p.id] > 1) qty.value[p.id]--;
};

// ── order modal (legacy player-ID + payment flow) ──
const selectedProduct = ref<any>(null);
// The new orderModal is a self-contained Vue modal; rendering it (v-if) opens it,
// and it emits `close` when dismissed.
const selected = (product: any) => {
  selectedProduct.value = product;
};

const addBasket = (id: any, q: any) => {
  $api
    .post("user/basket/add", { id, count: q }, headers.value)
    .then((res) => {
      $api.get("user/basket", headers.value).then((r) => setBaskets(r.data));
      $toast.success(res.data);
    })
    .catch((error) => $toast.error(error));
};

const fmt = (n: any) => Number(n || 0).toFixed(2);

// ── digital package-grid branch state ──
const activeIdx = ref(0);
const activeProduct = computed<any>(() => products[activeIdx.value] ?? null);
const linePrice = computed(() => fmt(getQty(activeProduct.value) * (activeProduct.value?.price ?? 0)));
const lineOld = computed(() => (activeProduct.value?.old_price ? fmt(getQty(activeProduct.value) * activeProduct.value.old_price) : null));
const discountPct = computed(() => {
  const p = activeProduct.value;
  if (!p?.old_price || !p?.price) return 0;
  return Math.round((1 - p.price / p.old_price) * 100);
});
const similar = computed<any[]>(() => (others.games ?? []).filter((g: any) => g.slug !== route.params.slug));

// ── pubg-uc list branch state ──
const sourceGames = computed<any[]>(() => others.games ?? []);
const productSearch = ref("");
const sortBy = ref("recommended");
const visibleProducts = computed(() => {
  let arr = [...products];
  const q = productSearch.value.trim().toLowerCase();
  if (q) arr = arr.filter((p: any) => p.name?.toLowerCase().includes(q));
  if (sortBy.value === "price-asc") arr.sort((a: any, b: any) => a.price - b.price);
  else if (sortBy.value === "price-desc") arr.sort((a: any, b: any) => b.price - a.price);
  return arr;
});

const descOpen = ref(false);

useHead({
  title: `${game.name} satışı`,
  meta: [{ name: "description", content: game.meta_description }],
});
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6">
    <!-- BREADCRUMB -->
    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px] text-ink-500 dark:text-ink-400 mb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
      <nuxt-link to="/" class="hover:text-brand-500 transition">Ana səhifə</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <nuxt-link :to="{ name: 'category-slug', params: { slug: game.category.slug } }" class="hover:text-brand-500 transition">{{ game.category.name }}</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <span class="font-semibold text-ink-900 dark:text-white">{{ game.name }}</span>
    </nav>

    <!-- ════════════════ GAME CURRENCY (pubg-uc.html) ════════════════ -->
    <template v-if="!isDigital">
      <!-- HERO -->
      <section class="relative overflow-hidden rounded-2xl mb-5 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800">
        <span aria-hidden="true" class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent"></span>
        <div class="relative px-5 md:px-8 py-7 md:py-9">
          <h1 class="text-[26px] md:text-[34px] font-black tracking-tight leading-[1.08] text-ink-900 dark:text-white">{{ game.name }}</h1>
          <p class="mt-2 text-[13.5px] md:text-[14.5px] text-ink-600 dark:text-ink-300 leading-relaxed max-w-md">Seç, ödə — hesabına saniyələr içində çatdıraq.</p>
          <div class="mt-5 relative max-w-xl">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input v-model="productSearch" type="text" placeholder="Miqdar və ya paket axtar..." class="w-full h-12 pl-11 pr-4 rounded-xl bg-ink-50 dark:bg-ink-800/60 border border-ink-200/80 dark:border-ink-700 placeholder:text-ink-400 text-ink-900 dark:text-white outline-none focus:bg-white dark:focus:bg-ink-900 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition text-[13.5px] font-medium" />
          </div>
          <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] font-semibold text-ink-600 dark:text-ink-400">
            <span class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> Sürətli çatdırılma</span>
            <span class="w-px h-3 bg-ink-200 dark:bg-ink-700"></span>
            <span class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg> Təhlükəsiz ödəniş</span>
            <span class="w-px h-3 bg-ink-200 dark:bg-ink-700"></span>
            <span class="inline-flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg> 24/7 dəstək</span>
          </div>
        </div>
      </section>

      <!-- SOURCE CARDS — category's games (delivery methods) -->
      <div v-if="sourceGames.length > 1" class="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <nuxt-link
          v-for="src in sourceGames"
          :key="src.id"
          :to="{ name: 'game-slug', params: { slug: src.slug } }"
          class="group relative overflow-hidden text-left flex items-center gap-3 p-3.5 rounded-2xl border-2 transition"
          :class="src.slug === route.params.slug ? 'border-brand-500 bg-gradient-to-b from-brand-500/[0.06] to-transparent shadow-[0_10px_28px_-14px_rgba(255,72,0,0.45)]' : 'border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800/55 hover:border-brand-500/45'"
        >
          <span class="w-11 h-11 rounded-xl grid place-items-center shrink-0 overflow-hidden bg-ink-50 dark:bg-ink-800">
            <img :src="src.image" :alt="src.name" class="w-full h-full object-cover" />
          </span>
          <div class="min-w-0 flex-1">
            <span class="block text-[13.5px] md:text-[14px] font-extrabold text-ink-900 dark:text-white leading-tight truncate">{{ src.name }}</span>
            <span class="block text-[11.5px] text-ink-500 dark:text-ink-400 mt-0.5 font-medium truncate">{{ src.meta_description || (src.product_count ? src.product_count + ' məhsul' : 'Bax və seç') }}</span>
          </div>
          <span class="w-5 h-5 rounded-full grid place-items-center shrink-0 bg-brand-500 text-white" :class="src.slug === route.params.slug ? '' : 'opacity-0'">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
          </span>
        </nuxt-link>
      </div>

      <!-- PRODUCT LIST -->
      <section class="mb-8 min-w-0">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="w-1 h-5 bg-brand-500 rounded-full"></span>
            <h2 class="text-sm font-bold uppercase tracking-wider text-ink-700 dark:text-ink-200">Məhsullar</h2>
            <span class="text-[11px] font-bold text-ink-400">({{ visibleProducts.length }} variant)</span>
          </div>
          <select v-model="sortBy" class="h-9 px-3 pr-8 rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 text-[12px] font-semibold outline-none focus:border-brand-500 transition cursor-pointer text-ink-900 dark:text-white">
            <option value="recommended">Tövsiyə olunan</option>
            <option value="price-asc">Qiymət ↑</option>
            <option value="price-desc">Qiymət ↓</option>
          </select>
        </div>

        <div v-if="visibleProducts.length" class="space-y-4 md:space-y-5">
          <div
            v-for="product in visibleProducts"
            :key="product.id"
            class="group relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 md:p-5 rounded-2xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 hover:border-brand-500 hover:shadow-card transition"
          >
            <span v-if="product.in_daily_sales" class="absolute -top-2 left-3 inline-flex items-center gap-1 h-5 px-2 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 text-[9.5px] font-black tracking-[0.12em] uppercase z-10">
              <svg class="w-2.5 h-2.5 text-brand-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>POPULAR
            </span>
            <nuxt-link :to="{ name: 'game-product-slug', params: { slug: product.slug } }" class="flex items-start gap-3 sm:contents cursor-pointer">
              <span class="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden shrink-0 shadow-pop bg-ink-100 dark:bg-ink-900 ring-1 ring-black/5">
                <img :src="product.image" :alt="product.name" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              </span>
              <div class="flex-1 min-w-0">
                <h3 class="text-[14px] md:text-[15px] font-extrabold truncate text-ink-900 dark:text-white group-hover:text-brand-500 transition">{{ product.name }}</h3>
                <p v-if="product.detail" class="mt-0.5 text-[11.5px] md:text-[12px] text-ink-500 dark:text-ink-400 truncate">{{ product.detail }}</p>
                <div class="mt-1 flex items-center gap-3 flex-wrap text-[11px] md:text-[12px]">
                  <span v-if="product.stock > 0" class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12A10 10 0 1112 2"/><polyline points="22 4 12 14 9 11"/></svg>
                    Stok
                  </span>
                  <span v-else class="inline-flex items-center gap-1 text-red-500 font-bold">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    Bitib
                  </span>
                  <span class="inline-flex items-center gap-1 text-amber-500 dark:text-amber-400 font-bold">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
                    Bonus {{ product.bonus }}
                  </span>
                </div>
              </div>
            </nuxt-link>
            <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-3 md:gap-4 sm:shrink-0">
              <!-- qty -->
              <div class="inline-flex items-center justify-between w-[110px] h-10 rounded-xl bg-white dark:bg-ink-900/40 border border-ink-200 dark:border-ink-700 focus-within:border-brand-500 shrink-0 px-0.5">
                <button @click="decQty(product)" type="button" class="w-8 h-8 grid place-items-center rounded-lg text-ink-500 dark:text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 active:scale-90 transition" :class="{ 'opacity-40': isProductLocked(product) }"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
                <span class="flex-1 grid place-items-center text-[13px] font-bold tabular-nums select-none text-ink-900 dark:text-white">{{ getQty(product) }}</span>
                <button @click="incQty(product)" type="button" class="w-8 h-8 grid place-items-center rounded-lg text-ink-500 dark:text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 active:scale-90 transition" :class="{ 'opacity-40': isProductLocked(product) }"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
              </div>
              <!-- price -->
              <div class="flex flex-col items-end justify-center gap-1 shrink-0 w-[110px] md:w-[130px] min-h-[44px] tabular-nums text-right">
                <span v-if="product.old_price" class="text-[11px] line-through leading-none font-semibold whitespace-nowrap text-ink-400 dark:text-ink-500">{{ fmt(getQty(product) * product.old_price) }} AZN</span>
                <span class="text-[15px] md:text-[17px] font-black tracking-tight whitespace-nowrap leading-none text-emerald-600 dark:text-emerald-400">{{ fmt(getQty(product) * product.price) }} AZN</span>
              </div>
              <!-- buy -->
              <a v-if="product.type === 'e-pin' && product.stock > 0" @click.prevent="addBasket(product.id, getQty(product))" class="ripple shine-wrap cursor-pointer h-11 w-[104px] md:w-[116px] rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[.98] text-white text-[12.5px] md:text-[13px] font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-pop transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>
                Səbətə at
              </a>
              <a v-else-if="product.stock > 0" @click="selected(product)" class="ripple shine-wrap cursor-pointer h-11 w-[104px] md:w-[116px] rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[.98] text-white text-[12.5px] md:text-[13px] font-bold flex items-center justify-center gap-1.5 shrink-0 shadow-pop transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>
                Satın al
              </a>
              <span v-else class="h-11 w-[104px] md:w-[116px] rounded-xl bg-ink-200 dark:bg-ink-900 text-ink-500 text-[12.5px] font-bold grid place-items-center shrink-0 cursor-not-allowed">Bitib</span>
            </div>
          </div>
        </div>
        <div v-else class="rounded-2xl bg-white dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 p-10 text-center text-[13px] text-ink-500 dark:text-ink-400">Nəticə tapılmadı.</div>
      </section>
    </template>

    <!-- ════════════════ PACKAGE GRID (dolphdigital-product.html) ════════════════ -->
    <template v-else>
      <section class="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-soft overflow-hidden mb-8">
        <div class="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-0 lg:items-start">
          <div class="relative p-4 border-b lg:border-b-0 lg:border-r border-ink-200 dark:border-ink-800">
            <div class="relative w-full aspect-square rounded-xl overflow-hidden bg-ink-50 dark:bg-ink-800 grid place-items-center">
              <img :src="game.cover || game.image" :alt="game.name" class="w-full h-full object-cover" />
            </div>
          </div>
          <div class="p-5 md:p-7 flex flex-col gap-4 min-w-0">
            <div class="flex items-start justify-between gap-3 flex-wrap">
              <div class="min-w-0 flex-1">
                <h1 class="text-[22px] md:text-[26px] font-black tracking-tight leading-tight text-ink-900 dark:text-white">{{ game.name }}</h1>
                <p class="mt-1.5 text-[13.5px] text-ink-600 dark:text-ink-300 leading-relaxed">{{ game.category.name }} · sürətli və təhlükəsiz çatdırılma, dərhal aktivləşmə.</p>
              </div>
              <div class="shrink-0 inline-flex items-center gap-2 h-8 pl-2 pr-2.5 rounded-full bg-white dark:bg-ink-800 ring-1 ring-amber-500/30">
                <span class="relative w-1.5 h-1.5 shrink-0"><span class="absolute inset-0 rounded-full bg-amber-500"></span><span class="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-60"></span></span>
                <span class="text-[11.5px] font-bold text-ink-900 dark:text-white">Canlı satış</span>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-wrap">
              <span class="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-ink-50 dark:bg-ink-800 text-ink-700 dark:text-ink-300 text-[11.5px] font-semibold ring-1 ring-ink-200 dark:ring-ink-700"><svg class="w-3.5 h-3.5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> Dərhal çatdırılma</span>
              <span class="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11.5px] font-bold ring-1 ring-emerald-500/30"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12A10 10 0 1112 2"/><polyline points="22 4 12 14 9 11"/></svg> Orijinal & zəmanətli</span>
              <button type="button" data-toggle="modal" data-target="#howToUseModal" class="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 text-[11.5px] font-bold ring-1 ring-sky-500/30 hover:ring-sky-500 transition"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01"/></svg> İstifadə qaydası</button>
            </div>

            <template v-if="products.length">
              <div class="pt-2 border-t border-ink-100 dark:border-ink-800">
                <div class="flex items-center justify-between mb-2.5">
                  <span class="text-[12px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400">Paket seç</span>
                  <span class="text-[11px] text-ink-500 dark:text-ink-400">{{ products.length }} paket mövcuddur</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  <button v-for="(product, key) in products" :key="product.id" @click="activeIdx = key" type="button" class="relative text-left rounded-xl ring-1 p-2.5 transition" :class="activeIdx === key ? 'ring-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'ring-ink-200 dark:ring-ink-800 bg-white dark:bg-ink-900 hover:ring-brand-500/60'">
                    <span v-if="activeIdx === key" class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-brand-500 text-white grid place-items-center"><svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>
                    <div class="flex items-center gap-2">
                      <span class="w-8 h-8 rounded-lg bg-ink-50 dark:bg-ink-800 grid place-items-center overflow-hidden shrink-0"><img :src="product.image" :alt="product.name" class="w-6 h-6 object-contain" /></span>
                      <span class="text-[12px] font-bold text-ink-900 dark:text-white leading-tight line-clamp-2">{{ product.name }}</span>
                    </div>
                    <div class="mt-2 flex items-end justify-between gap-1">
                      <span class="text-[13px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{{ fmt(product.price) }} <span class="text-[9px] text-ink-500 font-bold">AZN</span></span>
                      <span v-if="product.old_price" class="text-[10px] line-through text-ink-400 dark:text-ink-500 tabular-nums">{{ fmt(product.old_price) }}</span>
                    </div>
                    <span v-if="product.stock <= 0" class="mt-1 inline-block text-[9px] font-black uppercase tracking-wider text-red-500">Stokda yox</span>
                  </button>
                </div>
              </div>

              <div class="flex items-stretch gap-2.5 pt-3 border-t border-ink-100 dark:border-ink-800 flex-wrap md:flex-nowrap">
                <div class="min-h-[52px] px-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-500/20 flex flex-col items-start justify-center tabular-nums shrink-0">
                  <span class="text-[18px] md:text-[19px] font-black tracking-tight text-emerald-600 dark:text-emerald-400 leading-none">{{ linePrice }} AZN</span>
                  <span v-if="lineOld" class="mt-0.5 flex items-center gap-1.5 leading-none">
                    <span class="text-[10.5px] line-through font-semibold text-ink-400 dark:text-ink-500">{{ lineOld }} AZN</span>
                    <span v-if="discountPct > 0" class="text-[10px] font-black text-emerald-600 dark:text-emerald-400">−{{ discountPct }}%</span>
                  </span>
                </div>
                <div class="min-h-[52px] inline-flex items-center rounded-xl ring-1 ring-ink-200 dark:ring-ink-800 bg-white dark:bg-ink-900 overflow-hidden shrink-0">
                  <button @click="decQty(activeProduct)" type="button" class="w-10 h-full grid place-items-center text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition" :class="{ 'opacity-40': isProductLocked(activeProduct) }"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
                  <span class="w-10 h-full grid place-items-center text-[14px] font-bold text-ink-900 dark:text-white tabular-nums">{{ getQty(activeProduct) }}</span>
                  <button @click="incQty(activeProduct)" type="button" class="w-10 h-full grid place-items-center text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 transition" :class="{ 'opacity-40': isProductLocked(activeProduct) }"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
                </div>
                <a v-if="activeProduct && activeProduct.type === 'e-pin' && activeProduct.stock > 0" @click.prevent="addBasket(activeProduct.id, getQty(activeProduct))" class="ripple shine-wrap cursor-pointer flex-1 min-h-[52px] min-w-[180px] rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[.99] text-white text-[14px] md:text-[15px] font-bold flex items-center justify-center gap-2 shadow-pop transition">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>
                  Səbətə at <span class="text-white/80 font-extrabold hidden sm:inline">— {{ linePrice }} AZN</span>
                </a>
                <a v-else-if="activeProduct && activeProduct.stock > 0" @click="selected(activeProduct)" class="ripple shine-wrap cursor-pointer flex-1 min-h-[52px] min-w-[180px] rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[.99] text-white text-[14px] md:text-[15px] font-bold flex items-center justify-center gap-2 shadow-pop transition">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>
                  İndi satın al <span class="text-white/80 font-extrabold hidden sm:inline">— {{ linePrice }} AZN</span>
                </a>
                <span v-else class="flex-1 min-h-[52px] min-w-[180px] rounded-xl bg-ink-200 dark:bg-ink-800 text-ink-500 text-[14px] font-bold flex items-center justify-center cursor-not-allowed">Stokda yoxdur</span>
              </div>

              <div class="flex items-center gap-2 -mt-1" v-if="activeProduct">
                <span class="inline-flex items-center gap-1.5 h-6 px-2 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold ring-1 ring-amber-500/20"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg> +{{ (activeProduct.bonus || 0) * getQty(activeProduct) }} bonus xal</span>
                <span class="text-[11px] text-ink-500 dark:text-ink-400">Hər alışda DolPh xalları toplayın</span>
              </div>
            </template>
            <div v-else class="pt-2 border-t border-ink-100 dark:border-ink-800 text-[13px] text-ink-500 dark:text-ink-400">Hazırda bu məhsul üçün paket yoxdur.</div>

            <div class="mt-auto pt-3 border-t border-ink-100 dark:border-ink-800">
              <div class="flex items-center gap-4 flex-wrap">
                <span class="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-700 dark:text-ink-300"><span class="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></span> Təhlükəsiz ödəniş</span>
                <span class="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-700 dark:text-ink-300"><span class="w-6 h-6 rounded-md bg-brand-50 dark:bg-brand-500/10 text-brand-500 grid place-items-center"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></span> Dərhal aktivləşmə</span>
                <span class="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-700 dark:text-ink-300"><span class="w-6 h-6 rounded-md bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 grid place-items-center"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></span> 7/24 dəstək</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Similar -->
      <section v-if="similar.length" class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <span class="w-1 h-5 bg-brand-500 rounded-full"></span>
          <h2 class="text-sm font-bold uppercase tracking-wider text-ink-700 dark:text-ink-200">Oxşar məhsullar</h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <nuxt-link v-for="g in similar" :key="g.id" :to="{ name: 'game-slug', params: { slug: g.slug } }" class="group relative overflow-hidden rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 hover:-translate-y-0.5 hover:shadow-card transition-all duration-300">
            <div class="aspect-[4/3] relative bg-ink-50 dark:bg-ink-800 grid place-items-center overflow-hidden">
              <img :src="g.cover || g.image" :alt="g.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div class="p-3">
              <h3 class="text-[13.5px] font-black text-ink-900 dark:text-white truncate">{{ g.name }}</h3>
              <span class="mt-2 inline-flex w-full items-center justify-center gap-1 h-8 px-2.5 rounded-lg bg-ink-50 dark:bg-ink-800 group-hover:bg-brand-500 group-hover:text-white text-ink-700 dark:text-ink-200 text-[11.5px] font-bold transition">Paketləri gör <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span>
            </div>
          </nuxt-link>
        </div>
      </section>
    </template>

    <!-- DESCRIPTION (common) -->
    <section v-if="game.detail" class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-5 md:p-7 mb-8">
      <h2 class="text-[18px] md:text-[20px] font-black tracking-tight text-ink-900 dark:text-white mb-3">{{ game.name }} haqqında</h2>
      <div class="relative overflow-hidden transition-[max-height] duration-500 text-[13.5px] leading-relaxed text-ink-700 dark:text-ink-200 prose-dd" :class="descOpen ? 'max-h-[3000px]' : 'max-h-[220px]'">
        <div v-html="game.detail"></div>
        <div v-if="!descOpen" class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-ink-900 via-white/85 dark:via-ink-900/85 to-transparent pointer-events-none"></div>
      </div>
      <div class="mt-1">
        <button @click="descOpen = !descOpen" type="button" class="text-[13px] font-bold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1.5 transition">
          <span>{{ descOpen ? 'Yığışdır' : 'Hamısını oxu' }}</span>
          <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': descOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>
    </section>

    <!-- COMMENTS (common) -->
    <section class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-5 md:p-7 mb-8">
      <h2 class="text-[18px] md:text-[20px] font-black tracking-tight text-ink-900 dark:text-white mb-3 flex items-center gap-2">
        <svg class="w-5 h-5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        Şərhlər
      </h2>
      <comments :game="game.id" />
    </section>

    <!-- Order modal (legacy player ID + payment flow) -->
    <order-modal
      v-if="selectedProduct"
      :game="game"
      :product="selectedProduct"
      :qty="Number(getQty(selectedProduct))"
      @close="selectedProduct = null"
      @incrementFromChildren="incQty(selectedProduct)"
      @decrementFromChildren="decQty(selectedProduct)"
    />

    <!-- How-to-use modal (legacy bootstrap) -->
    <div class="modal fade" id="howToUseModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document" style="max-width: 600px;">
        <div class="modal-content text-black" style="background-color: #ffffff; border: none; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <div class="modal-header border-bottom-0 pb-0" style="padding: 20px 25px;">
            <h5 class="modal-title font-weight-bold" style="font-size: 18px; color: #333;">İstifadə qaydası</h5>
            <button type="button" class="close text-black" data-dismiss="modal" aria-label="Close" style="outline: none; opacity: 0.6;"><span aria-hidden="true" style="font-size: 26px;">&times;</span></button>
          </div>
          <div class="modal-body" style="padding: 15px 25px 25px 25px;">
            <div class="instruction-text mb-4" style="font-size: 14px; line-height: 1.5; color: #555;">
              <p class="mb-2">Satın al düyməsinə kliklədikdən sonra məlumatlarınızı yazıb sifarişi tamamlaya bilərsiniz.</p>
            </div>
            <div class="instruction-images">
              <div class="position-relative mb-4"><div class="border rounded-lg overflow-hidden shadow-sm" style="border-color: #eee !important;"><img src="../../public/img/step1.jpg" class="img-fluid w-100 d-block" style="object-fit: contain;" alt="Addım 1"></div><div class="mt-2 small font-weight-bold text-secondary" style="font-size: 12px;"><i class="fas fa-chevron-right mr-1" style="color: #f9a533;"></i> Addım 1: Profil bölməsinə keçin</div></div>
              <div class="position-relative mb-3"><div class="border rounded-lg overflow-hidden shadow-sm" style="border-color: #eee !important;"><img src="../../public/img/step2.jpg" class="img-fluid w-100 d-block" style="object-fit: contain;" alt="Addım 2"></div><div class="mt-2 small font-weight-bold text-secondary" style="font-size: 12px;"><i class="fas fa-chevron-right mr-1" style="color: #f9a533;"></i> Addım 2: ID nömrəsini kopyalayın</div></div>
            </div>
            <div v-if="game.how" class="mt-4 pt-3 border-top border-light" style="font-size: 13px; color: #888; font-style: italic;" v-html="game.how"></div>
          </div>
          <div class="modal-footer border-top-0 pt-0 justify-content-center pb-4">
            <button type="button" class="btn btn-warning px-5 font-weight-bold text-white shadow-sm" data-dismiss="modal" style="background-color: #f9a533; border-radius: 10px; border: none; height: 45px; min-width: 180px;">Anladım</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.prose-dd :deep(h1),
.prose-dd :deep(h2),
.prose-dd :deep(h3) { font-weight: 800; margin: 1rem 0 .4rem; }
.prose-dd :deep(p) { margin-bottom: .75rem; }
.prose-dd :deep(ul) { list-style: disc; padding-left: 1.25rem; margin-bottom: .75rem; }
.prose-dd :deep(a) { color: #FF4800; }
.prose-dd :deep(img) { max-width: 100%; border-radius: .5rem; }
</style>
