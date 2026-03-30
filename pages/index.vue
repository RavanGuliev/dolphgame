<script setup lang="ts">
import Blogs from "~/components/blog/Blogs.vue";
import {generalStore} from "~/stores/generalStore";
import { Swiper, SwiperSlide} from 'swiper/vue';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import {authStore} from "~/stores/authStore";
const {$api} = useNuxtApp()
const general = generalStore()
const {data} = storeToRefs(general)
const sliders =  ref([])
const best = ref([])
const populars = ref([])
const tiktok = ref([])
const pubg = ref([])
const free_fire = ref([])
const point_blank = ref([])
const valorant = ref([])
const auth = authStore()
const {headers} = storeToRefs(auth)
const owl = () => {

  $('.all-games').owlCarousel({
    loop:true,
    margin:10,
    responsiveClass:true,
    responsive:{
      0:{
        items:2,
        nav:false
      },
      600:{
        items:3,
        nav:false
      },
      1000:{
        items:5,
        nav:true,
        loop:false
      }
    }
  })

}
useHead({
  title: data.value.title,
  meta: [
    {name: 'description', content: data.value.description}
  ]
})
$api.get('public/slides').then(res => {
  sliders.value = res
})
$api.get('public/categories?count=15').then(res => {
  best.value = res
})
$api.get('public/top-products?count=10', headers.value).then(res => {
  populars.value = res
})
$api.get('public/products?game=7&count=10', headers.value).then(res => {
  tiktok.value = res
})
$api.get('public/products?game=1&count=10', headers.value).then(res => {
  pubg.value = res
})

$api.get('public/products?game=3&count=10', headers.value).then(res => {
  free_fire.value = res
})

$api.get('public/products?game=8&count=10', headers.value).then(res => {
  point_blank.value = res
})

$api.get('public/products?game=6&count=10', headers.value).then(res => {
  valorant.value = res
})

onMounted(() => {
   if (process.client) {
     nextTick(() => {
       owl()
     })
   }

})

watch(() => best, () => {
  if (process.client) {
    nextTick(() => {
      owl()
    })
  }
}, {deep: true})
</script>

