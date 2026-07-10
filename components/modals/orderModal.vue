<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { authStore } from "~/stores/authStore";
import { loadingStore } from "~/stores/loadingStore";
import { useRouter } from "vue-router";
import SHA1 from "crypto-js/sha1";
import CryptoJS from "crypto-js";

const { $api, $toast } = useNuxtApp();
const router = useRouter();
const props = defineProps({
  product: { required: true },
  game: { required: true },
  qty: { required: true },
});
const emit = defineEmits(["close", "incrementFromChildren", "decrementFromChildren"]);

const product = computed<any>(() => props.product);
const game = computed<any>(() => props.game);
const qty = computed<any>(() => props.qty);
const auth = authStore();
const { headers } = storeToRefs(auth);
const { setUserData } = auth;
const { user } = auth;
const loadingStore1 = loadingStore();
const { setLoading } = loadingStore1;

const infos = ref<Record<string, any>>({});
const wallets = ref<Record<string, any>>({});
const paymentMethod = ref("balance");
const config = useRuntimeConfig();

// ── UI state ──
const step = ref(1);
const visible = ref(false);
const howOpen = ref(false);
const fmt = (n: any) => (Math.round(Number(n || 0) * 100) / 100).toFixed(2);
const total = computed(() => fmt((product.value?.price ?? 0) * qty.value));
const bonusTotal = computed(() => (product.value?.bonus ?? 0) * qty.value);
const infoKeys = computed(() => Object.keys(game.value?.info || {}));
const canContinue = computed(() => infoKeys.value.every((k) => (infos.value[k] || "").toString().trim()));
const commissionRate = computed(() => {
  if (paymentMethod.value === "balance") return 0;
  if (paymentMethod.value === "9" || paymentMethod.value === "10") return 0.015;
  return 0.03;
});
const totalWithCommission = computed(() => {
  if (commissionRate.value === 0) return total.value;
  const base = (product.value?.price ?? 0) * qty.value;
  return (Math.ceil((base / (1 - commissionRate.value)) * 100) / 100).toFixed(2);
});
const commissionAmount = computed(() => {
  if (commissionRate.value === 0) return "0.00";
  return (parseFloat(totalWithCommission.value) - parseFloat(total.value)).toFixed(2);
});
const commissionLabel = computed(() => {
  if (paymentMethod.value === "balance") return "Komissiyasız";
  if (paymentMethod.value === "epoint") return "Kart komissiyası 3%";
  if (paymentMethod.value === "9" || paymentMethod.value === "10") return "Komissiya 1,5%";
  return "Komissiya 3%";
});

// ── G2Bulk ID yoxlama ──
const needsVerify = computed(() => {
  const name = (game.value?.name || "").toLowerCase();
  const cat  = (game.value?.category?.name || "").toLowerCase();
  return name.includes("pubg") || cat.includes("pubg");
});

const verifyStatus = ref<null | "loading" | "ok" | "fail">(null);
const verifiedName = ref("");

const uidKey  = computed(() => infoKeys.value.find((k: string) => /player.?id|uid|oyuncu/i.test(k)) || infoKeys.value[0]);
const zoneKey = computed(() => infoKeys.value.find((k: string) => /zone.?id|server/i.test(k))       || infoKeys.value[1]);

let verifyTimer: ReturnType<typeof setTimeout> | null = null;

const verifyPlayerId = async () => {
  const uid    = (infos.value[uidKey.value] || "").trim();
  const zoneId = (infos.value[zoneKey.value] || "").trim();

  if (!uid) return;

  const gameName = (game.value?.name || "").toLowerCase();
  const gameCode = gameName.includes("pubg") ? "pubgm" : (game.value?.slug || "");

  verifyStatus.value = "loading";
  verifiedName.value = "";

  try {
    const data: any = await $fetch("/api/check-player", {
      method: "POST",
      body: { game: gameCode, user_id: uid, server_id: zoneId || undefined },
    });
    if (data?.valid === "valid" && data?.name) {
      verifiedName.value = data.name;
      verifyStatus.value = "ok";
    } else {
      verifyStatus.value = "fail";
    }
  } catch {
    verifyStatus.value = "fail";
  }
};

