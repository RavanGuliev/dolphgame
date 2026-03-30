<script setup lang="ts">
import {computed, ref, onMounted} from "vue";
import {authStore} from "~/stores/authStore";
import {loadingStore} from "~/stores/loadingStore";
import {useRouter} from "vue-router";
import SHA1 from "crypto-js/sha1";
import CryptoJS from "crypto-js";

const {$api, $toast} = useNuxtApp()
const router = useRouter()
const props = defineProps({
  product: {
    required: true,
  },
  game: {
    required: true,
  },
  qty: {
    required: true
  }
})
const product = computed(() => props.product)
const game = computed(() => props.game)
const qty = computed(() => props.qty)
const auth = authStore()
const {headers} = storeToRefs(auth)
const {setUserData} = auth
const {user} = auth
const loadingStore1 = loadingStore()
const {setLoading} = loadingStore1
const infos = ref({})
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

// Komponent yükləndikdə wallet məlumatlarını əldə et
onMounted(() => {
  fetchWallets();
});

const makeOrder = () => {
  setLoading(true)
   let url = ''
  if (paymentMethod.value === 'balance') {
     url = 'user/order'
  } else {
     url = '/user/payment/product'
  }
  $api.post(url, {
    product: product.value.id,
    info: infos.value,
    count: qty.value,
    payment_method: paymentMethod.value === 'epoint'? 'epoint' : 'wallet',
    wallet_id: paymentMethod.value,
  }, headers.value).then(res => {
    if (paymentMethod.value === 'balance') {
      $toast.success(res.data)
      router.push('/user/dashboard/orders')
      $api.get('user',  headers.value).then(res => {
        setUserData(res.data)
      })
      $('#orderModal').modal('hide')
    } else {
      window.location.href = res.data
    }

  }).catch(err => {
    $toast.error(err)
  }).finally(() => {
    setLoading(false)
  })
}
</script>

<template>
  <div class="modal fade product-modal" id="orderModal"
       tabindex="-1" role="dialog"
       aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle"><i
              class="fa fa-info-circle"></i> {{product.name}}</h5>
          <button type="button" class="close" data-dismiss="modal"
                  aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="makeOrder" method="post" class="order-modal"
                action="/">
            <div v-for="(info, key) in game.info">
              <span class="text-danger">{{key}}</span>
              <input v-model="infos[`${key}`]" required name="request" type="text"
                     class="form-control" :placeholder="info"
              >
            </div>
            <div class="all-choose">
              <div class="products-qty">
                <p>Miqdarı</p>
                <input @click="$emit('decrementFromChildren')" type='button' value='-' class='qtyminus'
                       field='quantity'/>
                <input type='number' name='qty'
                       :value='qty'
                       class='qty'/>
                <input @click="$emit('incrementFromChildren')" type='button' value='+' class='qtyplus'
                       field='quantity'/>
              </div>
              <div class="products-price">
                <p>Qiyməti</p>
                <span class="get_price">{{(product.price * qty).toFixed(2)}} Azn</span>
              </div>

              <div class="theme-btn">
                <p>Bonus</p>
                <span><i class="fas fa-star"></i> <b class="data-point">{{product.bonus * qty}}</b></span>
              </div>
            </div>

            <!-- Ödəniş üsulları bölməsi -->
            <div class="payment-methods-section">
              <h6 class="payment-section-title">Ödəniş üsulunu seçin</h6>

              <div class="payment-methods-grid">
                <!-- Balans ilə ödəniş -->
                <div class="payment-method-card" :class="{ 'active': paymentMethod === 'balance' }">
                  <input type="radio" id="payment-balance" name="payment-method" value="balance" v-model="paymentMethod">
                  <label for="payment-balance">
                    <div class="payment-method-icon">
                      <i class="fas fa-wallet"></i>
                    </div>
                    <div class="payment-method-details">
                      <span class="payment-method-name">Balans</span>
                      <span class="payment-method-info">Hesabınızdakı balans ilə ödəniş</span>
                      <span class="payment-method-info payment-commission">0% Komissiya</span>
                    </div>
                  </label>
                </div>

                <!-- Kart ilə ödəniş -->
                <div  v-if="user?.level === 'normal'" class="payment-method-card" :class="{ 'active': paymentMethod === 'epoint' }">
                  <input type="radio" id="payment-card" name="payment-method" value="epoint" v-model="paymentMethod">
                  <label for="payment-card">
                    <div class="payment-method-icon">
                      <i class="fas fa-credit-card"></i>
                    </div>
                    <div class="payment-method-details">
                      <span class="payment-method-name">Kart ilə</span>
                      <span class="payment-method-info">Visa, MasterCard, Maestro</span>
                      <span class="payment-method-info payment-commission">3% Komissiya</span>
                    </div>
                  </label>
                </div>

                <!-- Digər ödəniş üsulları -->
                <div v-if="user?.level === 'normal'"
                  v-for="(wallet, key) in wallets"
                  :key="key"
                  class="payment-method-card"
                  :class="{ 'active': paymentMethod === key }"
                >
                  <input type="radio" :id="`payment-${key}`" name="payment-method" :value="key" v-model="paymentMethod">
                  <label :for="`payment-${key}`">
                    <div class="payment-method-icon">
                      <i class="fas fa-money-bill-wave"></i>
                    </div>
                    <div class="payment-method-details">
                      <span class="payment-method-name">{{ wallet }}</span>
                      <span class="payment-method-info">Elektron pul kisəsi</span>
                      <span class="payment-method-info payment-commission">{{ key === '9' || key === '10' ? '1,5%' : '3%' }} Komissiya</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div class="clearfix"></div>
            <div class="footer-btn">
              <button type="submit">Sifariş et</button>
              <button data-dismiss="modal" type="button">Çıxış</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ödəniş üsulları bölməsi */
.payment-methods-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.payment-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.payment-methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.payment-method-card {
  position: relative;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.25s ease;
  overflow: hidden;
  cursor: pointer;
}

.payment-method-card:hover {
  border-color: #f9a533;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.payment-method-card.active {
  border-color: #f9a533;
  background-color: rgba(249, 165, 51, 0.05);
  box-shadow: 0 4px 10px rgba(249, 165, 51, 0.15);
}

.payment-method-card input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.payment-method-card label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 10px;
  text-align: center;
  height: 100%;
  margin: 0;
  cursor: pointer;
}

.payment-method-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #f9a533;
  border-radius: 50%;
  margin-bottom: 10px;
  color: white;
  transition: all 0.3s ease;
}

.payment-method-card:hover .payment-method-icon {
  transform: scale(1.1);
}

.payment-method-card.active .payment-method-icon {
  background: #f9a533;
  box-shadow: 0 0 0 4px rgba(249, 165, 51, 0.2);
}

.payment-method-details {
  display: flex;
  flex-direction: column;
}

.payment-method-name {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 3px;
}

.payment-method-info {
  font-size: 0.75rem;
  color: #777;
  line-height: 1.2;
}

.payment-commission {
  margin-top: 4px;
  color: #f9a533 !important;
}

/* Animasiya effektləri */
@keyframes selectPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(249, 165, 51, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(249, 165, 51, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(249, 165, 51, 0);
  }
}

.payment-method-card.active {
  animation: selectPulse 1s;
}
</style>
