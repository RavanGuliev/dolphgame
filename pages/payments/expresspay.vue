<script setup lang="ts">
import { ref } from "vue";
import { authStore } from "#imports";
import PaymentSidebar from "~/components/payments/paymentSidebar.vue";

const userStore = authStore();
const { user } = userStore;
const { $toast } = useNuxtApp();

definePageMeta({
  middleware: "auth",
});

useHead({
  title: 'Express Pay ilə Balans Artırma'
});

const copyCustomerId = () => {
  if ((user as any)?.id) {
    navigator.clipboard.writeText((user as any).id.toString()).then(() => {
      $toast.success('Müştəri nömrəsi kopyalandı!')
    }).catch(() => {
      $toast.error('Kopyalama zamanı xəta baş verdi')
    })
  }
}
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
              <!-- Payment header section -->
              <div class="col-md-12">
                <div class="terminal-payment-wrapper">
                  <div class="payment-card">
                    <div class="payment-header">
                      <div class="payment-logo">
                        <img src="/img/payments/express-logo.png" alt="Express Pay" class="payment-method-logo">
                      </div>
                      <h4>Express Pay</h4>
                      <h3>ilə Balans Artırma</h3>
                      <p>Express Pay terminalları vasitəsilə hesab balansınızı dərhal artırın</p>
                      
                      <!-- Commission Badge -->
                      <div class="header-commission-badge warning">
                        <i class="fas fa-exclamation-circle"></i>
                        <span>Komissiya: <strong>3%</strong></span>
                      </div>
                    </div>

                    <!-- Commission Alert -->
                    <div class="commission-alert">
                      <div class="alert-icon">
                        <i class="fas fa-info-circle"></i>
                      </div>
                      <div class="alert-content">
                        <strong>Komissiya haqqında məlumat</strong>
                        <p>Express Pay terminalları vasitəsilə ödəniş edərkən <strong>3%</strong> komissiya tutulur. Məsələn, 100 AZN ödəyərkən balansınıza 97 AZN əlavə olunacaq.</p>
                        <div class="commission-tip">
                          <i class="fas fa-lightbulb"></i>
                          <span>Komissiyasız ödəniş üçün <nuxt-link to="/payments">Qəbz ilə ödəniş</nuxt-link> üsulunu istifadə edin.</span>
                        </div>
                      </div>
                    </div>

                    <!-- Customer ID Section -->
                    <div class="customer-id-section">
                      <h5>Sizin müştəri nömrəniz</h5>
                      <div class="customer-id-container">
                        <div class="customer-id">{{ (user as any)?.id }}</div>
                        <button @click="copyCustomerId" class="copy-btn">
                          <i class="fas fa-copy"></i>
                          Kopyala
                        </button>
                      </div>
                    </div>

                    <!-- Instructions Section -->
                    <div class="instructions-section">
                      <h5><i class="fas fa-list-ol"></i> Addım-addım təlimat</h5>
                      <div class="instruction-steps">
                        <div class="step-item">
                          <div class="step-number">1</div>
                          <div class="step-content">
                            <h6>Express Pay terminalına yaxınlaşın</h6>
                            <p>Sizə ən yaxın Express Pay terminalını tapın</p>
                            <div class="step-icon">
                              <i class="fas fa-map-marker-alt"></i>
                            </div>
                          </div>
                        </div>

                        <div class="step-item">
                          <div class="step-number">2</div>
                          <div class="step-content">
                            <h6>Əyləncə və oyun bölməsinə keçid edin</h6>
                            <p>Terminal ekranında "Əyləncə və oyun" bölməsini seçin</p>
                            <div class="step-icon">
                              <i class="fas fa-gamepad"></i>
                            </div>
                          </div>
                        </div>

                        <div class="step-item">
                          <div class="step-number">3</div>
                          <div class="step-content">
                            <h6>dolphgame.com seçin</h6>
                            <p>Əyləncə və oyun bölməsində "dolphgame.com" xidmətini tapın və seçin</p>
                            <div class="step-icon">
                              <i class="fas fa-mouse-pointer"></i>
                            </div>
                          </div>
                        </div>

                        <div class="step-item">
                          <div class="step-number">4</div>
                          <div class="step-content">
                            <h6>Müştəri nömrənizi daxil edin</h6>
                            <p>Müştəri kodu yerinə {{ (user as any)?.id }} nömrəsini daxil edin</p>
                            <div class="step-icon">
                              <i class="fas fa-keyboard"></i>
                            </div>
                          </div>
                        </div>

                        <div class="step-item">
                          <div class="step-number">5</div>
                          <div class="step-content">
                            <h6>Ödənişi tamamlayın</h6>
                            <p>Ödəniş tamamlandıqdan sonra balansınız avtomatik artırılacaq (3% komissiya çıxılmaqla)</p>
                            <div class="step-icon">
                              <i class="fas fa-check-circle"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Commission Calculator -->
                    <div class="commission-calculator">
                      <h5><i class="fas fa-calculator"></i> Komissiya kalkulyatoru</h5>
                      <div class="calc-examples">
                        <div class="calc-row">
                          <span class="calc-input">10 AZN ödəsəniz</span>
                          <span class="calc-arrow"><i class="fas fa-arrow-right"></i></span>
                          <span class="calc-output">9.70 AZN balansa əlavə</span>
                        </div>
                        <div class="calc-row">
                          <span class="calc-input">50 AZN ödəsəniz</span>
                          <span class="calc-arrow"><i class="fas fa-arrow-right"></i></span>
                          <span class="calc-output">48.50 AZN balansa əlavə</span>
                        </div>
                        <div class="calc-row">
                          <span class="calc-input">100 AZN ödəsəniz</span>
                          <span class="calc-arrow"><i class="fas fa-arrow-right"></i></span>
                          <span class="calc-output">97.00 AZN balansa əlavə</span>
                        </div>
                      </div>
                    </div>

                    <!-- Additional Info -->
                    <div class="additional-info">
                      <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>Ödənişlər dərhal işləyir</span>
                      </div>
                      <div class="info-item warning">
                        <i class="fas fa-percentage"></i>
                        <span>3% komissiya</span>
                      </div>
                      <div class="info-item">
                        <i class="fas fa-headset"></i>
                        <span>24/7 dəstək</span>
                      </div>
                    </div>
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
.terminal-payment-wrapper {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 0;
  margin-bottom: 30px;
  overflow: hidden;
  border: 1px solid #eaeaea;
}

