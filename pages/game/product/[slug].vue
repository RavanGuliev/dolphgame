<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import OrderModal from "~/components/modals/orderModal.vue";
import { authStore } from "~/stores/authStore";
import { basketStore } from "#imports";
import Comments from "~/components/comment/comments.vue";

const qty = ref(1);
const { $api, $toast } = useNuxtApp();
const route = useRoute();
const auth = authStore();
const { headers } = storeToRefs(auth);

const row = await $api.get(`public/product?slug=${route.params.slug}`, headers.value);
const others = await $api.get(`public/product/${row.data.parent}/${row.data.id}`, headers.value);

const isLocked = computed(() => Number(row.data.only_one_order) === 1);
watch(qty, (v) => {
  if (isLocked.value && v > 1) {
    qty.value = 1;
    $toast.error("Bu məhsul üçün miqdar 1-dən çox ola bilməz.");
  }
});

const fmt = (n: any) => Number(n || 0).toFixed(2);
const bonus = computed(() => row.data.bonus * qty.value);
const price = computed(() => fmt(row.data.price * qty.value));
const oldPrice = computed(() => (row.data.old_price ? fmt(row.data.old_price * qty.value) : null));
const discountPct = computed(() => {
  if (!row.data.old_price || !row.data.price) return 0;
  return Math.round((1 - row.data.price / row.data.old_price) * 100);
});

const basket = basketStore();
const { setBaskets } = basket;

