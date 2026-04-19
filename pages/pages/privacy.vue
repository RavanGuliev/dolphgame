<script setup lang="ts">
const {$api} = useNuxtApp()
const row = await $api.get('public/privacy')
useHead({
  title: 'Qaydalar'
})
</script>

<template>
  <main>

    <!-- Mobile and PC title -->
    <div class="container back-orange set-size">
      <div class="row">
        <div class="col-md-12">
          <div class="main-title">
            <h5> Qaydalar </h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile and PC content -->
    <div class="container">
      <div class="row reset-margin">
        <div class="col-md-12">
          <div class="static-pages">
            <div v-html="row.data">
            </div>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<style scoped>

</style>