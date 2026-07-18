<script setup lang="ts">
import {authStore} from "~/stores/authStore";
import {userStore} from "~/stores/userStore";
import {storeToRefs} from "pinia";
import {useCookie} from "#app/composables/cookie";
import {useRouter, useRoute} from "vue-router";

const {$api} = useNuxtApp()
const cookie = useCookie('token')
definePageMeta({
  middleware: 'auth'
})
const router = useRouter()
const route = useRoute()
const userAuth = authStore()
const {setToken, setUserData} = userAuth
const {user, headers} = storeToRefs(userAuth)
const {notifications_count} = storeToRefs(userStore())

const logout = () => {
  $api.get('user/logout', headers.value)
  cookie.value = null
  setToken(null)
  setUserData(null)
  window.location = '/'
}

const navItems = [
  {to: '/user/dashboard', label: 'Profilim', exact: true, icon: 'user'},
  {to: '/user/dashboard/orders', label: 'Sifarişlərim', icon: 'orders'},
  {to: '/user/dashboard/payments', label: 'Ödənişlərim', icon: 'payments'},
  {to: '/user/dashboard/operations', label: 'Əməliyyatlar', icon: 'operations'},
  {to: '/user/dashboard/bonuses', label: 'Bonuslarım', icon: 'bonus'},
  {to: '/user/dashboard/notifications', label: 'Bildirişlər', icon: 'bell'},
  {to: '/user/dashboard/account', label: 'Tənzimləmələr', icon: 'settings'},
]

const isActive = (item: any) => item.exact ? route.path === item.to : route.path.startsWith(item.to)
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 md:px-6 py-6">

    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" class="flex items-center gap-1.5 text-[12px] text-ink-500 dark:text-ink-400 mb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
      <nuxt-link to="/" class="hover:text-brand-500 transition">Ana səhifə</nuxt-link>
      <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      <span class="font-semibold text-ink-900 dark:text-white">Şəxsi kabinet</span>
    </nav>

    <!-- Page title -->
    <div class="flex items-center justify-between gap-4 mb-5 flex-wrap">
      <div>
        <h1 class="text-[22px] md:text-[26px] font-black tracking-tight text-ink-900 dark:text-white leading-tight">Şəxsi kabinet</h1>
        <p class="mt-1 text-[12.5px] text-ink-500 dark:text-ink-400">Hesabını idarə et, sifarişlərini izlə.</p>
      </div>
      <nuxt-link to="/user/dashboard/payments" class="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-[12.5px] font-bold transition shadow-pop active:scale-95">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 12h20"/></svg>
        Balans yüklə
      </nuxt-link>
    </div>

    <!-- Two-column layout -->
    <div v-if="user" class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 mb-10">

      <!-- LEFT — Profile sidebar -->
      <aside class="space-y-4">
        <!-- User card -->
        <div class="relative overflow-hidden rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-5">
          <div aria-hidden="true" class="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-brand-500/10 blur-2xl"></div>

          <div class="relative flex items-center gap-3 mb-4">
            <span class="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-500 to-[#FF6A2E] grid place-items-center text-white font-black text-[20px] shadow-pop ring-2 ring-white dark:ring-ink-900 shrink-0">
              <img :src="user.avatar" :alt="user.full_name" class="w-full h-full object-cover"/>
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5">
                <h2 class="text-[14.5px] font-black text-ink-900 dark:text-white truncate">{{ user.full_name }}</h2>
                <span class="inline-flex items-center h-4 px-1 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[9px] font-black tracking-wider uppercase ring-1 ring-emerald-500/20">Aktiv</span>
              </div>
              <p class="text-[11.5px] text-ink-500 dark:text-ink-400 truncate">{{ user.email }}</p>
            </div>
          </div>

          <!-- Customer code chip -->
          <div class="flex items-center gap-2 text-[11.5px] text-ink-500 dark:text-ink-400 mb-4">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Müştəri kodu: <span class="font-black text-ink-900 dark:text-white tabular-nums">{{ user.id }}</span>
          </div>

          <!-- Balance + bonus mini cards -->
          <div class="grid grid-cols-2 gap-2.5">
            <div class="p-3 rounded-xl bg-ink-50 dark:bg-ink-800/60 ring-1 ring-ink-200 dark:ring-ink-700">
              <div class="text-[10px] font-black uppercase tracking-wider text-ink-500 dark:text-ink-400 mb-1">Balans</div>
              <div class="text-[16px] font-black text-ink-900 dark:text-white tabular-nums leading-none">{{ user.balance }}<span class="text-[10px] font-bold text-ink-500 ml-0.5">AZN</span></div>
            </div>
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 ring-1 ring-amber-500/20">
              <div class="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
                Bonus
              </div>
              <div class="text-[16px] font-black text-amber-700 dark:text-amber-400 tabular-nums leading-none">{{ user.bonus }}<span class="text-[10px] font-bold text-amber-600/70 ml-0.5">xal</span></div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="rounded-2xl bg-white dark:bg-ink-900 ring-1 ring-ink-200 dark:ring-ink-800 p-2">
          <nuxt-link v-for="item in navItems" :key="item.to" :to="item.to"
                     class="flex items-center gap-2.5 px-3 h-10 rounded-xl text-[13px] transition"
                     :class="isActive(item) ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-500 font-bold' : 'text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-white font-semibold'">
            <svg v-if="item.icon === 'user'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <svg v-else-if="item.icon === 'orders'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6"/></svg>
            <svg v-else-if="item.icon === 'payments'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M2 12h20"/></svg>
            <svg v-else-if="item.icon === 'operations'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15A9 9 0 1116.27 5.27L23 10"/></svg>
            <svg v-else-if="item.icon === 'bonus'" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
            <svg v-else-if="item.icon === 'bell'" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
            <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            {{ item.label }}
            <span v-if="item.icon === 'bell' && notifications_count > 0" class="ml-auto w-2 h-2 rounded-full bg-rose-500"></span>
          </nuxt-link>
          <div class="my-2 h-px bg-ink-100 dark:bg-ink-800"></div>
          <button type="button" @click.prevent="logout" class="w-full flex items-center gap-2.5 px-3 h-10 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-[13px] font-semibold transition">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Hesabdan çıx
          </button>
        </nav>
      </aside>

      <!-- RIGHT — Main content -->
      <div class="min-w-0">
        <nuxt-page/>
      </div>
    </div>

  </main>
</template>

<style scoped>
</style>
