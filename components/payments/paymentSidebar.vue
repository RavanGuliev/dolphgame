<script setup lang="ts">
import { computed } from "vue";
import { authStore } from "#imports";

const route = useRoute();
const router = useRouter();
const { user } = authStore();

const paymentMethods = [
  { id: "online", path: "/payments/online", image: "/img/payments/bank-karti.png", name: "Bank kartı", commission: "3%", commissionType: "paid", requiresNormal: true },
  { id: "birbank", path: "/payments/birbank", image: "/img/payments/birbank-logo.png", name: "Birbank QR", commission: "1,5%", commissionType: "free", requiresNormal: true },
  { id: "receipt", path: "/payments", image: "/img/payments/qebz.png", name: "Qəbz", commission: "0%", commissionType: "free", requiresNormal: false, time: "11:00 — 00:00" },
  { id: "m10", path: "/payments/m10", image: "/img/payments/m10-logo.png", name: "M10 QR", commission: "1,5%", commissionType: "paid", requiresNormal: true },
  { id: "million", path: "/payments/million", image: "/img/payments/million-logo-new.png", name: "MilliÖN Terminal", commission: "3%", commissionType: "paid", requiresNormal: false },
  { id: "emanat", path: "/payments/emanat", image: "/img/payments/emanat-logo-new.png", name: "eManat Terminal", commission: "3%", commissionType: "paid", requiresNormal: false },
  { id: "expresspay", path: "/payments/expresspay", image: "/img/payments/expresspay-logo-new.png", name: "Expresspay Terminal", commission: "3%", commissionType: "paid", requiresNormal: false },
];

const isActive = (path: string) => route.path === path;
const visibleMethods = computed(() =>
  paymentMethods.filter((m) => !m.requiresNormal || (user as any)?.level === "normal")
);

const handleTabClick = async (path: string) => {
  await router.push(path);
  if (typeof window !== "undefined" && window.innerWidth <= 1024) {
    setTimeout(() => {
      document.querySelector("[data-pay-content]")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
  }
};
</script>

<template>
  <aside class="self-start space-y-2">
    <div class="hidden lg:flex items-center gap-2 mb-1 px-1">
      <span class="w-1 h-5 bg-brand-500 rounded-full"></span>
      <h3 class="text-[11px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">Ödəniş üsulu</h3>
    </div>

    <div class="flex flex-col gap-2">
      <button
        v-for="m in visibleMethods"
        :key="m.id"
        @click="handleTabClick(m.path)"
        type="button"
        class="w-full group text-left flex items-center gap-3 p-3 rounded-xl border transition"
        :class="isActive(m.path)
          ? 'bg-brand-500 border-brand-500 text-white shadow-pop'
          : 'bg-white dark:bg-ink-800 border-ink-200 dark:border-ink-700 hover:border-brand-500 hover:-translate-y-0.5'"
      >
        <span class="w-10 h-10 rounded-lg grid place-items-center shrink-0 overflow-hidden transition group-hover:scale-110" :class="isActive(m.path) ? 'bg-white/20' : 'bg-ink-50 dark:bg-ink-700'">
          <img :src="m.image" :alt="m.name" class="w-7 h-7 object-contain" />
        </span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-sm font-semibold truncate" :class="isActive(m.path) ? 'text-white' : 'text-ink-900 dark:text-white'">{{ m.name }}</span>
            <span v-if="m.time" class="text-[10px] font-bold" :class="isActive(m.path) ? 'text-white/85' : 'text-ink-500 dark:text-ink-400'">{{ m.time }}</span>
          </div>
          <div class="text-[11px] font-semibold mt-0.5" :class="isActive(m.path) ? 'text-white/85' : (m.commissionType === 'free' ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink-400')">{{ m.commission }} komissiya</div>
        </div>
        <svg class="w-4 h-4 shrink-0 lg:hidden" :class="isActive(m.path) ? 'text-white/85' : 'text-ink-300 dark:text-ink-600'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>
      </button>
    </div>
  </aside>
</template>
