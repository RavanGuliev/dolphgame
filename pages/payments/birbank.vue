<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { authStore } from "#imports";
import { loadingStore } from "~/stores/loadingStore";
import PaymentSidebar from "~/components/payments/paymentSidebar.vue";

const { $api, $toast } = useNuxtApp();
const router = useRouter();
const userStore = authStore();
const loading = loadingStore();
const { setLoading } = loading;
const amount = ref("");
const isLoading = ref(false);
const { user } = userStore;

definePageMeta({ middleware: "auth" });
if (user?.level !== "normal") router.push("/payments");
useHead({ title: "Birbank QR ilə Balans Artırma" });

const commissionRate = 0.015;
const commission = computed(() => {
  const a = Number(amount.value) || 0;
  const total = Math.ceil((a / (1 - commissionRate)) * 100) / 100;
  return { amount: total - a, balance: a, total, label: "1,5%" };
});

const submitPayment = () => {
  if (!amount.value || isNaN(Number(amount.value)) || Number(amount.value) <= 0) {
    $toast.error("Zəhmət olmasa düzgün məbləğ daxil edin");
    return;
  }
  setLoading(true);
  isLoading.value = true;
  $api
    .post("user/payment/balance", { amount: amount.value, payment_method: "wallet", wallet_id: "10" }, userStore.headers)
    .then((res) => {
      if (res.data) window.location.href = res.data;
      else { $toast.success("Ödəniş tələbi göndərildi"); router.push("/user/dashboard/payments"); }
    })
    .catch((e) => $toast.error(e.response?.data?.message || "Ödəniş zamanı xəta baş verdi"))
    .finally(() => { setLoading(false); isLoading.value = false; });
};

const quicks = [5, 10, 25, 50, 100];
const setAmount = (v: number) => (amount.value = String(v));
const stepAmount = (n: number) => (amount.value = String(Math.max(1, (Number(amount.value) || 0) + n)));
const fmt = (n: any) => Number(n || 0).toFixed(2);
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

      <div data-pay-content>
        <div class="bg-white dark:bg-ink-800 rounded-2xl p-6 md:p-7 shadow-card border border-ink-200 dark:border-ink-700">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-500/15 grid place-items-center text-rose-500 font-black">B</span>
              <div>
                <h2 class="text-lg md:text-xl font-extrabold tracking-tight text-ink-900 dark:text-white">Birbank QR ilə ödəniş</h2>
                <p class="text-xs text-ink-500 dark:text-ink-400 mt-0.5 flex items-center gap-1.5">
                  <span class="relative flex w-2 h-2"><span class="absolute inset-0 rounded-full bg-emerald-400 anim-live-pulse"></span><span class="relative rounded-full w-2 h-2 bg-emerald-500"></span></span>
                  QR ilə ani balans yüklənməsi
                </p>
              </div>
            </div>
            <span class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">Komissiya {{ commission.label }}</span>
          </div>

          <div class="mt-6 rounded-2xl border-2 border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-900/40 p-4 md:p-5 glow-focus">
            <div class="text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-3">Yükləmək istədiyin məbləği daxil et</div>
            <div class="flex items-center rounded-xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus-within:border-brand-500 transition">
              <button @click="stepAmount(-1)" type="button" class="ripple w-12 h-14 text-2xl text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-l-xl active:scale-90 transition">−</button>
              <div class="flex-1 flex items-baseline justify-center gap-1.5">
                <input v-model="amount" type="number" min="1" placeholder="0" class="w-32 bg-transparent outline-none text-center text-4xl font-extrabold tracking-tight text-ink-900 dark:text-white placeholder:text-ink-300 dark:placeholder:text-ink-600"/>
                <span class="text-sm font-bold text-ink-500 dark:text-ink-400">AZN</span>
              </div>
              <button @click="stepAmount(1)" type="button" class="ripple w-12 h-14 text-2xl text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-r-xl active:scale-90 transition">+</button>
            </div>
            <div class="mt-3 grid grid-cols-5 gap-2">
              <button v-for="q in quicks" :key="q" @click="setAmount(q)" type="button" class="h-10 rounded-lg border text-sm font-bold transition active:scale-95 hover:-translate-y-0.5" :class="Number(amount) === q ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-ink-800 border-ink-200 dark:border-ink-700 text-ink-700 dark:text-ink-200 hover:bg-brand-500 hover:text-white hover:border-brand-500'">{{ q }}</button>
            </div>
          </div>

          <div class="mt-5 rounded-2xl bg-ink-50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-700 p-4 md:p-5 space-y-3">
            <div class="flex items-center justify-between text-sm"><span class="text-ink-500 dark:text-ink-400">Balansa yüklənəcək</span><span class="font-bold text-ink-900 dark:text-white">{{ fmt(commission.balance) }} AZN</span></div>
            <div class="flex items-center justify-between text-sm"><span class="text-ink-500 dark:text-ink-400">Komissiya ({{ commission.label }})</span><span class="text-brand-500 font-semibold">+{{ fmt(commission.amount) }} AZN</span></div>
            <div class="pt-3 border-t border-ink-200 dark:border-ink-700 flex items-baseline justify-between">
              <span class="text-sm font-bold uppercase tracking-wider text-ink-700 dark:text-ink-200">Yekun məbləğ</span>
              <div class="flex items-baseline gap-1"><span class="text-3xl md:text-4xl font-black text-brand-500 tracking-tight leading-none">{{ fmt(commission.total) }}</span><span class="text-sm font-bold text-brand-500">AZN</span></div>
            </div>
          </div>

          <button @click="submitPayment" :disabled="isLoading" type="button" class="ripple shine-wrap w-full mt-5 h-14 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 active:scale-[.99] text-white font-extrabold text-base shadow-pop transition flex items-center justify-center gap-2 disabled:opacity-60">
            <span>{{ isLoading ? 'Gözləyin...' : 'Ödəniş et' }}</span>
            <svg v-if="!isLoading" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
          <div class="mt-4 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Secure 256-bit SSL Payment
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
