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
  <main>
    <div class="container">
      <form @submit.prevent="sendBasketOrder" name="basket" id="basket" method="post">
        <div class="row reset-margin manual">
          <div class="col-xl-9">
            <div aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <nuxt-link to="/">Ana Səhifə</nuxt-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Səbətim</li>
              </ol>
            </div>
            <div v-if="rows.data.length" class="user-cart">
              <table>
                <thead>
                <tr>
                  <th scope="col">Şəkil</th>
                  <th scope="col">Adı</th>
                  <th scope="col">Ədəd</th>
                  <th scope="col">Qiymət</th>
                  <th scope="col">Cəm</th>
                  <th scope="col">Sil</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="row in rows.data">
                  <td data-label="Şəkil">
                    <nuxt-link :to="{name: 'game-product-slug', params: {slug: row.product.slug}}"><img
                        :src="row.product.image"
                        :alt="row.product.name"></nuxt-link>
                  </td>
                  <td data-label="Adı">
                    <p class="cart-name">
                      <nuxt-link
                          :to="{name: 'game-product-slug', params: {slug: row.product.slug}}">{{ row.product.name }}
                      </nuxt-link>
                    </p>
                  </td>
                  <td data-label="Ədəd">
                    <p>
                      <input @click="updateBasket(row.basket_id, row.count - 1)" type='button' value='-'
                             class='qtyminus'
                             field='quantity'/>
                      <input :value="row.count" type='number' name='qty'
                             class='qty'/>
                      <input @click="updateBasket(row.basket_id, row.count +1)" type='button' value='+' class='qtyplus'
                             field='quantity'/>
                    </p>
                  </td>
                  <td data-label="Qiymət">
                    <p>{{ (row.product.price).toFixed(2) }} Azn</p>
                  </td>
                  <td data-label="Cəm">
                    <p>{{ (row.product.price * row.count).toFixed(2) }} Azn</p>
                  </td>
                  <td data-label="Sil">
                    <p class="cart-delete"><a @click="deleteBasket(row.basket_id)"
                                              style="cursor: pointer"><i
                        class="fal fa-trash-alt"></i></a></p>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="user-cart">
              <div class="card-body2 card2">
                <div class="text-center"><img src="/img/empty-cart1.svg" width="110" height="110"
                                              class="mb-2">
                  <h3><strong>Səbətiniz boşdur</strong></h3>
                  <h4>Bizi seçdiyiniz üçün təşəkkür edirik ! 😊</h4>
                  <nuxt-link to="/games" class="goo"><i class="fas fa-arrow-alt-left"></i>
                    Alış-verişə davam
                    et
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3">
            <div class="container-fluid cart-price">
              <div class="row">
                <div class="col-md-12 cart-parts">
                  <div class="row">
                    <div class="col-7">
                      <strong>Cəmi :</strong>
                    </div>
                    <div class="col-5 text-right">
                      <span>{{ total }} Azn</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-12 cart-parts">
                  <div class="row">
                    <div class="col-7">
                      <strong>Kupon Endirimi :</strong>
                    </div>
                    <div class="col-5 text-right">
                      <span>0.00 Azn</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-12 cart-parts">
                  <div class="row">
                    <div class="col-7">
                      <strong>Toplam :</strong>
                    </div>
                    <div class="col-5 text-right">
                      <span>{{ total }} Azn</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div v-if="rows.data.length" class="order-ok">
                  <button type="submit">
                    <span>Balans ilə sifariş</span>
                    <span class="btn-commission">0% Komissiya</span>
                  </button>
                  <button @click="sendBasketOrderOnline('epoint', 0)" type="button">
                    <span>Kart ilə sifariş</span>
                    <span class="btn-commission">3% Komissiya</span>
                  </button>
                  <button @click="sendBasketOrderOnline('wallet', key)" v-for="(wallet, key) in wallets" :key="key" type="button">
                    <span>{{wallet}} ilə sifariş</span>
                    <span class="btn-commission">{{ key === '9' || key === '10' ? '1,5%' : '3%' }} Komissiya</span>
                  </button>
                </div>
              </div>
              <div class="col-md-12">
                <div class="order-continue">
                  <nuxt-link to="/games">Alış-verişə davam et</nuxt-link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>

  </main>
</template>

<style scoped>
.order-ok button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
}

.btn-commission {
  font-size: 12px;
  color: #e0e0e0;
  margin-top: 2px;
}
</style>