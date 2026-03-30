<script setup lang="ts">
import {generalStore} from "~/stores/generalStore";
import {useCookie} from "#app/composables/cookie";
import {basketStore} from "~/stores/basketStore";
import {storeToRefs} from "pinia";

const {$api} = useNuxtApp()
const general = generalStore()
const basketStore1 = basketStore()
const {baskets_count} = storeToRefs(basketStore1)
const {setMod} = general
const {data} = storeToRefs(general)
type ModeType = 'dark' | 'style';
const setMode = (mode: ModeType): void => {
  const cookie = useCookie('mode', {maxAge: 60 * 60 * 24 * 200});
  cookie.value = mode;
  setMod(mode)
}
onMounted(() => {
  $('.footer-item').click(function () {
    $('.footer-item').removeClass('active-mode')
    $(this).addClass('active-mode')
  });
})
</script>

<template>
  <footer id="footer" class="footer-section">
    <!-- Mobile and PC add information -->
    <div class="container-fluid bg-white">
      <div class="container inform-p">
        <div class="row">
          <div class="flex-container-2">
            <div class="items">
              <div class="inform">
                <i class="far fa-rocket-launch"></i>
                <h5>Sürətli xidmət</h5>
                <p>Aldığınız məhsullar ən sürətli şəkildə müştərilərə çatdırılır.</p>
              </div>
            </div>
            <div class="items">
              <div class="inform">
                <i class="fas fa-lock-alt"></i>
                <h5>Təhlükəsizlik</h5>
                <p>Ən təhlükəsiz vasitələrlə ödənişləri həyata keçirə bilərsiniz.</p>
              </div>
            </div>
            <div class="items">
              <div class="inform">
                <i class="fas fa-usd-circle"></i>
                <h5>Sərfəli qiymət</h5>
                <p>Endirimli və ən münasib qiymətə alış-verişdən zövq alın.</p>
              </div>
            </div>
            <div class="items">
              <div class="inform">
                <i class="fas fa-thumbs-up"></i>
                <h5>Müştəri Məmnuniyəti</h5>
                <p>Müştərilərimizə keyfiyyətli xidmət göstərməkdən məmnunuq.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile and PC footer contents -->
    <div class="container">
      <div class="footer-content pt-5 pb-5">
        <div class="row reset-margin">

          <!-- Mobile and PC site name and information -->
          <div class="col-xl-6 col-lg-6 mb-50">
            <div class="footer-widget">
              <div class="footer-logo">
                <h3>Dolphgame.com</h3>
              </div>
              <div class="footer-text">
                <p>
                  DolPh Game olaraq güvənli, sürətli və asan ödəniş üsulları ilə müştərilərimizə E-pin almaq,
                  oyun içi ödəniş kimi bir çox xidmətləri göstəririk. Təcrübəli dəstək komandamız sayəsində
                  yüksək keyfiyyətdə xidmət göstərib, sifarişlərini maksimum tez biz zamanda tamamlayırıq.
                  Məqsədimiz sərfəli qiymət, yüksək keyfiyyət göstərməkdir.
                </p>
              </div>
            </div>
          </div>

          <!-- Mobile and footer sections -->
          <div class="col-xl-6 col-lg-6 col-md-6 mb-30">
            <div class="footer-widget">
              <div class="footer-widget-heading">
                <h3>Bölmələr</h3>
              </div>
              <ul>
                <li><nuxt-link to="/payments">Oyunlar</nuxt-link></li>
                <li><nuxt-link to="/payments">Bank hesabları</nuxt-link></li>
                <li><nuxt-link to="/pages/privacy">Qaydalar</nuxt-link></li>
                <li><nuxt-link to="/payments/online">Balans artır</nuxt-link></li>
                <li><nuxt-link to="/pages/privacy">Üzvlük müqaviləsi</nuxt-link></li>
                <li><nuxt-link to="/pages/contact">Əlaqə</nuxt-link></li>
                <li><nuxt-link to="/pages/faq">Ödəniş üsulları</nuxt-link></li>
                <li><nuxt-link href="/pages/about">Haqqımızda</nuxt-link></li>

              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Mobile and PC page bottom -->
    <div class="copyright-area">
      <div class="container">
        <div class="row reset-margin">
          <div class="col-xl-6 col-lg-6 text-center text-lg-left">
            <div class="copyright-text">
              <p>Copyright &copy; {{new Date().getFullYear()}}, Bütün huquqları qorunur. </p>
            </div>
          </div>
          <div class="col-xl-6 col-lg-6 d-none d-lg-block text-right">
            <div class="footer-menu">
              <div class="header__top__right__social d-inline-block mr-0">
                <a target="_blank" :href="data.facebook"><i class="fab fa-facebook"></i></a>
                <a target="_blank" :href="data.instagram"><i
                    class="fab fa-instagram"></i></a>
                <a target="_blank" :href="data.youtube"><i
                    class="fab fa-youtube"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile fixed footer -->
    <div class="mobile-footer">
      <nuxt-link to="/" class="footer-item active-mode">
        <i class="fal fa-home-alt"></i>
        <p>Ana səhifə</p>
      </nuxt-link>
      <nuxt-link to="/games" class="footer-item">
        <i class="fal fa-align-center"></i>
        <p>Kateqoriyalar</p>
      </nuxt-link>
      <nuxt-link to="/payments/online" class="footer-item">
        <i class="fal fa-plus-circle"></i>
        <p>Balans artır</p>
      </nuxt-link>
      <nuxt-link style="position:relative;" to="/basket" class="footer-item">
        <i class="fas fa-shopping-basket"></i>
        <small class="basket-count">{{baskets_count}}</small>
        <p>Səbət</p>
      </nuxt-link>
      <a onclick="return false" style="cursor: pointer" class="footer-item">
        <i class="fal fa-eclipse"></i>
        <p>Səhifə Modu</p>
      </a>
    </div>

    <!-- Mobile Hide mode section -->
    <div class="dark-light">
      <a onclick="return false" href="darklinki">
        <p @click="setMode('dark')"><i class="fad fa-moon"></i></p>
        <p @click="setMode('style')"><i class="fas fa-sun"></i></p>
      </a>
    </div>

  </footer>
</template>

<style scoped>
.basket-count {
  color: white;
  background: red;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: block;
  position: absolute;
  top: 0;
  right: 15px;
  line-height: 18px;
}
</style>