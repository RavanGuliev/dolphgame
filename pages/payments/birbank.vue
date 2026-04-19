<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
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

definePageMeta({
  middleware: "auth",
});

if (user?.level !== "normal") {
  router.push("/payments");
}

useHead({
  title: 'Birbank QR ilə Balans Artırma'
});

// Commission rates for Birbank - 1.5%
const commissionRate = 0.015;

// Calculate commission and total
const commission = computed(() => {
  const amountNum = Number(amount.value) || 0;
  const commissionAmount = amountNum * commissionRate;
  
  return {
    rate: commissionRate,
    amount: commissionAmount,
    balance: amountNum,
    total: amountNum + commissionAmount,
    label: '1,5%',
    type: 'paid'
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
  
  setLoading(true);
  isLoading.value = true;
  
  $api
    .post(
      "user/payment/balance",
      {
        amount: amount.value,
        payment_method: "wallet",
        wallet_id: "10",
      },
      userStore.headers
    )
    .then((res) => {
      if (res.data) {
        window.location.href = res.data;
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
                    <h4 class="payment-title">Birbank QR ilə ödəniş etmək</h4>
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
                        <img src="/img/payments/birbank-logo.png" alt="Birbank QR" />
                      </div>
                      <div class="instruction-title-section">
                        <h5 class="instruction-title">Birbank QR ilə necə ödəniş edilir?</h5>
                        <p class="instruction-subtitle">Aşağıdan izləyə bilərsiniz.</p>
                      </div>
                    </div>
                    
                    <!-- Instructions list -->
                    <ul class="instruction-list">
                      <li>Yükləmək istədiyiniz məbləği daxil edin.</li>
                      <li>Sistem provayder komissiyasını avtomatik hesablayacaq və yekun məbləği göstərəcək.</li>
                      <li><strong>"Ödəniş et"</strong> düyməsinə klik edərək prosesi başladın.</li>
                    </ul>
                    
                    <h6 class="instruction-subheading">Kompüterlə ödəniş edirsinzsə:</h6>
                    <ul class="instruction-list">
                      <li>Ekranda <strong>Birbank QR</strong> kod açılacaq.</li>
                      <li>Mobil telefonunuzdan <strong>Birbank tətbiqini</strong> açaraq <strong>QR kodu</strong> oxudun.</li>
                    </ul>
                    
                    <h6 class="instruction-subheading">Telefonla ödəniş edirsinzsə:</h6>
                    <ul class="instruction-list">
                      <li>Birbank tətbiqi <strong>avtomatik</strong> açılacaq.</li>
                      <li>Ödənişi sadəcə <strong>təsdiqləməyiniz kifayətdir.</strong></li>
                      <li>Ödəniş təsdiqlendikden sonra məbləğ balansınızdan çıxılır.</li>
                      <li>Proses tamamlandıqdan sonra <strong>balansınız avtomatik olaraq artır.</strong></li>
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
/* Same styles as online.vue */
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
  margin-bottom: 20px;
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

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

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
  padding: 4px 0;
}

.summary-label {
  color: #595959;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 400;
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
  font-weight: 700;
  color: #000;
  margin: 0 0 4px 0;
}

.instruction-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.instruction-subheading {
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin: 24px 0 12px 0;
}

.instruction-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.instruction-list li {
  position: relative;
  padding-left: 24px;
  color: #454545;
  font-size: 16px;
  line-height: 1.6;
}

.instruction-list li strong {
  font-weight: 600;
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
  
  .payment-header {
    padding: 25px 20px;
  }
  
  .payment-logo {
    width: 80px;
    height: 80px;
  }
  
  .payment-method-logo {
    width: 60px;
    height: 60px;
  }
}
</style>

