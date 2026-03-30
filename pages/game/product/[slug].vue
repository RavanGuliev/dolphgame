<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
import OrderModal from "~/components/modals/orderModal.vue";
import { authStore } from "~/stores/authStore";
import { basketStore } from "#imports";
import Comments from "~/components/comment/comments.vue";

const qty = ref(1)
const { $api, $toast } = useNuxtApp()
const route = useRoute()
const auth = authStore()
const { headers } = storeToRefs(auth)

// Məhsul məlumatlarını gətiririk
const row = await $api.get(`public/product?slug=${route.params.slug}`, headers.value)

// --- LOG 1: Gələn əsas məhsulun bütün datası ---
console.log("Gələn Məhsul Datası:", row.data)

// --- LİMİT SİSTEMİ ---
const isLocked = computed(() => {
  const status = Number(row.data.only_one_order) === 1
  // --- LOG 2: Limit statusunun yoxlanılması ---
  console.log("Məhsul limitlidirmi (only_one_order == 1)?:", status)
  return status
})

// --- MƏCBURİ İZLƏMƏ (WATCHER) ---
watch(qty, (newVal) => {
  if (isLocked.value && newVal > 1) {
    // --- LOG 3: Limit keçilmə cəhdi ---
    console.warn("Limit keçilməyə çalışıldı. Miqdar 1-ə qaytarıldı. Cəhd edilən rəqəm:", newVal)
    
    qty.value = 1;
    $toast.error("Bu məhsul üçün miqdar 1-dən çox ola bilməz.");
  }
})

const bonus = computed(() => row.data.bonus * qty.value)
const price = computed(() => (row.data.price * qty.value).toFixed(2))
const basket = basketStore()
const { setBaskets } = basket

const decrement = () => {
  if (isLocked.value) {
    $toast.error("Maksimum sifariş limiti 1 ədəddir.")
    return 
  }
  if (qty.value > 1) {
    qty.value--
  }
}

const increment = () => {
  if (isLocked.value) {
    $toast.error("Maksimum sifariş limiti 1 ədəddir.")
    return
  }
  qty.value++
}

const others = await $api.get(`public/product/${row.data.parent}/${row.data.id}`, headers.value)

// --- LOG 4: Oxşar məhsulların datası ---
console.log("Oxşar Məhsullar:", others.data)

onMounted(() => {
  if ($('div').hasClass('single-info')) {
    var singleHeight = $('.single-info').height()
    $('.similar').height(singleHeight + 93)
  }
})

const addBasket = (id: any, q: any) => {
  // --- LOG 5: Səbətə göndərilən son məlumat ---
  console.log("Səbətə əlavə edilir:", { product_id: id, quantity: q })

  $api.post('user/basket/add', {
    id,
    count: q
  }, headers.value).then(res => {
    $api.get('user/basket', headers.value).then(res => {
      setBaskets(res.data)
    })
    $toast.success(res.data)
  }).catch(error => {
    console.error("Səbət xətası:", error)
    $toast.error(error)
  })
}
</script>