<template>
  <main>
    <div class="position-fixed bottom-0 right-0 p-3 cart-toast main-toast">
      <div id="liveToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true"
           data-delay="2000">
        <div class="toast-header">
          <img style="width: 35px" src="/img/logo.png" class="rounded mr-2" alt="...">
          <strong class="mr-3">Dolphgame.com</strong>
          <small class="mr-1">1s öncə</small>
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="toast-body text-center">
          <div class="text-center m-auto">
            <img style="width: 40px; display: inline-block; margin-bottom: 7px;" src="/img/shopping-cart.svg"
                 alt="">
          </div>
          <strong>Məhsul səbətə əlavə olundu</strong>
        </div>
      </div>
    </div>

    <!-- Mobile and PC slider, banners -->
    <section class="bg-white">
      <div class="container pt-20 no-pb">
        <div class="row">

          <!-- Mobile and PC slider -->
          <div class="col-md-9 pl-0 page-carousel">
            <swiper :modules="[Pagination, Autoplay]"   :slides-per-view="1"
                      :space-between="30"
                    :autoplay="{delay: 3000}"
                      :pagination="{ clickable: true }">
              <swiper-slide v-for="slide in sliders.data">
                <a :href="slide.url ?? '#'" style="cursor: pointer"><img class="d-block w-100"
                                                                         :src="slide.image"
                                                                         alt="dolphgame"></a>
              </swiper-slide>
            </swiper>

          </div>

          <!-- PC banners -->
          <div class="col-md-3 pr-0 banners">
            <div class="side-photo">
              <nuxt-link :to="data.banner1_link"><img
                  :src="data.banner1" alt=""></nuxt-link>
              <nuxt-link :to="data.banner2_link"><img
                  :src="data.banner2" alt=""></nuxt-link>
            </div>
          </div>

          <!-- Mobile banners -->
          <div class="mobile-banners">
            <div class="supports pl-0">
              <nuxt-link :to="data.banner1_link"><img
                  :src="data.banner1" alt=""></nuxt-link>
            </div>
            <div class="supports pr-0">
              <nuxt-link :to="data.banner2_link"><img
                  :src="data.banner2" alt=""></nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mobile and PC title -->
    <section class="container back-orange manual">

      <div class="row">
        <div class="col-md-12">
          <div class="main-title">
            <h5><i class="fal fa-shopping-bag"></i> Kateqoriyalar </h5>
            <span> <nuxt-link to="/games"> Hamısına bax </nuxt-link> </span>
          </div>
        </div>
      </div>

    </section>

    <!-- PC the best-selling games -->
    <section class="container best-sell-games">
      <div class="row">
        <div class="flex-container">
          <div v-for="popular in best.data" class="items">
            <div class="games">
              <nuxt-link  :to="{name: 'category-slug', params: {slug: popular.slug}}"><img :src="popular.image" :alt="popular.name"></nuxt-link>
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- Mobile the best-selling games -->
    <div class="container">
      <div class="row">
        <div v-if="best.data" class="owl-carousel all-games owl-theme mt-10">
          <div class="item">
            <div class="games">
              <nuxt-link :to="{name: 'category-slug', params: {slug: best.data[0].slug}}"><img :src="best.data[0].image" :alt="best.data[0].name"></nuxt-link>
            </div>
            <div class="games">
              <nuxt-link :to="{name: 'category-slug', params: {slug: best.data[5].slug}}"><img :src="best.data[5].image" :alt="best.data[5].name"></nuxt-link>
            </div>
          </div>
          <div class="item">
            <div class="games">
              <nuxt-link :to="{name: 'category-slug', params: {slug: best.data[1].slug}}"><img :src="best.data[1].image" :alt="best.data[1].name"></nuxt-link>
            </div>
            <div class="games">
              <nuxt-link :to="{name: 'category-slug', params: {slug: best.data[6].slug}}"><img :src="best.data[6].image" :alt="best.data[6].name"></nuxt-link>
            </div>
          </div>
          <div class="item">
            <div class="games">
              <nuxt-link :to="{name: 'category-slug', params: {slug: best.data[2].slug}}"><img :src="best.data[2].image" :alt="best.data[2].name"></nuxt-link>
            </div>
            <div class="games">
              <nuxt-link  :to="{name: 'category-slug', params: {slug: best.data[7].slug}}"><img :src="best.data[7].image" :alt="best.data[7].image"></nuxt-link>
            </div>
          </div>
          <div class="item">
            <div class="games">
              <nuxt-link :to="{name: 'category-slug', params: {slug: best.data[3].slug}}"><img :src="best.data[3].image" :alt="best.data[3].name"></nuxt-link>
            </div>
            <div class="games">
              <nuxt-link :to="{name: 'category-slug', params: {slug: best.data[8].slug}}"><img :src="best.data[8].image" :alt="best.data[8].name"></nuxt-link>
            </div>
          </div>
          <div class="item">
            <div class="games">
              <nuxt-link :to="{name: 'category-slug', params: {slug: best.data[4].slug}}"><img :src="best.data[4].image" :alt="best.data[4].name"></nuxt-link>
            </div>
            <div class="games">
              <nuxt-link :to="{name: 'category-slug', params: {slug: best.data[9].slug}}"><img :src="best.data[9].image" :alt="best.data[9].name"></nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile and PC tabs -->
    <section class="container pr-0 pl-0">
      <div class="row ">

        <div class="col-md-12">

          <!-- PC and Mobile tabs titles -->
          <ul class="nav nav-pills category-tabs" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <a class="nav-link active" id="popular" data-toggle="pill" href="#tab_popular" role="tab"
                 aria-controls="popular" aria-selected="true">
                <span>Populyar</span>
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="steam" data-toggle="pill" href="#tab_steam" role="tab"
                 aria-controls="steam" aria-selected="false">
                <span>TikTok</span>
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="xbox" data-toggle="pill" href="#tab_xbox" role="tab"
                 aria-controls="xbox" aria-selected="false">  <span>PUBG</span></a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="ps" data-toggle="pill" href="#tab_ps" role="tab" aria-controls="ps"
                 aria-selected="true"> <span>Free Fire</span> </a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="android" data-toggle="pill" href="#tab_android" role="tab"
                 aria-controls="android" aria-selected="true">
                <span>Point Blank</span>
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="endirimli" data-toggle="pill" href="#tab_endirim" role="tab"
                 aria-controls="endirimli" aria-selected="true">
                <span>Valorant</span>
              </a>
            </li>
          </ul>

          <!-- Mobile and PC tabs contents -->
          <div class="tab-content tab-products" id="pills-tabContent">
            <div class="tab-pane fade show active tab-games" id="tab_popular" role="tabpanel"
                 aria-labelledby="popular-tab">
              <product-list v-if="populars" :products="populars"/>
            </div>
            <div class="tab-pane fade tab-games" id="tab_steam" role="tabpanel" aria-labelledby="steam-tab">
              <product-list v-if="tiktok" :products="tiktok"/>
            </div>
            <div class="tab-pane fade tab-games" id="tab_xbox" role="tabpanel" aria-labelledby="xbox-tab">
              <product-list v-if="pubg" :products="pubg"/>
            </div>
            <div class="tab-pane fade tab-games" id="tab_ps" role="tabpanel" aria-labelledby="ps-tab">
              <product-list v-if="free_fire" :products="free_fire" />
            </div>
            <div class="tab-pane fade tab-games" id="tab_android" role="tabpanel"
                 aria-labelledby="android-tab">
              <product-list v-if="point_blank" :products="point_blank" />
            </div>
            <div class="tab-pane fade tab-games" id="tab_endirim" role="tabpanel"
                 aria-labelledby="endirimli-tab">
              <product-list v-if="valorant" :products="valorant" />
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Mobile and PC title -->
    <section class="container back-orange set-size">

      <div class="row">
        <div class="col-md-12">
          <div class="main-title">
            <h5><i class="fal fa-file"></i> Xəbərlər </h5>
            <span> <nuxt-link to="/blogs">Hamısına bax </nuxt-link> </span>
          </div>
        </div>
      </div>

    </section>

 <blogs />
  </main>
</template>

<style scoped>

</style>