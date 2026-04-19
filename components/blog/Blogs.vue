<script setup lang="ts">
import {formatDateOnly} from "~/utils/dateFormatter";
 const {$api} = useNuxtApp()
 const blogs  = ref([])
 $api.get('public/blogs?count=6').then(res => {
   blogs.value = res
 })
 onMounted(() => {
   $('.carousel-blogs').owlCarousel({
     loop:true,
     margin:10,
     responsiveClass:true,
     responsive:{
       0:{
         items:1,
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
 })
</script>

<template>
<div>
  <!-- PC blogs -->
  <section class="container pc-blogs">
    <div class="row">
      <div class="flex-container">
        <div v-for="row in blogs.data" class="items-2">
          <nuxt-link :to="{name: 'blogs-slug', params: {slug: row.slug}}" class="card">
            <img class="card-img-top" :src="row.image" :alt="row.title">
            <div class="card-body">
              <h5 class="card-title"> {{row.title }}</h5>
              <p class="card-text"> {{row.description }}</p>
              <p class="card-date"><small class="text-muted"> {{formatDateOnly(row.created_at) }}</small></p>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>

  <!-- Mobile Blogs -->
  <section class="container mobile-blogs">
    <div class="row">
      <div class="owl-carousel carousel-blogs owl-theme">
        <div v-for="row in blogs.data" class="items-2">
          <nuxt-link :to="{name: 'blogs-slug', params: {slug: row.slug}}" class="card">
            <img class="card-img-top" :src="row.image" :alt="row.title">
            <div class="card-body">
              <h5 class="card-title"> {{row.title }}</h5>
              <p class="card-text"> {{row.description }}</p>
              <p class="card-date"><small class="text-muted"> {{formatDateOnly(row.created_at) }}</small></p>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
</div>
</template>

<style scoped>

</style>