const decrement = () => {
  if (isLocked.value) return $toast.error("Maksimum sifariş limiti 1 ədəddir.");
  if (qty.value > 1) qty.value--;
};
const increment = () => {
  if (isLocked.value) return $toast.error("Maksimum sifariş limiti 1 ədəddir.");
  qty.value++;
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

const orderOpen = ref(false);
const activeTab = ref<"desc" | "reviews" | "howto">("desc");
const descOpen = ref(false);

useHead({
  title: `${row.data.name} satın al`,
  meta: [{ name: "description", content: row.data.detail }],
});
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6">
    <!-- BREADCRUMB -->
    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px] text-ink-500 dark:text-ink-400 mb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
      <nuxt-link to="/" class="hover:text-brand-500 transition">Ana səhifə</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <nuxt-link :to="{ name: 'category-slug', params: { slug: row.data.category_slug } }" class="hover:text-brand-500 transition">{{ row.data.category }}</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <nuxt-link :to="{ name: 'game-slug', params: { slug: row.data.game_slug } }" class="hover:text-brand-500 transition">{{ row.data.game }}</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <span class="font-semibold text-ink-900 dark:text-white">{{ row.data.name }}</span>
    </nav>

    <!-- HERO PRODUCT CARD -->
    <section class="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 shadow-soft overflow-hidden mb-8">
      <div class="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-0 lg:items-start">
        <!-- Image -->
        <div class="relative p-4 border-b lg:border-b-0 lg:border-r border-ink-200 dark:border-ink-800">
          <div class="relative w-full aspect-square rounded-xl overflow-hidden bg-ink-50 dark:bg-ink-800">
            <img :src="row.data.image" :alt="row.data.name" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Info + Buy -->
        <div class="p-5 md:p-7 flex flex-col gap-4 min-w-0">
          <div class="flex items-start justify-between gap-3 flex-wrap">
            <div class="min-w-0 flex-1">
              <h1 class="text-[22px] md:text-[26px] font-black tracking-tight leading-tight text-ink-900 dark:text-white">{{ row.data.name }}</h1>
              <p v-if="row.data.detail" class="mt-1.5 text-[13.5px] text-ink-600 dark:text-ink-300 leading-relaxed line-clamp-2">{{ row.data.detail }}</p>
            </div>
            <div class="shrink-0 inline-flex items-center gap-2 h-8 pl-2 pr-2.5 rounded-full bg-white dark:bg-ink-800 ring-1 ring-amber-500/30">
              <span class="relative w-1.5 h-1.5 shrink-0"><span class="absolute inset-0 rounded-full bg-amber-500"></span><span class="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-60"></span></span>
              <span class="text-[11.5px] font-bold text-ink-900 dark:text-white">Canlı satış</span>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex items-center gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-ink-50 dark:bg-ink-800 text-ink-700 dark:text-ink-300 text-[11.5px] font-semibold ring-1 ring-ink-200 dark:ring-ink-700">
              <svg class="w-3.5 h-3.5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Avtomatik çatdırılma
            </span>
            <span class="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11.5px] font-bold ring-1 ring-emerald-500/30">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12A10 10 0 1112 2"/><polyline points="22 4 12 14 9 11"/></svg>
              100% məmnuniyyət
            </span>
            <span v-if="row.data.stock > 0" class="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-ink-50 dark:bg-ink-800 text-ink-700 dark:text-ink-300 text-[11.5px] font-semibold ring-1 ring-ink-200 dark:ring-ink-700">
              <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Stokda var
            </span>
          </div>

          <!-- qty + price + buy -->
          <div class="flex items-stretch gap-2.5 pt-2 border-t border-ink-100 dark:border-ink-800 flex-wrap md:flex-nowrap">
            <div class="inline-flex items-center justify-between w-[124px] min-h-[52px] rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 focus-within:border-brand-500 transition px-1 shrink-0">
              <button @click="decrement" type="button" class="w-10 h-10 grid place-items-center rounded-lg text-ink-500 dark:text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 active:scale-90 transition" :class="{ 'opacity-40': isLocked }" aria-label="Azalt"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
              <span class="flex-1 grid place-items-center text-[15px] font-black tabular-nums select-none text-ink-900 dark:text-white">{{ qty }}</span>
              <button @click="increment" type="button" class="w-10 h-10 grid place-items-center rounded-lg text-ink-500 dark:text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 active:scale-90 transition" :class="{ 'opacity-40': isLocked }" aria-label="Artır"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
            </div>

            <div class="min-h-[52px] px-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-500/20 flex flex-col items-start justify-center tabular-nums shrink-0">
              <span class="text-[18px] md:text-[19px] font-black tracking-tight text-emerald-600 dark:text-emerald-400 leading-none">{{ price }} AZN</span>
              <span v-if="oldPrice" class="mt-0.5 flex items-center gap-1.5 leading-none">
                <span class="text-[10.5px] line-through font-semibold text-ink-400 dark:text-ink-500">{{ oldPrice }} AZN</span>
                <span v-if="discountPct > 0" class="text-[10px] font-black text-emerald-600 dark:text-emerald-400">−{{ discountPct }}%</span>
              </span>
            </div>

            <a v-if="row.data.type === 'e-pin' && row.data.stock > 0" @click.prevent="addBasket(row.data.id, qty)" class="ripple shine-wrap cursor-pointer flex-1 min-h-[52px] min-w-[180px] rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[.99] text-white text-[14px] md:text-[15px] font-bold flex items-center justify-center gap-2 shadow-pop transition">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>
              Səbətə at <span class="text-white/80 font-extrabold hidden sm:inline">— {{ price }} AZN</span>
            </a>
            <a v-else-if="row.data.stock > 0" @click="orderOpen = true" class="ripple shine-wrap cursor-pointer flex-1 min-h-[52px] min-w-[180px] rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[.99] text-white text-[14px] md:text-[15px] font-bold flex items-center justify-center gap-2 shadow-pop transition">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>
              İndi satın al <span class="text-white/80 font-extrabold hidden sm:inline">— {{ price }} AZN</span>
            </a>
            <span v-else class="flex-1 min-h-[52px] min-w-[180px] rounded-xl bg-ink-200 dark:bg-ink-800 text-ink-500 text-[14px] font-bold flex items-center justify-center cursor-not-allowed">Stokda yoxdur</span>
          </div>

          <!-- Bonus -->
          <div class="flex items-center gap-2 -mt-1">
            <span class="inline-flex items-center gap-1.5 h-6 px-2 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold ring-1 ring-amber-500/20">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
              +{{ bonus }} bonus xal
            </span>
            <span class="text-[11px] text-ink-500 dark:text-ink-400">Hər alışda DolPh xalları toplayın</span>
          </div>

          <!-- Trust + payment -->
          <div class="mt-auto pt-3 border-t border-ink-100 dark:border-ink-800">
            <div class="flex items-center gap-4 flex-wrap">
              <span class="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-700 dark:text-ink-300"><span class="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></span> Təhlükəsiz ödəniş</span>
              <span class="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-700 dark:text-ink-300"><span class="w-6 h-6 rounded-md bg-brand-50 dark:bg-brand-500/10 text-brand-500 grid place-items-center"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></span> ~30 saniyə çatdırılma</span>
              <span class="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-700 dark:text-ink-300"><span class="w-6 h-6 rounded-md bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 grid place-items-center"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></span> 7/24 dəstək</span>
            </div>
            <div class="mt-3 flex items-center gap-2 flex-wrap">
              <span class="text-[11px] font-semibold text-ink-500 dark:text-ink-400">Ödəniş üsulları:</span>
              <span v-for="m in ['VISA','MASTERCARD','m10','MilliÖN','Balans']" :key="m" class="inline-flex items-center h-6 px-2 rounded-md bg-white dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[10px] font-black tracking-wider text-ink-700 dark:text-ink-200">{{ m }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SIMILAR -->
    <section v-if="others.data && others.data.length" class="mb-8">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink-50 via-white to-brand-50/60 dark:from-ink-800/60 dark:via-ink-900 dark:to-brand-500/10 ring-1 ring-ink-200 dark:ring-ink-800 px-4 md:px-5 py-4 mb-4">
        <div aria-hidden="true" class="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-brand-500/10 blur-2xl"></div>
        <div class="relative flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-3 min-w-0">
            <div class="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-[#FF6A2E] grid place-items-center shadow-pop ring-2 ring-white dark:ring-ink-900"><svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.39 4.84L20 7.86l-4 3.9.94 5.5L12 14.77 7.06 17.27 8 11.76l-4-3.9 5.61-1.02L12 2z"/></svg></div>
            <div class="min-w-0">
              <h2 class="text-[16px] md:text-[18px] font-black tracking-tight text-ink-900 dark:text-white leading-tight">Oxşar məhsullar</h2>
              <p class="mt-0.5 text-[12px] text-ink-500 dark:text-ink-400 leading-snug">{{ row.data.game }} üçün digər paketlər.</p>
            </div>
          </div>
          <nuxt-link :to="{ name: 'game-slug', params: { slug: row.data.game_slug } }" class="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-white dark:bg-ink-800 hover:bg-brand-500 hover:text-white text-[12px] font-bold text-ink-700 dark:text-ink-200 ring-1 ring-ink-200 dark:ring-ink-700 hover:ring-brand-500 transition">Hamısına bax <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></nuxt-link>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <nuxt-link v-for="other in others.data" :key="other.id" :to="{ name: 'game-product-slug', params: { slug: other.slug } }" class="group relative flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 hover:border-brand-500 hover:shadow-card transition">
          <span class="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-ink-100 dark:bg-ink-800 ring-1 ring-black/5">
            <img :src="other.image" :alt="other.name" class="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </span>
          <div class="min-w-0 flex-1">
            <h3 class="text-[12.5px] font-extrabold text-ink-900 dark:text-white truncate">{{ other.name }}</h3>
            <div class="mt-0.5 flex items-center gap-1.5 tabular-nums">
              <span class="text-[12.5px] font-black text-emerald-600 dark:text-emerald-400">{{ fmt(other.price) }} AZN</span>
              <span v-if="other.old_price" class="text-[10px] line-through font-semibold text-ink-400 dark:text-ink-500">{{ fmt(other.old_price) }} AZN</span>
            </div>
          </div>
          <span class="w-7 h-7 rounded-lg bg-ink-100 dark:bg-ink-800 group-hover:bg-brand-500 group-hover:text-white text-ink-500 dark:text-ink-400 grid place-items-center shrink-0 transition"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></span>
        </nuxt-link>
      </div>
    </section>

    <!-- TABS -->
    <section class="rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 mb-8">
      <div role="tablist" class="flex items-center gap-1 px-2 md:px-4 border-b border-ink-200 dark:border-ink-800 overflow-x-auto no-scrollbar">
        <button @click="activeTab = 'desc'" type="button" class="relative inline-flex items-center gap-2 h-12 px-4 text-[13px] md:text-[13.5px] font-bold shrink-0 transition" :class="activeTab === 'desc' ? 'text-ink-900 dark:text-white' : 'text-ink-500 dark:text-ink-400'">
          Açıqlama
          <span v-if="activeTab === 'desc'" class="absolute left-3 right-3 -bottom-px h-0.5 rounded-full bg-brand-500"></span>
        </button>
        <button @click="activeTab = 'reviews'" type="button" class="relative inline-flex items-center gap-2 h-12 px-4 text-[13px] md:text-[13.5px] font-bold shrink-0 transition" :class="activeTab === 'reviews' ? 'text-ink-900 dark:text-white' : 'text-ink-500 dark:text-ink-400'">
          Şərhlər
          <span v-if="activeTab === 'reviews'" class="absolute left-3 right-3 -bottom-px h-0.5 rounded-full bg-brand-500"></span>
        </button>
        <button @click="activeTab = 'howto'" type="button" class="relative inline-flex items-center gap-2 h-12 px-4 text-[13px] md:text-[13.5px] font-bold shrink-0 transition" :class="activeTab === 'howto' ? 'text-ink-900 dark:text-white' : 'text-ink-500 dark:text-ink-400'">
          Necə istifadə edilir?
          <span v-if="activeTab === 'howto'" class="absolute left-3 right-3 -bottom-px h-0.5 rounded-full bg-brand-500"></span>
        </button>
      </div>

      <!-- Açıqlama -->
      <div v-show="activeTab === 'desc'" class="p-5 md:p-6">
        <h3 class="text-[16px] md:text-[17px] font-black text-ink-900 dark:text-white mb-2.5">{{ row.data.name }}</h3>
        <div class="relative overflow-hidden transition-[max-height] duration-500 text-ink-700 dark:text-ink-200 prose-dd" :class="descOpen ? 'max-h-[3000px]' : 'max-h-[220px]'">
          <div v-html="row.data.detail"></div>
          <div v-if="!descOpen" class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-ink-900 via-white/85 dark:via-ink-900/85 to-transparent pointer-events-none"></div>
        </div>
        <div class="mt-1">
          <button @click="descOpen = !descOpen" type="button" class="text-[13px] font-bold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1.5 transition">
            <span>{{ descOpen ? 'Yığışdır' : 'Hamısını oxu' }}</span>
            <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': descOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      </div>

      <!-- Şərhlər -->
      <div v-show="activeTab === 'reviews'" class="p-5 md:p-6">
        <comments :game="row.data.parent" />
      </div>

      <!-- Necə istifadə -->
      <div v-show="activeTab === 'howto'" class="p-5 md:p-6">
        <div v-if="row.data.how_use" v-html="row.data.how_use" class="prose-dd text-ink-700 dark:text-ink-200"></div>
        <ol v-else class="space-y-3">
          <li class="flex gap-3">
            <span class="w-8 h-8 rounded-lg bg-brand-500 text-white grid place-items-center font-black text-[13px] shrink-0">1</span>
            <div><h4 class="text-[13.5px] font-extrabold text-ink-900 dark:text-white">Məlumatınızı hazırlayın</h4><p class="mt-0.5 text-[12.5px] text-ink-600 dark:text-ink-300 leading-relaxed">Oyunçu ID və ya tələb olunan məlumatı əvvəlcədən hazır saxlayın.</p></div>
          </li>
          <li class="flex gap-3">
            <span class="w-8 h-8 rounded-lg bg-brand-500 text-white grid place-items-center font-black text-[13px] shrink-0">2</span>
            <div><h4 class="text-[13.5px] font-extrabold text-ink-900 dark:text-white">"İndi satın al" düyməsinə basın</h4><p class="mt-0.5 text-[12.5px] text-ink-600 dark:text-ink-300 leading-relaxed">Açılan pəncərədə məlumatınızı yazıb davam edin.</p></div>
          </li>
          <li class="flex gap-3">
            <span class="w-8 h-8 rounded-lg bg-brand-500 text-white grid place-items-center font-black text-[13px] shrink-0">3</span>
            <div><h4 class="text-[13.5px] font-extrabold text-ink-900 dark:text-white">Ödənişi tamamlayın</h4><p class="mt-0.5 text-[12.5px] text-ink-600 dark:text-ink-300 leading-relaxed">Kart, balans və ya digər üsulla ödəyin — sifariş saniyələr içində hazır olur.</p></div>
          </li>
          <li class="flex gap-3">
            <span class="w-8 h-8 rounded-lg bg-emerald-500 text-white grid place-items-center shrink-0"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
            <div><h4 class="text-[13.5px] font-extrabold text-ink-900 dark:text-white">Hazırdır!</h4><p class="mt-0.5 text-[12.5px] text-ink-600 dark:text-ink-300 leading-relaxed">Problem yaranarsa 7/24 dəstəyimizə yazın.</p></div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Order modal -->
    <order-modal
      v-if="orderOpen"
      :game="row.data"
      :product="row.data"
      :qty="qty"
      @close="orderOpen = false"
      @incrementFromChildren="increment"
      @decrementFromChildren="decrement"
    />
  </main>
</template>

<style scoped>
.prose-dd :deep(h1),
.prose-dd :deep(h2),
.prose-dd :deep(h3) { font-weight: 800; margin: 1rem 0 .4rem; }
.prose-dd :deep(p) { margin-bottom: .75rem; line-height: 1.7; }
.prose-dd :deep(ul) { list-style: disc; padding-left: 1.25rem; margin-bottom: .75rem; }
.prose-dd :deep(a) { color: #FF4800; }
.prose-dd :deep(img) { max-width: 100%; border-radius: .5rem; }
</style>
