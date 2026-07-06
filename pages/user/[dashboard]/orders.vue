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
const orderStatus = (operation: string) => {
  switch (operation) {
    case 'confirmed':
      return {label: 'Təsdiqləndi', icon: 'fa-check-circle', badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20'}
    case 'send':
      return {label: 'Sifariş verildi', icon: 'fa-shopping-bag', badge: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 ring-sky-500/20'}
    case 'processing':
      return {label: 'Sifariş hazırlanır', icon: 'fa-hourglass-half', badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-500/20'}
    default:
      return {label: 'Rədd edildi', icon: 'fa-times-circle', badge: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 ring-rose-500/20'}
  }
}
// Tabs only filter the orders already loaded on the current page — there's
// no endpoint for site-wide counts per status, so we don't pretend to show one.
const statusGroup = (operation: string) => {
  if (operation === 'confirmed') return 'delivered'
  if (operation === 'processing' || operation === 'send') return 'pending'
  return 'cancelled'
}
const activeTab = ref('all')
const tabCount = (tab: string) => {
  if (!orders.value.data) return 0
  if (tab === 'all') return orders.value.data.length
  return orders.value.data.filter((o: any) => statusGroup(o.operation) === tab).length
}
const filteredOrders = computed(() => {
  if (!orders.value.data) return []
  if (activeTab.value === 'all') return orders.value.data
  return orders.value.data.filter((o: any) => statusGroup(o.operation) === activeTab.value)
})
useHead({
  title: 'Sifarişlərim'
})
orders.value = await $api.get('user/orders?count=' + count, headers.value)
watch(data, value => {
  orders.value = value
  activeTab.value = 'all'
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
        <!-- Status filter tabs (scoped to this page's orders) -->
        <div class="mb-3 inline-flex p-1 rounded-xl bg-ink-100 dark:bg-ink-800 flex-wrap">
          <button type="button" @click="activeTab = 'all'"
                  class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                  :class="activeTab === 'all' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
            Hamısı
            <span class="inline-flex items-center h-4 px-1 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px] font-black tabular-nums">{{ tabCount('all') }}</span>
          </button>
          <button type="button" @click="activeTab = 'delivered'"
                  class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                  :class="activeTab === 'delivered' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
            Çatdırılıb
            <span class="inline-flex items-center h-4 px-1 rounded bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px] font-black tabular-nums">{{ tabCount('delivered') }}</span>
          </button>
          <button type="button" @click="activeTab = 'pending'"
                  class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                  :class="activeTab === 'pending' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
            Gözləyir
            <span class="inline-flex items-center h-4 px-1 rounded bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px] font-black tabular-nums">{{ tabCount('pending') }}</span>
          </button>
          <button type="button" @click="activeTab = 'cancelled'"
                  class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                  :class="activeTab === 'cancelled' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
            Ləğv
            <span class="inline-flex items-center h-4 px-1 rounded bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 text-[10px] font-black tabular-nums">{{ tabCount('cancelled') }}</span>
          </button>
        </div>

        <div class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 overflow-hidden text-left">
          <div v-if="filteredOrders.length" class="divide-y divide-ink-100 dark:divide-ink-800">
            <div v-for="order in filteredOrders" :key="order.id"
                 class="flex items-center gap-3 px-5 py-3.5">
              <nuxt-link :to="{name: 'game-product-slug', params: {slug: order.product.slug}}"
                         class="shrink-0 w-12 h-12 rounded-xl bg-ink-100 dark:bg-ink-800 grid place-items-center overflow-hidden">
                <img :src="order.product.image" :alt="order.product.name" class="w-full h-full object-cover"/>
              </nuxt-link>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <nuxt-link :to="{name: 'game-product-slug', params: {slug: order.product.slug}}"
                             class="text-[13.5px] font-black text-ink-900 dark:text-white truncate hover:text-brand-500 transition">{{ order.product.name }}</nuxt-link>
                  <span :class="orderStatus(order.operation).badge" class="inline-flex items-center h-4 px-1 rounded text-[9px] font-black tracking-wider uppercase ring-1">{{ orderStatus(order.operation).label }}</span>
                </div>
                <p class="text-[11px] text-ink-500 dark:text-ink-400 mt-0.5">{{ formatDateTime(order.created_at) }} · #{{ order.id }} · {{ order.count }} ədəd</p>
              </div>
              <div class="text-right shrink-0 flex items-center gap-4">
                <div class="text-[13.5px] font-black text-ink-900 dark:text-white tabular-nums">{{ order.amount }} AZN</div>
                <a @click="viewDetail(order)" data-toggle="modal"
                   data-target="#details"
                   style="cursor: pointer"
                   class="inline-flex items-center gap-1 text-[11.5px] font-bold text-brand-500 hover:text-brand-600 transition">
                  Detallar
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center text-[12.5px] text-ink-500 dark:text-ink-400">
            Bu filtrdə (hazırkı səhifədə) sifariş yoxdur.
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