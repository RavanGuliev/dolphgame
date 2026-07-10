<script setup lang="ts">
import { useRoute } from "#imports";

const route = useRoute();
const { $api } = useNuxtApp();
const row = await $api.get("public/category?slug=" + route.params.slug);

const category = computed<any>(() => row.data ?? {});
const games = computed<any[]>(() => category.value.games ?? []);

// Digital category uses the brand-grid layout; game categories use the
// "delivery method" layout (pubg-mobile.html).
const isDigital = computed(() => category.value.slug === "dolphdigital");

useHead({
  title: category.value.name,
  meta: [{ name: "description", content: category.value.meta_description || category.value.description || category.value.name }],
});

// Digital grid: client-side search
const search = ref("");
const filteredGames = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return games.value;
  return games.value.filter((g: any) => g.name?.toLowerCase().includes(q));
});

const descOpen = ref(false);
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6">
    <!-- BREADCRUMB -->
    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px] text-ink-500 dark:text-ink-400 mb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
      <nuxt-link to="/" class="hover:text-brand-500 transition">Ana səhifə</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <nuxt-link to="/games" class="hover:text-brand-500 transition">Oyunlar</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <span class="font-semibold text-ink-900 dark:text-white">{{ category.name }}</span>
    </nav>

    <!-- ════════════════ GAME CATEGORY (pubg-mobile.html) ════════════════ -->
    <template v-if="!isDigital">
      <!-- HERO -->
      <section class="relative overflow-hidden rounded-2xl mb-6 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800">
        <span aria-hidden="true" class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent"></span>
        <div class="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 md:gap-7 items-center p-5 md:p-7">
          <!-- Logo card -->
          <div class="relative shrink-0 mx-auto md:mx-0">
            <div class="relative w-[220px] md:w-[240px] h-[120px] md:h-[140px] rounded-2xl overflow-hidden bg-ink-50 dark:bg-ink-800/60 ring-1 ring-ink-200 dark:ring-ink-800 grid place-items-center p-4">
              <div aria-hidden="true" class="absolute inset-0 opacity-40" style="background: radial-gradient(circle at 50% 50%, rgba(255,140,40,.14), transparent 65%);"></div>
              <img :src="category.image" :alt="category.name" class="relative w-full h-full object-contain" />
            </div>
            <span class="absolute top-2 right-2 inline-flex items-center gap-1 h-5 px-1.5 rounded-full bg-emerald-500 text-white text-[9.5px] font-black tracking-wider uppercase shadow-soft">
              <span class="relative w-1 h-1 rounded-full bg-white">
                <span class="absolute inset-0 rounded-full bg-white animate-ping opacity-70"></span>
              </span>
              Aktiv
            </span>
          </div>
          <!-- Info -->
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap mb-2">
              <span class="inline-flex items-center h-5 px-1.5 rounded bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-[10px] font-black tracking-wider uppercase ring-1 ring-brand-500/20">{{ category.name }}</span>
              <span class="inline-flex items-center h-5 px-1.5 rounded bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px] font-black tracking-wider uppercase ring-1 ring-ink-200 dark:ring-ink-700">Oyun</span>
              <span class="inline-flex items-center h-5 px-1.5 rounded bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px] font-black tracking-wider uppercase ring-1 ring-ink-200 dark:ring-ink-700">Rəsmi</span>
            </div>
            <h1 class="text-[26px] md:text-[34px] font-black tracking-tight leading-[1.08] text-ink-900 dark:text-white">{{ category.name }}</h1>
            <p class="mt-2 text-[13.5px] md:text-[14.5px] text-ink-600 dark:text-ink-300 leading-relaxed max-w-2xl">
              {{ category.name }} üçün bütün xidmətlər — sürətli, təhlükəsiz və sərfəli. Çatdırılma saniyələr içində.
            </p>
            <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] font-semibold text-ink-600 dark:text-ink-400">
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
                <span class="text-ink-900 dark:text-white font-black tabular-nums">4.9<span class="font-bold text-ink-400">/5.0</span></span>
              </span>
              <span class="w-px h-3 bg-ink-200 dark:bg-ink-700"></span>
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                <span class="text-ink-900 dark:text-white font-black tabular-nums">{{ category.countProducts || games.length }}+</span>
                <span>məhsul</span>
              </span>
              <span class="w-px h-3 bg-ink-200 dark:bg-ink-700"></span>
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span class="text-ink-900 dark:text-white font-black">~30 san</span>
                <span>çatdırılma</span>
              </span>
              <span class="w-px h-3 bg-ink-200 dark:bg-ink-700"></span>
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                <span class="text-ink-900 dark:text-white font-black">7/24</span>
                <span>dəstək</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- DELIVERY METHOD / GAME CARDS — square icon-tile grid (pubg-mobile.html) -->
      <section v-if="games.length" class="mb-8">
        <div class="flex items-end justify-between gap-3 mb-4">
          <div>
            <h2 class="text-[18px] md:text-[20px] font-black tracking-tight text-ink-900 dark:text-white leading-tight">Necə almaq istəyirsən?</h2>
            <p class="mt-1 text-[12.5px] text-ink-500 dark:text-ink-400">Üsulu seç və davam et.</p>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          <nuxt-link
            v-for="game in games"
            :key="game.id"
            :to="{ name: 'game-slug', params: { slug: game.slug } }"
            class="group block"
          >
            <div
              class="relative aspect-square rounded-2xl ring-1 ring-ink-200 dark:ring-ink-800 group-hover:ring-brand-500 group-hover:-translate-y-0.5 transition overflow-hidden grid place-items-center"
              :class="game.type === 'e-pin' ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-amber-50 dark:bg-amber-500/10'"
            >
              <svg v-if="game.type === 'e-pin'" class="w-14 h-14 md:w-16 md:h-16 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <svg v-else class="w-14 h-14 md:w-16 md:h-16 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
              <span class="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white dark:bg-ink-900 grid place-items-center text-ink-400 dark:text-ink-500 ring-1 ring-ink-200 dark:ring-ink-700 group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500 transition">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </span>
            </div>
            <div class="mt-2.5 px-1">
              <h3 class="text-[13px] md:text-[13.5px] font-black text-ink-900 dark:text-white truncate">{{ game.name }}</h3>
              <p class="mt-0.5 text-[11.5px] text-ink-500 dark:text-ink-400 truncate">{{ game.meta_description || (game.product_count ? game.product_count + ' məhsul' : 'Bax və seç') }}</p>
            </div>
          </nuxt-link>
        </div>
      </section>
      <div v-else class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-10 text-center text-[13px] text-ink-500 dark:text-ink-400 mb-8">
        Bu kateqoriyada hazırda məhsul yoxdur.
      </div>
    </template>

    <!-- ════════════════ DIGITAL CATEGORY (dolphdigital.html) ════════════════ -->
    <template v-else>
      <section class="relative overflow-hidden rounded-2xl mb-6 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800">
        <span aria-hidden="true" class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent"></span>
        <div class="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 md:gap-7 items-center p-5 md:p-7">
          <div class="relative shrink-0 mx-auto md:mx-0">
            <div class="relative w-[120px] md:w-[140px] aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 grid place-items-center ring-1 ring-ink-200 dark:ring-ink-800">
              <div aria-hidden="true" class="absolute inset-0 opacity-40" style="background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.6), transparent 55%);"></div>
              <img v-if="category.image" :src="category.image" :alt="category.name" class="relative w-full h-full object-cover" />
            </div>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap mb-2">
              <span class="inline-flex items-center h-5 px-1.5 rounded bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-[10px] font-black tracking-wider uppercase ring-1 ring-brand-500/20">{{ category.name }}</span>
              <span class="inline-flex items-center h-5 px-1.5 rounded bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px] font-black tracking-wider uppercase ring-1 ring-ink-200 dark:ring-ink-700">Subscription</span>
            </div>
            <h1 class="text-[26px] md:text-[34px] font-black tracking-tight leading-[1.08] text-ink-900 dark:text-white">{{ category.name }}</h1>
            <p class="mt-2 text-[13.5px] md:text-[14.5px] text-ink-600 dark:text-ink-300 leading-relaxed max-w-2xl">
              {{ category.name }} kateqoriyasında {{ games.length }}+ məhsul — sərfəli qiymət, dərhal və təhlükəsiz çatdırılma ilə.
            </p>
            <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11.5px] font-semibold text-ink-600 dark:text-ink-400">
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
                <span class="text-ink-900 dark:text-white font-black">{{ games.length }}</span><span>brend</span>
              </span>
              <span class="w-px h-3 bg-ink-200 dark:bg-ink-700"></span>
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span class="text-ink-900 dark:text-white font-black">Dərhal</span><span>aktivləşmə</span>
              </span>
              <span class="w-px h-3 bg-ink-200 dark:bg-ink-700"></span>
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                <span class="text-ink-900 dark:text-white font-black">7/24</span><span>dəstək</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Search -->
      <section class="mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="relative flex-1 min-w-0 glow-focus rounded-xl">
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <input v-model="search" type="text" :placeholder="category.name + ' içində axtar…'" class="w-full h-11 pl-10 pr-3 rounded-xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 focus:ring-brand-500 outline-none text-sm font-medium transition placeholder:text-ink-400 text-ink-900 dark:text-white" />
        </div>
        <div class="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-brand-500 text-white text-[12.5px] font-bold ring-1 ring-brand-500">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
          {{ filteredGames.length }} məhsul
        </div>
      </section>

      <!-- Brand grid -->
      <section class="mb-8">
        <div v-if="filteredGames.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <nuxt-link
            v-for="game in filteredGames"
            :key="game.id"
            :to="{ name: 'game-slug', params: { slug: game.slug } }"
            class="dd-card group relative overflow-hidden rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 hover:-translate-y-0.5 hover:shadow-card transition-all duration-300"
          >
            <div class="aspect-[4/3] relative bg-ink-50 dark:bg-ink-800 grid place-items-center overflow-hidden">
              <img :src="game.cover || game.image" :alt="game.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div class="p-3">
              <h3 class="text-[13.5px] font-black text-ink-900 dark:text-white truncate">{{ game.name }}</h3>
              <p class="mt-0.5 text-[11px] text-ink-500 dark:text-ink-400 truncate">{{ category.name }}</p>
              <span class="mt-3 inline-flex w-full items-center justify-center gap-1 h-8 px-2.5 rounded-lg bg-ink-50 dark:bg-ink-800 group-hover:bg-brand-500 group-hover:text-white text-ink-700 dark:text-ink-200 text-[11.5px] font-bold transition">
                Paketləri gör
                <svg class="w-3 h-3 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </span>
            </div>
          </nuxt-link>
        </div>
        <div v-else class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-10 text-center">
          <div class="text-[15px] font-extrabold text-ink-900 dark:text-white">Nəticə tapılmadı</div>
          <p class="mt-1 text-[13px] text-ink-500 dark:text-ink-400">"{{ search }}" üzrə məhsul yoxdur.</p>
        </div>
      </section>
    </template>

    <!-- ABOUT (SEO) — common -->
    <section class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-5 md:p-7 mb-8">
      <h2 class="text-[18px] md:text-[20px] font-black tracking-tight text-ink-900 dark:text-white mb-3">{{ category.name }} haqqında</h2>
      <div class="relative overflow-hidden transition-[max-height] duration-500 text-[13.5px] leading-relaxed text-ink-700 dark:text-ink-200 prose-dd" :class="descOpen ? 'max-h-[3000px]' : 'max-h-[200px]'">
        <div v-if="category.description" v-html="category.description"></div>
        <div v-else class="space-y-3">
          <p>
            <strong class="text-ink-900 dark:text-white">{{ category.name }}</strong> — DolPh Game-də sərfəli qiymətə, dərhal və təhlükəsiz çatdırılma ilə təqdim olunur. İstədiyiniz məhsulu seçin, yerli ödəniş üsulu ilə ödəyin və hesabınız saniyələr içində aktivləşsin.
          </p>
          <p>Bütün məhsullar orijinaldır. 7/24 dəstək komandamız WhatsApp və canlı çat ilə hər zaman yanınızdadır.</p>
        </div>
        <div v-if="!descOpen" class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-ink-900 via-white/85 dark:via-ink-900/85 to-transparent pointer-events-none"></div>
      </div>
      <div class="mt-1">
        <button @click="descOpen = !descOpen" type="button" class="text-[13px] font-bold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1.5 transition">
          <span>{{ descOpen ? 'Yığışdır' : 'Hamısını oxu' }}</span>
          <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': descOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>
    </section>
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
