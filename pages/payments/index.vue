<script setup lang="ts">
import {authStore} from "~/stores/authStore";
import {loadingStore} from "~/stores/loadingStore";
import {useRouter} from "vue-router";
import type {Numeric} from "type-fest/source/numeric";
import PaymentSidebar from "~/components/payments/paymentSidebar.vue";

const {$api, $toast} = useNuxtApp()
const router = useRouter()
const auth = authStore()
const {headers} = storeToRefs(auth)
const invoice = ref('')
const invoice_id = ref('')
const loading = loadingStore()
const {setLoading} = loading
const methods = await $api.get('user/methods', headers.value)
const {user} = auth
definePageMeta({
  middleware: 'auth'
})
onMounted(() => {
  $('.customer-photo').change(function () {
    $(this).parents('.sendForm').children('.row').children('.show-photo').children('.photo-down').attr('src', URL.createObjectURL(event.target.files[0]));
    $(this).parents('.sendForm').children('.row').children('.show-photo').show()
  })


  $('.report').click(function () {
    var thiss = $(this)
    if ($(this).children('i').attr('class') === 'fas fa-sort-down v-1') {
      $('.sendForm').hide('slow')
      $('.cards-inform').children('button').children('i').attr('class', 'fas fa-sort-down v-1')
      $(this).children('i').attr('class', 'fas fa-sort-up')
      $(this).parents('.getForm').children('.sendForm').show('slow')
    } else {
      $(this).children('i').attr('class', 'fas fa-sort-down v-1')
      $(this).parents('.getForm').children('.sendForm').hide('slow')
    }
    thiss.attr('disabled', 'true')
    setTimeout(function () {
      thiss.removeAttr('disabled')
    }, 1000)
  })
  $('.show-photo span').click(function () {
    $(this).parents('.show-photo').hide()
    $(this).parents('.sendForm').children('.row').children('.show-photo').children('.photo-down').attr('src', '')
  })

})
useHead({
  title: 'Ödəniş növləri'
})
const sendPayment = () => {
  setLoading(true)
  const formData = new FormData();
  formData.append('invoice', invoice.value)
  $api.post('user/payment/invoice', formData, headers.value).then(res => {
    router.push('/user/dashboard/payments').then(() => {
      $toast.success('Çek uğurla göndərildi.')
    })
  }).catch((error) => {
    $toast.error(error)
  }).finally(() => {
    setLoading(false)
    $('.photo-down').attr('src', '')
    $('.show-photo').hide()
    invoice.value = ''
  })
}
const addPhoto = (event:any, id:Numeric) => {
  invoice.value = event.target.files[0]
  invoice_id.value = id
}

const copyCardNumber = (cardNumber: string) => {
  navigator.clipboard.writeText(cardNumber).then(() => {
    $toast.success('Kart nömrəsi kopyalandı!')
  }).catch(() => {
    $toast.error('Kopyalama zamanı xəta baş verdi')
  })
}
</script>