// ID yazılan kimi (debounce ilə) avtomatik yoxla — buttona basmağa ehtiyac yoxdur
watch(infos, () => {
  verifyStatus.value = null;
  verifiedName.value = "";
  if (verifyTimer) clearTimeout(verifyTimer);
  if (!needsVerify.value) return;
  const uid = (infos.value[uidKey.value] || "").trim();
  if (!uid) return;
  verifyTimer = setTimeout(() => verifyPlayerId(), 600);
}, { deep: true });

const close = () => {
  visible.value = false;
  setTimeout(() => emit("close"), 200);
};
const goPay = () => {
  if (!canContinue.value) {
    $toast.error("Zəhmət olmasa məlumatları doldurun");
    return;
  }
  step.value = 2;
};
const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") close();
};

// Wallet məlumatlarını əldə etmək üçün funksiya
const fetchWallets = async () => {
  try {
    if (!config.public.key || !config.public.pub) return;
    const url = "https://epoint.az/api/1/wallet/status";
    const signatureString = `${config.public.key}${config.public.pub}${config.public.key}`;
    const hash = SHA1(signatureString);
    const data = { public_key: config.public.pub };
    let encodedData, encodedSignature;
    if (typeof window !== "undefined") {
      encodedData = btoa(JSON.stringify(data));
      encodedSignature = btoa(hash.toString(CryptoJS.enc.Latin1));
    } else {
      encodedData = Buffer.from(JSON.stringify(data)).toString("base64");
      encodedSignature = Buffer.from(hash.toString(CryptoJS.enc.Latin1)).toString("base64");
    }
    const body = { data: encodedData, signature: encodedSignature };
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`API xətası: ${response.status}`);
    wallets.value = await response.json();
  } catch (error) {
    console.error("Wallet məlumatlarını əldə edərkən xəta:", error);
  }
};

onMounted(() => {
  fetchWallets();
  document.addEventListener("keydown", onKey);
  document.body.style.overflow = "hidden";
  nextTick(() => (visible.value = true));
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKey);
  document.body.style.overflow = "";
  if (verifyTimer) clearTimeout(verifyTimer);
});

const makeOrder = () => {
  setLoading(true);
  const url = paymentMethod.value === "balance" ? "user/order" : "/user/payment/product";
  $api
    .post(
      url,
      {
        product: product.value.id,
        info: infos.value,
        count: qty.value,
        payment_method: paymentMethod.value === "epoint" ? "epoint" : "wallet",
        wallet_id: paymentMethod.value,
      },
      headers.value
    )
    .then((res: any) => {
      if (paymentMethod.value === "balance") {
        $toast.success(res?.data);
        ($api as any).get("user", headers.value).then((r: any) => setUserData(r.data));
        close();
        router.push("/user/dashboard/orders");
      } else if (res?.data) {
        window.location.href = res.data;
      } else {
        ($toast as any).success("Sifariş qəbul edildi");
        close();
        router.push("/user/dashboard/orders");
      }
    })
    .catch((err) => $toast.error(err))
    .finally(() => setLoading(false));
};
</script>

