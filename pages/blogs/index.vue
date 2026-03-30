<script setup lang="ts">
import {formatDateOnly} from "~/utils/dateFormatter";
const {$api} = useNuxtApp()
const blogs = await $api.get('public/blogs?count=10')
</script>

<template>
  <main>

    <!-- Mobile and PC title -->
    <div class="container back-orange set-size">
      <div class="row">
        <div class="col-md-12">
          <div class="main-title">
            <h5> Xəbərlər </h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile and PC blogs -->
    <div class="container">
      <div class="row">
        <div class="flex-container card-mb">
          <div v-for="blog in blogs.data" class="items-2">
            <nuxt-link :to="{name: 'blogs-slug', params: {slug: blog.slug}}" class="card">
              <img class="card-img-top" :src="blog.image" :alt="blog.name">
              <div class="card-body">
                <h5 class="card-title">{{blog.title}}</h5>
                <p class="card-text">{{blog.description}}</p>
                <p class="card-date"><small class="text-muted">{{formatDateOnly(blog.created_at)}}</small></p>
              </div>
            </nuxt-link>
          </div>

        </div>

        <!-- paginate -->

      </div>
    </div>

  </main>
</template>

<style scoped>

</style>