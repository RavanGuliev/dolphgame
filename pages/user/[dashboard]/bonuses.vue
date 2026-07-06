<script setup lang="ts">
import {authStore} from "~/stores/authStore";
import Paginate from "~/components/modules/paginate.vue";
import {paginateStore} from "~/stores/paginateStore";
import {storeToRefs} from "pinia";
import {useHead} from "@unhead/vue";
import {loadingStore} from "~/stores/loadingStore";
import {formatDateTime} from "~/utils/dateFormatter";
const store = paginateStore()
const loading = loadingStore()
const {setLoading} = loading
const {data} = storeToRefs(store)
const bonuses = ref({})
const bonus = ref(100)
const {$api, $toast} = useNuxtApp()
const count = 4
const userAuth = authStore()
const {setUserData} = userAuth
const {headers, user} = storeToRefs(userAuth)
const convertBonus = () => {
  setLoading(true)
  $api.post('user/convert-bonus', {bonus: bonus.value}, headers.value).then(res => {
    $toast.success(res.data)
    $api.get('user',  headers.value).then(res => {
      setUserData(res.data)
    })
     $api.get('user/moneys?count=' + count, headers.value).then(res => {
       bonuses.value = res
     })
  }).catch(err => {
    $toast.error(err)
  }).finally(() => setLoading(false))
}
useHead({
  title: 'Bonuslarım'
})
bonuses.value = await $api.get('user/moneys?count=' + count, headers.value)
watch(data, value => {
  bonuses.value = value
})
</script>

<template>
  <div class="right-dashboard">
    <div class="row">

      <!-- PC and Mobile title and transfer bonus -->
      <div class="col-md-12 text-center">
        <h5 class="tab-title"> Bonuslarım</h5>
      </div>
      <!-- Bu Qalsın !!! -->
      <div class="col-md-12 text-left">
        <section class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 p-5 md:p-6 text-white shadow-pop">
          <div aria-hidden="true" class="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/15 blur-3xl"></div>
          <div aria-hidden="true" class="absolute -bottom-16 -left-8 w-40 h-40 rounded-full bg-orange-300/30 blur-3xl"></div>
          <div class="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-5">
            <div>
              <span class="inline-flex items-center gap-1.5 h-6 px-2 rounded-full bg-white/20 backdrop-blur text-white text-[10.5px] font-black tracking-wider uppercase ring-1 ring-white/30">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
                DolPh Bonus
              </span>
              <div class="mt-3 flex items-baseline gap-2">
                <span class="text-[44px] md:text-[56px] font-black tabular-nums leading-none drop-shadow-[0_4px_18px_rgba(0,0,0,0.18)]">{{ user.bonus }}</span>
                <span class="text-[16px] font-black text-white/90">xal</span>
              </div>
              <p class="mt-2 text-[12.5px] text-white/85 leading-relaxed">Toplanmış bonus xalını balansa çevir, növbəti alışında istifadə et.</p>
            </div>
            <div class="hidden md:flex w-28 h-28 rounded-full bg-white/15 backdrop-blur ring-2 ring-white/20 grid place-items-center shadow-pop shrink-0">
              <svg class="w-16 h-16 text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.25)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
            </div>
          </div>

          <form @submit.prevent="convertBonus" method="post" class="relative mt-5 pt-5 border-t border-white/20 flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div class="flex-1">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-white/80 mb-1.5">Çevirmək istədiyin bonus</label>
              <input :disabled="user.bonus < 100" name="bonus" v-model="bonus" type="number"
                     class="w-full h-11 px-3.5 rounded-xl bg-white/95 text-ink-900 font-bold outline-none focus:ring-2 focus:ring-white/60 transition disabled:opacity-60">
            </div>
            <button :disabled="user.bonus < 100" type="submit"
                    class="h-11 px-5 rounded-xl bg-ink-900 hover:bg-ink-800 text-white text-[13px] font-black transition active:scale-95 disabled:opacity-50 disabled:active:scale-100 whitespace-nowrap">
              Tələb et
            </button>
            <small v-if="user.bonus < 100" class="basis-full text-[11.5px] font-semibold text-white/90">Bonus ən azı 100 olmalıdır</small>
          </form>
        </section>
      </div>
      <!-- Bu Qalsın !!! -->

      <!-- PC and Mobile all transfers -->
      <div v-if="bonuses.data.length" class="col-md-12 payments text-left">
        <h5 class="text-[15px] font-black text-ink-900 dark:text-white mb-3 mt-4">Xal tarixçəsi</h5>
        <div class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 overflow-hidden">
          <div class="divide-y divide-ink-100 dark:divide-ink-800">
            <div v-for="item in bonuses.data" :key="item.id" class="flex items-center gap-3 px-5 py-3.5">
              <span class="shrink-0 w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 grid place-items-center">
                <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l10-10M17 7v7M17 7h-7"/></svg>
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <h4 class="text-[13px] font-black text-ink-900 dark:text-white">Bonus balansa çevrildi</h4>
                  <span class="inline-flex items-center h-4 px-1 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[9px] font-black tracking-wider uppercase ring-1 ring-emerald-500/20">Təsdiqləndi</span>
                </div>
                <p class="text-[11px] text-ink-500 dark:text-ink-400 mt-0.5">{{ formatDateTime(item.created_at) }}</p>
              </div>
              <div class="text-right shrink-0">
                <div class="text-[13.5px] font-black text-rose-600 dark:text-rose-400 tabular-nums">−{{ item.bonus }} xal</div>
                <div class="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold">+{{ item.amount }} AZN</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="col-md-12">
        <div class="user-cart dashboard-empty">
          <div class="card-body2 card2">
            <div class="text-center"><img src="/img/transfer.svg" width="110"
                                          height="110" class="mb-2">
              <h3><strong>Transfer yoxdur</strong></h3>
              <h4>Bizi seçdiyiniz üçün təşəkkür edirik ! 😊</h4>
              <nuxt-link to="/games" class="goo"><i
                  class="fas fa-arrow-alt-left"></i> Elə indi bonus qazan</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>