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
  activeTab.value = 'all'
})

const isIncrement = (operation: any) => operation.type === 'increment'
const activeTab = ref('all')
const tabCount = (tab: string) => {
  if (!operations.value.data) return 0
  if (tab === 'all') return operations.value.data.length
  if (tab === 'increment') return operations.value.data.filter((o: any) => isIncrement(o)).length
  return operations.value.data.filter((o: any) => !isIncrement(o)).length
}
const filteredOperations = computed(() => {
  if (!operations.value.data) return []
  if (activeTab.value === 'all') return operations.value.data
  if (activeTab.value === 'increment') return operations.value.data.filter((o: any) => isIncrement(o))
  return operations.value.data.filter((o: any) => !isIncrement(o))
})
</script>

<template>
  <div class="right-dashboard">
    <div class="row">

      <!-- PC and Mobile all payments -->
      <div class="col-md-12 text-center">
        <h5 class="tab-title"> Əməliyyatlarım</h5>
      </div>
      <div v-if="operations.data.length" class="col-md-12 payments text-left">
        <!-- Type filter tabs -->
        <div class="mb-3 inline-flex p-1 rounded-xl bg-ink-100 dark:bg-ink-800 flex-wrap">
          <button type="button" @click="activeTab = 'all'"
                  class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                  :class="activeTab === 'all' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
            Hamısı
            <span class="inline-flex items-center h-4 px-1 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px] font-black tabular-nums">{{ tabCount('all') }}</span>
          </button>
          <button type="button" @click="activeTab = 'increment'"
                  class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                  :class="activeTab === 'increment' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
            Artırılıb
            <span class="inline-flex items-center h-4 px-1 rounded bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px] font-black tabular-nums">{{ tabCount('increment') }}</span>
          </button>
          <button type="button" @click="activeTab = 'decrement'"
                  class="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[12.5px] font-bold transition"
                  :class="activeTab === 'decrement' ? 'bg-white dark:bg-ink-900 text-ink-900 dark:text-white shadow-soft' : 'text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'">
            Silinib
            <span class="inline-flex items-center h-4 px-1 rounded bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 text-[10px] font-black tabular-nums">{{ tabCount('decrement') }}</span>
          </button>
        </div>

        <div class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 overflow-hidden">
          <div v-if="filteredOperations.length" class="divide-y divide-ink-100 dark:divide-ink-800">
            <div v-for="operation in filteredOperations" :key="operation.id" class="flex items-center gap-3 px-5 py-3.5">
              <span class="shrink-0 w-10 h-10 rounded-xl grid place-items-center"
                    :class="isIncrement(operation) ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'">
                <svg v-if="isIncrement(operation)" class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                <svg v-else class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              </span>
              <div class="min-w-0 flex-1">
                <h4 class="text-[13.5px] font-black text-ink-900 dark:text-white truncate">{{ isIncrement(operation) ? 'Balans artırıldı' : 'Balans silindi' }}</h4>
                <p class="text-[11px] text-ink-500 dark:text-ink-400 mt-0.5 truncate">{{ operation.detail }}</p>
              </div>
              <div class="text-right shrink-0">
                <div class="text-[14px] font-black tabular-nums"
                     :class="isIncrement(operation) ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">
                  {{ isIncrement(operation) ? '+' : '−' }}{{ operation.amount }} AZN
                </div>
                <div class="text-[10.5px] text-ink-400 dark:text-ink-500 mt-0.5">{{ formatDateTime(operation.created_at) }}</div>
              </div>
            </div>
          </div>
          <div v-else class="px-5 py-8 text-center text-[12.5px] text-ink-500 dark:text-ink-400">
            Bu filtrdə (hazırkı səhifədə) əməliyyat yoxdur.
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