<template>
  <main>
    <div class="container">
      <div class="row reset-margin manual">
        <div class="col-lg-7">
          <div aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><nuxt-link to="/">Ana Səhifə</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/games">Oyunlar</nuxt-link></li>
              <li class="breadcrumb-item">
                <nuxt-link :to="{name:'category-slug', params: {slug:row.data.category_slug}}">{{row.data.category}}</nuxt-link>
              </li>
              <li class="breadcrumb-item">
                <nuxt-link :to="{name:'game-slug', params: {slug:row.data.game_slug}}">{{row.data.game}}</nuxt-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">{{row.data.name}}</li>
            </ol>
          </div>

          <div class="row">
            <div class="col-md-12">
              <div class="row single-info">
                <div class="col-md-4">
                  <div class="single-photo">
                    <img :src="row.data.image" :alt="row.data.name">
                  </div>
                </div>
                <div class="col-md-8">
                  <div class="single-title">
                    <h1>{{row.data.name}}</h1>
                    <p>{{row.data.detail}}</p>
                  </div>
                  <div class="row price-qty qty-single">
                    <div class="col-8 sub-price text-right-xs">
                      <div class="products-price single-price">
                        <span v-if="row.data.old_price" class="old_price">{{(row.data.old_price).toFixed(2)}} Azn</span>
                        <span class="get_price">{{price}} Azn</span>
                      </div>
                    </div>
                    
                    <div class="col-4 qty-part p-0">
                      <div class="products-qty single-qty">
                        <input 
                          @click="decrement" 
                          type='button' 
                          value='-' 
                          class='qtyminus' 
                          :class="{'locked-btn': isLocked}" 
                        />
                        
                        <input 
                          v-model.number="qty" 
                          type='number' 
                          name='quantity' 
                          class='qty' 
                          :readonly="isLocked"
                        />
                        
                        <input 
                          @click="increment" 
                          type='button' 
                          value='+' 
                          class='qtyplus' 
                          :class="{'locked-btn': isLocked}" 
                        />
                      </div>
                    </div>
                    
                    <div class="col-12"><hr></div>
                    <div class="col-6">
                      <div class="single-bonus">
                        <p>Stok</p>
                        <i v-if="row.data.stock" class="far fa-check text-success"></i>
                        <i v-else class="fal fa-times text-danger"></i>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="single-bonus">
                        <p>Bonus</p>
                        <span><i class="fas fa-star text-warning"></i> <b class="point">{{bonus}}</b></span>
                      </div>
                    </div>
                    <div class="col-12"><hr></div>
                    
                    <div class="col-6">
                      <div v-if="row.data.type === 'e-pin'">
                        <div v-if="row.data.stock > 0" class="single-cart games-cart-single">
                          <button @click="addBasket(row.data.id, qty)"><i class="fal fa-shopping-cart"></i> Səbətə at</button>
                        </div>
                        <span v-else class="text-danger">Stokda yoxdur</span>
                      </div>
                      <div v-else>
                        <div v-if="row.data.stock" class="single-order text-left">
                          <a data-toggle="modal" data-target="#orderModal" style="cursor: pointer">
                            <i class="fal fa-shopping-bag"></i> Satın al
                          </a>
                        </div>
                        <div v-else class="single-order no-stock text-left">
                          <a style="cursor: pointer; opacity: 0.6">
                            <i class="fal fa-shopping-bag"></i> Bitib
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <order-modal 
                      v-if="row.data"
                      @incrementFromChildren="increment" 
                      @decrementFromChildren="decrement" 
                      :qty="qty" 
                      :game="row.data" 
                      :product="row.data" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div v-if="others.data.length" class="similar">
            <table class="table table-borderless">
              <p class="similar-title">Oxşar Məhsullar</p>
              <tr v-for="other in others.data" :key="other.id">
                <td scope="col">
                  <nuxt-link :to="{name: 'game-product-slug', params: {slug: other.slug}}">
                    <img :src="other.image" :alt="other.name">
                  </nuxt-link>
                </td>
                <td scope="col">
                  <span class="similar-info">
                    <nuxt-link :to="{name: 'game-product-slug', params: {slug: other.slug}}">{{other.name}}</nuxt-link>
                  </span>
                </td>
                <td scope="col"><span class="similar-price">{{(other.price).toFixed(2)}} Azn</span></td>
                <td scope="col"><span class="similar-bonus"><i class="fas fa-star"></i> {{other.bonus}}</span></td>
                <td scope="col">
                  <span v-if="other.stock" class="similar-stock"><i class="fas fa-check-circle text-success"></i></span>
                  <span v-else class="similar-stock"><i class="fas fa-times-circle text-danger"></i></span>
                </td>
              </tr>
            </table>
          </div>
        </div>
        
      <!-- PC and Mobile tabs -->
        <div class="col-md-12">

          <!-- PC and Mobile tabs titles -->
          <ul class="nav nav-pills category-tabs single-tabs" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <a class="nav-link active" id="comment" data-toggle="pill" href="#tab_comment" role="tab"
                 aria-controls="comment" aria-selected="true"><i class="fas fa-comment-lines"></i>
                <span>Şərhlər</span></a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="related" data-toggle="pill" href="#tab_related" role="tab"
                 aria-controls="related" aria-selected="false"><i class="fas fa-share-alt"></i>
                <span>Əlaqəli Məhsullar</span></a>
            </li>
            <li class="nav-item" role="presentation">
              <a class="nav-link" id="inform" data-toggle="pill" href="#tab_inform" role="tab"
                 aria-controls="inform" aria-selected="false"><i class="fas fa-info-circle"></i> <span>Əlavə Məlumat</span></a>
            </li>
          </ul>

          <!-- PC and Mobile tabs contents -->
          <div class="tab-content tab-products" id="pills-tabContent">
            <div class="tab-pane fade show active" id="tab_comment" role="tabpanel"
                 aria-labelledby="comment-tab">
              <div class="bootdey">
                <div class="row">
                  <comments :game="row.data.parent" />
                </div>
              </div>
            </div>
            <div class="tab-pane fade tab-games" id="tab_related" role="tabpanel"
                 aria-labelledby="related-tab">
              <!-- flex-container showing only in PC -->
              <div class="flex-container">
                <div v-for="other in others.data" class="items">
                  <div class="tabs-game">
                    <nuxt-link :to="{name: 'game-product-slug', params: {slug: other.slug}}" class="game-photo">
                      <img loading="lazy" :src="other.image" :alt="other.name">
                    </nuxt-link>
                    <div class="game-inform">
                      <p><nuxt-link :to="{name: 'game-product-slug', params: {slug: other.slug}}">{{other.name}}</nuxt-link></p>
                      <strong>{{(other.price).toFixed(2)}} Azn</strong>
                      <del v-if="other.old_price">{{(other.old_price).toFixed(2)}} Azn</del>
                      <div class="sub-hover">
                        <nuxt-link :to="{name: 'game-product-slug', params: {slug: other.slug}}"><i class="fal fa-shopping-bag"></i> Sifariş
                          et</nuxt-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Owl Carousel showing only in mobile -->
              <div class="owl-carousel all-tab-games owl-theme">
                <div v-for="other in others.data" class="item">
                  <div class="tabs-game">
                    <nuxt-link :to="{name: 'game-product-slug', params: {slug: other.slug}}" class="game-photo">
                      <img loading="lazy" :src="other.image" :alt="other.name">
                    </nuxt-link>
                    <div class="game-inform">
                      <p><nuxt-link :to="{name: 'game-product-slug', params: {slug: other.slug}}">{{other.name}}</nuxt-link></p>
                      <strong>{{(other.price).toFixed(2)}} Azn</strong>
                      <!--                      <del>{{$product->old_price}} Azn</del>-->
                      <div class="sub-hover">
                        <nuxt-link :to="{name: 'game-product-slug', params: {slug: other.slug}}"><i class="fal fa-shopping-bag"></i> Sifariş
                          et</nuxt-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="tab_inform" role="tabpanel" aria-labelledby="inform-tab">
              <div class="games-warn mt-10">
                {{row.data.detail}}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.single-qty {
  float: left;
}
.locked-btn {
  opacity: 0.5;
  cursor: not-allowed !important;
  background-color: #f1f1f1 !important;
}
input.qty {
  width: 50px;
  text-align: center;
  border: 1px solid #eee;
  font-weight: bold;
  height: 35px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>