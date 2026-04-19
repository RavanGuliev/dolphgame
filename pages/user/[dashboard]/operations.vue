<script setup lang="ts">
import {authStore} from "~/stores/authStore";
import Paginate from "~/components/modules/paginate.vue";
import {paginateStore} from "~/stores/paginateStore";
import {storeToRefs} from "pinia";
import {useHead} from "@unhead/vue";
import {formatDateTime} from "~/utils/dateFormatter";
const store = paginateStore()
const {data} = storeToRefs(store)
const operations = ref({})
const {$api} = useNuxtApp()
const count = 5
const userAuth = authStore()
const {headers} = storeToRefs(userAuth)
useHead({
  title: 'Əməliyyatlarım',

})
operations.value = await $api.get('user/operations?count=' + count, headers.value)
watch(data, value => {
  operations.value = value
})
</script>

<template>
  <div class="right-dashboard">
    <div class="row">

      <!-- PC and Mobile all payments -->
      <div class="col-md-12 text-center">
        <h5 class="tab-title"> Əməliyyatlarım</h5>
      </div>
      <div v-if="operations.data.length" class="col-md-12 payments">
        <div class="table-responsive-sm text-center">
          <div class="dashboard-tabs all-payments">
            <table>
              <thead>
              <tr>
                <th scope="col">Hadisə</th>
                <th scope="col">Açıqlama</th>
                <th scope="col">Məbləğ</th>
                <th scope="col">Tarix</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="operation in operations.data">
                <td data-label="Hadisə">{{operation.type === 'increment' ? 'Balans artırıldı' : 'Balans silindi'}}</td>
                <td data-label="Açıqlama">
                 {{operation.detail}}
                </td>
                <td data-label="Məbləğ">
                 {{operation.amount}} AZN
                </td>
                <td data-label="Tarix">{{formatDateTime(operation.created_at)}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-else class="col-md-12">
        <div class="user-cart dashboard-empty">
          <div class="card-body2 card2">
            <div class="text-center"><img src="/img/money.svg" width="110"
                                          height="110" class="mb-2">
              <h3><strong>Etdiyiniz bir əməliyyat yoxdur</strong></h3>
              <h4>Bizi seçdiyiniz üçün təşəkkür edirik ! 😊</h4>
              <nuxt-link href="/payments" class="goo"><i
                  class="fas fa-arrow-alt-left"></i> Elə indi balansınızı
                artıraraq məhsul sifariş edin</nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <paginate :pagination="operations.meta" :params="{count}" :headers="headers" />
    </div>
  </div>
</template>

<style scoped>

</style>