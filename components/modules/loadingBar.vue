<script setup lang="ts">

</script>

<template>
  <div class="loading-bar">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="Preloader">
            <div class="Loader">
            <img src="/img/loading.svg">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.loading-bar {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 50000;
  display: flex;
  align-items: center;
  text-align: center;
}

.loading-bar .Preloader img {
  width: 200px !important;
  height: 200px !important;
}

</style>