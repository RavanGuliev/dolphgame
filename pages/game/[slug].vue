<script setup lang="ts">
import {useRoute} from "vue-router";
import {useHead} from "@unhead/vue";
import OrderModal from "~/components/modals/orderModal.vue";
import {authStore} from "~/stores/authStore";
import {basketStore} from "#imports";
import {computed, ref, onMounted} from "vue";
import Comments from "~/components/comment/comments.vue";

const {$api, $toast} = useNuxtApp()
const route = useRoute()
const auth = authStore()
const {headers} = storeToRefs(auth)
const game = await $api.get(`public/game?slug=${route.params.slug}`).then(res => res.data)
const products = await $api.get(`public/products?game=${game.id}&count=30`, headers.value).then(res => res.data)
const others = await $api.get(`public/category?slug=${game.category.slug}`).then(res => res.data)
const selectedProduct = ref(null)
const selectedQty = ref(1)
const basket = basketStore()
const { setBaskets } = basket
console.log(products);


// --- LİMİT SİSTEMİ MƏNTİQİ ---
const isProductLocked = (product: any) => {
  if (!product) return false
  return Number(product.only_one_order) === 1
}

const handleIncrement = (key: number, product: any) => {
  if (isProductLocked(product)) {
    $toast.error("Maksimum sifariş limiti 1 ədəddir")
    return
  }
  qty.value[key]++
}

const handleDecrement = (key: number, product: any) => {
  if (isProductLocked(product)) {
    $toast.error("Maksimum sifariş limiti 1 ədəddir")
    return
  }
  if (qty.value[key] > 1) {
    qty.value[key]--
  }
}

const selected = (product: any, q: any) => {
  selectedProduct.value = product
  selectedQty.value = q
}

const qty = ref([])
products.forEach(() => {
  return qty.value.push(1);
});

onMounted(() => {
  $('.single-sub-menu').click(function () {
    var getIcon = $(this).children('i').attr('class')
    if (getIcon === 'fal fa-angle-down') {
      $('.mobile-sub-menu').show(300)
      $(this).children('i').attr('class', 'fal fa-angle-up')
    } else {
      $('.mobile-sub-menu').hide(300)
      $(this).children('i').attr('class', 'fal fa-angle-down')
    }
  })
})

const addBasket = (id: any, q: any) => {
  $api.post('user/basket/add', {
    id,
    count: q
  }, headers.value).then(res => {
    $api.get('user/basket', headers.value).then(res => {
      setBaskets(res.data)
    })
    $toast.success(res.data)
  }).catch(error => {
    $toast.error(error)
  })
}

useHead({
  title: `${game.name} satışı`,
  meta: [{
    name: 'description',
    content: game.meta_description
  }]
})
</script>

