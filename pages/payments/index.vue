<script setup lang="ts">
import { authStore } from "~/stores/authStore";
import { loadingStore } from "~/stores/loadingStore";
import { useRouter } from "vue-router";
import PaymentSidebar from "~/components/payments/paymentSidebar.vue";

const { $api, $toast } = useNuxtApp();
const router = useRouter();
const auth = authStore();
const { headers } = storeToRefs(auth);
const invoice = ref<any>("");
const invoice_id = ref<any>("");
const loading = loadingStore();
const { setLoading } = loading;
const methods = await $api.get("user/methods", headers.value);
const { user } = auth;

definePageMeta({ middleware: "auth" });
useHead({ title: "Ödəniş növləri" });

const sendPayment = () => {
  if (!invoice.value) {
    $toast.error("Zəhmət olmasa qəbz şəklini seçin");
    return;
  }
  setLoading(true);
  const formData = new FormData();
  formData.append("invoice", invoice.value);
  $api
    .post("user/payment/invoice", formData, headers.value)
    .then(() => {
      router.push("/user/dashboard/payments").then(() => $toast.success("Çek uğurla göndərildi."));
    })
    .catch((error) => $toast.error(error))
    .finally(() => {
      setLoading(false);
      invoice.value = "";
      invoice_id.value = "";
    });
};

const addPhoto = (event: any, id: any) => {
  invoice.value = event.target.files[0];
  invoice_id.value = id;
};

const copyCardNumber = (cardNumber: string) => {
  navigator.clipboard.writeText(cardNumber)
    .then(() => $toast.success("Kart nömrəsi kopyalandı!"))
    .catch(() => $toast.error("Kopyalama zamanı xəta baş verdi"));
};

