<script setup lang="ts">
import {useHead} from "@unhead/vue";
import {paginateStore} from "~/stores/paginateStore";
import Paginate from "~/components/modules/paginate.vue";
import {storeToRefs} from "pinia";

const store = paginateStore()
const {$api} = useNuxtApp()
const count = 15
const {data} = storeToRefs(store)
const rows = ref({})
const child = ref(true)
rows.value = await $api.get(`public/games?count=${count}`)
useHead({
  title: 'Bütün oyunlar'
})
watch(data, value => {
  rows.value = value
  
  
})
console.log(rows);

</script>

<template>
  <main>

    <!-- Mobile and PC title -->
    <div class="container back-orange set-size">
      <div class="row">
        <div class="col-md-12">
          <div class="main-title">
            <h5> Bütün oyunlar </h5>
          </div>
        </div>
      </div>
    </div>
  <!-- Mobile and PC all games -->
  <div class="container">
    <div class="row">

      <!-- Mobile and PC all games -->
      <div class="flex-container game-list game-lists">
        <div v-for="row in rows.data" class="items">
          <nuxt-link :to="{name: 'game-slug', params: {slug: row.slug}}" class="games">
            <div>
              <img :src="row.image" :alt="row.name">
            </div>
            <p>{{ row.name }}</p>
          </nuxt-link>
        </div>
      </div>
      <!-- Mobile and PC pagination -->
      <paginate :pagination="rows.meta" :params="{count}"/>

    </div>

  </div>


  </main>
</template>

<style scoped>

</style>