<template>
  <div class="fixed inset-0 z-[120]">
    <!-- Backdrop -->
    <div @click="close" class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200" :class="visible ? 'opacity-100' : 'opacity-0'"></div>

    <div class="absolute inset-0 grid place-items-center p-4 overflow-y-auto">
      <div
        class="relative w-full max-w-md bg-white dark:bg-ink-800 rounded-2xl shadow-2xl border border-ink-200 dark:border-ink-700 overflow-hidden transition duration-200 my-auto"
        :class="visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-[0.98]'"
      >
        <!-- ══════ STEP 1 — order info ══════ -->
        <template v-if="step === 1">
          <div class="relative px-5 pt-4 pb-3 flex items-center gap-3 border-b border-ink-200 dark:border-ink-700">
            <div class="flex-1 min-w-0">
              <span class="text-[10px] font-bold tracking-[0.14em] uppercase text-brand-500">Addım 1 / 2</span>
              <h3 class="text-[15.5px] font-black tracking-tight text-ink-900 dark:text-white leading-tight mt-0.5">Sifariş məlumatları</h3>
            </div>
            <button @click="close" type="button" class="w-9 h-9 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-700 grid place-items-center text-ink-400 hover:text-ink-700 dark:hover:text-white transition shrink-0" aria-label="Bağla">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Warning banner -->
          <div class="mx-5 mt-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <svg class="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <span class="text-[11.5px] leading-tight font-medium text-amber-800 dark:text-amber-200">Məlumatları düzgün daxil edin — sifariş ödənişdən sonra avtomatik yaradılacaq.</span>
          </div>

          <!-- Product card -->
          <div class="mx-5 mt-3 p-3 rounded-xl bg-ink-50 dark:bg-ink-900/50 border border-ink-200 dark:border-ink-700">
            <div class="flex items-center gap-3">
              <span class="w-12 h-12 rounded-lg overflow-hidden bg-ink-100 dark:bg-ink-900 grid place-items-center shrink-0 shadow-sm">
                <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
              </span>
              <div class="flex-1 min-w-0">
                <div class="text-[13.5px] font-black tracking-tight text-ink-900 dark:text-white leading-tight truncate">{{ product.name }}</div>
                <div class="text-[11px] text-ink-500 dark:text-ink-400 font-medium leading-tight mt-0.5">Anlıq çatdırılma</div>
              </div>
              <!-- qty stepper -->
              <div class="inline-flex items-center justify-between w-[98px] h-9 rounded-lg bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 shrink-0 px-0.5">
                <button @click="$emit('decrementFromChildren')" type="button" class="w-7 h-7 grid place-items-center rounded-md text-ink-500 dark:text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 active:scale-90 transition" aria-label="Azalt"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
                <span class="flex-1 grid place-items-center text-[12.5px] font-bold tabular-nums select-none text-ink-900 dark:text-white">{{ qty }}</span>
                <button @click="$emit('incrementFromChildren')" type="button" class="w-7 h-7 grid place-items-center rounded-md text-ink-500 dark:text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 active:scale-90 transition" aria-label="Artır"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-ink-200 dark:border-ink-700 grid grid-cols-2 gap-2 text-[12px]">
              <div class="flex items-center justify-between">
                <span class="text-ink-500 dark:text-ink-400 font-medium">Bonus</span>
                <span class="font-black text-emerald-600 dark:text-emerald-400 tabular-nums">+{{ bonusTotal }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-ink-500 dark:text-ink-400 font-medium">Cəmi</span>
                <span class="font-black text-ink-900 dark:text-white tabular-nums">{{ total }} AZN</span>
              </div>
            </div>
          </div>

          <!-- Info inputs (game.info) -->
          <div class="px-5 pt-4 pb-2 space-y-3">
            <div v-for="(placeholder, key) in game.info" :key="key">
              <label class="block text-[11px] font-extrabold tracking-[0.08em] uppercase text-ink-700 dark:text-ink-300 mb-2">{{ key }}</label>
              <input v-model="infos[key]" type="text" :placeholder="placeholder" class="w-full h-11 px-4 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition text-[14px] font-semibold tracking-wide placeholder:text-ink-400 placeholder:font-normal text-ink-900 dark:text-white" />
            </div>

            <!-- G2Bulk ID yoxlama (yalnız PUBG) -->
            <template v-if="needsVerify">
              <button
                @click="verifyPlayerId"
                :disabled="!canContinue || verifyStatus === 'loading'"
                type="button"
                class="w-full h-10 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
                :class="verifyStatus === 'ok'
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30'
                  : verifyStatus === 'fail'
                    ? 'bg-red-50 dark:bg-red-500/10 text-red-500 ring-1 ring-red-500/30'
                    : 'bg-ink-50 dark:bg-ink-800 text-ink-700 dark:text-ink-200 ring-1 ring-ink-200 dark:ring-ink-700 hover:ring-brand-500 hover:text-brand-500'"
              >
                <!-- Loading -->
                <svg v-if="verifyStatus === 'loading'" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.22-8.56"/></svg>
                <!-- OK -->
                <svg v-else-if="verifyStatus === 'ok'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <!-- Fail -->
                <svg v-else-if="verifyStatus === 'fail'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                <!-- Default -->
                <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12A10 10 0 1112 2"/><polyline points="22 4 12 14 9 11"/></svg>

                <span v-if="verifyStatus === 'loading'">Yoxlanılır…</span>
                <span v-else-if="verifyStatus === 'ok'">Təsdiqləndi — {{ verifiedName }}</span>
                <span v-else-if="verifyStatus === 'fail'">ID tapılmadı — yenidən yoxla</span>
                <span v-else>Player ID-ni yoxla</span>
              </button>
            </template>

            <button v-if="game.how" @click="howOpen = !howOpen" type="button" class="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-ink-50 dark:bg-ink-900/50 border border-ink-200 dark:border-ink-700 hover:border-brand-500/50 transition">
              <span class="inline-flex items-center gap-2 text-[12px] font-bold text-ink-800 dark:text-ink-200">
                <svg class="w-3.5 h-3.5 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
                İstifadə qaydası
              </span>
              <svg class="w-3.5 h-3.5 text-ink-500 transition-transform" :class="{ 'rotate-180': howOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div v-if="game.how && howOpen" class="px-3 py-3 rounded-lg bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 text-[12px] text-ink-600 dark:text-ink-300 prose-dd" v-html="game.how"></div>
          </div>

          <div class="px-5 pb-5 pt-3">
            <button
              @click="goPay"
              :disabled="needsVerify && verifyStatus !== 'ok'"
              type="button"
              class="ripple shine-wrap w-full h-12 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[.98] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-pop transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-500"
            >
              <span>Davam et</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </button>
            <p v-if="needsVerify && verifyStatus !== 'ok'" class="mt-2 text-center text-[11px] text-ink-400 dark:text-ink-500">
              Davam etmək üçün əvvəlcə Player ID-ni yoxlayın
            </p>
          </div>
        </template>

        <!-- ══════ STEP 2 — payment ══════ -->
        <template v-else>
          <div class="relative px-5 pt-4 pb-3 flex items-center gap-3 border-b border-ink-200 dark:border-ink-700">
            <button @click="step = 1" type="button" class="w-9 h-9 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-700 grid place-items-center text-ink-500 dark:text-ink-300 active:scale-95 transition shrink-0" aria-label="Geri">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div class="flex-1 min-w-0">
              <span class="text-[10px] font-bold tracking-[0.14em] uppercase text-brand-500">Addım 2 / 2</span>
              <h3 class="text-[15.5px] font-black tracking-tight text-ink-900 dark:text-white leading-tight mt-0.5">Ödəniş üsulu</h3>
            </div>
            <button @click="close" type="button" class="w-9 h-9 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-700 grid place-items-center text-ink-400 hover:text-ink-700 dark:hover:text-white transition shrink-0" aria-label="Bağla">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Summary -->
          <div class="mx-5 mt-3 p-3 rounded-xl bg-ink-50 dark:bg-ink-900/50 border border-ink-200 dark:border-ink-700">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="text-[12.5px] font-bold text-ink-900 dark:text-white leading-tight truncate">{{ product.name }}</div>
                <div class="text-[11px] text-ink-500 dark:text-ink-400 leading-tight mt-0.5">{{ qty }} ədəd</div>
              </div>
              <div class="text-right shrink-0">
                <div class="text-[10px] font-bold uppercase tracking-wide text-ink-500 dark:text-ink-400">Cəmi</div>
                <div class="text-[15px] font-black text-ink-900 dark:text-white tabular-nums">{{ total }} AZN</div>
              </div>
            </div>
          </div>

          <!-- Payment methods -->
          <div class="px-5 pt-4 pb-2">
            <div class="text-[11px] font-extrabold tracking-[0.08em] uppercase text-ink-700 dark:text-ink-300 mb-2">Üsul seçin</div>
            <div class="space-y-2">
              <!-- Balance -->
              <button @click="paymentMethod = 'balance'" type="button" class="w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition" :class="paymentMethod === 'balance' ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-ink-200 dark:border-ink-700 hover:border-brand-500/50'">
                <span class="w-9 h-9 rounded-lg bg-brand-500/15 text-brand-500 grid place-items-center shrink-0">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                </span>
                <div class="flex-1 min-w-0">
                  <div class="text-[13px] font-bold text-ink-900 dark:text-white">Balans</div>
                  <div class="text-[11px] text-ink-500 dark:text-ink-400">Hesabınızdakı balans · 0% komissiya</div>
                </div>
                <span class="w-5 h-5 rounded-full grid place-items-center shrink-0 bg-brand-500 text-white" :class="paymentMethod === 'balance' ? '' : 'opacity-0'"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span>
              </button>

              <!-- Card (epoint) -->
              <button v-if="user?.level === 'normal'" @click="paymentMethod = 'epoint'" type="button" class="w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition" :class="paymentMethod === 'epoint' ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-ink-200 dark:border-ink-700 hover:border-brand-500/50'">
                <span class="w-9 h-9 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 grid place-items-center shrink-0">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>
                </span>
                <div class="flex-1 min-w-0">
                  <div class="text-[13px] font-bold text-ink-900 dark:text-white">Kart ilə</div>
                  <div class="text-[11px] text-ink-500 dark:text-ink-400">Visa, MasterCard · 3% komissiya</div>
                </div>
                <span class="w-5 h-5 rounded-full grid place-items-center shrink-0 bg-brand-500 text-white" :class="paymentMethod === 'epoint' ? '' : 'opacity-0'"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span>
              </button>

              <!-- Wallets -->
              <button v-for="(wallet, key) in (user?.level === 'normal' ? wallets : {})" :key="key" @click="paymentMethod = key" type="button" class="w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition" :class="paymentMethod === key ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-ink-200 dark:border-ink-700 hover:border-brand-500/50'">
                <span class="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 grid place-items-center shrink-0">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2"/><path d="M21 12h-6a1 1 0 00-1 1v0a1 1 0 001 1h6z"/></svg>
                </span>
                <div class="flex-1 min-w-0">
                  <div class="text-[13px] font-bold text-ink-900 dark:text-white truncate">{{ wallet }}</div>
                  <div class="text-[11px] text-ink-500 dark:text-ink-400">Elektron pul kisəsi · {{ key === '9' || key === '10' ? '1,5%' : '3%' }} komissiya</div>
                </div>
                <span class="w-5 h-5 rounded-full grid place-items-center shrink-0 bg-brand-500 text-white" :class="paymentMethod === key ? '' : 'opacity-0'"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span>
              </button>
            </div>
          </div>

          <!-- Final -->
          <div class="mx-5 mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between">
            <div class="min-w-0">
              <div class="text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Yekun məbləğ</div>
              <div class="text-[11px] text-emerald-700 dark:text-emerald-300/80 leading-tight mt-0.5">
                {{ commissionLabel }}
                <template v-if="commissionRate > 0">· {{ total }} + {{ commissionAmount }} AZN</template>
              </div>
            </div>
            <div class="text-[18px] font-black text-emerald-700 dark:text-emerald-300 tabular-nums">{{ totalWithCommission }} AZN</div>
          </div>

          <div class="px-5 pb-5 pt-3">
            <button @click="makeOrder" type="button" class="ripple shine-wrap w-full h-12 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[.98] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-pop transition">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span>Ödənişi tamamla</span>
            </button>
            <div class="mt-3 flex items-center justify-center gap-3 text-[10.5px] font-semibold text-ink-500 dark:text-ink-400">
              <span class="inline-flex items-center gap-1"><svg class="w-3 h-3 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> SSL · 3D Secure</span>
              <span class="opacity-30">•</span>
              <span class="inline-flex items-center gap-1"><svg class="w-3 h-3 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Sürətli çatdırılma</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: "OrderModal" };
</script>
