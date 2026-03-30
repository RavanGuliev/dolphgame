<script setup lang="ts">
  import {useRoute} from "vue-router";

  const {$api} = useNuxtApp()
  const route = useRoute()
  const row = await $api.get('public/blog?slug=' + route.params.slug)
</script>

<template>
  <main>

    <!-- PC and Mobile all contents -->
    <div class="container">
      <div class="row reset-margin manual">

        <!-- PC and Mobile Breadcrumb -->
        <div class="col-md-12">
          <div aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><nuxt-link to="/">Ana Səhifə</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/blogs">Xəbərlər</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">{{row.data.title}}</li>
            </ol>
          </div>
        </div>

        <!-- PC and Mobile single content -->
        <div class="col-lg-7">
          <div class="blog-single">
            <h1 class="news-content-title">{{row.data.title}}</h1>
            <time>{{row.data.created_at}}</time>
            <article v-html="row.data.content">

            </article>
            <hr>
            <div class="row">
              <div class="col-md-6 more-blog">
                <nuxt-link to="/blogs" class="other-blogs"><i class="far fa-arrow-left"></i> Digər Xəbərlər</nuxt-link>
              </div>
              <div class="col-lg-6 col-md-12">
                <ul class="list-unstyled list-inline blog-single-share mb-0">
                  <span>Paylaş</span>
                  <li class="list-inline-item">
                    <a target="_blank" href="https://www.facebook.com">
                      <i class="fab fa-facebook"></i>
                    </a></li>
                  <li class="list-inline-item">
                    <a target="_blank" href="https://twitter.com/">
                      <i class="fab fa-twitter"></i>
                    </a>
                  </li>
                  <li class="list-inline-item"><a
                      target="_blank" href="https://wa.me/">
                    <i class="fab fa-whatsapp"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- PC and Mobile more blogs -->
        <div class="col-lg-5 pr-30 ml-15">

        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>

</style>