<template>
  <main>
    <div class="container back-orange manual">
      <div class="row">
        <div class="col-md-12">
          <div class="main-title">
            <h5> {{ game.name }} </h5>
            <div class="single-sub-menu">
              <i class="fal fa-angle-down"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mobile-sub-menu">
      <div class="row reset-margin">
        <div class="col-md-12 mt-20">
          <div class="single-menu">
            <nuxt-link v-for="other in others.games" :to="{name: 'game-slug', params: {slug: other.slug}}"
                       exact-active-class="active-link" class="media">
              <img class="mr-3" :src="other.image" :alt="other.name">
              <div class="media-body">
                <h5 class="mt-0">{{ other.name }}</h5>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row reset-margin">
        <div class="col-lg-3 mt-10 d-n-992">
          <div class="single-menu">
            <nuxt-link v-for="other in others.games" :to="{name: 'game-slug', params: {slug: other.slug}}"
                       exact-active-class="active-link" class="media">
              <img class="mr-3" :src="other.image" :alt="other.name">
              <div class="media-body">
                <h5 class="mt-0">{{ other.name }}</h5>
              </div>
            </nuxt-link>
          </div>
        </div>

        <div class="col-lg-9 mt-10">
          <div aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <nuxt-link to="/">Ana Səhifə</nuxt-link>
              </li>
              <li class="breadcrumb-item">
                <nuxt-link to="/games">Oyunlar</nuxt-link>
              </li>
              <li class="breadcrumb-item">
                <nuxt-link :to="{name: 'category-slug', params: {slug: game.category.slug}}">{{ game.category.name }}
                </nuxt-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">{{ game.name }}</li>
            </ol>
          </div>
          <div class="games-cover">
            <img :src="game.cover" :alt="game.name">
          </div>
          <div class="row">
            <div class="col-md-12 for-modal">
              <ul class="nav nav-pills about-games" id="pills-tab" role="tablist">
                <li class="nav-item" role="presentation">
                  <a class="nav-link active" id="mehsullar" data-toggle="pill" href="#tab_mehsullar"
                     role="tab"
                     aria-controls="mehsullar" aria-selected="true"><i class="fal fa-bars"></i>
                    <span>Məhsullar</span></a>
                </li>
                <li class="nav-item" role="presentation">
                  <a class="nav-link" id="rules" data-toggle="pill" href="#tab_rules" role="tab"
                     aria-controls="rules" aria-selected="false"><i
                      class="fas fa-exclamation-circle"></i>
                    <span>Ətraflı</span></a>
                </li>
                <li class="nav-item" role="presentation">
                  <a class="nav-link" style="cursor: pointer" data-toggle="modal" data-target="#howToUseModal">
                    <i class="fas fa-question-circle"></i> <span>İstifadə qaydası</span>
                  </a>
                </li>
                <li class="nav-item" role="presentation">
                  <a class="nav-link" id="comments" href="#tab_comments" aria-selected="true"><i
                      class="fas fa-comment-lines"></i>
                    <span>Şərhlər</span></a>
                </li>
              </ul>

              <div class="tab-content tab-products pt-0 all-inform only-single" id="pills-tabContent">
                <div class="tab-pane fade show active" id="tab_mehsullar" role="tabpanel"
                     aria-labelledby="mehsullar-tab">
                  <div class="row mr-0 ml-0">
                    <div v-for="(product, key) in (products)" :key="product.id" class="col-md-12 m-manual" :data-id="product.id">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="d-flex mobile-single">
                            <div class="products-photo">
                              <nuxt-link class="d-block"
                                         :to="{name: 'game-product-slug', params: {slug: product.slug}}"><img
                                  :src="product.image"
                                  :alt="product.name"></nuxt-link>
                            </div>
                            <div class="products-more">
                              <nuxt-link class="white-anchor"
                                         :to="{name: 'game-product-slug', params: {slug: product.slug}}"><h1>
                                {{ product.name }}</h1></nuxt-link>
                              <span>{{ product.detail }}</span>
                              <div class="stocks">
                                <span>Stok</span>
                                <span>Bonus</span>
                              </div>
                              <div class="stocks">
                                <span v-if="product.stock > 0"><i class="far fa-check"></i></span>
                                <span v-else><i class="fal fa-times"></i></span>
                                <span><i class="fas fa-star"></i>
                                  <b class="point font-weight-lighter"> {{ product.bonus * qty[key] }}</b>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6 position-relative right-single">
                          <div class="all-choose">
                            <div class="products-price">
                              <span v-if="product.old_price" class="old_price">{{(product.old_price).toFixed(2)}} Azn</span>
                              <span class="get_price">{{ (parseInt(qty[key]) * product.price).toFixed(2) }} Azn</span>
                            </div>
                            <div class="products-qty">
                              <input @click="handleDecrement(key, product)" type='button' value='-'
                                     class='qtyminus' :class="{'locked-btn': isProductLocked(product)}"/>
                              <input v-model="qty[key]" type='number' name='quantity'
                                     class='qty' :readonly="isProductLocked(product)"/>
                              <input @click="handleIncrement(key, product)" type='button' value='+' 
                                     class='qtyplus' :class="{'locked-btn': isProductLocked(product)}"/>
                            </div>
                            <div class="theme-btn">
                              <a v-if="product.type === 'e-pin' && product.stock > 0"
                                 @click.prevent="addBasket(product.id, qty[key])"
                                 style="cursor: pointer; color: white">Səbətə at</a>
                              <div v-else>
                                <a v-if="product.stock" @click="selected(product, qty[key])"
                                   data-toggle="modal"
                                   data-target="#orderModal"
                                   style="cursor: pointer">Satın al</a>
                                <a v-else @click.prevent="() => false"
                                   style="cursor: pointer; background: rgb(249 165 51 / 63%) !important">Satın al</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="tab-pane fade" id="tab_rules" role="tabpanel" aria-labelledby="rules-tab">
                  <div v-html="game.detail" class="games-warn"></div>
                </div>
              </div>
