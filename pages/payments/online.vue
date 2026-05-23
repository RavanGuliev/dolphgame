<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { authStore } from "#imports";
import { loadingStore } from "~/stores/loadingStore";
import PaymentSidebar from "~/components/payments/paymentSidebar.vue";
import SHA1 from "crypto-js/sha1";
import CryptoJS from "crypto-js";

const config = useRuntimeConfig();
const { $api, $toast } = useNuxtApp();
const router = useRouter();
const userStore = authStore();
const loading = loadingStore();
const { setLoading } = loading;
const wallets = ref([]);
const paymentMethod = ref("epoint");
const amount = ref("");
const isLoading = ref(false);
const { user } = userStore;
const iframe = ref(null);
const { isAndroid, isIos, isMobile } = useNuxtApp().$device;

definePageMeta({
  middleware: "auth",
});

if (user?.level !== "normal") {
  router.push("/payments");
}

// Commission rates for different payment methods
const commissionRates = {
  epoint: { rate: 0.03, label: '3%', type: 'paid' },
  gapay: { rate: 0.03, label: '3%', type: 'paid' },
};

// Calculate commission and total
const commission = computed(() => {
  const amountNum = Number(amount.value) || 0;
  const method = paymentMethod.value;
  
  // Check if it's a wallet method
  if (wallets.value[method]) {
    const commissionAmount = amountNum * 0.03;
    return {
      rate: 0.03,
      amount: commissionAmount,
      balance: amountNum,
      total: amountNum + commissionAmount,
      label: '3%',
      type: 'paid'
    };
  }
  
  const rateInfo = commissionRates[method as keyof typeof commissionRates] || { rate: 0.03, label: '3%', type: 'paid' };
  const commissionAmount = amountNum * rateInfo.rate;
  
  return {
    rate: rateInfo.rate,
    amount: commissionAmount,
    balance: amountNum,
    total: amountNum + commissionAmount,
    label: rateInfo.label,
    type: rateInfo.type
  };
});

const submitPayment = () => {
  if (
    !amount.value ||
    isNaN(Number(amount.value)) ||
    Number(amount.value) <= 0
  ) {
    $toast.error("Zəhmət olmasa düzgün məbləğ daxil edin");
    return;
  }
  let paymentData;
  if (paymentMethod.value === "gapay") {
    paymentData = "gapay";
  } else {
    paymentData = paymentMethod.value === "epoint" ? "epoint" : "wallet";
  }
  setLoading(true);
  isLoading.value = true;
  $api
    .post(
      "user/payment/balance",
      {
        amount: amount.value,
        payment_method: paymentData,
        wallet_id: paymentMethod.value,
      },
      userStore.headers
    )
    .then((res) => {
      if (res.data) {
        if (paymentMethod.value === "gapay") {
          iframe.value = res.data;
        } else {
          window.location.href = res.data;
        }
      } else {
        $toast.success("Ödəniş tələbi göndərildi");
        router.push("/user/dashboard/payments");
      }
    })
    .catch((error) => {
      $toast.error(
        error.response?.data?.message || "Ödəniş zamanı xəta baş verdi"
      );
    })
    .finally(() => {
      setLoading(false);
      isLoading.value = false;
    });
};