.payment-card {
  width: 100%;
}

.payment-header {
  background: #F9F9F9;
  color: #262626;
  padding: 40px 30px;
  text-align: center;
  position: relative;
}

.payment-logo {
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.payment-method-logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.payment-header h4 {
  font-size: 2.2rem;
  margin-bottom: 5px;
  font-weight: 700;
  color: #262626;
  text-shadow: none;
}

.payment-header h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: 600;
  color: #262626;
  opacity: 1;
}

.payment-header p {
  color: #262626;
  opacity: 1;
  margin: 0 0 20px 0;
  font-size: 1.1rem;
}

.header-commission-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.header-commission-badge.warning i {
  color: #fde68a;
}

.header-commission-badge strong {
  font-size: 1.1rem;
}

/* Commission Alert */
.commission-alert {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 20px 25px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
  border-bottom: 1px solid #fcd34d;
}

.alert-icon {
  width: 40px;
  height: 40px;
  background: #f59e0b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon i {
  color: white;
  font-size: 1.2rem;
}

.alert-content {
  flex: 1;
}

.alert-content strong {
  color: #92400e;
  font-size: 1.05rem;
  display: block;
  margin-bottom: 8px;
}

.alert-content p {
  color: #78350f;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.alert-content p strong {
  display: inline;
  font-size: inherit;
}

.commission-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
}

.commission-tip i {
  color: #f59e0b;
  margin-top: 2px;
}

.commission-tip span {
  color: #78350f;
}

.commission-tip a {
  color: #1d4ed8;
  font-weight: 600;
  text-decoration: underline;
}

.customer-id-section {
  padding: 30px;
  background: #f8f9fa;
  border-bottom: 1px solid #eaeaea;
  text-align: center;
}

.customer-id-section h5 {
  color: #555;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 1.2rem;
}

.customer-id-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.customer-id {
  background: var(--new-default-orange);
  color: white;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 2px;
  box-shadow: 0 4px 12px rgba(255, 113, 30, 0.3);
}

.copy-btn {
  background: var(--new-main-gradient);
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  color: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(255, 113, 30, 0.3);
}

.copy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 113, 30, 0.4);
}

.copy-btn:active {
  transform: translateY(0);
}

.instructions-section {
  padding: 30px;
}

.instructions-section h5 {
  color: #333;
  margin-bottom: 25px;
  font-weight: 600;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.instructions-section h5 i {
  color: var(--new-default-orange);
}

.instruction-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid var(--new-default-orange);
  transition: all 0.3s ease;
  position: relative;
}

.step-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.step-number {
  background: var(--new-default-orange);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: 0 3px 8px rgba(255, 113, 30, 0.3);
}

.step-content {
  flex: 1;
}

.step-content h6 {
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 1.1rem;
}

.step-content p {
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.step-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  color: var(--new-default-orange);
  font-size: 1.5rem;
  opacity: 0.3;
}

/* Commission Calculator */
.commission-calculator {
  padding: 25px 30px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
}

.commission-calculator h5 {
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.commission-calculator h5 i {
  color: var(--new-default-orange);
}

.calc-examples {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.calc-row {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 16px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.calc-input {
  flex: 1;
  color: #64748b;
  font-weight: 500;
}

.calc-arrow {
  color: var(--new-default-orange);
}

.calc-output {
  flex: 1;
  text-align: right;
  color: #059669;
  font-weight: 600;
}

.additional-info {
  padding: 25px 30px;
  background: #f8f9fa;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #555;
  font-weight: 500;
}

.info-item i {
  color: var(--new-default-orange);
  font-size: 1.2rem;
}

.info-item.warning {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 8px 16px;
  border-radius: 20px;
  color: #92400e;
}

.info-item.warning i {
  color: #f59e0b;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .payment-header {
    padding: 30px 20px;
  }
  
  .payment-header h4 {
    font-size: 1.8rem;
  }
  
  .payment-header h3 {
    font-size: 1.3rem;
  }
  
  .customer-id-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .customer-id {
    font-size: 1.5rem;
    padding: 12px 20px;
  }
  
  .step-item {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .step-icon {
    position: relative;
    top: 0;
    right: 0;
    margin-top: 10px;
  }
  
  .additional-info {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
  
  .instructions-section,
  .customer-id-section {
    padding: 20px;
  }
  
  .commission-alert {
    flex-direction: column;
    text-align: center;
  }
  
  .calc-row {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .calc-output {
    text-align: center;
  }
}

@media (max-width: 576px) {
  .payment-header {
    padding: 25px 15px;
  }
  
  .payment-logo {
    width: 80px;
    height: 80px;
    padding: 12px;
  }
  
  .payment-method-logo {
    width: 56px;
    height: 56px;
  }
  
  .customer-id {
    font-size: 1.3rem;
    padding: 10px 15px;
  }
  
  .step-item {
    padding: 15px;
  }
  
  .commission-calculator {
    padding: 20px;
  }
}
</style>
