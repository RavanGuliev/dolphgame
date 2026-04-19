<script setup lang="ts">
import {authStore} from "~/stores/authStore";
import Paginate from "~/components/modules/paginate.vue";
import {paginateStore} from "~/stores/paginateStore";
import {storeToRefs} from "pinia";
import {useHead} from "@unhead/vue";
import {formatDateTime} from "~/utils/dateFormatter";
const store = paginateStore()
const {data} = storeToRefs(store)
const payments = ref({})
const {$api} = useNuxtApp()
const count = 4
const userAuth = authStore()
const {headers} = storeToRefs(userAuth)
useHead({
  title: 'Ödənişlərim'
})
payments.value = await $api.get('user/payments?count=' + count, headers.value)
watch(data, value => {
  payments.value = value
})
</script>

<template>
  <div class="right-dashboard">
    <div class="row">

      <!-- PC and Mobile all payments -->
      <div class="col-md-12 text-center">
        <h5 class="tab-title"> Ödənişlərim</h5>
      </div>
      <div v-if="payments.data.length" class="col-md-12 payments">
        <div class="table-responsive-sm text-center">
          <div class="dashboard-tabs all-payments">
            <table>
              <thead>
              <tr>
                <th scope="col">Faktura</th>
                <th scope="col">Ödəmə növü</th>
                <th scope="col">Ödəniş</th>
                <th scope="col">Tarix</th>
                <th scope="col">Son əməliyyat</th>
                <th scope="col">Status</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="payment in payments.data">
                <td data-label="Faktura"><img width="64" :src="payment.invoice"></td>
                <td data-label="Ödəmə növü">
                 <span v-if="payment.type === 'invoice'">
                   Faktura ilə
                 </span>
                  <span v-else>
                    Online
                  </span>
                </td>
                <td data-label="Ödəniş">
                 {{payment.amount ?? '-'}}
                </td>
                <td data-label="Tarix">{{formatDateTime(payment.created_at)}}</td>
                <td data-label="Son əməliyyat">{{formatDateTime(payment.updated_at)}}</td>
                <td data-label="Status">
                  <div v-if="payment.operation === 'processing'" class="status-prepare">
                    <i class="fas fa-hourglass-half"></i>
                    Yoxlanılır
                  </div>
                  <div v-else-if="payment.operation === 'canceled'" class="status-cancel">
                    <i class="fas fa-times-circle"></i>
                    Rədd edildi
                  </div>
                  <div v-else class="status-okey">
                    <i class="fas fa-check-circle"></i>
                    Təsdiqləndi
                  </div>
                </td>
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
              <h3><strong>Ödənişiniz yoxdur</strong></h3>
              <h4>Bizi seçdiyiniz üçün təşəkkür edirik ! 😊</h4>
              <nuxt-link href="/payments" class="goo"><i
                  class="fas fa-arrow-alt-left"></i> Elə indi balansı
                artır</nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <paginate :pagination="payments.meta" :params="{count}" :headers="headers" />
    </div>
  </div>
</template>

<style scoped>

</style>