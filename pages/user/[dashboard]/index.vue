<script setup lang="ts">
import {authStore} from "~/stores/authStore";

const {$api} = useNuxtApp()
const userAuth = authStore()
const {headers} = storeToRefs(userAuth)
const statistics = await $api.get('user/statistics', headers.value)
</script>

<template>
  <div class="right-dashboard">
    <!-- PC statistic -->
    <div class="col-md-12 text-center">
      <h5 class="tab-title">Toplam statistika</h5>
    </div>
    <div class="row all-statistic d-n-768">
      <div class="item">
        <div class="statistics">
          <p>Sifarişlər</p>
          <div class="text-center">
            <div class="all-information">
              <span>{{statistics.data.orders}}</span> <small>əd</small>
            </div>
          </div>
          <div class="sub-info">
            <i class="fal fa-shopping-bag"></i>
            <h5>Toplam</h5>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="statistics">
          <p>Ödənişlər</p>
          <div class="text-center">
            <div class="all-information">
              <span>{{statistics.data.payments}}</span> <small>azn</small>
            </div>
          </div>
          <div class="sub-info">
            <i class="fal fa-wallet"></i>
            <h5>Toplam</h5>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="statistics">
          <p>Bonuslar</p>
          <div class="text-center">
            <div class="all-information">
              <span>{{statistics.data.bonuses}}</span> <small>
              = {{statistics.data.bonus_convert}} Azn</small>
            </div>
          </div>
          <div class="sub-info">
            <i class="fal fa-star"></i>
            <h5>Toplam</h5>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile statistic -->
    <div class="owl-carousel statistic-carousel owl-theme">
      <div class="item">
        <div class="statistics">
          <p>Sifarişlər</p>
          <div class="text-center">
            <div class="all-information">
              <span>{{statistics.data.orders}}</span> <small>əd</small>
            </div>
          </div>
          <div class="sub-info">
            <i class="fal fa-shopping-bag"></i>
            <h5>Toplam</h5>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="statistics">
          <p>Ödənişlər</p>
          <div class="text-center">
            <div class="all-information">
              <span>{{statistics.data.payments}}</span> <small>azn</small>
            </div>
          </div>
          <div class="sub-info">
            <i class="fal fa-wallet"></i>
            <h5>Toplam</h5>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="statistics">
          <p>Bonuslar</p>
          <div class="text-center">
            <div class="all-information">
              <span>{{statistics.data.bonuses}}</span> <small>
              = {{statistics.data.bonus_convert}} Azn</small>
            </div>
          </div>
          <div class="sub-info">
            <i class="fal fa-star"></i>
            <h5>Toplam</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>