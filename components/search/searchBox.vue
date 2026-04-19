<script setup lang="ts">
import {computed, ref, watch} from "#imports";
const {$api} = useNuxtApp()

const props  = defineProps({
  q: {
    required: true
  }
})

const rows = ref<any[]>([])

const fetchSearch = async (query: string) => {
  if (query.length > 0) {
    const response = await $api.get('public/search?q=' + query)
    rows.value = response.data || []
  }
}

// Initial fetch
fetchSearch(props.q as string)

// Watch for changes in the search query
watch(() => props.q, (newQuery) => {
  fetchSearch(newQuery as string)
})

const products = computed(() => rows.value.filter((x: { type: any; }) => x.type === 'product'))
const games = computed(() => rows.value.filter((x: { type: any; }) => x.type === 'game'))
const categories = computed(() => rows.value.filter((x: { type: any; }) => x.type === 'category'))
</script>

<template>

  <div class="row">
    <div class="col-12">
      <div class="box-title">
        <h6><i class="fa fa-search"></i> Axtarış nəticələri <span>»</span></h6>
        <span class="game-name">{{q}}</span>
        <p @click="$emit('closeSearch')"><i class="fa fa-times"></i></p>
      </div>
    </div>
    <div class="col-md-12">
      <div v-if="rows.length" class="flex-container game-list search-items">

        <div v-for="product in products" class="items">
          <nuxt-link @click="$emit('closeSearch')" :to="{name: 'game-product-slug', params: {slug: product.slug}}" class="games">
            <div>
              <img :src="product.image" :alt="product.name">
            </div>
            <p>{{product.name}}</p>
          </nuxt-link>
        </div>
        <div v-for="game in games" class="items">
          <nuxt-link  @click="$emit('closeSearch')" :to="{name: 'game-slug', params: {slug: game.slug}}" class="games">
            <div>
              <img :src="game.image" :alt="game.name">
            </div>
            <p>{{game.name}}</p>
          </nuxt-link>
        </div>
        <div v-for="category in categories" class="items">
          <nuxt-link @click="$emit('closeSearch')" :to="{name: 'category-slug', params: {slug: category.slug}}" class="games">
            <div>
              <img :src="category.image" :alt="category.name">
            </div>
            <p>{{category.name}}</p>
          </nuxt-link>
        </div>
      </div>

      <div v-else class="search-result">
        <i class="far fa-search-minus"></i>
        <h4>Heç bir nəticə tapılmadı</h4>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>