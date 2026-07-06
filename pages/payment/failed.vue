<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { generalStore } from "~/stores/generalStore";
import { storeToRefs } from "pinia";


const router = useRouter();
const route = useRoute();
const { setLoading } = loadingStore;
const general = generalStore();
const { data } = storeToRefs(general);

const waLink = computed(() => {
  const p = (data.value?.phone || "994503345616").replace(/[^0-9]/g, "");
  return "https://wa.me/" + p;
});

const transactionDetails = ref({
  amount: 0,
  date: '',
  reference: '',
  errorCode: '',
  errorMessage: 'Ödəniş zamanı xəta baş verdi'
});

const isLoading = ref(true);

onMounted(async () => {
  setLoading(true);

  try {
    // Get transaction details from URL parameters
    const amount = route.query.amount || 0;
    const reference = route.query.reference || '';
    const errorCode = route.query.error_code || '';
    const errorMessage = route.query.error_message || 'Ödəniş zamanı xəta baş verdi';

    transactionDetails.value = {
      amount: Number(amount),
      date: new Date().toLocaleString(),
      reference: String(reference),
      errorCode: String(errorCode),
      errorMessage: String(errorMessage)
    };

  } catch (error) {
    console.error('Error processing payment failure:', error);
  } finally {
    isLoading.value = false;
    setLoading(false);
  }
});

const tryAgain = () => {
  router.push('/payments/online');
};

const contactSupport = () => {
  router.push('/pages/contact');
};