const fetchWallets = async () => {
  try {
    if (!config.public.key || !config.public.pub) {
      console.error("API konfiqurasiya dəyərləri tapılmadı");
      return;
    }

    const url = "https://epoint.az/api/1/wallet/status";
    const signatureString = `${config.public.key}${config.public.pub}${config.public.key}`;
    const hash = SHA1(signatureString);

    const data = {
      public_key: config.public.pub,
    };

    let encodedData, encodedSignature;

    if (typeof window !== "undefined") {
      encodedData = btoa(JSON.stringify(data));
      encodedSignature = btoa(hash.toString(CryptoJS.enc.Latin1));
    } else {
      encodedData = Buffer.from(JSON.stringify(data)).toString("base64");
      encodedSignature = Buffer.from(
        hash.toString(CryptoJS.enc.Latin1)
      ).toString("base64");
    }

    const body = {
      data: encodedData,
      signature: encodedSignature,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API xətası: ${response.status}`);
    }

    const result = await response.json();
    console.log("Wallet məlumatları:", result);
    wallets.value = result;
  } catch (error) {
    console.error("Wallet məlumatlarını əldə edərkən xəta baş verdi:", error);
    $toast.error("Wallet məlumatlarını əldə edərkən xəta baş verdi");
  }
};

onMounted(async () => {
  await fetchWallets();
});

const quicks = [5, 10, 25, 50, 100];
const setAmount = (v: number) => (amount.value = String(v));
const stepAmount = (n: number) => {
  const cur = Number(amount.value) || 0;
  amount.value = String(Math.max(1, cur + n));
};
const fmt = (n: any) => Number(n || 0).toFixed(2);

const steps = [
  "Yükləmək istədiyiniz məbləği daxil edin.",
  "Provayder komissiyasına uyğun məbləğ avtomatik hesablanacaq.",
  "Balansınızdan çıxılacaq yekun məbləğ «Yekun məbləğ» bölməsində göstəriləcək.",
  "«Ödəniş et» düyməsinə klik edin.",
  "Bankın təhlükəsiz ödəniş səhifəsinə yönləndiriləcəksiniz.",
  "Kart məlumatlarınızı daxil edib təsdiqləyin.",
  "Ödəniş tamamlandıqda balansınız avtomatik artırılacaq.",
];
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6">
    <!-- Orange banner -->
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

      <!-- Card payment panel -->
      <div data-pay-content>
        <div class="bg-white dark:bg-ink-800 rounded-2xl p-6 md:p-7 shadow-card border border-ink-200 dark:border-ink-700">
          <!-- Header -->
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/15 grid place-items-center text-brand-500">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
              </span>
              <div>
                <h2 class="text-lg md:text-xl font-extrabold tracking-tight text-ink-900 dark:text-white">Bank Kartı ilə ödəniş</h2>
                <p class="text-xs text-ink-500 dark:text-ink-400 mt-0.5 flex items-center gap-1.5">
                  <span class="relative flex w-2 h-2"><span class="absolute inset-0 rounded-full bg-emerald-400 anim-live-pulse"></span><span class="relative rounded-full w-2 h-2 bg-emerald-500"></span></span>
                  Ani balans yüklənməsi · 3D Secure
                </p>
              </div>
            </div>
            <span class="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400">Komissiya {{ commission.label }}</span>
          </div>

          <!-- Amount -->
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

          <!-- Commission breakdown -->
          <div class="mt-5 rounded-2xl bg-ink-50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-700 p-4 md:p-5 space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-ink-500 dark:text-ink-400">Balansa yüklənəcək</span>
              <span class="font-bold text-ink-900 dark:text-white">{{ fmt(commission.balance) }} AZN</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-ink-500 dark:text-ink-400">Komissiya ({{ commission.label }})</span>
              <span class="text-brand-500 font-semibold">+{{ fmt(commission.amount) }} AZN</span>
            </div>
            <div class="pt-3 border-t border-ink-200 dark:border-ink-700 flex items-baseline justify-between">
              <span class="text-sm font-bold uppercase tracking-wider text-ink-700 dark:text-ink-200">Yekun məbləğ</span>
              <div class="flex items-baseline gap-1">
                <span class="text-3xl md:text-4xl font-black text-brand-500 tracking-tight leading-none">{{ fmt(commission.total) }}</span>
                <span class="text-sm font-bold text-brand-500">AZN</span>
              </div>
            </div>
          </div>

          <!-- Pay button -->
          <button @click="submitPayment" :disabled="isLoading" type="button" class="ripple shine-wrap w-full mt-5 h-14 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 active:scale-[.99] text-white font-extrabold text-base shadow-pop transition flex items-center justify-center gap-2 disabled:opacity-60">
            <svg v-if="!isLoading" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <span>{{ isLoading ? 'Gözləyin...' : 'Ödəniş et' }}</span>
            <svg v-if="!isLoading" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>

          <div class="mt-4 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            <svg class="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Secure 256-bit SSL Payment
          </div>

          <!-- Payment iframe (gapay) -->
          <transition name="scale-fade">
            <div v-if="iframe" class="mt-5 rounded-2xl overflow-hidden border border-ink-200 dark:border-ink-700">
              <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-3 flex items-center gap-2 font-bold text-sm">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>
                Təhlükəsiz ödəniş
              </div>
              <iframe :src="iframe" allow="payment" frameborder="0" sandbox="allow-scripts allow-same-origin allow-popups allow-payment" class="w-full h-[400px] border-0"></iframe>
            </div>
          </transition>
        </div>

        <!-- Instructions -->
        <div class="mt-6 rounded-2xl bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 p-5 md:p-6">
          <div class="flex items-start gap-3 mb-4">
            <span class="w-11 h-11 rounded-xl bg-ink-50 dark:bg-ink-700 grid place-items-center shrink-0 overflow-hidden">
              <img src="/img/payments/bank-karti.png" alt="Bank kartı" class="w-7 h-7 object-contain" />
            </span>
            <div>
              <h3 class="text-[15px] font-extrabold text-ink-900 dark:text-white">Kredit / Bank kartı ilə necə ödəniş edilir?</h3>
              <p class="text-xs text-ink-500 dark:text-ink-400 mt-0.5">Aşağıdan izləyə bilərsiniz.</p>
            </div>
          </div>
          <ul class="space-y-2.5">
            <li v-for="(s, i) in steps" :key="i" class="flex items-start gap-2.5 text-[13.5px] text-ink-700 dark:text-ink-300 leading-relaxed">
              <span class="mt-0.5 w-5 h-5 rounded-md bg-brand-500/15 text-brand-500 grid place-items-center text-[11px] font-black shrink-0">{{ i + 1 }}</span>
              <span>{{ s }}</span>
            </li>
          </ul>
          <p class="mt-4 pt-3 border-t border-ink-100 dark:border-ink-700 text-center text-[13px] text-ink-500 dark:text-ink-400">
            Problem yaşayırsınızsa, <nuxt-link to="/pages/contact" class="text-brand-500 font-semibold hover:text-brand-600">dəstək komandamızla</nuxt-link> əlaqə saxlayın.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.scale-fade-enter-active,
.scale-fade-leave-active { transition: all 0.3s ease; }
.scale-fade-enter-from,
.scale-fade-leave-to { opacity: 0; transform: scale(0.95); }
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type="number"] { -moz-appearance: textfield; }
</style>

