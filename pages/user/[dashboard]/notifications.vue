<script setup lang="ts">
import {authStore} from "~/stores/authStore";
import {userStore} from "~/stores/userStore";
import Paginate from "~/components/modules/paginate.vue";
import {paginateStore} from "~/stores/paginateStore";
import {storeToRefs} from "pinia";
import {useHead} from "@unhead/vue";
import {loadingStore} from "~/stores/loadingStore";
const store = paginateStore()
const {data} = storeToRefs(store)
const notifications = ref({})
const {$api} = useNuxtApp()
const count = 5
const userAuth = authStore()
const {headers} = storeToRefs(userAuth)
const userStore1 = userStore()
const {setNotifications} = userStore1
const router = useRouter()

const notifBadge = (type: string) => {
  if (type === 'order') return 'bg-brand-50 dark:bg-brand-500/10 text-brand-500'
  if (type === 'payment') return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  return 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400'
}
const typeLabel = (type: string) => {
  if (type === 'order') return 'Sifariş'
  if (type === 'payment') return 'Ödəniş'
  return 'Digər'
}
// Tabs only filter the notifications already loaded on the current page —
// there's no endpoint for site-wide counts per type.
const activeTab = ref('all')
const tabCount = (tab: string) => {
  if (!notifications.value.data) return 0
  if (tab === 'all') return notifications.value.data.length
  return notifications.value.data.filter((n: any) => (n.type === 'order' || n.type === 'payment' ? n.type : 'other') === tab).length
}
const filteredNotifications = computed(() => {
  if (!notifications.value.data) return []
  if (activeTab.value === 'all') return notifications.value.data
  return notifications.value.data.filter((n: any) => (n.type === 'order' || n.type === 'payment' ? n.type : 'other') === activeTab.value)
})

const openNotification = (n: any) => {
  $api.patch('user/notifications/read', {id: n.id}, headers.value).then(() => {
    if (n.type === 'payment') router.push('/user/dashboard/payments')
    else if (n.type === 'order') router.push('/user/dashboard/orders')
    $api.get('user/notifications?count=' + count, headers.value).then(res => {
      notifications.value = res
    })
    $api.get('user/notifications?count=5', headers.value).then(res => {
      $api.get('user/notifications/count', headers.value).then(response => {
        setNotifications(res.data, response.data)
      })
    })
  })
}

useHead({
  title: 'Bildirişlər'
})
notifications.value = await $api.get('user/notifications?count=' + count, headers.value)
watch(data, value => {
  notifications.value = value
  activeTab.value = 'all'
})
</script>

<template>
  <div class="right-dashboard">
    <div class="row">

      <!-- PC and Mobile all notifications and title -->
      <div class="col-md-12 text-center">
        <h5 class="tab-title"> Bildirişlər</h5>
      </div>
      <div v-if="notifications.data.length" class="col-md-12 chg-mt text-left">
        <div class="row">

          <!-- Status filter tabs (scoped to this page's notifications) -->
          <div class="col-md-12 mb-3">
            <div class="inline-flex p-1 rounded-xl bg-ink-100 dark:bg-ink-800 flex-wrap">
              <button type="button" @click="activeTab = 'all'"
                      class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                      :class="activeTab === 'all' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
                Hamısı
                <span class="inline-flex items-center h-4 px-1 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px] font-black tabular-nums">{{ tabCount('all') }}</span>
              </button>
              <button type="button" @click="activeTab = 'order'"
                      class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                      :class="activeTab === 'order' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
                Sifariş
                <span class="inline-flex items-center h-4 px-1 rounded bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 text-[10px] font-black tabular-nums">{{ tabCount('order') }}</span>
              </button>
              <button type="button" @click="activeTab = 'payment'"
                      class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                      :class="activeTab === 'payment' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
                Ödəniş
                <span class="inline-flex items-center h-4 px-1 rounded bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px] font-black tabular-nums">{{ tabCount('payment') }}</span>
              </button>
              <button type="button" @click="activeTab = 'other'"
                      class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                      :class="activeTab === 'other' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
                Digər
                <span class="inline-flex items-center h-4 px-1 rounded bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400 text-[10px] font-black tabular-nums">{{ tabCount('other') }}</span>
              </button>
            </div>
          </div>

          <div class="col-md-12">
            <div v-if="filteredNotifications.length" class="space-y-3">
              <button v-for="notification in filteredNotifications" :key="notification.id"
                      type="button" @click="openNotification(notification)"
                      class="w-full text-left group rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500/40 transition p-4 flex items-start gap-3">
                <span :class="notifBadge(notification.type)" class="shrink-0 w-10 h-10 rounded-xl grid place-items-center">
                  <svg v-if="notification.type === 'order'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>
                  <svg v-else-if="notification.type === 'payment'" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 12h20"/></svg>
                  <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                </span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-2 flex-wrap">
                    <h3 class="text-[13.5px] font-black text-ink-900 dark:text-white">{{ notification.message }}</h3>
                    <span class="shrink-0 text-[11px] text-ink-500 dark:text-ink-400 whitespace-nowrap">{{ notification.created_at }}</span>
                  </div>
                  <span :class="notifBadge(notification.type)" class="mt-2 inline-flex items-center h-5 px-1.5 rounded-md text-[10px] font-black tracking-wider uppercase">{{ typeLabel(notification.type) }}</span>
                </div>
              </button>
            </div>
            <div v-else class="px-5 py-8 text-center text-[12.5px] text-ink-500 dark:text-ink-400">
              Bu filtrdə (hazırkı səhifədə) bildiriş yoxdur.
            </div>
          </div>

          <!-- Pagination -->
          <paginate :params="{count}" :pagination="notifications.meta" :headers="{headers}" />

        </div>
      </div>
      <div v-else class="col-md-12">
        <div class="user-cart dashboard-empty">
          <div class="card-body2 card2">
            <div class="text-center"><img src="/img/bell.svg" width="110"
                                          height="110" class="mb-2">
              <h3><strong>Bildiriş yoxdur</strong></h3>
              <h4>Bizi seçdiyiniz üçün təşəkkür edirik ! 😊</h4>
              <nuxt-link to="/" class="goo"><i
                  class="fas fa-arrow-alt-left"></i> Ana
                səhifəyə geri dön</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>