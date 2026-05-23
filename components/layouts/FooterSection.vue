<script setup lang="ts">
import { generalStore } from "~/stores/generalStore";
import { storeToRefs } from "pinia";

const { $api, $toast } = useNuxtApp();
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

const subscribe = () => {
  $toast?.success?.("Uğurla abunə oldunuz!");
};
const scrollTop = () => {
  if (process.client) window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <footer class="mt-16">
    <!-- ════════ 1) MARQUEE benefits strip ════════ -->
    <div class="marquee relative bg-gradient-to-r from-brand-500 via-brand-600 to-brand-500 anim-gradient text-white overflow-hidden border-y border-brand-700/30">
      <div class="marquee-track flex gap-10 py-3 whitespace-nowrap will-change-transform" style="width:max-content">
        <div v-for="n in 2" :key="n" class="flex items-center gap-10 text-xs md:text-sm font-semibold tracking-wide" :aria-hidden="n === 2 ? 'true' : undefined">
          <span class="flex items-center gap-2"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> 12 saniyədə çatdırılma</span>
          <span class="opacity-40">◆</span>
          <span class="flex items-center gap-2"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> 256-bit SSL şifrələmə</span>
          <span class="opacity-40">◆</span>
          <span class="flex items-center gap-2"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg> 4.9 / 5 reytinq</span>
          <span class="opacity-40">◆</span>
          <span class="flex items-center gap-2"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> 7/24 sifariş və çatdırılma</span>
          <span class="opacity-40">◆</span>
          <span class="flex items-center gap-2"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/></svg> 200+ rəqəmsal məhsul</span>
          <span class="opacity-40">◆</span>
          <span class="flex items-center gap-2"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg> Rəsmi MMC statusu</span>
          <span class="opacity-40">◆</span>
          <span class="flex items-center gap-2"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg> Qiymət zəmanəti</span>
          <span class="opacity-40">◆</span>
        </div>
      </div>
    </div>

    <!-- ════════ 2) WHY US strip ════════ -->
    <section class="bg-ink-50 dark:bg-ink-900/50 border-b border-ink-200 dark:border-ink-800 relative overflow-hidden">
      <div aria-hidden="true" class="pointer-events-none absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-500/5 blur-3xl anim-orb"></div>
      <div aria-hidden="true" class="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full bg-brand-500/5 blur-3xl anim-orb" style="animation-delay:-5s"></div>

      <div class="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 relative">
        <div class="text-center mb-10">
          <span class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-50 text-brand-600 border border-brand-100 shadow-soft">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-500 anim-live-pulse"></span>
            Oyunçudan oyunçuya
          </span>
          <h2 class="mt-4 text-2xl md:text-3xl lg:text-4xl font-extrabold text-ink-900 dark:text-white tracking-tight">
            Platformanı <span class="text-brand-500">oyunçulara</span> görə qurduq
          </h2>
          <p class="mt-3 text-sm md:text-base text-ink-500 dark:text-ink-400 max-w-xl mx-auto">
            Hər detal — sürət, təhlükəsizlik, qiymət və dəstək — oyunçu təcrübəsi üçün optimize edilib.
          </p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 1 -->
          <div class="group lift-card gaming-border bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-6 relative overflow-hidden">
            <span aria-hidden="true" class="streak" style="top:18%; left:0; width:60%;"></span>
            <span aria-hidden="true" class="streak" style="top:42%; left:0; width:40%; animation-delay:.6s;"></span>
            <span aria-hidden="true" class="streak" style="top:68%; left:0; width:55%; animation-delay:1.1s;"></span>
            <div class="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <span class="w-1 h-1 rounded-full bg-emerald-500 anim-live-pulse"></span>
              CANLI
            </div>
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-500 flex items-center justify-center mb-4 anim-bob shadow-soft anim-flash relative">
              <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <span aria-hidden="true" class="absolute inset-0 rounded-2xl anim-glow-breath bg-brand-500/20 blur-md -z-10"></span>
            </div>
            <h3 class="text-base font-bold text-ink-900 dark:text-white flex items-center gap-1.5">
              İldırım çatdırılma <span class="inline-block text-brand-500 anim-flash">⚡</span>
            </h3>
            <p class="mt-1.5 text-xs text-ink-500 dark:text-ink-400 leading-relaxed">
              Orta <span class="font-bold text-brand-500">12 saniyə</span> içində balansda. Gözləməyə son.
            </p>
            <div class="mt-4 pt-3 border-t border-ink-100 dark:border-ink-800 text-[11px] text-ink-500 dark:text-ink-400 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 anim-live-pulse"></span>
              Son 1 saatda <span class="font-bold text-ink-900 dark:text-white">247</span> əməliyyat
            </div>
          </div>

          <!-- 2 -->
          <div class="group lift-card gaming-border bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-6 relative overflow-hidden">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-500 flex items-center justify-center mb-4 anim-bob-slow shadow-soft">
              <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            </div>
            <h3 class="text-base font-bold text-ink-900 dark:text-white">Bank səviyyəli qorunma</h3>
            <p class="mt-1.5 text-xs text-ink-500 dark:text-ink-400 leading-relaxed">
              256-bit SSL şifrələmə, 3D Secure və rəsmi MMC zəmanəti ilə.
            </p>
            <div class="mt-4 pt-3 border-t border-ink-100 dark:border-ink-800 flex items-center gap-1.5">
              <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">SSL</span>
              <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">3D Secure</span>
              <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">PCI DSS</span>
            </div>
          </div>

          <!-- 3 -->
          <div class="group lift-card gaming-border bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-6 relative overflow-hidden">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-500 flex items-center justify-center mb-4 anim-bob shadow-soft" style="animation-delay:-.8s">
              <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>
            </div>
            <h3 class="text-base font-bold text-ink-900 dark:text-white">Çoxlu ödəniş üsulu</h3>
            <p class="mt-1.5 text-xs text-ink-500 dark:text-ink-400 leading-relaxed">
              Bank kartı, m10, MilliÖN, BirBank, eManat və digər <span class="font-bold text-brand-500">8+ üsul</span> — istədiyin kimi ödə.
            </p>
            <div class="mt-4 pt-3 border-t border-ink-100 dark:border-ink-800 flex items-center gap-1.5 flex-wrap">
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">VISA</span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">m10</span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">MilliÖN</span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">BirBank</span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400">+4</span>
            </div>
          </div>

          <!-- 4 -->
          <div class="group lift-card gaming-border bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-2xl p-6 relative overflow-hidden">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-500 flex items-center justify-center mb-4 anim-bob-slow shadow-soft" style="animation-delay:-1.2s">
              <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12a3 3 0 01-3-3V7a3 3 0 013-3h12a3 3 0 013 3v2a3 3 0 01-3 3"/><path d="M8 7h.01M12 7h.01M16 7h.01"/><path d="M3 15l4 6h10l4-6"/></svg>
            </div>
            <h3 class="text-base font-bold text-ink-900 dark:text-white">Oyunçu gözü ilə dəstək</h3>
            <p class="mt-1.5 text-xs text-ink-500 dark:text-ink-400 leading-relaxed">
              Komandamız özü oyunçudur — problemi yaxşı başa düşür, <span class="font-bold text-brand-500">tez həll edir</span>.
            </p>
            <div class="mt-4 pt-3 border-t border-ink-100 dark:border-ink-800 text-[11px] text-ink-500 dark:text-ink-400 flex items-center gap-1.5">
              <span class="relative w-2 h-2">
                <span class="absolute inset-0 rounded-full bg-emerald-500"></span>
                <span class="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60"></span>
              </span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">Onlayn</span>
              <span class="text-ink-300 dark:text-ink-700">•</span>
              Orta cavab <span class="font-bold text-ink-900 dark:text-white">~2 dəq</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ 3) MAIN FOOTER ════════ -->
    <section class="bg-ink-50 dark:bg-ink-900 text-ink-600 dark:text-ink-300 relative overflow-hidden border-t border-ink-200 dark:border-transparent">
      <div aria-hidden="true" class="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl"></div>
      <div aria-hidden="true" class="pointer-events-none absolute -bottom-32 right-0 w-[28rem] h-[28rem] rounded-full bg-brand-500/5 blur-3xl"></div>

      <div class="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-16 relative">
        <!-- Top: brand + CTA -->
        <div class="grid lg:grid-cols-12 gap-10 pb-10 border-b border-ink-200 dark:border-white/10">
          <!-- Brand column -->
          <div class="lg:col-span-5">
            <nuxt-link to="/" class="inline-flex items-center gap-2.5 group">
              <span class="w-11 h-11 rounded-xl bg-brand-500 flex items-center justify-center shadow-pop group-hover:scale-110 group-hover:rotate-6 transition-transform relative">
                <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3l12 9-12 9V3z"/></svg>
                <span aria-hidden="true" class="absolute inset-0 rounded-xl bg-brand-500 anim-glow-breath blur-md -z-10"></span>
              </span>
              <span class="text-ink-900 dark:text-white text-2xl font-extrabold tracking-tight">DolPh <span class="text-brand-500">Game</span></span>
            </nuxt-link>

            <p class="mt-5 text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
              <strong class="text-ink-900 dark:text-white font-semibold">DolPh Game</strong> — Azərbaycanda rəqəmsal oyun məhsulları platforması. <strong class="text-ink-800 dark:text-ink-200">PUBG UC, Valorant VP, Free Fire Elmas</strong> və 200+ məhsulu saniyələr içində, təhlükəsiz şəkildə çatdırırıq…
              <nuxt-link to="/pages/about" title="DolPh Game haqqında daha çox oxu" class="text-brand-500 hover:text-brand-600 dark:hover:text-brand-400 font-semibold whitespace-nowrap inline-flex items-center gap-0.5 transition group/more">
                daha çox
                <svg class="w-3 h-3 group-hover/more:translate-x-0.5 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </nuxt-link>
            </p>

            <!-- mini stats -->
            <div class="mt-6 grid grid-cols-4 gap-2">
              <div class="bg-white dark:bg-white/5 border border-ink-200 dark:border-white/10 rounded-xl p-2.5 text-center hover:border-brand-500/40 transition">
                <div class="text-ink-900 dark:text-white font-extrabold text-base">50K+</div>
                <div class="text-[10px] text-ink-500 uppercase tracking-wider mt-0.5">Müştəri</div>
              </div>
              <div class="bg-white dark:bg-white/5 border border-ink-200 dark:border-white/10 rounded-xl p-2.5 text-center hover:border-brand-500/40 transition">
                <div class="text-ink-900 dark:text-white font-extrabold text-base">200+</div>
                <div class="text-[10px] text-ink-500 uppercase tracking-wider mt-0.5">Məhsul</div>
              </div>
              <div class="bg-white dark:bg-white/5 border border-ink-200 dark:border-white/10 rounded-xl p-2.5 text-center hover:border-brand-500/40 transition">
                <div class="text-ink-900 dark:text-white font-extrabold text-base">4.9<span class="text-brand-500">★</span></div>
                <div class="text-[10px] text-ink-500 uppercase tracking-wider mt-0.5">Reytinq</div>
              </div>
              <div class="bg-white dark:bg-white/5 border border-ink-200 dark:border-white/10 rounded-xl p-2.5 text-center hover:border-brand-500/40 transition">
                <div class="text-ink-900 dark:text-white font-extrabold text-base">99%</div>
                <div class="text-[10px] text-ink-500 uppercase tracking-wider mt-0.5">Məmnunluq</div>
              </div>
            </div>

            <!-- trust chips -->
            <div class="mt-5 flex flex-wrap gap-2">
              <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-ink-200 dark:border-white/10 text-ink-700 dark:text-ink-300 hover:border-brand-500/40 transition">
                <svg class="w-3 h-3 text-emerald-500 dark:text-emerald-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
                Rəsmi MMC
              </span>
              <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-ink-200 dark:border-white/10 text-ink-700 dark:text-ink-300 hover:border-brand-500/40 transition">
                <svg class="w-3 h-3 text-emerald-500 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                256-bit SSL
              </span>
              <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                <span class="relative w-1.5 h-1.5">
                  <span class="absolute inset-0 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                  <span class="absolute inset-0 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping opacity-60"></span>
                </span>
                Hal-hazırda <span class="font-bold">1,247</span> aktiv
              </span>
            </div>

            <!-- newsletter -->
            <form @submit.prevent="subscribe" class="mt-6 max-w-md">
              <label class="text-xs font-semibold text-ink-900 dark:text-white mb-2 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-brand-500" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Yeni oyunlar, <span class="text-brand-500">kampaniyalar</span> və endirimlərdən ilk sən xəbər tut
              </label>
              <div class="flex gap-2">
                <div class="flex-1 relative">
                  <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 dark:text-ink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M4 4l8 8 8-8"/></svg>
                  <input required type="email" placeholder="sizin@email.com" class="w-full bg-white dark:bg-white/5 border border-ink-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-ink-900 dark:text-white placeholder:text-ink-400 dark:placeholder:text-ink-500 focus:outline-none focus:border-brand-500 focus:bg-ink-50 dark:focus:bg-white/10 transition" />
                </div>
                <button type="submit" class="ripple shine-wrap shrink-0 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition shadow-pop flex items-center gap-1.5">
                  Abunə ol
                  <svg class="w-4 h-4 gh-slide transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </button>
              </div>
            </form>
          </div>

          <!-- Quick action cards -->
          <div class="lg:col-span-7 grid sm:grid-cols-2 gap-3">
            <!-- Balans Yüklə -->
            <nuxt-link to="/payments/online" title="Balans yüklə" class="group lift-card relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-brand-500 to-brand-600 shadow-pop flex flex-col">
              <div class="flex items-start justify-between">
                <div>
                  <div class="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
                    <svg class="w-5 h-5 text-white gh-wiggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>
                  </div>
                  <div class="text-white font-bold text-base">Balans Yüklə</div>
                  <div class="text-white/80 text-xs mt-1">Ani və təhlükəsiz ödəniş</div>
                </div>
                <svg class="w-5 h-5 text-white/80 gh-slide transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </div>
              <div class="mt-auto pt-4 flex items-center gap-1.5 flex-wrap">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white">VISA</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white">m10</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white">BirBank</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white">+5</span>
              </div>
              <div aria-hidden="true" class="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10"></div>
            </nuxt-link>

            <!-- Bütün məhsullar -->
            <nuxt-link to="/games" title="Bütün məhsullar kataloqu" class="group lift-card relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-white/5 border border-ink-200 dark:border-white/10 hover:border-brand-500/40 dark:hover:border-white/20 flex flex-col">
              <div class="flex items-start justify-between">
                <div>
                  <div class="w-11 h-11 rounded-xl bg-brand-500/15 text-brand-500 flex items-center justify-center mb-3">
                    <svg class="w-5 h-5 gh-wiggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>
                  </div>
                  <div class="text-ink-900 dark:text-white font-bold text-base">Bütün məhsullar</div>
                  <div class="text-ink-500 dark:text-ink-400 text-xs mt-1">200+ rəqəmsal məhsul</div>
                </div>
                <svg class="w-5 h-5 text-ink-400 dark:text-ink-500 gh-slide transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </div>
              <div class="mt-auto pt-4 flex items-center gap-1.5 flex-wrap">
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-ink-50 dark:bg-white/5 border border-ink-200 dark:border-white/10 text-ink-700 dark:text-ink-300">Oyun valyutası</span>
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-ink-50 dark:bg-white/5 border border-ink-200 dark:border-white/10 text-ink-700 dark:text-ink-300">Hədiyyə kartı</span>
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-ink-50 dark:bg-white/5 border border-ink-200 dark:border-white/10 text-ink-700 dark:text-ink-300">Abunəlik</span>
              </div>
            </nuxt-link>

            <!-- WhatsApp -->
            <a :href="waLink" target="_blank" rel="noopener" title="WhatsApp ilə bizə yaz" class="group lift-card relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-pop flex flex-col">
              <div class="flex items-start justify-between">
                <div>
                  <div class="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
                    <svg class="w-5 h-5 text-white gh-wiggle" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.552 4.098 1.523 5.823L0 24l6.335-1.653A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm6.446 17.446c-.271.775-1.576 1.486-2.196 1.576-.566.083-1.274.12-2.055-.13-.474-.15-1.081-.352-1.865-.69-3.274-1.414-5.411-4.713-5.575-4.934-.162-.221-1.33-1.766-1.33-3.368 0-1.602.84-2.389 1.138-2.715.298-.326.65-.408.866-.408.217 0 .434.002.622.011.2.01.468-.076.733.56.271.652.922 2.254 1.003 2.415.071.2.119.431.024.692-.095.26-.143.421-.285.65-.143.229-.302.512-.432.688-.143.19-.291.396-.126.776.165.38.735 1.214 1.579 1.966 1.085.967 2 1.267 2.38 1.457.38.19.602.158.823-.095.221-.253.952-1.111 1.205-1.491.253-.38.507-.317.855-.19.349.127 2.215 1.044 2.594 1.234.38.19.633.285.728.444.095.158.095.922-.176 1.697z"/></svg>
                  </div>
                  <div class="text-white font-bold text-base">WhatsApp ilə əlaqə</div>
                  <div class="text-white/80 text-xs mt-1">Tez cavab, real operator</div>
                </div>
                <svg class="w-5 h-5 text-white/80 gh-slide transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </div>
              <div class="mt-auto pt-4 flex items-center gap-2 text-[11px] text-white/90">
                <span class="relative w-2 h-2">
                  <span class="absolute inset-0 rounded-full bg-white"></span>
                  <span class="absolute inset-0 rounded-full bg-white animate-ping opacity-60"></span>
                </span>
                <span class="font-bold">Onlayn</span>
                <span class="text-white/60">•</span>
                <span>Orta cavab ~2 dəq</span>
              </div>
              <div aria-hidden="true" class="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10"></div>
            </a>

            <!-- FAQ -->
            <nuxt-link to="/pages/faq" title="Tez-tez verilən suallar" class="group lift-card relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-white/5 border border-ink-200 dark:border-white/10 hover:border-sky-400/50 dark:hover:border-white/20 flex flex-col">
              <div class="flex items-start justify-between">
                <div>
                  <div class="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
                    <svg class="w-5 h-5 gh-wiggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  </div>
                  <div class="text-ink-900 dark:text-white font-bold text-base">Tez-tez verilən suallar</div>
                  <div class="text-ink-500 dark:text-ink-400 text-xs mt-1">Çatdırılma, ödəniş, təhlükəsizlik</div>
                </div>
                <svg class="w-5 h-5 text-ink-400 dark:text-ink-500 gh-slide transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </div>
              <div class="mt-auto pt-4 space-y-1.5">
                <div class="flex items-center gap-1.5 text-[11px] text-ink-600 dark:text-ink-400">
                  <svg class="w-3 h-3 text-sky-500 dark:text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                  Sifariş nə qədər gəlir?
                </div>
                <div class="flex items-center gap-1.5 text-[11px] text-ink-600 dark:text-ink-400">
                  <svg class="w-3 h-3 text-sky-500 dark:text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                  Ödəniş üsulları hansıdır?
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>

        <!-- Popular links (real categories) -->
        <div class="py-6 border-b border-ink-200 dark:border-white/10">
          <div class="flex flex-wrap items-center gap-x-4 gap-y-3">
            <div class="flex items-center gap-2 shrink-0">
              <span class="w-1 h-4 bg-brand-500 rounded-full"></span>
              <h3 class="text-ink-900 dark:text-white text-[11px] font-bold uppercase tracking-wider">Populyar</h3>
            </div>
            <div class="flex flex-wrap items-center gap-1.5 flex-1">
              <nuxt-link v-for="cat in categoryList.slice(0, 10)" :key="cat.id" :to="'/category/' + cat.slug" class="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white dark:bg-white/5 border border-ink-200 dark:border-white/10 text-ink-700 dark:text-ink-300 hover:border-brand-500 hover:text-brand-500 transition">{{ cat.name }}</nuxt-link>
              <nuxt-link to="/games" class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-500 hover:bg-brand-500 hover:text-white transition flex items-center gap-1">
                Hamısı
                <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </nuxt-link>
            </div>
          </div>
        </div>

        <!-- Nav + Contact -->
        <div class="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-ink-200 dark:border-white/10">
          <div>
            <h4 class="flex items-center gap-2 text-ink-900 dark:text-white text-[11px] font-bold uppercase tracking-wider mb-3">
              <svg class="w-3.5 h-3.5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Naviqasiya
            </h4>
            <div class="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <nuxt-link to="/pages/about" class="flex items-center gap-2 text-ink-600 dark:text-ink-400 hover:text-brand-500 transition">
                <svg class="w-3.5 h-3.5 text-brand-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
                <span>Haqqımızda</span>
              </nuxt-link>
              <nuxt-link to="/blogs" class="flex items-center gap-2 text-ink-600 dark:text-ink-400 hover:text-brand-500 transition">
                <svg class="w-3.5 h-3.5 text-brand-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h12l4 4v12H4z"/><path d="M8 11h8M8 15h6"/></svg>
                <span>Bloq</span>
              </nuxt-link>
              <nuxt-link to="/pages/faq" class="flex items-center gap-2 text-ink-600 dark:text-ink-400 hover:text-brand-500 transition">
                <svg class="w-3.5 h-3.5 text-brand-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 4M12 17h.01"/></svg>
                <span>FAQ</span>
              </nuxt-link>
              <nuxt-link to="/games" class="flex items-center gap-2 text-ink-600 dark:text-ink-400 hover:text-brand-500 transition">
                <svg class="w-3.5 h-3.5 text-brand-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 4L4 20"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/></svg>
                <span>Kampaniyalar</span>
              </nuxt-link>
            </div>
          </div>

          <div>
            <h4 class="flex items-center gap-2 text-ink-900 dark:text-white text-[11px] font-bold uppercase tracking-wider mb-3">
              <svg class="w-3.5 h-3.5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16v16H4z"/><path d="M4 4l8 8 8-8"/></svg>
              Əlaqə
            </h4>
            <div class="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <a :href="'mailto:' + (data?.email || 'info@dolphgame.com')" class="flex items-center gap-2 text-ink-600 dark:text-ink-400 hover:text-brand-500 transition group">
                <svg class="w-3.5 h-3.5 text-brand-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16v16H4z"/><path d="M4 4l8 8 8-8"/></svg>
                <span class="truncate">{{ data?.email || 'info@dolphgame.com' }}</span>
              </a>
              <a :href="'tel:' + (data?.phone || '+994503345616')" class="flex items-center gap-2 text-ink-600 dark:text-ink-400 hover:text-brand-500 transition">
                <svg class="w-3.5 h-3.5 text-brand-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                <span>{{ data?.phone || '050 334 56 16' }}</span>
              </a>
              <a :href="waLink" target="_blank" rel="noopener" class="flex items-center gap-2 text-ink-600 dark:text-ink-400 hover:text-emerald-500 transition">
                <svg class="w-3.5 h-3.5 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.552 4.098 1.523 5.823L0 24l6.335-1.653A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                <span>WhatsApp dəstək</span>
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 anim-live-pulse"></span>
              </a>
              <div class="flex items-center gap-2 text-ink-600 dark:text-ink-400">
                <svg class="w-3.5 h-3.5 text-brand-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <address class="not-italic m-0 leading-none">{{ data?.address || 'Bakı, Azərbaycan' }}</address>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment + social -->
        <div class="py-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-ink-200 dark:border-white/10">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[10px] font-bold text-ink-500 dark:text-ink-400 uppercase tracking-wider mr-1">Ödəniş</span>
            <div class="shine-wrap h-7 px-2.5 rounded-md bg-white border border-ink-200 dark:border-transparent flex items-center font-bold text-[11px] tracking-wider text-[#1A1F71] hover:scale-105 transition">VISA</div>
            <div class="shine-wrap h-7 px-2.5 rounded-md bg-white border border-ink-200 dark:border-transparent flex items-center gap-0.5 hover:scale-105 transition">
              <span class="w-3 h-3 rounded-full bg-[#EB001B]"></span>
              <span class="w-3 h-3 rounded-full bg-[#F79E1B] -ml-1.5 mix-blend-multiply"></span>
            </div>
            <div class="shine-wrap h-7 px-2.5 rounded-md bg-white border border-ink-200 dark:border-transparent flex items-center font-bold text-[11px] text-[#00B050] hover:scale-105 transition">m10</div>
            <div class="shine-wrap h-7 px-2.5 rounded-md bg-white border border-ink-200 dark:border-transparent flex items-center font-bold text-[10px] text-[#E30613] hover:scale-105 transition">MilliÖN</div>
            <div class="shine-wrap h-7 px-2.5 rounded-md bg-white border border-ink-200 dark:border-transparent flex items-center font-bold text-[10px] text-[#E4002B] hover:scale-105 transition">BirBank</div>
            <div class="shine-wrap h-7 px-2.5 rounded-md bg-white border border-ink-200 dark:border-transparent flex items-center font-bold text-[10px] text-ink-900 hover:scale-105 transition">eManat</div>
            <div class="shine-wrap h-7 px-2.5 rounded-md bg-white border border-ink-200 dark:border-transparent flex items-center font-bold text-[10px] text-[#0066B2] hover:scale-105 transition">Expresspay</div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold text-ink-500 dark:text-ink-400 uppercase tracking-wider mr-1">İzlə</span>
            <div class="flex items-center gap-1.5">
              <a :href="data?.instagram || '#'" target="_blank" rel="noopener" aria-label="Instagram" class="group w-8 h-8 rounded-lg bg-white dark:bg-white/5 hover:bg-brand-500 dark:hover:bg-brand-500 border border-ink-200 dark:border-white/10 flex items-center justify-center transition hover:-translate-y-0.5 hover:scale-110">
                <svg class="w-4 h-4 text-ink-600 dark:text-ink-300 group-hover:text-white transition" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.42.56.21.96.47 1.38.89.42.42.68.82.89 1.38.17.42.37 1.06.42 2.23.06 1.26.07 1.64.07 4.85s-.01 3.6-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.21.56-.47.96-.89 1.38-.42.42-.82.68-1.38.89-.42.17-1.06.37-2.23.42-1.26.06-1.64.07-4.85.07s-3.6-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 01-1.38-.89 3.7 3.7 0 01-.89-1.38c-.17-.42-.37-1.06-.42-2.23C2.21 15.6 2.2 15.22 2.2 12s.01-3.6.07-4.85c.05-1.17.25-1.8.42-2.23.21-.56.47-.96.89-1.38.42-.42.82-.68 1.38-.89.42-.17 1.06-.37 2.23-.42C8.4 2.21 8.78 2.2 12 2.2zm0 5.05A4.95 4.95 0 1112 17a4.95 4.95 0 010-9.9zm0 1.8a3.15 3.15 0 100 6.3 3.15 3.15 0 000-6.3zm5.15-2.04a1.15 1.15 0 110 2.3 1.15 1.15 0 010-2.3z"/></svg>
              </a>
              <a href="#" aria-label="TikTok" class="group w-8 h-8 rounded-lg bg-white dark:bg-white/5 hover:bg-brand-500 dark:hover:bg-brand-500 border border-ink-200 dark:border-white/10 flex items-center justify-center transition hover:-translate-y-0.5 hover:scale-110">
                <svg class="w-4 h-4 text-ink-600 dark:text-ink-300 group-hover:text-white transition" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V8.7a8.16 8.16 0 004.77 1.52V6.77a4.84 4.84 0 01-1.84-.08z"/></svg>
              </a>
              <a href="#" aria-label="X" class="group w-8 h-8 rounded-lg bg-white dark:bg-white/5 hover:bg-brand-500 dark:hover:bg-brand-500 border border-ink-200 dark:border-white/10 flex items-center justify-center transition hover:-translate-y-0.5 hover:scale-110">
                <svg class="w-3.5 h-3.5 text-ink-600 dark:text-ink-300 group-hover:text-white transition" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a :href="data?.youtube || '#'" target="_blank" rel="noopener" aria-label="YouTube" class="group w-8 h-8 rounded-lg bg-white dark:bg-white/5 hover:bg-brand-500 dark:hover:bg-brand-500 border border-ink-200 dark:border-white/10 flex items-center justify-center transition hover:-translate-y-0.5 hover:scale-110">
                <svg class="w-4 h-4 text-ink-600 dark:text-ink-300 group-hover:text-white transition" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 00.5 6.2 31.2 31.2 0 000 12a31.2 31.2 0 00.5 5.8 3 3 0 002.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 002.1-2.1A31.2 31.2 0 0024 12a31.2 31.2 0 00-.5-5.8zM9.6 15.6V8.4l6.2 3.6z"/></svg>
              </a>
              <a :href="data?.facebook || '#'" target="_blank" rel="noopener" aria-label="Facebook" class="group w-8 h-8 rounded-lg bg-white dark:bg-white/5 hover:bg-brand-500 dark:hover:bg-brand-500 border border-ink-200 dark:border-white/10 flex items-center justify-center transition hover:-translate-y-0.5 hover:scale-110">
                <svg class="w-4 h-4 text-ink-600 dark:text-ink-300 group-hover:text-white transition" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12a12 12 0 10-13.88 11.85v-8.38h-3.05V12h3.05V9.36c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.88V12h3.33l-.53 3.47h-2.8v8.38A12 12 0 0024 12z"/></svg>
              </a>
              <a href="#" aria-label="Discord" class="group w-8 h-8 rounded-lg bg-white dark:bg-white/5 hover:bg-brand-500 dark:hover:bg-brand-500 border border-ink-200 dark:border-white/10 flex items-center justify-center transition hover:-translate-y-0.5 hover:scale-110">
                <svg class="w-4 h-4 text-ink-600 dark:text-ink-300 group-hover:text-white transition" viewBox="0 0 24 24" fill="currentColor"><path d="M20.32 4.37A19.8 19.8 0 0015.68 3l-.24.46a18 18 0 00-6.89 0L8.3 3a19.8 19.8 0 00-4.63 1.37C.5 9.1-.33 13.7.08 18.23a19.92 19.92 0 006.06 3.05c.48-.66.92-1.37 1.29-2.11a13 13 0 01-2.03-.97c.17-.12.33-.25.49-.38a14.22 14.22 0 0012.2 0c.16.13.32.26.49.38-.65.38-1.33.71-2.03.97.38.74.81 1.45 1.29 2.11a19.92 19.92 0 006.06-3.05c.49-5.25-.84-9.82-3.59-13.86zM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.4 0-1.33.96-2.41 2.16-2.41s2.18 1.08 2.16 2.4c0 1.33-.96 2.41-2.16 2.41zm7.96 0c-1.18 0-2.16-1.08-2.16-2.4 0-1.33.96-2.41 2.16-2.41s2.18 1.08 2.16 2.4c0 1.33-.96 2.41-2.16 2.41z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Bottom legal -->
        <div class="pt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[11px]">
          <div class="flex flex-wrap items-center gap-x-3 text-ink-500">
            <span>© {{ year }} <span class="text-ink-900 dark:text-white font-semibold">DolPh Game MMC</span></span>
            <span class="text-ink-300 dark:text-ink-700">•</span>
            <span class="inline-flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 anim-live-pulse"></span>
              {{ data?.address || 'Bakı, Azərbaycan' }}
            </span>
          </div>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 justify-end">
            <nuxt-link to="/pages/faq" class="text-ink-500 hover:text-brand-500 transition">Yardım</nuxt-link>
            <span class="text-ink-300 dark:text-ink-700">•</span>
            <nuxt-link to="/pages/contact" class="text-ink-500 hover:text-brand-500 transition">Şikayət</nuxt-link>
            <span class="text-ink-300 dark:text-ink-700">•</span>
            <nuxt-link to="/pages/privacy" class="text-ink-500 hover:text-brand-500 transition">Müqavilə</nuxt-link>
            <span class="text-ink-300 dark:text-ink-700">•</span>
            <nuxt-link to="/pages/privacy" class="text-ink-500 hover:text-brand-500 transition">Qaydalar</nuxt-link>
            <span class="text-ink-300 dark:text-ink-700">•</span>
            <nuxt-link to="/pages/privacy" class="text-ink-500 hover:text-brand-500 transition">Məxfilik</nuxt-link>
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
