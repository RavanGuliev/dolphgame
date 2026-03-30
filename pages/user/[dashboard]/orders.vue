<script setup lang="ts">
import {authStore} from "~/stores/authStore";
import Paginate from "~/components/modules/paginate.vue";
import {paginateStore} from "~/stores/paginateStore";
import {storeToRefs} from "pinia";
import {useHead} from "@unhead/vue";
import {formatDateTime} from "~/utils/dateFormatter";
const store = paginateStore()
const {data} = storeToRefs(store)
const orders = ref({})
const {$api, $toast} = useNuxtApp()
const count = 4
const userAuth = authStore()
const {headers} = storeToRefs(userAuth)
const selectedOrder = ref()
const viewDetail = (product: any) => {
  selectedOrder.value = product
}
const copyToClipboard = (pin: any) => {
  navigator.clipboard.writeText(pin).then(function () {
    $toast.success('Pin kopyalandı');
  }, function (err) {
    $toast.success(err.message);
  });

}
useHead({
  title: 'Sifarişlərim'
})
orders.value = await $api.get('user/orders?count=' + count, headers.value)
watch(data, value => {
  orders.value = value
})
</script>

<template>
  <div class="right-dashboard">
    <div v-if="selectedOrder" class="modal fade detail-modal" id="details"
         tabindex="-1" role="dialog"
         aria-labelledby="details" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <button type="button" class="close" data-dismiss="modal"
                  aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <div class="modal-body">
            <form class="row modal-form">
              <div class="col-md-6">
                <label>Məhsul Adı</label>
                <input disabled class="form-control"
                       type="text"
                       :value="selectedOrder.product.name">
              </div>
              <div class="col-md-6">
                <label>Sifariş No</label>
                <input disabled class="form-control"
                       type="text"
                       :value="selectedOrder.id">
              </div>
              <div class="col-md-6">
                <label>Sifariş Tarixi</label>
                <input disabled class="form-control"
                       type="text"
                       :value="formatDateTime(selectedOrder.created_at)">
              </div>
              <div class="col-md-6">
                <label>Əməliyyat Saatı</label>
                <input disabled class="form-control"
                       type="text"
                       :value="formatDateTime(selectedOrder.updated_at)">
              </div>

              <div class="col-md-6">
                <label>Ədəd</label>
                <input class="form-control" disabled
                       type="number"
                       :value="selectedOrder.count">
              </div>
              <div class="col-md-6">
                <label>Satış Qiyməti</label>
                <input disabled class="form-control"
                       type="text"
                       :value="selectedOrder.amount + ' Azn'">
              </div>
              <div v-if="selectedOrder.type === 'e-pin'" class="col-12">
                <label>E-pin</label>
                <ul class="list-group">
                  <li v-for="pin in selectedOrder.e_pins" class="list-group-item back-white-for-dark">
                                                                                    <span
                                                                                        style="white-space: pre-line;">{{pin}}</span>
                    <i @click="copyToClipboard(pin)"
                       class="fas fa-copy copy"></i>
                  </li>
                </ul>
              </div>

              <div v-if="selectedOrder.info" class="col-md-6">
                <div v-for="(info, key) in selectedOrder.info">
                  <label>{{key}}</label>
                  <input disabled class="form-control"
                         type="text"
                         :value="info">
                </div>
              </div>

              <div v-if="selectedOrder.operation === 'canceled'" class="col-md-12 reason">
                <label>Səbəb</label>
                <p>{{selectedOrder.cancel_reason}}</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row">

      <!-- PC and Mobile all orders -->
      <div class="col-md-12 text-center">
        <h5 class="tab-title"> Sifarişlərim</h5>
      </div>

      <div v-if="orders.data.length" class="col-md-12">
        <div class="table-responsive-sm text-center">
          <div class="dashboard-tabs">
            <table>
              <thead>
              <tr>
                <th scope="col">Şəkil</th>
                <th scope="col">Məhsul Adı</th>
                <th scope="col">Miqdarı</th>
                <th scope="col">Qiymət</th>
                <th scope="col">Ətraflı</th>
                <th scope="col">Status</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="order in orders.data">
                <td data-label="Şəkil">
                  <nuxt-link :to="{name: 'game-product-slug', params: {slug: order.product.slug}}"><img
                      :src="order.product.image"
                      :alt="order.product.name"></nuxt-link>
                </td>
                <td data-label="Məhsul Adı">
                  <nuxt-link class="tab-game-name"
                     :to="{name: 'game-product-slug', params: {slug: order.product.slug}}">{{order.product.name}}</nuxt-link>
                </td>
                <td data-label="Miqdarı">{{order.count}}</td>
                <td data-label="Qiymət">{{order.amount}} Azn</td>
                <td data-label="Ətraflı">
                  <a @click="viewDetail(order)" data-toggle="modal"
                     data-target="#details"
                     class="all-details" style="cursor: pointer">Detallar</a>
                </td>
                <td data-label="Status">
                  <div v-if="order.operation === 'processing'" class="status-prepare">
                    <i class="fas fa-hourglass-half"></i>
                    Sifariş hazırlanır
                  </div>
                  <div v-else-if="order.operation === 'send'" class="status-order">
                    <i class="fas fa-shopping-bag"></i>
                    Sifariş verildi
                  </div>
                  <div v-else-if="order.operation === 'confirmed'" class="status-okey">
                    <i class="fas fa-check-circle"></i>
                    Təsdiqləndi
                  </div>
                  <div v-else class="status-cancel">
                    <i class="fas fa-times-circle"></i>
                    Rədd edildi
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
            <div class="text-center"><img src="/img/box.svg" width="110"
                                          height="110"
                                          class="mb-2">
              <h3><strong>Sifarişiniz yoxdur</strong></h3>
              <h4>Bizi seçdiyiniz üçün təşəkkür edirik ! 😊</h4>
              <nuxt-link to="/games" class="goo"><i
                  class="fas fa-arrow-alt-left"></i> Elə indi sifariş
                et</nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <paginate :pagination="orders.meta" :params="{count}" :headers="headers" />


    </div>
  </div>
</template>

<style scoped>

</style>