<script setup lang="ts">

import {authStore} from "~/stores/authStore";
import {computed, onMounted, ref} from "vue";
import {basketStore, loadingStore} from "#imports";
import {useRouter} from "vue-router";
import SHA1 from "crypto-js/sha1";
import CryptoJS from "crypto-js";

definePageMeta({
  middleware: 'auth'
})
const router = useRouter()
const {$api, $toast} = useNuxtApp()
const auth = authStore()
const {headers} = storeToRefs(auth)
const {setUserData} = auth
const loading = loadingStore()
const basket = basketStore()
const {setBaskets} = basket
const {setLoading} = loading
const data = await $api.get('user/basket', headers.value)
const rows = ref(data)
const wallets = ref({})
const paymentMethod = ref('balance')
const config = useRuntimeConfig()
const recommended = ref({data: []})
$api.get('public/top-products?count=4', headers.value).then(res => {
  recommended.value = res
})
// Wallet məlumatlarını əldə etmək üçün funksiya
const fetchWallets = async () => {
  try {
    // Əmin olun ki, config dəyərləri mövcuddur
    if (!config.public.key || !config.public.pub) {
      console.error('API konfiqurasiya dəyərləri tapılmadı');
      return;
    }

    const url = 'https://epoint.az/api/1/wallet/status';
    const signatureString = `${config.public.key}${config.public.pub}${config.public.key}`;
    const hash = SHA1(signatureString);

    // Browser və server mühitində işləyəcək şəkildə encode etmək
    const data = {
      public_key: config.public.pub,
    };

    // Browser-specific funksiyaları yoxlayın
    let encodedData, encodedSignature;

    if (typeof window !== 'undefined') {
      // Browser mühitində
      encodedData = btoa(JSON.stringify(data));
      encodedSignature = btoa(hash.toString(CryptoJS.enc.Latin1));
    } else {
      // Server mühitində
      encodedData = Buffer.from(JSON.stringify(data)).toString('base64');
      encodedSignature = Buffer.from(hash.toString(CryptoJS.enc.Latin1)).toString('base64');
    }

    const body = {
      data: encodedData,
      signature: encodedSignature
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API xətası: ${response.status}`);
    }

    const result = await response.json();
    console.log('Wallet məlumatları:', result);
    wallets.value = result;
  } catch (error) {
    console.error('Wallet məlumatlarını əldə edərkən xəta baş verdi:', error);
    $toast.error('Wallet məlumatlarını əldə edərkən xəta baş verdi');
  }
};
const total = computed(() => {
  let pricing = 0
  rows.value.data.forEach((x: any) => {
    pricing += x.total
  })
  return pricing.toFixed(2)
})
const sendBasketOrder = () => {
  setLoading(true)
  $api.post('user/basket/order', {
    basket: true
  }, headers.value).then(res => {
    $api.get('user/basket', headers.value).then(res => {
      setBaskets(res.data)
      rows.value = res
    })
    $api.get('user', headers.value).then(res => {
      setUserData(res.data)
    })
    router.push('/user/dashboard/orders').then(() => {
      $toast.success(res.data)
    })
  }).catch(err => {
    $toast.error(err)
  }).finally(() => setLoading(false))
}

const sendBasketOrderOnline = (payment_method, wallet_id) => {
  setLoading(true)
  $api.post('/user/payment/basket', {
    payment_method,
    wallet_id
  }, headers.value).then(res => {
    window.location.href = res.data
  }).catch(err => {
    $toast.error(err)
  }).finally(() => setLoading(false))
}

const deleteBasket = (id: any) => {
  $api.delete('user/basket/delete?basket_id=' + id, headers.value).then(res => {
    $api.get('user/basket', headers.value).then(res => {
      setBaskets(res.data)
      rows.value = res
    })
    $toast.success(res.data)
  }).catch(err => {
    $toast.error(err)
  })
  return false;
}
const updateBasket = (basket_id: any, count: any) => {
  setLoading(true)
  $api.patch('user/basket/edit', {
    basket_id,
    count
  }, headers.value).then(res => {
    $toast.success(res.data)
    $api.get('user/basket', headers.value).then(res => {
      setBaskets(res.data)
      rows.value = res
    }).finally(() => setLoading(false))
  }).catch(err => {$toast.error(err)
    setLoading(false)
  })
}
onMounted(() => {
  fetchWallets();
});

</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6">
    <form @submit.prevent="sendBasketOrder" name="basket" id="basket" method="post">

      <!-- BREADCRUMB -->
      <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px] text-ink-500 dark:text-ink-400 mb-4">
        <nuxt-link to="/" class="hover:text-brand-500 dark:hover:text-brand-400 transition">Ana Səhifə</nuxt-link>
        <svg class="w-3 h-3 shrink-0 text-ink-300 dark:text-ink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
        <span class="font-semibold text-ink-900 dark:text-white">Səbətim</span>
      </nav>

      <!-- Page title -->
      <div class="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-[22px] md:text-[26px] font-black tracking-tight text-ink-900 dark:text-white leading-tight">Səbətim</h1>
            <span v-if="rows.data.length" class="inline-flex items-center h-6 px-2 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-[11.5px] font-black tabular-nums ring-1 ring-brand-500/20">{{ rows.data.length }} məhsul</span>
          </div>
          <p class="mt-1 text-[12.5px] text-ink-500 dark:text-ink-400">Sifarişini yoxla və ödənişə keç.</p>
        </div>
        <nuxt-link to="/games" class="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-ink-50 dark:bg-ink-800 hover:bg-ink-100 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-200 text-[12.5px] font-bold transition">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Alış-verişə davam et
        </nuxt-link>
      </div>

      <!-- Two-column layout -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 mb-10">

        <!-- LEFT — Cart items -->
        <div class="space-y-4 min-w-0">
          <section v-if="rows.data.length" class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 overflow-hidden">
            <div class="hidden md:grid grid-cols-[80px_1fr_140px_120px_120px_44px] gap-3 px-5 py-3 bg-ink-50 dark:bg-ink-800/60 border-b border-ink-100 dark:border-ink-800 text-[10.5px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400">
              <span>Şəkil</span>
              <span>Məhsul</span>
              <span class="text-center">Ədəd</span>
              <span class="text-right">Qiymət</span>
              <span class="text-right">Cəm</span>
              <span></span>
            </div>

            <div class="divide-y divide-ink-100 dark:divide-ink-800">
              <article v-for="row in rows.data" :key="row.basket_id"
                        class="grid grid-cols-1 md:grid-cols-[80px_1fr_140px_120px_120px_44px] gap-3 md:gap-4 px-4 md:px-5 py-4 md:items-center">
                <div class="md:col-span-1 flex items-center gap-3 md:gap-0">
                  <nuxt-link :to="{name: 'game-product-slug', params: {slug: row.product.slug}}"
                             class="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-ink-100 dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-800">
                    <img :src="row.product.image" :alt="row.product.name" class="w-full h-full object-cover"/>
                  </nuxt-link>
                  <div class="md:hidden min-w-0 flex-1">
                    <nuxt-link :to="{name: 'game-product-slug', params: {slug: row.product.slug}}"
                               class="text-[13.5px] font-black text-ink-900 dark:text-white truncate hover:text-brand-500 transition">{{ row.product.name }}</nuxt-link>
                  </div>
                </div>

                <div class="hidden md:block min-w-0">
                  <nuxt-link :to="{name: 'game-product-slug', params: {slug: row.product.slug}}"
                             class="text-[13.5px] font-black text-ink-900 dark:text-white truncate hover:text-brand-500 transition block">{{ row.product.name }}</nuxt-link>
                </div>

                <div class="md:flex md:justify-center">
                  <span class="md:hidden text-[10.5px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-1">Ədəd</span>
                  <div class="inline-flex items-center justify-between w-[124px] h-10 rounded-xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 px-1">
                    <button type="button" @click="updateBasket(row.basket_id, row.count - 1)"
                            class="w-8 h-8 grid place-items-center rounded-lg text-ink-500 dark:text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 active:scale-90 transition" aria-label="Azalt">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 12h14"/></svg>
                    </button>
                    <span class="flex-1 grid place-items-center text-[14px] font-black tabular-nums text-ink-900 dark:text-white select-none">{{ row.count }}</span>
                    <button type="button" @click="updateBasket(row.basket_id, row.count + 1)"
                            class="w-8 h-8 grid place-items-center rounded-lg text-ink-500 dark:text-ink-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 active:scale-90 transition" aria-label="Artır">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                  </div>
                </div>

                <div class="md:text-right tabular-nums">
                  <span class="md:hidden text-[10.5px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-0.5">Qiymət</span>
                  <span class="text-[13px] font-black text-ink-700 dark:text-ink-200">{{ row.product.price.toFixed(2) }} AZN</span>
                </div>

                <div class="md:text-right tabular-nums">
                  <span class="md:hidden text-[10.5px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400 block mb-0.5">Cəm</span>
                  <span class="text-[14px] font-black text-emerald-600 dark:text-emerald-400">{{ (row.product.price * row.count).toFixed(2) }} AZN</span>
                </div>

                <div class="md:flex md:justify-end">
                  <button type="button" @click="deleteBasket(row.basket_id)"
                          class="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 grid place-items-center transition" aria-label="Sil">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              </article>
            </div>
          </section>

          <section v-else class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-10 text-center">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-ink-100 dark:bg-ink-800 grid place-items-center mb-3">
              <svg class="w-7 h-7 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>
            </div>
            <h3 class="text-[15px] font-black text-ink-900 dark:text-white">Səbətin boşdur</h3>
            <p class="mt-1 text-[12.5px] text-ink-500 dark:text-ink-400">Məhsul əlavə et və sifarişi tamamla.</p>
            <nuxt-link to="/games" class="mt-4 inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-[12.5px] font-bold transition shadow-pop">
              Məhsullara bax
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </nuxt-link>
          </section>

          <!-- Recommendations -->
          <section v-if="recommended.data.length" class="mt-2">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-[14px] font-black text-ink-900 dark:text-white">Bunlar da xoşuna gələ bilər</h2>
              <nuxt-link to="/games" class="text-[12px] font-bold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1 transition">
                Hamısına bax
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </nuxt-link>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <nuxt-link v-for="product in recommended.data" :key="product.slug"
                         :to="{name: 'game-product-slug', params: {slug: product.slug}}"
                         class="group flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 transition">
                <span class="shrink-0 w-11 h-11 rounded-lg overflow-hidden bg-ink-100 dark:bg-ink-800">
                  <img :src="product.image" :alt="product.name" class="w-full h-full object-cover"/>
                </span>
                <div class="min-w-0 flex-1">
                  <h4 class="text-[12px] font-black text-ink-900 dark:text-white truncate">{{ product.name }}</h4>
                  <p class="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold">{{ product.price.toFixed(2) }} AZN</p>
                </div>
                <svg class="w-3.5 h-3.5 text-ink-400 group-hover:text-brand-500 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </nuxt-link>
            </div>
          </section>
        </div>

        <!-- RIGHT — Summary -->
        <aside v-if="rows.data.length" class="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 overflow-hidden">
            <div class="px-5 py-4 border-b border-ink-100 dark:border-ink-800">
              <h2 class="text-[14px] font-black text-ink-900 dark:text-white">Sifariş yekunu</h2>
            </div>
            <div class="p-5 space-y-3">
              <div class="flex items-center justify-between text-[13px]">
                <span class="text-ink-600 dark:text-ink-300">Cəmi</span>
                <span class="font-black text-ink-900 dark:text-white tabular-nums">{{ total }} AZN</span>
              </div>
              <div class="flex items-center justify-between text-[13px]">
                <span class="text-ink-600 dark:text-ink-300">Kupon endirimi</span>
                <span class="font-black text-ink-400 dark:text-ink-500 tabular-nums">0,00 AZN</span>
              </div>
              <div class="pt-3 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between">
                <span class="text-[12px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400">Toplam</span>
                <div class="text-[20px] md:text-[22px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums leading-none">{{ total }} AZN</div>
              </div>
            </div>
          </section>

          <section class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-3 space-y-2">
            <button type="submit" class="w-full h-13 min-h-[52px] rounded-xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-700 hover:ring-brand-500 hover:text-brand-500 text-ink-700 dark:text-ink-200 font-black text-[13.5px] active:scale-[.99] transition flex items-center justify-between gap-2 px-4">
              <span class="flex items-center gap-2.5">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 12h20"/></svg>
                Balans ilə sifariş
              </span>
              <span class="inline-flex items-center h-5 px-1.5 rounded-md bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-wider uppercase">0% komissiya</span>
            </button>

            <button type="button" @click="sendBasketOrderOnline('epoint', 0)"
                    class="w-full h-12 min-h-[48px] rounded-xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-700 hover:ring-brand-500 hover:text-brand-500 text-ink-700 dark:text-ink-200 font-bold text-[13px] transition flex items-center justify-between gap-2 px-4">
              <span class="flex items-center gap-2.5">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 12h20"/></svg>
                Kart ilə sifariş
              </span>
              <span class="inline-flex items-center h-5 px-1.5 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px] font-black tracking-wider uppercase">3% komissiya</span>
            </button>

            <button v-for="(wallet, key) in wallets" :key="key" type="button" @click="sendBasketOrderOnline('wallet', key)"
                    class="w-full h-12 min-h-[48px] rounded-xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-700 hover:ring-brand-500 hover:text-brand-500 text-ink-700 dark:text-ink-200 font-bold text-[13px] transition flex items-center justify-between gap-2 px-4">
              <span class="flex items-center gap-2.5">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 12h20"/></svg>
                {{ wallet }} ilə sifariş
              </span>
              <span class="inline-flex items-center h-5 px-1.5 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px] font-black tracking-wider uppercase">{{ key === '9' || key === '10' ? '1,5%' : '3%' }} komissiya</span>
            </button>

            <nuxt-link to="/games" class="w-full h-11 rounded-xl bg-ink-50 dark:bg-ink-800 hover:bg-ink-100 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-200 font-bold text-[12.5px] transition flex items-center justify-center gap-1.5">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Alış-verişə davam et
            </nuxt-link>
          </section>

          <div class="flex items-center justify-center gap-2 flex-wrap">
            <span class="text-[10.5px] font-bold text-ink-500 dark:text-ink-400">Qəbul edirik:</span>
            <span class="inline-flex items-center h-5 px-1.5 rounded bg-white dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[9.5px] font-black tracking-wider text-ink-700 dark:text-ink-200">VISA</span>
            <span class="inline-flex items-center h-5 px-1.5 rounded bg-white dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[9.5px] font-black tracking-wider text-ink-700 dark:text-ink-200">MASTERCARD</span>
            <span class="inline-flex items-center h-5 px-1.5 rounded bg-white dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[9.5px] font-black tracking-wider text-ink-700 dark:text-ink-200">m10</span>
            <span class="inline-flex items-center h-5 px-1.5 rounded bg-white dark:bg-ink-800 ring-1 ring-ink-200 dark:ring-ink-700 text-[9.5px] font-black tracking-wider text-ink-700 dark:text-ink-200">MilliÖN</span>
          </div>

          <div class="flex items-center justify-center gap-3 text-[10.5px] text-ink-500 dark:text-ink-400">
            <span class="inline-flex items-center gap-1">
              <svg class="w-3 h-3 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              256-bit SSL
            </span>
            <span>·</span>
            <span class="inline-flex items-center gap-1">
              <svg class="w-3 h-3 text-brand-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              ~30 saniyə
            </span>
          </div>
        </aside>
      </div>
    </form>
  </main>
</template>

<style scoped>
</style>