<template>
  <main>
    <!-- Payment notification -->
    <!-- <div v-if="user.level === 'normal'" class="container">
      <div class="payment-notification">
        <div class="notification-content">
          <i class="fas fa-info-circle"></i>
          <p>Ödənişlər hər gün <strong>10:00 – 00:00</strong> arası manuel olaraq <strong>5–15 dəqiqə</strong> ərzində artırılır. Dərhal artırmaq üçün <nuxt-link to="/payments/online">onlayn balans artırma</nuxt-link> bölməsindən istifadə edin.</p>
        </div>
      </div>
    </div> -->

    <!-- Mobile and PC title -->
    <div class="container payment-method-banner set-size">
      <div class="row">
        <div class="col-md-12">
          <div class="main-title">
            <h5> Ödəniş üsulları </h5>
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

              <!-- PC and Mobile title -->
              <div class="col-md-12">
                <h5 class="simple-title card-inform-title">Bank Hesabları</h5>
                
                <!-- Commission Info Banner -->
                <div class="commission-banner free">
                  <div class="banner-icon">
                    <i class="fas fa-gift"></i>
                  </div>
                  <div class="banner-content">
                    <strong>Komissiyasız ödəniş!</strong>
                    <p>Qəbz ilə ödənişlərdə heç bir komissiya tutulmur. Daxil etdiyiniz məbləğ tam olaraq balansınıza əlavə olunacaq.</p>
                  </div>
                </div>
              </div>

              <section v-for="(method, index) in methods.data" class="col-md-12">
                <div class="row getForm">
                  <div class="col-md-4">
                    <div class="cards-inform">
                      <img :src="method.image" :alt="method.name">
                    </div>
                  </div>
                                    <div class="col-md-6 col-12">
                    <div class="cards-inform">
                      <h6>Bankın adı</h6>
                      <p>{{ method.name }}</p>
                      <div v-for="(prop, key) in method.props">
                        <h6>{{ key }}</h6>
                        <div v-if="key === 'Kartın Nömrəsi'" class="card-number-container">
                          <p>{{ prop }}</p>
                          <button @click="copyCardNumber(prop)" class="copy-btn" title="Kopyala">
                            <i class="fas fa-copy"></i>
                            <span>Kopyala</span>
                          </button>
                        </div>
                        <p v-else>{{ prop }}</p>

                    </div>
                  </div>
                  </div>
                  <div class="col-md-12">
                    <hr class="measure">
                  </div>
                  <form @submit.prevent="sendPayment" class="col-md-12 sendForm" method="post"
                        enctype="multipart/form-data">
                    <div class="row">
                      <div class="col-6">
                        <div class="receipt-photo">
                          <label :for="'receipt-'+method.id"> Qəbzi seç </label>
                          <input @change="addPhoto($event, method.id)" name="image" accept="image/*" class="customer-photo" hidden :id="'receipt-'+method.id"
                                 type="file">
                        </div>
                      </div>
                      <div class="col-6 findSet">
                        <div class="send">
                          <button v-if="invoice && invoice_id === method.id" type="submit"> Yükləyin</button>
                        </div>
                      </div>
                      <div class="col-md-12 show-photo">
                        <img class="photo-down" src="" alt="">
                        <span><i class="fas fa-times-circle"></i></span>
                      </div>
                      <div class="col-md-12">
                        <div class="measure">
                          <hr>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </section>

              <!-- Payment instructions -->
              <div class="col-md-12">
                <div class="payment-instructions">
                  <!-- Instructions Container with Background -->
                  <div class="instruction-container">
                    <!-- Header with logo -->
                    <div class="instruction-header">
                      <div class="instruction-logo">
                        <img src="/img/payments/qebz.png" alt="Qəbz ilə ödəniş" />
                      </div>
                      <div class="instruction-title-section">
                        <h5 class="instruction-title">Qəbz ilə necə ödəniş edilir?</h5>
                        <p class="instruction-subtitle">Aşağıdakı addımları izləyərək ödənişinizi asanlıqla həyata keçirə bilərsiniz:</p>
                      </div>
                    </div>
                    
                    <!-- Terminal vasitəsilə ödəniş -->
                    <h6 class="instruction-subheading">Terminal vasitəsilə ödəniş</h6>
                    <ul class="instruction-list">
                      <li>İstənilən ödəniş terminalına yaxınlaşın (Million, E-Manat, ExpressPay və s.)</li>
                      <li>Bank xidmətləri bölməsini seçin</li>
                      <li>Kapital Bank → Karta mədaxil seçin</li>
                      <li>Kart nömrəsini daxil edin</li>
                      <li>Ad, Soyad hissəsində sistemdə göstərilən ad-soyad avtomatik çıxacaq</li>
                      <li>İstədiyiniz məbləği daxil edin və ödənişi tamamlayın</li>
                      <li>Qəbzin şəklini çəkin</li>
                      <li>Daha sonra bu səhifəyə qayıdaraq "Qəbz seç" bölməsindən qəbzi yükləyin.</li>
                    </ul>
                    
                    <p class="instruction-note">⏱ İş saatları ərzində (11:00 – 00:00) ödənişiniz 5–10 dəqiqə ərzində təsdiqlənəcək.</p>
                    
                    <!-- Mobil bank tətbiqi ilə ödəniş -->
                    <h6 class="instruction-subheading">Mobil bank tətbiqi ilə ödəniş</h6>
                    <ul class="instruction-list">
                      <li>İstənilən bankın mobil tətbiqinə daxil olun</li>
                      <li>Kartdan karta köçürmə bölməsini seçin</li>
                      <li>Saytda göstərilən kart nömrəsini daxil edin</li>
                      <li>Məbləği yazın və köçürməni tamamlayın</li>
                      <li>Qəbzin ekran görüntüsünü (screenshot) alın</li>
                      <li>Bu səhifədə "Qəbz seç" bölməsindən qəbzi yükləyin.</li>
                    </ul>
                    
                    <p class="instruction-note">⏱ İş saatları ərzində (11:00 – 00:00) ödənişiniz 5–10 dəqiqə ərzində təsdiqlənəcək.</p>
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
 .sendForm {
   display: block !important;
 }

 /* .payment-notification {
   background-color: #fff8e1;
   border-left: 4px solid #ffc107;
   border-radius: 4px;
   padding: 15px;
   margin: 15px 0;
   box-shadow: 0 2px 5px rgba(0,0,0,0.1);
 } */

 .notification-content {
   display: flex;
   align-items: flex-start;
 }

 .notification-content i {
   color: #ff9800;
   font-size: 20px;
   margin-right: 10px;
   margin-top: 2px;
 }

 .notification-content p {
   margin: 0;
   color: #5d4037;
   font-size: 18px;
   line-height: 1.5;
 }

 .notification-content strong {
   color: #e65100;
 }

 .notification-content a {
   color: #1976d2;
   text-decoration: underline;
   font-weight: bold;
 }

 .notification-content a:hover {
   color: #0d47a1;
 }

 .card-number-container {
   display: flex;
   align-items: center;
   justify-content: flex-start;
   gap: 16px;
 }

 .card-number-container .copy-btn {
    margin-top: 0px;
 }

 .card-number-container p {
   margin: 0;
   white-space: nowrap;
 }

 .copy-btn {
   background: var(--new-main-gradient);
   border: none;
   border-radius: 6px;
   padding: 8px 12px;
   color: white;
   cursor: pointer;
   font-size: 18px;
   transition: all 0.3s ease;
   display: flex;
   align-items: center;
   justify-content: center;
   min-width: 40px;
   height: 36px;
   gap: 10px;
   align-self: flex-start;
   font-weight: bold;
 }

 .copy-btn:hover {
   transform: translateY(-2px);
   box-shadow: 0 4px 12px rgba(252, 34, 3, 0.3);
 }

 .copy-btn:active {
   transform: translateY(0);
 }

 .copy-btn i {
   font-size: 16px;
 }

 .card-inform-title {
   font-size: 24px;
   font-weight: bold;
 }

 /* Commission Banner */
 .commission-banner {
   display: flex;
   align-items: flex-start;
   gap: 15px;
   padding: 18px 20px;
   border-radius: 12px;
   margin-bottom: 25px;
   margin-top: 10px;
 }

 .commission-banner.free {
   background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
   border: 1px solid #a7f3d0;
 }

 .banner-icon {
   width: 44px;
   height: 44px;
   border-radius: 50%;
   display: flex;
   align-items: center;
   justify-content: center;
   flex-shrink: 0;
 }

 .commission-banner.free .banner-icon {
   background: linear-gradient(135deg, #10b981 0%, #059669 100%);
   color: white;
   font-size: 1.2rem;
 }

 .banner-content {
   flex: 1;
 }

 .banner-content strong {
   display: block;
   margin-bottom: 6px;
   font-size: 1.05rem;
 }

 .commission-banner.free .banner-content strong {
   color: #047857;
 }

 .banner-content p {
   margin: 0;
   font-size: 0.9rem;
   line-height: 1.5;
 }

 .commission-banner.free .banner-content p {
   color: #065f46;
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

.instruction-note {
  font-size: 16px;
  color: #454545;
  margin: 16px 0 24px 0;
  padding-left: 8px;
  line-height: 1.6;
}

.instruction-note strong {
  font-weight: 600;
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
   .commission-banner {
     flex-direction: column;
     text-align: center;
     align-items: center;
   }
 }
</style>