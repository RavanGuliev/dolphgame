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
  console.log(paymentMethod.value);
});
</script>

<template>
  <main>
    <!-- Mobile and PC title -->
    <div class="container payment-method-banner set-size">
      <div class="row">
        <div class="col-md-12">
          <div class="main-title">
            <h5>Ödəniş üsulları</h5>
            <div class="single-sub-menu">
              <!-- <i class="fal fa-angle-down"></i> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PC and Mobile sub title -->
    <div class="container">
      <div class="row reset-margin">
        <!-- PC sub menus -->
        <div class="col-lg-3">
          <payment-sidebar />
        </div>

        <!-- Mobile and PC menu and payments -->
        <div class="col-lg-9">
          <div class="right-part">
            <div class="row hide-show">
              <!-- Payment form section -->
              <div class="col-md-12">
                <div class="online-payment-wrapper">
                  <!-- Title Container -->
                  <div class="payment-header-container">
                    <h4 class="payment-title">Kredit / Bank Kartı</h4>
                    <p class="payment-subtitle">Ödəmələr 7/24 avtomatik olaraq həyata keçirilir.</p>
                  </div>

                  <!-- Form Container -->
                  <div class="payment-form-container">
                    <form @submit.prevent="submitPayment" class="payment-form">
                      <div class="form-group">
                        <label for="amount">Məbləği daxil edin</label>
                        <div class="input-button-group">
                          <div class="input-group">
                            <div class="input-icon">
                              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 0C5.44688 0 5 0.446875 5 1V2.08437C2.1625 2.55937 0 5.02812 0 8V13C0 13.5531 0.446875 14 1 14C1.55313 14 2 13.5531 2 13V8C2 6.1375 3.275 4.56875 5 4.125V13C5 13.5531 5.44688 14 6 14C6.55312 14 7 13.5531 7 13V4.125C8.725 4.56875 10 6.13438 10 8V13C10 13.5531 10.4469 14 11 14C11.5531 14 12 13.5531 12 13V8C12 5.02812 9.8375 2.55937 7 2.08437V1C7 0.446875 6.55312 0 6 0Z" fill="#FF4800"/>
                              </svg>
                            </div>
                            <input
                              id="amount"
                              v-model="amount"
                              type="number"
                              class="form-control"
                              placeholder="Yükləmək istədiyin məbləği daxil edin.."
                              min="1"
                              step="0.01"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            class="btn-payment"
                            :disabled="isLoading"
                          >
                            <span v-if="!isLoading">
                              <i class="fas fa-lock"></i> Ödəniş et
                            </span>
                            <span v-else>
                              <i class="fas fa-spinner fa-spin"></i> Gözləyin...
                            </span>
                          </button>
                        </div>
                      </div>
                      
                      <!-- Commission Summary Box -->
                      <div v-if="amount && Number(amount) > 0" class="commission-summary">
                        <div class="summary-row">
                          <span class="summary-label">Balansa yüklənəcək</span>
                          <span class="summary-value">{{ commission.balance.toFixed(2) }} AZN</span>
                        </div>
                        <div class="summary-row commission-row">
                          <span class="summary-label">Provayder komissiyası</span>
                          <span class="summary-value commission-value">{{ commission.label }}</span>
                        </div>
                        <div class="summary-divider"></div>
                        <div class="summary-row total-row">
                          <span class="summary-label">Yekun Məbləğ</span>
                          <span class="summary-value total-value">{{ commission.total.toFixed(2) }} AZN</span>
                        </div>
                      </div>
                      
                      <transition name="scale-fade">
                        <div class="payment-frame" v-if="iframe">
                          <div class="frame-header">
                            <i class="fas fa-shield-check"></i>
                            <span>Təhlükəsiz ödəniş</span>
                          </div>
                          <iframe
                            :src="iframe"
                            allow="payment"
                            frameborder="0"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-payment"
                          ></iframe>
                        </div>
                      </transition>
                    </form>
                  </div>
                </div>
              </div>

              <!-- Payment instructions -->
              <div class="col-md-12">
                <div class="payment-instructions">
                  <!-- Instructions Container with Background -->
                  <div class="instruction-container">
                    <!-- Header with logo -->
                    <div class="instruction-header">
                      <div class="instruction-logo">
                        <img src="/img/payments/bank-karti.png" alt="Bank kartı" />
                      </div>
                      <div class="instruction-title-section">
                        <h5 class="instruction-title">Kredit / Bank kartı ilə necə ödəniş edilir?</h5>
                        <p class="instruction-subtitle">Aşağıdan izləyə bilərsiniz.</p>
                      </div>
                    </div>
                    
                    <!-- Instructions list -->
                    <ul class="instruction-list">
                      <li>Yükləmək istədiyiniz məbləği daxil edin.</li>
                      <li>Provayder komissiyasına uyğun məbləğ avtomatik hesablanacaq.</li>
                      <li>Balansınızdan çıxılacaq yekun məbləğ "Yekun məbləğ" bölməsində göstəriləcək.</li>
                      <li>"Ödəniş et" düyməsinə klik edərək ödənişi davam etdirin.</li>
                      <li>Bankın təhlükəsiz ödəniş səhifəsinə yönləndiriləcəksiniz.</li>
                      <li>Kart məlumatlarınızı daxil edin və ödənişi təsdiqləyin.</li>
                      <li>Ödəniş tamamlandıqdan sonra balansınız avtomatik olaraq artırılacaq.</li>
                    </ul>
                  </div>
                  
                  <div class="support-note">
                    <p>
                      Hər hansı problem yaşayırsınızsa,
                      <nuxt-link to="/pages/contact">dəstək komandamızla</nuxt-link>
                      əlaqə saxlayın.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Payment features section */
