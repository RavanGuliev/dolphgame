<script setup lang="ts">
import {authStore} from "~/stores/authStore";
import {formatDateTime} from "~/utils/dateFormatter";

const {$api} = useNuxtApp()
const userAuth = authStore()
const {headers} = storeToRefs(userAuth)

const statistics = await $api.get('user/statistics', headers.value)
const recentOrders = await $api.get('user/orders?count=2', headers.value)

const orderStatus = (operation: string) => {
  switch (operation) {
    case 'confirmed':
      return {label: 'Çatdırıldı', badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20'}
    case 'send':
      return {label: 'Sifariş verildi', badge: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 ring-sky-500/20'}
    case 'processing':
      return {label: 'Hazırlanır', badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-500/20'}
    default:
      return {label: 'Rədd edildi', badge: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 ring-rose-500/20'}
  }
}
</script>

<template>
  <div class="right-dashboard">
    <div class="space-y-5 min-w-0">

      <!-- Stats grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <!-- Sifarişlər -->
        <div class="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500/40 transition">
          <div aria-hidden="true" class="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-brand-500/10 blur-2xl"></div>
          <div class="relative flex items-start justify-between gap-2 mb-3">
            <span class="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 grid place-items-center">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>
            </span>
            <span class="inline-flex items-center h-5 px-1.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px] font-black tracking-wider uppercase">Toplam</span>
          </div>
          <div class="relative">
            <div class="text-[11.5px] font-bold text-ink-500 dark:text-ink-400">Sifarişlər</div>
            <div class="mt-1 flex items-baseline gap-1.5">
              <span class="text-[28px] md:text-[32px] font-black text-ink-900 dark:text-white tabular-nums leading-none">{{ statistics.data.orders }}</span>
              <span class="text-[12px] font-bold text-ink-500 dark:text-ink-400">ədəd</span>
            </div>
            <nuxt-link to="/user/dashboard/orders" class="mt-3 inline-flex items-center gap-1 text-[11.5px] font-bold text-brand-500 hover:text-brand-600 transition">
              Bax
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </nuxt-link>
          </div>
        </div>

        <!-- Ödənişlər -->
        <div class="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500/40 transition">
          <div aria-hidden="true" class="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl"></div>
          <div class="relative flex items-start justify-between gap-2 mb-3">
            <span class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 12h20"/></svg>
            </span>
            <span class="inline-flex items-center h-5 px-1.5 rounded bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-[10px] font-black tracking-wider uppercase">Toplam</span>
          </div>
          <div class="relative">
            <div class="text-[11.5px] font-bold text-ink-500 dark:text-ink-400">Ödənişlər</div>
            <div class="mt-1 flex items-baseline gap-1.5">
              <span class="text-[28px] md:text-[32px] font-black text-ink-900 dark:text-white tabular-nums leading-none">{{ statistics.data.payments }}</span>
              <span class="text-[12px] font-bold text-ink-500 dark:text-ink-400">AZN</span>
            </div>
            <nuxt-link to="/payments/online" class="mt-3 inline-flex items-center gap-1 text-[11.5px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition">
              Balans yüklə
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </nuxt-link>
          </div>
        </div>

        <!-- Bonuslar -->
        <div class="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-white dark:from-amber-500/15 dark:via-ink-900 dark:to-ink-900 ring-1 ring-amber-500/30 hover:ring-amber-500/50 transition">
          <div aria-hidden="true" class="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-amber-400/20 blur-2xl"></div>
          <div class="relative flex items-start justify-between gap-2 mb-3">
            <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 text-white grid place-items-center shadow-pop">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
            </span>
            <span class="inline-flex items-center h-5 px-1.5 rounded bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px] font-black tracking-wider uppercase">≈ {{ statistics.data.bonus_convert }} AZN</span>
          </div>
          <div class="relative">
            <div class="text-[11.5px] font-bold text-ink-500 dark:text-ink-400">Bonus xal</div>
            <div class="mt-1 flex items-baseline gap-1.5">
              <span class="text-[28px] md:text-[32px] font-black text-amber-700 dark:text-amber-400 tabular-nums leading-none">{{ statistics.data.bonuses }}</span>
              <span class="text-[12px] font-bold text-ink-500 dark:text-ink-400">xal</span>
            </div>
            <nuxt-link to="/user/dashboard/bonuses" class="mt-3 inline-flex items-center gap-1 text-[11.5px] font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 transition">
              Endirim üçün xərclə
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- Recent activity card -->
      <div class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 overflow-hidden">
        <div class="flex items-center justify-between gap-3 px-5 py-4 border-b border-ink-100 dark:border-ink-800">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-lg bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 grid place-items-center">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </span>
            <div>
              <h3 class="text-[14px] font-black text-ink-900 dark:text-white leading-tight">Son fəaliyyət</h3>
              <p class="text-[11px] text-ink-500 dark:text-ink-400">Son sifariş və əməliyyatlar</p>
            </div>
          </div>
          <nuxt-link to="/user/dashboard/orders" class="text-[12px] font-bold text-brand-500 hover:text-brand-600 inline-flex items-center gap-1 transition">
            Hamısına bax
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </nuxt-link>
        </div>
        <div v-if="recentOrders.data.length" class="divide-y divide-ink-100 dark:divide-ink-800">
          <nuxt-link v-for="order in recentOrders.data" :key="order.id"
                     :to="{name: 'game-product-slug', params: {slug: order.product.slug}}"
                     class="flex items-center gap-3 px-5 py-3.5 hover:bg-ink-50 dark:hover:bg-ink-800/50 transition">
            <span class="shrink-0 w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-800 grid place-items-center overflow-hidden">
              <img :src="order.product.image" :alt="order.product.name" class="w-full h-full object-cover"/>
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 flex-wrap">
                <h4 class="text-[13px] font-black text-ink-900 dark:text-white truncate">{{ order.product.name }}</h4>
                <span :class="orderStatus(order.operation).badge" class="inline-flex items-center h-4 px-1 rounded text-[9px] font-black tracking-wider uppercase ring-1">{{ orderStatus(order.operation).label }}</span>
              </div>
              <p class="text-[11px] text-ink-500 dark:text-ink-400 mt-0.5">{{ formatDateTime(order.created_at) }} · #{{ order.id }}</p>
            </div>
            <div class="text-right shrink-0">
              <div class="text-[13px] font-black text-ink-900 dark:text-white tabular-nums">{{ order.amount }} AZN</div>
            </div>
          </nuxt-link>
          <div class="px-5 py-5 text-center text-[12px] text-ink-500 dark:text-ink-400">
            Daha çox sifariş üçün
            <nuxt-link to="/games" class="text-brand-500 hover:text-brand-600 font-bold transition">məhsullara keç →</nuxt-link>
          </div>
        </div>
        <div v-else class="px-5 py-8 text-center text-[12.5px] text-ink-500 dark:text-ink-400">
          Hələ sifarişiniz yoxdur.
          <nuxt-link to="/games" class="text-brand-500 hover:text-brand-600 font-bold transition">məhsullara keç →</nuxt-link>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <nuxt-link to="/payments/online" class="flex items-center gap-2.5 p-3.5 rounded-xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 transition">
          <span class="shrink-0 w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-500 grid place-items-center">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
          </span>
          <span class="text-[12.5px] font-black text-ink-900 dark:text-white">Balans yüklə</span>
        </nuxt-link>
        <nuxt-link to="/games" class="flex items-center gap-2.5 p-3.5 rounded-xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 transition">
          <span class="shrink-0 w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>
          </span>
          <span class="text-[12.5px] font-black text-ink-900 dark:text-white">Yeni sifariş</span>
        </nuxt-link>
        <nuxt-link to="/user/dashboard/bonuses" class="flex items-center gap-2.5 p-3.5 rounded-xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 transition">
          <span class="shrink-0 w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 grid place-items-center">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
          </span>
          <span class="text-[12.5px] font-black text-ink-900 dark:text-white">Bonuslarım</span>
        </nuxt-link>
        <nuxt-link to="/pages/contact" class="flex items-center gap-2.5 p-3.5 rounded-xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 hover:ring-brand-500 transition">
          <span class="shrink-0 w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 grid place-items-center">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </span>
          <span class="text-[12.5px] font-black text-ink-900 dark:text-white">Dəstək</span>
        </nuxt-link>
      </div>

    </div>
  </div>
</template>

<style scoped>
</style>