const steps = [
  { t: "Ödəniş üsulunu seçin", d: "Terminal (MilliÖN, eManat) və ya istənilən mobil bank tətbiqi ilə ödəyə bilərsiniz." },
  { t: "Kart məlumatlarını daxil edin", d: "Karta köçürmə bölməsinə keçin və yuxarıdakı kart nömrəsini daxil edin." },
  { t: "Ad-Soyadı yoxlayın", d: "Sistemdə görünən ad-soyadın saytdakı ilə eyni olduğuna əmin olun." },
  { t: "Ödənişi tamamlayın", d: "Məbləği daxil edib təsdiqləyin. Qəbzi/screenshot-u saxlayın." },
  { t: "Qəbzi yükləyin", d: "Bu səhifədəki «Qəbz seç və göndər» bölməsinə qəbzin şəklini yükləyin." },
];
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6">
    <!-- Banner -->
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
        <!-- Qebz panel -->
        <div class="bg-white dark:bg-ink-800 rounded-2xl p-6 md:p-7 shadow-card border border-ink-200 dark:border-ink-700">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-500/15 grid place-items-center text-amber-600 dark:text-amber-400">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2V8z"/><path d="M14 2v6h6M9 12h6M9 16h4"/></svg>
              </span>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h2 class="text-lg md:text-xl font-extrabold tracking-tight text-ink-900 dark:text-white">Qəbz ilə ödəniş</h2>
                  <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                    0% komissiya
                  </span>
                </div>
                <p class="text-xs text-ink-500 dark:text-ink-400 mt-1 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 anim-live-pulse"></span>
                  Məbləğ kart üzərinə göndərilir
                </p>
              </div>
            </div>
            <span class="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              11:00 — 00:00
            </span>
          </div>

          <!-- Bank cards -->
          <div class="mt-6 space-y-4">
            <div v-for="method in methods.data" :key="method.id" class="relative overflow-hidden rounded-2xl p-6 bg-white dark:bg-ink-900/40 border border-ink-200 dark:border-ink-700 text-ink-900 dark:text-white">
              <span aria-hidden="true" class="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-brand-500 to-amber-400"></span>
              <span aria-hidden="true" class="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-brand-500/5 dark:bg-brand-500/10 blur-3xl"></span>

              <div class="relative flex items-center justify-between">
                <div class="flex items-center gap-2 text-ink-500 dark:text-ink-400">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="10" rx="1"/><path d="M5 11V8a7 7 0 0114 0v3M8 16h.01M12 16h.01M16 16h.01"/></svg>
                  <span class="text-[11px] font-bold uppercase tracking-widest">Kart Köçürmə</span>
                </div>
                <div class="font-black italic text-[18px] md:text-[20px] tracking-tight text-brand-600 dark:text-brand-400 leading-none">{{ method.name }}</div>
              </div>

              <div class="relative mt-7" v-for="(prop, key) in method.props" :key="key">
                <template v-if="key === 'Kartın Nömrəsi'">
                  <div class="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400 mb-2">Kart nömrəsi</div>
                  <div class="font-mono text-xl md:text-2xl tracking-[0.18em] md:tracking-[0.24em] font-bold text-ink-900 dark:text-white select-all break-all">{{ prop }}</div>
                </template>
              </div>

              <div class="relative mt-6 flex items-end justify-between gap-3 flex-wrap">
                <div class="min-w-0">
                  <div class="text-[10px] font-bold uppercase tracking-widest text-ink-500 dark:text-ink-400">Hesab Sahibi</div>
                  <div class="mt-1 text-base md:text-lg font-black tracking-wide truncate">
                    <template v-for="(prop, key) in method.props" :key="'h-' + key"><span v-if="key === 'Ad Soyad'">{{ prop }}</span></template>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <template v-for="(prop, key) in method.props" :key="'c-' + key">
                    <button v-if="key === 'Kartın Nömrəsi'" @click="copyCardNumber(prop)" type="button" class="ripple shine-wrap h-11 px-4 rounded-xl bg-ink-100 dark:bg-ink-700 hover:bg-ink-200 dark:hover:bg-ink-600 active:scale-95 text-ink-800 dark:text-ink-100 text-sm font-bold flex items-center gap-2 transition shrink-0">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                      Kopyala
                    </button>
                  </template>
                  <label :for="'receipt-' + method.id" class="ripple shine-wrap h-11 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-sm font-bold flex items-center gap-2 shadow-pop transition cursor-pointer shrink-0">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {{ invoice_id === method.id ? 'Qəbz seçildi' : 'Qəbz seç' }}
                    <input @change="addPhoto($event, method.id)" name="image" accept="image/*" hidden :id="'receipt-' + method.id" type="file" />
                  </label>
                </div>
              </div>

              <div v-if="invoice_id === method.id" class="relative mt-4">
                <button @click="sendPayment" type="button" class="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[.99] text-white font-bold text-sm shadow-pop transition flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Qəbzi göndər
                </button>
              </div>
            </div>
          </div>

          <!-- Callout -->
          <div class="mt-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-start gap-3">
            <span class="w-9 h-9 rounded-xl bg-amber-500 grid place-items-center text-white shrink-0">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
            </span>
            <div class="flex-1 text-xs md:text-[13px] text-amber-900 dark:text-amber-200 leading-relaxed">
              Qəbz ödənişləri <strong>əl ilə</strong> yoxlanılır. Qəbzi göndərdikdən sonra balans <strong>5-10 dəqiqə</strong> ərzində yüklənəcək. İş vaxtı: <strong>11:00 — 00:00</strong>.
            </div>
          </div>
        </div>

        <!-- Steps -->
        <div class="bg-white dark:bg-ink-800 rounded-2xl p-6 shadow-card border border-ink-200 dark:border-ink-700">
          <div class="flex items-center gap-3 mb-5">
            <span class="w-1 h-6 bg-brand-500 rounded-full"></span>
            <h3 class="text-lg md:text-xl font-bold text-ink-900 dark:text-white">Qəbz ilə necə ödəniş edilir?</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="(s, i) in steps" :key="i" class="step-card rounded-xl bg-ink-50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-700 p-4">
              <div class="step-num w-9 h-9 rounded-lg bg-brand-500 text-white grid place-items-center font-black text-sm relative">{{ i + 1 }}</div>
              <h4 class="mt-3 text-[14px] font-extrabold text-ink-900 dark:text-white">{{ s.t }}</h4>
              <p class="mt-1 text-[12.5px] text-ink-500 dark:text-ink-400 leading-relaxed">{{ s.d }}</p>
            </div>
          </div>
          <p class="mt-5 pt-4 border-t border-ink-100 dark:border-ink-700 text-center text-[13px] text-ink-500 dark:text-ink-400">
            Problem yaşayırsınızsa, <nuxt-link to="/pages/contact" class="text-brand-500 font-semibold hover:text-brand-600">dəstək komandamızla</nuxt-link> əlaqə saxlayın.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
