<script setup lang="ts">

import {useRoute} from "#imports";

const route = useRoute()
const {$api} = useNuxtApp()
const row = await $api.get('public/category?slug=' + route.params.slug)
</script>

<template>
  <main>

    <!-- PC title -->
    <div class="container back-orange manual">

      <div class="row">
        <div class="col-md-12">
          <div class="main-title">
            <h5> {{row.data.name}} </h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile and PC games -->
    <div class="container mt-10">
      <div class="row">
        <div class="game-list">
          <div v-for="game in row.data.games" class="items">
            <nuxt-link :to="{name: 'game-slug', params: {slug: game.slug}}" class="games">
              <div>
                <img :src="game.image" :alt="game.name">
              </div>
              <p>{{game.name}}</p>
            </nuxt-link>
          </div>
        </div>
      </div>

    </div>

    <!-- Mobile and PC title -->
    <div class="container back-orange manual">

      <div class="row">

        <div class="col-md-3 col-sm-6 col-6 pl-0 pr-0 back-dark">
          <div class="main-title text-center comment-title">
<!--            <h5> Ümumi {{$comments->count()}} Şərh </h5>-->
          </div>
        </div>

      </div>
    </div>

    <!-- Mobile and PC comments -->
    <div class="container bootdey">
      <div class="row reset-margin">


      </div>
    </div>

  </main>

</template>

<style scoped>

</style>