.payment-features {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

.feature-item {
  flex: 1;
  min-width: 200px;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  background: #f9a533;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  box-shadow: 0 4px 10px rgba(249, 165, 51, 0.2);
}

.feature-icon i {
  color: white;
  font-size: 1.2rem;
}

.feature-text h5 {
  margin: 0 0 5px 0;
  font-weight: 600;
  color: #333;
}

.feature-text p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

/* Payment form styling */
.online-payment-wrapper {
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  margin-bottom: 30px;
  overflow: visible;
  border: none;
}

.payment-header-container {
  background: #F9F9F9;
  border-radius: 12px;
  padding: 24px 32px;
  margin-bottom: 16px;
}

.payment-form-container {
  background: #F9F9F9;
  border-radius: 12px;
  padding: 20px
}

.payment-card {
  width: 100%;
}

.payment-content {
  padding: 32px;
}

.payment-title {
  font-size: 1.5rem;
  margin-bottom: 8px;
  font-weight: 600;
  color: #000;
}

.payment-subtitle {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
}

.payment-form {
  padding: 0;
  background: transparent;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #000;
  margin-bottom: 12px;
  font-size: 1rem;
}

.input-button-group {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.input-group {
  flex: 1;
  display: flex;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  background: #fff;
  transition: all 0.3s ease;
  height: 48px;
}

.input-group:focus-within {
  border-color: #ff5722;
  box-shadow: 0 0 0 3px rgba(255, 87, 34, 0.1);
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 0 16px;
}

.input-icon svg {
  width: 12px;
  height: 14px;
}

.form-control {
  flex: 1;
  padding: 0 16px;
  border: none;
  font-size: 1rem;
  font-weight: 400;
  color: #000;
  background: transparent;
  height: 48px;
}

.form-control::placeholder {
  color: #999;
}

.form-control:focus {
  outline: none;
}

.input-suffix {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 0 16px;
  font-weight: 600;
  color: #666;
}

/* Commission Summary Box */
.commission-summary {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  margin-top: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.summary-label {
  color: #595959;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 400;
}

.summary-label i {
  font-size: 0.8rem;
}

.summary-value {
  font-weight: 400;
  color: #000;
  font-size: 0.95rem;
}

.commission-value {
  color: #000;
  font-weight: 400;
}

.summary-divider {
  height: 1px;
  background: #E5E5E5;
  margin: 8px 0;
}

.total-row {
  padding-top: 4px;
}

.total-row .summary-label {
  color: #000;
  font-weight: 600;
  font-size: 20px;
}

.total-row .total-value {
  font-size: 1.1rem;
  color: #000;
  font-weight: 700;
}

/* Remove spinner buttons from number input */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.btn-payment {
  background: #ff5722;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 180px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-payment i {
  margin-right: 6px;
}

.btn-payment:hover:not(:disabled) {
  background: #f4511e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.3);
}

.btn-payment:disabled {
  background: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

.payment-methods {
  padding: 20px 25px;
  background: #fff;
  border-top: 1px solid #eaeaea;
}

.payment-methods p {
  margin-bottom: 12px;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.payment-icons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.payment-icons img {
  height: 28px;
  width: auto;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.payment-icons img:hover {
  opacity: 1;
}

.payment-icons i {
  font-size: 2rem;
  color: var(--new-default-orange);
}

/* Payment Instructions */
.payment-instructions {
  background: transparent;
}

.instruction-container {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.instruction-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: transparent;
  padding: 0;
  border-radius: 0;
  margin-bottom: 20px;
}

.instruction-logo {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
}

.instruction-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.instruction-title-section {
  flex: 1;
}

.instruction-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 4px 0;
}

.instruction-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.instruction-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.instruction-list li {
  position: relative;
  padding-left: 24px;
  margin-bottom: 12px;
  color: #454545;
  font-size: 0.95rem;
  line-height: 1.6;
}

.instruction-list li:before {
  content: "•";
  position: absolute;
  left: 8px;
  color: #000;
  font-weight: bold;
}

.support-note {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  padding-top: 10px;
  margin-top: 20px;
}

.support-note p {
  color: #666;
}

.support-note a {
  color: #ff5722;
  text-decoration: none;
  font-weight: 500;
}

.support-note a:hover {
  text-decoration: underline;
}

/* Payment methods selection styling */
.payment-methods-selection {
  margin-bottom: 25px;
}

.payment-methods-selection h6 {
  font-weight: 600;
  color: #555;
  margin-bottom: 15px;
  font-size: 1rem;
}

.payment-methods-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.payment-method-item {
  position: relative;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.payment-method-item:hover {
  border-color: #fcd6c4;
  box-shadow: 0 4px 12px rgba(255, 113, 30, 0.1);
  transform: translateY(-2px);
}

.payment-method-item.active {
  border-color: var(--new-default-orange);
  background: linear-gradient(135deg, #fff5f0 0%, #fff 100%);
  box-shadow: 0 4px 16px rgba(255, 113, 30, 0.15);
}

.payment-method-item input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.payment-method-item label {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  width: 100%;
  margin: 0;
  gap: 15px;
}

.method-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--new-main-gradient);
  border-radius: 12px;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.method-icon.wallet {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.payment-method-item:hover .method-icon {
  transform: scale(1.05);
}

.payment-method-item.active .method-icon {
  box-shadow: 0 0 0 4px rgba(255, 113, 30, 0.2);
}

.method-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.method-name {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
  margin-bottom: 3px;
}

.method-description {
  font-size: 0.85rem;
  color: #888;
}

.method-commission {
  padding: 8px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.method-commission.free {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #059669;
}

.method-commission.paid {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
}

.payment-method-item::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 100px;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border: 2px solid #ddd;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.payment-method-item.active::after {
  border-color: var(--new-default-orange);
  background: var(--new-default-orange);
  box-shadow: inset 0 0 0 4px white;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .payment-features {
    flex-direction: column;
  }

  .feature-item {
    min-width: 100%;
  }

  .payment-header {
    padding: 25px 20px;
  }

  .payment-logo {
    width: 60px;
    height: 60px;
  }

  .payment-header h4 {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .input-button-group {
    flex-direction: column;
    gap: 0;
  }
  
  .input-group {
    margin-bottom: 16px;
  }
  
  .btn-payment {
    width: 100%;
    margin-top: 16px;
    order: 2;
  }
  
  .commission-summary {
    order: 1;
    margin-bottom: 0;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .payment-instructions ol {
    padding-left: 15px;
  }

  .payment-icons img {
    height: 24px;
  }

  .btn-payment {
    padding: 0.8rem 1rem;
    font-size: 1rem;
  }

  .payment-logo {
    width: 50px;
    height: 50px;
    margin-bottom: 15px;
  }

  .payment-logo i {
    font-size: 1.5rem;
  }

  .feature-icon {
    width: 40px;
    height: 40px;
  }

  .feature-icon i {
    font-size: 1rem;
  }

  .feature-text h5 {
    font-size: 1rem;
  }

  .feature-text p {
    font-size: 0.8rem;
  }
  
  .payment-method-item label {
    padding: 14px;
    flex-wrap: wrap;
  }
  
  .method-icon {
    width: 42px;
    height: 42px;
  }
  
  .method-name {
    font-size: 0.95rem;
  }
  
  .method-description {
    font-size: 0.8rem;
  }
  
  .method-commission {
    margin-top: 10px;
    width: 100%;
    text-align: center;
  }
  
  .payment-method-item::after {
    right: 14px;
    top: 25px;
    transform: none;
  }
  
  .header-commission-badge {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
  
  .commission-summary {
    padding: 14px;
  }
  
  .summary-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .total-row .summary-value.highlight {
    font-size: 1.1rem;
  }
}

/* Animation effects */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.btn-payment:not(:disabled):active {
  transform: scale(0.98);
}

.payment-logo {
  animation: pulse 2s infinite;
}

/* Focus styles for better accessibility */
.form-control:focus {
  border-color: var(--new-default-orange);
  box-shadow: 0 0 0 0.2rem rgba(255, 113, 30, 0.25);
  outline: none;
}

/* Scale fade animation for iframe */
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 0.3s ease;
}

.scale-fade-enter-from,
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Payment frame styling */
.payment-frame {
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.payment-frame .frame-header {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.payment-frame iframe {
  width: 100%;
  height: 400px;
  border: none;
}
</style>