<div class="modal fade" id="howToUseModal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document" style="max-width: 600px;">
    <div class="modal-content text-black" style="background-color: #ffffff; border: none; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
      
      <div class="modal-header border-bottom-0 pb-0" style="padding: 20px 25px;">
        <h5 class="modal-title font-weight-bold" style="font-size: 18px; color: #333;">İstifadə qaydası</h5>
        <button type="button" class="close text-black" data-dismiss="modal" aria-label="Close" style="outline: none; opacity: 0.6;">
          <span aria-hidden="true" style="font-size: 26px;">&times;</span>
        </button>
      </div>
      
      <div class="modal-body" style="padding: 15px 25px 25px 25px;">
        <div class="instruction-text mb-4" style="font-size: 14px; line-height: 1.5; color: #555;">
          <p class="mb-2">Satın al düyməsinə kliklədikdən sonra oyunçu ID-nizi yazıb sifarişi tamamlaya bilərsiniz.</p>
          <p class="font-weight-bold mb-0" style="color: #f9a533;">Oyunçu ID-nizi öyrənmək üçün aşağıdakı şəkilləri incələyin:</p>
        </div>
        
        <div class="instruction-images">
          
          <div class="position-relative mb-4">
            <div class="border rounded-lg overflow-hidden shadow-sm" style="border-color: #eee !important;">
              <img src="../../public/img/step1.jpg" class="img-fluid w-100 d-block" style="object-fit: contain;" alt="Addım 1">
            </div>
            <div class="mt-2 small font-weight-bold text-secondary" style="font-size: 12px;">
              <i class="fas fa-chevron-right mr-1" style="color: #f9a533;"></i> Addım 1: Profil bölməsinə keçin
            </div>
          </div>
          
          <div class="position-relative mb-3">
            <div class="border rounded-lg overflow-hidden shadow-sm" style="border-color: #eee !important;">
              <img src="../../public/img/step2.jpg" class="img-fluid w-100 d-block" style="object-fit: contain;" alt="Addım 2">
            </div>
            <div class="mt-2 small font-weight-bold text-secondary" style="font-size: 12px;">
              <i class="fas fa-chevron-right mr-1" style="color: #f9a533;"></i> Addım 2: ID nömrəsini kopyalayın
            </div>
          </div>

        </div>

        <div v-if="game.how" class="mt-4 pt-3 border-top border-light custom-how-content" 
             style="font-size: 13px; color: #888; font-style: italic;" v-html="game.how">
        </div>
      </div>

      <div class="modal-footer border-top-0 pt-0 justify-content-center pb-4">
        <button type="button" class="btn btn-warning px-5 font-weight-bold text-white shadow-sm" 
                data-dismiss="modal" 
                style="background-color: #f9a533; border-radius: 10px; border: none; height: 45px; min-width: 180px;">
          Anladım
        </button>
      </div>
    </div>
  </div>
</div>

              <order-modal 
  v-if="selectedProduct" 
  :game="game" 
  :product="selectedProduct"
  :qty="Number(qty[products.findIndex(p => p.id === selectedProduct.id)] || 1)"
  @incrementFromChildren="handleIncrement(products.findIndex(p => p.id === selectedProduct.id), selectedProduct)"
  @decrementFromChildren="handleDecrement(products.findIndex(p => p.id === selectedProduct.id), selectedProduct)" 
/>
            </div>
          </div>
    
        </div>
        
      </div>
    </div>
  
    

    <comments :game="game.id"/>
  </main>
</template>

<style scoped>

.faqPubg {
  background: transparent!important;
}
/* Canlı Və Brend Rənglər Üçün CSS */
.faq-custom-btn {
    color: #fff !important; /* Standart ağ yazı */
    background: #222; /* Tünd boz fon */
}

/* Aktiv sualın başlığı üçün narıncı fon və ağ yazı */
.faq-custom-btn:not(.collapsed) {
    background-color: #f9a533 !important;
    color: #fff !important;
}

/* Ox ikonunun narıncı rəngi */
.faq-custom-btn i {
    color: #f9a533;
}

/* Aktiv sualda ox ikonunun ağ rəngə dönməsi */
.faq-custom-btn:not(.collapsed) i {
    color: #fff;
    transform: rotate(180deg); /* Ox ikonunu tərsinə fırladır */
}
.locked-btn {
  opacity: 0.5;
  cursor: pointer;
  background-color: #f1f1f1 !important;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
#howToUseModal .modal-content {
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
}
#howToUseModal img {
  width: 100%;
  display: block;
}
</style>