const goToDashboard = () => {
  router.push('/user/dashboard/payments');
};
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
    <div class="max-w-xl mx-auto">

      <!-- Result card -->
      <section class="relative rounded-3xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 shadow-soft overflow-hidden">

        <span aria-hidden="true" class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-500"></span>

        <div class="p-6 md:p-8">
          <!-- Icon + headline -->
          <div class="text-center mb-5">
            <div class="relative inline-block mb-4">
              <div aria-hidden="true" class="absolute inset-0 -m-3 rounded-full bg-rose-500/15 blur-2xl"></div>
              <div class="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 grid place-items-center shadow-pop ring-4 ring-white dark:ring-ink-900">
                <svg class="w-10 h-10 md:w-12 md:h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </div>
            </div>
            <h1 class="text-[22px] md:text-[26px] font-black tracking-tight text-ink-900 dark:text-white leading-tight">Ödəniş uğursuz oldu</h1>
            <p class="mt-2 text-[13.5px] text-ink-500 dark:text-ink-400 leading-relaxed max-w-md mx-auto">Təəssüf ki, ödənişiniz tamamlanmadı. Zəhmət olmasa yenidən cəhd edin və ya dəstək xidməti ilə əlaqə saxlayın.</p>
          </div>

          <!-- Error alert -->
          <div class="rounded-xl bg-rose-50 dark:bg-rose-500/10 ring-1 ring-rose-500/30 p-4 flex items-center gap-3 mb-5">
            <span class="shrink-0 w-9 h-9 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 grid place-items-center">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
            <div class="min-w-0 flex-1">
              <div class="text-[13px] font-black text-rose-700 dark:text-rose-300">{{ transactionDetails.errorMessage }}</div>
              <div v-if="transactionDetails.errorCode" class="text-[11.5px] text-rose-600/80 dark:text-rose-400/80 mt-0.5">Kod: <span class="font-mono font-bold">{{ transactionDetails.errorCode }}</span></div>
            </div>
          </div>

          <!-- Transaction info -->
          <div v-if="transactionDetails.reference || transactionDetails.amount" class="rounded-xl bg-ink-50 dark:bg-ink-800/60 ring-1 ring-ink-200 dark:ring-ink-700 p-4 mb-5">
            <div class="grid grid-cols-2 gap-3">
              <div v-if="transactionDetails.reference">
                <div class="text-[10.5px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400">Tranzaksiya №</div>
                <div class="mt-0.5 text-[12.5px] font-black text-ink-900 dark:text-white tabular-nums font-mono">{{ transactionDetails.reference }}</div>
              </div>
              <div v-if="transactionDetails.amount" class="text-right">
                <div class="text-[10.5px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400">Məbləğ</div>
                <div class="mt-0.5 text-[12.5px] font-black text-ink-900 dark:text-white tabular-nums">{{ transactionDetails.amount }} AZN</div>
              </div>
              <div>
                <div class="text-[10.5px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400">Tarix</div>
                <div class="mt-0.5 text-[12px] text-ink-700 dark:text-ink-200 tabular-nums">{{ transactionDetails.date }}</div>
              </div>
            </div>
          </div>

          <!-- Possible reasons -->
          <div class="rounded-xl bg-ink-50 dark:bg-ink-800/60 ring-1 ring-ink-200 dark:ring-ink-700 p-5 mb-5">
            <div class="flex items-center gap-2 mb-3">
              <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <h3 class="text-[13.5px] font-black text-ink-900 dark:text-white">Mümkün səbəblər</h3>
            </div>
            <ul class="space-y-2.5">
              <li class="flex items-start gap-2.5 text-[12.5px] text-ink-700 dark:text-ink-200 leading-snug">
                <span class="shrink-0 w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 grid place-items-center mt-0.5 text-[10px] font-black">1</span>
                Kartınızda kifayət qədər vəsait olmaya bilər
              </li>
              <li class="flex items-start gap-2.5 text-[12.5px] text-ink-700 dark:text-ink-200 leading-snug">
                <span class="shrink-0 w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 grid place-items-center mt-0.5 text-[10px] font-black">2</span>
                Kart məlumatları səhv daxil edilmiş ola bilər
              </li>
              <li class="flex items-start gap-2.5 text-[12.5px] text-ink-700 dark:text-ink-200 leading-snug">
                <span class="shrink-0 w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 grid place-items-center mt-0.5 text-[10px] font-black">3</span>
                Bankınız tərəfindən əməliyyat rədd edilmiş ola bilər
              </li>
              <li class="flex items-start gap-2.5 text-[12.5px] text-ink-700 dark:text-ink-200 leading-snug">
                <span class="shrink-0 w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 grid place-items-center mt-0.5 text-[10px] font-black">4</span>
                İnternet bağlantısında problem yaranmış ola bilər
              </li>
              <li class="flex items-start gap-2.5 text-[12.5px] text-ink-700 dark:text-ink-200 leading-snug">
                <span class="shrink-0 w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 grid place-items-center mt-0.5 text-[10px] font-black">5</span>
                Ödəniş sistemi müvəqqəti olaraq işləməyə bilər
              </li>
            </ul>
          </div>

          <!-- Note -->
          <div class="rounded-xl bg-emerald-50/60 dark:bg-emerald-500/5 ring-1 ring-emerald-500/20 p-3 flex items-center gap-2 mb-5">
            <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <p class="text-[11.5px] text-emerald-800 dark:text-emerald-300 leading-snug"><strong class="font-black">Əgər hesabınızdan pul çıxılıbsa, lakin balansınız artmayıbsa, narahat olmayın.</strong> Belə hallarda vəsait 24 saat ərzində geri qaytarılır.</p>
          </div>

          <!-- Action buttons -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button type="button" @click="tryAgain" class="inline-flex items-center justify-center gap-2 h-12 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-black text-[13.5px] transition shadow-pop active:scale-95">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15A9 9 0 1116.27 5.27L23 10"/></svg>
              Yenidən cəhd et
            </button>
            <button type="button" @click="contactSupport" class="inline-flex items-center justify-center gap-2 h-12 px-4 rounded-xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-700 hover:ring-brand-500 hover:text-brand-500 text-ink-700 dark:text-ink-200 font-bold text-[13px] transition">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1v-7h3v5zM3 19a2 2 0 002 2h1v-7H3v5z"/></svg>
              Dəstək xidməti
            </button>
          </div>

          <button type="button" @click="goToDashboard" class="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-ink-50 dark:bg-ink-800 hover:bg-ink-100 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-200 font-bold text-[12px] transition">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Hesabıma get
          </button>
        </div>
      </section>

      <!-- WhatsApp quick contact -->
      <div class="mt-5 text-center text-[12px] text-ink-500 dark:text-ink-400">
        Hər zaman ki dəstək —
        <a :href="waLink" target="_blank" rel="noopener" class="inline-flex items-center gap-1 font-black text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A8 8 0 006.5 17.4L5 22l4.7-1.5a8 8 0 1011.9-10.2 7.92 7.92 0 00-4 2zM12 4a8 8 0 11-8 8 8 8 0 018-8z"/></svg>
          WhatsApp
        </a>
      </div>
    </div>
  </main>
</template>