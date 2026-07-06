<script setup lang="ts">
</script>

<template>
  <div class="loading-bar">
    <img src="/img/loading.svg" class="loading-img" alt="Yüklənir…" />
  </div>
</template>

<style scoped>
.loading-bar {
  position: fixed;
  inset: 0;
  z-index: 50000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.loading-img {
  width: 120px;
  height: 120px;
}
</style>
