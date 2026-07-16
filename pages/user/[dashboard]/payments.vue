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
const count = 10
const userAuth = authStore()
const {headers} = storeToRefs(userAuth)

const paymentStatus = (operation: string) => {
  switch (operation) {
    case 'processing':
      return {label: 'Yoxlanılır', badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-500/20'}
    case 'canceled':
      return {label: 'Rədd edildi', badge: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 ring-rose-500/20'}
    default:
      return {label: 'Təsdiqləndi', badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20'}
  }
}
// Tabs only filter the payments already loaded on the current page — there's
// no endpoint for site-wide counts per status, so we don't pretend to show one.
const statusGroup = (operation: string) => {
  if (operation === 'processing' || operation === 'canceled') return operation
  return 'confirmed'
}
const brokenInvoices = ref(new Set<number>())
const onInvoiceError = (id: number) => {
  brokenInvoices.value.add(id)
}
const activeTab = ref('all')
const tabCount = (tab: string) => {
  if (!payments.value.data) return 0
  if (tab === 'all') return payments.value.data.length
  return payments.value.data.filter((p: any) => statusGroup(p.operation) === tab).length
}
const filteredPayments = computed(() => {
  if (!payments.value.data) return []
  if (activeTab.value === 'all') return payments.value.data
  return payments.value.data.filter((p: any) => statusGroup(p.operation) === activeTab.value)
})
useHead({
  title: 'Ödənişlərim'
})
payments.value = await $api.get('user/payments?count=' + count, headers.value)
watch(data, value => {
  payments.value = value
  activeTab.value = 'all'
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
        <!-- Status filter tabs (scoped to this page's payments) -->
        <div class="mb-3 inline-flex p-1 rounded-xl bg-ink-100 dark:bg-ink-800 flex-wrap">
          <button type="button" @click="activeTab = 'all'"
                  class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                  :class="activeTab === 'all' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
            Hamısı
            <span class="inline-flex items-center h-4 px-1 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px] font-black tabular-nums">{{ tabCount('all') }}</span>
          </button>
          <button type="button" @click="activeTab = 'confirmed'"
                  class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                  :class="activeTab === 'confirmed' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
            Təsdiqləndi
            <span class="inline-flex items-center h-4 px-1 rounded bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px] font-black tabular-nums">{{ tabCount('confirmed') }}</span>
          </button>
          <button type="button" @click="activeTab = 'processing'"
                  class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                  :class="activeTab === 'processing' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
            Yoxlanılır
            <span class="inline-flex items-center h-4 px-1 rounded bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px] font-black tabular-nums">{{ tabCount('processing') }}</span>
          </button>
          <button type="button" @click="activeTab = 'canceled'"
                  class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                  :class="activeTab === 'canceled' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
            Rədd edildi
            <span class="inline-flex items-center h-4 px-1 rounded bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 text-[10px] font-black tabular-nums">{{ tabCount('canceled') }}</span>
          </button>
        </div>

        <div class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 overflow-hidden text-left">
          <div v-if="filteredPayments.length" class="divide-y divide-ink-100 dark:divide-ink-800">
            <div v-for="payment in filteredPayments" :key="payment.id"
                 class="flex items-center gap-3 px-5 py-3.5">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-ink-100 dark:bg-ink-800 grid place-items-center overflow-hidden">
                <img v-if="payment.invoice && !brokenInvoices.has(payment.id)" :src="payment.invoice" @error="onInvoiceError(payment.id)" class="w-full h-full object-cover"/>
                <svg v-else class="w-5 h-5 text-ink-500 dark:text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 12h20"/></svg>
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <h3 class="text-[13.5px] font-black text-ink-900 dark:text-white truncate">{{ payment.type === 'invoice' ? 'Faktura ilə ödəniş' : 'Onlayn ödəniş' }}</h3>
                  <span :class="paymentStatus(payment.operation).badge" class="inline-flex items-center h-4 px-1 rounded text-[9px] font-black tracking-wider uppercase ring-1">{{ paymentStatus(payment.operation).label }}</span>
                </div>
                <p class="text-[11px] text-ink-500 dark:text-ink-400 mt-0.5">{{ formatDateTime(payment.created_at) }} · son əməliyyat: {{ formatDateTime(payment.updated_at) }}</p>
              </div>
              <div class="text-right shrink-0">
                <div class="text-[14px] font-black text-ink-900 dark:text-white tabular-nums">{{ payment.amount ?? '-' }} AZN</div>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center text-[12.5px] text-ink-500 dark:text-ink-400">
            Bu filtrdə (hazırkı səhifədə) ödəniş yoxdur.
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