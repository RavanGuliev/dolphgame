<script setup lang="ts">
import { ref, computed } from "vue";
import { authStore } from "#imports";
import PaymentSidebar from "~/components/payments/paymentSidebar.vue";

const userStore = authStore();
const { user } = userStore;
const { $toast } = useNuxtApp();

definePageMeta({ middleware: "auth" });
useHead({ title: "eManat ilə Balans Artırma" });

const customerCode = computed(() => (user as any)?.id ?? "—");
const copyCustomerId = () => {
  if ((user as any)?.id) {
    navigator.clipboard.writeText((user as any).id.toString())
      .then(() => $toast.success("Müştəri nömrəsi kopyalandı!"))
      .catch(() => $toast.error("Kopyalama zamanı xəta baş verdi"));
  }
};

const amount = ref(10);
const fmt = (n: any) => Number(n || 0).toFixed(2);
const fee = computed(() => (Number(amount.value) || 0) * 0.03);
const result = computed(() => (Number(amount.value) || 0) - fee.value);
const quicks = [5, 10, 25, 50, 100];

const steps = [
  { t: "Terminala yaxınlaşın", d: "Sizə ən yaxın eManat terminalını tapın." },
  { t: "Əyləncə bölməsini seçin", d: "Terminal ekranında «Əyləncə» bölməsinə keçin." },
  { t: "dolphgame.com seçin", d: "Siyahıdan «dolphgame.com» xidmətini tapın." },
  { t: "Müştəri kodunu daxil edin", d: "Müştəri kodu xanasına nömrənizi yazın." },
  { t: "Ödənişi tamamlayın", d: "Balansınız 3% komissiya çıxılmaqla dərhal artırılacaq." },
];
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6">
    <div class="rounded-2xl bg-brand-500 anim-gradient text-white px-5 py-4 font-bold text-base shadow-pop mb-6 flex items-center gap-3" style="background-image: linear-gradient(90deg, #FF4800, #FF6A2E, #FF4800);">
      <span class="w-9 h-9 rounded-xl bg-white/20 backdrop-blur grid place-items-center shrink-0">
        <svg class="w-5 h-5 gh-wiggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
      </span>
      <span class="flex-1">Ödəniş üsulunu seçin</span>
      <span class="hidden md:flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
        <span class="relative flex w-2 h-2"><span class="absolute inset-0 rounded-full bg-emerald-300 anim-live-pulse"></span><span class="relative w-2 h-2 rounded-full bg-emerald-400"></span></span>
        Ödənişlər 7/24 aktivdir
      </span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      <payment-sidebar />

      <div data-pay-content class="space-y-6">
        <div class="bg-white dark:bg-ink-800 rounded-2xl p-6 md:p-7 shadow-card border border-ink-200 dark:border-ink-700">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/15 grid place-items-center text-blue-600 dark:text-blue-400 font-black text-[12px]">eM</span>
              <div>
                <h2 class="text-lg md:text-xl font-extrabold tracking-tight text-ink-900 dark:text-white">eManat Terminalı ilə ödəniş</h2>
                <p class="text-xs text-ink-500 dark:text-ink-400 mt-0.5 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 anim-live-pulse"></span>
                  7/24 · Ödəniş dərhal balansa düşür
                </p>
              </div>
            </div>
            <span class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400">Komissiya 3%</span>
          </div>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-px bg-ink-200 dark:bg-ink-700 rounded-2xl overflow-hidden border border-ink-200 dark:border-ink-700">
            <div class="bg-white dark:bg-ink-800 p-5 md:p-6 flex flex-col">
              <div class="text-[11px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">Ödəniş məlumatları</div>
              <dl class="mt-5 space-y-5">
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 shrink-0 rounded-full border border-ink-200 dark:border-ink-700 grid place-items-center text-[11px] font-bold text-ink-400">1</div>
                  <div><dt class="text-[11px] text-ink-500 dark:text-ink-400">Xidmət adı</dt><dd class="text-sm font-semibold mt-0.5 text-ink-900 dark:text-white">DolPh Game</dd></div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 shrink-0 rounded-full border border-ink-200 dark:border-ink-700 grid place-items-center text-[11px] font-bold text-ink-400">2</div>
                  <div><dt class="text-[11px] text-ink-500 dark:text-ink-400">Terminal bölməsi</dt><dd class="text-sm font-semibold mt-0.5 text-ink-900 dark:text-white">Əyləncə → dolphgame.com</dd></div>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 shrink-0 rounded-full bg-brand-500 grid place-items-center text-[11px] font-bold text-white">3</div>
                  <div class="flex-1 min-w-0">
                    <dt class="text-[11px] text-ink-500 dark:text-ink-400">Müştəri kodu</dt>
                    <dd class="mt-2 relative flex items-center justify-between gap-3 rounded-xl border-2 border-dashed border-brand-500/50 bg-brand-50/30 dark:bg-brand-500/5 px-4 py-4">
                      <span class="text-[28px] md:text-[32px] font-black text-brand-500 leading-none tracking-tight">{{ customerCode }}</span>
                      <button @click="copyCustomerId" type="button" class="ripple shrink-0 h-9 px-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-pop transition">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                        Kopyala
                      </button>
                    </dd>
                  </div>
                </div>
              </dl>
              <p class="mt-auto pt-5 text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">Kodu terminalın <strong class="text-ink-700 dark:text-ink-200">«Müştəri kodu»</strong> xanasına daxil edərək ödənişi tamamlayın.</p>
            </div>

            <div class="bg-white dark:bg-ink-800 p-5 md:p-6 flex flex-col">
              <div class="flex items-center justify-between">
                <div class="text-[11px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">Məbləğ</div>
                <span class="text-[10px] font-semibold text-ink-400">3% komissiya</span>
              </div>
              <div class="mt-5 flex items-center rounded-xl border border-ink-200 dark:border-ink-700 focus-within:border-brand-500 glow-focus transition">
                <button @click="amount = Math.max(1, Number(amount) - 1)" type="button" class="ripple w-11 h-12 text-xl text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-l-xl active:scale-90 transition">−</button>
                <div class="flex-1 flex items-baseline justify-center gap-1.5 py-2">
                  <input v-model="amount" type="number" min="1" class="w-24 bg-transparent outline-none text-center text-3xl font-black tracking-tight text-ink-900 dark:text-white"/>
                  <span class="text-xs font-bold text-ink-500 dark:text-ink-400">AZN</span>
                </div>
                <button @click="amount = Number(amount) + 1" type="button" class="ripple w-11 h-12 text-xl text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-r-xl active:scale-90 transition">+</button>
              </div>
              <div class="mt-3 grid grid-cols-5 gap-1.5">
                <button v-for="q in quicks" :key="q" @click="amount = q" type="button" class="h-9 rounded-lg text-[12px] font-semibold border transition active:scale-95 hover:-translate-y-0.5" :class="Number(amount) === q ? 'bg-brand-500 text-white border-brand-500' : 'text-ink-700 dark:text-ink-300 border-ink-200 dark:border-ink-700 hover:bg-brand-500 hover:text-white hover:border-brand-500'">{{ q }}</button>
              </div>
              <dl class="mt-5 space-y-3 text-sm">
                <div class="flex items-center justify-between"><dt class="text-ink-500 dark:text-ink-400">Ödəniş məbləği</dt><dd class="font-semibold text-ink-900 dark:text-white">{{ fmt(amount) }} AZN</dd></div>
                <div class="flex items-center justify-between"><dt class="text-ink-500 dark:text-ink-400">Komissiya (3%)</dt><dd class="text-brand-500 font-semibold">−{{ fmt(fee) }} AZN</dd></div>
              </dl>
              <div class="mt-4 pt-4 border-t border-ink-200 dark:border-ink-700 flex items-baseline justify-between">
                <span class="text-sm font-bold uppercase tracking-wider text-ink-700 dark:text-ink-200">Balansa düşəcək</span>
                <div class="flex items-baseline gap-1"><span class="text-3xl font-black text-brand-500 tracking-tight leading-none">{{ fmt(result) }}</span><span class="text-sm font-bold text-brand-500">AZN</span></div>
              </div>
              <p class="mt-auto pt-5 text-[11px] text-ink-500 dark:text-ink-400 leading-relaxed">Ödənişlər <strong class="text-ink-700 dark:text-ink-200">7/24 dərhal</strong> balansınıza düşür.</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-card border border-ink-200 dark:border-ink-700">
          <div class="flex items-center gap-3 mb-5">
            <span class="w-1 h-6 bg-brand-500 rounded-full"></span>
            <h3 class="text-lg md:text-xl font-bold text-ink-900 dark:text-white">Necə ödəniş edilir?</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="(s, i) in steps" :key="i" class="rounded-xl bg-ink-50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-700 p-4">
              <div class="w-9 h-9 rounded-lg bg-brand-500 text-white grid place-items-center font-black text-sm">{{ i + 1 }}</div>
              <h4 class="mt-3 text-[14px] font-extrabold text-ink-900 dark:text-white">{{ s.t }}</h4>
              <p class="mt-1 text-[12.5px] text-ink-500 dark:text-ink-400 leading-relaxed">{{ s.d }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
</style>
