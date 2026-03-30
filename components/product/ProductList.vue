<script setup lang="ts">
const props = defineProps({
  products: {
    required: true
  }
})
const owl = () => {
  $('.all-tab-games').owlCarousel('destroy')
    $('.all-tab-games').owlCarousel({
      loop:true,
      margin:10,
      responsiveClass:true,
      responsive:{
        0:{
          items:2,
          nav:false
        },
        600:{
          items:2,
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
const {products} = toRefs(props)
onMounted(() => {
  if (process.client) {
    nextTick(() => {
      owl()
    })
  }


})
watch(() => products, (newVal, oldValue) => {
  if (process.client) {
    nextTick(() => {
      owl()
    })
  }

}, { deep: true })
</script>

<template>
<div>
  <!-- flex-container showing only in PC -->
  <div class="flex-container">
    <div v-for="product in products.data" class="items">
      <div class="tabs-game">
        <nuxt-link :to="{name: 'game-product-slug', params: {slug: product.slug}}" class="game-photo">
          <img loading="lazy" :src="product.image" :alt="product.name">
        </nuxt-link>
        <div class="game-inform">
          <p><nuxt-link :to="{name: 'game-product-slug', params: {slug: product.slug}}">{{product.name}}</nuxt-link></p>
          <strong>{{(product.price).toFixed(2)}} Azn</strong>
          <del v-if="product.old_price">{{(product.old_price).toFixed(2)}} Azn</del>
          <div class="sub-hover">
            <nuxt-link :to="{name: 'game-product-slug', params: {slug: product.slug}}"><i class="fal fa-shopping-bag"></i> Sifariş
              et</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Owl Carousel showing only in mobile -->
  <div class="owl-carousel all-tab-games owl-theme">
    <div v-for="popular in products.data" class="item">
      <div class="tabs-game">
        <nuxt-link :to="{name: 'game-product-slug', params: {slug: popular.slug}}" class="game-photo">
          <img loading="lazy" :src="popular.image" :alt="popular.name">
        </nuxt-link>
        <div class="game-inform">
          <p><nuxt-link :to="{name: 'game-product-slug', params: {slug: popular.slug}}">{{popular.name}}</nuxt-link></p>
          <strong>{{(popular.price).toFixed(2)}} Azn</strong>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>